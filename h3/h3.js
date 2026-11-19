/* H3, the Hallam Homework Hub.
 *
 * Ported from the claude.ai artifact. The marking (checker.js), the question
 * bank (bank.js) and the look are unchanged; what changed is everything the
 * claude.ai runtime used to do:
 *   - who you are: a student code checked against H3's own roster (h3_signin)
 *   - saving: h3_save, which merges newest-wins per question on the server
 *   - the teacher view: the IT site's staff key, checked in the database
 *
 * The browser never reads the H3 tables directly. Everything goes through the
 * security definer functions in supabase-h3.sql.
 *
 * Routes: #home (welcome), #chapter-<id>, #set-<id>, #teacher.
 */
(() => {
  "use strict";

  // ---------- data ----------
  const BANK = window.H3_BANK || { sets: [] };
  const SETS = BANK.sets || [];
  const setById = Object.fromEntries(SETS.map(s => [s.id, s]));
  const Notes = window.H3Notes;

  const LS_RESULTS = 'h3-results-v1';     // per code: { code: results }
  const LS_SESSION = 'h3-session';         // the signed-in student row
  const LS_STAFF = 'itbasics-staff-key';   // shared with /teacher/ on purpose
  const REFRESH_MS = 20000;

  const app = document.getElementById('app');
  // Thick arrow for the back links, drawn in currentColor so it matches the link.
  const backArrow = '<svg class="back-arrow" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M19 12H6M11.5 5.5 5 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const chip = document.getElementById('save-chip');

  const state = {
    me: null,             // { code, first_name, last_name, class }
    results: {},          // { setId: { qid: { v, ok, n, t } } }
    mode: 'local',        // 'local' | 'cloud'
    staffKey: '',
    staff: false,
    overview: null,       // teacher: rows from h3_overview
    teacherClass: '',
    teacherSet: null, teacherDetail: null, showKey: false,
    owedOnly: false,
  };

  let db = null;

  function store(key, value) {
    try {
      if (value == null) localStorage.removeItem(key);
      else localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch (e) {}
  }
  function load(key, json) {
    try {
      const raw = localStorage.getItem(key);
      return json ? (raw ? JSON.parse(raw) : null) : (raw || '');
    } catch (e) { return json ? null : ''; }
  }

  // Results are kept per code, so two students sharing a computer never see
  // each other's ticks.
  function loadLocal() {
    const all = load(LS_RESULTS, true) || {};
    state.results = (state.me && all[state.me.code]) || {};
  }
  function saveLocal() {
    if (!state.me) return;
    const all = load(LS_RESULTS, true) || {};
    all[state.me.code] = state.results;
    store(LS_RESULTS, all);
  }

  // Keep whichever answer is newer, question by question.
  function merge(a, b) {
    const out = JSON.parse(JSON.stringify(a || {}));
    Object.keys(b || {}).forEach(sid => {
      out[sid] = out[sid] || {};
      Object.keys(b[sid] || {}).forEach(qid => {
        const l = b[sid][qid], r = out[sid][qid];
        if (!r || ((l && l.t) || 0) > (r.t || 0)) out[sid][qid] = l;
      });
    });
    return out;
  }

  function niceError(err) {
    const text = (err && (err.message || err.details)) || '';
    if (/Failed to fetch|NetworkError|network/i.test(text)) return "Couldn't reach the database. Check your connection and try again.";
    return text || 'Something went wrong. Try again.';
  }

  // ---------- cloud saving (one write at a time) ----------
  let saving = false, dirty = false;
  async function saveCloud() {
    if (state.mode !== 'cloud' || !db || !state.me) return;
    if (saving) { dirty = true; return; }
    saving = true;
    setChip('Saving...', '');
    const send = state.results;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await db.rpc('h3_save', { p_code: state.me.code, p_sets: send });
        if (res.error) throw res.error;
        // The server copy may hold work from another device: fold it in.
        state.results = merge(res.data || {}, state.results);
        saveLocal();
        setChip('Saved for your teacher', 'ok');
        break;
      } catch (e) {
        if (attempt === 0 && /fetch|network/i.test(String(e && e.message))) {
          await new Promise(r => setTimeout(r, 800 + Math.random() * 800));
          continue;
        }
        setChip('Not saved yet. Check your connection.', 'warn');
      }
    }
    saving = false;
    if (dirty) { dirty = false; saveCloud(); }
  }
  function persist() { saveLocal(); saveCloud(); }

  function setChip(text, cls) { chip.textContent = text; chip.className = 'chip' + (cls ? ' ' + cls : ''); }

  // ---------- helpers ----------
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Maths text: show a clean plain version first; swap in typeset maths once MathJax is ready.
  const plainMath = (t) => String(t ?? '')
    .replace(/\\dfrac\{([^}]*)\}\{([^}]*)\}|\\frac\{([^}]*)\}\{([^}]*)\}/g, (m, a, b, c, d) => `${a ?? c}/${b ?? d}`)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷').replace(/\\,/g, ' ').replace(/\\square/g, '□')
    .replace(/\^\{(\d+)\}/g, (m, d) => d.split('').map(x => '⁰¹²³⁴⁵⁶⁷⁸⁹'[x]).join(''))
    .replace(/\\\$/g, '\u0000').replace(/\$/g, '').replace(/\u0000/g, '$')
    .replace(/ - /g, ' − ').replace(/\s+/g, ' ').trim();
  const mt = (t) => /\$|\\/.test(String(t ?? '')) ? `<span data-tex="${esc(t)}">${esc(plainMath(t))}</span>` : esc(t);
  let mathReady = false;
  const typeset = (el) => {
    if (!mathReady || !window.MathJax || !MathJax.typesetPromise) return;
    const spans = [...el.querySelectorAll('[data-tex]')];
    spans.forEach(sp => { sp.textContent = sp.dataset.tex; sp.removeAttribute('data-tex'); });
    if (spans.length) MathJax.typesetPromise(spans).catch(() => {});
  };
  const tick = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10.5l4 4 8-9"/></svg>';
  const cross = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15"/></svg>';
  // A little green note (a folded slip of paper).
  const noteIcon = '<svg class="gn-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h10l4 4v14H5z" fill="currentColor"/><path d="M15 3v4h4" fill="none" stroke="var(--note-fold)" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 12h8M8 15.5h8M8 9h4" stroke="var(--note-fold)" stroke-width="1.6" stroke-linecap="round"/></svg>';

  function setScore(set, res) {
    const r = res || {};
    const correct = set.questions.filter(q => r[q.id] && r[q.id].ok).length;
    const tried = set.questions.filter(q => r[q.id]).length;
    return { correct, tried, total: set.questions.length };
  }

  // Percent of a chapter's questions answered correctly. Rounded, except
  // that any progress shows at least 1% and only a fully finished chapter
  // shows 100%, so one right answer never reads as 0% and 99.6% never
  // claims to be done.
  function pctOf(correct, total) {
    if (!total || !correct) return 0;
    if (correct === total) return 100;
    return Math.min(99, Math.max(1, Math.round(100 * correct / total)));
  }
  function chapterPct(ch) {
    let correct = 0, total = 0;
    ch.sets.forEach(s => { const sc = setScore(s, state.results[s.id]); correct += sc.correct; total += sc.total; });
    return pctOf(correct, total);
  }

  // "1B Place value in ..." -> code "1B", rest "Place value in ..."
  function splitTitle(t) {
    const m = String(t || '').match(/^(\d+[A-Z]+)\s+(.*)$/);
    return m ? { code: m[1], rest: m[2] } : { code: '', rest: t };
  }

  const PLACEHOLDERS = {
    numeric: 'Type a number, e.g. 2.5 or 3/4',
    expression: 'Type an expression, e.g. 3x^2 + 2',
    list: 'Separate answers with commas, e.g. 2, -5',
    point: 'Type a point, e.g. (3, -1)',
    text: 'Type your answer',
    expanded: 'e.g. 4 x 100 + 7 x 10 + 2 x 1',
    qr: 'e.g. 17 r 3',
    brackets: 'Type it with brackets, e.g. (3 + 4) x 2',
    product: 'e.g. 5 x 21',
    placevalue: 'e.g. 600 or hundreds',
    ordered: 'Separate with commas, e.g. 12, 21, 112',
  };

  const REASONS = {
    unreadable: "We couldn't read that answer. Check how it's typed.",
    'not simplest': 'Check that your fraction is fully simplified.',
    'not factorised': 'Your answer needs to be in factorised form.',
    'not expanded': 'Your answer needs to be fully expanded.',
    'missing values': 'There are more answers to find.',
    'too many values': "You've given more answers than needed.",
    'not a number': 'Give your answer as a single number.',
    'not expanded form': 'Write each digit times its place value, joined with +.',
    'use index notation': 'Write the place values as powers of 10, e.g. 10^3.',
    'missing remainder': 'Include the remainder, e.g. 17 r 3.',
    'changed numbers': 'Keep the numbers and operations in the same order. Only add brackets.',
    'not a product': 'Write it as one number multiplied by another.',
    'not simplified': 'Simplify your answer as far as you can.',
  };

  function notesLine(n) {
    return `${n} green note${n === 1 ? '' : 's'}`;
  }
  function toNextText(ch) {
    if (ch.full) return 'Chapter finished: every note earned';
    return `${ch.toNext} more sub-chapter${ch.toNext === 1 ? '' : 's'} for your next green note`;
  }

  // ---------- sign in ----------
  function viewSignin(message, isError) {
    app.innerHTML = `
      <div class="signin-wrap">
        <form class="signin-card" id="signin" autocomplete="off">
          <a class="portal-badge portal-snake" href="/" title="IT homework: Hallam IT Basics" aria-label="Go to the Hallam IT Basics sign-in">
            <svg viewBox="40 30 140 115" width="30" height="30" aria-hidden="true"><circle cx="110" cy="86" r="52" fill="#1C4587"/><path d="M 70 100 Q 110 132 150 100 Q 145 130 110 138 Q 75 130 70 100 Z" fill="#FFFF00"/><circle cx="92" cy="76" r="14" fill="#fff"/><circle cx="128" cy="76" r="14" fill="#fff"/><circle cx="94" cy="78" r="6.5" fill="#0f1226"/><circle cx="130" cy="78" r="6.5" fill="#0f1226"/><path d="M 90 116 Q 110 130 130 116" stroke="#0f1226" stroke-width="5" fill="none" stroke-linecap="round"/></svg>
          </a>
          <img class="h3-mark big" src="/h3/h3-mark.svg" alt="" width="72" height="72">
          <h2>Welcome to H3</h2>
          <p class="lede">The Hallam Homework Hub. Sign in with your student code to start.</p>
          <label for="code" class="sr-only">Student code</label>
          <div class="answer-row">
            <input type="text" id="code" placeholder="e.g. ABC0012" maxlength="20" autocapitalize="characters" spellcheck="false" autofocus>
            <button class="btn" type="submit" id="signin-go">Sign in</button>
          </div>
          <p class="signin-msg ${isError ? 'is-error' : ''}" id="signin-msg" role="status">${esc(message || '')}</p>
          <p class="hint">It's the same code you use for everything at school. Not working? Ask your teacher to add you to H3.</p>
          <p class="hint"><a href="#teacher">Staff sign-in</a></p>
        </form>
      </div>`;
    document.getElementById('signin').addEventListener('submit', async (e) => {
      e.preventDefault();
      const code = document.getElementById('code').value.trim().toUpperCase();
      if (!code) return;
      const btn = document.getElementById('signin-go');
      btn.disabled = true;
      const m = document.getElementById('signin-msg');
      m.textContent = 'Signing in...'; m.className = 'signin-msg';
      const r = await signIn(code);
      if (!r.ok) { btn.disabled = false; m.textContent = r.error; m.className = 'signin-msg is-error'; }
    });
  }

  async function signIn(code) {
    if (!db) return { ok: false, error: "H3 can't reach its database right now. Check your connection and reload." };
    let res;
    try { res = await db.rpc('h3_signin', { p_code: code }); }
    catch (e) { return { ok: false, error: niceError(e) }; }
    if (res.error) return { ok: false, error: niceError(res.error) };
    const row = Array.isArray(res.data) ? res.data[0] : res.data;
    if (!row) return { ok: false, error: "That code isn't on the H3 list. Check the spelling, or ask your teacher to add you." };
    enterAs(row);
    return { ok: true };
  }

  function enterAs(row) {
    state.me = { code: row.code, first_name: row.first_name, last_name: row.last_name, class: row.class };
    store(LS_SESSION, state.me);
    loadLocal();
    state.results = merge(row.sets || {}, state.results);
    saveLocal();
    state.mode = 'cloud';
    renderWho();
    // Push anything done on this device before signing in.
    saveCloud();
    if (!location.hash || location.hash === '#home') route(); else location.hash = '#home';
  }

  function signOut() {
    store(LS_SESSION, null);
    state.me = null; state.results = {}; state.mode = 'local';
    renderWho();
    if (location.hash && location.hash !== '#home') location.hash = '#home'; else route();
  }

  function renderWho() {
    const who = document.getElementById('who');
    if (state.me) {
      who.hidden = false;
      document.getElementById('who-name').textContent = state.me.first_name || state.me.code;
      chip.hidden = false;
    } else {
      who.hidden = true;
      chip.hidden = true;
    }
    document.getElementById('nav-home').hidden = !state.me;
    document.getElementById('nav-teacher').hidden = !state.staff;
  }

  // ---------- student views ----------
  function viewHome() {
    if (!SETS.length) {
      app.innerHTML = `<div class="narrow"><h2>No homework yet</h2><p class="lede">Your teacher hasn't added any questions yet. Check back soon.</p></div>`;
      return;
    }
    const sum = Notes.summary(SETS, state.results);
    const started = SETS.some(s => setScore(s, state.results[s.id]).tried);
    app.innerHTML = `
      <section class="welcome">
        <div>
          <p class="eyebrow">H3 · Hallam Homework Hub</p>
          <h2>Welcome${started ? ' back' : ''}, ${esc(state.me.first_name || state.me.code)}</h2>
          <p class="lede">Pick a chapter, then a sub-chapter. Every <b>3 sub-chapters</b> you finish earns a <b>green note</b>, and finishing a whole chapter earns one more.</p>
        </div>
        <div class="gn-total" aria-label="${esc(notesLine(sum.earned))} earned">
          <div class="gn-stack">${noteIcon}<b>${sum.earned}</b></div>
          <small>green note${sum.earned === 1 ? '' : 's'} earned</small>
        </div>
      </section>
      <h3 class="list-head">Chapters</h3>
      <div class="sets chapters">
        ${sum.chapters.map(ch => {
          const pct = chapterPct(ch);
          const max = Math.floor(ch.total / Notes.PER_NOTE) + 1;
          return `<a class="set-card chapter-card ${ch.full ? 'is-full' : ''}" href="#chapter-${esc(ch.id)}">
            <div class="chapter-top"><span class="chapter-id"><span class="chapter-num">${esc(ch.id)}</span><span class="chapter-pct" title="${pct}% of this chapter's questions correct">${pct}%</span></span>
              <span class="gn-row" title="${ch.earned} of ${max} green notes">${Array.from({ length: max }, (_, i) => `<span class="gn-dot ${i < ch.earned ? 'on' : ''}">${noteIcon}</span>`).join('')}</span></div>
            <h3>${esc(ch.name.replace(/^Chapter\s+\d+:\s*/i, ''))}</h3>
            <div class="meter" aria-hidden="true"><span style="width:${pct}%"></span></div>
            <div class="meter-row"><span>${ch.done} of ${ch.total} sub-chapters done</span><span>${esc(notesLine(ch.earned))}</span></div>
            <p class="next">${esc(toNextText(ch))}</p>
          </a>`;
        }).join('')}
      </div>`;
    typeset(app);
  }

  function viewChapter(id) {
    const sum = Notes.summary(SETS, state.results);
    const ch = sum.chapters.find(c => c.id === id);
    if (!ch) { location.hash = '#home'; return; }
    app.innerHTML = `
      <a class="back" href="#home">${backArrow}All chapters</a>
      <div class="set-head">
        <div>
          <div class="key-meta" style="text-transform:uppercase;letter-spacing:.08em;font-weight:700">Chapter ${esc(ch.id)}</div>
          <h2>${esc(ch.name.replace(/^Chapter\s+\d+:\s*/i, ''))}</h2>
        </div>
        <div class="score"><b>${ch.done}/${ch.total}</b><small>sub-chapters done</small></div>
      </div>
      <div class="gn-banner">${noteIcon}<span><b>${esc(notesLine(ch.earned))}</b> from this chapter. ${esc(toNextText(ch))}.</span></div>
      <div class="sets">
        ${ch.sets.map(s => {
          const sc = setScore(s, state.results[s.id]);
          const pct = pctOf(sc.correct, sc.total);
          const done = sc.correct === sc.total && sc.total > 0;
          const t = splitTitle(s.title);
          return `<a class="set-card ${done ? 'is-full' : ''}" href="#set-${esc(s.id)}">
            <h3>${t.code ? `<span class="set-code">${esc(t.code)}</span> ` : ''}${esc(t.rest)}</h3>
            ${s.description ? `<p>${esc(s.description)}</p>` : ''}
            <div class="meter" aria-hidden="true"><span style="width:${pct}%"></span></div>
            <div class="meter-row"><span>${sc.correct} of ${sc.total} correct</span>${sc.tried ? `<span class="set-pct">${pct}%</span>` : ''}<span>${done ? 'Done ✓' : sc.tried ? 'In progress' : 'Not started'}</span></div>
          </a>`;
        }).join('')}
      </div>`;
    typeset(app);
  }

  function inputFor(q, saved) {
    const locked = saved && saved.ok;
    if (q.type === 'choice') {
      return `<div class="choices" role="radiogroup" aria-label="Choices">
        ${(q.options || []).map((o, i) => `<label class="choice"><input type="radio" name="c-${esc(q.id)}" value="${i}" ${saved && String(saved.v) === String(i) ? 'checked' : ''} ${locked ? 'disabled' : ''}><span><b>${'ABCDEFGH'[i]}.</b> ${esc(o)}</span></label>`).join('')}
      </div>`;
    }
    const pre = q.units && /^[$£€]/.test(q.units) ? `<span class="units">${esc(q.units)}</span>` : '';
    const post = q.units && !/^[$£€]/.test(q.units) ? `<span class="units">${esc(q.units)}</span>` : '';
    return `${pre}<input type="text" id="in-${esc(q.id)}" autocomplete="off" autocapitalize="off" spellcheck="false"
      aria-label="Answer to question" placeholder="${esc(PLACEHOLDERS[q.type] || PLACEHOLDERS.numeric)}"
      value="${saved ? esc(saved.v) : ''}" ${locked ? 'readonly' : ''}>${post}`;
  }

  function feedbackHtml(saved, reason) {
    if (!saved) return '';
    const mark = saved.ok
      ? `<span class="mark good">${tick} Correct</span>`
      : `<span class="mark bad">${cross} Incorrect</span>`;
    const note = !saved.ok && reason && REASONS[reason] ? `<span class="note">${esc(REASONS[reason])}</span>` : '';
    const tries = `<span class="tries">${saved.n} ${saved.n === 1 ? 'attempt' : 'attempts'}</span>`;
    return mark + note + tries;
  }

  function chapterIdOf(set) {
    const ch = Notes.chapters(SETS).find(c => c.sets.indexOf(set) !== -1);
    return ch ? ch.id : '';
  }

  function viewSet(id) {
    const set = setById[id];
    if (!set) { location.hash = '#home'; return; }
    const res = state.results[set.id] || {};
    const sc = setScore(set, res);
    const chId = chapterIdOf(set);
    app.innerHTML = `
      <div class="narrow">
        <a class="back" href="#chapter-${esc(chId)}">${backArrow}Chapter ${esc(chId)}</a>
        <div class="set-head">
          <div>
            ${set.chapter ? `<div class="key-meta" style="text-transform:uppercase;letter-spacing:.08em;font-weight:700">${esc(set.chapter)}</div>` : ''}
            <h2>${esc(set.title)}</h2>
          </div>
          <div class="score" id="score"><b>${sc.correct}/${sc.total}</b><small>correct</small></div>
        </div>
        <div id="celebrate"></div>
        <details class="how">
          <summary>How to type your answers</summary>
          <ul>
            <li>Fractions: <code>3/4</code>, mixed numbers: <code>1 1/2</code></li>
            <li>Powers: <code>x^2</code>, square roots: <code>sqrt(5)</code>, pi: <code>pi</code></li>
            <li>Multiply with <code>*</code> or just write terms together: <code>3x</code>, <code>2(x+1)</code></li>
            <li>More than one answer: separate with commas, <code>4, -1</code></li>
            <li>Points: <code>(2, -3)</code>. You can leave off units like cm.</li>
          </ul>
        </details>
        <ol class="qlist">
          ${set.questions.map((q, i) => {
            const saved = res[q.id];
            const cls = saved ? (saved.ok ? 'is-correct' : 'is-wrong') : '';
            const prev = set.questions[i - 1];
            let lead = '';
            if (q.section && (!prev || prev.section !== q.section)) lead += `<li class="section-head" aria-hidden="false"><h3>${esc(q.section)}</h3></li>`;
            const qn = (x) => x && String(x.label || '').replace(/[a-z]+$/, '');
            if (q.stem && (!prev || prev.stem !== q.stem || qn(prev) !== qn(q))) lead += `<li class="stem"><span class="stem-num">${esc(qn(q))}</span><p>${mt(q.stem)}</p></li>`;
            return lead + `<li class="q ${cls}" id="card-${esc(q.id)}" data-qid="${esc(q.id)}">
              <div class="qnum">${esc(q.label || (i + 1))}</div>
              <div class="qbody">
                <p class="prompt">${mt(q.prompt)}</p>
                <form class="answer-row" data-qid="${esc(q.id)}">
                  ${inputFor(q, saved)}
                  <button class="btn" type="submit" ${saved && saved.ok ? 'disabled' : ''}>${saved && saved.ok ? 'Done' : 'Check'}</button>
                </form>
                ${q.hint && !(saved && saved.ok) ? `<p class="hint">${esc(q.hint)}</p>` : ''}
                <div class="feedback" aria-live="polite">${feedbackHtml(saved)}</div>
              </div>
            </li>`;
          }).join('')}
        </ol>
      </div>`;
    app.querySelectorAll('form.answer-row').forEach(f => f.addEventListener('submit', onCheck));
    typeset(app);
  }

  function onCheck(ev) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const qid = form.dataset.qid;
    const setId = location.hash.slice(5);
    const set = setById[setId];
    const q = set && set.questions.find(x => x.id === qid);
    if (!q) return;
    let value;
    if (q.type === 'choice') {
      const picked = form.querySelector('input[type=radio]:checked');
      if (!picked) return;
      value = picked.value;
    } else {
      value = form.querySelector('input[type=text]').value.trim();
      if (!value) { form.querySelector('input').focus(); return; }
    }
    const before = Notes.summary(SETS, state.results).earned;
    const result = Checker.check(q, value);
    const res = state.results[setId] = state.results[setId] || {};
    const prev = res[qid];
    // Don't count an unreadable entry or the same wrong answer twice as a new attempt
    const sameAsBefore = prev && !prev.ok && String(prev.v) === String(value);
    const n = (prev ? prev.n : 0) + (sameAsBefore || result.reason === 'unreadable' ? 0 : 1);
    res[qid] = { v: value, ok: !!result.correct, n: Math.max(n, 1), t: Date.now() };
    persist();

    // update this card in place
    const card = document.getElementById('card-' + qid);
    card.classList.toggle('is-correct', result.correct);
    card.classList.toggle('is-wrong', !result.correct);
    card.querySelector('.feedback').innerHTML = feedbackHtml(res[qid], result.reason);
    if (result.correct) {
      form.querySelectorAll('input').forEach(i => { i.readOnly = true; if (i.type === 'radio') i.disabled = true; });
      const b = form.querySelector('button'); b.disabled = true; b.textContent = 'Done';
      const h = card.querySelector('.hint'); if (h) h.remove();
      // move focus to the next unanswered question
      const next = card.nextElementSibling && card.nextElementSibling.querySelector('input:not([readonly]):not([disabled])');
      if (next) next.focus();
    }
    const sc = setScore(set, res);
    document.getElementById('score').innerHTML = `<b>${sc.correct}/${sc.total}</b><small>correct</small>`;

    // Just finished the set? Say so, and say if it earned a green note.
    if (result.correct && sc.correct === sc.total) {
      const after = Notes.summary(SETS, state.results);
      const gained = after.earned - before;
      const ch = after.chapters.find(c => c.sets.indexOf(set) !== -1);
      document.getElementById('celebrate').innerHTML = `<div class="gn-banner celebrate">${noteIcon}<span>
        <b>${esc(set.title.split(' ')[0])} done!</b>
        ${gained > 0 ? `You earned <b>${gained} green note${gained === 1 ? '' : 's'}</b>${ch && ch.full ? ', including the bonus for finishing the chapter' : ''}. Your teacher can see it.` : ch ? esc(toNextText(ch)) + '.' : ''}
        <a href="#chapter-${esc(chapterIdOf(set))}">Back to the chapter</a></span></div>`;
      document.getElementById('celebrate').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  // ---------- teacher ----------
  function keyText(q) {
    if (q.type === 'choice') { const i = typeof q.answer === 'number' ? q.answer : 'abcdefgh'.indexOf(String(q.answer).toLowerCase()); return `${'ABCDEFGH'[i]}. ${(q.options || [])[i]}`; }
    if (q.type === 'qr') return `${q.answer[0]} r ${q.answer[1]}`;
    if (q.type === 'expanded') { const d = String(q.answer); return d.split('').map((c, i) => [c, d.length - 1 - i]).filter(([c]) => c !== '0').map(([c, p]) => q.index ? (p === 0 ? `${c} × 1` : `${c} × 10^${p}`) : `${c} × ${Math.pow(10, p)}`).join(' + '); }
    const a = Array.isArray(q.answer) ? q.answer.join(', ') : q.answer;
    return a + (q.accept && q.accept.length ? `  (also: ${q.accept.join(' | ')})` : '');
  }
  function keyMeta(q) {
    const m = [q.type];
    if (q.dp != null) m.push(`${q.dp} d.p.`);
    if (q.tolerance != null) m.push(`±${q.tolerance}`);
    if (q.simplest) m.push('simplest form');
    if (q.form) m.push(q.form);
    return m.join(' · ');
  }

  async function keyWorks(key) {
    if (!key || !db) return false;
    try {
      const res = await db.rpc('it_is_staff', { p_key: key });
      return !res.error && res.data === true;
    } catch (e) { return false; }
  }

  function viewStaffGate(message) {
    app.innerHTML = `
      <div class="signin-wrap">
        <form class="signin-card" id="staff-form" autocomplete="off">
          <h2>Staff sign-in</h2>
          <p class="lede">Enter your staff key. It's the same key as the IT teacher page, and this device remembers it.</p>
          <label for="staff-key" class="sr-only">Staff key</label>
          <div class="answer-row">
            <input type="password" id="staff-key" placeholder="Staff key" autofocus>
            <button class="btn" type="submit">Unlock</button>
          </div>
          <p class="signin-msg ${message ? 'is-error' : ''}" id="staff-msg" role="status">${esc(message || '')}</p>
          <p class="hint"><a href="#home">Back to student sign-in</a></p>
        </form>
      </div>`;
    document.getElementById('staff-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const val = document.getElementById('staff-key').value.trim();
      const m = document.getElementById('staff-msg');
      m.textContent = 'Checking...'; m.className = 'signin-msg';
      if (await keyWorks(val)) {
        state.staffKey = val; state.staff = true; store(LS_STAFF, val);
        renderWho();
        loadOverview();
        viewTeacher();
      } else {
        m.textContent = 'That staff key was not recognised.'; m.className = 'signin-msg is-error';
      }
    });
  }

  let overviewTimer = null;
  async function loadOverview() {
    if (!state.staff || !db) return;
    try {
      const res = await db.rpc('h3_overview', { p_key: state.staffKey });
      if (res.error) throw res.error;
      state.overview = res.data || [];
      state.overviewError = '';
    } catch (e) {
      state.overviewError = niceError(e);
      if (/staff key/i.test(state.overviewError)) {
        state.staff = false; state.staffKey = ''; store(LS_STAFF, null); renderWho();
      }
      if (state.overview === null) state.overview = [];
    }
    if (location.hash === '#teacher') viewTeacher();
  }
  function startOverviewTimer() {
    clearInterval(overviewTimer);
    overviewTimer = setInterval(() => {
      // Don't repaint under the teacher's cursor while they type.
      const a = document.activeElement;
      if (location.hash !== '#teacher') { clearInterval(overviewTimer); return; }
      if (a && (a.tagName === 'TEXTAREA' || a.tagName === 'INPUT' || a.tagName === 'SELECT')) return;
      loadOverview();
    }, REFRESH_MS);
  }

  function fullName(r) { return ((r.first_name || '') + ' ' + (r.last_name || '')).trim() || r.code; }

  async function setIssued(code, n) {
    try {
      const res = await db.rpc('h3_set_issued', { p_key: state.staffKey, p_code: code, p_issued: n });
      if (res.error) throw res.error;
      const row = (state.overview || []).find(r => r.code === code);
      if (row) row.notes_issued = res.data;
    } catch (e) { alert(niceError(e)); }
    viewTeacher();
  }

  async function removeStudent(code) {
    const row = (state.overview || []).find(r => r.code === code);
    if (!confirm(`Remove ${row ? fullName(row) : code} from H3? Their saved work is deleted too.`)) return;
    try {
      const res = await db.rpc('h3_remove_student', { p_key: state.staffKey, p_code: code });
      if (res.error) throw res.error;
    } catch (e) { alert(niceError(e)); }
    loadOverview();
  }

  // ---- class list paste (Excel or CSV), same rules as /launch ----
  const HEADER_WORDS = {
    code: ['code', 'studentcode', 'id', 'studentid', 'username', 'student', 'studentnumber', 'idnumber'],
    first_name: ['first', 'firstname', 'givenname', 'given', 'preferredname', 'preferred', 'firstnames'],
    last_name: ['last', 'lastname', 'surname', 'familyname', 'family'],
    class: ['class', 'classcode', 'group', 'homegroup', 'hg', 'form', 'formgroup', 'rollclass', 'roll'],
    name: ['name', 'fullname', 'studentname']
  };
  function headerField(cell) {
    const key = String(cell).toLowerCase().replace(/[^a-z]/g, '');
    for (const f in HEADER_WORDS) if (HEADER_WORDS[f].indexOf(key) !== -1) return f;
    return '';
  }
  const looksLikeCode = (v) => /^[A-Za-z]{2,4}\d{2,5}$/.test(String(v).trim());
  const splitLine = (line) => line.indexOf('\t') !== -1 ? line.split('\t') : line.split(',');
  function parseClassList(text, defaultClass) {
    const lines = text.split(/\r?\n/).map(l => l.replace(/\s+$/, '')).filter(l => l.trim());
    if (!lines.length) return { rows: [], skipped: [] };
    let grid = lines.map(l => splitLine(l).map(c => c.trim()));
    let map = null;
    if (!grid[0].some(looksLikeCode)) {
      const guess = {};
      grid[0].forEach((c, i) => { const f = headerField(c); if (f && guess[f] === undefined) guess[f] = i; });
      if (Object.keys(guess).length) { map = guess; grid = grid.slice(1); }
    }
    if (!map) map = { code: 0, first_name: 1, last_name: 2, class: 3 };
    const rows = [], skipped = [], seen = {};
    grid.forEach((cells, i) => {
      let code = map.code !== undefined ? cells[map.code] : '';
      if (!looksLikeCode(code || '')) { const hit = cells.filter(looksLikeCode)[0]; if (hit) code = hit; }
      code = String(code || '').trim().toUpperCase();
      let first = map.first_name !== undefined ? cells[map.first_name] || '' : '';
      let last = map.last_name !== undefined ? cells[map.last_name] || '' : '';
      if (!first && !last && map.name !== undefined) {
        const full = cells[map.name] || '';
        if (full.indexOf(',') !== -1) { last = full.split(',')[0].trim(); first = full.split(',').slice(1).join(',').trim(); }
        else { const parts = full.trim().split(/\s+/); last = parts.length > 1 ? parts.pop() : ''; first = parts.join(' '); }
      }
      const cls = (map.class !== undefined ? cells[map.class] || '' : '') || defaultClass || '';
      if (!/^[A-Z0-9]{3,20}$/.test(code)) { skipped.push(lines[i + (lines.length - grid.length)]); return; }
      if (seen[code]) return;
      seen[code] = true;
      rows.push({ code, first_name: first, last_name: last, class: cls.toUpperCase() });
    });
    return { rows, skipped };
  }

  let pending = [];
  function previewImport() {
    const parsed = parseClassList(document.getElementById('paste').value, document.getElementById('paste-class').value.trim());
    pending = parsed.rows;
    const existing = {};
    (state.overview || []).forEach(r => { existing[r.code] = true; });
    const fresh = pending.filter(r => !existing[r.code]).length;
    const msg = document.getElementById('paste-msg');
    document.getElementById('import').disabled = !pending.length;
    if (!pending.length) { msg.textContent = "Couldn't find any student codes in that. Check the columns."; document.getElementById('paste-preview').innerHTML = ''; return; }
    msg.textContent = `${pending.length} students found: ${fresh} new, ${pending.length - fresh} already on H3.` + (parsed.skipped.length ? ` ${parsed.skipped.length} line(s) skipped (no code).` : '');
    document.getElementById('paste-preview').innerHTML = `<div class="tbl-wrap"><table><thead><tr><th>Code</th><th>First name</th><th>Surname</th><th>Class</th><th></th></tr></thead><tbody>${
      pending.slice(0, 400).map(r => `<tr><td class="mono">${esc(r.code)}</td><td>${esc(r.first_name)}</td><td>${esc(r.last_name)}</td><td>${esc(r.class)}</td><td class="key-meta">${existing[r.code] ? 'update' : 'new'}</td></tr>`).join('')
    }</tbody></table></div>`;
  }
  async function runImport() {
    if (!pending.length) return;
    const msg = document.getElementById('paste-msg');
    document.getElementById('import').disabled = true;
    msg.textContent = 'Adding...';
    try {
      const res = await db.rpc('h3_add_students', { p_key: state.staffKey, p_rows: pending });
      if (res.error) throw res.error;
      const n = res.data || 0;
      pending = [];
      state.pasteNote = `${n} student${n === 1 ? '' : 's'} added or updated.`;
      await loadOverview();
    } catch (e) {
      document.getElementById('import').disabled = false;
      msg.textContent = niceError(e);
    }
  }

  function viewTeacher() {
    if (!state.staff) { viewStaffGate(); return; }
    startOverviewTimer();
    const sel = state.teacherSet && setById[state.teacherSet] ? state.teacherSet : (SETS[0] && SETS[0].id);
    state.teacherSet = sel;
    const set = setById[sel];
    const all = state.overview || [];
    const classes = [...new Set(all.map(r => r.class).filter(Boolean))].sort();
    if (state.teacherClass && classes.indexOf(state.teacherClass) === -1) state.teacherClass = '';
    const rows = all
      .filter(r => !state.teacherClass || r.class === state.teacherClass)
      .map(r => {
        const sum = Notes.summary(SETS, r.sets || {});
        const done = sum.chapters.reduce((a, c) => a + c.done, 0);
        return Object.assign({}, r, { earned: sum.earned, done, owed: Math.max(0, sum.earned - (r.notes_issued || 0)) });
      })
      .filter(r => !state.owedOnly || r.owed > 0);
    const totalOwed = rows.reduce((a, r) => a + r.owed, 0);

    const cellFor = (r, s) => {
      const sc = setScore(s, (r.sets || {})[s.id]);
      if (!sc.tried) return `<td class="cell"><button class="none" data-stu="${esc(r.code)}" data-set="${esc(s.id)}">-</button></td>`;
      const cls = sc.correct === sc.total ? 'full' : 'part';
      return `<td class="cell"><button class="${cls}" data-stu="${esc(r.code)}" data-set="${esc(s.id)}">${sc.correct}/${sc.total}</button></td>`;
    };

    let detail = '';
    if (state.teacherDetail) {
      const { stu, setId } = state.teacherDetail;
      const r = all.find(x => x.code === stu);
      const s = setById[setId];
      if (r && s) {
        const res = (r.sets || {})[s.id] || {};
        detail = `<div class="panel" id="detail">
          <div class="toolbar" style="justify-content:space-between"><h2>${esc(fullName(r))} · ${esc(s.title)}</h2><button class="btn ghost" id="close-detail" type="button">Close</button></div>
          <div class="tbl-wrap"><table>
            <thead><tr><th>Q</th><th>Last answer</th><th>Mark</th><th>Attempts</th></tr></thead>
            <tbody>${s.questions.map((q, i) => { const a = res[q.id]; return `<tr>
              <td>${esc(q.label || i + 1)}</td>
              <td class="mono">${a ? esc(q.type === 'choice' ? 'ABCDEFGH'[a.v] + '. ' + (q.options || [])[a.v] : a.v) : '<span class="key-meta">not attempted</span>'}</td>
              <td>${a ? (a.ok ? '<span class="detail-ok">Correct</span>' : '<span class="detail-bad">Incorrect</span>') : ''}</td>
              <td>${a ? a.n : ''}</td></tr>`; }).join('')}</tbody>
          </table></div></div>`;
      }
    }

    const loading = state.overview === null;
    app.innerHTML = `
      <div class="toolbar" style="justify-content:space-between">
        <div>
          <h2 style="font-size:30px;font-weight:800">Teacher view</h2>
          <p class="lede">Refreshes every 20 seconds. Select a score to see each answer.</p>
        </div>
        <div class="toolbar">
          <label for="t-class" class="key-meta">Class</label>
          <select id="t-class"><option value="">All classes</option>${classes.map(c => `<option ${c === state.teacherClass ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select>
          <button class="btn ghost" id="t-refresh" type="button">Refresh</button>
        </div>
      </div>
      ${state.overviewError ? `<p class="signin-msg is-error">${esc(state.overviewError)}</p>` : ''}
      ${loading ? `<div class="panel"><p class="empty">Loading class results...</p></div>` : `
      <div class="panel">
        <div class="toolbar" style="justify-content:space-between">
          <div><h2>Green notes</h2>
          <div class="key-meta">${totalOwed} to hand out${state.teacherClass ? ' in ' + esc(state.teacherClass) : ''}. Earned: every 3 sub-chapters done, plus 1 per finished chapter.</div></div>
          <label class="key-meta"><input type="checkbox" id="owed-only" ${state.owedOnly ? 'checked' : ''}> Only students owed notes</label>
        </div>
        ${rows.length ? `<div class="tbl-wrap"><table class="notes-tbl">
          <thead><tr><th>Student</th><th>Class</th><th>Sub-chapters done</th><th>Earned</th><th>Issued</th><th>Owed</th><th></th></tr></thead>
          <tbody>${rows.map(r => `<tr class="${r.owed ? 'is-owed' : ''}">
            <td>${esc(fullName(r))} <span class="key-meta mono">${esc(r.code)}</span></td>
            <td>${esc(r.class)}</td>
            <td>${r.done} of ${SETS.length}</td>
            <td><b>${r.earned}</b></td>
            <td>${r.notes_issued || 0}</td>
            <td>${r.owed ? `<span class="owed">${r.owed}</span>` : '<span class="key-meta">0</span>'}</td>
            <td><div class="row-actions">
              ${r.owed ? `<button class="btn small" data-issue="${esc(r.code)}" data-n="${r.earned}" type="button">Mark ${r.owed} issued</button>` : ''}
              ${(r.notes_issued || 0) > 0 ? `<button class="btn ghost small" data-issue="${esc(r.code)}" data-n="${(r.notes_issued || 0) - 1}" type="button" title="Undo one">-1</button>` : ''}
            </div></td></tr>`).join('')}</tbody>
        </table></div>` : `<p class="empty">${all.length ? 'Nobody matches this filter.' : 'No students on H3 yet. Paste your class list below.'}</p>`}
      </div>
      <div class="panel">
        <h2>Class results</h2>
        <div class="key-meta">${rows.length} ${rows.length === 1 ? 'student' : 'students'}</div>
        ${rows.length ? `<div class="tbl-wrap"><table>
          <thead><tr><th>Student</th>${SETS.map(s => { const code = splitTitle(s.title).code; return `<th title="${esc(s.title)}">${esc(code || (s.title.length > 22 ? s.title.slice(0, 21) + '...' : s.title))}</th>`; }).join('')}</tr></thead>
          <tbody>${rows.map(r => `<tr><td>${esc(fullName(r))}</td>${SETS.map(s => cellFor(r, s)).join('')}</tr>`).join('')}</tbody>
        </table></div>` : ''}
      </div>`}
      ${detail}
      <div class="panel">
        <h2>Roster</h2>
        <p class="key-meta">Paste a class list from Excel: Code, First name, Surname, Class (a header row is fine). Pasting again updates names and classes and never touches green notes.</p>
        <textarea id="paste" rows="5" placeholder="ABC0012&#9;Sam&#9;Smith&#9;7MA1"></textarea>
        <div class="toolbar" style="margin-top:8px">
          <label for="paste-class" class="key-meta">Class for rows without one</label>
          <input type="text" id="paste-class" class="small-input" placeholder="e.g. 7MA1" maxlength="20">
          <button class="btn" id="import" type="button" disabled>Add to H3</button>
          <span class="key-meta" id="paste-msg" role="status">${esc(state.pasteNote || '')}</span>
        </div>
        <div id="paste-preview"></div>
        ${all.length ? `<details class="how" style="margin-top:14px"><summary>Everyone on H3 (${all.length})</summary>
          <div class="tbl-wrap"><table><thead><tr><th>Code</th><th>Name</th><th>Class</th><th></th></tr></thead><tbody>
          ${all.map(r => `<tr><td class="mono">${esc(r.code)}</td><td>${esc(fullName(r))}</td><td>${esc(r.class)}</td><td><button class="btn ghost small" data-remove="${esc(r.code)}" type="button">Remove</button></td></tr>`).join('')}
          </tbody></table></div></details>` : ''}
      </div>
      <div class="panel">
        <div class="toolbar" style="justify-content:space-between">
          <h2>Question bank</h2>
          <div class="toolbar">
            <label for="key-set" class="key-meta">Set</label>
            <select id="key-set">${SETS.map(s => `<option value="${esc(s.id)}" ${s.id === sel ? 'selected' : ''}>${esc(s.title)}</option>`).join('')}</select>
            <button class="btn ghost" id="toggle-key" type="button">${state.showKey ? 'Hide answers' : 'Show answers'}</button>
          </div>
        </div>
        <div class="key-meta">${SETS.length} ${SETS.length === 1 ? 'set' : 'sets'}, ${SETS.reduce((a, s) => a + s.questions.length, 0)} questions in total</div>
        <div style="margin-top:10px">
          ${set ? set.questions.map((q, i) => `${q.stem && (i === 0 || set.questions[i - 1].stem !== q.stem) ? `<p class="key-meta" style="margin:14px 0 0;font-weight:700;color:var(--ink)">${mt(q.stem)}</p>` : ''}<div class="key-q"><div class="qnum">${esc(q.label || i + 1)}</div><div>
            <div class="prompt" style="margin:0">${mt(q.prompt)}</div>
            ${q.type === 'choice' ? `<div class="key-meta">${(q.options || []).map((o, j) => `${'ABCDEFGH'[j]}. ${esc(o)}`).join(' &nbsp; ')}</div>` : ''}
            ${state.showKey ? `<div class="key-ans">${esc(keyText(q))}</div>` : ''}
            <div class="key-meta">${esc(keyMeta(q))}</div>
          </div></div>`).join('') : ''}
        </div>
      </div>
      <p class="hint"><button class="linkish" id="staff-out" type="button">Forget the staff key on this device</button></p>`;
    state.pasteNote = '';

    const on = (id, ev, fn) => { const n = document.getElementById(id); if (n) n.addEventListener(ev, fn); };
    app.querySelectorAll('td.cell button').forEach(b => b.addEventListener('click', () => {
      state.teacherDetail = { stu: b.dataset.stu, setId: b.dataset.set };
      viewTeacher();
      const d = document.getElementById('detail'); if (d) d.scrollIntoView({ block: 'nearest' });
    }));
    app.querySelectorAll('[data-issue]').forEach(b => b.addEventListener('click', () => setIssued(b.dataset.issue, +b.dataset.n)));
    app.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => removeStudent(b.dataset.remove)));
    on('close-detail', 'click', () => { state.teacherDetail = null; viewTeacher(); });
    on('key-set', 'change', (e) => { state.teacherSet = e.target.value; viewTeacher(); });
    on('toggle-key', 'click', () => { state.showKey = !state.showKey; viewTeacher(); });
    on('t-class', 'change', (e) => { state.teacherClass = e.target.value; viewTeacher(); });
    on('owed-only', 'change', (e) => { state.owedOnly = e.target.checked; viewTeacher(); });
    on('t-refresh', 'click', () => loadOverview());
    on('paste', 'input', previewImport);
    on('paste-class', 'input', previewImport);
    on('import', 'click', runImport);
    on('staff-out', 'click', () => {
      state.staff = false; state.staffKey = ''; store(LS_STAFF, null); renderWho();
      location.hash = '#home';
    });
    typeset(app);
  }

  // ---------- routing ----------
  function route() {
    const h = location.hash.replace(/^#/, '');
    const view = h === 'teacher' ? 'teacher' : 'home';
    document.querySelectorAll('nav a').forEach(a => a.setAttribute('aria-current', a.dataset.view === view ? 'page' : 'false'));
    if (h === 'teacher') viewTeacher();
    else if (!state.me) viewSignin(db ? '' : "H3 can't reach its database right now. Check your connection and reload.", !db);
    else if (h.startsWith('set-')) viewSet(h.slice(4));
    else if (h.startsWith('chapter-')) viewChapter(h.slice(8));
    else viewHome();
    window.scrollTo(0, 0);
  }

  // ---------- start ----------
  function connect() {
    const url = window.SUPABASE_URL, key = window.SUPABASE_ANON_KEY;
    if (!window.supabase || !url || !key || /YOUR_|PASTE/i.test(url)) return null;
    return window.supabase.createClient(url, key, {
      // H3 keeps its own tiny session (the student row). Stop the client from
      // creating or reading a Supabase auth session in this browser.
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });
  }

  db = connect();
  document.getElementById('signout').addEventListener('click', signOut);

  // Light/dark switch. theme.js (window.ITTheme) saves the choice under the
  // same key as the IT site, so picking it here carries over there too.
  const themeBtn = document.getElementById('theme-btn');
  function labelThemeBtn() {
    const dark = document.documentElement.dataset.theme === 'dark';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  themeBtn.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    if (window.ITTheme) window.ITTheme.setMode(dark ? 'light' : 'dark');
    else {
      if (dark) delete document.documentElement.dataset.theme;
      else document.documentElement.dataset.theme = 'dark';
      store('itbasics-theme', dark ? 'light' : 'dark');
    }
    labelThemeBtn();
  });
  window.addEventListener('itbasics:theme', labelThemeBtn);
  labelThemeBtn();
  window.addEventListener('hashchange', route);
  document.addEventListener('mathjax-ready', () => { mathReady = true; typeset(app); });

  // Pick up where we left off: the saved student shows straight away from
  // this device's copy, then refreshes from the server in the background.
  const saved = load(LS_SESSION, true);
  if (saved && saved.code) {
    state.me = saved;
    loadLocal();
    state.mode = db ? 'cloud' : 'local';
    setChip(db ? 'Connecting...' : 'Saved on this device only', db ? '' : 'warn');
  }
  state.staffKey = load(LS_STAFF, false);
  renderWho();
  route();

  if (db && state.me) {
    db.rpc('h3_signin', { p_code: state.me.code }).then(res => {
      const row = res && !res.error && (Array.isArray(res.data) ? res.data[0] : res.data);
      if (res && !res.error && !row) { signOut(); return; }   // taken off the roster
      if (!row) { setChip('Saved on this device only', 'warn'); state.mode = 'local'; return; }
      state.me = { code: row.code, first_name: row.first_name, last_name: row.last_name, class: row.class };
      store(LS_SESSION, state.me);
      state.results = merge(row.sets || {}, state.results);
      saveLocal();
      setChip('Saved for your teacher', 'ok');
      renderWho();
      saveCloud();
      if (!/^#(set-|teacher)/.test(location.hash)) route();
    }).catch(() => { setChip('Saved on this device only', 'warn'); state.mode = 'local'; });
  }
  if (state.staffKey) {
    keyWorks(state.staffKey).then(ok => {
      state.staff = ok;
      if (!ok) { state.staffKey = ''; store(LS_STAFF, null); }
      renderWho();
      if (ok) loadOverview(); else if (location.hash === '#teacher') viewTeacher();
    });
  }
})();
