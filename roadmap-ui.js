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
        // A topic shows what it actually is: an authored lesson, an original
        // course lesson, a calculator, or something still to be written.
        var counts = { lesson: 0, legacy: 0, lab: 0, planned: 0 };
        var topics = m.topics.map(function (topic) {
          var authored = null;
          if (window.FinLessons) {
            var want = topic.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
            Object.keys(window.FinLessons).some(function (k) {
              var l = window.FinLessons[k];
              var covers = (l.covers || []).some(function (c) {
                return c.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() === want;
              });
              if (covers || l.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() === want) {
                authored = l; return true;
              }
              return false;
            });
          }
          if (authored) {
            counts.lesson++;
            return '<a class="rt rt-lesson" href="#/learn/' + authored.id + '">' + esc(topic) + '</a>';
          }
          var linked = null;
          if (liveModule) {
            LS.manifest.modules[liveModule].lessons.forEach(function (id) {
              var lesson = LS.lessons[id];
              if (lesson && lesson.title && lesson.title.toLowerCase() === topic.toLowerCase()) linked = "#" + "/" + id;
            });
          }
          if (linked) { counts.legacy++; return '<a class="rt rt-legacy" href="' + linked + '">' + esc(topic) + '</a>'; }
          if (advancedTopic(topic)) {
            counts.lab++;
            return '<a class="rt rt-lab" href="#/lab/topic/' + slug(topic) + '">' + esc(topic) + '</a>';
          }
          counts.planned++;
          return '<span class="rt rt-planned" title="Not written yet">' + esc(topic) + '</span>';
        }).join(" · ");
        var written = counts.lesson + counts.legacy;
        var badge = written === m.topics.length
          ? '\u2713 All ' + m.topics.length + ' written'
          : written
            ? written + ' of ' + m.topics.length + ' written'
            : counts.lab ? counts.lab + ' calculators \u00b7 lessons to come'
              : 'Planned \u00b7 not written yet';
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
