# Fix Admin: Menus Section Editable + Auto-Populate Local Images

## Part 1 — Menus Section Not Editable

### Problem
The `menus` section key (used by `MenusGallery` component for "Browse our menu boards" on the home page) was **never seeded** into the `page_sections` table. Migration `20260709_page_sections.sql` only seeds 15 sections — `menus` is missing:

```
-- Seed all sections (line 63-79 in 20260709_page_sections.sql)
INSERT INTO page_sections (section_key, section_label, section_type) VALUES
  ('home_hero', ... , 'hero'),
  ...
  ('hero_stats', ... , 'stats')
  -- ⚠️ No 'menus' entry!
```

Without a DB row, the admin shows "Pending — Using defaults" and when you click Edit, `section_type` is `'pending'`, so `SECTION_FIELDS['pending']` = `[]` → **no editor fields**.

### Fix
Add a migration to seed the `menus` section:

```sql
INSERT INTO page_sections (section_key, section_label, section_type)
VALUES ('menus', 'Menu Gallery', 'menus')
ON CONFLICT (section_key) DO NOTHING;
```

Then `SECTION_FIELDS['menus']` from `SectionEditorModal.jsx` will match, showing the proper editor (array of `label` + `image` fields).

---

## Part 2 — Auto-Populate Local Images Collection

### Problem
`LOCAL_IMAGE_CATEGORIES` in `ImageUploader.jsx` is a **hardcoded array** of filenames. User uploaded many new pictures — they don't appear in the "Local" picker.

### Approach
Replace the hardcoded list with a **dynamic merge**:
1. Keep the default file list as a fallback
2. When the picker opens, also **fetch uploaded files from Supabase Storage** (`site-images` bucket)
3. Merge them — show both local files AND uploaded storage files in one unified picker

This way:
- Existing local files still appear
- Every new image uploaded via the Upload button automatically shows up
- No need to manually update a hardcoded list

### Implementation
In `ImageUploader.jsx`:
1. When `localPickerOpen` opens, also fetch `supabase.storage.from('site-images').list()`
2. Group fetched files into an "Uploaded" category at the top of the picker
3. Show local categories below (with the hardcoded list as fallback)

### Supabase Storage Images
- Fetched from `site-images` bucket (Part 1 of this plan must be done first — bucket must exist)
- Displayed as image thumbnails using their Supabase public URL
- Each image clickable for selection, same as local images

---

## Files Changed

| File | Change |
|------|--------|
| `supabase/migrations/20260726000002_seed_menus_section.sql` | **NEW** — seed `menus` row in `page_sections` |
| `supabase/migrations/20260726000001_create_site_images_bucket.sql` | **NEW** — create bucket + RLS (from previous plan) |
| `src/components/admin/ImageUploader.jsx` | **MODIFY** — dynamic local picker: merge storage files |

## Verification

1. `supabase db push` — apply both migrations
2. Open admin → Content Manager → Home tab → "Browse our menu boards" → should show **Edit** button with proper fields
3. Add/change menu images → Save → refresh home page to verify
4. Upload an image via the Upload button → open Local picker → new image should appear

## Future Consideration

For a fully dynamic local image list without hardcoding, we could add a build-time script that scans `public/images/` and generates the category JSON. But that requires the user to have local repo access. The Supabase Storage merge approach covers the more common case (admin uploads).
