-- Seed Contact page sections into page_sections table

BEGIN;

INSERT INTO page_sections (section_key, section_label, section_type) VALUES
  ('contact_hero', 'Contact Hero', 'content_single'),
  ('contact_info', 'Contact Info Cards', 'contact_cards'),
  ('contact_map', 'Contact Map', 'map_embed'),
  ('contact_faq', 'Contact FAQ', 'faq_simple')
ON CONFLICT (section_key) DO NOTHING;

COMMIT;
