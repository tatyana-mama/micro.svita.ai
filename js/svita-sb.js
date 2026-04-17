/* Single Supabase client for the whole site.
   Load this BEFORE svita-nav.js / svita-app.js / any page script
   that touches Supabase. All other scripts should prefer
   `window.__svitaSb` over calling supabase.createClient themselves
   to avoid the "Multiple GoTrueClient instances" warning. */
(function(){
  if (window.__svitaSb) return;
  if (!window.supabase || !window.supabase.createClient) {
    // supabase-js not loaded yet — pages that need it will call createClient
    // behind a `window.__svitaSb ||` guard. Nothing to do here.
    return;
  }
  var SB_URL = 'https://ctdleobjnzniqkqomlrq.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZGxlb2JqbnpuaXFrcW9tbHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzE4MTEsImV4cCI6MjA4NzgwNzgxMX0.AMHtY7zGPemKYCxMy2bqRTOEAp8trA_Slor9wmg7C38';
  window.__svitaSb = window.supabase.createClient(SB_URL, SB_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: 'svita-micro-auth' }
  });
  window.SB = window.__svitaSb;
})();
