-- FIX ALL ADMIN RPCS: Apply correct DECLARE + crypt auth pattern
--
-- The original RPCs use the broken IF EXISTS pattern:
--   IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value))
-- This silently returns empty results / no-ops inside SECURITY DEFINER functions.
--
-- The page_sections RPCs use current_setting('app.admin_token') GUC which is NEVER
-- set by the JS client — these also silently return empty results.
--
-- Correct pattern:
--   DECLARE stored_hash text;
--   SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
--   IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
--     ... logic ...
--     RETURN;  -- required after RETURN QUERY for SETOF functions
--   END IF;
--   RAISE EXCEPTION 'Invalid admin token';

-- ────────────────────────────────────────────────────────────────────────────
-- REVIEWS (4 functions)
-- ────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION admin_read_reviews(admin_token text)
RETURNS SETOF reviews
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
    RETURN QUERY SELECT * FROM reviews ORDER BY created_at DESC;
    RETURN;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

CREATE OR REPLACE FUNCTION admin_count_unapproved_reviews(admin_token text)
RETURNS integer
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
    RETURN (SELECT count(*) FROM reviews WHERE approved = false);
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

CREATE OR REPLACE FUNCTION admin_toggle_review_approval(admin_token text, review_id bigint)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
    UPDATE reviews SET approved = NOT approved WHERE id = review_id;
    RETURN;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

CREATE OR REPLACE FUNCTION admin_delete_review(admin_token text, review_id bigint)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
    DELETE FROM reviews WHERE id = review_id;
    RETURN;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

-- ────────────────────────────────────────────────────────────────────────────
-- PRODUCTS (4 functions)
-- ────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION admin_read_products(admin_token text)
RETURNS SETOF products
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
    RETURN QUERY SELECT * FROM products ORDER BY sort_order;
    RETURN;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

CREATE OR REPLACE FUNCTION admin_create_product(admin_token text, product_data jsonb)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
    INSERT INTO products (name, slug, price, image, description, variants, badge, category_slug, active, sort_order)
    SELECT
      name, slug, price, image, description,
      COALESCE(variants, '[]'::jsonb), badge, category_slug,
      COALESCE(active, true), COALESCE(sort_order, 0)
    FROM jsonb_to_record(product_data) AS x(
      name text, slug text, price text, image text, description text,
      variants jsonb, badge text, category_slug text, active boolean, sort_order integer
    );
    RETURN;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

CREATE OR REPLACE FUNCTION admin_update_product(admin_token text, product_id bigint, product_data jsonb)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
    UPDATE products SET
      name = COALESCE((product_data->>'name')::text, name),
      slug = COALESCE((product_data->>'slug')::text, slug),
      price = COALESCE((product_data->>'price')::text, price),
      image = COALESCE((product_data->>'image')::text, image),
      description = COALESCE((product_data->>'description')::text, description),
      variants = COALESCE(product_data->'variants', variants),
      badge = COALESCE((product_data->>'badge')::text, badge),
      category_slug = COALESCE((product_data->>'category_slug')::text, category_slug),
      active = COALESCE((product_data->>'active')::boolean, active),
      sort_order = COALESCE((product_data->>'sort_order')::integer, sort_order)
    WHERE id = product_id;
    RETURN;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

CREATE OR REPLACE FUNCTION admin_delete_product(admin_token text, product_id bigint)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
    DELETE FROM products WHERE id = product_id;
    RETURN;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

-- ────────────────────────────────────────────────────────────────────────────
-- CATEGORIES (4 functions)
-- ────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION admin_read_categories(admin_token text)
RETURNS SETOF categories
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
    RETURN QUERY SELECT * FROM categories ORDER BY id;
    RETURN;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

CREATE OR REPLACE FUNCTION admin_create_category(admin_token text, category_data jsonb)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
    INSERT INTO categories (slug, name, description, hero_image)
    SELECT slug, name, description, hero_image
    FROM jsonb_to_record(category_data) AS x(slug text, name text, description text, hero_image text);
    RETURN;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

CREATE OR REPLACE FUNCTION admin_update_category(admin_token text, category_id bigint, category_data jsonb)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
    UPDATE categories SET
      slug = COALESCE((category_data->>'slug')::text, slug),
      name = COALESCE((category_data->>'name')::text, name),
      description = COALESCE((category_data->>'description')::text, description),
      hero_image = COALESCE((category_data->>'hero_image')::text, hero_image)
    WHERE id = category_id;
    RETURN;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

CREATE OR REPLACE FUNCTION admin_delete_category(admin_token text, category_id bigint)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
    DELETE FROM categories WHERE id = category_id;
    RETURN;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

-- ────────────────────────────────────────────────────────────────────────────
-- SETTINGS (1 function)
-- ────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION admin_save_settings(admin_token text, setting_data jsonb)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
    INSERT INTO site_settings (key, value)
    SELECT key, value
    FROM jsonb_to_recordset(setting_data) AS x(key text, value text)
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
    RETURN;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

-- admin_read_settings: new RPC for reading site_settings (replaces direct supabase query)
CREATE OR REPLACE FUNCTION admin_read_settings(admin_token text)
RETURNS SETOF site_settings
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
    RETURN QUERY SELECT * FROM site_settings ORDER BY sort_order ASC;
    RETURN;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

-- ────────────────────────────────────────────────────────────────────────────
-- PAGE SECTIONS (2 functions — replace GUC auth with DECLARE + crypt)
-- ────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION admin_read_page_sections(admin_token TEXT)
RETURNS TABLE(id BIGINT, section_key TEXT, section_label TEXT, section_type TEXT, data JSONB, updated_at TIMESTAMPTZ)
SECURITY DEFINER
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
    RETURN QUERY
    SELECT ps.id, ps.section_key, ps.section_label, ps.section_type, ps.data, ps.updated_at
    FROM page_sections ps;
    RETURN;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

CREATE OR REPLACE FUNCTION admin_upsert_page_section(admin_token TEXT, p_key TEXT, p_label TEXT, p_type TEXT, p_data JSONB)
RETURNS JSONB
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NOT NULL AND extensions.crypt(admin_token, stored_hash) = stored_hash THEN
    INSERT INTO page_sections (section_key, section_label, section_type, data, updated_at)
    VALUES (p_key, p_label, p_type, p_data, now())
    ON CONFLICT (section_key)
    DO UPDATE SET data = p_data, section_label = p_label, section_type = p_type, updated_at = now();
    RETURN jsonb_build_object('success', true);
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

-- public_read_page_section is intentionally left unchanged — it requires no auth (public)
