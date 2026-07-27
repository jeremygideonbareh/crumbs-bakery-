-- Seed About page sections into page_sections table

BEGIN;

INSERT INTO page_sections (section_key, section_label, section_type) VALUES
  ('about_hero', 'About Hero', 'content_single'),
  ('about_story', 'About Story', 'content_with_image'),
  ('about_timeline', 'About Timeline', 'about_timeline'),
  ('about_values', 'About Values', 'card_grid_simple'),
  ('about_team', 'About Team', 'team'),
  ('about_cta', 'About CTA', 'content_single')
ON CONFLICT (section_key) DO NOTHING;

COMMIT;
