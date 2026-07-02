# Mobile Comfort Overhaul — Crumbs Bakery & Cafe

**Goal:** Make the Crumbs Bakery website feel effortless and comfortable to browse on a mobile phone — prioritizing instant content, readable text, easy tapping, and no visual oddities.

**Constraint:** $0 budget, single-page site, Vite + React + Tailwind v3 + Framer Motion. No structural changes to layout or content.

## Principles

1. **Content first** — no splash screen, no entrance fade-in >300ms
2. **13px floor for body text, 14px floor for interactive text** on mobile (enforced uniformly)
3. **All touch targets ≥44px** on mobile
4. **Zero horizontal overflow** on a 360px-wide viewport
5. **Touch feedback** on all interactive elements

## Changes

### 1. Remove forced loader + fix entrance animation

- Delete `src/components/Loader.jsx`
- Remove `<Loader>`, `loading` state, `useEffect` timer from `src/App.jsx`
- Change page fade-in `<motion.div>` from `duration: 1` to `duration: 0.3` so content appears immediately

### 2. Bump mobile text sizes — enforced uniformly

Three tiers:
- **Interactive text** (buttons, links, CTAs, nav items, menu labels) → minimum `text-sm` (14px)
- **Body/descriptive text** (review text, product desc, FAQ content, section descriptions, footnotes) → minimum `text-[13px]`
- **Eyebrow/label text** (section labels, stat labels, badge text, metadata) → minimum `text-[11px]`
- **Decorative only** (step numbers, copyright, timestamps) → minimum `text-[10px]`

Every `text-[10px]` → `text-[11px]`, every `text-[11px]` → `text-xs` (if body, treated as 13px goal), every `text-xs` (12px) on interactive → `text-[13px]` or `text-sm`.

### 3. Fix ALL touch targets to ≥44px

| Component | Current | Fix |
|-----------|---------|-----|
| Navbar hamburger button | 22px (icon, no padding) | Add `p-3` |
| Navbar brand logo link | ~28px (text only) | Add `py-3` |
| Navbar mobile links | `py-3.5` (~40px) | `py-4` |
| Navbar ORDER NOW mobile | `py-3.5` (~40px) | `py-4` |
| InstagramSection sidebar items | `px-3 py-2.5` (~32px) | `py-3.5` |
| Footer social icon circles | `w-9 h-9` (36px) | `w-11 h-11` on mobile |
| Footer social label buttons | `px-4 py-2` (~34px) | `py-3` |
| OrderModal close (X) | `p-1` (26px) | `p-3` |
| OrderModal Next/Back/Place | `min-h-10` (40px) | `min-h-11` |
| DeliverySection CTA | `py-3` (~40px) | `py-3.5` |
| About CTAs (bottom links) | ~16px (text only) | Add `py-3 inline-block` |
| About inline links (body anchors) | ~16px (text only) | Add `py-1` |
| NewsSection "Read More" | ~16px (text only) | Add `py-3 inline-flex` |
| NewsSection "View All Posts" | ~16px (text only) | Add `py-3 inline-flex` |

### 4. Fix hero clip-path on mobile

- Wrap clip-path `motion.div` with conditional: no clip animation on mobile
- Show image with simple fade-in (`initial={{ opacity: 0 }} animate={{ opacity: 1 }} duration: 0.6`)
- Remove gradient overlay on mobile (left-to-right gradient meaningless when image is below text)
- Keep full gradient + clip animation on desktop (`md:`)

### 5. Replace announcement bar emoji

- Remove `🎉` emoji on mobile
- Show styled bullet (`w-1.5 h-1.5 rounded-full bg-foreground/60`) on all breakpoints

### 6. Add touch feedback / active states

- All `<button>` and `<a>` interactive elements: add `active:scale-[0.97]` transition

### 7. Tighten vertical padding on mobile

- `py-20` (80px) → `py-12` (48px) on mobile for: SignatureItems, Gallery, Reviews, Contact
- `py-16` (64px) → `py-10` (40px) on mobile for: About, DeliverySection, NewsSection, FaqSection
- `py-14` (56px) → `py-10` (40px) on mobile for: BrowseByBake, ProductCarousel, PromoCards

### 8. Fix whitespace-nowrap overflow in Contact.jsx

- Remove `whitespace-nowrap` from heading line 42

### 9. CategoryGrid mobile height

- `h-[280px]` → `h-[320px]` to accommodate larger expanded text

## Out of Scope

- Full mobile navigation redesign
- Image optimization / WebP
- Performance tuning beyond removing loader
- Tablet-specific layouts
