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

  // Shared player: one runner drives the game canvas for whichever game you play.
  const runner = window.PyRun.create({
    editor: el("player-code"),
    output: el("player-output"),
    runBtn: el("player-stop"),
    storageKey: "itbasics-gallery-player",
    defaultCode: "",
    game: { canvas: el("game-canvas") }
  });

  async function play(game) {
    el("player-title").textContent = game.title + "  by " + game.author;
    if (runner.isRunning()) { runner.stop(); await sleep(140); }
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

  const MEDALS = ["🥇", "🥈", "🥉"];

  function render(games, staff, session) {
    const grid = el("gallery-grid");
    grid.innerHTML = "";
    games.forEach(function (game, i) {
      const card = document.createElement("div");
      card.className = "game-card";

      const head = document.createElement("div");
      head.className = "game-card-head";
      const rank = (game.votes > 0 && i < 3) ? '<span class="game-rank">' + MEDALS[i] + "</span> " : "";
      head.innerHTML =
        '<div>' + rank + '<span class="game-card-title">' + esc(game.title) + "</span>" +
        '<span class="game-card-author">by ' + esc(game.author || "someone") + "</span></div>";

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
      card.appendChild(codeWrap);
      grid.appendChild(card);
    });
  }

  async function boot() {
    const session = window.ITBasics.getSession();
    if (!session) { location.replace("/"); return; }
    const staff = Array.isArray(window.TEACHER_CODES) &&
      window.TEACHER_CODES.indexOf(session.code) !== -1;

    const status = el("gallery-status");
    let games = [];
    try { games = await window.ITBasics.listClassGames(); } catch (e) { games = []; }

    if (!games.length) {
      status.innerHTML = 'No games yet. Be the first: build one in ' +
        '<a href="/assignments/game-maker/">Make Your Own Game</a>.';
      el("gallery-grid").innerHTML = "";
      return;
    }
    status.textContent = games.length + (games.length === 1 ? " game" : " games") +
      " from your class, ranked by upvotes" + (staff ? " (teacher: you can hide any game)" : "");
    render(games, staff, session);
  }

  boot();
  window.addEventListener("itbasics:auth", boot);
})();
