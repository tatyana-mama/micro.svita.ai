// Lemon Squeezy webhook handler — receives order_created / subscription_created
// and inserts a row into public.purchases so the buyer immediately sees the
// concept as "Owned" on account.html.
//
// Required secrets (Supabase project):
//   LEMONSQUEEZY_SIGNING_SECRET — from the webhook settings page in LS dashboard
//   SUPABASE_URL               — auto-injected
//   SUPABASE_SERVICE_ROLE_KEY  — auto-injected
//
// Client flow: account.html redirects to concept.ls_url with
//   ?checkout[custom][ref]=<uid>:<slug>
// LS posts order_created here, we parse the ref and write the purchase.
//
// Deploy:
//   supabase functions deploy lemon-webhook --project-ref ctdleobjnzniqkqomlrq --no-verify-jwt
//   supabase secrets set LEMONSQUEEZY_SIGNING_SECRET=<secret> --project-ref ctdleobjnzniqkqomlrq
// Register webhook URL in Lemon Squeezy dashboard:
//   https://ctdleobjnzniqkqomlrq.supabase.co/functions/v1/lemon-webhook
// Subscribe to: order_created

import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const SIGNING_SECRET = Deno.env.get('LEMONSQUEEZY_SIGNING_SECRET') ?? '';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'SVITA <hello@micro.svita.ai>';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false } },
);

async function sendWelcomeEmail(params: {
  to: string;
  conceptName: string;
  conceptSlug: string;
  tier: 'basic' | 'ai' | 'exclusive';
}): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn('lemon-webhook: RESEND_API_KEY missing — skipping welcome email', params);
    return;
  }
  const { to, conceptName, conceptSlug, tier } = params;
  const viewUrl = `https://micro.svita.ai/view.html?c=${encodeURIComponent(conceptSlug)}`;
  const accountUrl = 'https://micro.svita.ai/account.html';
  const pdfUrl = 'https://micro.svita.ai/data/bonuses/day1-checklist.pdf';

  const tierLabel = tier === 'exclusive' ? 'Exclusive' : tier === 'ai' ? 'AI-tuned' : 'Basic';
  const aiLine = (tier === 'ai' || tier === 'exclusive')
    ? `<p style="margin:12px 0;color:#475569">Your <b>AI consultant</b> for this concept is live inside the concept page — knows only this brandbook, answers only from it.</p>`
    : '';
  const excLine = tier === 'exclusive'
    ? `<p style="margin:12px 0;color:#475569"><b>Exclusive ownership:</b> this concept has been archived. You are the sole owner.</p>`
    : '';

  const subject = `Your concept «${conceptName}» — welcome ✦`;
  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a">
      <div style="font-size:12px;letter-spacing:1px;color:#64748b;text-transform:uppercase">SVITA · micro.svita.ai</div>
      <h1 style="font-size:24px;margin:8px 0 16px;line-height:1.3">You now own <span style="color:#0f172a">«${conceptName}»</span>.</h1>
      <p style="margin:12px 0;color:#475569">Plan: <b>${tierLabel}</b>. The full brandbook, floorplan, equipment list, P&amp;L and week-by-week timeline are unlocked for you.</p>
      ${aiLine}
      ${excLine}
      <p style="margin:24px 0">
        <a href="${viewUrl}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:700">Open your concept →</a>
      </p>
      <div style="margin-top:28px;padding:16px 18px;border:1px solid #e2e8f0;border-radius:12px;background:#f7fee7">
        <div style="font-weight:700;margin-bottom:6px">✓ Your bonus · Day-1 opening checklist</div>
        <div style="color:#475569;font-size:14px;margin-bottom:12px">Printable PDF · 48 pre-launch tasks · use it the week before opening.</div>
        <a href="${pdfUrl}" style="color:#0f172a;font-weight:700;text-decoration:underline">Download PDF →</a>
      </div>
      <p style="margin-top:32px;color:#94a3b8;font-size:12px">Everything you own lives here: <a href="${accountUrl}" style="color:#64748b">${accountUrl}</a></p>
      <p style="margin-top:4px;color:#94a3b8;font-size:12px">Questions: ceo@labs67.com</p>
    </div>`.trim();

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });
    if (!r.ok) {
      const text = await r.text();
      console.error('lemon-webhook: resend error', r.status, text);
    } else {
      console.log('lemon-webhook: welcome email sent', { to, conceptSlug, tier });
    }
  } catch (e) {
    console.error('lemon-webhook: resend threw', e);
  }
}

async function verifySignature(rawBody: string, signature: string): Promise<boolean> {
  if (!SIGNING_SECRET || !signature) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SIGNING_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sigBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
  const hex = Array.from(new Uint8Array(sigBytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  // Constant-time compare
  if (hex.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('method not allowed', { status: 405 });
  }

  const signature = req.headers.get('x-signature') ?? '';
  const rawBody = await req.text();

  const ok = await verifySignature(rawBody, signature);
  if (!ok) {
    console.error('lemon-webhook: bad signature');
    return new Response('bad signature', { status: 401 });
  }

  let payload: {
    meta?: { event_name?: string; custom_data?: Record<string, unknown> };
    data?: {
      id?: string;
      attributes?: {
        user_email?: string;
        total?: number;
        currency?: string;
        first_order_item?: { variant_id?: number; product_id?: number };
      };
    };
  };
  try {
    payload = JSON.parse(rawBody);
  } catch (err) {
    return new Response('bad json', { status: 400 });
  }

  const eventName = payload.meta?.event_name ?? '';
  if (eventName !== 'order_created') {
    return new Response('ignored', { status: 200 });
  }

  // LS passes custom data via checkout[custom][<key>] — surfaces in meta.custom_data
  // Prefer explicit concept_slug + user_id (new). Fall back to legacy ref "<uid>:<slug>".
  const customData = payload.meta?.custom_data ?? {};
  const explicitSlug = String(customData.concept_slug ?? '');
  const explicitUser = String(customData.user_id ?? '');
  const ref = String(customData.ref ?? '');
  // Ref format: "<uid>:<slug>" (legacy) or "<uid>:<slug>:<tier>" (new).
  const [refUser, refSlug, refTier] = ref.split(':');
  const slug = explicitSlug || refSlug;
  const userId = explicitUser || refUser;
  const tier = String(customData.tier ?? refTier ?? 'basic').toLowerCase();

  if (!userId || !slug) {
    console.warn('lemon-webhook: missing slug/user', { customData, eventName });
    return new Response('ok', { status: 200 });
  }

  const pricePaid = Math.round((payload.data?.attributes?.total ?? 0) / 100);
  const currency = (payload.data?.attributes?.currency ?? 'EUR').toUpperCase();
  const providerRef = String(payload.data?.id ?? '');

  const normalizedTier = (tier === 'ai' || tier === 'exclusive') ? tier : 'basic';

  const { error } = await supabase.from('purchases').upsert(
    {
      user_id: userId,
      concept_slug: slug,
      price_paid: pricePaid,
      currency,
      provider: 'lemon_squeezy',
      provider_ref: providerRef,
      status: 'paid',
      access_state: 'purchased',
      tier: normalizedTier,
    },
    { onConflict: 'user_id,concept_slug' },
  );

  if (error) {
    console.error('lemon-webhook: upsert failed', error);
    return new Response(`db error: ${error.message}`, { status: 500 });
  }

  // Exclusive buyout: atomically archive the concept and record the sole owner.
  // If two buyers race, only the first UPDATE wins (ok=true); the second one
  // succeeded at payment but we'll need to refund them out-of-band.
  const buyerEmail = String(payload.data?.attributes?.user_email ?? '').trim();
  if (buyerEmail) {
    const { data: concept } = await supabase
      .from('concepts_catalog')
      .select('name')
      .eq('slug', slug)
      .maybeSingle();
    const conceptName = concept?.name || slug;
    sendWelcomeEmail({
      to: buyerEmail,
      conceptName,
      conceptSlug: slug,
      tier: normalizedTier as 'basic' | 'ai' | 'exclusive',
    }).catch((e) => console.error('sendWelcomeEmail rejected', e));
  } else {
    console.warn('lemon-webhook: no buyer email in payload, skipping welcome mail');
  }

  if (tier === 'exclusive') {
    const { data: claim, error: claimErr } = await supabase.rpc('claim_exclusive', {
      p_slug: slug,
      p_owner: userId,
    });
    if (claimErr) {
      console.error('lemon-webhook: claim_exclusive failed', claimErr, { slug, userId });
    } else if (claim && claim.ok === false) {
      console.warn('lemon-webhook: exclusive already claimed', { slug, userId, providerRef });
    } else {
      console.log('lemon-webhook: exclusive claimed', { slug, userId });
    }
  }

  return new Response('ok', { status: 200 });
});
