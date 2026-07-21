/* docs.js
 *
 * The searchable Documentation page. All the reference content lives in the
 * DOCS array below (grouped into sections of entries), and the code under it
 * renders the sections and filters them live as you type in the search box.
 *
 * To add an entry: drop a { sig, desc, ex } object into the right section, or
 * add a whole new { name, id, blurb, items: [...] } section. sig is the thing
 * you write, desc explains it, ex is a short example. Search matches all three.
 */
(function () {
  "use strict";

  var DOCS = [
    {
      name: "Printing and input", id: "io",
      blurb: "Show things on the screen and ask the user for answers.",
      items: [
        { sig: 'print(x)', desc: "Show something on the screen.", ex: 'print("Hello!")\nprint("Score:", 10)' },
        { sig: 'print(a, b, c)', desc: "Print several things on one line, separated by spaces.", ex: 'print("x", "is", 5)   # x is 5' },
        { sig: 'print(x, end="")', desc: "Print without moving to a new line, so the next print carries on.", ex: 'print("Load", end="")\nprint("ing...")   # Loading...' },
        { sig: 'print(x, col="red")', desc: "Colour the text (this works in our Sandbox). Any CSS colour: a name, hex, rgb() or hsl().", ex: 'print("Danger!", col="red")\nprint("Ok", col="#22cc88")' },
        { sig: 'input(prompt)', desc: "Ask the user to type something. It always gives back a string (text), even if they type a number.", ex: 'name = input("Your name? ")\nprint("Hi", name)' },
      ]
    },
    {
      name: "Variables and comments", id: "vars",
      blurb: "Store values to use later, and leave notes for yourself.",
      items: [
        { sig: 'x = 5', desc: "Make a variable: a labelled box that holds a value. The name is on the left, the value on the right.", ex: 'age = 12\nname = "Sam"\nprice = 2.5' },
        { sig: 'x = x + 1', desc: "Change a variable using its own value. Here it grows by one.", ex: 'score = 0\nscore = score + 1   # now 1' },
        { sig: 'a, b = 1, 2', desc: "Set more than one variable at once.", ex: 'x, y = 100, 200' },
        { sig: '# comment', desc: "A note for humans. Python ignores everything after the #.", ex: '# this line does nothing\nprint("hi")   # a note here too' },
      ]
    },
    {
      name: "Numbers and maths", id: "maths",
      blurb: "Do sums, and switch between whole numbers and decimals.",
      items: [
        { sig: '+  -  *  /', desc: "Add, subtract, multiply and divide. Division always gives a decimal.", ex: 'print(3 + 4)   # 7\nprint(10 / 4)  # 2.5' },
        { sig: '//', desc: "Whole-number division: divide and throw away the remainder.", ex: 'print(10 // 3)  # 3' },
        { sig: '%', desc: 'The remainder (modulo). Great for "is this even?" and wrapping around.', ex: 'print(10 % 3)  # 1\nprint(8 % 2)   # 0, so 8 is even' },
        { sig: '**', desc: "To the power of.", ex: 'print(2 ** 3)  # 8' },
        { sig: 'int(x)', desc: "Turn text or a decimal into a whole number. Needed after input() for maths.", ex: 'n = int(input("Age? "))\nprint(int(3.9))   # 3' },
        { sig: 'float(x)', desc: "Turn text into a decimal number.", ex: 'price = float("2.50")' },
        { sig: 'round(x, n)', desc: "Round to n decimal places (or the nearest whole number if you leave n out).", ex: 'print(round(3.14159, 2))  # 3.14' },
        { sig: 'abs(x)', desc: "The size of a number, ignoring the minus sign.", ex: 'print(abs(-7))  # 7' },
      ]
    },
    {
      name: "Strings (text)", id: "strings",
      blurb: "Text is a string. Here is how to build it, search it and change it.",
      items: [
        { sig: '"hello"', desc: "A string is text in quotes. Single or double quotes both work.", ex: "greeting = 'hi'\nname = \"Sam\"" },
        { sig: 'a + b', desc: "Join strings together (this is called concatenation).", ex: 'print("Hallam" + " IT")  # Hallam IT' },
        { sig: '"ab" * 3', desc: "Repeat a string.", ex: 'print("=" * 10)  # ==========' },
        { sig: 'f"{x}"', desc: "An f-string: drop variables straight into text inside the curly braces.", ex: 'age = 12\nprint(f"I am {age}")  # I am 12' },
        { sig: 'len(s)', desc: "How many characters are in the string.", ex: 'print(len("cat"))  # 3' },
        { sig: 's[0]', desc: "Get one character by its position. Counting starts at 0.", ex: 'print("cat"[0])  # c' },
        { sig: 's[1:3]', desc: "A slice: the characters from position 1 up to (not including) 3.", ex: 'print("python"[0:3])  # pyt' },
        { sig: 's.upper() / s.lower()', desc: "Make a copy in all capitals, or all lowercase. Handy for comparing answers fairly.", ex: 'print("Hi".upper())  # HI\nif ans.lower() == "yes": ...' },
        { sig: 's.title()', desc: "Capitalise the first letter of each word.", ex: 'print("sam smith".title())  # Sam Smith' },
        { sig: 's.strip()', desc: "Remove spaces from the start and end.", ex: 'print("  hi  ".strip())  # "hi"' },
        { sig: 's.replace(a, b)', desc: "Swap every a for b.", ex: 'print("cat".replace("c", "b"))  # bat' },
        { sig: 's.split(sep)', desc: "Break a string into a list of pieces. Splits on spaces if you do not say where.", ex: 'print("a,b,c".split(","))  # [a, b, c]' },
        { sig: '"x" in s', desc: "Is this piece somewhere inside the string? Gives True or False.", ex: 'print("at" in "cat")  # True' },
        { sig: 's.startswith(x) / s.endswith(x)', desc: "Does the string start or end with this?", ex: 'print("cat.py".endswith(".py"))  # True' },
        { sig: 's.isdigit() / s.isalpha()', desc: "Is the string all digits, or all letters?", ex: 'print("123".isdigit())  # True' },
        { sig: 'str(x)', desc: "Turn a number (or anything) into a string, so you can join it to text.", ex: 'print("Score: " + str(10))' },
      ]
    },
    {
      name: "Lists", id: "lists",
      blurb: "A list holds many values in order, and you can change it as you go.",
      items: [
        { sig: '[1, 2, 3]', desc: "A list. It can hold numbers, strings, anything, in order.", ex: 'pets = ["cat", "dog", "fish"]' },
        { sig: 'list[0]', desc: "Get an item by position (starting at 0).", ex: 'print(pets[0])  # cat' },
        { sig: 'list[-1]', desc: "Negative counts from the end, so -1 is the last item.", ex: 'print(pets[-1])  # fish' },
        { sig: 'len(list)', desc: "How many items are in the list.", ex: 'print(len(pets))  # 3' },
        { sig: 'list.append(x)', desc: "Add an item onto the end.", ex: 'pets.append("bird")' },
        { sig: 'list.pop()', desc: "Remove and give back the last item (or list.pop(i) for position i).", ex: 'last = pets.pop()' },
        { sig: 'list.remove(x)', desc: "Remove the first matching item.", ex: 'pets.remove("dog")' },
        { sig: 'x in list', desc: "Is this item in the list? True or False.", ex: 'print("cat" in pets)  # True' },
        { sig: 'sorted(list)', desc: "A new list, sorted smallest to largest (or A to Z).", ex: 'print(sorted([3, 1, 2]))  # [1, 2, 3]' },
        { sig: 'sum / min / max', desc: "Add up, or find the smallest or largest, of a list of numbers.", ex: 'print(sum([1, 2, 3]))  # 6\nprint(max([4, 9, 2]))  # 9' },
        { sig: 'for x in list', desc: "Do something with each item in turn.", ex: 'for pet in pets:\n    print(pet)' },
      ]
    },
    {
      name: "True / False and if", id: "if",
      blurb: "Make your program decide what to do.",
      items: [
        { sig: 'True / False', desc: "The two boolean values. Comparisons give you one of these.", ex: 'happy = True' },
        { sig: '==  !=', desc: "Equal to, and not equal to. Note the double equals for checking.", ex: 'print(3 == 3)  # True\nprint(3 != 5)  # True' },
        { sig: '<  >  <=  >=', desc: "Less than, greater than, and the or-equal versions.", ex: 'print(5 > 3)   # True\nprint(2 <= 2)  # True' },
        { sig: 'and  or  not', desc: "Combine conditions. and needs both true, or needs one, not flips it.", ex: 'if age > 12 and age < 20:\n    print("teenager")' },
        { sig: 'if / elif / else', desc: "Run a block only when a condition is true. elif and else are optional extras.", ex: 'if score >= 50:\n    print("Pass")\nelse:\n    print("Try again")' },
      ]
    },
    {
      name: "Loops", id: "loops",
      blurb: "Repeat things without copy-pasting.",
      items: [
        { sig: 'for i in range(n)', desc: "Repeat n times. i counts 0, 1, 2, ... up to n-1.", ex: 'for i in range(3):\n    print(i)   # 0 1 2' },
        { sig: 'range(a, b)', desc: "Count from a up to (not including) b.", ex: 'for i in range(1, 4):\n    print(i)   # 1 2 3' },
        { sig: 'range(a, b, step)', desc: "Count in steps. A negative step counts down.", ex: 'for i in range(5, 0, -1):\n    print(i)   # 5 4 3 2 1' },
        { sig: 'while condition', desc: "Keep repeating as long as the condition stays true. Make sure something changes, or it never stops.", ex: 'n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1' },
        { sig: 'break', desc: "Jump out of a loop straight away.", ex: 'while True:\n    if done: break' },
        { sig: 'continue', desc: "Skip the rest of this turn and go back to the top of the loop.", ex: 'for i in range(5):\n    if i == 2: continue\n    print(i)' },
      ]
    },
    {
      name: "Functions", id: "functions",
      blurb: "Give a chunk of code a name so you can reuse it.",
      items: [
        { sig: 'def name(args):', desc: "Define your own function. The indented lines run when you call it.", ex: 'def greet(who):\n    print("Hi", who)\n\ngreet("Sam")' },
        { sig: 'return x', desc: "Send a value back out of a function so the caller can use it.", ex: 'def double(n):\n    return n * 2\n\nprint(double(5))  # 10' },
      ]
    },
    {
      name: "Built-in functions", id: "builtins",
      blurb: "Handy tools that are always available, no import needed.",
      items: [
        { sig: 'len(x)', desc: "How many items or characters are in something.", ex: 'len("cat")  # 3\nlen([1, 2])  # 2' },
        { sig: 'range(n)', desc: "A sequence of numbers, mostly used with for loops.", ex: 'list(range(3))  # [0, 1, 2]' },
        { sig: 'type(x)', desc: "What kind of thing is x? Useful for working out a bug.", ex: 'print(type(5))    # int\nprint(type("a"))  # str' },
        { sig: 'int / float / str', desc: "Convert between whole numbers, decimals and text.", ex: 'int("5")    # 5\nstr(5)      # "5"' },
        { sig: 'min / max / sum', desc: "Smallest, largest, and total.", ex: 'max(3, 9, 2)   # 9' },
        { sig: 'sorted(x)', desc: "A sorted copy of a list or string.", ex: 'sorted([3, 1, 2])  # [1, 2, 3]' },
      ]
    },
    {
      name: "random library", id: "random",
      blurb: 'Start with "import random". For dice, shuffles and surprises.',
      items: [
        { sig: 'random.randint(a, b)', desc: "A random whole number from a to b, including both ends.", ex: 'import random\nrandom.randint(1, 6)  # a dice roll' },
        { sig: 'random.random()', desc: "A random decimal from 0.0 up to 1.0.", ex: 'random.random()  # e.g. 0.37' },
        { sig: 'random.choice(seq)', desc: "Pick one random item from a list or string.", ex: 'random.choice(["heads", "tails"])' },
        { sig: 'random.shuffle(list)', desc: "Shuffle a list into a random order (changes the list itself).", ex: 'cards = [1, 2, 3]\nrandom.shuffle(cards)' },
        { sig: 'random.randrange(n)', desc: "A random whole number from 0 up to (not including) n.", ex: 'random.randrange(10)  # 0..9' },
      ]
    },
    {
      name: "math library", id: "math",
      blurb: 'Start with "import math". For the trickier sums.',
      items: [
        { sig: 'math.sqrt(x)', desc: "Square root.", ex: 'import math\nmath.sqrt(144)  # 12.0' },
        { sig: 'math.pi', desc: "The number pi (about 3.14159).", ex: 'math.pi * r * r   # circle area' },
        { sig: 'math.floor(x) / math.ceil(x)', desc: "Round down, or round up, to a whole number.", ex: 'math.floor(3.9)  # 3\nmath.ceil(3.1)   # 4' },
        { sig: 'math.pow(a, b)', desc: "a to the power of b (** does this too).", ex: 'math.pow(2, 10)  # 1024.0' },
        { sig: 'math.sin / math.cos', desc: "Sine and cosine, in radians. Great for waves and circles.", ex: 'math.sin(math.pi / 2)  # 1.0' },
        { sig: 'math.factorial(n)', desc: "n! = n * (n-1) * ... * 1.", ex: 'math.factorial(5)  # 120' },
      ]
    },
    {
      name: "time library", id: "time",
      blurb: 'Start with "import time". Slow your program down.',
      items: [
        { sig: 'time.sleep(seconds)', desc: "Pause for a moment. Great for animations and countdowns. (Needs Chrome or Edge in the Sandbox.)", ex: 'import time\nfor i in range(3, 0, -1):\n    print(i)\n    time.sleep(1)' },
      ]
    },
    {
      name: "turtle library", id: "turtle",
      blurb: 'Start with "import turtle" to draw with a little pen. Runs in the Sandbox.',
      items: [
        { sig: 'turtle.forward(n)', desc: "Move forward n steps, drawing a line.", ex: 'import turtle\nturtle.forward(100)' },
        { sig: 'turtle.left(deg) / turtle.right(deg)', desc: "Turn on the spot by a number of degrees.", ex: 'turtle.left(90)   # quarter turn' },
        { sig: 'turtle.pencolor(c)', desc: "Change the pen colour.", ex: 'turtle.pencolor("red")' },
        { sig: 'turtle.penup() / turtle.pendown()', desc: "Lift the pen to move without drawing, then put it back down.", ex: 'turtle.penup()\nturtle.forward(50)\nturtle.pendown()' },
        { sig: 'turtle.circle(r)', desc: "Draw a circle of radius r.", ex: 'turtle.circle(40)' },
        { sig: 'turtle.speed(n)', desc: "How fast it draws, from 1 (slow) to 10 (fast).", ex: 'turtle.speed(10)' },
      ]
    },
    {
      name: "game library", id: "game",
      blurb: 'Start with "import game" to make games. Full guide in the ',
      blurbLink: { href: "/topics/libraries/", text: "Libraries lesson" },
      items: [
        { sig: 'game.window(w, h)', desc: "Open the game window. Always first. Add background=\"#0b1020\" for a colour.", ex: 'import game\ngame.window(480, 360)' },
        { sig: 'game.sprite(emoji, x, y, size=40)', desc: "An emoji you can move around.", ex: 'bird = game.sprite("🐤", 100, 200)' },
        { sig: 'game.box(x, y, w, h, color)', desc: "A coloured rectangle, centred on (x, y).", ex: 'wall = game.box(240, 300, 60, 20, "#5fbf3a")' },
        { sig: 'game.label(text, x, y, size, color)', desc: "Draw words (a score or a message), centred on (x, y).", ex: 'board = game.label("Score: 0", 60, 22)' },
        { sig: 'game.pressed(key)', desc: 'True while a key is held. "left", "right", "up", "down", "space", or a letter.', ex: 'if game.pressed("left"):\n    bird.x = bird.x - 5' },
        { sig: 'game.playing()', desc: "The loop condition: true while the game runs.", ex: 'while game.playing():\n    game.frame()' },
        { sig: 'game.frame(fps=30)', desc: "Draw one frame and wait. Put it at the end of the loop.", ex: 'game.frame()' },
        { sig: 'game.game_over(message)', desc: "Show a banner and stop the game.", ex: 'game.game_over("You win!")' },
        { sig: 'sprite.x / sprite.y', desc: "Where a sprite is. Change these to move it.", ex: 'bird.y = bird.y + 5' },
        { sig: 'sprite.angle', desc: "Spin a sprite, in degrees.", ex: 'coin.angle = coin.angle + 6' },
        { sig: 'sprite.scale_x / sprite.scale_y', desc: "Stretch or mirror. -1 flips it to face the other way.", ex: 'chicken.scale_x = -1   # face right' },
        { sig: 'a.touches(b)', desc: "True if two sprites overlap. This is how you catch or crash.", ex: 'if basket.touches(egg):\n    game.score(1)' },
      ]
    }
  ];

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>]/g, function (c) {
      return c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;";
    });
  }

  var body = document.getElementById("docs-body");
  var jump = document.getElementById("docs-jump");
  var search = document.getElementById("docs-search");
  var count = document.getElementById("docs-count");
  var empty = document.getElementById("docs-empty");
  if (!body) return;

  var sectionEls = [];

  DOCS.forEach(function (sec) {
    // Jump link
    var chip = el("a", "docs-chip");
    chip.href = "#sec-" + sec.id;
    chip.textContent = sec.name;
    jump.appendChild(chip);

    var wrap = el("section", "docs-section");
    wrap.id = "sec-" + sec.id;
    var h2 = el("h2", "docs-section-title");
    h2.textContent = sec.name;
    wrap.appendChild(h2);
    if (sec.blurb) {
      var blurb = el("p", "docs-section-blurb", esc(sec.blurb));
      if (sec.blurbLink) {
        var a = el("a", null, esc(sec.blurbLink.text));
        a.href = sec.blurbLink.href;
        blurb.appendChild(a);
        blurb.appendChild(document.createTextNode("."));
      }
      wrap.appendChild(blurb);
    }

    var grid = el("div", "docs-grid");
    var itemEls = [];
    sec.items.forEach(function (it) {
      var card = el("div", "docs-item");
      card.appendChild(el("code", "docs-sig", esc(it.sig)));
      card.appendChild(el("p", "docs-desc", esc(it.desc)));
      if (it.ex) card.appendChild(el("pre", "docs-ex", esc(it.ex)));
      card._hay = (it.sig + " " + it.desc + " " + (it.ex || "")).toLowerCase();
      grid.appendChild(card);
      itemEls.push(card);
    });
    wrap.appendChild(grid);
    body.appendChild(wrap);
    sectionEls.push({ el: wrap, chip: chip, items: itemEls, hay: sec.name.toLowerCase() });
  });

  function apply(q) {
    q = (q || "").trim().toLowerCase();
    var shown = 0;
    sectionEls.forEach(function (s) {
      var anyInSection = false;
      // If the query matches the section name, show all of its items.
      var sectionMatch = q && s.hay.indexOf(q) !== -1;
      s.items.forEach(function (card) {
        var hit = !q || sectionMatch || card._hay.indexOf(q) !== -1;
        card.hidden = !hit;
        if (hit) { anyInSection = true; shown++; }
      });
      s.el.hidden = !anyInSection;
    });
    if (count) count.textContent = q ? (shown + (shown === 1 ? " match" : " matches")) : "";
    if (empty) empty.hidden = shown !== 0;
    if (jump) jump.hidden = !!q;   // hide the jump chips while searching
  }

  var t = null;
  search.addEventListener("input", function () {
    if (t) clearTimeout(t);
    t = setTimeout(function () { apply(search.value); }, 80);
  });
  // Pressing Escape clears the search.
  search.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { search.value = ""; apply(""); }
  });

  apply("");
})();
