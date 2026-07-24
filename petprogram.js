/*
 * Assignment 1: My First Program (the Pet Project).
 * Two tracks over the same concepts and rubric:
 *   calc   - Pet Age Calculator (input, int, while, if/break, try/except)
 *   turtle - Pet Turtle drawing (same concepts, but the output is a picture)
 * The page has one embedded PyRun editor; each track keeps its own saved
 * code, and Submit upserts the current editor code to Supabase.
 */
(function () {
  "use strict";

  const ASSIGNMENT = "petprogram";
  const TRACKS = { calc: "Pet Age Calculator", turtle: "Pet Turtle" };

  const STARTERS = {
    calc:
      "# ADD A COMMENT HERE saying what this program does\n" +
      "while True:\n" +
      '    age = input("How old is the pet? ")\n' +
      '    print("You typed:", age)\n',
    turtle:
      "# Your pet turtle! Give it instructions, then press Run.\n" +
      "import turtle\n" +
      "\n" +
      "turtle.forward(100)   # walk 100 steps\n" +
      "turtle.left(90)       # turn left 90 degrees\n" +
      "turtle.forward(100)\n"
  };

  // Code shown in the step cards. Rendered into .snippet[data-snippet]
  // placeholders with a "Load into editor" button, so the page text and
  // the loadable code can never drift apart.
  const SNIPPETS = {
    "calc-1":
      "# ADD A COMMENT HERE saying what this program does\n" +
      "while True:\n" +
      '    age = input("How old is the pet? ")\n' +
      '    print("You typed:", age)\n',
    "calc-2":
      "while True:\n" +
      "    # ADD A COMMENT HERE explaining what int() does\n" +
      '    age = int(input("How old is the pet? "))\n' +
      '    print("You typed:", age)\n',
    "calc-3":
      "while True:\n" +
      '    age = int(input("How old is the pet? "))\n' +
      "    pet_years = age * ____   # ADD A COMMENT explaining the maths (7, 6 or 5)\n" +
      '    print("In pet years that is:", pet_years)\n',
    "calc-3b":
      "# No hardcoding: the pet's number gets a NAME\n" +
      "dog_years = 7   # ADD A COMMENT: what does this 7 actually mean?\n" +
      "\n" +
      "while True:\n" +
      '    age = int(input("How old is the pet? "))\n' +
      "    pet_years = age * dog_years\n" +
      '    print("In pet years that is:", pet_years)\n',
    "calc-4":
      "# ADD A COMMENT HERE saying what the whole program does\n" +
      "while True:\n" +
      '    answer = input("How old is the pet? (or type quit) ")\n' +
      '    if answer == "quit":            # ADD A COMMENT explaining this line\n' +
      '        print("Goodbye!")\n' +
      "        break\n" +
      "    age = int(answer)\n" +
      "    pet_years = age * 7\n" +
      '    print("In pet years that is:", pet_years)\n',
    "calc-5":
      "while True:\n" +
      '    answer = input("How old is the pet? (or type quit) ")\n' +
      '    if answer == "quit":\n' +
      '        print("Goodbye!")\n' +
      "        break\n" +
      "    try:\n" +
      "        # ADD A COMMENT HERE: what are we trying to do?\n" +
      "        age = int(answer)\n" +
      "        pet_years = age * 7\n" +
      '        print("In pet years that is:", pet_years)\n' +
      "    except ValueError:\n" +
      "        # ADD A COMMENT HERE: when does this run?\n" +
      '        print("That is not a number. Try again.")\n',

    "calc-5b":
      "# The tidy way: try ONLY the risky line, then continue if it fails.\n" +
      "while True:\n" +
      '    answer = input("How old is the pet? (or type quit) ")\n' +
      '    if answer == "quit":\n' +
      '        print("Goodbye!")\n' +
      "        break\n" +
      "    try:\n" +
      "        age = int(answer)\n" +
      "    except ValueError:\n" +
      '        print("That is not a number. Try again.")\n' +
      "        continue   # ADD A COMMENT HERE: what does continue do, and why?\n" +
      "    # We only get here if age is a REAL number\n" +
      "    pet_years = age * 7\n" +
      '    print("In pet years that is:", pet_years)\n',

    "turtle-1":
      "# ADD A COMMENT HERE saying what this program draws\n" +
      "import turtle\n" +
      "\n" +
      "turtle.forward(100)   # walk 100 steps\n" +
      "turtle.left(90)       # turn left 90 degrees\n" +
      "turtle.forward(100)\n" +
      "turtle.left(90)\n" +
      "turtle.forward(100)\n",
    "turtle-2":
      "import turtle\n" +
      "\n" +
      "# ADD A COMMENT HERE explaining what int() does\n" +
      'size = int(input("How big should the square be? "))\n' +
      "\n" +
      "turtle.forward(size)\n" +
      "turtle.left(90)\n" +
      "turtle.forward(size)\n" +
      "turtle.left(90)\n" +
      "turtle.forward(size)\n" +
      "turtle.left(90)\n" +
      "turtle.forward(size)\n" +
      "turtle.left(90)\n",
    "turtle-3":
      "import turtle\n" +
      "\n" +
      'size = int(input("How big should the shape be? "))\n' +
      'sides = int(input("How many sides? "))\n' +
      "\n" +
      "angle = 360 / sides    # ADD A COMMENT: why 360?\n" +
      "\n" +
      "for i in range(sides):\n" +
      "    turtle.forward(size)\n" +
      "    turtle.left(angle)\n",
    "turtle-4":
      "# ADD A COMMENT HERE saying what the whole program does\n" +
      "import turtle\n" +
      "\n" +
      "while True:\n" +
      '    shape = input("What shape? (square / triangle / star, or quit) ")\n' +
      '    if shape == "quit":             # ADD A COMMENT explaining this line\n' +
      '        print("Goodbye!")\n' +
      "        break\n" +
      '    size = int(input("How big? "))\n' +
      '    if shape == "square":\n' +
      "        for i in range(4):\n" +
      "            turtle.forward(size)\n" +
      "            turtle.left(90)\n" +
      '    elif shape == "triangle":\n' +
      "        for i in range(3):\n" +
      "            turtle.forward(size)\n" +
      "            turtle.left(120)\n" +
      '    elif shape == "star":\n' +
      "        for i in range(5):\n" +
      "            turtle.forward(size)\n" +
      "            turtle.left(144)\n" +
      "    else:\n" +
      '        print("I don\'t know that shape yet!")\n',
    "turtle-5":
      "import turtle\n" +
      "\n" +
      "while True:\n" +
      '    shape = input("What shape? (square / triangle / star, or quit) ")\n' +
      '    if shape == "quit":\n' +
      '        print("Goodbye!")\n' +
      "        break\n" +
      "    try:\n" +
      "        # ADD A COMMENT HERE: what are we trying to do?\n" +
      '        size = int(input("How big? "))\n' +
      '        if shape == "square":\n' +
      "            for i in range(4):\n" +
      "                turtle.forward(size)\n" +
      "                turtle.left(90)\n" +
      '        elif shape == "triangle":\n' +
      "            for i in range(3):\n" +
      "                turtle.forward(size)\n" +
      "                turtle.left(120)\n" +
      '        elif shape == "star":\n' +
      "            for i in range(5):\n" +
      "                turtle.forward(size)\n" +
      "                turtle.left(144)\n" +
      "        else:\n" +
      '            print("I don\'t know that shape yet!")\n' +
      "    except ValueError:\n" +
      "        # ADD A COMMENT HERE: when does this run?\n" +
      '        print("That is not a number. Try again.")\n',
    "turtle-x1":
      "import turtle\n" +
      "\n" +
      "# Rainbow spiral: the loop variable changes the size AND the colour.\n" +
      'colors = ["red", "orange", "yellow", "green", "blue", "purple"]\n' +
      "turtle.speed(10)\n" +
      "\n" +
      "for i in range(60):\n" +
      "    turtle.pencolor(colors[i % 6])\n" +
      "    turtle.forward(i * 4)\n" +
      "    turtle.left(60)\n",
    "turtle-x2":
      "import turtle\n" +
      "\n" +
      "# A pet face: circles + fills. Change it into YOUR pet!\n" +
      "turtle.speed(10)\n" +
      "\n" +
      "# head\n" +
      'turtle.color("green")\n' +
      "turtle.begin_fill()\n" +
      "turtle.circle(80)\n" +
      "turtle.end_fill()\n" +
      "\n" +
      "# left eye\n" +
      "turtle.penup()\n" +
      "turtle.goto(-30, 90)\n" +
      "turtle.pendown()\n" +
      'turtle.color("white")\n' +
      "turtle.begin_fill()\n" +
      "turtle.circle(15)\n" +
      "turtle.end_fill()\n" +
      "\n" +
      "# right eye\n" +
      "turtle.penup()\n" +
      "turtle.goto(30, 90)\n" +
      "turtle.pendown()\n" +
      "turtle.begin_fill()\n" +
      "turtle.circle(15)\n" +
      "turtle.end_fill()\n" +
      "\n" +
      "# name tag\n" +
      "turtle.penup()\n" +
      "turtle.goto(0, -40)\n" +
      'turtle.color("hotpink")\n' +
      'turtle.write("Sheldon", align="center", font=("Arial", 22, "bold"))\n' +
      "turtle.hideturtle()\n"
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

  // ---- Track state -----------------------------------------------------------

  let track = localStorage.getItem(localKey("track")) || "";

  function codeKey() { return localKey("code-" + (track || "calc")); }

  const runner = window.PyRun.create({
    editor: $("#assign-code"),
    output: $("#assign-output"),
    runBtn: $("#assign-run"),
    storageKey: codeKey,
    defaultCode: function () { return STARTERS[track || "calc"]; },
    onChange: function (code) { updateTurtlePanel(code); scheduleSync(); },
    turtle: {
      canvas: $("#turtle-canvas"),
      sprite: $("#turtle-sprite")
    }
  });

  // The turtle window only appears when the program actually uses turtle,
  // whatever the track; the output console always stays for print()s.
  function usesTurtle(code) {
    return /(^|\n)\s*(import\s+turtle|from\s+turtle\s+import)/.test(code || "");
  }
  function updateTurtlePanel(code) {
    const panel = $("#turtle-panel");
    if (panel) panel.hidden = !usesTurtle(code == null ? runner.getCode() : code);
  }

  function applyTrack(next, save) {
    track = next;
    if (save) {
      localStorage.setItem(localKey("track"), track);
      scheduleSync();
    }
    document.body.dataset.track = track || "none";
    $all(".track-card").forEach(function (card) {
      card.classList.toggle("selected", card.dataset.track === track);
    });
    $all(".track-pane").forEach(function (pane) {
      pane.hidden = pane.dataset.track !== track;
    });
    updateTurtlePanel();
    const label = $("#assign-file-label");
    if (label) label.textContent = track === "turtle" ? "pet_turtle.py" : "pet_age.py";
    const ws = $("#workspace");
    if (ws) ws.hidden = !track;
  }

  $all(".track-card").forEach(function (card) {
    card.addEventListener("click", function () {
      if (track === card.dataset.track) return;
      applyTrack(card.dataset.track, true);
      runner.reloadSaved();
      const ws = $("#workspace");
      if (ws) ws.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // ---- Step snippets ----------------------------------------------------------

  // Snippets ADD to the bottom of the student's code rather than wiping it,
  // so merging the new step into their program (and deleting the old bits)
  // is part of the work. The editor is only replaced outright when it holds
  // no real work: empty, or still an untouched starter/snippet.
  let previousCode = null;

  function isUntouched(text) {
    const t = (text || "").trim();
    if (!t) return true;
    if (STARTERS.calc.trim() === t || STARTERS.turtle.trim() === t) return true;
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

  // ---- Machine check: the robot vet tests the calculator ----------------------
  // Feeds the student's program scripted inputs through the shared headless
  // grader (window.ITCode.run from challenges.js) and marks three things:
  // does it calculate pet years, does it survive silly input, does it quit.

  // Work out the student's multiplier from a run where the robot typed 6 then
  // 10: whatever m makes both 6*m and 10*m appear (in order) in the output.
  function inferMultiplier(out) {
    const nums = (String(out || "").match(/-?\d+/g) || []).map(Number);
    for (let m = 2; m <= 15; m++) {
      const i = nums.indexOf(6 * m);
      if (i !== -1 && nums.indexOf(10 * m, i + 1) !== -1) return m;
    }
    return 0;
  }

  function initTester() {
    const btn = $("#pp-test-btn");
    if (!btn) return;
    const box = $("#pp-test-results");
    const scoreEl = $("#pp-test-score");

    function render(results, bonus) {
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
      if (bonus) {
        const note = document.createElement("p");
        note.className = "pp-test-bonus";
        note.textContent = bonus;
        box.appendChild(note);
      }
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
      box.innerHTML = '<p class="pp-test-running">The robot vet is trying your program' +
        " (the first go loads Python, give it a few seconds)&hellip;</p>";
      try {
        const results = [];

        // 1. The maths: robot types 6, then 10, then quits.
        const r1 = await window.ITCode.run(code, ["6", "10", "quit", "quit", "quit"]);
        const m = inferMultiplier(r1.output);
        if (m) {
          results.push({ ok: true, title: "Calculates pet years (your multiplier looks like x" + m + ")" });
        } else {
          results.push({ ok: false, title: "Calculates pet years",
            hint: "The robot typed 6 and then 10 as ages, but the output never showed " +
              "6 x your multiplier followed by 10 x your multiplier. Check the maths in Part 3." +
              (r1.error ? " (The program stopped with: " + r1.error + ")" : "") });
        }

        // 2. Silly input: robot types banana, then a real age, then quits.
        const r2 = await window.ITCode.run(code, ["banana", "5", "quit", "quit", "quit"]);
        const crashed = r2.error && !/^EOFError/.test(r2.error);
        if (!crashed) {
          results.push({ ok: true, title: "Survives silly input (the robot typed banana)" });
        } else {
          results.push({ ok: false, title: "Survives silly input (the robot typed banana)",
            hint: "Typing banana crashed it with: " + r2.error + ". Guard the int() " +
              "conversion with try/except, that is exactly what Part 5 shows." });
        }

        // 3. The polite quit: robot types quit straight away.
        const r3 = await window.ITCode.run(code, ["quit"]);
        if (!r3.error) {
          results.push({ ok: true, title: "Ends politely when the user types quit" });
        } else {
          results.push({ ok: false, title: "Ends politely when the user types quit",
            hint: /^EOFError/.test(r3.error)
              ? "The robot typed quit but your program kept asking for more. You need " +
                'if answer == "quit": break inside the loop, that is Part 4.'
              : "Typing quit stopped the program with an error: " + r3.error +
                ". Check for quit BEFORE turning the answer into a number." });
        }

        // Bonus observation (not marked): the sneaky negative age from Part 3.
        let bonus = null;
        if (m) {
          const r4 = await window.ITCode.run(code, ["-3", "quit", "quit"]);
          if (!r4.error && new RegExp("-" + 3 * m + "\\b").test(r4.output || "")) {
            bonus = "Bonus idea: the robot typed -3 and your calculator happily answered " +
              (-3 * m) + " pet years. Catching impossible ages is one of the extensions.";
          }
        }

        render(results, bonus);
      } catch (e) {
        box.textContent = "The tester hit a problem: " + (e && e.message ? e.message : e);
      } finally {
        btn.disabled = false;
      }
    });
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
  // Everything on this page already autosaves to localStorage as the student
  // works. That dies with the machine, so a few seconds after each change the
  // whole state (track, code for both tracks, self-checks, reflections, note)
  // is also upserted to assignment_progress, and pulled back down when the
  // page opens on any computer. localStorage stays as the offline fallback;
  // whichever side changed most recently wins.

  const SYNC_DELAY_MS = 2500;
  let syncTimer = null;
  let lastSyncedJson = "";

  function collectState() {
    const state = {
      track: track || "",
      code: {},
      checks: {},
      reflects: {},
      note: noteEl ? noteEl.value : ""
    };
    ["calc", "turtle"].forEach(function (t) {
      const v = localStorage.getItem(localKey("code-" + t));
      if (v != null) state.code[t] = v;
    });
    $all(".self-check").forEach(function (cb) {
      if (cb.checked) state.checks[cb.dataset.check] = true;
    });
    $all(".reflect").forEach(function (ta) {
      if (ta.value) state.reflects[ta.dataset.reflect] = ta.value;
    });
    return state;
  }

  // Writes a remote state into localStorage; the normal init code then reads
  // it from there. Union-merges checks and keeps local text where the remote
  // has none, so restoring can add work but never blank something out.
  function applyState(state) {
    if (!state) return;
    if (state.track) localStorage.setItem(localKey("track"), state.track);
    Object.keys(state.code || {}).forEach(function (t) {
      if (state.code[t]) localStorage.setItem(localKey("code-" + t), state.code[t]);
    });
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

  // Debounce means a change made just before closing the tab could miss its
  // push; fire one last attempt when the page is backgrounded or left.
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden" && syncTimer) {
      clearTimeout(syncTimer);
      pushProgress();
    }
  });

  // ---- Submission ---------------------------------------------------------------

  const statusEl = $("#submit-status");
  const noteEl = $("#submit-note");
  const submitBtn = $("#submit-btn");

  function setStatus(html, kind) {
    if (!statusEl) return;
    statusEl.className = "submit-status" + (kind ? " " + kind : "");
    statusEl.innerHTML = html;
  }

  // Submitting is just a flag: the code, note, checks and reflections are
  // already synced to assignment_progress. "Submit" stamps submitted_at so
  // the teacher can see the student marked it ready; editing afterwards keeps
  // syncing so the teacher always sees the latest.
  function showSubmitted(when) {
    const date = when ? new Date(when).toLocaleString("en-AU", {
      day: "numeric", month: "short", hour: "numeric", minute: "2-digit"
    }) : "";
    setStatus(
      "&#10003; Marked as ready to grade" +
      (track ? " (" + escapeHtml(TRACKS[track] || track) + ")" : "") +
      (date ? " &middot; " + escapeHtml(date) : "") +
      ". You can keep editing and resubmit any time; your teacher always sees your latest.",
      "ok"
    );
    if (submitBtn) submitBtn.textContent = "Submit again";
  }

  async function loadSubmission() {
    if (window.ITBasics.isOnline()) {
      const sb = window.ITBasics.client();
      const res = await sb.from("assignment_progress")
        .select("*")
        .eq("student_code", student.code)
        .eq("assignment", ASSIGNMENT)
        .maybeSingle();
      if (!res.error && res.data && res.data.submitted_at) { showSubmitted(res.data.submitted_at); return; }
      if (!res.error) return; // online, just not submitted yet
    }
    const local = localStorage.getItem(localKey("submitted-at"));
    if (local) showSubmitted(local);
  }

  async function submit() {
    if (!track) {
      setStatus("Pick your path first (calculator or turtle), then submit.", "error");
      return;
    }
    const code = runner.getCode();
    if (!code || code.trim().length < 20) {
      setStatus("There's not much code in the editor yet. Load your program first, then submit.", "error");
      return;
    }
    if (code.indexOf("____") !== -1) {
      setStatus("Your code still has a ____ blank in it. Fill it in, run it, then submit.", "error");
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

  // ---- Boot -----------------------------------------------------------------------

  renderSnippets();

  (async function boot() {
    // Pull any newer cloud progress into localStorage first, so the init
    // below (which reads localStorage) shows work from other machines too.
    await hydrateProgress();
    track = localStorage.getItem(localKey("track")) || track;
    initChecks();
    initTester();
    if (noteEl) {
      if (!noteEl.value) noteEl.value = localStorage.getItem(localKey("note")) || "";
      noteEl.addEventListener("input", function () {
        localStorage.setItem(localKey("note"), noteEl.value);
        scheduleSync();
      });
    }
    applyTrack(track, false);
    if (track) runner.reloadSaved();
    loadSubmission();
  })();

  window.addEventListener("itbasics:auth", function (e) {
    if (!e.detail || !e.detail.student) location.replace("/");
  });
})();
