/* games.js
 *
 * The class Game Gallery. Loads every non-hidden game published by the
 * viewer's class (window.ITBasics.listClassGames), shows a card per game with
 * its design notes and code, and plays any of them in a shared PyRun runner.
 * Staff (window.TEACHER_CODES) get a Hide button to take a game down.
 */
(function () {
  "use strict";

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  const START_LABEL = { "a template": "from a template", "scratch": "from scratch" };
  const SCORE_LABEL = { yes: "keeps score", no: "no score", notyet: "no score yet" };

  if (!window.PyRun || !window.ITBasics) return;

  // Which published game is in the player right now, and the best score
  // submitted so far this run (so one run only writes upwards).
  let currentGame = null;
  let runBest = null;

  // Shared player: one runner drives the game canvas for whichever game you play.
  const runner = window.PyRun.create({
    editor: el("player-code"),
    output: el("player-output"),
    runBtn: el("player-stop"),
    storageKey: "itbasics-gallery-player",
    defaultCode: "",
    game: {
      canvas: el("game-canvas"),
      onScore: function (points) {
        // game.submit_score(...) landed here from the running game.
        if (!currentGame || !isFinite(points)) return;
        if (runBest != null && points <= runBest) return;
        runBest = points;
        window.ITBasics.submitGameScore(currentGame.id, points);
      }
    }
  });

  async function play(game) {
    el("player-title").textContent = game.title + "  by " + game.author;
    if (runner.isRunning()) { runner.stop(); await sleep(140); }
    currentGame = game;
    runBest = null;
    runner.setCode(game.code);
    const player = el("game-player");
    player.hidden = false;
    player.scrollIntoView({ behavior: "smooth", block: "start" });
    runner.clearOutput();
    runner.run();
    setTimeout(function () { const cv = el("game-canvas"); if (cv) cv.focus(); }, 300);
  }

  const closeBtn = el("player-close");
  if (closeBtn) closeBtn.addEventListener("click", function () {
    if (runner.isRunning()) runner.stop();
    el("game-player").hidden = true;
  });

  function notesHtml(meta) {
    meta = meta || {};
    const bits = [];
    if (meta.controls) bits.push("You control <strong>" + esc(meta.controls) + "</strong>");
    if (meta.score) bits.push(esc(SCORE_LABEL[meta.score] || meta.score));
    if (meta.start) bits.push("started " + esc(START_LABEL[meta.start] || meta.start));
    let html = "";
    if (bits.length) html += '<p class="game-card-facts">' + bits.join(" &middot; ") + "</p>";
    if (meta.added) html += '<p class="game-card-added">&ldquo;' + esc(meta.added) + "&rdquo;</p>";
    return html;
  }

  // Same 1st/2nd/3rd pills as the main leaderboard.
  function rankClass(rank) {
    return rank === 1 ? "gold" : rank === 2 ? "silver" : rank === 3 ? "bronze" : "";
  }

  // "class" shows only the viewer's class; "all" is the whole-school gallery.
  let scope = "class";

  function render(games, staff, session, showClass) {
    const grid = el("gallery-grid");
    grid.innerHTML = "";
    games.forEach(function (game, i) {
      const card = document.createElement("div");
      card.className = "game-card";

      const head = document.createElement("div");
      head.className = "game-card-head";
      const rank = (game.votes > 0 && i < 3)
        ? '<span class="rank-pill game-rank ' + rankClass(i + 1) + '">' + (i + 1) + "</span> "
        : "";
      const klass = (showClass && game.klass)
        ? '<span class="game-card-class">' + esc(game.klass) + "</span>" : "";
      head.innerHTML =
        '<div>' + rank + '<span class="game-card-title">' + esc(game.title) + "</span>" +
        '<span class="game-card-author">by ' + esc(game.author || "someone") + "</span>" + klass + "</div>";

      const btns = document.createElement("div");
      btns.className = "game-card-headbtns";

      // Upvote (you cannot upvote your own game)
      const mine = session && game.student_code && game.student_code === session.code;
      const vote = document.createElement("button");
      vote.type = "button";
      vote.className = "game-vote" + (game.voted ? " voted" : "");
      vote.innerHTML = '<span class="vote-arrow">▲</span><span class="vote-count">' + game.votes + "</span>";
      if (mine) {
        vote.disabled = true;
        vote.title = "You cannot upvote your own game";
      } else {
        vote.title = game.voted ? "Remove your upvote" : "Upvote this game";
        vote.addEventListener("click", async function () {
          vote.disabled = true;
          await window.ITBasics.voteGame(game.id);
          boot();
        });
      }
      btns.appendChild(vote);

      const playBtn = document.createElement("button");
      playBtn.type = "button";
      playBtn.className = "btn btn-primary";
      playBtn.textContent = "Play";
      playBtn.addEventListener("click", function () { play(game); });
      btns.appendChild(playBtn);
      head.appendChild(btns);
      card.appendChild(head);

      const notes = notesHtml(game.meta);
      if (notes) {
        const n = document.createElement("div");
        n.className = "game-card-notes";
        n.innerHTML = notes;
        card.appendChild(n);
      }

      // Read-the-code toggle
      const codeWrap = document.createElement("div");
      codeWrap.className = "game-card-code";
      codeWrap.hidden = true;
      const pre = document.createElement("pre");
      pre.className = "code";
      const codeEl = document.createElement("code");
      codeEl.className = "language-python";
      codeEl.textContent = game.code;
      pre.appendChild(codeEl);
      codeWrap.appendChild(pre);

      const actions = document.createElement("div");
      actions.className = "game-card-actions";
      const viewBtn = document.createElement("button");
      viewBtn.type = "button";
      viewBtn.className = "btn btn-ghost";
      viewBtn.textContent = "Read the code";
      viewBtn.addEventListener("click", function () {
        codeWrap.hidden = !codeWrap.hidden;
        viewBtn.textContent = codeWrap.hidden ? "Read the code" : "Hide the code";
        if (!codeWrap.hidden && window.Prism) window.Prism.highlightElement(codeEl);
      });
      actions.appendChild(viewBtn);

      // Per-game leaderboard, only for games whose code saves scores.
      let scoresWrap = null;
      if (/game\s*\.\s*submit_score/.test(game.code || "")) {
        scoresWrap = document.createElement("div");
        scoresWrap.className = "game-card-scores";
        scoresWrap.hidden = true;

        const scoresBtn = document.createElement("button");
        scoresBtn.type = "button";
        scoresBtn.className = "btn btn-ghost";
        scoresBtn.textContent = "Top scores";
        scoresBtn.addEventListener("click", async function () {
          if (!scoresWrap.hidden) {
            scoresWrap.hidden = true;
            scoresBtn.textContent = "Top scores";
            return;
          }
          scoresWrap.innerHTML = '<p class="game-scores-empty">Loading&hellip;</p>';
          scoresWrap.hidden = false;
          scoresBtn.textContent = "Hide scores";
          const rows = await window.ITBasics.listGameScores(game.id, 10);
          if (!rows.length) {
            scoresWrap.innerHTML =
              '<p class="game-scores-empty">No scores yet. Press Play and set the first one!</p>';
            return;
          }
          scoresWrap.innerHTML = "<ol class='game-scores-list'>" + rows.map(function (r, k) {
            const me = session && r.student_code === session.code;
            const shown = (r.score % 1 === 0) ? String(r.score) : r.score.toFixed(1);
            const klass = r.klass ? ' <span class="game-scores-class">' + esc(r.klass) + "</span>" : "";
            return "<li" + (me ? ' class="me"' : "") + ">" +
              '<span class="rank-pill ' + rankClass(k + 1) + '">' + (k + 1) + "</span>" +
              '<span class="game-scores-name">' + esc(r.name) + (me ? " (you)" : "") + klass + "</span>" +
              '<span class="game-scores-score">' + esc(shown) + "</span></li>";
          }).join("") + "</ol>";
        });
        actions.appendChild(scoresBtn);
      }

      if (staff) {
        const hideBtn = document.createElement("button");
        hideBtn.type = "button";
        hideBtn.className = "btn btn-ghost game-hide";
        hideBtn.textContent = "Hide (teacher)";
        hideBtn.addEventListener("click", async function () {
          await window.ITBasics.setGameHidden(game.id, true);
          boot();
        });
        actions.appendChild(hideBtn);
      }

      card.appendChild(actions);
      if (scoresWrap) card.appendChild(scoresWrap);
      card.appendChild(codeWrap);
      grid.appendChild(card);
    });
  }

  // Scope toggle: My class vs Whole school.
  function wireScope() {
    const box = el("gallery-scope");
    if (!box) return;
    box.querySelectorAll(".gallery-scope-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (scope === btn.dataset.scope) return;
        scope = btn.dataset.scope;
        boot();
      });
    });
  }
  function paintScope() {
    const box = el("gallery-scope");
    if (!box) return;
    box.querySelectorAll(".gallery-scope-btn").forEach(function (btn) {
      const on = btn.dataset.scope === scope;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  async function boot() {
    const session = window.ITBasics.getSession();
    if (!session) { location.replace("/"); return; }
    const staff = Array.isArray(window.TEACHER_CODES) &&
      window.TEACHER_CODES.indexOf(session.code) !== -1;

    paintScope();
    const all = scope === "all";
    const status = el("gallery-status");
    let games = [];
    try { games = await window.ITBasics.listClassGames(all); } catch (e) { games = []; }

    if (!games.length) {
      status.innerHTML = all
        ? 'No games anywhere yet. Be the first: build one in ' +
          '<a href="/assignments/game-maker/">Make Your Own Game</a>.'
        : 'No games in your class yet. Be the first: build one in ' +
          '<a href="/assignments/game-maker/">Make Your Own Game</a>.';
      el("gallery-grid").innerHTML = "";
      return;
    }
    const where = all ? "from across the school" : "from your class";
    status.textContent = games.length + (games.length === 1 ? " game " : " games ") +
      where + ", ranked by upvotes" + (staff ? " (teacher: you can hide any game)" : "");
    render(games, staff, session, all);
  }

  wireScope();
  boot();
  window.addEventListener("itbasics:auth", boot);
})();
