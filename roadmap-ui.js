/* FinStudio roadmap UI. Uses the canonical roadmap and never invents fake lesson routes. */
(function () {
  "use strict";
  var LS = window.LS;
  if (!LS || !LS.manifest || !LS.manifest.roadmap) return;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
  }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function advancedTopic(name) {
    return (LS.advancedTopics || []).find(function (t) { return t.name.toLowerCase() === name.toLowerCase(); }) || null;
  }
  function liveModuleFor(title) {
    var found = null;
    Object.keys(LS.manifest.modules).some(function (code) {
      if (LS.manifest.modules[code].title.toLowerCase() === title.toLowerCase()) { found = code; return true; }
      return false;
    });
    return found;
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
      '<p class="lesson-lede">Follow the same practice-first language throughout FinStudio: understand the idea, see the mechanics, try the numbers, build a model and test your judgement.</p>' +
      '<div class="roadmap-intro"><strong>How to use this roadmap.</strong> Follow the levels in order when learning from scratch. Every topic is either connected to an authored lesson or to an interactive topic lab. Topics that still need deeper authored content are clearly marked rather than presented as finished courses.</div>';

    LS.manifest.roadmap.forEach(function (level) {
      var section = document.createElement("section");
      section.className = "roadmap-level";
      var cards = level.modules.map(function (m) {
        var liveModule = liveModuleFor(m.title);
        var topics = m.topics.map(function (topic) {
          var linked = null;
          if (liveModule) {
            LS.manifest.modules[liveModule].lessons.forEach(function (id) {
              var lesson = LS.lessons[id];
              if (lesson && lesson.title && lesson.title.toLowerCase() === topic.toLowerCase()) linked = "#" + "/" + id;
            });
          }
          var lab = advancedTopic(topic);
          if (lab) linked = "#/lab/topic/" + slug(topic);
          if (linked) return '<a href="' + linked + '">' + esc(topic) + '</a>';
          return '<span>' + esc(topic) + '</span>';
        }).join(" · ");
        var liveCount = liveModule ? LS.manifest.modules[liveModule].lessons.length : 0;
        var labCount = m.topics.filter(function (topic) { return !!advancedTopic(topic); }).length;
        var badge = liveCount ? 'Interactive · ' + liveCount + ' lessons' : (labCount ? 'Interactive · ' + labCount + ' topic labs' : 'Roadmap · lessons to build');
        return '<article class="roadmap-module"><h3>' + esc(m.title) + '</h3><p>' + topics + '</p><span class="roadmap-badge">' + badge + '</span></article>';
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
    box.innerHTML = '<a href="#/curriculum">Full curriculum roadmap →</a><p>11 levels · concepts, practice labs and financial models</p>';
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
