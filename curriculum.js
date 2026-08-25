/* ============================================================================
   FinStudio curriculum engine
   ----------------------------------------------------------------------------
   Lessons are data (§40). Everything the brief asks for on top of them — the
   skill tree (§19), prerequisite warnings (§41), progress rollups (§18), career
   paths (§46), search (§20), "what next" (§6) — is derived from that data
   rather than authored separately. Add a lesson and all of it updates.

   Headless. window.FinCurriculum in the browser, globalThis under node.
   ========================================================================= */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.FinCurriculum = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  /* ======================================================================
     Schema
     ---------------------------------------------------------------------
     Validation is strict on the things that silently break the product
     (a prerequisite pointing at nothing, a lesson with no practice) and
     quiet about everything else, so authoring stays pleasant.
     =================================================================== */
  var LEVELS = [
    { id: 0,  key: "foundations",  title: "Finance foundations" },
    { id: 1,  key: "accounting",   title: "Accounting foundations" },
    { id: 2,  key: "statements",   title: "Financial statements" },
    { id: 3,  key: "analysis",     title: "Financial analysis" },
    { id: 4,  key: "modeling",     title: "Financial modelling" },
    { id: 5,  key: "valuation",    title: "Valuation" },
    { id: 6,  key: "ib",           title: "Investment banking" },
    { id: 7,  key: "pe",           title: "Private equity & LBO" },
    { id: 8,  key: "research",     title: "Equity research & investing" },
    { id: 9,  key: "markets",      title: "Markets" },
    { id: 10, key: "advanced",     title: "Advanced finance" }
  ];
  var DIFFICULTY = ["beginner", "intermediate", "advanced", "expert"];

  function validate(lesson, index) {
    var problems = [];
    function need(field) {
      if (lesson[field] == null || lesson[field] === "") problems.push("missing " + field);
    }
    need("id"); need("title"); need("level");

    if (lesson.level != null && !LEVELS.some(function (l) { return l.key === lesson.level; })) {
      problems.push("unknown level: " + lesson.level);
    }
    if (lesson.difficulty && DIFFICULTY.indexOf(lesson.difficulty) < 0) {
      problems.push("unknown difficulty: " + lesson.difficulty);
    }
    (lesson.prerequisites || []).forEach(function (p) {
      if (index && !index[p]) problems.push("prerequisite not found: " + p);
    });
    (lesson.relatedTopics || []).forEach(function (r) {
      if (index && !index[r]) problems.push("related topic not found: " + r);
    });

    // The rule that makes this a learning platform rather than a set of
    // articles: §11 says no topic may ship as explanation alone.
    var practice = lesson.practice || [];
    if (!practice.length) problems.push("no practice problems — every topic needs at least one");
    practice.forEach(function (q, i) {
      if (!q.type) problems.push("practice[" + i + "] has no type");
      if (!q.prompt) problems.push("practice[" + i + "] has no prompt");
    });
    if (lesson.estimatedTime != null && typeof lesson.estimatedTime !== "number") {
      problems.push("estimatedTime should be minutes as a number");
    }
    return { id: lesson.id, ok: problems.length === 0, problems: problems };
  }

  /* ======================================================================
     Curriculum
     =================================================================== */
  function Curriculum(lessons) {
    this.lessons = [];
    this.index = {};
    (lessons || []).forEach(this.add, this);
  }

  Curriculum.prototype.add = function (lesson) {
    if (this.index[lesson.id]) throw new Error("Duplicate lesson id: " + lesson.id);
    this.lessons.push(lesson);
    this.index[lesson.id] = lesson;
    return lesson;
  };

  Curriculum.prototype.get = function (id) { return this.index[id] || null; };

  Curriculum.prototype.validateAll = function () {
    var self = this;
    return this.lessons.map(function (l) { return validate(l, self.index); });
  };

  Curriculum.prototype.byLevel = function (levelKey) {
    return this.lessons.filter(function (l) { return l.level === levelKey; });
  };

  Curriculum.prototype.levels = function () {
    var self = this;
    return LEVELS.filter(function (lv) { return self.byLevel(lv.key).length; })
      .map(function (lv) {
        return { id: lv.id, key: lv.key, title: lv.title, lessons: self.byLevel(lv.key) };
      });
  };

  /* ---- prerequisite graph (§19, §41) ---- */
  Curriculum.prototype.prerequisites = function (id) {
    var l = this.get(id);
    return l ? (l.prerequisites || []).slice() : [];
  };

  // Everything upstream, deduplicated, in dependency order.
  Curriculum.prototype.prerequisiteChain = function (id) {
    var self = this, out = [], seen = {};
    (function walk(x) {
      (self.prerequisites(x) || []).forEach(function (p) {
        if (seen[p]) return;
        seen[p] = true;
        walk(p);
        out.push(p);
      });
    })(id);
    return out;
  };

  Curriculum.prototype.unlocks = function (id) {
    return this.lessons
      .filter(function (l) { return (l.prerequisites || []).indexOf(id) >= 0; })
      .map(function (l) { return l.id; });
  };

  // A cycle in prerequisites makes the skill tree unrenderable and the
  // recommendation loop infinite. Catch it at author time.
  Curriculum.prototype.findCycles = function () {
    var self = this, state = {}, cycles = [];
    function walk(id, stack) {
      if (state[id] === "done") return;
      if (state[id] === "open") { cycles.push(stack.slice(stack.indexOf(id)).concat(id)); return; }
      state[id] = "open";
      self.prerequisites(id).forEach(function (p) {
        if (self.index[p]) walk(p, stack.concat(id));
      });
      state[id] = "done";
    }
    this.lessons.forEach(function (l) { walk(l.id, []); });
    return cycles;
  };

  // Topological order — the sequence a learner could follow with nothing
  // ever arriving before its prerequisites.
  Curriculum.prototype.learningOrder = function () {
    var self = this, out = [], mark = {};
    function visit(id) {
      if (mark[id]) return;
      mark[id] = true;
      self.prerequisites(id).forEach(function (p) { if (self.index[p]) visit(p); });
      out.push(id);
    }
    // stable: walk levels in order, lessons in authored order
    LEVELS.forEach(function (lv) {
      self.byLevel(lv.key).forEach(function (l) { visit(l.id); });
    });
    this.lessons.forEach(function (l) { visit(l.id); });
    return out;
  };

  /* ---- search (§20) ---- */
  Curriculum.prototype.search = function (query, limit) {
    var q = String(query || "").trim().toLowerCase();
    if (!q) return [];
    var terms = q.split(/\s+/);
    var hits = [];
    this.lessons.forEach(function (l) {
      var hay = {
        title: String(l.title || "").toLowerCase(),
        tags: (l.tags || []).join(" ").toLowerCase(),
        summary: String(l.summary || l.desc || "").toLowerCase()
      };
      var score = 0;
      terms.forEach(function (t) {
        if (hay.title === t) score += 12;
        else if (hay.title.indexOf(t) === 0) score += 8;
        else if (hay.title.indexOf(t) >= 0) score += 6;
        if (hay.tags.indexOf(t) >= 0) score += 4;
        if (hay.summary.indexOf(t) >= 0) score += 1;
      });
      if (score > 0) {
        hits.push({
          id: l.id, title: l.title, level: l.level, score: score,
          // §20 wants each result to offer the whole loop, not just the article
          learn: l.id,
          practice: (l.practice || []).length ? l.id + "#practice" : null,
          build: l.sandbox ? l.id + "#build" : null,
          related: (l.relatedTopics || []).slice(0, 4)
        });
      }
    });
    return hits.sort(function (a, b) { return b.score - a.score; }).slice(0, limit || 10);
  };

  /* ======================================================================
     Progress (§18)
     =================================================================== */
  function Progress(store) {
    this.data = store || {};          // id -> { concept, practice, modeling, seen }
  }
  Progress.prototype.record = function (lessonId, mastery) {
    var d = this.data[lessonId] || (this.data[lessonId] = { seen: false });
    d.seen = true;
    ["concept", "practice", "modeling"].forEach(function (t) {
      if (mastery && mastery[t] != null) {
        d[t] = Math.max(d[t] == null ? 0 : d[t], mastery[t]);
      }
    });
    return d;
  };
  Progress.prototype.markSeen = function (lessonId) {
    var d = this.data[lessonId] || (this.data[lessonId] = {});
    d.seen = true;
    return d;
  };
  Progress.prototype.of = function (lessonId) { return this.data[lessonId] || null; };

  // "Complete" means the tracks a lesson actually offers are all above the bar —
  // a lesson with no sandbox is not held open forever waiting for a modelling score.
  Progress.prototype.isComplete = function (lesson, bar) {
    var d = this.data[lesson.id];
    if (!d) return false;
    var b = bar == null ? 0.8 : bar;
    var tracks = tracksOffered(lesson);
    if (!tracks.length) return !!d.seen;
    return tracks.every(function (t) { return (d[t] || 0) >= b; });
  };

  function tracksOffered(lesson) {
    var P = root_FinPractice();
    var set = {};
    (lesson.practice || []).forEach(function (q) {
      set[P ? P.trackOf(q) : "concept"] = true;
    });
    if (lesson.sandbox) set.modeling = true;
    return Object.keys(set);
  }
  function root_FinPractice() {
    return (typeof globalThis !== "undefined" && globalThis.FinPractice) || null;
  }

  Progress.prototype.levelSummary = function (curriculum, bar) {
    var self = this;
    return curriculum.levels().map(function (lv) {
      var done = lv.lessons.filter(function (l) { return self.isComplete(l, bar); }).length;
      var tracks = { concept: [], practice: [], modeling: [] };
      lv.lessons.forEach(function (l) {
        var d = self.data[l.id];
        tracksOffered(l).forEach(function (t) { tracks[t].push((d && d[t]) || 0); });
      });
      function avg(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : null; }
      return {
        key: lv.key, title: lv.title,
        done: done, total: lv.lessons.length,
        pct: lv.lessons.length ? done / lv.lessons.length : 0,
        concept: avg(tracks.concept), practice: avg(tracks.practice), modeling: avg(tracks.modeling)
      };
    });
  };

  /* ---- "Recommended before starting" (§41) — advisory, never a gate ---- */
  Curriculum.prototype.readiness = function (lessonId, progress, bar) {
    var self = this;
    var l = this.get(lessonId);
    if (!l) return null;
    var items = (l.prerequisites || []).map(function (p) {
      var pre = self.get(p);
      return {
        id: p,
        title: pre ? pre.title : p,
        met: pre ? progress.isComplete(pre, bar) : false
      };
    });
    return {
      id: lessonId,
      ready: items.every(function (i) { return i.met; }),
      prerequisites: items,
      // the brief is explicit: warn, then let them through anyway
      blocking: false
    };
  };

  /* ---- what to do next (§6) ---- */
  Curriculum.prototype.recommend = function (progress, opts) {
    opts = opts || {};
    var self = this;
    var order = opts.path ? this.pathLessons(opts.path) : this.learningOrder();

    // 1. a lesson already started but not finished beats anything new
    var resume = null;
    for (var i = 0; i < order.length; i++) {
      var l = this.get(order[i]);
      if (!l) continue;
      var d = progress.of(l.id);
      if (d && d.seen && !progress.isComplete(l, opts.bar)) { resume = l; break; }
    }

    // 2. otherwise the first unstarted lesson whose prerequisites are met
    var next = null, nextUnready = null;
    for (var j = 0; j < order.length; j++) {
      var m = this.get(order[j]);
      if (!m || progress.isComplete(m, opts.bar)) continue;
      if (progress.of(m.id) && progress.of(m.id).seen) continue;
      var r = this.readiness(m.id, progress, opts.bar);
      if (r.ready) { next = m; break; }
      if (!nextUnready) nextUnready = m;
    }

    var pick = resume || next || nextUnready || null;
    if (!pick) return null;
    return {
      lesson: pick,
      reason: resume ? "resume" : next ? "next" : "next-with-gaps",
      readiness: this.readiness(pick.id, progress, opts.bar),
      minutes: pick.estimatedTime || null
    };
  };

  /* ======================================================================
     Career paths (§46)
     =================================================================== */
  var PATHS = {
    "investment-banking": {
      title: "Investment banking",
      blurb: "Accounting through modelling, valuation, M&A and LBO.",
      levels: ["accounting", "statements", "analysis", "modeling", "valuation", "ib", "pe"]
    },
    "private-equity": {
      title: "Private equity",
      blurb: "Analysis and valuation, then leveraged buyouts and returns.",
      levels: ["statements", "analysis", "valuation", "pe"]
    },
    "equity-research": {
      title: "Equity research",
      blurb: "Statements, modelling and valuation in service of a view.",
      levels: ["statements", "analysis", "modeling", "valuation", "research"]
    },
    "corporate-finance": {
      title: "Corporate finance & FP&A",
      blurb: "Accounting, forecasting and business planning.",
      levels: ["accounting", "statements", "analysis", "modeling"]
    },
    "investing": {
      title: "Investing",
      blurb: "Markets, analysis and valuation for your own decisions.",
      levels: ["foundations", "statements", "analysis", "valuation", "markets", "research"]
    },
    "foundations": {
      title: "I'm starting from zero",
      blurb: "What money, businesses and financial statements actually are.",
      levels: ["foundations", "accounting", "statements"]
    }
  };

  Curriculum.prototype.paths = function () {
    var self = this;
    return Object.keys(PATHS).map(function (k) {
      return {
        key: k, title: PATHS[k].title, blurb: PATHS[k].blurb,
        lessons: self.pathLessons(k).length
      };
    });
  };

  Curriculum.prototype.pathLessons = function (pathKey) {
    var spec = PATHS[pathKey];
    if (!spec) return [];
    var self = this, want = {}, out = [];
    // every lesson in the path's levels, plus whatever those depend on
    var order = this.learningOrder();
    this.lessons.forEach(function (l) {
      if (spec.levels.indexOf(l.level) < 0) return;
      want[l.id] = true;
      self.prerequisiteChain(l.id).forEach(function (p) { want[p] = true; });
    });
    order.forEach(function (id) { if (want[id]) out.push(id); });
    return out;
  };

  /* ---- onboarding (§48) -> a path ---- */
  function pathFor(answers) {
    var goal = (answers && answers.goal) || "";
    var direct = {
      "investment banking": "investment-banking",
      "private equity": "private-equity",
      "equity research": "equity-research",
      "corporate finance": "corporate-finance",
      "investing": "investing",
      "accounting": "corporate-finance",
      "financial modeling": "investment-banking",
      "financial modelling": "investment-banking",
      "valuation": "equity-research"
    }[String(goal).toLowerCase()];
    if ((answers && answers.experience) === "beginner" && !direct) return "foundations";
    return direct || "foundations";
  }

  return {
    Curriculum: Curriculum, Progress: Progress,
    validate: validate, LEVELS: LEVELS, DIFFICULTY: DIFFICULTY,
    PATHS: PATHS, pathFor: pathFor, tracksOffered: tracksOffered
  };
});
