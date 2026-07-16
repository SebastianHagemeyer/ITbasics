/*
 * Assignment 2: Pixel Painter (pictures are data).
 * One PyRun editor; the student stores a drawing as a list of letter-strings
 * plus a palette, and a nested loop paints it with print(col=). Progress
 * (code, self-checks, reflections, note) autosaves locally and syncs to
 * assignment_progress so it follows the student between computers, same as
 * the Pet Project. Submit upserts to assignment_submissions.
 */
(function () {
  "use strict";

  const ASSIGNMENT = "pixelart";

  const STARTER =
    "# Pixel Painter: every picture is secretly data.\n" +
    "# Run me to meet your first three pixels!\n" +
    "\n" +
    'print("██", col="#FF0000")\n' +
    'print("██", col="#00FF00")\n' +
    'print("██", col="#0000FF")\n';

  // Code shown in the step cards, rendered into .snippet[data-snippet]
  // placeholders with an "Add to editor" button.
  const SNIPPETS = {
    "px-1":
      '# ADD A COMMENT HERE: what does end="" do? (try deleting it)\n' +
      "for i in range(8):\n" +
      '    print("██", col="#FF0000", end="")\n' +
      "print()\n",
    "px-2":
      "# The palette gives each letter a colour.\n" +
      "palette = {\n" +
      '    "R": "#FF0000",\n' +
      '    "Y": "#FFD400",   # ADD A COMMENT: what colour is this? Check the mixer!\n' +
      '    ".": "#333333",\n' +
      "}\n" +
      "\n" +
      'row = "R.Y.R.Y."\n' +
      "# ADD A COMMENT HERE: what does this loop do with each letter?\n" +
      "for letter in row:\n" +
      '    print("██", col=palette[letter], end="")\n' +
      "print()\n",
    "px-3":
      "palette = {\n" +
      '    "G": "#0aa84a",\n' +
      '    "Y": "#FFD400",\n' +
      '    ".": "#222222",\n' +
      "}\n" +
      "\n" +
      "# ADD A COMMENT HERE: this list is the DATA for the picture\n" +
      "picture = [\n" +
      '    "..GGGG..",\n' +
      '    ".GGGGGG.",\n' +
      '    "GGYGGYGG",\n' +
      '    "GGGGGGGG",\n' +
      '    "GYGGGGYG",\n' +
      '    "GGYYYYGG",\n' +
      '    ".GGGGGG.",\n' +
      '    "..GGGG..",\n' +
      "]\n" +
      "\n" +
      "for row in picture:\n" +
      "    for letter in row:\n" +
      '        print("██", col=palette[letter], end="")\n' +
      "    print()\n",
    "px-x1":
      "import time\n" +
      "import random\n" +
      "\n" +
      "picture = [\n" +
      '    ".S....S.",\n' +
      '    "..S..S..",\n' +
      '    "SSSSSSSS",\n' +
      '    ".SSSSSS.",\n' +
      '    "..SSSS..",\n' +
      '    ".SS..SS.",\n' +
      "]\n" +
      "\n" +
      "# Redraw the same DATA over and over with twinkling colours\n" +
      "for frame in range(30):\n" +
      "    clear()\n" +
      "    for row in picture:\n" +
      "        for letter in row:\n" +
      '            if letter == "S":\n' +
      '                shade = random.choice(["#FFD400", "#FFF2A0", "#FFAA00"])\n' +
      '                print("██", col=shade, end="")\n' +
      "            else:\n" +
      '                print("██", col="#101020", end="")\n' +
      "        print()\n" +
      "    time.sleep(0.2)\n",
    "px-x2":
      "palette = {\n" +
      '    "X": "#FF00AA",\n' +
      '    ".": "#222222",\n' +
      "}\n" +
      "\n" +
      "# Let the user recolour the art without touching the data!\n" +
      'new_colour = input("Pick a colour for X (a name like teal, or hex like #00CCFF): ")\n' +
      'palette["X"] = new_colour\n' +
      "\n" +
      "picture = [\n" +
      '    "X..X",\n' +
      '    ".XX.",\n' +
      '    ".XX.",\n' +
      '    "X..X",\n' +
      "]\n" +
      "for row in picture:\n" +
      "    for letter in row:\n" +
      '        print("██", col=palette[letter], end="")\n' +
      "    print()\n"
  };

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

  const runner = window.PyRun.create({
    editor: $("#assign-code"),
    output: $("#assign-output"),
    runBtn: $("#assign-run"),
    storageKey: localKey("code"),
    defaultCode: STARTER,
    onChange: function () { scheduleSync(); }
  });

  // ---- Step snippets ----------------------------------------------------------

  // Snippets ADD to the bottom of the student's code rather than wiping it,
  // so merging the new step into their program is part of the work. The
  // editor is only replaced outright when it holds no real work.
  let previousCode = null;

  function isUntouched(text) {
    const t = (text || "").trim();
    if (!t) return true;
    if (STARTER.trim() === t) return true;
    return Object.keys(SNIPPETS).some(function (k) { return SNIPPETS[k].trim() === t; });
  }

  function focusWorkspace() {
    const ws = $("#workspace");
    if (!ws) return;
    ws.scrollIntoView({ behavior: "smooth", block: "start" });
    ws.classList.remove("flash");
    void ws.offsetWidth;
    ws.classList.add("flash");
    const editor = $("#assign-code");
    if (editor) editor.scrollTop = editor.scrollHeight;
  }

  function loadSnippet(code) {
    const current = runner.getCode();
    if (current.trim() === code.trim() || current.trim().endsWith(code.trim())) {
      showToast({ message: "That code is already in your editor" });
      focusWorkspace();
      return;
    }
    previousCode = current;
    let message;
    if (isUntouched(current)) {
      runner.setCode(code);
      message = "Loaded into the editor";
    } else {
      runner.setCode(current.replace(/\s+$/, "") + "\n\n" + code);
      message = "Added below your code. Merge it in: delete the old bits you've replaced.";
    }
    showToast({
      message: message,
      actionLabel: "Undo",
      action: function () {
        if (previousCode == null) return;
        const swap = previousCode;
        previousCode = null;
        runner.setCode(swap);
      }
    });
    focusWorkspace();
  }

  function renderSnippets() {
    $all(".snippet").forEach(function (holder) {
      const id = holder.dataset.snippet;
      const code = SNIPPETS[id];
      if (!code) return;
      const box = document.createElement("div");
      box.className = "snippet-box";
      const pre = document.createElement("pre");
      pre.className = "code language-python";
      const codeEl = document.createElement("code");
      codeEl.textContent = code;
      pre.appendChild(codeEl);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-ghost snippet-load";
      btn.textContent = "Add to editor";
      btn.addEventListener("click", function () { loadSnippet(code); });
      box.appendChild(pre);
      box.appendChild(btn);
      holder.appendChild(box);
      if (window.Prism) window.Prism.highlightElement(codeEl);
    });
  }

  // Same toast as the sandbox page: message plus an optional Undo action.
  function showToast(opts) {
    let toast = document.getElementById("it-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "it-toast";
      toast.className = "toast";
      document.body.appendChild(toast);
      toast.addEventListener("mouseenter", function () {
        if (toast._timer) { clearTimeout(toast._timer); toast._timer = null; }
      });
      toast.addEventListener("mouseleave", function () {
        toast._timer = setTimeout(hideToast, 3000);
      });
    }
    toast.innerHTML = "";
    const msg = document.createElement("span");
    msg.className = "toast-msg";
    msg.textContent = opts.message;
    toast.appendChild(msg);
    if (opts.action) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "toast-action";
      btn.textContent = opts.actionLabel || "Undo";
      btn.addEventListener("click", function () { opts.action(); hideToast(); });
      toast.appendChild(btn);
    }
    requestAnimationFrame(function () { toast.classList.add("show"); });
    if (toast._timer) clearTimeout(toast._timer);
    toast._timer = setTimeout(hideToast, 6000);
  }
  function hideToast() {
    const toast = document.getElementById("it-toast");
    if (!toast) return;
    toast.classList.remove("show");
    if (toast._timer) { clearTimeout(toast._timer); toast._timer = null; }
  }

  // ---- Persisted self-checks and reflections ----------------------------------

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

  // ---- Cross-device progress sync ----------------------------------------------
  // Same pattern as the Pet Project: everything autosaves to localStorage as
  // the student works, and a few seconds after each change the whole state is
  // upserted to assignment_progress and pulled back down on any computer.

  const SYNC_DELAY_MS = 2500;
  let syncTimer = null;
  let lastSyncedJson = "";

  const noteEl = $("#submit-note");

  function collectState() {
    const state = { code: {}, checks: {}, reflects: {}, note: noteEl ? noteEl.value : "" };
    const v = localStorage.getItem(localKey("code"));
    if (v != null) state.code.main = v;
    $all(".self-check").forEach(function (cb) {
      if (cb.checked) state.checks[cb.dataset.check] = true;
    });
    $all(".reflect").forEach(function (ta) {
      if (ta.value) state.reflects[ta.dataset.reflect] = ta.value;
    });
    return state;
  }

  // Union-merges remote state into localStorage; restoring can add work but
  // never blank something out.
  function applyState(state) {
    if (!state) return;
    if (state.code && state.code.main) localStorage.setItem(localKey("code"), state.code.main);
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

  // ---- Submission ---------------------------------------------------------------

  const statusEl = $("#submit-status");
  const submitBtn = $("#submit-btn");

  function setStatus(html, kind) {
    if (!statusEl) return;
    statusEl.className = "submit-status" + (kind ? " " + kind : "");
    statusEl.innerHTML = html;
  }

  function showSubmitted(sub) {
    const when = sub.updated_at || sub.submitted_at;
    const date = when ? new Date(when).toLocaleString("en-AU", {
      day: "numeric", month: "short", hour: "numeric", minute: "2-digit"
    }) : "";
    setStatus(
      "&#10003; Submitted" + (date ? " &middot; " + escapeHtml(date) : "") +
      " &mdash; you can update and submit again any time.",
      "ok"
    );
    if (submitBtn) submitBtn.textContent = "Submit again";
    if (noteEl && !noteEl.value && sub.note) noteEl.value = sub.note;
  }

  async function loadSubmission() {
    if (window.ITBasics.isOnline()) {
      const sb = window.ITBasics.client();
      const res = await sb.from("assignment_submissions")
        .select("note, submitted_at, updated_at")
        .eq("student_code", student.code)
        .eq("assignment", ASSIGNMENT)
        .maybeSingle();
      if (!res.error && res.data) { showSubmitted(res.data); return; }
    }
    const raw = localStorage.getItem(localKey("submission"));
    if (raw) {
      try { showSubmitted(JSON.parse(raw)); } catch (e) { /* ignore */ }
    }
  }

  async function submit() {
    const code = runner.getCode();
    if (!code || code.trim().length < 40) {
      setStatus("There's not much code in the editor yet. Build your picture first, then submit.", "error");
      return;
    }
    if (!/for\s+\w+\s+in\s/.test(code)) {
      setStatus("Your program needs a loop that draws the picture from the data (see Part 3).", "error");
      return;
    }
    const note = noteEl ? noteEl.value.trim() : "";
    const payload = {
      student_code: student.code,
      assignment: ASSIGNMENT,
      track: null,
      code: code,
      note: note,
      updated_at: new Date().toISOString()
    };

    submitBtn.disabled = true;
    setStatus("Submitting…", "");
    // Always keep a local copy, so nothing is lost even if the network dies.
    localStorage.setItem(localKey("submission"), JSON.stringify(payload));

    if (window.ITBasics.isOnline()) {
      const sb = window.ITBasics.client();
      const res = await sb.from("assignment_submissions")
        .upsert(payload, { onConflict: "student_code,assignment" });
      submitBtn.disabled = false;
      if (res.error) {
        const msg = String(res.error.message || "");
        if (/relation|does not exist|schema cache|not find the table/i.test(msg)) {
          setStatus("Submissions aren't switched on yet. Your work is saved on this device; ask your teacher.", "error");
        } else {
          setStatus("Couldn't submit: " + escapeHtml(msg) + " (your work is saved on this device)", "error");
        }
        return;
      }
      showSubmitted(payload);
      return;
    }
    submitBtn.disabled = false;
    showSubmitted(payload);
  }

  if (submitBtn) submitBtn.addEventListener("click", submit);

  // ---- Boot -----------------------------------------------------------------------

  renderSnippets();

  (async function boot() {
    await hydrateProgress();
    initChecks();
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
