/* SVITA MICRO — third-party analytics loader.
   Loads Yandex Metrika and Google Analytics / Google Ads (gtag) asynchronously.
   Counter IDs are read from window.SVITA_METRICS (set inline BEFORE this script),
   so each page can override them, or they can stay empty (loader is a no-op).

   Usage:
     <script>window.SVITA_METRICS = { ym: 12345678, ga: 'G-XXXXXXX', aw: 'AW-XXXXXXX' };</script>
     <script src="js/svita-3p-analytics.js"></script>

   All three keys are optional. If any is falsy, its block is skipped.
   Safe to load on every page. */
(function(){
  const cfg = window.SVITA_METRICS || {};

  // ─── Yandex Metrika ────────────────────────────────────────────────
  if(cfg.ym){
    try{
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
      ym(cfg.ym, "init", {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
        ecommerce: "dataLayer"
      });
      window.__svitaYm = cfg.ym;
    }catch(e){ console.warn('[ym] init failed', e); }
  }

  // ─── Google gtag (GA4 + Ads) ───────────────────────────────────────
  if(cfg.ga || cfg.aw){
    try{
      const tag = cfg.ga || cfg.aw;
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(tag);
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      window.gtag = gtag;
      gtag('js', new Date());
      if(cfg.ga) gtag('config', cfg.ga, { anonymize_ip: true });
      if(cfg.aw) gtag('config', cfg.aw);
    }catch(e){ console.warn('[gtag] init failed', e); }
  }

  // ─── Bridge: emit funnel events to both platforms when our own
  // tracker fires an event. Listens for CustomEvent 'svita:event'. ───
  window.addEventListener('svita:event', (e)=>{
    const { event, meta } = e.detail || {};
    if(!event) return;
    try{ if(window.ym && cfg.ym) window.ym(cfg.ym, 'reachGoal', event, meta || {}); }catch{}
    try{ if(window.gtag) window.gtag('event', event, meta || {}); }catch{}
  });
})();
