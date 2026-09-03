/* FinStudio — deterministic per-topic quiz state.
   Do not mutate shared lesson objects. Authored quizzes stay authored; every
   topic gets an isolated transient quiz session keyed by its lesson id. */
(function () {
  "use strict";
  var LS = window.LS = window.LS || {};
  if (!LS.curriculumMap || !LS.lessons) return;

  function clone(v) {
    if (!v || typeof v !== "object") return v;
    if (Array.isArray(v)) return v.map(clone);
    var o = {}; Object.keys(v).forEach(function(k){ o[k]=clone(v[k]); }); return o;
  }
  function strip(v) { var d=document.createElement("div"); d.innerHTML=String(v||""); return (d.textContent||"").replace(/\s+/g," ").trim(); }
  function mcqs(l) { return (l.body||[]).filter(function(b){return b&&b.t==="mcq";}); }
  function practices(l) { var a=[];(l.body||[]).forEach(function(b){if(b&&b.t==="practice"&&Array.isArray(b.items))b.items.forEach(function(x){if(x&&x.q&&x.a)a.push({q:strip(x.q),a:strip(x.a)});});});return a; }

  /* Detach all canonical topic lessons. The old route generator used shallow
     copies, so appending quiz blocks to one topic could mutate another. */
  var topics=[];
  (LS.curriculumMap||[]).forEach(function(lv){(lv.modules||[]).forEach(function(mod){(mod.topics||[]).forEach(function(t){if(t.id&&LS.lessons[t.id]){
    var fresh=clone(LS.lessons[t.id]); fresh.id=t.id; fresh.title=t.title||fresh.title; LS.lessons[t.id]=fresh;
    topics.push({id:t.id,title:fresh.title,lesson:fresh});
  }});});});

  function otherAnswers(id){var a=[];topics.forEach(function(x){if(x.id!==id)practices(x.lesson).forEach(function(p){if(p.a.length>18)a.push(p.a);});});var seen={};return a.filter(function(x){var k=x.toLowerCase();if(seen[k])return false;seen[k]=1;return true;});}

  /* Only generate additional questions when the topic genuinely lacks enough
     authored MCQs. The question text always comes from the current topic. */
  topics.forEach(function(x){
    var l=x.lesson, qs=mcqs(l); if(qs.length>=3)return;
    var pool=otherAnswers(x.id), ps=practices(l), out=qs.slice(), used={};
    qs.forEach(function(q){used[strip(q.q).toLowerCase()]=1;});
    ps.forEach(function(p){
      if(out.length>=5||used[p.q.toLowerCase()])return;
      var d=[];pool.forEach(function(a){if(d.length<3&&a.toLowerCase()!==p.a.toLowerCase())d.push(a);});
      if(d.length<3)return;
      out.push({t:"mcq",tag:"Practice check",q:x.title+" — " + p.q,opts:[p.a,d[0],d[1],d[2]],correct:0,why:["Correct — this is the worked answer for this topic.","This answer belongs to another finance lesson.","This answer belongs to another finance lesson.","This answer belongs to another finance lesson."]});
      used[p.q.toLowerCase()]=1;
    });
    if(out.length){l.body=l.body.filter(function(b){return !(b&&b.t==="mcq");});out.slice(0,5).forEach(function(q){l.body.push(q);});}
  });

  /* Never persist the fact that a user answered a quiz as part of the next
     topic's render. Existing learning progress remains untouched; MCQ markers
     are reset for the topic being entered. */
  function resetQuiz(id){try{var r=LS.store&&LS.store.lesson?LS.store.lesson(id):null;if(!r||!r.items)return;Object.keys(r.items).forEach(function(k){if(/^mcq\d+$/.test(k))delete r.items[k];});}catch(e){}}
  function current(){var id=String(location.hash||"").replace(/^#\/?/,"");return LS.lessons[id]?id:null;}
  var last=current();
  window.addEventListener("hashchange",function(){var next=current();if(!next||next===last)return;last=next;resetQuiz(next);});
})();