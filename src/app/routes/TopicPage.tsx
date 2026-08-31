import { Link, useParams } from "react-router-dom";
import { allTopics, topicBySlug } from "@/data/masterCurriculum";
import { useMemo, useState } from "react";

const descriptions: Record<string, string> = {
  EBITDA: "EBITDA measures operating earnings before depreciation and amortisation. It is useful for comparing operating performance, but it is not cash flow.",
  "Free cash flow": "Free cash flow is the cash generated after operating needs and required reinvestment. It connects operating performance to value.",
  Valuation: "Valuation estimates what an asset or business is worth using explicit assumptions about cash flows, growth, risk and market prices.",
  "Market capitalization": "Market capitalization is share price multiplied by shares outstanding.",
  CAPM: "CAPM relates required equity return to the risk-free rate plus beta multiplied by the equity risk premium.",
  "Sharpe ratio": "The Sharpe ratio measures excess return per unit of volatility.",
  Beta: "Beta measures an asset's sensitivity to movements in a chosen market benchmark.",
  Alpha: "Alpha describes performance beyond what a specified benchmark or risk model would imply.",
};

function makeSlug(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

export function TopicPage() {
  const { topicSlug } = useParams();
  const topic = topicBySlug(topicSlug ?? "");
  const [values, setValues] = useState([100, 10, 5]);
  const [checked, setChecked] = useState(false);
  const index = topic ? allTopics.findIndex((x) => x.topic === topic.topic) : -1;
  const next = index >= 0 ? allTopics[index + 1] : undefined;
  const result = useMemo(() => values[0] * (1 + values[1] / 100 + values[2] / 100), [values]);
  if (!topic) return <div className="mx-auto max-w-5xl px-5 py-20"><h1 className="font-display text-4xl font-semibold">Topic not found</h1><p className="mt-3 text-ink-soft">This topic is not in the FinStudio curriculum.</p><Link className="mt-6 inline-block font-semibold text-green" to="/curriculum">Back to curriculum →</Link></div>;
  const text = descriptions[topic.topic] ?? `${topic.topic} is a finance building block. Learn the definition, see the mechanics, change assumptions in the sandbox, and explain the economic relationship.`;
  const steps = ["Learn", "See", "Try", "Practice", "Build", "Check", "Apply", "Master"];
  return <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
    <p className="font-mono text-xs font-semibold uppercase tracking-widest text-green">LEVEL {topic.level} · {topic.levelTitle} · {topic.module}</p>
    <div className="mt-4 flex flex-wrap gap-2" aria-label="Lesson stages">{steps.map((s, i) => <span key={s} className={`rounded-full border px-3 py-1 text-xs ${i === 0 ? "border-green bg-green-soft text-green" : "border-line text-ink-faint"}`}>{String(i + 1).padStart(2,"0")} {s}</span>)}</div>
    <h1 className="mt-7 font-display text-5xl font-semibold tracking-tight sm:text-6xl">{topic.topic}</h1>
    <p className="mt-5 max-w-3xl text-xl leading-relaxed text-ink-soft">{text}</p>
    <section className="mt-12 grid gap-5 md:grid-cols-2">
      <article className="rounded-xl border border-line bg-paper-2 p-6"><p className="font-mono text-xs text-ink-faint">01 · WHAT & WHY</p><h2 className="mt-2 font-display text-2xl font-semibold">Understand the idea</h2><p className="mt-3 text-ink-soft">Start with the definition, then ask why the concept matters to a company, investor or market. Don't memorise a formula without understanding its drivers.</p></article>
      <article className="rounded-xl border border-line bg-paper-2 p-6"><p className="font-mono text-xs text-ink-faint">02 · SEE IT</p><h2 className="mt-2 font-display text-2xl font-semibold">Watch the relationship</h2><div className="mt-5 flex h-28 items-end gap-2" aria-label="Illustrative interactive visualization">{values.map((v,i)=><span key={i} className="flex-1 rounded-t bg-green" style={{height:`${Math.max(12,Math.min(100,Math.abs(v)))}%`}} />)}</div></article>
    </section>
    <section className="mt-5 rounded-xl border border-line bg-paper p-6 shadow-sm sm:p-8"><p className="font-mono text-xs text-green">03–05 · TRY → PRACTICE → BUILD</p><h2 className="mt-2 font-display text-3xl font-semibold">Sandbox</h2><p className="mt-2 text-ink-soft">Change one assumption at a time. Predict the direction before looking at the result.</p><div className="mt-6 grid gap-4 sm:grid-cols-3">{["Starting value","Driver A (%)","Driver B (%)"].map((label,i)=><label key={label} className="block text-sm font-semibold">{label}<input className="mt-2 w-full rounded-md border border-line bg-paper-2 px-3 py-2 font-mono" type="number" step="any" value={values[i]} onChange={(e)=>setValues(v=>v.map((x,j)=>j===i?(Number.isFinite(e.target.valueAsNumber)?e.target.valueAsNumber:0):x))} /></label>)}</div><div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-paper-2 p-5"><span className="text-sm text-ink-soft">Live result</span><strong className="font-mono text-2xl">{result.toFixed(2)}</strong></div></section>
    <section className="mt-5 grid gap-5 md:grid-cols-2"><article className="rounded-xl border border-line bg-paper-2 p-6"><p className="font-mono text-xs text-ink-faint">06 · CHECK</p><h2 className="mt-2 font-display text-2xl font-semibold">Prove your intuition</h2><p className="mt-3 text-sm text-ink-soft">Predict which input has the largest effect, then check your reasoning.</p><button type="button" className="btn-primary mt-5 px-4 py-2" onClick={()=>setChecked(true)}>{checked ? "Checked ✓" : "Check my intuition"}</button>{checked && <p className="mt-3 text-sm font-semibold text-green">Result recorded. Explain the economic mechanism in your own words.</p>}</article><article className="rounded-xl border border-line bg-paper-2 p-6"><p className="font-mono text-xs text-ink-faint">07 · APPLY</p><h2 className="mt-2 font-display text-2xl font-semibold">Use it in a model</h2><p className="mt-3 text-sm text-ink-soft">Connect this concept to a financial statement, valuation, transaction or investment case.</p></article></section>
    <section className="mt-5 rounded-xl border border-line bg-paper-2 p-6 sm:p-8"><p className="font-mono text-xs text-ink-faint">08 · MASTER</p><h2 className="mt-2 font-display text-3xl font-semibold">Teach it back</h2><p className="mt-3 text-ink-soft">Explain the concept, its formula or intuition, one real-world use, and one common mistake. Then move forward.</p>{next && <Link className="btn-primary mt-6 inline-flex px-4 py-2" to={`/topic/${makeSlug(next.topic)}`}>Next: {next.topic} →</Link>}</section>
  </div>;
}
