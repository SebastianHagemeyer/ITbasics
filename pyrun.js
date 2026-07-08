/*
 * PyRun: a reusable in-browser Python runner for IT Basics pages.
 *
 * This is the sandbox.js runner core (Pyodide + JSPI input()/sleep,
 * Stop support, clear(), print(col=)) turned into a factory so other
 * pages (the Assignments area) can embed an editor + output panel
 * without copying 500 lines. sandbox.js still has its own copy; if a
 * bug is fixed in one, check the other.
 *
 * Extra here: an optional canvas-backed `turtle` module, so students
 * can `import turtle` and draw. Movement animates via the same
 * interruptible-sleep JSPI trick, and the Stop button interrupts it.
 *
 * Usage:
 *   var runner = PyRun.create({
 *     editor:  el,           // contenteditable div for code
 *     output:  el,           // <pre> for program output
 *     runBtn:  el,           // Run/Stop button (label span optional)
 *     storageKey: "key",     // localStorage autosave slot
 *     defaultCode: "...",
 *     turtle: { canvas: el, sprite: el }   // optional drawing canvases
 *   });
 */
(function () {
  "use strict";

  const PYODIDE_VERSION = "0.27.7";
  const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v" + PYODIDE_VERSION + "/full/pyodide.js";
  const CODEJAR_URL = "https://cdn.jsdelivr.net/npm/codejar@4.0.0/dist/codejar.min.js";

  // One Pyodide per page, shared by every runner instance. Only one
  // program runs at a time; `active` is the runner whose panels receive
  // stdout, input prompts and turtle drawing.
  let pyodide = null;
  let loadingPromise = null;
  let active = null;
  let running = false;
  let pendingReject = null;
  let stopRequested = false;

  // JSPI (WebAssembly stack switching) lets input() and sleep block on
  // the main thread without freezing the page. Chrome/Edge 137+.
  function jspiSupported() {
    return typeof WebAssembly !== "undefined" &&
      typeof WebAssembly.Suspending === "function";
  }

  // ---- Python-side setup strings (same behaviour as sandbox.js) ----------

  const PY_INSTALL_INPUT = `
import builtins as _b
def _pyrun_install_input():
    import sys
    from pyodide.ffi import run_sync
    from _sandbox_io import readLine
    def input(prompt=""):
        sys.stdout.flush()
        sys.stderr.flush()
        return run_sync(readLine(str(prompt)))
    _b.input = input
_pyrun_install_input()
del _pyrun_install_input, _b
`;

  const PY_DISABLE_INPUT = `
import builtins as _b
def _pyrun_install_input():
    def input(*args, **kwargs):
        raise RuntimeError(
            "Interactive input() needs Chrome or Edge in this sandbox. "
            "Open this page there, or set a variable instead, e.g. name = 'Alex'"
        )
    _b.input = input
_pyrun_install_input()
del _pyrun_install_input, _b
`;

  const PY_PATCH_SLEEP = `
def _pyrun_install_sleep():
    import time, sys
    from pyodide.ffi import run_sync
    from _sandbox_io import sleepMs
    def _yielding_sleep(seconds):
        sys.stdout.flush()
        sys.stderr.flush()
        if seconds and seconds > 0:
            run_sync(sleepMs(seconds))
    time.sleep = _yielding_sleep
_pyrun_install_sleep()
del _pyrun_install_sleep
`;

  const PY_INSTALL_INTERRUPT = `
def _pyrun_install_interrupt():
    import sys
    from _sandbox_io import shouldStop
    counter = [0]
    def trace(frame, event, arg):
        counter[0] += 1
        if counter[0] >= 500:
            counter[0] = 0
            if shouldStop():
                raise KeyboardInterrupt("Stopped by user")
        return trace
    sys.settrace(trace)
_pyrun_install_interrupt()
del _pyrun_install_interrupt
`;

  const PY_INSTALL_CLEAR = `
def _pyrun_install_clear():
    import sys, builtins
    from _sandbox_io import clearOutput
    def clear():
        sys.stdout.flush()
        sys.stderr.flush()
        clearOutput()
    builtins.clear = clear
_pyrun_install_clear()
del _pyrun_install_clear
`;

  const PY_INSTALL_COLOR_PRINT = `
def _pyrun_install_color_print():
    import sys, builtins
    from _sandbox_io import writeColored
    real_print = builtins.print
    def print(*args, col=None, color=None, sep=' ', end='\\n', file=None, flush=False):
        chosen = col if col is not None else color
        if chosen is not None and file is None:
            sys.stdout.flush()
            sys.stderr.flush()
            text = sep.join(str(a) for a in args) + end
            writeColored(text, str(chosen))
        else:
            real_print(*args, sep=sep, end=end, file=file, flush=flush)
    builtins.print = print
_pyrun_install_color_print()
del _pyrun_install_color_print
`;

  // ---- The turtle module ---------------------------------------------------
  // A classroom-sized reimplementation of Python's turtle on a canvas.
  // One shared turtle; turtle.Turtle() returns a proxy to it so code from
  // any beginner tutorial ("t = turtle.Turtle()") still works. Coordinates
  // match real turtle: origin at the centre, y grows upward, heading 0 = east.
  const PY_INSTALL_TURTLE = `
def _pyrun_install_turtle():
    import sys, math, types
    import _turtle_io as _io

    _animate_ok = bool(_io.animateOk())
    if _animate_ok:
        from pyodide.ffi import run_sync

    S = {}

    def _reset_state():
        S.update(x=0.0, y=0.0, heading=0.0, pen=True, visible=True,
                 pencolor="#22d3a5", fillcolor="#22d3a5", width=2,
                 speed=6, filling=False, path=[])

    _reset_state()

    def _sync():
        _io.sprite(S["x"], S["y"], S["heading"], S["visible"])

    def _pause(ms):
        if _animate_ok and ms > 0:
            run_sync(_io.sleepMs(ms / 1000))

    def _frame_delay():
        # speed 1 = slow and dramatic, 10 = quick, 0 = instant
        sp = S["speed"]
        if not sp:
            return 0
        return (11 - max(1, min(10, sp))) * 3

    def _goto(nx, ny):
        nx = float(nx); ny = float(ny)
        dist = math.hypot(nx - S["x"], ny - S["y"])
        delay = _frame_delay()
        steps = 1
        if delay and dist > 0:
            steps = max(1, min(int(dist / 10) + 1, 40))
        sx, sy = S["x"], S["y"]
        for i in range(1, steps + 1):
            px = sx + (nx - sx) * i / steps
            py = sy + (ny - sy) * i / steps
            if S["pen"]:
                _io.segment(S["x"], S["y"], px, py, S["pencolor"], S["width"])
            S["x"], S["y"] = px, py
            _sync()
            if steps > 1 or delay:
                _pause(delay)
        if S["filling"]:
            S["path"].append((S["x"], S["y"]))

    # ---- movement ----
    def forward(distance):
        rad = math.radians(S["heading"])
        _goto(S["x"] + math.cos(rad) * distance, S["y"] + math.sin(rad) * distance)
    def backward(distance): forward(-distance)
    def left(angle):
        S["heading"] = (S["heading"] + angle) % 360
        _sync()
    def right(angle): left(-angle)
    def goto(x, y=None):
        if y is None:
            x, y = x        # accept goto((x, y))
        _goto(x, y)
    def setx(x): _goto(x, S["y"])
    def sety(y): _goto(S["x"], y)
    def setheading(angle):
        S["heading"] = angle % 360
        _sync()
    def home():
        _goto(0, 0)
        setheading(0)
    def circle(radius, extent=360):
        # Approximate with short segments, like real turtle does.
        steps = max(12, min(72, int(abs(extent) / 5)))
        step_angle = extent / steps
        side = 2 * abs(radius) * math.sin(math.radians(abs(step_angle)) / 2)
        turn = step_angle if radius >= 0 else -step_angle
        left(turn / 2)
        for _ in range(steps):
            forward(side)
            left(turn)
        left(-turn / 2)

    # ---- pen ----
    def penup():
        S["pen"] = False
    def pendown():
        S["pen"] = True
    def isdown():
        return S["pen"]
    def pensize(width=None):
        if width is None:
            return S["width"]
        S["width"] = max(1, float(width))
    def pencolor(c=None):
        if c is None:
            return S["pencolor"]
        S["pencolor"] = str(c)
    def fillcolor(c=None):
        if c is None:
            return S["fillcolor"]
        S["fillcolor"] = str(c)
    def color(*args):
        if not args:
            return (S["pencolor"], S["fillcolor"])
        pencolor(args[0])
        fillcolor(args[1] if len(args) > 1 else args[0])
    def begin_fill():
        S["filling"] = True
        S["path"] = [(S["x"], S["y"])]
    def end_fill():
        if S["filling"] and len(S["path"]) > 2:
            flat = []
            for (px, py) in S["path"]:
                flat.append(px); flat.append(py)
            _io.fillPoly(flat, S["fillcolor"])
        S["filling"] = False
        S["path"] = []
    def dot(size=None, c=None):
        if size is None:
            size = max(S["width"] + 4, S["width"] * 2)
        _io.dot(S["x"], S["y"], size, str(c) if c else S["pencolor"])
        _pause(_frame_delay())
    def write(text, move=False, align="left", font=("Arial", 12, "normal")):
        size = 12
        name = "Arial"
        try:
            name = str(font[0]); size = int(font[1])
        except Exception:
            pass
        _io.text(S["x"], S["y"], str(text), S["pencolor"], size, str(align), name)

    # ---- looks & misc ----
    def speed(value=None):
        if value is None:
            return S["speed"]
        names = {"fastest": 0, "fast": 10, "normal": 6, "slow": 3, "slowest": 1}
        if isinstance(value, str):
            value = names.get(value, 6)
        S["speed"] = max(0, min(10, int(value)))
    def hideturtle():
        S["visible"] = False
        _sync()
    def showturtle():
        S["visible"] = True
        _sync()
    def bgcolor(c):
        _io.bg(str(c))
    def position():
        return (S["x"], S["y"])
    def xcor(): return S["x"]
    def ycor(): return S["y"]
    def heading(): return S["heading"]
    def clear():
        _io.wipe()
        _sync()
    def reset():
        _io.wipe()
        _io.bg("")
        _reset_state()
        _sync()
    def done(): pass

    ns = dict(
        forward=forward, fd=forward, backward=backward, back=backward, bk=backward,
        left=left, lt=left, right=right, rt=right,
        goto=goto, setpos=goto, setposition=goto, setx=setx, sety=sety,
        setheading=setheading, seth=setheading, home=home, circle=circle,
        penup=penup, pu=penup, up=penup, pendown=pendown, pd=pendown, down=pendown,
        isdown=isdown, pensize=pensize, width=pensize,
        pencolor=pencolor, fillcolor=fillcolor, color=color,
        begin_fill=begin_fill, end_fill=end_fill, dot=dot, write=write,
        speed=speed, hideturtle=hideturtle, ht=hideturtle,
        showturtle=showturtle, st=showturtle, bgcolor=bgcolor,
        position=position, pos=position, xcor=xcor, ycor=ycor, heading=heading,
        clear=clear, reset=reset, done=done, mainloop=done, exitonclick=done
    )

    class Turtle:
        """All Turtle() objects steer the one shared classroom turtle."""
        def __init__(self, *a, **k):
            pass
        def __getattr__(self, name):
            if name in ns:
                return ns[name]
            raise AttributeError("turtle has no " + name)

    class _ScreenObj:
        def bgcolor(self, c): bgcolor(c)
        def title(self, *a): pass
        def setup(self, *a, **k): pass
        def clear(self): clear()
        def reset(self): reset()
        def exitonclick(self): pass
        def mainloop(self): pass

    def Screen():
        return _ScreenObj()

    mod = types.ModuleType("turtle")
    mod.__dict__.update(ns)
    mod.Turtle = Turtle
    mod.Pen = Turtle
    mod.Screen = Screen
    mod._reset_all = reset
    sys.modules["turtle"] = mod

_pyrun_install_turtle()
del _pyrun_install_turtle
`;

  // ---- JS side of the turtle: canvas drawing, dispatched to `active` ------

  function turtleCtx() {
    if (!active || !active.opts.turtle) return null;
    return active.turtleCtx;
  }
  function spriteCtx() {
    if (!active || !active.opts.turtle) return null;
    return active.spriteCtx;
  }
  // Turtle coords (origin centre, y up) to canvas pixels.
  function tx(c, x) { return c.canvas.width / 2 + x; }
  function ty(c, y) { return c.canvas.height / 2 - y; }

  // The turtle sprite: custom SVG art (top-down, facing right = heading 0),
  // rendered onto the overlay canvas via an Image. Same drawing as the
  // track-picker icon on the assignment page.
  const TURTLE_SPRITE_SVG =
    '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M14 32 L5 27.5 L7.5 32 L5 36.5 Z" fill="#2f855a"/>' +
      '<ellipse cx="23" cy="16.5" rx="7" ry="4.5" transform="rotate(-35 23 16.5)" fill="#38a169"/>' +
      '<ellipse cx="41" cy="16.5" rx="7" ry="4.5" transform="rotate(35 41 16.5)" fill="#38a169"/>' +
      '<ellipse cx="23" cy="47.5" rx="7" ry="4.5" transform="rotate(35 23 47.5)" fill="#38a169"/>' +
      '<ellipse cx="41" cy="47.5" rx="7" ry="4.5" transform="rotate(-35 41 47.5)" fill="#38a169"/>' +
      '<circle cx="52" cy="32" r="7.5" fill="#48bb78"/>' +
      '<circle cx="55" cy="29.3" r="1.4" fill="#1a202c"/>' +
      '<circle cx="55" cy="34.7" r="1.4" fill="#1a202c"/>' +
      '<ellipse cx="30" cy="32" rx="18" ry="15" fill="#2e9e63" stroke="#1f7a4a" stroke-width="2"/>' +
      '<polygon points="30,24 37,28 37,36 30,40 23,36 23,28" fill="#3db878" stroke="#1f7a4a" stroke-width="1.5"/>' +
      '<path d="M30 24 L30 18 M37 28 L43.5 24.5 M37 36 L43.5 39.5 M30 40 L30 46 M23 36 L16.5 39.5 M23 28 L16.5 24.5" ' +
            'stroke="#1f7a4a" stroke-width="1.5" fill="none"/>' +
    '</svg>';
  const turtleSpriteImg = new Image();
  turtleSpriteImg.src = "data:image/svg+xml;utf8," + encodeURIComponent(TURTLE_SPRITE_SVG);

  const TURTLE_IO = {
    animateOk: function () { return jspiSupported(); },
    sleepMs: function (seconds) { return interruptibleSleep(seconds); },
    segment: function (x1, y1, x2, y2, color, width) {
      const c = turtleCtx();
      if (!c) return;
      c.strokeStyle = String(color);
      c.lineWidth = Number(width) || 2;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(tx(c, x1), ty(c, y1));
      c.lineTo(tx(c, x2), ty(c, y2));
      c.stroke();
    },
    fillPoly: function (flatPoints, color) {
      const c = turtleCtx();
      if (!c) return;
      const pts = Array.from(flatPoints);
      if (pts.length < 6) return;
      c.fillStyle = String(color);
      c.beginPath();
      c.moveTo(tx(c, pts[0]), ty(c, pts[1]));
      for (let i = 2; i < pts.length; i += 2) {
        c.lineTo(tx(c, pts[i]), ty(c, pts[i + 1]));
      }
      c.closePath();
      c.fill();
    },
    dot: function (x, y, size, color) {
      const c = turtleCtx();
      if (!c) return;
      c.fillStyle = String(color);
      c.beginPath();
      c.arc(tx(c, x), ty(c, y), Math.max(1, size / 2), 0, Math.PI * 2);
      c.fill();
    },
    text: function (x, y, text, color, size, align, fontName) {
      const c = turtleCtx();
      if (!c) return;
      c.fillStyle = String(color);
      c.font = "bold " + (Number(size) || 12) + "px " + (fontName || "Arial") + ", sans-serif";
      c.textAlign = align === "center" ? "center" : align === "right" ? "right" : "left";
      c.textBaseline = "bottom";
      c.fillText(String(text), tx(c, x), ty(c, y));
    },
    bg: function (color) {
      if (!active || !active.opts.turtle) return;
      active.opts.turtle.canvas.style.background = String(color || "");
    },
    wipe: function () {
      const c = turtleCtx();
      if (!c) return;
      c.clearRect(0, 0, c.canvas.width, c.canvas.height);
    },
    sprite: function (x, y, heading, visible) {
      const c = spriteCtx();
      if (!c) return;
      c.clearRect(0, 0, c.canvas.width, c.canvas.height);
      if (!visible) return;
      c.save();
      c.translate(tx(c, x), ty(c, y));
      // Heading 0 = east; the sprite art faces right, so just counter the
      // canvas's flipped y axis.
      c.rotate(-heading * Math.PI / 180);
      const size = 30;
      if (turtleSpriteImg.complete && turtleSpriteImg.naturalWidth) {
        c.drawImage(turtleSpriteImg, -size / 2, -size / 2, size, size);
      } else {
        // Image still decoding on the very first frame: simple pointer stand-in.
        c.fillStyle = "#2e9e63";
        c.beginPath();
        c.moveTo(10, 0); c.lineTo(-7, 6); c.lineTo(-4, 0); c.lineTo(-7, -6);
        c.closePath();
        c.fill();
      }
      c.restore();
    }
  };

  // ---- Shared IO (input/clear/colour print), dispatched to `active` --------

  function appendToActive(text, kind) {
    if (active) active.appendOut(text, kind);
  }

  function readLineInteractive(promptText) {
    return new Promise(function (resolve, reject) {
      if (!active) { reject(new Error("No active runner")); return; }
      const output = active.opts.output;
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

      const cursor = document.createElement("span");
      cursor.className = "sandbox-cursor";
      cursor.setAttribute("aria-hidden", "true");
      line.appendChild(cursor);

      output.appendChild(line);
      output.scrollTop = output.scrollHeight;

      function resize() {
        field.size = Math.max(1, field.value.length);
      }
      field.addEventListener("input", resize);
      line.addEventListener("mousedown", function (e) {
        if (e.target !== field) { e.preventDefault(); field.focus(); }
      });

      field.focus({ preventScroll: true });
      Promise.resolve().then(function () { field.focus({ preventScroll: true }); });

      function cleanup() {
        pendingReject = null;
        field.removeEventListener("input", resize);
        field.removeEventListener("keydown", onKey);
      }

      function onKey(e) {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const value = field.value;
        cleanup();
        const echo = document.createElement("span");
        echo.className = "out-stdin";
        echo.textContent = value;
        line.replaceChild(echo, field);
        if (cursor.parentNode === line) line.removeChild(cursor);
        line.appendChild(document.createTextNode("\n"));
        output.scrollTop = output.scrollHeight;
        resolve(value);
      }

      pendingReject = function (err) {
        cleanup();
        if (field.parentNode === line) {
          const stopMark = document.createElement("span");
          stopMark.className = "out-stderr";
          stopMark.textContent = "[stopped]";
          line.replaceChild(stopMark, field);
        }
        if (cursor.parentNode === line) line.removeChild(cursor);
        line.appendChild(document.createTextNode("\n"));
        reject(err);
      };

      field.addEventListener("keydown", onKey);
    });
  }

  function interruptibleSleep(seconds) {
    return new Promise(function (resolve, reject) {
      const timer = setTimeout(function () {
        pendingReject = null;
        resolve();
      }, Math.max(0, seconds * 1000));
      pendingReject = function (err) {
        clearTimeout(timer);
        reject(err);
      };
    });
  }

  const SANDBOX_IO = {
    readLine: readLineInteractive,
    sleepMs: interruptibleSleep,
    shouldStop: function () {
      if (!stopRequested) return false;
      stopRequested = false;
      return true;
    },
    clearOutput: function () {
      if (active) active.opts.output.innerHTML = "";
    },
    writeColored: function (text, color) {
      if (!active) return;
      const output = active.opts.output;
      const span = document.createElement("span");
      span.style.color = String(color || "");
      span.textContent = String(text);
      output.appendChild(span);
      output.scrollTop = output.scrollHeight;
    }
  };

  // ---- Pyodide bootstrap ----------------------------------------------------

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
      appendToActive("Loading Python runtime (one-time, ~10 MB)…", "info");
      await loadPyodideScript();
      const py = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v" + PYODIDE_VERSION + "/full/"
      });
      py.setStdout({ batched: function (s) { appendToActive(s, "stdout"); } });
      py.setStderr({ batched: function (s) { appendToActive(s, "stderr"); } });
      py.registerJsModule("_sandbox_io", SANDBOX_IO);
      py.registerJsModule("_turtle_io", TURTLE_IO);
      const useJspi = jspiSupported();
      await py.runPythonAsync(useJspi ? PY_INSTALL_INPUT : PY_DISABLE_INPUT);
      if (useJspi) await py.runPythonAsync(PY_PATCH_SLEEP);
      await py.runPythonAsync(PY_INSTALL_INTERRUPT);
      await py.runPythonAsync(PY_INSTALL_CLEAR);
      await py.runPythonAsync(PY_INSTALL_COLOR_PRINT);
      await py.runPythonAsync(PY_INSTALL_TURTLE);
      appendToActive("Python ready. Running your code…", "info");
      pyodide = py;
      return py;
    })();

    return loadingPromise;
  }

  // ---- Runner factory --------------------------------------------------------

  function create(opts) {
    const editor = opts.editor;
    const output = opts.output;
    const runBtn = opts.runBtn;
    const runLabel = runBtn ? runBtn.querySelector(".sandbox-run-label") : null;
    let jar = null;

    const runner = {
      opts: opts,
      turtleCtx: null,
      spriteCtx: null,
      appendOut: function (text, kind) {
        const span = document.createElement("span");
        if (kind) span.className = "out-" + kind;
        span.textContent = text + (text.endsWith("\n") ? "" : "\n");
        output.appendChild(span);
        output.scrollTop = output.scrollHeight;
      }
    };

    if (opts.turtle && opts.turtle.canvas) {
      runner.turtleCtx = opts.turtle.canvas.getContext("2d");
      if (opts.turtle.sprite) runner.spriteCtx = opts.turtle.sprite.getContext("2d");
    }

    // storageKey and defaultCode may be plain values or functions, so a
    // page can swap save slots on the fly (e.g. per assignment track).
    function storageKey() {
      return typeof opts.storageKey === "function" ? opts.storageKey() : opts.storageKey;
    }
    function defaultCode() {
      return typeof opts.defaultCode === "function" ? opts.defaultCode() : (opts.defaultCode || "");
    }
    function getCode() {
      return jar ? jar.toString() : editor.textContent;
    }
    function setCode(code) {
      if (jar) jar.updateCode(code);
      else editor.textContent = code;
      saveCode(code);
    }
    function loadSaved() {
      const k = storageKey();
      const saved = k ? localStorage.getItem(k) : null;
      return (saved && saved.length) ? saved : defaultCode();
    }
    function saveCode(code) {
      const k = storageKey();
      if (!k) return;
      localStorage.setItem(k, code == null ? getCode() : code);
    }

    function setRunMode(mode) {
      const isLoading = mode === "loading";
      const isBusy = mode === "busy" || isLoading;
      if (runLabel) {
        runLabel.textContent = isLoading ? "Loading…" : isBusy ? "Stop" : "Run";
      } else if (runBtn) {
        runBtn.textContent = isLoading ? "Loading…" : isBusy ? "Stop" : "Run";
      }
      if (runBtn) {
        runBtn.disabled = isLoading;
        runBtn.classList.toggle("is-busy", isBusy);
        runBtn.classList.toggle("btn-primary", !isBusy);
        runBtn.classList.toggle("btn-danger", isBusy && !isLoading);
      }
    }

    function stop() {
      if (!running) return;
      stopRequested = true;
      if (pendingReject) {
        const r = pendingReject;
        pendingReject = null;
        r(new Error("Stopped by user"));
      }
    }

    function clearOut() { output.innerHTML = ""; }

    function resetTurtle() {
      if (!runner.turtleCtx) return;
      const c = runner.turtleCtx;
      c.clearRect(0, 0, c.canvas.width, c.canvas.height);
      opts.turtle.canvas.style.background = "";
      if (runner.spriteCtx) {
        runner.spriteCtx.clearRect(0, 0, runner.spriteCtx.canvas.width, runner.spriteCtx.canvas.height);
      }
    }

    async function run() {
      if (running) { stop(); return; }
      running = true;
      active = runner;
      stopRequested = false;
      pendingReject = null;
      clearOut();
      resetTurtle();
      setRunMode(pyodide ? "busy" : "loading");
      if (opts.onRunStart) opts.onRunStart();
      try {
        const py = await ensurePyodide();
        setRunMode("busy");
        // Fresh turtle position/colour every run, so re-running a
        // drawing behaves like running a .py file from scratch.
        await py.runPythonAsync(
          "import sys\n" +
          "if 'turtle' in sys.modules:\n" +
          "    sys.modules['turtle']._reset_all()\n"
        );
        resetTurtle();
        await py.runPythonAsync(getCode());
      } catch (err) {
        const msg = (err && err.message) ? String(err.message) : String(err);
        if (/Stopped by user|KeyboardInterrupt/.test(msg)) {
          runner.appendOut("[stopped]", "info");
        } else {
          runner.appendOut(msg, "stderr");
        }
      } finally {
        running = false;
        stopRequested = false;
        pendingReject = null;
        setRunMode("idle");
        if (opts.onRunEnd) opts.onRunEnd();
      }
    }

    function enableHighlighting(CodeJar) {
      jar = CodeJar(editor, function (el) {
        window.Prism.highlightElement(el);
      }, {
        tab: "    ",
        indentOn: /[(\[{:]\s*$/
      });
      jar.updateCode(loadSaved());
      jar.onUpdate(function (code) { saveCode(code); });
    }

    function enablePlainEditor() {
      editor.contentEditable = "plaintext-only";
      editor.textContent = loadSaved();
      editor.addEventListener("input", function () { saveCode(); });
    }

    function initEditor() {
      editor.textContent = loadSaved();
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

    editor.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        run();
      }
    });
    if (runBtn) runBtn.addEventListener("click", run);

    initEditor();

    return {
      run: run,
      stop: stop,
      getCode: getCode,
      setCode: setCode,
      reloadSaved: function () { setCode(loadSaved()); },
      clearOutput: clearOut,
      isRunning: function () { return running && active === runner; }
    };
  }

  window.PyRun = { create: create, jspiSupported: jspiSupported };
})();
