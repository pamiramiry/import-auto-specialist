/* Google Analytics 4 (gtag.js) initialization.
   Kept in a same-origin file (loaded via 'self') instead of an inline <head>
   script so the site's Content-Security-Policy script-src can stay strict —
   no 'unsafe-inline'. The gtag.js library itself is loaded from
   https://www.googletagmanager.com (allowed in script-src); GA sends its hits
   to the google-analytics.com / analytics.google.com endpoints allowed in
   connect-src. Loaded with `defer` so it does not block first paint. Deferred
   scripts execute in document order, and this tag sits in <head> while script.js
   sits at the end of <body>, so window.gtag is defined before the phone-click
   tracking in script.js runs. gtag.js tolerates dataLayer being populated after
   it loads — it processes whatever is pushed. */
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-LSB3NXXYZD');
