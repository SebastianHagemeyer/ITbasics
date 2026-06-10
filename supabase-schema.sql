-- Hallam IT Basics: Supabase schema + roster seed.
-- Run this once in the Supabase SQL Editor for your project.
-- Safe to re-run: tables use IF NOT EXISTS and the roster uses UPSERT.

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
  coalesce(lc.total, 0)                                              as livecoding
from students s
left join best_named bn on bn.student_code = s.code
left join freeplay_sum f on f.student_code = s.code
left join livecoding_done lc on lc.student_code = s.code
group by s.code, s.first_name, s.last_name, s.class, s.year_level, f.total, lc.total;

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
