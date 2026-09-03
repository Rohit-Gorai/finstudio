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

/* Phrases produced by the generated topic pages. If any appears on a rendered
   topic route, a template is being shown instead of the authored lesson. */
const TEMPLATE_MARKERS = [
  "useful professional habit",
  "assumption-free",
  "30-Second Master Challenge",
  "interpreted with its underlying assumptions",
  "numerator rises while the denominator",
];

let unresolved = 0, templated = 0, wrongTitle = 0;
for (const t of topics) {
  w.location.hash = "#/topic/" + t.route;
  w.dispatchEvent(new w.Event("hashchange"));
  await new Promise((r) => setTimeout(r, 12));
  if (w.location.hash !== "#/" + t.cid) { unresolved++; if (unresolved < 5) console.log("  unresolved:", t.route); }
  const main = w.document.getElementById("main");
  const text = main ? main.textContent : "";
  if (TEMPLATE_MARKERS.some((m) => text.includes(m))) {
    templated++;
    if (templated < 5) console.log("  templated content on:", t.route);
  }
  /* The heading must match the lesson the route resolved to. For the 29 café
     spreadsheet lessons mapped onto curriculum topics the lesson keeps its own
     title ("Opex & EBITDA" for the Operating expenses topic), so compare
     against the resolved lesson rather than the curriculum topic name. */
  const resolved = w.LS.lessons[t.cid];
  const expected = resolved && (resolved.title || "").trim();
  const h1 = main && main.querySelector("h1");
  if (!h1 || !expected || h1.textContent.trim() !== expected) {
    wrongTitle++;
    if (wrongTitle < 5) console.log("  wrong heading on:", t.route, "->", h1 && h1.textContent, "expected", expected);
  }
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
console.log(`showing templated content  : ${templated}`);
console.log(`wrong heading for the topic: ${wrongTitle}`);
console.log(`authored quiz questions    : ${quizzes}`);
console.log(`shared between topics      : ${shared}`);
if (unresolved || shared || templated || wrongTitle) { console.log("\nTOPIC ROUTE TEST: FAIL"); process.exit(1); }
console.log("\nTOPIC ROUTE TEST: PASS");
