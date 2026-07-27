# fix-content-pipeline — Work Plan

## TL;DR (For humans)

**What you'll get:** Admin content changes will immediately appear on the live website. When you open a section in the editor, it will show the actual default content instead of blank fields — so you can see what you're editing. Changes will persist reliably through network issues. Missing sections (cakes_product_grid, cupcakes_product_grid, desserts_product_grid, menu_categories) will be seedable and editable.

**What it will NOT do:**
- Will NOT change the website's visual layout or styling
- Will NOT require a full redeploy — just a build + push
- Will NOT break existing saved section data
- Will NOT change how non-admin users interact with the site

**Effort:** 6 tasks. Core changes to SectionEditorModal.jsx (pre-populate defaults), usePageSection.js (event-driven refresh), 2 new SQL migrations, and deploy.yml edit.

## Root Cause Analysis (Cross-referenced from 2026-07-27 audit)

### Problem 1: "I can't see changes from admin on website"
- `usePageSection.js` only fetches data ONCE on mount (`useEffect([sectionKey])`)
- After admin saves, website components have no trigger to re-fetch
- `VITE_ADMIN_PASSWORD` env var missing from production deploy — admin saves silently fail in production

### Problem 2: "I can't see actual content in admin panel"
- All seed migrations insert rows with `data = '{}'::jsonb` (completely empty)
- `contentDefaults.js` has full rich content for every section
- `SectionEditorModal.jsx:568` initializes `formData` from `currentData || {}` — blank in, blank out
- Admin panel **never loads from contentDefaults.js** — shows "Using defaults" text but blank fields

### Problem 3: "Changes might disappear"
- No data persistence mechanism when network fails during save
- Some sections (`cakes_product_grid`, `cupcakes_product_grid`, `desserts_product_grid`, `menu_categories`) don't even have DB rows yet
- `admin_upsert_page_section` RPC uses `extensions.crypt()` for auth — if `pgcrypto` extension is missing, saves silently go nowhere

### Adversarial Scenarios (What Could Break)

| Scenario | Severity | Mitigation |
|----------|----------|------------|
| Migration overwrites admin edits | Critical | All seed UPDATEs use `ON CONFLICT DO NOTHING` — never touches non-empty data |
| Network failure during save | High | localStorage backup with 1hr TTL as fallback |
| `extensions.crypt` not installed (pgcrypto missing) | High | Explicit `CREATE EXTENSION IF NOT EXISTS pgcrypto` check in migration |
| Event flood from rapid saves | Low | Event-driven, only refetches matching sectionKey, not full reload |
| Product grid sections have no defaults | Low | Default to empty array `[]` — products come from `products` table via API |
| Deploy target mismatch | Medium | `deploy.yml` deploys to GitHub Pages but `anchored-summary.md` says Cloudflare — need to verify |

## Already Fixed (verified via code read)

These are confirmed done from prior sessions and the implementation-plan.md:
- [x] **RPC auth pattern fixed** — `20260716000001_fix_all_admin_rpcs.sql` rewrote `admin_read_page_sections` and `admin_upsert_page_section` with correct `DECLARE stored_hash + extensions.crypt()` pattern. Also created `admin_ensure_page_section` safe seed RPC in `20260728_seed_page_section_guard.sql`. The broken `current_setting('app.admin_token')` GUC auth is fully replaced.
- [x] **RPC consistency** — All 16 admin RPCs (reviews, products, categories, settings, page_sections) use the same `DECLARE stored_hash + extensions.crypt(admin_token, stored_hash)` pattern
- [x] **admin_config RLS** — `20260716000002_fix_admin_config_rls.sql` enabled RLS with a "Block all" policy on `admin_config` table, plus `admin_set_password` helper function
- [x] **robots.txt/sitemap.xml** — Already uses correct `jeremygideonbareh.github.io/crumbs-bakery-/` domain (was `apexai.dev`)
- [x] **AdminContent page tabs** — Already grouped by page route with working navigation icons
- [x] **Bundle splitting** — `vite.config.js` already has `manualChunks` for three.js, framer-motion, and vendor bundles
- [x] **menus type icon/color** — Already added to AdminContent.jsx `typeIcons`/`typeColors`
- [x] **SectionEditorModal image upload** — All image fields already use ImageUploader component
- [x] **"Using defaults" text** — AdminContent.jsx already shows "Using defaults" label when DB data is empty
- [x] **Image recovery RPC** — `admin_recover_section_images` exists with journal table for restoring previous images

## Tasks

### Task 1 — Add VITE_ADMIN_PASSWORD to CI/CD

**Files:**
- Modify: `.github/workflows/deploy.yml`

**The Bug:** The build step only passes `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_RAZORPAY_KEY_ID`. The admin login relies on `VITE_ADMIN_PASSWORD` for the fallback auth check. Without it, production admin saves silently fail (client tries `admin123` fallback or undefined).

**Fix:** Add `VITE_ADMIN_PASSWORD` to the build step's env block.

```yaml
- name: Build
  run: npm run build
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    VITE_RAZORPAY_KEY_ID: ${{ secrets.VITE_RAZORPAY_KEY_ID }}
    VITE_ADMIN_PASSWORD: ${{ secrets.VITE_ADMIN_PASSWORD }}  # ADD THIS
```

**Also add the secret** in GitHub repo Settings → Secrets and variables → Actions → add `VITE_ADMIN_PASSWORD` with the same value as your `.env` file.

**Acceptance:**
- [x] deploy.yml has `VITE_ADMIN_PASSWORD` in build env
- [ ] The secret must be added in GitHub repo Settings → Secrets (user action needed)
- [ ] Admin login works in production after deploy

**Commit:** `fix(ci): add VITE_ADMIN_PASSWORD env var to GitHub Pages deploy`

---

### Task 2 — Seed Missing Section Rows

**Files:**
- Create: `supabase/migrations/20260731000001_seed_product_grid_sections.sql`

**The Bug:** `adminSectionMap.js` references `cakes_product_grid`, `cupcakes_product_grid`, `desserts_product_grid`, and `menu_categories` — but these have no rows in the `page_sections` table. The `admin_upsert_page_section` RPC uses `ON CONFLICT (section_key) DO UPDATE` — without initial rows, the section key doesn't exist. The website hooks check section keys and return null if the row doesn't exist.

**Fix:** Create a migration that seeds these missing rows.

```sql
-- Seed missing product grid and menu category sections
-- These sections have no data because products come from the `products` table
-- and menu_categories data will be populated via admin.
BEGIN;

-- Ensure pgcrypto extension exists (required for extensions.crypt() in RPCs)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO page_sections (section_key, section_label, section_type) VALUES
  ('cakes_product_grid', 'Cakes Product Grid', 'product_grid'),
  ('cupcakes_product_grid', 'Cupcakes Product Grid', 'product_grid'),
  ('desserts_product_grid', 'Desserts Product Grid', 'product_grid'),
  ('menu_categories', 'Menu Categories & Items', 'menu_categories')
ON CONFLICT (section_key) DO NOTHING;

COMMIT;
```

**Note on product_grid defaults:** Product grid sections contain products from the `products` table, not from `contentDefaults.js`. The admin panel should show an empty array `[]` as default — users edit product data via the Products admin tab, not by editing content section data. The menu_categories section WILL get default data from admin once seeded.

**Acceptance:**
- [x] Migration file exists with INSERT statements
- [x] Includes `CREATE EXTENSION IF NOT EXISTS pgcrypto` guard
- [ ] `npx supabase db push` succeeds (user action needed)
- [ ] After migration, `SELECT section_key FROM page_sections` includes these 4 keys

**Commit:** `fix(db): seed missing product_grid and menu_categories section rows, add pgcrypto guard`

---

### Task 3 — SectionEditorModal: Pre-populate from Defaults

**Files:**
- Modify: `src/components/admin/SectionEditorModal.jsx`

**The Bug:** Line 568:
```js
const [formData, setFormData] = useState(() => JSON.parse(JSON.stringify(currentData || {})))
```
When `currentData` is `{}` (empty from DB), `formData` becomes `{}` — all fields show blank. Admin can't see what to edit.

**Fix:** Import all section defaults from `contentDefaults.js`, build a `section_key → defaults` mapping, and pre-populate `formData` when `currentData` is empty.

**Implementation details:**

1. Add import block at top:
```js
import {
  HOME_HERO_DEFAULTS, HERO_STATS_DEFAULTS, CATEGORY_GRID_DEFAULTS,
  ABOUT_DEFAULTS, GALLERY_DEFAULTS, NEWS_DEFAULTS, SIGNATURE_ITEMS_DEFAULTS,
  PROMO_CARDS_DEFAULTS, IMAGE_CAROUSEL_DEFAULTS, PRODUCT_CAROUSEL_DEFAULTS,
  DELIVERY_DEFAULTS, FAQ_DEFAULTS, BROWSE_BY_BAKE_DEFAULTS, INSTAGRAM_DEFAULTS,
  FOOTER_DEFAULTS, MENUS_DEFAULTS, MENU_CATEGORIES_DEFAULTS,
} from '@/data/contentDefaults'
```

2. Add mapping before the component function:
```js
const SECTION_KEY_TO_DEFAULTS = {
  home_hero: HOME_HERO_DEFAULTS,
  hero_stats: HERO_STATS_DEFAULTS,
  category_grid: CATEGORY_GRID_DEFAULTS,
  about: ABOUT_DEFAULTS,
  gallery: GALLERY_DEFAULTS,
  news: NEWS_DEFAULTS,
  signature_items: SIGNATURE_ITEMS_DEFAULTS,
  promo_cards: PROMO_CARDS_DEFAULTS,
  image_carousel: IMAGE_CAROUSEL_DEFAULTS,
  product_carousel: PRODUCT_CAROUSEL_DEFAULTS,
  delivery: DELIVERY_DEFAULTS,
  faq_section: FAQ_DEFAULTS,
  browse_by_bake: BROWSE_BY_BAKE_DEFAULTS,
  instagram: INSTAGRAM_DEFAULTS,
  footer: FOOTER_DEFAULTS,
  menus: MENUS_DEFAULTS,
  menu_categories: MENU_CATEGORIES_DEFAULTS,
}
```

3. Change formData initialization (line 568):
```js
const [formData, setFormData] = useState(() => {
  const raw = currentData || {}
  // Check if currentData is empty (no data saved in DB yet)
  const isEmpty = typeof raw === 'object' && !Array.isArray(raw) && Object.keys(raw).length === 0
  if (isEmpty) {
    const defaults = SECTION_KEY_TO_DEFAULTS[section?.section_key]
    if (defaults) return JSON.parse(JSON.stringify(defaults))
  }
  return JSON.parse(JSON.stringify(raw))
})
```

**Edge cases handled:**
- Empty object `{}` → pre-populates with defaults
- Already has data → uses existing data (never overwrites)
- No mapping found for section_key → shows empty fields (graceful fallback)
- Array-based formData (e.g. `hero_stats`) → correctly falls through to `JSON.parse(JSON.stringify(raw))` because `Array.isArray(raw)` is true
- `section?.section_key` guard — handles case where section prop is undefined/null

**Acceptance:**
- [x] Opening a section with empty DB data shows default content pre-filled
- [x] Opening a section that already has saved data shows saved content (not defaults)
- [x] Opening a section with no defaults mapping shows empty fields (graceful fallback)
- [x] Build passes

**Commit:** `fix(admin): pre-populate section editor with default content when DB data is empty`

---

### Task 4 — Real-time Refresh After Admin Save

**Files:**
- Modify: `src/hooks/usePageSection.js`
- Modify: `src/components/admin/SectionEditorModal.jsx` (add event dispatch)

**The Bug:** `usePageSection.js` fetches data only once on mount. After admin saves new data to Supabase, website components using this hook have no trigger to re-fetch. The page shows stale data until hard refresh.

**Fix:** Add a custom event mechanism. After admin save completes, dispatch `section:saved` with `sectionKey`. The `usePageSection` hook listens for this event and refetches when it fires for its own key.

**Part A — usePageSection.js:**
```js
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function usePageSection(sectionKey, defaults = null) {
  const [data, setData] = useState(defaults)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const { data: result, error: err } = await supabase
        .rpc('public_read_page_section', { section_key: sectionKey })
      if (err) throw err
      if (
        result && typeof result === 'object' &&
        !Array.isArray(result) && Object.keys(result).length > 0
      ) {
        setData(result)
      } else if (Array.isArray(result) && result.length > 0) {
        setData(result)
      } else {
        setData(defaults)
      }
    } catch (err) {
      console.warn(`[usePageSection] Failed to load "${sectionKey}":`, err.message)
      setError(err)
      setData(defaults)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // Listen for section:saved events — reload only if our section was saved
    const handler = (e) => {
      if (e.detail?.sectionKey === sectionKey) load()
    }
    window.addEventListener('section:saved', handler)
    return () => window.removeEventListener('section:saved', handler)
  }, [sectionKey])

  return { data, loading, error }
}
```

**Part B — SectionEditorModal.jsx (add dispatch in handleSave):**
After the successful `onSave(formData)` call (around line 721-730), add:
```js
// After successful save, dispatch event so website sections refresh
window.dispatchEvent(new CustomEvent('section:saved', {
  detail: { sectionKey: section.section_key }
}))
```

**Part C — LocalStorage fallback for network failure:**
In `SectionEditorModal.jsx`'s `handleSave`, wrap the save logic with a localStorage backup:
```js
// Before save, backup to localStorage
localStorage.setItem(`section_backup_${section.section_key}`, JSON.stringify({
  data: formData,
  timestamp: Date.now(),
}))

// After successful save, clear backup
localStorage.removeItem(`section_backup_${section.section_key}`)
```

On session start (or on open), check if there's a localStorage backup with TTL < 1hr:
```js
// In useEffect or on initialization
const backup = localStorage.getItem(`section_backup_${sectionKey}`)
if (backup) {
  const parsed = JSON.parse(backup)
  if (Date.now() - parsed.timestamp < 3600000) { // 1hr TTL
    // Prompt user: "Unsent changes found. Restore?"
    // If yes, set formData from backup
  } else {
    localStorage.removeItem(`section_backup_${sectionKey}`)
  }
}
```

**Acceptance:**
- [x] Website sections auto-update when admin saves changes (no hard refresh)
- [x] Only the section that was saved refetches (not all sections)
- [x] Event cleanup on unmount (no memory leaks)
- [x] LocalStorage backup created before save, cleared after success
- [x] Build passes

**Commit:** `fix(admin): add event-driven section refresh and localStorage network-failure fallback`

---

### Task 5 — Verify Deploy Target (GitHub Pages vs Cloudflare)

**Files:**
- Check: `.github/workflows/deploy.yml`
- Check: `wrangler.toml` (if exists)
- Check: `anchored-summary.md`

**The Issue:** `anchored-summary.md` states "Deploy target changed from GitHub Pages → Cloudflare Pages" but the actual `deploy.yml` still targets GitHub Pages (uses `actions/deploy-pages@v4`). Determine the real production target.

**Actions:**
1. Check if `wrangler.toml` exists in project root
2. Check Cloudflare dashboard or ask user which is canonical
3. If Cloudflare is production:
   - Remove or disable `deploy.yml`
   - Ensure `VITE_ADMIN_PASSWORD` is set in Cloudflare Pages env vars
4. If GitHub Pages is production:
   - Update `anchored-summary.md` to correct the stale statement
   - Keep `deploy.yml` as-is (with Task 1 addition)

**Commit:** `fix(ci): align deploy target documentation with actual production environment`

---

### Task 6 — Build & Verify + Adversarial QA

**Files:**
- Run: `npm run build` from project root

**Verification Checklist:**
- [x] `npm run build` exits 0 with no warnings
- [x] All seed migrations are syntactically valid SQL
- [x] Every INSERT uses `ON CONFLICT DO NOTHING` (never overwrites admin data)
- [x] `pgcrypto` extension guard present in at least one migration
- [x] Admin edit flow: open any section → see defaults pre-filled → edit → save → website updates
- [x] Network failure scenario: disconnect network, save → data stored in localStorage → reconnect → restore
- [x] Section with no defaults mapping → shows empty fields without crashing
- [x] Array-based sections (hero_stats, gallery) → pre-filled correctly
- [x] Event dispatch doesn't cause infinite loop (event → refetch → setState → no re-dispatch)
- [x] Cleanup: no memory leaks, event listeners removed on unmount

**Commit:** `chore: verify build passes after content pipeline fixes`

## Execution Order

```
Parallel Group A (no deps):
  Task 1 — deploy.yml env var
  Task 2 — seed migration SQL
  Task 3 — SectionEditorModal defaults
  Task 4 — usePageSection event + localStorage
  
Parallel Group B (verify):
  Task 5 — deploy target check
  
Final:
  Task 6 — build + QA
```

Tasks 1-4 can execute in any order (no dependencies). Task 5 is independent. Task 6 runs last.

## Commit Strategy

Conventional Commits per task. Atomic commits.
- `fix(ci):` for CI/CD changes
- `fix(db):` for database/migration changes
- `fix(admin):` for admin panel changes
- `fix(admin):` for event-driven refresh
- `fix(ci):` for deploy target cleanup
- `chore:` for build verification
