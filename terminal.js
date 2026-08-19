/* terminal.js
 *
 * The Terminal module (/topics/terminal/): a terminal you can actually type in,
 * plus the check-your-understanding buttons.
 *
 * The widget is a pretend machine, not a real shell. Nothing it does touches
 * anything: the "files" are the object below, and the commands are a switch
 * statement. That is the whole point. A student can type cd, ls and cat a
 * hundred times, get the paths wrong, and learn what the prompt is telling them
 * without being anywhere near their own files.
 *
 * It speaks two dialects, because the class is split across Windows and Mac and
 * the commands genuinely differ. The toggle swaps the command names AND the
 * prompt, since "C:\Users\sam>" versus "sam@laptop:~$" is half of what makes
 * one look alien to somebody who learned the other.
 *
 * Fails quiet: no terminal element on the page and nothing here runs.
 */
(function () {
  "use strict";

  // ------------------------------------------------------------ the pretend disk
  // Folders are objects, files are strings. Depth is deliberate: Term1 is two
  // levels down, so reaching it takes more than one cd and the path in the
  // prompt has to be read rather than guessed.
  var HOME = {
    "Homework": {
      "Term1": {
        "notes.txt": "Pseudocode is a plan, written for a human.\nNo computer ever runs it.",
        "binary.txt": "8 4 2 1\n1 0 1 1  = 11"
      },
      "Term2": {
        "todo.txt": "1. Finish the game\n2. Actually finish the game"
      }
    },
    "Photos": {
      "dog.png": "\u0000PNG",
      "holiday.jpg": "\u0000JPEG"
    },
    "games": {
      "chicken.py": "import game\ngame.window(480, 360)\nchicken = game.sprite(\"\uD83D\uDC14\", 240, 300)"
    },
    "README.txt": "Nothing here is real. Type help to see what works."
  };

  var USER = "sam";

  function isDir(node) { return node && typeof node === "object"; }

  // ------------------------------------------------------------ the widget
  function initTerminal() {
    var root = document.getElementById("term");
    if (!root) return;
    var screen = root.querySelector(".term-screen");
    var input = root.querySelector(".term-input");
    var promptEl = root.querySelector(".term-prompt");
    if (!screen || !input || !promptEl) return;

    var mode = root.dataset.mode === "win" ? "win" : "unix";
    var path = [];               // folders below home, outermost first
    var history = [];
    var atHistory = 0;
    var done = { look: false, read: false, echo: false };

    function here() {
      return path.reduce(function (node, name) { return node[name]; }, HOME);
    }

    function prompt() {
      if (mode === "win") return "C:\\Users\\" + USER + (path.length ? "\\" + path.join("\\") : "") + ">";
      return USER + "@laptop:" + (path.length ? "~/" + path.join("/") : "~") + "$";
    }

    function write(line, cls) {
      var p = document.createElement("p");
      p.className = "term-line" + (cls ? " " + cls : "");
      p.textContent = line;
      screen.appendChild(p);
      screen.scrollTop = screen.scrollHeight;
    }

    function writeBlock(text, cls) {
      String(text).split("\n").forEach(function (l) { write(l, cls); });
    }

    function paintPrompt() { promptEl.textContent = prompt(); }

    // ---- the commands ----------------------------------------------------
    // Both names for the same job are accepted whichever dialect is showing,
    // so nobody gets stuck because they typed the one they know. help only
    // lists the names for the dialect they picked.
    var NAMES = {
      unix: { list: "ls", read: "cat", clear: "clear" },
      win:  { list: "dir", read: "type", clear: "cls" }
    };

    function listing() {
      var node = here();
      var names = Object.keys(node);
      if (!names.length) { write("(this folder is empty)", "term-dim"); return; }
      names.forEach(function (name) {
        if (isDir(node[name])) {
          write(mode === "win" ? "<DIR>  " + name : name + "/", "term-dir");
        } else {
          write(mode === "win" ? "       " + name : name);
        }
      });
      if (path.length === 2 && path[0] === "Homework" && path[1] === "Term1") tick("look");
    }

    function changeDir(arg) {
      if (!arg || arg === "~" || arg === "\\" || arg === "/") { path = []; return; }
      arg.split(/[\/\\]+/).forEach(function (step) {
        if (!step || step === ".") return;
        if (step === "..") { path.pop(); return; }
        var node = here();
        if (isDir(node[step])) path.push(step);
        else if (node[step]) write(step + " is a file, not a folder.", "term-err");
        else write("No folder called " + step + " in here. Try " + NAMES[mode].list + ".", "term-err");
      });
    }

    function readFile(arg) {
      if (!arg) { write("Which file? Try " + NAMES[mode].read + " README.txt", "term-err"); return; }
      if (/[\/\\]/.test(arg)) {
        // Paths are a cd job in here. Saying so beats "no such file", which
        // sends them looking for a typo that is not there.
        write(NAMES[mode].read + " only takes a file name here. cd into the folder first, then read it.", "term-err");
        return;
      }
      var node = here()[arg];
      if (node === undefined) { write("No file called " + arg + " in here.", "term-err"); return; }
      if (isDir(node)) { write(arg + " is a folder. Use cd to go into it.", "term-err"); return; }
      if (/\.(png|jpg|jpeg|gif)$/i.test(arg)) {
        write("That is a picture, not text. " + NAMES[mode].read +
          " prints text files; a picture comes out as gibberish.", "term-dim");
        return;
      }
      writeBlock(node);
      if (arg === "notes.txt") tick("read");
    }

    function tree(node, indent) {
      Object.keys(node).forEach(function (name) {
        write(indent + (isDir(node[name]) ? "+ " + name : "  " + name),
          isDir(node[name]) ? "term-dir" : "");
        if (isDir(node[name])) tree(node[name], indent + "   ");
      });
    }

    function help() {
      var n = NAMES[mode];
      write("Commands that work here:", "term-dim");
      [["pwd", "where am I?"],
       [n.list, "what is in this folder?"],
       ["cd Homework", "go into a folder"],
       ["cd ..", "go back out one"],
       [n.read + " README.txt", "print a text file"],
       ["echo hello", "print whatever you type"],
       ["tree", "show the whole folder tree"],
       ["whoami", "who am I logged in as?"],
       [n.clear, "wipe the screen"]].forEach(function (row) {
        write("  " + row[0] + new Array(Math.max(2, 18 - row[0].length)).join(" ") + row[1]);
      });
    }

    function run(line) {
      var bits = line.trim().split(/\s+/);
      var cmd = (bits.shift() || "").toLowerCase();
      var arg = bits.join(" ");
      switch (cmd) {
        case "": return;
        case "help": return help();
        case "pwd": return write(mode === "win" ? prompt().slice(0, -1) : "~" + (path.length ? "/" + path.join("/") : ""));
        case "ls": case "dir": return listing();
        case "cd": return changeDir(arg);
        case "cat": case "type": return readFile(arg);
        case "echo":
          write(arg);
          if (arg) tick("echo");
          return;
        case "tree": return tree(here(), "");
        case "whoami": return write(USER);
        case "clear": case "cls": screen.innerHTML = ""; return;
        case "exit": return write("Nice try. This one is painted on.", "term-dim");
        default:
          write(cmd + ": command not found. Type help to see what works here.", "term-err");
      }
    }

    // ---- the three little goals ------------------------------------------
    function tick(key) {
      if (done[key]) return;
      done[key] = true;
      var box = document.querySelector('.term-goal[data-goal="' + key + '"]');
      if (box) box.classList.add("is-done");
      if (done.look && done.read && done.echo) {
        var note = document.getElementById("term-goals-done");
        if (note) note.hidden = false;
      }
    }

    // ---- wiring ----------------------------------------------------------
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var line = input.value;
        write(prompt() + " " + line, "term-echo");
        input.value = "";
        if (line.trim()) { history.push(line); atHistory = history.length; }
        try { run(line); } catch (err) { write("Something went wrong in there.", "term-err"); }
        paintPrompt();
        screen.scrollTop = screen.scrollHeight;
      } else if (e.key === "ArrowUp") {
        if (atHistory > 0) { atHistory--; input.value = history[atHistory]; }
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        if (atHistory < history.length - 1) { atHistory++; input.value = history[atHistory]; }
        else { atHistory = history.length; input.value = ""; }
        e.preventDefault();
      }
    });

    // Clicking anywhere on the screen puts the caret back in the line, the way
    // a real terminal window behaves.
    root.addEventListener("click", function (e) {
      if (e.target.closest("button")) return;
      input.focus();
    });

    // Selected on data-dialect, not on the class: any other button that ends up
    // in this bar must not be able to change the dialect by accident.
    Array.prototype.forEach.call(root.querySelectorAll(".term-dialect[data-dialect]"), function (btn) {
      btn.addEventListener("click", function () {
        mode = btn.dataset.dialect === "win" ? "win" : "unix";
        root.dataset.mode = mode;
        Array.prototype.forEach.call(root.querySelectorAll(".term-dialect[data-dialect]"), function (b) {
          var on = b === btn;
          b.classList.toggle("is-on", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        write("Switched to " + (mode === "win" ? "Windows" : "macOS and Linux") +
          ". The list command is now " + NAMES[mode].list + ".", "term-dim");
        paintPrompt();
        input.focus();
      });
    });

    var clearBtn = document.getElementById("term-clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        screen.innerHTML = "";
        input.focus();
      });
    }

    function boot() {
      write("Hallam pretend terminal. Nothing here is real, so you cannot break it.", "term-dim");
      write("Type help and press Enter.", "term-dim");
    }

    boot();
    paintPrompt();
  }

  // --------------------------------------------- check-your-understanding
  // Same behaviour as the other module pages.
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
    try { initTerminal(); } catch (e) { /* the lesson still reads fine */ }
    try { initChecks(); } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
