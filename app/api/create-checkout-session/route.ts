// [app/api/create-checkout-session/route.ts]
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from "@clerk/nextjs/server";
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type RequestBody = {
  points: number;
  amount: number;
};

// Create a transaction record before processing
async function createTransaction(userId: string, sessionId: string, points: number, amount: number) {
  const { error } = await supabase
    .from('payment_transactions')
    .insert({
      user_id: userId,
      session_id: sessionId,
      points: points,
      amount: amount,
      status: 'pending'
    })

  if (error) {
    console.error("Error creating transaction:", error)
    throw error
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: RequestBody = await req.json();
    const { points, amount } = body;

    if (!points || !amount || points <= 0 || amount <= 0) {
      return NextResponse.json({ error: 'Invalid points or amount' }, { status: 400 });
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${points} Points`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/api/verify-payment?session_id={CHECKOUT_SESSION_ID}&points=${points}`,
      cancel_url: `${req.headers.get('origin')}/billing?cancelled=true`,
      client_reference_id: userId,
    });

    // Create pending transaction record
    await createTransaction(userId, session.id, points, amount);

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json({ 
      error: 'Error creating checkout session',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}
