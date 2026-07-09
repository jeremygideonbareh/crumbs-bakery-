-- Content Sections — stores all page content as JSONB for dynamic section management
-- Each row = one page section with its complete data payload

CREATE TABLE IF NOT EXISTS page_sections (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  section_label TEXT NOT NULL,
  section_type TEXT NOT NULL DEFAULT 'content',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read page sections" 
  ON page_sections FOR SELECT USING (true);

-- Admin-only write via RPCs
CREATE POLICY "Only admins write page sections" 
  ON page_sections FOR ALL USING (false);

-- RPC: Public read single section
CREATE OR REPLACE FUNCTION public_read_page_section(section_key TEXT)
RETURNS JSONB
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(data, '{}'::jsonb) FROM page_sections WHERE section_key = $1;
$$;

-- RPC: Admin read all sections
CREATE OR REPLACE FUNCTION admin_read_page_sections(admin_token TEXT)
RETURNS TABLE(id BIGINT, section_key TEXT, section_label TEXT, section_type TEXT, data JSONB, updated_at TIMESTAMPTZ)
LANGUAGE sql
STABLE
AS $$
  SELECT id, section_key, section_label, section_type, data, updated_at 
  FROM page_sections 
  WHERE admin_token = current_setting('app.admin_token', true)::TEXT;
$$;

-- RPC: Admin upsert a section
CREATE OR REPLACE FUNCTION admin_upsert_page_section(admin_token TEXT, p_key TEXT, p_label TEXT, p_type TEXT, p_data JSONB)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
BEGIN
  IF admin_token <> current_setting('app.admin_token', true)::TEXT THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  
  INSERT INTO page_sections (section_key, section_label, section_type, data, updated_at)
  VALUES (p_key, p_label, p_type, p_data, now())
  ON CONFLICT (section_key) 
  DO UPDATE SET data = p_data, section_label = p_label, section_type = p_type, updated_at = now();
  
  RETURN jsonb_build_object('success', true);
END;
$$;

-- Seed all sections with default empty data
INSERT INTO page_sections (section_key, section_label, section_type) VALUES
  ('home_hero', 'Home Hero Section', 'hero'),
  ('category_grid', 'Category Grid', 'card_grid'),
  ('about', 'About Section', 'content_columns'),
  ('gallery', 'Photo Gallery', 'gallery'),
  ('news', 'News & Updates', 'news_list'),
  ('signature_items', 'Signature Menu Items', 'menu_items'),
  ('promo_cards', 'Promo / Perk Cards', 'card_grid'),
  ('image_carousel', 'Image Carousel', 'carousel'),
  ('product_carousel', 'Product Carousel', 'product_carousel'),
  ('delivery', 'Delivery Areas', 'delivery'),
  ('faq_section', 'FAQ / About Text', 'faq'),
  ('browse_by_bake', 'Browse By Bake', 'image_grid'),
  ('instagram', 'Instagram Section', 'social'),
  ('footer', 'Footer', 'footer'),
  ('hero_stats', 'Hero Social Proof Stats', 'stats')
ON CONFLICT (section_key) DO NOTHING;
