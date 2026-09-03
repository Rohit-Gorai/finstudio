/* FinStudio final stability layer. Keeps the canonical 227-topic curriculum
   intact, gives Level 0 the same routing behavior as every other level, and
   makes quiz state deterministic per topic without full-page reloads. */
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
          var aliases = [canonical, t.cid, slug(String(lv.level) + "-" + m.title + "-" + t.title), slug(t.title), slug(String(lv.level) + "-" + m.title + "-" + t.title).replace(/^\d+-/, "")];
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
      /* Persist the deletion because the core store keeps an in-memory cache. */
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

  /* Legacy quiz patches attempted to solve isolation with location.reload().
     That created a navigation race and allowed the old lesson to be restored.
     Suppress only those programmatic reload calls; browser refresh remains normal. */
  try {
    var proto = Object.getPrototypeOf(window.location);
    var originalReload = window.location.reload;
    if (proto && !window.__finstudioReloadGuard) {
      window.__finstudioReloadGuard = true;
      Object.defineProperty(proto, "reload", { configurable: true, writable: true, value: function () {} });
    }
  } catch (e) {}

  /* Capture all legacy /topic links and route them to the actual lesson id. */
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

  function normalizeAndRender() {
    var raw = String(location.hash || "").replace(/^#\/?/, "");
    if (raw.indexOf("topic/") === 0) {
      var hit = topicByRoute(raw);
      if (hit && LS.lessons[hit.id]) {
        if (location.hash !== "#/" + hit.id) {
          history.replaceState(null, "", location.pathname + location.search + "#/" + hit.id);
        }
      }
    }
    var current = String(location.hash || "").replace(/^#\/?/, "");
    if (LS.lessons[current]) {
      clearQuizState(current);
      resetRenderedQuiz();
      /* app.js registered its router before this layer; give it one explicit
         render pass after all 227 routes have been materialised. */
      if (LS.ui && typeof LS.ui.route === "function") LS.ui.route();
      else window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }

  window.addEventListener("hashchange", function () {
    setTimeout(normalizeAndRender, 0);
  });
  window.addEventListener("load", function () {
    setTimeout(normalizeAndRender, 0);
  });
  setTimeout(normalizeAndRender, 0);

  /* The generated canonical curriculum is the source of truth: 11 levels,
     35 modules and 227 topics. Never silently replace it with a smaller list. */
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
    document.querySelectorAll(".side-roadmap p").forEach(function (p) { p.textContent = "11 levels · " + n + " interactive topics"; });
  });
})();