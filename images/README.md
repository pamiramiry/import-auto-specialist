# Images — Import Auto Specialist

The site uses one photograph: the hero, a real photo of this shop. The About section deliberately
has **no photo**. Do not add stock or third-party photos to this site; use only photos the shop owns.

## Current images

| Filename                | Used for       | Source                                 | License |
|-------------------------|----------------|----------------------------------------|---------|
| `hero-import-auto.webp` | Hero (≥641px)  | Real photo of this shop                | own     |
| `hero-mobile.webp`      | Hero (≤640px)  | Real photo of this shop, portrait crop | own     |
| `og-image.jpg`          | Social sharing | Branded 1200×630 share image           | own     |

## Hero responsive variants

`hero-import-auto.webp` (1672×941) ships alongside 640 / 1024 / 1440px variants generated with
[sharp](https://sharp.pixelplumbing.com/) at quality 82. The `srcset` on the `<img>` **and** the
`imagesrcset` on the `<head>` preload in `index.html` both list all four. Keep them in sync, or the
browser downloads two copies of the hero. Regenerate all three variants whenever the source changes.

## Production tips

- Export as **WebP**; keep the hero under ~250 KB and content images under ~150 KB after compression.
- Keep the exact pixel dimensions in the `width`/`height` attributes so nothing shifts on load (CLS).
- Always keep meaningful `alt` text.
- `/images/*` is served with a one-year immutable cache header (`vercel.json`), so **change the
  filename** when you replace a photo, or returning visitors keep seeing the old one.
