import { Link } from "react-router-dom";

export function NotFoundPage() {
  return <div className="mx-auto max-w-xl px-5 py-24 text-center"><p className="font-mono text-6xl font-semibold text-green">404</p><h1 className="mt-4 font-display text-4xl font-semibold">This page doesn't tie.</h1><p className="mt-4 text-ink-soft">There's nothing at this address. The link may have moved or the URL may be incomplete.</p><Link to="/" className="btn-primary mt-7 inline-flex">Back to FinStudio</Link></div>;
}
