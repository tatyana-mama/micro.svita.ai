/*
 * SVITA analytics loader — single file, fires only when IDs are set.
 *
 * Fill the IDs below and each service activates automatically.
 * Leave blank to disable that particular service.
 *
 *   GA4         · G-XXXXXXXXXX       — Google Analytics 4
 *   YANDEX      · XXXXXXXX (digits)  — Yandex.Metrica counter ID
 *   CLARITY     · xxxxxxxxxx         — Microsoft Clarity (session replay + heatmaps, free)
 *   PLAUSIBLE   · micro.svita.ai     — Plausible (privacy-friendly, paid)
 *
 * Respect Do-Not-Track: `navigator.doNotTrack === '1'` blocks everything.
 */
(function(){
  'use strict';
  if (navigator.doNotTrack === '1') return;

  var CFG = {
    GA4:       '',   // e.g. 'G-ABC123XYZ0'
    YANDEX:    '',   // e.g. '99887766'
    CLARITY:   '',   // e.g. 'abcdefghij'
    PLAUSIBLE: ''    // e.g. 'micro.svita.ai'
  };

  function load(src, attrs){
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    if (attrs) Object.keys(attrs).forEach(function(k){ s.setAttribute(k, attrs[k]); });
    document.head.appendChild(s);
    return s;
  }

  // Google Analytics 4
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

  // expose a tiny track() shim — calls through to whichever backend is active
  window.svitaTrack = function(event, params){
    params = params || {};
    if (CFG.GA4 && window.gtag) gtag('event', event, params);
    if (CFG.YANDEX && window.ym) ym(parseInt(CFG.YANDEX,10), 'reachGoal', event, params);
    if (CFG.PLAUSIBLE && window.plausible) window.plausible(event, { props: params });
  };
})();
