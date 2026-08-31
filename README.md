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
<service>-scarborough.html              # 15 service pages (see below)
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

Fifteen, each targeting a service or brand + city query:

`vehicle-diagnostics` · `mercedes-benz-repair` · `bmw-repair` · `volkswagen-audi-repair` ·
`tesla-repair` · `brake-repair` ·
`engine-repair` · `suspension-repair` · `electrical-diagnostics` · `heating-air-conditioning` ·
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
- **Canonical service naming** — `<title>` = `<h1>` + ` | Import Auto Specialist`, and `og:title` /
  `twitter:title` are byte-identical to `<title>`. The brand is never shortened to "Import Auto".
  The nav label, homepage card `<h3>`, breadcrumb and `hasOfferCatalog` entry use the **short service
  name**, which may be a shorter form of the `<h1>` — e.g. nav "Suspension & Steering" vs H1
  "Suspension & Steering Repair in Scarborough", and nav "Mercedes-Benz Repair" / "BMW Repair" vs H1
  "Mercedes-Benz Mechanic & Repair in Scarborough" / "BMW Mechanic & Repair in Scarborough". This is
  intentional: the H1/title carry the search phrasing, the nav carries the short label. Do not
  "fix" the divergence.
- **Descriptive link text** — anchors name their destination; there is no "Learn more" anywhere on
  the site. Only the highest-value destinations append "in Scarborough", and destinations linked from
  many pages cycle through 2-3 phrasings so no anchor string repeats verbatim across the site.
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

### Brand pages — what each one may claim

All four brand pages exist because each leads with a *confirmed, specific* capability. None may be
softened into a generic "we also fix this brand" page, and none may borrow another's claims.

**Mercedes-Benz** — the shop runs **XENTRY / STAR Diagnosis**, and the technician has completed
**Mercedes-Benz engine training through the WORLDPAC Technical Training Institute**. That is
aftermarket training, *not* Mercedes-Benz accreditation — the page must never say "Mercedes-Benz
certified", "authorised", or "factory-trained by Mercedes-Benz".

**BMW** — the shop runs **ISTA** (formerly Rheingold), BMW's factory diagnostic software, and does
**module coding, retrofits and battery registration**. Air suspension work on the X-series is
evidenced by a real customer review. Never say "BMW certified", "authorised", or "factory-trained by
BMW". Coding is **not** performance tuning or ECU remapping — do not imply it.

**Volkswagen & Audi** — the shop runs **ODIS** (factory VW/Audi software) *and* **VCDS** (Ross-Tech),
and does module coding, adaptations and basic settings. Never say "VW/Audi certified" or "authorised".
Do **not** claim walnut-blasting / carbon cleaning or DSG mechatronic rebuilds — neither is confirmed;
the page only says carbon buildup is checked for during diagnosis, and that DSG fluid/filter service
and mechatronic fault-code reading are done.

**Tesla** — the shop runs **Toolbox 3** (Tesla's own diagnostic software) and takes on **high-voltage
battery and drive unit work**. Never say "Tesla certified", "authorised", or "Tesla-approved body
shop" — approved-shop status is a specific certification and is not claimed. The page's strongest
original angle is that regenerative braking leaves friction brakes to corrode and seize in a salt
climate, which is a real local issue and not a generic EV talking point.

> **HV caveat for whoever maintains this:** the high-voltage claim was confirmed by the owner. If the
> technician holding the HV training ever leaves, or insurance coverage for HV work lapses, the
> high-voltage sections of `tesla-repair-scarborough` must come down — the rest of that page (brakes,
> tires, suspension, 12V, body) stands on its own without them.

The WORLDPAC credential is Mercedes-specific and must not appear on the BMW page; XENTRY, ISTA, ODIS and
Toolbox 3 are each single-brand tools and must never be described as covering another brand.

### European makes — two separate claims, do not merge them

**Makes serviced (owner-confirmed, Aug 2026):** the shop works on *every mainstream European make* —
Mercedes-Benz, BMW, MINI, Audi, Volkswagen, Porsche, Volvo, Land Rover / Range Rover and Jaguar.
`european-car-repair-scarborough` states this.

**Factory diagnostic software held:** Mercedes (XENTRY/STAR), BMW (ISTA) and VW/Audi (ODIS + VCDS)
**only**. These are single-brand packages — XENTRY does not read a Volvo. The European page keeps
these as two distinct sections for exactly this reason, and the build script aborts if any of
Porsche, Volvo, Jaguar, Land Rover or MINI appears inside the factory-software block.

Servicing a make and holding its factory software are different claims.

**Factory software held, by brand page** (owner-confirmed). Each package is single-brand — never
describe one as covering another, and never write "certified", "authorised" or "factory-trained by":

| Page | Factory software |
|---|---|
| `mercedes-benz-repair` | XENTRY / STAR Diagnosis |
| `bmw-repair` | ISTA (formerly Rheingold) |
| `volkswagen-audi-repair` | ODIS + VCDS |
| `porsche-repair` | PIWIS |
| `volvo-repair` | VIDA |
| `land-rover-range-rover-repair` | JLR SDD / Pathfinder (also covers Jaguar) |
| `tesla-repair` | Toolbox 3 |
| `subaru-repair` | **none — do not add one** |

**Subaru is the exception, twice over.** It is *Japanese*, so it must never appear in the European
hub's makes list. And no Subaru factory software was confirmed, so that page deliberately makes no
tooling claim — it stands on AWD tire matching, CVT service and boxer-engine specifics instead.
The page generator asserts all of this: it aborts if any page names a tool belonging to another
brand, or if Subaru names one at all.

