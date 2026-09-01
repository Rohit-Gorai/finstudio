import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "../src/app/RootLayout";
import { LessonPage } from "../src/app/routes/LessonPage";
import { allLessons, findLesson, neighbours } from "../src/data/lessons/registry";
import { allActivityIds, getActivities } from "../src/data/lessons/activities";
import { computeSandbox, sandboxKinds } from "../src/data/lessons/sandboxEngine";
import { curriculum } from "../src/data/masterCurriculum";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

describe("left curriculum pane", () => {
  const router = createMemoryRouter(
    [{ path: "/", element: createElement(RootLayout), children: [{ index: true, element: createElement("div") }] }],
    { initialEntries: ["/"] },
  );
  const html = renderToString(createElement(RouterProvider, { router }));

  it("shows every curriculum level — none merged, hidden or dropped", () => {
    expect(curriculum.length).toBe(11); // Levels 0–10
    for (const level of curriculum) {
      expect(html, `Level ${level.level} missing from sidebar`).toContain(esc(level.title));
    }
  });

  it("shows every module within the levels", () => {
    for (const level of curriculum) {
      for (const mod of level.modules) {
        expect(html, `Module "${mod.title}" (L${level.level}) missing`).toContain(esc(mod.title));
      }
    }
  });
});

describe("previous / next navigation", () => {
  it("links every lesson to its neighbours with no gaps, across all 227", () => {
    const ordered = [...allLessons].sort((a, b) => a.order - b.order);
    for (let i = 0; i < ordered.length; i++) {
      const { previous, next } = neighbours(ordered[i]!);
      expect(previous?.id).toBe(i > 0 ? ordered[i - 1]!.id : undefined);
      expect(next?.id).toBe(i < ordered.length - 1 ? ordered[i + 1]!.id : undefined);
    }
  });

  it("crosses level boundaries: last topic of one level points to the first of the next", () => {
    for (let lv = 0; lv < curriculum.length - 1; lv++) {
      const thisLevel = allLessons.filter((l) => l.level === lv).sort((a, b) => a.order - b.order);
      const nextLevel = allLessons.filter((l) => l.level === lv + 1).sort((a, b) => a.order - b.order);
      const { next } = neighbours(thisLevel[thisLevel.length - 1]!);
      expect(next?.id, `boundary L${lv}→L${lv + 1}`).toBe(nextLevel[0]!.id);
    }
  });
});

describe("topic activities", () => {
  it("attaches only to lessons that exist (no orphan activity data)", () => {
    for (const id of allActivityIds()) {
      expect(findLesson(id), `orphan activities for "${id}"`).toBeDefined();
    }
  });

  it("gives every authored lesson at least 3 practice items and a 3-question quiz", () => {
    const authored = allLessons.filter((l) => l.status === "authored");
    expect(authored.length).toBeGreaterThanOrEqual(43);
    for (const lesson of authored) {
      const a = getActivities(lesson.id);
      expect(a, `no activities for authored lesson "${lesson.id}"`).toBeDefined();
      expect(a!.practice.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(a!.quiz.length, lesson.id).toBeGreaterThanOrEqual(3);
      for (const p of a!.practice) {
        expect(p.question.length, lesson.id).toBeGreaterThan(20);
        expect(p.solution.length, lesson.id).toBeGreaterThan(20);
      }
    }
  });

  it("has valid, explained quizzes", () => {
    for (const id of allActivityIds()) {
      for (const q of getActivities(id)!.quiz) {
        expect(q.choices.length, id).toBeGreaterThanOrEqual(3);
        expect(q.answer, id).toBeGreaterThanOrEqual(0);
        expect(q.answer, id).toBeLessThan(q.choices.length);
        expect(q.explanation.length, id).toBeGreaterThan(20);
      }
    }
  });

  it("is topic-specific: no question is reused across topics", () => {
    const seen = new Map<string, string>();
    for (const id of allActivityIds()) {
      const a = getActivities(id)!;
      for (const text of [...a.quiz.map((q) => q.question), ...a.practice.map((p) => p.question)]) {
        expect(seen.get(text), `"${text}" appears in both ${seen.get(text)} and ${id}`).toBeUndefined();
        seen.set(text, id);
      }
    }
  });

  it("references only sandbox kinds the engine implements", () => {
    for (const id of allActivityIds()) {
      const sb = getActivities(id)!.sandbox;
      if (!sb) continue;
      expect(sandboxKinds[sb.kind], `unknown sandbox kind "${sb.kind}" on ${id}`).toBeDefined();
      expect(sb.fields.length, id).toBeGreaterThan(0);
      // Every sandbox must produce output from its own defaults.
      const values = Object.fromEntries(sb.fields.map((f) => [f.key, f.defaultValue]));
      expect(computeSandbox(sb.kind, values).length, id).toBeGreaterThan(0);
    }
  });
});

describe("sandbox engine math", () => {
  it("compounds correctly", () => {
    const out = computeSandbox("future-value", { principal: 100000, rate: 10, years: 2 });
    expect(out[0]!.value).toBe("₹1,21,000");
  });
  it("discounts correctly", () => {
    const out = computeSandbox("present-value", { amount: 121000, rate: 10, years: 2 });
    expect(out[0]!.value).toBe("₹1,00,000");
  });
  it("computes straight-line depreciation", () => {
    const out = computeSandbox("depreciation", { cost: 1200000, residual: 120000, usefulLife: 6, yearsElapsed: 3 });
    expect(out[0]!.value).toBe("₹1,80,000"); // annual charge
    expect(out[2]!.value).toBe("₹6,60,000"); // net book value
  });
  it("derives equity as the residual", () => {
    const out = computeSandbox("balance", { assets: 1500, liabilities: 900 });
    expect(out[0]!.value).toBe("₹600");
  });
});

describe("activities render on the lesson page", () => {
  it("shows Practice, Sandbox and Quiz for a lesson that has them", () => {
    const router = createMemoryRouter(
      [{ path: "/lesson/:lessonId", element: createElement(LessonPage) }],
      { initialEntries: ["/lesson/compounding"] },
    );
    const html = renderToString(createElement(RouterProvider, { router }));
    expect(html).toContain("Work it yourself");
    expect(html).toContain("Change the numbers");
    expect(html).toContain("Check your understanding");
  });

  it("omits those sections, without filler, for a lesson that lacks them", () => {
    const outline = allLessons.find((l) => l.status === "outline" && !getActivities(l.id))!;
    const router = createMemoryRouter(
      [{ path: "/lesson/:lessonId", element: createElement(LessonPage) }],
      { initialEntries: [`/lesson/${outline.id}`] },
    );
    const html = renderToString(createElement(RouterProvider, { router }));
    expect(html).not.toContain("Check your understanding");
  });
});
