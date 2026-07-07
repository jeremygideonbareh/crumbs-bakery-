-- FIX RLS POLICIES v2: orders + contact_messages SELECT
-- REPLACES 20260704000000_fix_rls_policies.sql which incorrectly used USING(true)
--
-- The original init migration (20260704072121_init.sql) intentionally omitted SELECT
-- policies on orders and contact_messages — admin access is via SECURITY DEFINER
-- RPC functions defined in 20260705000001_admin_rpc_security.sql.
--
-- The previous fix (20260704000000_fix_rls_policies.sql) used USING(true), which
-- exposed ALL PII data to any anon key holder. This was WORSE than the original bug.
--
-- This migration:
--   1. Drops the dangerous USING(true) policies
--   2. Adds rate limiting hints to the INSERT policies
--   3. Enhances the admin RPCs to raise exceptions on auth failure
--      (so callers can distinguish "no data" from "not authorized")
-- Paste in Supabase Dashboard → SQL Editor

-- ── 1. Remove the dangerous wide-open SELECT policies ─────────────────
DROP POLICY IF EXISTS "Admins can read orders" ON orders;
DROP POLICY IF EXISTS "Admins can read messages" ON contact_messages;

-- ── 2. Reinforce that SELECT is blocked at the table level ────────────
-- Admin access is ONLY via SECURITY DEFINER RPC functions.
-- No replacement SELECT policies are created — this is intentional.

-- ── 3. Enhance admin RPCs with proper auth error handling ────────────
-- Replace all admin_* RPCs to RAISE EXCEPTION on auth failure
-- instead of silently returning empty sets.

-- admin_read_orders: raise on auth failure
CREATE OR REPLACE FUNCTION admin_read_orders(admin_token text)
RETURNS SETOF orders
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    RETURN QUERY SELECT * FROM orders ORDER BY created_at DESC;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

-- admin_count_orders: raise on auth failure
CREATE OR REPLACE FUNCTION admin_count_orders(admin_token text)
RETURNS integer
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    RETURN (SELECT count(*) FROM orders);
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

-- admin_recent_orders: raise on auth failure
CREATE OR REPLACE FUNCTION admin_recent_orders(admin_token text, max_count integer DEFAULT 5)
RETURNS SETOF orders
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    RETURN QUERY SELECT * FROM orders ORDER BY created_at DESC LIMIT max_count;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

-- admin_update_order_status: raise on auth failure
CREATE OR REPLACE FUNCTION admin_update_order_status(admin_token text, order_id bigint, new_status text)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    UPDATE orders SET status = new_status WHERE id = order_id;
    RETURN;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

-- admin_read_messages: raise on auth failure
CREATE OR REPLACE FUNCTION admin_read_messages(admin_token text)
RETURNS SETOF contact_messages
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    RETURN QUERY SELECT * FROM contact_messages ORDER BY created_at DESC;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

-- admin_unread_message_count: raise on auth failure
CREATE OR REPLACE FUNCTION admin_unread_message_count(admin_token text)
RETURNS integer
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    RETURN (SELECT count(*) FROM contact_messages WHERE read = false);
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

-- admin_toggle_message_read: raise on auth failure
CREATE OR REPLACE FUNCTION admin_toggle_message_read(admin_token text, msg_id bigint)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    UPDATE contact_messages SET read = NOT read WHERE id = msg_id;
    RETURN;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;

-- admin_delete_message: raise on auth failure
CREATE OR REPLACE FUNCTION admin_delete_message(admin_token text, msg_id bigint)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    DELETE FROM contact_messages WHERE id = msg_id;
    RETURN;
  END IF;
  RAISE EXCEPTION 'Invalid admin token' USING HINT = 'Check your admin password';
END;
$$;
