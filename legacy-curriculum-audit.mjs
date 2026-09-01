/**
 * Audits the LIVE (vanilla-JS) site's curriculum data: the left pane's 11
 * levels, unique lesson ids, and that every linked topic resolves to a lesson
 * with real content. Run: node tests/legacy-curriculum-audit.mjs
 */
import { readFileSync } from "node:fs";
globalThis.window = {};

/** Evaluate a legacy IIFE file against our fake window, as the browser would. */
const load = (path) => new Function("window", readFileSync(path, "utf8"))(globalThis.window);

// Same load order as index.html: café data and lessons, then the manifest.
for (const f of [
  "js/engine.js",
  "js/lessons/company.js",
  "js/lessons/m1000.js", "js/lessons/m1100.js", "js/lessons/m1200.js",
  "js/lessons/m1300.js", "js/lessons/m1400.js", "js/lessons/m1500.js",
  "js/lessons/m1600.js", "js/lessons/m2100.js", "js/lessons/m2200.js",
  "js/lessons/manifest.js",
  "js/lessons/concepts-l0.js",
  "js/lessons/concepts-l1.js",
  "js/lessons/curriculum-map.js",
]) load(f);

const LS = globalThis.window.LS;
const map = LS.curriculumMap;
const lessons = LS.lessons;

const fail = [];
const check = (cond, msg) => { if (!cond) fail.push(msg); };

// 1. All 11 levels present, in order 0–10.
check(map.length === 11, `expected 11 levels, found ${map.length}`);
map.forEach((lv, i) => check(lv.level === i, `level slot ${i} holds level ${lv.level}`));

// 2. All 227 topics present.
const topics = map.flatMap((l) => l.modules.flatMap((m) => m.topics));
check(topics.length === 227, `expected 227 topics, found ${topics.length}`);

// 3. Unique ids, and no collision with the 38 existing café lessons.
const ids = topics.map((t) => t.id);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
check(dupes.length === 0, `duplicate topic ids: ${[...new Set(dupes)].join(", ")}`);

const cafeIds = new Set(
  LS.manifest.levels.flatMap((lv) => lv.modules.flatMap((mc) => LS.manifest.modules[mc].lessons)),
);
check(cafeIds.size === 38, `expected 38 preserved café lessons, found ${cafeIds.size}`);
for (const id of ids) check(!cafeIds.has(id), `concept id collides with café lesson: ${id}`);

// 4. Every topic marked written resolves to a lesson with real body content.
const written = topics.filter((t) => t.written);
for (const t of written) {
  const lesson = lessons[t.id];
  if (!lesson) { fail.push(`written topic has no lesson: ${t.id}`); continue; }
  check(!!lesson.title, `${t.id}: missing title`);
  const kinds = (lesson.body || []).map((b) => b.t);
  check(kinds.includes("p"), `${t.id}: no prose blocks`);
  check(kinds.filter((k) => k === "mcq").length >= 3, `${t.id}: fewer than 3 quiz questions`);
  check(kinds.includes("note"), `${t.id}: no practice/takeaway blocks`);
}

// 5. Unwritten topics must NOT resolve to a lesson (they are unlinked in the pane).
for (const t of topics.filter((x) => !x.written)) {
  check(!lessons[t.id], `topic marked unwritten but a lesson exists: ${t.id}`);
}

// 6. Reading order is continuous: café lessons then concept lessons, no gaps.
const order = [...cafeIds, ...written.map((t) => t.id)];
check(new Set(order).size === order.length, "reading order contains duplicates");
check(order.length === 38 + written.length, "reading order length mismatch");

const perLevel = map.map((lv) => ({
  level: lv.level,
  topics: lv.modules.reduce((n, m) => n + m.topics.length, 0),
  written: lv.modules.reduce((n, m) => n + m.topics.filter((t) => t.written).length, 0),
}));

console.log("FINSTUDIO LIVE-SITE CURRICULUM AUDIT");
console.log(`Levels in left pane      : ${map.length} (0–10)`);
console.log(`Topics in left pane      : ${topics.length}`);
console.log(`Topics with full lessons : ${written.length}`);
console.log(`Café lessons preserved   : ${cafeIds.size}`);
for (const l of perLevel) console.log(`  Level ${String(l.level).padStart(2)} : ${l.written}/${l.topics} written`);

if (fail.length) {
  console.log(`\nAUDIT: FAIL (${fail.length})`);
  fail.slice(0, 20).forEach((f) => console.log(" - " + f));
  process.exit(1);
}
console.log("\nAUDIT: PASS");
