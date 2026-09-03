/* FinStudio — Interview Questions enhancement.
   Uses the existing LS.lessons topic object as the source of truth. It does not
   alter routing, quiz state, scoring, practice, sandbox or curriculum data.
   Interview state is intentionally local to this UI section and is never stored
   in the quiz/progress store. */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function text(s) {
    var d = document.createElement("div");
    d.innerHTML = String(s == null ? "" : s);
    return (d.textContent || d.innerText || "").replace(/\s+/g, " ").trim();
  }

  function currentId() {
    var id = String(location.hash || "").replace(/^#\/?/, "");
    return window.LS && LS.lessons && LS.lessons[id] ? id : null;
  }

  function activeLesson() {
    var id = currentId();
    return id ? { id: id, lesson: LS.lessons[id] } : null;
  }

  function existingInterview(lesson) {
    var out = [];
    (lesson.body || []).forEach(function (b) {
      if (!b) return;
      if (b.t === "interview" && Array.isArray(b.items)) {
        b.items.forEach(function (x) {
          if (x && x.q && x.a) out.push({ q: text(x.q), a: text(x.a), mistake: text(x.mistake || "") });
        });
      }
      /* Some older lessons label a practice block as interview questions.
         Preserve its authored wording rather than generating a generic quiz. */
      if (b.t === "h2" && /interview questions?/i.test(text(b.text))) {
        return;
      }
    });
    return out;
  }

  function practiceQuestions(lesson) {
    var out = [];
    (lesson.body || []).forEach(function (b) {
      if (!b || b.t !== "practice" || !Array.isArray(b.items)) return;
      b.items.forEach(function (item) {
        if (item && item.q && item.a) out.push({ q: text(item.q), a: text(item.a) });
      });
    });
    return out;
  }

  function definitions(lesson) {
    var out = [];
    (lesson.body || []).forEach(function (b) {
      if (b && b.t === "def" && b.term && b.h) {
        out.push({ term: text(b.term), a: text(b.h) });
      }
    });
    return out;
  }

  function examples(lesson) {
    var out = [];
    (lesson.body || []).forEach(function (b) {
      if (b && (b.t === "example" || b.t === "note") && b.h) {
        var v = text(b.h);
        if (v.length > 50) out.push(v);
      }
    });
    return out;
  }

  function mistakes(lesson) {
    var out = [];
    (lesson.body || []).forEach(function (b) {
      if (!b) return;
      if (b.t === "p" && /<li>/i.test(String(b.h || ""))) {
        var d = document.createElement("div"); d.innerHTML = b.h;
        Array.prototype.forEach.call(d.querySelectorAll("li"), function (li) {
          var v = text(li.textContent || "");
          if (v) out.push(v);
        });
      }
    });
    return out;
  }

  function buildQuestions(lesson) {
    var out = existingInterview(lesson);
    var used = {};
    out.forEach(function (x) { used[x.q.toLowerCase()] = true; });

    var ps = practiceQuestions(lesson);
    /* Practice questions are already authored for the exact topic, so they are
       the safest high-quality interview bank when no dedicated bank exists. */
    ps.forEach(function (p) {
      if (out.length >= 5 || used[p.q.toLowerCase()]) return;
      out.push({ q: p.q, a: p.a });
      used[p.q.toLowerCase()] = true;
    });

    /* If a lesson has no practice block, use its own definition and case study
       rather than inventing a generic question that merely swaps the title. */
    var defs = definitions(lesson);
    defs.forEach(function (d) {
      if (out.length >= 3 || used[d.term.toLowerCase()]) return;
      out.push({
        q: "How would you explain " + d.term + " to an interviewer, and what would you use it to assess?",
        a: d.a
      });
      used[d.term.toLowerCase()] = true;
    });

    var ex = examples(lesson);
    if (out.length < 3 && ex.length) {
      out.push({
        q: "Walk me through the real-world example used in this lesson and explain what an analyst should conclude from it.",
        a: ex[0]
      });
    }

    return out.slice(0, 5);
  }

  function render(lesson) {
    var old = document.querySelector(".fs-interview-section");
    if (old) old.parentNode.removeChild(old);
    if (!lesson) return;

    var questions = buildQuestions(lesson);
    if (!questions.length) return;

    var section = document.createElement("section");
    section.className = "fs-interview-section";
    section.setAttribute("aria-labelledby", "fs-interview-title");

    var intro = document.createElement("div");
    intro.className = "fs-interview-intro";
    intro.innerHTML =
      '<div class="fs-interview-kicker">INTERVIEW READINESS</div>' +
      '<h2 id="fs-interview-title">Interview Questions</h2>' +
      '<p>Prepare to explain <strong>' + esc(lesson.title) + '</strong> under pressure. Try answering before revealing the model answer.</p>';
    section.appendChild(intro);

    var list = document.createElement("div");
    list.className = "fs-interview-list";
    var ms = mistakes(lesson);

    questions.forEach(function (item, i) {
      var card = document.createElement("article");
      card.className = "fs-interview-card";
      var difficulty = i === 0 ? "Foundation" : (i < 3 ? "Applied" : "Professional");
      card.innerHTML =
        '<div class="fs-interview-meta"><span class="fs-interview-number">' + String(i + 1).padStart(2, "0") + '</span><span class="fs-interview-level">' + difficulty + '</span></div>' +
        '<h3>' + esc(item.q) + '</h3>' +
        '<button type="button" class="btn btn-ghost fs-interview-reveal" aria-expanded="false">Reveal Answer <span aria-hidden="true">→</span></button>';

      var answer = document.createElement("div");
      answer.className = "fs-interview-answer";
      answer.hidden = true;
      answer.innerHTML =
        '<div class="fs-interview-answer-label">MODEL ANSWER</div>' +
        '<p>' + item.a + '</p>' +
        '<div class="fs-interview-why"><strong>Why this works</strong><p>It answers the question using the lesson’s actual finance logic rather than relying on a memorised definition.</p></div>' +
        (item.mistake || ms[i % Math.max(ms.length, 1)] ? '<div class="fs-interview-mistake"><strong>Common mistake to avoid</strong><p>' + esc(item.mistake || ms[i % ms.length]) + '</p></div>' : "") +
        '<div class="fs-interview-tip"><strong>Interview tip</strong><p>State the concept first, connect it to the business or numbers, then explain the implication.</p></div>';

      var reveal = card.querySelector(".fs-interview-reveal");
      reveal.addEventListener("click", function () {
        var open = !answer.hidden;
        answer.hidden = open;
        reveal.setAttribute("aria-expanded", String(!open));
        reveal.innerHTML = open ? 'Reveal Answer <span aria-hidden="true">→</span>' : 'Hide Answer <span aria-hidden="true">↑</span>';
        if (!open) answer.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });

      card.appendChild(answer);
      list.appendChild(card);
    });

    section.appendChild(list);
    var page = document.querySelector("#main > .page");
    if (!page) return;
    page.appendChild(section);
  }

  function renderCurrent() {
    var item = activeLesson();
    render(item && item.lesson);
  }

  /* app.js owns routing. We only observe it and append the independent
     interview presentation after the lesson has rendered. */
  window.addEventListener("hashchange", function () { setTimeout(renderCurrent, 0); });
  window.addEventListener("pageshow", renderCurrent);
  setTimeout(renderCurrent, 0);
})();