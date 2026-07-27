-- Seed category page sections (Cakes, Cupcakes, Desserts) into page_sections table
-- Each page gets a hero section + delivery section for CMS editing.

BEGIN;

INSERT INTO page_sections (section_key, section_label, section_type) VALUES
  ('cakes_hero', 'Cakes Hero', 'category_hero'),
  ('cakes_delivery', 'Cakes Delivery Section', 'delivery_compact'),
  ('cupcakes_hero', 'Cupcakes Hero', 'category_hero'),
  ('cupcakes_delivery', 'Cupcakes Delivery Section', 'delivery_compact'),
  ('desserts_hero', 'Desserts Hero', 'category_hero'),
  ('desserts_delivery', 'Desserts Delivery Section', 'delivery_compact')
ON CONFLICT (section_key) DO NOTHING;

COMMIT;
