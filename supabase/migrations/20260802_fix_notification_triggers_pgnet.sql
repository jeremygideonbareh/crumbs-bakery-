-- FIX pg_net notification triggers.
-- Prior triggers called extensions.net.http_post() which does NOT exist:
-- pg_net installs its API in the `net` schema (net.http_post). The broken
-- call was swallowed by EXCEPTION WHEN OTHERS, so orders INSERTed but the
-- notification HTTP request was never queued -> no owner email.
-- Also qualify the edge_function_config lookup (search_path is '').

-- ── notify_order_insert ──────────────────────────────
CREATE OR REPLACE FUNCTION notify_order_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  function_url text;
BEGIN
  SELECT url INTO function_url FROM public.edge_function_config WHERE key = 'order_notification_url';
  IF function_url IS NOT NULL THEN
    BEGIN
      PERFORM net.http_post(
        url     := function_url,
        headers := jsonb_build_object('Content-Type', 'application/json'),
        body    := jsonb_build_object('type', 'INSERT', 'table', 'orders', 'record', row_to_json(NEW)::jsonb)
      );
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Order notification failed: %', SQLERRM;
    END;
  END IF;
  RETURN NEW;
END;
$$;

-- ── notify_contact_insert (fixes wrong key AND wrong schema) ─────────
CREATE OR REPLACE FUNCTION notify_contact_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  function_url text;
BEGIN
  SELECT url INTO function_url FROM public.edge_function_config WHERE key = 'contact_notification_url';
  IF function_url IS NOT NULL THEN
    BEGIN
      PERFORM net.http_post(
        url     := function_url,
        headers := jsonb_build_object('Content-Type', 'application/json'),
        body    := jsonb_build_object('type', 'INSERT', 'table', 'contact_messages', 'record', row_to_json(NEW)::jsonb)
      );
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Contact notification failed: %', SQLERRM;
    END;
  END IF;
  RETURN NEW;
END;
$$;