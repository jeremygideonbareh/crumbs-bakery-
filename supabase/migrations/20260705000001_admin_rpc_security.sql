-- SECURE ADMIN RPC FUNCTIONS
-- Replaces public SELECT on orders/contact_messages with password-gated RPCs
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Store hashed admin password
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS admin_config (
  key text PRIMARY KEY,
  value text NOT NULL
);

-- Password hash is NOT seeded in version control.
-- Set it via Supabase SQL Editor after deploy:
--   INSERT INTO admin_config (key, value)
--   VALUES ('password_hash', extensions.crypt('your_password', extensions.gen_salt('bf')))
--   ON CONFLICT (key) DO UPDATE SET value = extensions.crypt('your_password', extensions.gen_salt('bf'));

-- 2. RPC: list orders
CREATE OR REPLACE FUNCTION admin_read_orders(admin_token text)
RETURNS SETOF orders
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    RETURN QUERY SELECT * FROM orders ORDER BY created_at DESC;
  END IF;
END;
$$;

-- 3. RPC: count orders
CREATE OR REPLACE FUNCTION admin_count_orders(admin_token text)
RETURNS integer
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    RETURN (SELECT count(*) FROM orders);
  END IF;
  RETURN 0;
END;
$$;

-- 4. RPC: recent orders (limited)
CREATE OR REPLACE FUNCTION admin_recent_orders(admin_token text, max_count integer DEFAULT 5)
RETURNS SETOF orders
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    RETURN QUERY SELECT * FROM orders ORDER BY created_at DESC LIMIT max_count;
  END IF;
END;
$$;

-- 5. RPC: update order status
CREATE OR REPLACE FUNCTION admin_update_order_status(admin_token text, order_id bigint, new_status text)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    UPDATE orders SET status = new_status WHERE id = order_id;
  END IF;
END;
$$;

-- 6. RPC: list contact messages
CREATE OR REPLACE FUNCTION admin_read_messages(admin_token text)
RETURNS SETOF contact_messages
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    RETURN QUERY SELECT * FROM contact_messages ORDER BY created_at DESC;
  END IF;
END;
$$;

-- 7. RPC: count unread messages
CREATE OR REPLACE FUNCTION admin_unread_message_count(admin_token text)
RETURNS integer
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    RETURN (SELECT count(*) FROM contact_messages WHERE read = false);
  END IF;
  RETURN 0;
END;
$$;

-- 8. RPC: toggle message read status
CREATE OR REPLACE FUNCTION admin_toggle_message_read(admin_token text, msg_id bigint)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    UPDATE contact_messages SET read = NOT read WHERE id = msg_id;
  END IF;
END;
$$;

-- 9. RPC: delete message
CREATE OR REPLACE FUNCTION admin_delete_message(admin_token text, msg_id bigint)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    DELETE FROM contact_messages WHERE id = msg_id;
  END IF;
END;
$$;

-- 10. Lock down: block direct SELECT on sensitive tables
DROP POLICY IF EXISTS "Admins can read orders" ON orders;
DROP POLICY IF EXISTS "Admins can read messages" ON contact_messages;
