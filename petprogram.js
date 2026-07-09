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
    onChange: function (code) { updateTurtlePanel(code); },
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
    if (save) localStorage.setItem(localKey("track"), track);
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

  // ---- Persisted self-checks and reflections ----------------------------------

  function initChecks() {
    $all(".self-check").forEach(function (cb) {
      const key = localKey("check-" + cb.dataset.check);
      cb.checked = localStorage.getItem(key) === "1";
      cb.addEventListener("change", function () {
        if (cb.checked) localStorage.setItem(key, "1");
        else localStorage.removeItem(key);
      });
    });
    $all(".reflect").forEach(function (ta) {
      const key = localKey("reflect-" + ta.dataset.reflect);
      ta.value = localStorage.getItem(key) || "";
      ta.addEventListener("input", function () {
        localStorage.setItem(key, ta.value);
      });
    });
  }

  // ---- Submission ---------------------------------------------------------------

  const statusEl = $("#submit-status");
  const noteEl = $("#submit-note");
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
      "&#10003; Submitted (" + escapeHtml(TRACKS[sub.track] || sub.track || "?") + ")" +
      (date ? " &middot; " + escapeHtml(date) : "") +
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
        .select("track, note, submitted_at, updated_at")
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
    const note = noteEl ? noteEl.value.trim() : "";
    const payload = {
      student_code: student.code,
      assignment: ASSIGNMENT,
      track: track,
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
  initChecks();
  applyTrack(track, false);
  if (track) runner.reloadSaved();
  loadSubmission();

  window.addEventListener("itbasics:auth", function (e) {
    if (!e.detail || !e.detail.student) location.replace("/");
  });
})();
