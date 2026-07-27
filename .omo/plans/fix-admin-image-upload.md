# Fix Admin Image Upload — Supabase Storage Bucket Setup

## TL;DR

**Problem:** The "Upload" button in the admin Content Manager image picker does nothing / silently fails. The Upload button calls `supabase.storage.from('site-images').upload(...)`, but the `site-images` storage bucket **was never created** in Supabase.

**Evidence:** Migration `20260721000000_image_storage.sql` line 3 says: *"Then manually create a storage bucket named 'site-images' in Supabase Dashboard → Storage"* — this step was never done. The bucket doesn't exist, so every upload attempt fails with a 404.

## Root Cause

- `src/components/admin/ImageUploader.jsx` calls `supabase.storage.from('site-images').upload(filename, file)` 
- The Supabase storage bucket `site-images` does not exist
- The error handler catches it and shows: *"Upload failed. Make sure the site-images bucket exists in Supabase Storage."*

## Fix

Create a new Supabase migration that:

1. **Creates the bucket** `site-images` (idempotent — `ON CONFLICT DO NOTHING`)
2. **Sets RLS policies** for:
   - `SELECT` — allow public/anonymous reads (anyone can view uploaded images)
   - `INSERT` — allow anon key inserts (admin panel uses the anon key, not Supabase Auth, because admin login is a simple password check — not Supabase Auth)

## New Migration File

`supabase/migrations/20260726000001_create_site_images_bucket.sql`

```sql
BEGIN;

-- Create the bucket (idempotent)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  10485760, -- 10MB
  '{image/jpeg,image/png,image/webp,image/gif}'
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if any (safe to re-run)
DROP POLICY IF EXISTS "Public Read site-images" ON storage.objects;
DROP POLICY IF EXISTS "Anon Insert site-images" ON storage.objects;

-- Public read access
CREATE POLICY "Public Read site-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');

-- Anon key uploads (admin panel uses anon key)
CREATE POLICY "Anon Insert site-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'site-images');

COMMIT;
```

## Verification

1. Run `supabase db push` — migration should apply cleanly
2. Open admin → Content Manager → edit any section with an image → click Upload → select a file
3. File should upload and show as a preview in the SectionEditorModal
4. Navigate to Supabase Dashboard → Storage → should see `site-images` bucket with the uploaded file

## Files Changed

| File | Change |
|------|--------|
| `supabase/migrations/20260726000001_create_site_images_bucket.sql` | **NEW** — creates bucket + RLS policies |

## Why Not Supabase Auth?

The admin login (`src/pages/admin/AdminLogin.jsx`) uses a simple password check against `VITE_ADMIN_PASSWORD` stored in sessionStorage — it does NOT call `supabase.auth.signInWithPassword()`. So uploads happen with the anon key, not an authenticated session. The RLS policy `"Anon Insert site-images"` is required for this to work.
