-- Add performance indexes for common query patterns
BEGIN;

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages (read);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews (approved);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category_slug ON products (category_slug);
CREATE INDEX IF NOT EXISTS idx_products_active_sort ON products (active, sort_order);

COMMIT;
