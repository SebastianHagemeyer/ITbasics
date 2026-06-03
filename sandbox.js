(function () {
  "use strict";

  const PYODIDE_VERSION = "0.27.7";
  const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v" + PYODIDE_VERSION + "/full/pyodide.js";
  const CODEJAR_URL = "https://cdn.jsdelivr.net/npm/codejar@4.0.0/dist/codejar.min.js";
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
      title: "Letter staircase",
      desc: "Build up a word, one letter per line.",
      code:
        "word = 'PYTHON'\n" +
        "for i in range(1, len(word) + 1):\n" +
        "    print(word[:i])\n"
    }
  ];

  // Wires Python's input() to the inline reader below. run_sync blocks the
  // Python program (via JSPI stack switching) until readLine's promise
  // resolves, so input() behaves exactly like a real terminal. The helpers
  // live in a throwaway function so nothing leaks into the student's globals.
  const PY_INSTALL_INPUT = `
import builtins as _b
def _sandbox_install_input():
    from pyodide.ffi import run_sync
    from _sandbox_io import readLine
    def input(prompt=""):
        return run_sync(readLine(str(prompt)))
    _b.input = input
_sandbox_install_input()
del _sandbox_install_input, _b
`;

  // Fallback for browsers without JSPI (e.g. Safari): a clear message
  // instead of the old window.prompt() popup.
  const PY_DISABLE_INPUT = `
import builtins as _b
def _sandbox_install_input():
    def input(*args, **kwargs):
        raise RuntimeError(
            "Interactive input() needs Chrome or Edge in this sandbox. "
            "Open this page there, or set a variable instead, e.g. name = 'Alex'"
        )
    _b.input = input
_sandbox_install_input()
del _sandbox_install_input, _b
`;

  // Patches time.sleep to yield back to the JS event loop while sleeping,
  // so anything print()ed before sleep actually shows up in the output
  // panel during the pause instead of all at the end. Same JSPI trick
  // we already use for input(): run_sync suspends Python until the
  // asyncio.sleep promise resolves, freeing JS to repaint in between.
  // Also flushes stdout/stderr so end="" prints aren't stuck in the buffer.
  const PY_PATCH_SLEEP = `
import time as _time, asyncio as _asyncio, sys as _sys
from pyodide.ffi import run_sync as _run_sync
def _yielding_sleep(seconds):
    _sys.stdout.flush()
    _sys.stderr.flush()
    if seconds and seconds > 0:
        _run_sync(_asyncio.sleep(seconds))
_time.sleep = _yielding_sleep
del _time, _asyncio, _sys, _run_sync, _yielding_sleep
`;

  let pyodide = null;
  let loadingPromise = null;
  let running = false;
  let jar = null;

  const editor   = document.getElementById("sandbox-code");
  const output   = document.getElementById("sandbox-output");
  const runBtn   = document.getElementById("sandbox-run");
  const runLabel = runBtn ? runBtn.querySelector(".sandbox-run-label") : null;
  const resetBtn = document.querySelector(".sandbox-reset");
  const clearBtn = document.querySelector(".sandbox-clear");

  if (!editor || !output || !runBtn) return;

  function getCode() {
    return jar ? jar.toString() : editor.textContent;
  }
  function setCode(code) {
    if (jar) jar.updateCode(code);
    else editor.textContent = code;
  }
  function loadCode() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved && saved.length) ? saved : DEFAULT_CODE;
  }
  function saveCode(code) {
    localStorage.setItem(STORAGE_KEY, code == null ? getCode() : code);
  }

  function setRunLabel(text, busy) {
    if (runLabel) runLabel.textContent = text;
    runBtn.disabled = !!busy;
    runBtn.classList.toggle("is-busy", !!busy);
  }

  function appendOut(text, kind) {
    const span = document.createElement("span");
    if (kind) span.className = "out-" + kind;
    span.textContent = text + (text.endsWith("\n") ? "" : "\n");
    output.appendChild(span);
    output.scrollTop = output.scrollHeight;
  }
  function clearOut() { output.innerHTML = ""; }

  // Reads one line of input from the student, terminal-style: shows the
  // prompt (if any) inline in the output, drops in a focused text field with
  // a blinking caret, and resolves with the typed text once Enter is pressed.
  function readLineInteractive(promptText) {
    return new Promise(function (resolve) {
      const line = document.createElement("span");
      line.className = "out-stdin-line";
      if (promptText) line.appendChild(document.createTextNode(promptText));

      const field = document.createElement("input");
      field.type = "text";
      field.className = "sandbox-stdin";
      field.autocomplete = "off";
      field.autocapitalize = "off";
      field.spellcheck = false;
      field.size = 1;
      line.appendChild(field);

      // A flashing block cursor so it's obvious the program is paused waiting
      // for input - even when input() has no prompt and the line is otherwise
      // empty. The native caret is hidden via CSS in favour of this.
      const cursor = document.createElement("span");
      cursor.className = "sandbox-cursor";
      cursor.setAttribute("aria-hidden", "true");
      line.appendChild(cursor);

      output.appendChild(line);
      output.scrollTop = output.scrollHeight;

      // Grow the field with its contents so the cursor sits after the text.
      function resize() { field.size = Math.max(1, field.value.length + 1); }
      field.addEventListener("input", resize);
      // Clicking anywhere on the line re-focuses the (invisible) field.
      line.addEventListener("mousedown", function (e) {
        if (e.target !== field) { e.preventDefault(); field.focus(); }
      });

      setRunLabel("Waiting for input…", true);
      field.focus();

      function onKey(e) {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const value = field.value;
        field.removeEventListener("input", resize);
        field.removeEventListener("keydown", onKey);
        // Echo what was typed into the transcript, then drop the live widgets.
        const echo = document.createElement("span");
        echo.className = "out-stdin";
        echo.textContent = value;
        line.replaceChild(echo, field);
        line.removeChild(cursor);
        line.appendChild(document.createTextNode("\n"));
        setRunLabel("Running…", true);
        output.scrollTop = output.scrollHeight;
        resolve(value);
      }
      field.addEventListener("keydown", onKey);
    });
  }

  // JSPI (WebAssembly stack switching) lets input() block on the main thread
  // without freezing the page. Present in Chrome/Edge 137+; not in Safari.
  function jspiSupported() {
    return typeof WebAssembly !== "undefined" &&
      typeof WebAssembly.Suspending === "function";
  }

  async function setupInput(py) {
    py.registerJsModule("_sandbox_io", { readLine: readLineInteractive });
    const useJspi = jspiSupported();
    await py.runPythonAsync(useJspi ? PY_INSTALL_INPUT : PY_DISABLE_INPUT);
    if (useJspi) {
      await py.runPythonAsync(PY_PATCH_SLEEP);
    }
  }

  function loadPyodideScript() {
    if (window.loadPyodide) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      const s = document.createElement("script");
      s.src = PYODIDE_URL;
      s.onload = resolve;
      s.onerror = function () { reject(new Error("Couldn't reach the Python runtime CDN.")); };
      document.head.appendChild(s);
    });
  }

  async function ensurePyodide() {
    if (pyodide) return pyodide;
    if (loadingPromise) return loadingPromise;

    loadingPromise = (async function () {
      setRunLabel("Loading Python…", true);
      appendOut("Loading Python runtime (one-time, ~10 MB)…", "info");
      await loadPyodideScript();
      pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v" + PYODIDE_VERSION + "/full/"
      });
      pyodide.setStdout({ batched: function (s) { appendOut(s, "stdout"); } });
      pyodide.setStderr({ batched: function (s) { appendOut(s, "stderr"); } });
      await setupInput(pyodide);
      appendOut("Python ready. Running your code…", "info");
      return pyodide;
    })();

    return loadingPromise;
  }

  async function run() {
    if (running) return;
    running = true;
    clearOut();
    setRunLabel("Running…", true);
    try {
      const py = await ensurePyodide();
      await py.runPythonAsync(getCode());
    } catch (err) {
      const msg = (err && err.message) ? err.message : String(err);
      appendOut(msg, "stderr");
    } finally {
      setRunLabel("Run", false);
      running = false;
    }
  }

  function reset() {
    loadInto(DEFAULT_CODE, "Reset to the example");
  }

  function enableHighlighting(CodeJar) {
    jar = CodeJar(editor, function (el) {
      window.Prism.highlightElement(el);
    }, {
      tab: "    ",
      indentOn: /[(\[{:]\s*$/
    });
    jar.updateCode(loadCode());
    jar.onUpdate(function (code) { saveCode(code); });
  }

  function enablePlainEditor() {
    // Fallback: plain contenteditable, no highlighting.
    editor.contentEditable = "plaintext-only";
    editor.textContent = loadCode();
    editor.addEventListener("input", function () { saveCode(); });
  }

  function initEditor() {
    // Show the starter code immediately so the editor never looks empty
    // while CodeJar streams in.
    editor.textContent = loadCode();

    // CodeJar 4.x is published as an ES module, so a classic <script src>
    // tag can't load it - the browser throws on the top-level `export` and
    // never defines CodeJar. Pull it in with a dynamic import() (which does
    // understand ES modules) and then layer Prism highlighting on top.
    // Fall back to a plain editable area if either piece is unavailable.
    if (!window.Prism) {
      enablePlainEditor();
      return;
    }

    import(CODEJAR_URL)
      .then(function (mod) {
        if (mod && typeof mod.CodeJar === "function") enableHighlighting(mod.CodeJar);
        else enablePlainEditor();
      })
      .catch(function () { enablePlainEditor(); });
  }

  // Ctrl/Cmd + Enter runs the code (works whether CodeJar is loaded or not).
  editor.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      run();
    }
  });

  runBtn.addEventListener("click", run);
  if (resetBtn) resetBtn.addEventListener("click", reset);
  if (clearBtn) clearBtn.addEventListener("click", clearOut);

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
  // helper. Used by both Reset and the snippet cards so the UX is the
  // same everywhere - no more blocking confirm() dialogs.
  let previousCode = null;
  function loadInto(code, message) {
    const cur = getCode();
    if (cur === code) {
      showToast({ message: message + " (already there)" });
      return;
    }
    previousCode = cur;
    setCode(code);
    saveCode(code);
    editor.focus();
    showToast({
      message: message,
      actionLabel: "Undo",
      action: function () {
        if (previousCode == null) return;
        const swap = previousCode;
        previousCode = null;
        setCode(swap);
        saveCode(swap);
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

  initEditor();
  renderExamples();
})();
