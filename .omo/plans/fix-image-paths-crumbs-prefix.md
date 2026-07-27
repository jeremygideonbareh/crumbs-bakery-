# Fix Image Paths: Remove `/crumbs-bakery-/` Prefix — Work Plan

## TL;DR

**Problem:** Supabase `page_sections` table stores image paths as `/crumbs-bakery-/images/...` (from old GitHub Pages deploy), but Cloudflare Workers serves at `/images/...`. Many components pass DB paths directly to `<img src>`, so images render as broken.

**Fix approach (two layers):**

1. **Database migration** — SQL to update all `page_sections` JSON data, replacing `/crumbs-bakery-/images/` → `/images/`
2. **Defensive code fix** — Update `getImageUrl()` in `src/lib/image.js` to also strip `/crumbs-bakery-/` prefix (catches any missed paths from components that use it)

This avoids touching every component file.

## Scope

- `supabase/migrations/` — 1 new SQL migration file to patch page_sections data
- `src/lib/image.js` — 1 change to `getImageUrl()` to strip old prefix
- `wrangler.toml` — 1 change to add redirect rule (backup in case DB migration is missed)
- `npm run build` + `npx wrangler deploy` — rebuild and redeploy

## Root Cause Detail

The site was originally deployed on GitHub Pages at path `/crumbs-bakery-/`. The admin CMS saved image paths with this prefix into Supabase. After migrating to Cloudflare Workers (root path `/`), the stored paths no longer match.

**DB data example (current):**
```json
"background_image": "/crumbs-bakery-/images/lemon-curd-cupcake.jpeg"
```

**Correct:**
```json
"background_image": "/images/lemon-curd-cupcake.jpeg"
```

**Components passing DB paths directly to `<img src>` (17 total):**
HeroSection, CategoryGrid, About, BrowseByBake, ImageCarousel, ProductCarousel, DeliverySection, Gallery, InstagramSection, PromoCards, NewsSection, CartDrawer, SheetCakesMarquee, CategoryHero, MenusGallery, Gallery (internal), Footer

**Components using `getImageUrl()` (5 total):**
SignatureItems, FaqSection, ProductGrid, MenusGallery (secondary), MenuInteractive

## Tasks

### Wave 1 — Database migration + Code fix (2 tasks, parallel-safe)

- [x] 1. **Create migration SQL** — `supabase/migrations/20260726_fix_image_paths.sql`
  - Uses `jsonb` path traversal to update all `page_sections.data` entries
  - Replaces `/crumbs-bakery-/images/` → `/images/` in every text value within the JSON data column
  - SQL uses a recursive CTE or `jsonb` replace approach

- [x] 2. **Update `getImageUrl()`** in `src/lib/image.js`
  - Add logic: if path starts with `/crumbs-bakery-/`, strip that prefix before processing
  - Like: `if (path.startsWith('/crumbs-bakery-/')) path = path.replace('/crumbs-bakery-', '')`
  - This catches any residual or future paths with the old prefix

### Wave 2 — Redirect rule (defensive)

- [x] 3. **Add redirect to `wrangler.toml`**
  - Rule: `"/crumbs-bakery-/images/*" = "/images/*"`
  - Acts as server-side redirect if any old paths still get requested

### Wave 3 — Build + Deploy + Verify

- [x] 4. **Run `supabase db push`** — applies the migration
- [x] 5. **`npm run build`** — rebuilds the app with fixed `getImageUrl()` and updated DB
- [x] 6. **`npx wrangler deploy`** — deploys to Cloudflare Workers
- [x] 7. **Verify** — open site, check hero image, gallery images, category images all load

## Verification

- `crumbsbakery.in/images/fresh-bakes-1.jpeg` — still returns 200
- `crumbsbakery.in/` — hero background image renders
- `crumbsbakery.in/` — scroll through sections, no broken image icons
- `crumbsbakery.in/crumbs-bakery-/images/...` — either 301 redirects to `/images/...` or returns 404 explicitly (not SPA index.html)

## Commit Strategy

- `fix(images): update Supabase page_sections paths to remove crumbs-bakery- prefix`
- `fix(images): add old-path stripping to getImageUrl helper`
- `chore(config): add redirect rule for old /crumbs-bakery-/images/ paths`
- `chore(deploy): rebuild and redeploy fixed site`

## Success Criteria

- All images on the live site (`crumbsbakery.in`) load correctly
- No broken-image placeholders on any page section
- Future admin CMS saves use correct `/images/...` paths (they should already, since the app now runs at root path)

## Definition of Done

- All 7 tasks completed
- `supabase db push` applied successfully
- `npm run build` exits 0
- Deployed to Workers
- Visually verified on live site
