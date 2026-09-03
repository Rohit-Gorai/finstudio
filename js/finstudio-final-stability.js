/* FinStudio final stability layer. Canonical 227-topic curriculum, reliable
   Level 0 routing, and deterministic per-topic quiz state. */
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
          var base = slug(String(lv.level) + "-" + m.title + "-" + t.title);
          var aliases = [canonical, t.cid, base, slug(t.title), base.replace(/^\d+-/, "")];
          if (aliases.indexOf(wanted) !== -1) { hit = { id: canonical, title: t.title, level: lv.level, module: m.title }; return true; }
          return false;
        });
      });
    });
    return hit;
  }

  function clearQuizState(id) {
    if (!id || !LS.store || typeof LS.store.lesson !== "function") return;
    try {
      var rec = LS.store.lesson(id);
      Object.keys(rec.items || {}).forEach(function (k) {
        if (/^mcq\d+$/.test(k) || /^quiz[-:]/i.test(k)) delete rec.items[k];
      });
      var all = JSON.parse(localStorage.getItem("finstudio-progress-v1") || "{}");
      if (all[id] && all[id].items) {
        Object.keys(all[id].items).forEach(function (k) {
          if (/^mcq\d+$/.test(k) || /^quiz[-:]/i.test(k)) delete all[id].items[k];
        });
        localStorage.setItem("finstudio-progress-v1", JSON.stringify(all));
      }
    } catch (e) {}
  }

  function resetRenderedQuiz() {
    var main = document.getElementById("main");
    if (!main) return;
    main.querySelectorAll(".mcq-explain").forEach(function (n) { n.remove(); });
    main.querySelectorAll(".mcq-opts button").forEach(function (b) {
      b.classList.remove("picked-right", "picked-wrong");
      b.disabled = false;
    });
  }

  /* The two legacy quiz patches call location.reload() on topic changes. That
     reload is the source of the navigation race. No other FinStudio script
     needs programmatic reload, so safely neutralise that one legacy mechanism. */
  try {
    var proto = Object.getPrototypeOf(window.location);
    if (proto && !window.__finstudioReloadGuard) {
      window.__finstudioReloadGuard = true;
      Object.defineProperty(proto, "reload", { configurable: true, writable: true, value: function () {} });
    }
  } catch (e) {}

  /* Capture old /topic links before the compatibility/legacy listeners. */
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#/topic/"]') : null;
    if (!a) return;
    var hit = topicByRoute(a.getAttribute("href"));
    if (!hit || !LS.lessons || !LS.lessons[hit.id]) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    clearQuizState(hit.id);
    location.hash = "#/" + hit.id;
  }, true);

  var initialBootDone = false;
  function initialBoot() {
    if (initialBootDone) return;
    initialBootDone = true;
    var raw = String(location.hash || "").replace(/^#\/?/, "");
    if (raw.indexOf("topic/") === 0) {
      var hit = topicByRoute(raw);
      if (hit && LS.lessons[hit.id]) {
        history.replaceState(null, "", location.pathname + location.search + "#/" + hit.id);
        raw = hit.id;
      }
    }
    /* app.js ran before all-topic-routes.js created the generated 227 routes.
       Re-run its normal hash router exactly once after those routes exist. */
    if (LS.lessons[raw]) {
      clearQuizState(raw);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }

  window.addEventListener("hashchange", function () {
    setTimeout(function () {
      var raw = String(location.hash || "").replace(/^#\/?/, "");
      if (raw.indexOf("topic/") === 0) {
        var hit = topicByRoute(raw);
        if (hit && LS.lessons[hit.id]) {
          history.replaceState(null, "", location.pathname + location.search + "#/" + hit.id);
          clearQuizState(hit.id);
          window.dispatchEvent(new HashChangeEvent("hashchange"));
          return;
        }
      }
      if (LS.lessons[raw]) {
        clearQuizState(raw);
        /* app.js has already rendered the target lesson for this hash. Reset
           only the transient quiz UI; do not touch practice/sandbox content. */
        resetRenderedQuiz();
      }
    }, 0);
  });

  setTimeout(initialBoot, 0);
  window.addEventListener("load", initialBoot);

  function countCanonical() {
    var n = 0;
    (LS.curriculumMap || []).forEach(function (lv) { (lv.modules || []).forEach(function (m) { n += (m.topics || []).length; }); });
    return n;
  }
  window.addEventListener("load", function () {
    var n = countCanonical();
    if (n !== 227) console.warn("FinStudio curriculum integrity: expected 227 topics, found " + n);
    document.querySelectorAll(".side-roadmap p").forEach(function (p) { p.textContent = "11 levels · " + n + " interactive topics"; });
  });
})();