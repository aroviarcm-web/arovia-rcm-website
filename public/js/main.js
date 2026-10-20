(function(){
'use strict';
/* ===== Contact form posts to the Python server at /api/contact ===== */
var CONTACT_EMAIL='aroviarcm@gmail.com';
var FORM_ENDPOINT='/api/contact';
/* ==================================================================== */
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var usd=function(n){return n.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0})};

$('#yr').textContent=new Date().getFullYear();
$('#mailShow').textContent=CONTACT_EMAIL;
$('#mailShow2').textContent=CONTACT_EMAIL;

/* services data */
var SERVICES=[
 {n:'AR follow-up',d:'We call insurers and check payer portals on every unpaid claim, record the answer and push it toward payment.',s:'now'},
 {n:'Denial management and appeals',d:'We find why a claim was denied, correct it, and file appeals and reconsiderations with the right documents.',s:'now'},
 {n:'Rejection clean-up',d:'Claims bounced by the clearinghouse for errors are fixed and resubmitted before they age.',s:'now'},
 {n:'Old balance recovery',d:'Unpaid insurance balances from past months get a second look, starting with the largest and oldest.',s:'now'},
 {n:'AR and revenue-leak audit',d:'We sort your unpaid claims by age, payer and denial reason, and show where money is leaking.',s:'now'},
 {n:'Weekly performance report',d:'One page every week: days in AR, clean claim rate, denial rate and collection rate.',s:'now'},
 {n:'Payment posting',d:'Insurer payments and adjustments posted to the right claim, with credits and refunds flagged.',s:'now'},
 {n:'Eligibility verification',d:'Coverage checked before the visit, so claims do not fail on inactive insurance.',s:'now'},
 {n:'Charge entry and claim submission',d:'Visit details turned into clean claims and sent through your clearinghouse.',s:'now'},
 {n:'Prior authorization',d:'Approvals requested before costly procedures, so the claim is not denied later.',s:'now'},
 {n:'Medical coding',d:'ICD-10, CPT and HCPCS coding by certified coders, with audits.',s:'now'},
 {n:'Credentialing and enrollment',d:'Provider enrollment with insurers, including Medicare and Medicaid applications.',s:'now'},
 {n:'Underpayment review',d:'Payments compared against contracted rates to catch short payments.',s:'now'},
 {n:'Patient billing',d:'Statements, patient calls and payment plans for the patient share.',s:'now'},
 {n:'Hospital billing',d:'Full revenue cycle support for hospitals is planned for the future as we grow.',s:'planned'}
];
var LABEL={now:'Available now',planned:'Planned for the future'};
function renderServices(f){
  $('#svc').innerHTML=SERVICES.filter(function(x){return f==='all'||x.s===f}).map(function(x){
    return '<article class="panel card'+(x.s==='planned'?' future':'')+'"><span class="tag '+x.s+'">'+LABEL[x.s]+'</span><h3>'+x.n+'</h3><p>'+x.d+'</p></article>';
  }).join('');
}
renderServices('all');

/* ticker */
(function(){
  var t=SERVICES.filter(function(x){return x.s==='now'}).map(function(x){return '<span>'+x.n+'</span>'}).join('');
  $('#tick').innerHTML=t+t;
})();

/* who we help */
var HELP={
 practice:{h:'For practices of 1 to 10 doctors',p:'You treat patients. We chase the insurers. Start with a pilot on the unpaid claims you already have.',l:['Unpaid claims followed up by phone and payer portal','Denials analyzed, corrected and appealed','Old balances reviewed, oldest and largest first','One weekly report with four numbers','30-day pilot paid on what we collect'],m:'client',c:'Request a consultation'},
 billing:{h:'For small billing companies',p:'When your team is full, we add hands. Your client relationship stays yours, and we work under an NDA and a BAA.',l:['Overflow AR follow-up when volume spikes','Denial and appeals support for your accounts','A named caller and manager for your work','Same weekly report format, ready to forward','Month-to-month terms after a trial'],m:'partner',c:'Talk about partnership'}
};
(function(){
  var box=$('#tabpanel');
  function show(k,anim){
    var x=HELP[k];
    box.innerHTML='<div class="'+(anim?'swap':'')+'"><h3>'+x.h+'</h3><p>'+x.p+'</p><div class="band-cta"><a class="btn btn-p" href="#contact" data-mode="'+x.m+'">'+x.c+'</a></div></div><ul class="hl">'+x.l.map(function(i){return '<li>'+i+'</li>'}).join('')+'</ul>';
    $$('.tabs button').forEach(function(b){b.setAttribute('aria-selected',String(b.dataset.t===k))});
  }
  show('practice',false);
  $$('.tabs button').forEach(function(b){b.addEventListener('click',function(){show(b.dataset.t,true)})});
})();

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
mountEcg($('#heroEcg'),5,1200,50,62,4200);
mountEcg($('#emblem svg'),1,300,30,252,3000);
mountEcg($('#div1'),6,1200,16,26,5200);
mountEcg($('#miniEcg'),2,110,15,19,2600);
$$('.mon svg').forEach(function(s,i){mountEcg(s,2,200,15,24,2400+i*300)});

/* particle network and floating hearts */
(function(){
  var cv=$('#net'),ctx=cv.getContext('2d'),W=0,H=0,nodes=[],hearts=[],mouse={x:-999,y:-999},vis=true,raf=0;
  function heart(x,y,s){ctx.beginPath();ctx.moveTo(x,y+.3*s);ctx.bezierCurveTo(x,y-.1*s,x-.5*s,y-.1*s,x-.5*s,y+.25*s);ctx.bezierCurveTo(x-.5*s,y+.6*s,x,y+.8*s,x,y+1.05*s);ctx.bezierCurveTo(x,y+.8*s,x+.5*s,y+.6*s,x+.5*s,y+.25*s);ctx.bezierCurveTo(x+.5*s,y-.1*s,x,y-.1*s,x,y+.3*s);ctx.fill()}
  function size(){
    var r=cv.parentElement.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);
    W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
    var n=Math.round(Math.min(90,W*H/15000));nodes=[];
    for(var i=0;i<n;i++)nodes.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,r:Math.random()*1.4+.8});
    hearts=[];var hn=Math.max(5,Math.round(W/150));
    for(var k=0;k<hn;k++)hearts.push({x:Math.random()*W,y:Math.random()*H,s:Math.random()*12+8,v:Math.random()*.35+.2,ph:Math.random()*6.28,a:Math.random()*.22+.1});
    if(RM)frame(true);
  }
  function frame(still){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<nodes.length;i++){
      var a=nodes[i];
      if(!still){
        a.x+=a.vx;a.y+=a.vy;
        if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1;
        var dx=mouse.x-a.x,dy=mouse.y-a.y,dm=Math.sqrt(dx*dx+dy*dy);
        if(dm<150&&dm>1){a.x+=dx/dm*.35;a.y+=dy/dm*.35}
      }
      for(var j=i+1;j<nodes.length;j++){
        var b=nodes[j],ex=a.x-b.x,ey=a.y-b.y,dd=ex*ex+ey*ey;
        if(dd<16900){ctx.strokeStyle='rgba(120,180,255,'+(0.24*(1-dd/16900)).toFixed(3)+')';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
      }
      var mx=mouse.x-a.x,my=mouse.y-a.y;
      if(mx*mx+my*my<22500){ctx.strokeStyle='rgba(79,227,168,.4)';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(mouse.x,mouse.y);ctx.stroke()}
      ctx.fillStyle='rgba(170,210,255,.85)';ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,6.2832);ctx.fill();
    }
    for(var h=0;h<hearts.length;h++){
      var t=hearts[h];
      if(!still){t.y-=t.v;t.ph+=.02;if(t.y<-20){t.y=H+20;t.x=Math.random()*W}}
      ctx.fillStyle='rgba(120,180,255,'+t.a+')';heart(t.x+Math.sin(t.ph)*10,t.y,t.s);
    }
    if(!still&&vis)raf=requestAnimationFrame(function(){frame(false)});
  }
  size();
  window.addEventListener('resize',size);
  if(!RM){
    cv.parentElement.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top});
    cv.parentElement.addEventListener('pointerleave',function(){mouse.x=mouse.y=-999});
    new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis){cancelAnimationFrame(raf);frame(false)}}).observe(cv.parentElement);
    frame(false);
  }
})();

/* simulated claim worklist (every number is shown as X) */
(function(){
  var ROWS=[['Commercial PPO',3],['Medicare',1],['Medicaid',2],['Commercial HMO',1],['Medicare Advantage',2]];
  var ST=['Submitted','Denied','Appealed','Paid'];
  var box=$('#rows');
  function render(flash){
    box.innerHTML=ROWS.map(function(r,i){
      return '<div class="row'+(flash===i?' flash':'')+'"><span class="id">CLM-XXXXX</span><span>'+r[0]+'</span><span class="amt">$XXX</span><span class="st s'+r[1]+'">'+ST[r[1]]+'</span></div>';
    }).join('');
  }
  render(-1);
  if(RM){return}
  setInterval(function(){
    var i=Math.floor(Math.random()*ROWS.length);
    ROWS[i][1]=(ROWS[i][1]+1)%4;
    render(i);
  },1600);
})();

/* counters (final value is already in the page) */
(function(){
  if(RM)return;
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting)return;io.unobserve(e.target);
      var el=e.target,end=+el.dataset.count,t0=performance.now();
      (function tick(now){var k=Math.min(1,(now-t0)/1400),v=Math.round(end*(1-Math.pow(1-k,3)));el.textContent=v;if(k<1)requestAnimationFrame(tick)})(t0);
    });
  },{threshold:.6});
  $$('[data-count]').forEach(function(el){io.observe(el)});
})();

/* calculator */
(function(){
  var U=$('#cU'),R=$('#cR'),F=$('#cF');
  function upd(){
    var u=+U.value,r=+R.value/100,f=+F.value/100;
    var rec=u*r,fee=rec*f,keep=rec-fee;
    $('#vU').textContent=usd(u);$('#vR').textContent=Math.round(r*100)+'%';$('#vF').textContent=(f*100).toFixed(1)+'%';
    $('#oRec').textContent=usd(rec);$('#oKeep').textContent=usd(keep);$('#oFee').textContent=usd(fee);
    $('#bK').style.width=(r*(1-f)*100)+'%';$('#bF').style.width=(r*f*100)+'%';$('#bR').style.width=((1-r)*100)+'%';
  }
  [U,R,F].forEach(function(x){x.addEventListener('input',upd)});
  upd();
})();

/* report charts */
var KP=[
 {l:'Days in AR',v:'38',e:'14 days lower than the baseline',s:[52,50,49,46,44,42,40,38],lo:30,hi:55},
 {l:'Clean claim rate',v:'94.2%',e:'2.6 points above the baseline',s:[91.6,92,92.8,93.1,93.4,93.8,94,94.2],lo:91,hi:95},
 {l:'Denial rate',v:'8.1%',e:'2.4 points below the baseline',s:[10.5,10.1,9.6,9.2,8.9,8.6,8.3,8.1],lo:7.5,hi:11},
 {l:'Collection rate',v:'91.5%',e:'3.0 points above the baseline',s:[88.5,89,89.6,90.2,90.6,91,91.3,91.5],lo:88,hi:92}
];
function spark(s,lo,hi){
  var W=120,H=36,p=4,pts=s.map(function(v,i){return [p+(W-2*p)*i/(s.length-1),H-p-(H-2*p)*(v-lo)/(hi-lo)]});
  var last=pts[pts.length-1];
  return '<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-hidden="true"><polyline points="'+pts.map(function(q){return q[0].toFixed(1)+','+q[1].toFixed(1)}).join(' ')+'" fill="none" stroke="#035FE2" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><circle cx="'+last[0]+'" cy="'+last[1]+'" r="3" fill="#0A8F5F"/></svg>';
}
$('#tiles').innerHTML=KP.map(function(k){return '<div class="tile"><span>'+k.l+'</span><strong>'+k.v+'</strong><em>'+k.e+'</em>'+spark(k.s,k.lo,k.hi)+'</div>'}).join('');

function lineChart(){
  var W=520,H=300,m={l:46,r:30,t:26,b:38},iw=W-m.l-m.r,ih=H-m.t-m.b,y0=30,y1=55,data=KP[0].s;
  var X=function(i){return m.l+iw*i/(data.length-1)},Y=function(v){return m.t+ih*(1-(v-y0)/(y1-y0))};
  var g='',v;
  for(v=y0;v<=y1;v+=5){g+='<line x1="'+m.l+'" x2="'+(W-m.r)+'" y1="'+Y(v)+'" y2="'+Y(v)+'" stroke="#DBE6F8" stroke-width="1"/><text class="t-ax" x="'+(m.l-8)+'" y="'+(Y(v)+4)+'" text-anchor="end">'+v+'</text>'}
  var xl=data.map(function(_,i){return '<text class="t-ax" x="'+X(i)+'" y="'+(H-14)+'" text-anchor="middle">W'+(i+1)+'</text>'}).join('');
  var pts=data.map(function(d,i){return X(i).toFixed(1)+','+Y(d).toFixed(1)});
  var area='M'+pts[0]+' L'+pts.join(' L')+' L'+X(data.length-1)+','+Y(y0)+' L'+X(0)+','+Y(y0)+' Z';
  var line='M'+pts.join(' L');
  var f=data.length-1;
  var dots=data.map(function(d,i){return (i===0||i===f)?'':'<circle cx="'+X(i)+'" cy="'+Y(d)+'" r="3" fill="#fff" stroke="#035FE2" stroke-width="1.5"/>'}).join('');
  $('#lineBox').innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Line chart of days in AR over eight weeks, from 52 to 38 (example data)"><defs><linearGradient id="la" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#035FE2" stop-opacity=".28"/><stop offset="1" stop-color="#035FE2" stop-opacity="0"/></linearGradient></defs>'+g+xl+'<path id="lArea" d="'+area+'" fill="url(#la)"/><path id="lLine" d="'+line+'" fill="none" stroke="#035FE2" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>'+dots+'<circle cx="'+X(0)+'" cy="'+Y(data[0])+'" r="4.5" fill="#6B7F9E"/><text class="t-v" x="'+X(0)+'" y="'+(Y(data[0])-12)+'" text-anchor="middle">'+data[0]+'</text><circle cx="'+X(f)+'" cy="'+Y(data[f])+'" r="6" fill="#0A8F5F" stroke="#fff" stroke-width="2"/><text class="t-v2" x="'+X(f)+'" y="'+(Y(data[f])-14)+'" text-anchor="middle">'+data[f]+'</text></svg>';
}
function barChart(){
  var W=520,H=300,m={l:46,r:16,t:26,b:54},iw=W-m.l-m.r,ih=H-m.t-m.b,y0=0,y1=50;
  var A=[28,21,16,12,23],B=[41,26,17,9,7],lab=['0-30','31-60','61-90','91-120','120+'];
  var Y=function(v){return m.t+ih*(1-(v-y0)/(y1-y0))},gw=iw/5,bw=30,gap=6;
  var g='',v;
  for(v=0;v<=50;v+=10){g+='<line x1="'+m.l+'" x2="'+(W-m.r)+'" y1="'+Y(v)+'" y2="'+Y(v)+'" stroke="#DBE6F8" stroke-width="1"/><text class="t-ax" x="'+(m.l-8)+'" y="'+(Y(v)+4)+'" text-anchor="end">'+v+'%</text>'}
  var bars='';
  for(var i=0;i<5;i++){
    var x0=m.l+gw*i+(gw-(2*bw+gap))/2;
    bars+='<rect class="bar-r" x="'+x0+'" y="'+Y(A[i])+'" width="'+bw+'" height="'+(Y(0)-Y(A[i]))+'" rx="3" fill="#9DB8E0"/>';
    bars+='<rect class="bar-r" x="'+(x0+bw+gap)+'" y="'+Y(B[i])+'" width="'+bw+'" height="'+(Y(0)-Y(B[i]))+'" rx="3" fill="#035FE2"/>';
    bars+='<text class="t-ax" x="'+(x0+bw/2)+'" y="'+(Y(A[i])-6)+'" text-anchor="middle">'+A[i]+'</text><text class="t-v" x="'+(x0+bw+gap+bw/2)+'" y="'+(Y(B[i])-6)+'" text-anchor="middle">'+B[i]+'</text>';
    bars+='<text class="t-ax" x="'+(m.l+gw*i+gw/2)+'" y="'+(H-28)+'" text-anchor="middle">'+lab[i]+'</text>';
  }
  $('#barBox').innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Bar chart of unpaid claims by age group at the start and at week 8 (example data)">'+g+bars+'<text class="t-ax" x="'+(m.l+iw/2)+'" y="'+(H-6)+'" text-anchor="middle">Days since claim was submitted</text></svg>';
}
lineChart();barChart();
(function(){
  if(RM||!Element.prototype.animate)return;
  function grow(box){
    $$('.bar-r',box).forEach(function(r,i){
      r.style.transformBox='fill-box';r.style.transformOrigin='bottom';
      r.animate([{transform:'scaleY(0)'},{transform:'scaleY(1)'}],{duration:800,delay:i*70,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'});
    });
  }
  new IntersectionObserver(function(es,ob){
    es.forEach(function(e){
      if(!e.isIntersecting)return;ob.unobserve(e.target);
      var p=$('#lLine'),L=p.getTotalLength();p.style.strokeDasharray=L;
      p.animate([{strokeDashoffset:L},{strokeDashoffset:0}],{duration:1600,easing:'cubic-bezier(.2,.7,.2,1)'});
      $('#lArea').animate([{opacity:0},{opacity:1}],{duration:1600,easing:'ease-out'});
    });
  },{threshold:.35}).observe($('#lineBox'));
  new IntersectionObserver(function(es,ob){
    es.forEach(function(e){if(!e.isIntersecting)return;ob.unobserve(e.target);grow(e.target)});
  },{threshold:.35}).observe($('#barBox'));
})();

/* spotlight and tilt */
document.addEventListener('pointermove',function(e){
  var p=e.target.closest&&e.target.closest('.panel');
  if(p){var r=p.getBoundingClientRect();p.style.setProperty('--mx',(e.clientX-r.left)+'px');p.style.setProperty('--my',(e.clientY-r.top)+'px')}
});
if(!RM){
  $$('.tilt').forEach(function(el){
    el.addEventListener('pointermove',function(e){
      if(e.pointerType==='touch')return;
      var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      el.style.transform='perspective(800px) rotateX('+(-y*5).toFixed(2)+'deg) rotateY('+(x*6).toFixed(2)+'deg)';
    });
    el.addEventListener('pointerleave',function(){el.style.transform=''});
  });
}

/* reveal on scroll (content stays visible at rest) */
(function(){
  if(RM||!Element.prototype.animate)return;
  var els=$$('.pt,.sec-h,.kpi,.card,.doc,.checks li,.ag,.report,.calc,.agenda,.pillar,.mon,.tabpanel');
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting)return;io.unobserve(e.target);
      e.target.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:600,easing:'cubic-bezier(.2,.7,.2,1)'});
    });
  },{threshold:.12});
  els.forEach(function(el){if(el.getBoundingClientRect().top>window.innerHeight)io.observe(el)});
})();

/* contact form */
(function(){
  var form=$('#form'),res=$('#result');
  var roles=['AR caller','Denial specialist','Medical coder','QA auditor','Trainer','Team lead','Something else'];
  $('#svcChips').innerHTML=SERVICES.filter(function(s){return s.s==='now'}).map(function(s){return '<label class="chip"><input type="checkbox" name="service" value="'+s.n+'"><span>'+s.n+(s.s==='now'?'':' <em>'+(s.s==='next'?'soon':'later')+'</em>')+'</span></label>'}).join('');
  $('#roleChips').innerHTML=roles.map(function(r){return '<label class="chip"><input type="checkbox" name="role" value="'+r+'"><span>'+r+'</span></label>'}).join('');
  function mode(){return $('input[name=mode]:checked',form).value}
  function sync(){var m=mode();$$('[data-for]',form).forEach(function(p){p.hidden=p.dataset.for!==m})}
  $$('input[name=mode]',form).forEach(function(r){r.addEventListener('change',sync)});
  sync();
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('[data-mode]');
    if(!a)return;
    var r=$('input[name=mode][value='+a.dataset.mode+']',form);
    if(r){r.checked=true;sync();res.hidden=true;form.hidden=false}
  });
  function vals(name){return $$('input[name='+name+']:checked',form).map(function(i){return i.value})}
  function val(id){var e=$('#'+id);return e?e.value.trim():''}
  function check(){
    var ok=true;
    var n=val('name'),em=val('email');
    $('#fName').classList.toggle('bad',!n);$('#eName').textContent=n?'':'Enter your name so we know who to reply to.';
    var good=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
    $('#fEmail').classList.toggle('bad',!good);$('#eEmail').textContent=good?'':'Enter a valid work email, for example name@practice.com.';
    if(!n||!good)ok=false;
    return ok;
  }
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(!check()){var b=$('.f.bad input',form);if(b)b.focus();return}
    var m=mode(),L=[];
    var title={client:'Request: Arovia services for a practice',partner:'Request: Partnership with a billing company',team:'Request: Join the Arovia team'}[m];
    L.push(title,'');
    L.push('Name: '+val('name'),'Email: '+val('email'));
    if(val('org'))L.push('Practice or company: '+val('org'));
    if(m==='client'){
      L.push('Services: '+(vals('service').join(', ')||'Not chosen yet'));
      L.push('Specialty: '+(val('spec')==='Other'?('Other - '+(val('specOther')||'not typed')):(val('spec')||'Not chosen')),'Claims per month: '+val('vol'),'Billing software: '+val('sw'));
      L.push('Start: '+val('tl'),'Call window: '+val('win')+' ('+val('tz')+')');
      if(val('dl'))L.push('Deadlines and accuracy targets: '+val('dl'));
    }else if(m==='partner'){
      L.push('Company size: '+val('psize'),'Work to hand over: '+val('pwork'));
      if(val('psw'))L.push('Software: '+val('psw'));
    }else{
      L.push('Roles: '+(vals('role').join(', ')||'Not chosen yet'),'Experience: '+val('exp'));
      if(val('link'))L.push('Profile: '+val('link'));
    }
    if(val('msg'))L.push('','Notes: '+val('msg'));
    var text=L.join('\n');
    $('#sum').value=text;
    $('#mailto').href='mailto:'+CONTACT_EMAIL+'?subject='+encodeURIComponent(title)+'&body='+encodeURIComponent(text);
    var hp=$('input[name=_gotcha]',form);
    function showResult(sent){
      $('#resT').textContent=sent?'Request sent':'Your request is ready';
      $('#resP').innerHTML=sent?'Thank you. We have received your request and will reply by email with proposed call times.':'We could not send this automatically. Copy the request below and email it to <b class="mono" style="color:var(--text)">'+CONTACT_EMAIL+'</b>.';
      $('#acts').hidden=sent&&false;
      $('#copy').hidden=sent;$('#mailto').hidden=sent;
      form.hidden=true;res.hidden=false;$('#copied').textContent='';
      res.scrollIntoView({behavior:RM?'auto':'smooth',block:'center'});
    }
    if(hp&&hp.value){return}
    if(FORM_ENDPOINT.indexOf('YOUR_FORM_ID')>-1||!window.fetch){showResult(false);return}
    var btn=$('#send');btn.disabled=true;btn.textContent='Sending...';
    fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({_subject:title+' ('+val('name')+')',name:val('name'),email:val('email'),organization:val('org'),request_type:m,details:text})})
    .then(function(r){btn.disabled=false;btn.textContent='Send my request';showResult(r.ok)})
    .catch(function(){btn.disabled=false;btn.textContent='Send my request';showResult(false)});
  });
  $('#copy').addEventListener('click',function(){
    var ta=$('#sum');
    function fallback(){ta.focus();ta.select();$('#copied').textContent='Press Ctrl+C or Cmd+C to copy.'}
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(ta.value).then(function(){$('#copied').textContent='Copied.'},fallback);
    }else fallback();
  });
  $('#edit').addEventListener('click',function(){res.hidden=true;form.hidden=false;$('#name').focus()});
})();
})();

/* show a text box when "Other" specialty is chosen */
(function(){
  var s=document.getElementById('spec'),b=document.getElementById('specOtherBox');
  if(!s||!b)return;
  function t(){b.hidden=s.value!=='Other'}
  s.addEventListener('change',t);t();
})();