# Session Handoff — Crumbs Bakery Website

## What Was Built

Full bakery website for Crumbs Bakery & Cafe, Shillong — teal/ivory/green palette inspired by crumbsanddoilies.co.uk, Bebas Neue + Montserrat typography.

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

- **Colors**: `bg-header` (#55babd Teal), `bg-footer` (#FFFFF0 Ivory), `bg-background` (#FFFFF0 Ivory), `--primary` (hsl 141 35% 84% Green #C8E4CA), `--secondary` (hsl 182 44% 54% Teal #55babd), `--accent` (hsl 59 66% 82% Yellow Swatch #F1F0B0), `--main` (#C8E4CA Green), all text `text-foreground` (#3d2b1f dark brown)
- **Fonts**: `font-display` (Bebas Neue) for large headings, `font-work` (Montserrat/Work Sans) for body, `font-serif` (Fraunces) for decorative italic accents
- **Images**: All from Unsplash

### Palette Swap (Jul 4) — Reference-Inspired Teal/Ivory/Green

Replaced PANTONE pastels with a teal/ivory/green palette inspired by crumbsanddoilies.co.uk:
- **Teal #55babd** → `bg-header`, `--secondary` (header/nav/marquee bg, secondary CSS var)
- **Ivory #FFFFF0** → `bg-footer`, `bg-background`, `--bg` (page bg, footer bg, hero gradient edge)
- **Green #C8E4CA (Veiled Vista)** → `--primary`, `--main`, `bg-footer-bar` (AnnouncementBar, BrowseByBake, FaqSection, ProductCarousel hover, button bg)
- **Yellow Swatch #F1F0B0** → `--accent`, `announcement` (PromoCards bg, accent accent)
- **Ink Marshmallow #F8E0E8** → kept as accent color (not used in primary components)

Key constraint: `--secondary` (teal) is medium-dark — white text used for `--secondary-foreground`. Green `--primary` is light — only usable as bg/border/tint. All body text is `text-foreground` (dark brown #3d2b1f).

### CharReveal Fix (Jul 1)

Spaces in `CharReveal` rendered as `\u00A0` (non-breaking space) to prevent whitespace collapse inside `inline-block` spans — fixes headings like "A taste of what we bake" rendering as "Atasteofwhatwebake".

### Mobile Comfort Overhaul (Jul 2) — /webdev plan + critique loop

**Goal:** Prioritize user comfort and ease on mobile — instant content, readable text, easy tapping, polished visuals.

| # | Change | Files | Details |
|---|--------|-------|---------|
| 1 | **Removed forced 3s loader** | `App.jsx`, deleted `Loader.jsx` | Content visible immediately; page fade-in reduced to 0.3s |
| 2 | **Bumped mobile text sizes** | All 18+ components | Interactive → min 14px, Body → min 13px, Labels → min 11px. Bumped dozens of `text-[10px]`, `text-[11px]`, `text-xs` instances |
| 3 | **Fixed 14+ touch targets to ≥44px** | Navbar, Footer, InstagramSection, About, NewsSection, OrderModal, DeliverySection | Nav ham 22→44px, OrderModal close 26→44px, About CTAs ~16→44px, footer social circles 36→44px, and more |
| 4 | **Hero clip-path on mobile** | `hero-section-2.jsx` | Mobile: simple fade-in. Desktop: diagonal clip-patch reveal kept |
| 5 | **Emoji → styled bullet** | `AnnouncementBar.jsx` | Consistent bullet on all breakpoints |
| 6 | **Tightened mobile padding** | 11 sections | `py-20`→`py-12`, `py-16`→`py-10`, `py-14`→`py-10` |
| 7 | **CategoryGrid height** | `CategoryGrid.jsx` | 280px→320px for larger expanded text |
| 8 | **Overflow fix** | `Contact.jsx` | Removed `whitespace-nowrap` from heading |
| 9 | **Touch feedback** | All interactive elements | `active:scale-[0.97]` on buttons, links, nav items, gallery, OrderModal options |

### Mobile Touch-ups (Jul 4) — Tighter spacing + scroll anchors

| # | Change | Files | Details |
|---|--------|-------|---------|
| 1 | **Reduced mobile section padding** | 12 sections | `py-10`→`py-8`, `py-12`→`py-8` for tighter vertical rhythm on mobile |
| 2 | **Added `scroll-mt-24`** | About, SignatureItems, Gallery, Reviews, Contact, InstagramSection | Fixed navbar no longer overlaps section content when navigating via anchor links |
| 3 | **Footer mobile padding** | `Footer.jsx` | `py-16`→`py-12` on mobile |
| 4 | **Touch feedback on remaining elements** | Footer, DeliverySection, InstagramSection, About | `active:scale-[0.97]` on footer links, delivery CTA, IG sidebar items, About links |
| 5 | **SheetCakesMarquee mobile** | `SheetCakesMarquee.jsx` | `py-4`→`py-3` on mobile |

### Palette Balance (Jul 4) — More teal + green

| # | Change | Files | Details |
|---|--------|-------|---------|
| 1 | **Footer bar to teal** | `Footer.jsx` | Bottom bar bg changed from transparent to `bg-header` (teal) with white text, matching reference site |
| 2 | **SignatureItems teal strip** | `SignatureItems.jsx` | Gradient overlay `via-secondary/5`→`via-secondary/10` for stronger teal hint |
| 3 | **NewsSection to green** | `NewsSection.jsx` | Section bg `bg-background`→`bg-primary` (green). White cards contrast on green. |
| 4 | **Instagram sidebar green** | `InstagramSection.jsx` | Sidebar `bg-primary/5`→`bg-primary/10` for more green saturation |

## Build

```bash
npm run build  # Vite — builds to dist/
npm run dev    # Dev server at http://localhost:5173/crumbs-bakery-/
```

## Known Issues

- Reference site's emoji-only bullets ("CAKES 🍰", "CUPCAKES 🧁") not implemented — text-only labels instead
- Some hover animations may differ slightly from reference due to framer-motion limitations
- Product carousel uses static mock data — needs real product API
- Contact section still uses old layout — not yet updated to match reference
- `--secondary` (teal #55babd) is medium-dark — white `--secondary-foreground` ensures contrast, but light elements on teal bg need careful handling
- No GitHub Pages deployment workflow set up — enable manually in repo Settings

## Git

Remote: `https://github.com/jeremygideonbareh/crumbs-bakery-`
Branch: `main`
Pages URL: `https://jeremygideonbareh.github.io/crumbs-bakery-/`
Latest: `43534b0` — feat: mobile optimization - tighter spacing, scroll-mt anchors, touch feedback, palette updates
