/* FinStudio — Level 0–5 navigation + per-topic quiz isolation.
   This runs after the lesson registries and routers are loaded.
   It deliberately treats quiz answers as topic-local UI state: moving to a
   different topic must never carry the previous topic's selected answer,
   feedback, or question DOM into the new lesson.
*/
(function () {
  "use strict";
  var LS = window.LS = window.LS || {};
  if (!LS.curriculumMap || !LS.lessons) return;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
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
    var all = topicsThroughFive()
      .map(function (x) { return x.topic.title; })
      .filter(function (x) { return x !== current; });
    var picked = [];
    for (var i = 0; i < all.length && picked.length < 3; i++) {
      if (picked.indexOf(all[i]) < 0) picked.push(all[i]);
    }
    while (picked.length < 3) picked.push("another finance concept");
    return picked;
  }

  /* Guarantee that every authored Level 0–5 lesson has a topic-specific quiz.
     Existing authored questions are preserved; missing slots are filled with
     questions whose stem explicitly names the current topic. */
  function addTopicQuiz(lesson, title) {
    lesson.body = lesson.body || [];
    var count = existingMcqs(lesson).length;
    if (count >= 5) return;
    var distractors = otherTitles(title);
    var additions = [
      {
        q: "Which statement best captures the purpose of " + esc(title) + "?",
        opts: [
          "It is a finance concept used to understand or make a decision about " + esc(title) + ".",
          "It is only a label for a company's legal name.",
          "It is a replacement for every other financial measure.",
          "It can only be used after a transaction has already happened."
        ],
        correct: 0,
        why: [
          "This describes the role of the topic: understand the concept and use it in financial analysis or decisions.",
          "A topic is an analytical concept, not merely a legal label.",
          "No single finance concept replaces all other measures; context determines which measure is useful.",
          "Finance concepts are also used prospectively for planning, forecasting and decision-making."
        ]
      },
      {
        q: "You are analysing " + esc(title) + ". What should you do before drawing a conclusion?",
        opts: [
          "Check its definition, inputs and context.",
          "Assume the largest number is best.",
          "Ignore the period being measured.",
          "Compare it with an unrelated number."
        ],
        correct: 0,
        why: [
          "Definition, inputs and context determine what the result actually means.",
          "A larger number is not automatically better; the economics and benchmark matter.",
          "Timing and period can materially change interpretation.",
          "An unrelated comparison cannot establish a useful conclusion."
        ]
      },
      {
        q: "Which question is most useful when " + esc(title) + " changes materially?",
        opts: [
          "What business driver, accounting item or assumption caused the change?",
          "Does the number look impressive?",
          "Can the change be ignored because it is only one metric?",
          "Can the old number simply be hardcoded back?"
        ],
        correct: 0,
        why: [
          "Tracing the movement to its driver is the core analytical step.",
          "Appearance is not an explanation.",
          "A material change may be a useful signal even when it is only one metric.",
          "Hardcoding hides the underlying change instead of analysing it."
        ]
      },
      {
        q: "Which other Level 0–5 concept is most likely to be useful alongside " + esc(title) + "?",
        opts: [distractors[0], distractors[1], distractors[2], "No other finance concept can ever be useful"],
        correct: 0,
        why: [
          "A related finance concept can provide complementary context; the exact pairing depends on the decision.",
          "This is a different curriculum topic and is not the selected complementary concept in this question.",
          "This is another curriculum topic, but it is not the selected complementary concept in this question.",
          "Finance analysis normally combines multiple related measures rather than treating one concept as sufficient for every decision."
        ]
      },
      {
        q: "What is the strongest way to demonstrate that you understand " + esc(title) + "?",
        opts: [
          "Define it, explain the driver or relationship, give a simple ₹ example and interpret the result.",
          "Memorise the name without knowing what it measures.",
          "Quote a benchmark without explaining the business.",
          "Give a number without units or assumptions."
        ],
        correct: 0,
        why: [
          "A definition plus mechanism, example and interpretation demonstrates usable understanding.",
          "Memorisation alone does not show application.",
          "A benchmark without context does not explain the economics.",
          "Units and assumptions are essential to interpreting finance calculations."
        ]
      }
    ];
    additions.slice(0, 5 - count).forEach(function (q) {
      lesson.body.push({ t: "mcq", q: q.q, opts: q.opts, correct: q.correct, why: q.why });
    });
  }

  topicsThroughFive().forEach(function (x) {
    addTopicQuiz(x.lesson, x.topic.title);
  });

  /* -----------------------------------------------------------------------
     QUIZ STATE ISOLATION

     The legacy renderer persists completed MCQs in the lesson progress store.
     That is useful for completion tracking, but it must never be allowed to
     paint the previous topic's selected answer into the next topic. We keep
     completion data, but clear transient MCQ answer markers whenever the
     learner navigates to a topic. This makes every newly opened topic's quiz
     visually fresh while preserving the lesson's overall progress state.
  ----------------------------------------------------------------------- */
  function clearQuizUiState(lessonId) {
    if (!lessonId || !LS.store || typeof LS.store.lesson !== "function") return;
    try {
      var record = LS.store.lesson(lessonId);
      if (!record || !record.items) return;
      Object.keys(record.items).forEach(function (key) {
        if (/^mcq\d+$/.test(key) || /^quiz[-:]/i.test(key)) delete record.items[key];
      });
    } catch (e) { /* progress storage is intentionally best-effort */ }
  }

  function currentTopicId() {
    var raw = String(location.hash || "").replace(/^#\/?/, "");
    if (!raw || raw === "curriculum" || raw.indexOf("module/") === 0 || raw.indexOf("quiz/") === 0 || raw.indexOf("ref/") === 0) return null;
    return raw;
  }

  var lastTopicId = null;
  var replaying = false;

  function resetTopicTransition() {
    var id = currentTopicId();
    if (!id || !LS.lessons[id]) return;
    if (id === lastTopicId) return;
    lastTopicId = id;

    /* Clear persisted MCQ selections before the second render. The first
       router render may already have happened because multiple legacy route
       listeners exist; the replay below makes the final DOM authoritative. */
    clearQuizUiState(id);

    var main = document.getElementById("main");
    if (main) {
      main.scrollTop = 0;
      main.querySelectorAll(".mcq-block").forEach(function (block) {
        block.querySelectorAll("button").forEach(function (button) {
          button.classList.remove("picked-right", "picked-wrong");
          button.disabled = false;
        });
        var feedback = block.querySelector(".mcq-explain");
        if (feedback) feedback.remove();
      });
    }

    /* There are two legacy-compatible routers in this static site. Replaying
       the same hash event once ensures both routers settle on the same current
       topic after the transient state has been cleared. Guard it so this is
       never an infinite hashchange loop. */
    if (!replaying) {
      replaying = true;
      setTimeout(function () {
        try { window.dispatchEvent(new Event("hashchange")); } catch (e) {}
        setTimeout(function () { replaying = false; }, 0);
      }, 0);
    }
  }

  /* The app's own hashchange listeners run before this script because this file
     is loaded last. Therefore this handler deliberately performs a second,
     clean render pass after navigation. */
  window.addEventListener("hashchange", resetTopicTransition);

  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#/"]') : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    var target = href.replace(/^#\/?/, "");
    if (target && target !== lastTopicId && LS.lessons[target]) {
      /* If the browser is about to fire hashchange, let that handler own the
         rerender. This immediate clear only removes stale visual feedback from
         a fast click while the new route is being resolved. */
      clearQuizUiState(target);
    }
  });

  /* Initial load: if the page opens directly on a topic, give it a clean quiz. */
  setTimeout(resetTopicTransition, 0);
})();