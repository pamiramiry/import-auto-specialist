/* Google Analytics 4: notice-and-opt-out loader (AP Analytics Assessment v1, 2026-11-13).

   - GA4 loads by default unless the visitor has turned analytics off on this browser.
   - The opt-out is stored in localStorage ('ias-analytics-off' = '1'). While it is set, gtag.js is
     never requested, window.gtag is a no-op (so script.js events send nothing), and GA's own
     ga-disable flag is set.
   - Turning analytics off also clears first-party _ga / _ga_* cookies where the browser allows.
   - Google Signals and ad personalization are switched off in the config below. No User-ID.
   - A small notice bar is shown until the visitor presses OK. Pressing OK only hides the notice;
     it is NOT consent and changes nothing about tracking.
   - Any element with [data-analytics-toggle] (footer + notice) turns analytics off / back on.

   Same-origin file so the CSP can stay strict (no inline scripts). gtag.js is injected from
   https://www.googletagmanager.com, which script-src already allows. */
(function () {
  var GA_MEASUREMENT_ID = 'G-LSB3NXXYZD';
  var OFF_KEY = 'ias-analytics-off';
  var NOTICE_KEY = 'ias-analytics-notice-ok';
  var loaded = false;

  function store(key, value) {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch (e) { /* storage blocked: the choice simply lasts for this page view */ }
  }
  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function isOff() { return read(OFF_KEY) === '1'; }

  function noop() {}

  function start() {
    if (!GA_MEASUREMENT_ID || loaded) return;
    window['ga-disable-' + GA_MEASUREMENT_ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(s);
    loaded = true;
  }

  function clearGaCookies() {
    var names = document.cookie.split(';').map(function (c) { return c.split('=')[0].trim(); })
      .filter(function (n) { return n === '_ga' || n.indexOf('_ga_') === 0 || n === '_gid'; });
    var parts = location.hostname.split('.');
    var domains = [''];
    for (var i = 0; i < parts.length - 1; i++) domains.push('; domain=.' + parts.slice(i).join('.'));
    names.forEach(function (n) {
      domains.forEach(function (d) {
        document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
      });
    });
  }

  function turnOff() {
    store(OFF_KEY, '1');
    if (GA_MEASUREMENT_ID) window['ga-disable-' + GA_MEASUREMENT_ID] = true;
    window.gtag = noop;
    clearGaCookies();
    render();
  }

  function turnOn() {
    store(OFF_KEY, null);
    if (loaded) {
      // gtag.js is already on the page: re-enable it without loading it twice.
      window['ga-disable-' + GA_MEASUREMENT_ID] = false;
      window.gtag = function () { window.dataLayer.push(arguments); };
    } else {
      start();
    }
    render();
  }

  if (isOff()) {
    if (GA_MEASUREMENT_ID) window['ga-disable-' + GA_MEASUREMENT_ID] = true;
    window.gtag = noop;
  } else {
    start();
  }
  if (!GA_MEASUREMENT_ID) window.gtag = noop;

  window.IASAnalytics = { isOff: isOff, turnOff: turnOff, turnOn: turnOn };

  /* ---------------- Notice bar + toggles ---------------- */
  var bar = null;

  function render() {
    var off = isOff();
    var toggles = document.querySelectorAll('[data-analytics-toggle]');
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].textContent = off ? 'Turn on analytics' : 'Turn off analytics';
      toggles[i].setAttribute('aria-pressed', off ? 'true' : 'false');
    }
    var status = document.getElementById('analytics-status');
    if (status) status.textContent = off ? 'Analytics is off on this browser.' : 'Analytics is on.';
  }

  function buildBar() {
    if (read(NOTICE_KEY) === '1' || isOff()) return;
    bar = document.createElement('section');
    bar.className = 'analytics-notice';
    bar.setAttribute('aria-label', 'Analytics notice');
    bar.innerHTML =
      '<p class="analytics-notice-text">We use analytics to understand how visitors use this site. ' +
      '<a href="/privacy#analytics">Privacy Policy</a> · ' +
      '<button type="button" class="link-button" data-analytics-toggle>Turn off analytics</button></p>' +
      '<button type="button" class="btn btn-blue analytics-notice-ok">OK</button>';
    document.body.appendChild(bar);
    document.body.classList.add('has-analytics-notice');
    bar.querySelector('.analytics-notice-ok').addEventListener('click', function () {
      store(NOTICE_KEY, '1');
      closeBar();
    });
  }

  function closeBar() {
    if (!bar) return;
    bar.remove();
    bar = null;
    document.body.classList.remove('has-analytics-notice');
  }

  function init() {
    buildBar();
    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target.closest('[data-analytics-toggle]') : null;
      if (!t) return;
      e.preventDefault();
      if (isOff()) turnOn(); else turnOff();
      // Once the visitor has made a choice from the notice, it has done its job.
      if (bar && bar.contains(t)) { store(NOTICE_KEY, '1'); closeBar(); }
    });
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
