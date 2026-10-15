/* ============================================================
   BIO 004 Human Anatomy, Fall 2026
   atlas-name-it.js

   NAME IT BEFORE YOU SEE IT.

   A practice mode for every atlas chapter page. Labels stay hidden,
   one marker lights up at a time, the student says or writes the
   name from memory, taps Reveal, then marks "I had it" or "I missed
   it". At the end they see what they missed and can run just those
   again.

   WHAT IT NEEDS FROM THE PAGE
   ---------------------------
   Only the page's DECK constant (cards, pins, image sizes). It draws
   its own figure and its own answer panel, so it never touches the
   page's Type answers / Tap to reveal / Show all code. It is loaded
   after the page script so DECK and the pins' short names (p.sf) are
   ready.

   WHAT IT WRITES
   --------------
   1. localStorage['bio004-evidence-v1']  (Mastery OS weak spot board)
      A plain array. One entry per competency per save:
        { comp, source:'atlas', got, of, conf:null, at, page }
      This is the same shape BIO004_EVIDENCE.record() writes in the
      course repo's mastery-evidence.js, written directly because the
      atlas does not load that script. selfScoredAgg() in Mastery OS
      folds in every source except 'card' and 'loop', so 'atlas'
      counts with no change on that side. Competencies come from
      atlas-competency-map.js. A structure with no mapped competency
      is practiced but logs nothing.
      Saved when a round ends, and also when the student leaves
      partway (Stop, Close, switching tabs or leaving the page), using
      only what they have marked so far. Nothing is ever logged twice.

   2. localStorage['atlasNameIt_v1']
      { "heart#tricuspid valve": { name, seen, missed, last } }
      One record per structure name per chapter, for a future "which
      structures are weak" view.

   3. localStorage['atlasRec_<chapter>']
      The record the atlas's own "My weak spots" button already reads,
      in the same shape the Check my answers button writes, so a
      structure missed in Name it shows up there too.

   Keyboard: Enter or Space reveals. Then two labeled buttons.
   ============================================================ */
(function () {
  'use strict';
  if (typeof DECK === 'undefined' || !DECK || !DECK.cards) return;

  var PAGE = DECK.id;
  var MAP = window.ATLAS_COMPETENCY_MAP || null;
  var EV_KEY = 'bio004-evidence-v1';
  var NI_KEY = 'atlasNameIt_v1';
  var PREF_KEY = 'atlasNameItPrefs';
  var MASTERY_URL = 'https://drsrennie-stack.github.io/new-build-bio4-solano/mastery-os-fall-2026.html';
  var NS = 'http://www.w3.org/2000/svg';

  function getJSON(k, d) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; }
  }
  function setJSON(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; }
  }

  /* ---------- the things to name ---------- */
  function shortName(p) {
    if (p.sf && p.sf.show) return p.sf.show;
    return String(p.a).split(':')[0].replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function slug(s) {
    return String(s).toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
  }
  var ALL = [];
  DECK.cards.forEach(function (c) {
    if (c.type === 'qa') {
      var idx = -1;
      (c.items || []).some(function (it, i) {
        if (!it.self && /^name\b/i.test(it.q || '')) { idx = i; return true; }
        return false;
      });
      if (idx < 0) return;
      var it = c.items[idx];
      ALL.push({ card: c, pin: null, name: it.a, show: it.a, prompt: it.q,
        rec: c.img + '|' + c.title + '#q' + (idx + 1) });
    } else {
      (c.pins || []).forEach(function (p) {
        ALL.push({ card: c, pin: p, name: p.a, show: shortName(p),
          prompt: p.q || 'Name the structure at the gold ring.',
          rec: c.img + '|' + c.title + '#' + p.lab });
      });
    }
  });
  if (!ALL.length) return;
  ALL.forEach(function (x, i) {
    x.i = i;
    x.comps = MAP && MAP.compsFor ? MAP.compsFor(PAGE, x.card, x.name) : [];
    x.key = PAGE + '#' + slug(x.show);
  });
  var PAGE_LOGS = ALL.some(function (x) { return x.comps.length; });

  /* ---------- styles: the page's own tokens, nothing new ---------- */
  var css = [
    '.ni-toggle{display:inline-flex;align-items:center;gap:8px;min-height:44px;border:1.5px solid var(--navy,#0B1530);background:#fff;color:var(--navy,#0B1530);border-radius:99px;padding:10px 18px;font:700 15px/1 var(--f-body,"Plus Jakarta Sans",system-ui,sans-serif);cursor:pointer}',
    '.ni-toggle svg{width:18px;height:18px;flex:none}',
    '.ni-toggle:hover{border-color:var(--maroon,#8B3A2E);color:var(--maroon,#8B3A2E)}',
    '.ni-toggle[aria-pressed="true"]{background:var(--navy,#0B1530);color:#fff;border-color:var(--navy,#0B1530)}',
    '.ni{display:grid;gap:16px;min-width:0}',
    '.ni[hidden]{display:none}',
    '.ni-off{display:none!important}',
    '.ni-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px}',
    '.ni-head h2{font-family:var(--f-display);font-weight:800;font-size:clamp(22px,3vw,28px);line-height:1.15;margin:0;color:var(--navy,#0B1530)}',
    '.ni-head h2:focus{outline:none}',
    '.ni-head h2:focus-visible{outline:3px solid var(--maroon,#8B3A2E);outline-offset:3px}',
    '.ni .btn{min-height:44px;border-radius:8px}',
    /* keep focused buttons clear of the fixed My weak spots button */
    '.ni button,.ni select,.ni input{scroll-margin-bottom:96px}',
    '.ni .btn.ni-miss-btn{color:var(--maroon,#8B3A2E);border-color:var(--maroon,#8B3A2E)}',
    '.ni-card{background:#fff;border-radius:8px;box-shadow:0 2px 12px rgba(11,21,48,.10),0 0 0 .5px rgba(11,21,48,.12);padding:18px;display:grid;gap:14px;min-width:0}',
    '.ni-card p{margin:0}',
    '.ni-lead{font-size:17px;color:var(--ink,#0B1530)}',
    '.ni-field{display:grid;gap:6px}',
    '.ni-field>label,.ni-field legend{font-weight:700;font-size:15px;color:var(--navy,#0B1530);padding:0}',
    '.ni select{font:inherit;font-size:16px;min-height:44px;width:100%;max-width:420px;padding:8px 10px;border:1.5px solid var(--navy,#0B1530);border-radius:8px;background:#fff;color:var(--navy,#0B1530)}',
    '.ni select:focus-visible,.ni input:focus-visible+span{outline:3px solid var(--maroon,#8B3A2E);outline-offset:2px}',
    '.ni fieldset{border:0;margin:0;padding:0;display:grid;gap:6px;min-width:0}',
    '.ni-chips{display:flex;flex-wrap:wrap;gap:8px}',
    '.ni-chips label{position:relative;cursor:pointer}',
    '.ni-chips input{position:absolute;opacity:0;width:1px;height:1px}',
    '.ni-chips span{display:inline-flex;align-items:center;min-height:44px;padding:8px 16px;border:1px solid var(--line,rgba(11,21,48,.15));border-radius:99px;font-weight:700;font-size:15px;background:#fff;color:var(--navy,#0B1530)}',
    '.ni-chips input:checked+span{background:var(--navy,#0B1530);color:#fff;border-color:var(--navy,#0B1530)}',
    '.ni-note{font-size:15px;color:var(--muted,#4F576A)}',
    '.ni-prog{font-weight:700;font-variant-numeric:tabular-nums;color:var(--maroon,#8B3A2E);font-size:15px}',
    '.ni-q{font-size:19px;font-weight:700;margin:0;color:var(--navy,#0B1530)}',
    '.ni-ans{font-family:var(--f-display);font-weight:800;font-size:clamp(22px,3vw,28px);line-height:1.2;color:var(--navy,#0B1530);background:var(--maroon-soft,#F3F4F7);border-radius:8px;padding:12px 14px;overflow-wrap:anywhere}',
    '.ni-ans[hidden]{display:none}',
    '.ni-ans small{display:block;font:500 15px/1.4 var(--f-body);color:var(--muted,#4F576A);margin-top:4px}',
    '.ni-acts{display:flex;flex-wrap:wrap;gap:10px}',
    '.ni-acts .btn{flex:1 1 140px}',
    '.ni-stage{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(300px,1fr);gap:22px;align-items:start}',
    '@media (max-width:860px){.ni-stage{grid-template-columns:minmax(0,1fr)}}',
    '.ni-plate{background:#fff;border-radius:8px;box-shadow:var(--shadow,0 0 0 .5px rgba(11,21,48,.15));padding:14px;min-width:0}',
    '.ni-plate svg{display:block;width:100%;height:auto;background:#fff;border-radius:8px;user-select:none}',
    '.ni-other circle{fill:var(--navy,#0B1530);stroke:#fff;stroke-width:3;opacity:.32}',
    '.ni-target circle{fill:var(--maroon,#8B3A2E);stroke:#fff;stroke-width:3}',
    '.ni-target text{fill:#fff;font-family:var(--f-body);font-weight:800}',
    '.ni-lbl{font-family:var(--f-body);font-weight:700;fill:var(--maroon,#8B3A2E);paint-order:stroke;stroke:#fff;stroke-width:7px;stroke-linejoin:round}',
    '.ni-sum h3{font-family:var(--f-display);font-weight:800;font-size:24px;margin:0;color:var(--navy,#0B1530)}',
    '.ni-list{list-style:none;margin:0;padding:0;display:grid;gap:8px}',
    '.ni-list li{background:#fff;border-radius:8px;box-shadow:0 1px 6px rgba(11,21,48,.10),0 0 0 .5px rgba(11,21,48,.12);padding:10px 12px;display:grid;gap:2px;min-width:0}',
    '.ni-list b{color:var(--navy,#0B1530);overflow-wrap:anywhere}',
    '.ni-list span{font-size:14px;color:var(--muted,#4F576A)}',
    '.ni a.ni-link{color:var(--maroon,#8B3A2E);font-weight:700}',
    '.ni-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}'
  ].join('\n');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- page hooks ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var header = document.querySelector('header.top');
  var stage = document.querySelector('main.stage');
  if (!header || !stage) return;
  var PAGE_PARTS = ['sets', 'depth', 'strip', 'found'].map($).filter(Boolean).concat([stage]);

  var toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'ni-toggle';
  toggle.id = 'niToggle';
  toggle.setAttribute('aria-pressed', 'false');
  toggle.setAttribute('aria-controls', 'niPanel');
  toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg><span>Name it</span>';
  header.appendChild(toggle);

  var panel = document.createElement('section');
  panel.className = 'ni';
  panel.id = 'niPanel';
  panel.hidden = true;
  panel.setAttribute('aria-labelledby', 'niTitle');
  panel.innerHTML =
    '<div class="ni-head"><h2 id="niTitle" tabindex="-1">Name it before you see it</h2>' +
    '<button type="button" class="btn" id="niClose">Close Name it</button></div>' +
    '<div id="niBody"></div>' +
    '<div class="ni-sr" id="niLive" role="status" aria-live="polite" aria-atomic="true"></div>';
  stage.parentNode.insertBefore(panel, stage);
  var body = $('niBody');
  var live = $('niLive');

  /* ---------- state ---------- */
  var active = false, view = 'setup';
  var run = null; /* { items, pos, phase, results, flushed, loggedComps } */
  var prefs = getJSON(PREF_KEY, {}) || {};

  function say(t) { live.textContent = ''; setTimeout(function () { live.textContent = t; }, 30); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function currentCard() {
    try { if (typeof cur === 'function') return cur(); } catch (e) {}
    return null;
  }

  /* ---------- open and close ---------- */
  function open() {
    if (active) return;
    active = true;
    /* a class, not the hidden attribute: the page's own display rules
       (.sets flex, .strip flex, .stage grid) would override [hidden] */
    PAGE_PARTS.forEach(function (el) { el.classList.add('ni-off'); });
    panel.hidden = false;
    toggle.setAttribute('aria-pressed', 'true');
    showSetup();
    $('niTitle').focus();
  }
  function close() {
    if (!active) return;
    flush();
    active = false;
    run = null;
    panel.hidden = true;
    PAGE_PARTS.forEach(function (el) { el.classList.remove('ni-off'); });
    toggle.setAttribute('aria-pressed', 'false');
    toggle.focus();
  }
  toggle.addEventListener('click', function () { active ? close() : open(); });
  $('niClose').addEventListener('click', close);

  /* ---------- setup ---------- */
  function scopes() {
    var out = [];
    var c = currentCard();
    if (c) {
      var n = ALL.filter(function (x) { return x.card === c; }).length;
      if (n) out.push({ v: 'card', t: 'This card: ' + c.title + ' (' + n + ')', items: function () { return ALL.filter(function (x) { return x.card === c; }); } });
    }
    out.push({ v: 'all', t: 'Whole chapter (' + ALL.length + ')', items: function () { return ALL; } });
    Object.keys(DECK.sets || {}).forEach(function (k) {
      var list = ALL.filter(function (x) { return x.card.set === k; });
      if (list.length && list.length < ALL.length) out.push({ v: 'set:' + k, t: DECK.sets[k] + ' (' + list.length + ')', items: function () { return list; } });
    });
    return out;
  }
  function showSetup() {
    view = 'setup';
    var S = scopes();
    var pick = S.some(function (s) { return s.v === prefs.scope; }) ? prefs.scope : 'all';
    var len = prefs.len || '20';
    var h = '<div class="ni-card">' +
      '<p class="ni-lead">The labels stay hidden. One marker lights up at a time. Say its name or write it down, then tap Reveal and be honest with yourself.</p>' +
      '<div class="ni-field"><label for="niScope">Which structures</label><select id="niScope">' +
      S.map(function (s) { return '<option value="' + esc(s.v) + '"' + (s.v === pick ? ' selected' : '') + '>' + esc(s.t) + '</option>'; }).join('') +
      '</select></div>' +
      '<fieldset class="ni-field"><legend>How many in a round</legend><div class="ni-chips">' +
      ['10', '20', 'all'].map(function (v) {
        return '<label><input type="radio" name="niLen" value="' + v + '"' + (v === len ? ' checked' : '') + '><span>' + (v === 'all' ? 'All of them' : v) + '</span></label>';
      }).join('') + '</div></fieldset>' +
      '<div class="ni-acts"><button type="button" class="btn primary" id="niStart">Start</button></div>' +
      (PAGE_LOGS ? '<p class="ni-note">Your results count toward your weak spots in Mastery OS.</p>'
                 : '<p class="ni-note">Practice only. This chapter does not count toward Mastery OS yet.</p>') +
      '</div>';
    body.innerHTML = h;
    $('niStart').addEventListener('click', function () {
      var v = $('niScope').value;
      var r = body.querySelector('input[name="niLen"]:checked');
      var l = r ? r.value : '20';
      prefs.scope = v; prefs.len = l; setJSON(PREF_KEY, prefs);
      var s = S.filter(function (x) { return x.v === v; })[0] || S[0];
      var items = shuffle(s.items());
      if (l !== 'all') items = items.slice(0, +l);
      startRun(items);
    });
  }

  /* ---------- a round ---------- */
  function startRun(items) {
    run = { items: items, pos: 0, phase: 'ask', results: [], flushed: 0, loggedComps: {} };
    view = 'run';
    body.innerHTML =
      '<div class="ni-stage">' +
        '<div class="ni-plate"><svg id="niFig" role="img"></svg></div>' +
        '<div class="ni-card">' +
          '<div class="ni-prog" id="niProg"></div>' +
          '<div class="eyebrow" id="niWhere"></div>' +
          '<p class="ni-q" id="niQ"></p>' +
          '<div class="ni-ans" id="niAns" hidden></div>' +
          '<div class="ni-acts" id="niActs"></div>' +
          '<div class="ni-acts"><button type="button" class="btn" id="niStop">Stop and see my results</button></div>' +
        '</div>' +
      '</div>';
    $('niStop').addEventListener('click', finish);
    showItem(true);
  }

  function svgEl(t, attrs, parent) {
    var e = document.createElementNS(NS, t);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function drawFig(x, revealed) {
    var c = x.card, svg = $('niFig');
    svg.innerHTML = '';
    svg.setAttribute('viewBox', '0 0 ' + c.w + ' ' + c.h);
    svg.setAttribute('aria-label', c.title + (x.pin ? '. The marker to name is circled in gold.' : '. Name what is inside the gold ring.') +
      (revealed ? ' Answer: ' + x.show + '.' : ''));
    svgEl('image', { href: c.img, x: 0, y: 0, width: c.w, height: c.h }, svg);
    if (!x.pin) return;
    var p = x.pin;
    /* every other marker stays faint so the layout still reads */
    (c.pins || []).forEach(function (o) {
      if (o === p) return;
      var g = svgEl('g', { 'class': 'ni-other', 'aria-hidden': 'true' }, svg);
      svgEl('circle', { cx: o.x, cy: o.y, r: Math.round(c.r * 0.6) }, g);
    });
    /* the revealed name goes where the atlas puts it: toward the old
       label box, which is the side opposite the arrow, pushed just past
       the gold ring so the ring never sits on the words */
    if (revealed) {
      var fs = Math.round(Math.max(26, c.r * 1.0)), gap = c.r * 1.9 + 8;
      var bx = (p.box[0] + p.box[2]) / 2, lx, ly = p.y + fs * 0.35 + (p.dy || 0), anchor;
      if (Math.abs(p.x - bx) < 6) { lx = p.x; ly = p.y - gap; anchor = 'middle'; }
      else if (p.x > bx) { lx = p.x - gap; anchor = 'end'; }
      else { lx = p.x + gap; anchor = 'start'; }
      var t = svgEl('text', { x: lx, y: ly, 'text-anchor': anchor, 'font-size': fs, 'class': 'ni-lbl', 'aria-hidden': 'true' }, svg);
      t.textContent = x.show;
    }
    svgEl('circle', { cx: p.x, cy: p.y, r: c.r * 1.9, 'class': 'ring' }, svg);
    var g2 = svgEl('g', { 'class': 'ni-target', 'aria-hidden': 'true' }, svg);
    svgEl('circle', { cx: p.x, cy: p.y, r: c.r }, g2);
    var tt = svgEl('text', { x: p.x, y: p.y + c.r * 0.42, 'text-anchor': 'middle', 'font-size': Math.round(c.r * 1.2) }, g2);
    tt.textContent = revealed ? p.lab : '?';
  }

  function showItem(focusFirst) {
    var x = run.items[run.pos];
    run.phase = 'ask';
    $('niProg').textContent = (run.pos + 1) + ' of ' + run.items.length;
    $('niWhere').textContent = 'Card ' + x.card.n + ' · ' + ((DECK.sets || {})[x.card.set] || x.card.title);
    $('niQ').textContent = x.prompt;
    $('niAns').hidden = true;
    $('niAns').innerHTML = '';
    drawFig(x, false);
    var acts = $('niActs');
    acts.innerHTML = '<button type="button" class="btn primary" id="niReveal">Reveal</button>';
    $('niReveal').addEventListener('click', reveal);
    if (focusFirst !== false) $('niReveal').focus();
  }

  function reveal() {
    if (!run || run.phase !== 'ask') return;
    var x = run.items[run.pos];
    run.phase = 'shown';
    var a = $('niAns');
    a.innerHTML = esc(x.show) + (x.name !== x.show ? '<small>' + esc(x.name) + '</small>' : '');
    a.hidden = false;
    drawFig(x, true);
    say('Answer: ' + x.name);
    var acts = $('niActs');
    acts.innerHTML =
      '<button type="button" class="btn primary" id="niHad">I had it</button>' +
      '<button type="button" class="btn ni-miss-btn" id="niMissed">I missed it</button>';
    $('niHad').addEventListener('click', function () { mark(true); });
    $('niMissed').addEventListener('click', function () { mark(false); });
    $('niHad').focus();
  }

  function mark(had) {
    if (!run || run.phase !== 'shown') return;
    var x = run.items[run.pos];
    run.results.push({ x: x, had: had });
    saveStructure(x, had);
    run.pos++;
    if (run.pos >= run.items.length) finish();
    else showItem();
  }

  /* ---------- saving ---------- */
  function saveStructure(x, had) {
    var now = new Date().toISOString();
    var ni = getJSON(NI_KEY, {}) || {};
    var r = ni[x.key] || { name: x.show, seen: 0, missed: 0 };
    r.seen++;
    if (!had) r.missed++;
    r.last = now;
    ni[x.key] = r;
    setJSON(NI_KEY, ni);

    var RK = 'atlasRec_' + PAGE, rec = getJSON(RK, {}) || {};
    var q = rec[x.rec] || { r: 0, w: 0 };
    q.ok = !!had;
    if (had) q.r++; else q.w++;
    q.t = Date.now();
    rec[x.rec] = q;
    setJSON(RK, rec);
    try { window.dispatchEvent(new Event('atlas-rec')); } catch (e) {}
  }

  /* One entry per competency, built only from answers not yet saved. */
  function flush() {
    if (!run || run.flushed >= run.results.length) return;
    var fresh = run.results.slice(run.flushed);
    run.flushed = run.results.length;
    var by = {};
    fresh.forEach(function (r) {
      r.x.comps.forEach(function (c) {
        var b = by[c] || (by[c] = { got: 0, of: 0 });
        b.of++;
        if (r.had) b.got++;
      });
    });
    var comps = Object.keys(by);
    if (!comps.length) return;
    var at = new Date().toISOString();
    var list = getJSON(EV_KEY, []);
    if (!Array.isArray(list)) list = [];
    comps.forEach(function (c) {
      list.push({ comp: c, source: 'atlas', got: by[c].got, of: by[c].of, conf: null, at: at, page: PAGE });
      run.loggedComps[c] = 1;
    });
    if (list.length > 4000) list = list.slice(list.length - 4000);
    setJSON(EV_KEY, list);
  }
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flush(); });

  /* ---------- end of round ---------- */
  function finish() {
    if (!run) return;
    flush();
    view = 'summary';
    var res = run.results;
    var had = res.filter(function (r) { return r.had; }).length;
    var missed = res.filter(function (r) { return !r.had; });
    var logged = Object.keys(run.loggedComps).length > 0;
    var h = '<div class="ni-card ni-sum">';
    if (!res.length) {
      h += '<h3>No answers yet</h3><p class="ni-lead">Nothing was marked, so nothing was saved.</p>';
    } else {
      h += '<h3>You had ' + had + ' of ' + res.length + '</h3>';
      if (missed.length) {
        h += '<p class="ni-lead">Go back over these:</p><ul class="ni-list">' +
          missed.map(function (r) {
            return '<li><b>' + esc(r.x.show) + '</b><span>Card ' + r.x.card.n + ': ' + esc(r.x.card.title) + '</span></li>';
          }).join('') + '</ul>';
      } else {
        h += '<p class="ni-lead">You named every one.</p>';
      }
    }
    h += '<div class="ni-acts">' +
      (missed.length ? '<button type="button" class="btn primary" id="niAgain">Practice the ' + missed.length + ' I missed</button>' : '') +
      '<button type="button" class="btn' + (missed.length ? '' : ' primary') + '" id="niNew">New round</button>' +
      '<button type="button" class="btn" id="niBack">Back to the cards</button></div>';
    if (res.length) {
      h += logged
        ? '<p class="ni-note">Saved to your weak spots in Mastery OS. <a class="ni-link" href="' + MASTERY_URL + '" target="_top">Open Mastery OS</a></p>'
        : '<p class="ni-note">Practice only. These structures do not count toward Mastery OS yet.</p>';
    }
    h += '</div>';
    body.innerHTML = h;
    var again = $('niAgain');
    var missedItems = missed.map(function (r) { return r.x; });
    if (again) again.addEventListener('click', function () { startRun(shuffle(missedItems)); });
    $('niNew').addEventListener('click', function () { run = null; showSetup(); $('niTitle').focus(); });
    $('niBack').addEventListener('click', close);
    say(res.length ? 'Round done. You had ' + had + ' of ' + res.length + '.' : 'Round stopped.');
    $('niTitle').focus();
  }

  /* ---------- keyboard ---------- */
  window.addEventListener('keydown', function (e) {
    if (!active) return;
    /* the page's arrow keys flip cards behind the panel; keep them out */
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      var tag = (e.target && e.target.tagName) || '';
      if (tag !== 'SELECT' && tag !== 'INPUT') e.stopPropagation();
      return;
    }
    if (e.key === 'Escape' && !document.querySelector('dialog[open]')) {
      var veil = document.querySelector('.ss-veil');
      if (!veil || veil.hidden) { close(); return; }
    }
    if (view !== 'run' || !run || run.phase !== 'ask') return;
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var t = e.target, tn = (t && t.tagName) || '';
    if (tn === 'BUTTON' || tn === 'A' || tn === 'INPUT' || tn === 'SELECT' || tn === 'TEXTAREA') return;
    e.preventDefault();
    reveal();
  }, true);
})();
