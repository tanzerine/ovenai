// [app/api/webhook/route.ts]
import { headers } from 'next/headers'
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

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
    const body = await req.text();
    const signature = headers().get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Only proceed if payment status is paid
      if (session.payment_status === 'paid') {
        const userId = session.metadata?.userId;
        const points = parseInt(session.metadata?.points || '0');

        if (userId && points) {
          try {
            await updateUserPoints(userId, points);
            console.log(`Successfully added ${points} points to user ${userId}`);
          } catch (error) {
            console.error('Error updating user points:', error);
            return NextResponse.json({ error: 'Error updating user points' }, { status: 500 });
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
  }
}

// Set the appropriate runtime for the webhook route
export const runtime = 'nodejs'
