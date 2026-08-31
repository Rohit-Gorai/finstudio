import { Link } from "react-router-dom";
import { allTopics, curriculum, topicRouteSlug } from "@/data/masterCurriculum";
import { buildCurriculumAudit } from "@/data/topicLearning";
import { moduleProgress, levelProgress, curriculumProgress } from "@/data/progress";
import { useEffect, useState } from "react";

const stages = ["Learn", "See", "Try", "Practice", "Build", "Check", "Apply", "Master"];

export function CurriculumPage() {
  const audit = buildCurriculumAudit(curriculum);
  const auditByKey = new Map(audit.map(item => [`${item.level}|${item.module}|${item.topic}`, item]));
  const [, refresh] = useState(0);
  useEffect(() => { const onProgress = () => refresh(x => x + 1); window.addEventListener("finstudio:progress", onProgress); return () => window.removeEventListener("finstudio:progress", onProgress); }, []);
  const overall = curriculumProgress();

  return <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
    <header className="max-w-4xl">
      <p className="text-sm font-semibold uppercase tracking-widest text-green">Curriculum · Levels 0–10</p>
      <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-6xl">Learn finance by building it.</h1>
      <p className="mt-5 text-lg text-ink-soft">Every individual topic is a first-class lesson. Learn the idea, see the mechanics, try the model, practise, build, check, apply and master it.</p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <span className="rounded-full border border-line bg-paper-2 px-3 py-1">{curriculum.length} levels</span>
        <span className="rounded-full border border-line bg-paper-2 px-3 py-1">{curriculum.reduce((n,l)=>n+l.modules.length,0)} modules</span>
        <span className="rounded-full border border-line bg-paper-2 px-3 py-1">{allTopics.length} topics</span>
        <span className="rounded-full border border-green bg-green-soft px-3 py-1 font-semibold text-green">{overall.done}/{overall.total} completed</span>
      </div>
    </header>

    <div className="mt-8 overflow-x-auto rounded-lg border border-line bg-paper-2 p-4"><div className="flex min-w-max gap-2">{stages.map((s,i)=><div key={s} className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs"><span className="font-mono text-green">{String(i+1).padStart(2,"0")}</span> {s}</div>)}</div></div>

    <div className="mt-5 rounded-xl border border-line bg-paper-2 p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="font-mono text-xs font-semibold uppercase tracking-widest text-green">One curriculum · one source of truth</p><p className="mt-1 text-sm leading-6 text-ink-soft">The same Level 0–10 registry drives these cards, topic URLs, sidebar, navigation and progress.</p></div><Link to="/curriculum/matrix" className="rounded-lg border border-line bg-paper px-4 py-2.5 text-sm font-semibold text-ink no-underline hover:border-green hover:text-green">View curriculum matrix →</Link></div></div>

    <div className="mt-12 space-y-10">
      {curriculum.map(level=>{ const lp = levelProgress(level.level); return <section key={level.level} id={`level-${level.level}`} className="scroll-mt-24">
        <div className="flex items-end justify-between gap-4 border-b border-line pb-3"><div><p className="font-mono text-xs text-ink-faint">LEVEL {level.level}</p><h2 className="mt-1 font-display text-3xl font-semibold">{level.title}</h2></div><div className="text-right"><p className="text-sm font-semibold text-ink-soft">{lp.done} / {lp.total} complete</p><p className="text-xs text-ink-faint">{lp.remaining} remaining</p></div></div>
        <p className="mt-3 max-w-3xl text-sm text-ink-soft">{level.blurb}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {level.modules.map(m=>{ const mp=moduleProgress(level.level,m.title); return <article key={m.title} className="rounded-lg border border-line bg-paper-2 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4"><div><h3 className="font-display text-xl font-semibold">{m.title}</h3><p className="mt-1 text-xs text-ink-faint">{mp.done} / {mp.total} complete · {mp.remaining} remaining</p></div><span className="font-mono text-xs text-ink-faint">{m.topics.length} topics</span></div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {m.topics.map((topic,topicIndex)=>{ const item=allTopics.find(x=>x.level===level.level&&x.module===m.title&&x.topic===topic)!; const check=auditByKey.get(`${level.level}|${m.title}|${topic}`); const done=check?.complete; return <Link key={topic} to={`/topic/${topicRouteSlug(item)}`} aria-label={`Open lesson: ${topic}`} className="group rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink-soft no-underline transition hover:-translate-y-px hover:border-green hover:bg-green-soft hover:text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2">
                <span className="flex items-center justify-between gap-2"><span><span className="mr-2 font-mono text-[10px] text-ink-faint">{String(topicIndex+1).padStart(2,"0")}</span>{topic}</span><span aria-hidden="true" className="font-semibold">{done ? "✓" : "→"}</span></span><span className="mt-1 flex gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-faint"><span>8-part lesson</span>{done && <span className="text-green">· Complete</span>}</span>
              </Link>;})}
            </div>
          </article>;})}
        </div>
      </section>;})}
    </div>

    <nav className="mt-14 flex justify-between border-t border-line pt-6 text-base font-semibold"><span /><Link to="/level/0" className="text-green no-underline">Start at Level 0 →</Link></nav>
  </div>;
}
