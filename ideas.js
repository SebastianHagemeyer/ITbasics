/* ideas.js
 *
 * Two jobs, one file, because they share the same word lists:
 *
 *   /ideas/                 the Idea Machine. Spin four slots (a star, a
 *                           twist, a goal, a danger) into one sentence, lock
 *                           the bits you like, re-roll the rest. Game mode and
 *                           website mode use the same machinery with different
 *                           lists.
 *   /topics/ideas/          the lesson widgets: the check-your-understanding
 *                           buttons, the win/fail skeleton switcher, the scope
 *                           cutter, and a mini spin so the lesson can show the
 *                           machine off before sending them to it.
 *
 * Every slot entry carries more than a label. A star knows its emoji (the game
 * engine draws emoji sprites, so the generated starter code can use it), a
 * goal knows what winning looks like, a danger knows what losing looks like.
 * That is what lets the machine hand back an MVP instead of just a funny
 * sentence: a random phrase is not an idea until you can say how a round ends.
 *
 * Nothing here is required for the pages to be readable. Every widget checks
 * for its own elements first and quietly does nothing if they are missing.
 */
(function () {
  "use strict";

  // ---------------------------------------------------------------- word lists

  // The star of the game. The emoji is the sprite the starter code draws, so
  // every one of these has to exist as a single common emoji.
  var STARS = [
    { emoji: "🐢", name: "turtles" },
    { emoji: "🐔", name: "chickens" },
    { emoji: "🐙", name: "octopuses" },
    { emoji: "🦕", name: "dinosaurs" },
    { emoji: "🐝", name: "bees" },
    { emoji: "🦔", name: "hedgehogs" },
    { emoji: "🐧", name: "penguins" },
    { emoji: "🦇", name: "bats" },
    { emoji: "🐌", name: "snails" },
    { emoji: "🦆", name: "ducks" },
    { emoji: "🐐", name: "goats" },
    { emoji: "🦩", name: "flamingos" },
    { emoji: "🐋", name: "whales" },
    { emoji: "🦀", name: "crabs" },
    { emoji: "🦋", name: "butterflies" },
    { emoji: "🐉", name: "dragons" },
    { emoji: "👻", name: "ghosts" },
    { emoji: "🤖", name: "robots" },
    { emoji: "👽", name: "aliens" },
    { emoji: "🧟", name: "zombies" },
    { emoji: "🧙", name: "wizards" },
    { emoji: "🦜", name: "parrots" },
    { emoji: "🚕", name: "taxis" },
    { emoji: "🚀", name: "rockets" },
    { emoji: "🚜", name: "tractors" },
    { emoji: "🛒", name: "shopping trolleys" },
    { emoji: "🧦", name: "socks" },
    { emoji: "🍕", name: "pizzas" },
    { emoji: "🥑", name: "avocados" },
    { emoji: "🧁", name: "cupcakes" },
    { emoji: "☂️", name: "umbrellas" },
    { emoji: "🪑", name: "chairs" },
    { emoji: "📚", name: "library books" },
    { emoji: "🗑️", name: "wheelie bins" },
    { emoji: "🧊", name: "ice cubes" },
    { emoji: "🎈", name: "balloons" },
    { emoji: "🪴", name: "house plants" },
    { emoji: "🧀", name: "cheese wheels" },
    { emoji: "🎃", name: "pumpkins" },
    { emoji: "🔦", name: "torches" }
  ];

  // The twist. This is the "weird combination" half: it is the word that turns
  // a boring noun into something you actually want to draw.
  var TWISTS = [
    "agile", "tiny", "gigantic", "invisible", "magnetic", "haunted",
    "upside-down", "exploding", "time-travelling", "robotic", "jelly",
    "flying", "sleepy", "radioactive", "royal", "bouncing", "frozen",
    "very hungry", "two-headed", "undercover", "gold-plated", "shy",
    "immortal", "teleporting"
  ];

  // The goal. win is the sentence the player should be able to finish with
  // "I did it!", which is exactly what game.game_over() announces.
  var GOALS = [
    { text: "deliver a parcel across town", win: "the parcel arrives in one piece" },
    { text: "collect 20 coins before the music stops", win: "the twentieth coin is picked up" },
    { text: "escape a maze", win: "you reach the exit tile" },
    { text: "guard a cake from thieves", win: "the cake survives one whole minute" },
    { text: "build the tallest tower they can", win: "the tower passes the marked line" },
    { text: "put out every fire in the street", win: "the last fire goes out" },
    { text: "climb to the top of a mountain", win: "you touch the flag at the top" },
    { text: "feed a very fussy monster", win: "the monster is finally full" },
    { text: "sort the rubbish into the right bins", win: "ten items land in the right bin" },
    { text: "carry a full cup of tea across a room", win: "the cup arrives still full" },
    { text: "photograph a very rare bird", win: "you get one clear photo" },
    { text: "walk a dog around the block", win: "you get home with the dog" },
    { text: "park in an impossibly tight space", win: "the car fits between the lines" },
    { text: "keep a plant alive for seven days", win: "day seven arrives and it is still green" },
    { text: "guide a lost tourist to the station", win: "the tourist reaches the platform" },
    { text: "clean a classroom before the bell", win: "the last bit of mess is gone" },
    { text: "post ten letters through the right doors", win: "all ten letters are posted" },
    { text: "rescue a kitten from a tree", win: "the kitten is back on the ground" },
    { text: "sell every ice cream before it melts", win: "the last ice cream is sold" },
    { text: "fix a leaking roof in a storm", win: "the last drip is patched" }
  ];

  // The danger. fail is the losing line: what has to happen for the run to
  // end. A game with no fail state is a screensaver.
  var DANGERS = [
    { text: "while angry people chase them", fail: "one of them catches you" },
    { text: "before a ticking clock runs out", fail: "the clock reaches zero" },
    { text: "while the floor slowly turns to lava", fail: "you touch the lava" },
    { text: "in the dark, with one flickering torch", fail: "the torch goes out" },
    { text: "while everything speeds up every ten seconds", fail: "it gets too fast to react" },
    { text: "while seagulls dive-bomb them", fail: "a seagull hits you three times" },
    { text: "with the controls reversed at random", fail: "you steer into a wall" },
    { text: "on a bridge that is falling apart", fail: "you fall through a gap" },
    { text: "while it rains bowling balls", fail: "a ball lands on you" },
    { text: "with only three lives", fail: "the third life is gone" },
    { text: "while a rival races them for it", fail: "the rival gets there first" },
    { text: "carrying something extremely fragile", fail: "the fragile thing smashes" },
    { text: "in a wind that shoves them sideways", fail: "the wind blows you off the edge" },
    { text: "while their battery drains", fail: "the battery hits zero" },
    { text: "while the screen slowly shrinks", fail: "the walls close in on you" },
    { text: "while a giant boss stomps around", fail: "the boss stomps on you" }
  ];

  // Things worth cutting from version 1. The machine suggests two, so students
  // see "for later" as a normal part of designing rather than as giving up.
  var LATER = [
    "a title screen", "sound effects", "a second level", "a shop",
    "a high score table", "a boss fight", "a story cutscene",
    "a two-player mode", "power-ups", "an animated background",
    "a difficulty setting", "hand-drawn art instead of emoji"
  ];

  // ---- website mode -------------------------------------------------------
  var SITE_KINDS = [
    { text: "a fan page", build: "one page about the thing you love most" },
    { text: "a review site", build: "five reviews, each with a score out of ten" },
    { text: "a top ten list", build: "a numbered list, best at the top" },
    { text: "a how-to guide", build: "numbered steps with a picture for each" },
    { text: "a fact file", build: "a heading, a photo, and eight facts" },
    { text: "a tier list", build: "rows from best to worst, with names in each" },
    { text: "a spotter's guide", build: "a picture and one line for each thing to spot" },
    { text: "a recipe book", build: "one recipe per page, ingredients then method" },
    { text: "a countdown page", build: "a big date and why it matters" },
    { text: "a museum page", build: "a gallery of pictures, each with a caption" },
    { text: "a survival guide", build: "ten survival tips, worst danger first" },
    { text: "a hall of fame", build: "a table of names, dates and what they did" },
    { text: "a comparison page", build: "two columns, the same questions asked of both" },
    { text: "a club sign-up page", build: "what the club is, when it meets, how to join" },
    { text: "a timeline", build: "dates down the page, oldest first" },
    { text: "a beginner's tips page", build: "the ten things you wish you had known" }
  ];

  var WEB_TOPICS = [
    "skateboards", "Minecraft farms", "trainers", "dog breeds", "video game bosses",
    "football boots", "old games consoles", "chess openings", "sandwiches",
    "the planets", "roller coasters", "bikes", "cats", "hot sauces", "sharks",
    "bad film sequels", "school dinners", "mechanical keyboards", "trains",
    "board games", "cars", "birds in your garden", "phone cases", "biscuits"
  ];

  var SITE_TWISTS = [
    "ranked worst to best, on purpose",
    "written by a very grumpy reviewer",
    "for someone who has thirty seconds",
    "in the style of a 1998 website",
    "where every fact is twelve words or fewer",
    "aimed at your grandparents",
    "with a photo for every single entry",
    "with one deliberate lie for the reader to spot",
    "that a total beginner could follow",
    "where everything is rated in bananas",
    "with a joke in every caption",
    "that fits on one screen with no scrolling"
  ];

  // ---------------------------------------------------------------- helpers

  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  function pickDifferent(list, current) {
    if (list.length < 2) return list[0];
    var next = pick(list);
    var guard = 0;
    while (next === current && guard++ < 20) next = pick(list);
    return next;
  }

  function el(id) { return document.getElementById(id); }

  function text(node, value) { if (node) node.textContent = value; }

  function capital(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function commas(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

  // The star names are plural because they read better in the sentence ("agile
  // turtles"), but the MVP line talks about the one sprite you steer. Two rules
  // cover every name in the list: torches drops "es", pizzas drops "s".
  function singular(name) {
    if (/(ch|sh|s|x)es$/.test(name)) return name.replace(/es$/, "");
    return name.replace(/s$/, "");
  }

  // ---------------------------------------------------------------- the machine

  // Both modes are the same shape: a list of slots, each with a list to draw
  // from and a way to print itself. Everything below works off this table, so
  // adding a slot is a data change, not a code change.
  var MODES = {
    game: {
      label: "game",
      slots: [
        { key: "twist", title: "The twist", list: TWISTS, show: function (v) { return capital(v); } },
        { key: "star",  title: "The star",  list: STARS,  show: function (v) { return v.emoji + " " + v.name; } },
        { key: "goal",  title: "The goal",  list: GOALS,  show: function (v) { return capital(v.text); } },
        { key: "danger", title: "The danger", list: DANGERS, show: function (v) { return capital(v.text); } }
      ],
      sentence: function (p) {
        return capital(p.twist) + " " + p.star.name + " must " + p.goal.text + ", " + p.danger.text + ".";
      }
    },
    web: {
      label: "website",
      slots: [
        { key: "kind",  title: "The kind of site", list: SITE_KINDS, show: function (v) { return capital(v.text); } },
        { key: "topic", title: "About",            list: WEB_TOPICS, show: function (v) { return capital(v); } },
        { key: "twist", title: "The twist",        list: SITE_TWISTS, show: function (v) { return capital(v); } }
      ],
      sentence: function (p) {
        return capital(p.kind.text) + " about " + p.topic + ", " + p.twist + ".";
      }
    }
  };

  function initMachine() {
    var root = el("idea-machine");
    if (!root) return;

    var slotBox = el("im-slots");
    var sentence = el("im-sentence");
    var mvp = el("im-mvp");
    var count = el("im-count");
    var codeBox = el("im-code");
    var shortlistBox = el("im-shortlist");
    var modeName = "game";
    var picks = {};        // slot key -> chosen entry, for the live mode
    var locked = {};       // slot key -> true while the student is holding it
    var shortlist = [];

    function mode() { return MODES[modeName]; }

    function spin(only) {
      mode().slots.forEach(function (slot) {
        if (only && slot.key !== only) return;
        if (!only && locked[slot.key]) return;
        picks[slot.key] = pickDifferent(slot.list, picks[slot.key]);
      });
      render();
    }

    function combinations() {
      return mode().slots.reduce(function (n, s) { return n * s.list.length; }, 1);
    }

    // The starter code is deliberately the smallest thing that runs: a window,
    // one sprite you can steer, one label. Everything else is theirs to add.
    function starterCode() {
      if (modeName === "web") {
        return "<h1>" + capital(picks.topic) + "</h1>\n" +
          "<p>" + capital(picks.kind.text) + ", " + picks.twist + ".</p>\n" +
          "<ul>\n  <li>First one</li>\n  <li>Second one</li>\n  <li>Third one</li>\n</ul>";
      }
      var e = picks.star.emoji;
      return "import game\n\n" +
        "game.window(480, 360)\n" +
        "hero = game.sprite(\"" + e + "\", 240, 300, size=44)\n" +
        "board = game.label(\"Score: 0\", 70, 24)\n\n" +
        "while game.playing():\n" +
        "    if game.pressed(\"left\"):  hero.x = hero.x - 6\n" +
        "    if game.pressed(\"right\"): hero.x = hero.x + 6\n" +
        "    game.frame()";
    }

    function renderSlots() {
      slotBox.innerHTML = "";
      mode().slots.forEach(function (slot) {
        var card = document.createElement("div");
        card.className = "im-slot" + (locked[slot.key] ? " is-locked" : "");

        var title = document.createElement("p");
        title.className = "im-slot-title";
        title.textContent = slot.title;

        var value = document.createElement("p");
        value.className = "im-slot-value";
        value.textContent = slot.show(picks[slot.key]);

        var actions = document.createElement("div");
        actions.className = "im-slot-actions";

        var again = document.createElement("button");
        again.type = "button";
        again.className = "btn btn-ghost im-mini";
        again.textContent = "Re-roll";
        again.addEventListener("click", function () { spin(slot.key); });

        var lock = document.createElement("button");
        lock.type = "button";
        lock.className = "btn btn-ghost im-mini im-lock";
        lock.textContent = locked[slot.key] ? "Locked" : "Lock";
        lock.setAttribute("aria-pressed", locked[slot.key] ? "true" : "false");
        lock.addEventListener("click", function () {
          locked[slot.key] = !locked[slot.key];
          render();
        });

        actions.appendChild(again);
        actions.appendChild(lock);
        card.appendChild(title);
        card.appendChild(value);
        card.appendChild(actions);
        slotBox.appendChild(card);
      });
    }

    function renderMvp() {
      var rows;
      if (modeName === "web") {
        rows = [
          ["One page", "A heading, a picture, and one list. That is a website."],
          ["Build first", capital(picks.kind.build) + "."],
          ["The twist", capital(picks.twist) + ". Do this bit properly, it is the reason anyone visits."],
          ["For later", capital(pick(["a second page", "a menu bar", "a colour theme", "a contact form", "a photo gallery"])) + "."]
        ];
      } else {
        var cutA = pick(LATER);
        rows = [
          ["You control", picks.star.emoji + " one " + singular(picks.star.name) + ", moved with two keys."],
          ["You win when", capital(picks.goal.win) + "."],
          ["You lose when", capital(picks.danger.fail) + "."],
          ["For later", capital(cutA) + ", and " + pickDifferent(LATER, cutA) + "."]
        ];
      }
      mvp.innerHTML = "";
      var head = document.createElement("p");
      head.className = "im-mvp-head";
      head.textContent = "The smallest version you could actually finish";
      mvp.appendChild(head);
      var grid = document.createElement("dl");
      grid.className = "im-mvp-grid";
      rows.forEach(function (row) {
        var dt = document.createElement("dt");
        dt.textContent = row[0];
        var dd = document.createElement("dd");
        dd.textContent = row[1];
        grid.appendChild(dt);
        grid.appendChild(dd);
      });
      mvp.appendChild(grid);
    }

    function render() {
      renderSlots();
      text(sentence, mode().sentence(picks));
      renderMvp();
      if (codeBox) codeBox.textContent = starterCode();
      text(el("im-starter-title"), modeName === "web"
        ? "A page skeleton to start from"
        : "Something to paste in and run");
      text(count, "This machine can spell out " + commas(combinations()) +
        " different " + mode().label + " ideas. You only need one.");
    }

    // The browsable version of the same data. Some students would rather read
    // the lists and mix them by eye than spin; clicking a word drops it into
    // its slot and locks it, so browsing and spinning are the same tool.
    function renderLists() {
      var host = el("im-lists");
      if (!host) return;
      host.innerHTML = "";
      mode().slots.forEach(function (slot) {
        var block = document.createElement("details");
        block.className = "im-list";
        var sum = document.createElement("summary");
        sum.textContent = slot.title + " (" + slot.list.length + " to choose from)";
        block.appendChild(sum);
        var wrap = document.createElement("div");
        wrap.className = "im-list-chips";
        slot.list.forEach(function (item) {
          var chip = document.createElement("button");
          chip.type = "button";
          chip.className = "im-list-chip";
          chip.textContent = slot.show(item);
          chip.addEventListener("click", function () {
            picks[slot.key] = item;
            locked[slot.key] = true;
            render();
            if (sentence) sentence.scrollIntoView({ behavior: "smooth", block: "center" });
          });
          wrap.appendChild(chip);
        });
        block.appendChild(wrap);
        host.appendChild(block);
      });
    }

    // ---- the shortlist ---------------------------------------------------
    function renderShortlist() {
      if (!shortlistBox) return;
      shortlistBox.innerHTML = "";
      if (!shortlist.length) {
        var empty = document.createElement("p");
        empty.className = "im-empty";
        empty.textContent = "Nothing kept yet. Spin until one makes you laugh, then press Keep this one.";
        shortlistBox.appendChild(empty);
        return;
      }
      var list = document.createElement("ul");
      list.className = "im-kept";
      shortlist.forEach(function (line, i) {
        var li = document.createElement("li");
        var span = document.createElement("span");
        span.textContent = line;
        var drop = document.createElement("button");
        drop.type = "button";
        drop.className = "btn btn-ghost im-mini";
        drop.textContent = "Remove";
        drop.addEventListener("click", function () {
          shortlist.splice(i, 1);
          renderShortlist();
          saveShortlist();
        });
        li.appendChild(span);
        li.appendChild(drop);
        list.appendChild(li);
      });
      shortlistBox.appendChild(list);
    }

    function saveShortlist() {
      if (!window.ITBasics || !window.ITBasics.saveProgress) return;
      try { window.ITBasics.saveProgress("ideas-shortlist", { kept: shortlist }); } catch (e) {}
    }

    function loadShortlist() {
      if (!window.ITBasics || !window.ITBasics.loadProgress) return;
      Promise.resolve(window.ITBasics.loadProgress("ideas-shortlist")).then(function (saved) {
        if (saved && Array.isArray(saved.kept)) {
          shortlist = saved.kept.slice(0, 8);
          renderShortlist();
        }
      }).catch(function () { /* offline: the list still works for this visit */ });
    }

    // ---- wiring ----------------------------------------------------------
    var spinBtn = el("im-spin");
    if (spinBtn) spinBtn.addEventListener("click", function () { spin(null); });

    var keepBtn = el("im-save");
    if (keepBtn) {
      keepBtn.addEventListener("click", function () {
        var line = mode().sentence(picks);
        if (shortlist.indexOf(line) === -1) shortlist.unshift(line);
        shortlist = shortlist.slice(0, 8);
        renderShortlist();
        saveShortlist();
      });
    }

    var copyBtn = el("im-copy");
    if (copyBtn && codeBox) {
      copyBtn.addEventListener("click", function () {
        var done = function () {
          copyBtn.textContent = "Copied";
          setTimeout(function () { copyBtn.textContent = "Copy the code"; }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(codeBox.textContent).then(done, function () {});
        } else {
          var sel = window.getSelection();
          var range = document.createRange();
          range.selectNodeContents(codeBox);
          sel.removeAllRanges();
          sel.addRange(range);
          try { document.execCommand("copy"); done(); } catch (e) {}
        }
      });
    }

    Array.prototype.forEach.call(root.querySelectorAll(".im-mode"), function (btn) {
      btn.addEventListener("click", function () {
        modeName = btn.dataset.mode === "web" ? "web" : "game";
        root.dataset.mode = modeName;
        Array.prototype.forEach.call(root.querySelectorAll(".im-mode"), function (b) {
          var on = b === btn;
          b.classList.toggle("is-on", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        locked = {};
        picks = {};
        spin(null);
        renderLists();
      });
    });

    spin(null);
    renderLists();
    renderShortlist();
    loadShortlist();
  }

  // ------------------------------------------------- lesson: the mini spinner

  function initTaster() {
    var out = el("gd-taster-out");
    var btn = el("gd-taster-btn");
    if (!out || !btn) return;
    function roll() {
      var star = pick(STARS);
      out.textContent = capital(pick(TWISTS)) + " " + star.name + " must " +
        pick(GOALS).text + ", " + pick(DANGERS).text + ".";
    }
    btn.addEventListener("click", roll);
    roll();
  }

  // ------------------------------------------- lesson: the win/fail skeleton

  // Four real games, stripped back to the same four parts, so the diagram
  // stops being an abstract shape and starts being a tool they can point at
  // their own idea.
  var SKELETONS = [
    { name: "Pac-Man", win: "Eat every dot in the maze", fail: "A ghost touches you",
      action: "Steer, turn corners, grab a power pellet", obstacle: "Four ghosts and dead ends" },
    { name: "Flappy Bird", win: "Get through the next gap, forever", fail: "You hit a pipe or the ground",
      action: "One tap to flap", obstacle: "Gravity and narrow gaps" },
    { name: "Taxi driver", win: "Deliver the passenger", fail: "Time runs out",
      action: "Reckless driving", obstacle: "A ticking clock" },
    { name: "Catch the eggs", win: "Catch 20 eggs", fail: "You miss three eggs",
      action: "Slide the basket left and right", obstacle: "Eggs fall faster and faster" }
  ];

  function initSkeleton() {
    var host = el("gd-skeleton");
    if (!host) return;
    var win = el("sk-win"), fail = el("sk-fail"),
        action = el("sk-action"), obstacle = el("sk-obstacle");

    function show(sk, btn) {
      text(win, sk.win);
      text(fail, sk.fail);
      text(action, sk.action);
      text(obstacle, sk.obstacle);
      Array.prototype.forEach.call(host.querySelectorAll(".gd-pick"), function (b) {
        b.classList.toggle("is-on", b === btn);
      });
    }

    var picks = host.querySelectorAll(".gd-pick");
    Array.prototype.forEach.call(picks, function (btn, i) {
      btn.addEventListener("click", function () { show(SKELETONS[i], btn); });
    });
    if (picks.length) show(SKELETONS[0], picks[0]);
  }

  // ---------------------------------------------- lesson: the scope cutter

  // Click features off the dream game until three are left. The counter does
  // the teaching: the point lands when they have to choose what to lose.
  function initCutter() {
    var host = el("gd-cutter");
    if (!host) return;
    var status = el("gd-cutter-status");
    var chips = Array.prototype.slice.call(host.querySelectorAll(".gd-chip"));
    var reset = el("gd-cutter-reset");

    function left() {
      return chips.filter(function (c) { return !c.classList.contains("is-cut"); }).length;
    }

    function paint() {
      var n = left();
      var msg;
      if (n > 8) msg = n + " features left. This is a two-year project and you have four lessons.";
      else if (n > 5) msg = n + " features left. Better, but you would still be building it at Christmas.";
      else if (n > 3) msg = n + " features left. Nearly. Which one could you live without?";
      else if (n === 3) msg = "Three features. That is an MVP: small enough to finish, real enough to play.";
      else msg = n + " features left. That might be too thin now. Put one back.";
      text(status, msg);
      status.className = "gd-cutter-status" + (n === 3 ? " is-good" : "");
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chip.classList.toggle("is-cut");
        chip.setAttribute("aria-pressed", chip.classList.contains("is-cut") ? "true" : "false");
        paint();
      });
    });

    if (reset) {
      reset.addEventListener("click", function () {
        chips.forEach(function (c) {
          c.classList.remove("is-cut");
          c.setAttribute("aria-pressed", "false");
        });
        paint();
      });
    }
    paint();
  }

  // --------------------------------------------- lesson: check-your-understanding

  // Same behaviour as the other module pages: first correct answer locks it in
  // and reveals the explanation, wrong answers grey out and let them try again.
  function initChecks() {
    document.querySelectorAll(".kcheck").forEach(function (kc) {
      var answer = kc.dataset.answer;
      var feedback = kc.querySelector(".kcheck-feedback");
      var explain = kc.querySelector(".kcheck-explain");
      var solved = false;
      kc.querySelectorAll(".kcheck-opt").forEach(function (opt) {
        opt.addEventListener("click", function () {
          if (solved) return;
          if (opt.dataset.key === answer) {
            solved = true;
            opt.classList.add("correct");
            feedback.textContent = "Correct!";
            feedback.className = "kcheck-feedback correct";
            feedback.hidden = false;
            if (explain) explain.hidden = false;
            kc.querySelectorAll(".kcheck-opt").forEach(function (o) { o.disabled = true; });
          } else {
            opt.classList.add("wrong");
            opt.disabled = true;
            feedback.textContent = "Not quite, try again.";
            feedback.className = "kcheck-feedback wrong";
            feedback.hidden = false;
          }
        });
      });
    });
  }

  function boot() {
    try { initMachine(); } catch (e) { /* the page is still readable without it */ }
    try { initTaster(); } catch (e) {}
    try { initSkeleton(); } catch (e) {}
    try { initCutter(); } catch (e) {}
    try { initChecks(); } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
