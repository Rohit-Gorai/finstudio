/**
 * Converts the Level 0 source document (extract-text markdown) into the live
 * site's LS.lessons format, writing js/lessons/concepts-l0.js.
 *
 * The document is the authority for prose, examples, key terms, practice,
 * mistakes, quiz and interview questions. Sandboxes are NOT in the document as
 * runnable specs, so the interactive sandbox definitions already written for
 * these topics are carried over unchanged.
 *
 * Run: node scripts/import-level0-doc.mjs <extracted.md> <sandboxes.json>
 */
import { readFileSync, writeFileSync } from "node:fs";

const [, , mdPath, sandboxPath, baselinePath] = process.argv;
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

/** Prose paragraphs, bullets folded into the preceding paragraph. */
function prose(ls = [], limit = 99) {
  const out = [];
  for (const p of paras(ls)) {
    if (isHeading(p)) { out.push(`<strong>${esc(headingText(p))}</strong>`); continue; }
    if (/^[-•]\s/.test(p)) {
      const items = p.split("\n").map((x) => x.replace(/^[-•]\s*/, "").trim()).filter(Boolean);
      out.push("<ul>" + items.map((x) => `<li>${html(x)}</li>`).join("") + "</ul>");
    } else out.push(html(p));
  }
  return out.slice(0, limit);
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

const blocks = topicBlocks();
const seen = new Set();
const lessons = [];
const report = [];

for (const b of blocks) {
  const id = ID_FOR[b.title];
  if (!id) { report.push(`skipped (unmapped title): ${b.title}`); continue; }
  if (seen.has(id)) { report.push(`skipped duplicate block: ${b.title}`); continue; }
  seen.add(id);

  const s = sections(b);
  const body = [];
  const push = (x) => body.push(x);

  const concept = prose(s["What is this?"]?.lines);
  push(`{ t: "h2", text: "What is this?" }`);
  concept.forEach((p) => push(`{ t: "p", h: ${q(p)} }`));

  if (s["Why does it matter?"]) {
    push(`{ t: "h2", text: "Why does it matter?" }`);
    prose(s["Why does it matter?"].lines).forEach((p) => push(`{ t: "p", h: ${q(p)} }`));
  }
  if (s["How does it work?"]) {
    push(`{ t: "h2", text: "How does it work?" }`);
    prose(s["How does it work?"].lines).forEach((p) => push(`{ t: "p", h: ${q(p)} }`));
  }
  if (s.Case) {
    const meaning = s["What It Means"] ? prose(s["What It Means"].lines) : [];
    push(
      `{ t: "example", h: ${q(
        `<p><strong>${esc(s.Case.head)}</strong></p>` +
          prose(s.Case.lines).map((p) => `<p>${p}</p>`).join("") +
          (meaning.length
            ? `<p><strong>What it means.</strong></p>` + meaning.map((p) => `<p>${p}</p>`).join("")
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
    push(`{ t: "h2", text: "What to remember" }`);
    push(`{ t: "note", h: ${q(prose(s["What to Remember"].lines).join("<br>"))} }`);
  }
  const mis = mistakes(s["Common Mistakes"]?.lines);
  if (mis.length) {
    push(`{ t: "h2", text: "Common mistakes" }`);
    push(`{ t: "p", h: ${q(mis.join("<br><br>"))} }`);
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
  qs.forEach((item) => {
    const opts = item.opts.map((o) => q(o)).join(", ");
    const why = item.opts
      .map((_, i) => (i === item.answer ? q("Correct.") : q("Not this one — review the section above.")))
      .join(", ");
    push(`{ t: "mcq", q: ${q(item.q)}, opts: [${opts}], correct: ${item.answer}, why: [${why}] }`);
  });

  const lede = concept[0] ? concept[0].replace(/<[^>]+>/g, "").split(". ")[0] + "." : "";
  lessons.push({
    id,
    title: TITLE_FOR[id],
    code: `  LS.lessons[${q(id)}] = {
    id: ${q(id)}, minutes: 8,
    title: ${q(TITLE_FOR[id])},
    short: ${q(TITLE_FOR[id])},
    desc: ${q(lede)},
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
  "js/lessons/concepts-l0.js",
  `/* Level 0 concept lessons.
   Prose, examples, key terms, practice, mistakes, quiz and interview questions
   are imported from the Level 0 source document via
   scripts/import-level0-doc.mjs. Sandboxes are carried over from the authored
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
