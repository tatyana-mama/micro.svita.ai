/* SVITA MICRO — mobile app shell.
   The bottom tab bar was removed 2026-05-15. Mobile navigation now lives in
   the header itself (shared nav js/svita-nav.js on internal pages, the React
   burger drawer on the landing). This file only keeps the PWA registration. */
(function(){
  // Register PWA service worker. Silent failure is fine — site still works.
  if('serviceWorker' in navigator && location.protocol === 'https:'){
    window.addEventListener('load', ()=>{
      navigator.serviceWorker.register('/sw.js').catch(()=>{});
    });
  }
})();
