(function () {
  "use strict";

  const PYODIDE_VERSION = "0.26.4";
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
      // input() isn't wired up in the sandbox yet - give a clear error
      // instead of the browser's prompt() dialog.
      await pyodide.runPythonAsync(
        "def __no_input(*args, **kwargs):\n" +
        "    raise RuntimeError(\"input() isn't supported in the sandbox yet. \" +\n" +
        "        \"Try setting a variable instead, e.g. name = 'Alex'\")\n" +
        "import builtins\n" +
        "builtins.input = __no_input\n" +
        "del __no_input\n"
      );
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
    if (!window.confirm("Reset the editor to the example code? Your current code will be lost.")) return;
    setCode(DEFAULT_CODE);
    saveCode(DEFAULT_CODE);
    editor.focus();
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

  initEditor();
})();
