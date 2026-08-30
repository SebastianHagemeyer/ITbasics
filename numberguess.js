/*
 * Assignment 2: The Number Guesser.
 * The student writes the whole program themselves (no starter code, no
 * snippets). This file wires the embedded editor, autosave/sync and submit
 * (same assignment_progress table as the other tasks), and a robust robot
 * playtester that FORCES Python's random pick to a known value so it can prove,
 * deterministically, that the program loops until the guess is right, only
 * celebrates on a real match, and truly compares against the random secret.
 */
(function () {
  "use strict";

  const ASSIGNMENT = "numberguess";

  const STARTER =
    "# The Number Guesser - write your program here.\n" +
    "# The computer should pick a secret number from 1 to 10, then keep\n" +
    "# asking the player to guess until they get it right.\n";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  const student = window.ITBasics && window.ITBasics.getSession();
  if (!student) { location.replace("/"); return; }

  function localKey(suffix) {
    return "itbasics-" + ASSIGNMENT + "-" + student.code + "-" + suffix;
  }
  function codeKey() { return localKey("code"); }

  const runner = window.PyRun.create({
    editor: $("#assign-code"),
    output: $("#assign-output"),
    runBtn: $("#assign-run"),
    storageKey: codeKey,
    defaultCode: function () { return STARTER; },
    onChange: function () { scheduleSync(); }
  });

  // ---- Persisted self-checks and reflections ---------------------------------

  function initChecks() {
    $all(".self-check").forEach(function (cb) {
      const key = localKey("check-" + cb.dataset.check);
      cb.checked = localStorage.getItem(key) === "1";
      cb.addEventListener("change", function () {
        if (cb.checked) localStorage.setItem(key, "1");
        else localStorage.removeItem(key);
        scheduleSync();
      });
    });
    $all(".reflect").forEach(function (ta) {
      const key = localKey("reflect-" + ta.dataset.reflect);
      ta.value = localStorage.getItem(key) || "";
      ta.addEventListener("input", function () {
        localStorage.setItem(key, ta.value);
        scheduleSync();
      });
    });
  }

  // ---- The robot playtester ---------------------------------------------------
  // Every check forces the "random" secret to a known number (third arg to
  // ITCode.run) so the result is deterministic. r.used is how many guesses the
  // program actually read before it stopped; r.output is only what it print()ed
  // (prompts and typed input are kept out), so a prompt like "am I right?" can't
  // be mistaken for a win.

  const SUCCESS = /correct|well done|got it|you win|you won|nailed|\bright\b|\byes\b|guessed it|congrat/i;
  const SWEEP = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  function initTester() {
    const btn = $("#ng-test-btn");
    if (!btn) return;
    const box = $("#ng-test-results");
    const scoreEl = $("#ng-test-score");

    function render(results) {
      box.innerHTML = "";
      let passed = 0;
      results.forEach(function (r) {
        if (r.ok) passed++;
        const row = document.createElement("div");
        row.className = "pp-test-row " + (r.ok ? "pass" : "fail");
        const pill = document.createElement("span");
        pill.className = "pp-test-pill";
        pill.textContent = r.ok ? "PASS" : "FIX";
        row.appendChild(pill);
        const body = document.createElement("div");
        const title = document.createElement("div");
        title.className = "pp-test-title";
        title.textContent = r.title;
        body.appendChild(title);
        if (!r.ok && r.hint) {
          const hint = document.createElement("div");
          hint.className = "pp-test-hint";
          hint.textContent = r.hint;
          body.appendChild(hint);
        }
        row.appendChild(body);
        box.appendChild(row);
      });
      scoreEl.textContent = passed + "/" + results.length +
        (passed === results.length ? " - all working!" : "");
      scoreEl.className = "pp-test-score " +
        (passed === results.length ? "all-pass" : "some-fail");
    }

    btn.addEventListener("click", async function () {
      if (!window.ITCode || !window.ITCode.run) {
        box.textContent = "The tester could not load. Refresh the page and try again.";
        return;
      }
      const code = runner.getCode();
      btn.disabled = true;
      scoreEl.textContent = "";
      scoreEl.className = "pp-test-score";
      box.innerHTML = '<p class="pp-test-running">The robot is playing your game' +
        " (the first go loads Python, give it a few seconds)&hellip;</p>";
      try {
        const results = [];

        // 1) Wins ONLY on the real random secret. Force the secret to 2, 5 and 9
        //    in turn; a correct program guessing 1..10 must win exactly at the
        //    forced number. This rejects a hardcoded secret (wins at a fixed
        //    spot) and an always-"correct" cheat (wins at guess 1).
        let winsOk = true, whyWin = "";
        for (let i = 0; i < 3; i++) {
          const s = [2, 5, 9][i];
          const r = await window.ITCode.run(code, SWEEP, s);
          const out = r.output || "";
          if (r.used === s && SUCCESS.test(out)) continue;
          winsOk = false;
          if (r.used >= SWEEP.length && r.error && /EOFError/.test(r.error)) {
            whyWin = "The robot guessed 1 through 10 and the game never said a success word. " +
              "Turn the guess into a number with int(), compare it to the secret, and print " +
              'something like "Correct!" when they match.';
          } else if (r.used !== s) {
            whyWin = "With the secret forced to " + s + ", the game ended on guess " + r.used +
              " instead of " + s + ". That means it is not really comparing against the random " +
              "secret, build the secret with random and compare each guess to that.";
          } else {
            whyWin = "It reached the matching guess but never printed a success word. " +
              'Print something like "Correct!" when the guess is right.';
          }
          break;
        }
        results.push(winsOk
          ? { ok: true, title: "Wins only on the real random secret (robot forced it to 2, 5, then 9)" }
          : { ok: false, title: "Wins only on the real random secret", hint: whyWin });

        // 2) A wrong guess leads to ANOTHER guess. Force the secret to 7 and feed
        //    a single wrong guess (4) with nothing after it. A correct program
        //    asks again and runs out of input (EOFError), reading exactly one
        //    guess. A cheat that says "correct" anyway, or that never loops,
        //    stops after that one guess with no request for more.
        const r2 = await window.ITCode.run(code, ["4"], 7);
        const askedAgain = r2.used === 1 && !!r2.error && /EOFError/.test(r2.error);
        results.push(askedAgain
          ? { ok: true, title: "A wrong guess leads to another guess" }
          : { ok: false, title: "A wrong guess leads to another guess",
              hint: SUCCESS.test(r2.output || "")
                ? "The robot guessed 4 while the secret was 7, and the game said it was right. " +
                  "Only celebrate when the guess actually equals the secret."
                : "After one wrong guess the game stopped instead of asking again. Put the guessing " +
                  "inside a loop that keeps going while the guess is wrong." });

        // 3) Source sanity: it actually uses the random module and a loop. This
        //    is a friendly nudge; checks 1 and 2 are the real proof.
        const usesRandom = /\brandom\b/.test(code) && /rand(int|range)|choice/.test(code);
        const usesLoop = /\bwhile\b|\bfor\b/.test(code);
        results.push((usesRandom && usesLoop)
          ? { ok: true, title: "Uses the random module and a loop" }
          : { ok: false, title: "Uses the random module and a loop",
              hint: !usesRandom
                ? "I can't see a random pick. Import the random module and use it to choose the " +
                  "secret (the function you want gives a whole number between two values)."
                : "I can't see a loop. Use while to keep asking until the guess is right." });

        render(results);
      } catch (e) {
        box.textContent = "The tester hit a problem: " + (e && e.message ? e.message : e);
      } finally {
        btn.disabled = false;
      }
    });
  }

  // ---- Cross-device progress sync + submit ------------------------------------
  // Mirrors the pet-program page: everything autosaves to localStorage as the
  // student works, and a few seconds later the whole state is upserted to
  // assignment_progress and pulled back down on any machine.

  const SYNC_DELAY_MS = 2500;
  let syncTimer = null;
  let lastSyncedJson = "";
  const noteEl = $("#submit-note");

  function collectState() {
    const state = { code: {}, checks: {}, reflects: {}, note: noteEl ? noteEl.value : "" };
    const v = localStorage.getItem(codeKey());
    if (v != null) state.code.main = v;
    $all(".self-check").forEach(function (cb) {
      if (cb.checked) state.checks[cb.dataset.check] = true;
    });
    $all(".reflect").forEach(function (ta) {
      if (ta.value) state.reflects[ta.dataset.reflect] = ta.value;
    });
    return state;
  }

  function applyState(state) {
    if (!state) return;
    if (state.code && state.code.main) localStorage.setItem(codeKey(), state.code.main);
    Object.keys(state.checks || {}).forEach(function (k) {
      if (state.checks[k]) localStorage.setItem(localKey("check-" + k), "1");
    });
    Object.keys(state.reflects || {}).forEach(function (k) {
      if (state.reflects[k]) localStorage.setItem(localKey("reflect-" + k), state.reflects[k]);
    });
    if (state.note && !localStorage.getItem(localKey("note"))) {
      localStorage.setItem(localKey("note"), state.note);
    }
  }

  function scheduleSync() {
    localStorage.setItem(localKey("progress-ts"), String(Date.now()));
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(pushProgress, SYNC_DELAY_MS);
  }

  async function pushProgress() {
    syncTimer = null;
    if (!window.ITBasics.isOnline()) return;
    const state = collectState();
    const json = JSON.stringify(state);
    if (json === lastSyncedJson) return;
    try {
      const res = await window.ITBasics.client().from("assignment_progress").upsert({
        student_code: student.code,
        assignment: ASSIGNMENT,
        state: state,
        updated_at: new Date().toISOString()
      }, { onConflict: "student_code,assignment" });
      if (!res.error) lastSyncedJson = json;
    } catch (e) { /* offline or table missing: local saves still cover us */ }
  }

  async function hydrateProgress() {
    if (!window.ITBasics.isOnline()) return;
    try {
      const res = await window.ITBasics.client()
        .from("assignment_progress")
        .select("state, updated_at")
        .eq("student_code", student.code)
        .eq("assignment", ASSIGNMENT)
        .maybeSingle();
      if (res.error || !res.data) return;
      const remoteTs = Date.parse(res.data.updated_at) || 0;
      const localTs = parseInt(localStorage.getItem(localKey("progress-ts")) || "0", 10);
      if (remoteTs > localTs) {
        applyState(res.data.state);
        localStorage.setItem(localKey("progress-ts"), String(remoteTs));
        lastSyncedJson = JSON.stringify(res.data.state);
      }
    } catch (e) { /* fine: the page just uses what this machine has */ }
  }

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden" && syncTimer) {
      clearTimeout(syncTimer);
      pushProgress();
    }
  });

  const statusEl = $("#submit-status");
  const submitBtn = $("#submit-btn");

  function setStatus(html, kind) {
    if (!statusEl) return;
    statusEl.className = "submit-status" + (kind ? " " + kind : "");
    statusEl.innerHTML = html;
  }

  function showSubmitted(when) {
    const date = when ? new Date(when).toLocaleString("en-AU", {
      day: "numeric", month: "short", hour: "numeric", minute: "2-digit"
    }) : "";
    setStatus(
      "&#10003; Marked as ready to grade" +
      (date ? " &middot; " + escapeHtml(date) : "") +
      ". You can keep editing and resubmit any time; your teacher always sees your latest.",
      "ok"
    );
    if (submitBtn) submitBtn.textContent = "Submit again";
  }

  async function loadSubmission() {
    if (window.ITBasics.isOnline()) {
      const res = await window.ITBasics.client().from("assignment_progress")
        .select("*")
        .eq("student_code", student.code)
        .eq("assignment", ASSIGNMENT)
        .maybeSingle();
      if (!res.error && res.data && res.data.submitted_at) { showSubmitted(res.data.submitted_at); return; }
      if (!res.error) return;
    }
    const local = localStorage.getItem(localKey("submitted-at"));
    if (local) showSubmitted(local);
  }

  async function submit() {
    const code = runner.getCode();
    if (!code || code.replace(/#.*$/gm, "").trim().length < 20) {
      setStatus("There's not much code in the editor yet. Write your program first, then submit.", "error");
      return;
    }
    const submittedAt = new Date().toISOString();
    submitBtn.disabled = true;
    setStatus("Submitting…", "");
    localStorage.setItem(localKey("submitted-at"), submittedAt);

    if (window.ITBasics.isOnline()) {
      const res = await window.ITBasics.client().from("assignment_progress").upsert({
        student_code: student.code,
        assignment: ASSIGNMENT,
        state: collectState(),
        submitted_at: submittedAt,
        updated_at: submittedAt
      }, { onConflict: "student_code,assignment" });
      submitBtn.disabled = false;
      if (res.error) {
        const msg = String(res.error.message || "");
        if (/relation|does not exist|schema cache|not find the table/i.test(msg)) {
          setStatus("Progress saving isn't switched on yet. Your work is saved on this device; ask your teacher to run the setup SQL.", "error");
        } else {
          setStatus("Couldn't submit: " + escapeHtml(msg) + " (your work is saved on this device)", "error");
        }
        return;
      }
      lastSyncedJson = JSON.stringify(collectState());
      showSubmitted(submittedAt);
      return;
    }
    submitBtn.disabled = false;
    showSubmitted(submittedAt);
  }

  if (submitBtn) submitBtn.addEventListener("click", submit);

  // ---- Boot -------------------------------------------------------------------

  (async function boot() {
    await hydrateProgress();
    initChecks();
    initTester();
    if (noteEl) {
      if (!noteEl.value) noteEl.value = localStorage.getItem(localKey("note")) || "";
      noteEl.addEventListener("input", function () {
        localStorage.setItem(localKey("note"), noteEl.value);
        scheduleSync();
      });
    }
    runner.reloadSaved();
    loadSubmission();
  })();

  window.addEventListener("itbasics:auth", function (e) {
    if (!e.detail || !e.detail.student) location.replace("/");
  });
})();
