-- Create DB Triggers for Edge Function Notifications
--
-- This connects database INSERT events to the Supabase Edge Functions
-- via pg_net. Prior to this migration, the edge functions were dead code
-- — they never fired because no webhook or trigger invoked them.
--
-- Requires: pg_net extension (provides extensions.net.http_post)

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- ── Config table for edge function URLs ──────────────────────────────────
CREATE TABLE IF NOT EXISTS edge_function_config (
  key TEXT PRIMARY KEY,
  url TEXT NOT NULL
);

INSERT INTO edge_function_config (key, url) VALUES
  ('order_notification_url', 'https://vkicdybgaoofabgapmbw.functions.supabase.co/order-notification'),
  ('contact_notification_url', 'https://vkicdybgaoofabgapmbw.functions.supabase.co/contact-notification')
ON CONFLICT (key) DO NOTHING;

-- ── Trigger function: notify on order INSERT ────────────────────────────
CREATE OR REPLACE FUNCTION notify_order_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  function_url text;
BEGIN
  SELECT url INTO function_url FROM edge_function_config WHERE key = 'order_notification_url';
  IF function_url IS NOT NULL THEN
    PERFORM
      extensions.net.http_post(
        url := function_url,
        headers := jsonb_build_object('Content-Type', 'application/json'),
        body := jsonb_build_object('type', 'INSERT', 'table', 'orders', 'record', row_to_json(NEW)::jsonb)
      );
  END IF;
  RETURN NEW;
END;
$$;

-- ── Trigger function: notify on contact_message INSERT ──────────────────
CREATE OR REPLACE FUNCTION notify_contact_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  function_url text;
BEGIN
  SELECT url INTO function_url FROM edge_function_config WHERE key = 'contact_notification_url';
  IF function_url IS NOT NULL THEN
    PERFORM
      extensions.net.http_post(
        url := function_url,
        headers := jsonb_build_object('Content-Type', 'application/json'),
        body := jsonb_build_object('type', 'INSERT', 'table', 'contact_messages', 'record', row_to_json(NEW)::jsonb)
      );
  END IF;
  RETURN NEW;
END;
$$;

-- ── Attach triggers ─────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS notify_order_insert_trigger ON orders;
CREATE TRIGGER notify_order_insert_trigger
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_insert();

DROP TRIGGER IF EXISTS notify_contact_insert_trigger ON contact_messages;
CREATE TRIGGER notify_contact_insert_trigger
  AFTER INSERT ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_contact_insert();
