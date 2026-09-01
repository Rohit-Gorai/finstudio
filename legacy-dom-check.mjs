/**
 * Boots the LIVE (vanilla-JS) site in jsdom exactly as the browser does and
 * asserts the left pane and lesson page. Run: node tests/legacy-dom-check.mjs
 */
import { JSDOM } from "jsdom";
import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const dom = new JSDOM(html, { runScripts: "outside-only", url: "https://x.test/finstudio/#/c-compounding" });
const w = dom.window;
const files = ["js/engine.js","js/lessons/company.js","js/lessons/m1000.js","js/lessons/m1100.js",
  "js/lessons/m1200.js","js/lessons/m1300.js","js/lessons/m1400.js","js/lessons/m1500.js",
  "js/lessons/m1600.js","js/lessons/m2100.js","js/lessons/m2200.js","js/lessons/manifest.js",
  "js/lessons/concepts-l0.js","js/lessons/concepts-l1.js","js/lessons/curriculum-map.js",
  "js/master-curriculum.js","js/quizzes.js","js/reference.js","js/glossary.js","js/app.js"];
for (const f of files) { try { w.eval(readFileSync(f, "utf8")); } catch (e) { console.log("load fail", f, e.message.slice(0,80)); } }

await new Promise(r => setTimeout(r, 300));
const doc = w.document;
const rail = doc.getElementById("sidebar");
const levels = [...rail.querySelectorAll(".side-level")].map(n => n.textContent);
const fail = [];
const check = (c, m) => { if (!c) fail.push(m); };
console.log("rail sections:", levels.length);
console.log("levels 0-10 present:", [...Array(11).keys()].every(i => levels.some(t => t.startsWith("Level " + i + " ·"))));
console.log("reference kept:", levels.includes("Reference"));
console.log("linked topics:", rail.querySelectorAll(".side-lessons a").length);
console.log("planned (unlinked) topics:", rail.querySelectorAll(".side-lesson-planned").length);
const main = doc.querySelector("#content") || doc.body;
console.log("lesson h1:", main.querySelector("h1")?.textContent);
console.log("prev/next present:", !!main.querySelector(".lesson-nav a"));
console.log("nav labels:", [...main.querySelectorAll(".lesson-nav a")].map(a=>a.textContent.slice(0,26)));

check([...Array(11).keys()].every(i => levels.some(t => t.startsWith("Level " + i + " \u00b7"))), "not all 11 levels render");
check(levels.includes("Reference"), "reference block lost");
check(rail.querySelectorAll(".side-lesson-planned").length === 184, "unwritten topic count changed");
check(!!main.querySelector("h1"), "lesson did not render");
check(main.querySelectorAll(".lesson-nav a").length === 2, "prev/next missing");
if (fail.length) { console.log("\nDOM CHECK: FAIL"); fail.forEach(f => console.log(" - " + f)); process.exit(1); }
console.log("\nDOM CHECK: PASS");
