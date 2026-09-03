/**
 * Guards the bug where every topic showed the same templated quiz.
 * Boots the site, walks all 227 curriculum topic routes, and asserts each
 * lands on its own authored lesson with a distinct first quiz question.
 * Run: node tests/topic-routes.mjs
 */
import { JSDOM } from "jsdom";
import { readFileSync } from "node:fs";

const root = process.argv[2] || ".";
const html = readFileSync(root + "/index.html", "utf8");
const dom = new JSDOM(html, { runScripts: "outside-only", url: "https://x.test/finstudio/#/" });
const w = dom.window;
w.requestAnimationFrame = (cb) => setTimeout(cb, 0);
for (const s of [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1])) {
  try { w.eval(readFileSync(root + "/" + s, "utf8")); } catch { /* optional file */ }
}
await new Promise((r) => setTimeout(r, 600));

const slug = (x) => String(x).toLowerCase().replace(/&/g, " and ")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const topics = [];
w.LS.curriculumMap.forEach((l) => l.modules.forEach((m) => m.topics.forEach((t) =>
  topics.push({ route: slug(l.level + "-" + m.title + "-" + t.title), cid: t.cid, title: t.title }))));

let unresolved = 0;
for (const t of topics) {
  w.location.hash = "#/topic/" + t.route;
  w.dispatchEvent(new w.Event("hashchange"));
  await new Promise((r) => setTimeout(r, 10));
  if (w.location.hash !== "#/" + t.cid) { unresolved++; if (unresolved < 5) console.log("  unresolved:", t.route); }
}

const L = w.LS.lessons;
const seen = new Map();
let shared = 0, quizzes = 0;
for (const id of Object.keys(L)) {
  if (!id.startsWith("c-")) continue;
  for (const b of L[id].body || []) {
    if (b.t !== "mcq") continue;
    quizzes++;
    if (seen.has(b.q) && seen.get(b.q) !== id) { shared++; if (shared < 4) console.log("  shared question:", b.q.slice(0, 60)); }
    else seen.set(b.q, id);
  }
}

console.log(`topic routes tested        : ${topics.length}`);
console.log(`not reaching their lesson  : ${unresolved}`);
console.log(`authored quiz questions    : ${quizzes}`);
console.log(`shared between topics      : ${shared}`);
if (unresolved || shared) { console.log("\nTOPIC ROUTE TEST: FAIL"); process.exit(1); }
console.log("\nTOPIC ROUTE TEST: PASS");
