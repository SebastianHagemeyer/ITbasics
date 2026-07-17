/*
 * Quality-of-life upgrades for every code editor (.sandbox-code) on a page.
 * Load this script before pyrun.js / challenges.js so its key handlers
 * register first. Two features:
 *
 * 1. Block indent: with several lines selected, Tab indents them all by 4
 *    spaces and Shift+Tab un-indents. Shift+Tab also un-indents the current
 *    line with no selection. A plain Tab with no selection is left for the
 *    editor's own handler (insert 4 spaces).
 *
 * 2. Live indentation checking: a small strip under the editor warns about
 *    the classic crashes BEFORE they run the code: a missing indent after a
 *    ':' line, an unexpected indent, a dedent that lines up with nothing,
 *    and tab characters in the indent. Pure string checks, debounced, so
 *    it costs nothing even on a slow Chromebook.
 */
(function () {
  "use strict";

  // ---- Selection helpers (text offsets inside a contenteditable) ----------

  function selectionOffsets(editor) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return null;
    const r = sel.getRangeAt(0);
    if (!editor.contains(r.startContainer) || !editor.contains(r.endContainer)) return null;
    function offsetOf(node, off) {
      const probe = document.createRange();
      probe.selectNodeContents(editor);
      probe.setEnd(node, off);
      return probe.toString().length;
    }
    return { start: offsetOf(r.startContainer, r.startOffset), end: offsetOf(r.endContainer, r.endOffset) };
  }

  function setSelectionOffsets(editor, start, end) {
    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
    let pos = 0, node, sNode = null, sOff = 0, eNode = null, eOff = 0;
    while ((node = walker.nextNode())) {
      const len = node.textContent.length;
      if (!sNode && pos + len >= start) { sNode = node; sOff = start - pos; }
      if (pos + len >= end) { eNode = node; eOff = end - pos; break; }
      pos += len;
    }
    if (!sNode) return;
    if (!eNode) { eNode = sNode; eOff = sNode.textContent.length; }
    const sel = window.getSelection();
    const range = document.createRange();
    range.setStart(sNode, sOff);
    range.setEnd(eNode, eOff);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // ---- Tab / Shift+Tab block indent ----------------------------------------

  function onTabKey(e) {
    if (e.key !== "Tab") return;
    const editor = e.currentTarget;
    const pos = selectionOffsets(editor);
    if (!pos) return;
    const text = editor.textContent;
    const spansLines = text.slice(pos.start, pos.end).indexOf("\n") !== -1;
    // A plain Tab on a single caret stays with the editor's own handler.
    if (!e.shiftKey && !spansLines) return;
    e.preventDefault();
    e.stopImmediatePropagation();

    const lineStart = text.lastIndexOf("\n", pos.start - 1) + 1;
    let lineEnd = text.indexOf("\n", Math.max(pos.end - 1, pos.start));
    if (lineEnd === -1) lineEnd = text.length;

    const lines = text.slice(lineStart, lineEnd).split("\n");
    const newBlock = lines.map(function (l) {
      if (e.shiftKey) return l.replace(/^ {1,4}/, "");
      return l.trim() ? "    " + l : l;
    }).join("\n");

    editor.textContent = text.slice(0, lineStart) + newBlock + text.slice(lineEnd);
    if (window.Prism) { try { window.Prism.highlightElement(editor); } catch (err) {} }
    // Let the editor's own machinery (save-on-change etc.) know.
    editor.dispatchEvent(new Event("input", { bubbles: true }));
    setSelectionOffsets(editor, lineStart, lineStart + newBlock.length);
  }

  // ---- Indentation linting ---------------------------------------------------

  // Strips string literals (naively) so brackets/colons inside them don't
  // confuse the checks, then trailing comments.
  function stripStringsAndComments(line) {
    let out = "";
    let quote = null;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (quote) {
        if (c === "\\") { i++; continue; }
        if (c === quote) quote = null;
        continue;
      }
      if (c === '"' || c === "'") { quote = c; continue; }
      if (c === "#") break;
      out += c;
    }
    return out;
  }

  function lintIndent(code) {
    const problems = [];
    const lines = String(code || "").split("\n");
    const stack = [0];        // indent levels currently open
    let expectDeeper = false; // previous code line ended with ":"
    let colonLine = 0;
    let prevIndent = 0;
    let prevLineNo = 0;
    let bracketDepth = 0;
    let inTriple = false;

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];

      // Triple-quoted strings: skip everything inside them.
      const triples = (raw.match(/'''|"""/g) || []).length;
      if (inTriple) {
        if (triples % 2 === 1) inTriple = false;
        continue;
      }
      if (triples % 2 === 1) inTriple = true;

      const stripped = stripStringsAndComments(raw);
      if (!stripped.trim()) continue; // blank or comment-only line

      // Lines inside unclosed brackets are continuations: don't lint them.
      if (bracketDepth > 0) {
        bracketDepth += (stripped.match(/[([{]/g) || []).length;
        bracketDepth -= (stripped.match(/[)\]}]/g) || []).length;
        if (bracketDepth < 0) bracketDepth = 0;
        continue;
      }

      const leadRaw = raw.match(/^[ \t]*/)[0];
      if (leadRaw.indexOf("\t") !== -1) {
        problems.push({ line: i + 1, msg: "there's a tab character in the indent; use spaces (4 per level)" });
      }
      const indent = leadRaw.replace(/\t/g, "    ").length;

      if (expectDeeper) {
        if (indent <= prevIndent) {
          problems.push({ line: i + 1, msg: 'needs an indent (4 more spaces): line ' + colonLine + ' ends with ":" so the next line belongs inside it' });
          // Recover: pretend the block never opened, keep checking below.
          expectDeeper = false;
          checkAgainstStack(indent, i);
        } else {
          stack.push(indent);
        }
      } else {
        checkAgainstStack(indent, i);
      }

      function checkAgainstStack(ind, lineIdx) {
        if (ind > stack[stack.length - 1]) {
          problems.push({ line: lineIdx + 1, msg: "unexpected indent: this line is deeper than line " + prevLineNo + ', but that line doesn\'t end with ":"' });
          stack.push(ind); // recover so one mistake doesn't cascade
        } else {
          while (stack.length > 1 && stack[stack.length - 1] > ind) stack.pop();
          if (stack[stack.length - 1] !== ind) {
            problems.push({ line: lineIdx + 1, msg: "this indent doesn't line up with any line above it" });
            stack.push(ind);
          }
        }
      }

      bracketDepth += (stripped.match(/[([{]/g) || []).length;
      bracketDepth -= (stripped.match(/[)\]}]/g) || []).length;
      if (bracketDepth < 0) bracketDepth = 0;

      expectDeeper = bracketDepth === 0 && /:\s*$/.test(stripped);
      if (expectDeeper) colonLine = i + 1;
      prevIndent = indent;
      prevLineNo = i + 1;
    }

    // A ":" on the very last line with nothing after it.
    if (expectDeeper) {
      problems.push({ line: colonLine, msg: 'ends with ":" but there\'s nothing indented under it yet' });
    }
    return problems;
  }

  function attachLint(editor) {
    const host = editor.closest(".sandbox-editor") || editor.parentNode;
    const hint = document.createElement("div");
    hint.className = "indent-hint";
    hint.hidden = true;
    host.appendChild(hint);

    let timer = null;
    function schedule() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(run, 600);
    }
    function run() {
      timer = null;
      const problems = lintIndent(editor.textContent);
      if (!problems.length) { hint.hidden = true; return; }
      const p = problems[0];
      hint.hidden = false;
      hint.textContent = "⚠ Line " + p.line + ": " + p.msg +
        (problems.length > 1 ? "  (and " + (problems.length - 1) + " more)" : "");
    }
    editor.addEventListener("input", schedule);
    editor.addEventListener("keyup", schedule);
  }

  function boot() {
    document.querySelectorAll(".sandbox-code").forEach(function (editor) {
      editor.addEventListener("keydown", onTabKey);
      attachLint(editor);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }

  // Exposed for tests.
  window.EditorTools = { lintIndent: lintIndent };
})();
