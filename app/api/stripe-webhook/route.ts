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

// New Next.js 13+ route segment configuration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  console.log('Stripe webhook endpoint hit!');

  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature');
    
    // Enhanced logging for debugging
    console.log('Request headers:', Object.fromEntries(headers().entries()));
    console.log('Body preview:', body.slice(0, 100));
    
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
      console.log('Event type received:', event.type);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Session data:', {
        paymentStatus: session.payment_status,
        metadata: session.metadata,
        clientReferenceId: session.client_reference_id
      });
      
      if (session.payment_status === 'paid') {
        const userId = session.metadata?.userId || session.client_reference_id;
        const points = parseInt(session.metadata?.points || '0');

        console.log('Processing payment for:', { userId, points });

        if (userId && points) {
          try {
            const { data: currentData, error: fetchError } = await supabase
              .from('user_points')
              .select('points')
              .eq('user_id', userId)
              .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
              console.error('Error fetching current points:', fetchError);
              throw fetchError;
            }

            const currentPoints = currentData?.points ?? 0;
            const newPoints = currentPoints + points;

            console.log('Points calculation:', {
              currentPoints,
              pointsToAdd: points,
              newTotal: newPoints
            });

            const { error: updateError } = await supabase
              .from('user_points')
              .upsert({ 
                user_id: userId, 
                points: newPoints,
                updated_at: new Date().toISOString()
              });

            if (updateError) {
              console.error('Error updating points:', updateError);
              throw updateError;
            }

            console.log('Points updated successfully:', { userId, newPoints });
            return NextResponse.json({ 
              success: true,
              userId,
              pointsAdded: points,
              newTotal: newPoints
            }, { status: 200 });
          } catch (error) {
            console.error('Error updating user points:', error);
            return NextResponse.json({ 
              error: 'Error updating user points',
              details: error instanceof Error ? error.message : 'Unknown error'
            }, { status: 500 });
          }
        } else {
          console.error('Missing required data:', { userId, points });
          return NextResponse.json({ 
            error: 'Missing userId or points',
            received: { userId, points }
          }, { status: 400 });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ 
      error: 'Webhook handler failed',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}