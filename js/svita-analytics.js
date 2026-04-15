/* SVITA Micro — analytics tracker
 * Writes to public.svita_events with meta.site='micro.svita.ai'.
 * Auto-tracks page_view on load. Exposes window.svitaTrack(event, meta).
 * Session ID kept in sessionStorage. Visitor ID kept in localStorage.
 */
(function(){
  if (window.svitaTrack) return;

  const SB_URL = 'https://ctdleobjnzniqkqomlrq.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZGxlb2JqbnpuaXFrcW9tbHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzE4MTEsImV4cCI6MjA4NzgwNzgxMX0.AMHtY7zGPemKYCxMy2bqRTOEAp8trA_Slor9wmg7C38';
  const SITE = 'micro.svita.ai';
  const REST = SB_URL + '/rest/v1/svita_events';

  function uuidv4(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
  function getVisitorId(){
    let v = localStorage.getItem('svita_visitor_id');
    if (!v) { v = uuidv4(); localStorage.setItem('svita_visitor_id', v); }
    return v;
  }
  function getSessionId(){
    let s = sessionStorage.getItem('svita_session_id');
    if (!s) { s = uuidv4(); sessionStorage.setItem('svita_session_id', s); }
    return s;
  }
  function currentUserId(){
    try {
      const raw = localStorage.getItem('sb-ctdleobjnzniqkqomlrq-auth-token')
               || localStorage.getItem('svita-micro-auth');
      if (!raw) return null;
      const j = JSON.parse(raw);
      return j?.user?.id || j?.currentSession?.user?.id || null;
    } catch { return null; }
  }

  async function track(event, meta){
    try {
      const body = [{
        visitor_id: getVisitorId(),
        session_id: getSessionId(),
        user_id:    currentUserId(),
        event:      event,
        page:       location.pathname + location.search,
        referrer:   document.referrer || null,
        lang:       (localStorage.getItem('svita_micro_lang') || document.documentElement.lang || 'en').slice(0,5),
        ua:         navigator.userAgent.slice(0, 500),
        screen_w:   window.innerWidth  || null,
        screen_h:   window.innerHeight || null,
        meta:       Object.assign({ site: SITE }, meta || {})
      }];
      // Fire-and-forget; use keepalive so it survives navigation
      fetch(REST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SB_KEY,
          'Authorization': 'Bearer ' + SB_KEY,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(body),
        keepalive: true
      }).catch(()=>{});
    } catch(e) { /* never break the app */ }
  }

  window.svitaTrack = track;

  // Auto: page_view on load
  function autoPageView(){
    // Detect slug from URL for concept pages
    const m = location.pathname.match(/view\.html/);
    const params = new URLSearchParams(location.search);
    const slug = params.get('c');
    if (m && slug) {
      track('concept_view', { slug });
    } else {
      track('page_view', slug ? { slug } : null);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoPageView);
  } else {
    autoPageView();
  }

  // Auto: cart additions
  window.addEventListener('svita:cart', (e) => {
    try {
      const d = e.detail || {};
      if (d.action === 'add' && d.slug) track('add_to_cart', { slug: d.slug });
      else if (d.action === 'checkout' && d.slug) track('checkout_start', { slug: d.slug });
    } catch {}
  });
})();
