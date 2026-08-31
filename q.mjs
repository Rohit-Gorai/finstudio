import puppeteer from "/home/claude/.npm-global/lib/node_modules/@mermaid-js/mermaid-cli/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js";
const b=await puppeteer.launch({executablePath:"/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome",args:["--no-sandbox"]});
const p=await b.newPage(); await p.setViewport({width:390,height:844});
await p.goto("http://localhost:8877/#/1630-leverage",{waitUntil:"networkidle0"});
await new Promise(r=>setTimeout(r,400));
console.log(JSON.stringify(await p.evaluate(()=>{
  const a=[...document.querySelectorAll('.topbar-actions > *')];
  return a.map(n=>({tag:n.tagName,cls:n.className,text:n.textContent.trim(),
    deco:getComputedStyle(n).textDecorationLine, ws:getComputedStyle(n).whiteSpace,
    h:Math.round(n.getBoundingClientRect().height), w:Math.round(n.getBoundingClientRect().width)}));
}),null,1));
await b.close();
