// [app/api/verify-payment/route.ts]
import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function addPoints(userId: string, pointsToAdd: number, sessionId: string) {
  // Check if this session has already been processed
  const { data: existingTransaction } = await supabase
    .from('payment_transactions')
    .select('status')
    .eq('session_id', sessionId)
    .eq('status', 'completed')
    .single()

  if (existingTransaction) {
    throw new Error('Transaction already processed')
  }

  // Get current points
  const { data: currentPointsData, error: fetchError } = await supabase
    .from('user_points')
    .select('points')
    .eq('user_id', userId)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
    throw fetchError
  }

  const currentPoints = currentPointsData?.points ?? 0
  const newPoints = currentPoints + pointsToAdd

  // Update points and mark transaction as completed in a transaction
  const { error: updateError } = await supabase.rpc('update_points_and_transaction', {
    p_user_id: userId,
    p_points: newPoints,
    p_session_id: sessionId
  })

  if (updateError) {
    console.error("Error in points update transaction:", updateError)
    throw updateError
  }

  return newPoints
}

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

    // Update points with session ID for idempotency
    try {
      await addPoints(userId, points, sessionId);
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
