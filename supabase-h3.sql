-- ===========================================================================
-- H3, the Hallam Homework Hub  (code.qmarkapp.com/h3/)
-- ===========================================================================
--
-- Year 7 maths self-marking homework. Deliberately SEPARATE from the IT site:
-- its own roster and its own marks. Students type the same school code they
-- use everywhere (e.g. ABC0012), but H3 checks its own roster, so H3 kids
-- never appear on the IT leaderboard and IT kids are not in H3 unless added.
--
-- Security model: the same lock as /launch and the IT students table.
--   * Both tables have row level security ON and NO policies, so the public
--     key cannot read or write them directly at all.
--   * Everything goes through the security definer functions below.
--   * A student can only load and save the one code they type.
--   * The class overview, the roster and green note tracking need the staff
--     key, the same key as the IT teacher page (it_is_staff, from
--     supabase-lockdown.sql, which must already have been run).
--   * Codes are guessable, so a determined student could answer as someone
--     else. Fine for self-check homework.
--
-- Run this whole file once in the Supabase SQL editor. Safe to re-run.
-- Students are added from the H3 teacher page (paste the class list from
-- Excel), so no names go in this file. One throwaway test account, H3TEST,
-- is created so the page can be tried before any class is added.
-- ===========================================================================

create table if not exists h3_roster (
  code          text primary key,
  first_name    text not null default '',
  last_name     text not null default '',
  class         text not null default '',
  notes_issued  int  not null default 0 check (notes_issued >= 0),
  added_at      timestamptz not null default now()
);

-- One row per student: every answer, in the page's own shape,
-- { setId: { questionId: { v, ok, n, t } } }  (value, correct, attempts, time).
create table if not exists h3_results (
  code        text primary key references h3_roster (code) on delete cascade,
  sets        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table h3_roster  enable row level security;
alter table h3_results enable row level security;
-- No policies on purpose, and no table rights for the browser roles.
revoke all on table h3_roster  from anon, authenticated;
revoke all on table h3_results from anon, authenticated;

insert into h3_roster (code, first_name, last_name, class)
values ('H3TEST', 'Test', 'Student', 'TEST')
on conflict (code) do nothing;


-- Internal: the "t" (time) of one saved answer, or 0 if it is missing or junk.
create or replace function h3_t(p jsonb)
returns numeric
language sql
immutable
set search_path = public
as $$
  select case when (p ->> 't') ~ '^[0-9]{1,15}(\.[0-9]+)?$'
              then (p ->> 't')::numeric else 0 end;
$$;

-- Internal: merge two result objects, keeping the newer answer for each
-- question, so a phone and a laptop cannot wipe each other's work.
create or replace function h3_merge(p_old jsonb, p_new jsonb)
returns jsonb
language sql
immutable
set search_path = public
as $$
  with incoming as (
    select s.key as sid, q.key as qid, q.value as v
    from jsonb_each(coalesce(p_new, '{}'::jsonb)) s,
         jsonb_each(case when jsonb_typeof(s.value) = 'object' then s.value else '{}'::jsonb end) q
    where jsonb_typeof(q.value) = 'object'
  ),
  existing as (
    select s.key as sid, q.key as qid, q.value as v
    from jsonb_each(coalesce(p_old, '{}'::jsonb)) s,
         jsonb_each(case when jsonb_typeof(s.value) = 'object' then s.value else '{}'::jsonb end) q
  ),
  merged as (
    select coalesce(i.sid, e.sid) as sid,
           coalesce(i.qid, e.qid) as qid,
           case when e.v is null then i.v
                when i.v is null then e.v
                when h3_t(i.v) > h3_t(e.v) then i.v
                else e.v end as v
    from incoming i
    full join existing e on e.sid = i.sid and e.qid = i.qid
  )
  select coalesce(jsonb_object_agg(sid, qs), '{}'::jsonb)
  from (select sid, jsonb_object_agg(qid, v) as qs from merged group by sid) x;
$$;


-- Sign in: the one student whose code was typed, with their saved work.
create or replace function h3_signin(p_code text)
returns table (
  code        text,
  first_name  text,
  last_name   text,
  class       text,
  sets        jsonb
)
language sql
security definer
set search_path = public
stable
as $$
  select r.code, r.first_name, r.last_name, r.class, coalesce(s.sets, '{}'::jsonb)
  from h3_roster r
  left join h3_results s on s.code = r.code
  where r.code = upper(trim(p_code));
$$;


-- Save: merge what the browser sends into what is stored, return the result.
create or replace function h3_save(p_code text, p_sets jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code   text := upper(trim(p_code));
  v_old    jsonb;
  v_merged jsonb;
begin
  if not exists (select 1 from h3_roster r where r.code = v_code) then
    raise exception 'That code is not on the H3 list.';
  end if;
  -- Size cap: about 60 characters per answered question. With all ten Year 7
  -- chapters (5649 questions) a whole year of work is roughly 350 000, so the
  -- cap leaves room to spare.
  if p_sets is null or jsonb_typeof(p_sets) <> 'object'
     or length(p_sets::text) > 1500000 then
    raise exception 'That work could not be saved.';
  end if;

  select s.sets into v_old from h3_results s where s.code = v_code for update;
  v_merged := h3_merge(v_old, p_sets);

  insert into h3_results as hr (code, sets, updated_at)
  values (v_code, v_merged, now())
  on conflict (code) do update
    set sets = excluded.sets, updated_at = excluded.updated_at;

  return v_merged;
end;
$$;


-- Staff: everyone on the roster with their work and green notes issued.
create or replace function h3_overview(p_key text)
returns table (
  code          text,
  first_name    text,
  last_name     text,
  class         text,
  notes_issued  int,
  sets          jsonb,
  updated_at    timestamptz
)
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  if not it_is_staff(p_key) then
    raise exception 'Not a staff key.';
  end if;
  return query
    select r.code, r.first_name, r.last_name, r.class, r.notes_issued,
           coalesce(s.sets, '{}'::jsonb), s.updated_at
    from h3_roster r
    left join h3_results s on s.code = r.code
    order by r.class, r.last_name, r.first_name;
end;
$$;


-- Staff: add or update students from a pasted class list.
-- p_rows is a JSON array of {code, first_name, last_name, class}.
-- Returns how many rows were added or updated. Never resets notes_issued.
create or replace function h3_add_students(p_key text, p_rows jsonb)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row   jsonb;
  v_code  text;
  v_count integer := 0;
begin
  if not it_is_staff(p_key) then
    raise exception 'Not a staff key.';
  end if;
  if p_rows is null or jsonb_typeof(p_rows) <> 'array'
     or jsonb_array_length(p_rows) > 600 then
    raise exception 'Send between 1 and 600 students at a time.';
  end if;

  for v_row in select * from jsonb_array_elements(p_rows) loop
    v_code := upper(trim(coalesce(v_row ->> 'code', '')));
    continue when v_code !~ '^[A-Z0-9]{3,20}$';

    insert into h3_roster as hr (code, first_name, last_name, class)
    values (
      v_code,
      left(trim(coalesce(v_row ->> 'first_name', '')), 60),
      left(trim(coalesce(v_row ->> 'last_name', '')), 60),
      left(upper(trim(coalesce(v_row ->> 'class', ''))), 20)
    )
    on conflict (code) do update
      set first_name = excluded.first_name,
          last_name  = excluded.last_name,
          class      = excluded.class;

    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;


-- Staff: take one student off H3 (their work goes with them).
create or replace function h3_remove_student(p_key text, p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not it_is_staff(p_key) then
    raise exception 'Not a staff key.';
  end if;
  delete from h3_roster r where r.code = upper(trim(p_code));
  return found;
end;
$$;


-- Staff: record how many green notes have been handed out (in Compass).
create or replace function h3_set_issued(p_key text, p_code text, p_issued int)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_n int := greatest(0, least(coalesce(p_issued, 0), 1000));
begin
  if not it_is_staff(p_key) then
    raise exception 'Not a staff key.';
  end if;
  update h3_roster r set notes_issued = v_n where r.code = upper(trim(p_code));
  if not found then
    raise exception 'No H3 student with that code.';
  end if;
  return v_n;
end;
$$;


-- Who may call what. Start from nothing, open only the entry points.
revoke all on function h3_t(jsonb)                        from public, anon, authenticated;
revoke all on function h3_merge(jsonb, jsonb)             from public, anon, authenticated;
revoke all on function h3_signin(text)                    from public;
revoke all on function h3_save(text, jsonb)               from public;
revoke all on function h3_overview(text)                  from public;
revoke all on function h3_add_students(text, jsonb)       from public;
revoke all on function h3_remove_student(text, text)      from public;
revoke all on function h3_set_issued(text, text, int)     from public;

grant execute on function h3_signin(text)                 to anon, authenticated;
grant execute on function h3_save(text, jsonb)            to anon, authenticated;
grant execute on function h3_overview(text)               to anon, authenticated;
grant execute on function h3_add_students(text, jsonb)    to anon, authenticated;
grant execute on function h3_remove_student(text, text)   to anon, authenticated;
grant execute on function h3_set_issued(text, text, int)  to anon, authenticated;

notify pgrst, 'reload schema';
