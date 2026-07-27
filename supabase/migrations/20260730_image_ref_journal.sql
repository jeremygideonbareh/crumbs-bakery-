-- Image Reference Journal — automatic tracking of image URLs in page_sections.data
-- 
-- Creates:
--   1. extract_image_urls_with_paths() — recursive JSONB scanner
--   2. page_section_image_refs — table storing extracted URLs + JSON paths
--   3. log_page_section_images() — trigger that auto-populates refs on data write
--   4. admin_recover_section_images() — RPC to retrieve stored image refs
--
-- CRITICAL: The trigger NEVER destroys refs when data is cleared (data = '{}').
-- This ensures images can be restored even after an accidental clear.

-- ────────────────────────────────────────────────────────────────────────────────
-- 1. Helper: extract_image_urls_with_paths
-- ────────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION extract_image_urls_with_paths(
  doc JSONB,
  base_path TEXT DEFAULT '$'
)
RETURNS TABLE(url TEXT, path TEXT)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  path_prefix TEXT;
  key TEXT;
  elem JSONB;
  idx INT;
  val TEXT;
BEGIN
  -- Normalise path: strip leading '$' from root
  path_prefix := CASE WHEN base_path = '$' THEN '' ELSE base_path END;
  
  IF jsonb_typeof(doc) = 'object' THEN
    -- Recurse into each object key
    FOR key IN SELECT jsonb_object_keys(doc) LOOP
      RETURN QUERY SELECT * FROM extract_image_urls_with_paths(
        doc->key,
        CASE WHEN path_prefix = '' THEN key ELSE path_prefix || '.' || key END
      );
    END LOOP;
    
  ELSIF jsonb_typeof(doc) = 'array' THEN
    -- Recurse into each array element with index
    idx := 0;
    FOR elem IN SELECT jsonb_array_elements(doc) LOOP
      RETURN QUERY SELECT * FROM extract_image_urls_with_paths(
        elem,
        path_prefix || '[' || idx || ']'
      );
      idx := idx + 1;
    END LOOP;
    
  ELSIF jsonb_typeof(doc) = 'string' THEN
    -- Check if this string is an image URL
    val := doc #>> '{}';
    IF val ~* '^https?://'
       OR val ~* '^/images/'
       OR val ~* '\.(jpe?g|png|webp|gif)(\?|$)' THEN
      url := val;
      path := path_prefix;
      RETURN NEXT;
    END IF;
  END IF;
END;
$$;

-- ────────────────────────────────────────────────────────────────────────────────
-- 2. Table: page_section_image_refs
-- ────────────────────────────────────────────────────────────────────────────────

CREATE TABLE page_section_image_refs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  section_key TEXT NOT NULL,
  image_url TEXT NOT NULL,
  json_path TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_refs_section_key ON page_section_image_refs(section_key);

-- RLS: everyone can SELECT (needed for admin RPC), no direct write
ALTER TABLE page_section_image_refs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read image refs"
  ON page_section_image_refs
  FOR SELECT
  USING (true);

-- No INSERT/UPDATE/DELETE policies — writes are handled exclusively by the trigger

-- ────────────────────────────────────────────────────────────────────────────────
-- 3. Trigger: auto-populate refs on page_sections.data changes
-- ────────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION log_page_section_images()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- CRITICAL: Never destroy refs when data is empty/cleared
  IF NEW.data IS NULL OR NEW.data = '{}'::jsonb THEN
    RETURN NEW;
  END IF;

  -- Replace refs for this section with current image URLs + paths
  DELETE FROM page_section_image_refs WHERE section_key = NEW.section_key;

  INSERT INTO page_section_image_refs (section_key, image_url, json_path, updated_at)
  SELECT NEW.section_key, url, path, now()
  FROM extract_image_urls_with_paths(NEW.data);

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_log_page_section_images
  AFTER INSERT OR UPDATE OF data ON page_sections
  FOR EACH ROW
  EXECUTE FUNCTION log_page_section_images();

-- ────────────────────────────────────────────────────────────────────────────────
-- 4. RPC: admin_recover_section_images — retrieve stored refs (field-aware)
-- ────────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION admin_recover_section_images(
  admin_token TEXT,
  p_section_key TEXT DEFAULT NULL
)
RETURNS TABLE(section_key TEXT, image_url TEXT, json_path TEXT, updated_at TIMESTAMPTZ)
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE stored_hash text;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';

  IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
    IF p_section_key IS NULL THEN
      RETURN QUERY SELECT r.section_key, r.image_url, r.json_path, r.updated_at
      FROM page_section_image_refs r
      ORDER BY r.updated_at DESC;
    ELSE
      RETURN QUERY SELECT r.section_key, r.image_url, r.json_path, r.updated_at
      FROM page_section_image_refs r
      WHERE r.section_key = p_section_key
      ORDER BY r.updated_at DESC;
    END IF;
    RETURN;
  END IF;

  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;
