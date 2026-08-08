import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";

/** Living reference for the design system, so drift is visible. */
export function StyleGuidePage() {
  return (
    <div className="measure">
      <h1>Design system</h1>
      <p className="mt-3 text-ink-2">
        Inter, an 800px measure and 1.7 line height. Every value below is a
        token in <code className="text-caption">src/styles/theme.css</code>.
      </p>

      <h2 className="mt-12">Type scale</h2>
      <div className="mt-4 space-y-3">
        <h1>H1 · 48px Bold</h1>
        <h2>H2 · 36px Bold</h2>
        <h3>H3 · 28px SemiBold</h3>
        <h4>H4 · 22px SemiBold</h4>
        <p className="text-body">Body · 18px, line height 1.7</p>
        <p className="text-small text-ink-2">Small · 16px</p>
        <p className="text-caption text-ink-2">Caption · 14px</p>
      </div>

      <h2 className="mt-12">Colour</h2>
      <p className="mt-2 text-small text-ink-2">
        Each swatch shows the fill hue and, where it differs, the darker
        variant used for text.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          ["Brand", "bg-brand", "text-brand", "#2563EB"],
          ["Success", "bg-success", "text-success-text", "#22C55E / #15803D"],
          ["Warning", "bg-warning", "text-warning-text", "#F59E0B / #B45309"],
          ["Danger", "bg-danger", "text-danger-text", "#EF4444 / #DC2626"],
          ["Ink", "bg-ink", "text-ink", "#0F172A"],
          ["Ink 2", "bg-ink-2", "text-ink-2", "#475569"],
        ].map(([name, fill, text, hex]) => (
          <div key={name} className="rounded-card border border-border p-3">
            <div className={`h-10 rounded ${fill}`} />
            <p className={`mt-2 text-small font-semibold ${text}`}>{name}</p>
            <p className="font-mono text-caption text-ink-2">{hex}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12">Buttons</h2>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button size="sm">Small</Button>
        <Button disabled>Disabled</Button>
      </div>

      <h2 className="mt-12">Callouts</h2>
      <Callout tone="note" title="Note">
        <p>Neutral context that supports the lesson.</p>
      </Callout>
      <Callout tone="tip" title="Key takeaway">
        <p>The thing to remember.</p>
      </Callout>
      <Callout tone="warning" title="Common mistake">
        <p>Where learners usually go wrong, and why.</p>
      </Callout>
      <Callout tone="danger" title="Careful">
        <p>An outright error to avoid.</p>
      </Callout>

      <h2 className="mt-12">Card</h2>
      <Card className="mt-4 p-5">
        <h3 className="text-h4">Card</h3>
        <p className="mt-1 text-small text-ink-2">
          One border, one hairline shadow. Minimal by design.
        </p>
      </Card>
    </div>
  );
}
