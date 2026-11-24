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
  // Year 7 (bank.js) loads with the page. Other years load only when they are
  // first needed (loadYear), and push their sets into the same array, so SETS
  // always holds every loaded set; setById is rebuilt after each load.
  const BANK = window.H3_BANK = window.H3_BANK || { sets: [] };
  const SETS = BANK.sets = BANK.sets || [];
  let setById = {};
  const reindex = () => { setById = Object.fromEntries(SETS.map(s => [s.id, s])); };
  reindex();
  const Notes = window.H3Notes;

  // Years H3 offers, and the files each later year needs. Adding a chapter's
  // help panels for a year is one more entry in its list.
  const YEAR_FILES = {
    7: [],
    // 8: ['/h3/bank-y8.js', '/h3/helps-y8-ch1.js', '/h3/helps-y8-ch3.js', '/h3/helps-y8-ch5.js', '/h3/helps-y8-ch6.js', '/h3/helps-y8-ch7.js', '/h3/helps-y8-ch8.js', '/h3/helps-y8-ch9.js', '/h3/helps-y8-ch10.js', '/h3/helps-y8-ch4.js'],   // switched on once the first Year 8 chapter is in bank-y8.js
  };
  const YEARS = Object.keys(YEAR_FILES).map(Number);
  const yearLoaded = { 7: true }, yearLoading = {};
  function loadYear(y) {
    if (yearLoaded[y] || !YEAR_FILES[y]) return Promise.resolve();
    if (!yearLoading[y]) {
      yearLoading[y] = YEAR_FILES[y].reduce((p, src) => p.then(() => new Promise(done => {
        const s = document.createElement('script');
        s.src = src; s.onload = done; s.onerror = done;   // a missing file just means no sets yet
        document.head.appendChild(s);
      })), Promise.resolve()).then(() => { yearLoaded[y] = true; reindex(); });
    }
    return yearLoading[y];
  }
  const loadAllYears = () => Promise.all(YEARS.map(loadYear));
  const yearOfSetId = (id) => { const m = /^y(\d+)-/.exec(id || ''); return m ? Number(m[1]) : 7; };

  // The year a student is looking at: their last pick on this device, or the
  // year their roster class starts with ("8A" -> 8), or Year 7.
  const LS_YEAR = 'h3-year';
  // A student's assigned year level is the number their roster class starts with
  // ("8B" -> 8). No number (or a year H3 does not have) means no assigned level.
  function assignedYear() {
    const m = /^\s*(\d{1,2})/.exec((state.me && state.me.class) || '');
    return m && YEARS.includes(Number(m[1])) ? Number(m[1]) : null;
  }
  // The pick is remembered per student, so a shared computer does not carry one
  // student's choice over to the next.
  const yearKey = () => LS_YEAR + ':' + ((state.me && state.me.code) || '');
  function chosenYear() {
    let y = null;
    try { y = Number(localStorage.getItem(yearKey())); } catch (e) { /* private mode */ }
    if (!YEARS.includes(y)) y = assignedYear() || 7;
    return y;
  }
  function pickYear(y) { try { localStorage.setItem(yearKey(), String(y)); } catch (e) { /* private mode */ } }

  // Going outside your own year level asks first.
  function confirmOtherYear(current) {
    const own = assignedYear();
    const others = YEARS.filter(y => y !== current);
    const dlg = document.createElement('dialog');
    dlg.className = 'yr-modal';
    dlg.setAttribute('aria-labelledby', 'yr-modal-title');
    dlg.innerHTML = `
      <h2 id="yr-modal-title">Are you sure you want to access questions outside of your grade level?</h2>
      <p>You are in <b>Year ${esc(own)}</b>. Questions from another year level may be harder or cover things your class has not done yet. Your Year ${esc(own)} work stays saved either way.</p>
      <div class="yr-modal-actions">
        ${others.map(y => `<button class="btn" type="button" data-go="${y}">Yes, show Year ${y}</button>`).join('')}
        <button class="btn ghost" type="button" data-stay>Stay in Year ${esc(current)}</button>
      </div>`;
    document.body.appendChild(dlg);
    const close = () => { dlg.close(); dlg.remove(); };
    dlg.addEventListener('click', (e) => {
      const go = e.target.closest('[data-go]');
      if (go) { close(); pickYear(Number(go.dataset.go)); viewHome(); return; }
      if (e.target.closest('[data-stay]') || e.target === dlg) close();
    });
    dlg.addEventListener('cancel', () => dlg.remove());
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    const first = dlg.querySelector('[data-stay]'); if (first) first.focus();
  }

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

  // The chip only appears when something is wrong (work not reaching the
  // teacher). "Saving" and "Saved" stay silent: saving is the normal case.
  function setChip(text, cls) {
    chip.textContent = text; chip.className = 'chip' + (cls ? ' ' + cls : '');
    chip.hidden = !(state.me && cls === 'warn');
  }

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

  // Year level a chapter is pitched at: its own sets can say, else the bank.
  function yearOf(ch) {
    const s = ch.sets.find(x => x.year);
    return s ? s.year : (BANK.year || '');
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
    powers: 'Use ^ for powers, e.g. 2^3 x 5',
    ratio: 'Use a colon, e.g. 3:4',
    inequality: 'e.g. x > 3 or x <= -2',
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
    'not index form': 'Write it as a product using powers, e.g. 2^3 x 5.',
    'use powers': 'Write repeated factors as a power, e.g. 2^3 instead of 2 x 2 x 2.',
    'use mixed': 'Write it as a mixed numeral, e.g. 3 1/2 (a space between the whole number and the fraction).',
    'not proper': 'In a mixed numeral, the fraction part must be less than 1, e.g. 3 1/2 not 2 3/2.',
    'use improper': 'Write it as an improper fraction, e.g. 7/2.',
    'use fraction': 'Write it as a fraction, e.g. 3/4.',
    'use decimal': 'Write it as a decimal, e.g. 0.75.',
    'use percent': 'Write it as a percentage, with the % sign, e.g. 75%.',
    'use ratio': 'Write it as a ratio with a colon, e.g. 3:4.',
    'write the equation': 'Write the equation from the question (with the letter in it), not its solution.',
    'not fully factorised': 'Take out every common factor, so nothing in the bracket shares a factor, e.g. 4(x + 2) not 2(2x + 4).',
    'use inequality': 'Write it as an inequality with a symbol, e.g. x > 3 or x <= -2.',
    'ratio not simplest': 'Simplify the ratio: whole numbers with no common factor, e.g. 3:4.',
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
          <img class="h3-mark big on-light" src="/h3/h3-mark-light.svg" alt="" width="72" height="72"><img class="h3-mark big on-dark" src="/h3/h3-mark.svg" alt="" width="72" height="72">
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
      chip.hidden = !chip.classList.contains('warn');
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
    const year = chosenYear();
    if (!yearLoaded[year]) {
      app.innerHTML = `<div class="narrow"><p class="lede">Loading Year ${esc(year)}...</p></div>`;
      loadYear(year).then(() => { if (!/^#?(set-|chapter-|teacher)/.test(location.hash.replace(/^#/, ''))) viewHome(); });
      return;
    }
    // The green note total counts every year with saved work, so load those too.
    const workYears = [...new Set(Object.keys(state.results || {}).map(yearOfSetId))].filter(y => YEARS.includes(y) && !yearLoaded[y]);
    if (workYears.length) Promise.all(workYears.map(loadYear)).then(() => { const h = location.hash.replace(/^#/, ''); if (!h || h === 'home') viewHome(); });
    const sum = Notes.summary(SETS, state.results);
    const started = SETS.some(s => setScore(s, state.results[s.id]).tried);
    const yearChapters = sum.chapters.filter(ch => ch.year === year);
    // Students with an assigned year see only that year, with an "other year levels"
    // link that asks first. Students without one (class has no year number) get tabs.
    const own = assignedYear();
    let tabs = '', outside = '';
    if (YEARS.length > 1 && own == null) {
      tabs = `<div class="year-tabs" role="group" aria-label="Year level">${YEARS.map(y =>
        `<button type="button" class="year-tab${y === year ? ' on' : ''}" data-year="${y}" aria-pressed="${y === year}">Year ${y}</button>`).join('')}</div>`;
    } else if (YEARS.length > 1 && year === own) {
      tabs = `<button type="button" class="other-years" id="other-years">Other year levels <span aria-hidden="true">›</span></button>`;
    } else if (YEARS.length > 1) {
      outside = `<div class="yr-outside" role="status"><span>You are looking at <b>Year ${esc(year)}</b>, outside your year level.</span>
        <button type="button" class="btn small" data-year="${own}" id="back-own">Back to Year ${esc(own)}</button></div>`;
    }
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
      ${outside}
      <div class="list-head-row"><h3 class="list-head">Year ${esc(year)} chapters</h3>${tabs}</div>
      ${yearChapters.length ? '' : `<p class="lede">Year ${esc(year)} chapters are on their way. Check back soon.</p>`}
      <div class="sets chapters">
        ${yearChapters.map(ch => {
          const pct = chapterPct(ch);
          const max = Math.floor(ch.total / Notes.PER_NOTE) + 1;
          return `<a class="set-card chapter-card ${ch.full ? 'is-full' : ''}" href="#chapter-${esc(ch.id)}">
            <div class="chapter-top"><span class="chapter-id"><span class="chapter-num">${esc(ch.num)}</span><span class="chapter-pct" title="${pct}% of this chapter's questions correct">${pct}%</span></span>
              <span class="gn-row" title="${ch.earned} of ${max} green notes">${Array.from({ length: max }, (_, i) => `<span class="gn-dot ${i < ch.earned ? 'on' : ''}">${noteIcon}</span>`).join('')}</span></div>
            ${yearOf(ch) ? `<p class="chapter-year">Year ${esc(yearOf(ch))}</p>` : ''}
            <h3>${esc(ch.name.replace(/^Chapter\s+\d+:\s*/i, ''))}</h3>
            <div class="meter" aria-hidden="true"><span style="width:${pct}%"></span></div>
            <div class="meter-row"><span>${ch.done} of ${ch.total} sub-chapters done</span><span>${esc(notesLine(ch.earned))}</span></div>
            <p class="next">${esc(toNextText(ch))}</p>
          </a>`;
        }).join('')}
      </div>`;
    app.querySelectorAll('.year-tab, #back-own').forEach(b => b.addEventListener('click', () => {
      pickYear(Number(b.dataset.year)); viewHome();
    }));
    const other = document.getElementById('other-years');
    if (other) other.addEventListener('click', () => confirmOtherYear(year));
    typeset(app);
  }

  function viewChapter(id) {
    const sum = Notes.summary(SETS, state.results);
    const ch = sum.chapters.find(c => c.id === id);
    if (!ch) { location.hash = '#home'; return; }
    app.innerHTML = `
      <a class="back" href="#home">${backArrow}All Year ${esc(ch.year)} chapters</a>
      <div class="set-head">
        <div>
          <div class="key-meta" style="text-transform:uppercase;letter-spacing:.08em;font-weight:700">Year ${esc(ch.year)} · Chapter ${esc(ch.num)}</div>
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
    // A plain currency sign goes in front ($ 12.50); a rate like $/L goes after.
    const front = q.units && /^[$£€]$/.test(q.units.trim());
    const pre = front ? `<span class="units">${esc(q.units)}</span>` : '';
    const post = q.units && !front ? `<span class="units">${esc(q.units)}</span>` : '';
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
  // The number to show ("Chapter 3"); the id can be "y8-3".
  function chapterNumOf(set) {
    const ch = Notes.chapters(SETS).find(c => c.sets.indexOf(set) !== -1);
    return ch ? ch.num : '';
  }

  // Pictures for a question (figures.js draws them from a spec in bank.js).
  const figureHtml = (f) => (f && window.H3Figure) ? `<div class="qfig">${[].concat(f).map(window.H3Figure).join('')}</div>` : '';

  // "How do I work this out?" fold-out. The panels live in helps.js, one per
  // type of question; a question picks one with "help" in bank.js. Shown until
  // the question is answered right, the same as a hint.
  const helpHtml = (q) => {
    const body = q.help && window.H3_HELPS && window.H3_HELPS[q.help];
    if (!body) return '';
    return `<details class="qhelp">
      <summary><span class="qhelp-mark" aria-hidden="true">?</span>How do I work this out?<svg class="qhelp-chev" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></summary>
      <div class="qhelp-body">${body}</div>
    </details>`;
  };

  // Questions in a row that share a help panel form a run. The panel sits on the
  // first question of the run that is not answered right yet. Returns that
  // question's index for the run containing question i, or null when the whole
  // run is done (or the question has no panel).
  function helpHolder(set, res, i) {
    const qs = set.questions, h = qs[i] && qs[i].help;
    if (!h || !window.H3_HELPS || !window.H3_HELPS[h]) return null;
    let a = i; while (a > 0 && qs[a - 1].help === h) a--;
    for (let k = a; k < qs.length && qs[k].help === h; k++) {
      const r = res[qs[k].id];
      if (!(r && r.ok)) return k;
    }
    return null;
  }

  function viewSet(id) {
    const set = setById[id];
    if (!set) { location.hash = '#home'; return; }
    const res = state.results[set.id] || {};
    const sc = setScore(set, res);
    const chId = chapterIdOf(set);
    // One help panel per run of questions that share it, on the first question
    // of the run that is not done yet (see helpHolder). Copies on every question
    // were a wall of green.
    const holders = new Set(set.questions.map((q, i) => helpHolder(set, res, i)).filter(i => i != null));
    app.innerHTML = `
      <div class="narrow">
        <a class="back" href="#chapter-${esc(chId)}">${backArrow}${(set.year || 7) !== 7 ? `Year ${esc(set.year)} · ` : ''}Chapter ${esc(chapterNumOf(set))}</a>
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
            if (q.stem && (!prev || prev.stem !== q.stem || qn(prev) !== qn(q))) lead += `<li class="stem"><span class="stem-num">${esc(qn(q))}</span><div class="stem-body"><p>${mt(q.stem)}</p>${figureHtml(q.stemFigure)}</div></li>`;
            return lead + `<li class="q ${cls}" id="card-${esc(q.id)}" data-qid="${esc(q.id)}">
              <div class="qnum">${esc(q.label || (i + 1))}</div>
              <div class="qbody">
                ${figureHtml(q.figure)}
                <p class="prompt">${mt(q.prompt)}</p>
                <form class="answer-row" data-qid="${esc(q.id)}">
                  ${inputFor(q, saved)}
                  <button class="btn" type="submit" ${saved && saved.ok ? 'disabled' : ''}>${saved && saved.ok ? 'Done' : 'Check'}</button>
                </form>
                ${q.hint && !(saved && saved.ok) ? `<p class="hint">${esc(q.hint)}</p>` : ''}
                ${holders.has(i) ? helpHtml(q) : ''}
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
      // The run's help panel moves on to the next question in the run that is
      // still to do, keeping its open or closed state. Once the run is done it goes.
      const hp = card.querySelector('.qhelp');
      if (hp) {
        const idx = set.questions.findIndex(x => x.id === qid);
        const to = helpHolder(set, res, idx);
        const toCard = to != null && document.getElementById('card-' + set.questions[to].id);
        if (toCard) toCard.querySelector('.qbody').insertBefore(hp, toCard.querySelector('.feedback'));
        else hp.remove();
      }
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
      if (ch) celebratePopup(set, ch, gained);
    }
  }

  // ---------- sub-chapter finished: popup, confetti, progress ring ----------
  // The ring is the road to the next green note: three sub-chapters make a
  // note, so each one fills a third of it. It animates from where it was
  // before this set to where it is now, and fills up completely when a note
  // is earned (every third set, or the bonus for finishing the chapter).
  const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function celebratePopup(set, ch, gained) {
    const per = Notes.PER_NOTE;
    const prevDone = Math.max(0, ch.done - 1);
    const from = (prevDone % per) / per;
    const full = gained > 0;
    const to = full ? 1 : (ch.done % per) / per;
    const R = 54, C = 2 * Math.PI * R;
    const ticks = Array.from({ length: per }, (_, i) => {
      const a = (i * 2 * Math.PI) / per;
      const p = (r) => `${(70 + r * Math.cos(a)).toFixed(2)} ${(70 + r * Math.sin(a)).toFixed(2)}`;
      return `<path class="ring-tick" d="M${p(44)}L${p(64)}" stroke-width="4"/>`;
    }).join('');
    const code = splitTitle(set.title).code || set.title;
    const left = ch.toNext;
    const headline = full
      ? `You earned ${gained === 1 ? 'a green note' : gained + ' green notes'}!`
      : `${code} done!`;
    const line = full
      ? (ch.full ? `${esc(code)} done, and that finishes the whole chapter, bonus note included. Your teacher can see it.` : `${esc(code)} done. Your teacher can see it.`)
      : `${left} more sub-chapter${left === 1 ? '' : 's'} for your next green note.`;
    const mid = full
      ? `<span class="ring-note">${noteIcon}</span><b class="ring-plus">+${gained}</b>`
      : `<b>${ch.done % per}/${per}</b><small>next note</small>`;

    const dlg = document.createElement('dialog');
    dlg.className = 'cele' + (full ? ' is-full' : '');
    dlg.setAttribute('aria-labelledby', 'cele-h');
    dlg.innerHTML = `
      <canvas aria-hidden="true"></canvas>
      <div class="cele-card">
        <div class="cele-ring" role="img" aria-label="${full ? 'Green note earned' : `${ch.done % per} of ${per} sub-chapters towards your next green note`}">
          <svg viewBox="0 0 140 140" aria-hidden="true">
            <circle class="ring-track" cx="70" cy="70" r="${R}" fill="none" stroke-width="14"/>
            <circle class="ring-fill" cx="70" cy="70" r="${R}" fill="none" stroke-width="14" stroke-linecap="butt"
              stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="${(C * (1 - from)).toFixed(2)}"/>
            ${ticks}
          </svg>
          <div class="ring-mid">${mid}</div>
        </div>
        <h2 id="cele-h">${esc(headline)}</h2>
        <p>${line}</p>
        <div class="cele-actions">
          <a class="btn" href="#chapter-${esc(chapterIdOf(set))}" data-close>Back to the chapter</a>
          <button class="btn ghost" type="button" data-close>Stay here</button>
        </div>
      </div>`;
    document.body.appendChild(dlg);
    const close = () => { if (dlg.open) dlg.close(); };
    dlg.addEventListener('close', () => dlg.remove());
    dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('[data-close]')) close(); });
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    dlg.querySelector('.btn').focus();

    const fill = dlg.querySelector('.ring-fill');
    const target = (C * (1 - to)).toFixed(2);
    if (reduceMotion()) { fill.style.transition = 'none'; fill.setAttribute('stroke-dashoffset', target); return; }
    requestAnimationFrame(() => requestAnimationFrame(() => fill.setAttribute('stroke-dashoffset', target)));
    confetti(dlg.querySelector('canvas'), full ? 220 : 140);
  }

  // A short burst of green confetti (and a little Hallam red) from the popup.
  function confetti(canvas, count) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    const colours = ['#3ff58a', '#1f9d55', '#0c9447', '#4cc985', '#d8ffe7', '#ffffff', '#c31030'];
    const weights = [4, 3, 3, 3, 2, 2, 1];
    const pick = () => { let r = Math.random() * 18; for (let i = 0; i < weights.length; i++) { r -= weights[i]; if (r < 0) return colours[i]; } return colours[0]; };
    const bits = Array.from({ length: count }, () => {
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
      const speed = 7 + Math.random() * 9;
      return {
        x: W / 2 + (Math.random() - 0.5) * 80, y: H * 0.42,
        vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed,
        w: 6 + Math.random() * 6, h: 4 + Math.random() * 5,
        rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.35,
        c: pick(), round: Math.random() < 0.25
      };
    });
    const start = performance.now();
    function frame(now) {
      const t = now - start;
      ctx.clearRect(0, 0, W, H);
      const fade = t > 2400 ? Math.max(0, 1 - (t - 2400) / 600) : 1;
      bits.forEach(b => {
        b.vy += 0.28; b.vx *= 0.99; b.vy *= 0.99;
        b.x += b.vx; b.y += b.vy; b.rot += b.vr;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(b.x, b.y); ctx.rotate(b.rot);
        ctx.fillStyle = b.c;
        if (b.round) { ctx.beginPath(); ctx.arc(0, 0, b.h / 2 + 1, 0, Math.PI * 2); ctx.fill(); }
        else ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h * Math.abs(Math.cos(b.rot * 2)) + 1);
        ctx.restore();
      });
      if (t < 3000 && canvas.isConnected) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, W, H);
    }
    requestAnimationFrame(frame);
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
    if (!YEARS.includes(state.teacherYear)) state.teacherYear = 7;
    const yearSets = SETS.filter(s => (s.year || 7) === state.teacherYear);
    const sel = state.teacherSet && setById[state.teacherSet] && (setById[state.teacherSet].year || 7) === state.teacherYear
      ? state.teacherSet : (yearSets[0] && yearSets[0].id);
    state.teacherSet = sel;
    const set = setById[sel];
    const all = state.overview || [];
    const classes = [...new Set(all.map(r => r.class).filter(Boolean))].sort();
    if (state.teacherClass && classes.indexOf(state.teacherClass) === -1) state.teacherClass = '';
    const rows = all
      .filter(r => !state.teacherClass || r.class === state.teacherClass)
      .map(r => {
        const sum = Notes.summary(SETS, r.sets || {});
        const done = sum.chapters.filter(c => c.year === state.teacherYear).reduce((a, c) => a + c.done, 0);
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
          ${YEARS.length > 1 ? `<label for="t-year" class="key-meta">Year</label>
          <select id="t-year">${YEARS.map(y => `<option value="${y}" ${y === state.teacherYear ? 'selected' : ''}>Year ${y}</option>`).join('')}</select>` : ''}
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
          <div class="key-meta">${totalOwed} to hand out${state.teacherClass ? ' in ' + esc(state.teacherClass) : ''}. Earned (all years): every 3 sub-chapters done, plus 1 per finished chapter.</div></div>
          <label class="key-meta"><input type="checkbox" id="owed-only" ${state.owedOnly ? 'checked' : ''}> Only students owed notes</label>
        </div>
        ${rows.length ? `<div class="tbl-wrap"><table class="notes-tbl">
          <thead><tr><th>Student</th><th>Class</th><th>Year ${esc(state.teacherYear)} sub-chapters done</th><th>Earned</th><th>Issued</th><th>Owed</th><th></th></tr></thead>
          <tbody>${rows.map(r => `<tr class="${r.owed ? 'is-owed' : ''}">
            <td>${esc(fullName(r))} <span class="key-meta mono">${esc(r.code)}</span></td>
            <td>${esc(r.class)}</td>
            <td>${r.done} of ${yearSets.length}</td>
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
          <thead><tr><th>Student</th>${yearSets.map(s => { const code = splitTitle(s.title).code; return `<th title="${esc(s.title)}">${esc(code || (s.title.length > 22 ? s.title.slice(0, 21) + '...' : s.title))}</th>`; }).join('')}</tr></thead>
          <tbody>${rows.map(r => `<tr><td>${esc(fullName(r))}</td>${yearSets.map(s => cellFor(r, s)).join('')}</tr>`).join('')}</tbody>
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
            <select id="key-set">${Notes.chapters(yearSets).map(c => `<optgroup label="Chapter ${esc(c.num)}">${c.sets.map(s => `<option value="${esc(s.id)}" ${s.id === sel ? 'selected' : ''}>${esc(s.title)}</option>`).join('')}</optgroup>`).join('')}</select>
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
    on('t-year', 'change', (e) => { state.teacherYear = Number(e.target.value); state.teacherSet = null; state.teacherDetail = null; viewTeacher(); });
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
    // A link into a year that is not loaded yet (#set-y8-2c) loads it first.
    const needYear = h === 'teacher' ? null : yearOfSetId(h.replace(/^(set|chapter)-/, ''));
    if (h === 'teacher' && YEARS.some(y => !yearLoaded[y])) {
      app.innerHTML = `<div class="narrow"><p class="lede">Loading...</p></div>`;
      loadAllYears().then(route); return;
    }
    if (needYear && !yearLoaded[needYear] && /^(set|chapter)-/.test(h)) {
      app.innerHTML = `<div class="narrow"><p class="lede">Loading Year ${esc(needYear)}...</p></div>`;
      loadYear(needYear).then(route); return;
    }
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
