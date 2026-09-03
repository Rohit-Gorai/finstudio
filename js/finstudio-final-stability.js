/* FinStudio stability layer — canonical topic routing + pre-render quiz reset. */
(function () {
  "use strict";
  var LS = window.LS = window.LS || {};
  function slug(s){return String(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
  function findTopic(route){
    var wanted=String(route||"").replace(/^#\/?topic\//,"");
    var hit=null;
    (LS.curriculumMap||[]).some(function(lv){return (lv.modules||[]).some(function(m){return (m.topics||[]).some(function(t){
      var id=t.id||("topic-l"+lv.level+"-"+slug(m.title)+"-"+slug(t.title));
      var aliases=[id,t.cid,slug(String(lv.level)+"-"+m.title+"-"+t.title),slug(t.title)];
      if(aliases.indexOf(wanted)!==-1){hit={id:id,title:t.title};return true;} return false;
    });});});
    return hit;
  }
  function resetQuiz(id){
    if(!id||!LS.store||typeof LS.store.lesson!=="function")return;
    try{
      var r=LS.store.lesson(id);
      Object.keys(r.items||{}).forEach(function(k){if(/^mcq\d+$/.test(k))delete r.items[k];});
      var raw=localStorage.getItem("finstudio-progress-v1");
      if(raw){var all=JSON.parse(raw);if(all[id]&&all[id].items){Object.keys(all[id].items).forEach(function(k){if(/^mcq\d+$/.test(k))delete all[id].items[k];});localStorage.setItem("finstudio-progress-v1",JSON.stringify(all));}}
    }catch(e){}
  }
  function preRoute(){
    var raw=String(location.hash||"").replace(/^#\/?/,"");
    if(raw.indexOf("topic/")===0){var hit=findTopic(raw);if(hit&&LS.lessons[hit.id]){history.replaceState(null,"",location.pathname+location.search+"#/"+hit.id);raw=hit.id;}}
    if(LS.lessons&&LS.lessons[raw])resetQuiz(raw);
  }
  window.addEventListener("hashchange",preRoute,true);
  window.addEventListener("load",preRoute);
  window.addEventListener("load",function(){
    var n=0;(LS.curriculumMap||[]).forEach(function(lv){(lv.modules||[]).forEach(function(m){n+=(m.topics||[]).length;});});
    if(n!==227)console.warn("FinStudio curriculum integrity: expected 227 topics, found "+n);
    document.querySelectorAll(".side-roadmap p").forEach(function(p){p.textContent="11 levels · "+n+" interactive topics";});
  });
})();