/* For every authored sandbox cell: solve it correctly, then replace the formula
   with the correct NUMBER. Any mustFormula check that still passes is a hole. */
await import("../js/sheets/engine.js");
await import("../js/learn/practice.js");
import fs from "node:fs"; import path from "node:path";
const dir = "js/learn/lessons";
for (const f of fs.readdirSync(dir).filter(f=>f.endsWith(".js")).sort())
  await import(path.resolve(dir,f));
const S = globalThis.FinSheets;
const L = Object.values(globalThis.FinLessons);

let cells=0, holes=[], blanks=0, blankHoles=[];
for (const l of L) {
  const sb=l.sandbox; if(!sb||!sb.solution) continue;
  const build=()=>{
    const wb=new S.Workbook({sheets:sb.sheets.map(s=>s.name)});
    for(const s of sb.sheets){ for(const [a,v] of Object.entries(s.cells)) wb.setRaw(s.name,a,v);
      for(const a of s.editable||[]) wb.setRaw(s.name,a,""); }
    for(const [sh,cs] of Object.entries(sb.solution))
      for(const [a,fm] of Object.entries(cs)) wb.setRaw(sh,a,fm);
    return wb;
  };
  for (const [sh,cs] of Object.entries(sb.solution)) {
    for (const a of Object.keys(cs)) {
      const guard = sb.checks.filter(c=>c.cell===a && (c.sheet||sh)===sh && c.mustFormula);
      if(!guard.length) continue;
      cells++;
      // 1. hardcode the right answer
      let wb=build();
      const v=wb.value(sh,a);
      if(typeof v==="number"){
        wb.setRaw(sh,a,String(v));
        if(wb.runChecks(guard).every(r=>r.ok)) holes.push(`${l.id} ${sh}!${a}`);
      }
      // 2. blank it
      blanks++;
      wb=build(); wb.setRaw(sh,a,"");
      if(wb.runChecks(sb.checks).every(r=>r.ok)) blankHoles.push(`${l.id} ${sh}!${a}`);
    }
  }
}
console.log(`Guarded cells tested: ${cells}`);
console.log(`Hardcoding the right answer passed anyway: ${holes.length}`);
holes.forEach(h=>console.log("   HOLE "+h));
console.log(`Blanking a cell left every check passing: ${blankHoles.length}`);
blankHoles.forEach(h=>console.log("   HOLE "+h));
if(holes.length||blankHoles.length) process.exit(1);
console.log("\n\x1b[32mNo holes: every guarded cell requires a real formula.\x1b[0m");
