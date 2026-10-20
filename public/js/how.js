(function(){
'use strict';
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
/* ECG */
function ecgPath(beats,w,h,base){
  var st=w/beats,d='M0 '+base;
  for(var i=0;i<beats;i++){
    var x=i*st;
    d+=' L'+(x+st*.18)+' '+base+' Q'+(x+st*.24)+' '+(base-h*.18)+' '+(x+st*.30)+' '+base+' L'+(x+st*.38)+' '+base;
    d+=' L'+(x+st*.41)+' '+(base+h*.12)+' L'+(x+st*.46)+' '+(base-h*.9)+' L'+(x+st*.51)+' '+(base+h*.34)+' L'+(x+st*.55)+' '+base;
    d+=' Q'+(x+st*.68)+' '+(base-h*.26)+' '+(x+st*.80)+' '+base+' L'+(x+st)+' '+base;
  }
  return d;
}
function mountEcg(svg,beats,w,amp,base,dur){
  if(!svg)return;
  var d=ecgPath(beats,w,amp,base),b=$('.e-base',svg),p=$('.e-pulse',svg);
  b.setAttribute('d',d);p.setAttribute('d',d);
  if(RM||!p.animate){p.style.display='none';return}
  var L=p.getTotalLength(),seg=L*.2;
  p.style.strokeDasharray=seg+' '+L;
  p.animate([{strokeDashoffset:seg},{strokeDashoffset:-L}],{duration:dur||4200,iterations:Infinity,easing:'linear'});
}
mountEcg($('#pageEcg'),5,1200,50,62,4200);
/* process */
var STEPS=[
 {t:'Discovery call',d:'We meet to understand your practice: claim volume, software, payers, your biggest pain, your deadline and how accurate the work must be.',g:['A written summary of what we heard','A proposed scope and next step'],n:['Your billing software and payers','Your deadline and accuracy needs']},
 {t:'Baseline audit',d:'We review your unpaid claims and record the starting numbers: days in AR, claim age, denial reasons and the largest balances.',g:['Starting values for the four weekly numbers','A list of where money is leaking'],n:['A read-only report export','No patient details by email or chat']},
 {t:'Written scope and agreements',d:'Scope, timeline, deadlines, accuracy targets and fees go on paper. A Business Associate Agreement is signed before any patient information is shared.',g:['A clear pilot scope','Signed BAA, NDA and service agreement'],n:['Sign-off from the practice owner','Your lawyer may review the documents']},
 {t:'Setup and training',d:'Your assigned team learns your billing software and payer rules. Access is through secure company systems only.',g:['A named caller and a named manager','Access set up by role'],n:['Software logins for the team','A contact person at the practice']},
 {t:'30-day pilot',d:'We work the agreed claims. Every action is logged, and a second person reviews early work before it counts.',g:['Calls, appeals and resubmissions logged','Early quality review on every action'],n:['Quick answers to documentation requests','A fixed point of contact']},
 {t:'Weekly reporting',d:'Each week you receive one page with the four core numbers, what changed, and what we are doing about each problem.',g:['Four numbers, week against baseline','Top denial reasons and next actions'],n:['A short review of the report','Questions or changes to priorities']},
 {t:'Review and decide',d:'At day 30 we compare the results with the baseline together. You can continue month to month, widen the scope, or stop.',g:['A pilot summary with before and after numbers','Options for what comes next'],n:['Your decision on scope','Feedback on our work']}
];
(function(){
  var cur=0,touched=false,sBox=$('#steps'),dBox=$('#detail');
  sBox.innerHTML=STEPS.map(function(s,i){return '<button type="button" class="step" role="tab" data-i="'+i+'"><span class="dot">'+String(i+1).padStart(2,'0')+'</span><span class="lbl">'+s.t+'</span></button>'}).join('');
  function show(i,anim){
    cur=i;var s=STEPS[i];
    $$('.step',sBox).forEach(function(b,k){b.classList.toggle('on',k===i);b.classList.toggle('done',k<i);b.setAttribute('aria-selected',String(k===i))});
    dBox.innerHTML='<div class="'+(anim?'swap':'')+'" style="display:grid;gap:20px"><div class="big">'+String(i+1).padStart(2,'0')+'</div><h3>'+s.t+'</h3><p style="color:var(--muted);max-width:60ch">'+s.d+'</p><div class="two"><div><h4>You get</h4><ul>'+s.g.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul></div><div><h4>We need from you</h4><ul>'+s.n.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul></div></div></div>';
  }
  show(0,false);
  sBox.addEventListener('click',function(e){var b=e.target.closest('.step');if(!b)return;touched=true;show(+b.dataset.i,true)});
  if(!RM){
    var inView=false;
    new IntersectionObserver(function(es){inView=es[0].isIntersecting}).observe(sBox);
    setInterval(function(){if(!touched&&inView)show((cur+1)%STEPS.length,true)},6000);
  }
})();


})();
