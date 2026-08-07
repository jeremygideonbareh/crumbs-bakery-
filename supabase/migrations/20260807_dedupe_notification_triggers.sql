-- FIX duplicate notification triggers (3 emails per order).
-- Symptom: a single orders INSERT fired 3 HTTP notifications (confirmed via
-- net._http_response: 3 rows with identical content/order_id). Root cause:
-- duplicate AFTER INSERT triggers accumulated on public.orders and
-- public.contact_messages from repeated/manual migration runs:
--   orders:            notify_order_insert_trigger, order_notification_trigger, trg_order_notification
--   contact_messages:  notify_contact_insert_trigger, contact_notification_trigger
-- Dropping by a single hard-coded name misses the differently-named copies,
-- so we drop by FUNCTION: every trigger bound to notify_order_insert() /
-- notify_contact_insert() is removed, then exactly one canonical trigger is
-- recreated per table.

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT c.relname AS tbl, t.tgname
    FROM pg_trigger t
    JOIN pg_class c     ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    JOIN pg_proc p      ON p.oid = t.tgfoid
    WHERE NOT t.tgisinternal
      AND n.nspname = 'public'
      AND p.proname IN ('notify_order_insert', 'notify_contact_insert')
  LOOP
    EXECUTE format('DROP TRIGGER %I ON public.%I', r.tgname, r.tbl);
    RAISE NOTICE 'Dropped duplicate trigger % on %', r.tgname, r.tbl;
  END LOOP;
END;
$$;

-- Recreate exactly ONE canonical trigger per table.
DROP TRIGGER IF EXISTS notify_order_insert_trigger ON public.orders;
CREATE TRIGGER notify_order_insert_trigger
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_insert();

DROP TRIGGER IF EXISTS notify_contact_insert_trigger ON public.contact_messages;
CREATE TRIGGER notify_contact_insert_trigger
  AFTER INSERT ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_contact_insert();