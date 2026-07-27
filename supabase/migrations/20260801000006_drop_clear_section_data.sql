-- Drop the dangerous all-data-deletion RPC.
-- It was intended as a post-seed cleanup utility only.
BEGIN;

DROP FUNCTION IF EXISTS admin_clear_all_section_data(TEXT);

COMMIT;
