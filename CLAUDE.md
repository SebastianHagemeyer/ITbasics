# CLAUDE.md

Guidance for Claude when working in this repo: **Hallam IT Basics**, a static
educational website for Year 7-9 computing students.

## Writing style

- **No em-dashes.** Never use the em-dash character (the long dash) or the
  `&mdash;` HTML entity, anywhere: lesson prose, UI strings, code comments, even
  commit messages. The site owner dislikes them. Reach for a comma, colon,
  period, or semicolon instead, whichever reads best, or rephrase the sentence.
- A plain hyphen is fine in compounds and code. A hyphen also works for genuine
  numeric ranges (`0-9`, `5-10 seconds`); existing `&ndash;` ranges are fine to
  leave as they are.
- Keep the friendly, plain-English tone pitched at 11-14 year-olds.

## Project shape

- Pure static HTML/CSS/JS, no build step. Open `index.html`, or serve with
  `python3 -m http.server 8000`. Deployed as a static site (GitHub Pages).
- `styles.css` is the single stylesheet for the whole site.
- Lessons live in `topics/<name>/index.html` and share the global scripts.
- Sign-in and progress use Supabase with a localStorage fallback (`app.js`,
  `supabase-config.js`). The anon key is public by design; security comes from
  the row-level-security policies in `supabase-schema.sql`.

## Interactive code on lesson pages

- **Python snippets** are made runnable by `snippet-run.js`: it adds a Run
  button under each `<pre class="code">` and runs it through the shared Pyodide
  grader that `challenges.js` exposes as `window.ITCode.run`. Load both scripts
  on the page. Mark `input()` snippets with `data-inputs='[...]'`, make a value
  editable with a `snippet-set` span, colour output with `data-colour`, or opt a
  snippet out with `data-norun`.
- **HTML snippets** use `html-preview.js` instead: each `<pre class="code">`
  becomes an editable box with a sandboxed `<iframe>` live preview. Opt out with
  `data-nopreview`. Do not load `snippet-run.js` on an HTML-snippet page (the
  markup is not Python).
- Full coding tasks (`.module-task[data-challenge]` or `#challenge-code`) are
  driven by `challenges.js`; `code-maximise.js` adds the full-screen toggle. The
  editor toolbar declutters by panel width via container queries in `styles.css`.

## Verifying changes

- There is no test suite. After editing a JS file, run `node --check <file>`.
- For lesson Python snippets, strip the tags and `compile()` the result to catch
  syntax slips before pushing.
