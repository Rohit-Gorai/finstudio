/**
 * The FinStudio lesson contract.
 *
 * Every curriculum topic resolves to exactly one Lesson with a stable, semantic
 * `id`. IDs are never array indexes, so lessons can be reordered inside a module
 * without breaking a bookmarked URL.
 *
 * `status` is deliberately honest and is derived from the data, never hardcoded:
 *   authored — written to the beginner-first standard (all seven sections)
 *   draft    — has a correct concept/example but not yet the full lesson
 *   outline  — title and placement only; content not yet written
 *
 * The UI reads `status` so a learner is never shown filler dressed up as a
 * finished lesson.
 */

export type LessonStatus = "authored" | "draft" | "outline";

export type KeyTerm = {
  term: string;
  /** Plain-English definition. Introduce jargon only after explaining it. */
  definition: string;
};

export type FormulaVariable = {
  symbol: string;
  meaning: string;
};

export type Formula = {
  /** What the formula is trying to calculate, in plain English. */
  calculates: string;
  expression: string;
  variables: FormulaVariable[];
};

export type WorkedExample = {
  /** The situation, in concrete numbers a beginner can follow. */
  setup: string;
  /** One line per arithmetic step. Never skip a step. */
  steps: string[];
  /** What the answer means in plain English — not just the number. */
  meaning: string;
};

export type Lesson = {
  /** Stable semantic id, e.g. "compound-interest". Unique across the curriculum. */
  id: string;
  title: string;
  level: number;
  module: string;
  /** Position in the full 227-lesson reading order. */
  order: number;
  status: LessonStatus;

  /** One sentence for curriculum cards and search results. */
  summary: string;

  /** 1. What is this? Plain English first, terminology second. */
  concept?: string;
  /** 2. Why does it matter? */
  whyItMatters?: string;
  /** 3. How does it work? One idea per step. */
  howItWorks?: string[];
  /** 4. Simple example, calculated step by step. */
  example?: WorkedExample;
  formula?: Formula;
  /** 5. Key terms introduced in this lesson. */
  keyTerms?: KeyTerm[];
  /** 6. What to remember. */
  takeaways?: string[];
  /** 7. Common beginner misconceptions. */
  commonMistakes?: string[];

  /** Lesson ids a learner should read first. Drives the prerequisite check. */
  prerequisites?: string[];
  /** Flags content whose accuracy depends on jurisdiction or changing rules. */
  jurisdictionNote?: string;
};

export const isTeachable = (lesson: Lesson): boolean =>
  lesson.status !== "outline" && Boolean(lesson.concept && lesson.whyItMatters);
