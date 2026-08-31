/* ============================================================================
   FinStudio v2 lesson renderer
   ----------------------------------------------------------------------------
   Renders a lesson object through the whole loop — LEARN, SEE, TRY, PRACTICE,
   BUILD, CHECK, APPLY, MASTER — and builds an interactive widget for each of
   the practice question types. Grading is delegated to js/learn/practice.js so
   the browser and the test suite score identically.
   ========================================================================= */
(function () {
  "use strict";
  var P = window.FinPractice, S = window.FinSheets;
  var LS = window.LS = window.LS || {};
  if (!P) return;

  function el(t, c, x) { var n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (m) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]; }); }
  function money(v) { return S ? S.formatValue(v, { type: "currency", currency: "inr" }) : String(v); }

  /* ======================================================================
     Practice widgets
     =================================================================== */
  function feedback(box, r) {
    box.innerHTML = "";
    var cls = r.ok ? "ok" : r.partial ? "partial" : "bad";
    var n = el("div", "q-feedback " + cls);
    n.appendChild(el("strong", null, r.ok ? "Correct." : r.partial ? "Partly there." : "Not quite."));
    if (r.feedback) n.appendChild(el("p", null, r.feedback));
    box.appendChild(n);
  }

  var WIDGETS = {
    numeric: function (q, onAnswer) {
      var w = el("div", "q-answer");
      var inp = el("input", "q-input"); inp.type = "text";
      inp.placeholder = "Your answer";
      inp.setAttribute("aria-label", "Your answer");
      var btn = el("button", "btn btn-primary btn-small", "Check");
      btn.type = "button";
      btn.onclick = function () { onAnswer(inp.value); };
      inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { onAnswer(inp.value); e.preventDefault(); } });
      w.appendChild(inp); w.appendChild(btn);
      return w;
    },
    formula: function (q, onAnswer) {
      var w = el("div", "q-answer");
      var inp = el("input", "q-input q-mono"); inp.type = "text"; inp.placeholder = "=";
      var btn = el("button", "btn btn-primary btn-small", "Check"); btn.type = "button";
      btn.onclick = function () { onAnswer(inp.value); };
      inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { onAnswer(inp.value); e.preventDefault(); } });
      w.appendChild(inp); w.appendChild(btn);
      return w;
    },
    mcq: function (q, onAnswer) {
      var w = el("div", "q-opts");
      q.options.forEach(function (o, i) {
        var b = el("button", "q-opt", o.text); b.type = "button";
        b.onclick = function () {
          if (w.dataset.locked) return;
          w.dataset.locked = "1";
          Array.prototype.forEach.call(w.children, function (c) { c.disabled = true; });
          b.classList.add(o.correct ? "picked-right" : "picked-wrong");
          onAnswer(i);
        };
        w.appendChild(b);
      });
      return w;
    },
    multi: function (q, onAnswer) {
      var w = el("div", "q-opts"), picked = {};
      q.options.forEach(function (o, i) {
        var b = el("button", "q-opt", o.text); b.type = "button";
        b.onclick = function () { picked[i] = !picked[i]; b.classList.toggle("picked", !!picked[i]); };
        w.appendChild(b);
      });
      var go = el("button", "btn btn-primary btn-small", "Check"); go.type = "button";
      go.onclick = function () { onAnswer(Object.keys(picked).filter(function (k) { return picked[k]; }).map(Number)); };
      w.appendChild(go);
      return w;
    },
    match: function (q, onAnswer) {
      var w = el("div", "q-match"), answers = {};
      var rights = [];
      q.pairs.forEach(function (p) { if (rights.indexOf(p.right) < 0) rights.push(p.right); });
      q.pairs.forEach(function (p) {
        var row = el("div", "q-match-row");
        row.appendChild(el("span", "q-match-left", p.left));
        var sel = el("select", "q-select");
        sel.setAttribute("aria-label", p.left);
        sel.appendChild(el("option", null, "—"));
        rights.forEach(function (r) { sel.appendChild(el("option", null, r)); });
        sel.onchange = function () { answers[p.left] = sel.value; };
        row.appendChild(sel);
        w.appendChild(row);
      });
      var go = el("button", "btn btn-primary btn-small", "Check"); go.type = "button";
      go.onclick = function () { onAnswer(answers); };
      w.appendChild(go);
      return w;
    },
    order: function (q, onAnswer) {
      var w = el("div", "q-order"), chosen = [];
      var pool = q.sequence.slice().sort(function () { return Math.random() - 0.5; });
      var slots = el("ol", "q-order-slots");
      var bank = el("div", "q-order-bank");
      function redraw() {
        slots.innerHTML = "";
        chosen.forEach(function (t, i) {
          var li = el("li", "q-order-item", t);
          li.onclick = function () { chosen.splice(i, 1); pool.push(t); redraw(); };
          slots.appendChild(li);
        });
        bank.innerHTML = "";
        pool.forEach(function (t, i) {
          var b = el("button", "q-order-chip", t); b.type = "button";
          b.onclick = function () { pool.splice(i, 1); chosen.push(t); redraw(); };
          bank.appendChild(b);
        });
      }
      redraw();
      w.appendChild(el("p", "q-order-help", "Click them into order, top first."));
      w.appendChild(slots); w.appendChild(bank);
      var go = el("button", "btn btn-primary btn-small", "Check"); go.type = "button";
      go.onclick = function () { onAnswer(chosen); };
      w.appendChild(go);
      return w;
    },
    scenario: function (q, onAnswer) {
      var w = el("div", "q-scenario"), answers = {};
      q.rows.forEach(function (row) {
        var r = el("div", "q-scenario-row");
        r.appendChild(el("span", "q-scenario-label", row.label));
        var group = el("div", "q-scenario-btns");
        [["up", "↑ up"], ["none", "no change"], ["down", "↓ down"]].forEach(function (opt) {
          var b = el("button", "q-chip", opt[1]); b.type = "button";
          b.onclick = function () {
            answers[row.label] = opt[0];
            Array.prototype.forEach.call(group.children, function (c) { c.classList.remove("picked"); });
            b.classList.add("picked");
          };
          group.appendChild(b);
        });
        r.appendChild(group);
        w.appendChild(r);
      });
      var go = el("button", "btn btn-primary btn-small", "Check"); go.type = "button";
      go.onclick = function () { onAnswer(answers); };
      w.appendChild(go);
      return w;
    },
    interpretation: function (q, onAnswer) {
      var w = el("div", "q-answer q-answer-long");
      var ta = el("textarea", "q-textarea");
      ta.rows = 3; ta.placeholder = "A sentence or two is enough.";
      ta.setAttribute("aria-label", "Your explanation");
      var btn = el("button", "btn btn-primary btn-small", "Check"); btn.type = "button";
      btn.onclick = function () { onAnswer(ta.value); };
      w.appendChild(ta); w.appendChild(btn);
      return w;
    },
    debug: function (q, onAnswer) {
      var w = el("div", "q-answer");
      var inp = el("input", "q-input q-mono"); inp.type = "text"; inp.placeholder = "e.g. B12";
      inp.setAttribute("aria-label", "The broken cell");
      var btn = el("button", "btn btn-primary btn-small", "Check"); btn.type = "button";
      btn.onclick = function () { onAnswer(inp.value); };
      inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { onAnswer(inp.value); e.preventDefault(); } });
      w.appendChild(inp); w.appendChild(btn);
      return w;
    }
  };

  function renderQuestion(q, index) {
    var box = el("div", "q-block");
    box.dataset.qid = q.id || ("q" + index);
    var meta = el("div", "q-meta");
    if (q.tier) meta.appendChild(el("span", "q-tier q-tier-" + q.tier, q.tier));
    meta.appendChild(el("span", "q-type", q.type));
    box.appendChild(meta);
    box.appendChild(el("p", "q-prompt", q.prompt));

    var attempt = new P.Attempt(q);
    var fb = el("div", "q-fb");
    var widget = (WIDGETS[q.type] || WIDGETS.numeric)(q, function (answer) {
      var r = attempt.submit(answer, { sheets: S });
      feedback(fb, r);
      if (!r.ok) updateHintButton();
    });
    box.appendChild(widget);

    var hints = el("div", "q-hints");
    var hintBtn = null;
    function updateHintButton() {
      if (!(q.hints || []).length && !q.solution) return;
      if (!hintBtn) {
        hintBtn = el("button", "q-hint-btn", "Give me a hint");
        hintBtn.type = "button";
        hintBtn.onclick = function () {
          var h = attempt.nextHint();
          if (!h) { hintBtn.remove(); return; }
          var n = el("div", "q-hint " + (h.kind === "solution" ? "q-solution" : ""));
          n.appendChild(el("strong", null, h.kind === "solution" ? "The answer" : "Hint " + h.n + " of " + h.of));
          n.appendChild(el("p", null, h.text));
          hints.appendChild(n);
          if (attempt.hintsLeft() === 0 && !q.solution) hintBtn.remove();
          else if (h.kind === "solution") hintBtn.remove();
          else hintBtn.textContent = "Another hint";
        };
        hints.appendChild(hintBtn);
      }
    }
    updateHintButton();
    box.appendChild(fb);
    box.appendChild(hints);
    return box;
  }

  /* ======================================================================
     Lesson page
     =================================================================== */
  function section(id, kicker, title) {
    var s = el("section", "lx-section");
    s.id = id;
    var h = el("div", "lx-sec-head");
    h.appendChild(el("span", "lx-kicker", kicker));
    h.appendChild(el("h2", null, title));
    s.appendChild(h);
    return s;
  }

  function renderLesson(lesson, host) {
    host.innerHTML = "";
    var page = el("article", "lx page");

    /* header */
    var head = el("header", "lx-head");
    var crumb = el("p", "lx-crumb");
    crumb.appendChild(el("span", null, (LS.levelTitle && LS.levelTitle(lesson.level)) || lesson.level));
    crumb.appendChild(el("span", null, " · " + (lesson.estimatedTime || 5) + " min"));
    if (lesson.difficulty) crumb.appendChild(el("span", "lx-diff", " · " + lesson.difficulty));
    head.appendChild(crumb);
    head.appendChild(el("h1", null, lesson.title));
    if (lesson.explanation && lesson.explanation.short) head.appendChild(el("p", "lx-lede", lesson.explanation.short));
    page.appendChild(head);

    /* prerequisites, advisory only */
    if ((lesson.prerequisites || []).length && window.FinCurriculum && LS.v2Curriculum) {
      var ready = LS.v2Curriculum.readiness(lesson.id, LS.v2Progress);
      if (ready && !ready.ready) {
        var pre = el("div", "lx-prereq");
        pre.appendChild(el("strong", null, "Recommended before starting"));
        var ul = el("ul");
        ready.prerequisites.forEach(function (p) {
          var li = el("li", p.met ? "met" : "unmet");
          li.appendChild(el("span", "lx-prereq-mark", p.met ? "✓" : "○"));
          var a = el("a", null, p.title); a.href = "#/learn/" + p.id;
          li.appendChild(a);
          ul.appendChild(li);
        });
        pre.appendChild(ul);
        pre.appendChild(el("p", "lx-prereq-note", "You can carry on regardless — this is a suggestion, not a gate."));
        page.appendChild(pre);
      }
    }

    /* LEARN — with the three depth levels as tabs */
    var learn = section("learn", "Learn", "The idea");
    var levels = ["beginner", "intermediate", "advanced"];
    var available = levels.filter(function (k) { return lesson.explanation && lesson.explanation[k]; });
    if (available.length) {
      var tabs = el("div", "lx-tabs");
      var body = el("div", "lx-explain");
      available.forEach(function (k, i) {
        var t = el("button", "lx-tab" + (i === 0 ? " active" : ""), k === "beginner" ? "Simply" : k === "intermediate" ? "In finance terms" : "In depth");
        t.type = "button";
        t.onclick = function () {
          Array.prototype.forEach.call(tabs.children, function (c) { c.classList.remove("active"); });
          t.classList.add("active");
          body.textContent = lesson.explanation[k];
        };
        tabs.appendChild(t);
      });
      body.textContent = lesson.explanation[available[0]];
      learn.appendChild(tabs); learn.appendChild(body);
    }
    if (lesson.formula) {
      var fx = el("div", "lx-formula");
      fx.appendChild(el("div", "lx-fx-line", lesson.formula.display));
      if (lesson.formula.alternate) fx.appendChild(el("div", "lx-fx-line alt", lesson.formula.alternate));
      (lesson.formula.variables || []).forEach(function (v) {
        var row = el("div", "lx-fx-var");
        row.appendChild(el("code", null, v.symbol));
        row.appendChild(el("span", null, v.meaning));
        fx.appendChild(row);
      });
      if (lesson.formula.note) fx.appendChild(el("p", "lx-fx-note", lesson.formula.note));
      learn.appendChild(fx);
    }
    (lesson.definitions || []).forEach(function (d) {
      var card = el("div", "lx-def");
      card.appendChild(el("div", "lx-def-term", d.term));
      card.appendChild(el("p", null, d.text));
      learn.appendChild(card);
    });
    page.appendChild(learn);

    /* SEE — the worked example */
    if (lesson.example) {
      var see = section("example", "See", "Worked through");
      if (lesson.example.company) see.appendChild(el("p", "lx-example-co", lesson.example.company +
        (lesson.example.period ? " · " + lesson.example.period : "")));
      if (lesson.example.rows) {
        var t = el("table", "lx-table"), tb = el("tbody");
        lesson.example.rows.forEach(function (r) {
          var tr = el("tr");
          tr.appendChild(el("td", null, r[0]));
          var v = r[1];
          tr.appendChild(el("td", "num", typeof v === "number"
            ? (r[2] === "pct" ? S.formatValue(v, { type: "pct", dp: 1 })
              : r[2] === "x" ? S.formatValue(v, { type: "x", dp: 1 }) : money(v))
            : String(v)));
          tb.appendChild(tr);
        });
        t.appendChild(tb); see.appendChild(t);
      }
      if (lesson.example.walkthrough) see.appendChild(el("p", null, lesson.example.walkthrough));
      page.appendChild(see);
    }

    /* WHY IT MATTERS */
    if (lesson.whyItMatters) {
      var why = el("div", "lx-why");
      why.appendChild(el("strong", null, "Why this matters"));
      why.appendChild(el("p", null, lesson.whyItMatters));
      page.appendChild(why);
    }

    /* PRACTICE */
    if ((lesson.practice || []).length) {
      var pr = section("practice", "Practice", "Try it yourself");
      pr.appendChild(el("p", "lx-sec-lede", lesson.practice.length +
        " problems, from straightforward to hard. Hints are available and cost you nothing but the score."));
      lesson.practice.forEach(function (q, i) { pr.appendChild(renderQuestion(q, i)); });
      page.appendChild(pr);
    }

    /* BUILD — the sandbox */
    if (lesson.sandbox) {
      var build = section("build", "Build", "Do it in the sandbox");
      var sbHost = el("div");
      build.appendChild(sbHost);
      page.appendChild(build);
      setTimeout(function () {
        if (LS.Sandbox) new LS.Sandbox(lesson, sbHost);
      }, 0);
    }

    /* COMMON MISTAKES */
    if ((lesson.commonMistakes || []).length) {
      var cm = section("mistakes", "Watch out", "Common mistakes");
      lesson.commonMistakes.forEach(function (m) {
        var c = el("div", "lx-mistake");
        c.appendChild(el("div", "lx-mistake-head", m.mistake));
        c.appendChild(el("p", null, m.why));
        cm.appendChild(c);
      });
      page.appendChild(cm);
    }

    /* APPLY */
    if ((lesson.realWorld || []).length) {
      var rw = section("apply", "Apply", "Where you would use this");
      var grid = el("div", "lx-rw");
      lesson.realWorld.forEach(function (r) {
        var c = el("div", "lx-rw-card");
        c.appendChild(el("div", "lx-rw-field", r.field));
        c.appendChild(el("p", null, r.use));
        grid.appendChild(c);
      });
      rw.appendChild(grid);
      page.appendChild(rw);
    }

    /* MASTER */
    if (lesson.challenge) {
      var ch = section("challenge", "Master", "The hard one");
      ch.appendChild(renderQuestion(lesson.challenge, 99));
      page.appendChild(ch);
    }

    /* takeaways + next */
    if ((lesson.takeaways || []).length) {
      var tk = el("div", "lx-takeaways");
      tk.appendChild(el("strong", null, "You should now know"));
      var ul2 = el("ul");
      lesson.takeaways.forEach(function (t) {
        var li = el("li");
        li.appendChild(el("span", "lx-tick", "✓"));
        li.appendChild(el("span", null, t));
        ul2.appendChild(li);
      });
      tk.appendChild(ul2);
      page.appendChild(tk);
    }

    var next = LS.nextV2Lesson && LS.nextV2Lesson(lesson.id);
    if (next) {
      var nav = el("div", "lx-next");
      nav.appendChild(el("span", "nav-label", "Next"));
      var a2 = el("a", null, next.title); a2.href = "#/learn/" + next.id;
      nav.appendChild(a2);
      page.appendChild(nav);
    }

    host.appendChild(page);
    if (LS.store && LS.store.markSeen) LS.store.markSeen(lesson.id);
  }

  LS.renderV2Lesson = renderLesson;
  LS.renderV2Question = renderQuestion;
})();
