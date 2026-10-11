/* ============================================================
   BIO 004 Human Anatomy, Fall 2026
   bio004-faculty-dock.js

   THE FACULTY TOOLS BUTTON. The faculty twin of the student
   "Course tools" dock: a floating pill on every faculty page that
   opens the full set of faculty tools, arranged by where the work
   happens: Lecture, Lab, Grades and attendance, Teams and TBL,
   and the student view.

   This file is ALSO the single source of truth for the tool list.
   faculty.html (the Faculty Hub) reads window.BIO004_FACULTY_TOOLS
   from here, so adding a tool below adds it to the hub AND to the
   pop-up on every wired page at once.

   The pill sits bottom RIGHT, because three faculty pages carry
   the student dock bottom left. It skips faculty.html itself (the
   hub IS the list) and hides in the night slide's Present mode.
   Opt out per page with data-no-faculty-dock on <body>.
   ============================================================ */
(function () {
  'use strict';

  var TOOLS = window.BIO004_FACULTY_TOOLS = {
    groups: [
      { label: 'Lecture', apps: [
        { name: 'Course Page', sub: 'follows your class pick', href: 'SECTION', icon: 'home', color: 'gold' },
        { name: 'Day One Run Sheet', sub: 'setup + run of show', href: 'day-one-run-sheet.html', icon: 'sheet', color: 'terra' },
        { name: 'Intro Slides', sub: 'day one deck', href: 'slides-course-introduction.html', icon: 'slides', color: 'teal' },
        { name: 'Brain Dump Selector', sub: 'spin, present, clock', href: 'bio004-braindump-selector-fall2026.html', icon: 'wheel', color: 'terra' },
        { name: 'Brain Dump Bank', sub: 'the master list', href: 'bio004-braindump-bank-fall2026.html', icon: 'bank', color: 'teal' },
        { name: 'Course Calendar', sub: 'all three sections', href: 'bio004-course-calendar.html', icon: 'calendar', color: 'light' },
      ]},
      { label: 'Lab', apps: [
        { name: 'Lab Question of the Night', sub: 'project it, spin the picker', href: 'bio004-lab-question-tonight.html', icon: 'night', color: 'gold' },
        { name: 'Lab Sprints', sub: 'structure checklists', href: 'lab-sprints.html', icon: 'clock', color: 'terra' },
        { name: 'Histology Help', sub: 'every slide tool', href: 'histology-help.html', icon: 'scope', color: 'teal' },
        { name: 'Tissue Chart Practice', sub: 'the reveal-box chart', href: 'bio004-tissue-chart-practice.html', icon: 'gridic', color: 'gold' },
        { name: 'Digital Atlas', sub: 'opens in its own tab', href: 'https://claude.ai/artifact/88nmVMHdWVZGXf3ShnSURo', icon: 'globe', color: 'light' },
      ]},
      { label: 'Grades and attendance', apps: [
        /* Course Engine is THE attendance tool (her words, Aug 23):
           attendance, teams and roster in one app. attendance-engine.html
           still exists in the repo but is not the one she runs. */
        { name: 'Course Engine', sub: 'attendance, teams, roster', href: 'Course_Engine.html', icon: 'clipboard', color: 'gold' },
        { name: 'Attendance Engine', sub: 'links to Course Engine', href: 'attendance-engine.html', icon: 'clipboard', color: 'terra' },
        { name: 'Grade Engine', sub: 'weighted gradebook', href: 'grade-engine.html', icon: 'calc', color: 'teal' },
        { name: 'Grade Calculator', sub: 'the student one', href: 'grade-calculator.html', icon: 'calc', color: 'light' },
      ]},
      { label: 'Teams and TBL', apps: [
        { name: 'Team Formation Engine', sub: 'quick deal or survey', href: 'team-engine.html', icon: 'users', color: 'terra' },
        { name: 'Team Survey Setup', sub: 'form, QRs, paper copy', href: 'team-survey-setup.html', icon: 'sheet', color: 'gold' },
        { name: 'Team Survey (student)', sub: 'what they see', href: 'team-survey.html', icon: 'clipboard', color: 'light' },
        { name: 'Team Formation Plan', sub: 'methods + survey', href: 'team-formation-plan.html', icon: 'sheet', color: 'teal' },
        { name: 'TBL Teams', sub: 'rosters and parks', href: 'tbl-team.html', icon: 'flag', color: 'terra' },
        { name: 'Charter Worksheet', sub: 'print for day one', href: 'bio004-team-charter-worksheet.html', icon: 'sheet', color: 'gold' },
      ]},
      { label: 'Student view', apps: [
        { name: 'Welcome / Start Here', sub: 'the front door', href: 'welcome.html', icon: 'door', color: 'terra' },
        { name: 'Mastery OS', sub: 'the study app', href: 'mastery-os-fall-2026.html', icon: 'layers', color: 'gold' },
        { name: 'Mastery OS, instructor', sub: 'your side of it', href: 'mastery-os-fall-2026-instructor.html', icon: 'layers', color: 'teal' },
        { name: 'Tools and Links', sub: 'everything else', href: 'tools-and-links.html', icon: 'gridic', color: 'light' },
        { name: 'Section Chooser', sub: 'index.html', href: 'index.html', icon: 'switch', color: 'light' },
      ]},
    ],
    icons: {
      clipboard: '<rect x="6" y="5" width="20" height="24" rx="2" fill="none" stroke-width="2.4"/><rect x="11" y="3" width="10" height="5" rx="1.5" fill="none" stroke-width="2.2"/><path d="M11 15 l3 3 l7 -7" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
      sheet:   '<rect x="6" y="3" width="20" height="26" rx="2" fill="none" stroke-width="2.4"/><path d="M10 10 h12 M10 15 h12 M10 20 h12 M10 25 h7" stroke-width="2" stroke-linecap="round"/>',
      home:    '<path d="M4 13 L16 4 L28 13 M7 12 v13 h18 v-13" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
      wheel:   '<circle cx="16" cy="16" r="11" fill="none" stroke-width="2.4"/><circle cx="16" cy="16" r="2.5" fill="none" stroke-width="2.2"/><path d="M16 5 v6 M16 21 v6 M5 16 h6 M21 16 h6" stroke-width="2.2" stroke-linecap="round"/>',
      slides:  '<rect x="4" y="6" width="24" height="15" rx="2" fill="none" stroke-width="2.4"/><path d="M16 21 v5 M11 28 h10 M11 13 h7" stroke-width="2.2" stroke-linecap="round"/>',
      calendar:'<rect x="4" y="6" width="24" height="21" rx="2" fill="none" stroke-width="2.4"/><path d="M4 12 h24 M10 3 v6 M22 3 v6" stroke-width="2.2" stroke-linecap="round"/>',
      layers:  '<path d="M16 4 L28 10 L16 16 L4 10 Z M4 16 L16 22 L28 16 M4 22 L16 28 L28 22" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
      calc:    '<rect x="6" y="4" width="20" height="24" rx="2" fill="none" stroke-width="2.4"/><path d="M10 9 h12 M10 16 h3 M15 16 h3 M20 16 h2 M10 21 h3 M15 21 h3 M20 21 h2" stroke-width="2" stroke-linecap="round"/>',
      door:    '<path d="M12 4 h14 v24 h-14 M12 4 L5 7 v20 l7 3 Z" fill="none" stroke-width="2.2" stroke-linejoin="round"/><circle cx="9.5" cy="17" r="1.4" fill="currentColor" stroke="none"/>',
      gridic:  '<rect x="5" y="5" width="9" height="9" rx="2" fill="none" stroke-width="2.2"/><rect x="18" y="5" width="9" height="9" rx="2" fill="none" stroke-width="2.2"/><rect x="5" y="18" width="9" height="9" rx="2" fill="none" stroke-width="2.2"/><rect x="18" y="18" width="9" height="9" rx="2" fill="none" stroke-width="2.2"/>',
      bank:    '<path d="M5 12 L16 5 L27 12 M7 12 v11 M12 12 v11 M20 12 v11 M25 12 v11 M4 26 h24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
      users:   '<circle cx="11" cy="11" r="4.2" fill="none" stroke-width="2.2"/><path d="M3.5 26 c0-5 4-8 7.5-8 s7.5 3 7.5 8" fill="none" stroke-width="2.2" stroke-linecap="round"/><circle cx="23" cy="12" r="3.4" fill="none" stroke-width="2.2"/><path d="M21 18.5 c4.5 0 7.5 3 7.5 7" fill="none" stroke-width="2.2" stroke-linecap="round"/>',
      flag:    '<path d="M8 28 V5 M8 6 h16 l-4 5 l4 5 h-16" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
      switch:  '<path d="M9 8 h14 m0 0 l-4 -4 m4 4 l-4 4 M23 24 h-14 m0 0 l4 -4 m-4 4 l4 4" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
      night:   '<path d="M27 19 A11.5 11.5 0 1 1 13 4.5 A9.5 9.5 0 0 0 27 19 Z" fill="none" stroke-width="2.4" stroke-linejoin="round"/><path d="M21 8 l1.2 2.4 L24.6 11.6 l-2.4 1.2 L21 15.2 l-1.2-2.4 L17.4 11.6 l2.4-1.2 Z" fill="currentColor" stroke="none"/>',
      clock:   '<circle cx="16" cy="16" r="11" fill="none" stroke-width="2.4"/><path d="M16 9 v7 l5 4" fill="none" stroke-width="2.4" stroke-linecap="round"/>',
      scope:   '<path d="M9 24 h10 M5 29 h20 M18 29 a8.5 8.5 0 0 0 0-17 h-1.5" fill="none" stroke-width="2.2" stroke-linecap="round"/><path d="M12 19 a3 3 0 0 1-3-3 V9 h8 v7 a3 3 0 0 1-3 3 z M15 9 V5 a1.5 1.5 0 0 0-1.5-1.5 h-1 A1.5 1.5 0 0 0 11 5 v4" fill="none" stroke-width="2.2" stroke-linejoin="round"/>',
      globe:   '<circle cx="16" cy="16" r="11.5" fill="none" stroke-width="2.4"/><path d="M4.5 16 h23 M16 4.5 a17 17 0 0 1 0 23 a17 17 0 0 1 0-23" fill="none" stroke-width="2.2"/>',
    },
    sectionPage: { 'mw': 'class1.html', 'tr-am': 'class2.html', 'tr-eve': 'class3.html' }
  };

  /* ---------- the floating pill + the Course-tools-style panel.
     Not on the hub itself. ---------- */
  if (/(^|\/)faculty\.html$/.test(window.location.pathname)) return;

  /* Facts for the "today" strip, from the course calendar. */
  var TERM_START = new Date(2026, 7, 17); /* Monday of week 1 */
  var CLOSURES = {
    '2026-09-07': 'Labor Day, campus closed',
    '2026-10-13': 'Professional Development day, no class',
    '2026-11-11': 'Veterans Day, campus closed',
    '2026-11-25': 'Travel day, no class',
    '2026-11-26': 'Thanksgiving, campus closed',
    '2026-11-27': 'Thanksgiving break, campus closed'
  };
  var EXAMS = {
    mw: [['Exam 1','2026-09-09'],['Exam 2','2026-09-30'],['Exam 3','2026-10-21'],['Exam 4','2026-11-16'],['Exam 5','2026-12-09']],
    tr: [['Exam 1','2026-09-08'],['Exam 2','2026-09-29'],['Exam 3','2026-10-22'],['Exam 4','2026-11-17'],['Exam 5','2026-12-10']]
  };
  var SEC_LABEL = { 'mw': 'Mon / Wed · Afternoon', 'tr-am': 'Tue / Thu · Morning', 'tr-eve': 'Tue / Thu · Evening' };

  function boot() {
    try {
      if (document.body.hasAttribute('data-no-faculty-dock')) return;
      if (window.parent && window.parent !== window) return; /* not inside Canvas embeds */
      if (document.querySelector('.fd-pill')) return;

      var css = ''
        + '.fd-pill{position:fixed;right:18px;bottom:18px;z-index:2147482900;display:inline-flex;align-items:center;gap:9px;'
        + 'background:#08101F;color:#F4EFE8;border:2px solid #DCB45C;border-radius:999px;padding:11px 18px 11px 14px;cursor:pointer;'
        + 'font:800 13.5px/1 "Plus Jakarta Sans",system-ui,-apple-system,Segoe UI,Roboto,sans-serif;'
        + 'box-shadow:0 6px 18px -6px rgba(0,0,0,.5)}'
        + '.fd-pill:hover{color:#fff;border-color:#E8CE85}'
        + '.fd-pill:focus-visible{outline:3px solid #DCB45C;outline-offset:3px}'
        + '.fd-pill svg{width:16px;height:16px;stroke:#DCB45C}'
        + 'body.present .fd-pill{display:none}'

        + '.fdov{position:fixed;inset:0;z-index:2147482901;background:rgba(4,8,18,.72);display:none;overflow:auto;'
        + 'font-family:"Plus Jakarta Sans",system-ui,sans-serif;color:#fff;padding:4vh 16px 6vh}'
        + '.fdov.on{display:flex;align-items:flex-start;justify-content:center}'
        + '.fd-panel{background:#0B1530;border:1px solid rgba(255,255,255,.09);border-radius:26px;'
        + 'max-width:1160px;width:100%;padding:24px 26px 32px;box-shadow:0 40px 90px -30px rgba(0,0,0,.8)}'

        + '.fd-head{display:flex;align-items:center;gap:16px;margin-bottom:16px}'
        + '.fd-head h2{font-size:23px;font-weight:800;margin:0;color:#fff;letter-spacing:-.01em}'
        + '.fd-sec{font-size:13px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#DCB45C;flex:1}'
        + '.fd-close{background:none;border:1.5px solid rgba(244,239,232,.4);color:#F4EFE8;cursor:pointer;'
        + 'width:44px;height:44px;border-radius:50%;font-size:18px;line-height:1;display:flex;align-items:center;justify-content:center}'
        + '.fd-close:hover{border-color:#DCB45C;color:#fff}'
        + '.fd-close:focus-visible{outline:3px solid #DCB45C;outline-offset:2px}'

        + '.fd-search{display:flex;align-items:center;gap:12px;border:2px solid #C9A14A;border-radius:18px;'
        + 'background:rgba(255,255,255,.04);padding:14px 18px}'
        + '.fd-search svg{width:19px;height:19px;stroke:#8A96AC;flex:none}'
        + '.fd-search input{flex:1;background:none;border:0;outline:0;color:#fff;font:600 17px "Plus Jakarta Sans",system-ui,sans-serif}'
        + '.fd-search input::placeholder{color:#8A96AC}'
        + '.fd-search .hint{font-size:13.5px;color:#A7B1C2;white-space:nowrap}'
        + '.fd-search:focus-within{border-color:#DCB45C;box-shadow:0 0 0 3px rgba(220,180,92,.18)}'

        + '.fd-now{display:flex;flex-wrap:wrap;gap:9px;margin:14px 0 4px}'
        + '.fd-chip{font-size:13px;font-weight:700;color:#E7EAEE;background:rgba(255,255,255,.06);'
        + 'border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:7px 14px}'
        + '.fd-chip.warn{color:#F0C4AC;border-color:rgba(240,196,172,.4)}'
        + 'a.fd-chip.go{color:#0B1530;background:#DCB45C;border-color:#DCB45C;text-decoration:none}'
        + 'a.fd-chip.go:hover{background:#E8CE85}'
        + 'a.fd-chip.go:focus-visible{outline:3px solid #fff;outline-offset:2px}'

        + '.fd-group{margin-top:20px}'
        + '.fd-gh{display:flex;align-items:center;gap:10px;width:100%;background:none;border:0;cursor:pointer;'
        + 'color:#DCB45C;font:700 12.5px "Plus Jakarta Sans",system-ui,sans-serif;letter-spacing:.2em;'
        + 'text-transform:uppercase;padding:8px 2px;text-align:left}'
        + '.fd-gh svg{width:13px;height:13px;stroke:#DCB45C;transition:transform 180ms ease;flex:none}'
        + '.fd-gh[aria-expanded="false"] svg{transform:rotate(-90deg)}'
        + '.fd-gh .fd-count{margin-left:auto;color:#8A96AC;letter-spacing:0;font-size:13.5px}'
        + '.fd-gh:focus-visible{outline:3px solid #DCB45C;outline-offset:2px;border-radius:6px}'
        + '.fd-grid{display:grid;gap:13px;grid-template-columns:repeat(auto-fill,minmax(285px,1fr));padding-top:6px}'
        + '.fd-grid[hidden]{display:none}'

        + 'a.fd-tile{display:flex;gap:14px;align-items:flex-start;text-align:left;'
        + 'background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.13);border-radius:18px;'
        + 'padding:16px 15px;text-decoration:none;color:#fff;'
        + 'transition:transform 160ms ease,border-color 160ms ease}'
        + 'a.fd-tile:hover{transform:translateY(-2px);border-color:#DCB45C}'
        + 'a.fd-tile:focus-visible{outline:3px solid #DCB45C;outline-offset:2px}'
        + 'a.fd-tile[hidden]{display:none}'
        + '.fd-ic{width:52px;height:52px;border-radius:15px;display:flex;align-items:center;justify-content:center;'
        + 'flex:none;box-shadow:0 4px 12px rgba(0,0,0,.35)}'
        + '.fd-ic svg{width:26px;height:26px}'
        + '.fd-gold{background:#DCB45C}.fd-gold svg{stroke:#08101F;color:#08101F}'
        + '.fd-terra{background:#8B1D1D}.fd-terra svg{stroke:#fff;color:#fff}'
        + '.fd-teal{background:#2C5F66}.fd-teal svg{stroke:#fff;color:#fff}'
        + '.fd-light{background:#fff}.fd-light svg{stroke:#08101F;color:#08101F}'
        + '.fd-name{font-size:16px;font-weight:800;line-height:1.3}'
        + '.fd-sub{font-size:12.5px;color:#A7B1C2;line-height:1.35;margin-top:3px}'
        + '.fd-none{margin:16px 2px 0;font-size:14.5px;color:#A7B1C2}'
        + '@media (prefers-reduced-motion:reduce){a.fd-tile,.fd-gh svg{transition:none}a.fd-tile:hover{transform:none}}'
        + '@media print{.fd-pill,.fdov{display:none !important}}';
      var st = document.createElement('style');
      st.textContent = css;
      document.head.appendChild(st);

      var sec = null;
      try { sec = localStorage.getItem('bio004-section'); } catch (e) {}
      function href(a) {
        if (a.href === 'SECTION') return TOOLS.sectionPage[sec] || 'index.html';
        return a.href;
      }

      /* ---- the today strip: date, week, who meets, next exam, and a
         straight door to tonight's lab question on lab nights ---- */
      function nowChips() {
        var d = new Date();
        function p(n){ return (n < 10 ? '0' : '') + n; }
        var T = d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
        var W = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        var M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var wk = Math.floor((d - TERM_START) / (7 * 864e5)) + 1;
        var chips = '<span class="fd-chip">' + W[d.getDay()] + ', ' + M[d.getMonth()] + ' ' + d.getDate()
          + (wk >= 1 && wk <= 17 ? ' · Week ' + wk : '') + '</span>';
        if (CLOSURES[T]) {
          chips += '<span class="fd-chip warn">' + CLOSURES[T] + '</span>';
        } else {
          var dow = d.getDay();
          if (dow === 1 || dow === 3) chips += '<span class="fd-chip">Mon/Wed class meets today</span>';
          else if (dow === 2 || dow === 4) chips += '<span class="fd-chip">Tue/Thu classes meet today</span>';
          else chips += '<span class="fd-chip">No classes today</span>';
        }
        var track = (sec === 'mw') ? 'mw' : (sec ? 'tr' : null);
        var lists = track ? [[track, EXAMS[track]]] : [['mw', EXAMS.mw], ['tr', EXAMS.tr]];
        lists.forEach(function (pair) {
          for (var i = 0; i < pair[1].length; i++) {
            var ed = pair[1][i];
            if (ed[1] >= T) {
              var dp = ed[1].split('-');
              var days = Math.round((new Date(+dp[0], +dp[1] - 1, +dp[2]) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 864e5);
              chips += '<span class="fd-chip">' + ed[0] + (track ? '' : ' (' + (pair[0] === 'mw' ? 'MW' : 'TR') + ')')
                + (days === 0 ? ' is TODAY' : ' in ' + days + ' day' + (days === 1 ? '' : 's')) + '</span>';
              break;
            }
          }
        });
        var dow2 = d.getDay();
        if (dow2 >= 1 && dow2 <= 3 && !CLOSURES[T]) {
          chips += '<a class="fd-chip go" href="bio004-lab-question-tonight.html">Tonight’s lab question →</a>';
        }
        return chips;
      }

      /* ---- "Right now": the tools for THIS day, assembled by the
         calendar, so the panel opens on what she needs instead of a
         wall of categories. Everything else starts collapsed. ---- */
      function byName(n) {
        var hit = null;
        TOOLS.groups.forEach(function (g) {
          g.apps.forEach(function (a) { if (a.name === n) hit = a; });
        });
        return hit;
      }
      function rightNow() {
        var d = new Date(), dow = d.getDay();
        function p(n){ return (n < 10 ? '0' : '') + n; }
        var T = d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
        var names;
        if (CLOSURES[T]) names = ['Course Calendar', 'Brain Dump Bank', 'Grade Engine'];
        else if (dow >= 1 && dow <= 3) names = ['Course Engine', 'Lab Question of the Night', 'Brain Dump Selector', 'Course Page'];
        else if (dow === 4) names = ['Course Engine', 'Brain Dump Selector', 'Course Page'];
        else names = ['Course Calendar', 'Brain Dump Bank', 'Grade Engine', 'Lab Question of the Night'];
        return names.map(byName).filter(Boolean);
      }
      var RENDER_GROUPS = [{ label: 'Right now', apps: rightNow(), open: true }]
        .concat(TOOLS.groups.map(function (g) { return { label: g.label, apps: g.apps, open: false }; }));

      var ov = document.createElement('div');
      ov.className = 'fdov';
      ov.setAttribute('role', 'dialog');
      ov.setAttribute('aria-modal', 'true');
      ov.setAttribute('aria-label', 'Faculty tools');
      var inner = '<div class="fd-panel"><div class="fd-head">'
        + '<h2>Faculty tools</h2>'
        + '<span class="fd-sec">' + (SEC_LABEL[sec] || 'BIO 004 · Fall 2026') + '</span>'
        + '<button type="button" class="fd-close" data-fdclose aria-label="Close">&#10005;</button></div>'
        + '<div class="fd-search"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>'
        + '<input type="text" id="fdq" placeholder="Type to find a tool, then Enter" aria-label="Find a faculty tool">'
        + '<span class="hint">Esc to close</span></div>'
        + '<div class="fd-now" aria-label="Today">' + nowChips() + '</div>';
      RENDER_GROUPS.forEach(function (g, gi) {
        inner += '<div class="fd-group" data-fg="' + gi + '" data-open="' + g.open + '">'
          + '<button type="button" class="fd-gh" aria-expanded="' + g.open + '" aria-controls="fdg-' + gi + '">'
          + '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>'
          + g.label + '<span class="fd-count">' + g.apps.length + '</span></button>'
          + '<div class="fd-grid" id="fdg-' + gi + '"' + (g.open ? '' : ' hidden') + '>';
        g.apps.forEach(function (a) {
          var h = href(a);
          var hay = (a.name + ' ' + a.sub + ' ' + g.label).toLowerCase();
          inner += '<a class="fd-tile" data-hay="' + hay.replace(/"/g, '') + '" href="' + h + '"'
            + (/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : '') + '>'
            + '<span class="fd-ic fd-' + a.color + '" aria-hidden="true"><svg viewBox="0 0 32 32" stroke="currentColor">' + TOOLS.icons[a.icon] + '</svg></span>'
            + '<span><span class="fd-name">' + a.name + '</span>'
            + '<span class="fd-sub" style="display:block">' + a.sub + '</span></span></a>';
        });
        inner += '</div></div>';
      });
      inner += '<p class="fd-none" id="fdNone" hidden>Nothing matches. Try another word, or Esc to clear.</p></div>';
      ov.innerHTML = inner;
      document.body.appendChild(ov);

      var pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'fd-pill';
      pill.innerHTML = '<svg viewBox="0 0 32 32" fill="none" stroke-width="2.2" aria-hidden="true">' + TOOLS.icons.gridic + '</svg>Faculty tools';
      pill.setAttribute('aria-haspopup', 'dialog');
      document.body.appendChild(pill);

      var q = ov.querySelector('#fdq');
      function applyFilter() {
        var v = q.value.trim().toLowerCase();
        var any = false;
        ov.querySelectorAll('.fd-group').forEach(function (g) {
          var vis = 0;
          g.querySelectorAll('.fd-tile').forEach(function (t) {
            var hit = !v || t.getAttribute('data-hay').indexOf(v) > -1;
            t.hidden = !hit;
            if (hit) vis++;
          });
          g.hidden = !vis;
          var c = g.querySelector('.fd-count'); if (c) c.textContent = vis;
          /* searching opens every group so hits are never hidden shut;
             clearing the search restores the calm default: Right now
             open, everything else folded */
          var gh = g.querySelector('.fd-gh'), gr = g.querySelector('.fd-grid');
          if (v) {
            gh.setAttribute('aria-expanded', 'true'); gr.hidden = false;
          } else {
            var def = g.getAttribute('data-open') === 'true';
            gh.setAttribute('aria-expanded', String(def)); gr.hidden = !def;
          }
          if (vis) any = true;
        });
        ov.querySelector('#fdNone').hidden = any;
      }
      q.addEventListener('input', applyFilter);
      q.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          var first = ov.querySelector('.fd-group:not([hidden]) .fd-tile:not([hidden])');
          if (first) first.click();
        }
      });

      ov.addEventListener('click', function (e) {
        var gh = e.target.closest('.fd-gh');
        if (gh) {
          var open = gh.getAttribute('aria-expanded') === 'true';
          gh.setAttribute('aria-expanded', String(!open));
          var gr = document.getElementById(gh.getAttribute('aria-controls'));
          if (gr) gr.hidden = open;
          return;
        }
        if (e.target === ov || e.target.closest('[data-fdclose]')) close();
      });

      var lastFocus = null;
      function open() {
        lastFocus = document.activeElement;
        ov.classList.add('on');
        q.value = ''; applyFilter();
        q.focus();
      }
      function close() {
        ov.classList.remove('on');
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      }
      pill.addEventListener('click', open);
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape' || !ov.classList.contains('on')) return;
        if (document.activeElement === q && q.value) { q.value = ''; applyFilter(); return; }
        close();
      });
    } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
