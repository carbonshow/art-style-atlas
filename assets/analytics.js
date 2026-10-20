/* Default-on production analytics; never read visitor input. */
(function (factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else {
    try {
      const config = JSON.parse(document.getElementById('analytics-config').textContent);
      factory().create(window, document, config).start();
    } catch (_) { /* Analytics must never prevent the site from working. */ }
  }
})(function () {
  'use strict';
  const DISABLED_KEY = 'atlas.analytics.disabled';
  const STORAGE = {analytics_storage:'granted', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'};
  const UTM = ['utm_source', 'utm_medium', 'utm_campaign'];

  function publicPath(path, site, paths) {
    if (!path.startsWith(site.pathname)) return null;
    let relative = path.slice(site.pathname.length).replace(/index\.html$/, '');
    if (paths.includes(relative + '/')) relative += '/';
    return paths.includes(relative) ? site.pathname + relative : null;
  }
  function cleanLocation(href, canonical) {
    const result = new URL(canonical);
    result.search = ''; result.hash = '';
    const incoming = new URL(href);
    UTM.forEach(key => {
      const values = incoming.searchParams.getAll(key);
      if (values.length === 1 && /^[a-z0-9_-]{1,64}$/.test(values[0])) result.searchParams.set(key, values[0]);
    });
    return result.href;
  }
  function cleanReferrer(value, site, paths) {
    if (!value) return '';
    try {
      const url = new URL(value);
      if (!['https:', 'http:'].includes(url.protocol)) return '';
      if (url.origin === site.origin) {
        const path = publicPath(url.pathname, site, paths);
        return path ? url.origin + path : url.origin;
      }
      return url.origin;
    } catch (_) { return ''; }
  }
  function create(win, doc, config) {
    const site = new URL(config.site_url);
    const here = new URL(win.location.href);
    const id = config.measurement_id;
    const canonical = new URL(config.page_location);
    const paths = config.public_paths || [];
    const eligible = config.enabled === true && /^G-[A-Z0-9]+$/.test(id) &&
      here.protocol === 'https:' && here.origin === site.origin && here.pathname.startsWith(site.pathname) &&
      canonical.origin === site.origin && publicPath(canonical.pathname, site, paths) !== null;
    // Snapshot before catalog/compose rewrite their URL. Never read free-input elements.
    const fields = {page_location:cleanLocation(here.href, canonical.href),
      page_referrer:cleanReferrer(doc.referrer, site, paths), page_title:config.page_title};
    let loaded = false, loading = false;
    let configured = false, active = false, sent = false;
    function disabled() {
      try { return win.localStorage.getItem(DISABLED_KEY) === '1'; }
      catch (_) { return false; }
    }
    function command() { win.atlasDataLayer.push(arguments); }
    function clearCookies() {
      for (const name of ['atlas_ga', 'atlas_ga_' + id.slice(2)]) {
        doc.cookie = name + '=; Max-Age=0; Path=' + site.pathname + '; SameSite=Lax; Secure';
      }
    }
    function stop() {
      // Apply the maintainer opt-out before a delayed script callback can send data.
      win['ga-disable-' + id] = true;
      if (active) command('consent', 'update', {...STORAGE, analytics_storage:'denied'});
      active = false;
      clearCookies();
    }
    function track() {
      if (!loaded || disabled()) return;
      win['ga-disable-' + id] = false;
      if (!active) {
        command('consent', 'update', {...STORAGE});
        active = true;
      }
      if (!configured) {
        command('js', new win.Date());
        command('config', id, {...fields, send_page_view:false, allow_google_signals:false,
          allow_ad_personalization_signals:false, cookie_prefix:'atlas', cookie_domain:'none',
          cookie_path:site.pathname, cookie_flags:'SameSite=Lax;Secure'});
        configured = true;
      }
      if (!sent) {
        sent = true;
        command('event', 'page_view', {...fields, send_to:id});
      }
    }
    function load() {
      if (loaded) { track(); return; }
      if (loading) return;
      loading = true;
      win.atlasDataLayer = win.atlasDataLayer || [];
      command('consent', 'default', {...STORAGE});
      const script = doc.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id) + '&l=atlasDataLayer';
      script.referrerPolicy = 'strict-origin-when-cross-origin';
      script.onload = () => { loaded = true; sync(); };
      // No retries to work around a visitor's blocker.
      script.onerror = () => { stop(); };
      doc.head.appendChild(script);
    }
    function sync() {
      if (disabled()) stop();
      else load();
    }
    function start() {
      if (!eligible) return;
      const legacy = doc.getElementById('legacy-ids');
      if (legacy && JSON.parse(legacy.textContent).includes(here.hash.slice(1))) return;
      win.addEventListener('storage', event => {
        if (event.key === DISABLED_KEY || event.key === null) sync();
      });
      win.addEventListener('pageshow', event => { if (event.persisted) { sent = false; sync(); } });
      win.addEventListener('focus', sync);
      doc.addEventListener('visibilitychange', sync);
      sync();
    }
    return {start};
  }
  return {create, cleanLocation, cleanReferrer, DISABLED_KEY};
});
