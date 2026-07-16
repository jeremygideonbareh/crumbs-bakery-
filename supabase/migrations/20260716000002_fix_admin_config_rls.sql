-- Enable RLS on admin_config + Add password seed helper
--
-- admin_config stores the password_hash used by all SECURITY DEFINER RPCs.
-- It had NO RLS enabled — anyone with the Supabase anon key could
-- SELECT * FROM admin_config and read the bcrypt hash.
--
-- Since our RPC auth uses DECLARE + SELECT INTO (which bypasses RLS
-- due to SECURITY DEFINER), we can safely block ALL direct access.

ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

-- Block all direct table access — SECURITY DEFINER functions bypass RLS
CREATE POLICY "Block all direct admin_config access"
  ON admin_config FOR ALL USING (false);

-- Helper function to seed/update admin password
CREATE OR REPLACE FUNCTION admin_set_password(new_password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO admin_config (key, value)
  VALUES ('password_hash', extensions.crypt(new_password, extensions.gen_salt('bf')))
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
  RETURN 'Password updated successfully';
END;
$$;

-- Seed default password if not exists (password: admin123)
INSERT INTO admin_config (key, value)
SELECT 'password_hash', extensions.crypt('admin123', extensions.gen_salt('bf'))
WHERE NOT EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash');
