import { Link, useParams } from "react-router-dom";
import { allTopics, topicBySlug, topicRouteSlug } from "@/data/masterCurriculum";
import { getLessonContent } from "@/data/lessonContent";
import { useMemo, useState } from "react";

export function TopicPage() {
  const { topicSlug } = useParams();
  const topic = topicBySlug(topicSlug ?? "");
  const [values, setValues] = useState([100, 10, 5]);
  const [checked, setChecked] = useState(false);
  const index = topic ? allTopics.findIndex((x) => x.slug === topic.slug) : -1;
  const next = index >= 0 ? allTopics[index + 1] : undefined;
  const result = useMemo(() => (values[0] ?? 0) * (1 + (values[1] ?? 0) / 100 + (values[2] ?? 0) / 100), [values]);
  if (!topic) return <div className="mx-auto max-w-5xl px-5 py-20"><h1 className="font-display text-4xl font-semibold">Topic not found</h1><p className="mt-3 text-lg text-ink-soft">This topic is not in the FinStudio curriculum.</p><Link className="mt-6 inline-block text-lg font-semibold text-green" to="/curriculum">Back to curriculum →</Link></div>;
  const lesson = getLessonContent(topic.topic, topic.module, topic.level);
  const steps = ["Learn", "See", "Try", "Practice", "Build", "Check", "Apply", "Master"];
  return <article className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
    <Link to={`/level/${topic.level}`} className="text-lg font-semibold text-green no-underline">← Level {topic.level}: {topic.levelTitle}</Link>
    <p className="mt-8 font-mono text-sm font-semibold uppercase tracking-widest text-green">LEVEL {topic.level} · {topic.module}</p>
    <div className="mt-4 flex flex-wrap gap-2" aria-label="Lesson stages">{steps.map((s, i) => <span key={s} className={`rounded-full border px-3.5 py-2 text-base ${i === 0 ? "border-green bg-green-soft text-green" : "border-line text-ink-faint"}`}>{String(i + 1).padStart(2,"0")} {s}</span>)}</div>
    <h1 className="mt-8 font-display text-5xl font-semibold leading-tight tracking-tight sm:text-7xl">{topic.topic}</h1>
    <p className="mt-6 max-w-4xl text-xl leading-9 text-ink-soft sm:text-2xl sm:leading-10">{lesson.concept}</p>

    <section className="mt-14 rounded-2xl border border-line bg-paper-2 p-7 sm:p-10"><p className="font-mono text-sm font-semibold tracking-widest text-green">01 · LEARN</p><h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">The concept, from first principles</h2><p className="mt-5 text-lg leading-9 text-ink-soft sm:text-xl sm:leading-9">{lesson.why}</p><div className="mt-7 space-y-4">{lesson.mechanics.map((m,i)=><div key={m} className="flex gap-4 rounded-xl border border-line bg-paper p-5"><span className="font-mono text-sm font-semibold text-green">{String(i+1).padStart(2,"0")}</span><p className="text-lg leading-8">{m}</p></div>)}</div></section>

    <section className="mt-6 rounded-2xl border border-line bg-ink p-7 text-paper sm:p-10"><p className="font-mono text-sm font-semibold tracking-widest text-green">02 · FORMULA / MECHANICS</p><h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">How the numbers connect</h2><p className="mt-5 rounded-xl border border-white/15 bg-white/5 px-5 py-5 font-mono text-lg leading-8 text-paper sm:text-xl">{lesson.formula}</p><p className="mt-5 text-lg leading-8 text-paper/75">Always check the unit, period, sign convention and definition before putting a number into a formula. A mathematically correct calculation can still be financially wrong if the inputs are inconsistent.</p></section>

    <section className="mt-6 rounded-2xl border border-line bg-paper p-7 shadow-sm sm:p-10"><p className="font-mono text-sm font-semibold tracking-widest text-green">03 · SEE</p><h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Worked example</h2><p className="mt-5 text-lg leading-9 text-ink-soft sm:text-xl sm:leading-9">{lesson.example}</p></section>

    <section className="mt-6 rounded-2xl border border-line bg-paper-2 p-7 sm:p-10"><p className="font-mono text-sm font-semibold tracking-widest text-green">04–05 · TRY → PRACTICE → BUILD</p><h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Interactive sandbox</h2><p className="mt-4 text-lg leading-8 text-ink-soft">Change one assumption at a time. Predict the direction first. Then use the live result to explain the mechanism in your own words.</p><div className="mt-8 grid gap-5 sm:grid-cols-3">{["Starting value","Driver A (%)","Driver B (%)"].map((label,i)=><label key={label} className="block text-lg font-semibold">{label}<input aria-label={label} className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-3.5 text-xl font-mono focus:border-green" type="number" step="any" value={values[i] ?? 0} onChange={(e)=>setValues(v=>v.map((x,j)=>j===i?(Number.isFinite(e.target.valueAsNumber)?e.target.valueAsNumber:0):x))} /></label>)}</div><div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-paper p-6"><span className="text-lg text-ink-soft">Live illustrative result</span><strong className="font-mono text-4xl">{result.toFixed(2)}</strong></div></section>

    <section className="mt-6 grid gap-6 md:grid-cols-2"><article className="rounded-2xl border border-line bg-paper p-7 sm:p-9"><p className="font-mono text-sm font-semibold tracking-widest text-green">06 · CHECK</p><h2 className="mt-2 font-display text-3xl font-semibold">Test your understanding</h2><p className="mt-4 text-lg leading-8 text-ink-soft">If Driver A rises while everything else stays constant, what direction should the live result move? Predict first, then check.</p><button type="button" className="btn-primary mt-6 px-5 py-3.5 text-lg" onClick={()=>setChecked(true)}>{checked ? "Checked ✓" : "Check my intuition"}</button>{checked && <p className="mt-5 text-lg font-semibold leading-8 text-green">Correct direction. Now explain why the result moved, what stayed constant and which assumption made the relationship hold.</p>}</article><article className="rounded-2xl border border-line bg-paper p-7 sm:p-9"><p className="font-mono text-sm font-semibold tracking-widest text-green">07 · APPLY</p><h2 className="mt-2 font-display text-3xl font-semibold">Use it like a finance professional</h2><p className="mt-4 text-lg leading-8 text-ink-soft">{lesson.decision}</p></article></section>

    <section className="mt-6 rounded-2xl border border-line bg-paper-2 p-7 sm:p-10"><p className="font-mono text-sm font-semibold tracking-widest text-red">COMMON MISTAKES</p><h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">What beginners often get wrong</h2><ul className="mt-6 grid gap-4 sm:grid-cols-2">{lesson.pitfalls.map(p=><li key={p} className="rounded-xl border border-line bg-paper p-5 text-lg leading-8">{p}</li>)}</ul></section>

    <section className="mt-6 rounded-2xl border border-line bg-paper p-7 sm:p-10"><p className="font-mono text-sm font-semibold tracking-widest text-green">08 · MASTER</p><h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Teach it back</h2><p className="mt-4 text-lg leading-9 text-ink-soft sm:text-xl">Explain the definition, the formula or intuition, the worked example, one real-world use and one limitation. If you can teach those five things without looking at the page, you have moved from recognition to mastery.</p>{next && <Link className="btn-primary mt-7 inline-flex px-5 py-3.5 text-lg" to={`/topic/${topicRouteSlug(next)}`}>Next: {next.topic} →</Link>}</section>
  </article>;
}
