-- SECURITY DEFINER RPC for site_settings writes
-- Replaces public INSERT/UPDATE/DELETE policies with password-gated RPC
-- Run after supabase/migrations/20260705000000_site_settings.sql

-- Drop insecure public-write policies
DROP POLICY IF EXISTS "Admins can insert site_settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can update site_settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can delete site_settings" ON site_settings;

-- RPC: batch save settings (upsert by key)
CREATE OR REPLACE FUNCTION admin_save_settings(admin_token text, setting_data jsonb)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    INSERT INTO site_settings (key, value)
    SELECT key, value
    FROM jsonb_to_recordset(setting_data) AS x(key text, value text)
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
  END IF;
END;
$$;
