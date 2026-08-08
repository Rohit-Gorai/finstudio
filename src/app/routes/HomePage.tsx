import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function HomePage() {
  return (
    <div className="measure">
      <h1>Learn Finance the Interactive Way</h1>
      <p className="mt-4 text-ink-2">
        Short lessons that end in a live spreadsheet where you build the number
        yourself — and the balance sheet has to tie. No videos, no sign-up.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button>Start learning</Button>
        <Link to="/style-guide">
          <Button variant="secondary">Design system</Button>
        </Link>
      </div>

      <Card className="mt-10 p-5">
        <h2 className="text-h4">Milestone 2 in progress</h2>
        <p className="mt-2 text-small text-ink-2">
          Toolchain and design system are in place. Navigation, the lesson
          engine and the spreadsheet sandbox follow in milestones 3–5. The
          existing 38-lesson curriculum is being ported as the quality
          benchmark — see <code className="text-caption">PROJECT_ANALYSIS.md</code>.
        </p>
      </Card>
    </div>
  );
}
