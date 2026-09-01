import { Link, useParams } from "react-router-dom";
import { curriculum } from "@/data/masterCurriculum";
import { lessonsForModule } from "@/data/lessons/registry";

const levelOutcomes: Record<number, string[]> = {
  0: ["Speak the basic language of finance", "Understand value, cash, risk and return", "Use simple time-value-of-money ideas"],
  1: ["Record business transactions", "Understand accruals and working capital", "Explain why assets, liabilities and equity move"],
  2: ["Read all three financial statements", "Trace profit into cash and the balance sheet", "Understand major statement line items"],
  3: ["Calculate and interpret financial ratios", "Judge profitability, liquidity and leverage", "Connect operating performance to cash generation"],
  4: ["Build a driver-based forecast", "Link operating schedules into three statements", "Use scenarios, sensitivities and model checks"],
  5: ["Value a business with multiples and DCF", "Understand WACC and terminal value", "Translate enterprise value into equity value"],
  6: ["Understand transaction valuation", "Build M&A mechanics", "Follow sources, uses, synergies and pro forma results"],
  7: ["Build an LBO from entry to exit", "Understand debt paydown and sponsor returns", "Analyze MOIC and IRR sensitivities"],
  8: ["Build an investment thesis", "Separate catalysts, risks and valuation", "Compare bear, base and bull cases"],
  9: ["Understand stocks, bonds and derivatives", "Read yields, curves, duration and volatility", "Connect rates, FX, commodities and central banks"],
  10: ["Understand option pricing and Greeks", "Build portfolio and factor intuition", "Use risk, scenario and simulation frameworks"],
};

export function LevelLandingPage() {
  const { levelId } = useParams();
  const level = curriculum.find((x) => x.level === Number(levelId));
  if (!level) return <div className="mx-auto max-w-4xl px-6 py-16"><h1 className="font-display text-4xl font-semibold">Level not found</h1><Link className="mt-6 inline-block text-green" to="/curriculum">Back to curriculum →</Link></div>;
  const outcomes = levelOutcomes[level.level] ?? [];
  return <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
    <Link to="/curriculum" className="text-base font-semibold text-green no-underline">← All levels</Link>
    <header className="mt-8 max-w-4xl border-b border-line pb-10">
      <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-green">Level {level.level} · {level.modules.reduce((n,m)=>n+m.topics.length,0)} lessons</p>
      <h1 className="mt-4 font-display text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">{level.title}</h1>
      <p className="mt-6 text-xl leading-9 text-ink-soft sm:text-2xl">{level.blurb}</p>
      <div className="mt-8 flex flex-wrap gap-2 text-sm font-semibold">{["Learn","See","Try","Practice","Build","Check","Apply","Master"].map(s=><span key={s} className="rounded-full border border-line bg-paper-2 px-4 py-2">{s}</span>)}</div>
    </header>
    <section className="mt-10 grid gap-5 lg:grid-cols-2">
      <div className="rounded-xl border border-line bg-paper-2 p-7"><p className="text-sm font-bold uppercase tracking-widest text-green">By the end of this level</p><ul className="mt-5 space-y-4">{outcomes.map(x=><li key={x} className="flex gap-3 text-lg leading-8"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-green" aria-hidden="true" />{x}</li>)}</ul></div>
      <div className="rounded-xl border border-line bg-ink p-7 text-paper"><p className="text-sm font-bold uppercase tracking-widest text-green">How to learn</p><p className="mt-4 text-lg leading-8 text-paper/80">Open a lesson, read the concept, change the sandbox inputs, attempt the practice question, check your answer, then apply the idea to a mini-case.</p><p className="mt-5 text-lg font-semibold">The goal is not to memorize finance. It is to be able to use it.</p></div>
    </section>
    <section className="mt-12"><div className="border-b border-line pb-4"><p className="text-sm font-bold uppercase tracking-widest text-green">Lesson path</p><h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Work through the topics</h2></div><div className="mt-6 grid gap-5 md:grid-cols-2">{level.modules.map((m,mi)=><article key={m.title} className="rounded-xl border border-line bg-paper-2 p-6"><div className="flex justify-between gap-4"><div><span className="font-mono text-sm text-ink-faint">MODULE {String(mi+1).padStart(2,"0")}</span><h3 className="mt-1 font-display text-2xl font-semibold">{m.title}</h3></div><span className="text-base text-ink-soft">{m.topics.length} lessons</span></div><div className="mt-5 space-y-2">{lessonsForModule(level.level,m.title).map((lesson,ti)=>(<Link key={lesson.id} to={`/lesson/${lesson.id}`} className="flex items-center justify-between rounded-lg border border-line bg-paper px-4 py-3 text-base font-medium text-ink no-underline hover:border-green hover:text-green"><span><span className="mr-3 font-mono text-xs text-ink-faint">{String(ti+1).padStart(2,"0")}</span>{lesson.title}</span><span className="text-sm text-ink-faint">{lesson.status==="outline"?"Not yet written":lesson.status==="draft"?"Draft":"Full lesson"}</span></Link>))}</div></article>)}</div></section>
    <nav className="mt-14 flex justify-between border-t border-line pt-6 text-base font-semibold">{level.level>0 ? <Link to={`/level/${level.level-1}`} className="text-green no-underline">← Previous level</Link> : <span />}{level.level<10 ? <Link to={`/level/${level.level+1}`} className="text-green no-underline">Next level →</Link> : <span />}</nav>
  </main>;
}
