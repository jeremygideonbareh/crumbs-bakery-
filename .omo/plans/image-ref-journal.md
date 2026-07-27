# Plan: Image Reference Journal

**Status:** Draft — awaiting approval  
**Slug:** image-ref-journal  
**Intent:** CLEAR  
**Review required:** No  

## TL;DR (For humans)

Every time an admin saves a section, all image URLs used are logged into a separate `page_section_image_refs` table with their JSON field path (e.g., `background_image`, `items[0].image`). This happens automatically via a PostgreSQL trigger — zero changes to the admin save flow, zero extra network calls. If section data ever gets cleared again, a "Restore previous images" button in the editor can place each image back exactly where it was.

## Review Corrections Applied

This plan was reviewed and the following critical issues were fixed:
1. **🚨 Trigger now skips when data is empty** — previously it would DELETE refs then INSERT nothing, destroying history. Now has `IF NEW.data IS NULL OR NEW.data = '{}'::jsonb THEN RETURN NEW; END IF;` guard.
2. **🚨 Todo 5 (backfill) removed** — all page_sections currently have `data = '{}'`, so backfill inserts zero rows. Pointless.
3. **⚠️ Refs table now has `json_path TEXT` column** — stores the JSON field path so recovery can auto-place each URL in its correct field (e.g., `background_image` → hero background field, not gallery field).
4. **⚠️ "0 fields" bug fix added** — `AdminContent.jsx` shows "0 fields" for all sections when data is empty. Fix included in plan.
5. **⚠️ extract function returns `TABLE(url TEXT, path TEXT)`** — not just URLs, so recovery is field-aware.
6. **⚠️ Recovery RPC returns refs sorted by `updated_at DESC`** — most recent images first.

## Research Summary

After evaluating 5 approaches, **separate ref table + PostgreSQL trigger** wins on every metric:

| Criterion | Score |
|-----------|-------|
| **Reliability** | ✅ Covers ALL writes — trigger fires on every `data` change regardless of source |
| **Efficiency** | ✅ Same transaction, zero extra network calls, ~1ms overhead |
| **Space** | ✅ ~150 bytes per ref (with path), ~7KB total for 50 refs across all sections |
| **Maintenance** | ✅ Single migration file — no app code changes needed for the DB layer |
| **Recovery** | ✅ Field-aware — knows which URL goes to which field, not just "some image for section X" |

## Dependencies

```
Todo 1 (helper function) ──→ Todo 2 (table) ──→ Todo 3 (trigger) ──→ Todo 4 (RPC)
                                                                    │
                                                                    └──→ Todo 6 (useAdminApi.js) ──→ Todo 7 (SectionEditorModal UI)
                                                                                                        │
                                                            Todo 8 (0-fields bug) ───────────────────────┘
                                                                                                        │
                                                                                              Todo 9 (rebuild) ──→ Todo 10 (test)
```

## Todo Steps

### Todo 1: Create migration — extract_image_urls_with_paths helper function
- **WHERE:** `supabase/migrations/20260730_image_ref_journal.sql`
- **HOW:** Write a recursive PL/pgSQL function `extract_image_urls_with_paths(doc JSONB, base_path TEXT DEFAULT '$') RETURNS TABLE(url TEXT, path TEXT)`. For each node in the JSONB tree:
  - If value is a string matching image patterns (`http://`, `https://`, `/images/`, `.jpeg`, `.jpg`, `.png`, `.webp`, `.gif`), yield `(url, current_path)`
  - If value is object, recurse with `path.key`
  - If value is array, recurse with `path[N]`
  - If base_path starts as `$`, strip it for cleaner paths
- **EXPECT:** Function handles all known data shapes from SECTION_FIELDS (hero, card_grid, gallery, product_grid, etc.)
- **QA:** Test with:
  - `SELECT * FROM extract_image_urls_with_paths('{"background_image": "/images/hero.jpg", "title": "Hello"}')` → `('/images/hero.jpg', 'background_image')`
  - `SELECT * FROM extract_image_urls_with_paths('[{"image": "/images/a.jpg"}, {"image": "/images/b.jpg"}]')` → `('/images/a.jpg', '[0].image'), ('/images/b.jpg', '[1].image')`
  - `SELECT * FROM extract_image_urls_with_paths('{"areas": [{"name": "A", "image": "/img.jpg"}]}')` → `('/img.jpg', 'areas[0].image')`
  - `SELECT * FROM extract_image_urls_with_paths('{"image": "/images/cake.jpeg", "text": "hello world"}')` — non-image strings excluded
- **ACCEPTANCE:** All image URLs extracted with correct paths. Non-image strings excluded.
- **Commit:** `feat(db): add extract_image_urls_with_paths helper function`

### Todo 2: Create migration — page_section_image_refs table
- **WHERE:** Same migration file
- **HOW:** `CREATE TABLE page_section_image_refs (id BIGINT GENERATED ALWAYS AS IDENTITY, section_key TEXT NOT NULL, image_url TEXT NOT NULL, json_path TEXT, updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), PRIMARY KEY (id))` + `CREATE INDEX idx_refs_section_key ON page_section_image_refs(section_key)` + `ALTER TABLE page_section_image_refs ENABLE ROW LEVEL SECURITY` + policies: public SELECT (anyone), no direct write (trigger only)
- **EXPECT:** Table exists, indexed by section_key, RLS enabled, public can read
- **QA:** Manual SQL: `INSERT INTO page_section_image_refs (section_key, image_url, json_path) VALUES ('test', 'https://example.com/img.jpg', 'hero.background')` → SELECT it back
- **ACCEPTANCE:** Table exists, index created, RLS policies visible in `\dp`
- **Commit:** `feat(db): create page_section_image_refs table for image URL journal`

### Todo 3: Create migration — trigger on page_sections with empty-data guard
- **WHERE:** Same migration file
- **HOW:**
```sql
CREATE OR REPLACE FUNCTION log_page_section_images()
RETURNS TRIGGER AS $$
BEGIN
  -- CRITICAL: Never destroy refs when data is empty/cleared
  IF NEW.data IS NULL OR NEW.data = '{}'::jsonb THEN
    RETURN NEW;
  END IF;
  
  DELETE FROM page_section_image_refs WHERE section_key = NEW.section_key;
  
  INSERT INTO page_section_image_refs (section_key, image_url, json_path, updated_at)
  SELECT NEW.section_key, url, path, now()
  FROM extract_image_urls_with_paths(NEW.data);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_log_page_section_images
  AFTER INSERT OR UPDATE OF data ON page_sections
  FOR EACH ROW EXECUTE FUNCTION log_page_section_images();
```
- **EXPECT:** Every write to `page_sections.data` automatically populates refs table with URLs + paths. Clearing data to `{}` does NOT destroy refs.
- **QA:**
  - UPDATE page_sections SET data = '{"background_image": "/images/test.jpeg"}' WHERE section_key = 'home_hero' → verify refs table has entry with path `background_image`
  - UPDATE page_sections SET data = '{}'::jsonb WHERE section_key = 'home_hero' → verify refs table STILL HAS the previous entries (not deleted)
  - INSERT a new page_sections row with data → verify refs populated
- **ACCEPTANCE:** Writing image data → refs created. Clearing data → refs preserved. Non-image data → no refs written.
- **Commit:** `feat(db): add log_page_section_images trigger with empty-data guard`

### Todo 4: Create migration — admin_recover_section_images RPC
- **WHERE:** Same migration file
- **HOW:**
```sql
CREATE OR REPLACE FUNCTION admin_recover_section_images(
  admin_token TEXT,
  p_section_key TEXT DEFAULT NULL
)
RETURNS TABLE(section_key TEXT, image_url TEXT, json_path TEXT, updated_at TIMESTAMPTZ)
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE stored_hash text;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
    IF p_section_key IS NULL THEN
      RETURN QUERY SELECT r.section_key, r.image_url, r.json_path, r.updated_at
      FROM page_section_image_refs r ORDER BY r.updated_at DESC;
    ELSE
      RETURN QUERY SELECT r.section_key, r.image_url, r.json_path, r.updated_at
      FROM page_section_image_refs r
      WHERE r.section_key = p_section_key
      ORDER BY r.updated_at DESC;
    END IF;
    RETURN;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;
```
- **EXPECT:** RPC returns stored image refs for section, sorted by recency. NULL returns all.
- **QA:** Call with valid token + key → get refs. Call with NULL → get all. Call with invalid token → exception.
- **ACCEPTANCE:** Empty result for unknown key. Correct refs for sections with history. Most recent first.
- **Commit:** `feat(db): add admin_recover_section_images RPC with json_path support`

### Todo 5: Push migration to Supabase
- **WHERE:** `npx supabase db push --include-all`
- **RISK NOTE:** Previous migration history has a version conflict with `20260726`. If push fails, fall back to `npx supabase db query --linked --file supabase/migrations/20260730_image_ref_journal.sql` to apply SQL directly.
- **HOW:** Try standard db push first. If version conflict, use direct SQL execution.
- **EXPECT:** All functions + table + trigger + RPC exist on remote
- **QA:** `npx supabase db query --linked "SELECT * FROM extract_image_urls_with_paths('{\"img\": \"/images/cake.jpeg\"}'::jsonb)"` → returns url+path
- **ACCEPTANCE:** Remote has the function, table, trigger, and RPC.
- **Commit:** (no commit — migration applied)

### Todo 6: Add recovery API to useAdminApi hook
- **WHERE:** `src/hooks/useAdminApi.js`
- **HOW:** Add to the `sections` object:
```js
sections: {
  list: () => rpc('admin_read_page_sections'),
  update: (key, label, type, data) =>
    rpc('admin_upsert_page_section', {
      p_key: key, p_label: label, p_type: type, p_data: data,
    }),
  recoverImages: (sectionKey) =>
    rpc('admin_recover_section_images', { p_section_key: sectionKey }),
},
```
- **EXPECT:** `api.sections.recoverImages('home_hero')` returns stored image refs with paths
- **QA:** Open browser console, call `window.__api.sections.recoverImages('home_hero')`, verify response has url + path
- **ACCEPTANCE:** Method exists, returns data with correct shape, errors handled (try/catch in component)
- **Commit:** `feat(admin): add recoverImages API to useAdminApi hook`

### Todo 7: Fix "0 fields" bug in AdminContent.jsx
- **WHERE:** `src/pages/admin/AdminContent.jsx` line 187
- **HOW:** Change:
```jsx
// BUG: Object.keys({}).length = 0 → shows "0 fields" instead of "Using defaults"
return preview || `${Object.keys(data).length} fields`

// FIX:
const keyCount = Object.keys(data).length
if (keyCount === 0) return 'Using defaults'
return preview || `${keyCount} fields`
```
- **EXPECT:** Sections with empty data `{}` show "Using defaults" instead of "0 fields"
- **QA:** Open admin content page → all empty sections show "Using defaults" badge, not "0 fields"
- **ACCEPTANCE:** Empty sections correctly labeled. Sections with data still show field count.
- **Commit:** `fix(admin): show 'Using defaults' for empty section data instead of '0 fields'`

### Todo 8: Add "Restore previous images" UI in SectionEditorModal
- **WHERE:** `src/components/admin/SectionEditorModal.jsx`
- **HOW:**
  1. Import `useAdminApi` + wrap editor with the hook
  2. Add state: `const [recovering, setRecovering] = useState(false)`
  3. Add a small button between header and body:
     - Visible ONLY when `formData` is empty `{}` OR has no image URLs
     - Text: "Restore previous images"
     - On click: sets recovering=true, calls `api.sections.recoverImages(section.section_key)`
  4. On response:
     - Group refs by section_key (in case of single-section recovery, just one group)
     - For refs WITH `json_path`: match path to field key → set that field's URL in formData
       - e.g., path `background_image` → `formData.background_image = url`
       - e.g., path `items[0].image` → `formData.items[0].image = url`
     - For refs WITHOUT `json_path` (legacy): show a thumbnail gallery, user clicks one → it fills the first empty image field
  5. Show toast on success/error
  6. While loading: show spinner + "Restoring images..."
- **EXPECT:** One-click restore of all previous image URLs to their correct fields
- **QA:** Clear a section's data, open editor → button visible → click → images populate → save → verify on site
- **ACCEPTANCE:** Button only visible when data has no images. Clicking restores URLs to correct fields. Toast on completion.
- **Commit:** `feat(admin): add 'Restore previous images' button to SectionEditorModal`

### Todo 9: Rebuild + redeploy
- **WHERE:** `npm run build && npx wrangler deploy`
- **HOW:** Standard build with vite, deploy to Cloudflare
- **EXPECT:** Build passes, deploy succeeds
- **QA:** Visit all admin pages, verify no console errors
- **ACCEPTANCE:** Build exits 0, wrangler shows "Published", site loads without errors
- **Commit:** `chore: rebuild and deploy`

### Todo 10: Test full recovery flow end-to-end
- **WHERE:** crumbsbakery.in admin panel
- **HOW:**
  1. Open a section that has image refs (from a test write) or create one
  2. Clear the section's data to `{}` via SQL (npx supabase db query --linked)
  3. Open admin → section shows "Using defaults" (Todo 7 fix)
  4. Click Edit → "Restore previous images" button visible
  5. Click restore → images auto-populate
  6. Save → data written with correct URLs
  7. Verify on live site page → images display
- **EXPECT:** Full recovery flow works end-to-end
- **ACCEPTANCE:** Images from stored refs appear on correct site sections
- **Commit:** (no commit — test only)

## Files to Modify

| File | Change |
|------|--------|
| `supabase/migrations/20260730_image_ref_journal.sql` | **NEW** — helper function, refs table, trigger, RPC |
| `src/hooks/useAdminApi.js` | Add `sections.recoverImages()` method |
| `src/components/admin/SectionEditorModal.jsx` | Add "Restore previous images" button + recovery logic |
| `src/pages/admin/AdminContent.jsx` | Fix "0 fields" → "Using defaults" for empty data |

## Rollback

1. **DB:** `npx supabase migration repair --status reverted 20260730` + delete migration file
2. **Frontend:** Revert changes to `useAdminApi.js`, `SectionEditorModal.jsx`, `AdminContent.jsx`
3. **Deploy:** `npm run build && npx wrangler deploy` to roll back frontend
