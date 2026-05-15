/* svita-title-i18n.js — localize document.title without per-page boilerplate.
 *
 * Usage on a page:
 *   <html lang="en" data-page-title-key="page_title_shop">
 *   <script src="js/svita-title-i18n.js" defer></script>
 *
 * The dict (window.I18N) must include the key with en/ru/pl/uk/be entries.
 * If the key is missing, the static <title> stays. The script chains
 * window.onLangChange so the tab title updates instantly when the visitor
 * flips the language pill.
 */
(function () {
  if (window.__svitaTitleI18n) return;
  window.__svitaTitleI18n = true;

  function currentLang() {
    try { return localStorage.getItem('labs67lang') || 'en'; } catch (_) { return 'en'; }
  }

  function apply() {
    const key = document.documentElement.getAttribute('data-page-title-key');
    if (!key || !window.I18N) return;
    const row = window.I18N[key];
    if (!row) return;
    const lang = currentLang();
    const next = row[lang] || row.en;
    if (next && document.title !== next) document.title = next;
  }

  /* Run after DOM ready (so the <html> attribute and dict are parsed). */
  function init() {
    apply();
    const prev = window.onLangChange;
    window.onLangChange = function (lang, dict) {
      if (typeof prev === 'function') {
        try { prev(lang, dict); } catch (_) {}
      }
      apply();
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
