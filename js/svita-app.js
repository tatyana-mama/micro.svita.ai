/* SVITA MICRO — mobile app shell.
   The bottom tab bar was removed 2026-05-15 — all mobile navigation now lives
   in the burger drawer (shared nav, js/svita-nav.js). This file only keeps the
   PWA service-worker registration. */
(function(){
  // Register PWA service worker. Silent failure is fine — site still works.
  if('serviceWorker' in navigator && location.protocol === 'https:'){
    window.addEventListener('load', ()=>{
      navigator.serviceWorker.register('/sw.js').catch(()=>{});
    });
  }
})();
