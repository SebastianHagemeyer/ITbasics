/* Home Group Builder (/hg-admin/).
 *
 * A small staff-only app: import a year group, let up to five staff mark who
 * works well together and who to keep apart, then generate balanced home
 * groups, tweak them by hand and export the result.
 *
 * Two data stores with the same shape:
 *   cloud: Supabase, schema "classbuilder", real logins (supabase-classbuilder.sql)
 *   demo:  made-up students from demo-data.js, kept in this browser only
 *
 * The board you drag students around on is your own working copy (kept in
 * localStorage). "Save version" is what shares a set of groups with the team.
 */
(function () {
  "use strict";

  var STAFF_DOMAIN = "hg-admin.example.com";
  var DEMO_KEY = "hg-admin-demo-v1";
  var DEMO_EMAIL = "staff1@" + STAFF_DOMAIN;
  var DEMO_MEMBERS = [1, 2, 3, 4, 5].map(function (n) {
    return { slot: n, email: "staff" + n + "@" + STAFF_DOMAIN, display_name: "Staff " + n };
  });
  var COMMON_TAGS = ["Support", "Leader", "EAL"];
  var PRIORITY_LABELS = ["Off", "Low", "Medium", "High"];

  // ------------------------------------------------------------
  // Small helpers
  // ------------------------------------------------------------
  function $(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s === null || s === undefined ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function lsGet(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* private mode */ }
  }
  function lsDel(key) {
    try { localStorage.removeItem(key); } catch (e) {}
  }

  var toastTimer = null;
  function toast(msg, bad) {
    var t = $("hg-toast");
    t.textContent = msg;
    t.classList.toggle("hg-toast-bad", Boolean(bad));
    t.classList.add("hg-toast-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("hg-toast-on"); }, bad ? 6000 : 2800);
  }

  // Supabase errors are written for developers. Translate the setup ones.
  function friendly(err) {
    var m = (err && (err.message || err.error_description || err.msg)) || String(err);
    if (/schema must be one of|Invalid schema|classbuilder/i.test(m)) {
      return "The database isn't set up for this app yet: add \"classbuilder\" to the exposed schemas (step 2 in supabase-classbuilder.sql).";
    }
    if (err && err.code === "42P01") return "The app's tables are missing. Run supabase-classbuilder.sql in Supabase.";
    if (/Invalid login credentials/i.test(m)) return "Wrong username or password.";
    if (/JWT|not authorized|permission denied/i.test(m)) return "Not allowed. Try signing out and in again.";
    return m;
  }

  function fullName(s) { return (s.first_name + " " + s.last_name).trim() || s.student_id; }
  function sortName(a, b) {
    return (a.last_name + " " + a.first_name).localeCompare(b.last_name + " " + b.first_name);
  }
  function pairKey(a, b) { return a < b ? a + "|" + b : b + "|" + a; }
  function shortDate(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short" }) + " " +
      d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }

  function download(name, blob) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  // ------------------------------------------------------------
  // Stores
  // ------------------------------------------------------------
  function CloudStore() {
    var url = window.SUPABASE_URL, key = window.SUPABASE_ANON_KEY;
    this.ready = Boolean(url && key && !/YOUR_|PASTE/i.test(url) && window.supabase);
    if (!this.ready) return;
    // Its own storageKey, so this login never mixes with anything else on the site.
    this.sb = window.supabase.createClient(url, key, {
      db: { schema: "classbuilder" },
      auth: { storageKey: "hg-admin-auth", persistSession: true }
    });
  }
  CloudStore.prototype = {
    mode: "cloud",
    q: async function (p) {
      var res = await p;
      if (res.error) throw res.error;
      return res.data;
    },
    signIn: async function (user, pass) {
      var email = user.indexOf("@") !== -1 ? user.trim() : user.trim().toLowerCase() + "@" + STAFF_DOMAIN;
      var res = await this.sb.auth.signInWithPassword({ email: email, password: pass });
      if (res.error) throw res.error;
      return res.data.user.email;
    },
    resume: async function () {
      var res = await this.sb.auth.getSession();
      return res.data && res.data.session ? res.data.session.user.email : null;
    },
    signOut: function () { return this.sb.auth.signOut(); },
    members: function () { return this.q(this.sb.from("members").select("*").order("slot")); },
    rounds: function () { return this.q(this.sb.from("rounds").select("*").order("created_at")); },
    createRound: async function (r) {
      var rows = await this.q(this.sb.from("rounds").insert(r).select());
      return rows[0];
    },
    updateRound: function (id, patch) { return this.q(this.sb.from("rounds").update(patch).eq("id", id)); },
    deleteRound: function (id) { return this.q(this.sb.from("rounds").delete().eq("id", id)); },
    students: function (rid) {
      return this.q(this.sb.from("students").select("*").eq("round_id", rid));
    },
    upsertStudents: function (rid, rows) {
      rows = rows.map(function (r) { return Object.assign({ round_id: rid }, r); });
      return this.q(this.sb.from("students").upsert(rows, { onConflict: "round_id,student_id" }));
    },
    updateStudent: function (id, patch) { return this.q(this.sb.from("students").update(patch).eq("id", id)); },
    deleteStudent: function (id) { return this.q(this.sb.from("students").delete().eq("id", id)); },
    prefs: function (rid) {
      return this.q(this.sb.from("preferences").select("*").eq("round_id", rid).order("created_at"));
    },
    addPref: function (rid, a, b, kind) {
      return this.q(this.sb.from("preferences").insert({ round_id: rid, a: a, b: b, kind: kind }));
    },
    setPrefKind: function (id, kind, email) {
      return this.q(this.sb.from("preferences").update({ kind: kind, created_by: email }).eq("id", id));
    },
    deletePref: function (id) { return this.q(this.sb.from("preferences").delete().eq("id", id)); },
    solutions: function (rid) {
      return this.q(this.sb.from("solutions").select("*").eq("round_id", rid).order("created_at"));
    },
    saveSolution: function (rid, s) {
      return this.q(this.sb.from("solutions").insert(Object.assign({ round_id: rid }, s)));
    },
    deleteSolution: function (id) { return this.q(this.sb.from("solutions").delete().eq("id", id)); }
  };

  // One Supabase client per page: two on the same storage key fight over the session.
  var cloudStore = null;
  function getCloud() {
    if (!cloudStore) cloudStore = new CloudStore();
    return cloudStore;
  }

  // Same interface, backed by one localStorage blob seeded from demo-data.js.
  function DemoStore() { this.load(); }
  DemoStore.prototype = {
    mode: "demo",
    load: function () {
      this.d = lsGet(DEMO_KEY) || this.seed();
    },
    save: function () { lsSet(DEMO_KEY, this.d); },
    reset: function () { this.d = this.seed(); this.save(); },
    seed: function () {
      var D = window.HG_DEMO;
      var d = { next: 1, rounds: [], students: [], prefs: [], solutions: [] };
      var now = new Date().toISOString();
      var rid = d.next++;
      d.rounds.push({ id: rid, name: D.round.name, year_level: D.round.year_level,
        group_names: D.round.group_names.slice(), created_by: DEMO_EMAIL, created_at: now });
      var byCode = {};
      D.students.forEach(function (s) {
        var row = Object.assign({ id: d.next++, round_id: rid }, s, { tags: s.tags.slice() });
        byCode[s.student_id] = row.id;
        d.students.push(row);
      });
      D.prefs.forEach(function (p) {
        d.prefs.push({ id: d.next++, round_id: rid, a: byCode[p.a], b: byCode[p.b], kind: p.kind,
          created_by: p.created_by, created_at: now });
      });
      return d;
    },
    copy: function (rows) { return JSON.parse(JSON.stringify(rows)); },
    signIn: async function () { return DEMO_EMAIL; },
    resume: async function () { return DEMO_EMAIL; },
    signOut: async function () {},
    members: async function () { return DEMO_MEMBERS; },
    rounds: async function () { return this.copy(this.d.rounds); },
    createRound: async function (r) {
      var row = Object.assign({ id: this.d.next++, created_by: DEMO_EMAIL, created_at: new Date().toISOString() }, r);
      this.d.rounds.push(row); this.save();
      return this.copy(row);
    },
    updateRound: async function (id, patch) {
      this.d.rounds.forEach(function (r) { if (r.id === id) Object.assign(r, patch); });
      this.save();
    },
    deleteRound: async function (id) {
      var gone = function (x) { return x.round_id !== id; };
      this.d.rounds = this.d.rounds.filter(function (r) { return r.id !== id; });
      this.d.students = this.d.students.filter(gone);
      this.d.prefs = this.d.prefs.filter(gone);
      this.d.solutions = this.d.solutions.filter(gone);
      this.save();
    },
    students: async function (rid) {
      return this.copy(this.d.students.filter(function (s) { return s.round_id === rid; }));
    },
    upsertStudents: async function (rid, rows) {
      var self = this;
      rows.forEach(function (r) {
        var hit = self.d.students.filter(function (s) { return s.round_id === rid && s.student_id === r.student_id; })[0];
        if (hit) Object.assign(hit, r);
        else self.d.students.push(Object.assign({ id: self.d.next++, round_id: rid, tags: [] }, r));
      });
      this.save();
    },
    updateStudent: async function (id, patch) {
      this.d.students.forEach(function (s) { if (s.id === id) Object.assign(s, patch); });
      this.save();
    },
    deleteStudent: async function (id) {
      this.d.students = this.d.students.filter(function (s) { return s.id !== id; });
      this.d.prefs = this.d.prefs.filter(function (p) { return p.a !== id && p.b !== id; });
      this.save();
    },
    prefs: async function (rid) {
      return this.copy(this.d.prefs.filter(function (p) { return p.round_id === rid; }));
    },
    addPref: async function (rid, a, b, kind) {
      this.d.prefs.push({ id: this.d.next++, round_id: rid, a: a, b: b, kind: kind,
        created_by: state.email, created_at: new Date().toISOString() });
      this.save();
    },
    setPrefKind: async function (id, kind, email) {
      this.d.prefs.forEach(function (p) { if (p.id === id) { p.kind = kind; p.created_by = email; } });
      this.save();
    },
    deletePref: async function (id) {
      this.d.prefs = this.d.prefs.filter(function (p) { return p.id !== id; });
      this.save();
    },
    solutions: async function (rid) {
      return this.copy(this.d.solutions.filter(function (s) { return s.round_id === rid; }));
    },
    saveSolution: async function (rid, s) {
      this.d.solutions.push(Object.assign({ id: this.d.next++, round_id: rid, created_by: state.email,
        created_at: new Date().toISOString() }, s));
      this.save();
    },
    deleteSolution: async function (id) {
      this.d.solutions = this.d.solutions.filter(function (s) { return s.id !== id; });
      this.save();
    }
  };

  // ------------------------------------------------------------
  // State
  // ------------------------------------------------------------
  var state = {
    store: null,
    email: null,
    names: {},          // email -> display name
    rounds: [],
    round: null,
    students: [],
    byId: {},
    prefs: [],
    solutions: [],
    assign: {},         // student row id -> group index (your working board)
    locked: {},         // student row id -> true
    weights: Object.assign({}, window.HGSolver.DEFAULT_WEIGHTS),
    genderTargets: {},  // group index -> percent girls, only for groups opted in
    tab: "students",
    selected: null,     // student row id on the Preferences tab
    focus: null,        // student row id highlighted on the board
    importRows: null,
    lastSync: null
  };

  function who(email) { return state.names[email] || (email ? email.split("@")[0] : "someone"); }
  function groupNames() { return (state.round && state.round.group_names) || []; }
  function draftKey() { return "hg-admin:" + state.store.mode + ":" + (state.round && state.round.id); }

  function saveDraft() {
    lsSet(draftKey(), { assign: state.assign, locked: state.locked, weights: state.weights,
      genderTargets: state.genderTargets });
  }
  function loadDraft() {
    var d = lsGet(draftKey()) || {};
    state.assign = d.assign || {};
    state.locked = d.locked || {};
    state.weights = Object.assign({}, window.HGSolver.DEFAULT_WEIGHTS, d.weights || {});
    state.genderTargets = d.genderTargets || {};
  }

  // Pairs indexed by student, for counts and the detail panel.
  function prefsFor(id) {
    return state.prefs.filter(function (p) { return p.a === id || p.b === id; })
      .map(function (p) { return { pref: p, other: p.a === id ? p.b : p.a }; })
      .filter(function (x) { return state.byId[x.other]; });
  }

  // ------------------------------------------------------------
  // Loading
  // ------------------------------------------------------------
  async function loadRounds(keepId) {
    state.rounds = await state.store.rounds();
    var saved = keepId || lsGet("hg-admin:" + state.store.mode + ":round");
    state.round = state.rounds.filter(function (r) { return r.id === saved; })[0] ||
      state.rounds[state.rounds.length - 1] || null;
    renderRoundPicker();
    await loadRound();
  }

  async function loadRound() {
    state.selected = null;
    state.focus = null;
    state.importRows = null;
    if (!state.round) {
      state.students = []; state.prefs = []; state.solutions = []; state.byId = {};
      render();
      return;
    }
    lsSet("hg-admin:" + state.store.mode + ":round", state.round.id);
    loadDraft();
    await refreshData();
  }

  async function refreshData(quiet) {
    if (!state.round) return;
    var rid = state.round.id;
    var res = await Promise.all([state.store.students(rid), state.store.prefs(rid), state.store.solutions(rid)]);
    state.students = res[0].sort(sortName);
    state.byId = {};
    state.students.forEach(function (s) { state.byId[s.id] = s; });
    state.prefs = res[1];
    state.solutions = res[2];
    state.lastSync = new Date();
    // Forget board entries for students who have since been removed.
    Object.keys(state.assign).forEach(function (k) { if (!state.byId[k]) delete state.assign[k]; });
    Object.keys(state.locked).forEach(function (k) { if (!state.byId[k]) delete state.locked[k]; });
    if (!quiet || !document.querySelector(".hg-dragging")) render();
  }

  // ------------------------------------------------------------
  // Rendering: frame
  // ------------------------------------------------------------
  function render() {
    $("hg-count-students").textContent = state.students.length || "";
    $("hg-count-prefs").textContent = state.prefs.length || "";
    $("hg-sync").textContent = state.lastSync && state.store.mode === "cloud"
      ? "Updated " + state.lastSync.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "";
    var none = !state.round;
    $("hg-empty").hidden = !none;
    $("hg-work").hidden = none;
    $("hg-round-settings").disabled = none;
    if (none) return;
    document.querySelectorAll(".hg-tab").forEach(function (b) {
      var on = b.dataset.tab === state.tab;
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    document.querySelectorAll("[data-panel]").forEach(function (p) {
      p.hidden = p.dataset.panel !== state.tab;
    });
    if (state.tab === "students") renderStudents();
    if (state.tab === "prefs") renderPrefs();
    if (state.tab === "groups") renderGroups();
  }

  function renderRoundPicker() {
    var sel = $("hg-round");
    sel.innerHTML = state.rounds.map(function (r) {
      return '<option value="' + r.id + '"' + (state.round && r.id === state.round.id ? " selected" : "") + ">" +
        esc(r.name) + "</option>";
    }).join("") || '<option value="">No rounds yet</option>';
    sel.disabled = !state.rounds.length;
  }

  function groupFilterOptions(current) {
    var seen = {};
    state.students.forEach(function (s) { if (s.current_group) seen[s.current_group] = 1; });
    return '<option value="">All current groups</option>' + Object.keys(seen).sort().map(function (g) {
      return '<option' + (g === current ? " selected" : "") + ">" + esc(g) + "</option>";
    }).join("");
  }

  function matches(s, text, group) {
    if (group && s.current_group !== group) return false;
    if (!text) return true;
    var hay = (fullName(s) + " " + s.student_id + " " + s.current_group + " " + (s.tags || []).join(" ")).toLowerCase();
    return text.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function tagChips(tags) {
    return (tags || []).map(function (t) { return '<span class="hg-tag">' + esc(t) + "</span>"; }).join(" ");
  }

  // ------------------------------------------------------------
  // Students tab
  // ------------------------------------------------------------
  function renderStudents() {
    $("hg-s-group").innerHTML = groupFilterOptions($("hg-s-group").value);
    var text = $("hg-s-search").value.trim();
    var group = $("hg-s-group").value;
    var counts = {};
    state.prefs.forEach(function (p) {
      [p.a, p.b].forEach(function (id) {
        counts[id] = counts[id] || { t: 0, x: 0 };
        counts[id][p.kind === "apart" ? "x" : "t"]++;
      });
    });
    var rows = state.students.filter(function (s) { return matches(s, text, group); });
    $("hg-s-empty").hidden = state.students.length > 0;
    $("hg-s-table-wrap").hidden = state.students.length === 0;
    $("hg-s-shown").textContent = rows.length === state.students.length
      ? state.students.length + " students" : rows.length + " of " + state.students.length + " students";
    $("hg-s-body").innerHTML = rows.map(function (s) {
      var c = counts[s.id] || { t: 0, x: 0 };
      return '<tr data-id="' + s.id + '">' +
        '<td><button type="button" class="hg-link" data-act="open">' + esc(fullName(s)) + "</button></td>" +
        "<td>" + esc(s.student_id) + "</td>" +
        "<td>" + esc(s.gender) + "</td>" +
        "<td>" + esc(s.current_group) + "</td>" +
        "<td>" + tagChips(s.tags) + "</td>" +
        '<td class="hg-num"><span class="hg-ok-ink" title="Works well with">' + c.t + '</span> / <span class="hg-bad-ink" title="Keep apart">' + c.x + "</span></td>" +
        '<td class="hg-num"><button type="button" class="hg-icon-btn" data-act="del" title="Remove student" aria-label="Remove ' + esc(fullName(s)) + '">&times;</button></td>' +
        "</tr>";
    }).join("");
    renderImportPreview();
  }

  // Header spellings seen in school exports, most specific first.
  var COLUMN_RULES = [
    ["student_id", /^(student\s*)?(id|number|no\.?|code|#)$|student\s*(id|number|code)|id\s*number/i],
    ["first_name", /first|given|preferred/i],
    ["last_name", /last|surname|family/i],
    ["name", /^(full\s*)?name$|student\s*name|^student$/i],
    ["year_level", /year|grade|level/i],
    ["gender", /gender|^sex$/i],
    ["current_group", /home\s*group|homegroup|^hg$|form|roll|house|class|current/i],
    ["tags", /^(tags?|flags?)$/i]
  ];

  function normGender(g) {
    var v = String(g || "").trim();
    var l = v.toLowerCase();
    if (/^(m|male|boy)$/.test(l)) return "M";
    if (/^(f|female|girl)$/.test(l)) return "F";
    return v;
  }

  async function readSheet(file) {
    if (!window.XLSX) throw new Error("The spreadsheet reader didn't load. Check your connection and reload.");
    var buf = await file.arrayBuffer();
    var wb = window.XLSX.read(buf, { type: "array" });
    var ws = wb.Sheets[wb.SheetNames[0]];
    return window.XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: "" });
  }

  function mapRows(grid) {
    var header = (grid[0] || []).map(function (h) { return String(h).trim(); });
    var map = {}, used = {};
    COLUMN_RULES.forEach(function (rule) {
      for (var i = 0; i < header.length; i++) {
        if (!used[i] && rule[1].test(header[i])) { map[rule[0]] = i; used[i] = true; return; }
      }
    });
    var out = [], skipped = 0;
    grid.slice(1).forEach(function (row) {
      function cell(f) { return map[f] === undefined ? "" : String(row[map[f]] || "").trim(); }
      var first = cell("first_name"), last = cell("last_name");
      if (!first && !last && cell("name")) {
        var n = cell("name");
        if (n.indexOf(",") !== -1) { last = n.split(",")[0].trim(); first = n.split(",").slice(1).join(",").trim(); }
        else { var parts = n.split(/\s+/); last = parts.length > 1 ? parts.pop() : ""; first = parts.join(" "); }
      }
      if (!first && !last) { if (row.join("").trim()) skipped++; return; }
      var r = {
        student_id: cell("student_id") || (first + " " + last).toLowerCase(),
        first_name: first,
        last_name: last,
        gender: normGender(cell("gender")),
        year_level: parseInt(cell("year_level").replace(/\D/g, ""), 10) || null,
        current_group: cell("current_group")
      };
      if (map.tags !== undefined) {
        r.tags = cell("tags").split(/[;,|]/).map(function (t) { return t.trim(); }).filter(Boolean);
      }
      out.push(r);
    });
    var labels = { student_id: "Student ID", first_name: "First name", last_name: "Last name", name: "Name",
      year_level: "Year", gender: "Gender", current_group: "Current home group", tags: "Tags" };
    var found = Object.keys(map).map(function (f) { return header[map[f]] + " → " + labels[f]; });
    var missing = ["student_id", "gender", "current_group"].filter(function (f) { return map[f] === undefined; })
      .map(function (f) { return labels[f]; });
    return { rows: out, skipped: skipped, found: found, missing: missing };
  }

  function renderImportPreview() {
    var box = $("hg-import");
    var m = state.importRows;
    box.hidden = !m;
    if (!m) return;
    var existing = {};
    state.students.forEach(function (s) { existing[s.student_id] = true; });
    var updates = m.rows.filter(function (r) { return existing[r.student_id]; }).length;
    box.innerHTML =
      "<h3>Ready to import " + m.rows.length + " students</h3>" +
      '<p class="hg-muted">Columns found: ' + esc(m.found.join(", ")) + "</p>" +
      (m.missing.length ? '<p class="hg-warn">Not found: ' + esc(m.missing.join(", ")) +
        ". The groups can only balance what they are given.</p>" : "") +
      (m.skipped ? '<p class="hg-muted">' + m.skipped + " rows had no name and will be skipped.</p>" : "") +
      (updates ? '<p class="hg-muted">' + updates + " already in this round (same ID) will be updated, not duplicated.</p>" : "") +
      '<div class="hg-table-wrap"><table class="hg-table"><thead><tr><th>Name</th><th>ID</th><th>Gender</th><th>Year</th><th>Current group</th></tr></thead><tbody>' +
      m.rows.slice(0, 5).map(function (r) {
        return "<tr><td>" + esc(r.first_name + " " + r.last_name) + "</td><td>" + esc(r.student_id) + "</td><td>" +
          esc(r.gender) + "</td><td>" + esc(r.year_level || "") + "</td><td>" + esc(r.current_group) + "</td></tr>";
      }).join("") + "</tbody></table></div>" +
      (m.rows.length > 5 ? '<p class="hg-muted">and ' + (m.rows.length - 5) + " more.</p>" : "") +
      '<div class="hg-row"><button type="button" class="hg-btn hg-btn-primary" id="hg-import-go">Import</button>' +
      '<button type="button" class="hg-btn" id="hg-import-cancel">Cancel</button></div>';
  }

  async function onImportFile(file) {
    try {
      var grid = await readSheet(file);
      var m = mapRows(grid);
      if (!m.rows.length) { toast("No students found in that file. Is the first row the column headings?", true); return; }
      state.importRows = m;
      renderImportPreview();
      $("hg-import").scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (e) {
      toast(friendly(e), true);
    }
  }

  async function doImport() {
    var rows = state.importRows.rows;
    // Two rows with one ID would make the upsert fail; the last one wins.
    var byId = {};
    rows.forEach(function (r) { byId[r.student_id] = r; });
    rows = Object.keys(byId).map(function (k) { return byId[k]; });
    try {
      await state.store.upsertStudents(state.round.id, rows);
      state.importRows = null;
      await refreshData();
      toast("Imported " + rows.length + " students.");
    } catch (e) { toast(friendly(e), true); }
  }

  // ------------------------------------------------------------
  // Preferences tab
  // ------------------------------------------------------------
  function renderPrefs() {
    $("hg-p-group").innerHTML = groupFilterOptions($("hg-p-group").value);
    renderPrefList();
    renderPrefDetail();
    renderRecent();
  }

  function renderPrefList() {
    var text = $("hg-p-search").value.trim();
    var group = $("hg-p-group").value;
    var counts = {};
    state.prefs.forEach(function (p) {
      [p.a, p.b].forEach(function (id) {
        counts[id] = counts[id] || { t: 0, x: 0 };
        counts[id][p.kind === "apart" ? "x" : "t"]++;
      });
    });
    var rows = state.students.filter(function (s) { return matches(s, text, group); });
    $("hg-p-list").innerHTML = rows.map(function (s) {
      var c = counts[s.id] || { t: 0, x: 0 };
      return '<li><button type="button" data-id="' + s.id + '" class="hg-plist-item' +
        (state.selected === s.id ? " hg-on" : "") + '"><span class="hg-plist-name">' + esc(fullName(s)) +
        '</span><span class="hg-muted">' + esc(s.current_group) + "</span>" +
        '<span class="hg-plist-counts">' + (c.t ? '<span class="hg-ok-ink">' + c.t + " well</span>" : "") +
        (c.x ? ' <span class="hg-bad-ink">' + c.x + " apart</span>" : "") + "</span></button></li>";
    }).join("") || '<li class="hg-muted hg-pad">No students match.</li>';
  }

  function prefChip(x) {
    var s = state.byId[x.other];
    return '<li class="hg-pchip hg-pchip-' + x.pref.kind + '"><span><strong>' + esc(fullName(s)) +
      '</strong> <span class="hg-muted">' + esc(s.current_group) + " &middot; added by " + esc(who(x.pref.created_by)) +
      '</span></span><button type="button" class="hg-icon-btn" data-del-pref="' + x.pref.id +
      '" aria-label="Remove">&times;</button></li>';
  }

  function renderPrefDetail() {
    var box = $("hg-p-detail");
    var s = state.byId[state.selected];
    if (!s) {
      box.innerHTML = '<div class="hg-hint"><h3>Pick a student</h3><p class="hg-muted">Choose someone on the left, then add who they work well with and who they should be kept apart from. Everyone on the team sees the same list, with who added each one.</p></div>';
      return;
    }
    var mine = prefsFor(s.id);
    var together = mine.filter(function (x) { return x.pref.kind !== "apart"; });
    var apart = mine.filter(function (x) { return x.pref.kind === "apart"; });
    var known = {};
    COMMON_TAGS.forEach(function (t) { known[t] = 1; });
    state.students.forEach(function (st) { (st.tags || []).forEach(function (t) { known[t] = 1; }); });
    var tags = s.tags || [];
    box.innerHTML =
      '<div class="hg-detail-head"><h3>' + esc(fullName(s)) + '</h3><p class="hg-muted">ID ' + esc(s.student_id) +
      " &middot; " + esc(s.gender || "gender not set") + " &middot; " + esc(s.current_group || "no current group") + "</p></div>" +
      '<div class="hg-field"><span class="hg-label">Tags <span class="hg-muted">(spread evenly across groups)</span></span><div class="hg-tagpick">' +
      Object.keys(known).sort().map(function (t) {
        var on = tags.indexOf(t) !== -1;
        return '<button type="button" class="hg-tagtoggle' + (on ? " hg-on" : "") + '" aria-pressed="' + on +
          '" data-tag="' + esc(t) + '">' + esc(t) + "</button>";
      }).join("") +
      '<form id="hg-tag-new" class="hg-inline"><input type="text" placeholder="New tag" maxlength="24" aria-label="New tag"><button class="hg-btn hg-btn-small">Add</button></form></div></div>' +
      '<div class="hg-field"><label class="hg-label" for="hg-pair-search">Add a pairing</label>' +
      '<input id="hg-pair-search" type="search" placeholder="Search for another student" autocomplete="off">' +
      '<ul id="hg-pair-results" class="hg-results"></ul></div>' +
      '<div class="hg-cols2"><div><h4 class="hg-ok-ink">Works well with (' + together.length + ")</h4><ul class=\"hg-pchips\">" +
      (together.map(prefChip).join("") || '<li class="hg-muted">Nobody yet.</li>') + "</ul></div>" +
      '<div><h4 class="hg-bad-ink">Keep apart from (' + apart.length + ")</h4><ul class=\"hg-pchips\">" +
      (apart.map(prefChip).join("") || '<li class="hg-muted">Nobody yet.</li>') + "</ul></div></div>";
  }

  function renderPairResults() {
    var input = $("hg-pair-search");
    var list = $("hg-pair-results");
    if (!input || !list) return;
    var text = input.value.trim();
    if (!text) { list.innerHTML = ""; return; }
    var have = {};
    prefsFor(state.selected).forEach(function (x) { have[x.other] = x.pref.kind; });
    var hits = state.students.filter(function (s) { return s.id !== state.selected && matches(s, text, ""); }).slice(0, 8);
    list.innerHTML = hits.map(function (s) {
      var k = have[s.id];
      return '<li data-id="' + s.id + '"><span>' + esc(fullName(s)) + ' <span class="hg-muted">' + esc(s.current_group) + "</span></span>" +
        '<span class="hg-row"><button type="button" class="hg-btn hg-btn-small hg-btn-ok" data-kind="together"' +
        (k === "together" ? " disabled" : "") + ">Works well with</button>" +
        '<button type="button" class="hg-btn hg-btn-small hg-btn-bad" data-kind="apart"' +
        (k === "apart" ? " disabled" : "") + ">Keep apart</button></span></li>";
    }).join("") || '<li class="hg-muted">No match.</li>';
  }

  function renderRecent() {
    var recent = state.prefs.slice().sort(function (a, b) { return String(b.created_at).localeCompare(String(a.created_at)); })
      .filter(function (p) { return state.byId[p.a] && state.byId[p.b]; }).slice(0, 12);
    $("hg-recent").innerHTML = recent.map(function (p) {
      return "<li><strong>" + esc(fullName(state.byId[p.a])) + "</strong> " +
        (p.kind === "apart" ? '<span class="hg-bad-ink">keep apart from</span>' : '<span class="hg-ok-ink">works well with</span>') +
        " <strong>" + esc(fullName(state.byId[p.b])) + '</strong> <span class="hg-muted">' + esc(who(p.created_by)) +
        ", " + esc(shortDate(p.created_at)) + "</span></li>";
    }).join("") || '<li class="hg-muted">No pairings yet.</li>';
  }

  async function addPairing(otherId, kind) {
    var a = state.selected, b = otherId;
    var existing = state.prefs.filter(function (p) { return pairKey(p.a, p.b) === pairKey(a, b); })[0];
    try {
      if (existing) await state.store.setPrefKind(existing.id, kind, state.email);
      else await state.store.addPref(state.round.id, a, b, kind);
      await refreshData();
      var input = $("hg-pair-search");
      if (input) { input.focus(); }
    } catch (e) { toast(friendly(e), true); }
  }

  async function toggleTag(tag) {
    var s = state.byId[state.selected];
    if (!s || !tag) return;
    var tags = (s.tags || []).slice();
    var i = tags.indexOf(tag);
    if (i === -1) tags.push(tag); else tags.splice(i, 1);
    try {
      await state.store.updateStudent(s.id, { tags: tags });
      s.tags = tags;
      renderPrefDetail();
    } catch (e) { toast(friendly(e), true); }
  }

  // ------------------------------------------------------------
  // Groups tab
  // ------------------------------------------------------------
  function solverInput() {
    var locked = {};
    Object.keys(state.locked).forEach(function (id) {
      var g = state.assign[id];
      if (state.locked[id] && g !== undefined && g < groupNames().length) locked[id] = g;
    });
    return { students: state.students, prefs: state.prefs, groupCount: groupNames().length,
      locked: locked, weights: state.weights, genderTargets: activeTargets() };
  }

  function placed(id) {
    var g = state.assign[id];
    return g !== undefined && g !== null && g >= 0 && g < groupNames().length ? g : -1;
  }

  function generate() {
    if (!state.students.length) { toast("Import some students first.", true); return; }
    if (groupNames().length < 2) { toast("Set at least two groups in Settings.", true); return; }
    var btn = $("hg-generate");
    btn.disabled = true;
    btn.textContent = "Working…";
    setTimeout(function () {
      var res = window.HGSolver.solve(solverInput());
      state.assign = res.assignment;
      saveDraft();
      btn.disabled = false;
      btn.textContent = "Generate groups";
      renderGroups();
      toast("New suggestion ready. Lock anyone you're happy with and generate again to shuffle the rest.");
    }, 30);
  }

  function renderGroups() {
    var names = groupNames();
    var hasBoard = state.students.some(function (s) { return placed(s.id) >= 0; });
    $("hg-g-empty").hidden = hasBoard || !state.students.length;
    $("hg-g-nostudents").hidden = state.students.length > 0;
    renderWeights();
    renderGenderTargets();
    renderVersions();

    var rep = window.HGSolver.report(solverInput(), state.assign);
    lastReport = rep;
    $("hg-summary").hidden = !hasBoard;
    if (hasBoard) renderSummary(rep);

    var target = names.length ? state.students.length / names.length : 0;
    var cols = [];
    var unplaced = state.students.filter(function (s) { return placed(s.id) < 0; });
    if (unplaced.length && hasBoard) {
      cols.push(groupColumn(-1, "Not placed yet", unplaced, null, null));
    }
    names.forEach(function (name, g) {
      var members = state.students.filter(function (s) { return placed(s.id) === g; });
      cols.push(groupColumn(g, name, members, rep.groups[g], target));
    });
    $("hg-board").innerHTML = hasBoard ? cols.join("") : "";
    $("hg-board").classList.toggle("hg-has-focus", Boolean(state.focus && state.byId[state.focus]));
    renderFocus();
  }

  function groupColumn(g, name, members, stats, target) {
    var off = stats && Math.abs(stats.size - target) >= 1;
    var gt = g >= 0 ? activeTargets()[g] : undefined;
    var head = '<div class="hg-col-head"><h3>' + esc(name) + '</h3><span class="hg-size' + (off ? " hg-size-off" : "") +
      '" title="' + (off ? "Target is about " + Math.round(target) : "") + '">' + members.length + "</span></div>";
    if (stats) {
      var gender = Object.keys(stats.gender).sort().map(function (k) { return esc(k) + " " + stats.gender[k]; }).join(" &middot; ");
      var from = Object.keys(stats.from).sort().map(function (k) {
        return '<span class="hg-from-chip">' + esc(k) + " &times;" + stats.from[k] + "</span>";
      }).join("");
      var tags = Object.keys(stats.tags).sort().map(function (k) { return esc(k) + " " + stats.tags[k]; }).join(" &middot; ");
      head += '<div class="hg-col-stats"><div>' + (gender || "&nbsp;") +
        (gt !== undefined ? ' <span class="hg-gt-badge" title="Custom gender mix">aim ' + gt + "% girls</span>" : "") +
        "</div><div class=\"hg-from-row\">" + from + "</div>" +
        (tags ? '<div class="hg-muted">' + tags + "</div>" : "") + "</div>";
    }
    members.sort(sortName);
    return '<section class="hg-col' + (g < 0 ? " hg-col-unplaced" : "") + '" data-group="' + g + '">' + head +
      '<ul class="hg-col-list">' + members.map(studentChip).join("") + "</ul></section>";
  }

  var LOCK_SVG = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" fill="currentColor"/><path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  var UNLOCK_SVG = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5 7V5a3 3 0 0 1 5.8-1" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';

  var lastReport = null;
  function studentChip(s) {
    var cls = "hg-chip";
    if (state.locked[s.id]) cls += " hg-locked";
    if (lastReport && lastReport.flagged[s.id]) cls += " hg-flagged";
    if (state.focus) {
      if (s.id === state.focus) cls += " hg-focus";
      else {
        var rel = state.prefs.filter(function (p) { return pairKey(p.a, p.b) === pairKey(s.id, state.focus); })[0];
        if (rel) cls += rel.kind === "apart" ? " hg-foe" : " hg-mate";
      }
    }
    var locked = Boolean(state.locked[s.id]);
    return '<li class="' + cls + '" draggable="true" data-id="' + s.id + '">' +
      '<span class="hg-gender hg-gender-' + esc((s.gender || "").charAt(0).toUpperCase() || "U") + '" title="Gender">' + esc(s.gender || "?") + "</span>" +
      '<button type="button" class="hg-chip-name" data-act="focus">' + esc(fullName(s)) + "</button>" +
      '<span class="hg-chip-from">' + esc(s.current_group) + "</span>" +
      ((s.tags || []).length ? '<span class="hg-chip-tags" title="' + esc(s.tags.join(", ")) + '">' +
        s.tags.map(function (t) { return esc(t.charAt(0)); }).join("") + "</span>" : "") +
      '<button type="button" class="hg-lock" data-act="lock" aria-pressed="' + locked + '" title="' +
      (locked ? "Locked in this group. Click to unlock." : "Lock in this group") + '" aria-label="' +
      (locked ? "Unlock " : "Lock ") + esc(fullName(s)) + '">' + (locked ? LOCK_SVG : UNLOCK_SVG) + "</button></li>";
  }

  function renderSummary(rep) {
    var t = rep.together, a = rep.apart;
    function pairLine(p) {
      var A = state.byId[p.a], B = state.byId[p.b];
      if (!A || !B) return "";
      return '<li><button type="button" class="hg-link" data-focus="' + A.id + '">' + esc(fullName(A)) + "</button> &amp; " +
        '<button type="button" class="hg-link" data-focus="' + B.id + '">' + esc(fullName(B)) + '</button> <span class="hg-muted">(' +
        esc(who(p.created_by)) + ")</span></li>";
    }
    var broken = t.broken.length + a.broken.length;
    $("hg-summary").innerHTML =
      '<div class="hg-stats">' +
      '<div class="hg-stat"><strong>' + t.met + "/" + t.total + '</strong><span>works-well pairs together</span></div>' +
      '<div class="hg-stat"><strong>' + a.met + "/" + a.total + '</strong><span>keep-apart pairs separated</span></div>' +
      (rep.unplaced ? '<div class="hg-stat hg-stat-warn"><strong>' + rep.unplaced + '</strong><span>not placed yet</span></div>' : "") +
      '<div class="hg-stat"><strong>' + rep.score + '</strong><span>imbalance score (lower is better)</span></div></div>' +
      (broken ? '<details class="hg-broken"><summary>' + broken + " pairing" + (broken === 1 ? "" : "s") + " not met</summary>" +
        (t.broken.length ? '<h4 class="hg-ok-ink">Works well with, but in different groups</h4><ul>' + t.broken.map(pairLine).join("") + "</ul>" : "") +
        (a.broken.length ? '<h4 class="hg-bad-ink">Keep apart, but in the same group</h4><ul>' + a.broken.map(pairLine).join("") + "</ul>" : "") +
        "</details>" : "");
  }

  function renderFocus() {
    var bar = $("hg-focus");
    var s = state.byId[state.focus];
    bar.hidden = !s;
    if (!s) return;
    var mine = prefsFor(s.id);
    var g = placed(s.id);
    bar.innerHTML = "<div><strong>" + esc(fullName(s)) + '</strong> <span class="hg-muted">' + esc(s.current_group) + "</span>" +
      ' <span class="hg-legend"><span class="hg-key hg-key-mate"></span> works well with ' +
      mine.filter(function (x) { return x.pref.kind !== "apart"; }).length +
      ' <span class="hg-key hg-key-foe"></span> keep apart ' + mine.filter(function (x) { return x.pref.kind === "apart"; }).length + "</span></div>" +
      '<div class="hg-row"><label>Move to <select id="hg-move">' +
      (g < 0 ? '<option value="-1" selected>Not placed</option>' : "") +
      groupNames().map(function (n, i) { return '<option value="' + i + '"' + (i === g ? " selected" : "") + ">" + esc(n) + "</option>"; }).join("") +
      '</select></label><button type="button" class="hg-btn hg-btn-small" id="hg-focus-lock">' +
      (state.locked[s.id] ? "Unlock" : "Lock") + '</button><button type="button" class="hg-btn hg-btn-small" id="hg-focus-close">Done</button></div>';
  }

  function moveStudent(id, g) {
    if (g < 0) delete state.assign[id];
    else state.assign[id] = g;
    // A hand-placed student is a decision: keep them there when regenerating.
    if (g >= 0) state.locked[id] = true;
    saveDraft();
    renderGroups();
  }

  function renderWeights() {
    var w = state.weights;
    var rows = [
      ["together", "Keep works-well pairs together"],
      ["apart", "Keep apart pairs separated"],
      ["gender", "Balance gender"],
      ["mix", "Mix students from different current home groups"],
      ["tags", "Spread tags (Support, Leader, ...) evenly"]
    ];
    var box = $("hg-weights");
    if (box.dataset.built) {
      rows.forEach(function (r) {
        var inp = box.querySelector('[data-w="' + r[0] + '"]');
        inp.value = w[r[0]];
        inp.nextElementSibling.textContent = PRIORITY_LABELS[w[r[0]]];
      });
      return;
    }
    box.dataset.built = "1";
    box.innerHTML = rows.map(function (r) {
      return '<label class="hg-weight"><span>' + esc(r[1]) + '</span><input type="range" min="0" max="3" step="1" data-w="' +
        r[0] + '" value="' + w[r[0]] + '"><output>' + PRIORITY_LABELS[w[r[0]]] + "</output></label>";
    }).join("");
  }

  // Opt-in targets, dropping any for groups the round no longer has.
  function activeTargets() {
    var out = {}, n = groupNames().length;
    Object.keys(state.genderTargets).forEach(function (g) {
      if (+g < n) out[g] = state.genderTargets[g];
    });
    return out;
  }

  function yearGirlsPct() {
    var f = 0, m = 0;
    state.students.forEach(function (s) { if (s.gender === "F") f++; else if (s.gender === "M") m++; });
    return f + m ? Math.round(100 * f / (f + m)) : 50;
  }

  function targetLabel(pct) {
    var size = groupNames().length ? state.students.length / groupNames().length : 0;
    return pct + "% girls (about " + Math.round(size * pct / 100) + " of " + Math.round(size) + ")";
  }

  function renderGenderTargets() {
    var on = activeTargets();
    var count = Object.keys(on).length;
    $("hg-gender-state").textContent = count ? "(" + count + " group" + (count === 1 ? "" : "s") + ")" : "(off)";
    var f = 0, m = 0, other = 0;
    state.students.forEach(function (s) {
      if (s.gender === "F") f++; else if (s.gender === "M") m++; else other++;
    });
    $("hg-gender-year").textContent = "This year group: " + f + " girls, " + m + " boys" +
      (other ? ", " + other + " other or not set" : "") + ". Every group matches that mix unless you tick it here.";
    var box = $("hg-gender-rows");
    var focused = document.activeElement && box.contains(document.activeElement) ? document.activeElement.dataset.gt : null;
    box.innerHTML = groupNames().map(function (name, g) {
      var t = on[g];
      var shown = t !== undefined ? t : yearGirlsPct();
      return '<div class="hg-gtarget' + (t !== undefined ? " hg-on" : "") + '">' +
        '<label class="hg-gtarget-name"><input type="checkbox" data-gt-on="' + g + '"' + (t !== undefined ? " checked" : "") +
        "> " + esc(name) + "</label>" +
        '<input type="range" min="0" max="100" step="5" data-gt="' + g + '" value="' + shown + '"' +
        (t !== undefined ? "" : " disabled") + ' aria-label="Percent girls in ' + esc(name) + '">' +
        "<output>" + (t !== undefined ? targetLabel(t) : "matches the year") + "</output></div>";
    }).join("");
    if (focused) {
      var again = box.querySelector('[data-gt="' + focused + '"]');
      if (again) again.focus();
    }
  }

  function renderVersions() {
    var sel = $("hg-versions");
    var prev = sel.value;
    sel.innerHTML = '<option value="">Saved versions (' + state.solutions.length + ")</option>" +
      state.solutions.slice().reverse().map(function (s) {
        return '<option value="' + s.id + '"' + (String(s.id) === prev ? " selected" : "") + ">" + esc(s.name) + " · " +
          esc(who(s.created_by)) + ", " + esc(shortDate(s.created_at)) + "</option>";
      }).join("");
    $("hg-version-load").disabled = !sel.value;
    $("hg-version-del").disabled = !sel.value;
  }

  function exportRows() {
    var names = groupNames();
    return state.students.slice().sort(function (a, b) {
      return (placed(a.id) - placed(b.id)) || sortName(a, b);
    }).map(function (s) {
      var g = placed(s.id);
      return [s.student_id, s.first_name, s.last_name, s.gender, s.year_level || "", s.current_group,
        g < 0 ? "" : names[g], (s.tags || []).join("; ")];
    });
  }
  var EXPORT_HEAD = ["Student ID", "First name", "Last name", "Gender", "Year", "Current home group", "New home group", "Tags"];

  function fileBase() {
    return (state.round.name || "groups").replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-") || "groups";
  }

  function exportCsv() {
    var lines = [EXPORT_HEAD].concat(exportRows()).map(function (r) {
      return r.map(function (v) {
        v = String(v);
        return /[",\r\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
      }).join(",");
    });
    // The BOM makes Excel read names with accents correctly.
    download(fileBase() + ".csv", new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" }));
  }

  function exportXlsx() {
    if (!window.XLSX) { toast("The spreadsheet library didn't load. Use CSV instead.", true); return; }
    var X = window.XLSX;
    var wb = X.utils.book_new();
    var rows = exportRows();
    X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet([EXPORT_HEAD].concat(rows)), "All students");
    groupNames().forEach(function (n) {
      var mine = rows.filter(function (r) { return r[6] === n; });
      // Sheet names: 31 chars max, no []:*?/\ characters.
      X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet([EXPORT_HEAD].concat(mine)),
        n.replace(/[\[\]:*?\/\\]/g, " ").slice(0, 31) || "Group");
    });
    X.writeFile(wb, fileBase() + ".xlsx");
  }

  // ------------------------------------------------------------
  // Dialog (new round, settings, save version)
  // ------------------------------------------------------------
  function openDialog(title, bodyHtml, okLabel, onOk, extra) {
    var dlg = $("hg-dialog");
    var form = $("hg-dialog-form");
    form.innerHTML = "<h2>" + esc(title) + "</h2>" + bodyHtml +
      '<p class="hg-msg" id="hg-dialog-msg" role="alert"></p><div class="hg-row hg-dialog-actions">' + (extra || "") +
      '<span class="hg-grow"></span><button type="button" class="hg-btn" value="cancel" id="hg-dialog-cancel">Cancel</button>' +
      '<button type="submit" class="hg-btn hg-btn-primary">' + esc(okLabel) + "</button></div>";
    form.onsubmit = async function (e) {
      e.preventDefault();
      try {
        var ok = await onOk(form);
        if (ok !== false) dlg.close();
      } catch (err) {
        $("hg-dialog-msg").textContent = friendly(err);
      }
    };
    $("hg-dialog-cancel").onclick = function () { dlg.close(); };
    dlg.showModal();
    var first = form.querySelector("input");
    if (first) first.focus();
    return form;
  }

  function defaultNames(n, year) {
    var out = [];
    for (var i = 0; i < n; i++) out.push((year || "") + String.fromCharCode(65 + i));
    return out;
  }

  function roundFields(r) {
    r = r || { name: "", year_level: 8, group_names: defaultNames(7, 8) };
    return '<label class="hg-field">Name<input name="name" required maxlength="80" value="' + esc(r.name) +
      '" placeholder="e.g. 2027 Year 8 home groups"></label>' +
      '<div class="hg-cols2"><label class="hg-field">Year level of the new groups<input name="year" type="number" min="0" max="13" value="' +
      esc(r.year_level || "") + '"></label>' +
      '<label class="hg-field">Number of groups<input name="count" type="number" min="2" max="30" value="' + r.group_names.length + '"></label></div>' +
      '<label class="hg-field">Group names <span class="hg-muted">(comma separated)</span><input name="names" value="' +
      esc(r.group_names.join(", ")) + '"></label>';
  }

  // Keep the names box in step with the count, unless someone has typed names.
  function wireRoundFields(form) {
    var count = form.elements.count, year = form.elements.year, names = form.elements.names;
    var auto = names.value === defaultNames(parseInt(count.value, 10), year.value).join(", ");
    names.addEventListener("input", function () { auto = false; });
    function sync() {
      if (!auto) return;
      names.value = defaultNames(Math.min(30, Math.max(2, parseInt(count.value, 10) || 2)), year.value).join(", ");
    }
    count.addEventListener("input", sync);
    year.addEventListener("input", sync);
  }

  function readRoundFields(form) {
    var names = form.elements.names.value.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    if (names.length < 2) throw new Error("Give at least two group names.");
    var seen = {};
    names.forEach(function (n) { if (seen[n]) throw new Error("Two groups are both called " + n + "."); seen[n] = 1; });
    return { name: form.elements.name.value.trim(), year_level: parseInt(form.elements.year.value, 10) || null, group_names: names };
  }

  function newRound() {
    var form = openDialog("New round", roundFields(), "Create", async function (f) {
      var r = await state.store.createRound(readRoundFields(f));
      await loadRounds(r.id);
      state.tab = "students";
      render();
      toast("Round created. Import your students next.");
    });
    wireRoundFields(form);
  }

  function roundSettings() {
    if (!state.round) return;
    var r = state.round;
    var form = openDialog("Round settings", roundFields(r), "Save", async function (f) {
      var patch = readRoundFields(f);
      await state.store.updateRound(r.id, patch);
      Object.assign(r, patch);
      renderRoundPicker();
      render();
      toast("Saved.");
    }, '<button type="button" class="hg-btn hg-btn-danger" id="hg-round-delete">Delete round</button>');
    wireRoundFields(form);
    $("hg-round-delete").onclick = async function () {
      if (!window.confirm('Delete "' + r.name + '" with all its students, pairings and saved versions, for everyone? This cannot be undone.')) return;
      try {
        await state.store.deleteRound(r.id);
        lsDel(draftKey());
        $("hg-dialog").close();
        await loadRounds();
        toast("Round deleted.");
      } catch (e) { $("hg-dialog-msg").textContent = friendly(e); }
    };
  }

  function saveVersion() {
    if (!state.students.some(function (s) { return placed(s.id) >= 0; })) {
      toast("Generate or arrange some groups first.", true);
      return;
    }
    var n = state.solutions.length + 1;
    openDialog("Save version",
      '<p class="hg-muted">Saves the board as it is now so the rest of the team can open it.</p>' +
      '<label class="hg-field">Name<input name="vname" required maxlength="60" value="Option ' + n + '"></label>',
      "Save", async function (f) {
        var rep = window.HGSolver.report(solverInput(), state.assign);
        await state.store.saveSolution(state.round.id, {
          name: f.elements.vname.value.trim(), assignment: state.assign, locked: state.locked, score: rep.score
        });
        await refreshData();
        toast("Version saved for the team.");
      });
  }

  // ------------------------------------------------------------
  // Events
  // ------------------------------------------------------------
  function wire() {
    $("hg-theme").addEventListener("click", function () {
      var dark = document.documentElement.dataset.theme === "dark";
      if (window.ITTheme) window.ITTheme.setMode(dark ? "light" : "dark");
    });

    $("hg-login-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      var msg = $("hg-login-msg");
      msg.textContent = "";
      var cloud = getCloud();
      if (!cloud.ready) { msg.textContent = "Supabase isn't configured on this site. Try the demo instead."; return; }
      try {
        var email = await cloud.signIn($("hg-user").value, $("hg-pass").value);
        $("hg-pass").value = "";
        await start(cloud, email);
      } catch (err) {
        msg.textContent = friendly(err);
      }
    });

    $("hg-demo").addEventListener("click", function () {
      lsSet("hg-admin-mode", "demo");
      start(new DemoStore(), DEMO_EMAIL);
    });

    $("hg-signout").addEventListener("click", async function () {
      try { await state.store.signOut(); } catch (e) {}
      lsDel("hg-admin-mode");
      location.reload();
    });

    $("hg-demo-reset").addEventListener("click", async function () {
      if (!window.confirm("Put the demo back to how it started? Your demo changes will be lost.")) return;
      state.store.reset();
      Object.keys(localStorage).forEach(function (k) { if (k.indexOf("hg-admin:demo:") === 0) lsDel(k); });
      await loadRounds();
      toast("Demo reset.");
    });

    $("hg-round").addEventListener("change", async function () {
      var id = parseInt(this.value, 10);
      state.round = state.rounds.filter(function (r) { return r.id === id; })[0] || null;
      await loadRound();
    });
    $("hg-round-new").addEventListener("click", newRound);
    $("hg-empty-new").addEventListener("click", newRound);
    $("hg-round-settings").addEventListener("click", roundSettings);
    $("hg-refresh").addEventListener("click", function () { refreshData().then(function () { toast("Up to date."); }); });

    document.querySelector(".hg-tabs").addEventListener("click", function (e) {
      var b = e.target.closest(".hg-tab");
      if (!b) return;
      state.tab = b.dataset.tab;
      render();
    });

    // Students tab
    $("hg-s-search").addEventListener("input", renderStudents);
    $("hg-s-group").addEventListener("change", renderStudents);
    $("hg-s-file").addEventListener("change", function () {
      if (this.files[0]) onImportFile(this.files[0]);
      this.value = "";
    });
    $("hg-import").addEventListener("click", function (e) {
      if (e.target.id === "hg-import-go") doImport();
      if (e.target.id === "hg-import-cancel") { state.importRows = null; renderImportPreview(); }
    });
    $("hg-s-body").addEventListener("click", async function (e) {
      var btn = e.target.closest("[data-act]");
      if (!btn) return;
      var id = parseInt(btn.closest("tr").dataset.id, 10);
      var s = state.byId[id];
      if (btn.dataset.act === "open") { state.selected = id; state.tab = "prefs"; render(); return; }
      if (btn.dataset.act === "del") {
        if (!window.confirm("Remove " + fullName(s) + " from this round, along with their pairings?")) return;
        try { await state.store.deleteStudent(id); await refreshData(); } catch (err) { toast(friendly(err), true); }
      }
    });

    // Preferences tab
    $("hg-p-search").addEventListener("input", renderPrefList);
    $("hg-p-group").addEventListener("change", renderPrefList);
    $("hg-p-list").addEventListener("click", function (e) {
      var b = e.target.closest("[data-id]");
      if (!b) return;
      state.selected = parseInt(b.dataset.id, 10);
      renderPrefList();
      renderPrefDetail();
      var search = $("hg-pair-search");
      if (search && window.matchMedia("(min-width: 900px)").matches) search.focus();
      else $("hg-p-detail").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    $("hg-p-detail").addEventListener("input", function (e) {
      if (e.target.id === "hg-pair-search") renderPairResults();
    });
    $("hg-p-detail").addEventListener("click", async function (e) {
      var kindBtn = e.target.closest("[data-kind]");
      if (kindBtn) { addPairing(parseInt(kindBtn.closest("li").dataset.id, 10), kindBtn.dataset.kind); return; }
      var del = e.target.closest("[data-del-pref]");
      if (del) {
        try { await state.store.deletePref(parseInt(del.dataset.delPref, 10)); await refreshData(); }
        catch (err) { toast(friendly(err), true); }
        return;
      }
      var tag = e.target.closest("[data-tag]");
      if (tag) toggleTag(tag.dataset.tag);
    });
    $("hg-p-detail").addEventListener("submit", function (e) {
      if (e.target.id !== "hg-tag-new") return;
      e.preventDefault();
      var v = e.target.querySelector("input").value.trim();
      var s = state.byId[state.selected];
      if (v && s && (s.tags || []).indexOf(v) === -1) toggleTag(v);
    });

    // Groups tab
    $("hg-generate").addEventListener("click", generate);
    $("hg-g-start").addEventListener("click", generate);
    $("hg-clear-locks").addEventListener("click", function () {
      state.locked = {};
      saveDraft();
      renderGroups();
      toast("Everyone unlocked.");
    });
    $("hg-save-version").addEventListener("click", saveVersion);
    $("hg-versions").addEventListener("change", renderVersions);
    $("hg-version-load").addEventListener("click", function () {
      var id = parseInt($("hg-versions").value, 10);
      var v = state.solutions.filter(function (s) { return s.id === id; })[0];
      if (!v) return;
      state.assign = Object.assign({}, v.assignment);
      state.locked = Object.assign({}, v.locked);
      saveDraft();
      renderGroups();
      toast('Loaded "' + v.name + '" onto your board.');
    });
    $("hg-version-del").addEventListener("click", async function () {
      var id = parseInt($("hg-versions").value, 10);
      var v = state.solutions.filter(function (s) { return s.id === id; })[0];
      if (!v || !window.confirm('Delete saved version "' + v.name + '" for everyone?')) return;
      try { await state.store.deleteSolution(id); $("hg-versions").value = ""; await refreshData(); }
      catch (err) { toast(friendly(err), true); }
    });
    $("hg-export-csv").addEventListener("click", exportCsv);
    $("hg-export-xlsx").addEventListener("click", exportXlsx);
    $("hg-weights").addEventListener("input", function (e) {
      var k = e.target.dataset.w;
      if (!k) return;
      state.weights[k] = parseInt(e.target.value, 10);
      e.target.nextElementSibling.textContent = PRIORITY_LABELS[state.weights[k]];
      saveDraft();
    });
    $("hg-weights").addEventListener("change", function () { renderGroups(); });

    // Custom gender mix: tick a group to give it its own target.
    $("hg-gender-rows").addEventListener("change", function (e) {
      var on = e.target.dataset.gtOn;
      if (on !== undefined) {
        if (e.target.checked) state.genderTargets[on] = yearGirlsPct();
        else delete state.genderTargets[on];
        saveDraft();
        renderGroups();
        return;
      }
      if (e.target.dataset.gt !== undefined) renderGroups();
    });
    $("hg-gender-rows").addEventListener("input", function (e) {
      var g = e.target.dataset.gt;
      if (g === undefined) return;
      state.genderTargets[g] = parseInt(e.target.value, 10);
      e.target.nextElementSibling.textContent = targetLabel(state.genderTargets[g]);
      saveDraft();
    });

    var board = $("hg-board");
    board.addEventListener("click", function (e) {
      var chip = e.target.closest(".hg-chip");
      if (!chip) return;
      var id = parseInt(chip.dataset.id, 10);
      var act = e.target.closest("[data-act]");
      if (act && act.dataset.act === "lock") {
        if (state.locked[id]) delete state.locked[id];
        else if (placed(id) >= 0) state.locked[id] = true;
        saveDraft();
      } else {
        state.focus = state.focus === id ? null : id;
      }
      renderGroups();
    });
    board.addEventListener("dragstart", function (e) {
      var chip = e.target.closest(".hg-chip");
      if (!chip) return;
      e.dataTransfer.setData("text/plain", chip.dataset.id);
      e.dataTransfer.effectAllowed = "move";
      chip.classList.add("hg-dragging");
    });
    board.addEventListener("dragend", function () {
      document.querySelectorAll(".hg-dragging, .hg-drop").forEach(function (n) { n.classList.remove("hg-dragging", "hg-drop"); });
    });
    board.addEventListener("dragover", function (e) {
      var col = e.target.closest(".hg-col");
      if (!col) return;
      e.preventDefault();
      document.querySelectorAll(".hg-drop").forEach(function (n) { if (n !== col) n.classList.remove("hg-drop"); });
      col.classList.add("hg-drop");
    });
    board.addEventListener("drop", function (e) {
      var col = e.target.closest(".hg-col");
      if (!col) return;
      e.preventDefault();
      var id = parseInt(e.dataTransfer.getData("text/plain"), 10);
      if (state.byId[id]) moveStudent(id, parseInt(col.dataset.group, 10));
    });

    $("hg-summary").addEventListener("click", function (e) {
      var b = e.target.closest("[data-focus]");
      if (!b) return;
      state.focus = parseInt(b.dataset.focus, 10);
      renderGroups();
      var chip = document.querySelector('.hg-chip[data-id="' + state.focus + '"]');
      if (chip) chip.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    $("hg-focus").addEventListener("change", function (e) {
      if (e.target.id === "hg-move") moveStudent(state.focus, parseInt(e.target.value, 10));
    });
    $("hg-focus").addEventListener("click", function (e) {
      if (e.target.id === "hg-focus-close") { state.focus = null; renderGroups(); }
      if (e.target.id === "hg-focus-lock") {
        var id = state.focus;
        if (state.locked[id]) delete state.locked[id];
        else if (placed(id) >= 0) state.locked[id] = true;
        saveDraft();
        renderGroups();
      }
    });

    // Pick up colleagues' changes when someone comes back to the tab.
    window.addEventListener("focus", function () {
      if (state.store && state.store.mode === "cloud" && state.round) {
        refreshData(true).catch(function () {});
      }
    });
  }

  // ------------------------------------------------------------
  // Start
  // ------------------------------------------------------------
  async function start(store, email) {
    state.store = store;
    state.email = email;
    try {
      var members = await store.members();
      if (store.mode === "cloud" && !members.some(function (m) { return m.email.toLowerCase() === email.toLowerCase(); })) {
        await store.signOut();
        $("hg-login-msg").textContent = "That account isn't on the staff list for this app.";
        return;
      }
      state.names = {};
      members.forEach(function (m) { state.names[m.email] = m.display_name; });
      $("hg-who").textContent = who(email) + (store.mode === "demo" ? " (demo)" : "");
      $("hg-login").hidden = true;
      $("hg-app").hidden = false;
      $("hg-userbar").hidden = false;
      $("hg-demo-banner").hidden = store.mode !== "demo";
      $("hg-refresh").hidden = store.mode !== "cloud";
      await loadRounds();
    } catch (e) {
      $("hg-login").hidden = false;
      $("hg-app").hidden = true;
      $("hg-userbar").hidden = true;
      $("hg-login-msg").textContent = friendly(e);
    }
  }

  async function boot() {
    wire();
    if (lsGet("hg-admin-mode") === "demo") { start(new DemoStore(), DEMO_EMAIL); return; }
    var cloud = getCloud();
    if (!cloud.ready) return;
    try {
      var email = await cloud.resume();
      if (email) start(cloud, email);
    } catch (e) { /* stay on the login screen */ }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
