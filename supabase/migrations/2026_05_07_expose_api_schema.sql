-- ============================================================================
-- Migrate site to use `api` schema as the only PostgREST-exposed schema.
--
-- WHY: best-practice per https://supabase.com/docs/guides/api/using-custom-schemas
--      `public` is no longer exposed; `api` becomes the single REST surface.
--
-- WHAT IT DOES:
--   1. Ensures `api` schema exists with USAGE grants.
--   2. Replicates every public table/view as a security_invoker view in `api`
--      (RLS on the underlying public table is still enforced).
--   3. Moves every public function into `api` (ALTER FUNCTION SET SCHEMA).
--   4. Reloads PostgREST schema cache.
--
-- INTERNAL CALLER WARNING:
--   Anything inside Postgres that references `public.<func>(...)` by fully-
--   qualified name will break after step 3. Triggers and other functions
--   that call helpers must be reviewed. Run inside a transaction so the
--   whole migration can be rolled back if a downstream object errors at QA.
--
-- HOW TO APPLY:
--   Supabase Dashboard → SQL Editor → paste this whole file → Run.
--   Watch the NOTICE log for any skip messages. If clean, COMMIT (or just let
--   the implicit commit happen). If broken, ROLLBACK.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. api schema + usage
-- ----------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS api;
GRANT USAGE ON SCHEMA api TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA api
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA api
  GRANT EXECUTE ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA api
  GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 2. Replicate public tables/views as api views (security_invoker)
-- ----------------------------------------------------------------------------
DO $do$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT c.relname, c.relkind
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind IN ('r','v','m','p')          -- table, view, matview, partitioned table
      AND c.relname NOT LIKE 'pg\_%'
      AND c.relname NOT LIKE 'sql\_%'
  LOOP
    BEGIN
      EXECUTE format(
        'CREATE OR REPLACE VIEW api.%I WITH (security_invoker=true) AS SELECT * FROM public.%I',
        r.relname, r.relname
      );
      EXECUTE format(
        'GRANT SELECT, INSERT, UPDATE, DELETE ON api.%I TO anon, authenticated, service_role',
        r.relname
      );
      RAISE NOTICE 'view api.% (over public.%, kind=%)', r.relname, r.relname, r.relkind;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'SKIP table/view %: %', r.relname, SQLERRM;
    END;
  END LOOP;
END
$do$;

-- ----------------------------------------------------------------------------
-- 3. Move every function/procedure from public to api
--    (ALTER FUNCTION ... SET SCHEMA api)
-- ----------------------------------------------------------------------------
DO $do$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT
      p.proname,
      pg_get_function_identity_arguments(p.oid) AS iargs,
      p.prokind
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prokind IN ('f','p')                  -- function or procedure
      AND NOT EXISTS (                            -- skip extension-owned funcs
        SELECT 1 FROM pg_depend d
        WHERE d.objid = p.oid
          AND d.deptype = 'e'
      )
  LOOP
    BEGIN
      IF r.prokind = 'p' THEN
        EXECUTE format('ALTER PROCEDURE public.%I(%s) SET SCHEMA api', r.proname, r.iargs);
        EXECUTE format('GRANT EXECUTE ON PROCEDURE api.%I(%s) TO anon, authenticated, service_role',
                       r.proname, r.iargs);
      ELSE
        EXECUTE format('ALTER FUNCTION public.%I(%s) SET SCHEMA api', r.proname, r.iargs);
        EXECUTE format('GRANT EXECUTE ON FUNCTION api.%I(%s) TO anon, authenticated, service_role',
                       r.proname, r.iargs);
      END IF;
      RAISE NOTICE 'moved %(%) → api', r.proname, r.iargs;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'SKIP move %(%): %', r.proname, r.iargs, SQLERRM;
    END;
  END LOOP;
END
$do$;

-- ----------------------------------------------------------------------------
-- 4. Reload PostgREST schema cache
-- ----------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

COMMIT;

-- After commit, verify:
--   SELECT count(*) FROM api.concepts_catalog;          -- should match public count
--   SELECT api.admin_dashboard_stats();                 -- if you have it
