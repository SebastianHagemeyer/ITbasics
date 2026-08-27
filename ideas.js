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
 *                           buttons, the win/fail skeleton switcher, the scope-check
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
    { emoji: "🦋", name: "butterflies", one: "butterfly" },
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
    { text: "keep a plant alive for seven days", win: "day seven arrives and it's still green" },
    { text: "guide a lost tourist to the station", win: "the tourist reaches the platform" },
    { text: "clean a classroom before the bell", win: "the last bit of mess is gone" },
    { text: "post ten letters through the right doors", win: "all ten letters are posted" },
    { text: "rescue a kitten from a tree", win: "the kitten is back on the ground" },
    { text: "sell every ice cream before it melts", win: "the last ice cream is sold" },
    { text: "fix a leaking roof in a storm", win: "the last drip is patched" }
  ];

  // The danger. fail is the losing line: what has to happen for the run to
  // end. A game with no fail state is a screensaver.
  // The danger. fail is the losing line: what has to happen for the run to
  // end. A game with no fail state is a screensaver. short is the same danger
  // as a plain noun phrase, for the sentences where text would dangle: text
  // says "while angry people chase them", which needs a them to chase.
  var DANGERS = [
    { text: "while angry people chase them", fail: "one of them catches you", short: "angry people chasing" },
    { text: "before a ticking clock runs out", fail: "the clock reaches zero", short: "a ticking clock" },
    { text: "while the floor slowly turns to lava", fail: "you touch the lava", short: "a floor turning to lava" },
    { text: "in the dark, with one flickering torch", fail: "the torch goes out", short: "darkness and one flickering torch" },
    { text: "while everything speeds up every ten seconds", fail: "it gets too fast to react", short: "everything speeding up every ten seconds" },
    { text: "while seagulls dive-bomb them", fail: "a seagull hits you three times", short: "dive-bombing seagulls" },
    { text: "with the controls reversed at random", fail: "you steer into a wall", short: "controls that reverse at random" },
    { text: "on a bridge that is falling apart", fail: "you fall through a gap", short: "a bridge falling apart" },
    { text: "while it rains bowling balls", fail: "a ball lands on you", short: "raining bowling balls" },
    { text: "with only three lives", fail: "the third life is gone", short: "only three lives" },
    { text: "while a rival races them for it", fail: "the rival gets there first", short: "a rival racing for the same thing" },
    { text: "carrying something extremely fragile", fail: "the fragile thing smashes", short: "something fragile that must not break" },
    { text: "in a wind that shoves them sideways", fail: "the wind blows you off the edge", short: "a wind that shoves everything sideways" },
    { text: "while their battery drains", fail: "the battery hits zero", short: "a draining battery" },
    { text: "while the screen slowly shrinks", fail: "the walls close in on you", short: "a shrinking screen" },
    { text: "while a giant boss stomps around", fail: "the boss stomps on you", short: "a giant boss stomping around" }
  ];

  // What the player does in a game with no character to be. The {things} and
  // {thing} slots are filled with whatever the star is, so the premise stays
  // tied to the noun: "whack the sleepy moles", "pop every jelly balloon".
  // These are the Cookie Clicker and Whack-a-Mole shapes, and every one of
  // them is a mouse and a score, which the game library already has.
  var ACTIONS = [
    { text: "click the {things} as fast as you can", plain: "Click them as fast as you can", win: "you beat your own best count" },
    { text: "whack the {things} before they duck back down", plain: "Whack them before they duck back down", win: "you clear a whole row of them" },
    { text: "pop every {thing} on the screen", plain: "Pop every one on the screen", win: "the last one pops" },
    { text: "sort the {things} into two piles", plain: "Sort them into two piles", win: "ten land in the right pile" },
    { text: "drag the {things} into the right boxes", plain: "Drag them into the right boxes", win: "every box is full and correct" },
    { text: "stack the {things} as high as they will go", plain: "Stack them as high as they will go", win: "the stack passes the marked line" },
    { text: "feed the {things} before they get grumpy", plain: "Feed them before they get grumpy", win: "nobody is grumpy when the round ends" },
    { text: "keep clicking to make more {things}", plain: "Keep clicking to make more of them", win: "you reach a hundred of them" },
    { text: "match three {things} in a row", plain: "Match three in a row", win: "the board is cleared" },
    { text: "guide the {things} to safety by placing blocks", plain: "Guide them to safety by placing blocks", win: "all of them get there" },
    { text: "shoot the {things} before they reach the bottom", plain: "Shoot them before they reach the bottom", win: "the last wave is gone" },
    { text: "water the {things} and keep them alive", plain: "Water them and keep them alive", win: "every one is still alive at the end" },
    { text: "catch the {things} by dropping a net at the right moment", plain: "Catch them by dropping a net", win: "you net ten of them" },
    { text: "tap each {thing} in the order they light up", plain: "Tap each one in the order they light up", win: "you repeat a run of eight" },
    { text: "spot the odd {thing} out before the time runs out", plain: "Spot the odd one out against the clock", win: "you find ten odd ones" },
    { text: "flick the {things} into a bucket", plain: "Flick them into a bucket", win: "five land in the bucket" }
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
  // turtles"), but the MVP line talks about the one thing on screen. Two rules
  // cover most of the list: torches drops "es", pizzas drops "s". Anything
  // those rules would mangle carries its own singular, because no short rule
  // separates butterflies (butterfly) from zombies (zombie).
  function singular(star) {
    if (!star) return "thing";
    if (star.one) return star.one;
    var name = star.name;
    if (/(ch|sh|s|x)es$/.test(name)) return name.replace(/es$/, "");
    return name.replace(/s$/, "");
  }

  // ---------------------------------------------------------------- the machine

  // Three modes, one machine. Each is a list of slots, each slot a list to draw
  // from and a way to print itself, plus the sentence that assembles them.
  //
  // Every slot can be switched OFF, which is why the sentence is a function of
  // (picks, on) rather than a template: an idea missing its danger has to read
  // as a sentence and say out loud which bit the student is inventing, not come
  // out with a hole in the middle of it.
  //
  // The no-character mode is a different premise, not the game mode with the
  // star removed. In Cookie Clicker and Whack-a-Mole you are not anybody on
  // screen: the noun is the thing you click, and the verb belongs to your
  // mouse. So it swaps the goal list for the actions list and phrases the whole
  // sentence the other way round.
  var MODES = {
    game: {
      label: "game",
      hint: "You are somebody on screen, and you steer them.",
      slots: [
        { key: "twist", title: "The twist", list: TWISTS, show: function (v) { return capital(v); } },
        { key: "star",  title: "The star",  list: STARS,  show: function (v) { return v.emoji + " " + v.name; } },
        { key: "goal",  title: "The goal",  list: GOALS,  show: function (v) { return capital(v.text); } },
        { key: "danger", title: "The danger", list: DANGERS, show: function (v) { return capital(v.text); } }
      ],
      sentence: function (p, on) {
        var who = on.star
          ? (on.twist ? capital(p.twist) + " " + p.star.name : capital(p.star.name))
          : (on.twist ? "Somebody " + p.twist : "Somebody");
        if (on.goal && on.danger) return who + " must " + p.goal.text + ", " + p.danger.text + ".";
        if (on.goal) return who + " must " + p.goal.text + ".";
        if (on.danger) {
          return who + ", up against " + p.danger.short +
            ". What they are trying to do is yours to invent.";
        }
        return who + ". What they do, and what stops them, is yours to invent.";
      }
    },
    noplayer: {
      label: "no-character game",
      hint: "You are not anybody on screen. You click, drag, place or whack.",
      slots: [
        { key: "twist", title: "The twist", list: TWISTS, show: function (v) { return capital(v); } },
        { key: "star",  title: "The things on screen", list: STARS, show: function (v) { return v.emoji + " " + v.name; } },
        { key: "goal",  title: "What the player does", list: ACTIONS, show: function (v) { return v.plain; } },
        { key: "danger", title: "The pressure", list: DANGERS, show: function (v) { return capital(v.short); } }
      ],
      sentence: function (p, on) {
        var things = onScreen(p, on);
        var press = on.danger ? ", up against " + p.danger.short : "";
        if (on.goal) return capital(fill(p.goal.text, p, on)) + press + ".";
        return capital(things) + " on screen, and a mouse to click them with" + press +
          ". What the player is actually doing is yours to invent.";
      }
    },
    web: {
      label: "website",
      hint: "One page, and a reason for somebody to read it.",
      slots: [
        { key: "kind",  title: "The kind of site", list: SITE_KINDS, show: function (v) { return capital(v.text); } },
        { key: "topic", title: "About",            list: WEB_TOPICS, show: function (v) { return capital(v); } },
        { key: "twist", title: "The twist",        list: SITE_TWISTS, show: function (v) { return capital(v); } }
      ],
      sentence: function (p, on) {
        var line = (on.kind ? capital(p.kind.text) : "A page") +
          (on.topic ? " about " + p.topic : "") +
          (on.twist ? ", " + p.twist : "") + ".";
        if (!on.kind && !on.topic) return line + " What sort of page, and what about, are yours to invent.";
        if (!on.kind) return line + " What sort of page is yours to invent.";
        if (!on.topic) return line + " The subject is yours: something you already know too much about.";
        return line;
      }
    }
  };

  // "agile turtles", or just "turtles", or "agile things" once the star is off.
  function onScreen(p, on) {
    var name = on.star ? p.star.name : "things";
    return on.twist ? p.twist + " " + name : name;
  }

  // An action template talks about {things} and {thing}, so the premise keeps
  // whatever noun is in the star slot instead of saying "the objects".
  function fill(template, p, on) {
    var many = onScreen(p, on);
    var one = on.star ? singular(p.star) : "thing";
    if (on.twist) one = p.twist + " " + one;
    return template.replace(/\{things\}/g, many).replace(/\{thing\}/g, one);
  }

  // Both tabs start with the fewest slots that still make a sentence, and the
  // student switches on as much as they want. Four full slots hand back a
  // finished idea, which reads as the machine having had it; a couple of words
  // and some gaps that say whose job they are reads as a starting point.
  //
  // A game keeps the star, because a noun is enough to picture. A website keeps
  // the kind of site and what it is about, because either one on its own is not
  // yet a page: "a fan page" is not an idea until you know what it is a fan of.
  // The twist is the decoration in both, so it is the first thing to go.
  function defaultOff(name) {
    if (name === "web") return { twist: true };
    return { twist: true, goal: true, danger: true };
  }

  function initMachine() {
    var root = el("idea-machine");
    if (!root) return;

    var slotBox = el("im-slots");
    var sentence = el("im-sentence");
    var mvp = el("im-mvp");
    var count = el("im-count");
    var codeBox = el("im-code");
    var shortlistBox = el("im-shortlist");
    // Two different things, and keeping them apart is the whole trick here.
    // tab is what the student pressed. modeName is the shape the idea is being
    // said in: the Game idea tab covers both a game with a character and one
    // with nobody to be, and the switch on the star slot is what moves between
    // them. It used to be dealt at random on every spin, which meant a student
    // who wanted one shape had to keep spinning until they got it. Now they
    // just say which, and spinning re-rolls the words underneath.
    var tab = "game";
    var modeName = "game";
    var picks = {};        // slot key -> chosen entry, for the live mode
    var locked = {};       // slot key -> true while the student is holding it
    var off = defaultOff("game");  // slot key -> true while they invent it
    var shortlist = [];

    function mode() { return MODES[modeName]; }

    // The two game shapes live behind the same tab, so the star slot is allowed
    // to carry the switch between them. The website tab has no star and no
    // second shape, so it gets no switch.
    function hasShapeSwitch() { return tab === "game"; }

    // The one slot whose list differs between the two shapes. Flipping shape
    // leaves whatever is in it belonging to the other shape's list, so it has
    // to be re-rolled even when locked or switched off: a goal sitting in the
    // actions slot would be rendered by the wrong shape the moment it came back
    // on.
    var SHAPE_SLOT = "goal";

    function setShape(next) {
      if (next === modeName) return;
      modeName = next;
      root.dataset.mode = modeName;
      picks[SHAPE_SLOT] = pickDifferent(
        MODES[modeName].slots.filter(function (s) { return s.key === SHAPE_SLOT; })[0].list,
        null
      );
      locked[SHAPE_SLOT] = false;
      renderLists();
      render();
    }

    // Which slots are in play. Switched-off slots keep their pick, so turning
    // one back on returns the word that was there rather than a fresh spin.
    function switches() {
      var on = {};
      mode().slots.forEach(function (slot) { on[slot.key] = !off[slot.key]; });
      return on;
    }

    function liveSlots() {
      return mode().slots.filter(function (slot) { return !off[slot.key]; });
    }

    function spin(only) {
      // Spinning never changes the shape any more: whichever way the star slot
      // is switched is the shape they asked for, and a spin re-rolls the words
      // inside it.
      mode().slots.forEach(function (slot) {
        if (only && slot.key !== only) return;
        // A switched-off slot keeps its word, so switching it back on returns
        // what was there rather than a fresh spin. It still needs a word the
        // first time round: the machine starts with three slots off, and
        // without this they would have nothing to hand back when switched on.
        if (off[slot.key] && picks[slot.key]) return;
        if (!only && locked[slot.key]) return;
        picks[slot.key] = pickDifferent(slot.list, picks[slot.key]);
      });
      render();
    }

    // The shape is pinned, so the count is the shape in front of them and
    // nothing else. Switched-off slots are already out of liveSlots.
    function combinations() {
      return liveSlots().reduce(function (n, s) { return n * s.list.length; }, 1);
    }

    // The starter code is deliberately the smallest thing that runs. A game
    // with a character gets a sprite and two keys; a no-character game gets a
    // target and a mouse, because that is the whole difference between them.
    function starterCode() {
      var on = switches();
      if (modeName === "web") {
        return "<h1>" + capital(on.topic ? picks.topic : "My page") + "</h1>\n" +
          "<p>" + capital(on.kind ? picks.kind.text : "A page") +
          (on.twist ? ", " + picks.twist : "") + ".</p>\n" +
          "<ul>\n  <li>First one</li>\n  <li>Second one</li>\n  <li>Third one</li>\n</ul>";
      }
      var e = on.star ? picks.star.emoji : "⬜";
      if (modeName === "noplayer") {
        return "import game\n" +
          "import random\n\n" +
          "game.window(480, 360)\n" +
          "target = game.sprite(\"" + e + "\", 240, 180, size=48)\n" +
          "board = game.label(\"Score: 0\", 70, 24)\n\n" +
          "while game.playing():\n" +
          "    if game.clicked() and target.at_mouse():\n" +
          "        game.score(1)\n" +
          "        board.text = \"Score: \" + str(game.score())\n" +
          "        target.x = random.randint(40, 440)\n" +
          "        target.y = random.randint(40, 320)\n" +
          "    game.frame()";
      }
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
        var isOff = Boolean(off[slot.key]);
        var card = document.createElement("div");
        card.className = "im-slot" + (isOff ? " is-off" : locked[slot.key] ? " is-locked" : "");

        var title = document.createElement("p");
        title.className = "im-slot-title";
        title.textContent = slot.title;

        card.appendChild(title);

        // The star is the slot that changes meaning between the two shapes:
        // somebody you steer, or the things you click. So the switch between
        // them sits here rather than up with the tabs, next to the words it
        // actually changes.
        if (slot.key === "star" && hasShapeSwitch()) {
          var shape = document.createElement("div");
          shape.className = "im-shape";
          shape.setAttribute("role", "group");
          shape.setAttribute("aria-label", "Is there a character?");
          [
            { name: "game", label: "Character" },
            { name: "noplayer", label: "No character" }
          ].forEach(function (opt) {
            var b = document.createElement("button");
            b.type = "button";
            var on = modeName === opt.name;
            b.className = "im-shape-btn" + (on ? " is-on" : "");
            b.textContent = opt.label;
            b.setAttribute("aria-pressed", on ? "true" : "false");
            b.addEventListener("click", function () { setShape(opt.name); });
            shape.appendChild(b);
          });
          card.appendChild(shape);
        }

        var value = document.createElement("p");
        value.className = "im-slot-value";
        value.textContent = isOff ? "Switched off. You invent this bit." : slot.show(picks[slot.key]);

        var actions = document.createElement("div");
        actions.className = "im-slot-actions";

        if (!isOff) {
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
        }

        var power = document.createElement("button");
        power.type = "button";
        power.className = "btn btn-ghost im-mini im-off";
        power.textContent = isOff ? "Turn on" : "Turn off";
        power.setAttribute("aria-pressed", isOff ? "true" : "false");
        power.addEventListener("click", function () {
          off[slot.key] = !isOff;
          if (off[slot.key]) locked[slot.key] = false;   // nothing to hold
          render();
        });
        actions.appendChild(power);

        card.appendChild(value);
        card.appendChild(actions);
        slotBox.appendChild(card);
      });
    }

    // A switched-off slot is not a blank in the MVP: it is the one line the
    // student has to write themselves, and saying so is the whole point of
    // being allowed to switch it off.
    function renderMvp() {
      var on = switches();
      var rows;
      if (modeName === "web") {
        rows = [
          ["One page", "A heading, a picture, and one list. That is a website."],
          ["Build first", on.kind ? capital(picks.kind.build) + "." : "Your call: pick the shape of the page first, then fill it."],
          ["The twist", on.twist
            ? capital(picks.twist) + ". Do this bit properly, it's the reason anyone visits."
            : "Your call. A page with no angle is a page nobody reads twice."],
          ["For later", capital(pick(["a second page", "a menu bar", "a colour theme", "a contact form", "a photo gallery"])) + "."]
        ];
      } else {
        var cutA = pick(LATER);
        var control = modeName === "noplayer"
          ? "The mouse. Click, drag or place: nobody to steer."
          : (on.star
              ? picks.star.emoji + " one " + singular(picks.star) + ", moved with two keys."
              : "Your call, and pick something you can draw with one emoji.");
        var win = on.goal
          ? capital(picks.goal.win) + "."
          : "Your call. Name the one thing that counts as doing it.";
        var lose = on.danger
          ? capital(picks.danger.fail) + "."
          : "Your call. One thing has to be able to end the run.";
        rows = [
          ["You control", control],
          ["You win when", win],
          ["You lose when", lose],
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
      var live = liveSlots().length;
      if (!live) {
        // Everything off is the blank page again, which is the one thing this
        // page exists to prevent, so it says so rather than printing a stub.
        text(sentence, "Every slot is switched off, which is just the blank page again. Turn one back on.");
        mvp.innerHTML = "";
        if (codeBox) codeBox.textContent = "";
        text(count, "");
        return;
      }
      text(sentence, mode().sentence(picks, switches()));
      renderMvp();
      if (codeBox) codeBox.textContent = starterCode();
      text(el("im-starter-title"), modeName === "web"
        ? "A page skeleton to start from"
        : "Something to paste in and run");
      text(count, "This machine can spell out " + commas(combinations()) +
        " different " + mode().label + " ideas" +
        (live < mode().slots.length ? " with those slots switched off" : "") +
        ". You only need one.");
      text(el("im-mode-hint"), mode().hint);
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
            off[slot.key] = false;      // picking a word is turning the slot on
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
        if (!liveSlots().length) return;
        var line = mode().sentence(picks, switches());
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
        tab = MODES[btn.dataset.mode] ? btn.dataset.mode : "game";
        modeName = tab;
        root.dataset.mode = modeName;
        Array.prototype.forEach.call(root.querySelectorAll(".im-mode"), function (b) {
          var on = b === btn;
          b.classList.toggle("is-on", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        locked = {};
        picks = {};
        off = defaultOff(tab);
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
      action: "Steer, turn corners, grab a power pellet", obstacle: "Four ghosts and dead ends",
      // credit is not optional: the picture only renders when both src and
      // credit are filled in (see showArt).
      art: {
        src: "/images/pacman-gameplay.png",
        alt: "The Pac-Man arcade screen: a blue maze full of dots, four ghosts, and the yellow player.",
        credit: "Pac-Man (Namco, 1980), redrawn at the original 224x288 screen size from official Bandai Namco footage. Via Wikimedia Commons, CC BY 3.0."
      } },
    { name: "Flappy Bird", win: "Get through the next gap, forever", fail: "You hit a pipe or the ground",
      action: "One tap to flap", obstacle: "Gravity and narrow gaps",
      art: {
        src: "/images/flappy-bird-arcade.jpg",
        alt: "A Flappy Bird arcade screen: the little bird between two tall green pipes with a narrow gap.",
        credit: "Flappy Bird on an arcade cabinet, Santa Cruz Boardwalk. Photo by daveynin, cropped to the screen. Via Wikimedia Commons, CC BY 2.0."
      } },
    { name: "Taxi driver", win: "Deliver the passenger", fail: "Time runs out",
      action: "Reckless driving", obstacle: "A ticking clock",
      // Ours: a little taxi game built in the same sandbox engine and
      // photographed mid-drive, the way catch-the-eggs was.
      art: {
        src: "/images/taxi-driver.jpg",
        alt: "The taxi driver game: a yellow taxi on a grey road facing a passenger hailing up ahead, a chequered drop-off flag, and a fares and time HUD.",
        credit: "Taxi driver, built in our own Python sandbox."
      } },
    { name: "Catch the eggs", win: "Catch 20 eggs", fail: "You miss three eggs",
      action: "Slide the basket left and right", obstacle: "Eggs fall faster and faster",
      // Ours, so there is nothing to attribute to anyone else: this is the
      // sandbox snippet of the same name, photographed mid-game.
      art: {
        src: "/images/catch-the-eggs.jpg",
        alt: "The catch the eggs game: a basket near the bottom, an egg falling from the top, and Score: 1 in the corner.",
        credit: "Catch the eggs, running in our own Python sandbox."
      } },
    // The two that prove the rule is not a law. Their missing bones are drawn
    // as empty boxes rather than left blank, because "there isn't one" is the
    // thing worth seeing.
    { name: "Minecraft (2010)", win: "Nothing. There was no way to finish", noWin: true,
      fail: "You die, and drop everything you were carrying",
      action: "Mine, craft, build, explore", obstacle: "Night, monsters, hunger and gravity",
      // Minecraft Classic on purpose rather than a modern screenshot: this row
      // is about the 2010 game, which had no way to win.
      art: {
        src: "/images/minecraft-classic.jpg",
        alt: "Minecraft Classic: a blocky green landscape by the sea with a single red brick block placed on the grass.",
        credit: "Minecraft Classic v0.30 (Mojang, 2009). Screenshot by Xbox Mexico, via Wikimedia Commons, CC BY 3.0."
      } },
    { name: "RollerCoaster Tycoon (sandbox)", win: "Nothing. The park just runs", noWin: true,
      fail: "Nothing forced. You can always keep building", noFail: true,
      action: "Build rides, set prices, hire staff", obstacle: "Money, queues and guests who hate your coaster",
      // The one commercial screenshot here with no free equivalent. Kept as
      // itself rather than dressed up as CC: it is used by reference, not
      // licensed, and the credit says so.
      art: {
        src: "/images/rollercoaster-tycoon.jpg",
        alt: "A RollerCoaster Tycoon park seen from above: wooden and steel coasters winding between stalls, paths and crowds of tiny guests.",
        credit: "RollerCoaster Tycoon (Chris Sawyer, 2000). Screenshot used by reference."
      } }
  ];

  function initSkeleton() {
    var host = el("gd-skeleton");
    if (!host) return;
    var win = el("sk-win"), fail = el("sk-fail"),
        action = el("sk-action"), obstacle = el("sk-obstacle");

    var shot = el("gd-shot");
    var shotImg = el("gd-shot-img");
    var shotCredit = el("gd-shot-credit");

    // No credit, no picture. Enforcing that here rather than trusting whoever
    // adds the next one to remember: an unattributed screenshot is the whole
    // problem, and a rule that lives in the code cannot be forgotten. A file
    // that fails to load hides the figure too, so a missing image is invisible
    // rather than a broken icon in the middle of the diagram.
    function showArt(sk) {
      if (!shot || !shotImg) return;
      var art = sk.art;
      if (!art || !art.src || !art.credit) { shot.hidden = true; return; }
      shotImg.onerror = function () { shot.hidden = true; };
      shotImg.src = art.src;
      shotImg.alt = art.alt || "";
      text(shotCredit, art.credit);
      shot.hidden = false;
    }

    function show(sk, btn) {
      showArt(sk);
      text(win, sk.win);
      text(fail, sk.fail);
      text(action, sk.action);
      text(obstacle, sk.obstacle);
      // A missing bone is drawn as an empty outline, not a coloured box: a
      // sandbox has no win state, and the diagram should say so out loud.
      if (win && win.parentNode) win.parentNode.classList.toggle("is-empty", Boolean(sk.noWin));
      if (fail && fail.parentNode) fail.parentNode.classList.toggle("is-empty", Boolean(sk.noFail));
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

  // ------------------------------------------- lesson: flag the over-scoped ideas

  // Five real pitches, two of which need a studio and years. The student flags
  // the ones that are too big to start with, then checks. The teaching is in
  // the sort: telling "years of work" apart from "a weekend" is the whole skill
  // this lesson is about, and it is easier to see across five examples than to
  // feel about your own idea.
  function initScope() {
    var host = el("gd-scope");
    if (!host) return;
    var status = el("gd-scope-status");
    var checkBtn = el("gd-scope-check");
    var resetBtn = el("gd-scope-reset");
    var pitches = Array.prototype.slice.call(host.querySelectorAll(".gd-pitch"));
    var checked = false;

    function mark(p) { return p.querySelector(".gd-pitch-mark"); }

    pitches.forEach(function (p) {
      p.addEventListener("click", function () {
        if (checked) return;                 // locked once checked, until reset
        var on = !p.classList.contains("is-flagged");
        p.classList.toggle("is-flagged", on);
        p.setAttribute("aria-pressed", on ? "true" : "false");
        text(mark(p), on ? "🚩" : "");   // a raised flag, or nothing
      });
    });

    function check() {
      if (checked) return;
      checked = true;
      host.classList.add("is-checked");
      var right = 0;
      pitches.forEach(function (p) {
        var tooBig = p.dataset.verdict === "toobig";
        var correct = p.classList.contains("is-flagged") === tooBig;
        if (correct) right++;
        // The card now shows the truth (its data-verdict colours it); the tick
        // or cross says whether the student's own flag matched.
        p.classList.remove("is-flagged");
        p.classList.add(correct ? "is-correct" : "is-wrong");
        text(mark(p), correct ? "✓" : "✗");
      });
      var msg = right === pitches.length
        ? "All five. The two you flagged would take a studio years; the three you kept are a weekend each. That sort, big from startable, is the whole skill."
        : right + " of 5. The two to flag are the ones that need a whole studio: GTA 7 and the open-world Mario Kart. The other three are one screen and a few keys.";
      text(status, msg);
      status.className = "gd-scope-status" + (right === pitches.length ? " is-good" : "");
      checkBtn.disabled = true;
    }

    function reset() {
      checked = false;
      host.classList.remove("is-checked");
      checkBtn.disabled = false;
      pitches.forEach(function (p) {
        p.classList.remove("is-flagged", "is-correct", "is-wrong");
        p.setAttribute("aria-pressed", "false");
        text(mark(p), "");
      });
      text(status, "");
      status.className = "gd-scope-status";
    }

    if (checkBtn) checkBtn.addEventListener("click", check);
    if (resetBtn) resetBtn.addEventListener("click", reset);
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
    try { initScope(); } catch (e) {}
    try { initChecks(); } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
