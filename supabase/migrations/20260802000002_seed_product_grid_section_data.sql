-- Populate page_sections.data for product_grid sections from the products table.
-- Only updates when data is NULL so admin edits are never overwritten.
BEGIN;

UPDATE page_sections
SET data = sub.products_json
FROM (
  SELECT
    ps.id AS ps_id,
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'name', p.name,
          'price', p.price,
          'image', p.image,
          'desc', p.description,
          'badge', COALESCE(p.badge, ''),
          'variants', CASE
            WHEN p.variants IS NULL OR p.variants = '[]'::jsonb THEN ''
            ELSE (SELECT string_agg(elem::text, ', ') FROM jsonb_array_elements_text(p.variants) AS elem)
          END
        )
        ORDER BY p.sort_order
      )
      FROM products p
      WHERE p.category_slug = REPLACE(ps.section_key, '_product_grid', '')
        AND p.active = true
    ) AS products_json
  FROM page_sections ps
  WHERE ps.section_key IN ('cakes_product_grid', 'cupcakes_product_grid', 'desserts_product_grid')
    AND (ps.data IS NULL OR ps.data = '{}'::jsonb)
) sub
WHERE page_sections.id = sub.ps_id
  AND sub.products_json IS NOT NULL;

COMMIT;
