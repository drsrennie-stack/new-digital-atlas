/* Walk-through video cards for the Anatomy Atlas. Reads window.ATLAS_VIDEOS from videos-data.js.
   Any element with data-videos="<chapter key>" gets that chapter's video cards. */
(function(){
  var V = window.ATLAS_VIDEOS; if(!V) return;
  var css = ''
  + '.av-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}'
  + '.av-card{background:#fff;border:.5px solid rgba(11,21,48,.15);border-radius:8px;box-shadow:0 2px 8px rgba(11,21,48,.06);display:flex;gap:10px;align-items:center;padding:8px}'
  + '.av-play{all:unset;cursor:pointer;flex:0 0 112px;position:relative;aspect-ratio:16/9;border-radius:5px;overflow:hidden;background:#0B1530}'
  + '.av-play img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}'
  + '.av-play .av-tri{position:absolute;left:50%;top:50%;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50%;background:#8B3A2E;display:grid;place-items:center;box-shadow:0 2px 8px rgba(0,0,0,.3)}'
  + '.av-play:focus-visible{outline:3px solid #8B3A2E;outline-offset:2px}'
  + '.av-txt{flex:1;min-width:0}'
  + '.av-txt b{display:block;font-size:13.5px;line-height:1.25;color:#0B1530}'
  + '.av-txt a{display:inline-block;margin-top:3px;font-size:12px;font-weight:700;color:#8B3A2E}'
  + '.av-qr{flex:0 0 auto;line-height:0}'
  + '.av-qr svg{width:52px;height:52px;background:#fff}'
  + 'dialog.av-dlg{border:0;padding:0;border-radius:10px;width:min(760px,96vw);max-width:96vw;background:#0B1530;box-shadow:0 20px 60px rgba(0,0,0,.4)}'
  + 'dialog.av-dlg::backdrop{background:rgba(11,21,48,.7)}'
  + '.av-bar{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;padding:10px 12px;color:#fff;font-weight:700;font-size:14px}'
  + '.av-bar .av-btns{display:flex;gap:6px;flex-wrap:wrap}'
  + '.av-bar button{font:700 12px/1 "Plus Jakarta Sans",system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;background:#fff;color:#0B1530;border:0;border-radius:4px;padding:9px 11px;cursor:pointer}'
  + '.av-bar button:disabled{opacity:.4;cursor:default}'
  + '.av-bar button:focus-visible{outline:3px solid #DCB45C;outline-offset:2px}'
  + '.av-frame{aspect-ratio:16/9;width:100%}'
  + '.av-frame iframe{width:100%;height:100%;border:0;display:block}'
  + '.av-vh{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var dlg = document.createElement('dialog'); dlg.className = 'av-dlg'; dlg.setAttribute('aria-label','Video');
  dlg.innerHTML = '<div class="av-bar"><span id="avTitle"></span><span class="av-btns"><button type="button" id="avSmall">Smaller</button><button type="button" id="avBig">Bigger</button><button type="button" id="avFull">Full screen</button><button type="button" id="avClose">Close</button></span></div><div class="av-frame" id="avFrame"></div>';
  document.body.appendChild(dlg);
  function close(){ document.getElementById('avFrame').innerHTML=''; if(dlg.open) dlg.close(); }
  dlg.querySelector('#avClose').onclick = close;
  var SIZES = [480, 640, 760, 960, 1200, 1600], size = 2;
  function setSize(){ dlg.style.width = 'min(' + SIZES[size] + 'px,96vw)';
    dlg.querySelector('#avSmall').disabled = size === 0; dlg.querySelector('#avBig').disabled = size === SIZES.length - 1; }
  dlg.querySelector('#avSmall').onclick = function(){ if(size > 0){ size--; setSize(); } };
  dlg.querySelector('#avBig').onclick = function(){ if(size < SIZES.length - 1){ size++; setSize(); } };
  dlg.querySelector('#avFull').onclick = function(){ var f = document.querySelector('#avFrame iframe') || dlg;
    var r = f.requestFullscreen || f.webkitRequestFullscreen; if(r) r.call(f); };
  setSize();
  dlg.addEventListener('close', function(){ document.getElementById('avFrame').innerHTML=''; });
  dlg.addEventListener('click', function(e){ if(e.target===dlg) close(); });

  function open(id){
    var v = V.videos[id];
    document.getElementById('avTitle').textContent = v.t + ', Ninja Nerd';
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1';
    f.title = 'Ninja Nerd video: ' + v.t;
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true;
    var box = document.getElementById('avFrame'); box.innerHTML=''; box.appendChild(f);
    if(dlg.showModal) dlg.showModal(); else window.open('https://www.youtube.com/watch?v='+id,'_blank','noopener');
  }

  function card(id){
    var v = V.videos[id], d = document.createElement('article'); d.className = 'av-card';
    d.innerHTML = '<button type="button" class="av-play"><img alt="" loading="lazy"><span class="av-tri" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#fff"/></svg></span><span class="av-vh"></span></button>'
      + '<div class="av-txt"><b></b><a target="_blank" rel="noopener">YouTube<span class="av-vh"> (opens in a new tab)</span></a></div><span class="av-qr" title="Scan to watch on your phone">' + v.qr + '</span>';
    var img = d.querySelector('img'); img.src = 'https://i.ytimg.com/vi/' + id + '/mqdefault.jpg'; img.onerror = function(){ img.remove(); };
    d.querySelector('.av-play .av-vh').textContent = 'Play ' + v.t;
    d.querySelector('.av-play').onclick = function(){ open(id); };
    d.querySelector('b').textContent = v.t;
    d.querySelector('a').href = 'https://www.youtube.com/watch?v=' + id;
    return d;
  }

  window.atlasVideoCards = function(key){
    var c = V.chapters.filter(function(x){ return x.key === key; })[0];
    var g = document.createElement('div'); g.className = 'av-grid';
    if(c) c.ids.forEach(function(id){ g.appendChild(card(id)); });
    return g;
  };
  window.atlasVideoCount = function(key){
    var c = V.chapters.filter(function(x){ return x.key === key; })[0];
    return c ? c.ids.length : 0;
  };

  [].forEach.call(document.querySelectorAll('[data-videos]'), function(el){
    var key = el.getAttribute('data-videos');
    if(!window.atlasVideoCount(key)){ el.hidden = true; return; }
    el.hidden = false; el.appendChild(window.atlasVideoCards(key));
  });
})();
