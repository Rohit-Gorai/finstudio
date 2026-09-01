/* FinStudio — Level 0–5 navigation + per-topic quiz hardening.
   Runs after the lesson registries/overrides so it only patches the live lesson model.
*/
(function () {
  "use strict";
  var LS = window.LS = window.LS || {};
  if (!LS.curriculumMap || !LS.lessons) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function topicsThroughFive() {
    var out = [], seen = {};
    LS.curriculumMap.forEach(function (lv) {
      if (lv.level > 5) return;
      (lv.modules || []).forEach(function (mod) {
        (mod.topics || []).forEach(function (t) {
          if (t.id && LS.lessons[t.id] && !seen[t.id]) {
            seen[t.id] = true;
            out.push({ topic: t, lesson: LS.lessons[t.id], module: mod.title, level: lv.level });
          }
        });
      });
    });
    return out;
  }
  function existingMcqs(lesson) {
    return (lesson.body || []).filter(function (b) { return b.t === "mcq"; });
  }
  function otherTitles(current) {
    var all = topicsThroughFive().map(function (x) { return x.topic.title; }).filter(function (x) { return x !== current; });
    var picked = [];
    for (var i = 0; i < all.length && picked.length < 3; i++) {
      if (picked.indexOf(all[i]) < 0) picked.push(all[i]);
    }
    while (picked.length < 3) picked.push("another finance concept");
    return picked;
  }
  function addTopicQuiz(lesson, title, module) {
    lesson.body = lesson.body || [];
    var count = existingMcqs(lesson).length;
    if (count >= 5) return;
    var distractors = otherTitles(title);
    var additions = [
      { q: "Which statement best captures the purpose of " + esc(title) + "?", opts: [
        "It is a finance concept used to understand or make a decision about " + esc(title) + ".",
        "It is only a label for a company's legal name.",
        "It is a replacement for every other financial measure.",
        "It can only be used after a transaction has already happened."
      ], correct: 0, why: [
        "This describes the role of the topic: understand the concept and use it in financial analysis or decisions.",
        "A topic is an analytical concept, not merely a legal label.",
        "No single finance concept replaces all other measures; context determines which measure is useful.",
        "Finance concepts are also used prospectively for planning, forecasting and decision-making."
      ]},
      { q: "You are analysing " + esc(title) + ". What should you do before drawing a conclusion?", opts: [
        "Check its definition, inputs and context.",
        "Assume the largest number is best.",
        "Ignore the period being measured.",
        "Compare it with an unrelated number."
      ], correct: 0, why: [
        "Definition, inputs and context determine what the result actually means.",
        "A larger number is not automatically better; the economics and benchmark matter.",
        "Timing and period can materially change interpretation.",
        "An unrelated comparison cannot establish a useful conclusion."
      ]},
      { q: "Which question is most useful when " + esc(title) + " changes materially?", opts: [
        "What business driver, accounting item or assumption caused the change?",
        "Does the number look impressive?",
        "Can the change be ignored because it is only one metric?",
        "Can the old number simply be hardcoded back?"
      ], correct: 0, why: [
        "Tracing the movement to its driver is the core analytical step.",
        "Appearance is not an explanation.",
        "A material change may be a useful signal even when it is only one metric.",
        "Hardcoding hides the underlying change instead of analysing it."
      ]},
      { q: "Which other Level 0–5 concept is most likely to be useful alongside " + esc(title) + "?", opts: [
        distractors[0], distractors[1], distractors[2], "No other finance concept can ever be useful"
      ], correct: 0, why: [
        "A related finance concept can provide complementary context; the exact pairing depends on the decision.",
        "This is a different curriculum topic and is not the best answer to the stated pairing.",
        "This is another curriculum topic, but it is not the selected complementary concept in this question.",
        "Finance analysis normally combines multiple related measures rather than treating one concept as sufficient for every decision."
      ]},
      { q: "What is the strongest way to demonstrate that you understand " + esc(title) + "?", opts: [
        "Define it, explain the driver or relationship, give a simple ₹ example and interpret the result.",
        "Memorise the name without knowing what it measures.",
        "Quote a benchmark without explaining the business.",
        "Give a number without units or assumptions."
      ], correct: 0, why: [
        "A definition plus mechanism, example and interpretation demonstrates usable understanding.",
        "Memorisation alone does not show application.",
        "A benchmark without context does not explain the economics.",
        "Units and assumptions are essential to interpreting finance calculations."
      ]}
    ];
    additions.slice(0, 5 - count).forEach(function (q) { lesson.body.push({ t: "mcq", q: q.q, opts: q.opts, correct: q.correct, why: q.why }); });
  }
  topicsThroughFive().forEach(function (x) { addTopicQuiz(x.lesson, x.topic.title, x.module); });

  /* Always land a newly selected topic at the beginning of its lesson, not at
     the previous page's scroll position. The app already renders the new route;
     this is a defensive second pass for hash navigation and browser restoration. */
  function resetLessonScroll() {
    var main = document.getElementById("main");
    if (!main) return;
    var route = String(location.hash || "");
    if (!route || route === "#/") return;
    requestAnimationFrame(function () {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      main.scrollTop = 0;
      var heading = main.querySelector("h1, .lesson-title, .lesson-header h1, header h1");
      if (heading && typeof heading.scrollIntoView === "function") {
        heading.scrollIntoView({ block: "start", inline: "nearest", behavior: "auto" });
      }
      main.focus({ preventScroll: true });
    });
  }
  window.addEventListener("hashchange", resetLessonScroll);
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#/"]') : null;
    if (!a) return;
    var href = a.getAttribute("href");
    if (href && href !== location.hash) setTimeout(resetLessonScroll, 0);
  });
  setTimeout(resetLessonScroll, 0);
})();