import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Tone maps to the semantic palette. Note the *-text colours: the raw
 * green/yellow/red from the brief measure 2.28:1, 2.15:1 and 3.76:1 on
 * white, so words use the darker variant while the border keeps the hue.
 */
export type Tone = "note" | "tip" | "warning" | "danger";

const tones: Record<Tone, { box: string; label: string }> = {
  note: {
    box: "bg-brand-soft border-brand-border",
    label: "text-brand",
  },
  tip: {
    box: "bg-success-soft border-success-border",
    label: "text-success-text",
  },
  warning: {
    box: "bg-warning-soft border-warning-border",
    label: "text-warning-text",
  },
  danger: {
    box: "bg-danger-soft border-danger-border",
    label: "text-danger-text",
  },
};

export function Callout({
  tone = "note",
  title,
  children,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
}) {
  const t = tones[tone];
  return (
    <div className={cn("my-6 rounded-md border px-5 py-4", t.box)}>
      {title ? (
        <p className={cn("mb-1 text-small font-semibold", t.label)}>{title}</p>
      ) : null}
      <div className="text-small text-ink [&>p]:my-1">{children}</div>
    </div>
  );
}
