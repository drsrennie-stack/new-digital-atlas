/* ============================================================
   BIO 004 Human Anatomy, Fall 2026
   course-links.js

   Every course URL, in one place.

   WHY
   ---
   These URLs were written by hand in welcome.html, and the stub
   files week-links.js and resources.js shipped empty while the
   real addresses sat a few hundred lines away in another file.
   Same URL in three places is three places to update when a link
   moves, and two of them will be missed.

   Anything that needs to point a student at the Atlas, the Loops,
   Study With Me or the calendar reads it from here.

   ADDING A LINK
   -------------
   Put it in the right group and it becomes available everywhere.
   Nothing here is invented: every URL below was already live in
   welcome.html.

   INTERNAL vs EXTERNAL
   --------------------
   internal: true  means a page on this GitHub Pages site. It gets
                   target="_top" so it breaks out of the Canvas
                   iframe instead of nesting the course in itself.
   internal: false means somewhere else. It gets target="_blank"
                   with rel="noopener".

   Getting this backwards is the single most common way a Canvas
   course ends up rendering inside its own iframe, so the flag is
   explicit on every entry rather than guessed from the URL.
   ============================================================ */

window.BIO004_LINKS = {

  /* ---------- on this site ---------- */
  calendar:  { url: 'bio004-course-calendar.html',      internal: true,  label: 'course calendar' },
  masteryOS: { url: 'mastery-os-fall-2026.html',        internal: true,  label: 'Mastery OS' },
  homeLegacy:{ url: 'welcome.html',                 internal: true,  label: 'course home (redirect)' },
  syllabusGeneric: { url: 'fall-2026-syllabus.html',    internal: true,  label: 'syllabus' },

  /* ---------- elsewhere ---------- */
  atlas: { url: 'https://claude.ai/artifact/88nmVMHdWVZGXf3ShnSURo',
           internal: false, label: 'Digital Atlas' },

  loops: { url: 'https://drsrennie-stack.github.io/loops/',
           internal: false, label: 'Loops' },

  study: { url: 'https://drsrennie-stack.github.io/new-build-bio4-solano/study-session-signup.html',
           internal: false, label: 'Study With Me' },

  astc:  { url: 'https://welcome.solano.edu/astc-homepage',
           internal: false, label: 'ASTC homepage' },

  /* ---------- per section ----------

     `hub` used to be class1 / class2 / class3.html, a per-section lab
     schedule with its own next-exam countdown, its own week list and
     its own filters. The course calendar now answers all of that, for
     the right section, and it is the page students are pointed at from
     everywhere else. Two pages answering "what is coming" meant Hootie
     could send a student asking where to start to the one nobody else
     links to. The hub is the calendar. */
  sections: {
    'mw':     { syllabus: 'syllabus-class1.html', hub: 'bio004-course-calendar.html?sec=mw' },
    'tr-am':  { syllabus: 'syllabus-class2.html', hub: 'bio004-course-calendar.html?sec=tr-am' },
    'tr-eve': { syllabus: 'syllabus-class3.html', hub: 'bio004-course-calendar.html?sec=tr-eve' }
  },

  /* ---------- contact ---------- */
  contact: {
    canvasInbox: 'the Canvas Inbox',
    email:       'srennie@solano.edu',
    turnaround:  'about 48 to 72 hours on weekdays',
    officeHours: '30 minutes before each class, or by appointment',
    ascEmail:    'ASC@solano.edu',
    ascPhone:    '(707) 864-7136'
  }
};

/* Build an anchor for a link key, with the right target. */
window.BIO004_LINKS.a = function (key, text) {
  var L = window.BIO004_LINKS[key];
  if (!L) return text || key;
  var t = L.internal ? ' target="_top"' : ' target="_blank" rel="noopener"';
  return '<a href="' + L.url + '"' + t + '>' + (text || L.label) + '</a>';
};

/* Section-aware anchor.

   The no-section fallback for `hub` used to be the CALENDAR. That is
   how "course home" ended up taking students to a list of dates
   instead of home. Home is welcome.html: it shows the week hub to a
   student who has picked a section and the picker to one who has not,
   so it is the right answer in both cases. */
window.BIO004_LINKS.home = { url: 'welcome.html', internal: true, label: 'course home' };

window.BIO004_LINKS.forSection = function (sec) {
  var s = window.BIO004_LINKS.sections[sec];
  return {
    syllabus: s ? s.syllabus : window.BIO004_LINKS.syllabusGeneric.url,
    hub:      s ? s.hub      : window.BIO004_LINKS.home.url
  };
};
