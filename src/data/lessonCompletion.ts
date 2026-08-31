import type { LessonContent } from "./lessonContent";

const defaultMechanics = (topic: string) => [
  `Define ${topic} precisely and identify what is being measured.`,
  `Separate the inputs, outputs, assumptions, units and time period.`,
  `Trace how ${topic} changes the relevant financial statement, valuation, market or investment outcome.`,
  "Change one driver at a time and explain the direction of the result before looking at the answer.",
];

/**
 * The content catalogue intentionally stores concise topic-specific overrides.
 * This adapter completes those overrides into the stable lesson contract used
 * by the UI, so no topic can crash simply because an optional section was not
 * authored yet.
 */
export function completeLessonContent(topic: string, lesson: LessonContent): LessonContent {
  return {
    ...lesson,
    mechanics: lesson.mechanics?.length ? lesson.mechanics : defaultMechanics(topic),
    pitfalls: lesson.pitfalls?.length ? lesson.pitfalls : [
      "Memorizing a formula without understanding its inputs",
      "Mixing units, periods or definitions",
      "Treating a model output as a fact rather than an assumption-driven result",
    ],
  };
}
