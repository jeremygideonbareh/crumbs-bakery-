-- Seed guard: admin_ensure_page_section RPC
-- Inserts a page_sections row ONLY if the section_key doesn't exist.
-- NEVER touches the `data` column — admin panel customizations are safe.
-- Use admin_upsert_page_section (with data) for admin saves.
-- Use this RPC for seeding — it creates empty rows that fall back to contentDefaults.js.

BEGIN;

CREATE OR REPLACE FUNCTION admin_ensure_page_section(admin_token TEXT, p_key TEXT, p_label TEXT, p_type TEXT)
RETURNS JSONB
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
    INSERT INTO page_sections (section_key, section_label, section_type, updated_at)
    VALUES (p_key, p_label, p_type, now())
    ON CONFLICT (section_key)
    DO UPDATE SET updated_at = now();
    RETURN jsonb_build_object('success', true);
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

COMMIT;
