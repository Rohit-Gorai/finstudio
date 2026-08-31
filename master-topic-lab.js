/* ============================================================================
   Topic router — replaces the universal filler lab.
   ----------------------------------------------------------------------------
   The previous version gave all 227 roadmap topics the same page: one sentence
   printed three times, a sandbox computing `start * (1 + driverA% + driverB%)`
   whatever the topic was, and a bar chart whose heights were fixed at
   18/36/54/72/90 and never responded to the data. 184 of the 227 rendered that
   way — including "Bonds", "Duration" and "What is finance?".

   This version does three things instead:
     1. If an authored lesson covers the topic, go there.
     2. If a genuine topic-specific lab exists in advanced-topics.js, render it.
     3. Otherwise say so plainly, and point at what has been written.

   The rule: never show an interactive control that does not compute something
   true about the topic it sits under.
   ========================================================================= */
(function () {
  "use strict";
  var LS = window.LS = window.LS || {};
  if (!LS.manifest || !LS.manifest.roadmap) return;

  var specific = LS.advancedTopics || [];

  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function findLab(name) {
    return specific.filter(function (x) { return x.name.toLowerCase() === name.toLowerCase(); })[0];
  }
  function moduleOf(name) {
    var result = null;
    LS.manifest.roadmap.some(function (l) {
      return l.modules.some(function (m) {
        if (m.topics.indexOf(name) >= 0) { result = { level: l.level, title: l.title, module: m.title }; return true; }
        return false;
      });
    });
    return result;
  }

  function norm(t) { return String(t).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }

  function authoredLesson(topic) {
    var all = window.FinLessons;
    if (!all) return null;
    var want = norm(topic), hit = null;
    Object.keys(all).some(function (k) {
      var l = all[k];
      if ((l.covers || []).some(function (c) { return norm(c) === want; })) { hit = l; return true; }
      if (norm(l.title) === want) { hit = l; return true; }
      return false;
    });
    return hit;
  }
  function legacyLesson(topic) {
    var want = norm(topic), hit = null;
    Object.keys(LS.lessons || {}).some(function (id) {
      if (norm(LS.lessons[id].title) === want) { hit = { id: id, title: LS.lessons[id].title }; return true; }
      return false;
    });
    return hit;
  }
  function statusOf(topic) {
    if (authoredLesson(topic)) return "lesson";
    if (legacyLesson(topic)) return "legacy";
    if (findLab(topic)) return "lab";
    return "planned";
  }

  /* ---------------------------------------------------------- rendering */
  function renderLab(topic, ctx, lab) {
    var main = document.getElementById("main");
    var cards = lab.inputs.map(function (x, i) {
      return '<label class="lab-input"><span>' + esc(x[0]) + "</span>" +
        '<input type="number" step="any" value="' + x[1] + '" data-i="' + i +
        '" aria-label="' + esc(x[0]) + '"></label>';
    }).join("");
    main.innerHTML =
      '<div class="page master-topic-page">' +
      '<p class="lesson-kicker">' + (ctx ? "LEVEL " + ctx.level + " · " + esc(ctx.title) : "FINSTUDIO") + "</p>" +
      "<h1>" + esc(topic) + "</h1>" +
      (lab.example ? '<p class="lesson-lede">' + esc(lab.example) + "</p>" : "") +
      '<section class="master-step"><span>01</span><div><h2>The formula</h2>' +
      '<div class="lab-formula">' + esc(lab.formula) + "</div></div></section>" +
      '<section class="master-step master-sandbox"><span>02</span><div><h2>Try it</h2>' +
      "<p>Change an assumption; the result recalculates immediately.</p>" +
      '<div class="lab-inputs">' + cards + "</div>" +
      '<div class="lab-result"><span>Live result</span><strong id="masterResult"></strong></div>' +
      "</div></section>" +
      '<section class="master-step"><span>03</span><div><h2>Keep going</h2>' +
      "<p>This is a calculator rather than a full lesson. The written lessons — with practice " +
      'problems and a spreadsheet sandbox — are listed in <a href="#/curriculum">the curriculum</a>.</p>' +
      "</div></section></div>";

    function update() {
      var v = [].map.call(main.querySelectorAll(".lab-input input"), function (n) {
        var x = Number(n.value);
        return Number.isFinite(x) ? x : 0;
      });
      main.querySelector("#masterResult").textContent = lab.calc(v);
    }
    Array.prototype.forEach.call(main.querySelectorAll(".lab-input input"), function (n) {
      n.addEventListener("input", update);
    });
    update();
  }

  function renderPlanned(topic, ctx) {
    var main = document.getElementById("main");
    var lvl = ctx ? ctx.level : null;
    var picks = [];
    if (window.FinLessons) {
      var ids = Object.keys(window.FinLessons);
      picks = ids.slice(0, 5).map(function (k) {
        var l = window.FinLessons[k];
        return '<li><a href="#/learn/' + l.id + '">' + esc(l.title) + "</a>" +
          (l.summary ? "<span>" + esc(l.summary) + "</span>" : "") + "</li>";
      });
    }
    main.innerHTML =
      '<div class="page topic-planned">' +
      '<p class="lesson-kicker">' + (lvl != null ? "LEVEL " + lvl + " · " : "") +
      esc(ctx ? ctx.title : "ROADMAP") + "</p>" +
      "<h1>" + esc(topic) + "</h1>" +
      '<div class="planned-note">' +
      "<strong>On the roadmap, not written yet.</strong>" +
      "<p>We could show you a generic calculator here, but it would not model " +
      esc(topic.toLowerCase()) + " — so it would teach you nothing and imply we had covered it. " +
      "This topic is planned for " + (lvl != null ? "Level " + lvl : "a later level") + ".</p>" +
      "</div>" +
      (picks.length ? "<h2>Written and ready now</h2><ul class=\"planned-list\">" + picks.join("") + "</ul>" : "") +
      '<p class="planned-back"><a href="#/curriculum">← Back to the curriculum</a></p></div>';
  }

  function render(topic) {
    var main = document.getElementById("main");
    if (!main) return;
    var ctx = moduleOf(topic);
    var authored = authoredLesson(topic);
    if (authored) { location.hash = "#/learn/" + authored.id; return; }
    var legacy = legacyLesson(topic);
    if (legacy) { location.hash = "#/" + legacy.id; return; }
    // advanced-topics.js already renders its own labs on this route; leave them alone
    if (findLab(topic)) return;
    renderPlanned(topic, ctx);
  }

  /* ------------------------------------------------ the status matrix */
  function renderMatrix() {
    var main = document.getElementById("main");
    if (!main) return;
    var rows = [], tally = { lesson: 0, legacy: 0, lab: 0, planned: 0 }, total = 0;
    var LABEL = { lesson: "Full lesson", legacy: "Lesson", lab: "Calculator only", planned: "Not written yet" };
    LS.manifest.roadmap.forEach(function (l) {
      l.modules.forEach(function (m) {
        m.topics.forEach(function (t) {
          var st = statusOf(t);
          tally[st]++; total++;
          rows.push('<tr class="st-' + st + '"><td>' + l.level + "</td><td>" + esc(t) +
            "</td><td>" + LABEL[st] + "</td>" +
            "<td>" + (st === "lesson" || st === "legacy" ? "Yes" : "—") + "</td>" +
            "<td>" + (st === "lesson" ? "Yes" : "—") + "</td>" +
            '<td><a href="' + routeTopic(t) + '">Open</a></td></tr>');
        });
      });
    });
    var written = tally.lesson + tally.legacy;
    main.innerHTML =
      '<div class="page matrix-page"><p class="lesson-kicker">CURRICULUM STATUS</p>' +
      "<h1>What is actually built</h1>" +
      '<p class="lesson-lede">' + written + " of " + total +
      " roadmap topics have a written lesson. " + tally.lab + " have a calculator only, and " +
      tally.planned + " have not been written yet. This page reports the real state rather than " +
      "marking every row complete.</p>" +
      '<div class="matrix-summary">' +
      "<div><strong>" + tally.lesson + "</strong><span>Full lessons — explanation, practice, sandbox</span></div>" +
      "<div><strong>" + tally.legacy + "</strong><span>Lessons from the original course</span></div>" +
      "<div><strong>" + tally.lab + "</strong><span>Interactive calculator only</span></div>" +
      "<div><strong>" + tally.planned + "</strong><span>Not written yet</span></div></div>" +
      '<div class="matrix-wrap"><table><thead><tr><th>Level</th><th>Topic</th><th>Status</th>' +
      "<th>Written</th><th>Practice</th><th></th></tr></thead><tbody>" + rows.join("") +
      "</tbody></table></div></div>";
  }

  function routeTopic(topic) { return "#/topic/" + slug(topic); }

  function sync() {
    var h = location.hash.replace(/^#\/?/, "");
    if (h === "curriculum/matrix") { renderMatrix(); return; }
    // both prefixes are in use: roadmap links emit #/lab/topic/<slug>, and
    // #/topic/<slug> is kept working so older shared links do not break
    var id = null;
    if (h.indexOf("lab/topic/") === 0) id = h.slice(10);
    else if (h.indexOf("topic/") === 0) id = h.slice(6);
    if (id) {
      var topic = null;
      LS.manifest.roadmap.some(function (l) {
        return l.modules.some(function (m) {
          topic = m.topics.filter(function (t) { return slug(t) === id; })[0];
          return !!topic;
        });
      });
      if (topic) render(topic);
    }
  }

  window.FinStudioMaster = {
    routeTopic: routeTopic, render: render, renderMatrix: renderMatrix, statusOf: statusOf
  };
  window.addEventListener("hashchange", sync);
  window.addEventListener("load", sync);
  sync();
})();
