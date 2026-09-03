/* FinStudio — hard isolation between lesson routes.
   A topic change is a new learning session: never let the previous lesson's
   rendered quiz DOM/state survive a hash-only navigation. This intentionally
   uses the existing hash architecture and does not alter lesson content.
*/
(function () {
  "use strict";
  var LS = window.LS = window.LS || {};
  var RELOADING = "finstudio-topic-route-reload";

  function topicFromHash() {
    var h = String(window.location.hash || "").replace(/^#\/?/, "");
    if (!h || h === "curriculum" || h === "glossary" || h.indexOf("module/") === 0 ||
        h.indexOf("quiz/") === 0 || h.indexOf("ref/") === 0 || h.indexOf("lab/") === 0 ||
        h.indexOf("cases/") === 0) return null;
    return LS.lessons && LS.lessons[h] ? h : null;
  }

  function clearQuizSelections(id) {
    /* The legacy renderer stores MCQ completion under lesson.items as mcq0,
       mcq1, ... . Delete only those transient quiz markers; practice answers,
       sandbox work, and broader lesson progress remain untouched. */
    try {
      var store = LS.store;
      if (!store || typeof store.lesson !== "function") return;
      var record = store.lesson(id);
      if (!record || !record.items) return;
      Object.keys(record.items).forEach(function (key) {
        if (/^mcq\d+$/.test(key)) delete record.items[key];
      });
      /* Also remove any old quiz markers created by earlier implementations. */
      Object.keys(record.items).forEach(function (key) {
        if (/^quiz[-:]/i.test(key)) delete record.items[key];
      });
    } catch (e) {}
  }

  var previous = topicFromHash();

  window.addEventListener("hashchange", function () {
    var next = topicFromHash();
    if (!next || next === previous) return;
    previous = next;

    clearQuizSelections(next);

    /* Hash routes are normally rendered in-place by the legacy app. A full
       reload here is deliberate: it guarantees every DOM node, event handler,
       quiz answer, feedback message and renderer-local variable belongs to the
       newly selected topic. It also fixes browser back/forward navigation. */
    try { sessionStorage.setItem(RELOADING, "1"); } catch (e) {}
    window.location.reload();
  });

  /* Defensive cleanup if an older route implementation left quiz classes or
     feedback in the DOM while switching without a hashchange. */
  window.addEventListener("pageshow", function () {
    try { sessionStorage.removeItem(RELOADING); } catch (e) {}
    var main = document.getElementById("main");
    if (!main) return;
    main.querySelectorAll(".mcq-explain").forEach(function (n) { n.remove(); });
    main.querySelectorAll(".mcq-opts button").forEach(function (b) {
      b.classList.remove("picked-right", "picked-wrong");
    });
  });
})();