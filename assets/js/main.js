(function(){
'use strict';
var FORM_KEY='82ae3a91-8197-4b8a-acd2-3a38e5ce64b1' /* clé Web3Forms (publique) */, MAIL='assojumparound@gmail.com', PIXEL_ID='652526568710500', METRICOOL_HASH='9c2957ac1501002479c78662da21970a', KEY='ja_consent_v1', PREVIEW=!!window.JA_PREVIEW;
function get(){try{return localStorage.getItem(KEY)}catch(e){return null}}
function set(v){try{localStorage.setItem(KEY,v)}catch(e){}}
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
/* Menu */
var burger=$('.burger'), nav=$('#nav');
if(burger&&nav){
  burger.addEventListener('click',function(){var o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
  $$('a',nav).forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');burger.setAttribute('aria-expanded','false')})});
}
/* Menu actif au défilement */
if('IntersectionObserver' in window){
  var links={};$$('#nav a[href^="#"]').forEach(function(a){links[a.getAttribute('href').slice(1)]=a});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){$$('#nav a').forEach(function(a){a.classList.remove('on')});var l=links[e.target.id];if(l&&!l.classList.contains('cta'))l.classList.add('on')}})},{rootMargin:'-45% 0px -50% 0px'});
  Object.keys(links).forEach(function(id){var s=document.getElementById(id);if(s)io.observe(s)});
}
/* Compte à rebours (19/12/2026 19h, Paris) */
var target=new Date('2026-12-19T19:00:00+01:00').getTime(), cd=$('#countdown');
function tick(){if(!cd)return;var d=target-Date.now();if(d<=0){cd.style.display='none';return}
  var v=[Math.floor(d/864e5),Math.floor(d%864e5/36e5),Math.floor(d%36e5/6e4),Math.floor(d%6e4/1e3)];
  $$('b',cd).forEach(function(b,i){b.textContent=String(v[i]).padStart(2,'0')})}
tick();setInterval(tick,1000);
/* Phase tarifaire en cours */
(function(){var now=Date.now(),P=[['p1','2026-10-20T00:00:00+02:00'],['p2','2026-12-13T00:00:00+01:00'],['p3','2026-12-20T00:00:00+01:00']],cur=null;
  for(var i=0;i<P.length;i++){if(now<new Date(P[i][1]).getTime()){cur=P[i][0];break}}
  var past=true;['p1','p2','p3'].forEach(function(id){var el=document.getElementById(id);if(!el)return;if(id===cur){el.classList.add('now');past=false}else if(past){el.classList.add('past')}else{el.classList.add('next');var b=el.querySelector('.badge');if(b)b.textContent='Bientôt'}})})();
/* Compte à rebours par phase : « plus que… » sur la phase en cours, « dans… » sur les suivantes */
(function(){var P=[['p1',null,'2026-10-20T00:00:00+02:00'],['p2','2026-10-20T00:00:00+02:00','2026-12-13T00:00:00+01:00'],['p3','2026-12-13T00:00:00+01:00','2026-12-19T19:00:00+01:00']];
  function fmt(ms){var d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4),s=Math.floor(ms%6e4/1e3),z=function(n){return String(n).padStart(2,'0')};
    return (d>0?d+' j ':'')+z(h)+' h '+z(m)+' min '+z(s)+' s'}
  function days(ms){var d=Math.max(1,Math.ceil(ms/864e5));return d+(d>1?' jours':' jour')}
  function upd(){var now=Date.now();P.forEach(function(p){var el=document.getElementById(p[0]),c=el&&el.querySelector('.pcd');if(!c)return;
    var st=p[1]?new Date(p[1]).getTime():0,en=new Date(p[2]).getTime();
    if(now>=en){c.style.display='none'}
    else if(now>=st){c.style.display='block';c.textContent='Plus que '+fmt(en-now)}
    else{c.style.display='block';c.textContent='Démarre dans '+days(st-now)}})}
  upd();setInterval(upd,1000)})();
/* HelloAsso : hauteur auto */
window.addEventListener('message',function(e){if(!e.data||!e.data.height)return;
  $$('iframe[data-ha]').forEach(function(f){if(f.contentWindow===e.source){var h=parseFloat(e.data.height);if(h>(parseFloat(f.getAttribute('height'))||0))f.setAttribute('height',h)}})});
/* Carrousels : défilement lent, sans recadrage, pause au toucher et au survol */
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
$$('.car').forEach(function(car){
  var view=$('.car-view',car),track=$('.car-track',car);if(!view||!track)return;
  var speed=parseFloat(car.getAttribute('data-speed'))||38;
  var kids=Array.prototype.slice.call(track.children);
  function dup(){kids.forEach(function(c){var k=c.cloneNode(true);k.setAttribute('aria-hidden','true');$$('a,button',k).forEach(function(x){x.tabIndex=-1});track.appendChild(k)})}
  dup();
  function fill(){var guard=0;while(track.scrollWidth/2<view.clientWidth*1.3&&guard++<6){dup();dup()}}
  fill();window.addEventListener('load',fill);
  var paused=false,visible=false,acc=0,last=0,resume=null;
  function half(){return track.scrollWidth/2}
  function pause(){paused=true;clearTimeout(resume)}
  function later(ms){clearTimeout(resume);resume=setTimeout(function(){paused=false;acc=view.scrollLeft},ms||1800)}
  view.addEventListener('mouseenter',pause);view.addEventListener('mouseleave',function(){later(600)});
  view.addEventListener('touchstart',pause,{passive:true});view.addEventListener('touchend',function(){later(2200)},{passive:true});
  view.addEventListener('focusin',pause);view.addEventListener('focusout',function(){later(600)});
  view.addEventListener('wheel',function(){pause();later(2200)},{passive:true});
  view.addEventListener('scroll',function(){var h=half();if(h>0&&view.scrollLeft>=h){view.scrollLeft-=h;acc=view.scrollLeft}else if(view.scrollLeft<=0&&paused){view.scrollLeft+=h}},{passive:true});
  function step(t){if(!last)last=t;var dt=(t-last)/1000;last=t;
    if(!paused&&visible&&!reduce){acc+=speed*dt;var h=half();if(h>0&&acc>=h)acc-=h;view.scrollLeft=acc}
    requestAnimationFrame(step)}
  if('IntersectionObserver' in window){new IntersectionObserver(function(es){visible=es[0].isIntersecting;if(visible)acc=view.scrollLeft}).observe(car)}else{visible=true}
  requestAnimationFrame(step);
  var p=$('.car-btn.prev',car),n=$('.car-btn.next',car);
  function go(dir){pause();view.scrollBy({left:dir*view.clientWidth*.8,behavior:'smooth'});later(3000)}
  if(p)p.addEventListener('click',function(){go(-1)});if(n)n.addEventListener('click',function(){go(1)});
});
/* Formulaires : envoi par courriel (Web3Forms si clé renseignée, sinon ouverture du logiciel de messagerie) */
$$('form.frm').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();
  var msg=$('.frm-msg',f),d=new FormData(f);if(d.get('website'))return;
  if(!f.checkValidity()){msg.textContent='Merci de remplir les champs et de cocher la case.';return}
  var subj=f.getAttribute('data-form'),body='Nom : '+(d.get('nom')||'')+'\nCourriel : '+d.get('email')+'\n\n'+(d.get('message')||'');
  if(FORM_KEY&&!PREVIEW){var o={access_key:FORM_KEY,subject:subj+' (jump-around.net)',from_name:'Site Jump Around',name:d.get('nom')||'',email:d.get('email'),message:d.get('message')||subj};
    fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(o)}).then(function(r){return r.json()}).then(function(j){if(j.success){msg.textContent='Merci ! Message envoyé.';f.reset()}else msg.textContent='Envoi impossible, écris-nous à '+MAIL}).catch(function(){msg.textContent='Envoi impossible, écris-nous à '+MAIL});
  }else{window.location.href='mailto:'+MAIL+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(body);msg.textContent='Ton logiciel de messagerie s’ouvre pour envoyer le message.'}
})});
/* Consentement : Meta Pixel + Metricool seulement après accord */
var loaded=false;
function loadTrackers(){
  if(loaded||PREVIEW)return;loaded=true;
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init',PIXEL_ID);fbq('track','PageView');
  var s=document.createElement('script');s.src='https://tracker.metricool.com/resources/be.js';s.async=true;
  s.onload=function(){try{beTracker.t({hash:METRICOOL_HASH})}catch(e){}};document.head.appendChild(s);
}
var cc=$('#cc');function show(){if(cc)cc.style.display='block'}function hide(){if(cc)cc.style.display='none'}
if(get()==='yes')loadTrackers();else if(get()===null)show();
var ya=$('#cc-yes'),no=$('#cc-no');
if(ya)ya.addEventListener('click',function(){set('yes');hide();loadTrackers()});
if(no)no.addEventListener('click',function(){set('no');hide()});
$$('[data-cookies]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();show()})});
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-track]');
  if(!a||get()!=='yes'||typeof fbq!=='function')return;try{fbq('trackCustom',a.getAttribute('data-track'),{source:a.getAttribute('data-src')||'page'})}catch(_){}});
})();

;(function(){var b=document.getElementById('mapbtn'),box=document.getElementById('mapbox');if(!b||!box)return;b.addEventListener('click',function(){var f=document.createElement('iframe');f.src='https://www.google.com/maps?q=Espace+Mend%C3%A8s+France+Saintes&output=embed&hl=fr';f.title='Carte : Espace Mendès France, Saintes';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';box.innerHTML='';box.appendChild(f)})})();
