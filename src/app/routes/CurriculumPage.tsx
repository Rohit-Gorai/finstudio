import { Link } from "react-router-dom";

const modules = [
  { id: "1000", title: "Foundations", lessons: 4, blurb: "The five buckets, accounting equation, double entry and the three statements." },
  { id: "1100", title: "Assets", lessons: 5, blurb: "PP&E, depreciation, inventory, receivables and cash." },
  { id: "1200", title: "Liabilities", lessons: 3, blurb: "Payables, borrowings and the right-hand side of the balance sheet." },
  { id: "1300", title: "Equity & the balance sheet", lessons: 3, blurb: "Share capital, retained earnings and a full balance-sheet capstone." },
  { id: "1400", title: "The income statement", lessons: 6, blurb: "Revenue, COGS, EBITDA, depreciation, interest, tax and profit." },
  { id: "1500", title: "The cash flow statement", lessons: 5, blurb: "Why profit isn't cash and how CFO, CFI and CFF connect." },
  { id: "1600", title: "Reading statements: ratios", lessons: 4, blurb: "Margins, liquidity, leverage and returns." },
  { id: "2100", title: "Linking the three statements", lessons: 3, blurb: "Build a linked model and learn to debug broken links." },
  { id: "2200", title: "Modelling & valuation", lessons: 5, blurb: "Drivers, projections, FCFF, DCF and valuation." },
];

export function CurriculumPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-green">Curriculum</p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-6xl">From accounting basics to valuation.</h1>
        <p className="mt-5 text-lg text-ink-soft">A practical finance curriculum. Learn the idea, see the mechanics, then build the number yourself.</p>
      </header>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {modules.map((m, i) => (
          <Link key={m.id} to={`/module/${m.id}`} className="group rounded-lg border border-line bg-paper-2 p-6 no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-4"><span className="font-mono text-xs text-ink-faint">{String(i + 1).padStart(2, "0")}</span><span className="font-mono text-xs text-ink-faint">{m.lessons} lessons</span></div>
            <h2 className="mt-5 font-display text-2xl font-semibold group-hover:text-green">{m.title}</h2>
            <p className="mt-2 text-sm text-ink-soft">{m.blurb}</p>
            <p className="mt-5 text-sm font-semibold text-green">Explore module →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
