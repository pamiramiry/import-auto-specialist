/* Google Analytics 4 (gtag.js) initialization.
   Kept in a same-origin file (loaded via 'self') instead of an inline <head>
   script so the site's Content-Security-Policy script-src can stay strict —
   no 'unsafe-inline'. The gtag.js library itself is loaded from
   https://www.googletagmanager.com (allowed in script-src); GA sends its hits
   to the google-analytics.com / analytics.google.com endpoints allowed in
   connect-src. This runs synchronously in <head>, right after the async
   gtag.js tag, so window.gtag exists as early as the old inline snippet did
   (the phone-click tracking in script.js relies on window.gtag being present). */
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-LSB3NXXYZD');
