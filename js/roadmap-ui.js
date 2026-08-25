/* FinStudio roadmap UI. Uses the canonical roadmap in manifest.js without inventing lesson routes. */
(function () {
  "use strict";
  var LS = window.LS;
  if (!LS || !LS.manifest || !LS.manifest.roadmap) return;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
  }

  function liveLessonCount(level) {
    var count = 0;
    level.modules.forEach(function (m) {
      Object.keys(LS.manifest.modules).forEach(function (code) {
        var live = LS.manifest.modules[code];
        if (live.title === m.title) count += live.lessons.length;
      });
    });
    return count;
  }

  function renderCurriculum() {
    var content = document.getElementById("main");
    if (!content) return;
    document.title = "Curriculum · FinStudio";
    var page = document.createElement("div");
    page.className = "page roadmap-page";
    page.innerHTML =
      '<p class="lesson-kicker">THE FINSTUDIO ROADMAP</p>' +
      '<h1>Learn finance from first principles to advanced practice.</h1>' +
      '<p class="lesson-lede">The original interactive lessons are the first part of a much larger path. This roadmap shows the complete destination: accounting, statements, analysis, modelling, valuation, investment banking, private equity, research, markets, advanced finance and finance for startup founders.</p>' +
      '<div class="roadmap-intro"><strong>How to use this roadmap.</strong> Follow the levels in order when you are learning from scratch. Live topics are linked to the existing practice engine; the remaining topics are clearly marked as roadmap topics so we never pretend an unwritten lesson is interactive.</div>';

    LS.manifest.roadmap.forEach(function (level) {
      var section = document.createElement("section");
      section.className = "roadmap-level";
      var live = liveLessonCount(level);
      var cards = level.modules.map(function (m) {
        var liveModule = null;
        Object.keys(LS.manifest.modules).some(function (code) {
          if (LS.manifest.modules[code].title === m.title) { liveModule = code; return true; }
          return false;
        });
        var topics = m.topics.map(function (topic) {
          var linked = null;
          if (liveModule) {
            var lessons = LS.manifest.modules[liveModule].lessons;
            lessons.forEach(function (id) {
              var lesson = LS.lessons[id];
              if (lesson && lesson.title.toLowerCase() === topic.toLowerCase()) linked = id;
            });
          }
          return linked ? '<a href="#/' + esc(linked) + '">' + esc(topic) + '</a>' : '<span>' + esc(topic) + '</span>';
        }).join(" · ");
        return '<article class="roadmap-module"><h3>' + esc(m.title) + '</h3><p>' + topics + '</p>' +
          (liveModule ? '<span class="roadmap-badge">Interactive · ' + LS.manifest.modules[liveModule].lessons.length + ' lessons</span>' : '<span class="roadmap-badge">Roadmap · lessons to build</span>') + '</article>';
      }).join("");
      section.innerHTML = '<div class="roadmap-level-head"><div class="roadmap-number">LEVEL ' + level.level + '</div><div><h2>' + esc(level.title) + '</h2><p class="roadmap-level-lede">' + esc(level.blurb) + '</p></div></div><div class="roadmap-modules">' + cards + '</div>';
      page.appendChild(section);
    });
    content.innerHTML = "";
    content.appendChild(page);
  }

  function addRoadmapLink() {
    var sidebar = document.getElementById("sidebar");
    if (!sidebar || sidebar.querySelector(".side-roadmap")) return;
    var box = document.createElement("div");
    box.className = "side-roadmap";
    box.innerHTML = '<a href="#/curriculum">Full curriculum roadmap →</a><p>11 levels · from foundations to advanced finance</p>';
    sidebar.insertBefore(box, sidebar.firstChild);
  }

  function sync() {
    addRoadmapLink();
    var h = location.hash.replace(/^#\/?/, "");
    if (h === "curriculum") renderCurriculum();
  }

  window.addEventListener("hashchange", sync);
  window.addEventListener("load", sync);
  sync();
})();
