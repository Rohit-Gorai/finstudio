import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="measure text-center">
      <p className="font-mono text-h1 text-brand">404</p>
      <h1 className="mt-2">This page doesn't tie.</h1>
      <p className="mt-3 text-ink-2">
        There's nothing at this address. It may have moved, or the link may have
        been mistyped.
      </p>
      <Link to="/" className="mt-6 inline-block">
        <Button>Back to the syllabus</Button>
      </Link>
    </div>
  );
}
