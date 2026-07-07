-- SECURITY DEFINER RPCs for categories CRUD
-- Run this in Supabase Dashboard → SQL Editor

-- Remove any existing public-write policies
DROP POLICY IF EXISTS "Anyone can insert categories" ON categories;
DROP POLICY IF EXISTS "Anyone can update categories" ON categories;
DROP POLICY IF EXISTS "Anyone can delete categories" ON categories;

-- RPC: read all categories
CREATE OR REPLACE FUNCTION admin_read_categories(admin_token text)
RETURNS SETOF categories
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    RETURN QUERY SELECT * FROM categories ORDER BY id;
  END IF;
END;
$$;

-- RPC: create category
CREATE OR REPLACE FUNCTION admin_create_category(admin_token text, category_data jsonb)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    INSERT INTO categories (slug, name, description, hero_image)
    SELECT slug, name, description, hero_image
    FROM jsonb_to_record(category_data) AS x(slug text, name text, description text, hero_image text);
  END IF;
END;
$$;

-- RPC: update category
CREATE OR REPLACE FUNCTION admin_update_category(admin_token text, category_id bigint, category_data jsonb)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    UPDATE categories SET
      slug = COALESCE((category_data->>'slug')::text, slug),
      name = COALESCE((category_data->>'name')::text, name),
      description = COALESCE((category_data->>'description')::text, description),
      hero_image = COALESCE((category_data->>'hero_image')::text, hero_image)
    WHERE id = category_id;
  END IF;
END;
$$;

-- RPC: delete category
CREATE OR REPLACE FUNCTION admin_delete_category(admin_token text, category_id bigint)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    DELETE FROM categories WHERE id = category_id;
  END IF;
END;
$$;
