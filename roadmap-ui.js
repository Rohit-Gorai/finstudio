/* FinStudio roadmap UI — every curriculum topic is a real interactive lesson. */
(function () {
  "use strict";
  var LS = window.LS;
  if (!LS || !LS.manifest || !LS.manifest.roadmap) return;
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;"); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function topicHref(level, module, topic) {
    return "#/topic/l" + level + "-" + slug(module) + "-" + slug(topic);
  }
  function renderCurriculum() {
    var content = document.getElementById("main");
    if (!content) return;
    document.title = "Curriculum · FinStudio";
    var page = document.createElement("div");
    page.className = "page roadmap-page";
    page.innerHTML = '<p class="lesson-kicker">THE FINSTUDIO ROADMAP</p>' +
      '<h1>Learn finance from first principles to advanced practice.</h1>' +
      '<p class="lesson-lede">Every topic is now a dedicated practice-first lesson. Open any concept to learn the idea, see a realistic example, practise it, use the sandbox and check your understanding.</p>' +
      '<div class="roadmap-intro"><strong>How to use this roadmap.</strong> Start anywhere or follow Levels 0–10 in order. Every topic below is clickable and opens its own learning page.</div>';
    LS.manifest.roadmap.forEach(function (level) {
      var section = document.createElement("section");
      section.className = "roadmap-level";
      var cards = level.modules.map(function (m) {
        var topics = m.topics.map(function (topic) {
          return '<a class="rt rt-universal" href="' + topicHref(level.level, m.title, topic) + '" title="Open interactive lesson for ' + esc(topic) + '">' + esc(topic) + '</a>';
        }).join(" · ");
        return '<article class="roadmap-module"><h3>' + esc(m.title) + '</h3><p>' + topics + '</p><span class="roadmap-badge">✓ ' + m.topics.length + ' interactive lessons</span></article>';
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
    box.innerHTML = '<a href="#/curriculum">Full curriculum roadmap →</a><p>11 levels · 227 interactive topics</p>';
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
