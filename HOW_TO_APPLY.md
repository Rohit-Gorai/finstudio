# Level 1 rebuilt from your document

Replace **`concepts-l1.js`** in the repo root. That's the only file that changed
this round.

If the earlier files aren't up yet, upload these together — `app.js`,
`site.css`, `concepts-l0.js`, `concepts-l1.js`, `curriculum-map.js` — all to the
root. Without `app.js` the practice boxes and sandboxes won't render.

## I still can't push to your repo

No GitHub credentials exist in this environment; `git push` fails with "could
not read Username for https://github.com". You'll need to commit the file.

## What was imported

All 21 Level 1 topics rebuilt from your text, in its structure: What is this ·
Why does it matter · How does it work (step by step) · Real-Life Case Study +
What It Means · Key Terms · Practice Questions with worked solutions · What to
Remember · Common Mistakes · Check Yourself · Interview Questions.

Correct quiz answers were read from your ✅ marks.

Totals: **99 quiz questions · 168 practice/interview items · 99 key-term cards ·
21 worked case studies · 15 interactive sandboxes.**

## Three gaps in the document

1. **PP&E has no "Check Yourself" section** — no quiz at all, and no interview
   questions. Rather than ship a topic with nothing to test against, I kept its
   3 existing questions. Everything else in PP&E comes from your document.
2. **Cash accounting** and **Accrued expenses** have 3 quiz questions each and
   no interview questions, where other topics have 5 and ~6.
3. Six topics have no sandbox in the document (double-entry, debits and credits,
   chart of accounts, cash accounting, accrued expenses, intangible assets) —
   these are conceptual, so nothing numeric to model. The 15 working sandboxes
   were carried over from the interactive specs, since your document describes
   sandboxes as prose rather than runnable input/output definitions.

Send the missing PP&E quiz and I'll drop it straight in.

## Document quirks I had to correct

- `PP****&****E` — nested bold around the ampersands, which broke the title
- The **Retained Earnings** heading was fused onto the end of the previous
  paragraph ("…media companies.** ****Retained Earnings**"), so it wasn't a
  heading at all until separated

Both are fixed by the importer's normalisation step, not by hand-editing, so
re-running on an updated document works the same way.

## Verified

- 21 lessons load · 0 invalid quiz answers · 0 stray ✅ marks · 0 unconverted
  markdown · every lesson has a title and full body
- Booted in a browser engine: "Working capital" renders with 9 practice/interview
  boxes, a sandbox computing ₹33,00,000, 5 quizzes, Previous → Accrued expenses,
  Next → Depreciation
- Curriculum audit passes: 11 levels, 227 topics, 72 clickable

## Regenerating

    node scripts/import-level-doc.mjs 1 <extracted.md> <sandboxes.json> <baseline.js>

Pass `0` instead of `1` for Level 0. The same script now handles both.
