/*
 * Python Sandbox page. The actual Python engine (Pyodide with input(),
 * interruptible time.sleep, the Stop button, clear(), print(col=) and the
 * canvas turtle) lives in pyrun.js and is shared with the assignment pages.
 * This file owns the page furniture: starter code, the example snippet
 * cards, private saves ("My code") and toasts. The turtle window appears
 * automatically when the code imports turtle and hides when it doesn't.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "itbasics-sandbox-code";

  const DEFAULT_CODE =
    '# Try editing and hit Run.\n' +
    '# Press Ctrl+Enter to run, Tab to indent.\n\n' +
    'print("Hello, Hallam!")\n\n' +
    '# A loop\n' +
    'for i in range(5):\n' +
    '    print("Number:", i, "squared is", i ** 2)\n\n' +
    '# A list\n' +
    'names = ["Ava", "Saxon", "Kamran"]\n' +
    'for name in names:\n' +
    '    print("Hey,", name + "!")\n\n' +
    '# Maths\n' +
    'total = sum(range(1, 11))\n' +
    'print("Sum of 1 to 10 is", total)\n';

  // Click-to-load snippets. Each gets a card at the bottom of the page.
  const EXAMPLES = [
    {
      title: "Star triangle",
      desc: "Right-aligned stars climbing up.",
      code:
        "x = 1\n" +
        "while x < 10:\n" +
        "    print('%10s' % ('*' * x))\n" +
        "    x = x + 1\n"
    },
    {
      title: "Diamond",
      desc: "Centered stars going up then back down.",
      code:
        "n = 5\n" +
        "for i in range(n):\n" +
        "    print(' ' * (n - i - 1) + '*' * (2 * i + 1))\n" +
        "for i in range(n - 2, -1, -1):\n" +
        "    print(' ' * (n - i - 1) + '*' * (2 * i + 1))\n"
    },
    {
      title: "Times table",
      desc: "The 7 times table, one row at a time.",
      code:
        "n = 7\n" +
        "for i in range(1, 13):\n" +
        "    print(n, 'x', i, '=', n * i)\n"
    },
    {
      title: "FizzBuzz",
      desc: "Count 1 to 20. Fizz, Buzz, FizzBuzz on the multiples.",
      code:
        "for i in range(1, 21):\n" +
        "    if i % 15 == 0:\n" +
        "        print('FizzBuzz')\n" +
        "    elif i % 3 == 0:\n" +
        "        print('Fizz')\n" +
        "    elif i % 5 == 0:\n" +
        "        print('Buzz')\n" +
        "    else:\n" +
        "        print(i)\n"
    },
    {
      title: "Turtle: first drawing",
      desc: "import turtle opens the drawing window. Draw a square.",
      code:
        "import turtle\n" +
        "\n" +
        "for i in range(4):\n" +
        "    turtle.forward(120)\n" +
        "    turtle.left(90)\n"
    },
    {
      title: "Turtle: rainbow spiral",
      desc: "The loop grows the size and rotates the colour.",
      code:
        "import turtle\n" +
        "\n" +
        'colors = ["red", "orange", "yellow", "green", "blue", "purple"]\n' +
        "turtle.speed(10)\n" +
        "\n" +
        "for i in range(48):\n" +
        "    turtle.pencolor(colors[i % 6])\n" +
        "    turtle.forward(i * 5)\n" +
        "    turtle.left(60)\n"
    },
    {
      title: "Game: move the chicken",
      desc: "import game. Steer an emoji with the arrow keys.",
      code:
        "import game\n" +
        "\n" +
        "game.window(480, 360)\n" +
        'chicken = game.sprite("🐔", 240, 300, size=48)\n' +
        "\n" +
        "# The game loop: read the keys, move, draw one frame, repeat.\n" +
        "while game.playing():\n" +
        '    if game.pressed("left"):  chicken.x = chicken.x - 6\n' +
        '    if game.pressed("right"): chicken.x = chicken.x + 6\n' +
        '    if game.pressed("up"):    chicken.y = chicken.y - 6\n' +
        '    if game.pressed("down"):  chicken.y = chicken.y + 6\n' +
        "    game.frame()\n"
    },
    {
      title: "Game: catch the eggs",
      desc: "Move the basket to catch falling eggs. Miss 3 and it's over.",
      code:
        "import game\n" +
        "import random\n" +
        "\n" +
        'game.window(480, 360, background="#0b1020")\n' +
        'basket = game.sprite("🧺", 240, 330, size=48)\n' +
        'egg = game.sprite("🥚", random.randint(30, 450), 0, size=34)\n' +
        "misses = 0\n" +
        "\n" +
        "# The scoreboard is just a label you draw. Update its text to change it.\n" +
        'board = game.label("Score: 0", 12, 22, size=22)\n' +
        "\n" +
        "while game.playing():\n" +
        '    if game.pressed("left"):  basket.x = basket.x - 8\n' +
        '    if game.pressed("right"): basket.x = basket.x + 8\n' +
        "\n" +
        "    egg.y = egg.y + 5          # the egg falls\n" +
        "\n" +
        "    if basket.touches(egg):    # caught it!\n" +
        "        game.score(1)\n" +
        '        board.text = "Score: " + str(game.score())\n' +
        "        egg.x = random.randint(30, 450)\n" +
        "        egg.y = 0\n" +
        "    elif egg.y > 360:          # it hit the floor\n" +
        "        misses = misses + 1\n" +
        "        egg.x = random.randint(30, 450)\n" +
        "        egg.y = 0\n" +
        "        if misses >= 3:\n" +
        '            game.game_over("Game Over! Score: " + str(game.score()))\n' +
        "\n" +
        "    game.frame()\n"
    },
    {
      title: "Roll a dice",
      desc: "Random rolls, 10 in a row.",
      code:
        "import random\n" +
        "\n" +
        "for i in range(10):\n" +
        "    roll = random.randint(1, 6)\n" +
        "    print('Roll', i + 1, ':', roll)\n"
    },
    {
      title: "Heat map dice",
      desc: "Rolls coloured red (cold) to green (hot) by value.",
      code:
        "import random\n" +
        "import time\n" +
        "\n" +
        "for i in range(10):\n" +
        "    roll = random.randint(1, 6)\n" +
        "    hue = (roll - 1) * 24   # 0=red ... 120=green\n" +
        "    color = f\"hsl({hue}, 100%, 50%)\"\n" +
        "    print(f\"Roll {i+1}: {'*' * roll}  ({roll})\", col=color)\n" +
        "    time.sleep(0.2)\n"
    },
    {
      title: "Letter staircase",
      desc: "Build up a word, one letter per line.",
      code:
        "word = 'PYTHON'\n" +
        "for i in range(1, len(word) + 1):\n" +
        "    print(word[:i])\n"
    },
    {
      title: "Countdown",
      desc: "Ask for a number, then count down to GO!",
      code:
        "import time\n" +
        "\n" +
        "n = int(input(\"Count down from: \"))\n" +
        "for i in range(n, 0, -1):\n" +
        "    print(i)\n" +
        "    time.sleep(0.5)\n" +
        "print(\"GO!\")\n"
    },
    {
      title: "Loading bar",
      desc: "Animated progress bar filling step by step.",
      code:
        "import time\n" +
        "\n" +
        "n = int(input(\"How many steps? \"))\n" +
        "for i in range(n + 1):\n" +
        "    print('[' + '=' * i + ' ' * (n - i) + ']')\n" +
        "    time.sleep(0.1)\n" +
        "print(\"Done!\")\n"
    },
    {
      title: "Fibonacci",
      desc: "Each number is the sum of the previous two.",
      code:
        "count = int(input(\"How many Fibonacci numbers? \"))\n" +
        "a, b = 0, 1\n" +
        "for _ in range(count):\n" +
        "    print(a)\n" +
        "    a, b = b, a + b\n"
    },
    {
      title: "Hailstone",
      desc: "Halve if even, 3n+1 if odd. Always reaches 1!",
      code:
        "n = int(input(\"Starting number (try 27): \"))\n" +
        "print(\"Start:\", n)\n" +
        "steps = 0\n" +
        "while n != 1:\n" +
        "    n = n // 2 if n % 2 == 0 else 3 * n + 1\n" +
        "    print(n)\n" +
        "    steps += 1\n" +
        "print(\"Reached 1 in\", steps, \"steps!\")\n"
    },
    {
      title: "Spiral",
      desc: "Watch a grid of digits spiral inward, one cell per frame.",
      code:
        "import time\n" +
        "\n" +
        "n = int(input(\"Grid size (try 7): \"))\n" +
        "grid = [[' '] * n for _ in range(n)]\n" +
        "x, y, dx, dy = 0, 0, 1, 0\n" +
        "\n" +
        "for i in range(n * n):\n" +
        "    grid[y][x] = str((i + 1) % 10)\n" +
        "    nx, ny = x + dx, y + dy\n" +
        "    if not (0 <= nx < n and 0 <= ny < n) or grid[ny][nx] != ' ':\n" +
        "        dx, dy = -dy, dx\n" +
        "        nx, ny = x + dx, y + dy\n" +
        "    x, y = nx, ny\n" +
        "    # clear() wipes the output panel - then we redraw the whole grid.\n" +
        "    clear()\n" +
        "    for row in grid:\n" +
        "        print(' '.join(row))\n" +
        "    time.sleep(0.05)\n"
    },
    {
      title: "Colored spiral",
      desc: "Animated spiral with a rainbow hue rotating as it draws.",
      code:
        "import time\n" +
        "\n" +
        "n = int(input(\"Grid size (try 7): \"))\n" +
        "grid   = [[' '] * n for _ in range(n)]\n" +
        "colors = [[''] * n for _ in range(n)]\n" +
        "x, y, dx, dy = 0, 0, 1, 0\n" +
        "\n" +
        "for i in range(n * n):\n" +
        "    grid[y][x] = str((i + 1) % 10)\n" +
        "    colors[y][x] = f\"hsl({i * 360 // (n * n)}, 90%, 60%)\"\n" +
        "    nx, ny = x + dx, y + dy\n" +
        "    if not (0 <= nx < n and 0 <= ny < n) or grid[ny][nx] != ' ':\n" +
        "        dx, dy = -dy, dx\n" +
        "        nx, ny = x + dx, y + dy\n" +
        "    x, y = nx, ny\n" +
        "    clear()\n" +
        "    for r in range(n):\n" +
        "        for c in range(n):\n" +
        "            ch = grid[r][c]\n" +
        "            if ch != ' ':\n" +
        "                print(f\"{ch} \", col=colors[r][c], end='')\n" +
        "            else:\n" +
        "                print('. ', col='#444', end='')\n" +
        "        print(col='white')\n" +
        "    time.sleep(0.05)\n"
    },
    {
      title: "Sine wave",
      desc: "An ASCII wave drawn with math.sin().",
      code:
        "import math\n" +
        "\n" +
        "lines = int(input(\"How many lines? (try 40) \"))\n" +
        "for x in range(lines):\n" +
        "    y = math.sin(x / 4) * 10\n" +
        "    print(' ' * int(y + 12) + '*')\n"
    },
    {
      title: "Sierpinski triangle",
      desc: "A fractal pattern from one bitwise trick.",
      code:
        "n = int(input(\"Size - try 8, 16 or 32: \"))\n" +
        "for y in range(n):\n" +
        "    row = ''\n" +
        "    for x in range(n):\n" +
        "        row += '* ' if (x & (n - 1 - y)) == 0 else '  '\n" +
        "    print(row)\n"
    },
    {
      title: "Rainbow print",
      desc: "Colour text with print(\"hi\", col=\"#FF00AA\"). Any CSS colour works.",
      code:
        "# col= takes hex codes, colour names, rgb() or hsl()\n" +
        "print(\"Hello in red!\", col=\"red\")\n" +
        "print(\"Hex teal\",       col=\"#1abc9c\")\n" +
        "print(\"RGB orange\",     col=\"rgb(255, 165, 0)\")\n" +
        "print(\"HSL navy\",       col=\"hsl(220, 100%, 30%)\")\n" +
        "print()\n" +
        "\n" +
        "print(\"Now a rainbow:\")\n" +
        "words  = \"RED ORANGE YELLOW GREEN BLUE INDIGO VIOLET\".split()\n" +
        "colors = ['#ff0000', '#ff7f00', '#ffff00', '#00cc00', '#1e90ff', '#4b0082', '#9400d3']\n" +
        "for w, c in zip(words, colors):\n" +
        "    print(w, col=c)\n"
    },
    {
      title: "Christmas tree",
      desc: "Green tree with random coloured ornaments and a trunk.",
      code:
        "import random\n" +
        "\n" +
        "n = int(input(\"Tree height (try 8): \"))\n" +
        "GREEN = '#0aa84a'\n" +
        "BROWN = '#7b4a1a'\n" +
        "ORNAMENTS = ['#ff2b2b', '#ffd400', '#ff5cb0', '#3aaeff', '#ff8800']\n" +
        "\n" +
        "for i in range(n):\n" +
        "    pad = ' ' * (n - i - 1)\n" +
        "    print(pad, col=GREEN, end='')\n" +
        "    for j in range(2 * i + 1):\n" +
        "        if 0 < j < 2 * i and random.random() < 0.25:\n" +
        "            print('o', col=random.choice(ORNAMENTS), end='')\n" +
        "        else:\n" +
        "            print('*', col=GREEN, end='')\n" +
        "    print(col=GREEN)\n" +
        "\n" +
        "# Trunk\n" +
        "print(' ' * (n - 2), col=BROWN, end='')\n" +
        "print('|||', col=BROWN)\n"
    },
    {
      title: "Christmas tree (sparkling)",
      desc: "The tree redraws each frame, so the ornaments keep sparkling.",
      code:
        "import random\n" +
        "import time\n" +
        "\n" +
        "n = 8\n" +
        "GREEN = '#0aa84a'\n" +
        "BROWN = '#7b4a1a'\n" +
        "ORNAMENTS = ['#ff2b2b', '#ffd400', '#ff5cb0', '#3aaeff', '#ff8800']\n" +
        "\n" +
        "for frame in range(90):\n" +
        "    for i in range(n):\n" +
        "        pad = ' ' * (n - i - 1)\n" +
        "        print(pad, col=GREEN, end='')\n" +
        "        for j in range(2 * i + 1):\n" +
        "            if 0 < j < 2 * i and random.random() < 0.25:\n" +
        "                print('o', col=random.choice(ORNAMENTS), end='')\n" +
        "            else:\n" +
        "                print('*', col=GREEN, end='')\n" +
        "        print(col=GREEN)\n" +
        "    # Trunk\n" +
        "    print(' ' * (n - 2), col=BROWN, end='')\n" +
        "    print('|||', col=BROWN)\n" +
        "    time.sleep(0.5)\n" +
        "    clear()\n"
    },
    {
      title: "Caesar cipher",
      desc: "Encode OR decode a secret message by shifting letters.",
      code:
        "choice = input(\"Encode or decode? (e/d): \")\n" +
        "msg = input(\"Your message: \")\n" +
        "shift = int(input(\"Shift by how many letters? \"))\n" +
        "\n" +
        "# Decoding is just encoding in the opposite direction.\n" +
        "if choice.lower().startswith(\"d\"):\n" +
        "    shift = -shift\n" +
        "\n" +
        "out = ''\n" +
        "for ch in msg:\n" +
        "    if ch.isalpha():\n" +
        "        out += chr((ord(ch.upper()) - 65 + shift) % 26 + 65)\n" +
        "    else:\n" +
        "        out += ch\n" +
        "print('Original:', msg)\n" +
        "print('Result:  ', out)\n"
    }
  ];

  const editor   = document.getElementById("sandbox-code");
  const output   = document.getElementById("sandbox-output");
  const runBtn   = document.getElementById("sandbox-run");
  const resetBtn = document.querySelector(".sandbox-reset");
  const clearBtn = document.querySelector(".sandbox-clear");

  if (!editor || !output || !runBtn || !window.PyRun) return;

  // The turtle / game windows only appear when the program actually uses
  // them; the output console always stays for print()s.
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
    storageKey: STORAGE_KEY,
    defaultCode: DEFAULT_CODE,
    onChange: function (code) { updatePanels(code); },
    onRunStart: function () {
      // Give the game canvas focus so the arrow keys reach it immediately.
      if (usesGame(runner.getCode())) {
        const cv = document.getElementById("game-canvas");
        if (cv) cv.focus();
      }
    },
    turtle: {
      canvas: document.getElementById("turtle-canvas"),
      sprite: document.getElementById("turtle-sprite")
    },
    game: {
      canvas: document.getElementById("game-canvas")
    }
  });

  function getCode() { return runner.getCode(); }

  if (resetBtn) resetBtn.addEventListener("click", function () {
    loadInto(DEFAULT_CODE, "Reset to the example");
  });
  if (clearBtn) clearBtn.addEventListener("click", function () { runner.clearOutput(); });

  function renderExamples() {
    const grid = document.getElementById("sandbox-examples");
    if (!grid) return;
    grid.innerHTML = "";
    EXAMPLES.forEach(function (ex) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sandbox-example-card";
      btn.innerHTML =
        '<span class="sandbox-example-title">' + escapeHtml(ex.title) + '</span>' +
        '<span class="sandbox-example-desc">' + escapeHtml(ex.desc) + '</span>';
      btn.addEventListener("click", function () {
        loadInto(ex.code, 'Loaded "' + ex.title + '"');
        editor.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      grid.appendChild(btn);
    });
  }

  // Generic "swap the editor for this code, but offer Undo via a toast"
  // helper. Used by Reset, the snippet cards and My code so the UX is the
  // same everywhere - no more blocking confirm() dialogs.
  let previousCode = null;
  function loadInto(code, message) {
    const cur = getCode();
    if (cur === code) {
      showToast({ message: message + " (already there)" });
      return;
    }
    previousCode = cur;
    runner.setCode(code);
    editor.focus();
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
  }

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

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // --- "My code": private saved snippets, stored per student via ITBasics ---

  const snippetForm  = document.getElementById("snippet-save-form");
  const snippetName  = document.getElementById("snippet-name");
  const snippetGrid  = document.getElementById("snippet-grid");

  function snippetPreview(code) {
    // First non-comment, non-blank line makes the best one-line description.
    const lines = String(code || "").split("\n");
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i].trim();
      if (t && t[0] !== "#") return t.length > 60 ? t.slice(0, 57) + "…" : t;
    }
    return "(empty program)";
  }

  function snippetWhen(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return "";
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  }

  function renderSnippets(list) {
    if (!snippetGrid) return;
    snippetGrid.innerHTML = "";
    if (!list.length) {
      const p = document.createElement("p");
      p.className = "snippet-empty";
      p.textContent = "Nothing saved yet. Write something in the editor, give it a name above and hit Save.";
      snippetGrid.appendChild(p);
      return;
    }
    list.forEach(function (sn) {
      const card = document.createElement("div");
      card.className = "sandbox-example-card snippet-card";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", 'Load "' + sn.name + '"');

      const title = document.createElement("span");
      title.className = "sandbox-example-title";
      title.textContent = sn.name;

      const desc = document.createElement("span");
      desc.className = "sandbox-example-desc";
      const when = snippetWhen(sn.updated_at);
      desc.textContent = snippetPreview(sn.code) + (when ? "  ·  saved " + when : "");

      const del = document.createElement("button");
      del.type = "button";
      del.className = "snippet-delete";
      del.title = 'Delete "' + sn.name + '"';
      del.setAttribute("aria-label", 'Delete "' + sn.name + '"');
      del.textContent = "×";

      function load() {
        loadInto(sn.code, 'Loaded "' + sn.name + '"');
        editor.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      card.addEventListener("click", function (e) {
        if (e.target === del) return;
        load();
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); load(); }
      });
      del.addEventListener("click", async function (e) {
        e.stopPropagation();
        await window.ITBasics.deleteSnippet(sn.name);
        refreshSnippets();
        // Undo re-saves the same name and code, so a slip isn't fatal.
        showToast({
          message: 'Deleted "' + sn.name + '"',
          actionLabel: "Undo",
          action: async function () {
            await window.ITBasics.saveSnippet(sn.name, sn.code);
            refreshSnippets();
          }
        });
      });

      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(del);
      snippetGrid.appendChild(card);
    });
  }

  async function refreshSnippets() {
    if (!snippetGrid || !window.ITBasics || !window.ITBasics.getSession()) return;
    renderSnippets(await window.ITBasics.listSnippets());
  }

  function initSnippets() {
    if (!snippetForm || !snippetGrid) return;
    snippetForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const name = (snippetName.value || "").trim();
      if (!name) {
        snippetName.focus();
        showToast({ message: "Give your program a name first." });
        return;
      }
      const res = await window.ITBasics.saveSnippet(name, getCode());
      if (res.ok) {
        snippetName.value = "";
        showToast({ message: 'Saved "' + name + '"' });
        refreshSnippets();
      } else {
        showToast({ message: "Couldn't save: " + res.error });
      }
    });
    refreshSnippets();
    // Re-fetch when the signed-in student changes.
    window.addEventListener("itbasics:auth", refreshSnippets);
  }

  renderExamples();
  initSnippets();
  updatePanels();
})();
