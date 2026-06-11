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

  function boot() {
    applyAuthState();
    renderAuthBar();
    setupNavDropdowns();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
