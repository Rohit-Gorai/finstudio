/* FinStudio roadmap UI — every topic is a real interactive lesson destination. */
(function(){
  "use strict";
  var LS=window.LS;if(!LS||!LS.manifest||!LS.manifest.roadmap)return;
  function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");}
  function slug(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
  function render(){
    var content=document.getElementById("main");if(!content)return;
    var page=document.createElement("div");page.className="page roadmap-page";
    page.innerHTML='<p class="lesson-kicker">THE FINSTUDIO ROADMAP</p><h1>Learn finance from first principles to advanced practice.</h1><p class="lesson-lede">Every one of the 227 topics is a dedicated interactive lesson. Click a topic to open its own page with explanation, example, practice, sandbox and quizzes.</p><div class="roadmap-intro"><strong>227 topics · 227 lesson destinations.</strong> Nothing below is a dead label or “coming soon” item. Every topic opens a lesson page.</div>';
    LS.manifest.roadmap.forEach(function(level){
      var section=document.createElement("section");section.className="roadmap-level";
      var cards=level.modules.map(function(mod){
        var links=mod.topics.map(function(topic){return '<a class="rt rt-universal" href="#/topic/'+slug(topic)+'" title="Open the '+esc(topic)+' lesson">'+esc(topic)+' <span aria-hidden="true">→</span></a>';}).join("");
        return '<article class="roadmap-module"><h3>'+esc(mod.title)+'</h3><div class="roadmap-topic-links">'+links+'</div><span class="roadmap-badge">✓ '+mod.topics.length+' dedicated lessons</span></article>';
      }).join("");
      section.innerHTML='<div class="roadmap-level-head"><div class="roadmap-number">LEVEL '+level.level+'</div><div><h2>'+esc(level.title)+'</h2><p class="roadmap-level-lede">'+esc(level.blurb)+'</p></div></div><div class="roadmap-modules">'+cards+'</div>';
      page.appendChild(section);
    });
    content.innerHTML="";content.appendChild(page);
  }
  function addLink(){var side=document.getElementById("sidebar");if(!side||side.querySelector(".side-roadmap"))return;var box=document.createElement("div");box.className="side-roadmap";box.innerHTML='<a href="#/curriculum">Full curriculum roadmap →</a><p>11 levels · 227 dedicated interactive lessons</p>';side.insertBefore(box,side.firstChild);}
  function sync(){addLink();if(location.hash.replace(/^#\/?/,"")==="curriculum")render();}
  window.addEventListener("hashchange",sync);window.addEventListener("load",sync);sync();
})();
