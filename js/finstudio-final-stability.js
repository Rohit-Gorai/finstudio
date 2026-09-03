/* FinStudio final stability layer. Keeps the canonical 227-topic curriculum
   intact, gives Level 0 the same routing behavior as every other level, and
   never changes lesson content or quiz questions. */
(function () {
  "use strict";
  var LS = window.LS = window.LS || {};

  function slug(s) { return String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  function topicByRoute(route) {
    var wanted = String(route || "").replace(/^#\/?topic\//, "");
    var hit = null;
    (LS.curriculumMap || []).some(function (lv) {
      return (lv.modules || []).some(function (m) {
        return (m.topics || []).some(function (t) {
          var canonical = t.id || ("topic-l" + lv.level + "-" + slug(m.title) + "-" + slug(t.title));
          var aliases = [canonical, t.cid, slug(String(lv.level) + "-" + m.title + "-" + t.title), slug(t.title)];
          if (aliases.indexOf(wanted) !== -1) { hit = { id: canonical, title: t.title, level: lv.level, module: m.title }; return true; }
          return false;
        });
      });
    });
    return hit;
  }

  /* Topic links are intercepted in capture phase. This runs before every older
     /topic hash listener, which removes the Level 0-only navigation race. */
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#/topic/"]') : null;
    if (!a) return;
    var hit = topicByRoute(a.getAttribute("href"));
    if (!hit) return;
    if (!LS.lessons || !LS.lessons[hit.id]) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    location.hash = "#/" + hit.id;
  }, true);

  /* If an old listener has already written /topic/..., normalise it on the
     next microtask before a competing renderer can settle on the wrong page. */
  window.addEventListener("hashchange", function () {
    var raw = String(location.hash || "").replace(/^#\/?/, "");
    if (raw.indexOf("topic/") !== 0) return;
    var hit = topicByRoute(raw);
    if (hit && LS.lessons[hit.id]) {
      history.replaceState(null, "", location.pathname + location.search + "#/" + hit.id);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }, true);

  /* The generated canonical curriculum is the source of truth: it explicitly
     contains 11 levels, 35 modules and 227 topics. Do not derive the count from
     the older hand-written roadmap list, which can drift. */
  function countCanonical() {
    var n = 0;
    (LS.curriculumMap || []).forEach(function (lv) {
      (lv.modules || []).forEach(function (m) { n += (m.topics || []).length; });
    });
    return n;
  }
  window.addEventListener("load", function () {
    var n = countCanonical();
    if (n !== 227) console.warn("FinStudio curriculum integrity: expected 227 topics, found " + n);
    var labels = document.querySelectorAll(".side-roadmap p");
    labels.forEach(function (p) { p.textContent = "11 levels · " + n + " interactive topics"; });
  });
})();