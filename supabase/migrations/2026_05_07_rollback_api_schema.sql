-- ============================================================================
-- ROLLBACK for 2026_05_07_expose_api_schema.sql
--
-- Drops api views (the moved functions stay where they are — moving them back
-- would just reverse the symptom; if you really want everything in public,
-- run the symmetric ALTER FUNCTION SET SCHEMA public manually).
--
-- The fastest "make site work again" if migration goes wrong:
--   ALTER ROLE authenticator SET pgrst.db_schemas TO 'public, api, graphql_public';
--   NOTIFY pgrst, 'reload config';
-- ============================================================================

BEGIN;

DO $do$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'api' AND c.relkind = 'v'
  LOOP
    EXECUTE format('DROP VIEW IF EXISTS api.%I CASCADE', r.relname);
  END LOOP;
END
$do$;

NOTIFY pgrst, 'reload schema';

COMMIT;
