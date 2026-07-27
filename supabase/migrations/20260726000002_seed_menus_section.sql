-- Seed the 'menus' section into page_sections table
-- This section was missing from the original seed migration (20260709_page_sections.sql)
-- Without this row, the admin panel shows it as "Pending" with no editable fields.

BEGIN;

INSERT INTO page_sections (section_key, section_label, section_type)
VALUES ('menus', 'Menu Gallery', 'menus')
ON CONFLICT (section_key) DO NOTHING;

COMMIT;
