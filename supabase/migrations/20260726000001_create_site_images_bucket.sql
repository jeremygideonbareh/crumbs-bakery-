-- Create site-images storage bucket + RLS policies for admin image uploads
-- The admin panel uses the anon key (not Supabase Auth), so we need
-- anon-key-friendly policies for INSERT.

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

-- Allow public read access (anyone can view uploaded images)
CREATE POLICY "Public Read site-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');

-- Allow anon key uploads (admin panel uses anon key, not Supabase Auth)
CREATE POLICY "Anon Insert site-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'site-images');

COMMIT;
