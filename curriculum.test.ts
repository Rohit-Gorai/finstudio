import { describe, expect, it } from "vitest";
import { curriculum } from "../src/data/masterCurriculum";
import { allLessons, findLesson, coverage, neighbours, prerequisitesFor } from "../src/data/lessons/registry";

describe("FinStudio lesson registry", () => {
  it("contains every level from 0 through 10", () => {
    expect(curriculum.map(l => l.level)).toEqual(Array.from({ length: 11 }, (_, i) => i));
  });

  it("creates exactly one lesson per curriculum topic", () => {
    const topics = curriculum.reduce((n, l) => n + l.modules.reduce((m, mod) => m + mod.topics.length, 0), 0);
    expect(allLessons.length).toBe(topics);
  });

  it("gives every lesson a unique, non-numeric id", () => {
    const ids = allLessons.map(l => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id, id).toMatch(/^[a-z][a-z0-9-]*$/);
      expect(id, `${id} must not be a bare index`).not.toMatch(/^lesson-\d+$/);
    }
  });

  it("resolves every lesson by its canonical id and by both legacy slug shapes", () => {
    const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    for (const lesson of allLessons) {
      expect(findLesson(lesson.id)?.id, lesson.id).toBe(lesson.id);
      expect(findLesson(`${lesson.level}-${slug(lesson.module)}-${slug(lesson.title)}`)?.id, lesson.id).toBe(lesson.id);
    }
  });

  it("resolves the legacy convexity route that previously 404'd", () => {
    const lesson = findLesson("9-fixed-income-convexity");
    expect(lesson?.title).toBe("Convexity");
    expect(lesson?.level).toBe(9);
  });

  it("returns undefined for an unknown id rather than throwing", () => {
    expect(findLesson("not-a-real-lesson")).toBeUndefined();
    expect(findLesson("")).toBeUndefined();
    expect(findLesson(undefined)).toBeUndefined();
  });

  it("links every lesson into a single continuous reading order", () => {
    expect(allLessons.map(l => l.order)).toEqual(allLessons.map((_, i) => i + 1));
    expect(neighbours(allLessons[0]!).previous).toBeUndefined();
    expect(neighbours(allLessons[allLessons.length - 1]!).next).toBeUndefined();
    for (let i = 1; i < allLessons.length - 1; i++) {
      const { previous, next } = neighbours(allLessons[i]!);
      expect(previous?.id).toBe(allLessons[i - 1]!.id);
      expect(next?.id).toBe(allLessons[i + 1]!.id);
    }
  });

  it("only references prerequisites that exist and come earlier", () => {
    for (const lesson of allLessons) {
      for (const id of lesson.prerequisites ?? []) {
        const target = findLesson(id);
        expect(target, `${lesson.id} requires missing lesson "${id}"`).toBeDefined();
        expect(target!.order, `${lesson.id} requires later lesson "${id}"`).toBeLessThan(lesson.order);
      }
      expect(prerequisitesFor(lesson).length).toBe((lesson.prerequisites ?? []).length);
    }
  });

  it("gives every authored lesson all seven teaching sections", () => {
    const authored = allLessons.filter(l => l.status === "authored");
    expect(authored.length).toBeGreaterThan(0);
    for (const lesson of authored) {
      expect(lesson.concept!.length, lesson.id).toBeGreaterThan(120);
      expect(lesson.whyItMatters!.length, lesson.id).toBeGreaterThan(80);
      expect(lesson.howItWorks!.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(lesson.example!.steps.length, lesson.id).toBeGreaterThanOrEqual(2);
      expect(lesson.example!.meaning.length, lesson.id).toBeGreaterThan(40);
      expect(lesson.keyTerms!.length, lesson.id).toBeGreaterThanOrEqual(2);
      expect(lesson.takeaways!.length, lesson.id).toBeGreaterThanOrEqual(2);
      expect(lesson.commonMistakes!.length, lesson.id).toBeGreaterThanOrEqual(2);
    }
  });

  it("never presents generated filler as authored content", () => {
    for (const lesson of allLessons) {
      const text = [lesson.concept, lesson.whyItMatters, lesson.summary].filter(Boolean).join(" ");
      expect(text, lesson.id).not.toContain("is best understood by defining exactly what is measured");
      expect(text, lesson.id).not.toContain("is an important building block in");
    }
  });

  it("does not reuse one worked example across different lessons", () => {
    const seen = new Map<string, string>();
    for (const lesson of allLessons.filter(l => l.status === "authored")) {
      const key = lesson.example!.setup;
      expect(seen.has(key), `${lesson.id} reuses the example from ${seen.get(key)}`).toBe(false);
      seen.set(key, lesson.id);
    }
  });

  it("reports coverage from the data instead of asserting completeness", () => {
    const stats = coverage();
    expect(stats.authored + stats.draft + stats.outline).toBe(stats.total);
    expect(stats.total).toBe(allLessons.length);
    // This is the honest state of the curriculum. Raise it as lessons are written.
    expect(stats.authored).toBeGreaterThanOrEqual(43);
  });
});
