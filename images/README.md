# Images — Import Auto Specialist

The site currently uses **real stand-in stock photos** (not the shop's own photos) under Creative
Commons licenses. They're a reasonable placeholder for launch, but should be swapped for real photos
of this specific shop, team, and vehicles as soon as they're available — replace the files below
(same filenames) and update the `alt` text in `index.html` to match the new photo.

## Current stand-in photos

| Filename                      | Used for              | Source                                                                                          | Photographer      | License      |
|--------------------------------|------------------------|-----------------------------------------------------------------------------------------------------------------------|--------------------|--------------|
| `hero-auto-repair.jpg`         | Hero (split layout)    | [Flickr photo](https://www.flickr.com/photos/26344495@N05/49963716608) — mechanic's hand holding lug nuts with a brake disc | Ivan Radic         | CC BY 2.0    |
| `mechanic-inspection.jpg`      | Why Choose Us section  | [Wheel alignment on a Ford Focus 3](https://commons.wikimedia.org/wiki/File:Wheel_alignment_on_a_Ford_Focus_3.jpg)   | Mike Peel          | CC BY-SA 4.0 |
| `technician-diagnostic.jpg`    | About section          | [Young mechanic with modern laptop doing car diagnostic](https://commons.wikimedia.org/wiki/File:Young_mechanic_with_modern_laptop_doing_car_diagnostic_at_automobile_repair.jpg) | Nenad Stojković    | CC BY 2.0    |

The hero photo (1024×683) is the same stand-in file used on the singhams-auto-works project — reused
here at the user's request when the hero was rebuilt as a side-by-side split layout (photo box next to
the text, no dark overlay), matching that site's hero format. Attribution for all three is credited in
the site footer, as required by their CC BY / CC BY-SA licenses — keep that credit line if these
photos stay in use.

## When real shop photos are ready

Recommended replacements (same filenames; keep photos roughly landscape/3:2 so nothing reflows):

| Filename                      | Subject                                                              | Size (px)   |
|---------------------------------|-----------------------------------------------------------------------|-------------|
| `hero-auto-repair.jpg`         | Professional mechanic working on an import vehicle in this shop      | ~1024 × 683 |
| `mechanic-inspection.jpg`      | A technician inspecting a vehicle on a lift, in this shop             | 1200 × 800  |
| `technician-diagnostic.jpg`    | This shop's own technician(s) at work                                 | 1200 × 800  |
| `og-image.jpg` (not yet added) | Branded social-share image (shop + name/phone overlay)                | 1200 × 630  |

## Production tips

- Export as **WebP or AVIF** (with a `.jpg` fallback) for the best PageSpeed / Core Web Vitals scores.
- Keep the hero image under ~250 KB and content images under ~150 KB after compression.
- Keep the exact pixel dimensions above so reserved space matches (prevents layout shift / CLS).
- Always keep meaningful `alt` text — update it in `index.html` to describe the new photo.
- Once real shop photos are in, remove the `.photo-credits` line from the footer in `index.html`.
