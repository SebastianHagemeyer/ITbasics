(function () {
  "use strict";

  const SESSION_KEY = "itbasics-session";

  const url = window.SUPABASE_URL || "";
  const key = window.SUPABASE_ANON_KEY || "";
  const configured = url && key && !url.includes("YOUR-") && !key.includes("YOUR-");

  let supabase = null;
  if (configured && window.supabase && window.supabase.createClient) {
    supabase = window.supabase.createClient(url, key);
  }

  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
    catch (e) { return null; }
  }

  function setSession(student) {
    if (student) localStorage.setItem(SESSION_KEY, JSON.stringify(student));
    else localStorage.removeItem(SESSION_KEY);
    applyAuthState();
    renderAuthBar();
    window.dispatchEvent(new CustomEvent("itbasics:auth", { detail: { student: student } }));
  }

  function applyAuthState() {
    const s = getSession();
    document.documentElement.dataset.auth = s ? "in" : "out";
    const nameEls = document.querySelectorAll(".hero-name");
    nameEls.forEach(function (el) {
      el.textContent = s ? (s.first_name || s.code) : "there";
    });
  }

  async function signIn(rawCode) {
    const code = (rawCode || "").trim().toUpperCase();
    if (!code) return { ok: false, error: "Please enter your student code." };

    if (!supabase) {
      setSession({ code: code, first_name: code, last_name: "", class: "", year_level: 0, offline: true });
      return { ok: true, offline: true };
    }

    const { data, error } = await supabase
      .from("students").select("*").eq("code", code).maybeSingle();
    if (error) return { ok: false, error: error.message };
    if (!data)  return { ok: false, error: "Code not found. Check the spelling." };
    setSession(data);
    return { ok: true };
  }

  function signOut() {
    setSession(null);
    // Always go back to the login screen at the site root.
    if (location.pathname !== "/") {
      location.replace("/");
    }
  }

  async function saveProgress(quizName, answers) {
    const s = getSession();
    if (!s) return;
    if (supabase) {
      await supabase.from("quiz_progress").upsert(
        { student_code: s.code, quiz_name: quizName, answers: answers, updated_at: new Date().toISOString() },
        { onConflict: "student_code,quiz_name" }
      );
    } else {
      localStorage.setItem(localKey(s, "progress", quizName), JSON.stringify(answers));
    }
  }

  async function loadProgress(quizName) {
    const s = getSession();
    if (!s) return null;
    if (supabase) {
      const { data } = await supabase
        .from("quiz_progress").select("answers")
        .eq("student_code", s.code).eq("quiz_name", quizName).maybeSingle();
      return data ? data.answers : null;
    }
    const raw = localStorage.getItem(localKey(s, "progress", quizName));
    return raw ? JSON.parse(raw) : null;
  }

  async function saveAttempt(quizName, score, total, answers) {
    const s = getSession();
    if (!s) return;
    if (supabase) {
      await supabase.from("quiz_attempts").insert({
        student_code: s.code, quiz_name: quizName, score: score, total: total, answers: answers
      });
    } else {
      const k = localKey(s, "attempts", quizName);
      const arr = JSON.parse(localStorage.getItem(k) || "[]");
      arr.push({ score: score, total: total, answers: answers, attempted_at: new Date().toISOString() });
      localStorage.setItem(k, JSON.stringify(arr));
    }
  }

  async function getScores(quizName) {
    const s = getSession();
    if (!s) return null;
    if (supabase) {
      const { data } = await supabase
        .from("quiz_attempts").select("score, total, attempted_at")
        .eq("student_code", s.code).eq("quiz_name", quizName)
        .order("attempted_at", { ascending: false });
      if (!data || !data.length) return null;
      const best = data.reduce(function (m, a) { return a.score > m.score ? a : m; }, data[0]);
      return { last: data[0], best: best, attempts: data.length };
    }
    const arr = JSON.parse(localStorage.getItem(localKey(s, "attempts", quizName)) || "[]");
    if (!arr.length) return null;
    const best = arr.reduce(function (m, a) { return a.score > m.score ? a : m; }, arr[0]);
    return { last: arr[arr.length - 1], best: best, attempts: arr.length };
  }

  function localKey(s, kind, quizName) {
    return "itbasics-" + kind + "-" + s.code + "-" + quizName;
  }

  // --- Private sandbox snippets ---
  // Named programs a student saves from the Python Sandbox. One row per
  // student per name; saving the same name replaces the old version.
  // Offline they live in localStorage under the student's code instead.

  async function listSnippets() {
    const s = getSession();
    if (!s) return [];
    if (supabase) {
      const { data } = await supabase
        .from("snippets").select("name, code, updated_at")
        .eq("student_code", s.code)
        .order("updated_at", { ascending: false });
      return data || [];
    }
    return readLocalSnippets(s);
  }

  async function saveSnippet(name, code) {
    const s = getSession();
    if (!s) return { ok: false, error: "Sign in to save your code." };
    if (supabase) {
      const { error } = await supabase.from("snippets").upsert(
        { student_code: s.code, name: name, code: code, updated_at: new Date().toISOString() },
        { onConflict: "student_code,name" }
      );
      return error ? { ok: false, error: error.message } : { ok: true };
    }
    const arr = readLocalSnippets(s).filter(function (sn) { return sn.name !== name; });
    arr.unshift({ name: name, code: code, updated_at: new Date().toISOString() });
    localStorage.setItem(localKey(s, "snippets", "all"), JSON.stringify(arr));
    return { ok: true };
  }

  async function deleteSnippet(name) {
    const s = getSession();
    if (!s) return;
    if (supabase) {
      await supabase.from("snippets").delete()
        .eq("student_code", s.code).eq("name", name);
    } else {
      const arr = readLocalSnippets(s).filter(function (sn) { return sn.name !== name; });
      localStorage.setItem(localKey(s, "snippets", "all"), JSON.stringify(arr));
    }
  }

  function readLocalSnippets(s) {
    try { return JSON.parse(localStorage.getItem(localKey(s, "snippets", "all")) || "[]"); }
    catch (e) { return []; }
  }

  // ---- Published games (Task 3 "Make your own game" + the class gallery) ----

  function readLocalGames() {
    try { return JSON.parse(localStorage.getItem("itbasics-games") || "[]"); }
    catch (e) { return []; }
  }
  function writeLocalGames(arr) {
    try { localStorage.setItem("itbasics-games", JSON.stringify(arr)); } catch (e) {}
  }
  function authorName(s) {
    return ((s.first_name || "") + " " + (s.last_name || "")).trim() || s.code;
  }

  // Publish (or re-publish) the student's game under a title. Re-using a title
  // updates that game. hidden is deliberately omitted so a teacher's takedown
  // survives a re-publish.
  async function publishGame(title, code, meta) {
    const s = getSession();
    if (!s) return { ok: false, error: "Sign in to publish your game." };
    title = String(title || "").trim();
    if (!title) return { ok: false, error: "Give your game a title first." };
    if (!String(code || "").trim()) return { ok: false, error: "Write some code first." };
    if (supabase) {
      // Delete-then-insert so a re-publish is a fresh game: it gets a new id,
      // which cascade-drops the old upvotes (a new version earns new votes).
      await supabase.from("games").delete().eq("student_code", s.code);
      const { error } = await supabase.from("games").insert(
        { student_code: s.code, title: title, code: code, meta: meta || {} });
      return error ? { ok: false, error: error.message } : { ok: true };
    }
    const id = "local-" + s.code;
    writeLocalVotes(readLocalVotes().filter(function (v) { return v.game_id !== id; }));
    const arr = readLocalGames().filter(function (g) { return g.student_code !== s.code; });
    arr.unshift({ id: id, student_code: s.code, title: title, code: code, meta: meta || {},
      hidden: false, class: s.class, author: authorName(s),
      updated_at: new Date().toISOString() });
    writeLocalGames(arr);
    return { ok: true };
  }

  function readLocalVotes() {
    try { return JSON.parse(localStorage.getItem("itbasics-game-votes") || "[]"); }
    catch (e) { return []; }
  }
  function writeLocalVotes(arr) {
    try { localStorage.setItem("itbasics-game-votes", JSON.stringify(arr)); } catch (e) {}
  }

  // Non-hidden games ranked by upvotes (most first), each carrying its vote
  // count and whether the viewer has upvoted it. By default only the viewer's
  // class; pass all=true for the whole-school gallery (still needs a session).
  async function listClassGames(all) {
    const s = getSession();
    if (!s) return [];
    var games, votes;
    if (supabase) {
      const res = await supabase.from("games")
        .select("id, title, code, meta, hidden, updated_at, student_code, students!inner(first_name, last_name, class)")
        .order("updated_at", { ascending: false });
      games = (res.data || [])
        .filter(function (g) { return g.students && !g.hidden && (all || g.students.class === s.class); })
        .map(function (g) {
          return { id: g.id, title: g.title, code: g.code, meta: g.meta || {},
            student_code: g.student_code, klass: g.students.class,
            author: ((g.students.first_name || "") + " " + (g.students.last_name || "")).trim(),
            updated_at: g.updated_at };
        });
      const vres = await supabase.from("game_votes").select("game_id, student_code");
      votes = vres.data || [];
    } else {
      games = readLocalGames()
        .filter(function (g) { return !g.hidden && (all || g.class === s.class); })
        .map(function (g) { return { id: g.id, title: g.title, code: g.code, meta: g.meta || {},
          student_code: g.student_code, klass: g.class, author: g.author, updated_at: g.updated_at }; });
      votes = readLocalVotes();
    }
    games.forEach(function (g) {
      g.votes = votes.filter(function (v) { return v.game_id === g.id; }).length;
      g.voted = votes.some(function (v) { return v.game_id === g.id && v.student_code === s.code; });
    });
    games.sort(function (a, b) {
      return (b.votes - a.votes) || (new Date(b.updated_at) - new Date(a.updated_at));
    });
    return games;
  }

  // Toggle the viewer's upvote on a game. Returns the new state.
  async function voteGame(gameId) {
    const s = getSession();
    if (!s) return { ok: false };
    if (supabase) {
      const { data } = await supabase.from("game_votes")
        .select("game_id").eq("game_id", gameId).eq("student_code", s.code).maybeSingle();
      if (data) {
        await supabase.from("game_votes").delete().eq("game_id", gameId).eq("student_code", s.code);
        return { ok: true, voted: false };
      }
      const { error } = await supabase.from("game_votes")
        .insert({ game_id: gameId, student_code: s.code });
      return error ? { ok: false, error: error.message } : { ok: true, voted: true };
    }
    var arr = readLocalVotes();
    if (arr.some(function (v) { return v.game_id === gameId && v.student_code === s.code; })) {
      writeLocalVotes(arr.filter(function (v) { return !(v.game_id === gameId && v.student_code === s.code); }));
      return { ok: true, voted: false };
    }
    arr.push({ game_id: gameId, student_code: s.code });
    writeLocalVotes(arr);
    return { ok: true, voted: true };
  }

  // The signed-in student's own games (includes hidden, so they can see if a
  // teacher took one down).
  async function myGames() {
    const s = getSession();
    if (!s) return [];
    if (supabase) {
      const { data } = await supabase.from("games")
        .select("id, title, code, meta, hidden, updated_at")
        .eq("student_code", s.code)
        .order("updated_at", { ascending: false });
      return data || [];
    }
    return readLocalGames().filter(function (g) { return g.student_code === s.code; });
  }

  async function deleteGame(id) {
    if (supabase) { await supabase.from("games").delete().eq("id", id); return; }
    writeLocalGames(readLocalGames().filter(function (g) { return g.id !== id; }));
  }

  // Teacher moderation: take a game down (or put it back).
  async function setGameHidden(id, hidden) {
    if (supabase) { await supabase.from("games").update({ hidden: !!hidden }).eq("id", id); return; }
    const arr = readLocalGames();
    arr.forEach(function (g) { if (g.id === id) g.hidden = !!hidden; });
    writeLocalGames(arr);
  }

  function renderAuthBar() {
    const header = document.querySelector(".site-header .header-inner");
    if (!header) return;

    let bar = document.getElementById("auth-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "auth-bar";
      bar.className = "auth-bar";
      header.appendChild(bar);
    }

    const s = getSession();
    bar.innerHTML = "";

    if (s) {
      const name = (s.first_name || s.code) + (s.last_name ? " " + s.last_name : "");
      const initial = (s.first_name || s.code)[0].toUpperCase();
      const meta = s.class ? '<span class="auth-meta">' + escapeHtml(s.class) + '</span>' : "";
      bar.innerHTML =
        '<a class="auth-user" href="/progress/" title="See your progress">' +
          '<span class="auth-avatar">' + escapeHtml(initial) + '</span>' +
          '<span class="auth-name">' + escapeHtml(name) + '</span>' +
          meta +
        '</a>' +
        '<button type="button" class="auth-btn auth-signout">Sign out</button>';
      bar.querySelector(".auth-signout").addEventListener("click", signOut);
    } else {
      bar.innerHTML =
        '<form class="auth-form" autocomplete="off">' +
          '<input type="text" class="auth-input" name="code" placeholder="Student code" ' +
                 'aria-label="Student code" maxlength="12" />' +
          '<button type="submit" class="auth-btn">Sign in</button>' +
          '<span class="auth-msg" role="status"></span>' +
        '</form>';
      const form = bar.querySelector(".auth-form");
      form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const input = form.querySelector(".auth-input");
        const msg   = form.querySelector(".auth-msg");
        msg.textContent = "";
        msg.classList.remove("error");
        const res = await signIn(input.value);
        if (!res.ok) {
          msg.textContent = res.error;
          msg.classList.add("error");
        }
      });
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  window.ITBasics = {
    getSession: getSession,
    signIn: signIn,
    signOut: signOut,
    saveProgress: saveProgress,
    loadProgress: loadProgress,
    saveAttempt: saveAttempt,
    getScores: getScores,
    listSnippets: listSnippets,
    saveSnippet: saveSnippet,
    deleteSnippet: deleteSnippet,
    publishGame: publishGame,
    listClassGames: listClassGames,
    myGames: myGames,
    deleteGame: deleteGame,
    setGameHidden: setGameHidden,
    voteGame: voteGame,
    isOnline: function () { return Boolean(supabase); },
    client: function () { return supabase; }
  };

  function setupNavDropdowns() {
    const dropdowns = document.querySelectorAll(".nav-dropdown");
    if (!dropdowns.length) return;

    function closeAll() {
      dropdowns.forEach(function (dd) {
        dd.dataset.open = "false";
        const t = dd.querySelector(".nav-dropdown-toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      });
    }

    dropdowns.forEach(function (dd) {
      const toggle = dd.querySelector(".nav-dropdown-toggle");
      if (!toggle) return;
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const wasOpen = dd.dataset.open === "true";
        closeAll();
        if (!wasOpen) {
          dd.dataset.open = "true";
          toggle.setAttribute("aria-expanded", "true");
        }
      });
    });

    document.addEventListener("click", function (e) {
      let inside = false;
      dropdowns.forEach(function (dd) { if (dd.contains(e.target)) inside = true; });
      if (!inside) closeAll();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAll();
    });
  }

  // Build the primary nav from one place so every page stays in sync and new
  // sections only need adding here. The hardcoded <nav> in each page is a
  // no-JS fallback that this overwrites on load.
  function renderNav() {
    var nav = document.querySelector(".site-nav");
    if (!nav) return;
    var path = location.pathname.replace(/index\.html$/, "");
    var chev = '<svg class="nav-chev" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    // Learn gives access to all the modules (via the /modules/ hub) and the
    // searchable documentation. Play holds the interactive bits plus the
    // leaderboard. Assignments sits on its own.
    var learn = [
      { href: "/modules/", label: "All modules" },
      { href: "/docs/", label: "Documentation" }
    ];
    var play = [
      { href: "/freeplay/", label: "Freeplay" },
      { href: "/challenges/", label: "Live Coding" },
      { href: "/sandbox/", label: "Sandbox" },
      { href: "/games/", label: "Game Gallery" },
      { href: "/leaderboard/", label: "Leaderboard" }
    ];
    function active(href) { return href === "/" ? path === "/" : path.indexOf(href) === 0; }
    function items(list) {
      return list.map(function (it) {
        return '<a href="' + it.href + '"' + (active(it.href) ? ' class="active"' : '') +
          ' role="menuitem">' + it.label + '</a>';
      }).join("");
    }
    function dropdown(label, list, activeOn) {
      var checks = activeOn || list.map(function (it) { return it.href; });
      var on = checks.some(function (h) { return active(h); });
      return '<div class="nav-dropdown" data-open="false">' +
        '<button type="button" class="nav-dropdown-toggle' + (on ? ' active' : '') +
          '" aria-haspopup="true" aria-expanded="false">' + label + ' ' + chev + '</button>' +
        '<div class="nav-dropdown-menu" role="menu">' + items(list) + '</div>' +
      '</div>';
    }
    nav.innerHTML =
      '<a href="/"' + (path === "/" ? ' class="active"' : '') + '>Home</a>' +
      // Learn lights up on any lesson or quiz page, not only its two menu links.
      dropdown("Learn", learn, ["/modules/", "/docs/", "/topics/", "/quizzes/"]) +
      dropdown("Play", play) +
      '<a href="/assignments/"' + (active("/assignments/") ? ' class="active"' : '') + '>Assignments</a>';
  }

  function boot() {
    applyAuthState();
    renderAuthBar();
    renderNav();
    setupNavDropdowns();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
