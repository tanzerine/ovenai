// [app/api/stripe-webhook/route.ts]
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
  console.log('Webhook received');

  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature');

    console.log('Signature:', signature?.slice(0, 10));

    if (!signature) {
      console.error('No Stripe signature found');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
      console.log('Event constructed:', event.type);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      if (session.payment_status === 'paid') {
        const userId = session.metadata?.userId;
        const points = parseInt(session.metadata?.points || '0');

        console.log('Processing payment:', { userId, points });

        if (userId && points) {
          try {
            // Get current points
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

            // Update points
            const { error: updateError } = await supabase
              .from('user_points')
              .upsert({ 
                user_id: userId, 
                points: newPoints,
                updated_at: new Date().toISOString()
              });

            if (updateError) {
              throw updateError;
            }

            console.log('Points updated successfully:', { userId, newPoints });
            return NextResponse.json({ success: true });
          } catch (error) {
            console.error('Error updating points:', error);
            return NextResponse.json(
              { error: 'Error updating points' }, 
              { status: 500 }
            );
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' }, 
      { status: 500 }
    );
  }
}

// Disable body parser for webhook
export const config = {
  api: {
    bodyParser: false,
  },
};
