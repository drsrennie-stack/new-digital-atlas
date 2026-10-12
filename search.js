/* Spotlight-style structure search shared by every atlas page.
   Needs window.ATLAS_INDEX (from search-data.js). Opens from the corner button or Cmd/Ctrl+K. */
(function(){
  const css=`
  .ss-btn{position:absolute;top:calc(14px + env(safe-area-inset-top,0px));right:16px;z-index:30;display:flex;align-items:center;gap:8px;
    font:600 13px/1 "Plus Jakarta Sans",system-ui,sans-serif;color:#0B1530;background:#fff;border:.5px solid rgba(11,21,48,.15);border-radius:99px;
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

/* Weak spots dashboard: reads what this device has saved on each chapter page */
(function(){
  if(!window.ATLAS_INDEX||!window.ATLAS_CHAPTERS||window.__weakReady)return;window.__weakReady=true;
  const IDX=window.ATLAS_INDEX, CH=window.ATLAS_CHAPTERS;
  const get=k=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):null}catch(e){return null}};
  const set=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
  const del=k=>{try{localStorage.removeItem(k)}catch(e){}};
  const prefs=get('atlasWeakPrefs')||{mod:null,untried:false,right:false};
  const css=`
  #wkBtn{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:9998;
    background:#0B1530;color:#fff;border:0;border-radius:999px;padding:12px 18px;font:700 15px/1 inherit;font-family:inherit;
    box-shadow:0 6px 18px rgba(11,21,48,.35);cursor:pointer;display:flex;gap:8px;align-items:center}
  #wkBtn .n{background:#8B3A2E;border-radius:999px;padding:3px 8px;font-size:13px}
  #wkBtn:focus-visible,#wkDlg button:focus-visible,#wkDlg a:focus-visible,#wkDlg input:focus-visible{outline:3px solid #DCB45C;outline-offset:2px}
  #wkDlg{border:0;border-radius:16px;padding:0;width:min(760px,calc(100vw - 32px));max-height:min(86vh,900px);
    box-shadow:0 20px 60px rgba(11,21,48,.4);color:#0B1530;background:#fff;font-family:inherit}
  #wkDlg::backdrop{background:rgba(11,21,48,.45)}
  #wkDlg .top{position:sticky;top:0;background:#fff;padding:18px 20px 12px;border-bottom:1px solid #E3E6EC;z-index:1}
  #wkDlg h2{margin:0;font-size:22px;line-height:1.2}
  #wkDlg .sub{margin:4px 0 12px;color:#4F576A;font-size:15px}
  #wkDlg .x{position:absolute;right:12px;top:12px;border:0;background:#F3F4F7;border-radius:999px;width:38px;height:38px;font-size:20px;cursor:pointer;color:#0B1530}
  #wkDlg .mods{display:flex;flex-wrap:wrap;gap:8px}
  #wkDlg .mods button{border:1px solid #D5D9E2;background:#fff;color:#0B1530;border-radius:999px;padding:8px 14px;font:700 15px inherit;font-family:inherit;cursor:pointer}
  #wkDlg .mods button[aria-pressed=true]{background:#0B1530;color:#fff;border-color:#0B1530}
  #wkDlg .tog{display:flex;flex-wrap:wrap;gap:16px;margin-top:12px;font-size:15px}
  #wkDlg .tog label{display:flex;gap:8px;align-items:center;cursor:pointer}
  #wkDlg .tog input{width:20px;height:20px;accent-color:#0B1530}
  #wkDlg .body{padding:14px 20px 20px;overflow:auto}
  #wkDlg .sum{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:14px}
  #wkDlg .sum div{background:#F3F4F7;border-radius:10px;padding:8px 12px;font-size:14px;color:#4F576A}
  #wkDlg .sum b{display:block;font-size:22px;color:#0B1530;font-variant-numeric:tabular-nums}
  #wkDlg .bar{height:8px;background:#E3E6EC;border-radius:99px;overflow:hidden;display:flex;margin-bottom:16px}
  #wkDlg .bar i{display:block;height:100%}
  #wkDlg h3{font-size:16px;margin:18px 0 6px;display:flex;justify-content:space-between;gap:8px;align-items:baseline}
  #wkDlg h3 a{font-size:14px;color:#8B3A2E;font-weight:700}
  #wkDlg ul{list-style:none;margin:0;padding:0;display:grid;gap:6px}
  #wkDlg li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 10px;align-items:center;background:#fff;border:1px solid #E3E6EC;border-radius:10px;padding:9px 12px}
  #wkDlg li .nm{font-weight:700;min-width:0}
  #wkDlg li .ct{grid-column:1;color:#4F576A;font-size:13px;min-width:0}
  #wkDlg li .go{grid-row:1/3;grid-column:2;display:flex;flex-direction:column;align-items:flex-end;gap:6px}
  #wkDlg .tag{font-size:12px;font-weight:700;border-radius:99px;padding:3px 9px;white-space:nowrap}
  #wkDlg .t-miss{background:#F7E3E0;color:#8B3A2E}#wkDlg .t-new{background:#EEF0F4;color:#4F576A}#wkDlg .t-ok{background:#E2F1E6;color:#256B3A}
  #wkDlg .go a{font-size:14px;font-weight:700;color:#0B1530}
  #wkDlg .empty{background:#F3F4F7;border-radius:12px;padding:16px;color:#4F576A}
  #wkDlg .foot{margin-top:18px;font-size:13px;color:#4F576A;display:flex;flex-wrap:wrap;gap:10px;align-items:center}
  #wkDlg .foot button{border:1px solid #D5D9E2;background:#fff;border-radius:8px;padding:6px 10px;font-family:inherit;font-size:13px;cursor:pointer;color:#0B1530}
  @media (max-width:520px){#wkBtn .lbl{display:none}}`;
  const st=document.createElement('style');st.textContent=css+'body{padding-bottom:84px}';document.head.appendChild(st);
  const btn=document.createElement('button');btn.id='wkBtn';btn.type='button';btn.innerHTML='<span class="lbl">My weak spots</span><span class="n" id="wkN">0</span>';
  btn.setAttribute('aria-label','Open my weak spots');document.body.appendChild(btn);
  const dlg=document.createElement('dialog');dlg.id='wkDlg';dlg.setAttribute('aria-labelledby','wkH');document.body.appendChild(dlg);
  const recs={};CH.forEach(c=>recs[c.id]=get('atlasRec_'+c.id)||{});
  const key=e=>e.img+'|'+e.ct+'#'+e.k;
  const status=e=>{const r=(recs[e.d]||{})[key(e)];if(!r)return{s:'new'};return{s:r.ok?'ok':'miss',r}};
  const mods=[...new Set(CH.map(c=>c.module))].sort();
  function totalMiss(){let n=0;IDX.forEach(e=>{if(status(e).s==='miss')n++});return n}
  function refreshCount(){CH.forEach(c=>recs[c.id]=get('atlasRec_'+c.id)||{});document.getElementById('wkN').textContent=totalMiss()}
  if(prefs.mod==null||!mods.includes(prefs.mod)){const here=CH.find(c=>location.pathname.endsWith('/'+c.id+'.html'));prefs.mod=here?here.module:mods[0]}
  function render(){
    refreshCount();
    const chs=CH.filter(c=>c.module===prefs.mod);const ids=new Set(chs.map(c=>c.id));
    const items=IDX.filter(e=>ids.has(e.d)).map(e=>({e,...status(e)}));
    const nMiss=items.filter(i=>i.s==='miss').length,nOk=items.filter(i=>i.s==='ok').length,nNew=items.filter(i=>i.s==='new').length,tot=items.length||1;
    let h=`<div class="top"><button class="x" type="button" aria-label="Close">✕</button><h2 id="wkH">My weak spots</h2>
      <p class="sub">Pick a module. You'll see what you missed the last time you checked your answers on this device.</p>
      <div class="mods" role="group" aria-label="Module">${mods.map(m=>`<button type="button" data-m="${m}" aria-pressed="${m===prefs.mod}">Module ${m}</button>`).join('')}</div>
      <div class="tog"><label><input type="checkbox" id="wkNew" ${prefs.untried?'checked':''}> Also show ones I haven't tried</label>
      <label><input type="checkbox" id="wkOk" ${prefs.right?'checked':''}> Also show ones I got right</label></div></div><div class="body">
      <div class="sum"><div><b>${nMiss}</b>Missed</div><div><b>${nOk}</b>Got right</div><div><b>${nNew}</b>Not tried yet</div></div>
      <div class="bar" aria-hidden="true"><i style="width:${nOk/tot*100}%;background:#3E8E57"></i><i style="width:${nMiss/tot*100}%;background:#8B3A2E"></i></div>`;
    let any=false;
    const order=chs.slice().sort((a,b)=>items.filter(i=>i.e.d===b.id&&i.s==='miss').length-items.filter(i=>i.e.d===a.id&&i.s==='miss').length);
    order.forEach(c=>{
      const mine=items.filter(i=>i.e.d===c.id);
      const miss=mine.filter(i=>i.s==='miss').sort((a,b)=>a.e.c-b.e.c);
      const ok=prefs.right?mine.filter(i=>i.s==='ok').sort((a,b)=>a.e.c-b.e.c):[];
      const fresh={};if(prefs.untried)mine.filter(i=>i.s==='new').forEach(i=>{(fresh[i.e.c]=fresh[i.e.c]||{e:i.e,n:0}).n++});
      const freshRows=Object.values(fresh).sort((a,b)=>a.e.c-b.e.c);
      if(!miss.length&&!ok.length&&!freshRows.length)return;any=true;
      h+=`<h3><span>${esc(c.title)}</span><a href="${c.id}.html">Open chapter</a></h3><ul>`;
      const row=(e,name,sub,tag)=>`<li><span class="nm">${esc(name)}</span><span class="ct">${sub}</span><span class="go">${tag}<a href="${e.d}.html#c${e.c}" data-go>Practice this card</a></span></li>`;
      miss.forEach(i=>{h+=row(i.e,i.e.show,`Card ${i.e.c}${i.e.lab?', number '+i.e.lab:''}: ${esc(i.e.ct)}`,`<span class="tag t-miss">Missed${i.r.w>1?' '+i.r.w+' times':''}</span>`)});
      freshRows.forEach(f=>{h+=row(f.e,'Card '+f.e.c+': '+f.e.ct,`${f.n} ${f.n===1?'structure':'structures'} you haven't tried`,'<span class="tag t-new">Not tried</span>')});
      ok.forEach(i=>{h+=row(i.e,i.e.show,`Card ${i.e.c}${i.e.lab?', number '+i.e.lab:''}: ${esc(i.e.ct)}`,'<span class="tag t-ok">Got it</span>')});
      h+='</ul>'});
    if(!any)h+=`<p class="empty">${nOk+nMiss===0?'Nothing saved for this module yet. Open a chapter, type your answers, and press Check my answers. Anything you miss will show up here.':nMiss===0?'No misses in this module right now. Turn on "Also show ones I haven\'t tried" to find new cards to practice.':'Nothing to show with these settings.'}</p>`;
    h+=`<div class="foot"><span>Saved only in this browser on this device.</span><span id="wkClr"><button type="button" id="wkClear">Clear my record for Module ${prefs.mod}</button></span></div></div>`;
    dlg.innerHTML=h;
    dlg.querySelector('.x').onclick=()=>dlg.close();
    dlg.querySelectorAll('.mods button').forEach(b=>b.onclick=()=>{prefs.mod=b.dataset.m;save();render()});
    dlg.querySelector('#wkNew').onchange=e=>{prefs.untried=e.target.checked;save();render()};
    dlg.querySelector('#wkOk').onchange=e=>{prefs.right=e.target.checked;save();render()};
    dlg.querySelector('#wkClear').onclick=()=>{const s=dlg.querySelector('#wkClr');
      s.innerHTML=`Clear everything saved for Module ${prefs.mod}? <button type="button" id="wkYes">Yes, clear it</button> <button type="button" id="wkNo">Keep it</button>`;
      s.querySelector('#wkYes').onclick=()=>{chs.forEach(c=>del('atlasRec_'+c.id));render()};s.querySelector('#wkNo').onclick=render};
    dlg.querySelectorAll('a[data-go]').forEach(a=>a.onclick=()=>{dlg.close()});
  }
  function esc(s){return String(s).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]))}
  function save(){set('atlasWeakPrefs',prefs)}
  dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
  btn.onclick=()=>{render();if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','')};
  window.addEventListener('atlas-rec',refreshCount);window.addEventListener('storage',refreshCount);
  refreshCount();
})();
