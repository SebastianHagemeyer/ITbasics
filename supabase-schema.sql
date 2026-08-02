-- Hallam IT Basics: Supabase schema + roster seed.
--
-- ============================================================
-- HOW TO APPLY THIS
-- ============================================================
-- Paste the WHOLE file into the Supabase SQL Editor and hit Run. That is
-- always the right answer, whether it is the first time or the tenth.
--
-- Re-running is safe and loses nothing. Tables use IF NOT EXISTS, the views
-- and functions use CREATE OR REPLACE, the roster uses UPSERT, and policies
-- are dropped and recreated. Verified by applying this file three times over
-- a database holding real attempts, progress, games and word cloud rows: the
-- counts and every student's XP came out identical.
--
-- If the site says a column or function is missing, you are behind. Re-run
-- the file. If it still complains, PostgREST is caching the old shape, so
-- run:  notify pgrst, 'reload schema';
--
-- ============================================================
-- WHAT CHANGED, NEWEST FIRST
-- ============================================================
-- Re-run the whole file after any of these. The dates are when the change
-- landed on main, so you can tell at a glance whether you are current.
--
-- 2026-07-30  students               Staff accounts section added, so MRH0001
--                                    survives a rebuild from this file. A staff
--                                    row is only half of it: the code must also
--                                    be in TEACHER_CODES in supabase-config.js.
-- 2026-07-30  reset_test_student()   Reset button on the teacher page. A
--                                    security definer function that wipes one
--                                    TEST-class account across all nine
--                                    student tables and refuses everyone else.
-- 2026-07-30  leaderboard_view.xp    XP column for the leaderboard's XP board.
--                                    Without it that board ranks nobody.
-- 2026-07-30  students               Hassan Sharifi (SHA0088) added to 10ITB.
-- (earlier)   games, game_votes,
--             game_scores            Game gallery: publishing, upvotes and
--                                    per-game high scores.
--
-- ============================================================

-- ============================================================
-- Tables
-- ============================================================

create table if not exists students (
  code        text primary key,
  first_name  text not null,
  last_name   text not null,
  class       text not null,
  year_level  int  not null
);

create table if not exists quiz_attempts (
  id            bigserial primary key,
  student_code  text not null references students(code) on delete cascade,
  quiz_name     text not null,
  score         int  not null,
  total         int  not null,
  answers       jsonb not null,
  attempted_at  timestamptz not null default now()
);

create index if not exists quiz_attempts_student_idx on quiz_attempts(student_code);
create index if not exists quiz_attempts_quiz_idx    on quiz_attempts(quiz_name);

create table if not exists quiz_progress (
  student_code  text not null references students(code) on delete cascade,
  quiz_name     text not null,
  answers       jsonb not null,
  updated_at    timestamptz not null default now(),
  primary key (student_code, quiz_name)
);

-- ============================================================
-- Row Level Security
-- ============================================================
-- This is a classroom self-check tool. The anon key is in the browser, so
-- anyone with a valid student code can read/write attempts for that code.
-- No emails, DOBs or other PII are stored here.

alter table students       enable row level security;
alter table quiz_attempts  enable row level security;
alter table quiz_progress  enable row level security;

drop policy if exists students_select_anon  on students;
drop policy if exists attempts_select_anon  on quiz_attempts;
drop policy if exists attempts_insert_anon  on quiz_attempts;
drop policy if exists progress_select_anon  on quiz_progress;
drop policy if exists progress_insert_anon  on quiz_progress;
drop policy if exists progress_update_anon  on quiz_progress;

create policy students_select_anon  on students       for select to anon using (true);
create policy attempts_select_anon  on quiz_attempts  for select to anon using (true);
create policy attempts_insert_anon  on quiz_attempts  for insert to anon with check (true);
create policy progress_select_anon  on quiz_progress  for select to anon using (true);
create policy progress_insert_anon  on quiz_progress  for insert to anon with check (true);
create policy progress_update_anon  on quiz_progress  for update to anon using (true) with check (true);

-- ============================================================
-- Roster seed (58 students across 7A, 7B, 9ITAA)
-- ============================================================

insert into students (code, first_name, last_name, class, year_level) values
  -- 7A
  ('ALI0111', 'Fahmida',    'Alizada',        '7A',     7),
  ('AMI0029', 'Hajir',      'Amir',           '7A',     7),
  ('CRE0009', 'Taylem',     'Crew',           '7A',     7),
  ('DIP0011', 'Sebastian',  'Di Pietro',      '7A',     7),
  ('FAR0028', 'Arya',       'Fard',           '7A',     7),
  ('FAT0012', 'Sidra',      'Fatima',         '7A',     7),
  ('FIT0007', 'Eddie',      'Fiti',           '7A',     7),
  ('FRA0020', 'Elias',      'Frazer',         '7A',     7),
  ('GAL0023', 'Levi',       'Gallagher',      '7A',     7),
  ('GAZ0001', 'Poppy-Rose', 'Gazzara',        '7A',     7),
  ('HUE0001', 'Ashton',     'Huergo',         '7A',     7),
  ('IAK0001', 'Maddox',     'Iakopo',         '7A',     7),
  ('LAB0005', 'Henry',      'Laban',          '7A',     7),
  ('MAA0005', 'Samir',      'Maas',           '7A',     7),
  ('MAD0020', 'Laila',      'Madeira',        '7A',     7),
  ('MOQ0004', 'Soraya',     'Moqaddam',       '7A',     7),
  ('PAL0031', 'Amaris',     'Palu',           '7A',     7),
  ('PET0050', 'Reily',      'Peterson',       '7A',     7),
  ('ROO0003', 'Hannah',     'Rooney',         '7A',     7),
  ('SHE0036', 'Cruz',       'Sheppard',       '7A',     7),
  ('VHO0003', 'Amrin',      'Vhora',          '7A',     7),
  ('WRI0041', 'Phillip',    'Wright',         '7A',     7),
  -- 7B
  ('ALI0107', 'Tamar',      'Ali',            '7B',     7),
  ('AWA0007', 'Sara',       'Awaszada',       '7B',     7),
  ('CON0036', 'Aa',         'Contencin',      '7B',     7),
  ('DAM0015', 'Harris',     'Damen',          '7B',     7),
  ('DRI0009', 'Francis',    'Drio',           '7B',     7),
  ('DUG0004', 'Harrison',   'Duguid',         '7B',     7),
  ('GRA0060', 'Isabella',   'Gray',           '7B',     7),
  ('HAM0052', 'Mudasser',   'Hamidi',         '7B',     7),
  ('HOW0032', 'Layla',      'Howard',         '7B',     7),
  ('IBR0021', 'Pola',       'Ibrahim',        '7B',     7),
  ('MCD0031', 'Kianah',     'McDonald',       '7B',     7),
  ('MOQ0003', 'Sohaila',    'Moqaddam',       '7B',     7),
  ('NAB0014', 'Losalini',   'Nabalarua',      '7B',     7),
  ('NOO0037', 'Arash',      'Noory',          '7B',     7),
  ('OTU0005', 'Jaylin',     'Otukolo',        '7B',     7),
  ('REN0009', 'Sophia',     'Rendon',         '7B',     7),
  ('RIT0008', 'Shannon',    'Ritchie',        '7B',     7),
  ('SAD0024', 'Ameer',      'Sadat',          '7B',     7),
  ('TEP0011', 'William',    'Tep',            '7B',     7),
  ('THA0023', 'Ava',        'Thao',           '7B',     7),
  ('TOK0008', 'Faith',      'Toki',           '7B',     7),
  -- 9ITAA
  ('ALI0090', 'Kamran',     'Ali Zada',       '9ITAA',  9),
  ('BLA0054', 'Saxon',      'Blackwell',      '9ITAA',  9),
  ('CUR0013', 'Aj',         'Currie',         '9ITAA',  9),
  ('GHA0022', 'Zainab',     'Gharwal',        '9ITAA',  9),
  ('KNI0008', 'Brayden',    'Knight',         '9ITAA',  9),
  ('MAW0006', 'Harrison',   'Mawhinney',      '9ITAA',  9),
  ('MUJ0010', 'Bibi Arzo',  'Mujaddidi',      '9ITAA',  9),
  ('RAW0005', 'Summer',     'Rawlings',       '9ITAA',  9),
  ('ROB0073', 'Jaden',      'Robson',         '9ITAA',  9),
  ('SCO0031', 'Summer',     'Scott-Johns',    '9ITAA',  9),
  ('SHI0022', 'Rabiullah',  'Shirzad',        '9ITAA',  9),
  ('TAO0003', 'Cyrus',      'Taofia',         '9ITAA',  9),
  ('UPO0004', 'Cameron',    'Upokoina',       '9ITAA',  9),
  ('URR0001', 'TJ',         'Urrutia-Buchanan','9ITAA', 9),
  ('WIL0114', 'Jack',       'Williams',       '9ITAA',  9)
on conflict (code) do update set
  first_name = excluded.first_name,
  last_name  = excluded.last_name,
  class      = excluded.class,
  year_level = excluded.year_level;

-- ============================================================
-- Additional IT classes added June 2026 (65 students)
-- 10ITB: 23, 7ITC: 21, 7ITD: 21. Same UPSERT pattern, safe to re-run.
-- ============================================================

insert into students (code, first_name, last_name, class, year_level) values
  -- 10ITB
  ('AMI0032', 'Bilal Ahmad',   'Amin',         '10ITB', 10),
  ('ASH0028', 'Muhammad',      'Asher',        '10ITB', 10),
  ('BER0026', 'Noah',          'Berton',       '10ITB', 10),
  ('CAN0025', 'Rishi',         'Canistan',     '10ITB', 10),
  ('CHI0019', 'Stan',          'Chikazhe',     '10ITB', 10),
  ('FAR0025', 'Pouriya',       'Fard',         '10ITB', 10),
  ('FAR0027', 'Mirwais',       'Farid',        '10ITB', 10),
  ('GAR0048', 'Troy',          'Gartside',     '10ITB', 10),
  ('HAV0003', 'Makai',         'Havea',        '10ITB', 10),
  ('KAK0010', 'Rahmatulla',    'Kakar',        '10ITB', 10),
  ('LAU0021', 'Sariah',        'Lauano',       '10ITB', 10),
  ('LEA0028', 'Archer',        'Lean',         '10ITB', 10),
  ('MOH0085', 'Noyan',         'Mohammadi',    '10ITB', 10),
  ('NAZ0033', 'Naseer',        'Nazari',       '10ITB', 10),
  ('NAZ0037', 'Mohammad Asif', 'Nazari',       '10ITB', 10),
  ('NOO0032', 'Irfan Ali',     'Noori',        '10ITB', 10),
  ('PAT0030', 'Johnny',        'Patton-Gear',  '10ITB', 10),
  ('QAS0009', 'Abbas',         'Qasemi',       '10ITB', 10),
  ('RAH0048', 'Azlan',         'Rahman',       '10ITB', 10),
  ('SAD0015', 'Tareq',         'Sadat',        '10ITB', 10),
  ('SAL0051', 'Bibi Saira',    'Salozai',      '10ITB', 10),
  ('SHA0088', 'Hassan',        'Sharifi',      '10ITB', 10),
  ('SHE0035', 'Shehla Bibi',   'Shehla Bibi',  '10ITB', 10),
  ('ZAH0027', 'Nazia',         'Zahedi',       '10ITB', 10)
on conflict (code) do update set
  first_name = excluded.first_name,
  last_name  = excluded.last_name,
  class      = excluded.class,
  year_level = excluded.year_level;

insert into students (code, first_name, last_name, class, year_level) values
  -- 7ITC
  ('ADA0039', 'Cameron',   'Adamson',           '7ITC', 7),
  ('BAL0025', 'Aaron',     'Baliton',           '7ITC', 7),
  ('BAT0044', 'Henry',     'Bath',              '7ITC', 7),
  ('BUR0045', 'Eliza',     'Burney',            '7ITC', 7),
  ('CRI0013', 'Jasel',     'Crichton',          '7ITC', 7),
  ('ERU0002', 'Hepara',    'Eruera',            '7ITC', 7),
  ('ESP0010', 'Jack',      'Espie',             '7ITC', 7),
  ('FIA0004', 'Mariana',   'Fiame Teo',         '7ITC', 7),
  ('FUI0008', 'Jaden',     'Fuiono',            '7ITC', 7),
  ('HOS0019', 'Mahya',     'Hosseini',          '7ITC', 7),
  ('JAM0041', 'Ali Reza',  'Jamili',            '7ITC', 7),
  ('LAU0022', 'Jarom',     'Lauano',            '7ITC', 7),
  ('MAC0066', 'Phoebe',    'Mackenzie',         '7ITC', 7),
  ('MAH0031', 'Khadijah',  'Mahbob',            '7ITC', 7),
  ('MAH0032', 'Asher',     'Mahmood',           '7ITC', 7),
  ('MAN0056', 'Asenath',   'Mansori',           '7ITC', 7),
  ('OZB0005', 'Haron',     'Ozbek',             '7ITC', 7),
  ('TUM0009', 'Navaheina', 'Tumu',              '7ITC', 7),
  ('VIN0013', 'Harry',     'Viney',             '7ITC', 7),
  ('WIL0128', 'Aarona',    'Williams-McGregor', '7ITC', 7),
  ('WOR0009', 'Charlotte', 'Worroll',           '7ITC', 7)
on conflict (code) do update set
  first_name = excluded.first_name,
  last_name  = excluded.last_name,
  class      = excluded.class,
  year_level = excluded.year_level;

insert into students (code, first_name, last_name, class, year_level) values
  -- 7ITD
  ('AHM0112', 'Irfan',   'Ahmadi',       '7ITD', 7),
  ('AZA0009', 'Noah',    'Azagra',       '7ITD', 7),
  ('CLI0023', 'Tate',    'Clissold',     '7ITD', 7),
  ('ELC0001', 'Tatiana', 'El-Chikhani',  '7ITD', 7),
  ('GHA0024', 'Adnan',   'Ghasimy',      '7ITD', 7),
  ('GLE0008', 'Cooper',  'Glenton',      '7ITD', 7),
  ('HET0002', 'Ella',    'Hettig',       '7ITD', 7),
  ('HUN0042', 'Vincent', 'Hunter',       '7ITD', 7),
  ('JOH0080', 'Koda',    'Johnstone',    '7ITD', 7),
  ('LIN0014', 'Shayon',  'Lingeswaran',  '7ITD', 7),
  ('LOR0009', 'Souljah', 'Lord',         '7ITD', 7),
  ('MAS0055', 'Tarrkyn', 'Masofa',       '7ITD', 7),
  ('MIH0008', 'Gabriel', 'Mihelcic',     '7ITD', 7),
  ('MOR0082', 'Marzya',  'Moradi',       '7ITD', 7),
  ('MOT0011', 'Sione',   'Motu''apuaka', '7ITD', 7),
  ('PAI0015', 'Estelle', 'Paine',        '7ITD', 7),
  ('PAP0017', 'Anna',    'Papatua',      '7ITD', 7),
  ('PRI0022', 'River',   'Price',        '7ITD', 7),
  ('SER0007', 'Lara',    'Serdzeff',     '7ITD', 7),
  ('SHE0040', 'Yusuf',   'Shereen',      '7ITD', 7),
  ('TUI0043', 'Alofa',   'Tuimavave',    '7ITD', 7)
on conflict (code) do update set
  first_name = excluded.first_name,
  last_name  = excluded.last_name,
  class      = excluded.class,
  year_level = excluded.year_level;

-- ============================================================
-- Later roster additions (July 2026)
-- ============================================================
insert into students (code, first_name, last_name, class, year_level) values
  ('SIL0015', 'Logan', 'Silver', '10ITB', 10)
on conflict (code) do update set
  first_name = excluded.first_name,
  last_name  = excluded.last_name,
  class      = excluded.class,
  year_level = excluded.year_level;

-- ============================================================
-- Test "gremlin" account
-- ============================================================
-- A throwaway account for trying the site as a student without using a
-- real kid's code. Its class is TEST, which leaderboard.js hides from the
-- rankings, so testing never pollutes the standings. Sign in with: GREMLIN
insert into students (code, first_name, last_name, class, year_level) values
  ('GREMLIN', 'Gremlin', 'McTest', 'TEST', 0)
on conflict (code) do update set
  first_name = excluded.first_name,
  last_name  = excluded.last_name,
  class      = excluded.class,
  year_level = excluded.year_level;

-- ============================================================
-- Staff accounts
-- ============================================================
-- Sign-in looks every code up in this table, so a staff member needs a row
-- here like anyone else. Class TEACHER keeps them out of the leaderboard
-- rankings and off the class filters.
--
-- The row alone does NOT grant staff powers. The code must ALSO be listed in
-- window.TEACHER_CODES in supabase-config.js, which is what skips the
-- passphrase gate on /teacher/, leaves lesson pages ungated, and shows the
-- take-a-game-down buttons in the gallery.

insert into students (code, first_name, last_name, class, year_level) values
  ('MRH0001', 'Mr', 'H', 'TEACHER', 0)
on conflict (code) do update set
  first_name = excluded.first_name,
  last_name  = excluded.last_name,
  class      = excluded.class,
  year_level = excluded.year_level;

-- ============================================================
-- Teacher view: latest & best score per student per quiz
-- ============================================================
create or replace view teacher_scoreboard as
select
  s.code,
  s.first_name,
  s.last_name,
  s.class,
  qa.quiz_name,
  max(qa.score)                                                                       as best_score,
  qa.total,
  (array_agg(qa.score        order by qa.attempted_at desc))[1]                       as last_score,
  (array_agg(qa.attempted_at order by qa.attempted_at desc))[1]                       as last_attempt,
  count(*)                                                                            as attempts
from students s
join quiz_attempts qa on qa.student_code = s.code
group by s.code, s.first_name, s.last_name, s.class, qa.quiz_name, qa.total
order by s.class, s.last_name, s.first_name, qa.quiz_name;

-- ============================================================
-- Leaderboard view: one row per student, fully aggregated.
-- Selecting raw quiz_attempts client-side hits PostgREST's 1000-row
-- cap once Freeplay activity piles up; this view stays at ~58 rows.
-- ============================================================
create or replace view leaderboard_view with (security_invoker = on) as
with best_named as (
  select student_code, quiz_name, max(score) as best_score
  from quiz_attempts
  where quiz_name in ('programming', 'html', 'python', 'mixed')
  group by student_code, quiz_name
),
freeplay_sum as (
  select student_code, sum(score)::int as total
  from quiz_attempts
  where quiz_name = 'freeplay'
  group by student_code
),
-- Live Coding: each passed challenge is one attempt row with
-- answers->>'challenge' set; count how many DISTINCT challenges are done.
livecoding_done as (
  select student_code, count(distinct (answers->>'challenge'))::int as total
  from quiz_attempts
  where quiz_name = 'livecoding'
  group by student_code
),
-- ---- XP -------------------------------------------------------------
-- These three must stay in step with xp.js, which applies the same rules
-- one student at a time for the progress page. Everything counts ONCE,
-- keyed on the thing that was done, so replaying cannot inflate a score.
--
-- Coding tasks, 50 XP each. Counted across every quiz_name, not just
-- 'livecoding', because the module tasks record under their own names.
xp_tasks as (
  select student_code, count(distinct (answers->>'challenge'))::int as n
  from quiz_attempts
  where answers ? 'challenge'
  group by student_code
),
-- Module quizzes, 25 XP each, best attempt, full marks only.
xp_quiz_best as (
  select student_code, quiz_name, max(score) as best, max(total) as tot
  from quiz_attempts
  where quiz_name in ('programming', 'html', 'python', 'variables', 'strings',
                      'errors', 'decisions', 'loops', 'binary', 'codes',
                      'systems', 'networks', 'os')
  group by student_code, quiz_name
),
xp_quizzes as (
  select student_code, count(*)::int as n
  from xp_quiz_best
  where tot > 0 and best = tot
  group by student_code
),
-- Freeplay, first correct answer per scenario only. Spot the Error
-- scenarios are worth 2, everything else 1.
xp_fp_seen as (
  select distinct student_code,
         answers->>'id'    as scenario_id,
         answers->>'topic' as topic
  from quiz_attempts
  where quiz_name = 'freeplay' and score > 0 and answers ? 'id'
),
xp_freeplay as (
  select student_code,
         sum(case when topic = 'errors' then 2 else 1 end)::int as xp
  from xp_fp_seen
  group by student_code
)
select
  s.code,
  s.first_name,
  s.last_name,
  s.class,
  s.year_level,
  max(case when bn.quiz_name = 'programming' then bn.best_score end) as programming,
  max(case when bn.quiz_name = 'html'        then bn.best_score end) as html,
  max(case when bn.quiz_name = 'python'      then bn.best_score end) as python,
  max(case when bn.quiz_name = 'mixed'       then bn.best_score end) as mixed,
  coalesce(f.total, 0)                                               as freeplay,
  coalesce(lc.total, 0)                                              as livecoding,
  (coalesce(xt.n, 0) * 50
   + coalesce(xq.n, 0) * 25
   + coalesce(xf.xp, 0))                                             as xp
from students s
left join best_named bn on bn.student_code = s.code
left join freeplay_sum f on f.student_code = s.code
left join livecoding_done lc on lc.student_code = s.code
left join xp_tasks xt on xt.student_code = s.code
left join xp_quizzes xq on xq.student_code = s.code
left join xp_freeplay xf on xf.student_code = s.code
group by s.code, s.first_name, s.last_name, s.class, s.year_level,
         f.total, lc.total, xt.n, xq.n, xf.xp;

-- ============================================================
-- Word cloud (interactive module contributions)
-- ============================================================
-- One word per student per topic (e.g. topic = 'binary'). The primary key
-- (student_code, topic) means upsert lets a student change their word
-- rather than spam new ones. Tied to student_code so a teacher can moderate:
-- delete a row in the Supabase Table Editor to remove a word.

create table if not exists wordcloud (
  student_code  text not null references students(code) on delete cascade,
  topic         text not null,
  word          text not null,
  updated_at    timestamptz not null default now(),
  primary key (student_code, topic)
);

create index if not exists wordcloud_topic_idx on wordcloud(topic);

alter table wordcloud enable row level security;

drop policy if exists wordcloud_select_anon on wordcloud;
drop policy if exists wordcloud_insert_anon on wordcloud;
drop policy if exists wordcloud_update_anon on wordcloud;

create policy wordcloud_select_anon on wordcloud for select to anon using (true);
create policy wordcloud_insert_anon on wordcloud for insert to anon with check (true);
create policy wordcloud_update_anon on wordcloud for update to anon using (true) with check (true);

-- ============================================================
-- Assignments (added July 2026)
-- ============================================================
-- One submission per student per assignment; resubmitting upserts, so the
-- newest version wins and updated_at tracks when. `track` records which
-- path the student chose (petprogram: 'calc' or 'turtle'), `code` is the
-- full program text and `note` is their short reflection.

create table if not exists assignment_submissions (
  student_code  text not null references students(code) on delete cascade,
  assignment    text not null,
  track         text,
  code          text not null,
  note          text,
  submitted_at  timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  primary key (student_code, assignment)
);

create index if not exists assignment_submissions_assignment_idx
  on assignment_submissions(assignment);

alter table assignment_submissions enable row level security;

drop policy if exists assignments_select_anon on assignment_submissions;
drop policy if exists assignments_insert_anon on assignment_submissions;
drop policy if exists assignments_update_anon on assignment_submissions;

create policy assignments_select_anon on assignment_submissions for select to anon using (true);
create policy assignments_insert_anon on assignment_submissions for insert to anon with check (true);
create policy assignments_update_anon on assignment_submissions for update to anon using (true) with check (true);

-- DEPRECATED (July 2026): the site no longer writes to assignment_submissions.
-- Submitting is now a submitted_at flag on assignment_progress, and marking is
-- done from teacher_assignment_progress (further down). This table and view are
-- kept only so any historical submissions remain readable; nothing writes here.
create or replace view teacher_assignments as
select
  s.class,
  s.last_name,
  s.first_name,
  s.code,
  a.assignment,
  a.track,
  a.note,
  a.code as program,
  a.submitted_at,
  a.updated_at
from students s
join assignment_submissions a on a.student_code = s.code
order by s.class, s.last_name, s.first_name, a.assignment;

-- ============================================================
-- Private sandbox snippets (added July 2026)
-- ============================================================
-- Students can save the program in the Python Sandbox under a name and
-- load it back later, on any machine. One row per student per name;
-- saving the same name again upserts, so the newest version wins.
-- "Private" means the site only ever shows a student their own snippets.
-- As with every table here, the anon key could technically read all rows;
-- that matches the classroom security model (no PII beyond the roster).

create table if not exists snippets (
  student_code  text not null references students(code) on delete cascade,
  name          text not null,
  code          text not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  primary key (student_code, name)
);

alter table snippets enable row level security;

drop policy if exists snippets_select_anon on snippets;
drop policy if exists snippets_insert_anon on snippets;
drop policy if exists snippets_update_anon on snippets;
drop policy if exists snippets_delete_anon on snippets;

create policy snippets_select_anon on snippets for select to anon using (true);
create policy snippets_insert_anon on snippets for insert to anon with check (true);
create policy snippets_update_anon on snippets for update to anon using (true) with check (true);
create policy snippets_delete_anon on snippets for delete to anon using (true);

-- ============================================================
-- Homework (added July 2026)
-- ============================================================
-- A homework row is a list of items (modules, assignments, coding
-- challenges) set for one class (or 'ALL'). Students see their own status
-- per item on the home page; the teacher export shows who has started or
-- completed each item. Item statuses are computed from the existing
-- attempt/submission/progress tables, so this table only stores the list.

create table if not exists homework (
  id          bigserial primary key,
  class       text not null,
  title       text not null,
  items       jsonb not null,
  due_date    date,
  created_at  timestamptz not null default now()
);

alter table homework enable row level security;

drop policy if exists homework_select_anon on homework;
drop policy if exists homework_insert_anon on homework;
drop policy if exists homework_update_anon on homework;
drop policy if exists homework_delete_anon on homework;

create policy homework_select_anon on homework for select to anon using (true);
create policy homework_insert_anon on homework for insert to anon with check (true);
create policy homework_update_anon on homework for update to anon using (true) with check (true);
create policy homework_delete_anon on homework for delete to anon using (true);

-- ============================================================
-- Assignment progress autosave (added July 2026)
-- ============================================================
-- Work-in-progress state for assignment pages, synced continuously so a
-- student can move to a different computer without losing anything. One
-- row per student per assignment; `state` is a JSON blob owned by the
-- page (for petprogram: track, code per track, self-checks, reflections,
-- note). Submissions stay in assignment_submissions; this is the draft.

-- The continuously-synced state already holds the code, note, self-checks
-- and reflections, so "submitting" is just a flag: submitted_at is stamped
-- when the student says their work is ready to grade (null = not yet).
-- There is no separate submissions copy any more; the teacher marks from
-- this same row (submitted_at plus the live state).
create table if not exists assignment_progress (
  student_code  text not null references students(code) on delete cascade,
  assignment    text not null,
  state         jsonb not null,
  submitted_at  timestamptz,
  updated_at    timestamptz not null default now(),
  primary key (student_code, assignment)
);

-- Safe to re-run on an existing table that predates the flag.
alter table assignment_progress add column if not exists submitted_at timestamptz;

alter table assignment_progress enable row level security;

drop policy if exists progress_draft_select_anon on assignment_progress;
drop policy if exists progress_draft_insert_anon on assignment_progress;
drop policy if exists progress_draft_update_anon on assignment_progress;

create policy progress_draft_select_anon on assignment_progress for select to anon using (true);
create policy progress_draft_insert_anon on assignment_progress for insert to anon with check (true);
create policy progress_draft_update_anon on assignment_progress for update to anon using (true) with check (true);

-- Teacher view: everything you need to mark, one row per student per
-- assignment. The reflection answers live in state->'reflects', the code
-- in state->'code'; submitted_at is null until the student hands it in.
create or replace view teacher_assignment_progress as
select
  s.class,
  s.last_name,
  s.first_name,
  s.code,
  p.assignment,
  p.state,
  p.submitted_at,
  p.updated_at
from students s
join assignment_progress p on p.student_code = s.code
order by (p.submitted_at is not null) desc, p.updated_at desc;


-- ---------------------------------------------------------------------------
-- Published games (Task 3: "Make your own game" + the class gallery)
-- (added July 2026)
--
-- A student writes a game in the Sandbox-style editor on the Task 3 page and
-- publishes it under a title. Other students in the SAME CLASS (and teachers)
-- can browse the gallery, play each game, and read its code. "meta" holds the
-- design-notes answers (template or scratch, what the player controls, score,
-- what they added). "hidden" lets a teacher take a game down (e.g. a rude
-- title) without deleting the student's work.
-- One game per student (unique on student_code); publishing again just updates
-- that game, so the gallery stays one-entry-per-student.
-- ---------------------------------------------------------------------------
create table if not exists games (
  id            bigint generated by default as identity primary key,
  student_code  text not null references students(code) on delete cascade,
  title         text not null,
  code          text not null,
  meta          jsonb not null default '{}'::jsonb,
  hidden        boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (student_code)
);
create index if not exists games_student_idx on games(student_code);

-- If you created games earlier with a (student_code, title) unique key, run:
--   alter table games drop constraint if exists games_student_code_title_key;
--   alter table games add  constraint games_student_code_key unique (student_code);
-- (clear any student who already has two rows first).

alter table games enable row level security;

-- Permissive anon policies, matching the rest of the site: the gallery only
-- ever shows games from the viewer's own class (filtered client-side), and
-- publish/hide/delete are tied to student_code / staff in the app.
drop policy if exists games_select_anon on games;
drop policy if exists games_insert_anon on games;
drop policy if exists games_update_anon on games;
drop policy if exists games_delete_anon on games;

create policy games_select_anon on games for select to anon using (true);
create policy games_insert_anon on games for insert to anon with check (true);
create policy games_update_anon on games for update to anon using (true) with check (true);
create policy games_delete_anon on games for delete to anon using (true);

-- Upvotes: one vote per student per game, so the gallery can rank by rating.
create table if not exists game_votes (
  game_id       bigint not null references games(id) on delete cascade,
  student_code  text not null references students(code) on delete cascade,
  created_at    timestamptz not null default now(),
  primary key (game_id, student_code)
);
create index if not exists game_votes_game_idx on game_votes(game_id);

alter table game_votes enable row level security;

drop policy if exists game_votes_select_anon on game_votes;
drop policy if exists game_votes_insert_anon on game_votes;
drop policy if exists game_votes_delete_anon on game_votes;

create policy game_votes_select_anon on game_votes for select to anon using (true);
create policy game_votes_insert_anon on game_votes for insert to anon with check (true);
create policy game_votes_delete_anon on game_votes for delete to anon using (true);

-- Per-game leaderboards, fed by game.submit_score(points) when someone plays
-- a published game in the gallery. One row per player per game, best score
-- only, so this stays tiny. Scores die with the game (cascade), the same as
-- upvotes: republishing starts a fresh board. "name" is short ("Ali A.") and
-- "class" is stamped at submit time too, so the board shows who and where
-- without a join and without full surnames.
create table if not exists game_scores (
  game_id       bigint not null references games(id) on delete cascade,
  student_code  text not null references students(code) on delete cascade,
  name          text not null default '',
  class         text not null default '',
  score         double precision not null,
  updated_at    timestamptz not null default now(),
  primary key (game_id, student_code)
);
-- If you created game_scores before the class column existed, run:
--   alter table game_scores add column if not exists class text not null default '';
create index if not exists game_scores_game_idx on game_scores(game_id);

alter table game_scores enable row level security;

drop policy if exists game_scores_select_anon on game_scores;
drop policy if exists game_scores_insert_anon on game_scores;
drop policy if exists game_scores_update_anon on game_scores;

create policy game_scores_select_anon on game_scores for select to anon using (true);
create policy game_scores_insert_anon on game_scores for insert to anon with check (true);
create policy game_scores_update_anon on game_scores for update to anon using (true) with check (true);

-- ============================================================
-- Reset a test account
-- ============================================================
-- Wipes every trace of one student's work so the site can be tried again
-- from scratch. Used by the Reset button on the teacher page.
--
-- Every table is written out as public.<table> and search_path is emptied.
-- A security definer function keeps whatever search_path it was created with,
-- and if that does not resolve the way you expect, the body fails with
-- "relation students does not exist" even though the table is plainly there.
-- Naming the schema outright removes the guesswork, and is also what stops
-- anyone shadowing these tables with their own via the search path.
--
-- It is security definer, which means it runs with the owner's rights, so
-- the anon role does NOT need delete permission on any of these tables and
-- none has been granted. The function is the only way in, and it refuses
-- any student whose class is not TEST. The worst anyone can do by calling
-- it directly is wipe the throwaway Gremlin account.

create or replace function reset_test_student(p_code text)
returns table (part text, rows_deleted int)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_class text;
  n int;
begin
  select class into v_class from public.students where code = p_code;

  if v_class is null then
    raise exception 'No student with code %', p_code;
  end if;
  if v_class <> 'TEST' then
    raise exception 'reset_test_student only works on TEST accounts. % is in %', p_code, v_class;
  end if;

  delete from public.game_scores where student_code = p_code;
  get diagnostics n = row_count; part := 'game scores'; rows_deleted := n; return next;

  delete from public.game_votes where student_code = p_code;
  get diagnostics n = row_count; part := 'game votes'; rows_deleted := n; return next;

  delete from public.games where student_code = p_code;
  get diagnostics n = row_count; part := 'published games'; rows_deleted := n; return next;

  delete from public.snippets where student_code = p_code;
  get diagnostics n = row_count; part := 'saved snippets'; rows_deleted := n; return next;

  delete from public.assignment_progress where student_code = p_code;
  get diagnostics n = row_count; part := 'assignment progress'; rows_deleted := n; return next;

  delete from public.assignment_submissions where student_code = p_code;
  get diagnostics n = row_count; part := 'assignment submissions'; rows_deleted := n; return next;

  delete from public.wordcloud where student_code = p_code;
  get diagnostics n = row_count; part := 'word cloud words'; rows_deleted := n; return next;

  delete from public.quiz_progress where student_code = p_code;
  get diagnostics n = row_count; part := 'saved progress'; rows_deleted := n; return next;

  delete from public.quiz_attempts where student_code = p_code;
  get diagnostics n = row_count; part := 'quiz and freeplay attempts'; rows_deleted := n; return next;
end;
$$;

revoke all on function reset_test_student(text) from public;
grant execute on function reset_test_student(text) to anon;
