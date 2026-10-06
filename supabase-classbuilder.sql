-- Home Group Builder (/hg-admin/): schema, staff allowlist, demo seed.
--
-- This is a separate little app that shares the Supabase project with Hallam
-- IT Basics but none of its tables. Everything lives in its own "classbuilder"
-- schema, and unlike the main site it uses real logins.
--
-- ============================================================
-- WHY THIS IS LOCKED DOWN DIFFERENTLY FROM THE MAIN SITE
-- ============================================================
-- The main site lets the anon role read everything, which is fine for quiz
-- scores. This app holds student names, IDs, genders and staff opinions about
-- who works well with whom, so:
--   * the anon role (every student's browser) gets NO access to the schema;
--   * only signed-in Supabase Auth users can reach it, and
--   * every table's policy also requires the user's email to be listed in
--     classbuilder.members (five slots, enforced by a check constraint).
--
-- ============================================================
-- HOW TO APPLY THIS (one-off setup, then re-run freely)
-- ============================================================
-- 1. Paste this whole file into the Supabase SQL Editor and Run. Re-running
--    is safe: IF NOT EXISTS, CREATE OR REPLACE, upserts, and policies are
--    dropped and recreated. The demo round is only seeded when it is missing.
-- 2. Expose the schema to the API: Project Settings > Data API >
--    Exposed schemas, add "classbuilder", Save.
-- 3. Turn off public sign-ups: Authentication > Sign In / Providers >
--    untick "Allow new users to sign up". (The main site does not use
--    Supabase Auth, so nothing else is affected.)
-- 4. Create the five logins: Authentication > Users > Add user > Create new
--    user, tick "Auto Confirm User", one per address below:
--        staff1@hg-admin.example.com  ...  staff5@hg-admin.example.com
--    Pick the passwords there. They never go in this file, because this repo
--    is public. On the login page staff just type "staff1" and the password.
-- 5. If the app says the schema is missing, run:  notify pgrst, 'reload schema';
--
-- To give a slot to a real person later, change their display_name below
-- and re-run, or point the slot at a different email.

-- ============================================================
-- Schema and grants
-- ============================================================
create schema if not exists classbuilder;

revoke all on schema classbuilder from public, anon;
grant usage on schema classbuilder to authenticated;

-- ============================================================
-- Staff allowlist
-- ============================================================
create table if not exists classbuilder.members (
  slot         int  primary key check (slot between 1 and 5),
  email        text not null unique,
  display_name text not null
);

insert into classbuilder.members (slot, email, display_name) values
  (1, 'staff1@hg-admin.example.com', 'Staff 1'),
  (2, 'staff2@hg-admin.example.com', 'Staff 2'),
  (3, 'staff3@hg-admin.example.com', 'Staff 3'),
  (4, 'staff4@hg-admin.example.com', 'Staff 4'),
  (5, 'staff5@hg-admin.example.com', 'Staff 5')
on conflict (slot) do update
  set email = excluded.email, display_name = excluded.display_name;

-- Is the caller one of the five? Security definer so the policies can read
-- members without granting anything extra, and an empty search_path so a
-- caller cannot shadow the table with one of their own.
create or replace function classbuilder.is_member()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from classbuilder.members m
    where lower(m.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function classbuilder.is_member() from public, anon;
grant execute on function classbuilder.is_member() to authenticated;

-- ============================================================
-- Tables
-- ============================================================
-- A round is one job, e.g. "2027 Year 8 home groups". group_names sets both
-- how many groups there are and what they are called.
create table if not exists classbuilder.rounds (
  id          bigint generated always as identity primary key,
  name        text   not null,
  year_level  int,
  group_names text[] not null default '{}',
  created_by  text   default (auth.jwt() ->> 'email'),
  created_at  timestamptz not null default now()
);

create table if not exists classbuilder.students (
  id            bigint generated always as identity primary key,
  round_id      bigint not null references classbuilder.rounds (id) on delete cascade,
  student_id    text   not null,
  first_name    text   not null default '',
  last_name     text   not null default '',
  gender        text   not null default '',
  year_level    int,
  current_group text   not null default '',
  tags          text[] not null default '{}',
  unique (round_id, student_id)
);

-- One row per pair of students: either "together" (works well with) or
-- "apart" (keep apart). The unique index makes (a, b) and (b, a) one pair.
create table if not exists classbuilder.preferences (
  id         bigint generated always as identity primary key,
  round_id   bigint not null references classbuilder.rounds (id) on delete cascade,
  a          bigint not null references classbuilder.students (id) on delete cascade,
  b          bigint not null references classbuilder.students (id) on delete cascade,
  kind       text   not null check (kind in ('together', 'apart')),
  note       text,
  created_by text   default (auth.jwt() ->> 'email'),
  created_at timestamptz not null default now(),
  check (a <> b)
);

create unique index if not exists preferences_pair_uniq
  on classbuilder.preferences (round_id, least(a, b), greatest(a, b));

-- A saved set of groups. assignment maps students.id -> group index, locked
-- maps students.id -> true for anyone pinned in place.
create table if not exists classbuilder.solutions (
  id         bigint generated always as identity primary key,
  round_id   bigint not null references classbuilder.rounds (id) on delete cascade,
  name       text   not null,
  assignment jsonb  not null default '{}',
  locked     jsonb  not null default '{}',
  score      numeric,
  created_by text   default (auth.jwt() ->> 'email'),
  created_at timestamptz not null default now()
);

grant select, insert, update, delete
  on classbuilder.rounds, classbuilder.students,
     classbuilder.preferences, classbuilder.solutions
  to authenticated;
grant select on classbuilder.members to authenticated;
grant usage, select on all sequences in schema classbuilder to authenticated;

-- ============================================================
-- Row level security: members only, on every table
-- ============================================================
alter table classbuilder.members     enable row level security;
alter table classbuilder.rounds      enable row level security;
alter table classbuilder.students    enable row level security;
alter table classbuilder.preferences enable row level security;
alter table classbuilder.solutions   enable row level security;

-- The allowlist is read-only from the app. Change it here, in SQL.
drop policy if exists members_read on classbuilder.members;
create policy members_read on classbuilder.members
  for select to authenticated using (classbuilder.is_member());

drop policy if exists rounds_members on classbuilder.rounds;
create policy rounds_members on classbuilder.rounds
  for all to authenticated
  using (classbuilder.is_member()) with check (classbuilder.is_member());

drop policy if exists students_members on classbuilder.students;
create policy students_members on classbuilder.students
  for all to authenticated
  using (classbuilder.is_member()) with check (classbuilder.is_member());

drop policy if exists preferences_members on classbuilder.preferences;
create policy preferences_members on classbuilder.preferences
  for all to authenticated
  using (classbuilder.is_member()) with check (classbuilder.is_member());

drop policy if exists solutions_members on classbuilder.solutions;
create policy solutions_members on classbuilder.solutions
  for all to authenticated
  using (classbuilder.is_member()) with check (classbuilder.is_member());

-- ============================================================
-- Demo round: 147 made-up students (none are real people) in seven
-- current Year 7 home groups, plus 98 staff preferences. Delete it from the
-- app once you are done with it. Re-running this file brings it back only
-- if no round with the same name exists.
-- ============================================================
do $$
declare r bigint;
begin
  if not exists (select 1 from classbuilder.rounds where name = 'Demo: 2027 Year 8 home groups') then
    insert into classbuilder.rounds (name, year_level, group_names, created_by)
      values ('Demo: 2027 Year 8 home groups', 8, '{8A,8B,8C,8D,8E,8F,8G}', 'staff1@hg-admin.example.com')
      returning id into r;

    insert into classbuilder.students
      (round_id, student_id, first_name, last_name, gender, year_level, current_group, tags)
    values
      (r, '240101', 'Ali', 'Jensen', 'M', 7, '7A', '{}'),
      (r, '240107', 'Arjun', 'Walsh', 'M', 7, '7B', '{}'),
      (r, '240120', 'Max', 'Lam', 'M', 7, '7C', '{EAL}'),
      (r, '240121', 'Jayden', 'Morgan', 'M', 7, '7D', '{}'),
      (r, '240133', 'Oscar', 'Lam', 'M', 7, '7E', '{}'),
      (r, '240138', 'Yusuf', 'Bennett', 'M', 7, '7F', '{}'),
      (r, '240147', 'Omar', 'Vance', 'M', 7, '7G', '{Leader,EAL}'),
      (r, '240153', 'Samuel', 'Quinn', 'M', 7, '7A', '{Leader}'),
      (r, '240156', 'Zara', 'O''Brien', 'F', 7, '7B', '{EAL}'),
      (r, '240168', 'Zac', 'Barker', 'M', 7, '7C', '{EAL}'),
      (r, '240173', 'Mateo', 'Zhou', 'M', 7, '7D', '{}'),
      (r, '240181', 'Fatima', 'Hughes', 'F', 7, '7E', '{}'),
      (r, '240189', 'Leila', 'Jones', 'F', 7, '7F', '{}'),
      (r, '240193', 'Alex', 'Taylor', 'X', 7, '7G', '{}'),
      (r, '240200', 'Noah', 'Ross', 'M', 7, '7A', '{}'),
      (r, '240206', 'Sienna', 'Jensen', 'F', 7, '7B', '{}'),
      (r, '240214', 'Archie', 'Cruz', 'M', 7, '7C', '{}'),
      (r, '240220', 'Mason', 'Brooks', 'M', 7, '7D', '{Support}'),
      (r, '240227', 'Ananya', 'Reid', 'F', 7, '7E', '{EAL}'),
      (r, '240239', 'Matilda', 'Tan', 'F', 7, '7F', '{}'),
      (r, '240240', 'Poppy', 'Ward', 'F', 7, '7G', '{}'),
      (r, '240251', 'Charlie', 'Gill', 'M', 7, '7A', '{}'),
      (r, '240258', 'Poppy', 'Barker', 'F', 7, '7B', '{Support,Leader}'),
      (r, '240266', 'Evie', 'Nguyen', 'F', 7, '7C', '{}'),
      (r, '240268', 'Ava', 'Wood', 'F', 7, '7D', '{}'),
      (r, '240275', 'Ella', 'Ross', 'F', 7, '7E', '{}'),
      (r, '240284', 'Jasmine', 'Fisher', 'F', 7, '7F', '{}'),
      (r, '240294', 'Omar', 'Barker', 'M', 7, '7G', '{}'),
      (r, '240297', 'Oscar', 'Khan', 'M', 7, '7A', '{Leader}'),
      (r, '240308', 'Noah', 'Ward', 'M', 7, '7B', '{}'),
      (r, '240311', 'Theo', 'Reid', 'M', 7, '7C', '{}'),
      (r, '240318', 'Thomas', 'Owens', 'M', 7, '7D', '{}'),
      (r, '240324', 'Sami', 'Lee', 'M', 7, '7E', '{}'),
      (r, '240337', 'Ava', 'Taylor', 'F', 7, '7F', '{Support}'),
      (r, '240343', 'Lucas', 'Nguyen', 'M', 7, '7G', '{}'),
      (r, '240349', 'Nathan', 'Jones', 'M', 7, '7A', '{}'),
      (r, '240352', 'Imogen', 'Nguyen', 'F', 7, '7B', '{Support}'),
      (r, '240361', 'Amelia', 'Bennett', 'F', 7, '7C', '{}'),
      (r, '240368', 'Hazel', 'Vance', 'F', 7, '7D', '{}'),
      (r, '240376', 'Poppy', 'Tran', 'F', 7, '7E', '{EAL}'),
      (r, '240384', 'Aria', 'Ibrahim', 'F', 7, '7F', '{}'),
      (r, '240388', 'Caleb', 'Nguyen', 'M', 7, '7G', '{Leader}'),
      (r, '240399', 'Ella', 'Fisher', 'F', 7, '7A', '{}'),
      (r, '240407', 'Felix', 'Ho', 'M', 7, '7B', '{}'),
      (r, '240408', 'Ruth', 'Cole', 'F', 7, '7C', '{Support,Leader}'),
      (r, '240419', 'Esther', 'Hughes', 'F', 7, '7D', '{}'),
      (r, '240427', 'Zac', 'Shaw', 'M', 7, '7E', '{}'),
      (r, '240431', 'Arjun', 'Abbott', 'M', 7, '7F', '{}'),
      (r, '240441', 'Nathan', 'Nguyen', 'M', 7, '7G', '{Support}'),
      (r, '240446', 'Zac', 'Cole', 'M', 7, '7A', '{}'),
      (r, '240452', 'Ethan', 'Jones', 'M', 7, '7B', '{}'),
      (r, '240458', 'Ananya', 'Irwin', 'F', 7, '7C', '{Support,Leader}'),
      (r, '240464', 'Lucas', 'Wood', 'M', 7, '7D', '{}'),
      (r, '240473', 'Noah', 'Park', 'M', 7, '7E', '{}'),
      (r, '240481', 'Thomas', 'Usman', 'M', 7, '7F', '{Leader}'),
      (r, '240488', 'Wei', 'Ibrahim', 'M', 7, '7G', '{}'),
      (r, '240493', 'Talia', 'Kelly', 'F', 7, '7A', '{}'),
      (r, '240500', 'Leila', 'Ho', 'F', 7, '7B', '{}'),
      (r, '240508', 'Archie', 'Ho', 'M', 7, '7C', '{}'),
      (r, '240518', 'Ryan', 'Price', 'M', 7, '7D', '{}'),
      (r, '240520', 'Ali', 'Anderson', 'M', 7, '7E', '{}'),
      (r, '240533', 'Thomas', 'Evans', 'M', 7, '7F', '{}'),
      (r, '240537', 'Ava', 'Jensen', 'F', 7, '7G', '{}'),
      (r, '240546', 'Chloe', 'Brooks', 'F', 7, '7A', '{}'),
      (r, '240554', 'Rohan', 'Lam', 'M', 7, '7B', '{}'),
      (r, '240559', 'Talia', 'Singh', 'F', 7, '7C', '{}'),
      (r, '240564', 'Isla', 'Gill', 'F', 7, '7D', '{}'),
      (r, '240569', 'Mia', 'Reid', 'F', 7, '7E', '{EAL}'),
      (r, '240576', 'Leila', 'Gill', 'F', 7, '7F', '{}'),
      (r, '240588', 'Theo', 'Zhou', 'M', 7, '7G', '{}'),
      (r, '240592', 'Ava', 'Walsh', 'F', 7, '7A', '{}'),
      (r, '240603', 'Mateo', 'Lee', 'M', 7, '7B', '{}'),
      (r, '240608', 'Finn', 'Zhou', 'M', 7, '7C', '{}'),
      (r, '240616', 'Esther', 'Nguyen', 'F', 7, '7D', '{Leader}'),
      (r, '240622', 'Yusuf', 'Singh', 'M', 7, '7E', '{EAL}'),
      (r, '240628', 'Hunter', 'Anderson', 'M', 7, '7F', '{}'),
      (r, '240635', 'Mason', 'Barker', 'M', 7, '7G', '{}'),
      (r, '240640', 'Hazel', 'Mehta', 'F', 7, '7A', '{Leader}'),
      (r, '240647', 'Oliver', 'Price', 'M', 7, '7B', '{}'),
      (r, '240659', 'Jayden', 'Price', 'M', 7, '7C', '{}'),
      (r, '240663', 'Riley', 'Zhou', 'M', 7, '7D', '{}'),
      (r, '240670', 'Finn', 'Silva', 'M', 7, '7E', '{}'),
      (r, '240674', 'Sofia', 'Rossi', 'F', 7, '7F', '{}'),
      (r, '240684', 'Alex', 'Kelly', 'X', 7, '7G', '{}'),
      (r, '240694', 'Oliver', 'Grant', 'M', 7, '7A', '{}'),
      (r, '240695', 'Ethan', 'Patel', 'M', 7, '7B', '{}'),
      (r, '240704', 'Zoe', 'Gill', 'F', 7, '7C', '{}'),
      (r, '240713', 'Hazel', 'Singh', 'F', 7, '7D', '{}'),
      (r, '240720', 'Mei', 'Bennett', 'F', 7, '7E', '{EAL}'),
      (r, '240729', 'Kenji', 'Cruz', 'M', 7, '7F', '{Support}'),
      (r, '240731', 'Thomas', 'Park', 'M', 7, '7G', '{}'),
      (r, '240743', 'Oliver', 'Anderson', 'M', 7, '7A', '{}'),
      (r, '240746', 'Aisha', 'Bennett', 'F', 7, '7B', '{}'),
      (r, '240754', 'Mateo', 'Kaur', 'M', 7, '7C', '{EAL}'),
      (r, '240764', 'Amira', 'Kelly', 'F', 7, '7D', '{}'),
      (r, '240768', 'Oliver', 'Evans', 'M', 7, '7E', '{}'),
      (r, '240776', 'Willow', 'Evans', 'F', 7, '7F', '{}'),
      (r, '240781', 'Nathan', 'Mehta', 'M', 7, '7G', '{Leader,EAL}'),
      (r, '240790', 'Kai', 'Ellis', 'M', 7, '7A', '{}'),
      (r, '240796', 'Fatima', 'Jensen', 'F', 7, '7B', '{}'),
      (r, '240802', 'Charlie', 'Fisher', 'M', 7, '7C', '{}'),
      (r, '240812', 'Nina', 'Fisher', 'F', 7, '7D', '{}'),
      (r, '240820', 'Omar', 'Owens', 'M', 7, '7E', '{}'),
      (r, '240821', 'Ananya', 'Kelly', 'F', 7, '7F', '{}'),
      (r, '240831', 'Nathan', 'Cole', 'M', 7, '7G', '{}'),
      (r, '240841', 'Yusuf', 'Taylor', 'M', 7, '7A', '{}'),
      (r, '240846', 'Ananya', 'Rossi', 'F', 7, '7B', '{}'),
      (r, '240852', 'Isla', 'Lee', 'F', 7, '7C', '{}'),
      (r, '240862', 'Ethan', 'Zhou', 'M', 7, '7D', '{}'),
      (r, '240868', 'Ivy', 'Kelly', 'F', 7, '7E', '{}'),
      (r, '240875', 'Imogen', 'Quinn', 'F', 7, '7F', '{Support}'),
      (r, '240879', 'Matilda', 'Lowe', 'F', 7, '7G', '{}'),
      (r, '240890', 'Layla', 'Flynn', 'F', 7, '7A', '{}'),
      (r, '240891', 'Ali', 'Ross', 'M', 7, '7B', '{}'),
      (r, '240900', 'Chloe', 'Vance', 'F', 7, '7C', '{EAL}'),
      (r, '240908', 'Ethan', 'Nash', 'M', 7, '7D', '{EAL}'),
      (r, '240913', 'Ethan', 'Nguyen', 'M', 7, '7E', '{}'),
      (r, '240921', 'Jack', 'Lam', 'M', 7, '7F', '{}'),
      (r, '240927', 'James', 'Tran', 'M', 7, '7G', '{}'),
      (r, '240936', 'Sienna', 'Taylor', 'F', 7, '7A', '{}'),
      (r, '240941', 'Dev', 'Grant', 'M', 7, '7B', '{}'),
      (r, '240947', 'Isla', 'Ward', 'F', 7, '7C', '{}'),
      (r, '240958', 'Max', 'Shaw', 'M', 7, '7D', '{}'),
      (r, '240965', 'Ethan', 'Dawson', 'M', 7, '7E', '{}'),
      (r, '240971', 'Lucia', 'Vance', 'F', 7, '7F', '{}'),
      (r, '240980', 'Henry', 'Hughes', 'M', 7, '7G', '{}'),
      (r, '240986', 'Mia', 'Hart', 'F', 7, '7A', '{}'),
      (r, '240990', 'Zoe', 'Rossi', 'F', 7, '7B', '{Leader}'),
      (r, '241002', 'Leila', 'Brooks', 'F', 7, '7C', '{}'),
      (r, '241003', 'Samuel', 'Nguyen', 'M', 7, '7D', '{}'),
      (r, '241013', 'Hunter', 'Lowe', 'M', 7, '7E', '{Support}'),
      (r, '241019', 'Jayden', 'Jones', 'M', 7, '7F', '{}'),
      (r, '241026', 'Harper', 'Flynn', 'F', 7, '7G', '{Support,Leader}'),
      (r, '241037', 'Ananya', 'Dawson', 'F', 7, '7A', '{}'),
      (r, '241043', 'Noah', 'Singh', 'M', 7, '7B', '{}'),
      (r, '241047', 'Zara', 'Grant', 'F', 7, '7C', '{}'),
      (r, '241055', 'Elijah', 'Khan', 'M', 7, '7D', '{}'),
      (r, '241061', 'Eden', 'Zhou', 'F', 7, '7E', '{}'),
      (r, '241071', 'Hazel', 'Cole', 'F', 7, '7F', '{}'),
      (r, '241079', 'Amira', 'Lee', 'F', 7, '7G', '{}'),
      (r, '241086', 'Harrison', 'Lam', 'M', 7, '7A', '{}'),
      (r, '241087', 'Amira', 'Reid', 'F', 7, '7B', '{}'),
      (r, '241097', 'Grace', 'Barker', 'F', 7, '7C', '{}'),
      (r, '241105', 'Lucia', 'Jones', 'F', 7, '7D', '{}'),
      (r, '241112', 'Nathan', 'Young', 'M', 7, '7E', '{}'),
      (r, '241118', 'William', 'Kelly', 'M', 7, '7F', '{}'),
      (r, '241124', 'Samuel', 'Hart', 'M', 7, '7G', '{}');

    insert into classbuilder.preferences (round_id, a, b, kind, created_by)
    select r, sa.id, sb.id, v.kind, v.created_by
    from (values
      ('240419', '240564', 'together', 'staff3@hg-admin.example.com'),
      ('240533', '240674', 'together', 'staff1@hg-admin.example.com'),
      ('240720', '240318', 'together', 'staff4@hg-admin.example.com'),
      ('240891', '240990', 'together', 'staff3@hg-admin.example.com'),
      ('240520', '240670', 'together', 'staff3@hg-admin.example.com'),
      ('240318', '240419', 'together', 'staff2@hg-admin.example.com'),
      ('241013', '241061', 'together', 'staff5@hg-admin.example.com'),
      ('240173', '240268', 'together', 'staff1@hg-admin.example.com'),
      ('240427', '240520', 'together', 'staff3@hg-admin.example.com'),
      ('240121', '240268', 'together', 'staff4@hg-admin.example.com'),
      ('240518', '240616', 'together', 'staff1@hg-admin.example.com'),
      ('241105', '240408', 'together', 'staff4@hg-admin.example.com'),
      ('240812', '240908', 'together', 'staff1@hg-admin.example.com'),
      ('240220', '240318', 'together', 'staff2@hg-admin.example.com'),
      ('240965', '241013', 'together', 'staff2@hg-admin.example.com'),
      ('240481', '240628', 'together', 'staff4@hg-admin.example.com'),
      ('240508', '240659', 'together', 'staff5@hg-admin.example.com'),
      ('240399', '240493', 'together', 'staff1@hg-admin.example.com'),
      ('241079', '241124', 'together', 'staff4@hg-admin.example.com'),
      ('240266', '240311', 'together', 'staff5@hg-admin.example.com'),
      ('240258', '240352', 'together', 'staff4@hg-admin.example.com'),
      ('240153', '240862', 'together', 'staff3@hg-admin.example.com'),
      ('240776', '240921', 'together', 'staff4@hg-admin.example.com'),
      ('240927', '241026', 'together', 'staff1@hg-admin.example.com'),
      ('240927', '240980', 'together', 'staff3@hg-admin.example.com'),
      ('240488', '240900', 'together', 'staff4@hg-admin.example.com'),
      ('240500', '240554', 'together', 'staff3@hg-admin.example.com'),
      ('240324', '240376', 'together', 'staff2@hg-admin.example.com'),
      ('240349', '240156', 'together', 'staff5@hg-admin.example.com'),
      ('240616', '240764', 'together', 'staff2@hg-admin.example.com'),
      ('240862', '240908', 'together', 'staff5@hg-admin.example.com'),
      ('240240', '240488', 'together', 'staff2@hg-admin.example.com'),
      ('240227', '240275', 'together', 'staff3@hg-admin.example.com'),
      ('240181', '240227', 'together', 'staff4@hg-admin.example.com'),
      ('240564', '240713', 'together', 'staff1@hg-admin.example.com'),
      ('240446', '240546', 'together', 'staff3@hg-admin.example.com'),
      ('240616', '240713', 'together', 'staff1@hg-admin.example.com'),
      ('241105', '240173', 'together', 'staff5@hg-admin.example.com'),
      ('240684', '240781', 'together', 'staff5@hg-admin.example.com'),
      ('240251', '240297', 'together', 'staff3@hg-admin.example.com'),
      ('241003', '240831', 'together', 'staff3@hg-admin.example.com'),
      ('240764', '240812', 'together', 'staff2@hg-admin.example.com'),
      ('240168', '240266', 'together', 'staff2@hg-admin.example.com'),
      ('240384', '240431', 'together', 'staff1@hg-admin.example.com'),
      ('240592', '240640', 'together', 'staff2@hg-admin.example.com'),
      ('241124', '240147', 'together', 'staff1@hg-admin.example.com'),
      ('240452', '240554', 'together', 'staff1@hg-admin.example.com'),
      ('241002', '240120', 'together', 'staff3@hg-admin.example.com'),
      ('240820', '240407', 'together', 'staff4@hg-admin.example.com'),
      ('241118', '240921', 'together', 'staff5@hg-admin.example.com'),
      ('240308', '240352', 'together', 'staff1@hg-admin.example.com'),
      ('240419', '240518', 'together', 'staff5@hg-admin.example.com'),
      ('240647', '240796', 'together', 'staff2@hg-admin.example.com'),
      ('240879', '240927', 'together', 'staff3@hg-admin.example.com'),
      ('240168', '240368', 'together', 'staff5@hg-admin.example.com'),
      ('240958', '240107', 'together', 'staff3@hg-admin.example.com'),
      ('241047', '241097', 'together', 'staff1@hg-admin.example.com'),
      ('241097', '240214', 'together', 'staff4@hg-admin.example.com'),
      ('240622', '240831', 'together', 'staff5@hg-admin.example.com'),
      ('240971', '241019', 'together', 'staff1@hg-admin.example.com'),
      ('240349', '240399', 'together', 'staff3@hg-admin.example.com'),
      ('240258', '240308', 'together', 'staff3@hg-admin.example.com'),
      ('240941', '241079', 'together', 'staff4@hg-admin.example.com'),
      ('240820', '240731', 'together', 'staff4@hg-admin.example.com'),
      ('240713', '240812', 'together', 'staff3@hg-admin.example.com'),
      ('240704', '240754', 'together', 'staff5@hg-admin.example.com'),
      ('240729', '240875', 'together', 'staff2@hg-admin.example.com'),
      ('240746', '240846', 'together', 'staff4@hg-admin.example.com'),
      ('240206', '240308', 'together', 'staff4@hg-admin.example.com'),
      ('240890', '241037', 'together', 'staff4@hg-admin.example.com'),
      ('241055', '240156', 'apart', 'staff1@hg-admin.example.com'),
      ('240768', '240368', 'apart', 'staff2@hg-admin.example.com'),
      ('240408', '240821', 'apart', 'staff2@hg-admin.example.com'),
      ('240831', '240921', 'apart', 'staff5@hg-admin.example.com'),
      ('240720', '241047', 'apart', 'staff5@hg-admin.example.com'),
      ('240592', '240965', 'apart', 'staff3@hg-admin.example.com'),
      ('240684', '240663', 'apart', 'staff4@hg-admin.example.com'),
      ('240441', '240101', 'apart', 'staff3@hg-admin.example.com'),
      ('240275', '240802', 'apart', 'staff2@hg-admin.example.com'),
      ('240473', '240107', 'apart', 'staff4@hg-admin.example.com'),
      ('240189', '240868', 'apart', 'staff3@hg-admin.example.com'),
      ('240520', '241097', 'apart', 'staff2@hg-admin.example.com'),
      ('240275', '240812', 'apart', 'staff1@hg-admin.example.com'),
      ('240181', '240284', 'apart', 'staff4@hg-admin.example.com'),
      ('240388', '240138', 'apart', 'staff4@hg-admin.example.com'),
      ('240958', '241087', 'apart', 'staff2@hg-admin.example.com'),
      ('240337', '240318', 'apart', 'staff3@hg-admin.example.com'),
      ('240569', '240376', 'apart', 'staff3@hg-admin.example.com'),
      ('240173', '241097', 'apart', 'staff1@hg-admin.example.com'),
      ('240941', '240980', 'apart', 'staff5@hg-admin.example.com'),
      ('240768', '240731', 'apart', 'staff4@hg-admin.example.com'),
      ('240768', '240980', 'apart', 'staff5@hg-admin.example.com'),
      ('240121', '240297', 'apart', 'staff2@hg-admin.example.com'),
      ('240841', '240768', 'apart', 'staff1@hg-admin.example.com'),
      ('240812', '240674', 'apart', 'staff3@hg-admin.example.com'),
      ('241013', '240251', 'apart', 'staff5@hg-admin.example.com'),
      ('241043', '240200', 'apart', 'staff5@hg-admin.example.com'),
      ('240936', '240324', 'apart', 'staff5@hg-admin.example.com')
    ) as v(a, b, kind, created_by)
    join classbuilder.students sa on sa.round_id = r and sa.student_id = v.a
    join classbuilder.students sb on sb.round_id = r and sb.student_id = v.b;
  end if;
end $$;
