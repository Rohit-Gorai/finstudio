/* FinStudio GitHub Pages compatibility layer.
 * The public Pages site may be served from the repository root rather than the
 * Vite artifact. Keep legacy/static routes working and make every roadmap
 * topic navigable without depending on server-side SPA rewrites.
 */
(function () {
  "use strict";
  function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  function normalizeLegacyPath() {
    var p = location.pathname;
    var m = p.match(/^(.*\/finstudio)(?:\/curriculum)?\/?$/i);
    if (!m || !/\/curriculum\/?$/i.test(p)) return false;
    var target = location.hash || "";
    var level = target.indexOf("#level-") >= 0 ? target.slice(target.indexOf("#level-")) : "";
    history.replaceState(null, "", m[1] + "/#\/curriculum" + level);
    return true;
  }
  function enhanceCurriculum() {
    var page = document.querySelector(".roadmap-page");
    if (!page) return;
    Array.prototype.forEach.call(page.querySelectorAll(".roadmap-level"), function (section, i) {
      section.id = "level-" + i;
    });
    Array.prototype.forEach.call(page.querySelectorAll(".rt-planned"), function (node) {
      var topic = node.textContent.trim();
      if (!topic) return;
      var a = document.createElement("a");
      a.className = "rt rt-universal";
      a.href = "#/topic/" + slug(topic);
      a.textContent = topic;
      a.title = "Open interactive FinStudio lesson";
      node.replaceWith(a);
    });
  }
  function routeTopicFallback() {
    var h = location.hash.replace(/^#\/?/, "");
    if (h.indexOf("topic/") !== 0) return;
    var topicSlug = h.slice(6).split("#")[0];
    if (window.FinStudioMaster && window.FinStudioMaster.render) {
      var found = null;
      var roadmap = window.LS && window.LS.manifest && window.LS.manifest.roadmap;
      if (roadmap) roadmap.some(function (level) {
        return level.modules.some(function (module) {
          return module.topics.some(function (topic) {
            if (slug(topic) === topicSlug) { found = topic; return true; }
            return false;
          });
        });
      });
      if (found) window.FinStudioMaster.render(found);
    }
  }
  function sync() {
    normalizeLegacyPath();
    enhanceCurriculum();
    routeTopicFallback();
    var h = location.hash;
    var match = h.match(/^#\/?curriculum(?:#(level-\d+))?$/);
    if (match && match[1]) {
      setTimeout(function () {
        var target = document.getElementById(match[1]);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }
  window.addEventListener("hashchange", function () { setTimeout(sync, 0); });
  window.addEventListener("load", function () { setTimeout(sync, 0); });
  setTimeout(sync, 0);
})();
