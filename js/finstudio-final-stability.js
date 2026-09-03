/* FinStudio stability: canonical topic boot + quiz reset before render. */
(function(){
  "use strict";
  var LS=window.LS=window.LS||{};
  function slug(s){return String(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
  function findTopic(route){
    var wanted=String(route||"").replace(/^#\/?topic\//,"");
    var hit=null;
    (LS.curriculumMap||[]).some(function(lv){return (lv.modules||[]).some(function(m){return (m.topics||[]).some(function(t){
      var id=t.id||("topic-l"+lv.level+"-"+slug(m.title)+"-"+slug(t.title));
      var aliases=[id,t.cid,slug(String(lv.level)+"-"+m.title+"-"+t.title),slug(t.title)];
      if(aliases.indexOf(wanted)>=0){hit={id:id,cid:t.cid,title:t.title};return true;} return false;
    });});});
    return hit;
  }
  function ensureRoute(raw){
    if(LS.lessons&&LS.lessons[raw])return raw;
    var hit=findTopic(raw); if(!hit)return raw;
    if(LS.lessons[hit.id])return hit.id;
    var base=(hit.cid&&LS.lessons[hit.cid])||LS.lessons[slug(hit.title)];
    if(base){var copy={};Object.keys(base).forEach(function(k){copy[k]=base[k];});copy.id=hit.id;copy.title=hit.title;LS.lessons[hit.id]=copy;return hit.id;}
    return raw;
  }
  function resetQuiz(id){
    try{
      var r=LS.store&&LS.store.lesson?LS.store.lesson(id):null;
      if(r&&r.items)Object.keys(r.items).forEach(function(k){if(/^mcq\d+$/.test(k))delete r.items[k];});
      var raw=localStorage.getItem("finstudio-progress-v1");
      if(raw){var all=JSON.parse(raw);if(all[id]&&all[id].items){Object.keys(all[id].items).forEach(function(k){if(/^mcq\d+$/.test(k))delete all[id].items[k];});localStorage.setItem("finstudio-progress-v1",JSON.stringify(all));}}
    }catch(e){}
  }
  function preRoute(){
    var raw=String(location.hash||"").replace(/^#\/?/,"");
    var id=ensureRoute(raw);
    if(id!==raw){history.replaceState(null,"",location.pathname+location.search+"#/"+id);raw=id;}
    if(LS.lessons&&LS.lessons[raw])resetQuiz(raw);
  }
  window.addEventListener("hashchange",preRoute,true);
  window.addEventListener("load",function(){
    preRoute();
    var raw=String(location.hash||"").replace(/^#\/?/,"");
    var id=ensureRoute(raw);
    if(id!==raw)history.replaceState(null,"",location.pathname+location.search+"#/"+id);
    if(LS.lessons&&LS.lessons[id]){resetQuiz(id);window.dispatchEvent(new HashChangeEvent("hashchange"));}
    var n=0;(LS.curriculumMap||[]).forEach(function(lv){(lv.modules||[]).forEach(function(m){n+=(m.topics||[]).length;});});
    if(n!==227)console.warn("FinStudio curriculum integrity: expected 227 topics, found "+n);
    document.querySelectorAll(".side-roadmap p").forEach(function(p){p.textContent="11 levels · "+n+" interactive topics";});
  });
})();