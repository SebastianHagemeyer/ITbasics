-- ===========================================================================
-- Database lockdown, phase 1: the students table
-- ===========================================================================
--
-- The problem: until now the public key (which ships in supabase-config.js
-- on purpose) could read the whole students table, every code next to every
-- full name, in one request. Two views made the same leak a second way:
-- teacher_scoreboard and teacher_assignment_progress run with their owner's
-- rights, so they ignored row level security entirely.
--
-- The fix copies the Launch survey (supabase-launch.sql): the table keeps
-- row level security ON with NO policies, and the browser goes through the
-- security definer functions below instead. Each function hands out only
-- what its page needs:
--
--   it_signin(code)          one student: the code they typed, nothing else
--   it_leaderboard()         first name + surname INITIAL + class + scores
--   it_is_staff(key)         is this a valid staff key?
--   it_classes(key)          staff only: the class list
--   it_roster(key, class)    staff only: full names for one class
--
-- Staff rights now come from a staff KEY checked in the database, not from
-- a code listed in browser JS. Staff codes like MRH0001 still sign in as
-- before; the key is what unlocks the teacher page's names.
--
-- ---------------------------------------------------------------------------
-- HOW TO APPLY
-- ---------------------------------------------------------------------------
-- Paste this whole file into the Supabase SQL editor and Run, at the same
-- time as the matching JS goes live (the old JS reads the table directly,
-- so sign-in is down in the gap between the two). Do it outside class time.
--
-- The last result it shows is your staff key. Type it into the teacher page
-- once per device. Re-running is safe and shows the same key again.
--
-- To add a key for another teacher, run on its own:
--   insert into staff_keys (key, label)
--   values (replace(gen_random_uuid()::text, '-', ''), 'Their name')
--   returning key;
-- To revoke one:   delete from staff_keys where label = 'Their name';
--
-- Emergency undo (reopens the roster, so only to get sign-in back fast):
--   create policy students_select_anon on students for select to anon using (true);
--   grant select on students, leaderboard_view to anon;
-- ===========================================================================


-- ---------------------------------------------------------------------------
-- Staff keys
-- ---------------------------------------------------------------------------
create table if not exists staff_keys (
  key       text primary key check (length(key) >= 24),
  label     text not null default '',
  added_at  timestamptz not null default now()
);

alter table staff_keys enable row level security;
-- No policies on purpose, and no table rights for the browser roles at all.
revoke all on table staff_keys from anon, authenticated;


-- Is this a valid staff key? Callable from the browser so the teacher page
-- can check a key before saving it. Keys are long and random, so asking
-- this over and over does not get anyone closer to guessing one.
create or replace function it_is_staff(p_key text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(length(trim(p_key)) >= 24, false)
     and exists (select 1 from staff_keys k where k.key = trim(p_key));
$$;


-- ---------------------------------------------------------------------------
-- Sign in: the one student whose code was typed, or no rows at all.
-- ---------------------------------------------------------------------------
create or replace function it_signin(p_code text)
returns table (
  code        text,
  first_name  text,
  last_name   text,
  class       text,
  year_level  int
)
language sql
security definer
set search_path = public
stable
as $$
  select s.code, s.first_name, s.last_name, s.class, s.year_level
  from students s
  where s.code = upper(trim(p_code));
$$;


-- ---------------------------------------------------------------------------
-- Leaderboard: everyone, but only a surname initial, never the full surname.
-- Reads leaderboard_view, so the XP rules still live in one place (that
-- view, kept in step with xp.js).
--
-- Codes are still included for now: the avatars and the Today board key on
-- them, and quiz_attempts still exposes codes until phase 2 locks it. Phase 2
-- swaps them for an opaque id.
-- ---------------------------------------------------------------------------
create or replace function it_leaderboard()
returns table (
  code          text,
  first_name    text,
  last_initial  text,
  class         text,
  year_level    int,
  programming   int,
  html          int,
  python        int,
  mixed         int,
  freeplay      int,
  livecoding    int,
  xp            int
)
language sql
security definer
set search_path = public
stable
as $$
  select v.code, v.first_name, upper(left(v.last_name, 1)), v.class, v.year_level,
         v.programming::int, v.html::int, v.python::int, v.mixed::int,
         v.freeplay::int, v.livecoding::int, v.xp::int
  from leaderboard_view v;
$$;


-- ---------------------------------------------------------------------------
-- Staff only: the list of classes, and full names for one class.
-- ---------------------------------------------------------------------------
create or replace function it_classes(p_key text)
returns table (class text)
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
    select distinct s.class from students s order by s.class;
end;
$$;

create or replace function it_roster(p_key text, p_class text)
returns table (
  code        text,
  first_name  text,
  last_name   text,
  class       text
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
    select s.code, s.first_name, s.last_name, s.class
    from students s
    where s.class = p_class
    order by s.last_name, s.first_name;
end;
$$;


-- ---------------------------------------------------------------------------
-- Who may call what. Supabase grants execute on new public functions to
-- anon by default, so start from nothing and open each entry point.
-- ---------------------------------------------------------------------------
revoke all on function it_is_staff(text)       from public;
revoke all on function it_signin(text)         from public;
revoke all on function it_leaderboard()        from public;
revoke all on function it_classes(text)        from public;
revoke all on function it_roster(text, text)   from public;

grant execute on function it_is_staff(text)     to anon, authenticated;
grant execute on function it_signin(text)       to anon, authenticated;
grant execute on function it_leaderboard()      to anon, authenticated;
grant execute on function it_classes(text)      to anon, authenticated;
grant execute on function it_roster(text, text) to anon, authenticated;



-- ---------------------------------------------------------------------------
-- Close the table. The open read policy is what leaked the roster; with row
-- level security on and no policy, direct reads return nothing. Foreign keys
-- from quiz_attempts and friends still work, because Postgres checks those
-- as the table owner, not as the caller.
-- ---------------------------------------------------------------------------
drop policy if exists students_select_anon on students;
revoke all on table students from anon, authenticated;

-- The views. leaderboard_view now goes through it_leaderboard(), and the two
-- teacher views are not used by the site (the Supabase dashboard runs as the
-- owner and still sees them). The teacher views ran with owner rights and so
-- ignored row level security: switch them to the caller's rights as well.
alter view teacher_scoreboard          set (security_invoker = on);
alter view teacher_assignment_progress set (security_invoker = on);
revoke all on table leaderboard_view            from anon, authenticated;
revoke all on table teacher_scoreboard          from anon, authenticated;
revoke all on table teacher_assignment_progress from anon, authenticated;

-- Published games used to stamp the author's full name into meta._author,
-- which anyone can read until phase 2 locks the games table. New publishes
-- stamp "First L."; this shortens the ones already there.
update games g
set meta = jsonb_set(g.meta, '{_author}',
             to_jsonb(s.first_name || ' ' || upper(left(s.last_name, 1)) || '.'))
from students s
where s.code = g.student_code and g.meta ? '_author';

notify pgrst, 'reload schema';


-- ---------------------------------------------------------------------------
-- Your staff key: made once, then the same one is shown on every re-run.
-- ---------------------------------------------------------------------------
insert into staff_keys (key, label)
select replace(gen_random_uuid()::text, '-', ''), 'Mr H'
where not exists (select 1 from staff_keys where label = 'Mr H');

select key as your_staff_key from staff_keys where label = 'Mr H';
