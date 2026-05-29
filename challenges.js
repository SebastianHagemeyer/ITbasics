(function () {
  "use strict";

  const PYODIDE_VERSION = "0.27.7";
  const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v" + PYODIDE_VERSION + "/full/pyodide.js";
  const CODEJAR_URL = "https://cdn.jsdelivr.net/npm/codejar@4.0.0/dist/codejar.min.js";
  const CODE_KEY = "itbasics-challenge-code";
  const QUIZ_NAME = "livecoding";

  // ---- Challenge definitions ------------------------------------------------
  // Each test feeds scripted input() values and (for the guessing game) forces
  // the "random" secret to a known value. check(result, test) -> {pass, why}.
  const CHALLENGES = [
    {
      id: "greeter",
      title: "Greeter",
      brief: "Ask for a name and say hello back.",
      detail: "Read a name with <code>input()</code>, then print a greeting that includes the name they typed.",
      accept: 'Your output must contain a greeting word (hello / hi / hey / welcome) <strong>and</strong> the name that was entered.',
      starter:
        '# Greeter\n' +
        'name = input("What is your name? ")\n' +
        '# Now print a friendly greeting that uses their name\n',
      tests: [
        { label: 'Name: "Alex"', inputs: ["Alex"], check: function (r) { return checkGreeter(r, "Alex"); } },
        { label: 'Name: "Priya"', inputs: ["Priya"], check: function (r) { return checkGreeter(r, "Priya"); } }
      ]
    },
    {
      id: "age",
      title: "Age checker",
      brief: "Ask for an age and say whether they can watch a PG-13 film.",
      detail: "Read an age with <code>input()</code> (remember <code>input()</code> gives text &mdash; convert with <code>int()</code>). PG-13 films are for ages <strong>13 and over</strong>.",
      accept: 'If the age is 13 or more, your message must clearly allow it (e.g. "you can watch"). Under 13, it must clearly refuse (e.g. "you can\'t" / "too young").',
      starter:
        '# Age checker\n' +
        'age = int(input("How old are you? "))\n' +
        '# PG-13 films are for ages 13 and up\n',
      tests: [
        { label: "Age 15 (allowed)", inputs: ["15"], check: function (r) { return checkAge(r, true); } },
        { label: "Age 13 (allowed, boundary)", inputs: ["13"], check: function (r) { return checkAge(r, true); } },
        { label: "Age 12 (refused, boundary)", inputs: ["12"], check: function (r) { return checkAge(r, false); } },
        { label: "Age 7 (refused)", inputs: ["7"], check: function (r) { return checkAge(r, false); } }
      ]
    },
    {
      id: "times",
      title: "Times table",
      brief: "Ask for a number and print its times table up to 12.",
      detail: "Read a number with <code>int(input())</code>, then print its times table from 1 to 12 so every result (n&times;1 up to n&times;12) appears.",
      accept: "Every product from n&times;1 to n&times;12 must appear in your output.",
      starter:
        '# Times table\n' +
        'n = int(input("Which times table? "))\n' +
        '# print n x 1, all the way up to n x 12\n',
      tests: [
        { label: "Table of 3", inputs: ["3"], check: function (r) { return checkTimes(r, 3); } },
        { label: "Table of 7", inputs: ["7"], check: function (r) { return checkTimes(r, 7); } }
      ]
    },
    {
      id: "guess",
      title: "Guessing game",
      brief: "The computer picks a secret number from 1 to 10. The player keeps guessing until they get it right.",
      detail: "The computer hides the number &mdash; the player has to find it." +
        '<ol class="challenge-steps">' +
        "<li>Pick the secret with <code>random.randint(1, 10)</code>.</li>" +
        "<li>Ask for a guess with <code>input()</code>, and convert it to a number with <code>int()</code> so you can compare it.</li>" +
        "<li>Use a loop: <em>while</em> the guess is wrong, tell them and ask again.</li>" +
        "<li>When the guess matches the secret, print a success message like <code>Correct!</code>.</li>" +
        "</ol>",
      accept: "Your program must keep asking for a guess until one matches the secret, then print a success word (correct / well done / got it / you win). A wrong guess should lead to another guess &mdash; not stop the program.",
      starter:
        '# Guessing game\n' +
        'import random\n' +
        '\n' +
        'secret = random.randint(1, 10)   # the computer\'s hidden number - you can\'t see it!\n' +
        '\n' +
        '# 1) Ask for a guess:  guess = int(input("Your guess: "))\n' +
        '# 2) Keep asking while the guess is wrong (use a loop).\n' +
        '# 3) When guess == secret, print a success message like "Correct!".\n',
      tests: [
        { label: "Secret 7 - guesses 3, 1, 7", forceSecret: 7, inputs: ["3", "1", "7"], check: checkGuess },
        { label: "Secret 2 - guesses 5, 2", forceSecret: 2, inputs: ["5", "2"], check: checkGuess },
        { label: "Secret 4 - guessed first try", forceSecret: 4, inputs: ["4"], check: checkGuess }
      ]
    }
  ];

  // ---- Grading checks -------------------------------------------------------
  function norm(s) { return String(s || "").toLowerCase(); }
  function pass(why) { return { pass: true, why: why || "Looks good." }; }
  function fail(why) { return { pass: false, why: why }; }
  function numberTokens(s) {
    const set = new Set();
    (String(s).match(/\d+/g) || []).forEach(function (t) { set.add(parseInt(t, 10)); });
    return set;
  }

  function checkGreeter(r, name) {
    if (r.error) return fail("Your code stopped with an error: " + r.error);
    const out = norm(r.output);
    const hasName = out.indexOf(name.toLowerCase()) !== -1;
    const hasHello = /\b(hello|hi|hey|welcome|greetings|howdy|g'day)\b/.test(out);
    if (hasName && hasHello) return pass("Greeted " + name + ".");
    if (!hasName) return fail('I typed "' + name + '" but it never appeared in your output. Make sure you print the name you read.');
    return fail('I saw the name but no greeting word (try including "Hello").');
  }

  function checkAge(r, shouldAllow) {
    if (r.error) return fail("Your code stopped with an error: " + r.error +
      (/str.*int|int.*str|not supported between/.test(r.error) ? "  (Hint: convert the age with int().)" : ""));
    const out = norm(r.output);
    const denies = /can't|cannot|can ?not|not old enough|too young|not allowed|\bno\b|\bnope\b|aren't|are not|sorry/.test(out);
    const allows = /can watch|you can\b|allowed|old enough|\byes\b|go ahead|enjoy|\bsure\b|permitted/.test(out);
    const verdict = denies ? "deny" : (allows ? "allow" : "unknown");
    if (verdict === "unknown") return fail("I couldn't tell if you allowed or refused. Say it clearly, e.g. \"You can watch it\" or \"You can't watch it\".");
    if (shouldAllow && verdict === "allow") return pass("Correctly allowed.");
    if (!shouldAllow && verdict === "deny") return pass("Correctly refused.");
    return fail(shouldAllow
      ? "This age (13+) should be allowed, but your message refused it."
      : "This age (under 13) should be refused, but your message allowed it.");
  }

  function checkTimes(r, n) {
    if (r.error) return fail("Your code stopped with an error: " + r.error +
      (/str.*int|int.*str|can't multiply|not supported between/.test(r.error) ? "  (Hint: convert the number with int().)" : ""));
    const tokens = numberTokens(r.output);
    const missing = [];
    for (let k = 1; k <= 12; k++) {
      const product = n * k;
      if (!tokens.has(product)) missing.push(n + "x" + k + "=" + product);
    }
    if (!missing.length) return pass("All 12 results for the " + n + " times table are there.");
    return fail("Missing result(s): " + missing.slice(0, 4).join(", ") + (missing.length > 4 ? " ..." : "") + ". Loop from 1 to 12.");
  }

  function checkGuess(r, test) {
    const want = test.inputs.length;
    if (r.error) {
      if (r.error.indexOf("EOFError") !== -1) {
        return fail("Your program kept asking even after the correct guess (or never matched). Make sure a correct guess ends the loop. (Tip: compare to an int, e.g. int(input(...)).)");
      }
      return fail("Your code stopped with an error: " + r.error);
    }
    const out = norm(r.output);
    const success = /correct|well done|got it|you win|you won|nailed|\bright\b|\byes\b|guessed it|congrat/.test(out);
    if (r.used !== want) {
      if (r.used < want) return fail("You stopped after " + r.used + " guess(es) but should have kept asking through all " + want + ". Keep looping until the guess is right.");
      return fail("You read more guesses than expected - check your loop condition.");
    }
    if (!success) return fail("You stopped at the right guess but didn't print a success message (try \"Correct!\").");
    return pass("Looped to the correct guess and celebrated.");
  }

  // ---- Python grading runner (installed once after Pyodide loads) ----------
  // Runs the student's code with scripted input(), captures stdout, guards
  // against endless loops, and (optionally) forces random's secret number.
  const PY_RUNNER = `
import json, io, sys, builtins, random
from contextlib import redirect_stdout

def _run_student(code, inputs_json, force_secret_json):
    inputs = json.loads(inputs_json)
    force_secret = json.loads(force_secret_json)
    it = iter(inputs)
    used = {"n": 0}
    orig_input = builtins.input
    orig_rand = (random.randint, random.randrange, random.choice)

    def _inp(prompt=""):
        if prompt:
            sys.stdout.write(str(prompt))
        try:
            v = next(it)
        except StopIteration:
            raise EOFError("no more input")
        used["n"] += 1
        sys.stdout.write(str(v) + "\\n")
        return str(v)

    builtins.input = _inp
    if force_secret is not None:
        random.randint = lambda a, b: force_secret
        random.randrange = lambda *a, **k: force_secret
        random.choice = lambda seq: force_secret

    ops = {"n": 0}
    LIMIT = 3000000
    def guard(frame, event, arg):
        ops["n"] += 1
        if ops["n"] > LIMIT:
            raise RuntimeError("ran too long (possible endless loop)")
        return guard

    buf = io.StringIO()
    err = None
    g = {"__name__": "__main__"}
    sys.settrace(guard)
    try:
        with redirect_stdout(buf):
            exec(compile(code, "<solution>", "exec"), g)
    except BaseException as e:
        err = type(e).__name__ + ": " + str(e)
    finally:
        sys.settrace(None)
        builtins.input = orig_input
        random.randint, random.randrange, random.choice = orig_rand

    return json.dumps({"output": buf.getvalue(), "used": used["n"], "error": err})
`;

  // ---- Interactive input() (JSPI), shared with the sandbox -----------------
  const PY_INSTALL_INPUT = `
import builtins as _b
def _sandbox_install_input():
    from pyodide.ffi import run_sync
    from _sandbox_io import readLine
    def input(prompt=""):
        return run_sync(readLine(str(prompt)))
    _b.input = input
_sandbox_install_input()
del _sandbox_install_input, _b
`;
  const PY_DISABLE_INPUT = `
import builtins as _b
def _sandbox_install_input():
    def input(*args, **kwargs):
        raise RuntimeError(
            "Interactive input() needs Chrome or Edge here. Use the Check "
            "button (it works everywhere), or open this page in Chrome/Edge."
        )
    _b.input = input
_sandbox_install_input()
del _sandbox_install_input, _b
`;

  // ---- DOM ------------------------------------------------------------------
  const editor      = document.getElementById("challenge-code");
  const output      = document.getElementById("challenge-output");
  const runBtn      = document.getElementById("challenge-run");
  const runLabel    = runBtn ? runBtn.querySelector(".challenge-run-label") : null;
  const checkBtn    = document.getElementById("challenge-check");
  const checkLabel  = checkBtn ? checkBtn.querySelector(".challenge-check-label") : null;
  const resetBtn    = document.querySelector(".challenge-reset");
  const clearBtn    = document.querySelector(".challenge-clear");
  const tabsEl      = document.getElementById("challenge-tabs");
  const briefEl     = document.getElementById("challenge-brief");
  const resultsEl   = document.getElementById("challenge-results");
  const scoreboardEl = document.getElementById("challenge-scoreboard");
  const fileEl      = document.getElementById("challenge-file");

  if (!editor || !runBtn || !checkBtn) return;

  // ---- State ----------------------------------------------------------------
  let pyodide = null;
  let loadingPromise = null;
  let jar = null;
  let busy = false;
  let current = CHALLENGES[0];
  let passed = new Set();
  let codeMap = loadCodeMap();

  function challengeById(id) {
    return CHALLENGES.filter(function (c) { return c.id === id; })[0];
  }
  function loadCodeMap() {
    try { return JSON.parse(localStorage.getItem(CODE_KEY) || "{}") || {}; }
    catch (e) { return {}; }
  }
  function saveCodeMap() {
    try { localStorage.setItem(CODE_KEY, JSON.stringify(codeMap)); } catch (e) {}
  }
  function codeFor(ch) {
    return (codeMap[ch.id] != null && codeMap[ch.id] !== "") ? codeMap[ch.id] : ch.starter;
  }
  function getCode() { return jar ? jar.toString() : editor.textContent; }
  function setCode(code) { if (jar) jar.updateCode(code); else editor.textContent = code; }

  // ---- Editor (CodeJar + Prism, with a plain fallback) ---------------------
  function initEditor() {
    editor.textContent = codeFor(current);
    if (!window.Prism) { initPlainEditor(); return; }
    import(CODEJAR_URL)
      .then(function (mod) {
        if (mod && typeof mod.CodeJar === "function") {
          jar = mod.CodeJar(editor, function (el) { window.Prism.highlightElement(el); }, {
            tab: "    ",
            indentOn: /[(\[{:]\s*$/
          });
          jar.updateCode(codeFor(current));
          jar.onUpdate(function (code) { codeMap[current.id] = code; saveCodeMap(); });
        } else { initPlainEditor(); }
      })
      .catch(initPlainEditor);
  }
  function initPlainEditor() {
    editor.contentEditable = "plaintext-only";
    editor.textContent = codeFor(current);
    editor.addEventListener("input", function () { codeMap[current.id] = editor.textContent; saveCodeMap(); });
  }

  // ---- Output panel (interactive Run) --------------------------------------
  function appendOut(text, kind) {
    const span = document.createElement("span");
    if (kind) span.className = "out-" + kind;
    span.textContent = text + (text.endsWith("\n") ? "" : "\n");
    output.appendChild(span);
    output.scrollTop = output.scrollHeight;
  }
  function clearOut() { output.innerHTML = ""; }

  function readLineInteractive(promptText) {
    return new Promise(function (resolve) {
      const line = document.createElement("span");
      line.className = "out-stdin-line";
      if (promptText) line.appendChild(document.createTextNode(promptText));
      const field = document.createElement("input");
      field.type = "text";
      field.className = "sandbox-stdin";
      field.autocomplete = "off";
      field.autocapitalize = "off";
      field.spellcheck = false;
      field.size = 1;
      line.appendChild(field);
      const cursor = document.createElement("span");
      cursor.className = "sandbox-cursor";
      cursor.setAttribute("aria-hidden", "true");
      line.appendChild(cursor);
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;

      function resize() { field.size = Math.max(1, field.value.length + 1); }
      field.addEventListener("input", resize);
      line.addEventListener("mousedown", function (e) {
        if (e.target !== field) { e.preventDefault(); field.focus(); }
      });
      setRunLabel("Waiting for input…", true);
      field.focus();

      function onKey(e) {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const value = field.value;
        field.removeEventListener("input", resize);
        field.removeEventListener("keydown", onKey);
        const echo = document.createElement("span");
        echo.className = "out-stdin";
        echo.textContent = value;
        line.replaceChild(echo, field);
        line.removeChild(cursor);
        line.appendChild(document.createTextNode("\n"));
        setRunLabel("Running…", true);
        output.scrollTop = output.scrollHeight;
        resolve(value);
      }
      field.addEventListener("keydown", onKey);
    });
  }
  function jspiSupported() {
    return typeof WebAssembly !== "undefined" && typeof WebAssembly.Suspending === "function";
  }

  // ---- Pyodide --------------------------------------------------------------
  function loadPyodideScript() {
    if (window.loadPyodide) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      const s = document.createElement("script");
      s.src = PYODIDE_URL;
      s.onload = resolve;
      s.onerror = function () { reject(new Error("Couldn't reach the Python runtime CDN.")); };
      document.head.appendChild(s);
    });
  }
  async function ensurePyodide(announce) {
    if (pyodide) return pyodide;
    if (loadingPromise) return loadingPromise;
    loadingPromise = (async function () {
      if (announce) { setRunLabel("Loading Python…", true); appendOut("Loading Python runtime (one-time, ~10 MB)…", "info"); }
      setCheckBusy(true, "Loading…");
      await loadPyodideScript();
      pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v" + PYODIDE_VERSION + "/full/"
      });
      pyodide.setStdout({ batched: function (s) { appendOut(s, "stdout"); } });
      pyodide.setStderr({ batched: function (s) { appendOut(s, "stderr"); } });
      pyodide.registerJsModule("_sandbox_io", { readLine: readLineInteractive });
      await pyodide.runPythonAsync(jspiSupported() ? PY_INSTALL_INPUT : PY_DISABLE_INPUT);
      pyodide.runPython(PY_RUNNER);
      return pyodide;
    })();
    return loadingPromise;
  }

  // ---- Run (interactive) ----------------------------------------------------
  function setRunLabel(text, on) {
    if (runLabel) runLabel.textContent = text;
    runBtn.disabled = !!on;
    runBtn.classList.toggle("is-busy", !!on);
  }
  function setCheckBusy(on, text) {
    if (checkLabel) checkLabel.textContent = text || (on ? "Checking…" : "Check");
    checkBtn.disabled = !!on;
    checkBtn.classList.toggle("is-busy", !!on);
  }

  async function run() {
    if (busy) return;
    busy = true;
    clearOut();
    setRunLabel("Running…", true);
    setCheckBusy(true, "Check");
    try {
      const py = await ensurePyodide(true);
      await py.runPythonAsync(getCode());
    } catch (err) {
      appendOut((err && err.message) ? err.message : String(err), "stderr");
    } finally {
      setRunLabel("Run", false);
      setCheckBusy(false);
      busy = false;
    }
  }

  // ---- Check (auto-grade) ---------------------------------------------------
  function runStudent(code, inputs, forceSecret) {
    pyodide.globals.set("_code", code);
    pyodide.globals.set("_inputs", JSON.stringify(inputs || []));
    pyodide.globals.set("_force", JSON.stringify(forceSecret == null ? null : forceSecret));
    const resJson = pyodide.runPython("_run_student(_code, _inputs, _force)");
    return JSON.parse(resJson);
  }

  async function check() {
    if (busy) return;
    busy = true;
    setCheckBusy(true, "Checking…");
    setRunLabel("Run", true);
    renderResults(null); // clears
    const code = getCode();
    try {
      await ensurePyodide(false);
    } catch (err) {
      setCheckBusy(false);
      setRunLabel("Run", false);
      busy = false;
      renderResults({ error: (err && err.message) ? err.message : String(err) });
      return;
    }

    const ch = current;
    const rows = ch.tests.map(function (test) {
      const res = runStudent(code, test.inputs, test.forceSecret);
      const verdict = test.check(res, test);
      return {
        label: test.label,
        inputs: test.inputs,
        pass: verdict.pass,
        why: verdict.why,
        output: res.output,
        error: res.error
      };
    });
    const allPass = rows.every(function (r) { return r.pass; });

    setCheckBusy(false);
    setRunLabel("Run", false);
    busy = false;

    if (allPass && !passed.has(ch.id)) {
      passed.add(ch.id);
      renderTabs();
      renderScoreboard();
      if (window.ITBasics && window.ITBasics.getSession()) {
        window.ITBasics.saveAttempt(QUIZ_NAME, 1, 1, { challenge: ch.id, code: code });
      }
    }
    renderResults({ rows: rows, allPass: allPass, challenge: ch });
  }

  // ---- Rendering ------------------------------------------------------------
  function renderTabs() {
    tabsEl.innerHTML = "";
    CHALLENGES.forEach(function (ch) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-tab challenge-tab" + (ch.id === current.id ? " active" : "");
      btn.dataset.id = ch.id;
      const done = passed.has(ch.id);
      btn.innerHTML = (done ? '<span class="challenge-tick" aria-label="completed">✓</span> ' : '') + escapeHtml(ch.title);
      if (done) btn.classList.add("done");
      btn.addEventListener("click", function () { selectChallenge(ch.id); });
      tabsEl.appendChild(btn);
    });
  }
  function renderBrief() {
    briefEl.innerHTML =
      '<h2 class="challenge-brief-title">' + escapeHtml(current.title) +
        (passed.has(current.id) ? ' <span class="challenge-badge-done">Completed</span>' : '') + '</h2>' +
      '<p class="challenge-brief-task">' + current.brief + '</p>' +
      '<div class="challenge-brief-detail">' + current.detail + '</div>' +
      '<p class="challenge-accept"><span class="challenge-accept-tag">To pass</span> ' + current.accept + '</p>';
  }
  function renderScoreboard() {
    const total = CHALLENGES.length;
    const done = CHALLENGES.filter(function (c) { return passed.has(c.id); }).length;
    const signedIn = window.ITBasics && window.ITBasics.getSession();
    let html =
      '<div class="challenge-progress">' +
        '<span class="challenge-progress-count">' + done + ' / ' + total + '</span>' +
        '<span class="challenge-progress-label">challenges complete</span>' +
        '<div class="challenge-progress-bar"><span style="width:' + Math.round((done / total) * 100) + '%"></span></div>' +
      '</div>';
    if (!signedIn) {
      html += '<p class="challenge-progress-hint">Sign in with your student code (top right) so your wins count on the leaderboard.</p>';
    }
    scoreboardEl.innerHTML = html;
  }
  function renderResults(state) {
    if (!state) { resultsEl.hidden = true; resultsEl.innerHTML = ""; return; }
    if (state.error) {
      resultsEl.hidden = false;
      resultsEl.innerHTML = '<div class="challenge-results-head fail">Couldn\'t start Python: ' + escapeHtml(state.error) + '</div>';
      return;
    }
    const rows = state.rows;
    const passCount = rows.filter(function (r) { return r.pass; }).length;
    let html = '<div class="challenge-results-head ' + (state.allPass ? "win" : "fail") + '">' +
      (state.allPass
        ? '🎉 Passed all ' + rows.length + ' tests &mdash; <strong>' + escapeHtml(state.challenge.title) + '</strong> complete!'
        : passCount + ' / ' + rows.length + ' tests passed &mdash; keep going!') +
      '</div><ul class="challenge-test-list">';
    rows.forEach(function (r) {
      html += '<li class="ct ' + (r.pass ? "pass" : "fail") + '">' +
        '<span class="ct-icon">' + (r.pass ? "✓" : "✗") + '</span>' +
        '<div class="ct-body">' +
          '<div class="ct-label">' + escapeHtml(r.label) + '</div>' +
          '<div class="ct-why">' + escapeHtml(r.why) + '</div>' +
          (r.output ? '<pre class="ct-output">' + escapeHtml(truncate(r.output, 600)) + '</pre>' : '') +
        '</div></li>';
    });
    html += '</ul>';
    resultsEl.hidden = false;
    resultsEl.innerHTML = html;
    resultsEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function selectChallenge(id) {
    if (busy) return;
    if (jar) { codeMap[current.id] = jar.toString(); saveCodeMap(); }
    current = challengeById(id) || CHALLENGES[0];
    fileEl.textContent = current.id + ".py";
    setCode(codeFor(current));
    clearOut();
    renderResults(null);
    renderTabs();
    renderBrief();
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function truncate(s, n) { return s.length > n ? s.slice(0, n) + "\n…(truncated)" : s; }

  // ---- Completion state -----------------------------------------------------
  async function loadPassed() {
    const out = new Set();
    if (!window.ITBasics) return out;
    const s = window.ITBasics.getSession();
    if (!s) return out;
    if (window.ITBasics.isOnline()) {
      try {
        const sb = window.ITBasics.client();
        const res = await sb.from("quiz_attempts").select("answers")
          .eq("student_code", s.code).eq("quiz_name", QUIZ_NAME);
        (res.data || []).forEach(function (r) {
          const c = r.answers && r.answers.challenge;
          if (c) out.add(c);
        });
      } catch (e) {}
    } else {
      try {
        const arr = JSON.parse(localStorage.getItem("itbasics-attempts-" + s.code + "-" + QUIZ_NAME) || "[]");
        arr.forEach(function (a) { const c = a.answers && a.answers.challenge; if (c) out.add(c); });
      } catch (e) {}
    }
    return out;
  }

  // ---- Wire up --------------------------------------------------------------
  editor.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); }
  });
  runBtn.addEventListener("click", run);
  checkBtn.addEventListener("click", check);
  if (resetBtn) resetBtn.addEventListener("click", function () {
    if (!window.confirm("Reset this challenge to the starter code?")) return;
    codeMap[current.id] = current.starter;
    saveCodeMap();
    setCode(current.starter);
    editor.focus();
  });
  if (clearBtn) clearBtn.addEventListener("click", clearOut);

  async function boot() {
    fileEl.textContent = current.id + ".py";
    initEditor();
    renderTabs();
    renderBrief();
    renderScoreboard();
    passed = await loadPassed();
    renderTabs();
    renderBrief();
    renderScoreboard();
  }
  boot();

  window.addEventListener("itbasics:auth", async function () {
    passed = await loadPassed();
    renderTabs();
    renderBrief();
    renderScoreboard();
  });
})();
