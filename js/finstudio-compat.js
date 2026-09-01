/* FinStudio GitHub Pages compatibility layer. */
(function () {
  "use strict";
  function slug(s) { return String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function topicId(level, module, title) { return "topic-l" + level + "-" + slug(module) + "-" + slug(title); }
  function fallback(id, title, module, level) {
    var lower = title.toLowerCase();
    var formula = "Define the concept → identify inputs → calculate → interpret.";
    if (/margin|ratio|return|multiple|yield|rate|turnover|coverage|moic|irr|beta|alpha|sharpe|peg/.test(lower)) formula = "Metric = relevant numerator ÷ relevant denominator; interpret it against history, peers and business economics.";
    else if (/value|valuation|price|revenue|profit|cash|debt|equity|cost|capital/.test(lower)) formula = "Outcome = economic drivers × assumptions; change one driver at a time and explain the movement.";
    var E = function(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");};
    return {id:id,minutes:7,title:title,short:title,desc:"A practice-first lesson on "+title+" for Level "+level+".",lede:"Understand "+title+" simply, see it in a realistic finance situation, practise it and test your judgement.",body:[
      {t:"h2",text:"What is this?"},{t:"p",h:E(title+" is a finance concept used to understand, measure or make decisions about a business, investment or transaction.")},
      {t:"h2",text:"Why does it matter?"},{t:"p",h:E("You will encounter "+title+" in "+module+". Learn what it measures, what drives it, where it appears and when it can mislead you.")},
      {t:"h2",text:"How it works"},{t:"p",h:"<strong>1.</strong> Define it.<br><br><strong>2.</strong> Identify inputs and outputs.<br><br><strong>3.</strong> Apply the relationship.<br><br><strong>4.</strong> Interpret the result in business context."},
      {t:"formula",title:"Core relationship",lines:[E(formula)]},
      {t:"example",h:"<p><strong>Real-world example.</strong> Imagine you are analysing an Indian company and "+E(title)+" changes during the year. Start with reported numbers, calculate or assess the concept, then trace the movement to operating drivers, accounting treatment, financing or assumptions.</p><p><strong>Simple takeaway:</strong> the number matters because it helps answer a business or investment question.</p>"},
      {t:"h2",text:"Practice"},{t:"practice",items:[
        {q:"Explain "+E(title)+" in your own words to someone who has never studied finance.",a:"Say what it measures, name its important inputs and explain why a manager, banker or investor cares."},
        {q:"Give one situation where "+E(title)+" could improve even though the underlying economics did not.",a:"Consider denominator effects, timing, accounting classification, one-offs, leverage or changed assumptions."},
        {q:"What numbers or facts would you collect before analysing "+E(title)+"?",a:"Start from the definition and identify the relevant numerator, denominator, operating drivers or cash flows."},
        {q:"What would you compare "+E(title)+" with before making a decision?",a:"Use historical performance, peers, management expectations and the assumptions behind the result."},
        {q:"Write a two-sentence professional conclusion about "+E(title)+".",a:"State what changed, explain the driver and conclude whether the change strengthens or weakens the economic story."}
      ]},
      {t:"h2",text:"Sandbox"},{t:"sandbox",title:E(title)+" — scenario sandbox",prompt:"Change the assumptions, predict the direction first, then explain the result.",kind:"opportunity",fields:[{key:"amount",label:"Capital",value:1000000,unit:"₹"},{key:"chosenReturn",label:"Scenario A",value:12,unit:"%"},{key:"alternativeReturn",label:"Scenario B",value:10,unit:"%"}]},
      {t:"h2",text:"Check your understanding"},
      {t:"mcq",q:"What should you do first when analysing "+E(title)+"?",opts:["Memorise a benchmark","Define what it measures and identify its inputs","Ignore the denominator","Look only at the latest period"],correct:1,why:["Benchmarks need context.","Correct. Definition and inputs come before calculation and comparison.","The denominator can materially change interpretation.","One period rarely explains the economics."]},
      {t:"mcq",q:"What makes an explanation of "+E(title)+" strongest?",opts:["Only the number","Linking the result to its underlying drivers","Choosing the largest value","Avoiding assumptions"],correct:1,why:["A number without context is incomplete.","Correct. Strong analysis connects the result to drivers and decisions.","Size alone does not determine quality.","Explicit assumptions make analysis stronger."]},
      {t:"mcq",q:"If "+E(title)+" changes unexpectedly, what should you check?",opts:["Accept it","Definitions, timing, one-offs and drivers","Delete it","Change currency"],correct:1,why:["Unexpected results need verification.","Correct. Check definitions, timing and underlying drivers.","Unexpected results can be informative.","Currency does not fix interpretation."]},
      {t:"h2",text:"Apply it"},{t:"note",h:"<strong>Mini case.</strong> You are reviewing a company and "+E(title)+" has moved materially year over year. Trace the movement to business drivers and assumptions, then write what changed, why, and whether it is durable."},
      {t:"h2",text:"Common mistakes"},{t:"p",h:"<ul><li>Using the concept without checking its definition.</li><li>Ignoring inputs, denominators or timing.</li><li>Confusing a reported result with its economic explanation.</li><li>Comparing unlike businesses without adjustment.</li></ul>"},
      {t:"h2",text:"Master"},{t:"note",h:"<strong>Interview challenge:</strong> Explain "+E(title)+" in 30 seconds, give a simple ₹ example, and name one way it could mislead you."},{t:"note",h:"<strong>Remember:</strong> Learn → See → Try → Practice → Build → Check → Apply → Master."}
    ]};
  }
  function ensureRoutes() {
    var LS=window.LS;if(!LS||!LS.curriculumMap||!LS.lessons)return;
    var seen={};
    LS.curriculumMap.forEach(function(lv){lv.modules.forEach(function(mod){mod.topics.forEach(function(topic){
      var id=topicId(lv.level,mod.title,topic.title); if(seen[id]) id+="-"+(++seen[id]); else seen[id]=1;
      var lesson=LS.lessons[topic.id];
      if(!lesson) Object.keys(LS.lessons).some(function(k){var l=LS.lessons[k];if(l&&l.title===topic.title){lesson=l;return true;}return false;});
      if(!lesson) lesson=fallback(id,topic.title,mod.title,lv.level);
      if(!LS.lessons[id]){var copy={};Object.keys(lesson).forEach(function(k){copy[k]=lesson[k];});copy.id=id;copy.title=topic.title;copy.short=copy.short||topic.title;LS.lessons[id]=copy;}
      topic.id=id;topic.written=true;
    });});});
    var c=null;LS.curriculumMap.some(function(lv){return lv.modules.some(function(m){return m.topics.some(function(t){if(lv.level===9&&t.title==="Convexity"){c=t.id;return true;}return false;});});});
    if(c&&LS.lessons[c])LS.lessons["9-fixed-income-convexity"]=LS.lessons[c];
  }
  function rewriteCurriculum(){var page=document.querySelector(".roadmap-page");if(!page)return;var i=0;Array.prototype.forEach.call(page.querySelectorAll(".roadmap-level"),function(s){s.id="level-"+(i++);});Array.prototype.forEach.call(page.querySelectorAll(".rt-planned"),function(node){var text=node.textContent.trim(),a=document.createElement("a");a.className="rt rt-universal";a.href="#/topic/"+slug(text);a.textContent=text;a.title="Open interactive FinStudio lesson";node.replaceWith(a);});}
  function resolveTopic(){var h=location.hash.replace(/^#\/?/,"");if(h.indexOf("topic/")!==0)return;var requested=h.slice(6).split("#")[0],match=null;var LS=window.LS;if(!LS||!LS.curriculumMap)return;LS.curriculumMap.some(function(lv){return lv.modules.some(function(m){return m.topics.some(function(t){if(slug(t.title)===requested){match=t;return true;}return false;});});});if(match&&match.id){var target="#/"+match.id;if(location.hash!==target)location.hash=target;}}
  function sync(){ensureRoutes();rewriteCurriculum();resolveTopic();}
  window.addEventListener("hashchange",function(){setTimeout(sync,0);});window.addEventListener("load",function(){setTimeout(sync,0);});setTimeout(sync,0);
})();
