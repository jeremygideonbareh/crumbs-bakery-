-- Seed Reviews page sections into page_sections table

BEGIN;

INSERT INTO page_sections (section_key, section_label, section_type) VALUES
  ('reviews_hero', 'Reviews Hero', 'content_single'),
  ('reviews_cta', 'Reviews CTA', 'content_single')
ON CONFLICT (section_key) DO NOTHING;

COMMIT;
