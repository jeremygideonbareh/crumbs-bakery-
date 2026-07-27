-- Guard admin_delete_category against deleting categories that still have products.
-- The original function had no pre-check for related products, so deleting a
-- category referenced by products.category_slug would throw a raw FK constraint error.
BEGIN;

CREATE OR REPLACE FUNCTION admin_delete_category(admin_token TEXT, category_id BIGINT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_hash TEXT;
  cat_slug TEXT;
  product_count INT;
BEGIN
  -- Auth check
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NULL OR extensions.crypt(admin_token, stored_hash) <> stored_hash THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  -- Get category slug
  SELECT slug INTO cat_slug FROM categories WHERE id = category_id;
  IF cat_slug IS NULL THEN
    RAISE EXCEPTION 'Category not found';
  END IF;

  -- Check for related products
  SELECT count(*) INTO product_count FROM products WHERE category_slug = cat_slug;
  IF product_count > 0 THEN
    RAISE EXCEPTION 'Cannot delete category that has % product(s). Reassign or remove the products first.', product_count;
  END IF;

  -- Safe to delete
  DELETE FROM categories WHERE id = category_id;
END;
$$;

COMMIT;
