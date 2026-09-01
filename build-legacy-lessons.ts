/**
 * Emits the legacy (vanilla-JS) lesson files that the LIVE site loads, from the
 * same authored data the React app uses. One source of truth, two renderers.
 *
 * Outputs:
 *   js/lessons/curriculum-map.js  — all 11 levels / 35 modules / 227 topics for the left pane
 *   js/lessons/concepts-l0.js     — authored Level 0 lessons in LS.lessons format
 *   js/lessons/concepts-l1.js     — authored Level 1 lessons in LS.lessons format
 *
 * Run: npx vite-node scripts/build-legacy-lessons.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { allLessons } from "../src/data/lessons/registry";
import { getActivities } from "../src/data/lessons/activities";
import { curriculum } from "../src/data/masterCurriculum";
import type { Lesson } from "../src/data/lessons/types";

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");
const q = (s: string) => `"${esc(s)}"`;

/** Legacy ids already in the live site — never re-emit or shadow these. */
const RESERVED = new Set(
  ["1010-five-buckets","1020-accounting-equation","1030-two-sides","1040-three-statements",
   "1110-ppe","1120-depreciation","1130-inventory","1140-receivables","1150-cash-deposit",
   "1210-payables","1220-borrowings","1230-right-hand-side","1310-share-capital",
   "1320-retained-earnings","1330-balance-sheet","1410-revenue","1420-cogs","1430-opex-ebitda",
   "1440-depreciation-pl","1450-interest-tax","1460-pl-capstone","1510-profit-not-cash",
   "1520-cfo","1530-cfi","1540-cff","1550-cf-capstone","1610-margins","1620-liquidity",
   "1630-leverage","1640-returns","2110-three-bridges","2120-linked-model","2130-broken-link",
   "2210-drivers","2220-project-pl","2230-fcff","2240-dcf","2250-valuation-capstone"],
);

/** Prefix concept lessons so they can never collide with the café lesson ids. */
const conceptId = (lesson: Lesson) => `c-${lesson.id}`;

function bodyFor(lesson: Lesson): string {
  const acts = getActivities(lesson.id);
  const blocks: string[] = [];

  blocks.push(`{ t: "h2", text: "What is this?" }`);
  blocks.push(`{ t: "p", h: ${q(lesson.concept ?? "")} }`);
  blocks.push(`{ t: "h2", text: "Why does it matter?" }`);
  blocks.push(`{ t: "p", h: ${q(lesson.whyItMatters ?? "")} }`);

  if (lesson.howItWorks?.length) {
    blocks.push(`{ t: "h2", text: "How does it work?" }`);
    const steps = lesson.howItWorks
      .map((s, i) => `${i + 1}. ${esc(s)}`)
      .join("<br><br>");
    blocks.push(`{ t: "p", h: "${steps}" }`);
  }

  if (lesson.formula) {
    const lines = [
      `<b>${esc(lesson.formula.expression)}</b>`,
      ...lesson.formula.variables.map((v) => `${esc(v.symbol)} = ${esc(v.meaning)}`),
    ].map((l) => `"${l}"`).join(", ");
    blocks.push(
      `{ t: "formula", title: ${q(lesson.formula.calculates)}, lines: [${lines}] }`,
    );
  }

  if (lesson.example) {
    const steps = lesson.example.steps.map((s) => `<li>${esc(s)}</li>`).join("");
    blocks.push(
      `{ t: "example", h: "<p>${esc(lesson.example.setup)}</p><ol>${steps}</ol>` +
        `<p><strong>What it means.</strong> ${esc(lesson.example.meaning)}</p>" }`,
    );
  }

  if (lesson.keyTerms?.length) {
    blocks.push(`{ t: "h2", text: "Key terms" }`);
    for (const k of lesson.keyTerms) {
      blocks.push(`{ t: "def", term: ${q(k.term)}, h: ${q(k.definition)} }`);
    }
  }

  // Practice — topic-specific exercises with worked solutions, revealed on click.
  if (acts?.practice.length) {
    blocks.push(`{ t: "h2", text: "Practice" }`);
    for (const [i, p] of acts.practice.entries()) {
      blocks.push(
        `{ t: "note", h: "<strong>Exercise ${i + 1}.</strong> ${esc(p.question)}` +
          `<details style=\\"margin-top:.6rem\\"><summary>Show worked solution</summary>` +
          `<p style=\\"margin-top:.5rem\\">${esc(p.solution)}</p></details>" }`,
      );
    }
  }

  if (lesson.takeaways?.length) {
    blocks.push(`{ t: "h2", text: "What to remember" }`);
    blocks.push(
      `{ t: "note", h: "${lesson.takeaways.map((t) => esc(t)).join("<br>• ")}" }`,
    );
  }

  if (lesson.commonMistakes?.length) {
    blocks.push(`{ t: "h2", text: "Common mistakes" }`);
    blocks.push(`{ t: "p", h: "${lesson.commonMistakes.map((m) => esc(m)).join("<br><br>")}" }`);
  }

  if (lesson.jurisdictionNote) {
    blocks.push(`{ t: "where", h: ${q(lesson.jurisdictionNote)} }`);
  }

  // Quiz — every option carries its own explanation, as the engine expects.
  if (acts?.quiz.length) {
    for (const item of acts.quiz) {
      const opts = item.choices.map((c) => q(c)).join(", ");
      const why = item.choices
        .map((_, i) =>
          i === item.answer
            ? q(`Correct. ${item.explanation}`)
            : q(`Not this one. ${item.explanation}`),
        )
        .join(", ");
      blocks.push(
        `{ t: "mcq", q: ${q(item.question)}, opts: [${opts}], correct: ${item.answer}, why: [${why}] }`,
      );
    }
  }

  return blocks.join(",\n      ");
}

function emitLevel(level: number, path: string) {
  const lessons = allLessons
    .filter((l) => l.level === level && l.status === "authored")
    .sort((a, b) => a.order - b.order);

  const entries = lessons.map((lesson) => {
    const id = conceptId(lesson);
    if (RESERVED.has(id)) throw new Error(`id collision with live lesson: ${id}`);
    return `  LS.lessons[${q(id)}] = {
    id: ${q(id)}, minutes: 5,
    title: ${q(lesson.title)},
    short: ${q(lesson.title)},
    desc: ${q(lesson.summary)},
    lede: ${q((lesson.concept ?? lesson.summary).split(". ")[0] + ".")},
    body: [
      ${bodyFor(lesson)}
    ]
  };`;
  });

  writeFileSync(
    path,
    `/* Generated by scripts/build-legacy-lessons.ts — do not edit by hand.
   Level ${level} concept lessons, rendered by the existing lesson engine. */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});
  LS.lessons = LS.lessons || {};

${entries.join("\n\n")}
})();
`,
  );
  return lessons.length;
}

/** The full 11-level map the left pane renders, with ids the router can resolve. */
function emitCurriculumMap(path: string) {
  const levels = curriculum.map((level) => {
    const modules = level.modules.map((mod) => {
      const topics = mod.topics.map((title) => {
        const lesson = allLessons.find(
          (l) => l.level === level.level && l.module === mod.title && l.title === title,
        );
        if (!lesson) throw new Error(`no registry lesson for ${level.level}/${mod.title}/${title}`);
        const id = conceptId(lesson);
        const written = lesson.status === "authored";
        return `{ title: ${q(title)}, id: ${q(id)}, written: ${written} }`;
      });
      return `      { title: ${q(mod.title)}, topics: [\n        ${topics.join(",\n        ")}\n      ] }`;
    });
    return `    { level: ${level.level}, title: ${q(level.title)}, modules: [\n${modules.join(",\n")}\n    ] }`;
  });

  writeFileSync(
    path,
    `/* Generated by scripts/build-legacy-lessons.ts — do not edit by hand.
   All 11 levels, 35 modules and 227 topics, for the left curriculum pane.
   "written: false" means the concept lesson is not authored yet; the pane
   shows the topic but does not link it, so no route can 404. */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});
  LS.curriculumMap = [
${levels.join(",\n")}
  ];
})();
`,
  );
  return curriculum.reduce(
    (n, l) => n + l.modules.reduce((m, mod) => m + mod.topics.length, 0),
    0,
  );
}

mkdirSync("js/lessons", { recursive: true });
const l0 = emitLevel(0, "js/lessons/concepts-l0.js");
const l1 = emitLevel(1, "js/lessons/concepts-l1.js");
const topics = emitCurriculumMap("js/lessons/curriculum-map.js");
console.log(`emitted L0=${l0} L1=${l1} authored; curriculum map topics=${topics}`);
