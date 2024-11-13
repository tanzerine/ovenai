// [app/api/create-checkout-session/route.ts]
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

type RequestBody = {
  points: number;
  amount: number;
};

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

    // Store the points to be added in the metadata
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
  metadata: {
    points: points.toString(),
    userId: userId,
  },
});

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 });
  }
}