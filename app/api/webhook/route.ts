// [app/api/stripe-webhook/route.ts] (moved from webhook to stripe-webhook)
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

export async function POST(req: Request) {
  console.log('Stripe webhook endpoint hit!');

  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature');
    
    if (!signature) {
      console.error('No stripe signature found');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

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

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      if (session.payment_status === 'paid') {
        const userId = session.metadata?.userId || session.client_reference_id;
        const points = parseInt(session.metadata?.points || '0');

        if (userId && points) {
          try {
            const { data: currentData, error: fetchError } = await supabase
              .from('user_points')
              .select('points')
              .eq('user_id', userId)
              .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
              throw fetchError;
            }

            const currentPoints = currentData?.points ?? 0;
            const newPoints = currentPoints + points;

            const { error: updateError } = await supabase
              .from('user_points')
              .upsert({ user_id: userId, points: newPoints });

            if (updateError) {
              throw updateError;
            }

            return NextResponse.json({ success: true }, { status: 200 });
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
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

export const runtime = 'nodejs'
