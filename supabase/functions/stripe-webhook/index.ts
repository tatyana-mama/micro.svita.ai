// Stripe webhook handler — receives checkout.session.completed and
// inserts a row into public.purchases so the buyer immediately sees
// the concept as "Owned" on account.html.
//
// Required secrets (Supabase project):
//   STRIPE_SECRET_KEY       — sk_live_... or sk_test_...
//   STRIPE_WEBHOOK_SECRET   — whsec_... (from the webhook endpoint page)
//   SUPABASE_URL            — auto-injected
//   SUPABASE_SERVICE_ROLE_KEY — auto-injected
//
// Client flow: account.html redirects to concept.ls_url with
//   ?client_reference_id=<uid>:<slug>&prefilled_email=<email>
// Stripe sends checkout.session.completed here, we parse the ref and
// write the purchase.

import Stripe from 'npm:stripe@14.21.0';
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false } }
);

const WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('method not allowed', { status: 405 });
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) return new Response('missing signature', { status: 400 });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error('signature verification failed', err);
    return new Response(`bad signature: ${(err as Error).message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const ref = session.client_reference_id ?? '';
    const [userId, slug] = ref.split(':');

    if (!userId || !slug) {
      console.warn('missing client_reference_id parts', { ref, id: session.id });
      return new Response('ok', { status: 200 });
    }

    const pricePaid = Math.round((session.amount_total ?? 0) / 100);
    const currency = (session.currency ?? 'eur').toUpperCase();

    const { error } = await supabase.from('purchases').upsert({
      user_id: userId,
      concept_slug: slug,
      price_paid: pricePaid,
      currency,
      provider: 'stripe',
      provider_ref: session.id,
      status: 'paid',
    }, { onConflict: 'user_id,concept_slug' });

    if (error) {
      console.error('insert purchase failed', error);
      return new Response(`db error: ${error.message}`, { status: 500 });
    }
  }

  return new Response('ok', { status: 200 });
});
