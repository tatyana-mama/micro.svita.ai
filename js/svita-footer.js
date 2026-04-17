/* Shared legal footer — appended once per page. English-only. */
(function () {
  'use strict';
  if (document.getElementById('svita-legal-footer')) return;
  const f = document.createElement('footer');
  f.id = 'svita-legal-footer';
  f.style.cssText = [
    'margin-top:80px',
    'padding:32px 24px 40px',
    'border-top:1px solid rgba(0,0,0,0.08)',
    'background:transparent',
    "font:12px/1.6 -apple-system,BlinkMacSystemFont,Inter,system-ui,sans-serif",
    'color:#94A3B8',
    'text-align:center'
  ].join(';');
  f.innerHTML = [
    '<div style="max-width:960px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:center;gap:18px 22px;align-items:center">',
    '<a href="/legal.html#offer" style="color:inherit;text-decoration:none;border-bottom:1px dotted currentColor">Offer</a>',
    '<a href="/legal.html#terms" style="color:inherit;text-decoration:none;border-bottom:1px dotted currentColor">Terms</a>',
    '<a href="/legal.html#privacy" style="color:inherit;text-decoration:none;border-bottom:1px dotted currentColor">Privacy</a>',
    '<a href="/legal.html#refund" style="color:inherit;text-decoration:none;border-bottom:1px dotted currentColor">Refund</a>',
    '<a href="/legal.html#license" style="color:inherit;text-decoration:none;border-bottom:1px dotted currentColor">License</a>',
    '<a href="/legal.html#imprint" style="color:inherit;text-decoration:none;border-bottom:1px dotted currentColor">Imprint</a>',
    '<a href="mailto:ceo@labs67.com" style="color:inherit;text-decoration:none;border-bottom:1px dotted currentColor">ceo@labs67.com</a>',
    '</div>',
    '<div style="margin-top:14px;font-size:11px;letter-spacing:.06em;color:#CBD5E1">© 2026 SVITA MICRO · LABS67, Bydgoszcz, Poland</div>'
  ].join('');
  document.body.appendChild(f);
})();
