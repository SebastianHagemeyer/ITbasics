(function () {
  "use strict";

  const PYODIDE_VERSION = "0.26.4";
  const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v" + PYODIDE_VERSION + "/full/pyodide.js";
  const STORAGE_KEY = "itbasics-sandbox-code";

  const DEFAULT_CODE =
    '# Welcome to the Python sandbox. Edit the code and hit Run.\n' +
    '# Press Ctrl+Enter to run, Tab to indent.\n\n' +
    'print("Hello, Hallam!")\n\n' +
    'for i in range(3):\n' +
    '    print("Loop iteration", i)\n\n' +
    'name = input("What is your name? ")\n' +
    'print("Nice to meet you,", name)\n';

  let pyodide = null;
  let loadingPromise = null;
  let running = false;

  const editor   = document.getElementById("sandbox-code");
  const output   = document.getElementById("sandbox-output");
  const runBtn   = document.getElementById("sandbox-run");
  const runLabel = runBtn ? runBtn.querySelector(".sandbox-run-label") : null;
  const resetBtn = document.querySelector(".sandbox-reset");
  const clearBtn = document.querySelector(".sandbox-clear");

  if (!editor || !output || !runBtn) return;

  function loadCode() {
    const saved = localStorage.getItem(STORAGE_KEY);
    editor.value = (saved && saved.length) ? saved : DEFAULT_CODE;
  }

  function saveCode() {
    localStorage.setItem(STORAGE_KEY, editor.value);
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
      // Replace input() with a JS prompt so it works in the browser.
      pyodide.globals.set("__browser_input", function (p) {
        const v = window.prompt(p == null ? "" : String(p));
        return v == null ? "" : v;
      });
      await pyodide.runPythonAsync(
        "import builtins\n" +
        "builtins.input = __browser_input\n" +
        "del __browser_input\n"
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
      await py.runPythonAsync(editor.value);
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
    editor.value = DEFAULT_CODE;
    saveCode();
    editor.focus();
  }

  // Tab key inserts 4 spaces instead of moving focus.
  editor.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const value = editor.value;
      editor.value = value.substring(0, start) + "    " + value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 4;
    }
  });

  // Ctrl/Cmd + Enter runs the code.
  editor.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      run();
    }
  });

  editor.addEventListener("input", saveCode);
  runBtn.addEventListener("click", run);
  if (resetBtn) resetBtn.addEventListener("click", reset);
  if (clearBtn) clearBtn.addEventListener("click", clearOut);

  loadCode();
})();
