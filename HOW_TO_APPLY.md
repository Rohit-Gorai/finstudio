# Upload these 5 files to the repo ROOT

Your `index.html` is already correct and loads these five from the root — the
same place your uploads land. Drag all five onto the repo's root file list,
replacing the existing copies. Nothing goes in a subfolder.

    app.js   site.css   concepts-l0.js   concepts-l1.js   curriculum-map.js

## What changes

**The duplicate Level 1 & 2 block at the top is gone.** The pane now reads:

    Level 0 · Finance Foundations
    Level 1 · Accounting Foundations
    …
    Level 10 · Advanced Finance
    Café model labs
    Reference

**The 38 café lessons weren't deleted — they moved inside the curriculum.**
29 of them are now the lesson for the topic they teach: "Opex & EBITDA" is now
Level 2 → Income statement → Operating expenses, "CFO (indirect)" is Level 2 →
Cash flow statement → CFO, and so on. Their spreadsheets and quizzes are
untouched. The 9 that don't map to a single topic (capstones, the five buckets,
module quizzes) sit under "Café model labs" at the foot.

**Previous / Next now walks Level 0 → Level 10 as one sequence**, no duplicates.

## Every clickable lesson now has

- What is this / Why it matters / How it works, in plain English
- A worked example with every arithmetic step shown
- Key terms, what to remember, common mistakes
- **Practice** — exercises with a text box to write your answer (saved in your
  browser, so it survives a refresh) and a "Show worked solution" button
- **Sandbox** — editable number inputs with live results and a Reset button.
  Change the interest rate or the years and the answer recalculates instantly.
  Real maths, not a mock-up: 24 calculators covering compounding, discounting,
  leverage, working capital, depreciation, deferred revenue and more
- **Quiz** — multiple choice with an explanation on every option
- Previous / Next

## Honest coverage

    Level  0 : 22/22 topics have lessons
    Level  1 : 21/21
    Level  2 : 19/33
    Level  3 :  5/18
    Level  4 :  4/29
    Level  5 :  1/28
    Levels 6-10 : 0/76
    ----------------------------
    Total    : 72/227 clickable

The other 155 topics are listed in the pane in grey and are not clickable — the
full path is visible, but no link leads to an empty page. Writing them is the
remaining work; I'd rather do them properly in batches than template 155 pages
of filler. Level 2 (14 topics left) then Level 3 (13 left) is the natural order.

## Verified before sending

Rebuilt your repo as it stands on GitHub, applied these files, booted it in a
browser engine:

- 0 assets failing to load
- pane: Levels 0-10, then Café model labs, then Reference — no duplicate levels
- 95 clickable lesson links · 155 topics shown as not-yet-written
- opened "Compounding": 3 practice boxes, 3 sandbox inputs computing live
  (₹2,20,000 on the defaults), 3 quizzes, Previous → Time value of money,
  Next → Inflation
- opened "Opex & EBITDA" from inside Level 2: renders with its spreadsheet intact
