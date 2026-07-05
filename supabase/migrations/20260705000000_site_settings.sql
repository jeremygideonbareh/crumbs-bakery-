-- Site Settings table for CMS
-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS site_settings (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'richtext', 'image', 'color', 'number', 'boolean')),
  section text NOT NULL DEFAULT 'general' CHECK (section IN ('general', 'hero', 'about', 'footer', 'contact', 'products', 'social')),
  label text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (public site uses them)
CREATE POLICY "Anyone can read site_settings" ON site_settings FOR SELECT USING (true);

-- Write operations are gated via SECURITY DEFINER RPC (admin_save_settings).
-- No direct INSERT/UPDATE/DELETE policies — admin panel uses RPC with password auth.
-- See supabase/migrations/20260705000002_admin_site_settings_rpc.sql

-- Insert default site settings
INSERT INTO site_settings (key, value, type, section, label, sort_order) VALUES
  -- Hero Section
  ('hero_title', 'Where every <span class="italic">crumb</span> tells a story', 'richtext', 'hero', 'Hero Title (HTML allowed)', 1),
  ('hero_subtitle', 'Handcrafted tiramisu, cream puffs, cheesecakes, and artisanal bakes — made fresh daily in the heart of Shillong.', 'text', 'hero', 'Hero Subtitle', 2),
  ('hero_slogan', 'SHILLONG''S BEST-KEPT SECRET', 'text', 'hero', 'Hero Slogan (badge text)', 3),
  ('hero_image', 'https://images.unsplash.com/photo-1775210603506-201ed7bec326?w=1920&q=80', 'image', 'hero', 'Hero Background Image URL', 4),
  ('hero_cta_text', 'ORDER CUSTOM CAKE', 'text', 'hero', 'Hero CTA Button Text', 5),

  -- About Section
  ('about_title', 'Handcrafted with love in Shillong', 'text', 'about', 'About Section Title', 10),
  ('about_text', 'At Crumbs Bakery & Cafe, we believe every bite should tell a story. From our signature tiramisu to custom celebration cakes, every creation is handcrafted using the finest ingredients.', 'richtext', 'about', 'About Section Text', 11),

  -- Footer
  ('footer_tagline', 'Handcrafted with love in the heart of Shillong. Every crumb tells a story.', 'text', 'footer', 'Footer Tagline', 20),
  ('footer_email', 'hello@crumbs.in', 'text', 'footer', 'Footer Email', 21),
  ('footer_phone', '+91 96127 72089', 'text', 'footer', 'Footer Phone', 22),
  ('footer_address', 'Jaiaw Chapel Rd, opposite Jaiaw Presbyterian, Shillong, Meghalaya 793002', 'text', 'footer', 'Footer Address', 23),

  -- Contact Page
  ('contact_title', 'We''d love to hear from you', 'text', 'contact', 'Contact Page Title', 30),
  ('contact_subtitle', 'Whether it''s a custom cake order, a catering enquiry, or just to say hello — drop us a message and we''ll get back to you within an hour.', 'text', 'contact', 'Contact Page Subtitle', 31),
  ('contact_phone', '096127 72089', 'text', 'contact', 'Contact Phone Number', 32),
  ('contact_email', 'hello@crumbs.in', 'text', 'contact', 'Contact Email', 33),

  -- Social Media
  ('instagram_url', 'https://www.instagram.com/crumbsbakery/', 'text', 'social', 'Instagram URL', 40),
  ('facebook_url', 'https://www.facebook.com/crumbsbakery/', 'text', 'social', 'Facebook URL', 41),
  ('youtube_url', 'https://www.youtube.com/@crumbsbakery', 'text', 'social', 'YouTube URL', 42),

  -- General
  ('site_title', 'Crumbs Bakery & Cafe — Shillong', 'text', 'general', 'Site Title (browser tab)', 50),
  ('site_description', 'Crumbs Bakery & Cafe in Shillong, Meghalaya. Handcrafted tiramisu, cream puffs, cheesecake, and artisanal baked goods. Dine-in, takeaway, delivery.', 'text', 'general', 'Site Meta Description', 51),
  ('announcement_text', 'FREE DELIVERY IN SHILLONG ● ORDER BY 2PM FOR SAME DAY', 'text', 'general', 'Announcement Bar Text', 52),
  ('store_hours', 'Mon–Sat: 8:00 AM – 9:30 PM | Sun: 10:00 AM – 6:00 PM', 'text', 'general', 'Store Hours', 53);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();

-- Enable realtime for site_settings (so admin changes reflect immediately)
ALTER PUBLICATION supabase_realtime ADD TABLE site_settings;
