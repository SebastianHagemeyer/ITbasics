/* game-maker.js
 *
 * Task 3 "Make your own game": a Sandbox-style editor with starter templates,
 * a design-notes form, and a Publish button that pushes the game to the class
 * gallery via window.ITBasics.publishGame. Also lists the student's own
 * published games so they can update or unpublish them.
 */
(function () {
  "use strict";

  const TEMPLATES = [
    {
      title: "Blank: move a sprite",
      desc: "One sprite you steer with the arrow keys. Build from here.",
      code:
        "import game\n\n" +
        "game.window(480, 360)\n" +
        'hero = game.sprite("chicken", 240, 180, size=48)\n\n' +
        "while game.playing():\n" +
        '    if game.pressed("left"):  hero.x = hero.x - 5\n' +
        '    if game.pressed("right"): hero.x = hero.x + 5\n' +
        '    if game.pressed("up"):    hero.y = hero.y - 5\n' +
        '    if game.pressed("down"):  hero.y = hero.y + 5\n' +
        "    game.frame()\n"
    },
    {
      title: "Catcher",
      desc: "Move the basket, catch the falling eggs, keep score.",
      code:
        "import game\n" +
        "import random\n\n" +
        'game.window(480, 360, background="#0b1020")\n' +
        'basket = game.sprite("basket", 240, 330, size=52)\n' +
        'egg = game.sprite("egg", random.randint(30, 450), 0, size=34)\n' +
        "score = 0\n" +
        'board = game.label("Score: 0", 60, 24, size=22)\n\n' +
        "while game.playing():\n" +
        '    if game.pressed("left"):  basket.x = basket.x - 8\n' +
        '    if game.pressed("right"): basket.x = basket.x + 8\n' +
        "    egg.y = egg.y + 5\n" +
        "    if basket.touches(egg):\n" +
        "        score = score + 1\n" +
        '        board.content = "Score: " + str(score)\n' +
        "        egg.x = random.randint(30, 450)\n" +
        "        egg.y = 0\n" +
        "    if egg.y > 360:\n" +
        "        egg.x = random.randint(30, 450)\n" +
        "        egg.y = 0\n" +
        "    game.frame()\n"
    },
    {
      title: "Driver",
      desc: "A top-down car you rotate and drive, with momentum.",
      code:
        "import game\n" +
        "import math\n\n" +
        'game.window(480, 360, background="#3a7d3a")\n' +
        'car = game.sprite("car", 240, 180, size=64)\n' +
        "speed = 0\n\n" +
        "while game.playing():\n" +
        '    if game.pressed("left"):  car.angle = car.angle - 4\n' +
        '    if game.pressed("right"): car.angle = car.angle + 4\n' +
        '    if game.pressed("up"):    speed = speed + 0.4\n' +
        '    if game.pressed("down"):  speed = speed - 0.4\n' +
        "    speed = speed * 0.96\n" +
        "    a = car.angle * math.pi / 180\n" +
        "    car.x = car.x + math.cos(a) * speed\n" +
        "    car.y = car.y + math.sin(a) * speed\n" +
        "    game.frame()\n"
    }
  ];

  const editor = document.getElementById("sandbox-code");
  const output = document.getElementById("sandbox-output");
  const runBtn = document.getElementById("sandbox-run");
  const clearBtn = document.querySelector(".sandbox-clear");
  if (!editor || !output || !runBtn || !window.PyRun) return;

  function usesTurtle(code) {
    return /(^|\n)\s*(import\s+turtle|from\s+turtle\s+import)/.test(code || "");
  }
  function usesGame(code) {
    return /(^|\n)\s*(import\s+game|from\s+game\s+import)/.test(code || "");
  }
  function updatePanels(code) {
    const src = code == null ? runner.getCode() : code;
    const tp = document.getElementById("turtle-panel");
    if (tp) tp.hidden = !usesTurtle(src);
    const gp = document.getElementById("game-panel");
    if (gp) gp.hidden = !usesGame(src);
  }

  const runner = window.PyRun.create({
    editor: editor,
    output: output,
    runBtn: runBtn,
    storageKey: "itbasics-gamemaker-code",
    defaultCode: TEMPLATES[0].code,
    onChange: function (code) { updatePanels(code); },
    onRunStart: function () {
      if (usesGame(runner.getCode())) {
        const cv = document.getElementById("game-canvas");
        if (cv) cv.focus();
      }
    },
    turtle: {
      canvas: document.getElementById("turtle-canvas"),
      sprite: document.getElementById("turtle-sprite")
    },
    game: { canvas: document.getElementById("game-canvas") }
  });

  if (clearBtn) clearBtn.addEventListener("click", function () { runner.clearOutput(); });

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function elVal(id) { const e = document.getElementById(id); return e ? e.value : ""; }
  function setVal(id, v) { const e = document.getElementById(id); if (e) e.value = v == null ? "" : v; }

  // --- templates ---
  const tRow = document.getElementById("gm-templates");
  if (tRow) {
    TEMPLATES.forEach(function (t) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gm-template-card";
      btn.innerHTML =
        '<span class="gm-template-title">' + esc(t.title) + "</span>" +
        '<span class="gm-template-desc">' + esc(t.desc) + "</span>";
      btn.addEventListener("click", function () {
        runner.setCode(t.code);
        updatePanels(t.code);
        editor.focus();
      });
      tRow.appendChild(btn);
    });
  }

  // --- publish ---
  const statusEl = document.getElementById("gm-status");
  function status(msg, kind) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.className = "gm-status" + (kind ? " gm-status-" + kind : "");
  }

  const publishBtn = document.getElementById("gm-publish");
  if (publishBtn) publishBtn.addEventListener("click", async function () {
    const title = (elVal("gm-title") || "").trim();
    const meta = {
      start: elVal("gm-start"),
      controls: (elVal("gm-controls") || "").trim(),
      score: elVal("gm-score"),
      added: (elVal("gm-added") || "").trim()
    };
    if (!title) { status("Give your game a title first.", "err"); document.getElementById("gm-title").focus(); return; }
    status("Publishing...");
    const res = await window.ITBasics.publishGame(title, runner.getCode(), meta);
    if (res && res.ok) {
      status('Published "' + title + '". It is live in your class gallery.', "ok");
      renderMine();
    } else {
      status((res && res.error) || "Could not publish. Try again.", "err");
    }
  });

  // --- my published games ---
  function fillMeta(m) {
    m = m || {};
    setVal("gm-start", m.start || "a template");
    setVal("gm-controls", m.controls);
    setVal("gm-score", m.score || "yes");
    setVal("gm-added", m.added);
  }

  async function renderMine() {
    const box = document.getElementById("gm-mine");
    if (!box) return;
    if (!window.ITBasics || !window.ITBasics.getSession()) return;
    const games = await window.ITBasics.myGames();
    box.innerHTML = "";
    if (!games.length) {
      box.innerHTML = '<p class="gm-empty">Nothing published yet. Build a game above, fill in the notes, and press Publish.</p>';
      return;
    }
    games.forEach(function (g) {
      const card = document.createElement("div");
      card.className = "gm-mine-card";
      const title = document.createElement("span");
      title.className = "gm-mine-title";
      title.textContent = g.title;
      card.appendChild(title);
      if (g.hidden) {
        const tag = document.createElement("span");
        tag.className = "gm-hidden-tag";
        tag.textContent = "hidden by teacher";
        card.appendChild(tag);
      }
      const spacer = document.createElement("span");
      spacer.className = "gm-mine-spacer";
      card.appendChild(spacer);

      const load = document.createElement("button");
      load.type = "button";
      load.className = "btn btn-ghost";
      load.textContent = "Load into editor";
      load.addEventListener("click", function () {
        runner.setCode(g.code);
        setVal("gm-title", g.title);
        fillMeta(g.meta);
        updatePanels(g.code);
        editor.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      const del = document.createElement("button");
      del.type = "button";
      del.className = "btn btn-ghost gm-del";
      del.textContent = "Unpublish";
      del.addEventListener("click", async function () {
        await window.ITBasics.deleteGame(g.id);
        renderMine();
      });
      card.appendChild(load);
      card.appendChild(del);
      box.appendChild(card);
    });
  }

  // --- load from the student's saved Sandbox snippets ("My code") ---
  async function renderSnippets() {
    const box = document.getElementById("gm-snippets");
    if (!box) return;
    if (!window.ITBasics || !window.ITBasics.getSession() || !window.ITBasics.listSnippets) {
      box.innerHTML = "";
      return;
    }
    const snips = await window.ITBasics.listSnippets();
    box.innerHTML = "";
    if (!snips.length) {
      box.innerHTML = '<p class="gm-empty">No saved snippets yet. Save code in the Sandbox and it shows up here.</p>';
      return;
    }
    snips.forEach(function (sn) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "gm-snippet-chip";
      chip.textContent = sn.name;
      chip.title = "Load \"" + sn.name + "\" into the editor";
      chip.addEventListener("click", function () {
        runner.setCode(sn.code);
        updatePanels(sn.code);
        editor.focus();
      });
      box.appendChild(chip);
    });
  }

  function refreshAll() { renderMine(); renderSnippets(); }

  updatePanels();
  refreshAll();
  window.addEventListener("itbasics:auth", refreshAll);
})();
