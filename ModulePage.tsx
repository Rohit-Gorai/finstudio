import { Link, useParams } from "react-router-dom";
import { curriculum } from "@/data/masterCurriculum";
import { allLessons, lessonsForModule } from "@/data/lessons/registry";
import { LessonNotFound } from "./LessonNotFound";

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * Previously this mapped a module id to a whole LEVEL and rendered the level
 * page, so /module/1300 ("Balance sheet") showed all of Level 2. It now
 * resolves an actual module and shows only that module's lessons.
 *
 * Legacy numeric ids from the pre-rewrite site are kept working via `legacyIds`.
 */
const legacyIds: Record<string, string> = {
  "1000": "0|Finance basics",
  "1100": "1|Accounting mechanics",
  "1200": "1|Working capital & operating assets",
  "1300": "2|Balance sheet",
  "1400": "2|Income statement",
  "1500": "2|Cash flow statement",
  "1600": "3|Profitability & returns",
  "2100": "4|Model architecture",
  "2200": "5|Valuation building blocks",
};

export function ModulePage() {
  const { moduleId } = useParams();
  const raw = moduleId ?? "";
  const resolved = legacyIds[raw];

  let level: number | undefined;
  let moduleTitle: string | undefined;

  if (resolved) {
    const [lvl, title] = resolved.split("|");
    level = Number(lvl);
    moduleTitle = title;
  } else {
    // Canonical shape: <level>-<module-slug>, e.g. 2-balance-sheet
    for (const l of curriculum) {
      for (const m of l.modules) {
        if (`${l.level}-${slugify(m.title)}` === raw.toLowerCase()) {
          level = l.level;
          moduleTitle = m.title;
        }
      }
    }
  }

  if (level === undefined || !moduleTitle) return <LessonNotFound requested={raw} />;

  const lessons = lessonsForModule(level, moduleTitle);
  const levelRecord = curriculum.find((x) => x.level === level);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <Link to={`/level/${level}`} className="text-base font-semibold text-green no-underline">← Level {level}</Link>
      <p className="mt-8 font-mono text-sm font-semibold uppercase tracking-widest text-green">
        Level {level} · {levelRecord?.title}
      </p>
      <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight">{moduleTitle}</h1>
      <p className="mt-4 max-w-3xl text-xl leading-9 text-ink-soft">
        {lessons.length} lessons, in reading order. Lesson {lessons[0]?.order} to {lessons[lessons.length - 1]?.order} of {allLessons.length}.
      </p>
      <div className="mt-10 space-y-2">
        {lessons.map((lesson, i) => (
          <Link
            key={lesson.id}
            to={`/lesson/${lesson.id}`}
            className="flex items-center justify-between rounded-lg border border-line bg-paper px-4 py-3 text-base font-medium text-ink no-underline hover:border-green hover:text-green"
          >
            <span>
              <span className="mr-3 font-mono text-xs text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
              {lesson.title}
            </span>
            <span className="text-sm text-ink-faint">
              {lesson.status === "outline" ? "Not yet written" : lesson.status === "draft" ? "Draft" : "Full lesson"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
