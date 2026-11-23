-- ===========================================================================
-- New school year: class history + archived classes
-- ===========================================================================
--
-- Students keep ONE account for their whole time at Hallam. Their code is the
-- school's ImportIdentifier (e.g. AHM0101) and every attempt, XP point,
-- homework tick and game hangs off that code, never off the class. So moving
-- a student into next year's class loses nothing.
--
-- This file adds two small tables:
--
--   class_history   one row per student per old class: "ALI0111 was in 7A in
--                   2026". Written by the roster sync script just before it
--                   moves someone, so the old class is never forgotten.
--   class_archive   classes that have finished. The teacher page files them
--                   under "Archived" and the leaderboard stops showing them.
--                   An archived class gets its year on the end (7A-2026) so
--                   a new 7A next year is a separate class. Nothing about
--                   the students or their scores changes.
--
-- and two functions the browser can call:
--
--   it_archived_classes()            the archived class names (no student data)
--   it_set_archived(key, class, on)  the teacher page's Archive class button;
--                                    needs a valid staff key (it_is_staff).
--                                    Archiving renames 7A -> 7A-2026.
--
-- Moving and adding students is done by the private roster sync script
-- (C:\Teaching\ITbasics\roster_sync.py), not by this file, so no names live
-- in this public repo.
--
-- HOW TO APPLY: paste the whole file into the Supabase SQL editor and Run.
-- Safe to re-run: IF NOT EXISTS tables, CREATE OR REPLACE function.
-- Needs supabase-lockdown.sql to have been run already (it locks students).
-- ===========================================================================

create table if not exists class_history (
  student_code  text not null references students(code) on delete cascade,
  year          int  not null,
  class         text not null,
  year_level    int  not null,
  recorded_at   timestamptz not null default now(),
  primary key (student_code, year, class)
);

create table if not exists class_archive (
  class        text primary key,
  year         int  not null,
  archived_at  timestamptz not null default now()
);

-- Same model as students: row level security ON with no policies, so the
-- public key cannot read either table. The service key (sync script) can.
alter table class_history enable row level security;
alter table class_archive enable row level security;
revoke all on table class_history from anon, authenticated;
revoke all on table class_archive from anon, authenticated;

-- Archived class names only. Class names are already public (the leaderboard
-- shows them), so this hands out nothing new.
create or replace function it_archived_classes()
returns table (class text)
language sql
security definer
set search_path = public
stable
as $$
  select a.class from class_archive a order by a.class;
$$;

revoke all on function it_archived_classes() from public;
grant execute on function it_archived_classes() to anon, authenticated;

-- Archive or unarchive one class from the teacher page (the Archive class
-- button). Checks the staff key in the database, same as it_roster, so a
-- student who opens the browser console cannot call it usefully.
--
-- Archiving also renames the class to <name>-<year> (7A -> 7A-2026), on the
-- students still in it, their homework and their class_history notes, so
-- next year's 7A starts clean and never mixes with the old one. Logins,
-- scores and work are untouched (they hang off the student code). Unarchiving
-- only takes it off the archive list; the -2026 name stays.
-- Returns the class's name afterwards.
drop function if exists it_set_archived(text, text, boolean);
create function it_set_archived(p_key text, p_class text, p_archived boolean)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old  text := trim(p_class);
  -- Archiving in Jan/Feb is tidying up last year's classes, so they get
  -- last year's number; from March on it is this year's.
  v_year int  := extract(year from now() - interval '2 months')::int;
  v_new  text;
begin
  if not it_is_staff(p_key) then
    raise exception 'not staff';
  end if;
  if not p_archived then
    delete from class_archive where class = v_old;
    return v_old;
  end if;

  -- Already carries a year (7A-2026): archive it under that name.
  if v_old ~ '-[0-9]{4}$' then
    v_new  := v_old;
    v_year := right(v_old, 4)::int;
  else
    v_new := v_old || '-' || v_year;
  end if;

  if v_new <> v_old then
    if exists (select 1 from students where class = v_new) then
      raise exception 'class % already exists', v_new;
    end if;
    update students      set class = v_new where class = v_old;
    update homework      set class = v_new where class = v_old;
    update class_history set class = v_new where class = v_old and year = v_year;
    delete from class_archive where class = v_old;
  end if;
  insert into class_archive (class, year) values (v_new, v_year)
  on conflict (class) do nothing;
  return v_new;
end;
$$;

revoke all on function it_set_archived(text, text, boolean) from public;
grant execute on function it_set_archived(text, text, boolean) to anon, authenticated;

notify pgrst, 'reload schema';
