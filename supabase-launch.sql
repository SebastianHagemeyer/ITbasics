-- ===========================================================================
-- Year 9 Launch survey  (code.qmarkapp.com/launch/)
-- ===========================================================================
--
-- A short sport survey for the Year 9 Launch cohort, plus an overview for the
-- staff running it. Deliberately SEPARATE from the IT class: its own roster,
-- its own responses, its own staff codes. Nothing here reads or writes the
-- `students` table, so Launch kids never appear on the IT leaderboard, class
-- filters or teacher export, and IT kids cannot sign in to /launch/ unless
-- they are also added to the Launch roster.
--
-- Security model (tighter than the rest of the site, on purpose):
--   * Both tables have row level security ON and NO policies, so the public
--     anon key cannot select, insert or update them directly at all.
--   * Everything goes through the security definer functions below.
--   * A student can only look up and answer for the one code they type.
--   * Listing the roster, reading answers and adding students all require a
--     staff code. Make staff codes long and random (not a guessable school
--     ID), because a staff code is the only thing guarding the overview.
--   * Student codes are still guessable, so a determined student could
--     answer on someone else's behalf. Fine for a sport-interest survey.
--
-- Run this whole file once in the Supabase SQL editor. It is safe to re-run.
--
-- Staff codes are NOT stored in this file (the repo is public). Add one by
-- running, separately in the SQL editor:
--
--   insert into launch_roster (code, first_name, last_name, role)
--   values ('<LONG-RANDOM-CODE>', 'First', 'Last', 'staff')
--   on conflict (code) do update set role = 'staff';
--
-- Students are added from the class list on the overview page itself (paste
-- from Excel), so names do not need to go in this file either.
-- ===========================================================================

create table if not exists launch_roster (
  code        text primary key,
  first_name  text not null default '',
  last_name   text not null default '',
  homegroup   text not null default '',
  role        text not null default 'student' check (role in ('student', 'staff')),
  added_at    timestamptz not null default now()
);

create table if not exists launch_responses (
  code        text primary key references launch_roster (code) on delete cascade,
  answers     jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table launch_roster    enable row level security;
alter table launch_responses enable row level security;
-- No policies on purpose: see the header.


-- Is this a staff code? Internal helper, not callable from the browser.
create or replace function launch_is_staff(p_code text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from launch_roster
    where code = upper(trim(p_code)) and role = 'staff'
  );
$$;


-- Sign in: returns the one matching row (and the student's saved answers),
-- or nothing if the code is not on the Launch roster.
create or replace function launch_signin(p_code text)
returns table (
  code        text,
  first_name  text,
  last_name   text,
  homegroup   text,
  role        text,
  answers     jsonb,
  updated_at  timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select r.code, r.first_name, r.last_name, r.homegroup, r.role,
         s.answers, s.updated_at
  from launch_roster r
  left join launch_responses s on s.code = r.code
  where r.code = upper(trim(p_code));
$$;


-- Save (or update) a student's answers. Students can change their answers;
-- the latest save wins.
create or replace function launch_submit(p_code text, p_answers jsonb)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text := upper(trim(p_code));
  v_now  timestamptz := now();
begin
  if not exists (
    select 1 from launch_roster r where r.code = v_code and r.role = 'student'
  ) then
    raise exception 'That code is not on the Launch list.';
  end if;
  if p_answers is null or jsonb_typeof(p_answers) <> 'object'
     or length(p_answers::text) > 2000 then
    raise exception 'Those answers could not be saved.';
  end if;

  insert into launch_responses as lr (code, answers, updated_at)
  values (v_code, p_answers, v_now)
  on conflict (code) do update
    set answers = excluded.answers, updated_at = excluded.updated_at;

  return v_now;
end;
$$;


-- Staff overview: every student on the roster, with answers if they have
-- answered (answers is null for anyone who has not).
create or replace function launch_overview(p_staff text)
returns table (
  code        text,
  first_name  text,
  last_name   text,
  homegroup   text,
  answers     jsonb,
  updated_at  timestamptz
)
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  if not launch_is_staff(p_staff) then
    raise exception 'Not a staff code.';
  end if;
  return query
    select r.code, r.first_name, r.last_name, r.homegroup, s.answers, s.updated_at
    from launch_roster r
    left join launch_responses s on s.code = r.code
    where r.role = 'student'
    order by r.homegroup, r.last_name, r.first_name;
end;
$$;


-- Staff: add or update students from a pasted class list.
-- p_rows is a JSON array of {code, first_name, last_name, homegroup}.
-- Never touches a staff row. Returns how many rows were added or updated.
create or replace function launch_add_students(p_staff text, p_rows jsonb)
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
  if not launch_is_staff(p_staff) then
    raise exception 'Not a staff code.';
  end if;
  if p_rows is null or jsonb_typeof(p_rows) <> 'array'
     or jsonb_array_length(p_rows) > 600 then
    raise exception 'Send between 1 and 600 students at a time.';
  end if;

  for v_row in select * from jsonb_array_elements(p_rows) loop
    v_code := upper(trim(coalesce(v_row ->> 'code', '')));
    continue when v_code !~ '^[A-Z0-9]{3,20}$';

    insert into launch_roster as lr (code, first_name, last_name, homegroup, role)
    values (
      v_code,
      left(trim(coalesce(v_row ->> 'first_name', '')), 60),
      left(trim(coalesce(v_row ->> 'last_name', '')), 60),
      left(upper(trim(coalesce(v_row ->> 'homegroup', ''))), 20),
      'student'
    )
    on conflict (code) do update
      set first_name = excluded.first_name,
          last_name  = excluded.last_name,
          homegroup  = excluded.homegroup
      where lr.role = 'student';

    if found then v_count := v_count + 1; end if;
  end loop;

  return v_count;
end;
$$;


-- Staff: take one student off the Launch roster (their answers go with them).
create or replace function launch_remove_student(p_staff text, p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not launch_is_staff(p_staff) then
    raise exception 'Not a staff code.';
  end if;
  delete from launch_roster r
  where r.code = upper(trim(p_code)) and r.role = 'student';
  return found;
end;
$$;


-- Who may call what. Supabase grants execute on new public functions to
-- anon by default, so start from nothing and open only the five entry points.
revoke all on function launch_is_staff(text)                from public, anon, authenticated;
revoke all on function launch_signin(text)                  from public;
revoke all on function launch_submit(text, jsonb)           from public;
revoke all on function launch_overview(text)                from public;
revoke all on function launch_add_students(text, jsonb)     from public;
revoke all on function launch_remove_student(text, text)    from public;

grant execute on function launch_signin(text)               to anon, authenticated;
grant execute on function launch_submit(text, jsonb)        to anon, authenticated;
grant execute on function launch_overview(text)             to anon, authenticated;
grant execute on function launch_add_students(text, jsonb)  to anon, authenticated;
grant execute on function launch_remove_student(text, text) to anon, authenticated;
