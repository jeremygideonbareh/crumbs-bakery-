# Session Handoff — Crumbs Bakery Website

## What Was Built

Full bakery website for Crumbs Bakery & Cafe, Shillong — matching reference site with pink/teal palette, Bebas Neue + Montserrat typography.

### Components (in render order)

| # | Component | Description |
|---|-----------|-------------|
| 1 | `AnnouncementBar` | Top promo bar — "FREE DELIVERY" + "ORDER BY 2PM" |
| 2 | `Navbar` | Full menu bar (CAKES, CUPCAKES, COOKIES, BROWNIES, ABOUT, REVIEWS, CONTACT) with teal bg |
| 3 | `HeroSection` | Split layout with social proof counter (4.9★, 500+, 7+ Years) above H1, clip-path image reveal |
| 4 | `CategoryGrid` | 6-item horizontal hover-expand accordion (image cards with vertical text on collapse) |
| 5 | `About` | 3-column image cards with inline anchor links to menu sections |
| 6 | `SheetCakesMarquee` | Infinite horizontal scroll of cake images on teal background |
| 7 | `BrowseByBake` | Category grid with hover zoom |
| 8 | `SignatureItems` | Existing signature items section |
| 9 | `ProductCarousel` | Drag-scrollable product cards with prices & "Add to Order" |
| 10 | `DeliverySection` | Delivery area cards with area descriptions & CTA |
| 11 | `Gallery` | Existing gallery with masonry layout |
| 12 | `InstagramSection` | Instagram-style grid with hover overlays |
| 13 | `PromoCards` | 3 promo cards (Bake Club, YouTube, Cookie Club) |
| 14 | `Reviews` | Existing testimonials/reviews section |
| 15 | `NewsSection` | News/blog article cards |
| 16 | `FaqSection` | Image card accordion with 9 FAQ items |
| 17 | `Contact` | Existing contact section with order button |
| 18 | `Footer` | 4-column footer (brand, quick links, contact, follow us) with teal bg |

### Fixes Applied (Jun 29)

- **InstagramSection** — Replaced all 12 truncated Unsplash photo IDs (10-digit prefixes that returned 404s) with the same full-length IDs used elsewhere in the project. Images now render correctly.

### Mobile Optimization (Jun 29)

- **Global CSS** — Added `touch-action: manipulation` on all interactive elements (removes 300ms tap delay), `prefers-reduced-motion` support, overflow-x hidden on body, tap highlight transparency, scrollbar-gutter stability, and `-webkit-text-size-adjust: 100%`
- **Navbar** — Added semi-transparent backdrop overlay behind mobile drawer; increased link touch targets to 44px+ with full-width tap areas; replaced height-based AnimatePresence animation with transform/opacity for smoother open/close
- **HeroSection** — Reduced h1 mobile clamp from `text-5xl` to `text-[2rem]`; reduced social proof counters to `text-lg`; reduced image to `40vh` (was 50vh); tightened spacing, padding, and gap values; increased button touch targets to `min-h-[44px]`
- **CategoryGrid** — Added `activeIndex` state for tap-to-expand on mobile (no hover on touch devices); reduced mobile height to 280px; tighter padding on mobile
- **ProductCarousel** — Switched from Framer Motion `drag` to native CSS `overflow-x: auto` with `snap-x` scroll on mobile (Framer drag is janky on touch); reduced card min-width to 180px on mobile; made "Add to Order" touch target 44px tall
- **InstagramSection** — Grid changed from `grid-cols-3` to `grid-cols-2` on mobile (3-col cells were too small to tap); hover overlays disabled on mobile (`md:group-hover:opacity-100`)
- **FaqSection** — Increased button min-height to 56px; larger chevron icon; tighter padding
- **AnnouncementBar** — Text now truncates with `whitespace-nowrap` on mobile to prevent overflow; condensed copy ("IN SHILLONG" removed on mobile)
- **Gallery** — Lightbox navigation buttons increased from 36px to 44px (WCAG compliance); removed `whitespace-nowrap` from heading
- **Reviews** — Removed `whitespace-nowrap` from heading to prevent overflow
- **PromoCards** — Aspect ratio changed to 16:9 on mobile (was 4:3) to reduce card height
- **Contact** — Map height increased to 300px on mobile; button touch targets set to 44px

### Design Tokens

- **Colors**: `bg-header` (#C2DAE8 Delicate Blue), `bg-footer` (#F8E0E8 Pink Marshmallow), `bg-background` (#fff5f0 warm white), `--primary` (hsl 340 63% 93% Pink Marshmallow), `--secondary` (hsl 202 45% 84% Delicate Blue), `--accent` (hsl 59 66% 82% Yellow Swatch), `--main` (#F8E0E8 Pink Marshmallow), all text `text-foreground` (#3d2b1f dark brown)
- **Fonts**: `font-display` (Bebas Neue) for large headings, `font-work` (Montserrat/Work Sans) for body, `font-serif` (Fraunces) for decorative italic accents
- **Images**: All from Unsplash

### Palette Swap (Jul 1) — PANTONE Pastels

Replaced the old teal/pink palette with PANTONE pastels:
- **Pink Marshmallow #F8E0E8** → `--primary`, `--main`, `bg-footer` (brand accent + button bg + footer)
- **Delicate Blue #C2DAE8** → `bg-header`, `bg-footer-bar`, `--secondary` (header/nav/marquee/announcement bg)
- **Veiled Vista #C8E4CA** → available for future section backgrounds
- **Yellow Swatch #F1F0B0** → `--accent`, `announcement` (highlight/announcement bg)

Key constraint: all four colors are light pastels — unusable as text on light backgrounds. Every `text-primary`, `text-header`, and `hover:text-header` replaced with `text-foreground` (dark brown #3d2b1f). Colors used exclusively for `bg-*`, `border-*`, and opacity tints.

### CharReveal Fix (Jul 1)

Spaces in `CharReveal` rendered as `\u00A0` (non-breaking space) to prevent whitespace collapse inside `inline-block` spans — fixes headings like "A taste of what we bake" rendering as "Atasteofwhatwebake".

## Build

```bash
npm run build  # Vite — builds to dist/
npm run dev    # Dev server
```

## Known Issues

- Reference site's emoji-only bullets ("CAKES 🍰", "CUPCAKES 🧁") not implemented — text-only labels instead
- Some hover animations may differ slightly from reference due to framer-motion limitations
- Product carousel uses static mock data — needs real product API
- Contact section still uses old layout — not yet updated to match reference
- All four PANTONE pastels are light — only usable as bg/border/tint, not text color (dark brown #3d2b1f used for all text)

## Git

Remote: `https://github.com/jeremygideonbareh/crumbs-bakery-`
Branch: `main` (first push)
