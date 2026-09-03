/* FinStudio — per-topic quiz engine + route isolation.
   Visual/routing architecture stays unchanged. Every lesson receives quiz
   questions derived from its OWN authored practice/definition content, so the
   quiz cannot fall back to the same generic questions on every topic.
*/
(function () {
  "use strict";
  var LS = window.LS = window.LS || {};
  if (!LS.curriculumMap || !LS.lessons) return;

  function topicsThroughTen() {
    var out = [], seen = {};
    (LS.curriculumMap || []).forEach(function (lv) {
      (lv.modules || []).forEach(function (mod) {
        (mod.topics || []).forEach(function (t) {
          if (t.id && LS.lessons[t.id] && !seen[t.id]) {
            seen[t.id] = true;
            out.push({ id: t.id, title: t.title || LS.lessons[t.id].title, lesson: LS.lessons[t.id] });
          }
        });
      });
    });
    return out;
  }

  function strip(s) {
    var d = document.createElement("div");
    d.innerHTML = String(s == null ? "" : s);
    return (d.textContent || d.innerText || "").replace(/\s+/g, " ").trim();
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
  }

  function mcqs(lesson) {
    return (lesson.body || []).filter(function (b) { return b && b.t === "mcq"; });
  }

  function practices(lesson) {
    var out = [];
    (lesson.body || []).forEach(function (b) {
      if (!b) return;
      if (b.t === "practice" && Array.isArray(b.items)) {
        b.items.forEach(function (x) {
          if (x && x.q && x.a) out.push({ q: strip(x.q), a: strip(x.a) });
        });
      }
    });
    return out;
  }

  function definitions(lesson) {
    var out = [];
    (lesson.body || []).forEach(function (b) {
      if (b && b.t === "def" && b.term && b.h) out.push({ term: strip(b.term), h: strip(b.h) });
    });
    return out;
  }

  function paragraphs(lesson) {
    var out = [];
    (lesson.body || []).forEach(function (b) {
      if (b && b.t === "p" && b.h) {
        var text = strip(b.h);
        if (text.length >= 45) out.push(text);
      }
    });
    return out;
  }

  var all = topicsThroughTen();

  function answerPool(currentId) {
    var pool = [];
    all.forEach(function (x) {
      if (x.id === currentId) return;
      practices(x.lesson).forEach(function (p) {
        if (p.a && p.a.length > 15) pool.push(p.a);
      });
    });
    return pool;
  }

  function unique(arr) {
    var seen = {}, out = [];
    arr.forEach(function (x) {
      var k = String(x).toLowerCase();
      if (x && !seen[k]) { seen[k] = true; out.push(x); }
    });
    return out;
  }

  /* Build genuinely topic-specific MCQs from material already authored for
     that lesson. We prefer its practice questions, then its definitions and
     explanatory paragraphs. No generic "what is the purpose of X?" fallback. */
  function buildTopicQuiz(item) {
    var lesson = item.lesson, title = item.title;
    var authored = mcqs(lesson);
    if (authored.length >= 3) return authored;

    var result = authored.slice();
    var used = {};
    result.forEach(function (q) { used[strip(q.q).toLowerCase()] = true; });
    var localPractice = practices(lesson);
    var localDefs = definitions(lesson);
    var localParas = paragraphs(lesson);
    var pool = answerPool(item.id);

    /* Each practice question becomes a quiz question with its real authored
       solution as the correct choice. Distractors are taken from other lessons,
       so both the question and answer set are different by topic. */
    localPractice.forEach(function (p) {
      if (result.length >= 5 || used[p.q.toLowerCase()]) return;
      var distractors = [];
      for (var i = 0; i < pool.length && distractors.length < 3; i++) {
        if (pool[i].toLowerCase() !== p.a.toLowerCase() && distractors.indexOf(pool[i]) < 0) distractors.push(pool[i]);
      }
      if (distractors.length < 3) return;
      result.push({
        t: "mcq",
        q: "Practice check — " + p.q,
        opts: [p.a, distractors[0], distractors[1], distractors[2]],
        correct: 0,
        why: ["Correct. This is the worked answer from the " + title + " lesson.", "This answer belongs to a different finance concept and does not answer this topic's practice question.", "This is a distractor drawn from another lesson; compare it with the worked solution above.", "This is another lesson's solution, not the answer to the question you were asked."]
      });
      used[p.q.toLowerCase()] = true;
    });

    /* Definition checks are built from the lesson's own terminology. */
    localDefs.forEach(function (d) {
      if (result.length >= 5) return;
      var key = d.term.toLowerCase();
      if (used[key]) return;
      var wrong = unique(localDefs.filter(function (x) { return x.term.toLowerCase() !== key; }).map(function (x) { return x.h; }));
      if (wrong.length < 3) {
        wrong = unique(pool.slice());
      }
      if (wrong.length < 3) return;
      result.push({
        t: "mcq",
        q: "In the context of " + title + ", which explanation best defines " + d.term + "?",
        opts: [d.h, wrong[0], wrong[1], wrong[2]],
        correct: 0,
        why: ["Correct — this definition comes directly from this topic's lesson.", "Not the definition used for this term in this lesson.", "Not the definition used for this term in this lesson.", "Not the definition used for this term in this lesson."]
      });
      used[key] = true;
    });

    /* Final fallback still uses the lesson's own prose, so even short lessons
       never receive the old identical generic quiz. */
    var paraIndex = 0;
    while (result.length < 3 && paraIndex < localParas.length) {
      var paragraph = localParas[paraIndex++];
      if (!paragraph || paragraph.length < 45) continue;
      var sentence = paragraph.split(/(?<=[.!?])\s+/)[0] || paragraph;
      var wrongs = unique(pool.filter(function (x) { return x.toLowerCase() !== sentence.toLowerCase(); }));
      if (wrongs.length < 3) continue;
      result.push({
        t: "mcq",
        q: "Which statement is supported by the " + title + " lesson?",
        opts: [sentence, wrongs[0], wrongs[1], wrongs[2]],
        correct: 0,
        why: ["Correct — this point is explicitly taught in this topic.", "This comes from a different lesson.", "This comes from a different lesson.", "This comes from a different lesson."]
      });
    }
    return result;
  }

  /* Replace only synthetic/generic MCQs created by the old fix. Authored MCQs
     stay untouched; otherwise every topic is rebuilt from its own content. */
  all.forEach(function (item) {
    var lesson = item.lesson;
    lesson.body = lesson.body || [];
    var existing = mcqs(lesson);
    var hasOldGeneric = existing.some(function (q) {
      return /^Which statement best captures the purpose of /i.test(strip(q.q)) ||
             /^You are analysing /i.test(strip(q.q)) ||
             /^Which question is most useful when /i.test(strip(q.q)) ||
             /^What is the strongest way to demonstrate/i.test(strip(q.q));
    });
    if (hasOldGeneric) {
      lesson.body = lesson.body.filter(function (b) { return !(b && b.t === "mcq"); });
      existing = [];
    }
    var quiz = buildTopicQuiz({ id: item.id, title: item.title, lesson: lesson });
    if (quiz.length) {
      /* Keep one quiz block at the end of the authored lesson body. */
      lesson.body = lesson.body.filter(function (b) { return !(b && b.t === "mcq"); });
      quiz.slice(0, 5).forEach(function (q) { lesson.body.push(q); });
    }
  });

  /* -------------------- route / transient-state isolation -------------------- */
  function currentTopicId() {
    var raw = String(location.hash || "").replace(/^#\/?/, "");
    return raw && LS.lessons[raw] ? raw : null;
  }

  function clearTransientQuiz(id) {
    try {
      if (!LS.store || typeof LS.store.lesson !== "function") return;
      var r = LS.store.lesson(id);
      if (!r || !r.items) return;
      Object.keys(r.items).forEach(function (k) {
        if (/^mcq\d+$/.test(k) || /^quiz[-:]/i.test(k)) delete r.items[k];
      });
    } catch (e) {}
  }

  var last = currentTopicId();
  window.addEventListener("hashchange", function () {
    var next = currentTopicId();
    if (!next || next === last) return;
    last = next;
    clearTransientQuiz(next);
    /* A fresh route guarantees no old quiz DOM, selected buttons or feedback
       can bleed into the newly selected topic. */
    try { sessionStorage.setItem("finstudio-topic-route-reload", "1"); } catch (e) {}
    window.location.reload();
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