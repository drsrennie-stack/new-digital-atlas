/* ============================================================
   THE LAUNCHPAD OVERLAY.
   The four doors (Lecture, Lab, Study, Calendar) as a dark
   full-screen popup that appears EVERY time the page loads.
   Nothing is remembered on purpose: Scrubs' call, so a student
   who picked Lab once is not funneled to Lab forever. Choosing
   Calendar just closes the curtain, because the page behind it
   IS the calendar. Escape also closes it.

   To put it on a page: <script src="bio004-launchpad-overlay.js">
   after the page's content. Built for bio004-course-calendar.html.
   The standalone version lives at bio004-launchpad.html for
   Canvas embeds.
   ============================================================ */
(function () {
  'use strict';
  if (window.__BIO004_LAUNCHPAD__) return;
  window.__BIO004_LAUNCHPAD__ = true;
  /* Canvas shows the calendar inside an iframe, and the doors are
     MEANT to appear there first: that is the whole point. The only
     opt-out is explicit: add ?nolaunch=1 to the address for an embed
     that should skip straight to the calendar. */
  if (/[?&]nolaunch=1/.test(window.location.search)) return;

  /* The curtain is for students ARRIVING at the course, from Canvas, a
     phone link or a fresh tab. It was also opening when they were already
     inside the site, which is how "Go to the calendar" became a loop: the
     calendar loaded and the doors dropped in front of it again. So if the
     click came from another page on this same site, the doors stay down. */
  try {
    if (document.referrer) {
      var from = document.createElement('a');
      from.href = document.referrer;
      if (from.host === window.location.host) return;
    }
  } catch (e) {}

  var css = ''
  + '.lpov{position:fixed;inset:0;z-index:2147482998;background:#08101F;overflow:auto;'
  + 'font-family:"Plus Jakarta Sans",system-ui,sans-serif;color:#F4EFE8}'
  + '.lpov .lp-wrap{max-width:900px;margin:0 auto;padding:44px 20px 60px;text-align:center}'
  + '.lpov h2{font-size:clamp(24px,5vw,34px);font-weight:800;letter-spacing:-.02em;margin:10px 0 4px;color:#fff}'
  + '.lpov .lp-sub{font-size:15px;color:#C8D2DA;margin:0 0 30px}'
  + '.lpov .lp-eyebrow{font-family:"DM Sans",system-ui,sans-serif;font-size:11px;font-weight:700;'
  + 'letter-spacing:.18em;text-transform:uppercase;color:#CFA95F;margin:0}'
  + '.lpov .lp-deck{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;max-width:640px;margin:0 auto}'
  + '@media (max-width:430px){.lpov .lp-deck{grid-template-columns:1fr}}'
  + '.lpov .lp-door{background:#fff;color:#08101F;border:0;border-radius:18px;padding:20px 16px 18px;'
  + 'text-align:center;text-decoration:none;display:block;cursor:pointer;font-family:inherit;'
  + 'box-shadow:0 14px 34px -12px rgba(0,0,0,.6);transition:transform .18s ease,box-shadow .18s ease}'
  + '.lpov .lp-door:hover{transform:translateY(-4px);box-shadow:0 22px 44px -14px rgba(0,0,0,.7)}'
  + '@media (prefers-reduced-motion:reduce){.lpov .lp-door{transition:none}.lpov .lp-door:hover{transform:none}}'
  + '.lpov .lp-ic{width:52px;height:52px;border-radius:15px;margin:0 auto 11px;display:flex;align-items:center;justify-content:center}'
  + '.lpov .lp-ic svg{width:26px;height:26px;color:#fff}'
  + '.lpov .ic-gold{background:linear-gradient(135deg,#B8924A,#8a6a2e)}'
  + '.lpov .ic-terra{background:linear-gradient(135deg,#C2734D,#8a4526)}'
  + '.lpov .ic-navy{background:linear-gradient(135deg,#1E2A47,#08101F)}'
  + '.lpov .ic-blue{background:linear-gradient(135deg,#33507e,#1E2A47)}'
  + '.lpov .lp-door b{display:block;font-size:17px;font-weight:800;color:#08101F}'
  + '.lpov .lp-door span{display:block;font-size:12.5px;color:#2A3949;margin-top:3px}'
  + '.lpov .lp-panel{display:none}'
  + '.lpov .lp-panel.on{display:block}'
  + '.lpov .lp-backrow{margin:0 0 16px;text-align:left}'
  + '.lpov .lp-ghost{background:none;border:1.5px solid rgba(244,239,232,.45);color:#F4EFE8;cursor:pointer;'
  + 'font-family:inherit;font-weight:700;font-size:13.5px;border-radius:999px;padding:8px 16px}'
  + '.lpov .lp-ghost:hover{border-color:#CFA95F;color:#fff}'
  + '.lpov .lp-calrow{margin-top:20px;text-align:center}'
  + '.lpov .lp-calrow{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}'
  + '.lpov a.lp-ghost{display:inline-block;text-decoration:none;line-height:1.4}'
  + '.lpov .lp-disc{margin-top:14px;display:flex;flex-direction:column;gap:12px;align-items:center}'
  + '.lpov .lp-dlbl{font-size:12.5px;font-weight:700;color:#C8D2DA}'
  + '.lpov .lp-drow{display:flex;flex-wrap:wrap;gap:18px;justify-content:center;align-items:flex-start}'
  + '.lpov .lp-dcard{display:flex;flex-direction:column;align-items:center;gap:9px}'
  + '.lpov .lp-disc a{display:inline-block;background:none;border:1.5px solid rgba(244,239,232,.45);color:#F4EFE8;'
  + 'text-decoration:none;font-weight:700;font-size:13px;border-radius:999px;padding:7px 14px}'
  + '.lpov .lp-disc a:hover{border-color:#CFA95F;color:#fff}'
  + '.lpov .lp-dqr{background:#fff;border-radius:10px;padding:7px;line-height:0}'
  + '.lpov .lp-dqr svg{width:96px;height:96px;display:block}'
  + '.lpov .lp-subdeck{display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:14px}'
  + '.lpov .lp-subdeck .lp-door{padding:15px 13px}'
  + '.lpov .lp-subdeck .lp-ic{width:42px;height:42px;border-radius:12px;margin-bottom:8px}'
  + '.lpov .lp-subdeck .lp-ic svg{width:21px;height:21px}'
  + '.lpov .lp-subdeck .lp-door b{font-size:15px}'
  + '.lpov .lp-boost{grid-column:1/-1;display:flex;align-items:center;gap:14px;text-align:left;'
  + 'background:linear-gradient(135deg,#DCB45C,#B8924A);padding:16px 20px}'
  + '.lpov .lp-boost .lp-ic{margin:0;flex:none}'
  + '.lpov .lp-boost .lp-bt{display:block}'
  + '.lpov .lp-boost b{color:#08101F}'
  + '.lpov .lp-boost .lp-bt span{color:rgba(8,16,31,.78)}'
  + '.lpov .lp-news{grid-column:1/-1;display:flex;align-items:center;gap:14px;text-align:left;'
  + 'background:linear-gradient(135deg,#C2734D,#8a4526);padding:16px 20px;position:relative;width:100%}'
  + '.lpov .lp-news b{color:#fff}'
  + '.lpov .lp-news .lp-bt{display:block}'
  + '.lpov .lp-news .lp-bt span{color:rgba(255,255,255,.88)}'
  + '.lpov .lp-news .lp-ic{margin:0;flex:none;background:rgba(8,16,31,.35)}'
  + '.lpov .lp-abadge{position:absolute;top:-9px;right:-9px;background:#DCB45C;color:#08101F;font-weight:800;'
  + 'border-radius:999px;min-width:26px;height:26px;display:flex;align-items:center;justify-content:center;'
  + 'font-size:13px;padding:0 8px;box-shadow:0 4px 10px rgba(0,0,0,.4);border:2px solid #08101F}'
  + '.lpov .lp-ann a.ai{display:block;text-decoration:none;color:inherit}'
  + '.lpov .lp-ann a.ai:hover .at,.lpov .lp-ann a.ai:focus-visible .at{color:#8a4526}'
  + '.lpov .lp-ann{background:#fff;color:#08101F;border-radius:16px;padding:18px 18px 14px;text-align:left;'
  + 'box-shadow:0 14px 34px -12px rgba(0,0,0,.6);margin:26px auto 0;max-width:640px}'
  + '.lpov .lp-ann h2{font-size:16px;font-weight:800;margin:0;color:#08101F}'
  + '.lpov .lp-ann .asub{font-family:"DM Sans",system-ui,sans-serif;font-size:10.5px;font-weight:700;'
  + 'letter-spacing:.14em;text-transform:uppercase;color:#8a4526;margin:2px 0 4px}'
  + '.lpov .lp-ann .ai{border-top:1px solid rgba(30,61,76,.14);padding:11px 0 10px}'
  + '.lpov .lp-ann .ai:first-of-type{border-top:0}'
  + '.lpov .lp-ann .ad{font-family:"DM Sans",system-ui,sans-serif;font-size:10.5px;font-weight:700;'
  + 'letter-spacing:.1em;text-transform:uppercase;color:#2A3949}'
  + '.lpov .lp-ann .anew{display:inline-block;background:#B8924A;color:#fff;border-radius:999px;'
  + 'font-size:9.5px;font-weight:700;padding:2px 8px;margin-left:6px;vertical-align:1px}'
  + '.lpov .lp-ann .at{font-weight:800;font-size:14.5px;margin:3px 0 3px;color:#08101F}'
  + '.lpov .lp-ann .ab{font-size:13px;color:#2A3949;margin:0}'
  + '.lpov .lp-ann .al{display:inline-block;font-weight:700;font-size:12.5px;color:#8a4526;'
  + 'text-decoration:none;margin-top:5px}'
  + '.lpov .lp-ann .al:hover{text-decoration:underline}'
  + '.lpov .lp-ann .anote{font-family:"DM Sans",system-ui,sans-serif;font-size:10.5px;color:#2A3949;'
  + 'margin:10px 0 0;border-top:1px solid rgba(30,61,76,.14);padding-top:9px}'
  + '@media(min-width:1060px){.lpov .lp-wrap{display:grid;grid-template-columns:minmax(0,1fr) 300px;'
  + 'column-gap:30px;max-width:1200px;align-items:start}'
  + '.lpov .lp-wrap>*{grid-column:1}'
  + '.lpov .lp-wrap>.lp-ann{grid-column:2;grid-row:1/span 30;margin:40px 0 0;max-width:none}}'
  + '.lpov a:focus-visible,.lpov button:focus-visible{outline:3px solid #CFA95F;outline-offset:3px;border-radius:8px}'
  + '@media print{.lpov{display:none}}';

  function ic(cls, path) {
    return '<span class="lp-ic ' + cls + '" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + path + '</svg></span>';
  }
  var I = {
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    mega: '<path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    people: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    flask: '<path d="M10 2v7.5L4.5 19a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 9.5V2"/><path d="M8 2h8"/>',
    bulb: '<path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.2-2.6 5.6-.8.8-1.4 1.9-1.4 3v.4H9v-.4c0-1.1-.6-2.2-1.4-3C6.2 13.2 5 11.4 5 9a7 7 0 0 1 7-7z"/><path d="M9 21h6"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    grid: '<path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    video: '<rect x="2" y="6" width="13" height="12" rx="2"/><path d="M15 10.5l6-3.5v10l-6-3.5z"/><path d="M7 9.5l3.5 2.5L7 14.5z"/>',
    play: '<polygon points="10 8 16 12 10 16 10 8"/><rect x="3" y="4" width="18" height="16" rx="2"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    check: '<path d="M9 11l3 3 8-8"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    loop: '<path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/>',
    scope: '<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',
    brain: '<path d="M12 2a4 4 0 0 1 4 4c2 0 4 2 4 4s-1 3-2 4c1 1 1 3 0 4a4 4 0 0 1-4 4 4 4 0 0 1-4-2 4 4 0 0 1-4 2 4 4 0 0 1-4-4c-1-1-1-3 0-4-1-1-2-2-2-4s2-4 4-4a4 4 0 0 1 4-4z"/>',
    cards: '<rect x="3" y="6" width="14" height="12" rx="2"/><path d="M7 6V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"/>',
    flow: '<path d="M12 3v4M12 11v4M12 19v2"/><rect x="8" y="7" width="8" height="4" rx="1"/><rect x="8" y="15" width="8" height="4" rx="1"/>'
  };
  function door(cls, icon, title, sub, attrs) {
    var tag = /href=/.test(attrs) ? 'a' : 'button';
    return '<' + tag + ' class="lp-door" ' + attrs + '>' + ic(cls, icon)
      + '<b>' + title + '</b><span>' + sub + '</span></' + tag + '>';
  }

  var sec = null;
  try {
    var m = window.location.search.match(/[?&]sec=(mw|tr-am|tr-eve)/);
    sec = m ? m[1] : (localStorage.getItem('bio004-section') || null);
  } catch (e) {}
  function u(page) {
    var bits = page.split('#');
    var base = bits[0];
    if (sec) base += (base.indexOf('?') > -1 ? '&' : '?') + 'sec=' + sec;
    return base + (bits[1] ? '#' + bits[1] : '');
  }
  function go(page) { return 'href="' + u(page) + '" target="_top"'; }

  /* The calendar row used to be a single button that only closed the
     curtain, which is right on the calendar page and wrong on every other
     page that loads this file: on the Canvas front door, "Go to the
     calendar" dropped the student on the front door instead. So the button
     is a real link anywhere the calendar is not already behind the curtain,
     and those pages also get a way out that says what it does, since the
     calendar button used to be the only one. */
  var here = (window.location.pathname.split('/').pop() || '').toLowerCase();
  var ON_CALENDAR = here === 'bio004-course-calendar.html' || here === '';
  function calRow() {
    if (ON_CALENDAR) {
      return '<button class="lp-ghost" data-lpclose="1">Go to the calendar &#8594;</button>';
    }
    return '<a class="lp-ghost" ' + go('bio004-course-calendar.html?nolaunch=1') + '>Go to the calendar &#8594;</a>'
         + '<button class="lp-ghost lp-stay" data-lpclose="1">Close this and stay here</button>';
  }

  function ext(url) { return 'href="' + url + '" target="_blank" rel="noopener"'; }

  var ov = document.createElement('div');
  ov.className = 'lpov';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.setAttribute('aria-label', 'Where are you headed?');
  ov.innerHTML = '<div class="lp-wrap">'
    + '<p class="lp-eyebrow">BIO 004 &middot; Human Anatomy &middot; Fall 2026</p>'
    + '<h2>Where are you headed?</h2>'
    + '<p class="lp-sub">Four doors. Everything in the course is behind one of them.</p>'

    + '<div class="lp-panel on" data-lp="home"><div class="lp-deck">'
    + door('ic-terra', I.book, 'Lecture', 'Notes, videos, pre-work, course materials', 'data-lpopen="lecture"')
    + door('ic-navy', I.flask, 'Lab', 'Loops, lab sprints, the Digital Atlas', 'data-lpopen="lab"')
    + door('ic-gold', I.bulb, 'Study', 'Mastery OS, recall cards, loops, brain dump', 'data-lpopen="study"')
    + door('ic-blue', I.flow, 'Study Protocol', 'The flow chart for this week', go('bio004-study-protocol.html'))
    + '<a class="lp-door lp-boost" ' + go('bio004-blog.html') + '>' + ic('ic-navy', I.heart)
    + '<span class="lp-bt"><b>Need motivation?</b><span>Short reads for hard weeks, from Dr. Rennie</span></span></a>'
    + '<button class="lp-door lp-news" data-lpopen="news" id="lpNewsDoor">' + ic('', I.mega)
    + '<span class="lp-bt"><b>Weekly announcements</b><span>What you missed, in one place</span></span>'
    + '<span class="lp-abadge" id="lpAnnBadge" hidden aria-hidden="true"></span></button>'
    + '</div>'
    + '<div class="lp-calrow">' + calRow() + '</div>'
    + '<div class="lp-disc" id="lpDisc"></div>'
    + '</div>'

    + '<div class="lp-panel" data-lp="lecture">'
    + '<div class="lp-backrow"><button class="lp-ghost" data-lpback="1">&#8592; Back to the four doors</button></div>'
    + '<div class="lp-subdeck">'
    + door('ic-terra', I.grid, 'Course materials', 'Everything, organized by module', go('course-materials.html'))
    + door('ic-gold', I.play, 'Videos', 'Just the videos, by module', go('bio004-quick-access.html?cat=videos'))
    + door('ic-navy', I.pen, 'Notes', 'Just the notes, by module', go('bio004-quick-access.html?cat=notes'))
    + door('ic-blue', I.check, 'Pre-work', 'Just what is due before class', go('bio004-quick-access.html?cat=prework'))
    + '</div></div>'

    + '<div class="lp-panel" data-lp="lab">'
    + '<div class="lp-backrow"><button class="lp-ghost" data-lpback="1">&#8592; Back to the four doors</button></div>'
    + '<div class="lp-subdeck">'
    + door('ic-terra', I.loop, 'Loops', 'Fast visual practice', ext('https://drsrennie-stack.github.io/loops/'))
    + door('ic-navy', I.clock, 'Lab sprints', 'Structure checklists by station', go('lab-sprints.html'))
    /* Articulate refuses to be framed (X-Frame-Options), so the Atlas
       opens in its own tab and the course tab stays behind it. */
    + door('ic-gold', I.globe, 'Digital Atlas', 'Opens in its own tab', ext('https://claude.ai/artifact/88nmVMHdWVZGXf3ShnSURo'))
    + door('ic-blue', I.scope, 'Histology help', 'Every slide tool, sorted', go('histology-help.html'))
    + door('ic-gold', I.grid, 'Tissue Chart', 'The chart behind reveal boxes', go('bio004-tissue-chart-practice.html'))
    + door('ic-navy', I.video, 'Cadaver videos', 'U of Michigan, by body system', go('bio004-bluelink-videos.html'))
    + '</div></div>'

    + '<div class="lp-panel" data-lp="study">'
    + '<div class="lp-backrow"><button class="lp-ghost" data-lpback="1">&#8592; Back to the four doors</button></div>'
    + '<div class="lp-subdeck">'
    + door('ic-gold', I.brain, 'Mastery OS', 'Your plan, dials, and session', go('mastery-os-fall-2026.html'))
    + door('ic-blue', I.cards, 'Recall cards', 'Straight into what is due', go('mastery-os-fall-2026.html#s-recall'))
    + door('ic-terra', I.loop, 'Loops', 'Fast visual practice, any topic', ext('https://drsrennie-stack.github.io/loops/'))
    + door('ic-navy', I.pen, 'Brain dump', 'Blank page, timer, check yourself', go('brain-dump-practice.html'))
    + door('ic-gold', I.flow, 'Study Protocol', 'The flow chart for this week', go('bio004-study-protocol.html'))
    + door('ic-blue', I.grid, 'Tissue Chart', 'Recall it column by column', go('bio004-tissue-chart-practice.html'))
    + door('ic-terra', I.target, 'Exam Builder', 'Fresh practice exam, any time', go('bio004-practice-exam-builder.html'))
    + door('ic-gold', I.people, 'Study With Me', 'See the calendar, join a session or host one', go('study-session-signup.html'))
    + '</div></div>'

    + '<div class="lp-panel" data-lp="news">'
    + '<div class="lp-backrow"><button class="lp-ghost" data-lpback="1">&#8592; Back to the four doors</button></div>'
    + '<div class="lp-ann" id="lpNewsList" style="margin-top:0"></div>'
    + '</div>'

    + '</div>';

  /* class Discord servers, one per section; the picked section wins */
  var DISCORD = {
    'mw':     { label: '80650 &middot; MW 12:30 to 4:50', url: 'https://discord.gg/8kr8b27ePE', qr: '<svg viewBox="0 0 33 33" class="segno"><path class="qrline" stroke="#0b1530" d="M2 2.5h7m1 0h2m1 0h3m2 0h1m5 0h7m-29 1h1m5 0h1m2 0h2m2 0h3m4 0h1m1 0h1m5 0h1m-29 1h1m1 0h3m1 0h1m1 0h1m1 0h1m1 0h2m2 0h2m2 0h1m1 0h1m1 0h3m1 0h1m-29 1h1m1 0h3m1 0h1m1 0h1m1 0h2m3 0h1m2 0h3m1 0h1m1 0h3m1 0h1m-29 1h1m1 0h3m1 0h1m2 0h3m1 0h2m3 0h1m3 0h1m1 0h3m1 0h1m-29 1h1m5 0h1m1 0h2m1 0h1m2 0h2m3 0h1m2 0h1m5 0h1m-29 1h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7m-21 1h2m1 0h4m2 0h1m-17 1h1m1 0h1m1 0h4m1 0h1m2 0h2m1 0h2m1 0h1m1 0h3m1 0h2m1 0h1m-29 1h2m1 0h1m3 0h1m1 0h3m3 0h1m1 0h1m2 0h1m1 0h2m4 0h1m-28 1h1m1 0h1m2 0h2m1 0h1m3 0h1m3 0h3m2 0h1m4 0h1m-28 1h2m1 0h1m1 0h1m4 0h1m1 0h1m5 0h1m2 0h2m2 0h3m-27 1h1m2 0h5m1 0h1m5 0h2m2 0h1m1 0h2m-23 1h1m3 0h1m1 0h3m2 0h2m3 0h1m1 0h3m1 0h1m1 0h1m1 0h1m-28 1h1m1 0h1m3 0h6m1 0h2m1 0h2m9 0h2m-29 1h1m4 0h1m1 0h2m1 0h1m1 0h1m1 0h1m2 0h5m1 0h1m4 0h1m-29 1h1m1 0h1m2 0h2m2 0h1m2 0h3m1 0h1m1 0h2m1 0h1m1 0h1m3 0h1m-27 1h5m3 0h1m2 0h1m2 0h1m1 0h1m2 0h4m3 0h2m-29 1h1m1 0h1m2 0h2m2 0h2m1 0h1m4 0h1m2 0h2m1 0h1m1 0h1m1 0h2m-20 1h1m2 0h8m3 0h2m3 0h1m-29 1h1m3 0h1m1 0h5m1 0h1m3 0h1m3 0h8m-20 1h1m2 0h2m4 0h4m3 0h1m2 0h2m-29 1h7m1 0h1m4 0h1m4 0h1m1 0h1m1 0h1m1 0h4m-28 1h1m5 0h1m1 0h1m1 0h2m1 0h4m3 0h1m3 0h1m1 0h3m-29 1h1m1 0h3m1 0h1m2 0h5m2 0h1m1 0h1m1 0h6m1 0h1m-28 1h1m1 0h3m1 0h1m1 0h2m2 0h1m2 0h1m1 0h1m1 0h4m1 0h1m1 0h1m1 0h1m-29 1h1m1 0h3m1 0h1m2 0h3m3 0h2m1 0h3m3 0h1m3 0h1m-29 1h1m5 0h1m1 0h3m1 0h1m3 0h2m2 0h2m1 0h1m3 0h1m-28 1h7m2 0h3m2 0h2m1 0h1m1 0h2m1 0h1m1 0h2m1 0h1"/></svg>' },
    'tr-am':  { label: '80654 &middot; TR 9:30 to 1:50',  url: 'https://discord.gg/XxhERvqf3N', qr: '<svg viewBox="0 0 33 33" class="segno"><path class="qrline" stroke="#0b1530" d="M2 2.5h7m2 0h1m2 0h1m1 0h2m4 0h1m1 0h7m-29 1h1m5 0h1m9 0h5m1 0h1m5 0h1m-29 1h1m1 0h3m1 0h1m1 0h3m2 0h1m1 0h1m1 0h4m1 0h1m1 0h3m1 0h1m-29 1h1m1 0h3m1 0h1m6 0h1m1 0h2m1 0h1m1 0h1m1 0h1m1 0h3m1 0h1m-29 1h1m1 0h3m1 0h1m1 0h1m1 0h2m1 0h2m3 0h1m3 0h1m1 0h3m1 0h1m-29 1h1m5 0h1m1 0h1m1 0h3m1 0h1m2 0h3m2 0h1m5 0h1m-29 1h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7m-19 1h3m1 0h1m2 0h2m-18 1h1m2 0h1m1 0h1m1 0h2m1 0h2m1 0h1m5 0h2m1 0h2m1 0h1m-24 1h1m1 0h1m1 0h1m7 0h2m1 0h1m4 0h2m1 0h3m-29 1h1m1 0h1m1 0h3m1 0h1m1 0h2m2 0h1m5 0h2m1 0h1m1 0h2m1 0h1m-29 1h1m1 0h3m3 0h1m2 0h1m1 0h2m1 0h3m2 0h1m1 0h2m2 0h2m-24 1h2m1 0h1m2 0h1m1 0h1m1 0h1m1 0h1m1 0h2m2 0h1m1 0h1m2 0h1m-29 1h1m1 0h3m4 0h3m1 0h6m3 0h1m1 0h1m1 0h1m1 0h1m-28 1h3m1 0h12m1 0h1m3 0h1m1 0h1m3 0h1m-28 1h1m2 0h1m3 0h1m1 0h1m1 0h1m1 0h1m1 0h2m2 0h1m1 0h2m1 0h1m-26 1h3m2 0h2m5 0h3m1 0h1m1 0h2m1 0h1m5 0h1m-28 1h1m3 0h1m5 0h1m1 0h1m1 0h1m2 0h2m2 0h1m1 0h2m3 0h1m-26 1h1m2 0h1m3 0h2m2 0h2m2 0h1m4 0h1m1 0h2m1 0h1m-22 1h1m1 0h1m1 0h10m2 0h3m2 0h1m-29 1h3m2 0h3m1 0h1m2 0h3m2 0h1m1 0h6m1 0h3m-21 1h2m4 0h2m3 0h2m3 0h1m1 0h1m1 0h1m-29 1h7m3 0h4m1 0h3m1 0h2m1 0h1m1 0h1m3 0h1m-29 1h1m5 0h1m6 0h1m1 0h1m1 0h1m1 0h2m3 0h2m1 0h1m-28 1h1m1 0h3m1 0h1m1 0h4m1 0h2m3 0h7m2 0h2m-29 1h1m1 0h3m1 0h1m3 0h2m1 0h1m2 0h1m1 0h1m4 0h1m1 0h1m1 0h1m-28 1h1m1 0h3m1 0h1m3 0h1m1 0h1m3 0h1m2 0h3m5 0h2m-29 1h1m5 0h1m1 0h2m3 0h1m3 0h1m1 0h5m1 0h1m1 0h2m-29 1h7m2 0h2m3 0h2m1 0h1m2 0h1m1 0h1m1 0h1m2 0h1"/></svg>' },
    'tr-eve': { label: '80655 &middot; TR 5:30 to 9:50',  url: 'https://discord.gg/7Z2k7DePJ6', qr: '<svg viewBox="0 0 33 33" class="segno"><path class="qrline" stroke="#0b1530" d="M2 2.5h7m2 0h1m1 0h1m4 0h1m1 0h2m2 0h7m-29 1h1m5 0h1m4 0h1m3 0h1m1 0h4m1 0h1m5 0h1m-29 1h1m1 0h3m1 0h1m1 0h3m2 0h1m1 0h1m1 0h2m3 0h1m1 0h3m1 0h1m-29 1h1m1 0h3m1 0h1m4 0h1m1 0h1m1 0h2m1 0h1m1 0h1m1 0h1m1 0h3m1 0h1m-29 1h1m1 0h3m1 0h1m1 0h4m1 0h2m2 0h2m3 0h1m1 0h3m1 0h1m-29 1h1m5 0h1m1 0h1m1 0h3m4 0h3m2 0h1m5 0h1m-29 1h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7m-19 1h4m3 0h1m-17 1h1m2 0h1m1 0h1m1 0h2m1 0h1m2 0h1m2 0h2m2 0h1m1 0h2m1 0h1m-25 1h2m1 0h1m1 0h2m6 0h2m2 0h1m2 0h3m1 0h3m-29 1h1m3 0h3m1 0h1m1 0h1m1 0h1m1 0h2m4 0h2m1 0h4m1 0h1m-29 1h1m1 0h1m1 0h1m3 0h1m2 0h1m1 0h2m1 0h3m1 0h2m1 0h1m3 0h2m-27 1h1m2 0h4m4 0h1m3 0h1m1 0h2m2 0h1m1 0h1m2 0h1m-27 1h3m4 0h3m1 0h4m1 0h1m3 0h1m1 0h1m1 0h1m1 0h1m-28 1h3m2 0h3m2 0h6m1 0h1m2 0h1m2 0h1m3 0h1m-25 1h2m2 0h2m2 0h3m1 0h2m2 0h1m2 0h1m1 0h1m-26 1h1m1 0h1m3 0h1m3 0h1m1 0h1m3 0h1m1 0h3m2 0h1m3 0h1m-28 1h2m2 0h2m1 0h2m3 0h1m1 0h1m2 0h2m2 0h2m1 0h1m3 0h1m-27 1h2m2 0h1m3 0h1m3 0h2m2 0h1m4 0h4m1 0h1m-27 1h1m4 0h3m3 0h6m1 0h1m2 0h2m3 0h1m-29 1h3m2 0h3m1 0h1m1 0h4m2 0h1m1 0h6m2 0h2m-21 1h2m3 0h3m3 0h2m3 0h1m1 0h1m1 0h1m-29 1h7m2 0h4m1 0h4m1 0h2m1 0h1m1 0h1m3 0h1m-29 1h1m5 0h1m3 0h1m2 0h3m1 0h1m1 0h2m3 0h2m1 0h1m-28 1h1m1 0h3m1 0h1m1 0h2m1 0h1m1 0h2m3 0h7m2 0h2m-29 1h1m1 0h3m1 0h1m3 0h1m2 0h2m1 0h1m1 0h1m4 0h1m2 0h2m-28 1h1m1 0h3m1 0h1m3 0h1m5 0h1m2 0h3m3 0h4m-29 1h1m5 0h1m1 0h2m1 0h1m1 0h1m3 0h1m4 0h2m1 0h1m1 0h2m-29 1h7m2 0h2m3 0h2m1 0h1m2 0h3m1 0h1m1 0h2"/></svg>' }
  };
  (function () {
    var el = ov.querySelector('#lpDisc');
    if (!el) return;
    function dcard(d, text) {
      return '<span class="lp-dcard"><a href="' + d.url + '" target="_blank" rel="noopener">' + text + '</a>'
        + '<span class="lp-dqr" aria-hidden="true">' + d.qr + '</span></span>';
    }
    if (sec && DISCORD[sec]) {
      el.innerHTML = '<span class="lp-dlbl">Your class Discord, click or scan:</span><span class="lp-drow">'
        + dcard(DISCORD[sec], 'Join ' + DISCORD[sec].label + ' &#8594;') + '</span>';
    } else {
      el.innerHTML = '<span class="lp-dlbl">Class Discord, click yours or scan it:</span><span class="lp-drow">'
        + dcard(DISCORD['mw'], DISCORD['mw'].label)
        + dcard(DISCORD['tr-am'], DISCORD['tr-am'].label)
        + dcard(DISCORD['tr-eve'], DISCORD['tr-eve'].label) + '</span>';
    }
  })();

  /* announcements column: bio004-announcements.js is loaded on demand so
     every page that carries the overlay shows the same list */
  (function () {
    var tag = document.createElement('script');
    tag.src = 'bio004-announcements.js';
    tag.onload = function () {
      var A = window.BIO004_ANNOUNCEMENTS;
      if (!A || !A.length) return;
      var wrap = ov.querySelector('.lp-wrap');
      if (!wrap) return;
      var aesc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
      var MO = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var now = new Date(); now.setHours(0, 0, 0, 0);
      var sorted = A.slice().sort(function (a, b) { return a.date === b.date ? 0 : (a.date < b.date ? 1 : -1); });
      var itemHTML = function (a) {
        var d = new Date(a.date + 'T00:00:00');
        var isNew = (now - d) <= 7 * 864e5;
        var ext = /^https?:/i.test(a.link || '');
        var inner = '<span class="ad">' + MO[d.getMonth()] + ' ' + d.getDate() + '</span>'
          + (isNew ? '<span class="anew">NEW</span>' : '')
          + '<div class="at">' + aesc(a.title) + '</div>'
          + '<p class="ab">' + aesc(a.body) + '</p>'
          + (a.link ? '<span class="al">' + aesc(a.linkLabel || 'Read it') + ' &#8594;</span>' : '');
        return a.link
          ? '<a class="ai" href="' + aesc(a.link) + '"' + (ext ? ' target="_blank" rel="noopener"' : ' target="_top"') + '>' + inner + '</a>'
          : '<div class="ai">' + inner + '</div>';
      };
      var head = '<div class="asub">From Dr. Rennie</div><h2>Announcements</h2>';
      var note = '<p class="anote">Announcements also go out by email through Canvas.</p>';
      var el = document.createElement('aside');
      el.className = 'lp-ann';
      el.setAttribute('aria-label', 'Announcements');
      el.innerHTML = head + sorted.slice(0, 5).map(itemHTML).join('') + note;
      wrap.appendChild(el);
      var newsList = ov.querySelector('#lpNewsList');
      if (newsList) newsList.innerHTML = head + sorted.slice(0, 15).map(itemHTML).join('') + note;

      /* unread badge on the Weekly announcements door */
      var badge = ov.querySelector('#lpAnnBadge');
      var newsDoor = ov.querySelector('#lpNewsDoor');
      var readDate = '';
      try { readDate = localStorage.getItem('bio004-ann-read') || ''; } catch (e) {}
      var unread = A.filter(function (a) { return a.date > readDate; }).length;
      if (badge && unread > 0) {
        badge.hidden = false;
        badge.textContent = unread > 9 ? '9+' : unread;
        if (newsDoor) newsDoor.setAttribute('aria-label', 'Weekly announcements, ' + unread + ' unread');
      }
      var markRead = function () {
        var mx = A.reduce(function (m, a) { return a.date > m ? a.date : m; }, '');
        try { localStorage.setItem('bio004-ann-read', mx); } catch (e) {}
        if (badge) badge.hidden = true;
        if (newsDoor) newsDoor.setAttribute('aria-label', 'Weekly announcements');
      };
      ov.addEventListener('click', function (e) {
        if (e.target.closest('[data-lpopen="news"]')) markRead();
      });
      /* on a wide screen the column is in plain sight, so it counts as read */
      if (window.matchMedia && matchMedia('(min-width:1060px)').matches) markRead();
    };
    document.head.appendChild(tag);
  })();

  function boot() {
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
    document.body.appendChild(ov);
    var prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    var lastFocus = document.activeElement;

    function show(key) {
      ov.querySelectorAll('.lp-panel').forEach(function (p) {
        p.classList.toggle('on', p.getAttribute('data-lp') === key);
      });
      /* the news panel IS the announcements list, so the side column
         steps aside while it is open to avoid showing the list twice */
      var ann = ov.querySelector('.lp-ann');
      if (ann) ann.style.display = (key === 'news') ? 'none' : '';
      var f = ov.querySelector('.lp-panel.on .lp-door, .lp-panel.on button');
      if (f) f.focus();
    }
    function close() {
      ov.parentNode.removeChild(ov);
      document.body.style.overflow = prevOverflow;
      if (lastFocus && lastFocus.focus) lastFocus.focus();
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    ov.addEventListener('click', function (e) {
      var o = e.target.closest('[data-lpopen]');
      if (o) { show(o.getAttribute('data-lpopen')); return; }
      if (e.target.closest('[data-lpback]')) { show('home'); return; }
      if (e.target.closest('[data-lpclose]')) close();
    });
    document.addEventListener('keydown', onKey);
    var f0 = ov.querySelector('.lp-door');
    if (f0) f0.focus();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
