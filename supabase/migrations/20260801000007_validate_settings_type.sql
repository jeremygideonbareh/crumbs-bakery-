-- Add type validation to admin_save_settings so stored values
-- respect each setting's declared type (boolean / color / number / text).
BEGIN;

CREATE OR REPLACE FUNCTION admin_save_settings(admin_token TEXT, setting_data JSONB)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash TEXT;
  rec RECORD;
  expected_type TEXT;
BEGIN
  -- Auth check (correct pattern)
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NULL OR extensions.crypt(admin_token, stored_hash) <> stored_hash THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  -- Validate each setting against its declared type
  FOR rec IN SELECT key, value FROM jsonb_to_recordset(setting_data) AS x(key text, value text)
  LOOP
    SELECT s.type INTO expected_type FROM site_settings s WHERE s.key = rec.key;

    -- Skip validation for new keys not yet in the type table
    IF expected_type IS NULL THEN
      CONTINUE;
    END IF;

    IF expected_type = 'boolean' AND rec.value NOT IN ('true', 'false') THEN
      RAISE EXCEPTION 'Setting "%" requires a boolean value (true/false), got: %', rec.key, rec.value;
    END IF;
    IF expected_type = 'color' AND rec.value !~ '^#[0-9a-fA-F]{3,6}$' THEN
      RAISE EXCEPTION 'Setting "%" requires a valid hex color (e.g. #fff), got: %', rec.key, rec.value;
    END IF;
    IF expected_type = 'number' AND rec.value !~ '^-?\d+(\.\d+)?$' THEN
      RAISE EXCEPTION 'Setting "%" requires a numeric value, got: %', rec.key, rec.value;
    END IF;

    INSERT INTO site_settings (key, value)
    VALUES (rec.key, rec.value)
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
  END LOOP;
END;
$$;

COMMIT;
