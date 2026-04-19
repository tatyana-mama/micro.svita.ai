/*
 * SVITA Consent Mode v2 banner — GDPR / Google Consent Mode.
 *
 * How it works:
 *  1. Each page's <head> sets gtag('consent','default', { ...'denied' }) BEFORE GTM loads.
 *  2. This file renders a tiny bottom-strip banner on first visit.
 *  3. On "Accept" → gtag('consent','update', {...granted}) + localStorage flag.
 *  4. On "Reject" → leaves defaults (denied) + localStorage flag so the banner doesn't reappear.
 *  5. "Manage" re-opens the banner any time (call `window.svitaConsentOpen()`).
 *
 * Storage key: `svita:consent:v2` — values: "granted" | "denied".
 */
(function(){
  'use strict';
  if (typeof window === 'undefined') return;

  var KEY = 'svita:consent:v2';
  var prev = null;
  try { prev = localStorage.getItem(KEY); } catch(_){}

  function gtag(){ window.dataLayer = window.dataLayer || []; window.dataLayer.push(arguments); }

  function applyConsent(state){
    var granted = state === 'granted';
    gtag('consent', 'update', {
      ad_storage:            granted ? 'granted' : 'denied',
      ad_user_data:          granted ? 'granted' : 'denied',
      ad_personalization:    granted ? 'granted' : 'denied',
      analytics_storage:     granted ? 'granted' : 'denied'
    });
    try { localStorage.setItem(KEY, state); } catch(_){}
  }

  // If user already chose, re-apply choice every page load (consent-update is cheap).
  if (prev === 'granted' || prev === 'denied') applyConsent(prev);

  function renderBanner(){
    if (document.getElementById('svita-consent')) return;

    var css = document.createElement('style');
    css.textContent = [
      '#svita-consent{position:fixed;inset:auto 0 0 0;z-index:2147483647;background:#0f172a;color:#e2e8f0;',
      'border-top:1px solid #1e293b;padding:14px 16px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;',
      'justify-content:center;font:400 13px/1.45 -apple-system,BlinkMacSystemFont,Inter,sans-serif;',
      'box-shadow:0 -10px 40px rgba(0,0,0,0.35);animation:svitaConSlide 280ms ease-out}',
      '#svita-consent p{margin:0;flex:1 1 420px;max-width:760px;color:#cbd5e1}',
      '#svita-consent a{color:#D6FF3E;text-decoration:underline;text-underline-offset:3px}',
      '#svita-consent .btns{display:flex;gap:8px;flex:0 0 auto}',
      '#svita-consent button{border:1px solid #334155;background:#1e293b;color:#e2e8f0;',
      'padding:9px 16px;border-radius:8px;font:600 12.5px Inter,sans-serif;cursor:pointer;',
      'transition:background 140ms,border-color 140ms}',
      '#svita-consent button:hover{background:#334155;border-color:#475569}',
      '#svita-consent button.primary{background:#D6FF3E;color:#0A0A0B;border-color:#D6FF3E}',
      '#svita-consent button.primary:hover{background:#c7ee30;border-color:#c7ee30}',
      '@keyframes svitaConSlide{from{transform:translateY(100%)}to{transform:translateY(0)}}',
      '@media (max-width:640px){#svita-consent{flex-direction:column;align-items:stretch;padding:14px}',
      '#svita-consent p{flex-basis:auto}#svita-consent .btns{justify-content:flex-end}}'
    ].join('');
    document.head.appendChild(css);

    var bar = document.createElement('div');
    bar.id = 'svita-consent';
    bar.setAttribute('role','dialog');
    bar.setAttribute('aria-label','Cookie consent');
    bar.innerHTML =
      '<p>We use anonymous analytics to improve the marketplace. Accept to also allow ads & remarketing ' +
      'cookies, or reject to keep only analytics. <a href="legal.html#privacy" target="_blank" rel="noopener">Privacy</a>.</p>' +
      '<div class="btns">' +
        '<button type="button" class="reject">Reject ads</button>' +
        '<button type="button" class="primary accept">Accept all</button>' +
      '</div>';
    document.body.appendChild(bar);

    bar.querySelector('.accept').addEventListener('click', function(){ applyConsent('granted'); bar.remove(); });
    bar.querySelector('.reject').addEventListener('click', function(){ applyConsent('denied');  bar.remove(); });
  }

  // Show banner if no choice yet.
  function boot(){ if (prev !== 'granted' && prev !== 'denied') renderBanner(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  // Public API to re-open the banner (e.g., footer "Manage cookies" link).
  window.svitaConsentOpen = function(){
    var el = document.getElementById('svita-consent'); if (el) el.remove();
    try { localStorage.removeItem(KEY); } catch(_){}
    renderBanner();
  };
})();
