import type { TopicActivities } from "./types";
import { level0Activities } from "./level0-activities";
import { level1Activities } from "./level1-activities";

/**
 * One lookup for every topic's practice set, quiz and sandbox, keyed by lesson
 * id. A lesson with no entry simply renders without those sections — the UI
 * never substitutes generic filler.
 */
const activitiesById: Record<string, TopicActivities> = {
  ...level0Activities,
  ...level1Activities,
};

export const getActivities = (lessonId: string): TopicActivities | undefined =>
  activitiesById[lessonId];

export const activityCoverage = () => {
  const entries = Object.values(activitiesById);
  return {
    topicsWithPractice: entries.filter((a) => a.practice.length > 0).length,
    topicsWithQuiz: entries.filter((a) => a.quiz.length > 0).length,
    topicsWithSandbox: entries.filter((a) => a.sandbox).length,
  };
};

export const allActivityIds = () => Object.keys(activitiesById);
