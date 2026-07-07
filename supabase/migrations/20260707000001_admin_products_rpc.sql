-- SECURITY DEFINER RPCs for products CRUD
-- Run this in Supabase Dashboard → SQL Editor

-- Remove any existing public-write policies
DROP POLICY IF EXISTS "Anyone can insert products" ON products;
DROP POLICY IF EXISTS "Anyone can update products" ON products;
DROP POLICY IF EXISTS "Anyone can delete products" ON products;

-- RPC: read all products (including inactive)
CREATE OR REPLACE FUNCTION admin_read_products(admin_token text)
RETURNS SETOF products
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    RETURN QUERY SELECT * FROM products ORDER BY sort_order;
  END IF;
END;
$$;

-- RPC: create product
CREATE OR REPLACE FUNCTION admin_create_product(admin_token text, product_data jsonb)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    INSERT INTO products (name, slug, price, image, description, variants, badge, category_slug, active, sort_order)
    SELECT
      name, slug, price, image, description,
      COALESCE(variants, '[]'::jsonb), badge, category_slug,
      COALESCE(active, true), COALESCE(sort_order, 0)
    FROM jsonb_to_record(product_data) AS x(
      name text, slug text, price text, image text, description text,
      variants jsonb, badge text, category_slug text, active boolean, sort_order integer
    );
  END IF;
END;
$$;

-- RPC: update product
CREATE OR REPLACE FUNCTION admin_update_product(admin_token text, product_id bigint, product_data jsonb)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
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
  END IF;
END;
$$;

-- RPC: delete product
CREATE OR REPLACE FUNCTION admin_delete_product(admin_token text, product_id bigint)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    DELETE FROM products WHERE id = product_id;
  END IF;
END;
$$;
