import { curriculum, type CurriculumLevel } from "@/data/masterCurriculum";
import { getLessonContent } from "@/data/lessonContent";
import type { Lesson } from "./types";
import { level0 } from "./level0";
import { level1 } from "./level1";

/**
 * Builds the single registry of all 227 lessons.
 *
 * Ordering, levels and modules come from the existing `curriculum` registry so
 * there is still exactly one source of truth for curriculum structure. This
 * module only adds stable IDs and attaches content.
 */

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * 24 topic names appear in more than one place in the curriculum, so a bare
 * `slugify(topic)` is not unique. Each entry below is keyed by
 * `level|module|topic` and gives that occurrence its own stable, semantic id.
 * The occurrence where the concept is actually taught keeps the clean id; the
 * others get a scoped id describing their context.
 */
const idOverrides: Record<string, string> = {
  // Readable shortening of a very long topic name.
  "0|Finance basics|Personal finance vs corporate finance vs investing": "personal-corporate-investing",
  "0|Finance basics|Revenue": "revenue",
  "2|Income statement|Revenue": "revenue-line-item",
  "4|Build a real model|Revenue": "revenue-forecast",
  "0|Finance basics|Cash": "cash",
  "2|Balance sheet|Cash": "cash-balance-sheet",
  "0|Finance basics|Equity": "equity",
  "2|Balance sheet|Equity": "equity-balance-sheet",
  "0|Finance basics|Debt": "debt",
  "2|Balance sheet|Debt": "debt-balance-sheet",
  "0|Finance basics|Interest": "interest",
  "2|Income statement|Interest": "interest-expense",
  "1|Working capital & operating assets|Inventory": "inventory",
  "2|Balance sheet|Inventory": "inventory-balance-sheet",
  "1|Long-lived assets & equity|PP&E": "ppe",
  "2|Balance sheet|PP&E": "ppe-balance-sheet",
  "1|Long-lived assets & equity|Goodwill": "goodwill",
  "6|M&A modeling|Goodwill": "goodwill-acquisition",
  "1|Long-lived assets & equity|Retained earnings": "retained-earnings",
  "4|Operating schedules|Retained earnings": "retained-earnings-schedule",
  "2|Income statement|Gross profit": "gross-profit",
  "4|Build a real model|Gross Profit": "gross-profit-model",
  "2|Income statement|EBITDA": "ebitda",
  "4|Build a real model|EBITDA": "ebitda-model",
  "2|Income statement|EBIT": "ebit",
  "4|Build a real model|EBIT": "ebit-model",
  "2|Income statement|Net income": "net-income",
  "4|Build a real model|Net Income": "net-income-model",
  "3|Cash & operating analysis|Free cash flow": "free-cash-flow",
  "8|Investment case|Free cash flow": "free-cash-flow-investment-case",
  "4|Integrated modeling|Scenario analysis": "scenario-analysis",
  "10|Risk & simulation|Scenario analysis": "scenario-analysis-risk",
  "4|Integrated modeling|Sensitivity analysis": "sensitivity-analysis",
  "5|DCF|Sensitivity analysis": "sensitivity-analysis-dcf",
  "7|Sponsor returns|Sensitivity analysis": "sensitivity-analysis-lbo",
  "5|Valuation building blocks|Enterprise value": "enterprise-value",
  "5|Live DCF|Enterprise Value": "enterprise-value-dcf-output",
  "5|Valuation building blocks|Equity value": "equity-value",
  "5|Live DCF|Equity Value": "equity-value-dcf-output",
  "5|Valuation building blocks|Market capitalization": "market-capitalization",
  "9|Equities|Market capitalization": "market-capitalization-equities",
  "5|DCF|WACC": "wacc",
  "5|Live DCF|WACC": "wacc-dcf-input",
  "5|DCF|CAPM": "capm",
  "10|Options & portfolio theory|CAPM": "capm-portfolio-theory",
  "5|DCF|Beta": "beta",
  "10|Options & portfolio theory|Beta": "beta-portfolio-theory",
  "5|DCF|Exit multiple": "exit-multiple",
  "7|LBO construction|Exit multiple": "exit-multiple-lbo",
  "6|M&A modeling|Sources & Uses": "sources-and-uses",
  "7|LBO construction|Sources & Uses": "sources-and-uses-lbo",
};

const authored: Lesson[] = [...level0, ...level1];
const authoredById = new Map(authored.map((lesson) => [lesson.id, lesson]));

/** True when the pre-existing catalogue has a real, hand-written concept for this topic. */
function draftContentFor(topic: string, module: string, level: number) {
  const content = getLessonContent(topic, module, level);
  // getLessonContent falls back to a generated string containing this marker.
  // A generated fallback is not content, so it must not be presented as one.
  const isGenerated = content.concept.includes("is an important building block in");
  return isGenerated ? null : content;
}

function buildRegistry(levels: CurriculumLevel[]): Lesson[] {
  const lessons: Lesson[] = [];
  const seen = new Set<string>();
  let order = 0;

  for (const level of levels) {
    for (const module of level.modules) {
      for (const topic of module.topics) {
        order += 1;
        const key = `${level.level}|${module.title}|${topic}`;
        const id = idOverrides[key] ?? slugify(topic);

        if (seen.has(id)) {
          throw new Error(
            `Duplicate lesson id "${id}" for ${key}. Add an entry to idOverrides.`,
          );
        }
        seen.add(id);

        const written = authoredById.get(id);
        if (written) {
          lessons.push({ ...written, order });
          continue;
        }

        const draft = draftContentFor(topic, module.title, level.level);
        if (draft) {
          lessons.push({
            id,
            title: topic,
            level: level.level,
            module: module.title,
            order,
            status: "draft",
            summary: draft.concept.split(". ")[0] + ".",
            concept: draft.concept,
            whyItMatters: draft.why,
            howItWorks: draft.mechanics?.length ? draft.mechanics : undefined,
            formula: draft.formula
              ? { calculates: `The relationship behind ${topic}`, expression: draft.formula, variables: [] }
              : undefined,
            example: { setup: draft.example, steps: [], meaning: draft.decision },
            commonMistakes: draft.pitfalls,
            takeaways: [draft.decision],
          });
          continue;
        }

        lessons.push({
          id,
          title: topic,
          level: level.level,
          module: module.title,
          order,
          status: "outline",
          summary: `Part of ${module.title} in Level ${level.level}. Full lesson not yet written.`,
        });
      }
    }
  }
  return lessons;
}

export const allLessons: Lesson[] = buildRegistry(curriculum);

const byId = new Map(allLessons.map((lesson) => [lesson.id, lesson]));

/** Legacy `#/topic/<level>-<module>-<topic>` slugs, so old links keep working. */
const byLegacySlug = new Map(
  allLessons.map((lesson) => [
    `${lesson.level}-${slugify(lesson.module)}-${slugify(lesson.title)}`,
    lesson,
  ]),
);

/** Even older `#/topic/<level>-<topic>` slugs from the pre-rewrite site. */
const byShortLegacySlug = new Map<string, Lesson>();
for (const lesson of allLessons) {
  const short = `${lesson.level}-${slugify(lesson.title)}`;
  if (!byShortLegacySlug.has(short)) byShortLegacySlug.set(short, lesson);
}

/** Unscoped topic name, used only when it resolves to exactly one lesson. */
const byUniqueTitle = new Map<string, Lesson | null>();
for (const lesson of allLessons) {
  const title = slugify(lesson.title);
  byUniqueTitle.set(title, byUniqueTitle.has(title) ? null : lesson);
}

/**
 * Resolves any identifier we have ever published to a lesson: the canonical id,
 * both legacy slug shapes, and a bare topic name when unambiguous. Returns
 * undefined only when nothing matches, so the caller can show the styled
 * "lesson not found" page rather than a blank screen.
 */
export function findLesson(raw: string | undefined): Lesson | undefined {
  const key = decodeURIComponent(raw ?? "").toLowerCase().trim().replace(/^\/+|\/+$/g, "");
  if (!key) return undefined;
  return (
    byId.get(key) ??
    byLegacySlug.get(key) ??
    byShortLegacySlug.get(key) ??
    byUniqueTitle.get(key) ??
    undefined
  );
}

export const lessonsForLevel = (level: number) => allLessons.filter((l) => l.level === level);

export const lessonsForModule = (level: number, module: string) =>
  allLessons.filter((l) => l.level === level && l.module === module);

export function neighbours(lesson: Lesson) {
  const index = allLessons.findIndex((l) => l.id === lesson.id);
  return {
    previous: index > 0 ? allLessons[index - 1] : undefined,
    next: index >= 0 && index < allLessons.length - 1 ? allLessons[index + 1] : undefined,
  };
}

/** Lessons a learner should read first, resolved to real lesson objects. */
export const prerequisitesFor = (lesson: Lesson) =>
  (lesson.prerequisites ?? []).map((id) => byId.get(id)).filter((l): l is Lesson => Boolean(l));

/** Suggestions for the not-found page: nearest lessons by title similarity. */
export function suggestLessons(raw: string | undefined, limit = 4): Lesson[] {
  const key = slugify(decodeURIComponent(raw ?? ""));
  if (!key) return allLessons.filter((l) => l.status === "authored").slice(0, limit);
  const words = key.split("-").filter((w) => w.length > 2);
  const scored = allLessons
    .map((lesson) => {
      const target = `${slugify(lesson.title)}-${slugify(lesson.module)}`;
      const score = words.reduce((n, w) => n + (target.includes(w) ? 1 : 0), 0);
      return { lesson, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.lesson.order - b.lesson.order);
  return scored.slice(0, limit).map((x) => x.lesson);
}

/**
 * Real coverage, computed from the data rather than asserted. This replaces the
 * previous audit, which returned `complete: true` as a hardcoded literal for
 * every topic regardless of whether any content existed.
 */
export function coverage() {
  const total = allLessons.length;
  const count = (status: Lesson["status"]) => allLessons.filter((l) => l.status === status).length;
  return {
    total,
    authored: count("authored"),
    draft: count("draft"),
    outline: count("outline"),
  };
}

export function coverageForLevel(level: number) {
  const lessons = lessonsForLevel(level);
  return {
    total: lessons.length,
    authored: lessons.filter((l) => l.status === "authored").length,
    draft: lessons.filter((l) => l.status === "draft").length,
    outline: lessons.filter((l) => l.status === "outline").length,
  };
}

export type { Lesson } from "./types";
