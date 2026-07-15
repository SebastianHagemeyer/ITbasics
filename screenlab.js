/*
 * Explore the Screen: temporal + spatial colour mixing demo.
 * A grid of cells cycles red -> green -> blue. Neighbouring cells are offset
 * so at any instant the screen holds equal red, green and blue. That keeps
 * the overall brightness steady (no full-screen strobing, which matters for
 * photosensitive students) while still letting the colours blend to white
 * once the cells are small and the speed is high.
 */
(function () {
  "use strict";

  const canvas = document.getElementById("screenlab-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const stage    = document.getElementById("screenlab-stage");
  const speedIn  = document.getElementById("screenlab-speed");
  const sizeIn   = document.getElementById("screenlab-size");
  const speedVal = document.getElementById("screenlab-speed-val");
  const sizeVal  = document.getElementById("screenlab-size-val");
  const whiteIn  = document.getElementById("screenlab-white");
  const fsBtn    = document.getElementById("screenlab-fs");
  const capNote  = document.getElementById("screenlab-cap");

  // Big flashing panels are rough on some eyes (and on photosensitive
  // epilepsy in particular), so full speed only unlocks once the cells
  // are small. Below this subdivision level the speed is capped.
  const SAFE_LEVEL = 4;
  const CAPPED_SPEED = 3;

  function grid(level) {
    // Level 0 is the three big stripes; every step doubles the cell count,
    // alternating between splitting columns and splitting rows.
    const cols = 3 * Math.pow(2, Math.ceil(level / 2));
    const rows = Math.pow(2, Math.floor(level / 2));
    return { cols: cols, rows: rows };
  }

  // How the three colours combine:
  //   turns  - each cell has a fixed colour and only one colour is lit at a
  //            time (like a colour-wheel projector). Pure persistence of
  //            vision, dimmer blend.
  //   swap   - every cell stays lit and the colours rotate around. Brightest
  //            blend, temporal + spatial mixing at once.
  //   steady - nothing flashes; fixed colours side by side, exactly like the
  //            subpixels of a real screen. Pure spatial mixing.
  let mode = "turns";

  function settings() {
    const level = parseInt(sizeIn.value, 10) || 0;
    let speed = parseFloat(speedIn.value) || 0;
    let capped = false;
    if (mode !== "steady" && level < SAFE_LEVEL && speed > CAPPED_SPEED) {
      speed = CAPPED_SPEED;
      capped = true;
    }
    return { level: level, speed: speed, capped: capped };
  }

  function updateLabels() {
    const s = settings();
    const g = grid(s.level);
    if (mode === "steady") {
      speedVal.textContent = "no flashing in Steady";
    } else {
      speedVal.textContent = s.speed === 0
        ? "paused"
        : s.speed + (s.speed === 1 ? " swap" : " swaps") + " a second";
    }
    speedIn.disabled = mode === "steady";
    sizeVal.textContent = (g.cols * g.rows) + " lights";
    if (capNote) {
      capNote.hidden = !s.capped;
    }
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
  }

  // Cells are rendered one pixel each into a small offscreen buffer, then
  // scaled up with smoothing off (nearest neighbour keeps the edges crisp).
  // That stays fast even at hundreds of thousands of cells, where drawing
  // a fillRect per cell would crawl.
  const buf = document.createElement("canvas");
  const bctx = buf.getContext("2d");
  let bufImg = null;

  function draw(nowMs) {
    resize();
    const s = settings();
    const g = grid(s.level);
    const w = canvas.width;
    const h = canvas.height;
    const phase = s.speed > 0 ? Math.floor((nowMs / 1000) * s.speed) : 0;

    if (buf.width !== g.cols || buf.height !== g.rows) {
      buf.width = g.cols;
      buf.height = g.rows;
      bufImg = bctx.createImageData(g.cols, g.rows);
    }
    const d = bufImg.data;
    const litColor = phase % 3;
    let i = 0;
    for (let row = 0; row < g.rows; row++) {
      for (let col = 0; col < g.cols; col++) {
        let c;
        if (mode === "swap") {
          // Every cell lit; the colours rotate around the grid.
          c = (col + row + phase) % 3;
        } else {
          // Fixed colour per cell, like real subpixels. In "turns" only one
          // colour is lit at a time; the rest go dark. "steady" never flashes.
          c = (col + row) % 3;
          if (mode === "turns" && c !== litColor) c = -1;
        }
        d[i]     = c === 0 ? 255 : 0;
        d[i + 1] = c === 1 ? 255 : 0;
        d[i + 2] = c === 2 ? 255 : 0;
        d[i + 3] = 255;
        i += 4;
      }
    }
    bctx.putImageData(bufImg, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(buf, 0, 0, w, h);

    // Optional comparison spot: a circle of REAL white in the middle. When
    // the illusion is working, the surroundings match it.
    if (whiteIn && whiteIn.checked) {
      const r = Math.min(w, h) / 7;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.lineWidth = Math.max(2, r / 24);
      ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  speedIn.addEventListener("input", updateLabels);
  sizeIn.addEventListener("input", updateLabels);

  const modeBtns = document.querySelectorAll(".screenlab-mode");
  modeBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      mode = btn.dataset.mode;
      modeBtns.forEach(function (b) { b.classList.toggle("active", b === btn); });
      updateLabels();
    });
  });

  if (fsBtn && stage.requestFullscreen) {
    fsBtn.addEventListener("click", function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else stage.requestFullscreen();
    });
    document.addEventListener("fullscreenchange", function () {
      fsBtn.textContent = document.fullscreenElement ? "Exit full screen" : "Full screen";
    });
  } else if (fsBtn) {
    fsBtn.hidden = true;
  }

  updateLabels();
  requestAnimationFrame(draw);
})();
