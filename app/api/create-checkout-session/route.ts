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

async function updateUserPoints(userId: string, pointsToAdd: number) {
  const { data, error: fetchError } = await supabase
    .from('user_points')
    .select('points')
    .eq('user_id', userId)
    .single()

  if (fetchError) {
    console.error("Error fetching user points:", fetchError)
    throw fetchError
  }

  const currentPoints = data?.points ?? 0
  const newPoints = currentPoints + pointsToAdd

  const { error: updateError } = await supabase
    .from('user_points')
    .upsert({ user_id: userId, points: newPoints })

  if (updateError) {
    console.error("Error updating user points:", updateError)
    throw updateError
  }

  return newPoints
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: RequestBody = await req.json();
    const { points, amount } = body;

    if (typeof points !== 'number' || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

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
      success_url: `${req.headers.get('origin')}/main?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/billing`,
      client_reference_id: userId,
    });

    // Update user points immediately after creating the session
    try {
      await updateUserPoints(userId, points);
    } catch (error) {
      console.error('Error updating user points:', error);
      // You might want to handle this error more gracefully
    }

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 });
  }
}