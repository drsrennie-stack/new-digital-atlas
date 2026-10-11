"""Put the Digital Atlas tile on the structure lists and the lecture slides.

    python3 bio004-atlas-tile-add.py

The tile is one link carrying a QR code. Click it on a laptop, scan it from a
printout, either way the Atlas opens in a second tab so it can sit beside the
page you are reading. That is the whole point: rotate the structure in one
window while the list or the slide is open in the other.

target="_blank" rel="noopener" because the Atlas is off site, which is also
what the house rule says for external links. Internal links keep target="_top".

Idempotent: a file that already carries the tile is left alone, so this can be
re-run after new slides are added.

Insertion points:
  structure lists   after the cover page, before the contents
  lecture slides    after the hero, before the deck
"""
import re, glob, segno

ATLAS = 'https://claude.ai/artifact/88nmVMHdWVZGXf3ShnSURo'
MARK = 'atl-tile'          # presence of this class means the tile is already in

qr = segno.make(ATLAS, error='m').svg_inline(scale=1, border=1, dark='#08101F',
                                             svgclass='atl-qr-svg', lineclass='atl-qr-line')
qr = re.sub(r'<svg width="(\d+)" height="\d+" class="atl-qr-svg"',
            lambda m: '<svg viewBox="0 0 %s %s" preserveAspectRatio="xMidYMid meet" '
                      'class="atl-qr-svg" aria-hidden="true" focusable="false"'
                      % (m.group(1), m.group(1)), qr)

TILE = """
<!-- Digital Atlas, added by bio004-atlas-tile-add.py. Click or scan, opens in a second tab. -->
<style>
  .atl-wrap{max-width:900px;margin:22px auto;padding:0 26px}
  .atl-tile{display:grid;grid-template-columns:52px 1fr 124px;gap:18px;align-items:center;
    background:#0B1530;border-radius:16px;padding:16px 20px;text-decoration:none;color:#fff;
    box-shadow:0 0 0 2px #C9A14A,0 8px 18px -12px rgba(8,16,31,.4);
    transition:transform .2s ease,box-shadow .2s ease}
  .atl-tile:hover{transform:translateY(-2px);box-shadow:0 0 0 2px #C9A14A,0 12px 22px -12px rgba(8,16,31,.55)}
  .atl-tile:focus-visible{outline:3px solid #C9A14A;outline-offset:3px}
  .atl-ic{width:52px;height:52px;border-radius:14px;display:grid;place-items:center;
    background:linear-gradient(145deg,#5C7FA8,#2F4C7D);box-shadow:inset 0 1px 0 rgba(255,255,255,.45)}
  .atl-ic svg{width:26px;height:26px;stroke:#0B1530;fill:none;stroke-width:2.1;
    stroke-linecap:round;stroke-linejoin:round}
  .atl-tag{font-family:'DM Sans',system-ui,sans-serif;font-size:10.5px;font-weight:800;
    letter-spacing:.14em;text-transform:uppercase;color:#E8C97E;margin:0}
  .atl-h{font-family:'Plus Jakarta Sans',system-ui,sans-serif;font-size:19px;font-weight:800;
    letter-spacing:-.015em;color:#EBCE86;margin:2px 0 0;line-height:1.2}
  .atl-d{font-size:12.5px;color:#E9EDF3;margin:3px 0 0;line-height:1.4}
  /* 124px, not 92. At 92 a phone camera has under three pixels per module and
     hunts for the code. */
  .atl-qr{width:124px;height:124px;background:#fff;border-radius:11px;padding:6px}
  .atl-qr-svg{width:100%;height:100%;display:block;shape-rendering:crispEdges}
  .atl-qr-line{stroke:#0B1530}
  @media (prefers-reduced-motion:reduce){.atl-tile:hover{transform:none}}
  @media (max-width:640px){
    .atl-tile{grid-template-columns:1fr;justify-items:center;text-align:center;gap:12px}
  }
  @media print{
    .atl-wrap{margin:14pt auto;padding:0}
    .atl-tile{break-inside:avoid;grid-template-columns:34pt 1fr 68pt;gap:12pt;padding:10pt 13pt;
      border-radius:10pt;box-shadow:0 0 0 1.2pt #C9A14A;
      -webkit-print-color-adjust:exact;print-color-adjust:exact}
    .atl-ic{width:34pt;height:34pt;border-radius:9pt}
    .atl-ic svg{width:17pt;height:17pt}
    .atl-tag{font-size:6.6pt}
    .atl-h{font-size:12.5pt}
    .atl-d{font-size:8.4pt}
    .atl-qr{width:68pt;height:68pt;padding:3.5pt;border-radius:7pt}
  }
</style>
<div class="atl-wrap">
  <a class="atl-tile" href="__ATLAS__" target="_blank" rel="noopener"
     aria-label="Open the Digital Atlas in a new tab">
    <span class="atl-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18"/></svg></span>
    <span>
      <span class="atl-tag">Open it beside this page</span>
      <span class="atl-h">Digital Atlas</span>
      <span class="atl-d">Turn the structures around while you read. Click here, or scan the code with your phone, and it opens in a second window.</span>
    </span>
    <span class="atl-qr">__QR__</span>
  </a>
</div>
"""
TILE = TILE.replace('__ATLAS__', ATLAS).replace('__QR__', qr)

# The tile's text spans sit inside a <span>, not a <p>, because the whole tile
# is one anchor and block elements inside an inline anchor are invalid.
TILE = TILE.replace('<span class="atl-tag">', '<span class="atl-tag" style="display:block">')
TILE = TILE.replace('<span class="atl-h">', '<span class="atl-h" style="display:block">')
TILE = TILE.replace('<span class="atl-d">', '<span class="atl-d" style="display:block">')

TARGETS = [
    # (glob, marker to insert before)
    ('module-*-structure-list.html', '<nav class="contents"'),
    ('slides-*.html', '<main class="deck"'),
    # BIO004-Structure-List.html is deliberately left out. It is the master
    # list, tabled, and nothing links to it. Add it back here if that changes.
]

added, already, missed = [], [], []
for pattern, anchor in TARGETS:
    for path in sorted(glob.glob(pattern)):
        s = open(path, encoding='utf-8').read()
        if MARK in s:
            already.append(path); continue
        i = s.find(anchor)
        if i == -1:
            missed.append(path); continue
        s = s[:i] + TILE + '\n' + s[i:]
        open(path, 'w', encoding='utf-8').write(s)
        added.append(path)

print('added  :', len(added))
print('already:', len(already))
print('no anchor found:', len(missed))
for m in missed:
    print('   ', m)
