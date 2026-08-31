import { Link, useParams } from "react-router-dom";
import { allTopics, topicBySlug, topicRouteSlug } from "@/data/masterCurriculum";
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
const formulas: Record<string,string> = {
  EBITDA: "EBITDA = EBIT + D&A", "Free cash flow": "FCF = CFO − Capex", Valuation: "Value = PV of expected future cash flows", "Market capitalization": "Market cap = Share price × Shares outstanding", CAPM: "Required return = Rf + β × Equity risk premium", "Sharpe ratio": "Sharpe = (Return − Risk-free rate) ÷ Volatility", Beta: "β = Covariance(asset, market) ÷ Variance(market)", Alpha: "Alpha = Actual return − Expected/model return",
};

export function TopicPage() {
  const { topicSlug } = useParams();
  const topic = topicBySlug(topicSlug ?? "");
  const [values, setValues] = useState([100, 10, 5]);
  const [checked, setChecked] = useState(false);
  const index = topic ? allTopics.findIndex((x) => x.slug === topic.slug) : -1;
  const next = index >= 0 ? allTopics[index + 1] : undefined;
  const result = useMemo(() => (values[0] ?? 0) * (1 + (values[1] ?? 0) / 100 + (values[2] ?? 0) / 100), [values]);
  if (!topic) return <div className="mx-auto max-w-5xl px-5 py-20"><h1 className="font-display text-4xl font-semibold">Topic not found</h1><p className="mt-3 text-lg text-ink-soft">This topic is not in the FinStudio curriculum.</p><Link className="mt-6 inline-block text-base font-semibold text-green" to="/curriculum">Back to curriculum →</Link></div>;
  const text = descriptions[topic.topic] ?? `${topic.topic} is a finance building block. Start with what it means, understand its drivers, change assumptions in the sandbox, and connect the idea to a real finance decision.`;
  const formula = formulas[topic.topic] ?? `${topic.topic}: identify the inputs, understand the relationship, then test how changing one driver changes the output.`;
  const steps = ["Learn", "See", "Try", "Practice", "Build", "Check", "Apply", "Master"];
  return <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
    <Link to={`/level/${topic.level}`} className="text-base font-semibold text-green no-underline">← Level {topic.level}: {topic.levelTitle}</Link>
    <p className="mt-7 font-mono text-sm font-semibold uppercase tracking-widest text-green">LEVEL {topic.level} · {topic.module}</p>
    <div className="mt-4 flex flex-wrap gap-2" aria-label="Lesson stages">{steps.map((s, i) => <span key={s} className={`rounded-full border px-3 py-1.5 text-sm ${i === 0 ? "border-green bg-green-soft text-green" : "border-line text-ink-faint"}`}>{String(i + 1).padStart(2,"0")} {s}</span>)}</div>
    <h1 className="mt-7 font-display text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">{topic.topic}</h1>
    <p className="mt-6 max-w-3xl text-xl leading-9 text-ink-soft sm:text-2xl">{text}</p>

    <section className="mt-12 grid gap-5 md:grid-cols-2">
      <article className="rounded-xl border border-line bg-paper-2 p-7"><p className="font-mono text-sm text-ink-faint">01 · LEARN</p><h2 className="mt-2 font-display text-3xl font-semibold">What is {topic.topic}?</h2><p className="mt-4 text-lg leading-8 text-ink-soft">First understand the economic meaning. Ask: what does this number describe, who uses it, and what decision does it help us make?</p><p className="mt-5 rounded-lg border border-line bg-paper px-4 py-4 font-mono text-base leading-7">{formula}</p></article>
      <article className="rounded-xl border border-line bg-paper-2 p-7"><p className="font-mono text-sm text-ink-faint">02 · SEE</p><h2 className="mt-2 font-display text-3xl font-semibold">A simple example</h2><p className="mt-4 text-lg leading-8 text-ink-soft">Suppose a business starts at ₹100 and a driver changes by 10%. A second 5% driver change gives an illustrative output of <strong>{result.toFixed(2)}</strong>. The sandbox below lets you see the mechanics rather than memorising them.</p></article>
    </section>

    <section className="mt-5 rounded-xl border border-line bg-paper p-7 shadow-sm sm:p-8"><p className="font-mono text-sm text-green">03–05 · TRY → PRACTICE → BUILD</p><h2 className="mt-2 font-display text-3xl font-semibold">Interactive sandbox</h2><p className="mt-3 text-lg leading-8 text-ink-soft">Change one assumption at a time. Before changing it, predict whether the result should rise or fall and why.</p><div className="mt-7 grid gap-5 sm:grid-cols-3">{["Starting value","Driver A (%)","Driver B (%)"].map((label,i)=><label key={label} className="block text-base font-semibold">{label}<input aria-label={label} className="mt-2 w-full rounded-md border border-line bg-paper-2 px-4 py-3 text-lg font-mono" type="number" step="any" value={values[i] ?? 0} onChange={(e)=>setValues(v=>v.map((x,j)=>j===i?(Number.isFinite(e.target.valueAsNumber)?e.target.valueAsNumber:0):x))} /></label>)}</div><div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-paper-2 p-5"><span className="text-base text-ink-soft">Live result</span><strong className="font-mono text-3xl">{result.toFixed(2)}</strong></div></section>

    <section className="mt-5 grid gap-5 md:grid-cols-2"><article className="rounded-xl border border-line bg-paper-2 p-7"><p className="font-mono text-sm text-ink-faint">06 · CHECK</p><h2 className="mt-2 font-display text-3xl font-semibold">Test your understanding</h2><p className="mt-3 text-lg leading-8 text-ink-soft">If Driver A rises while everything else stays constant, what direction should the live result move? Predict first, then check.</p><button type="button" className="btn-primary mt-5 px-5 py-3 text-base" onClick={()=>setChecked(true)}>{checked ? "Checked ✓" : "Check my intuition"}</button>{checked && <p className="mt-4 text-base font-semibold text-green">Good. The important part is being able to explain the mechanism, not just the direction.</p>}</article><article className="rounded-xl border border-line bg-paper-2 p-7"><p className="font-mono text-sm text-ink-faint">07 · APPLY</p><h2 className="mt-2 font-display text-3xl font-semibold">Where does this show up?</h2><p className="mt-3 text-lg leading-8 text-ink-soft">Connect {topic.topic} to a company, financial statement, valuation, transaction or investment decision. Then ask what could make the number misleading.</p></article></section>

    <section className="mt-5 rounded-xl border border-line bg-paper-2 p-7 sm:p-8"><p className="font-mono text-sm text-ink-faint">08 · MASTER</p><h2 className="mt-2 font-display text-3xl font-semibold">Teach it back</h2><p className="mt-3 text-lg leading-8 text-ink-soft">Explain the definition, formula or intuition, one worked example, one real-world use and one common mistake. If you can do that without looking at the page, you own the concept.</p>{next && <Link className="btn-primary mt-6 inline-flex px-5 py-3 text-base" to={`/topic/${topicRouteSlug(next)}`}>Next: {next.topic} →</Link>}</section>
  </div>;
}
