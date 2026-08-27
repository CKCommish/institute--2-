/* glyph-floor — what a reader actually sees, measured by subtraction.

   ── THE HOLE THIS CLOSES ─────────────────────────────────────────────────
   Every contrast meter this project has built measured the ground and then
   MODELLED the ink on top of it:

     audit.mjs     walks the DOM for an ancestor background colour. Blind to
                   photographs entirely.
     photo-meter   reads the pixels behind the type, then composites the ink
                   with the element's own colour alpha only. Blind to
                   `opacity` on the element and every ancestor — a beat at
                   --be 0.55 was read as fully inked cream (7.19:1 for a
                   string that was really 4.17).
     hold-meter    cascades opacity properly, but samples 17 fixed offsets on
                   one scene of one route, and the minimum falls between them.
     ink-floor     cascaded the opacity AND minimised the curve, for every
                   string over a photograph on every route at both viewports.
                   It fixed photo-meter's defect and it was right about the
                   number it quoted. It was still a model: `fg = c*a + bg*(1-a)`,
                   with `bg` sampled from a frame in which the type was hidden.

   The model has one term for what is painted BEHIND the glyphs and no term at
   all for what is painted IN FRONT of them. So the nav's 89px scrim tail —
   which is painted over page content, dims the ink and the ground by
   different amounts, and had 11px type at 2.745:1 under it — was a free pass
   in every one of the four. ink-floor replaced a blindness to ancestor
   opacity with a blindness to foreground compositing, and AGENTS.md wrote
   that up as a convention.

   ── THE INSTRUMENT ───────────────────────────────────────────────────────
   Shoot the frame TWICE at the same scroll offset: once as it ships, once
   with the glyphs taken off the glass. The glyph pixels are exactly the
   pixels that changed. Nothing is composited by this tool and nothing is
   modelled:

     INK     the ON frame's colour at the pixels of highest coverage. That is
             the light that leaves the screen where a stem is — after the
             element's colour alpha, after every ancestor's opacity, after
             any blend mode, after any scrim, wash, gradient or overlay
             painted in front, and after the browser's own gamma and
             subpixel rules. There is no compositing model to be wrong.
     GROUND  the brightest 3-row band of the OFF frame over the same run —
             ink-floor's rule, unchanged, and kept deliberately so the two
             instruments are comparable. (They agree to 0.002 on the site's
             thinnest string; see the note at the foot of this header.)

   Two things fall out for free, and both are the point:

     OCCLUSION IS SELF-HANDLING. Text hidden behind an opaque fixed bar
     changes no pixels, so it drops out with no rule about it. Text under the
     bar's TRANSLUCENT tail changes dimmed pixels, so it is measured dimmed.
     ink-floor needed an explicit "drop content under the bar's box, keep
     content under its tail" rule to get this half-right; subtraction gets it
     exactly right without one.

     IT DOES NOT NEED A PHOTOGRAPH. photo-meter, hold-meter and ink-floor all
     scoped themselves to `figure.fig` because they had to know what the
     ground was made of to model against it. Subtraction does not care what
     the ground is. So this measures EVERY string on every route — over
     photographs, over flat ground, over gradients, under the bar's tail —
     which is the only way the tail's crossings of OPAQUE grounds were ever
     going to be seen.

   ── WHY "PIXELS OF HIGHEST COVERAGE" AND NOT "ALL CHANGED PIXELS" ────────
   A glyph's edge pixels are antialiased: partial coverage, so partly ink and
   partly ground. Averaging them in would drag every reading toward the
   ground and flatter the site by a wide margin — on 11px type most of the
   changed pixels are edges. The reading is taken at the pixels whose change
   is within 10% of the largest change in the run: the stems. If a string is
   so thin that no pixel reaches full coverage, then no pixel a reader sees
   reaches it either, and the stems are still the right place to read.

   ── HOW THE MINIMUM IS FOUND ─────────────────────────────────────────────
   Unchanged from ink-floor, which got this right: coarse sweep at vh/5 (no
   contrast curve on this site turns inside one step), then the coarse argmin
   bracketed with its neighbours and trisected until the bracket is under 8px.
   Frames are memoised by offset, so overlapping brackets are free. Only
   curves whose coarse floor is within 2.5x of their budget are refined.

   ── AGREEMENT, SO THE SWITCH IS AUDITABLE ────────────────────────────────
   On the homepage's 11px "By invitation" eyebrow — the site's thinnest
   type-over-photograph, quoted at 4.563:1 — this tool and ink-floor agree to
   within a few thousandths. They must: on a string with nothing painted in
   front of it, "observed ink" and "correctly modelled ink" are the same
   quantity. Where they disagree, something is painted in front, and this one
   is right.

   usage: BASE=http://127.0.0.1:4399 node tools/glyph-floor.mjs [--json]
          [--routes=/,/forum/] [--views=desktop,mobile] [--min-opacity=0.5]
          [--jobs=4] [--coarse=5] [--all]     (--all: list every curve)
          [--scale=3]        device pixel ratio the readings are MEASURED at
          [--find-scale=1]   ratio the curve is LOCATED at; =3 to sweep dear
          [--strength=0]     show the scroll-linked half-painted states too  */
import { launch } from './browser.mjs';
import sharp from 'sharp';

const base = process.env.BASE || 'http://127.0.0.1:4399';
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const asJson = process.argv.includes('--json');
const showAll = process.argv.includes('--all');
const ROUTES = arg('routes', process.env.ROUTES || '/,/pilots/,/institute/,/forum/,/people/,/partner/').split(',').filter(Boolean);
const VIEW_TAGS = arg('views', 'desktop,mobile').split(',');
/* Below this DECLARED alpha a string is mid-crossfade rather than being read.
   This is the ONLY place the DOM is still consulted about ink, it is not used
   in the arithmetic anywhere, and it decides one thing: whether a line is
   being read or is on its way in or out. The site's own rule (HeldScene) is
   that small type never crosses at partial alpha — it wipes — so anything
   small found under this threshold is a defect in THAT rule, and
   --min-opacity=0.01 is how you go looking for one.

   The alpha here is cascaded opacity TIMES THE COLOUR'S OWN ALPHA, and the
   second half is a correction to ink-floor, which gated on opacity alone.
   The homepage's held Forum beats fade in `color`, not in `opacity`: at
   y=2879 mobile the location credit is at maxD=8 out of 237 — three percent
   of an ink — and ink-floor's gate called that a fully-read string at
   opacity 1.00. It scored 1.06:1 and only luck kept it off the gate, since
   the notch is ~30px wide and the coarse grid stepped over it. Gate on the
   ink's alpha and the notch is what it is: a crossfade. */
const MIN_OP = Number(arg('min-opacity', '0.5'));
/* CROSSFADE, MEASURED. Every meter here has had to separate "a line a reader
   is looking at" from "a line on its way in or out", and every one of them
   asked the DOM: cascaded opacity, threshold 0.5. That gate is blind to every
   other way a line can be half-painted. The homepage's held Forum credit is
   at opacity 1.00 and colour alpha 0.70 while being painted at maxD 8 out of
   its own 237 — three percent of an ink — and read 1.06:1 there.

   So ask the pixels instead. A string's INK STRENGTH at one offset is the
   largest change it makes there divided by the largest change it makes
   anywhere in the sweep. The threshold is the SAME 0.5 the project has
   always used for declared alpha — this is that convention restated in the
   domain where it can actually be checked, not a new one. A string painted
   at under half its own ink is on its way somewhere.

   This matters more than it sounds. `motion.js` layer 3 is scroll-linked and
   reversible: a reader who stops mid-scroll holds a settle or beat state
   indefinitely, so these are not transients in time and no amount of waiting
   makes them go away. On the homepage at 390x844 there are a dozen strings
   sitting between 1.3:1 and 3.0:1 in such a state. They are reported under
   `--strength=0` and they are NOT failures here, because the type is not
   arrived; whether a design should let a reader park there is a motion
   question and not a contrast one.

   KNOW THE FAILURE MODE OF THIS RULE, because it is the same shape as the
   ones it replaces: an overlay that dimmed real, settled ink below a quarter
   of its strength would be waved through as a crossfade. The nav's scrim
   tail — the thing this whole tool was built to see — dims the ink under it
   to roughly half, well clear. If an overlay heavier than that is ever
   added, this constant is the line to move, and `--strength=0` turns the
   rule off and shows every half-painted state on the site. */
const STRENGTH = Number(arg('strength', String(MIN_OP)));
const JOBS = Number(arg('jobs', '4'));
const COARSE = Number(arg('coarse', '5'));
const BRACKET_PX = 8;
/* A changed channel this small is dithering or a rounding edge, not a glyph. */
const INK_FLOOR_DELTA = 6;
/* Fraction of the largest change in a run that still counts as a stem. */
const CORE = 0.9;
/* A BACKSTOP FOR WHAT CLIPPING GEOMETRY STILL CANNOT SEE. A [data-wipe] whose
   clip-path is shut paints no glyphs, but its rect is inside its ancestors'
   boxes, so the geometry above lets it through and a handful of antialiased
   edge pixels become a "string" at 1.03:1. Real type covers its own run box
   with stems: 8% for 11px sans, 3% for 22px display, and — this is the part
   that matters — COVERAGE DOES NOT MOVE WITH CONTRAST. The stem set is
   `change >= 0.9 x largest change in the run`, which is a geometric fact
   about the glyphs; a genuinely thin reading keeps its normal coverage while
   a clipped-away one is two or three stray pixels. Anything under 0.8% of
   its box is not being painted and is reported apart, never as a failure. */
const MIN_COVER = 0.008;

const VIEWS = [
  { tag: 'desktop', vp: { width: 1440, height: 900 } },
  { tag: 'mobile', vp: { width: 390, height: 844 }, mobile: true },
].filter((v) => VIEW_TAGS.includes(v.tag));

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const Y = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const Lstar = (y) => (y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y);
const contrast = (a, b) => { const [x, y] = a > b ? [a, b] : [b, a]; return (x + 0.05) / (y + 0.05); };

/* THE BAND IS THREE ROWS, and that is inherited from ink-floor deliberately.
   A single worst ROW turns any 1px FOREGROUND hairline crossing a glyph box
   into a bright ground — the nav's progress rule passes behind the homepage's
   pilot indices for ~15px of scroll and a single-row reading called that
   2.31:1 on a brass numeral whose real ground is L* 3.4 page ink. A hairline
   in front of the type is not the ground behind it, and a band a line of type
   is read against is never one pixel tall. Three rows is the narrowest window
   a hairline cannot dominate. */
const BAND_ROWS = 3;
/* AND THE FRAME IS SHOT AT 2x, WHICH IS NOT A DETAIL. A stem of 12px Libre
   Franklin is about one device pixel wide at deviceScaleFactor 1, so it is
   ANTIALIASED EVERYWHERE and no pixel of it ever reaches full coverage. Read
   off a 1x frame, a navy index on cream measures ink L* 48 where its colour
   is L* 4 — the instrument was reporting the browser's antialiasing as if it
   were the design's ink, and it failed a third of the site's small type on
   it. 2x is not enough either: 13px indices still read 3.67 there against a
   colour whose contrast is 4.79 by arithmetic. At 3x the cores are solid and
   the same string reads 4.777 — the browser's own compositing agreeing with
   the palette to three decimal places, which is the check that says the
   instrument is measuring ink and not sampling error. The frames are large;
   this is where the run time goes, and it is the right place to spend it. Every rect from the page is in CSS pixels and is scaled by SCALE
   before it indexes the buffer. */
const SCALE = Number(arg('scale', '3'));
/* the cheap scale the curve is LOCATED at, before it is MEASURED at SCALE */
const FIND_SCALE = Number(arg('find-scale', String(SCALE)));
const scaleRect = (r, S) => ({ x: r.x * S, y: r.y * S, w: r.w * S, h: r.h * S });
const brightestBand = (raw, W, r) => {
  const rows = [];
  for (let j = r.y; j < r.y + r.h; j++) {
    let s = 0;
    for (let i = r.x; i < r.x + r.w; i++) { const o = (j * W + i) * 3; s += Y(raw[o], raw[o + 1], raw[o + 2]); }
    rows.push(s / r.w);
  }
  if (!rows.length) return 0;
  const win = Math.min(BAND_ROWS * (r.s || 1), rows.length);
  let best = 0, sum = 0;
  for (let j = 0; j < rows.length; j++) {
    sum += rows[j];
    if (j >= win) sum -= rows[j - win];
    if (j >= win - 1) best = Math.max(best, sum / win);
  }
  return best;
};

/* HOW THE GLYPHS COME OFF THE GLASS: `-webkit-text-fill-color`, not `color`
   and not `visibility`. `color` would take every currentColor rule with it —
   borders, hairlines, ::before washes drawn in currentColor — and those are
   part of the ground, so removing them changes the very thing being measured.
   `visibility: hidden` or `display: none` takes an element's ::before wash
   with it, which is the trap credit-sweep.mjs fell into: it deleted the
   protection it was there to measure. Fill colour alone leaves every painted
   layer intact and changes no layout, so the ON and OFF frames differ in
   exactly one thing — the glyphs. That is the whole instrument. */
const MASK_CSS = `*, *::before, *::after {
  -webkit-text-fill-color: transparent !important;
  text-shadow: none !important;
  -webkit-text-decoration-color: transparent !important;
  text-decoration-color: transparent !important;
  caret-color: transparent !important; }`;

/* Runs in the page: every visible text node with its clipped client rects.
   NO scoping to figures, NO ancestor-background rule, NO fixed-bar rule —
   subtraction needs none of them. The only DOM facts taken are the ones that
   are not visible in pixels at all: how big the type is (WCAG's large-text
   budget), and its cascaded alpha (to tell reading from crossfading). */
const GEO = () => {
  const vw = innerWidth, vh = innerHeight;
  const clip = (r) => {
    const x = Math.max(0, Math.floor(r.left)), y = Math.max(0, Math.floor(r.top));
    const x2 = Math.min(vw, Math.ceil(r.right)), y2 = Math.min(vh, Math.ceil(r.bottom));
    return x2 - x < 4 || y2 - y < 4 ? null : { x, y, w: x2 - x, h: y2 - y };
  };
  /* A CLIENT RECT IS NOT WHERE THE GLYPHS ARE PAINTED. The masked-line
     reveal is `.lines .line { overflow: hidden }` around a span translated
     down 105% — so an unfired line's span reports a rect a whole line-height
     BELOW its own box, over ground it never touches, with nothing painted in
     it. Read literally that is a phantom string sitting on whatever happens
     to be down there, and it read 1.06:1. Every text rect is therefore
     intersected with the box of every ancestor that clips, which is the
     geometry the browser itself is using. */
  const clipToAncestors = (el, r) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      if (cs.overflow !== 'visible' || cs.overflowX !== 'visible' || cs.overflowY !== 'visible' || cs.clipPath !== 'none') {
        const b = n.getBoundingClientRect();
        const x = Math.max(r.left, b.left), y = Math.max(r.top, b.top);
        const x2 = Math.min(r.right, b.right), y2 = Math.min(r.bottom, b.bottom);
        if (x2 - x < 4 || y2 - y < 4) return null;
        r = { left: x, top: y, right: x2, bottom: y2 };
      }
      n = n.parentElement;
    }
    return r;
  };
  const figs = [...document.querySelectorAll('figure.fig')].map((f) => {
    const im = f.querySelector('img');
    if (!im || !im.complete || !im.naturalWidth) return null;
    const box = clip(f.getBoundingClientRect());
    return box ? { box, src: (im.getAttribute('src') || '').replace('/media/', '') } : null;
  }).filter(Boolean);

  /* The alpha DECLARED for the ink — needed for one thing only, below. */
  const alphaOf = (c) => {
    const m1 = c.match(/color\(\s*srgb\s+[\d.]+\s+[\d.]+\s+[\d.]+\s*\/\s*([\d.]+)/i);
    if (m1) return +m1[1];
    const m2 = c.match(/rgba?\(([^)]+)\)/i);
    if (m2) { const n = m2[1].split(/[\s,\/]+/).filter(Boolean); return n.length > 3 ? +n[3] : 1; }
    return 1;
  };

  const out = [];
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let t = walk.nextNode(); t; t = walk.nextNode()) {
    const str = (t.nodeValue || '').replace(/\s+/g, ' ').trim();
    if (!str) continue;
    const el = t.parentElement;
    if (!el || /^(script|style|noscript|title)$/i.test(el.tagName)) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden') continue;
    let eff = parseFloat(cs.opacity) || 0, n = el.parentElement, hidden = false;
    while (n && n !== document.documentElement) {
      const ac = getComputedStyle(n);
      if (ac.visibility === 'hidden') { hidden = true; break; }
      eff *= parseFloat(ac.opacity);
      n = n.parentElement;
    }
    if (hidden || !(eff > 0)) continue;

    const rng = document.createRange();
    rng.selectNodeContents(t);
    const rects = [...rng.getClientRects()].filter((q) => q.width > 4 && q.height > 4)
      .map((q) => clipToAncestors(el, { left: q.left, top: q.top, right: q.right, bottom: q.bottom }))
      .filter(Boolean).map(clip).filter(Boolean);
    rng.detach && rng.detach();
    if (!rects.length) continue;

    const big = rects.reduce((a, c) => (a.w * a.h >= c.w * c.h ? a : c));
    const over = figs.find((f) => !(big.x + big.w < f.box.x || big.x > f.box.x + f.box.w
                                || big.y + big.h < f.box.y || big.y > f.box.y + f.box.h));
    out.push({
      key: `${str.slice(0, 34)}|${Math.round(parseFloat(cs.fontSize))}`,
      sample: str.slice(0, 34), runs: rects, eff, colorAlpha: alphaOf(cs.color),
      chrome: !!el.closest('header,nav,[data-nav]'),
      over: over ? over.src : '',
      size: parseFloat(cs.fontSize), weight: cs.fontWeight,
    });
  }
  return out;
};

/* SCROLL-STILL IS NOT SETTLED. base.css makes `window.scrollTo` an animation,
   so every meter here waits for scrollY to stop — but the nav also carries
   460ms `transition: color` rules, and a frame taken 90ms after the scroll
   stops catches the wordmark half way between ink and cream (1.46:1, a
   picture of a crossfade, not a defect and not reproducible). So: wait for
   scrollY to stop AND for every finite animation and transition to finish.
   For THIS tool it matters twice over — the two frames of a pair must be
   identical in everything but the glyphs, and a running transition would put
   the difference somewhere else. */
async function settle(page, y) {
  await page.evaluate((y) => window.scrollTo({ top: y, left: 0, behavior: 'instant' }), y);
  await page.waitForFunction(() => new Promise((res) => {
    const a = window.scrollY;
    requestAnimationFrame(() => requestAnimationFrame(() => res(Math.abs(window.scrollY - a) < 0.5)));
  }), null, { timeout: 8000 }).catch(() => {});
  /* AND THE WAIT HAS TO BE STABLE, NOT MERELY SATISFIED ONCE. `data-reveal`
     is driven by an IntersectionObserver: the scroll lands, the observer
     fires on a later task, THEN a 600ms transition starts. A single "no
     animations running" check can pass in the gap between those two, and the
     frame is taken with a name at opacity 0.54 over its own ground — which
     is how a settled 5.21:1 photographs as 2.96:1. So: quiet, wait, quiet
     again, twice over. Everything on this site settles inside a second; a
     frame that will not go quiet is measured as it is rather than hung on. */
  for (let i = 0; i < 4; i++) {
    await page.waitForFunction(() => !document.getAnimations().some((a) => {
      if (a.playState !== 'running') return false;
      const t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null;
      return !t || t.iterations !== Infinity;
    }), null, { timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(180);
    const busy = await page.evaluate(() => document.getAnimations().some((a) => {
      if (a.playState !== 'running') return false;
      const t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null;
      return !t || t.iterations !== Infinity;
    })).catch(() => false);
    if (!busy) break;
  }
  await page.waitForTimeout(60);
}

const setMask = (page, on) => page.evaluate((on) => {
  const s = document.getElementById('__glyph_mask__');
  if (s) s.sheet.disabled = !on;
}, on);

/* One offset: the pair of frames, and every string measured by subtraction. */
async function frameAt(page, y, S) {
  await settle(page, y);
  const geo = await page.evaluate(GEO);
  if (!geo.length) return new Map();

  await setMask(page, false);
  const on = await sharp(await page.screenshot()).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  await setMask(page, true);
  const off = await sharp(await page.screenshot()).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = on.info.width, A = on.data, B = off.data;
  if (off.info.width !== W || off.info.height !== on.info.height) return new Map();

  const rows = new Map();
  for (const t of geo) {
    let best = null, unpainted = null;
    for (const cssR of t.runs) {
      const r = scaleRect(cssR, S); r.s = S;
      /* pass 1: the largest change anywhere in this run */
      let maxD = 0;
      for (let j = r.y; j < r.y + r.h; j++) {
        for (let i = r.x; i < r.x + r.w; i++) {
          const o = (j * W + i) * 3;
          const d = Math.max(Math.abs(A[o] - B[o]), Math.abs(A[o + 1] - B[o + 1]), Math.abs(A[o + 2] - B[o + 2]));
          if (d > maxD) maxD = d;
        }
      }
      /* NOTHING CHANGED means nothing is painted: the string is occluded by
         an opaque object in front of it, clipped away, or fully transparent.
         A reader does not see it, so there is no contrast to have — and this
         is the rule that ink-floor needed a hand-written fixed-bar exemption
         to approximate. */
      if (maxD < INK_FLOOR_DELTA) continue;

      /* pass 2: the stems, and how much of the box they are */
      const cut = maxD * CORE;
      let cr = 0, cg = 0, cb = 0, n = 0;
      for (let j = r.y; j < r.y + r.h; j++) {
        for (let i = r.x; i < r.x + r.w; i++) {
          const o = (j * W + i) * 3;
          const d = Math.max(Math.abs(A[o] - B[o]), Math.abs(A[o + 1] - B[o + 1]), Math.abs(A[o + 2] - B[o + 2]));
          if (d >= cut) { cr += A[o]; cg += A[o + 1]; cb += A[o + 2]; n++; }
        }
      }
      if (!n) continue;
      const inkY = Y(cr / n, cg / n, cb / n);
      const bandY = brightestBand(B, W, r);
      const cand = { ratio: contrast(inkY, bandY), inkL: Lstar(inkY), backdropL: Lstar(bandY),
                     cover: n / (r.w * r.h), maxD };
      /* The coverage backstop belongs to the MEASURING scale. At the cheap
         locate scale a 13px stem is one antialiased pixel and its core is a
         handful of pixels — coverage there runs an order of magnitude lower
         and the backstop would quietly drop half the small type on the page
         rather than the handful of clipped-shut phantoms it is for. Anything
         that survives the locate pass with a low reading is re-shot at the
         measuring scale, and the verdict it gets there is the one that
         counts, including a verdict of "painted nowhere". */
      if (S === SCALE && cand.cover < MIN_COVER) { if (!best) unpainted = cand; continue; }
      if (!best || cand.ratio < best.ratio) best = cand;
    }
    /* Painted nowhere: clipped shut, occluded, or fully transparent. Kept in
       the record so a string that vanishes cannot be confused with a string
       that was never looked at, but it carries no contrast and cannot fail. */
    if (!best) {
      if (unpainted) rows.set(t.key, { key: t.key, sample: t.sample, chrome: t.chrome, over: t.over,
        size: t.size, eff: t.eff, alpha: t.eff * t.colorAlpha, need: 0, y, unpainted: true, ratio: Infinity,
        inkL: unpainted.inkL, backdropL: unpainted.backdropL, cover: unpainted.cover, maxD: unpainted.maxD });
      continue;
    }
    const large = t.size >= 24 || (t.size >= 18.66 && Number(t.weight) >= 700);
    const row = { key: t.key, sample: t.sample, chrome: t.chrome, over: t.over,
      size: t.size, eff: t.eff, alpha: t.eff * t.colorAlpha, need: large ? 3 : 4.5, y, ...best };
    /* GLYPH_DEBUG=<substring of a key> prints the whole curve to stderr, one
       line per frame. A real defect holds across neighbouring offsets; an
       instrument artefact is one frame wide. */
    if (process.env.GLYPH_DEBUG && t.key.includes(process.env.GLYPH_DEBUG))
      console.error(`   dbg y=${y} ${t.key} ratio=${row.ratio.toFixed(3)} inkL=${row.inkL.toFixed(1)} bandL=${row.backdropL.toFixed(1)} cover=${row.cover.toFixed(3)} maxD=${row.maxD}`);
    const prev = rows.get(t.key);
    if (!prev || prev.unpainted || row.ratio < prev.ratio) rows.set(t.key, row);
  }
  return rows;
}

async function prepare(page, route) {
  await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate((css) => {
    const s = document.createElement('style');
    s.id = '__glyph_mask__';
    s.textContent = css;
    document.head.appendChild(s);
    s.sheet.disabled = true;
    document.documentElement.style.scrollBehavior = 'auto';
  }, MASK_CSS);
  await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  /* every lazy <img> has to have been in view once, or the sweep measures
     empty plates and calls them dark */
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += innerHeight * 0.9) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
}

async function sweepRoute(page, view, route) {
  await prepare(page, route);

  const H = view.vp.height;
  const span = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - innerHeight));
  const step = Math.max(40, Math.round(H / COARSE));

  const cache = new Map();
  const cacheSeen = new Set();
  let frames = 0;
  /* every reading of every string, kept, because whether a reading counts
     depends on the strongest reading that string ever gets — which is not
     known until the sweep is over */
  const hist = new Map();
  const record = (m) => {
    for (const [k, row] of m) {
      if (!hist.has(k)) hist.set(k, []);
      hist.get(k).push(row);
    }
  };
  const peakOf = (k) => hist.get(k).reduce((a, r) => Math.max(a, r.unpainted ? 0 : r.maxD), 0);
  /* the worst SETTLED reading: lowest ratio among readings painted at more
     than STRENGTH of this string's own strongest painting */
  const pick = (k) => {
    const rows = hist.get(k) || [];
    const peak = peakOf(k);
    const live = rows.filter((r) => !r.unpainted && (!peak || r.maxD >= peak * STRENGTH));
    if (!live.length) {
      /* Never arrives at half its own ink anywhere in the sweep: a string
         the design keeps in motion the whole way past. Reported, not failed. */
      const any = rows.filter((r) => !r.unpainted);
      if (!any.length) return rows[0] || null;
      return { ...any.reduce((a, r) => (r.ratio < a.ratio ? r : a)), inMotion: true };
    }
    return live.reduce((a, r) => (r.ratio < a.ratio ? r : a));
  };
  const at = async (y) => {
    y = Math.max(0, Math.min(span, Math.round(y)));
    if (cache.has(y)) return cache.get(y);
    const m = await frameAt(page, y, FIND_SCALE);
    cache.set(y, m); frames++;
    return m;
  };

  const ys = [];
  for (let y = 0; y <= span; y += step) ys.push(y);
  if (ys[ys.length - 1] !== span) ys.push(span);
  const seenAt = new Map();
  for (const y of ys) {
    const m = await at(y);
    record(m); cacheSeen.add(y);
    for (const [k, row] of m) {
      if (row.unpainted) continue;
      if (!seenAt.has(k)) seenAt.set(k, []);
      seenAt.get(k).push({ y, ratio: row.ratio, maxD: row.maxD });
    }
  }

  /* REFINE. A curve whose coarse floor is 2.5x its budget is not going to
     fall under the budget between two samples a fifth of a viewport apart —
     the ground would have to move ~40 L* inside one step and nothing here
     moves a tenth of that. */
  for (const [k, samples] of seenAt) {
    const coarseMin = pick(k);
    if (!coarseMin || coarseMin.unpainted) continue;
    if (coarseMin.ratio > coarseMin.need * 2.5) continue;
    /* bracket the worst SETTLED coarse sample, not simply the worst one, or
       every refinement budget goes into resolving crossfades to the pixel */
    const peak = peakOf(k);
    const ok = samples.filter((x) => !peak || x.maxD >= peak * STRENGTH);
    const pool = ok.length ? ok : samples;
    let idx = 0;
    for (let i = 1; i < pool.length; i++) if (pool[i].ratio < pool[idx].ratio) idx = i;
    const samplesIdx = samples.indexOf(pool[idx]);
    let lo = samples[Math.max(0, samplesIdx - 1)].y;
    let hi = samples[Math.min(samples.length - 1, samplesIdx + 1)].y;
    for (let round = 0; round < 6 && hi - lo > BRACKET_PX; round++) {
      const a = lo + (hi - lo) / 3, b2 = hi - (hi - lo) / 3;
      const pts = [];
      for (const y of [lo, a, b2, hi]) {
        const m = await at(y);
        if (!cacheSeen.has(y)) { record(m); cacheSeen.add(y); }
        const r = m.get(k);
        if (r && !r.unpainted && (!peak || r.maxD >= peak * STRENGTH)) pts.push({ y: Math.round(y), ratio: r.ratio });
      }
      if (pts.length < 2) break;
      let j = 0;
      for (let i = 1; i < pts.length; i++) if (pts[i].ratio < pts[j].ratio) j = i;
      const nlo = pts[Math.max(0, j - 1)].y, nhi = pts[Math.min(pts.length - 1, j + 1)].y;
      if (nhi - nlo < 2 || (nlo === lo && nhi === hi)) break;
      lo = nlo; hi = nhi;
    }
  }

  let rows = [...hist.keys()].map(pick).filter(Boolean)
    .map((r) => ({ ...r, view: view.tag, route, t: span ? r.y / span : 0,
                   strength: peakOf(r.key) ? r.maxD / peakOf(r.key) : 0 }));

  /* ── LOCATE CHEAP, MEASURE DEAR — OFF BY DEFAULT, AND HERE IS WHY ────
     `--find-scale=1` sweeps at 1x and re-shoots only each curve's argmin at
     3x. It is four times faster and it is WRONG, and the way it is wrong is
     worth keeping written down: the 1x antialiasing bias is not a constant
     per string, it depends on the ground. Cream ink loses to a dark ground
     and gains against a bright one, so the 1x curve is not the 3x curve
     shifted — it is a different shape, with its minimum somewhere else. Run
     that way, the site's own calibration string, the 11px "By invitation"
     eyebrow, was located at t 0.421 and reported at 8.50:1 while its real
     floor sits at t 0.582 and 4.5:1. A meter that misses the one number the
     project quotes is not a fast meter, it is a broken one.

     So the sweep runs at the measuring scale and this stays as an explicit
     opt-in for a quick look during development, never for a gate. */
  const suspect = rows.filter((r) => !r.unpainted && r.ratio <= r.need * 2.5);
  if (SCALE !== FIND_SCALE && suspect.length) {
    const ctx = await page.context().browser().newContext({
      viewport: view.vp, isMobile: !!view.mobile, hasTouch: !!view.mobile, deviceScaleFactor: SCALE,
    });
    const hi = await ctx.newPage();
    try {
      await prepare(hi, route);
      const byY = new Map();
      for (const r of suspect) { if (!byY.has(r.y)) byY.set(r.y, []); byY.get(r.y).push(r.key); }
      const fixed = new Map();
      for (const [y, keys] of byY) {
        const m = await frameAt(hi, y, SCALE);
        /* the 3x verdict wins, "painted nowhere" included: a wipe that is
           shut paints a few antialiased crumbs at 1x and nothing at 3x */
        for (const k of keys) { const q = m.get(k); if (q) fixed.set(k, q); }
      }
      rows = rows.map((r) => (fixed.has(r.key)
        ? { ...r, ...fixed.get(r.key), view: r.view, route: r.route, t: r.t, strength: r.strength, measuredAt: SCALE }
        : r));
    } finally { await hi.close(); await ctx.close(); }
  }
  rows.sort((a, b) => a.ratio - b.ratio);
  return { view: view.tag, route, frames, span, step, rows };
}

const jobs = [];
for (const view of VIEWS) for (const route of ROUTES) jobs.push({ view, route });

const browser = await launch({ proxy: false });
const results = new Array(jobs.length);
let next = 0;
await Promise.all(Array.from({ length: Math.max(1, Math.min(JOBS, jobs.length)) }, async () => {
  const ctxByTag = new Map();
  while (true) {
    const i = next++;
    if (i >= jobs.length) break;
    const { view, route } = jobs[i];
    if (!ctxByTag.has(view.tag)) {
      ctxByTag.set(view.tag, await browser.newContext({
        viewport: view.vp, isMobile: !!view.mobile, hasTouch: !!view.mobile, deviceScaleFactor: SCALE,
      }));
    }
    const page = await ctxByTag.get(view.tag).newPage();
    try { results[i] = await sweepRoute(page, view, route); }
    finally { await page.close(); }
  }
  for (const c of ctxByTag.values()) await c.close();
}));
await browser.close();

const all = results.filter(Boolean).flatMap((r) => r.rows);
const dark = all.filter((r) => r.unpainted);
const motion = all.filter((r) => r.inMotion && !r.unpainted);
const live = all.filter((r) => r.alpha >= MIN_OP && !r.unpainted && !r.inMotion);
const fails = live.filter((r) => r.ratio < r.need);
const frames = results.filter(Boolean).reduce((s, r) => s + r.frames, 0);
const thin = [...live].sort((a, b) => a.ratio - b.ratio);

if (asJson) {
  console.log(JSON.stringify({ base, frames, minOpacity: MIN_OP, rows: all }, null, 2));
} else {
  console.log(`glyph-floor · ${base} · ${frames} frame pairs · coarse vh/${COARSE} then trisected to ≤${BRACKET_PX}px · measured by subtraction · cascaded opacity ≥ ${MIN_OP}\n`);
  for (const r of results) {
    if (!r) continue;
    const shown = r.rows.filter((x) => x.eff >= MIN_OP && (showAll || x.ratio < x.need * 2));
    console.log(`${r.view.padEnd(8)} ${r.route.padEnd(12)} ${r.frames} pairs over ${r.span}px · ${r.rows.length} strings${shown.length ? '' : ' · nothing within 2x of budget'}`);
    for (const x of shown) {
      const ok = x.ratio >= x.need;
      console.log(`   ${ok ? 'ok  ' : 'FAIL'} ${x.ratio.toFixed(3).padStart(7)}:1 (needs ${x.need})  min at y ${String(x.y).padStart(5)} (t ${x.t.toFixed(3)})  ink L* ${x.inkL.toFixed(1).padStart(5)}  ground L* ${x.backdropL.toFixed(1).padStart(5)}  ${Math.round(x.size)}px  a ${x.alpha.toFixed(2)}  ${x.chrome ? '[bar] ' : ''}${x.over ? '' : '[flat] '}"${x.sample}"`);
    }
  }
  console.log(`\nthinnest type anywhere on the site:`);
  for (const x of thin.slice(0, 8)) {
    console.log(`   ${x.ratio.toFixed(3)}:1  ${Math.round(x.size)}px  ${x.view} ${x.route} t ${x.t.toFixed(3)}  ${x.over ? 'over ' + x.over : 'flat ground'}  "${x.sample}"`);
  }
  if (motion.length) {
    console.log(`\n${motion.length} string(s) never painted at half their own ink anywhere in the sweep — scroll-linked motion states, reported not failed. Worst:`);
    for (const x of [...motion].sort((a, b) => a.ratio - b.ratio).slice(0, 8))
      console.log(`   ${x.ratio.toFixed(3)}:1  ${Math.round(x.size)}px  ${x.view} ${x.route} t ${x.t.toFixed(3)}  ink at ${(x.strength * 100).toFixed(0)}% of its own  "${x.sample}"`);
  }
  if (dark.length) console.log(`\n${dark.length} string(s) painted nowhere at any offset (clipped, occluded or transparent throughout) — not measurable, not failures.`);
console.log(`\n${fails.length} failure(s) in ${live.length} curves across ${results.filter(Boolean).length} route-views.`);
}
process.exit(fails.length ? 1 : 0);
