-- Temporary RPC: clear all page_sections data for re-seeding
-- Admin-authenticated, sets all section data to empty JSONB
-- After seeding, drop this RPC (or keep as utility)

CREATE OR REPLACE FUNCTION admin_clear_all_section_data(admin_token TEXT)
RETURNS JSONB
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash text;
  cleared_count int;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
    UPDATE page_sections SET data = '{}'::jsonb, updated_at = now() WHERE true;
    GET DIAGNOSTICS cleared_count = ROW_COUNT;
    RETURN jsonb_build_object('success', true, 'cleared', cleared_count);
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;
