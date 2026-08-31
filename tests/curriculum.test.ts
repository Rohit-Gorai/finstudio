import { describe, expect, it } from "vitest";
import { allTopics, curriculum, topicBySlug, topicRouteSlug } from "../src/data/masterCurriculum";
import { getLessonContent } from "../src/data/lessonContent";
import { completeLessonContent } from "../src/data/lessonCompletion";

describe("FinStudio curriculum integrity", () => {
  it("contains every level from 0 through 10", () => {
    expect(curriculum.map((level) => level.level)).toEqual(Array.from({ length: 11 }, (_, i) => i));
  });

  it("has unique canonical topic routes", () => {
    const slugs = allTopics.map((topic) => topic.slug);
    expect(slugs.length).toBeGreaterThan(200);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("resolves the fixed-income convexity route that previously returned 404", () => {
    const topic = topicBySlug("9-fixed-income-convexity");
    expect(topic?.level).toBe(9);
    expect(topic?.module).toBe("Fixed income");
    expect(topic?.topic).toBe("Convexity");
  });

  it("resolves canonical routes for every curriculum topic", () => {
    for (const topic of allTopics) {
      expect(topicBySlug(topicRouteSlug(topic)), topic.slug).toEqual(topic);
    }
  });

  it("provides a complete user-facing lesson payload for every topic", () => {
    for (const topic of allTopics) {
      const lesson = completeLessonContent(topic.topic, getLessonContent(topic.topic, topic.module, topic.level));
      expect(lesson.concept.trim(), topic.topic).not.toHaveLength(0);
      expect(lesson.why.trim(), topic.topic).not.toHaveLength(0);
      expect(lesson.mechanics.length, topic.topic).toBeGreaterThanOrEqual(3);
      expect(lesson.example.trim(), topic.topic).not.toHaveLength(0);
      expect(lesson.pitfalls.length, topic.topic).toBeGreaterThanOrEqual(2);
      expect(lesson.decision.trim(), topic.topic).not.toHaveLength(0);
    }
  });
});
