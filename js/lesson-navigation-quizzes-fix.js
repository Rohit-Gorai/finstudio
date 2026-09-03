/* FinStudio — quiz data integrity boundary.
   Only fixes topic/quiz synchronization. Existing authored MCQs are preserved.
   Generated generic topic-name quizzes are removed rather than reused. */
(function () {
  "use strict";
  var LS = window.LS = window.LS || {};
  if (!LS.curriculumMap || !LS.lessons) return;

  function clone(v) {
    if (v === null || typeof v !== "object") return v;
    if (Array.isArray(v)) return v.map(clone);
    var out = {};
    Object.keys(v).forEach(function (k) { out[k] = clone(v[k]); });
    return out;
  }
  function plain(v) {
    var d = document.createElement("div");
    d.innerHTML = String(v == null ? "" : v);
    return (d.textContent || d.innerText || "").replace(/\s+/g, " ").trim();
  }
  function isGenericQuiz(q) {
    if (!q || q.t !== "mcq") return false;
    var text = plain(q.q);
    return /^What is the best first step when analysing /i.test(text) ||
      /^Which approach gives the strongest finance explanation of /i.test(text) ||
      /^What should you do when a result looks unusually strong\?/i.test(text);
  }

  /* all-topic-routes historically created shallow copies. Detach each
     canonical topic lesson so one topic's quiz array can never be another
     topic's array. */
  (LS.curriculumMap || []).forEach(function (lv) {
    (lv.modules || []).forEach(function (mod) {
      (mod.topics || []).forEach(function (topic) {
        if (!topic.id || !LS.lessons[topic.id]) return;
        var lesson = clone(LS.lessons[topic.id]);
        lesson.id = topic.id;
        lesson.title = topic.title || lesson.title;
        lesson.body = (lesson.body || []).filter(function (block) { return !isGenericQuiz(block); });
        LS.lessons[topic.id] = lesson;
      });
    });
  });

  /* Clear only transient MCQ answer markers before the normal hash router
     renders the incoming topic. Capture phase is intentional: app.js's route
     listener runs in the normal bubble phase afterwards. Persistent lesson
     completion and sandbox/practice state are left untouched. */
  function clearQuizState(id) {
    try {
      var record = LS.store && LS.store.lesson ? LS.store.lesson(id) : null;
      if (!record || !record.items) return;
      Object.keys(record.items).forEach(function (key) {
        if (/^mcq\d+$/.test(key) || /^quiz[-:]/i.test(key)) delete record.items[key];
      });
    } catch (e) {}
  }
  function currentLessonId() {
    var id = String(location.hash || "").replace(/^#\/?/, "");
    return LS.lessons[id] ? id : null;
  }
  var previous = currentLessonId();
  window.addEventListener("hashchange", function () {
    var next = currentLessonId();
    if (!next || next === previous) return;
    previous = next;
    clearQuizState(next);
  }, true);
})();