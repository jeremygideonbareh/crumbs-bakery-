-- Image Management — Supabase Storage bucket + RPCs for admin image uploads
-- Run this in Supabase Dashboard → SQL Editor
-- Then manually create a storage bucket named 'site-images' in Supabase Dashboard → Storage

-- RPC: List all images in the site-images bucket
CREATE OR REPLACE FUNCTION admin_list_images(admin_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  IF admin_token <> current_setting('app.admin_token', true)::TEXT THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  
  -- Return empty array — actual file listing is done client-side via supabase.storage
  RETURN jsonb_build_object('success', true);
END;
$$;

-- RPC: Delete an image from the site-images bucket
CREATE OR REPLACE FUNCTION admin_delete_image(admin_token TEXT, file_path TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF admin_token <> current_setting('app.admin_token', true)::TEXT THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  
  -- Deletion is handled client-side via supabase.storage
  -- This RPC exists for server-side validation if needed
  RETURN jsonb_build_object('success', true);
END;
$$;

-- Storage bucket RLS policies (run after creating bucket in dashboard)
-- CREATE POLICY "Public read access for site-images"
-- ON storage.objects FOR SELECT USING (bucket_id = 'site-images');
--
-- CREATE POLICY "Admin write access for site-images"
-- ON storage.objects FOR INSERT WITH CHECK (
--   bucket_id = 'site-images' 
--   AND (auth.role() = 'authenticated' OR current_setting('app.admin_token', true) IS NOT NULL)
-- );
--
-- CREATE POLICY "Admin delete access for site-images"
-- ON storage.objects FOR DELETE USING (
--   bucket_id = 'site-images'
--   AND (auth.role() = 'authenticated' OR current_setting('app.admin_token', true) IS NOT NULL)
-- );
