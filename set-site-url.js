#!/usr/bin/env node
/*
 * ─────────────────────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH FOR THE PRODUCTION ORIGIN
 * ─────────────────────────────────────────────────────────────────────────────
 *  To change the domain, edit the ONE line below and run:
 *
 *      node set-site-url.js
 *
 *  It rewrites every absolute site URL (canonical, Open Graph, Twitter,
 *  JSON-LD, sitemap, robots) across all files in one pass. The current origin
 *  is auto-detected from index.html's <link rel="canonical">, so you only ever
 *  edit this single constant.
 *
 *  Why a script and not a runtime JS variable? Social/link crawlers
 *  (Facebook, LinkedIn, Slack, iMessage, …) do NOT run JavaScript — the OG and
 *  canonical tags must be literal absolute URLs in the served HTML. This keeps
 *  the files crawler-correct while still giving you a one-line domain change.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const SITE_URL = 'https://importautospecialist.ca';

const fs = require('fs');
const path = require('path');

const FILES = ['index.html', 'privacy.html', 'sitemap.xml', 'robots.txt', 'site.webmanifest'];
const TO = SITE_URL.replace(/\/+$/, ''); // no trailing slash on the origin

// Detect the current origin from index.html's canonical link
const indexPath = path.join(__dirname, 'index.html');
const canonical = fs.readFileSync(indexPath, 'utf8').match(/rel="canonical"\s+href="(https?:\/\/[^/"]+)/i);
const FROM = canonical && canonical[1];

if (!FROM) {
  console.error('Could not detect the current origin from index.html canonical link. Aborting.');
  process.exit(1);
}
if (FROM === TO) {
  console.log('Origin already set to ' + TO + ' — nothing to do.');
  process.exit(0);
}

let total = 0;
for (const file of FILES) {
  const p = path.join(__dirname, file);
  if (!fs.existsSync(p)) continue;
  const before = fs.readFileSync(p, 'utf8');
  const count = before.split(FROM).length - 1;
  if (count === 0) continue;
  fs.writeFileSync(p, before.split(FROM).join(TO));
  total += count;
  console.log('  ' + file + ': ' + count + ' replaced');
}
console.log('Done. ' + FROM + ' → ' + TO + ' (' + total + ' occurrences).');
