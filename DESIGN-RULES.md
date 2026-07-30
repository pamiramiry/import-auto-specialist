# Import Auto Specialist — Design Rules

Permanent, load-bearing decisions. Do not silently revert these in future sessions.
This is a **plain HTML/CSS/JS** site (no framework, no build). "Component" below means a
shared markup block + CSS class, not a JS component.

---

## Hero — mobile LAYERING (critical — do not regress)

0. **The overlay lives INSIDE `.hero-media`, not as a sibling of the content.** Three layers:
   `.hero-media` (z-0, `isolation:isolate`, full-bleed) contains the `<img>` **and** the
   `.hero-overlay` (z-1, `pointer-events:none`); `.hero-copy` is z-2 in a separate branch.
   Because the overlay is nested in the z-0 background group, it can only ever dim the **photo** —
   the copy always paints above it, **regardless of whether `.hero-inner` forms a stacking
   context**. The earlier bug was the overlay being a sibling of `.hero-inner` (which carries a
   desktop `z-index:1`): it painted over the copy, greying the headline and "disabling" the Call
   button. **Never** move the overlay back out to be a sibling of the content, and **never** put
   `opacity` on a wrapper that contains text (only the overlay's own gradient alpha).
   - Verified must-holds: H1 is pure `#FFFFFF`; the Call button is full brand blue (identical to
     desktop); no hero element inherits opacity from a parent.
   - `.logo-mark` is hardened white-wrench-on-brand-blue (`filter:none`, `isolation:isolate`,
     explicit `path{fill:#fff}`) so it can never be tinted/dimmed by an ancestor or the overlay.
0b. **Hero vertical rhythm (mobile):** `.hero` is `display:flex; align-items:flex-end;
   min-height:82vh; padding: calc(var(--header-h)+28px) 0 44px`. Copy is anchored **low** over the
   photo — the top photo space clears the header, the bottom padding clears the sticky bar. Do not
   revert to `align-items:center` (leaves a large dead band above the headline).
0c. **Meta block grouping.** Rating + status are one `.hero-meta` group (no loose floating
   elements): stars + "4.5 / 5" on one line, "112 Google reviews" tight beneath, then the status
   pill on its own line. The hero pill is a **single-line, single-weight** plain `<span
   class="status-pill" data-open-status>` — just the live status (dot + text in `.status-line`).
   **Updated 2026-07-29 (rule 41):** the old two-line `.status-pill--stack` with the
   "Send a request anytime" second line is REMOVED — the estimate affordance is now the hero button
   (rule 39). The `.status-pill--stack` / `.status-note` CSS and the `data-request-note` JS branch
   are gone. Do not re-add a second line to the pill.
0d. **Sticky bar:** all three labels are the **same** near-white (`.mobile-bar-btn{color:#EDF0F4}`),
   all three icons blue; the third item is **"Estimate"** (message-bubble icon, → `#estimate`) with
   **no** filled tile and **no** blue label (`.mobile-bar-primary` only clears the background).

## Hero — mobile (≤640px)

1. **Full-bleed photo hero — ALL viewports (unified 2026-07-29, see rules 39, 43).** The hero photo is
   a full-bleed background behind the copy on every breakpoint (the old desktop two-column split is
   gone). **The hero layout + scrim breakpoint is 1024px (2026-07-30):** ≥1024 = centred content +
   horizontal scrim; <1024 = low-anchored content + vertical scrim. Headline, subhead, rating, status
   and CTA all sit on top.
   - Implemented by keeping `.hero-inner` (the centred `.container`) `position:static` so the
     absolutely-positioned `.hero-media` resolves to `.hero` and fills it (BASE rules). `.hero-overlay`
     is NESTED inside `.hero-media` (see rule 0). The `<1024` overrides live in `@media
     (max-width:1023px)`; ≤640 holds only finer typography/spacing (fonts, container gutter, sticky
     bar). Legibility is scrim-only — NO text-shadow (rule 43).
2. **The trust strip (`.credibility`) sits immediately below the hero.** Both are dark; the
   transition reads as continuous. Mobile `.credibility` padding is tight (`22px 0 28px`) so the
   gap matches the hero's internal rhythm (item 12 of the brief).
3. **Single image source of truth.** The hero photo path lives in exactly one `<img class="hero-photo">`.
   It carries a `// TODO: swap for real shop photo` comment. Do not duplicate the path into a CSS
   `background-image`.

## Hero — copy & CTAs

4. **Headline stays inclusive.** H1 = **"Expert Auto Repair for Every Vehicle"** with
   `text-wrap: balance`. The brief proposed an import-only "Scarborough's Import Repair
   Specialists"; the owner confirmed (2026-07-24) they service **both import and domestic**, and
   we deliberately broadened the H1 so domestic owners aren't excluded. **Confirmed final
   (2026-07-29)** — the storefront sign shows "Complete Auto Service", domestic AND import. **Do not
   re-narrow the H1 to imports only** and do not change it (see rule 38).
5. **No eyebrow pill in the hero.** The old "SCARBOROUGH …" eyebrow is removed (redundant, failed
   contrast). Do not reintroduce it.
6. **Subhead bans hype words** (reliable, honest, expert, quality, professional, trusted, clear
   communication) and **carries the local keyword** the H1 lacks. Current (both viewports, shortened
   2026-07-29 to two lines on mobile): "Diagnostics, maintenance and repairs **in Scarborough** —
   with a clear estimate before any work starts." NOTE: this dropped the explicit "domestic and
   import vehicles" phrase; scope is still covered by the H1 ("for Every Vehicle"), the header
   tagline ("Complete Auto Service"), and the "Domestic & Import" trust card (rule 38) — so it does
   NOT imply import-only. Do not re-narrow.
7. **Hero CTAs: primary "Get a Free Estimate" everywhere + secondary GHOST "Call" on DESKTOP/TABLET
   only (updated 2026-07-29, rule 55).** `.hero-cta-row` holds the primary solid-blue **"Get a Free
   Estimate"** → `#estimate` and a secondary **"Call (416) 913-2394"** (`.btn-hero-call`, ghost — see
   rule 46, `tel:`). Buttons are a ROW ≥1024, STACKED full-width 641–1023. **≤640 the Call button is
   HIDDEN** (`.btn-hero-call{display:none}`) — calling is already covered by the mobile header phone and
   the sticky bottom bar, so the hero shows only the Estimate button. (This re-establishes the original
   ≤640 hide; the brief 2026-07-31 reversal is itself now reversed.) Beneath the CTA row is ONE muted
   **trust line** (rule 51). The old separate `.hero-microcopy` "Free estimates · Most repairs same day"
   line is GONE — folded into the single trust line. See rules 45–46, 51, 53.

## GoogleRating (shared component)

8. **One rating block, used everywhere** (hero + credibility card, and any future spot). Markup:
   `.google-rating > .gr-top(.gr-stars + .gr-score) + .gr-count`. Add `.google-rating--center`
   for centred contexts. Renders: 5 stars with a real **half-star** (muted base star + amber copy
   clipped to its left half via `clip-path`), **"4.5 / 5"**, and **"112 Google reviews"** below.
   Keep the markup byte-for-byte identical across usages. Stars reuse the `#star-icon` `<symbol>`
   via `<use>` (no duplicated gradient IDs).

## Open/Closed status (script.js)

9. **Never display the bare word "Closed."**
   - Open → green dot, **"Open now · closes 5 PM"**.
   - Closed → **"Opens today at 9:00 AM"** or **"Opens Monday at 9:00 AM"** (weekday name, not
     "tomorrow"). **Dot colour (updated 2026-07-29, rule 50):** in the HERO inline status the closed
     dot is now **AMBER** (`var(--amber)`), open is green — a state-driven traffic-light the user asked
     for. The CONTACT-section `.status-pill` keeps its **neutral grey** closed dot (it's not over the
     photo). So "never amber" now applies to the contact pill only, not the hero.
   - The hero pill is **single-line** (dot + status text only) — the "Send a request anytime" second
     line was removed 2026-07-29 (rule 41). All pills render one `.status-line`.
   - Hours are Mon–Fri 09:00–17:00 America/Toronto. Pill stays hidden until JS runs.
10. The old separate "Scarborough · Mon–Fri" hero pill is gone; the live status replaces it.

## Colour / the "single blue" rule

11. **The hero "Get a Free Estimate" button is the only solid blue on screen** (updated 2026-07-29 —
    it was the Call button). The sticky bar's **Estimate** tile is neutral dark like Call/Directions,
    with a **blue icon only** (not a filled blue block). Keep it that way.

## Header

12. **Header matches the hero's top colour on mobile.** At ≤900px `.site-header` background is
    solid `var(--charcoal)` (= `rgb(20,23,28)`), the same colour the hero overlay starts at, so the
    header→hero seam reads as one band instead of a mismatched dark. Don't return it to the
    translucent `rgba(20,23,28,.92)` on mobile (its transparency reveals the white body and reads
    lighter than the hero).
12a. **Logo lockup sub-line = the shop's tagline "Complete Auto Service"** (`.logo-sub`, CSS
    uppercases it; shown >1220px, hidden below to save nav space). Taken from the storefront sign
    (2026-07-29). NOT the location — the subhead carries "in Scarborough". Don't revert it to
    "Scarborough Auto Repair" (see rule 38).

## Contrast (WCAG AA)

13. Hero body/muted text uses light tones (`#ECF1F7` subhead, `#C4CBD6` for count/microcopy) over the
    scrim. **NO text-shadow (rule 43)** — legibility is the scrim's job; the copy column sits in the
    scrim's darkest band (left on desktop, bottom on mobile). Keep hero muted text ≥ `#C4CBD6`.
    Closed-status pill text/dot are neutral grey that passes AA on both the dark hero glass and the
    light contact section.

## Overflow

14. **No horizontal scroll at 320 / 390 / 430.** `html { overflow-x: clip }` (keeps sticky working)
    plus `body { overflow-x: hidden }`. The hero adds nothing past the viewport (verified
    `scrollWidth == clientWidth`). The reviews carousel intentionally overflows *inside* its own
    `.reviews-track` scroll container — that's expected, not a page-overflow bug.

## Tooling caveat

15. Headless Edge on this machine floors the layout viewport at ~480–496px, so narrow renders
    (390/430) clip the right edge as an **artifact, not a real bug**. Verify real overflow by
    comparing `document.documentElement.scrollWidth` vs `clientWidth`, not by eyeballing a
    "cut off" narrow screenshot.

---

## Desktop hero + trust cards — DONE (2026-07-28 Parts 2–5)

16. **Nav** is Home / Services / Reviews / About / Contact. **"Why Us" is removed** from the
    desktop nav and the mobile menu. **UPDATE 2026-07-29: the `#why` "Why Choose Us" section is now
    DELETED entirely and merged into `#about`** (they overlapped heavily — both restated service
    quality, named 777 Warden Ave., and had their own CTA pair). All footer "Why Choose Us" quick-links
    (`/#why` / `#why`) were removed site-wide. The `.why` / `.why-list` CSS stays (reused by the service
    pages' "What's Included"); `.why-grid/.why-media/.why-text/.why-actions` are now dead CSS (kept,
    harmless). `images/mechanic-inspection.jpg` is now unused. Do NOT re-add a separate Why section.
17. **No offset rectangle / no boxed image.** As of 2026-07-29 the hero photo is **full-bleed** (no
    box, no border, no radius, no shadow — see rule 39). The old `.hero-media::before`/`::after`
    offset panel and the boxed `aspect-ratio:3/2` + border + `--shadow-lg` treatment are gone. Do
    not reintroduce the offset panel, the inset image element, or the two-column grid.
18. **Header seam (final):** the desktop header is **fully transparent at rest with no border**,
    and the hero's background is **pulled up behind it** (`@media (min-width:901px){ .hero{
    margin-top: calc(-1 * var(--header-h)); padding-top: calc(var(--header-h)+40px) } }`) so the
    header and hero render as ONE continuous background — there is no seam/line under the nav. On
    `.scrolled` (>20px, over the light content below) the header becomes a defined glass bar
    (`rgba(20,23,28,.95)` + blur + border + shadow). Mobile (≤900px) header stays solid
    `var(--charcoal)` and the hero is NOT pulled up. Do not give the desktop header an opaque
    background or a border at rest — that's what created the seam.
19. **Dead space (final):** desktop hero padding `calc(header+40px) 0 30px` with the pull-up above,
    `.credibility` top padding `18px` on desktop — trust row sits within the fold at 1440x900.
    (Base non-desktop hero padding `56px 0 44px`; base `.credibility` `28px 0 44px`.)
20. **Desktop meta + CTA** match the mobile grouping: `.hero-meta` (rating + `.hero-status`) is one
    group; `.hero-actions` is a column so the microcopy sits directly beneath the Call button,
    left-aligned to it.
21. **Headline: KEPT "Expert Auto Repair for Every Vehicle"** at the user's explicit instruction
    (2026-07-28), overriding the brief's item 13 ("Scarborough Auto Repair for Every Make"). NOTE:
    this means the H1 retains "Expert", which the brief's banned-word list flags — kept by explicit
    user choice. `text-wrap: balance`, two lines at ≥1440px.

## Trust cards (credibility strip)

22. **Only cards with real content render.** Currently **3**: a real **Google-review quote** card
    (`.cred-card--quote`, with the 4-colour Google G — NO stars, so the hero's 4.5/5 is not
    duplicated), a **"Domestic & Import"** scope card (plain `.cred-card`, car icon; body "Complete
    auto service for every make — foreign and domestic."), and a **location card that is a
    whole-card link** to Maps directions (`.cred-card--location`). The Domestic & Import card was
    briefly deleted as an unsupported hedge, then **reinstated 2026-07-29** — the storefront sign
    confirms it, and it answers the obvious "is this import-only?" question the business name raises
    (see rule 38). Also deleted earlier: "Honest, Clear Communication" (banned words, unfalsifiable).
23. **Grid:** `repeat(3, 1fr)` desktop AND tablet (capped `max-width:1040px`, centred), **1 column**
    at ≤640px. All cards share one subtle `--charcoal-line` border (no blue "active" outline) and are
    vertically centred with equal padding + `min-height`. One more real card is **scaffolded as an
    HTML comment** (warranty / 310S techs / years / vehicles serviced); to restore 4 columns,
    uncomment it AND set `.cred-grid` to `repeat(4,1fr)` + adjust the max-width cap — no other
    rework needed.
24. **Location subtext never advertises weekday-only.** Uses a landmark instead: "In Scarborough's
    Golden Mile, on Warden Ave."
25. **Banned words** (expert, reliable, honest, quality, professional, trusted, clear
    communication) do not appear in the hero (except "Expert" in the H1, kept per user) or the
    trust cards. NB the `#why` and reviews sections *below* the trust cards still contain some of
    these — out of scope under the "don't change below the trust cards" rule.

## Global

26. **GoogleRating** shared block renders the rating in the hero (the only in-scope rating instance
    now that the trust card is a quote). The reviews-summary (below trust cards) and service-page
    trust strips have their own star markup — unifying them site-wide is deferred (separate files /
    below-trust-cards constraint). The reviews-summary half-star depends on a `<linearGradient
    id="half">` that now lives in the shared SVG sprite at the top of `<body>` (do not remove it).
27. **Contrast:** hero/trust muted text audited to WCAG AA — hero `#C4CBD6`/`#E4E8EF`, trust
    `#AEB6C2`/`#E8EBF0`/`#8FB6E6` all ≥ ~7:1 on their dark backgrounds.
28. **Spacing:** `.hero-copy` is a flex column with a single `gap` (22px desktop / 18px mobile) and
    `> * { margin: 0 }` — no per-child one-off margins.

## Sticky header (2026-07-28)

29. **`body` MUST use `overflow-x: clip`, never `hidden`.** `overflow-x: hidden` on `<body>` makes it
    a scroll container and **breaks `position: sticky`** on the header (it scrolls away). `clip`
    contains horizontal overflow without that side effect. `html` is also `overflow-x: clip`.
29b. **`html { background: var(--charcoal) }`** — the root/canvas colour must be dark. `<body>` is
    white, and without a root background that white propagates to the canvas, showing as a **white
    band above the sticky header on overscroll/rubber-band**. Hero and footer are both charcoal, so a
    charcoal root blends at both ends. Do not remove it (and if the top/bottom sections ever stop
    being dark, revisit).
29c. **Desktop hero over-pull (`@media min-width:901px`)** — the hero pull-up is
    `margin-top: calc(-1 * var(--header-h) - 2px)` with `padding-top: calc(var(--header-h) + 42px)`
    (NOT a flat `-74px`/`+40px`). The extra 2px of over-pull guarantees the hero covers device-pixel
    row 0 under **fractional Windows display scaling (125%/150%)**, where the sticky header (its own
    compositor layer) and the hero's pull-up can round to different device rows and expose a **1px
    white hairline of `<body>` under the address bar**. The 2px is added back to top padding so
    content position is unchanged. This is distinct from 29b (that one is overscroll; this one is the
    at-rest top seam). Headless Edge does NOT reproduce it (software compositor snaps the layers) —
    keep the over-pull regardless.
30. **Header is `position: sticky; top: 0; z-index: 50`** (not fixed — avoids layout shift). z-50 is
    above every hero layer (they top out at z-2); the mobile menu (`z-999`) stays above the header.
31. **Two states (threshold 80px, updated 2026-07-30):** at rest (scroll ≤80px) transparent/blended
    with the hero, with a top gradient band for nav legibility (rule 44). Scrolled (`>80px`, class
    toggled by JS) → **SOLID** `rgba(20,23,28,.97)` (NO backdrop-filter/blur) + 1px
    `rgba(255,255,255,.08)` bottom border + soft shadow, the top band fades to `opacity:0`, and
    `.header-inner` height shrinks `--header-h`→`--header-h-scrolled`. All transition together over
    **200ms ease-out**. `prefers-reduced-motion` switches states instantly.
32. **Scroll handler is rAF-throttled** (schedule a frame, apply once per frame) — never an
    unthrottled scroll listener. `html { scroll-padding-top: calc(var(--header-h-scrolled) + 10px) }`
    so in-page anchors clear the scrolled header.
33. **Mobile:** header sticks the same way; hamburger open locks body scroll (`body.style.overflow =
    'hidden'`) and the menu panel (`z-999`) renders above the header. The sticky bottom action bar is
    independent — it must NOT be animated by the header's scroll logic.

## Nav item baseline (2026-07-28)

34. **All five nav items share one box** so they sit on one baseline. `.nav-link` (used by the four
    anchors AND the Services `<button>`) is `display: inline-flex; align-items: center;
    line-height: 1;` with identical `padding: 10px 12px; margin: 0`. `button.nav-link` clears UA
    button styling (`background:none; border:0`). The caret is `.nav-caret { width:14px; height:14px;
    flex-shrink:0; margin-left:4px }` — fixed size, never affects the text baseline. Verified: all
    five items measure identical top/height at 1440 and 1920, so the active underline never shifts.

## No online booking — estimate-request framing only (2026-07-28) — LOCKED

35. **There is NO online booking / scheduling system.** The shop takes requests by phone or via a
    simple estimate-request form. NEVER reintroduce booking, scheduling, calendars, date/time
    pickers, availability, or appointment-slot language anywhere on the site (homepage, service
    pages, 404, template, privacy, JSON-LD, meta). This is a business fact, not a style choice.
36. **All CTAs are Call or estimate-request only.** Every non-Call CTA points to the estimate form
    at **`#estimate`** (the `.contact-form-wrap`) and reads **"Get a Free Estimate"** (desktop nav
    `btn-sm`, Why/About sections, service-page CTAs) or **"Estimate"** (mobile sticky bar). The form
    heading is "Get a Free Estimate", sub "Tell us what's going on and we'll call you back with a
    price.", fields = name, phone, vehicle (year/make/model), issue description; submit = **"Request
    Estimate"**. No email/date/service-select fields. `#estimate-form` + `.estimate-form` in markup
    and `script.js` (validates name/phone/vehicle/message).
37. **Terminology: "estimate", never "quote"** in our own copy (marketing, FAQs, meta, feature
    lists, CTA bands). The ONLY allowed "quote" is inside a **verbatim customer review** — never
    reword a real review to fit the rule (that would be dishonest). "Free estimates" microcopy under
    the hero Call button sets the tone; keep everything consistent with it.

## Scope: domestic AND import (2026-07-29) — LOCKED

38. **The shop services DOMESTIC AND IMPORT vehicles** — confirmed by their storefront sign, whose
    tagline is **"Complete Auto Service"**. This resolves the ambiguity the business name ("Import
    Auto Specialist") raises. Consequences, all now in place: header sub-line = "Complete Auto
    Service" (rule 12a); a "Domestic & Import" trust card states it plainly (rule 22); H1 stays the
    inclusive "Expert Auto Repair for Every Vehicle" (rule 4, confirmed final). **Never write copy
    implying import-ONLY** anywhere on the site. "Particular expertise in imports" (FAQ) is fine as a
    differentiator — it does not exclude domestic. The business name is not the scope; the sign is.
    (NB the hero subhead no longer spells out "domestic and import" after the 2026-07-29 shortening —
    scope is carried by the H1 + tagline + trust card instead; see rule 6.)

## Hero — unified full-bleed + scrim (2026-07-29) — LOCKED

39. **One hero treatment on every viewport: full-bleed background photo, CSS-only.** The desktop
    two-column split (text left / inset photo right / flat near-black bg) is GONE. Structure now
    (base rules, not media-query-gated): `.hero` is `position:relative; display:flex;
    align-items:center; min-height:85vh; overflow:hidden` with a charcoal fallback bg. `.hero-inner`
    (= the centred `.container`, `position:static`) holds `.hero-copy` (z-2, `max-width:620px`,
    left-aligned, `text-shadow` for legibility) and `.hero-media` (`position:absolute; inset:0;
    z-0`, resolves to `.hero` → full viewport width). `.hero-media img` is `width/height:100%;
    object-fit:cover` — **no** box, border, radius, shadow, or baked-in overlay. Content is
    vertically centred (desktop/tablet); **mobile overrides** to `align-items:flex-end; min-height:
    82vh` and keeps the vertical scrim (copy anchored low). Do NOT reintroduce the inset image, the
    two-column grid, or a flat background. Do NOT bake transparency/overlays into the image file.
40. **Scrim = TWO stacked CSS gradients on `.hero-overlay` (rewritten 2026-07-31).** Desktop (≥1024):
    a horizontal `linear-gradient(90deg, rgba(9,12,16,.88) 0%, .72 30%, .35 58%, 0 80%)` (protects the
    left copy) PLUS a vertical `linear-gradient(180deg, rgba(9,12,16,.55) 0%, .15 35%, .30 70%, .85
    100%)` (seats content, blends top/bottom). Mobile (<1024): vertical-ONLY `linear-gradient(180deg,
    rgba(9,12,16,.55) 0%, .20 30%, .55 62%, .90 100%)` (stronger at the bottom where the copy sits).
    **CRITICAL: no blurred box, no backdrop-filter ANYWHERE in the hero (incl. the status pill), no
    vignette, no flat overlay, no text-shadow, no detectable edges/seams.** Verified no box/seam/band
    at 390/768/1440/1920. Focal point `object-position: center 60%` (desktop landscape — keeps the
    lifted vehicle + brake rotor, crops the ceiling joists) / `center 42%` (<1024 portrait). Contrast
    ≥4.5:1 (subhead `#ECF1F7` ~7.8:1 at the brightest point; proof/microcopy sit in the darkest scrim
    band). The `.status-pill` is a plain translucent `rgba(14,18,24,.68)` pill (NOT frosted).
41. **Hero status pill is single-line / single-weight** (see rule 0c). The two-line
    `.status-pill--stack` + `.status-note` "Send a request anytime" is removed; the estimate
    affordance is the hero button (rule 39). No `data-request-note` in markup or JS.
42. **Desktop nav phone is interactive and secondary.** `.header-phone` is weight **500** (lighter
    than the `600` filled Estimate button so the button stays primary), colour `#E8EDF3`, and on
    hover/focus gets **underline + colour shift to `#FFFFFF`** (icon shifts blue→`#8FB6E6`). It must
    read as a link, not static text, but must not out-weight the button.

## Hero — final legibility/nav/CTA pass (2026-07-30) — LOCKED

43. **NO text-shadow anywhere in the hero.** Legibility comes ENTIRELY from the `.hero-overlay`
    gradient scrim (rule 40). Do not re-add `text-shadow` to `.hero-copy`, the headline, or any hero
    text. (The `.gr-stars` amber `filter: drop-shadow` on the rating icons is not text-shadow and is
    fine.)
44. **Nav top gradient band.** `@media (min-width:901px) .site-header::before` = a ~120px-tall
    `linear-gradient(to bottom, rgba(0,0,0,.75), transparent)`, `pointer-events:none`, that keeps the
    nav legible over the photo while the header is transparent at rest. It fades to `opacity:0` on
    `.scrolled` (the solid bar takes over). CRITICAL paint-order fix: `.header-inner` is
    `position:relative; z-index:1` so the nav content paints ABOVE the band (an absolutely-positioned
    `::before` otherwise paints over static in-flow content and washes out the nav).
45. **One hero breakpoint = 1024px** for scrim + layout + CTA arrangement (`@media
    (max-width:1023px)`). BUT the secondary hero **Call** button is tied to the **sticky bar** (≤640),
    not 1024: hidden ≤640 (sticky bar owns Call), shown ≥641. The header→hamburger + solid-charcoal
    switch stays at 900, and the desktop hero pull-up at ≥901 — those are unchanged and compatible
    (at 901–1023 the transparent pulled-up header sits over a low-anchored/vertical-scrim hero, nav
    legibility via rule 44).
46. **Secondary hero Call button** (`.btn-hero-call`) — high-contrast GHOST (restyled 2026-07-31 so it
    reads clearly on the photo): `background: rgba(255,255,255,.08)`, `border: 1.5px solid
    rgba(255,255,255,.85)`, white text + icon, `tel:`. Hover/focus: fill to solid `#FFFFFF`, text to
    `var(--charcoal)`. Shares `.btn.btn-lg` with the primary so height/padding/radius match. It is the
    ONE exception to rule 11's "single solid blue" (it's an outline button). Do not make it low-contrast.

## Hero — image, mobile-header call, rating link, scroll cue, proof line (2026-07-31) — LOCKED

47. **Hero image = real `<img>` (not CSS `background-image`) in a `<picture>`.** Mobile ≤640 `<source>`
    = portrait `images/hero-mobile.webp` (UNCHANGED — do not swap). Desktop/tablet `<img>` =
    `images/hero-import-auto.webp` (1672×941 landscape), `fetchpriority="high"`, `decoding="async"`,
    NOT lazy-loaded (it's the LCP), descriptive alt, `width/height` set (no CLS — the img fills the
    absolute `.hero-media`, sized by the hero). A responsive `srcset` for the desktop image is STUBBED
    in an HTML comment: when `-1440/-1024/-640` variants are added to `images/`, uncomment it. Do NOT
    bake cropping/overlays into the files — the CSS scrim (rule 40) + `object-fit:cover` do the work.
48. **Mobile header tap-to-call, rating link, scroll cue, proof line.**
    - `.header-call-mobile`: visible ≤900 (hidden ≥901; desktop nav phone covers it), left of the
      hamburger, `tel:`, ≥44px target. Shows the number ≥501px, collapses to icon + "Call" ≤500px so
      it never wraps / pushes the hamburger off (Call now reachable from header, hero, AND sticky bar).
    - **Rating is a real link:** `a.google-rating` → `https://www.google.com/maps?cid=11650676435894463387`
      (`target=_blank rel="noopener noreferrer"`), with the multicolour Google **G** (`.gr-g`) before
      the stars; count underlines on hover; tap target padded to ≥44px. It's the ONLY `.google-rating`
      instance (rule 26), so making it a link doesn't affect other usages.
    - `.hero-scroll-cue`: **REMOVED 2026-07-29 (rule 55).** The chevron/float/`heroCueFloat` keyframes
      are deleted — the section below already peeks above the fold, so the cue was redundant. Do not
      re-add a scroll-down affordance to the hero.
    - `.hero-proof`: muted white (`rgba(255,255,255,.62)`) trust line under the CTA row — "Licensed
      technicians · Warranty on parts and labour · Serving Scarborough". PLACEHOLDER: an HTML `TODO:
      confirm with client` comment sits above it (years/warranty term/certs). Kept in static HTML
      (not a JS constants file) so it stays in the LCP/no-JS path.
49. **Sticky-bar Estimate icon = clipboard** (not a speech bubble — a bubble reads as live chat). Call
    and Directions icons unchanged (rule 0d). **Applied SITE-WIDE 2026-07-29** — the homepage, all service
    pages, the new auto-body page, and 404 now use the identical clipboard path (`d="M9 5H7…M9 16h4"`); the
    old speech-bubble (`d="M4 5h16…1-1z"`) is gone everywhere. Keep it identical across every page.

## Hero — scrim strengthen / one-row meta / two-item mobile trust line (2026-07-29) — LOCKED

50. **Rating + live status share ONE row (`.hero-meta`).** The old stacked layout (rating block above a
    rounded status pill) is GONE. `.hero-meta` is now a `flex-direction:row; flex-wrap:wrap` line reading
    **`[G]  ★★★★½  4.5   112 Google reviews   ·  ● <live status>`**. Details:
    - `.google-rating` is now an **inline row** (`flex-direction:row`): G + stars + score + count on one
      line (the `.gr-top` wrapper is gone). Score text is **"4.5"** (dropped the "/ 5" — the count says
      "Google reviews"). Star size 17px. Count colour raised to `#d1d5db`. It remains the real Google-
      profile link (rule 47/26) and the ONLY `.google-rating` instance, so restructuring it is safe.
    - The status is now **`.hero-status-inline`** — plain inline text (NOT a `.status-pill` chrome chip),
      with a **state-driven dot**: green (`--success`) when open, **amber (`--amber`) when closed** (rule 9).
      It's `display:none` until `script.js` adds `.is-open`/`.is-closed`; that class also reveals a leading
      `·` separator via `::before`, so there's **no dangling middot when JS is off**. The `·` is hidden
      ≤640 (the row wraps, so the dot alone delimits the status). `script.js` is UNCHANGED — the dot colour
      is CSS-driven off the JS-computed state, satisfying "computed in JS, not a hardcoded string."
    - `.hero-copy .status-pill` CSS is now dead (kept, harmless). The contact-section pill still uses
      `.status-pill`.
51. **ONE hero trust line (`.hero-proof`), colour `#d1d5db`.** Exactly **three** items on desktop:
    **"Licensed technicians · Warranty on parts and labour · Most repairs same day."** The third item is
    wrapped in `.hero-proof-last`, hidden ≤640 so **mobile shows two items and wraps cleanly (no dangling
    "·")** — this fixes the mobile truncation bug. "Serving Scarborough" (already in the subhead) and
    "Free estimates" (already the button label) were removed to kill repetition. The separate
    `.hero-microcopy` element is deleted. TODO comment (confirm warranty term / certs with client) stays.
52. **Strengthened scrim + right-third vignette + image brightness (desktop scrim, supersedes rule 40's
    desktop gradient).** `.hero-overlay` desktop background is now THREE layers, all `rgba(0,0,0,…)`:
    (a) a **radial vignette over the right third** — `radial-gradient(120% 135% at 100% 45%, .72 → .40 @26%
    → .12 @46% → 0 @62%)` — that mutes the bright red taillight so it stops out-competing the primary CTA
    (this is the ONE sanctioned exception to rule 40's "no vignette"; soft falloff = still no visible edge);
    (b) a **strong horizontal scrim** `linear-gradient(90deg, .80 0% → 0 ~58%)` for the left copy; (c) a
    vertical seat `linear-gradient(180deg, .45 → .10 @30% → .28 @72% → .82 100%)`. PLUS `.hero-media img`
    carries **`filter: brightness(0.92)`** (all viewports) so the subhead never loses legibility crossing
    the car body. Mobile (<1024) scrim stays vertical-only (rule 40) and inherits the brightness. All hero
    text verified WCAG AA (subhead ~10:1, trust line/count `#d1d5db` ~11:1, status `#E4E8EF`).
## Header parity — every page's nav matches the homepage (2026-07-29) — LOCKED

54. **All pages share ONE header treatment, identical to the homepage.** The service pages + 404 (and
    the slim privacy header) previously drifted; brought back into line:
    - **`.service-hero` gets the desktop pull-up** (`@media min-width:901px`): `margin-top: calc(-1*
      var(--header-h) - 2px); padding-top: calc(var(--space-5) + var(--header-h) + 2px)` — the SAME
      device-row-0 over-pull as `.hero` (rule 29c). WHY: `.site-header` is transparent at rest on desktop
      (rule 18); without the pull-up the white `<body>` shows through the transparent nav as a washed-out
      silver band (the dark `::before` band over white) and the nav links lose contrast. Pulling the dark
      `.service-hero` up behind the header makes nav+hero one continuous dark background, exactly like the
      homepage. Content position is unchanged (padding cancels the margin).
    - **Logo sub-line = "Complete Auto Service"** on every page (was "Scarborough Auto Repair" on the
      inner pages) — see rule 12a. Applies to privacy's slim header too.
    - **No "Why Us" nav item** anywhere (desktop `.nav-link` AND the mobile-menu `.mobile-link`) — matches
      the homepage's 5-item nav (rule 16). The FOOTER "Why Choose Us" quick-link (`/#why`, no class) is a
      different component and is LEFT in place on all pages.
    - **`.header-call-mobile`** (mobile tap-to-call, left of the hamburger — rule 48) is now present on
      every page's header, not just the homepage.
    Keep new service pages in sync: the `_service-template.html` header is a `{{PASTE}}` placeholder —
    copy the header + mobile menu verbatim from any built service page (which now carry all of the above).

55. **Mobile hero specifics (2026-07-29 brief).** ≤640: hero `min-height:88vh` (a sliver of the next
    section shows); H1 `font-size:2.15rem; line-height:1.08` (louder than the CTA, tighter leading);
    in-hero Call button **hidden** (rule 7); portrait `object-position: center 55%` so the crop lands on
    the lifted vehicle / brake rotor, not a blank body panel (object-fit:cover only — nothing baked into
    the file); scroll cue removed (rule 48). Sticky bar bottom padding bumped to
    `calc(8px + env(safe-area-inset-bottom))` so the labels aren't clipped.
