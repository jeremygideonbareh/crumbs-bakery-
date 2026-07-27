-- Seed missing product grid and menu category sections
-- These sections have no data because products come from the `products` table
-- and menu_categories data will be populated via admin.
BEGIN;

-- Ensure pgcrypto extension exists (required for extensions.crypt() in RPCs)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO page_sections (section_key, section_label, section_type) VALUES
  ('cakes_product_grid', 'Cakes Product Grid', 'product_grid'),
  ('cupcakes_product_grid', 'Cupcakes Product Grid', 'product_grid'),
  ('desserts_product_grid', 'Desserts Product Grid', 'product_grid'),
  ('menu_categories', 'Menu Categories & Items', 'menu_categories')
ON CONFLICT (section_key) DO NOTHING;

COMMIT;
