-- ===========================================================================
-- Database lockdown, phase 1, final step: close the students table
-- ===========================================================================
--
-- Run this ONLY after:
--   * supabase-lockdown.sql has been run, and
--   * the new JS (it_signin / it_leaderboard / it_roster) is live on the
--     site, and sign-in, the leaderboard and the teacher page all work.
--
-- Run it earlier and sign-in breaks for everyone until the JS goes out.
-- Safe to re-run. To undo in an emergency, re-create the old policy:
--   create policy students_select_anon on students for select to anon using (true);
--   grant select on students, leaderboard_view to anon;
-- ===========================================================================

-- The open read policy is what leaked the roster. With row level security
-- on and no policy, direct reads return nothing.
drop policy if exists students_select_anon on students;

-- Belt and braces: the browser roles get no table rights on students at all.
-- Foreign keys from quiz_attempts and friends still work, because Postgres
-- checks those as the table owner, not as the caller.
revoke all on table students from anon, authenticated;

-- The views. leaderboard_view now goes through it_leaderboard(), and the two
-- teacher views are not used by the site at all (the Supabase dashboard still
-- sees them, it runs as the owner). The teacher views ran with owner rights,
-- so they ignored row level security: switch them to the caller's rights
-- too, so even a stray grant cannot leak names through them again.
alter view teacher_scoreboard          set (security_invoker = on);
alter view teacher_assignment_progress set (security_invoker = on);
revoke all on table leaderboard_view            from anon, authenticated;
revoke all on table teacher_scoreboard          from anon, authenticated;
revoke all on table teacher_assignment_progress from anon, authenticated;

notify pgrst, 'reload schema';

-- ---------------------------------------------------------------------------
-- Check it worked: as the public key, every one of these should now fail or
-- return nothing. (Run from a browser console on the site, not here; the SQL
-- editor runs as the owner and will still see everything.)
--
--   ITBasics.client().from("students").select("*")              -> 0 rows / error
--   ITBasics.client().from("leaderboard_view").select("*")      -> error
--   ITBasics.client().from("teacher_scoreboard").select("*")    -> error
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- Optional tidy-up, NOT run by default: published games used to stamp the
-- author's full name into games.meta._author, which anyone can read until
-- phase 2 locks the games table. New publishes now stamp "First L." only.
-- To shorten the existing ones as well, run this on its own:
--
--   update games g
--   set meta = jsonb_set(g.meta, '{_author}',
--                to_jsonb(s.first_name || ' ' || upper(left(s.last_name, 1)) || '.'))
--   from students s
--   where s.code = g.student_code and g.meta ? '_author';
-- ---------------------------------------------------------------------------
