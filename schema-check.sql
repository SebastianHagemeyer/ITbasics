-- What the live database actually looks like.
--
-- supabase-schema.sql says what the database SHOULD be. Nothing has ever
-- checked whether it is, and it has been wrong at least once: the site spent
-- twelve days writing to an assignment_submissions table that had never been
-- created, and the only symptom was a confusing message shown to students.
--
-- Run this in the Supabase SQL Editor. It reads catalogs only and writes
-- nothing. It returns a single JSON value describing every table, column,
-- constraint, index, policy, view and function in the public schema, plus
-- approximate row counts.
--
-- To compare that against what this repo expects, load supabase-schema.sql
-- into any empty Postgres and run this same file against it. The two outputs
-- should match; anything that differs is drift.
--
--   initdb -D /tmp/pg -A trust && pg_ctl -D /tmp/pg -o "-k /tmp/pg" start
--   psql -h /tmp/pg -d postgres \
--     -c 'create role anon nologin' \
--     -c 'create role authenticated nologin' \
--     -c 'create role service_role nologin'
--   psql -h /tmp/pg -d postgres -f supabase-schema.sql
--   psql -h /tmp/pg -d postgres -tA -f schema-check.sql > expected.json
--
-- Row counts come from pg_stat_user_tables and are approximate: they are good
-- enough to tell "empty" from "in use", which is the question worth asking of
-- a table nobody is sure about.

select jsonb_pretty(jsonb_build_object(
  'tables', (
    select coalesce(jsonb_object_agg(t.tbl, t.cols), '{}'::jsonb) from (
      select c.relname as tbl,
             jsonb_agg(
               a.attname || ' ' || format_type(a.atttypid, a.atttypmod)
               || case when a.attnotnull then ' NOT NULL' else '' end
               || coalesce(' DEFAULT ' || pg_get_expr(d.adbin, d.adrelid), '')
               order by a.attnum) as cols
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace and n.nspname = 'public'
      join pg_attribute a on a.attrelid = c.oid and a.attnum > 0 and not a.attisdropped
      left join pg_attrdef d on d.adrelid = c.oid and d.adnum = a.attnum
      where c.relkind = 'r'
      group by c.relname) t),

  'constraints', (
    select coalesce(jsonb_object_agg(x.tbl, x.defs), '{}'::jsonb) from (
      select con.conrelid::regclass::text as tbl,
             jsonb_agg(con.conname || ': ' || pg_get_constraintdef(con.oid) order by con.conname) as defs
      from pg_constraint con
      join pg_namespace n on n.oid = con.connamespace and n.nspname = 'public'
      group by con.conrelid) x),

  'indexes', (
    select coalesce(jsonb_agg(indexdef order by indexname), '[]'::jsonb)
    from pg_indexes where schemaname = 'public'),

  -- RLS off on a table the anon key can reach is the one that matters: every
  -- policy in the file assumes it is on.
  'rls_enabled', (
    select coalesce(jsonb_object_agg(c.relname, c.relrowsecurity), '{}'::jsonb)
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace and n.nspname = 'public'
    where c.relkind = 'r'),

  'policies', (
    select coalesce(jsonb_object_agg(p.tbl, p.list), '{}'::jsonb) from (
      select tablename as tbl,
             jsonb_agg(policyname || ' [' || cmd || '] to ' ||
                       array_to_string(roles, ',') order by policyname) as list
      from pg_policies where schemaname = 'public'
      group by tablename) p),

  'views', (
    select coalesce(jsonb_agg(c.relname order by c.relname), '[]'::jsonb)
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace and n.nspname = 'public'
    where c.relkind in ('v', 'm')),

  'functions', (
    select coalesce(jsonb_agg(
             p.proname || '(' || pg_get_function_arguments(p.oid) || ')'
             order by p.proname), '[]'::jsonb)
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace and n.nspname = 'public'),

  'row_counts_approx', (
    select coalesce(jsonb_object_agg(relname, n_live_tup), '{}'::jsonb)
    from pg_stat_user_tables where schemaname = 'public')
)) as schema_dump;
