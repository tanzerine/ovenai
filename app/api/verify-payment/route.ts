// [app/api/verify-payment/route.ts]
import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.redirect(new URL('/billing?error=unauthorized', req.url));
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');
    const points = parseInt(searchParams.get('points') || '0');

    if (!sessionId || !points) {
      return NextResponse.redirect(new URL('/billing?error=invalid-parameters', req.url));
    }

    // Verify the payment session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Multiple validation checks
    if (session.payment_status !== 'paid') {
      return NextResponse.redirect(new URL('/billing?error=payment-not-completed', req.url));
    }

    if (session.client_reference_id !== userId) {
      return NextResponse.redirect(new URL('/billing?error=user-mismatch', req.url));
    }

    // Check for existing transaction
    const { data: existingTransaction } = await supabase
      .from('payment_transactions')
      .select('status')
      .eq('session_id', sessionId)
      .single();

    if (existingTransaction?.status === 'completed') {
      // Transaction already processed, redirect to success
      return NextResponse.redirect(new URL('/main?success=true', req.url));
    }

    // Update points with session ID for idempotency
    try {
      await updateUserPoints(userId, points, sessionId);
      return NextResponse.redirect(new URL('/main?success=true', req.url));
    } catch (error) {
      console.error('Error updating points:', error);
      if (error instanceof Error && error.message === 'Transaction already processed') {
        return NextResponse.redirect(new URL('/main?success=true', req.url));
      }
      return NextResponse.redirect(new URL('/billing?error=points-update-failed', req.url));
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.redirect(new URL('/billing?error=verification-failed', req.url));
  }
}
