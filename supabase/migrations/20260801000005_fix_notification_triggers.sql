-- Wrap notification HTTP calls in EXCEPTION blocks so trigger failures
-- don't kill the INSERT transaction.
BEGIN;

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
    BEGIN
      PERFORM extensions.net.http_post(
        url := function_url,
        headers := jsonb_build_object('Content-Type', 'application/json'),
        body := jsonb_build_object('type', 'INSERT', 'table', 'orders', 'record', row_to_json(NEW)::jsonb)
      );
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Order notification failed: %', SQLERRM;
    END;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION notify_contact_insert()
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
    BEGIN
      PERFORM extensions.net.http_post(
        url := function_url,
        headers := jsonb_build_object('Content-Type', 'application/json'),
        body := jsonb_build_object('type', 'INSERT', 'table', 'contact_messages', 'record', row_to_json(NEW)::jsonb)
      );
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Contact notification failed: %', SQLERRM;
    END;
  END IF;
  RETURN NEW;
END;
$$;

COMMIT;
