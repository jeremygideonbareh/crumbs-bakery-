# Session 001 — Mobile Comfort Overhaul

**Date:** 2026-07-02

## Tasks Completed

1. **Removed forced 3-second loader** — Deleted `Loader.jsx`, removed loading state/`AnimatePresence` from `App.jsx`. Reduced page fade-in from 1s to 0.3s so content is visible immediately.

2. **Bumped mobile text sizes** — Applied across all 18+ components:
   - Interactive text → minimum `text-sm` (14px)
   - Body text → minimum `text-[13px]`
   - Eyebrow/labels → minimum `text-[11px]`
   - Bumped dozens of `text-[10px]`, `text-[11px]`, `text-xs` instances

3. **Fixed ALL touch targets to ≥44px** — Fixed 14+ undersized targets:
   - Navbar hamburger (22px→44px via `p-3`)
   - Navbar brand logo link (added `py-3`)
   - Navbar mobile links & ORDER NOW (`py-3.5`→`py-4`)
   - InstagramSection sidebar items (`py-2.5`→`py-3.5`)
   - Footer social circles (`w-9`→`w-11` on mobile)
   - Footer social label buttons (`py-2`→`py-3`)
   - OrderModal close (26px via `p-1`→44px via `p-3`)
   - OrderModal nav buttons (`min-h-10`→`min-h-11`)
   - DeliverySection CTA (`py-3`→`py-3.5`)
   - About CTAs (added `py-3`)
   - NewsSection Read More & View All (added `py-3`)

4. **Fixed hero clip-path on mobile** — Split image rendering: simple fade-in on mobile, keeps diagonal clip-path reveal on desktop. Gradient overlay hidden on mobile.

5. **Replaced announcement bar emoji** — Removed `🎉` on mobile, consistent styled bullet on all breakpoints.

6. **Tightened vertical padding on mobile** — 11 sections reduced:
   - `py-20`→`py-12`: SignatureItems, Gallery, Reviews, Contact
   - `py-16`→`py-10`: About, DeliverySection, NewsSection, FaqSection
   - `py-14`→`py-10`: BrowseByBake, ProductCarousel, PromoCards

7. **Fixed overflow risk** — Removed `whitespace-nowrap` from Contact heading.

8. **Increased CategoryGrid height** — `h-[280px]`→`h-[320px]` on mobile for expanded text.

9. **Added touch feedback** — `active:scale-[0.97]` on all buttons, nav links, social links, gallery images, FAQ items, OrderModal options, category cards, and footer links.

## Files Modified

- `src/App.jsx` — removed loader, reduced fade-in
- `src/components/Loader.jsx` — DELETED
- `src/components/Navbar.jsx` — touch targets + text sizes + active states
- `src/components/ui/hero-section-2.jsx` — mobile clip-path fix
- `src/components/AnnouncementBar.jsx` — emoji→bullet
- `src/components/CategoryGrid.jsx` — height + active state
- `src/components/About.jsx` — touch targets + text sizes
- `src/components/BrowseByBake.jsx` — text sizes + padding
- `src/components/SignatureItems.jsx` — text sizes + padding
- `src/components/ProductCarousel.jsx` — text sizes + padding
- `src/components/DeliverySection.jsx` — text sizes + touch targets
- `src/components/Gallery.jsx` — text sizes + active states
- `src/components/InstagramSection.jsx` — text sizes + touch targets
- `src/components/PromoCards.jsx` — text sizes + padding
- `src/components/Reviews.jsx` — text sizes
- `src/components/NewsSection.jsx` — text sizes + touch targets + padding
- `src/components/FaqSection.jsx` — text sizes + active state + padding
- `src/components/Contact.jsx` — text sizes + overflow fix + padding
- `src/components/Footer.jsx` — touch targets + active states + text sizes
- `src/components/OrderModal.jsx` — text sizes + touch targets + active states
- `docs/superpowers/specs/2026-07-02-mobile-comfort-overhaul.md` — spec document

## Design Decisions

- Split hero rendering: `md:hidden` + `hidden md:block` instead of responsive Framer Motion variants (simpler, no JS breakpoint detection)
- 13px floor for body text (not 14px) — 14px everywhere would break some layouts (CategoryGrid vertical text, FAQ titles in fixed-height buttons)
- Footer social icons: `w-11 h-11` only on mobile, back to `w-9` on md+ (desktop hover is precise enough)
- `active:scale-[0.97]` instead of `[0.95]` — subtle feedback without feeling exaggerated

## Next Steps

- QA on real mobile devices (iPhone SE, Pixel 7, Galaxy)
- Verify no text overflow on 360px-wide viewports
- Check CategoryGrid expanded content fits in 320px height

## Build

```
npm run build  # passes
npm run dev    # dev server
```
