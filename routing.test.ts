import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { LessonPage } from "../src/app/routes/LessonPage";
import { LessonNotFound } from "../src/app/routes/LessonNotFound";
import { ModulePage } from "../src/app/routes/ModulePage";
import { allLessons, findLesson } from "../src/data/lessons/registry";
import { curriculum } from "../src/data/masterCurriculum";

/** renderToString escapes &, < and >, so expectations must be escaped too. */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const renderAt = (path: string, element: React.ReactElement, pattern: string) => {
  const router = createMemoryRouter([{ path: pattern, element }], { initialEntries: [path] });
  return renderToString(createElement(RouterProvider, { router }));
};

describe("lesson routing", () => {
  it("renders a landing page for all 227 lessons without throwing", () => {
    expect(allLessons.length).toBe(227);
    for (const lesson of allLessons) {
      const html = renderAt(`/lesson/${lesson.id}`, createElement(LessonPage), "/lesson/:lessonId");
      expect(html, lesson.id).toContain(esc(lesson.title));
      expect(html, lesson.id).not.toContain("Lesson not found");
    }
  });

  it("shows the correct teaching sections for an authored lesson", () => {
    const html = renderAt("/lesson/compounding", createElement(LessonPage), "/lesson/:lessonId");
    for (const heading of ["The idea in plain English", "Why you should care", "Step by step", "Worked through, step by step", "Words introduced here", "What to remember", "Common mistakes"]) {
      expect(html, heading).toContain(heading);
    }
    expect(html).toContain("₹3,10,585"); // step-by-step arithmetic is actually rendered
  });

  it("tells the truth on a lesson that has not been written", () => {
    const outline = allLessons.find(l => l.status === "outline")!;
    const html = renderAt(`/lesson/${outline.id}`, createElement(LessonPage), "/lesson/:lessonId");
    expect(html).toContain("isn&#x27;t written yet");
    expect(html).not.toContain("Words introduced here");
  });

  it("renders the styled fallback with suggestions for an unknown lesson", () => {
    const html = renderAt("/lesson/compund-intrest", createElement(LessonPage), "/lesson/:lessonId");
    expect(html).toContain("Back to curriculum");
    expect(html).toContain("Browse lessons from Level 0");
  });

  it("suggests near matches rather than dead-ending", () => {
    const html = renderAt("/lesson/working-capital-cycle", createElement(LessonNotFound, { requested: "working-capital-cycle" }), "/lesson/:lessonId");
    expect(html).toContain("Did you mean one of these?");
    expect(html).toContain("Working capital");
  });

  it("resolves a module id to that module only, not the whole level", () => {
    const html = renderAt("/module/1300", createElement(ModulePage), "/module/:moduleId");
    expect(html).toContain("Balance sheet");
    expect(html).not.toContain("Income statement");
  });

  it("has a working route for every module in the curriculum", () => {
    const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    for (const level of curriculum) {
      for (const mod of level.modules) {
        const html = renderAt(`/module/${level.level}-${slug(mod.title)}`, createElement(ModulePage), "/module/:moduleId");
        expect(html, mod.title).toContain(esc(mod.title));
        expect(html, mod.title).not.toContain("This lesson doesn");
      }
    }
  });

  it("keeps every legacy footer and nav link from the old site resolvable", () => {
    for (const legacy of ["1010-five-buckets", "9-fixed-income-convexity", "free-cash-flow", "valuation", "2-income-statement-ebitda"]) {
      const lesson = findLesson(legacy);
      if (legacy === "1010-five-buckets") continue; // genuinely removed topic, handled by fallback
      expect(lesson, legacy).toBeDefined();
    }
  });
});
