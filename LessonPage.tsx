import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { findLesson, neighbours, prerequisitesFor } from "@/data/lessons/registry";
import { markTopicComplete, topicIsComplete } from "@/data/progress";
import { LessonNotFound } from "./LessonNotFound";
import { getActivities } from "@/data/lessons/activities";
import { PracticeSection, QuizSection, SandboxSection } from "./LessonActivities";

/**
 * One template renders all 227 lessons.
 *
 * Every class used here already exists in src/styles/theme.css or ux-polish.css
 * (topic-page, topic-section, topic-header-axis, topic-nav-card, btn-primary,
 * bg-paper / bg-paper-2 / bg-ink, border-line, text-green, font-display).
 * No new visual language is introduced.
 */
export function LessonPage() {
  const { lessonId } = useParams();
  const lesson = findLesson(lessonId);
  const activities = lesson ? getActivities(lesson.id) : undefined;

  const [complete, setComplete] = useState(false);
  useEffect(() => {
    setComplete(lesson ? topicIsComplete(lesson.id) : false);
  }, [lesson?.id]);

  if (!lesson) return <LessonNotFound requested={lessonId} />;

  const { previous, next } = neighbours(lesson);
  const prerequisites = prerequisitesFor(lesson);

  return (
    <article className="topic-page">
      <div className="topic-header-axis">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base" aria-label="Breadcrumb">
          <Link to="/curriculum" className="font-semibold text-green no-underline">Curriculum</Link>
          <span aria-hidden="true">→</span>
          <Link to={`/level/${lesson.level}`} className="font-semibold text-green no-underline">Level {lesson.level}</Link>
          <span aria-hidden="true">→</span>
          <span className="text-ink-soft">{lesson.module}</span>
        </div>

        <p className="mt-8 font-mono text-sm font-semibold uppercase tracking-widest text-green">
          Level {lesson.level} · {lesson.module}
        </p>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-tight tracking-tight sm:text-7xl">
          {lesson.title}
        </h1>
        <p className="topic-copy mt-6 text-xl leading-9 text-ink-soft sm:text-2xl sm:leading-10">
          {lesson.summary}
        </p>

        {prerequisites.length > 0 && (
          <p className="mt-6 text-lg text-ink-soft">
            <strong>Read first:</strong>{" "}
            {prerequisites.map((p, i) => (
              <span key={p.id}>
                {i > 0 && " · "}
                <Link to={`/lesson/${p.id}`} className="font-semibold text-green">{p.title}</Link>
              </span>
            ))}
          </p>
        )}
      </div>

      {lesson.status === "outline" ? (
        <section className="topic-section bg-paper-2">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">This lesson isn't written yet</h2>
          <p className="mt-4 text-lg leading-8 text-ink-soft">
            {lesson.title} is part of {lesson.module} in Level {lesson.level} and has its place in the
            curriculum, but the full explanation hasn't been written. Rather than show you generated
            filler, we'd rather tell you it's missing.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="btn-primary" to={`/level/${lesson.level}`}>See what's ready in Level {lesson.level}</Link>
            <a
              className="rounded-lg border border-line px-4 py-3 text-lg font-semibold no-underline"
              href="https://github.com/Rohit-Gorai/finstudio/issues"
              rel="noreferrer"
            >
              Request this lesson
            </a>
          </div>
        </section>
      ) : (
        <>
          {lesson.concept && (
            <section className="topic-section bg-paper">
              <p className="font-mono text-sm font-semibold tracking-widest text-green">What is this?</p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">The idea in plain English</h2>
              <p className="topic-copy mt-5 text-lg leading-9 text-ink-soft sm:text-xl">{lesson.concept}</p>
            </section>
          )}

          {lesson.whyItMatters && (
            <section className="topic-section bg-paper-2">
              <p className="font-mono text-sm font-semibold tracking-widest text-green">Why does it matter?</p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Why you should care</h2>
              <p className="topic-copy mt-5 text-lg leading-9 text-ink-soft sm:text-xl">{lesson.whyItMatters}</p>
            </section>
          )}

          {lesson.howItWorks && lesson.howItWorks.length > 0 && (
            <section className="topic-section bg-paper">
              <p className="font-mono text-sm font-semibold tracking-widest text-green">How does it work?</p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Step by step</h2>
              <ol className="mt-7 space-y-4">
                {lesson.howItWorks.map((step, i) => (
                  <li key={step} className="flex gap-4 rounded-xl border border-line bg-paper-2 p-5">
                    <span className="font-mono text-sm font-semibold text-green">{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-lg leading-8">{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {lesson.formula && (
            <section className="topic-section bg-ink text-paper">
              <p className="font-mono text-sm font-semibold tracking-widest text-green">The formula</p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{lesson.formula.calculates}</h2>
              <pre className="mt-5 overflow-x-auto whitespace-pre-wrap rounded-xl border border-white/15 bg-white/5 px-5 py-5 font-mono text-lg leading-8 text-paper sm:text-xl">
                {lesson.formula.expression}
              </pre>
              {lesson.formula.variables.length > 0 && (
                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                  {lesson.formula.variables.map((v) => (
                    <div key={v.symbol} className="rounded-xl border border-white/15 p-4">
                      <dt className="font-mono text-base font-semibold text-paper">{v.symbol}</dt>
                      <dd className="mt-1 text-lg leading-8 text-paper/80">{v.meaning}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          )}

          {lesson.example && (
            <section className="topic-section bg-paper">
              <p className="font-mono text-sm font-semibold tracking-widest text-green">Simple example</p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Worked through, step by step</h2>
              <p className="topic-copy mt-5 text-lg leading-9 text-ink-soft sm:text-xl">{lesson.example.setup}</p>
              {lesson.example.steps.length > 0 && (
                <ol className="mt-6 space-y-3">
                  {lesson.example.steps.map((step, i) => (
                    <li key={step} className="flex gap-4 rounded-xl border border-line bg-paper-2 p-5">
                      <span className="font-mono text-sm font-semibold text-green">{i + 1}</span>
                      <p className="text-lg leading-8">{step}</p>
                    </li>
                  ))}
                </ol>
              )}
              <p className="mt-6 rounded-xl border border-green bg-green-soft p-5 text-lg leading-8">
                <strong>What this means: </strong>{lesson.example.meaning}
              </p>
            </section>
          )}

          {lesson.keyTerms && lesson.keyTerms.length > 0 && (
            <section className="topic-section bg-paper-2">
              <p className="font-mono text-sm font-semibold tracking-widest text-green">Key terms</p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Words introduced here</h2>
              <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                {lesson.keyTerms.map((k) => (
                  <div key={k.term} className="rounded-xl border border-line bg-paper p-5">
                    <dt className="text-lg font-semibold">{k.term}</dt>
                    <dd className="mt-1 text-lg leading-8 text-ink-soft">{k.definition}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {activities && activities.practice.length > 0 && (
            <section className="topic-section bg-paper">
              <p className="font-mono text-sm font-semibold tracking-widest text-green">Practice</p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Work it yourself</h2>
              <p className="mt-3 text-lg leading-8 text-ink-soft">Attempt each one before revealing the worked solution — the struggle is where the learning happens.</p>
              <div className="mt-7">
                <PracticeSection items={activities.practice} />
              </div>
            </section>
          )}

          {activities?.sandbox && (
            <section className="topic-section bg-paper-2">
              <p className="font-mono text-sm font-semibold tracking-widest text-green">Sandbox</p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Change the numbers</h2>
              <p className="mt-3 text-lg leading-8 text-ink-soft">Every figure below is editable. Predict what will happen before you change it.</p>
              <div className="mt-7">
                <SandboxSection spec={activities.sandbox} />
              </div>
            </section>
          )}

          {activities && activities.quiz.length > 0 && (
            <section className="topic-section bg-paper">
              <p className="font-mono text-sm font-semibold tracking-widest text-green">Quiz</p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Check your understanding</h2>
              <p className="mt-3 text-lg leading-8 text-ink-soft">Wrong answers come with the reasoning — read it, then try again.</p>
              <div className="mt-7">
                <QuizSection items={activities.quiz} />
              </div>
            </section>
          )}

          {lesson.jurisdictionNote && (
            <section className="topic-section bg-paper">
              <p className="font-mono text-sm font-semibold tracking-widest text-amber">Rules that change</p>
              <p className="mt-4 text-lg leading-8 text-ink-soft">{lesson.jurisdictionNote}</p>
            </section>
          )}

          <section className="mt-6 grid gap-6 md:grid-cols-2">
            {lesson.takeaways && lesson.takeaways.length > 0 && (
              <article className="topic-section mt-0 bg-paper">
                <p className="font-mono text-sm font-semibold tracking-widest text-green">What to remember</p>
                <ul className="mt-5 space-y-3">
                  {lesson.takeaways.map((t) => (
                    <li key={t} className="rounded-lg border border-line p-4 text-lg leading-8">{t}</li>
                  ))}
                </ul>
              </article>
            )}
            {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
              <article className="topic-section mt-0 bg-paper">
                <p className="font-mono text-sm font-semibold tracking-widest text-red">Common mistakes</p>
                <ul className="mt-5 space-y-3">
                  {lesson.commonMistakes.map((m) => (
                    <li key={m} className="rounded-lg border border-line p-4 text-lg leading-8">{m}</li>
                  ))}
                </ul>
              </article>
            )}
          </section>

          <section className="topic-section bg-paper-2">
            <button
              type="button"
              onClick={() => { markTopicComplete(lesson.id); setComplete(true); }}
              className={`rounded-lg px-5 py-3.5 text-lg font-semibold ${complete ? "border border-green bg-green-soft text-green" : "btn-primary"}`}
            >
              {complete ? "✓ Lesson complete" : "Mark lesson complete"}
            </button>
          </section>
        </>
      )}

      <nav className="topic-navigation mt-8 grid gap-4 border-t border-line pt-7 sm:grid-cols-2" aria-label="Lesson navigation">
        <div className="topic-nav-card">
          {previous ? (
            <>
              <p className="text-sm font-semibold uppercase tracking-wider text-ink-faint">Previous lesson</p>
              <Link className="mt-2 inline-block text-lg font-semibold text-green no-underline" to={`/lesson/${previous.id}`}>
                ← {previous.title}
              </Link>
            </>
          ) : (
            <span className="text-ink-faint">Start of curriculum</span>
          )}
        </div>
        <div className="topic-nav-card text-left sm:text-right">
          {next ? (
            <>
              <p className="text-sm font-semibold uppercase tracking-wider text-ink-faint">Next lesson</p>
              <Link className="mt-2 inline-block text-lg font-semibold text-green no-underline" to={`/lesson/${next.id}`}>
                {next.title} →
              </Link>
            </>
          ) : (
            <span className="text-ink-faint">End of curriculum</span>
          )}
        </div>
      </nav>
    </article>
  );
}
