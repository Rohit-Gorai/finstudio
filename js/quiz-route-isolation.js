/* FinStudio — quiz route/state synchronization only.
   No reloads, DOM rewrites, or UI changes. The normal hash router remains the
   single renderer; this guard only normalises legacy topic URLs and clears
   transient quiz markers before the incoming lesson renders. */
(function () {
  "use strict";
  var LS = window.LS = window.LS || {};

  function slug(s) {
    return String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  function findCanonical(raw) {
    var wanted = String(raw || "").replace(/^#\/?topic\//, "");
    var found = null;
    (LS.curriculumMap || []).some(function (lv) {
      return (lv.modules || []).some(function (mod) {
        return (mod.topics || []).some(function (t) {
          var id = t.id || ("topic-l" + lv.level + "-" + slug(mod.title) + "-" + slug(t.title));
          var candidates = [id, t.cid, slug(String(lv.level) + "-" + mod.title + "-" + t.title), slug(t.title)];
          if (candidates.indexOf(wanted) >= 0) { found = id; return true; }
          return false;
        });
      });
    });
    return found;
  }
  function clearQuizState(id) {
    try {
      var r = LS.store && LS.store.lesson ? LS.store.lesson(id) : null;
      if (!r || !r.items) return;
      Object.keys(r.items).forEach(function (k) {
        if (/^mcq\d+$/.test(k) || /^quiz[-:]/i.test(k)) delete r.items[k];
      });
    } catch (e) {}
  }

  /* Normalise legacy /topic/... links without creating a second router. */
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#/topic/"]') : null;
    if (!a) return;
    var id = findCanonical(a.getAttribute("href"));
    if (!id || !LS.lessons || !LS.lessons[id]) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    location.hash = "#/" + id;
  }, true);

  /* Capture phase runs before app.js's bubble-phase hashchange router. */
  var last = null;
  window.addEventListener("hashchange", function () {
    var raw = String(location.hash || "").replace(/^#\/?/, "");
    if (raw.indexOf("topic/") === 0) {
      var canonical = findCanonical(raw);
      if (canonical && LS.lessons[canonical]) {
        history.replaceState(null, "", location.pathname + location.search + "#/" + canonical);
        raw = canonical;
      }
    }
    if (!LS.lessons[raw] || raw === last) return;
    last = raw;
    clearQuizState(raw);
  }, true);

  /* Initial direct-link boot: clear the selected lesson before the existing
     router's first render. */
  (function boot() {
    var raw = String(location.hash || "").replace(/^#\/?/, "");
    if (raw.indexOf("topic/") === 0) {
      var canonical = findCanonical(raw);
      if (canonical && LS.lessons[canonical]) {
        history.replaceState(null, "", location.pathname + location.search + "#/" + canonical);
        raw = canonical;
      }
    }
    if (LS.lessons[raw]) { last = raw; clearQuizState(raw); }
  })();
})();