/* ============================================================================
   Curriculum coverage gate.
   ----------------------------------------------------------------------------
   Run: node tests/coverage.test.mjs

   Reads the 227 topics in the published roadmap (js/master-curriculum.js) and
   checks each one against the authored lessons. A topic counts as covered only
   when a lesson claims it AND that lesson carries:

     · all four practice tiers        (§11)
     · at least one sandbox exercise  (the "practice it in the sandbox" rule)
     · a why-it-matters, common mistakes, real-world and takeaways  (§33-36)

   This does not pass today and is not meant to. It is the honest counter: it
   prints exactly which topics are still unwritten, so "every topic has a
   practice problem" is a number that can be checked rather than a claim.
   ========================================================================= */
import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "/home/claude/finstudio/node_modules/jsdom/lib/api.js";

const ROOT = process.env.FINSTUDIO_ROOT || ".";

/* ---- load the roadmap the site actually publishes ---- */
const dom = new JSDOM("<body>", { runScripts: "dangerously" });
dom.window.eval(fs.readFileSync(path.join(ROOT, "js/master-curriculum.js"), "utf8"));
const ROADMAP = dom.window.LS.masterCurriculum;

/* ---- load every authored v2 lesson ---- */
await import("../js/sheets/engine.js");
await import("../js/learn/practice.js");
await import("../js/learn/curriculum.js");
const lessonDir = path.join(ROOT, "js/learn/lessons");
for (const f of fs.readdirSync(lessonDir).filter((f) => f.endsWith(".js")).sort()) {
  await import(path.resolve(lessonDir, f));
}
const S = globalThis.FinSheets;
const P = globalThis.FinPractice;
const LESSONS = Object.values(globalThis.FinLessons || {});

/* ---- what does each lesson claim to cover? ---- */
const claimed = new Map();          // normalised topic -> [lesson]
const norm = (t) => String(t).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
for (const l of LESSONS) {
  for (const t of l.covers || []) {
    const k = norm(t);
    if (!claimed.has(k)) claimed.set(k, []);
    claimed.get(k).push(l);
  }
}

const TIERS = ["beginner", "practical", "application", "challenge"];
function qualifies(l) {
  const why = [];
  const tiers = new Set((l.practice || []).map((q) => q.tier));
  if (!TIERS.every((t) => tiers.has(t))) why.push("practice tiers");
  const hasSandbox = !!(l.sandbox && (l.sandbox.checks || []).length);
  if (!hasSandbox) why.push("sandbox exercise");
  if (!l.whyItMatters) why.push("whyItMatters");
  if (!(l.commonMistakes || []).length) why.push("commonMistakes");
  if (!(l.realWorld || []).length) why.push("realWorld");
  if (!(l.takeaways || []).length) why.push("takeaways");
  return why;
}

/* ---- walk the roadmap ---- */
let total = 0, covered = 0;
const perLevel = [];
const missing = [];
const partial = [];

for (const lv of ROADMAP) {
  let n = 0, c = 0;
  for (const m of lv.modules) {
    for (const topic of m.topics) {
      total++; n++;
      const hits = claimed.get(norm(topic)) || [];
      if (!hits.length) { missing.push(`L${lv.level} · ${topic}`); continue; }
      const gaps = qualifies(hits[0]);
      if (gaps.length) { partial.push(`L${lv.level} · ${topic} → ${hits[0].id} (${gaps.join(", ")})`); continue; }
      covered++; c++;
    }
  }
  perLevel.push({ level: lv.level, title: lv.title, covered: c, total: n });
}

/* ---- every authored sandbox must actually be solvable ---- */
let sandboxChecked = 0, sandboxBroken = [];
for (const l of LESSONS) {
  if (!l.sandbox || !(l.sandbox.checks || []).length) continue;
  if (!l.sandbox.solution) { sandboxBroken.push(`${l.id}: no solution on file to verify against`); continue; }
  const wb = new S.Workbook({ sheets: l.sandbox.sheets.map((s) => s.name) });
  for (const s of l.sandbox.sheets) {
    for (const [a, v] of Object.entries(s.cells)) wb.setRaw(s.name, a, v);
    for (const a of s.editable || []) wb.setRaw(s.name, a, "");
  }
  for (const [sheet, cells] of Object.entries(l.sandbox.solution))
    for (const [a, f] of Object.entries(cells)) wb.setRaw(sheet, a, f);
  const bad = wb.runChecks(l.sandbox.checks).filter((r) => !r.ok);
  if (bad.length) sandboxBroken.push(`${l.id}: ${bad.map((b) => b.label + " — " + b.why).join(" | ")}`);
  else sandboxChecked++;
}

/* ---- report ---- */
const bar = (c, t) => {
  const n = t ? Math.round((c / t) * 10) : 0;
  return "█".repeat(n) + "░".repeat(10 - n);
};
console.log("\n\x1b[1mCurriculum coverage — every roadmap topic needs a sandbox practice problem\x1b[0m\n");
for (const l of perLevel) {
  const pct = l.total ? Math.round((l.covered / l.total) * 100) : 0;
  console.log(
    `  L${String(l.level).padEnd(2)} ${bar(l.covered, l.total)} ${String(pct).padStart(3)}%  ` +
    `${String(l.covered).padStart(3)}/${String(l.total).padEnd(3)} ${l.title}`
  );
}
console.log(`\n  TOTAL ${bar(covered, total)} ${Math.round((covered / total) * 100)}%   ${covered}/${total} topics\n`);
console.log(`  Authored lessons: ${LESSONS.length}`);
console.log(`  Sandboxes verified solvable: ${sandboxChecked}`);
if (partial.length) {
  console.log(`\n  Claimed but incomplete (${partial.length}):`);
  partial.slice(0, 10).forEach((p) => console.log("    ~ " + p));
  if (partial.length > 10) console.log(`    … and ${partial.length - 10} more`);
}
if (sandboxBroken.length) {
  console.log(`\n\x1b[31m  BROKEN SANDBOXES (${sandboxBroken.length}):\x1b[0m`);
  sandboxBroken.forEach((b) => console.log("    ✗ " + b));
}
console.log(`\n  Still unwritten: ${missing.length} topics`);
missing.slice(0, 6).forEach((m) => console.log("    · " + m));
if (missing.length > 6) console.log(`    … and ${missing.length - 6} more\n`);

/* A broken sandbox is a hard failure. Unwritten topics are a number, not a
   failure — the point of this file is to keep that number honest. */
if (sandboxBroken.length) process.exit(1);
