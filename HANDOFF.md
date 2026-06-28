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

### Design Tokens

- **Colors**: `bg-header` (#55babd teal), `bg-background` (#fff5f0 warm white), `text-header-foreground` (white)
- **Fonts**: `font-display` (Bebas Neue) for large headings, `font-work` (Montserrat/Work Sans) for body
- **Images**: All from Unsplash

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

## Git

Remote: `https://github.com/jeremygideonbareh/crumbs-bakery-`
Branch: `main` (first push)
