/* FinStudio app: hash router, sidebar, progress store, lesson renderer.
   Adding a lesson = one object in a module file + one manifest entry;
   nothing in this file changes per lesson. */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});
  var fmt = LS.fmt;

  /* ================= progress store (localStorage, degrades to memory) ================= */
  var store = (function () {
    var KEY = "finstudio-progress-v1";
    var mem = null;
    function load() {
      if (mem) return mem;
      try { mem = JSON.parse(localStorage.getItem(KEY) || "{}"); }
      catch (e) { mem = {}; }
      return mem;
    }
    function save() {
      try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* memory-only */ }
    }
    return {
      lesson: function (id) {
        var all = load();
        if (!all[id]) all[id] = { items: {}, sheets: {} };
        if (!all[id].items) all[id].items = {};
        if (!all[id].sheets) all[id].sheets = {};
        return all[id];
      },
      markItem: function (lessonId, itemId) {
        this.lesson(lessonId).items[itemId] = true;
        // Stamp the moment a lesson first becomes complete, so the review
        // queue can resurface it later. Spacing needs a date, not a boolean.
        var l = this.lesson(lessonId);
        if (!l.completedAt && this.isDone(lessonId)) l.completedAt = Date.now();
        save();
      },
      completedAt: function (lessonId) { return this.lesson(lessonId).completedAt || 0; },
      /** Record that a review was done, so the next one is scheduled later. */
      markReviewed: function (lessonId) {
        var l = this.lesson(lessonId);
        l.reviews = (l.reviews || 0) + 1;
        l.reviewedAt = Date.now();
        save();
      },
      reviewCount: function (lessonId) { return this.lesson(lessonId).reviews || 0; },
      lastReviewed: function (lessonId) { return this.lesson(lessonId).reviewedAt || 0; },
      saveCell: function (lessonId, sheetId, addr, raw) {
        var l = this.lesson(lessonId);
        if (!l.sheets[sheetId]) l.sheets[sheetId] = {};
        l.sheets[sheetId][addr] = raw;
        save();
      },
      clearSheet: function (lessonId, sheetId) {
        var l = this.lesson(lessonId);
        delete l.sheets[sheetId];
        save();
      },
      quiz: function (code, score) {
        var l = this.lesson("quiz-" + code);
        if (score != null) { l.items.score = score; save(); }
        return l.items.score;
      },
      isDone: function (lessonId) {
        var lesson = LS.lessons[lessonId];
        if (!lesson) return false;
        var need = requiredItems(lesson);
        if (!need.length) return false;
        var have = this.lesson(lessonId).items;
        return need.every(function (id) { return have[id]; });
      }
    };
  })();
  LS.store = store;

  // Have all this lesson's sandboxes been solved? The share card hangs off
  // this rather than off whole-lesson completion: the card celebrates the
  // sheet tying, not the MCQ underneath it.
  function sheetsDone(lesson) {
    var ids = [];
    (lesson.body || []).forEach(function (b, i) {
      if (b.t === "sheet") ids.push(b.sheet.id || "sheet" + i);
    });
    if (!ids.length) return false;
    var have = store.lesson(lesson.id).items;
    return ids.every(function (x) { return have[x]; });
  }

  function requiredItems(lesson) {
    var ids = [];
    (lesson.body || []).forEach(function (b, i) {
      if (b.t === "sheet") ids.push(b.sheet.id || "sheet" + i);
      if (b.t === "mcq") ids.push("mcq" + i);
      if (b.t === "classify") ids.push("classify" + i);
    });
    return ids;
  }

  /* ================= tiny DOM helpers ================= */
  function el(tag, cls, html) {
    var d = document.createElement(tag);
    if (cls) d.className = cls;
    if (html != null) d.innerHTML = html;
    return d;
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ================= manifest access ================= */
  function allLessonIdsInOrder() {
    // Curriculum order leads, so Previous/Next walks Level 0 -> Level 10 in one
    // sequence. Café lessons placed inside the curriculum appear once, in their
    // curriculum position; any left over follow at the end.
    var out = [], seen = {};
    function push(id) {
      if (id && !seen[id] && LS.lessons[id]) { seen[id] = true; out.push(id); }
    }
    if (LS.curriculumMap) {
      LS.curriculumMap.forEach(function (lv) {
        lv.modules.forEach(function (mod) {
          mod.topics.forEach(function (t) { if (t.written) push(t.cid || t.id); });
        });
      });
    }
    LS.manifest.levels.forEach(function (lv) {
      lv.modules.forEach(function (mc) {
        LS.manifest.modules[mc].lessons.forEach(push);
      });
    });
    push("c-capstone"); // the end-to-end case closes the sequence
    return out;
  }
  /* Where a concept lesson sits in the 11-level curriculum. */
  function conceptLocation(lessonId) {
    var found = null;
    if (!LS.curriculumMap) return null;
    LS.curriculumMap.forEach(function (lv) {
      lv.modules.forEach(function (mod) {
        mod.topics.forEach(function (t) {
          if (t.id === lessonId) found = { level: lv, module: mod };
        });
      });
    });
    return found;
  }
  function moduleOf(lessonId) {
    var found = null;
    Object.keys(LS.manifest.modules).forEach(function (mc) {
      if (LS.manifest.modules[mc].lessons.indexOf(lessonId) >= 0) found = mc;
    });
    return found;
  }
  function moduleProgress(code) {
    var m = LS.manifest.modules[code];
    var done = m.lessons.filter(function (id) { return store.isDone(id); }).length;
    return { done: done, total: m.lessons.length };
  }
  function moduleMinutes(code) {
    return LS.manifest.modules[code].lessons.reduce(function (a, id) {
      return a + ((LS.lessons[id] && LS.lessons[id].minutes) || 4);
    }, 0);
  }

  /* ================= sidebar ================= */
  function buildSidebar() {
    var nav = document.getElementById("sidebar");
    nav.innerHTML = "";
    var hash = currentRoute();

    /* First-visit orientation. One short panel, dismissible for good, so a
       beginner knows what they are looking at before facing 227 topics. */
    (function onboarding() {
      var KEY = "finstudio-oriented-v1";
      var seen = false;
      try { seen = localStorage.getItem(KEY) === "1"; } catch (e) { seen = false; }
      if (seen) return;
      var box = el("div", "onboard-panel");
      box.innerHTML = '<p class="onboard-label">New here?</p>' +
        "<p>Eleven levels, from what money is to valuing a company. " +
        "Each lesson explains the idea, works an example, then asks you to do one. " +
        "Start at Level 0 and follow Next \u2014 the order is deliberate.</p>";
      var btn = el("button", "onboard-dismiss", "Got it");
      btn.addEventListener("click", function () {
        try { localStorage.setItem(KEY, "1"); } catch (e) { /* ignore */ }
        box.parentNode && box.parentNode.removeChild(box);
      });
      box.appendChild(btn);
      nav.appendChild(box);
    })();

    /* Lesson search. 227 topics is too many to scroll; this filters the rail
       by title as you type, so a half-remembered concept is findable. */
    (function railSearch() {
      var wrap = el("div", "rail-search");
      var input = document.createElement("input");
      input.type = "search";
      input.className = "rail-search-input";
      input.placeholder = "Search lessons\u2026";
      input.setAttribute("aria-label", "Search lessons");
      wrap.appendChild(input);
      var hits = el("ul", "rail-search-hits");
      wrap.appendChild(hits);
      input.addEventListener("input", function () {
        var q = input.value.trim().toLowerCase();
        hits.innerHTML = "";
        if (q.length < 2) { wrap.classList.remove("has-hits"); return; }
        /* Other scripts republish lessons under a second id, so the same title
           can appear several times. Keep one entry per title. */
        var found = [], titleSeen = {};
        Object.keys(LS.lessons).forEach(function (lid) {
          var l = LS.lessons[lid];
          var title = (l.title || "").toLowerCase();
          if (!title || titleSeen[title] || title.indexOf(q) < 0) return;
          titleSeen[title] = true;
          found.push({ id: lid, title: l.title, rank: title.indexOf(q) });
        });
        found.sort(function (a, b) { return a.rank - b.rank || a.title.localeCompare(b.title); });
        found.slice(0, 8).forEach(function (f) {
          var li = el("li"), a = el("a", "rail-search-hit");
          a.href = "#/" + f.id;
          a.textContent = f.title;
          li.appendChild(a);
          hits.appendChild(li);
        });
        wrap.classList.toggle("has-hits", found.length > 0);
      });
      nav.appendChild(wrap);
    })();

    /* Spaced review queue. A lesson resurfaces 7 days after completion, then
       30, then 90 — the standard expanding intervals. Reading once and moving
       on is what makes curricula evaporate; this is the loop that fixes it. */
    (function reviewQueue() {
      if (!LS.curriculumMap) return;
      var DAY = 86400000;
      var intervals = [7 * DAY, 30 * DAY, 90 * DAY];
      var due = [];
      Object.keys(LS.lessons).forEach(function (id) {
        var done = store.completedAt(id);
        if (!done) return;
        var n = store.reviewCount(id);
        if (n >= intervals.length) return;                 // fully reviewed
        var since = store.lastReviewed(id) || done;
        if (Date.now() - since >= intervals[n]) due.push({ id: id, since: since });
      });
      if (!due.length) return;
      due.sort(function (a, b) { return a.since - b.since; });

      var box = el("div", "review-panel");
      box.innerHTML = '<p class="review-label">Due for review</p>' +
        '<p class="review-count">' + due.length + (due.length === 1 ? " lesson" : " lessons") + "</p>";
      var ul = el("ul", "review-list");
      due.slice(0, 5).forEach(function (item) {
        var lesson = LS.lessons[item.id];
        var li = el("li"), a = el("a", "review-item");
        a.href = "#/" + item.id;
        var days = Math.floor((Date.now() - item.since) / DAY);
        a.innerHTML = '<span class="review-title">' + esc(lesson.short || lesson.title) + "</span>" +
          '<span class="review-age">' + days + "d</span>";
        li.appendChild(a);
        ul.appendChild(li);
      });
      box.appendChild(ul);
      nav.appendChild(box);
    })();

    /* Learning path panel: where the learner is, and the one link that matters
       most — the next unfinished written lesson in curriculum order. Beginners
       abandon curricula that don't tell them where they are. */
    (function learningPath() {
      if (!LS.curriculumMap) return;
      var written = [], done = 0, next = null;
      LS.curriculumMap.forEach(function (lv) {
        lv.modules.forEach(function (mod) {
          mod.topics.forEach(function (t) {
            if (!t.written || !LS.lessons[t.id]) return;
            written.push(t);
            if (store.isDone(t.id)) done++;
            else if (!next) next = { topic: t, level: lv };
          });
        });
      });
      if (!written.length) return;

      var box = el("div", "path-panel");
      var pct = Math.round((done / written.length) * 100);
      var started = done > 0;
      box.innerHTML =
        '<p class="path-label">' + (started ? "Your progress" : "Start here") + "</p>" +
        '<p class="path-count">' + done + " of " + written.length + " lessons</p>" +
        '<div class="path-bar"><span style="width:' + pct + '%"></span></div>';
      if (next) {
        var a = el("a", "path-next");
        a.href = "#/" + next.topic.id;
        a.innerHTML =
          '<span class="path-next-label">' + (started ? "Continue" : "Begin with") + "</span>" +
          '<span class="path-next-title">' + esc(next.topic.title) + "</span>" +
          '<span class="path-next-meta">Level ' + next.level.level + " · " + esc(next.level.title) + "</span>";
        box.appendChild(a);
      } else {
        box.appendChild(el("p", "path-next-meta", "Every written lesson complete."));
      }
      nav.appendChild(box);
    })();
    /* Which café lessons already appear inside Levels 0-10, so they are not
       listed twice. The old "Level 1 / Level 2" headings are gone: the
       curriculum below is the single source of truth for the pane. */
    var placed = {};
    if (LS.curriculumMap) {
      LS.curriculumMap.forEach(function (lv) {
        lv.modules.forEach(function (mod) {
          mod.topics.forEach(function (t) { if (t.written) placed[t.id] = true; });
        });
      });
    }

    /* The full curriculum: all 11 levels, 35 modules, 227 topics. Topics with an
       authored concept lesson are links; the rest are shown but unlinked, so the
       whole learning path is visible without creating routes that 404. */
    if (LS.curriculumMap) {
      LS.curriculumMap.forEach(function (lv) {
        nav.appendChild(el("div", "side-level", esc("Level " + lv.level + " · " + lv.title)));
        lv.modules.forEach(function (mod) {
          var wrap2 = el("div", "side-module");
          var written = mod.topics.filter(function (t) { return t.written; });
          var doneCount = written.filter(function (t) { return store.isDone(t.id); }).length;
          var head2 = el("div", "side-module-head");
          head2.innerHTML = '<span class="side-module-title">' + esc(mod.title) + '</span>' +
            '<span class="side-progress">' + doneCount + "/" + written.length + "</span>";
          wrap2.appendChild(head2);
          var ul2 = el("ul", "side-lessons");
          mod.topics.forEach(function (t) {
            var li2 = el("li");
            if (t.written) {
              var a2 = el("a");
              a2.href = "#/" + t.id;
              if (hash.kind === "lesson" && hash.id === t.id) a2.className = "active";
              a2.innerHTML = '<span class="side-lesson-title">' + esc(t.title) + '</span>' +
                (store.isDone(t.id) ? '<span class="side-done" aria-label="completed">\u2713</span>' : "");
              li2.appendChild(a2);
            } else {
              var sp = el("span", "side-lesson-planned");
              sp.setAttribute("title", "Lesson not written yet");
              sp.innerHTML = '<span class="side-lesson-title">' + esc(t.title) + '</span>';
              li2.appendChild(sp);
            }
            ul2.appendChild(li2);
          });
          wrap2.appendChild(ul2);
          nav.appendChild(wrap2);
        });
      });
    }
    /* Capstone: the end-to-end case that uses every level together. */
    if (LS.lessons && LS.lessons["c-capstone"]) {
      nav.appendChild(el("div", "side-level", "Capstone"));
      var capWrap = el("div", "side-module");
      var capUl = el("ul", "side-lessons");
      var capLi = el("li"), capA = el("a");
      capA.href = "#/c-capstone";
      if (hash.kind === "lesson" && hash.id === "c-capstone") capA.className = "active";
      capA.innerHTML = '<span class="side-lesson-title">Value a company end to end</span>' +
        (store.isDone("c-capstone") ? '<span class="side-done">\u2713</span>' : "");
      capLi.appendChild(capA);
      capUl.appendChild(capLi);
      capWrap.appendChild(capUl);
      nav.appendChild(capWrap);
    }

    /* Café model labs: the interactive spreadsheet lessons that don't map onto a
       single curriculum topic (capstones, module quizzes). Kept reachable. */
    var labModules = [];
    LS.manifest.levels.forEach(function (lv) {
      lv.modules.forEach(function (mc) {
        var m = LS.manifest.modules[mc];
        var left = m.lessons.filter(function (id) { return !placed[id] && LS.lessons[id]; });
        if (left.length || (LS.quizzes && LS.quizzes[mc])) labModules.push({ mc: mc, m: m, left: left });
      });
    });
    if (labModules.length) {
      nav.appendChild(el("div", "side-level", "Café model labs"));
      labModules.forEach(function (entry) {
        var wrap3 = el("div", "side-module");
        var head3 = el("a", "side-module-head");
        head3.href = "#/module/" + entry.mc;
        head3.innerHTML = '<span class="side-module-title">' + esc(entry.m.title) + "</span>";
        wrap3.appendChild(head3);
        var ul3 = el("ul", "side-lessons");
        entry.left.forEach(function (id) {
          var lesson = LS.lessons[id];
          var li3 = el("li"), a3 = el("a");
          a3.href = "#/" + id;
          if (hash.kind === "lesson" && hash.id === id) a3.className = "active";
          a3.innerHTML = '<span class="side-lesson-title">' + esc(lesson.short || lesson.title) + "</span>" +
            (store.isDone(id) ? '<span class="side-done">\u2713</span>' : "");
          li3.appendChild(a3);
          ul3.appendChild(li3);
        });
        if (LS.quizzes && LS.quizzes[entry.mc]) {
          var ql = el("li", "side-quiz-link"), qa2 = el("a");
          qa2.href = "#/quiz/" + entry.mc;
          if (hash.kind === "quiz" && hash.id === entry.mc) qa2.className = "active";
          qa2.innerHTML = '<span class="side-lesson-title">Module quiz</span>';
          ql.appendChild(qa2);
          ul3.appendChild(ql);
        }
        wrap3.appendChild(ul3);
        nav.appendChild(wrap3);
      });
    }
    if (LS.reference) {
      nav.appendChild(el("div", "side-level", "Reference"));
      var rwrap = el("div", "side-module");
      var rul = el("ul", "side-lessons");
      Object.keys(LS.reference).forEach(function (rid) {
        var li = el("li"), a = el("a");
        a.href = "#/ref/" + rid;
        if (hash.kind === "ref" && hash.id === rid) a.className = "active";
        a.innerHTML = '<span class="side-lesson-title">' + esc(LS.reference[rid].title) + "</span>";
        li.appendChild(a);
        rul.appendChild(li);
      });
      if (LS.glossary) {
        var gli = el("li"), ga = el("a");
        ga.href = "#/glossary";
        if (hash.kind === "glossary") ga.className = "active";
        ga.innerHTML = '<span class="side-lesson-title">Glossary</span>' +
          '<span class="side-done" style="font-family:var(--font-mono);font-size:.72rem;color:var(--ink-faint)">' + LS.glossary.length + "</span>";
        gli.appendChild(ga);
        rul.appendChild(gli);
      }
      rwrap.appendChild(rul);
      nav.appendChild(rwrap);
    }
  }

  /* ================= block renderers ================= */
  var blockRenderers = {
    p: function (b) {
      /* Some lesson data puts a table or list in a "p" block. Nesting those in
         a <p> is invalid HTML: the browser closes the paragraph early, which
         breaks indentation and leaves stray gaps. Render block content in a
         div so it inherits the same spacing without the nesting. */
      if (/^\s*<(table|ul|ol|div|figure|blockquote)\b/i.test(b.h)) {
        return el("div", "lesson-block", b.h);
      }
      return el("p", null, b.h);
    },
    h2: function (b) { return el("h2", null, esc(b.text)); },
    h3: function (b) { return el("h3", null, esc(b.text)); },
    def: function (b) {
      var d = el("div", "def-card");
      d.appendChild(el("p", "def-term", esc(b.term)));
      d.appendChild(el("p", null, b.h));
      return d;
    },
    formula: function (b) {
      var d = el("div", "formula-block");
      if (b.title) d.appendChild(el("div", "fx-title", esc(b.title)));
      (b.lines || []).forEach(function (line) { d.appendChild(el("div", "fx-line", line)); });
      if (b.note) d.appendChild(el("div", "fx-note", b.note));
      return d;
    },
    example: function (b) {
      var d = el("div", "example-card");
      d.appendChild(el("div", "ex-tag", "Real-life example · " + LS.C.name));
      d.appendChild(el("div", null, b.h));
      return d;
    },
    where: function (b) {
      var d = el("div", "where-box");
      d.appendChild(el("span", "where-tag", "Where this number goes"));
      d.appendChild(el("p", null, b.h));
      return d;
    },
    note: function (b) {
      /* Wrap plain text in a paragraph, but insert block content (a list) as-is:
         nesting <ul> inside <p> makes the browser close the paragraph early and
         leaves an empty one behind, which shows up as a stray gap. */
      var d = el("div", "note-box");
      d.innerHTML = /^\s*<(ul|ol|div|table|p)\b/i.test(b.h) ? b.h : "<p>" + b.h + "</p>";
      return d;
    },

    /* A real list, so bullets align with body text instead of sitting inside a
       paragraph with paragraph spacing. */
    list: function (b) {
      var ul = el("ul", "lesson-list");
      (b.items || []).forEach(function (item) {
        var li = document.createElement("li");
        li.innerHTML = item;
        ul.appendChild(li);
      });
      return ul;
    },

    /* Practice: each exercise gets a writing space, then the worked solution
       on request. Answers are kept in localStorage so work isn't lost. */
    practice: function (b, ctx) {
      var wrap = el("div", "practice-block");
      (b.items || []).forEach(function (item, i) {
        var box = el("div", "practice-item");
        box.appendChild(el("p", "practice-q", "<strong>" + (i + 1) + ".</strong> " + item.q));
        var ta = document.createElement("textarea");
        ta.className = "practice-input";
        ta.rows = 3;
        ta.placeholder = "Work it out here first\u2026";
        var key = "practice:" + (ctx && ctx.lessonId) + ":" + i;
        try { ta.value = localStorage.getItem(key) || ""; } catch (e) {}
        ta.addEventListener("input", function () {
          try { localStorage.setItem(key, ta.value); } catch (e) {}
        });
        box.appendChild(ta);
        /* Numeric self-check. Pull the figures out of the worked solution and
           tell the learner whether their answer contains one of them. It does
           not grade reasoning — it catches the case where someone reveals the
           answer and assumes they were right. */
        var check = null;   // created on first use, so no empty node sits in the DOM
        var solutionNumbers = (item.a.match(/[\d][\d,]*\.?\d*/g) || [])
          .map(function (x) { return x.replace(/,/g, ""); })
          .filter(function (x) { return parseFloat(x) >= 1; });
        function selfCheck() {
          var typed = (ta.value.match(/[\d][\d,]*\.?\d*/g) || [])
            .map(function (x) { return x.replace(/,/g, ""); });
          if (!typed.length || !solutionNumbers.length) {
            if (check) check.style.display = "none";
            return;
          }
          if (!check) { check = el("p", "practice-check"); box.insertBefore(check, btn); }
          var hit = typed.some(function (t) {
            return solutionNumbers.some(function (sn) {
              var a = parseFloat(t), b = parseFloat(sn);
              return b !== 0 && Math.abs(a - b) / Math.abs(b) < 0.01;
            });
          });
          check.className = "practice-check " + (hit ? "is-match" : "is-nomatch");
          check.textContent = hit
            ? "\u2713 A figure in your answer matches the worked solution."
            : "No figure in your answer matches the solution yet \u2014 check your working.";
          check.style.display = "block";
        }
        var btn = el("button", "practice-reveal", "Show worked solution");
        // Same rule as the callout: don't wrap block content in a paragraph.
        var ans = el("div", "practice-solution");
        ans.innerHTML = /^\s*<(ul|ol|div|table|p)\b/i.test(item.a) ? item.a : "<p>" + item.a + "</p>";
        ans.style.display = "none";
        btn.addEventListener("click", function () {
          var open = ans.style.display !== "none";
          ans.style.display = open ? "none" : "block";
          btn.textContent = open ? "Show worked solution" : "Hide solution";
        });
        box.appendChild(btn);
        ta.addEventListener("blur", selfCheck);
        box.appendChild(ans);
        wrap.appendChild(box);
      });
      return wrap;
    },

    /* Sandbox: editable inputs recalculated live by the shared engine. */
    sandbox: function (b) {
      var wrap = el("div", "sandbox-block");
      wrap.appendChild(el("p", "sandbox-title", esc(b.title || "Sandbox")));
      if (b.prompt) wrap.appendChild(el("p", "sandbox-prompt", esc(b.prompt)));
      var inputs = el("div", "sandbox-inputs");
      var out = el("div", "sandbox-outputs");
      var state = {};
      (b.fields || []).forEach(function (f) { state[f.key] = f.value; });

      function recalc() {
        out.innerHTML = "";
        var rows = (LS.sandbox && LS.sandbox.computeSandbox)
          ? LS.sandbox.computeSandbox(b.kind, state) : [];
        rows.forEach(function (r) {
          var row = el("div", "sandbox-row");
          row.innerHTML = '<span class="sandbox-label">' + esc(r.label) +
            (r.note ? '<span class="sandbox-note">' + esc(r.note) + "</span>" : "") +
            '</span><span class="sandbox-value">' + esc(r.value) + "</span>";
          out.appendChild(row);
        });
      }

      (b.fields || []).forEach(function (f) {
        var lab = el("label", "sandbox-field");
        lab.innerHTML = '<span>' + esc(f.label) +
          (f.unit ? ' <em>(' + esc(f.unit) + ")</em>" : "") + "</span>";
        var inp = document.createElement("input");
        inp.type = "number";
        inp.value = f.value;
        inp.addEventListener("input", function () {
          var n = parseFloat(inp.value);
          state[f.key] = isNaN(n) ? 0 : n;
          recalc();
        });
        lab.appendChild(inp);
        inputs.appendChild(lab);
      });

      var reset = el("button", "sandbox-reset", "Reset");
      reset.addEventListener("click", function () {
        (b.fields || []).forEach(function (f, i) {
          state[f.key] = f.value;
          inputs.querySelectorAll("input")[i].value = f.value;
        });
        recalc();
      });

      wrap.appendChild(inputs);
      wrap.appendChild(out);
      wrap.appendChild(reset);
      recalc();
      return wrap;
    },
    svg: function (b) {
      var d = el("figure", "table-wrap");
      d.style.margin = "1.4rem 0";
      d.innerHTML = b.h + (b.caption ? '<figcaption class="sheet-msg" style="margin-top:.4rem">' + b.caption + "</figcaption>" : "");
      return d;
    },
    table: function (b) {
      var wrap = el("div", "table-wrap");
      var t = el("table", "ls-table");
      if (b.head) {
        var tr = el("tr");
        b.head.forEach(function (h, i) {
          tr.appendChild(el("th", (b.numCols || []).indexOf(i) >= 0 ? "num" : null, h));
        });
        var thead = el("thead"); thead.appendChild(tr); t.appendChild(thead);
      }
      var tbody = el("tbody");
      (b.rows || []).forEach(function (row) {
        var tr = el("tr", row.total ? "total" : null);
        (row.cells || row).forEach(function (cdef, i) {
          tr.appendChild(el("td", (b.numCols || []).indexOf(i) >= 0 ? "num" : null, cdef));
        });
        tbody.appendChild(tr);
      });
      t.appendChild(tbody);
      wrap.appendChild(t);
      return wrap;
    },
    sheet: function (b, ctx, idx) { return renderSheet(b.sheet, ctx, b.sheet.id || "sheet" + idx); },
    mcq: function (b, ctx, idx) { return renderMCQ(b, ctx, "mcq" + idx); },
    classify: function (b, ctx, idx) { return renderClassify(b, ctx, "classify" + idx); },
    compare: function (b) {
      var grid = el("div", "compare-grid");
      [b.left, b.right].forEach(function (side) {
        var card = el("div", "compare-card");
        card.appendChild(el("h4", null, esc(side.title)));
        var t = el("table"), tb = el("tbody");
        side.rows.forEach(function (r) {
          var tr = el("tr", r[2] === "total" ? "total" : null);
          tr.appendChild(el("td", null, r[0]));
          tr.appendChild(el("td", "num", r[1]));
          tb.appendChild(tr);
        });
        t.appendChild(tb); card.appendChild(t); grid.appendChild(card);
      });
      return grid;
    }
  };

  /* ================= MCQ ================= */
  function renderMCQ(b, ctx, itemId) {
    var wrap = el("div", "mcq-block");
    wrap.appendChild(el("div", "mcq-tag", b.tag || "Check yourself"));
    wrap.appendChild(el("p", "mcq-q", b.q));
    var ul = el("ul", "mcq-opts");
    var explainBox = el("div");
    var answered = ctx && store.lesson(ctx.lessonId).items[itemId];
    b.opts.forEach(function (opt, i) {
      var li = el("li");
      var btn = el("button", null, esc(opt));
      btn.type = "button";
      btn.addEventListener("click", function () {
        var right = i === b.correct;
        Array.prototype.forEach.call(ul.querySelectorAll("button"), function (x) {
          x.classList.remove("picked-wrong");
        });
        explainBox.innerHTML = "";
        var why = (b.why && b.why[i]) || (right ? b.explain : null);
        var msg = el("div", "mcq-explain" + (right ? "" : " wrong"));
        msg.innerHTML = "<p><strong>" + (right ? "Correct." : "Not quite.") + "</strong> " + (why || (right ? "" : "Think about it once more and try again.")) + "</p>";
        explainBox.appendChild(msg);
        if (right) {
          btn.classList.add("picked-right");
          Array.prototype.forEach.call(ul.querySelectorAll("button"), function (x) { x.disabled = true; });
          if (ctx) { store.markItem(ctx.lessonId, itemId); buildSidebar(); }
          if (ctx && ctx.onItemDone) ctx.onItemDone();
        } else {
          btn.classList.add("picked-wrong");
        }
      });
      li.appendChild(btn);
      ul.appendChild(li);
    });
    wrap.appendChild(ul);
    wrap.appendChild(explainBox);
    if (answered) {
      var btns = ul.querySelectorAll("button");
      if (btns[b.correct]) btns[b.correct].classList.add("picked-right");
    }
    return wrap;
  }

  /* ================= classification exercise ================= */
  function renderClassify(b, ctx, itemId) {
    var wrap = el("div", "classify-block");
    wrap.appendChild(el("div", "mcq-tag", b.tag || "Classify"));
    if (b.intro) wrap.appendChild(el("p", "mcq-q", b.intro));
    var doneCount = 0, total = b.items.length;
    var alreadyDone = ctx && store.lesson(ctx.lessonId).items[itemId];
    b.items.forEach(function (item) {
      var row = el("div", "classify-item");
      row.appendChild(el("span", "classify-text", item.text));
      var btns = el("div", "classify-btns");
      var fb = el("p", "classify-feedback", "");
      var solved = false;
      b.buckets.forEach(function (bucket) {
        var btn = el("button", null, esc(bucket));
        btn.type = "button";
        btn.addEventListener("click", function () {
          if (solved) return;
          if (bucket === item.bucket) {
            solved = true;
            Array.prototype.forEach.call(btns.querySelectorAll("button"), function (x) {
              x.classList.remove("picked-wrong");
              if (x === btn) x.classList.add("picked-right");
              x.disabled = true;
            });
            fb.innerHTML = item.why || "";
            doneCount++;
            if (doneCount === total && ctx) {
              store.markItem(ctx.lessonId, itemId);
              buildSidebar();
              if (ctx.onItemDone) ctx.onItemDone();
            }
          } else {
            btn.classList.add("picked-wrong");
            fb.innerHTML = item.whyNot && item.whyNot[bucket] ? item.whyNot[bucket] : "Not that one — read the definition again.";
          }
        });
        btns.appendChild(btn);
      });
      if (alreadyDone) {
        Array.prototype.forEach.call(btns.querySelectorAll("button"), function (x) {
          if (x.textContent === item.bucket) x.classList.add("picked-right");
          x.disabled = true;
        });
        solved = true;
      }
      row.appendChild(btns);
      row.appendChild(fb);
      wrap.appendChild(row);
    });
    return wrap;
  }

  /* ================= spreadsheet interaction =================
     Behaves the way Excel and Google Sheets do, because that is what a
     learner's muscle memory expects. */
  var clipboard = { raw: "", from: null };

  LS.sheetKeys = function (e, api) {
    var input = api.input, sheet = api.sheet, inputs = api.inputs;
    var here = LS.cellAddr.parseAddr(input.dataset.addr);
    if (!here) return;
    var mod = e.ctrlKey || e.metaKey;

    function seek(dc, dr) {
      for (var i = 1; i <= 60; i++) {
        var c = here.c + dc * i, r = here.r + dr * i;
        if (c < 1 || r < 1) return null;
        if (c > sheet.cols + 2 && dc > 0) return null;
        if (r > sheet.rows + 2 && dr > 0) return null;
        var a = LS.cellAddr.addr(c, r);
        if (inputs[a]) return a;
      }
      return null;
    }
    function go(dc, dr) {
      var a = seek(dc, dr);
      if (!a) return false;
      api.commit(input); inputs[a].focus(); return true;
    }
    function setCell(addr, raw) {
      if (!inputs[addr]) return false;
      api.pushUndo();
      sheet.setRaw(addr, raw); api.save(addr, raw);
      inputs[addr].value = raw; api.refresh(); return true;
    }

    var k = e.key;
    if (mod && (k === "c" || k === "C")) {
      api.commit(input);
      clipboard = { raw: sheet.raw(input.dataset.addr), from: input.dataset.addr };
      api.say("Copied " + input.dataset.addr); e.preventDefault(); return;
    }
    if (mod && (k === "x" || k === "X")) {
      api.commit(input);
      clipboard = { raw: sheet.raw(input.dataset.addr), from: input.dataset.addr };
      setCell(input.dataset.addr, ""); api.say("Cut " + input.dataset.addr);
      e.preventDefault(); return;
    }
    if (mod && (k === "v" || k === "V")) {
      e.preventDefault();
      if (!clipboard.from) { api.say("Nothing copied yet — press Ctrl+C on a cell first."); return; }
      var src = LS.cellAddr.parseAddr(clipboard.from);
      var raw = LS.shiftFormula(clipboard.raw, here.c - src.c);
      raw = LS.shiftRows(raw, here.r - src.r);
      setCell(input.dataset.addr, raw);
      api.say("Pasted into " + input.dataset.addr + (raw ? ": " + raw : ""));
      return;
    }
    if (mod && (k === "d" || k === "D")) {
      e.preventDefault();
      var above = LS.cellAddr.addr(here.c, here.r - 1);
      if (!sheet.cell(above)) { api.say("Nothing above to fill from."); return; }
      var f = LS.shiftRows(sheet.raw(above), 1);
      setCell(input.dataset.addr, f); api.say("Filled down from " + above); return;
    }
    if (mod && (k === "r" || k === "R")) {
      e.preventDefault();
      var left = LS.cellAddr.addr(here.c - 1, here.r);
      if (!sheet.cell(left)) { api.say("Nothing to the left to fill from."); return; }
      var f2 = LS.shiftFormula(sheet.raw(left), 1);
      setCell(input.dataset.addr, f2); api.say("Filled right from " + left); return;
    }
    if (mod && (k === "z" || k === "Z")) { e.preventDefault(); api.undo(); return; }
    if (mod && (k === "y" || k === "Y")) { e.preventDefault(); api.redo(); return; }
    if ((k === "Delete" || k === "Backspace") && input.value === "") {
      e.preventDefault(); setCell(input.dataset.addr, ""); return;
    }
    if (k === "Tab") { e.preventDefault(); go(e.shiftKey ? -1 : 1, 0); return; }
    if (k === "Enter") {
      e.preventDefault();
      if (!go(0, e.shiftKey ? -1 : 1)) { api.commit(input); input.blur(); }
      return;
    }
    if (k === "Escape") {
      e.preventDefault();
      input.value = sheet.raw(input.dataset.addr); input.select(); return;
    }
    if (k === "F2") {
      e.preventDefault();
      var v = input.value; input.setSelectionRange(v.length, v.length); return;
    }
    var atStart = input.selectionStart === 0 && input.selectionEnd === 0;
    var atEnd = input.selectionStart === input.value.length && input.selectionEnd === input.value.length;
    var whole = input.selectionStart === 0 && input.selectionEnd === input.value.length;
    if (k === "ArrowDown") { e.preventDefault(); go(0, 1); }
    else if (k === "ArrowUp") { e.preventDefault(); go(0, -1); }
    else if (k === "ArrowRight" && (whole || atEnd || !input.value)) { e.preventDefault(); go(1, 0); }
    else if (k === "ArrowLeft" && (whole || atStart || !input.value)) { e.preventDefault(); go(-1, 0); }
  };

  // "Copy formula right" — the button that teaches what fill-right does.
  LS.copyRight = function (sheet, from, inputs) {
    var raw = sheet.raw(from);
    if (!raw || raw.charAt(0) !== "=") return null;
    var here = LS.cellAddr.parseAddr(from);
    var to = LS.cellAddr.addr(here.c + 1, here.r);
    if (!inputs[to]) return { addr: to, raw: raw, note: to + " isn't an editable cell — nothing to copy into." , skipped: true };
    var shifted = LS.shiftFormula(raw, 1);
    sheet.setRaw(to, shifted);
    inputs[to].value = shifted;
    return { addr: to, raw: shifted, note: from + " " + raw + "  →  " + to + " " + shifted + " (every column letter moved one across)" };
  };

  /* ================= the spreadsheet ================= */
  function renderSheet(cfg, ctx, itemId) {
    var sheet = new LS.Sheet(cfg);
    // restore saved work
    if (ctx) {
      var saved = store.lesson(ctx.lessonId).sheets[itemId] || {};
      Object.keys(saved).forEach(function (a) { sheet.setRaw(a, saved[a]); });
    }

    var block = el("section", "sheet-block");
    var head = el("div", "sheet-head");
    head.appendChild(el("span", "sheet-tag", "Build it"));
    head.appendChild(el("span", "sheet-title", esc(cfg.title || "Sandbox")));
    block.appendChild(head);
    if (cfg.hint) block.appendChild(el("p", "sheet-hint", cfg.hint));

    var fbar = el("div", "formula-bar");
    var fbAddr = el("span", "fb-addr", "—");
    var fbRaw = el("span", null, "");
    fbar.appendChild(fbAddr); fbar.appendChild(fbRaw);
    block.appendChild(fbar);

    var scroll = el("div", "sheet-scroll");
    var table = el("table", "sheet");
    table.setAttribute("role", "grid");
    var inputs = {}; // addr -> input element
    var selected = null;
    var undoStack = [], redoStack = [];
    function snapshot() { var s = {}; Object.keys(inputs).forEach(function (a) { s[a] = sheet.raw(a); }); return s; }
    function restore(s) {
      Object.keys(s).forEach(function (a) {
        sheet.setRaw(a, s[a]);
        if (ctx) store.saveCell(ctx.lessonId, itemId, a, s[a]);
        if (inputs[a]) inputs[a].value = s[a];
      });
      refreshDisplays();
    }
    function pushUndo() { undoStack.push(snapshot()); if (undoStack.length > 50) undoStack.shift(); redoStack = []; }

    // header row: corner + A B C ...
    var thr = el("tr");
    thr.appendChild(el("th", null, ""));
    for (var c = 1; c <= sheet.cols; c++) thr.appendChild(el("th", null, LS.cellAddr.numToCol(c)));
    var thead = el("thead"); thead.appendChild(thr); table.appendChild(thead);

    var tbody = el("tbody");
    for (var r = 1; r <= sheet.rows; r++) {
      var tr = el("tr");
      tr.appendChild(el("td", "rowhead", String(r)));
      for (var c2 = 1; c2 <= sheet.cols; c2++) {
        var a = LS.cellAddr.addr(c2, r);
        var cell = sheet.cell(a);
        var td = el("td");
        if (!cell) { td.className = "label-cell"; td.appendChild(el("span", "cell-static", "")); }
        else if (cell.ro) {
          if (cell.year) td.className = "year-cell";
          else if (cell.label) td.className = "label-cell";
          else td.className = "num-cell";
          td.appendChild(el("span", "cell-static", displayOf(sheet, a)));
        } else {
          var input = document.createElement("input");
          input.className = "cell-input";
          input.type = "text";
          input.autocomplete = "off";
          input.spellcheck = false;
          input.setAttribute("aria-label", "Cell " + a + rowContext(sheet, r));
          if (cell.ph) input.placeholder = cell.ph;
          input.dataset.addr = a;
          input.value = displayOf(sheet, a);
          bindCellEvents(input, td);
          inputs[a] = input;
          td.appendChild(input);
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    scroll.appendChild(table);
    block.appendChild(scroll);

    function rowContext(sheet, r) {
      var lbl = sheet.value("A" + r);
      return typeof lbl === "string" && lbl ? ", " + lbl : "";
    }
    function displayOf(sheet, a) {
      var v = sheet.value(a);
      if (v == null) return "";
      if (v && v.err) return v.err;
      var cell = sheet.cell(a);
      return fmt.cell(v, cell && cell.fmt);
    }
    function refreshDisplays() {
      Object.keys(inputs).forEach(function (a) {
        var input = inputs[a];
        if (document.activeElement === input) return;
        input.value = displayOf(sheet, a);
        var v = sheet.value(a);
        input.classList.toggle("cell-error", !!(v && v.err));
      });
      updateTie();
    }
    function commit(input) {
      var a = input.dataset.addr;
      var raw = input.value.trim();
      // if the user re-focused and saw the formatted value, don't treat re-blur as an edit
      if (raw === displayOf(sheet, a) && !input.dataset.dirty) return;
      pushUndo();
      sheet.setRaw(a, raw);
      if (ctx) store.saveCell(ctx.lessonId, itemId, a, raw);
      delete input.dataset.dirty;
      refreshDisplays();
      fbRaw.textContent = sheet.raw(a);
    }
    function bindCellEvents(input, td) {
      input.addEventListener("focus", function () {
        selected = input.dataset.addr;
        // Swap the pretty display for the editable raw text — but only if the
        // box still shows the display. Anything else means an edit is already
        // in flight and must not be clobbered.
        if (input.value === displayOf(sheet, selected)) {
          input.value = sheet.raw(selected);
          // Select it, so typing replaces the cell like a spreadsheet does.
          // A mouse click collapses this to a caret on mouseup, which is what
          // someone editing an existing formula wants.
          input.select();
        }
        fbAddr.textContent = selected;
        fbRaw.textContent = sheet.raw(selected);
        Array.prototype.forEach.call(tbody.querySelectorAll("td.cell-selected"), function (x) { x.classList.remove("cell-selected"); });
        td.classList.add("cell-selected");
      });
      input.addEventListener("input", function () { input.dataset.dirty = "1"; fbRaw.textContent = input.value; });
      input.addEventListener("blur", function () { commit(input); input.value = displayOf(sheet, input.dataset.addr); });
      input.addEventListener("keydown", function (e) {
        if (!LS.sheetKeys) return;
        LS.sheetKeys(e, {
          input: input, sheet: sheet, inputs: inputs, commit: commit,
          refresh: refreshDisplays,
          save: function (a, raw) { if (ctx) store.saveCell(ctx.lessonId, itemId, a, raw); },
          say: function (t) { msg.textContent = t; },
          pushUndo: pushUndo,
          undo: function () {
            if (!undoStack.length) { msg.textContent = "Nothing to undo."; return; }
            redoStack.push(snapshot()); restore(undoStack.pop()); msg.textContent = "Undone.";
          },
          redo: function () {
            if (!redoStack.length) { msg.textContent = "Nothing to redo."; return; }
            undoStack.push(snapshot()); restore(redoStack.pop()); msg.textContent = "Redone.";
          }
        });
      });
    }

    /* tie meter — one pair, or one row per projected year */
    var tieBox = null;
    function tiePairs() {
      if (!cfg.tie) return [];
      return cfg.tie.pairs || [{ a: cfg.tie.a, le: cfg.tie.le, label: null }];
    }
    function updateTie() {
      if (!cfg.tie || !tieBox) return;
      var pairs = tiePairs(), multi = !!cfg.tie.pairs;
      tieBox.innerHTML = "";
      var tiedCount = 0, live = 0;
      pairs.forEach(function (pr) {
        var A = sheet.value(pr.a), L = sheet.value(pr.le);
        var an = typeof A === "number" ? A : null, ln = typeof L === "number" ? L : null;
        var diff = (an != null && ln != null) ? an - ln : null;
        if (an != null && ln != null) live++;
        if (diff === 0 && an !== 0) tiedCount++;
        if (multi) {
          var row = el("div", "tie-row");
          row.appendChild(el("span", null, esc(pr.label || pr.a)));
          row.appendChild(el("span", null, diff == null ? "—" : (diff === 0 ? "ties ✓" : fmt.inr(diff) + " out")));
          tieBox.appendChild(row);
        } else {
          var r1 = el("div", "tie-row");
          r1.appendChild(el("span", null, esc(cfg.tie.aLabel || "Total assets")));
          r1.appendChild(el("span", null, an != null ? fmt.inr(an) : "—"));
          var r2 = el("div", "tie-row");
          r2.appendChild(el("span", null, esc(cfg.tie.leLabel || "Total liabilities + equity")));
          r2.appendChild(el("span", null, ln != null ? fmt.inr(ln) : "—"));
          tieBox.appendChild(r1); tieBox.appendChild(r2);
          var v1 = el("div", "tie-verdict");
          v1.appendChild(el("span", null, diff === 0 && an !== 0 ? "It ties ✓" : "Difference A − (L+E)"));
          v1.appendChild(el("span", "tie-badge", diff == null ? "—" : fmt.inr(diff)));
          tieBox.appendChild(v1);
        }
      });
      var allTied = tiedCount === pairs.length;
      if (multi) {
        var v = el("div", "tie-verdict");
        v.appendChild(el("span", null, allTied ? "Every year ties ✓" : "Years tying"));
        v.appendChild(el("span", "tie-badge", tiedCount + " / " + pairs.length));
        tieBox.appendChild(v);
      }
      tieBox.className = "tie-meter " + (allTied ? "tied" : "untied");
    }
    if (cfg.tie) {
      tieBox = el("div", "tie-meter untied");
      tieBox.setAttribute("aria-live", "polite");
      block.appendChild(tieBox);
      updateTie();
    }

    /* toolbar: check + copy-right + reset */
    var bar = el("div", "sheet-toolbar");
    var checkBtn = el("button", "btn btn-primary", "Check my sheet");
    checkBtn.type = "button";
    var resetBtn = el("button", "btn btn-ghost btn-small", "Reset");
    resetBtn.type = "button";
    var msg = el("span", "sheet-msg", "");
    bar.appendChild(checkBtn);
    // only worth offering where there is a column to copy into
    if (LS.copyRight && sheet.cols > 2) {
      var cpBtn = el("button", "btn btn-ghost btn-small", "Copy formula right →");
      cpBtn.type = "button";
      cpBtn.title = "Rewrites the selected cell's formula into the next column — what fill-right does in Excel";
      cpBtn.addEventListener("click", function () {
        if (!selected) { msg.textContent = "Select a formula cell first."; return; }
        var out = LS.copyRight(sheet, selected, inputs);
        if (out && !out.skipped && ctx) store.saveCell(ctx.lessonId, itemId, out.addr, out.raw);
        msg.textContent = out ? out.note : "Select a cell containing a formula, then copy it right.";
        refreshDisplays();
      });
      bar.appendChild(cpBtn);
    }
    bar.appendChild(resetBtn);
    bar.appendChild(msg);
    block.appendChild(bar);

    var legend = el("div", "sheet-shortcuts");
    legend.innerHTML = [
      "<span><kbd>Tab</kbd> next cell</span>", "<span><kbd>Enter</kbd> down</span>",
      "<span><kbd>F2</kbd> edit</span>", "<span><kbd>Ctrl</kbd>+<kbd>D</kbd> fill down</span>",
      "<span><kbd>Ctrl</kbd>+<kbd>R</kbd> fill right</span>",
      "<span><kbd>Ctrl</kbd>+<kbd>C</kbd>/<kbd>V</kbd> copy &amp; paste</span>",
      "<span><kbd>Ctrl</kbd>+<kbd>Z</kbd> undo</span>"
    ].join("");
    block.appendChild(legend);

    var results = el("ul", "check-results");
    results.setAttribute("aria-live", "polite");
    block.appendChild(results);

    checkBtn.addEventListener("click", function () {
      // commit any in-progress edit first
      if (document.activeElement && document.activeElement.classList && document.activeElement.classList.contains("cell-input")) {
        commit(document.activeElement);
      }
      var out = sheet.runChecks(cfg.checks || []);
      results.innerHTML = "";
      var allOk = out.length > 0;
      out.forEach(function (r) {
        var li = el("li", r.ok ? "ok" : "bad");
        li.appendChild(el("span", "ck-icon", r.ok ? "✓" : "✗"));
        li.appendChild(el("span", null, r.message + (!r.ok && r.detail ? " — " + esc(r.detail) : "")));
        results.appendChild(li);
        if (!r.ok) allOk = false;
        // colour the checked cell
        if (r.ok !== undefined && cfgCellOf(r, cfg)) {
          var inp = inputs[cfgCellOf(r, cfg)];
          if (inp) { inp.parentElement.classList.toggle("cell-ok", r.ok); inp.parentElement.classList.toggle("cell-bad", !r.ok); }
        }
      });
      if (allOk) {
        var li = el("li", "ok");
        li.appendChild(el("span", "ck-icon", "★"));
        li.appendChild(el("span", null, cfg.success || "All checks pass. On to the next lesson."));
        results.appendChild(li);
        if (ctx) { store.markItem(ctx.lessonId, itemId); buildSidebar(); if (ctx.onItemDone) ctx.onItemDone(); }
      }
    });
    function cfgCellOf(r, cfg) {
      var found = null;
      (cfg.checks || []).forEach(function (ck) { if (ck.message === r.message && ck.cell) found = ck.cell; });
      return found;
    }

    resetBtn.addEventListener("click", function () {
      if (ctx) store.clearSheet(ctx.lessonId, itemId);
      var fresh = renderSheet(cfg, ctx, itemId);
      block.parentNode.replaceChild(fresh, block);
    });

    refreshDisplays();
    return block;
  }

  /* ================= views ================= */
  var content = document.getElementById("main");

  function setMeta(title, desc) {
    document.title = title;
    var m = document.querySelector('meta[name="description"]');
    if (m && desc) m.setAttribute("content", desc);
  }

  function renderHome() {
    setMeta("FinStudio — Learn finance by building it",
      "Free, text-only finance school. Learn accounting, the three statements, ratios and modeling by building every number in a live spreadsheet.");
    var page = el("div", "page");
    var hero = el("div", "hero");
    hero.innerHTML =
      "<h1>Learn finance by building it.</h1>" +
      "<p>No videos. No sign-up. Short lessons that end in a live spreadsheet where <em>you</em> type the formula — and the balance sheet has to tie. Follow one café, " + esc(LS.C.name) + ", from its first invoice to a full valuation model.</p>";
    var cta = el("a", "btn btn-primary", "Start with lesson 1010 →");
    cta.href = "#/" + LS.manifest.modules[LS.manifest.levels[0].modules[0]].lessons[0];
    hero.appendChild(cta);
    page.appendChild(hero);

    page.appendChild(el("h2", null, "The syllabus"));
    page.appendChild(el("p", null, "Modules are numbered like a chart of accounts. Work top to bottom; every number you meet later is one you built earlier."));
    var cards = el("div", "module-cards");
    LS.manifest.levels.forEach(function (lv) {
      lv.modules.forEach(function (mc) {
        var m = LS.manifest.modules[mc];
        var prog = moduleProgress(mc);
        var a = el("a", "module-card");
        a.href = "#/module/" + mc;
        a.innerHTML = "<h3>" + esc(m.title) + "</h3><p>" + esc(m.blurb) + "</p>" +
          '<div class="progress-track"><div class="progress-fill" style="width:' + (prog.total ? Math.round(prog.done / prog.total * 100) : 0) + '%"></div></div>' +
          '<div class="mc-meta"><span>' + prog.done + "/" + prog.total + " lessons</span><span>~" + moduleMinutes(mc) + " min</span></div>";
        cards.appendChild(a);
      });
    });
    page.appendChild(cards);

    if (LS.reference) {
      page.appendChild(el("h2", null, "Reference"));
      page.appendChild(el("p", null, "Look things up without hunting through lessons: every statement line defined in two sentences, and every formula in the course on one page."));
      var refCards = el("div", "module-cards");
      Object.keys(LS.reference).forEach(function (rid) {
        var r = LS.reference[rid];
        var a = el("a", "module-card");
        a.href = "#/ref/" + rid;
        a.innerHTML = "<h3>" + esc(r.title) + "</h3><p>" + esc(r.lede) + "</p>";
        refCards.appendChild(a);
      });
      if (LS.glossary) {
        var ga2 = el("a", "module-card");
        ga2.href = "#/glossary";
        ga2.innerHTML = "<h3>Finance glossary</h3><p>Every term the course uses — " + LS.glossary.length +
          " of them — each explained in one plain sentence before the technical definition.</p>";
        refCards.appendChild(ga2);
      }
      page.appendChild(refCards);
    }

    page.appendChild(el("h2", null, "How it works"));
    page.appendChild(el("p", null, "Every lesson takes three to eight minutes: a definition, a formula, the café's real numbers, then a spreadsheet where you build the figure yourself. The sandbox checks your work and — where the point of the lesson is the formula — refuses to accept a hardcoded number. Progress is saved in your browser; nothing is sent anywhere, and there is no account to make."));

    content.innerHTML = "";
    content.appendChild(page);
  }

  function renderModule(code) {
    var m = LS.manifest.modules[code];
    if (!m) return renderHome();
    setMeta(m.title + " · FinStudio", m.blurb);
    var page = el("div", "page");
    page.appendChild(el("p", "lesson-kicker", "Course module"));
    page.appendChild(el("h1", null, esc(m.title)));
    page.appendChild(el("p", "lesson-lede", esc(m.blurb)));
    var prog = moduleProgress(code);
    var track = el("div", "progress-track");
    track.appendChild(el("div", "progress-fill")).style.width = (prog.total ? Math.round(prog.done / prog.total * 100) : 0) + "%";
    page.appendChild(track);
    page.appendChild(el("p", "sheet-msg", prog.done + " of " + prog.total + " lessons done · about " + moduleMinutes(code) + " minutes of reading & building"));
    var ul = el("ul", "lesson-list");
    m.lessons.forEach(function (id) {
      var lesson = LS.lessons[id];
      var li = el("li"), a = el("a");
      a.href = "#/" + id;
      a.innerHTML = "<span>" + esc(lesson.title) + "</span>" +
        (store.isDone(id) ? '<span class="ll-done">✓</span>' : "") +
        '<span class="ll-min">' + (lesson.minutes || 4) + " min</span>";
      li.appendChild(a);
      ul.appendChild(li);
    });
    page.appendChild(ul);
    if (LS.quizzes && LS.quizzes[code]) {
      var qa = el("a", "btn btn-ghost", "Take the module quiz →");
      qa.href = "#/quiz/" + code;
      page.appendChild(qa);
    }
    content.innerHTML = "";
    content.appendChild(page);
  }

  function renderLesson(id) {
    var lesson = LS.lessons[id];
    if (!lesson) return renderHome();
    setMeta(lesson.title + " · FinStudio", lesson.desc || lesson.lede || "");
    var ctx = { lessonId: id, onItemDone: null };
    var page = el("div", "page");
    var mc = moduleOf(id);
    var kicker;
    if (mc && LS.manifest.modules[mc]) {
      kicker = '<a href="#/module/' + mc + '">' + esc(LS.manifest.modules[mc].title) + "</a>";
    } else {
      var loc = conceptLocation(id);
      kicker = loc
        ? esc("Level " + loc.level.level + " · " + loc.module.title)
        : esc("FinStudio");
    }
    page.appendChild(el("p", "lesson-kicker",
      kicker + ' <span class="kicker-min">· ' + (lesson.minutes || 4) + " min</span>"));
    page.appendChild(el("h1", null, esc(lesson.title)));
    if (lesson.lede) page.appendChild(el("p", "lesson-lede", lesson.lede));

    /* If this lesson is due for review, ask for recall before the learner reads
       the answer again. Retrieval practice beats re-reading. */
    (function reviewBanner() {
      var DAY = 86400000;
      var intervals = [7 * DAY, 30 * DAY, 90 * DAY];
      var done = store.completedAt(id);
      var n = store.reviewCount(id);
      if (!done || n >= intervals.length) return;
      var since = store.lastReviewed(id) || done;
      if (Date.now() - since < intervals[n]) return;

      var box = el("div", "review-banner");
      box.innerHTML = '<p class="review-banner-label">Review</p>' +
        "<p>Before scrolling: say the core idea of this lesson out loud, and one number " +
        "from its example. Then read on and check yourself.</p>";
      var btn = el("button", "review-done-btn", "I have recalled it \u2014 mark reviewed");
      btn.addEventListener("click", function () {
        store.markReviewed(id);
        box.innerHTML = '<p class="review-banner-label">Reviewed</p><p>Next review scheduled. ' +
          "Spacing is what turns reading into remembering.</p>";
      });
      box.appendChild(btn);
      page.appendChild(box);
    })();

    /* A diagram where the concept is structural rather than numerical. */
    if (LS.diagrams) {
      var d = LS.diagrams.forLesson(id);
      if (d) {
        var dbox = el("figure", "lesson-diagram");
        dbox.innerHTML = d.svg + '<figcaption>' + esc(d.caption) + "</figcaption>";
        page.appendChild(dbox);
      }
    }

    /* Before you start: the concepts this lesson assumes, so nobody hits an
       explanation that silently depends on something they haven't read. */
    if (LS.learningGraph) {
      var pre = LS.learningGraph.prerequisitesFor(id);
      if (pre.length) {
        var pbox = el("div", "prereq-box");
        var links = pre.map(function (x) {
          var done = store.isDone(x.id) ? ' <span class="prereq-done">\u2713</span>' : "";
          return '<a href="#/' + x.id + '">' + esc(x.title) + "</a>" + done;
        }).join('<span class="prereq-sep">·</span>');
        pbox.innerHTML = '<span class="prereq-label">Before you start</span>' +
          '<span class="prereq-links">' + links + "</span>";
        page.appendChild(pbox);
      }
    }

    (lesson.body || []).forEach(function (b, i) {
      var fn = blockRenderers[b.t];
      if (fn) page.appendChild(fn(b, ctx, i));
    });

    // share card — appears as soon as the capstone's checks all pass
    if (LS.shareCard && lesson.share) {
      var card = LS.shareCard(lesson, sheetsDone(lesson));
      page.appendChild(card);
      ctx.onItemDone = function () {
        var fresh = LS.shareCard(lesson, sheetsDone(lesson));
        if (card.parentNode) card.parentNode.replaceChild(fresh, card);
        card = fresh;
      };
    }

    // prev/next
    /* Where this fits: the chain of concepts this lesson belongs to, with the
       current step marked. Answers "why am I learning this?" without adding a
       new navigation system. */
    if (LS.learningGraph) {
      var chain = LS.learningGraph.chainFor(id);
      if (chain) {
        var cbox = el("div", "chain-box");
        var inner = '<p class="chain-label">' + esc(chain.label) + "</p><div class=\"chain-steps\">";
        chain.steps.forEach(function (stepItem, si) {
          if (si) inner += '<span class="chain-arrow" aria-hidden="true">\u2192</span>';
          inner += stepItem.current
            ? '<span class="chain-step is-current" aria-current="step">' + esc(stepItem.title) + "</span>"
            : '<a class="chain-step" href="#/' + stepItem.id + '">' + esc(stepItem.title) + "</a>";
        });
        inner += "</div>";
        cbox.innerHTML = inner;
        page.appendChild(cbox);
      }
    }

    var order = allLessonIdsInOrder();
    var at = order.indexOf(id);
    /* all-topic-routes.js republishes each lesson under a topic-l<level>-... id
       and overwrites topic.id. The reading order is built from the canonical
       `cid`, so map a republished id back to it and Previous/Next keeps working
       on both URLs. */
    if (at < 0 && LS.curriculumMap) {
      LS.curriculumMap.forEach(function (lv) {
        lv.modules.forEach(function (mod) {
          mod.topics.forEach(function (t) {
            if (at < 0 && t.id === id && t.cid) at = order.indexOf(t.cid);
          });
        });
      });
    }
    var nav = el("div", "lesson-nav");
    var prev = el("span"), next = el("span");
    if (at > 0) {
      var p = LS.lessons[order[at - 1]];
      prev.innerHTML = '<a href="#/' + order[at - 1] + '"><span class="nav-label">← Previous</span>' + esc(p.short || p.title) + "</a>";
    }
    if (at >= 0 && at < order.length - 1) {
      var n = LS.lessons[order[at + 1]];
      next.innerHTML = '<a href="#/' + order[at + 1] + '" style="text-align:right;display:block"><span class="nav-label">Next →</span>' + esc(n.short || n.title) + "</a>";
    }
    nav.appendChild(prev); nav.appendChild(next);
    page.appendChild(nav);

    content.innerHTML = "";
    content.appendChild(page);
    if (LS.autoLinkGlossary) LS.autoLinkGlossary(page);
  }

  /* ================= router ================= */
  function currentRoute() {
    var h = location.hash.replace(/^#\/?/, "");
    if (!h) return { kind: "home" };
    var parts = h.split("/");
    if (parts[0] === "module" && parts[1]) return { kind: "module", id: parts[1] };
    if (parts[0] === "quiz" && parts[1]) return { kind: "quiz", id: parts[1] };
    if (parts[0] === "ref" && parts[1]) return { kind: "ref", id: parts[1] };
    if (parts[0] === "glossary") return { kind: "glossary" };
    return { kind: "lesson", id: parts[0] };
  }

  function route() {
    var r = currentRoute();
    if (r.kind === "module") renderModule(r.id);
    else if (r.kind === "quiz" && LS.renderQuiz) LS.renderQuiz(r.id, content);
    else if (r.kind === "ref" && LS.renderRef) LS.renderRef(r.id, content);
    else if (r.kind === "glossary" && LS.renderGlossary) LS.renderGlossary(content);
    else if (r.kind === "lesson" && LS.lessons[r.id]) renderLesson(r.id);
    else renderHome();
    buildSidebar();
    closeNav();
    content.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  /* mobile nav */
  var sidebar = document.getElementById("sidebar");
  var scrim = document.getElementById("sidebarScrim");
  var toggle = document.getElementById("navToggle");
  function closeNav() {
    sidebar.classList.remove("open");
    scrim.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function () {
    var open = sidebar.classList.toggle("open");
    scrim.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (open) {
      var first = sidebar.querySelector("a");
      if (first) first.focus();
    }
  });
  scrim.addEventListener("click", closeNav);

  /* Hide the header on scroll down, bring it back on scroll up.
     - Always visible in the top 120px, so the page never opens headerless.
     - An 8px threshold stops trackpad jitter from flapping the header.
     - Reads are batched into rAF so the listener never forces layout.
     - Never hides while the mobile syllabus drawer is open, which would leave
       the drawer floating under a missing header. */
  (function headerOnScroll() {
    var bar = document.getElementById("topbar");
    if (!bar) return;
    var lastY = window.pageYOffset || 0;
    var ticking = false;
    var TOP_ZONE = 120;
    var THRESHOLD = 8;

    function update() {
      ticking = false;
      var y = window.pageYOffset || 0;
      var delta = y - lastY;
      if (Math.abs(delta) < THRESHOLD) return;
      if (y <= TOP_ZONE || sidebar.classList.contains("open")) {
        document.body.classList.remove("header-hidden");
      } else if (delta > 0) {
        document.body.classList.add("header-hidden");
      } else {
        document.body.classList.remove("header-hidden");
      }
      lastY = y;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });

    // Opening the drawer or following a link must not leave the header hidden.
    toggle.addEventListener("click", function () {
      document.body.classList.remove("header-hidden");
    });
    window.addEventListener("hashchange", function () {
      document.body.classList.remove("header-hidden");
      lastY = 0;
    });
  })();
  // Escape closes the mobile syllabus and returns focus to the toggle, so
  // keyboard users aren't stranded inside it.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sidebar.classList.contains("open")) {
      closeNav();
      toggle.focus();
    }
  });

  window.addEventListener("hashchange", route);
  // expose bits the LX layer (quizzes/reference/share) reuses
  LS.ui = { el: el, esc: esc, renderMCQ: renderMCQ, buildSidebar: buildSidebar, setMeta: setMeta, moduleProgress: moduleProgress };
  route();
})();
