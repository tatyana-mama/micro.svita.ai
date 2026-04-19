/*
 * SVITA analytics loader — single file, fires only when IDs are set.
 *
 *   GTM        · GTM-XXXXXXX        — Google Tag Manager (routes GA4/Ads/etc.)
 *   GA4        · G-XXXXXXXXXX       — Google Analytics 4 (direct, only if no GTM)
 *   YANDEX     · XXXXXXXX (digits)  — Yandex.Metrica counter ID
 *   CLARITY    · xxxxxxxxxx         — Microsoft Clarity (session replay + heatmaps, free)
 *   PLAUSIBLE  · micro.svita.ai     — Plausible (privacy-friendly, paid)
 *
 * Respect Do-Not-Track: `navigator.doNotTrack === '1'` blocks everything.
 */
(function(){
  'use strict';
  if (navigator.doNotTrack === '1') return;

  // GTM is loaded INLINE in each page's <head> (so Tag Assistant + Consent tools detect it).
  // GA4 Measurement ID is ALSO fired directly below — data starts flowing immediately without
  // waiting for a GA4 Config tag to be published inside GTM.
  // If you later add a GA4 Config tag inside GTM with the same Measurement ID and publish,
  // set CFG.GA4 to '' below to avoid double-counting hits in GA4.
  var CFG = {
    GTM:       '',                 // inline snippet already loads GTM-T2974BPD
    GA4:       '',                 // GA4 Config tag publishes G-BX01J95VVG via GTM — keep empty to avoid double-hit
    YANDEX:    '',
    CLARITY:   '',
    PLAUSIBLE: ''
  };

  function load(src, attrs){
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    if (attrs) Object.keys(attrs).forEach(function(k){ s.setAttribute(k, attrs[k]); });
    document.head.appendChild(s);
    return s;
  }

  // Google Tag Manager (head snippet)
  if (CFG.GTM) {
    (function(w,d,s,l,i){
      w[l]=w[l]||[];
      w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
      var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),
          dl = l !== 'dataLayer' ? '&l='+l : '';
      j.async=true;
      j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);
    })(window, document, 'script', 'dataLayer', CFG.GTM);

    // GTM noscript fallback (inserted into <body>)
    (function(){
      function insertNoscript(){
        if (!document.body) return;
        if (document.getElementById('gtm-noscript')) return;
        var ns = document.createElement('noscript');
        ns.id = 'gtm-noscript';
        ns.innerHTML = '<iframe src="https://www.googletagmanager.com/ns.html?id=' + CFG.GTM
          + '" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
        document.body.insertBefore(ns, document.body.firstChild);
      }
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertNoscript);
      } else {
        insertNoscript();
      }
    })();
  }

  // Direct GA4 — fires independently of GTM so data starts flowing immediately.
  // If later you add a GA4 Config tag inside GTM pointing to the SAME ID,
  // clear CFG.GA4 above to avoid double-counting.
  if (CFG.GA4) {
    load('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(CFG.GA4));
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', CFG.GA4, { anonymize_ip: true });
  }

  // Yandex.Metrica
  if (CFG.YANDEX) {
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    window.ym(parseInt(CFG.YANDEX,10), 'init', { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });
  }

  // Microsoft Clarity
  if (CFG.CLARITY) {
    (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})
    (window, document, 'clarity', 'script', CFG.CLARITY);
  }

  // Plausible
  if (CFG.PLAUSIBLE) {
    load('https://plausible.io/js/script.js', { 'data-domain': CFG.PLAUSIBLE });
  }

  // Unified event shim — pushes to dataLayer (GTM/GA4 pick up), Yandex goals, Plausible events
  window.svitaTrack = function(event, params){
    params = params || {};
    if (CFG.GTM || CFG.GA4) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: event }, params));
    }
    if (CFG.YANDEX && window.ym) ym(parseInt(CFG.YANDEX,10), 'reachGoal', event, params);
    if (CFG.PLAUSIBLE && window.plausible) window.plausible(event, { props: params });
  };
})();
