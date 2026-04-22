/*
 * Student Work Feedback tool.
 *
 * Flow:
 *   1. Student/teacher uploads an image of completed work.
 *   2. The image is drawn to a canvas and displayed with an overlay layer.
 *   3. Regions containing questions are found either:
 *        a. Automatically via horizontal projection of a binarised copy of
 *           the image (rows of "ink" are grouped, rows of whitespace split
 *           groups).
 *        b. Manually: the user drags on the canvas to create a box.
 *   4. Each region is cropped to its own small canvas/dataURL.
 *   5. OCR (Tesseract.js, loaded from CDN) extracts the text of each crop.
 *      If Tesseract is unavailable, a manual textarea is shown instead.
 *   6. The OCR text is fuzzy-matched against the answer key for the
 *      selected module, using token overlap + Levenshtein similarity.
 *   7. A feedback card is rendered next to the cropped image with a
 *      verdict, the matched question, extracted answer and AI-style
 *      guidance referencing the cropped region.
 */

(function () {
  "use strict";

  // ---------- State ----------

  const state = {
    image: null,            // HTMLImageElement of the uploaded work
    scale: 1,               // canvas display scale relative to natural size
    boxes: [],              // [{id, x, y, w, h, naturalX, ...}]
    nextBoxId: 1,
    selectedBoxId: null,
    drawing: null,          // {startX, startY, id} while dragging a new box
    ocrResults: {},         // { [boxId]: { text, done } }
  };

  // ---------- DOM refs ----------

  const fileInput = document.getElementById("fb-file");
  const moduleSelect = document.getElementById("fb-module");
  const studentInput = document.getElementById("fb-student");
  const detectBtn = document.getElementById("fb-detect");
  const clearBtn = document.getElementById("fb-clear");
  const analyseBtn = document.getElementById("fb-analyse");
  const printBtn = document.getElementById("fb-print");
  const hint = document.getElementById("fb-hint");
  const workspace = document.getElementById("fb-workspace");
  const canvas = document.getElementById("fb-canvas");
  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("fb-overlay");
  const boxList = document.getElementById("fb-boxlist");
  const report = document.getElementById("fb-report");

  // ---------- Utility: fuzzy matching ----------

  function normalise(str) {
    return (str || "")
      .toLowerCase()
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z]+;/g, " ")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const STOPWORDS = new Set([
    "a","an","the","is","are","of","to","in","on","for","and","or","but",
    "that","this","these","those","what","which","does","do","it","as",
    "with","you","your","i","we","they","be","been","being","has","have",
    "had","will","would","can","could","should","than","then","so"
  ]);

  function tokens(str) {
    return normalise(str).split(" ").filter(function (t) {
      return t && !STOPWORDS.has(t);
    });
  }

  function tokenOverlap(a, b) {
    const aa = tokens(a);
    const bb = tokens(b);
    if (!aa.length || !bb.length) return 0;
    const setA = new Set(aa);
    let hits = 0;
    bb.forEach(function (t) { if (setA.has(t)) hits++; });
    return hits / Math.max(aa.length, bb.length);
  }

  function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const prev = new Array(b.length + 1);
    const curr = new Array(b.length + 1);
    for (let j = 0; j <= b.length; j++) prev[j] = j;
    for (let i = 1; i <= a.length; i++) {
      curr[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        curr[j] = Math.min(
          curr[j - 1] + 1,
          prev[j] + 1,
          prev[j - 1] + cost
        );
      }
      for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
    }
    return prev[b.length];
  }

  function similarity(a, b) {
    const na = normalise(a);
    const nb = normalise(b);
    if (!na || !nb) return 0;
    const d = levenshtein(na, nb);
    const maxLen = Math.max(na.length, nb.length);
    const lev = 1 - d / maxLen;
    const overlap = tokenOverlap(a, b);
    // Token overlap dominates for long sentences, Levenshtein keeps short
    // answers honest.
    return 0.65 * overlap + 0.35 * lev;
  }

  // ---------- Image loading ----------

  fileInput.addEventListener("change", function (e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = function () {
      URL.revokeObjectURL(url);
      loadImage(img);
    };
    img.onerror = function () {
      URL.revokeObjectURL(url);
      alert("Sorry, that image could not be loaded.");
    };
    img.src = url;
  });

  function loadImage(img) {
    state.image = img;
    state.boxes = [];
    state.selectedBoxId = null;
    state.nextBoxId = 1;
    state.ocrResults = {};

    // Fit image to container width while keeping resolution high enough
    // for OCR. We cap the canvas display width; the backing canvas holds
    // the full-resolution pixels so OCR has something to work with.
    const wrap = canvas.parentElement;
    const maxDisplay = Math.min(wrap.clientWidth - 16, 960);
    state.scale = Math.min(1, maxDisplay / img.naturalWidth);
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.style.width = (img.naturalWidth * state.scale) + "px";
    canvas.style.height = (img.naturalHeight * state.scale) + "px";
    overlay.style.width = canvas.style.width;
    overlay.style.height = canvas.style.height;

    ctx.drawImage(img, 0, 0);

    workspace.hidden = false;
    detectBtn.disabled = false;
    clearBtn.disabled = false;
    analyseBtn.disabled = false;
    printBtn.disabled = true;
    report.hidden = true;
    report.innerHTML = "";
    hint.innerHTML = "Image loaded. Drag on it to draw a box around a question, or click <em>Auto-detect regions</em>.";
    overlay.innerHTML = "";
    renderBoxList();
  }

  // ---------- Drawing boxes by hand ----------

  canvas.addEventListener("pointerdown", function (e) {
    if (!state.image) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / state.scale;
    const y = (e.clientY - rect.top) / state.scale;
    state.drawing = { startX: x, startY: y, id: state.nextBoxId++ };
    const box = {
      id: state.drawing.id,
      naturalX: x, naturalY: y, naturalW: 0, naturalH: 0
    };
    state.boxes.push(box);
    canvas.setPointerCapture(e.pointerId);
    renderBoxes();
  });

  canvas.addEventListener("pointermove", function (e) {
    if (!state.drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / state.scale;
    const y = (e.clientY - rect.top) / state.scale;
    const box = state.boxes.find(function (b) { return b.id === state.drawing.id; });
    if (!box) return;
    box.naturalX = Math.min(state.drawing.startX, x);
    box.naturalY = Math.min(state.drawing.startY, y);
    box.naturalW = Math.abs(x - state.drawing.startX);
    box.naturalH = Math.abs(y - state.drawing.startY);
    renderBoxes();
  });

  canvas.addEventListener("pointerup", function (e) {
    if (!state.drawing) return;
    const box = state.boxes.find(function (b) { return b.id === state.drawing.id; });
    state.drawing = null;
    if (!box || box.naturalW < 20 || box.naturalH < 20) {
      // Too small: treat as a click and discard.
      state.boxes = state.boxes.filter(function (b) { return b !== box; });
    } else {
      state.selectedBoxId = box.id;
    }
    renderBoxes();
    renderBoxList();
    try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
  });

  // ---------- Auto-detect regions ----------
  //
  // Simple but effective: binarise the image, build a horizontal
  // projection (count of dark pixels per row), then walk it splitting
  // bands of ink separated by blank rows. Bands shorter than a threshold
  // are merged into their neighbour. Each resulting band becomes a box.

  detectBtn.addEventListener("click", function () {
    if (!state.image) return;
    const w = canvas.width, h = canvas.height;
    // Downsample for speed.
    const scale = Math.min(1, 800 / w);
    const tmp = document.createElement("canvas");
    tmp.width = Math.max(1, Math.round(w * scale));
    tmp.height = Math.max(1, Math.round(h * scale));
    const tctx = tmp.getContext("2d");
    tctx.drawImage(canvas, 0, 0, tmp.width, tmp.height);
    const data = tctx.getImageData(0, 0, tmp.width, tmp.height).data;

    // Build row-darkness profile (fraction of "dark" pixels per row).
    const profile = new Float32Array(tmp.height);
    for (let y = 0; y < tmp.height; y++) {
      let dark = 0;
      for (let x = 0; x < tmp.width; x++) {
        const i = (y * tmp.width + x) * 4;
        const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        if (luma < 150) dark++;
      }
      profile[y] = dark / tmp.width;
    }

    // Find bands: rows above a small threshold, separated by gaps of
    // near-blank rows. The thresholds are chosen to tolerate noisy phone
    // photos.
    const INK = 0.015;     // rows with >=1.5% dark pixels count as ink
    const MIN_GAP = Math.max(8, Math.round(tmp.height * 0.015));
    const MIN_BAND = Math.max(14, Math.round(tmp.height * 0.03));

    const bands = [];
    let inBand = false, bandStart = 0, gapRun = 0;
    for (let y = 0; y < tmp.height; y++) {
      if (profile[y] >= INK) {
        if (!inBand) { inBand = true; bandStart = y; }
        gapRun = 0;
      } else if (inBand) {
        gapRun++;
        if (gapRun >= MIN_GAP) {
          const end = y - gapRun;
          if (end - bandStart >= MIN_BAND) bands.push([bandStart, end]);
          inBand = false;
          gapRun = 0;
        }
      }
    }
    if (inBand) {
      const end = tmp.height - 1;
      if (end - bandStart >= MIN_BAND) bands.push([bandStart, end]);
    }

    if (!bands.length) {
      alert("Could not auto-detect any question regions. Try drawing boxes by hand.");
      return;
    }

    // Clear existing auto-detected boxes (keep hand-drawn ones tagged).
    state.boxes = state.boxes.filter(function (b) { return b.manual; });

    // Convert each band to a box at full canvas resolution. Pad vertically
    // a bit so the text isn't clipped.
    bands.forEach(function (band) {
      const pad = 6 / scale;
      const naturalY = Math.max(0, band[0] / scale - pad);
      const naturalH = Math.min(h - naturalY, (band[1] - band[0]) / scale + pad * 2);
      state.boxes.push({
        id: state.nextBoxId++,
        naturalX: 0,
        naturalY: naturalY,
        naturalW: w,
        naturalH: naturalH,
        auto: true
      });
    });

    hint.textContent = "Auto-detected " + bands.length + " region(s). You can drag on the image to add more, or tap the ✕ on a box to remove it.";
    renderBoxes();
    renderBoxList();
  });

  clearBtn.addEventListener("click", function () {
    state.boxes = [];
    state.selectedBoxId = null;
    renderBoxes();
    renderBoxList();
  });

  // ---------- Rendering boxes & sidebar ----------

  function renderBoxes() {
    overlay.innerHTML = "";
    state.boxes.forEach(function (box, idx) {
      const el = document.createElement("div");
      el.className = "fb-box" + (box.id === state.selectedBoxId ? " selected" : "");
      el.style.left = (box.naturalX * state.scale) + "px";
      el.style.top = (box.naturalY * state.scale) + "px";
      el.style.width = (box.naturalW * state.scale) + "px";
      el.style.height = (box.naturalH * state.scale) + "px";

      const label = document.createElement("div");
      label.className = "fb-box-label";
      label.textContent = "Q" + (idx + 1);
      el.appendChild(label);

      const remove = document.createElement("button");
      remove.className = "fb-box-remove";
      remove.type = "button";
      remove.title = "Remove region";
      remove.textContent = "×";
      remove.addEventListener("click", function (e) {
        e.stopPropagation();
        state.boxes = state.boxes.filter(function (b) { return b.id !== box.id; });
        if (state.selectedBoxId === box.id) state.selectedBoxId = null;
        renderBoxes();
        renderBoxList();
      });
      el.appendChild(remove);

      el.addEventListener("click", function (e) {
        e.stopPropagation();
        state.selectedBoxId = box.id;
        renderBoxes();
        renderBoxList();
      });

      overlay.appendChild(el);
    });
  }

  function renderBoxList() {
    boxList.innerHTML = "";
    state.boxes.forEach(function (box, idx) {
      const item = document.createElement("div");
      item.className = "fb-boxitem" + (box.id === state.selectedBoxId ? " selected" : "");
      item.addEventListener("click", function () {
        state.selectedBoxId = box.id;
        renderBoxes();
        renderBoxList();
      });

      const head = document.createElement("div");
      head.className = "fb-boxitem-head";
      head.innerHTML = "<span>Q" + (idx + 1) + "</span>" +
        '<span class="fb-boxitem-dim">' +
        Math.round(box.naturalW) + "×" + Math.round(box.naturalH) + " px" +
        "</span>";
      item.appendChild(head);

      const preview = document.createElement("img");
      preview.className = "fb-boxitem-preview";
      preview.src = cropToDataUrl(box);
      preview.alt = "Crop of question " + (idx + 1);
      item.appendChild(preview);

      boxList.appendChild(item);
    });
  }

  function cropToDataUrl(box) {
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(box.naturalW));
    c.height = Math.max(1, Math.round(box.naturalH));
    const cc = c.getContext("2d");
    cc.drawImage(
      state.image,
      box.naturalX, box.naturalY, box.naturalW, box.naturalH,
      0, 0, c.width, c.height
    );
    return c.toDataURL("image/png");
  }

  // ---------- OCR ----------

  function ocrAvailable() {
    return typeof Tesseract !== "undefined" && Tesseract && Tesseract.recognize;
  }

  function runOcr(box, onProgress) {
    if (!ocrAvailable()) {
      return Promise.resolve({ text: "", available: false });
    }
    const url = cropToDataUrl(box);
    return Tesseract.recognize(url, "eng", {
      logger: function (m) {
        if (onProgress && m.status === "recognizing text") {
          onProgress(m.progress);
        }
      }
    }).then(function (res) {
      const text = (res && res.data && res.data.text) || "";
      return { text: text, available: true };
    }).catch(function (err) {
      console.warn("OCR failed for box", box.id, err);
      return { text: "", available: true, error: err };
    });
  }

  // ---------- Analysis ----------
  //
  // For each region:
  //   - Read (OCR) its text.
  //   - Compare the text to every question in the chosen module, pick
  //     the best match (similarity score).
  //   - Extract what looks like the student's chosen answer (see
  //     extractStudentAnswer below) and compare it to the correct option.
  //   - Emit a feedback card.

  analyseBtn.addEventListener("click", function () {
    if (!state.image || !state.boxes.length) {
      alert("Upload an image and create at least one question region first.");
      return;
    }
    analyse();
  });

  async function analyse() {
    const moduleName = moduleSelect.value;
    const quizzes = window.HallamQuizzes || {};
    const key = quizzes[moduleName];
    if (!key) {
      alert("Answer key for module \"" + moduleName + "\" is not loaded.");
      return;
    }

    report.hidden = false;
    report.innerHTML = "";
    const header = document.createElement("div");
    header.className = "fb-report-header";
    header.innerHTML =
      "<h2>Feedback report <span class=\"fb-score-pill\" id=\"fb-score-pill\">…</span></h2>" +
      "<p id=\"fb-report-meta\">Reading each region with OCR, then comparing to the answer key.</p>";
    report.appendChild(header);

    analyseBtn.disabled = true;
    detectBtn.disabled = true;
    clearBtn.disabled = true;

    const results = [];
    const ocrOk = ocrAvailable();

    for (let i = 0; i < state.boxes.length; i++) {
      const box = state.boxes[i];
      const card = makeCardSkeleton(i + 1, box);
      report.appendChild(card.el);

      let ocrText = "";
      if (ocrOk) {
        card.setStatus("Reading text…", "working");
        const r = await runOcr(box, function (p) {
          card.setStatus("Reading text… " + Math.round(p * 100) + "%", "working");
        });
        ocrText = r.text || "";
      } else {
        card.setStatus("OCR unavailable — please type what this region says.", "");
        ocrText = await card.waitForManualText();
      }

      const analysis = analyseRegion(ocrText, key, moduleName);
      results.push(analysis);
      card.render(ocrText, analysis);
    }

    // Overall score
    const scored = results.filter(function (r) { return r.verdict !== "unknown"; });
    const correct = scored.filter(function (r) { return r.verdict === "correct"; }).length;
    const pill = document.getElementById("fb-score-pill");
    const meta = document.getElementById("fb-report-meta");
    if (scored.length) {
      const pct = Math.round(correct / scored.length * 100);
      pill.textContent = correct + " / " + scored.length + " (" + pct + "%)";
      pill.classList.add(pct >= 80 ? "high" : pct >= 50 ? "mid" : "low");
    } else {
      pill.textContent = "–";
    }
    const student = studentInput.value.trim();
    meta.textContent =
      (student ? student + " · " : "") +
      moduleSelect.options[moduleSelect.selectedIndex].text +
      " · " + state.boxes.length + " region(s) analysed on " +
      new Date().toLocaleDateString();

    analyseBtn.disabled = false;
    detectBtn.disabled = false;
    clearBtn.disabled = false;
    printBtn.disabled = false;
  }

  function makeCardSkeleton(num, box) {
    const el = document.createElement("article");
    el.className = "fb-card";

    const crop = document.createElement("div");
    crop.className = "fb-card-crop";
    const img = document.createElement("img");
    img.src = cropToDataUrl(box);
    img.alt = "Cropped question " + num + " from student work";
    crop.appendChild(img);
    const cap = document.createElement("div");
    cap.className = "fb-crop-caption";
    cap.textContent = "Region " + num + " from student's work";
    crop.appendChild(cap);
    el.appendChild(crop);

    const body = document.createElement("div");
    body.className = "fb-card-body";
    const status = document.createElement("p");
    status.className = "fb-status";
    status.textContent = "Queued…";
    body.appendChild(status);
    el.appendChild(body);

    let manualResolve = null;

    return {
      el: el,
      setStatus: function (text, cls) {
        status.className = "fb-status" + (cls ? " " + cls : "");
        status.textContent = text;
      },
      waitForManualText: function () {
        return new Promise(function (resolve) {
          const ta = document.createElement("textarea");
          ta.className = "fb-manual-text";
          ta.placeholder = "Type exactly what this region says (include the student's chosen answer).";
          body.appendChild(ta);
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "btn btn-ghost";
          btn.style.marginTop = "8px";
          btn.textContent = "Use this text";
          body.appendChild(btn);
          manualResolve = resolve;
          btn.addEventListener("click", function () {
            const v = ta.value;
            ta.disabled = true;
            btn.disabled = true;
            manualResolve(v);
          }, { once: true });
        });
      },
      render: function (ocrText, analysis) {
        body.innerHTML = "";

        const title = document.createElement("h3");
        title.className = "fb-card-title";
        title.innerHTML =
          '<span class="fb-card-num">Q' + num + "</span>" +
          "<span>" + escapeHtml(analysis.matchedQuestion || "Unrecognised question") + "</span>" +
          (analysis.matchedQuestion
            ? '<span class="fb-card-qmatch">· matched ' + Math.round(analysis.questionMatchScore * 100) + "%</span>"
            : "");
        body.appendChild(title);

        const verdict = document.createElement("span");
        verdict.className = "fb-verdict " + analysis.verdict;
        verdict.textContent = ({
          correct: "Correct",
          partial: "Partially correct",
          incorrect: "Incorrect",
          unknown: "Could not judge"
        })[analysis.verdict] || analysis.verdict;
        body.appendChild(verdict);

        const rows = document.createElement("dl");
        rows.className = "fb-card-rows";
        rows.innerHTML =
          "<dt>Student answer</dt><dd>" +
            (analysis.studentAnswer
              ? "<mark>" + escapeHtml(analysis.studentAnswer) + "</mark>"
              : "<em>Not detected</em>") +
          "</dd>" +
          "<dt>Expected answer</dt><dd>" +
            (analysis.correctAnswer
              ? escapeHtml(analysis.correctAnswer)
              : "<em>n/a</em>") +
          "</dd>";
        body.appendChild(rows);

        const fb = document.createElement("div");
        fb.className = "fb-card-feedback";
        fb.innerHTML = "<strong>Feedback:</strong> " + analysis.feedback;
        body.appendChild(fb);

        const actions = document.createElement("div");
        actions.className = "fb-card-actions";
        const toggleBtn = document.createElement("button");
        toggleBtn.type = "button";
        toggleBtn.textContent = "Show raw OCR";
        actions.appendChild(toggleBtn);
        body.appendChild(actions);

        const ocrPre = document.createElement("pre");
        ocrPre.className = "fb-card-ocr";
        ocrPre.textContent = ocrText.trim() || "(no text extracted)";
        body.appendChild(ocrPre);
        toggleBtn.addEventListener("click", function () {
          const open = ocrPre.classList.toggle("open");
          toggleBtn.textContent = open ? "Hide raw OCR" : "Show raw OCR";
        });
      }
    };
  }

  // ---------- Per-region analysis ----------

  function analyseRegion(ocrText, key, moduleName) {
    const text = (ocrText || "").trim();
    if (!text) {
      return {
        matchedQuestion: null,
        questionMatchScore: 0,
        correctAnswer: null,
        studentAnswer: null,
        verdict: "unknown",
        feedback:
          "No text was extracted from this crop. Try redrawing the box tighter around the question, or type the text manually."
      };
    }

    // Find best-matching question in the answer key.
    let best = null;
    let bestScore = 0;
    key.forEach(function (item, idx) {
      const score = similarity(text, item.q);
      if (score > bestScore) { bestScore = score; best = { item: item, idx: idx }; }
    });

    if (!best || bestScore < 0.18) {
      return {
        matchedQuestion: null,
        questionMatchScore: bestScore,
        correctAnswer: null,
        studentAnswer: null,
        verdict: "unknown",
        feedback:
          "This region doesn't look like any of the " + moduleName +
          " quiz questions. It may be a heading, an instruction, or the " +
          "OCR could not read the handwriting clearly."
      };
    }

    const correctText = stripHtml(best.item.options[best.item.answer]);
    const student = extractStudentAnswer(text, best.item);
    const verdict = judge(student, correctText, best.item);
    const feedback = buildFeedback(verdict, student, correctText, best.item);

    return {
      matchedQuestion: stripHtml(best.item.q),
      questionMatchScore: bestScore,
      correctAnswer: correctText,
      studentAnswer: student,
      verdict: verdict,
      feedback: feedback
    };
  }

  // Look at the OCR text and try to pull out the option the student
  // chose. Strategies, in order:
  //   1. A ticked / circled / underlined marker next to one option
  //      (✓, ✔, ✗, *, [x], (x), a scribbled letter like "(b)").
  //   2. The option with the greatest similarity to any non-question
  //      portion of the text.
  //   3. Null if nothing comes close.
  function extractStudentAnswer(text, item) {
    const optionsPlain = item.options.map(stripHtml);
    // Remove the question text to reduce noise.
    const questionPlain = stripHtml(item.q);
    const qTokens = new Set(tokens(questionPlain));
    const lines = text.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean);

    // 1. Look for an explicit tick / marker next to an option.
    const markerRe = /(?:[✓✔☑]|\[[xX×]\]|\([xX×]\)|\*|<<|=>|→)/;
    for (let i = 0; i < lines.length; i++) {
      if (markerRe.test(lines[i])) {
        const cleaned = lines[i].replace(markerRe, " ").trim();
        const pick = bestOption(cleaned, optionsPlain, 0.35);
        if (pick) return pick;
      }
    }

    // 1b. Look for a letter answer like "b" or "B)" on its own line or
    // at the start of a line.
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^\s*\(?([a-dA-D1-4])\)?[\.\)\:\-]/);
      if (m) {
        const letter = m[1].toLowerCase();
        const idx = "abcd".indexOf(letter);
        const idxNum = "1234".indexOf(letter);
        const pick = idx >= 0 ? idx : idxNum;
        if (pick >= 0 && pick < optionsPlain.length) return optionsPlain[pick];
      }
    }

    // 2. Take the line that isn't the question itself and matches an
    // option best.
    let best = null, bestScore = 0;
    lines.forEach(function (line) {
      const lineTokens = tokens(line);
      // Skip lines that look mostly like the question.
      const overlapWithQ = lineTokens.filter(function (t) { return qTokens.has(t); }).length;
      if (lineTokens.length && overlapWithQ / lineTokens.length > 0.6) return;
      const pick = bestOption(line, optionsPlain, 0);
      const score = pick ? similarity(line, pick) : 0;
      if (score > bestScore) { bestScore = score; best = pick; }
    });
    if (bestScore >= 0.35) return best;

    // 3. Fallback: whole-text best guess.
    const full = bestOption(text, optionsPlain, 0.25);
    return full;
  }

  function bestOption(text, options, threshold) {
    let best = null, bestScore = 0;
    options.forEach(function (opt) {
      const s = similarity(text, opt);
      if (s > bestScore) { bestScore = s; best = opt; }
    });
    return bestScore >= threshold ? best : null;
  }

  function judge(student, correct, item) {
    if (!student) return "unknown";
    const s = similarity(student, correct);
    if (s >= 0.75) return "correct";
    // Partial: matched a wrong option closely — meaning they answered,
    // just wrongly. That's "incorrect" not "partial". We reserve
    // "partial" for cases where the student's text overlaps with the
    // correct answer but picked a distractor-like phrasing.
    const distractors = item.options.map(stripHtml).filter(function (o) { return o !== correct; });
    let bestDist = 0;
    distractors.forEach(function (d) {
      bestDist = Math.max(bestDist, similarity(student, d));
    });
    if (bestDist > s && bestDist >= 0.55) return "incorrect";
    if (s >= 0.45) return "partial";
    return "incorrect";
  }

  function buildFeedback(verdict, student, correct, item) {
    const explain = item.explain ? stripHtml(item.explain) : "";
    switch (verdict) {
      case "correct":
        return "Nice work — your answer " +
          (student ? "(<em>" + escapeHtml(student) + "</em>) " : "") +
          "matches what we'd expect. " + explain;
      case "partial":
        return "You're close. Your answer " +
          (student ? "(<em>" + escapeHtml(student) + "</em>) " : "") +
          "has some of the right idea, but the fuller answer is: <strong>" +
          escapeHtml(correct) + "</strong>. " + explain;
      case "incorrect":
        return "That isn't quite right. You wrote " +
          (student ? "<em>" + escapeHtml(student) + "</em>" : "an unclear answer") +
          ", but the correct answer is <strong>" + escapeHtml(correct) +
          "</strong>. " + explain +
          " Look back at the cropped region above and see which option lines up with that explanation.";
      case "unknown":
      default:
        return "We couldn't decide from the image. If the handwriting is " +
          "hard to read, try retaking the photo in brighter light, or " +
          "retype the answer using the manual box.";
    }
  }

  // ---------- Helpers ----------

  function stripHtml(html) {
    const d = document.createElement("div");
    d.innerHTML = html || "";
    return (d.textContent || d.innerText || "").trim();
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ---------- Print / export ----------

  printBtn.addEventListener("click", function () {
    window.print();
  });
})();
