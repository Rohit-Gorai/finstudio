import { useMemo, useState } from "react";
import type { PracticeItem, QuizItem, SandboxSpec } from "@/data/lessons/types";
import { computeSandbox } from "@/data/lessons/sandboxEngine";

/** Secondary-button style already used across the app. */
const secondaryBtn = "rounded-lg border border-line bg-paper px-4 py-2 text-sm font-semibold hover:bg-paper-2";

/* ── Practice: attempt in your own words, then compare with the solution ── */

function PracticeExercise({ item, index }: { item: PracticeItem; index: number }) {
  const [attempt, setAttempt] = useState("");
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="practice-exercise">
      <p className="topic-copy" style={{ fontWeight: 600 }}>
        {index + 1}. {item.question}
      </p>
      <textarea
        className="practice-answer"
        rows={2}
        placeholder="Work it out here first — then check."
        value={attempt}
        onChange={(e) => setAttempt(e.target.value)}
      />
      {revealed ? (
        <div className="practice-feedback compare">
          <p className="topic-copy"><strong>Worked solution.</strong> {item.solution}</p>
        </div>
      ) : (
        <button type="button" className={secondaryBtn} onClick={() => setRevealed(true)}>
          Show solution
        </button>
      )}
    </div>
  );
}

export function PracticeSection({ items }: { items: PracticeItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <PracticeExercise key={i} item={item} index={i} />
      ))}
    </div>
  );
}

/* ── Sandbox: editable inputs, live results, reset ───────────────────────── */

export function SandboxSection({ spec }: { spec: SandboxSpec }) {
  const defaults = useMemo(
    () => Object.fromEntries(spec.fields.map((f) => [f.key, String(f.defaultValue)])),
    [spec],
  );
  const [raw, setRaw] = useState<Record<string, string>>(defaults);
  const values = useMemo(
    () =>
      Object.fromEntries(
        spec.fields.map((f) => {
          const parsed = Number(raw[f.key]);
          return [f.key, Number.isFinite(parsed) ? parsed : 0];
        }),
      ),
    [raw, spec],
  );
  const outputs = computeSandbox(spec.kind, values);

  return (
    <div className="rounded-lg border border-line bg-paper-2 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-lg font-semibold">{spec.title}</h3>
        <button type="button" className={secondaryBtn} onClick={() => setRaw(defaults)}>
          Reset
        </button>
      </div>
      <p className="topic-copy mt-1 text-sm opacity-80">{spec.prompt}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {spec.fields.map((f) => (
          <label key={f.key} className="block text-sm">
            <span className="font-medium">
              {f.label}
              {f.unit ? <span className="opacity-60"> ({f.unit})</span> : null}
            </span>
            <input
              type="number"
              inputMode="decimal"
              className="practice-answer mt-1 w-full"
              value={raw[f.key] ?? ""}
              onChange={(e) => setRaw((prev) => ({ ...prev, [f.key]: e.target.value }))}
            />
          </label>
        ))}
      </div>

      <div className="mt-4 divide-y divide-line rounded-md border border-line bg-paper">
        {outputs.map((o) => (
          <div key={o.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between">
            <div className="min-w-0">
              <span className="text-sm font-medium">{o.label}</span>
              {o.note ? <p className="text-xs opacity-70">{o.note}</p> : null}
            </div>
            <span className="font-mono text-base font-semibold tabular-nums">{o.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Quiz: answer, get explained feedback, try again ─────────────────────── */

function QuizQuestion({ item, index }: { item: QuizItem; index: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const correct = selected === item.answer;

  return (
    <div className="quiz-question">
      <p className="topic-copy" style={{ fontWeight: 600 }}>
        {index + 1}. {item.question}
      </p>
      <div className="mt-3 space-y-2">
        {item.choices.map((choice, i) => {
          const state = !answered
            ? ""
            : i === item.answer
              ? " is-correct"
              : i === selected
                ? " is-incorrect"
                : "";
          return (
            <button
              key={i}
              type="button"
              className={`quiz-option${state}`}
              disabled={answered}
              onClick={() => setSelected(i)}
            >
              <span className="quiz-option-copy">{choice}</span>
            </button>
          );
        })}
      </div>
      {answered ? (
        <div className={`quiz-feedback ${correct ? "correct" : "incorrect"}`}>
          <p className="topic-copy">
            <strong>{correct ? "Correct." : "Not quite."}</strong> {item.explanation}
          </p>
          {!correct ? (
            <button type="button" className={secondaryBtn + " mt-2"} onClick={() => setSelected(null)}>
              Try again
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function QuizSection({ items }: { items: QuizItem[] }) {
  return (
    <div className="space-y-5">
      {items.map((item, i) => (
        <QuizQuestion key={i} item={item} index={i} />
      ))}
    </div>
  );
}
