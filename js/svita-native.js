/* SVITA native bridge — activates Capacitor plugins when running in the iOS app,
   falls back to web-standard APIs in the browser. Always safe to call.

   Exposes window.SvitaNative with:
     isNative(), share({title,text,url}), haptic(kind), setLang(code),
     prefsGet(key), prefsSet(key,val), requestPush(), onAppStateChange(fn),
     openBrowser(url) */
(function () {
  'use strict';
  const Cap = window.Capacitor;
  const isNative = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());

  async function share(opts) {
    if (isNative && Cap.Plugins.Share) {
      try { await Cap.Plugins.Share.share(opts); return true; } catch (_) { return false; }
    }
    if (navigator.share) {
      try { await navigator.share(opts); return true; } catch (_) { return false; }
    }
    // Fallback: copy URL to clipboard
    try { await navigator.clipboard.writeText(opts.url || opts.text || ''); return true; } catch (_) { return false; }
  }

  function haptic(kind) {
    if (!isNative || !Cap.Plugins.Haptics) return;
    try {
      if (kind === 'success') Cap.Plugins.Haptics.notification({ type: 'SUCCESS' });
      else if (kind === 'warn') Cap.Plugins.Haptics.notification({ type: 'WARNING' });
      else if (kind === 'error') Cap.Plugins.Haptics.notification({ type: 'ERROR' });
      else if (kind === 'light') Cap.Plugins.Haptics.impact({ style: 'LIGHT' });
      else if (kind === 'medium') Cap.Plugins.Haptics.impact({ style: 'MEDIUM' });
      else Cap.Plugins.Haptics.impact({ style: 'HEAVY' });
    } catch (_) {}
  }

  async function prefsGet(key) {
    if (isNative && Cap.Plugins.Preferences) {
      try { const { value } = await Cap.Plugins.Preferences.get({ key }); return value; } catch (_) { return null; }
    }
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }

  async function prefsSet(key, val) {
    if (isNative && Cap.Plugins.Preferences) {
      try { await Cap.Plugins.Preferences.set({ key, value: String(val) }); return; } catch (_) {}
    }
    try { localStorage.setItem(key, String(val)); } catch (_) {}
  }

  async function requestPush() {
    if (!isNative || !Cap.Plugins.PushNotifications) return null;
    try {
      const { receive } = await Cap.Plugins.PushNotifications.requestPermissions();
      if (receive !== 'granted') return null;
      await Cap.Plugins.PushNotifications.register();
      return true;
    } catch (_) { return null; }
  }

  function onAppStateChange(fn) {
    if (isNative && Cap.Plugins.App) {
      Cap.Plugins.App.addListener('appStateChange', fn);
    } else {
      document.addEventListener('visibilitychange', () =>
        fn({ isActive: !document.hidden }));
    }
  }

  async function openBrowser(url) {
    if (isNative && Cap.Plugins.Browser) {
      try { await Cap.Plugins.Browser.open({ url }); return; } catch (_) {}
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // Auto-register push token on app boot (once per session)
  if (isNative && Cap.Plugins.PushNotifications) {
    Cap.Plugins.PushNotifications.addListener('registration', (token) => {
      // Forward token to Supabase so the server can target this device
      const sb = window.SB || window.__svitaSb;
      if (!sb) return;
      sb.auth.getSession().then(({ data }) => {
        if (!data || !data.session) return;
        sb.from('device_tokens').upsert({
          user_id: data.session.user.id,
          platform: 'ios',
          token: token.value
        }, { onConflict: 'user_id,token' }).then(() => {}, () => {});
      });
    });
    Cap.Plugins.PushNotifications.addListener('registrationError', () => {});
  }

  window.SvitaNative = { isNative: () => isNative, share, haptic, prefsGet, prefsSet, requestPush, onAppStateChange, openBrowser };
})();
