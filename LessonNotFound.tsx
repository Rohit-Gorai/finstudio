import { Link } from "react-router-dom";
import { suggestLessons } from "@/data/lessons/registry";

/**
 * Styled fallback for an unrecognised lesson id. Uses the existing page
 * vocabulary rather than a new design, and always offers a way forward:
 * back to the curriculum, browse lessons, plus closest matches by title.
 */
export function LessonNotFound({ requested }: { requested?: string }) {
  const suggestions = suggestLessons(requested);
  return (
    <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
      <p className="font-mono text-sm font-semibold uppercase tracking-widest text-green">Lesson not found</p>
      <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight">This lesson doesn't tie.</h1>
      <p className="mt-5 text-lg leading-8 text-ink-soft">
        The lesson you're looking for doesn't exist or may have moved. Its link may be incomplete,
        or it may have been renamed since you saved it.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="btn-primary" to="/curriculum">Back to curriculum</Link>
        <Link className="rounded-lg border border-line px-4 py-3 text-lg font-semibold no-underline" to="/level/0">
          Browse lessons from Level 0
        </Link>
      </div>
      {suggestions.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">Did you mean one of these?</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {suggestions.map((lesson) => (
              <Link
                key={lesson.id}
                to={`/lesson/${lesson.id}`}
                className="rounded-lg border border-line bg-paper-2 px-4 py-3 text-base no-underline hover:border-green hover:text-green"
              >
                <span className="font-semibold">{lesson.title}</span>
                <span className="mt-1 block text-sm text-ink-faint">Level {lesson.level} · {lesson.module}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
