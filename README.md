# Import Auto Specialist

Marketing website for **Import Auto Specialist**, a car repair & maintenance shop in Scarborough, ON.

- **Address:** 777 Warden Ave., Scarborough, ON M1L 4C2
- **Phone:** (416) 913-2394
- **Hours:** Monday–Friday, 9:00 a.m.–5:00 p.m. (closed weekends)

## Tech

Plain static site — semantic **HTML5**, modern **CSS3**, and vanilla **JavaScript**. No frameworks, no build step. Deployable as-is to Vercel, Netlify, GitHub Pages, or any static host.

```
index.html      # single-page site
styles.css      # design tokens + all styles
script.js       # nav, reveal animations, FAQ, form validation, etc.
favicon.svg
robots.txt
sitemap.xml
images/         # photos + icons (see images/README.md)
```

## Running locally

Just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Before launch — replace the placeholders

- **Domain:** swap `https://www.example.com/` in `index.html` (canonical + Open Graph + Twitter), `robots.txt`, and `sitemap.xml` for the real domain.
- **Appointment form:** replace `YOUR_FORM_ID` in the form `action` with a real [Formspree](https://formspree.io) form ID (or another backend) so submissions are delivered. Until then the form validates and shows a confirmation but nothing is sent.
- **Photos:** the hero/why/about images are CC-licensed stand-ins (credited in the footer) — replace with real shop photos per `images/README.md`.
- **Social image:** add a 1200×630 `images/og-image.jpg` and reference it (currently a documented TODO).

## Notes

Structured data (JSON-LD) uses only confirmed business facts — the 4.5★ / 112-review rating, real address, real hours, and coordinates from the shop's Google Maps listing. Nothing (awards, prices, certifications, email) is invented.
