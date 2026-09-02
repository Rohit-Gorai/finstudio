/**
 * Converts a level's source document (extract-text markdown) into the live
 * site's LS.lessons format, writing js/lessons/concepts-l0.js.
 *
 * The document is the authority for prose, examples, key terms, practice,
 * mistakes, quiz and interview questions. Sandboxes are NOT in the document as
 * runnable specs, so the interactive sandbox definitions already written for
 * these topics are carried over unchanged.
 *
 * Run: node scripts/import-level-doc.mjs <level> <extracted.md> <sandboxes.json> <baseline.js>
 */
import { readFileSync, writeFileSync } from "node:fs";

const [, , level, mdPath, sandboxPath, baselinePath] = process.argv;
const lines = readFileSync(mdPath, "utf8").split("\n");
const sandboxes = JSON.parse(readFileSync(sandboxPath, "utf8"));

const esc = (s) =>
  String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\s*\n\s*/g, " ").trim();
const q = (s) => `"${esc(s)}"`;
/** Inline markdown bold -> HTML, since the lesson engine renders HTML. */
const html = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

const isHeading = (l) => /^\*\*(.+)\*\*$/.test(l.trim());
const headingText = (l) =>
  l.trim().replace(/^\*\*|\*\*$/g, "").replace(/\*\*/g, "").replace(/:$/, "").trim();

/** Split the document into topic blocks: a heading immediately followed by "What is this?". */
function topicBlocks() {
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (headingText(lines[i] || "") === "What is this?" && isHeading(lines[i])) {
      let t = i - 1;
      while (t >= 0 && !lines[t].trim()) t--;
      out.push({ title: headingText(lines[t]), start: i, titleLine: t });
    }
  }
  return out.map((b, i) => ({
    ...b,
    end: i + 1 < out.length ? out[i + 1].titleLine : lines.length,
  }));
}

/** Section map inside a topic: heading -> [lines] (top-level sections only). */
function sections(block) {
  const known = new Set([
    "What is this?", "Why does it matter?", "How does it work?", "What It Means",
    "Key Terms", "Practice Questions", "Sandbox", "What to Remember",
    "Common Mistakes", "Check Yourself", "Interview Questions",
  ]);
  const map = {};
  let current = null;
  for (let i = block.start; i < block.end; i++) {
    const raw = lines[i];
    if (isHeading(raw)) {
      const h = headingText(raw);
      if (known.has(h)) { current = h; map[current] = { head: h, lines: [] }; continue; }
      if (/^Real-Life Case Study/i.test(h)) { current = "Case"; map.Case = { head: h, lines: [] }; continue; }
    }
    if (current) map[current].lines.push(raw);
  }
  return map;
}

const paras = (ls = []) =>
  ls.join("\n").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

/**
 * Turn a section's raw lines into typed segments:
 *   { kind: "head", text }  { kind: "para", html }  { kind: "list", items[] }
 *
 * The source separates every bullet with a blank line, so consecutive
 * single-bullet paragraphs are merged back into one list. Emitting a real list
 * block (rather than <ul> inside <p>) is what keeps indentation and spacing
 * aligned with the rest of the page.
 */
function segments(ls = []) {
  const out = [];
  for (const p of paras(ls)) {
    if (!p.replace(/[*\s]/g, "")) continue; // blank / decorative
    if (isHeading(p)) { out.push({ kind: "head", text: headingText(p) }); continue; }
    if (/^[-•]\s/.test(p)) {
      const items = p.split("\n")
        .map((x) => x.replace(/^[-•]\s*/, "").trim())
        .filter(Boolean)
        .map(html);
      const last = out[out.length - 1];
      if (last && last.kind === "list") last.items.push(...items);
      else out.push({ kind: "list", items });
      continue;
    }
    const h = html(p);
    if (h.replace(/<[^>]+>/g, "").trim()) out.push({ kind: "para", html: h });
  }
  return out;
}

/** Push a section's segments as proper blocks. */
function pushSegments(body, ls) {
  for (const seg of segments(ls)) {
    if (seg.kind === "head") body.push(`{ t: "h3", text: ${q(seg.text)} }`);
    else if (seg.kind === "list") body.push(`{ t: "list", items: [${seg.items.map(q).join(", ")}] }`);
    else body.push(`{ t: "p", h: ${q(seg.html)} }`);
  }
}

/** Flatten segments to inline HTML, for places that take a single string. */
function prose(ls = [], limit = 99) {
  return segments(ls)
    .map((seg) =>
      seg.kind === "head" ? `<strong>${esc(seg.text)}</strong>`
        : seg.kind === "list" ? "<ul>" + seg.items.map((i) => `<li>${i}</li>`).join("") + "</ul>"
        : seg.html,
    )
    .slice(0, limit);
}


/**
 * Case studies in the source are written as alternating label / value lines
 * ("Daily Sales:" then "800 cups"). Rendered as separate paragraphs they read
 * as a ragged column, so pair them into aligned rows instead.
 */
function caseHtml(ls = []) {
  const segs = segments(ls);
  const parts = [];
  let rows = [];
  const flushRows = () => {
    if (rows.length) {
      parts.push(`<div class="case-figures">${rows.join("")}</div>`);
      rows = [];
    }
  };
  for (let i = 0; i < segs.length; i++) {
    const seg = segs[i];
    if (seg.kind === "list") {
      flushRows();
      parts.push("<ul class=\"lesson-list\">" + seg.items.map((x) => `<li>${x}</li>`).join("") + "</ul>");
      continue;
    }
    if (seg.kind === "head") { flushRows(); parts.push(`<p><strong>${esc(seg.text)}</strong></p>`); continue; }
    const text = seg.html.replace(/<[^>]+>/g, "").trim();
    const next = segs[i + 1];
    const nextText = next && next.kind === "para" ? next.html.replace(/<[^>]+>/g, "").trim() : "";
    const isLabel = /:$/.test(text) && text.length <= 60;
    const isValue = nextText && !/:$/.test(nextText) && nextText.length <= 70;
    if (isLabel && isValue) {
      rows.push(
        `<div class="case-row"><span class="case-label">${esc(text.replace(/:$/, ""))}</span>` +
          `<span class="case-value">${next.html}</span></div>`,
      );
      i++;
      continue;
    }
    flushRows();
    parts.push(`<p>${seg.html}</p>`);
  }
  flushRows();
  return parts.join("");
}

/** "**Term**\n\ndefinition" pairs. */
function defs(ls = []) {
  const out = [];
  const ps = paras(ls);
  for (let i = 0; i < ps.length; i++) {
    if (isHeading(ps[i]) && ps[i + 1] && !isHeading(ps[i + 1])) {
      out.push({ term: headingText(ps[i]), def: ps[i + 1] });
      i++;
    }
  }
  return out;
}

/** Question N / Worked Solution pairs. */
function practice(ls = []) {
  const ps = paras(ls);
  const items = [];
  let q = null, mode = null;
  for (const p of ps) {
    if (isHeading(p)) {
      const h = headingText(p);
      if (/^Question/i.test(h)) { mode = "q"; q = { q: [], a: [] }; items.push(q); continue; }
      if (/^Worked Solution/i.test(h)) { mode = "a"; continue; }
      continue;
    }
    if (q && mode) q[mode].push(p);
  }
  return items
    .filter((x) => x.q.length && x.a.length)
    .map((x) => ({ q: prose(x.q).join(" "), a: prose(x.a).join("<br>") }));
}

/** "Mistake N" blocks, or plain bullets. */
function mistakes(ls = []) {
  const ps = paras(ls);
  const out = [];
  for (let i = 0; i < ps.length; i++) {
    if (isHeading(ps[i])) {
      const body = ps[i + 1] && !isHeading(ps[i + 1]) ? ps[i + 1] : "";
      if (body) { out.push(`<strong>${esc(headingText(ps[i]))}.</strong> ${html(body)}`); i++; }
    } else if (/^[-•]\s/.test(ps[i])) {
      ps[i].split("\n").forEach((x) => { const v = x.replace(/^[-•]\s*/, "").trim(); if (v) out.push(html(v)); });
    } else out.push(html(ps[i]));
  }
  return out;
}

/** MCQs with the correct option marked by a check mark. */
function quiz(ls = []) {
  const ps = paras(ls);
  const out = [];
  let cur = null;
  for (const p of ps) {
    if (isHeading(p)) {
      if (cur && cur.opts.length >= 2 && cur.answer >= 0) out.push(cur);
      cur = { q: headingText(p).replace(/^\d+[.)]\s*/, ""), opts: [], answer: -1 };
      continue;
    }
    if (!cur) continue;
    for (const line of p.split("\n")) {
      const m = line.trim().match(/^([A-D])[.)]\s*(.+)$/);
      if (!m) continue;
      let text = m[2].trim();
      if (/[✅✔️✔]/.test(text)) { cur.answer = cur.opts.length; text = text.replace(/[✅✔️✔]/g, "").trim(); }
      cur.opts.push(text);
    }
  }
  if (cur && cur.opts.length >= 2 && cur.answer >= 0) out.push(cur);
  return out;
}

/** Interview Q&A pairs. */
function interview(ls = []) {
  const ps = paras(ls);
  const out = [];
  for (let i = 0; i < ps.length; i++) {
    if (isHeading(ps[i]) && ps[i + 1] && !isHeading(ps[i + 1])) {
      out.push({ q: headingText(ps[i]), a: ps[i + 1] });
      i++;
    }
  }
  return out;
}

/* ---- Topic title -> lesson id, matching the curriculum map ---- */
const ID_FOR = {
  "What is Finance?": "c-what-is-finance",
  "Personal Finance vs Corporate Finance vs Investing": "c-personal-corporate-investing",
  "Financial Markets": "c-financial-markets",
  "Companies and Capital": "c-companies-and-capital",
  "Revenue": "c-revenue",
  "Costs": "c-costs",
  "Profit": "c-profit",
  "Cash": "c-cash",
  "Assets": "c-assets",
  "Liabilities": "c-liabilities",
  "Equity": "c-equity",
  "Debt": "c-debt",
  "Interest": "c-interest",
  "Risk": "c-risk",
  "Return": "c-return",
};
const TITLE_FOR = {
  "c-what-is-finance": "What is finance?",
  "c-personal-corporate-investing": "Personal finance vs corporate finance vs investing",
  "c-financial-markets": "Financial markets",
  "c-companies-and-capital": "Companies and capital",
  "c-revenue": "Revenue", "c-costs": "Costs", "c-profit": "Profit", "c-cash": "Cash",
  "c-assets": "Assets", "c-liabilities": "Liabilities", "c-equity": "Equity",
  "c-debt": "Debt", "c-interest": "Interest", "c-risk": "Risk", "c-return": "Return",
};


const LEVEL1_ID_FOR = {
  "Accounting Equation": "c-accounting-equation",
  "Double-Entry Accounting": "c-double-entry-accounting",
  "Debits and Credits": "c-debits-and-credits",
  "Chart of Accounts": "c-chart-of-accounts",
  "Accrual Accounting": "c-accrual-accounting",
  "Cash Accounting": "c-cash-accounting",
  "Revenue Recognition": "c-revenue-recognition",
  "Expenses": "c-expenses",
  "Accounts Receivable": "c-accounts-receivable",
  "Accounts Payable": "c-accounts-payable",
  "Inventory": "c-inventory",
  "Prepaid Expenses": "c-prepaid-expenses",
  "Deferred Revenue": "c-deferred-revenue",
  "Accrued Expenses": "c-accrued-expenses",
  "Working Capital": "c-working-capital",
  "Depreciation": "c-depreciation",
  "Amortization": "c-amortization",
  "PP&E (Property, Plant & Equipment)": "c-ppe",
  "Goodwill": "c-goodwill",
  "Intangible Assets": "c-intangible-assets",
  "Retained Earnings": "c-retained-earnings",
};
const LEVEL1_TITLE_FOR = {
  "c-accounting-equation": "Accounting equation",
  "c-double-entry-accounting": "Double-entry accounting",
  "c-debits-and-credits": "Debits and credits",
  "c-chart-of-accounts": "Chart of accounts",
  "c-accrual-accounting": "Accrual accounting",
  "c-cash-accounting": "Cash accounting",
  "c-revenue-recognition": "Revenue recognition",
  "c-expenses": "Expenses",
  "c-accounts-receivable": "Accounts receivable",
  "c-accounts-payable": "Accounts payable",
  "c-inventory": "Inventory",
  "c-prepaid-expenses": "Prepaid expenses",
  "c-deferred-revenue": "Deferred revenue",
  "c-accrued-expenses": "Accrued expenses",
  "c-working-capital": "Working capital",
  "c-depreciation": "Depreciation",
  "c-amortization": "Amortization",
  "c-ppe": "PP&E",
  "c-goodwill": "Goodwill",
  "c-intangible-assets": "Intangible assets",
  "c-retained-earnings": "Retained earnings",
};

const IS_L1 = String(level) === "1";
const ID_MAP = IS_L1 ? LEVEL1_ID_FOR : ID_FOR;
const TITLE_MAP = IS_L1 ? LEVEL1_TITLE_FOR : TITLE_FOR;
const OUT_PATH = IS_L1 ? "js/lessons/concepts-l1.js" : "js/lessons/concepts-l0.js";

const baselineText = baselinePath ? readFileSync(baselinePath, "utf8") : "";
/** Pull the existing quiz blocks for one lesson out of the previous build. */
function baselineQuizBlocks(id) {
  const m = baselineText.match(
    new RegExp(`^ {2}LS\\.lessons\\["${id}"\\] = \\{[\\s\\S]*?^ {2}\\};$`, "m"),
  );
  if (!m) return [];
  return m[0].split("\n").map((l) => l.trim().replace(/,$/, "")).filter((l) => l.startsWith('{ t: "mcq"'));
}

const blocks = topicBlocks();
const seen = new Set();
const lessons = [];
const report = [];

for (const b of blocks) {
  const id = ID_MAP[b.title];
  if (!id) { report.push(`skipped (unmapped title): ${b.title}`); continue; }
  if (seen.has(id)) { report.push(`skipped duplicate block: ${b.title}`); continue; }
  seen.add(id);

  const s = sections(b);
  const body = [];
  const push = (x) => body.push(x);

  const concept = prose(s["What is this?"]?.lines);
  push(`{ t: "h2", text: "What is this?" }`);
  pushSegments(body, s["What is this?"]?.lines);

  if (s["Why does it matter?"]) {
    push(`{ t: "h2", text: "Why does it matter?" }`);
    pushSegments(body, s["Why does it matter?"].lines);
  }
  if (s["How does it work?"]) {
    push(`{ t: "h2", text: "How does it work?" }`);
    pushSegments(body, s["How does it work?"].lines);
  }
  if (s.Case) {
    const meaning = s["What It Means"] ? prose(s["What It Means"].lines) : [];
    push(
      `{ t: "example", h: ${q(
        `<p class="case-title"><strong>${esc(s.Case.head)}</strong></p>` +
          caseHtml(s.Case.lines) +
          (s["What It Means"]
            ? `<p class="case-meaning"><strong>What it means.</strong></p>` + caseHtml(s["What It Means"].lines)
            : ""),
      )} }`,
    );
  }
  const terms = defs(s["Key Terms"]?.lines);
  let termBullets = [];
  if (terms.length) {
    push(`{ t: "h2", text: "Key terms" }`);
    terms.forEach((t) => push(`{ t: "def", term: ${q(t.term)}, h: ${q(html(t.def))} }`));
  } else if (s["Key Terms"]) {
    // Some topics list the terms as bullets without definitions; keep the list.
    termBullets = paras(s["Key Terms"].lines)
      .flatMap((p) => p.split("\n"))
      .map((x) => x.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean);
    if (termBullets.length) {
      push(`{ t: "h2", text: "Key terms" }`);
      push(`{ t: "note", h: ${q(termBullets.map((t) => `<strong>${esc(t)}</strong>`).join(" · "))} }`);
    }
  }
  const pr = practice(s["Practice Questions"]?.lines);
  if (pr.length) {
    push(`{ t: "h2", text: "Practice" }`);
    push(`{ t: "practice", items: [${pr.map((p) => `{ q: ${q(p.q)}, a: ${q(p.a)} }`).join(", ")}] }`);
  }
  const sb = sandboxes[id];
  if (sb) {
    push(`{ t: "h2", text: "Sandbox" }`);
    const fields = sb.fields
      .map((f) => `{ key: ${q(f.key)}, label: ${q(f.label)}, value: ${f.defaultValue}` +
        (f.unit ? `, unit: ${q(f.unit)} }` : " }"))
      .join(", ");
    push(`{ t: "sandbox", kind: ${q(sb.kind)}, title: ${q(sb.title)}, prompt: ${q(sb.prompt)}, fields: [${fields}] }`);
  }
  if (s["What to Remember"]) {
    const segs = segments(s["What to Remember"].lines);
    const bullets = segs.flatMap((x) => (x.kind === "list" ? x.items : x.kind === "para" ? [x.html] : []));
    push(`{ t: "h2", text: "What to remember" }`);
    push(`{ t: "note", h: ${q("<ul>" + bullets.map((b) => `<li>${b}</li>`).join("") + "</ul>")} }`);
  }
  const mis = mistakes(s["Common Mistakes"]?.lines);
  if (mis.length) {
    push(`{ t: "h2", text: "Common mistakes" }`);
    push(`{ t: "list", items: [${mis.map(q).join(", ")}] }`);
  }
  const iv = interview(s["Interview Questions"]?.lines);
  if (iv.length) {
    push(`{ t: "h2", text: "Interview questions" }`);
    push(
      `{ t: "practice", items: [${iv
        .map((x) => `{ q: ${q(x.q)}, a: ${q(html(x.a))} }`)
        .join(", ")}] }`,
    );
  }
  const qs = quiz(s["Check Yourself"]?.lines);
  if (!qs.length) {
    // The document omits a quiz for this topic; keep the previous one rather
    // than shipping a lesson with nothing to test against.
    const kept = baselineQuizBlocks(id);
    kept.forEach((b) => push(b));
    if (kept.length) report.push(`${id}: document has no "Check Yourself" — kept ${kept.length} existing questions`);
    else report.push(`${id}: no quiz in document and none to carry over`);
  }
  qs.forEach((item) => {
    const opts = item.opts.map((o) => q(o)).join(", ");
    const why = item.opts
      .map((_, i) => (i === item.answer ? q("Correct.") : q("Not this one — review the section above.")))
      .join(", ");
    push(`{ t: "mcq", q: ${q(item.q)}, opts: [${opts}], correct: ${item.answer}, why: [${why}] }`);
  });

  /* The lede sits directly above "What is this?", so echoing that section's
     first sentence just prints the same line twice. Use the document's own
     summary line ("In simple terms: …") when there is one; otherwise take a
     later sentence; otherwise leave the lede off entirely. */
  const conceptText = concept.map((c) => c.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  const firstSentence = (conceptText[0] || "").split(/(?<=\.)\s/)[0];
  const simpleIdx = conceptText.findIndex((t) => /^in simple terms/i.test(t));
  let lede = "";
  if (simpleIdx >= 0 && conceptText[simpleIdx + 1]) lede = conceptText[simpleIdx + 1];
  else if (conceptText[1] && conceptText[1].length > 40) lede = conceptText[1].split(/(?<=\.)\s/)[0];
  if (lede && firstSentence && lede.slice(0, 45) === firstSentence.slice(0, 45)) lede = "";
  const desc = firstSentence || (conceptText[0] || "").slice(0, 160);
  lessons.push({
    id,
    title: TITLE_MAP[id],
    code: `  LS.lessons[${q(id)}] = {
    id: ${q(id)}, minutes: 8,
    title: ${q(TITLE_MAP[id])},
    short: ${q(TITLE_MAP[id])},
    desc: ${q(desc)},
    lede: ${q(lede)},
    body: [
      ${body.join(",\n      ")}
    ]
  };`,
    counts: {
      practice: pr.length, quiz: qs.length, terms: terms.length,
      interview: iv.length, sandbox: sb ? 1 : 0, example: s.Case ? 1 : 0,
      termList: termBullets.length,
    },
  });
}

/* Topics the document does not cover (it omits Liabilities and the whole
   "Time value & decision making" module) keep their existing lessons, so no
   Level 0 topic loses its page. */
const carried = [];
if (baselinePath) {
  const base = readFileSync(baselinePath, "utf8");
  const re = /^ {2}LS\.lessons\["([^"]+)"\] = \{[\s\S]*?^ {2}\};$/gm;
  let m;
  while ((m = re.exec(base))) {
    if (!seen.has(m[1])) { carried.push({ id: m[1], code: m[0] }); seen.add(m[1]); }
  }
}

writeFileSync(
  OUT_PATH,
  `/* Level ${level} concept lessons.
   Prose, examples, key terms, practice, mistakes, quiz and interview questions
   are imported from the Level ${level} source document via
   scripts/import-level-doc.mjs. Sandboxes are carried over from the authored
   interactive specs. Regenerate rather than editing by hand. */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});
  LS.lessons = LS.lessons || {};

${[...lessons.map((l) => l.code), ...carried.map((c) => c.code)].join("\n\n")}
})();
`,
);

console.log(`imported ${lessons.length} lessons from the document`);
for (const l of lessons) {
  const c = l.counts;
  console.log(
    `  ${l.id.padEnd(34)} terms:${c.terms || c.termList} practice:${c.practice} quiz:${c.quiz} ` +
      `interview:${c.interview} example:${c.example} sandbox:${c.sandbox}`,
  );
}
console.log(`carried over ${carried.length} lessons not present in the document:`);
carried.forEach((c) => console.log("    " + c.id));
report.forEach((r) => console.log("  ! " + r));
