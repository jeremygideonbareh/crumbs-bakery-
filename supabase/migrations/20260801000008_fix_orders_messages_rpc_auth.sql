-- Fix broken auth pattern in orders and messages RPCs.
-- The old pattern used IF EXISTS (SELECT ... crypt(admin_token, value)) — but
-- "value" was the stored hash, not the plaintext, so the crypt() call could
-- never match. Functions silently returned empty results or did nothing.
--
-- New pattern: DECLARE stored_hash, crypt() compare, RAISE EXCEPTION on failure.
BEGIN;

-- ── Orders ──

CREATE OR REPLACE FUNCTION admin_read_orders(admin_token TEXT)
RETURNS SETOF orders
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NULL OR extensions.crypt(admin_token, stored_hash) <> stored_hash THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  RETURN QUERY SELECT * FROM orders ORDER BY created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION admin_count_orders(admin_token TEXT)
RETURNS INTEGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NULL OR extensions.crypt(admin_token, stored_hash) <> stored_hash THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  RETURN (SELECT count(*) FROM orders);
END;
$$;

CREATE OR REPLACE FUNCTION admin_update_order_status(admin_token TEXT, order_id BIGINT, new_status TEXT)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NULL OR extensions.crypt(admin_token, stored_hash) <> stored_hash THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  UPDATE orders SET status = new_status WHERE id = order_id;
END;
$$;

CREATE OR REPLACE FUNCTION admin_recent_orders(admin_token TEXT, max_count INTEGER DEFAULT 5)
RETURNS SETOF orders
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NULL OR extensions.crypt(admin_token, stored_hash) <> stored_hash THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  RETURN QUERY SELECT * FROM orders ORDER BY created_at DESC LIMIT max_count;
END;
$$;

-- ── Contact Messages ──

CREATE OR REPLACE FUNCTION admin_read_messages(admin_token TEXT)
RETURNS SETOF contact_messages
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NULL OR extensions.crypt(admin_token, stored_hash) <> stored_hash THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  RETURN QUERY SELECT * FROM contact_messages ORDER BY created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION admin_unread_message_count(admin_token TEXT)
RETURNS INTEGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NULL OR extensions.crypt(admin_token, stored_hash) <> stored_hash THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  RETURN (SELECT count(*) FROM contact_messages WHERE read = false);
END;
$$;

CREATE OR REPLACE FUNCTION admin_toggle_message_read(admin_token TEXT, msg_id BIGINT)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NULL OR extensions.crypt(admin_token, stored_hash) <> stored_hash THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  UPDATE contact_messages SET read = NOT read WHERE id = msg_id;
END;
$$;

CREATE OR REPLACE FUNCTION admin_delete_message(admin_token TEXT, msg_id BIGINT)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NULL OR extensions.crypt(admin_token, stored_hash) <> stored_hash THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  DELETE FROM contact_messages WHERE id = msg_id;
END;
$$;

COMMIT;
