# CLAUDE.md

Guidance for Claude when working in this repo: **Hallam IT Basics**, a static
educational website for Year 7-10 computing students.

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

- Pure static HTML/CSS/JS. Open `index.html`, or serve with
  `python3 -m http.server 8000`. Deployed as a static site (GitHub Pages).
- `styles.css` is the single stylesheet for the whole site.
- Lessons live in `topics/<name>/index.html` and share the global scripts.
- Sign-in and progress use Supabase with a localStorage fallback (`app.js`,
  `supabase-config.js`). The anon key is public by design; security comes from
  the row-level-security policies in `supabase-schema.sql`.

## Shared markup: partials and `build.js`

The head, nav and footer used to be copied into all 31 pages by hand, which is
how three assignment pages ended up on the wrong year range for months. They now
live in `partials/` and are stamped into the pages by `build.js`.

- **Never hand-edit inside an include region.** Anything between
  `<!-- include: name -->` and `<!-- /include -->` is overwritten on the next
  build. Edit `partials/<name>.html` and run `node build.js`.
- Everything outside those regions is ordinary page markup, edited as usual.
- The pages stay real files: nothing to install, nothing to deploy differently,
  and opening `index.html` off disk still works. `build.js` only rewrites marked
  regions in place, so there is no generated copy that can drift.
- `node build.js --check` reports out-of-date pages without writing, for use
  before pushing.
- `partials/nav.html` takes `active="home|learn|play|assignments|none"` on the
  marker. Picking `assignments` lights up Learn too, since it sits in that menu.

Not everything shared is a partial. The seven common `<script>` tags are
interleaved differently on different pages, and making them contiguous would
change script execution order, so they are still per-page on purpose.

## Colours and dark mode

Every colour comes from a token in the `:root` block at the top of `styles.css`.
Dark mode is a single `:root[data-theme="dark"]` block at the bottom that
restates those tokens. There is no `prefers-color-scheme` media query: the
inline script in `partials/head-top.html` reads the saved choice or the system
setting and stamps `data-theme` on `<html>` before the page paints, so the
stylesheet only ever describes dark once and the two copies cannot drift.

Three rules, each of which came from an actual bug:

- **A fill is not an ink.** `--primary` is a fill and always carries white text,
  so it stays dark enough for white in both themes. The brand colour used *as*
  text is `--primary-ink`, which is navy in light and pale blue in dark. Same
  split for `--danger` (ink) and `--danger-fill`. Do not "fix" a fill by
  lightening it; you will break the white text sitting on it.
- **Tints and their ink move together.** A pale panel (`--tint-cool` and
  friends) has a matching `--ink-cool`. Darkening a panel without lightening
  the writing on it is how you get navy on navy.
- **Not every white is a light-mode leftover.** White text on a navy button is
  correct in both themes. Look at what a colour sits *on* before flipping it.
  Three whites are deliberately hardcoded and commented as such: the HTML
  preview frame (it shows the student's own page, as a browser would), the
  Screen Lab panel (its own dark instrument in both themes), and the glyphs in
  the module `.card-icon` tiles. That last one was turned dark once to satisfy
  an auditor and had to be put back: the glyph is decorative, the card's real
  label sits beside it at full contrast, and black marks on bright tiles look
  broken. A contrast sweep will flag all ten of them every time. Leave them.

Check contrast after changing colours. There is a throwaway auditor pattern
worth rebuilding: walk every element, composite its background up the tree, and
flag text below 4.5:1. Dark currently sits slightly cleaner than light.

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
- After editing anything in `partials/`, run `node build.js` and commit the
  pages it rewrites alongside the partial. `node build.js --check` fails if you
  forgot.
- `.github/workflows/checks.yml` runs three things on every pull request, each
  of which has already caught a real bug here: pages in step with `partials/`,
  every `*.js` parsing, and the braces in `styles.css` balancing. A stray brace
  closes a block early and silently drops every rule after it, which is how the
  dark palette once lost the pseudocode chips.
- For lesson Python snippets, strip the tags and `compile()` the result to catch
  syntax slips before pushing.
