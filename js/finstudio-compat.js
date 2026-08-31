/* FinStudio GitHub Pages compatibility layer.
 * The public Pages site can be served from the repository root. Keep legacy
 * server paths working, normalize nested curriculum anchors, and ensure every
 * roadmap topic has a real client-side route.
 */
(function () {
  "use strict";
  function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  function normalizeLegacyPath() {
    var p = location.pathname.replace(/\/+$/, "");
    var match = p.match(/^(.*\/finstudio)\/curriculum$/i);
    if (!match) return false;
    var nested = location.hash || "";
    var level = nested.match(/#(level-\d+)$/);
    var next = "#/curriculum" + (level ? "#" + level[1] : "");
    if (location.hash !== next) {
      location.hash = next;
      return true;
    }
    return false;
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
  function scrollLevel() {
    var match = location.hash.match(/^#\/?curriculum#(level-\d+)$/);
    if (!match) return;
    setTimeout(function () {
      var target = document.getElementById(match[1]);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
  function routeTopicFallback() {
    var h = location.hash.replace(/^#\/?/, "");
    if (h.indexOf("topic/") !== 0) return;
    var topicSlug = h.slice(6).split("#")[0];
    if (!window.FinStudioMaster || !window.FinStudioMaster.render) return;
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
  function sync() {
    if (normalizeLegacyPath()) return;
    enhanceCurriculum();
    routeTopicFallback();
    scrollLevel();
  }
  window.addEventListener("hashchange", function () { setTimeout(sync, 0); });
  window.addEventListener("load", function () { setTimeout(sync, 0); });
  setTimeout(sync, 0);
})();
