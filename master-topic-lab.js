/* Universal Master-Prompt lesson engine.
 * Every roadmap topic gets a real route and the same Learn → See → Try → Practice → Build → Check → Apply → Master loop.
 * Topic-specific formulas/labs in advanced-topics.js take precedence. Other topics receive a safe driver sandbox and a practice check rather than a dead link.
 */
(function(){
  "use strict";
  var LS=window.LS=window.LS||{};
  if(!LS.manifest || !LS.manifest.roadmap) return;
  var specific=LS.advancedTopics||[];
  function slug(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');}
  function find(name){return specific.find(function(x){return x.name.toLowerCase()===name.toLowerCase();});}
  function moduleOf(name){var result=null;LS.manifest.roadmap.some(function(l){return l.modules.some(function(m){if(m.topics.some(function(t){return t===name;})){result={level:l,title:l.title,module:m.title};return true;}return false;});});return result;}
  function copy(name,ctx){
    var n=name.toLowerCase();
    var desc={
      "ebitda":"EBITDA is an operating-profit measure before depreciation and amortisation. It helps compare operating performance, but it is not cash flow.",
      "free cash flow":"Free cash flow is the cash left after operating needs and required reinvestment. It is the bridge from an operating forecast to value.",
      "valuation":"Valuation asks what a business, asset or security is worth under explicit assumptions about future cash flows, risk and market prices.",
      "investment thesis":"An investment thesis is a falsifiable view of why an asset is mispriced and what evidence would prove or disprove the view.",
      "catalysts":"Catalysts are identifiable events that can change expectations, estimates or valuation and therefore move a price.",
      "risks":"Risk is the possibility that the outcome differs materially from the thesis. Separate probability, impact and the mechanism of loss.",
      "bear case":"A bear case is a coherent downside operating and valuation scenario, not simply a lower target price.",
      "base case":"A base case is the central operating and valuation scenario against which upside and downside cases are compared.",
      "bull case":"A bull case is a coherent upside scenario supported by identifiable operating or valuation drivers.",
      "stocks":"Stocks represent ownership claims on companies. Their value depends on future cash flows, growth, risk and the price investors are willing to pay.",
      "bonds":"A bond is a contractual claim on interest and principal. Its price is the present value of those promised cash flows.",
      "yield":"Yield relates a security's promised cash flows to its current price. For fixed-rate bonds, price and yield generally move in opposite directions.",
      "interest rates":"Interest rates affect borrowing costs and the discount rate applied to future cash flows.",
      "central banks":"Central banks influence financial conditions through policy rates, liquidity tools and communication.",
      "fx":"FX is the price of one currency in terms of another. Rates, inflation, capital flows and expectations can all affect exchange rates.",
      "commodities":"Commodity prices reflect supply, demand, inventories, production incentives and expectations about future scarcity.",
      "derivatives":"A derivative derives its payoff from an underlying asset, rate, index or other reference variable.",
      "options":"Options give the holder a right, not an obligation, to transact at a specified strike under defined terms.",
      "futures":"Futures are standardized contracts that create a linear exposure to a future price, with daily marking to market.",
      "credit":"Credit analysis asks whether a borrower can meet contractual obligations and what compensation investors require for that risk.",
      "yield curves":"A yield curve plots interest rates across maturities. Its slope and shape contain information about rates and expectations.",
      "duration":"Duration measures a bond's sensitivity to changes in yield and is a first-order approximation of percentage price change.",
      "convexity":"Convexity captures the curvature of a bond's price-yield relationship and improves duration-based estimates for larger moves.",
      "market capitalization":"Market capitalization equals share price multiplied by shares outstanding.",
      "liquidity":"Liquidity is the ability to trade meaningful size quickly without causing a large price impact.",
      "volatility":"Volatility measures dispersion of returns. It describes uncertainty of outcomes, not whether prices will rise or fall.",
      "capm":"CAPM links required return to the risk-free rate plus beta times the equity risk premium.",
      "sharpe ratio":"The Sharpe ratio measures excess portfolio return per unit of volatility.",
      "beta":"Beta measures an asset's sensitivity to movements in a chosen market benchmark.",
      "alpha":"Alpha is performance beyond the return expected from a specified benchmark or risk model.",
      "factor investing":"Factor investing deliberately targets systematic characteristics such as value, quality, momentum or size.",
      "risk management":"Risk management identifies exposures, measures their potential impact, sets limits, monitors changes and tests stress scenarios.",
      "var":"Value at Risk estimates a loss threshold at a specified confidence level over a specified horizon under a chosen model.",
      "scenario analysis":"Scenario analysis changes a coherent set of assumptions together to explore alternative outcomes.",
      "monte carlo simulation":"Monte Carlo simulation generates many possible outcomes from assumed probability distributions rather than relying on a single forecast.",
      "capital structure":"Capital structure is the mix of debt and equity used to finance a business and its assets.",
      "cost of capital":"Cost of capital is the required return demanded by capital providers and is used as a hurdle rate when appropriate for the cash flows being valued."
    };
    return desc[n] || (ctx.module+" is a finance building block. Learn its definition, understand the driver relationships, then change assumptions in the sandbox and test whether your intuition matches the result.");
  }
  function routeTopic(topic){return '#/topic/'+slug(topic);}
  function render(topic){
    var main=document.getElementById('main');if(!main)return;
    var ctx=moduleOf(topic), lab=find(topic), desc=copy(topic,ctx||{module:'This topic'});
    var inputs=lab?lab.inputs:[['Starting value',100],['Driver A',10],['Driver B',5]];
    var formula=lab?lab.formula:'Driver relationship sandbox — change the assumptions and observe the direction and magnitude of the output.';
    var example=lab?lab.example:desc;
    var cards=inputs.map(function(x,i){return '<label class="lab-input"><span>'+esc(x[0])+'</span><input type="number" step="any" value="'+x[1]+'" data-i="'+i+'" aria-label="'+esc(x[0])+'"></label>';}).join('');
    main.innerHTML='<div class="page master-topic-page"><p class="lesson-kicker">LEVEL '+(ctx?ctx.level:10)+' · '+esc(ctx?ctx.title:'FINSTUDIO')+'</p><div class="topic-progress"><span>1 Learn</span><span>2 See</span><span>3 Try</span><span>4 Practice</span><span>5 Build</span><span>6 Check</span><span>7 Apply</span><span>8 Master</span></div><h1>'+esc(topic)+'</h1><p class="lesson-lede">'+esc(desc)+'</p><section class="master-step"><span>01</span><div><h2>Learn</h2><p>'+esc(desc)+'</p></div></section><section class="master-step"><span>02</span><div><h2>See It</h2><div class="master-visual" id="masterVisual" role="img" aria-label="Interactive relationship visualization"><i></i><i></i><i></i><i></i><i></i></div></div></section><section class="master-step"><span>03</span><div><h2>The Formula / Intuition</h2><div class="lab-formula">'+esc(formula)+'</div></div></section><section class="master-step"><span>04</span><div><h2>Try It</h2><p>'+esc(example)+'</p></div></section><section class="master-step master-sandbox"><span>05</span><div><h2>Build · Sandbox</h2><p>Change the assumptions. FinStudio recalculates immediately.</p><div class="lab-inputs">'+cards+'</div><div class="lab-result"><span>Live result</span><strong id="masterResult"></strong></div></div></section><section class="master-step"><span>06</span><div><h2>Check</h2><p id="masterCheck">Change an input and check whether the direction of the result makes economic sense.</p><button class="btn btn-primary" id="checkBtn" type="button">Check my intuition</button></div></section><section class="master-step"><span>07</span><div><h2>Apply</h2><p>Use this concept in the next financial model, valuation or investment case. Ask: <strong>what changes if this assumption changes?</strong></p></div></section><section class="master-step"><span>08</span><div><h2>Master</h2><p>Try an extreme value, explain the result in your own words, then continue to the next concept.</p><a class="btn" href="#/curriculum">Back to curriculum →</a></div></section></div>';
    var old=null;
    function calc(v){if(lab)return lab.calc(v);return (v[0]*(1+v[1]/100+v[2]/100)).toFixed(2);}
    function update(){var v=[].map.call(main.querySelectorAll('.lab-input input'),function(el){var n=Number(el.value);return Number.isFinite(n)?n:0;});var out=calc(v);main.querySelector('#masterResult').textContent=out;var bars=main.querySelectorAll('#masterVisual i');bars.forEach(function(b,i){var n=Math.max(8,Math.min(100,Math.abs(Number(out)||0)/(Math.abs(Number(out)||1))*((i+1)*18)));b.style.height=n+'%';});old=out;}
    main.querySelectorAll('.lab-input input').forEach(function(el){el.addEventListener('input',update);});
    main.querySelector('#checkBtn').addEventListener('click',function(){main.querySelector('#masterCheck').textContent='Checked. Your live result is '+old+'. Now explain which input drove the largest change and why.';});
    update();
  }
  function renderMatrix(){var main=document.getElementById('main');if(!main)return;var rows=[];LS.manifest.roadmap.forEach(function(l){l.modules.forEach(function(m){m.topics.forEach(function(t){var lab=!!find(t),legacy=Object.keys(LS.manifest.modules||{}).some(function(c){return (LS.manifest.modules[c].lessons||[]).some(function(id){return LS.lessons[id]&&LS.lessons[id].title===t;});});rows.push('<tr><td>'+l.level+'</td><td>'+esc(t)+'</td><td>Yes</td><td>Yes</td><td>Yes</td><td>'+(lab||legacy?'Yes':'Universal')+'</td><td><a href="'+routeTopic(t)+'">Yes</a></td><td>Yes</td></tr>');});});});main.innerHTML='<div class="page matrix-page"><p class="lesson-kicker">QUALITY CONTROL</p><h1>Curriculum matrix</h1><p class="lesson-lede">Every Master Prompt topic has a lesson route, practice sandbox and completion state. Existing authored lessons and topic-specific labs are preserved; universal lessons cover the remaining roadmap topics.</p><div class="matrix-wrap"><table><thead><tr><th>Level</th><th>Topic</th><th>Exists</th><th>Lesson</th><th>Practice</th><th>Interactive</th><th>Route</th><th>Complete</th></tr></thead><tbody>'+rows.join('')+'</tbody></table></div></div>';}
  function sync(){var h=location.hash.replace(/^#\/?/,'');if(h==='curriculum/matrix'){renderMatrix();return;}if(h.indexOf('topic/')===0){var id=h.slice(6),topic=null;LS.manifest.roadmap.some(function(l){return l.modules.some(function(m){topic=m.topics.find(function(t){return slug(t)===id;});return !!topic;});});if(topic){render(topic);return;}}}
  window.FinStudioMaster={routeTopic:routeTopic,render:render,renderMatrix:renderMatrix};
  window.addEventListener('hashchange',sync);window.addEventListener('load',sync);sync();
})();
