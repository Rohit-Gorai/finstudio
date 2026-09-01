/* FinStudio GitHub Pages compatibility layer.
 * Ensures the public legacy renderer exposes every master-curriculum topic as a
 * real lesson route, while preserving existing authored lessons and legacy URLs.
 */
(function () {
  "use strict";
  function slug(s) { return String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function topicId(level, module, title) { return "topic-l" + level + "-" + slug(module) + "-" + slug(title); }
  function fallback(id, title, module, level) {
    var lower = title.toLowerCase();
    var formula = "Start with the definition → identify the inputs → calculate the relationship → interpret the result.";
    if (/margin|ratio|return|multiple|yield|rate|turnover|coverage|moic|irr|beta|alpha|sharpe|peg/.test(lower)) formula = "Metric = Relevant numerator ÷ Relevant denominator\nInterpret it against history, peers and the underlying business economics.";
    else if (/value|valuation|price|revenue|profit|cash|debt|equity|cost|capital/.test(lower)) formula = "Outcome = economic drivers × assumptions\nChange one driver at a time and explain why the result moves.";
    return { id:id, minutes:7, title:title, short:title, desc:"A practice-first lesson on " + title + " for Level " + level + ".", lede:"Understand " + title + " from first principles, see it in a realistic finance situation, then practise it.", body:[
      {t:"h2",text:"What is this?"},{t:"p",h:esc(title+" is a finance concept used to understand, measure or make decisions about a business, investment or transaction.")},
      {t:"h2",text:"Why does it matter?"},{t:"p",h:esc("You will encounter "+title+" in "+module+". The goal is to understand what it measures, what drives it, where it appears and when it can mislead you.")},
      {t:"h2",text:"How it works"},{t:"p",h:"<strong>1.</strong> Define the concept.<br><br><strong>2.</strong> Identify its inputs and outputs.<br><br><strong>3.</strong> Apply the relevant relationship.<br><br><strong>4.</strong> Interpret the result in business context."},
      {t:"formula",title:"Core relationship",lines:[esc(formula)]},
      {t:"example",h:"<p><strong>Real-world example.</strong> Imagine you are analysing a growing Indian company. "+esc(title)+" changes during the year. Start with the company's reported numbers, calculate or assess the concept, and trace the movement back to operating drivers, accounting treatment, financing or assumptions.</p><p><strong>What it means:</strong> the useful answer is not just the number — it is the reason the number changed and what decision that change supports.</p>"},
      {t:"h2",text:"Practice"},{t:"practice",items:[
        {q:"Explain "+esc(title)+" in your own words to someone who has never studied finance.",a:"State what it measures, name its important inputs, and explain why a manager, banker or investor would care."},
        {q:"Give one situation where "+esc(title)+" could improve even though the underlying economics did not.",a:"Consider denominator effects, timing, accounting classification, one-off items, leverage or changes in assumptions."},
        {q:"What numbers or facts would you collect before analysing "+esc(title)+"?",a:"Start from the definition and identify the numerator, denominator, operating drivers or relevant cash flows."},
        {q:"What would you compare "+esc(title)+" with before making a decision?",a:"Use historical performance, comparable companies, management expectations and the assumptions behind the result."},
        {q:"Write a two-sentence professional conclusion about "+esc(title)+".",a:"State what changed, explain the driver, and conclude whether the change strengthens or weakens the economic story."}
      ]},
      {t:"h2",text:"Sandbox"},{t:"sandbox",title:esc(title)+" — scenario sandbox",prompt:"Change the assumptions, predict the direction first, then explain the result.",kind:"opportunity",fields:[{key:"amount",label:"Capital",value:1000000,unit:"₹"},{key:"chosenReturn",label:"Scenario A",value:12,unit:"%"},{key:"alternativeReturn",label:"Scenario B",value:10,unit:"%"}]},
      {t:"h2",text:"Check your understanding"},
      {t:"mcq",q:"What should you do first when analysing "+esc(title)+"?",opts:["Memorise a benchmark","Define what it measures and identify its inputs","Ignore the denominator","Look only at the latest period"],correct:1,why:["Benchmarks are useful only after the metric is understood.","Correct. Definition and inputs come before calculation and comparison.","The denominator can materially change interpretation.","One period rarely explains the economics."]},
      {t:"mcq",q:"What makes a finance explanation of "+esc(title)+" strongest?",opts:["Giving only the number","Linking the result to its underlying drivers","Choosing the largest possible value","Avoiding assumptions"],correct:1,why:["A number without context is incomplete.","Correct. Strong analysis connects the result to drivers and decisions.","Size alone does not determine quality.","Explicit assumptions make analysis stronger."]},
      {t:"mcq",q:"If "+esc(title)+" changes unexpectedly, what should you check?",opts:["Accept it immediately","Definitions, timing, one-offs and underlying drivers","Delete the result","Change the currency"],correct:1,why:["Unexpected results need verification.","Correct. Check definitions, timing and drivers before concluding.","Unexpected results can reveal useful information.","Currency does not solve an interpretation issue."]},
      {t:"h2",text:"Apply it"},{t:"note",h:"<strong>Mini case.</strong> You are preparing an investment or transaction review and "+esc(title)+" has moved materially year over year. Trace the movement to its business drivers and assumptions. Then write: <em>what changed, why it changed, and whether you believe it is durable.</em>"},
      {t:"h2",text:"Common mistakes"},{t:"p",h:"<ul><li>Using the concept without checking its precise definition.</li><li>Ignoring inputs, denominators or timing.</li><li>Confusing a reported result with its economic explanation.</li><li>Comparing unlike businesses without understanding the differences.</li></ul>"},
      {t:"h2",text:"Master"},{t:"note",h:"<strong>Interview challenge:</strong> Explain "+esc(title)+" in 30 seconds, give a simple ₹ example, and name one way the concept could mislead you."},{t:"note",h:"<strong>Remember:</strong> Learn → See → Try → Practice → Build → Check → Apply → Master."}
    ]};
  }
  function makeAllTopicsRoutes() {
    var LS = window.LS;
    if (!LS || !LS.curriculumMap || !LS.lessons) return;
    var seen = {};
    LS.curriculumMap.forEach(function(lv){ lv.modules.forEach(function(mod){ mod.topics.forEach(function(topic){
      var oldId=topic.id, id=topicId(lv.level,mod.title,topic.title);
      if(seen[id]) id += "-"+(++seen[id]); else seen[id]=1;
      var lesson=LS.lessons[oldId];
      if(!lesson) Object.keys(LS.lessons).some(function(key){var c=LS.lessons[key];if(c&&c.title===topic.title){lesson=c;return true;}return false;});
      if(!lesson) lesson=fallback(id,topic.title,mod.title,lv.level);
      if(!LS.lessons[id]){var copy={};Object.keys(lesson).forEach(function(k){copy[k]=lesson[k];});copy.id=id;copy.title=topic.title;copy.short=copy.short||topic.title;LS.lessons[id]=copy;}
      topic.id=id; topic.written=true;
    });});});
    var convexityId=null;
    LS.curriculumMap.some(function(lv){return lv.modules.some(function(mod){return mod.topics.some(function(topic){if(lv.level===9&&topic.title==="Convexity"){convexityId=topic.id;return true;}return false;});});});
    if(convexityId&&LS.lessons[convexityId]) LS.lessons["9-fixed-income-convexity"]=LS.lessons[convexityId];
    if(LS.ui&&LS.ui.buildSidebar) LS.ui.buildSidebar();
  }
  function resolveTopicHash() {
    var h=location.hash.replace(/^#\/?/,"");
    if(h.indexOf("topic/")!==0) return false;
    var requested=h.slice(6).split("#")[0];
    var match=null;
    var LS=window.LS;
    if(LS&&LS.curriculumMap) LS.curriculumMap.some(function(lv){return lv.modules.some(function(mod){return mod.topics.some(function(topic){if(slug(topic.title)===requested){match=topic;return true;}return false;});});});
    if(match&&match.id&&location.hash!=="#/"+match.id){location.hash="#/"+match.id;return true;}
    return false;
  }
  function normalizeLegacyPath(){var p=location.pathname.replace(/\/+$/,"");var match=p.match(/^(.*\/finstudio)\/curriculum$/i);if(!match)return false;var nested=location.hash||"";var level=nested.match(/#(level-\d+)$/);var next="#/curriculum"+(level?"#"+level[1]:"");if(location.hash!==next){location.hash=next;return true;}return false;}
  function enhanceCurriculum(){var page=document.querySelector(".roadmap-page");if(!page)return;Array.prototype.forEach.call(page.querySelectorAll(".roadmap-level"),function(section,i){section.id="level-"+i;});Array.prototype.forEach.call(page.querySelectorAll(".rt-planned"),function(node){var topic=node.textContent.trim();if(!topic)return;var a=document.createElement("a");a.className="rt rt-universal";a.href="#/topic/"+slug(topic);a.textContent=topic;a.title="Open interactive FinStudio lesson";node.replaceWith(a);});}
  function scrollLevel(){var match=location.hash.match(/^#\/?curriculum#(level-\d+)$/);if(!match)return;setTimeout(function(){var target=document.getElementById(match[1]);if(target)target.scrollIntoView({behavior:"smooth",block:"start"});},100);}
  function sync(){if(normalizeLegacyPath())return;makeAllTopicsRoutes();if(resolveTopicHash())return;enhanceCurriculum();scrollLevel();}
  window.addEventListener("hashchange",function(){setTimeout(sync,0);});
  window.addEventListener("load",function(){setTimeout(sync,0);});
  setTimeout(sync,0);
})();
