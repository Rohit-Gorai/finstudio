import fs from "node:fs";
import { execSync } from "node:child_process";

const curriculum = fs.readFileSync("src/data/masterCurriculum.ts", "utf8");
const learning = fs.readFileSync("src/data/topicLearning.ts", "utf8");
const lesson = fs.readFileSync("src/data/lessonContent.ts", "utf8");
const topicPage = fs.readFileSync("src/app/routes/TopicPage.tsx", "utf8");
const sidebar = fs.readFileSync("src/app/RootLayout.tsx", "utf8");
const tests = fs.readFileSync("tests/curriculum.test.ts", "utf8");

const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const levels = [...curriculum.matchAll(/\{level:(\d+),title:/g)].map(m => Number(m[1]));
expect(JSON.stringify(levels) === JSON.stringify([...Array(11).keys()]), `Expected Levels 0–10; found ${levels.join(", ")}`);

const topicEntries = [...curriculum.matchAll(/M\('[^']+',\[([^\]]+)\]\)/g)];
const topics = topicEntries.flatMap(m => [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]));
expect(topics.length > 200, `Expected >200 curriculum topics; found ${topics.length}`);
expect(new Set(topics).size === topics.length, "Duplicate topic names exist in the canonical curriculum; duplicate names need contextual IDs before they can be unique objects.");

for (const required of ["allTopics", "topicRouteSlug", "topicBySlug"]) expect(curriculum.includes(`export const ${required}`), `Canonical registry missing ${required}`);
for (const required of ["objectives", "mechanics", "workedExample", "practice", "questions", "sandbox", "caseStudy", "mistakes", "interview", "challenge", "summary"]) expect(learning.includes(`${required}:`), `Learning contract missing ${required}`);
for (const required of ["topicBySlug", "topicRouteSlug", "getTopicLearning", "markTopicComplete", "Previous topic", "Next topic", "Breadcrumb", "Mark lesson complete"]) expect(topicPage.includes(required), `TopicPage missing ${required}`);
for (const required of ["curriculum", "allTopics", "topicRouteSlug", "levelProgress", "moduleProgress"]) expect(sidebar.includes(required), `Sidebar is not deriving from ${required}`);
expect(tests.includes("contains every level from 0 through 10"), "Core curriculum test does not assert Level 0–10 coverage");

try { execSync("npm test -- --runInBand", { stdio: "inherit" }); } catch { failures.push("Vitest failed; see test output above."); }
try { execSync("npm run build", { stdio: "inherit" }); } catch { failures.push("Production build failed; see build output above."); }

if (failures.length) {
  console.error("\nFINSTUDIO CURRICULUM AUDIT: FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`\nFINSTUDIO CURRICULUM AUDIT: PASS (${topics.length} topics structurally covered; Levels 0–10 present)`);
