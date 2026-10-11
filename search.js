/* Spotlight-style structure search shared by every atlas page.
   Needs window.ATLAS_INDEX (from search-data.js). Opens from the corner button or Cmd/Ctrl+K. */
(function(){
  const css=`
  .ss-btn{position:absolute;top:calc(14px + env(safe-area-inset-top,0px));right:16px;z-index:30;display:flex;align-items:center;gap:8px;
    font:800 13px/1 "Plus Jakarta Sans",system-ui,sans-serif;color:#0B1530;background:#fff;border:.5px solid rgba(11,21,48,.15);border-radius:99px;
    padding:9px 14px 9px 12px;cursor:pointer;box-shadow:0 1px 3px rgba(11,21,48,.08)}
  .ss-btn:hover{border-color:#8B3A2E;color:#8B3A2E}
  .ss-btn kbd{font:600 11px/1 "Plus Jakarta Sans",system-ui,sans-serif;color:#4F576A;border:.5px solid rgba(11,21,48,.2);border-radius:4px;padding:3px 5px}
  @media (max-width:600px){.ss-btn .ss-t,.ss-btn kbd{display:none}.ss-btn{padding:10px}}
  .ss-veil{position:fixed;inset:0;z-index:40;background:rgba(11,21,48,.28);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;justify-content:center;align-items:flex-start;padding:12vh 16px 16px}
  .ss-veil[hidden]{display:none!important}
  .ss-box{width:min(760px,100%);max-height:76vh;display:flex;flex-direction:column;background:#fff;border-radius:12px;box-shadow:0 24px 60px rgba(11,21,48,.28);overflow:hidden}
  .ss-in{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:.5px solid rgba(11,21,48,.15)}
  .ss-in input{flex:1;min-width:0;border:0;outline:0;font:500 21px/1.3 "Plus Jakarta Sans",system-ui,sans-serif;color:#0B1530;background:transparent}
  .ss-in input::placeholder{color:#8C93A1}
  .ss-in input::-webkit-search-cancel-button{-webkit-appearance:none;appearance:none}
  .ss-x{border:0;background:#F3F4F7;border-radius:6px;font:600 12px/1 "Plus Jakarta Sans",system-ui,sans-serif;color:#4F576A;padding:7px 9px;cursor:pointer}
  .ss-res{overflow:auto;padding:8px 18px 18px}
  .ss-hint{color:#4F576A;font:500 14px/1.5 "Plus Jakarta Sans",system-ui,sans-serif;padding:10px 0}
  .ss-g{padding:12px 0;border-bottom:.5px solid rgba(11,21,48,.1)}
  .ss-g h4{margin:0 0 8px;font:800 16px/1.2 "Plus Jakarta Sans",system-ui,sans-serif;color:#0B1530;display:flex;gap:8px;align-items:baseline}
  .ss-g h4 span{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#8B3A2E}
  .ss-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
  .ss-tile{display:grid;gap:5px;text-decoration:none;color:#0B1530;border:.5px solid rgba(11,21,48,.15);border-radius:8px;padding:6px;background:#fff}
  .ss-tile:hover,.ss-tile:focus{border-color:#8B3A2E;outline:0}
  .ss-pic{position:relative;aspect-ratio:4/3;overflow:hidden;border-radius:5px;background:#fff}
  .ss-pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
  .ss-mark{position:absolute;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:#8B3A2E;box-shadow:0 0 0 2px #fff,0 0 0 4px #DCB45C}
  .ss-cap{font:600 12px/1.25 "Plus Jakarta Sans",system-ui,sans-serif;color:#4F576A}
  .ss-cap b{display:block;color:#0B1530}
  .ss-btn:focus-visible,.ss-x:focus-visible{outline:3px solid #8B3A2E;outline-offset:2px}`;
  const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  const IDX=(window.ATLAS_INDEX||[]);
  const ABBR={a:'artery',aa:'arteries',art:'artery',v:'vein',vv:'veins',r:'right',rt:'right',l:'left',lt:'left',svc:'superior vena cava',ivc:'inferior vena cava',m:'muscle',ant:'anterior',post:'posterior',sr:'sarcoplasmic reticulum'};
  const DROP=new Set(['the','of','for','to','opening','openings','space','an']);
  const norm=s=>s.toLowerCase().replace(/[\/,.;:()"'+-]/g,' ').split(/\s+/).filter(Boolean).map(w=>ABBR[w]||w).join(' ').split(' ').filter(w=>!DROP.has(w)).map(w=>w.length>4?w.replace(/(es|s)$/,''):w).join(' ');
  function lev(a,b){const m=a.length,n=b.length;if(!m)return n;if(!n)return m;let p=[...Array(n+1).keys()];for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]==b[j-1]?0:1));p=c}return p[n]}
  IDX.forEach(e=>{e.nn=e.names.map(norm);e.key=norm(e.show)});
  function score(e,q){const qt=q.split(' ');let best=0;e.nn.forEach(n=>{let s=0;
    if(n===q)s=100;else if(n.startsWith(q))s=90;else if(n.includes(q))s=75;
    else if(q.length>=5&&lev(q,n)<=Math.max(1,Math.floor(n.length/7)))s=85;
    else{const nt=n.split(' ');if(qt.every(t=>nt.some(w=>w.startsWith(t)||(t.length>=5&&lev(t,w)<=1))))s=60}
    best=Math.max(best,s)});return best}
  const btn=document.createElement('button');btn.className='ss-btn';btn.type='button';btn.setAttribute('aria-label','Find a structure');
  btn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg><span class="ss-t">Find a structure</span><kbd>'+(/Mac|iPhone|iPad/.test(navigator.platform)?'⌘K':'Ctrl K')+'</kbd>';
  const veil=document.createElement('div');veil.className='ss-veil';veil.hidden=true;veil.setAttribute('role','dialog');veil.setAttribute('aria-modal','true');veil.setAttribute('aria-label','Find a structure');
  veil.innerHTML='<div class="ss-box"><div class="ss-in"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="#8B3A2E" stroke-width="2.4"/><path d="M15.5 15.5 21 21" stroke="#8B3A2E" stroke-width="2.4" stroke-linecap="round"/></svg><input id="ss-q" type="search" autocomplete="off" spellcheck="false" placeholder="Type a structure, like aorta or papillary muscle" aria-label="Structure name"><button class="ss-x" type="button">Esc</button></div><div class="ss-res" id="ss-res" aria-live="polite"><div class="ss-hint">Every image that shows the structure appears here. Tap one to open it with the structure circled.</div></div></div>';
  document.addEventListener('DOMContentLoaded',()=>{document.body.appendChild(btn);document.body.appendChild(veil)});
  if(document.readyState!=='loading'){document.body.appendChild(btn);document.body.appendChild(veil)}
  const q=()=>veil.querySelector('#ss-q'),res=()=>veil.querySelector('#ss-res');
  let last=null;
  function open(){last=document.activeElement;veil.hidden=false;setTimeout(()=>q().focus(),20)}
  function close(){veil.hidden=true;if(last&&last.focus)last.focus()}
  btn.addEventListener('click',open);
  veil.addEventListener('click',e=>{if(e.target===veil||e.target.classList.contains('ss-x'))close()});
  document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();veil.hidden?open():close()}else if(e.key==='Escape'&&!veil.hidden)close()});
  function tile(e){const a=document.createElement('a');a.className='ss-tile';a.href=`${e.d}.html#c${e.c}${e.p?'-p'+e.p:''}`;
    a.addEventListener('click',()=>{if(location.pathname.endsWith('/'+e.d+'.html')){close()}});
    const pic=document.createElement('div');pic.className='ss-pic';const img=document.createElement('img');img.src=e.img;img.alt='';img.loading='lazy';pic.appendChild(img);
    if(e.p){const box=4/3,ir=e.w/e.h;let sx,sy,ox=0,oy=0;if(ir>box){sx=100/e.w;sy=sx*box;oy=(100-e.h*sy)/2}else{sy=100/e.h;sx=sy/box;ox=(100-e.w*sx)/2}
      const m=document.createElement('span');m.className='ss-mark';m.style.left=(ox+e.x*sx)+'%';m.style.top=(oy+e.y*sy)+'%';pic.appendChild(m)}
    a.appendChild(pic);const cap=document.createElement('div');cap.className='ss-cap';cap.innerHTML='<b></b>';cap.firstChild.textContent=`${e.dt} · Card ${e.c}`;cap.appendChild(document.createTextNode(e.ct));a.appendChild(cap);return a}
  let timer;veil.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(run,110)});
  function run(){const raw=q().value.trim(),out=res();const n=norm(raw);out.innerHTML='';
    if(n.length<2){out.innerHTML='<div class="ss-hint">Every image that shows the structure appears here. Tap one to open it with the structure circled.</div>';return}
    const hits=IDX.map(e=>({e,s:score(e,n)})).filter(h=>h.s>0);
    if(!hits.length){out.innerHTML='<div class="ss-hint">No match yet. Check the spelling or try a shorter name.</div>';return}
    const G={};hits.forEach(h=>{const g=G[h.e.key]=G[h.e.key]||{name:h.e.show,s:0,items:[]};g.s=Math.max(g.s,h.s);g.items.push(h.e)});
    Object.values(G).sort((a,b)=>b.s-a.s||a.name.localeCompare(b.name)).slice(0,12).forEach(g=>{
      const sec=document.createElement('div');sec.className='ss-g';const h=document.createElement('h4');h.textContent=g.name;
      const c=document.createElement('span');c.textContent=`${g.items.length} ${g.items.length===1?'image':'images'}`;h.appendChild(c);sec.appendChild(h);
      const t=document.createElement('div');t.className='ss-tiles';g.items.forEach(e=>t.appendChild(tile(e)));sec.appendChild(t);out.appendChild(sec)})}
  window.atlasSearch={open,close};
})();
