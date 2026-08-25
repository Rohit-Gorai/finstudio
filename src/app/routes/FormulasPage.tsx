const formulas = [
  ["Accounting equation", "Assets = Liabilities + Equity", "Foundations"],
  ["Gross profit", "Revenue − COGS", "Income statement"],
  ["EBITDA", "EBIT + Depreciation + Amortisation", "Analysis"],
  ["EBIT", "Revenue − COGS − Operating expenses − D&A", "Income statement"],
  ["Working capital", "Current assets − Current liabilities", "Analysis"],
  ["Free cash flow", "EBIT × (1 − tax rate) + D&A − CapEx − ΔNWC", "Valuation"],
  ["Enterprise value", "PV of forecast FCF + PV of terminal value", "Valuation"],
  ["ROIC", "NOPAT ÷ Invested capital", "Analysis"],
];

export function FormulasPage() {
  return <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8"><header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-widest text-green">Reference</p><h1 className="mt-3 font-display text-5xl font-semibold">Formula library</h1><p className="mt-4 text-lg text-ink-soft">A quick-reference sheet for the formulas you will actually use in financial analysis and modeling.</p></header><div className="mt-10 overflow-hidden rounded-lg border border-line"><table className="w-full border-collapse text-left"><thead className="bg-paper-2"><tr><th className="p-4 text-sm">Formula</th><th className="p-4 text-sm">Expression</th><th className="p-4 text-sm">Area</th></tr></thead><tbody>{formulas.map(([name, formula, area]) => <tr key={name} className="border-t border-line-soft"><td className="p-4 font-semibold">{name}</td><td className="p-4 font-mono text-sm">{formula}</td><td className="p-4 text-sm text-ink-soft">{area}</td></tr>)}</tbody></table></div></div>;
}
