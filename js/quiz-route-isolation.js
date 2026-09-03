/* FinStudio — hard isolation between lesson routes + canonical topic navigation. */
(function () {
  "use strict";
  var LS = window.LS = window.LS || {};

  function slug(s) { return String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function canonicalFor(raw) {
    if (!LS.curriculumMap) return null;
    var wanted = String(raw || "").replace(/^#\/?topic\//, "");
    var found = null;
    LS.curriculumMap.some(function (lv) {
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

  /* Level 0 has authored lessons under legacy ids. Convert roadmap /topic links
     to those canonical lesson ids before any legacy template listener runs. */
  document.addEventListener("click", function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href^="#/topic/"]') : null;
    if (!a) return;
    var canonical = canonicalFor(a.getAttribute("href"));
    if (!canonical || !LS.lessons || !LS.lessons[canonical]) return;
    ev.preventDefault();
    if (location.hash !== "#/" + canonical) location.hash = "#/" + canonical;
  }, true);

  function currentTopic() {
    var h = String(location.hash || "").replace(/^#\/?/, "");
    if (!h || h === "curriculum" || /^(module|quiz|ref|lab|cases)\//.test(h)) return null;
    return LS.lessons && LS.lessons[h] ? h : null;
  }

  function clearQuiz(id) {
    try {
      var r = LS.store && LS.store.lesson ? LS.store.lesson(id) : null;
      if (!r || !r.items) return;
      Object.keys(r.items).forEach(function (k) {
        if (/^mcq\d+$/.test(k) || /^quiz[-:]/i.test(k)) delete r.items[k];
      });
    } catch (e) {}
  }

  var previous = currentTopic();
  window.addEventListener("hashchange", function () {
    var raw = String(location.hash || "").replace(/^#\/?/, "");
    if (raw.indexOf("topic/") === 0) {
      var canonical = canonicalFor(raw);
      if (canonical) {
        location.hash = "#/" + canonical;
        return;
      }
    }
    var next = currentTopic();
    if (!next || next === previous) return;
    previous = next;
    clearQuiz(next);
    /* Full reload is retained as the final isolation boundary: no prior topic
       DOM, selection, feedback, or renderer-local quiz state can survive. */
    try { sessionStorage.setItem("finstudio-topic-route-reload", "1"); } catch (e) {}
    location.reload();
  });

  window.addEventListener("pageshow", function () {
    try { sessionStorage.removeItem("finstudio-topic-route-reload"); } catch (e) {}
    var main = document.getElementById("main");
    if (!main) return;
    main.querySelectorAll(".mcq-explain").forEach(function (n) { n.remove(); });
    main.querySelectorAll(".mcq-opts button").forEach(function (b) {
      b.classList.remove("picked-right", "picked-wrong");
      b.disabled = false;
    });
  });
})();