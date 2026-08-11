# Import Auto Specialist

Marketing website for **Import Auto Specialist**, a car repair & maintenance shop in Scarborough, ON.

- **Address:** 777 Warden Ave., Scarborough, ON M1L 4C2
- **Phone:** (416) 913-2394
- **Hours:** Monday–Friday, 9:00 a.m.–5:00 p.m. (closed weekends)
- **Domain:** https://importautospecialist.ca

## Tech

Plain static site — semantic **HTML5**, modern **CSS3**, and vanilla **JavaScript**. No frameworks, no build step. Deployed to Vercel (`vercel.json` sets `cleanUrls`, security headers, and caching).

```
index.html                              # homepage
<service>-scarborough.html              # 12 service pages (see below)
privacy.html  404.html
_service-template.html                  # scaffold for new service pages (not deployed)
styles.css                              # @font-face + design tokens + all styles
script.js                               # nav, reveal animations, FAQ, form validation
ga-init.js                              # GA4 config, kept out-of-line for a strict CSP
fonts/                                  # self-hosted woff2 (latin subset)
images/                                 # photos + icons (see images/README.md)
robots.txt  sitemap.xml  vercel.json
```

### Service pages

Twelve, each targeting a service + city query:

`vehicle-diagnostics` · `mercedes-benz-repair` · `brake-repair` · `engine-repair` ·
`suspension-repair` · `electrical-diagnostics` · `heating-air-conditioning` ·
`auto-body-repair` · `oil-change` · `tire-alignment` · `safety-certificate` ·
`pre-purchase-inspection` — all suffixed `-scarborough`.

Each page carries three JSON-LD blocks (`BreadcrumbList`, `Service`, `FAQPage`). The `Service.provider`
is only an `@id` reference to the `AutoRepair` node on the homepage — the business details and the
`aggregateRating` live in exactly one place, on `index.html`. **Do not re-inline the rating into
service pages:** duplicated self-serving ratings on non-review pages risk the rich result being
dropped sitewide.

## Conventions

- **Header parity is locked** — the nav, mobile menu, and footer Services column must be identical on
  every page. They are generated from one list; if you add a service, update all pages together.
- **Canonical service naming** — the card `<h3>`, nav label, page `<h1>`, `<title>`, `og:title`, and
  the `hasOfferCatalog` entry must agree. `<title>` = `<h1>` + ` | Import Auto Specialist`, and
  `og:title` is byte-identical to `<title>`. The brand is never shortened to "Import Auto".
- **No warranty language anywhere** — owner's rule, see `DESIGN-RULES.md`.
- **No invented claims** — see Notes below.

## Running locally

Serve the folder (needed for the clean URLs the service pages link to):

```bash
npx serve .
```

## Assets

- **Fonts** are self-hosted in `fonts/` (Barlow Condensed 500/600/700 static, Inter as one variable
  file covering 400–700), latin subset only. Regenerate with the fetch script if weights change, and
  keep the two `<link rel="preload">` tags in each `<head>` pointing at the above-the-fold faces.
- **`styles.css` / `script.js` / `ga-init.js`** are cached immutably by `vercel.json` and referenced
  with a `?v=` query. **Bump that query in every HTML file when you change any of them**, or
  returning visitors keep the old copy.
- **Hero image** ships at 640/1024/1440/1672 widths. The `srcset` on the `<img>` and the
  `imagesrcset` on the `<head>` preload must stay in sync or the browser downloads two copies.

## Still outstanding

- **Photos:** `images/technician-diagnostic.jpg` is a CC-licensed stand-in and the footer credit line
  that attributed it has been removed — either restore attribution or replace it with a real shop
  photo (see `images/README.md`). Service pages currently carry no images at all.
- **Email address and social profiles:** none confirmed, so `schema.org` `email` is omitted and
  `sameAs` has a single entry (the Google Maps CID).
- **MVIS licence number:** the shop is a licensed Motor Vehicle Inspection Station (confirmed by the
  owner) and `safety-certificate-scarborough` says so. Displaying the actual station licence number on
  that page would strengthen it further — get the number from the owner if you want to add it.

## Notes

Structured data (JSON-LD) uses only confirmed business facts — the 4.5★ / 112-review rating, real
address, real hours, and coordinates from the shop's Google Maps listing. Nothing (awards, prices,
certifications, email) is invented.

The Mercedes-Benz page rests on two confirmed facts: the shop runs **XENTRY / STAR Diagnosis**, and
the technician has completed **Mercedes-Benz engine training through the WORLDPAC Technical Training
Institute**. That is aftermarket training, *not* Mercedes-Benz accreditation — the page must never
say "Mercedes-Benz certified", "authorised", or "factory-trained by Mercedes-Benz".
