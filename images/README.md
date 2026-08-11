# Images — Import Auto Specialist

The site uses two photographs. The hero is a real photo of this shop. The About-section photo is
still a **CC-licensed stand-in** and should be swapped for a real photo of this shop as soon as one
is available — replace the file (same filename) and update the `alt` text in `index.html` to match.

## Current photos

| Filename                    | Used for       | Source                                                                                                                                                                          | Photographer    | License   |
|-----------------------------|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|-----------|
| `hero-import-auto.webp`     | Hero (≥641px)  | Real photo of this shop                                                                                                                                                          | —               | own       |
| `hero-mobile.webp`          | Hero (≤640px)  | Real photo of this shop, portrait crop                                                                                                                                            | —               | own       |
| `technician-diagnostic.jpg` | About section  | [Young mechanic with modern laptop doing car diagnostic](https://commons.wikimedia.org/wiki/File:Young_mechanic_with_modern_laptop_doing_car_diagnostic_at_automobile_repair.jpg) | Nenad Stojković | CC BY 2.0 |
| `og-image.jpg`              | Social sharing | Branded 1200×630 share image                                                                                                                                                     | —               | own       |

> **⚠ Attribution gap.** `technician-diagnostic.jpg` is CC BY 2.0, which *requires* credit, but the
> `.photo-credits` line was removed from the footer when the real hero photos landed. Either restore
> a credit line for this one photo or replace it with a real shop photo. As it stands the site uses a
> CC BY image without the attribution its licence requires.

## Hero responsive variants

`hero-import-auto.webp` (1672×941) ships alongside 640 / 1024 / 1440px variants generated with
[sharp](https://sharp.pixelplumbing.com/) at quality 82. The `srcset` on the `<img>` **and** the
`imagesrcset` on the `<head>` preload in `index.html` both list all four — keep them in sync, or the
browser downloads two copies of the hero. Regenerate all three variants whenever the source changes.

## When real shop photos are ready

| Filename                    | Subject                                        | Size (px)  |
|-----------------------------|------------------------------------------------|------------|
| `technician-diagnostic.jpg` | This shop's own technician(s) at work          | 1200 × 800 |

The 12 service pages currently carry **no images at all**. Real photos of the relevant work — a brake
job, a car on the alignment rack, the diagnostic laptop plugged into a Mercedes — would give each page
an image-search surface and some alt-text keyword coverage it does not have today.

## Production tips

- Export as **WebP** (the hero pair already is); keep the hero under ~250 KB and content images under
  ~150 KB after compression.
- Keep the exact pixel dimensions in the `width`/`height` attributes so reserved space matches and
  nothing shifts on load (CLS).
- Always keep meaningful `alt` text — update it in `index.html` to describe the new photo.
- `/images/*` is served with a one-year immutable cache header (`vercel.json`), so **change the
  filename** when you replace a photo, or returning visitors keep seeing the old one.
