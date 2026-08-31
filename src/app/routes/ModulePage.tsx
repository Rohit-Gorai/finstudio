import { Link, useParams } from "react-router-dom";
import { allTopics, curriculum, topicRouteSlug } from "@/data/masterCurriculum";

const idToLevel: Record<string, number> = { "1000":0,"1100":1,"1200":1,"1300":2,"1400":2,"1500":2,"1600":3,"2100":4,"2200":5 };

export function ModulePage() {
  const { moduleId } = useParams();
  const level = curriculum.find((x) => x.level === (idToLevel[moduleId ?? ""] ?? Number(moduleId)));
  if (!level) return <div className="mx-auto max-w-5xl px-5 py-20"><h1 className="font-display text-4xl font-semibold">Module not found</h1><Link className="mt-5 inline-block font-semibold text-green" to="/curriculum">Back to curriculum →</Link></div>;
  return <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8"><p className="font-mono text-sm font-semibold uppercase tracking-widest text-green">LEVEL {level.level} · {level.title}</p><h1 className="mt-3 font-display text-5xl font-semibold tracking-tight">{level.title}</h1><p className="mt-4 max-w-3xl text-xl leading-9 text-ink-soft">{level.blurb}</p><div className="mt-10 grid gap-5 md:grid-cols-2">{level.modules.map((m)=><article key={m.title} className="rounded-xl border border-line bg-paper-2 p-6"><h2 className="font-display text-2xl font-semibold">{m.title}</h2><div className="mt-4 space-y-1">{m.topics.map((topic)=><Link key={topic} to={`/topic/${topicRouteSlug(allTopics.find(x=>x.level===level.level&&x.module===m.title&&x.topic===topic)!)}`} className="block rounded px-3 py-2 text-base text-ink-soft no-underline hover:bg-paper-3 hover:text-green">{topic} <span aria-hidden="true">→</span></Link>)}</div></article>)}</div></div>;
}
