-- Block direct SELECT on orders and contact_messages tables.
-- Admin panel uses SECURITY DEFINER RPCs (admin_read_orders, admin_read_messages, etc.)
-- that bypass RLS entirely. These explicit deny policies are defense-in-depth.
BEGIN;

DROP POLICY IF EXISTS "Block direct select on orders" ON orders;
DROP POLICY IF EXISTS "Block direct select on contact_messages" ON contact_messages;

CREATE POLICY "Block direct select on orders"
ON orders FOR SELECT
USING (false);

CREATE POLICY "Block direct select on contact_messages"
ON contact_messages FOR SELECT
USING (false);

COMMIT;
