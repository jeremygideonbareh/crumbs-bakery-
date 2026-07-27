-- Migration: Fix image paths in page_sections data
-- Replaces /crumbs-bakery-/images/ with /images/ in all JSONB text values

BEGIN;

-- Simple text-level replace on the JSONB text representation.
-- Safe because /crumbs-bakery-/images/ only appears as image path prefixes
-- and never as part of JSON structure keys or non-path text.
UPDATE public.page_sections
SET data = replace(data::text, '/crumbs-bakery-/images/', '/images/')::jsonb
WHERE data::text LIKE '%/crumbs-bakery-/images/%';

COMMIT;
