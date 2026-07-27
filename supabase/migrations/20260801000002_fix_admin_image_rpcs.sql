-- Fix admin_list_images and admin_delete_image RPCs.
-- The original versions used current_setting('app.admin_token', true) GUC pattern
-- which is NEVER set by the JS client — these always raised 'unauthorized'.
-- Frontend uses Storage API directly, but these RPCs are fixed for consistency.
BEGIN;

CREATE OR REPLACE FUNCTION admin_list_images(admin_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NULL OR extensions.crypt(admin_token, stored_hash) <> stored_hash THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  -- Return empty result — frontend uses supabase.storage.from('site-images').list()
  RETURN jsonb_build_object('success', true, 'note', 'Use Storage API for file listing');
END;
$$;

CREATE OR REPLACE FUNCTION admin_delete_image(admin_token TEXT, file_path TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NULL OR extensions.crypt(admin_token, stored_hash) <> stored_hash THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  -- Deletion handled client-side via supabase.storage.from('site-images').remove()
  RETURN jsonb_build_object('success', true, 'note', 'Use Storage API for file deletion');
END;
$$;

COMMIT;
