# Hallam IT Basics

A beginner-friendly IT / computing website for Year 7-9 students at Hallam.

https://sebastianhagemeyer.github.io/ITbasics/

## What's inside

- **index.html**: Home page with an overview of all modules.
- **programming-basics.html**: Module 1. Algorithms, variables, if/else, loops, debugging.
- **html-basics.html**: Module 2. Tags, elements, links, images, lists, plus a mini project.
- **python-basics.html**: Module 3. Printing, variables, input, maths, loops, functions, challenges.
- **quizzes.html**: Three interactive 5-question quizzes (one per module) with instant feedback.
- **styles.css**: Single stylesheet for the whole site (Hallam navy + yellow, Comic Sans).
- **quiz.js**: Quiz logic.
- **app.js**: Sign-in by student code + progress storage (Supabase, with localStorage fallback).
- **supabase-config.js**: Two-line config file with the project URL + anon key.
- **supabase-schema.sql**: Database schema, row-level security and the seeded class roster.

## Running locally

It's all static HTML/CSS/JS. Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

The site works without any backend, progress just stays in the student's browser
(localStorage) until you connect Supabase.

## Setting up Supabase (saves student progress to a real database)

1. **Create a free project** at https://supabase.com (free tier: 500 MB, plenty for 58 students).
2. **Run the schema.** In Supabase, open the SQL Editor, start a new query, paste the contents of
   `supabase-schema.sql` and click Run. This creates the tables, the row-level-security
   policies, and seeds the 58-student roster for 7A, 7B and 9ITAA.
3. **Copy your keys.** Open Project Settings, then API, then copy the *Project URL* and *anon public* key.
4. **Paste them** into `supabase-config.js`:
   ```js
   window.SUPABASE_URL      = "https://YOUR-PROJECT-REF.supabase.co";
   window.SUPABASE_ANON_KEY = "YOUR-ANON-KEY";
   ```
   Commit and deploy. Students can now sign in with their code (e.g. `DRA0222`) and
   their answers + scores save to the database.

The anon key is *meant* to be public, it ships in client-side JS. Security comes
from the RLS policies in the schema file.

### Teacher view

After students start using it, you can see who&rsquo;s done what:

```sql
select * from teacher_scoreboard;
```

(Run it in the Supabase SQL Editor. The view is created by the schema file.)

## Deploying

Frontend stays static, so any static host works. Recommended for Hallam:

- **Cloudflare Pages** or **Netlify**, connect the GitHub repo, auto-deploys on push, free HTTPS.
- **Custom domain**: in your DNS for qmark.com, add a `CNAME` record from `learn` to `your-site.pages.dev`
  (or `your-site.netlify.app`). Then add `learn.qmark.com` as a custom domain in the host&rsquo;s settings.
- **Zscaler**: ask Hallam IT to allowlist `learn.qmark.com` and `*.supabase.co`.

## Teacher notes

- Each lesson page has a table of contents, short sections with worked examples, and
  &ldquo;You try&rdquo; boxes or mini projects for hands-on practice.
- Quizzes can be retaken any number of times. Last + best score show above each quiz.
- The three quiz tabs share a URL hash (`#programming`, `#html`, `#python`) so you can
  link students directly to a specific quiz.
- Sign-in is just the student&rsquo;s `ImportIdentifier` code (e.g. `DRA0222`). No passwords,
  no emails stored in the database.
