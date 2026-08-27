/* photo-meter — how the house grade is sitting on each photograph.

   For every <figure class="fig"> that actually has a photograph loaded:
     mean / p05 / p95 CIE L* of the rendered figure, and the tonal range that
     survives the grade, in four horizontal bands plus the two bottom corners.
     Ground (--ink-900) is L* 3.5, so "mean L* 9" is the critic's "within
     seven luminance points of blank background".

   ── WHAT THIS TOOL NO LONGER DOES, AND WHY ───────────────────────────────
   It used to also measure TYPE over photographs, and it was wrong about it in
   a way that took three waves to run down. It composited the ink from the
   element's own colour alpha only — `fg = c*a + bg*(1-a)` — with no term for
   `opacity` on the element or any ancestor, so a held beat at --be 0.55 was
   read as fully inked cream: 7.19:1 for a string that a cascading meter read
   at 4.17. It also parked each FIGURE at five fractions of the viewport,
   which on a `position: sticky` stage is not five positions but one, so it
   stepped past the shoulder of every held arc. On the site's thinnest string
   it reported 9.38:1 against a true 4.563.

   `tools/glyph-floor.mjs` measures that quantity by subtraction — the ink is
   read off the glass instead of being modelled — for every string on the
   site, not only strings over photographs, minimised over scroll rather than
   sampled. It is a strict superset of what this tool measured about type and
   it has no compositing model to be wrong. So the type half is gone rather
   than kept as a second opinion: two meters with different blind spots
   answering the same question is how 9.38, 7.19, 4.70 and 4.17 all got
   quoted for one piece of type.

   The grade half stays because nothing else answers it: "how far off the
   ground is this picture sitting, and is the bottom-left corner where the
   caption goes brighter than the frame as a whole" is a question about the
   PICTURE, not about any type on it. It has never had a pass/fail threshold
   and it does not have one now — it is a diagnostic, and it is not in
   `tools/gates.mjs`.

   usage: BASE=http://127.0.0.1:4399 node tools/photo-meter.mjs [--json] */
import { launch } from './browser.mjs';
import sharp from 'sharp';

const base = process.env.BASE || 'http://127.0.0.1:4399';
const ROUTES = (process.env.ROUTES || '/,/pilots/,/institute/,/forum/,/people/,/partner/').split(',');
const asJson = process.argv.includes('--json');

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const Y = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const Lstar = (y) => (y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y);
const GROUND_L = Lstar(Y(5, 13, 22));   // --ink-900

const pct = (arr, p) => arr[Math.min(arr.length - 1, Math.max(0, Math.round((arr.length - 1) * p)))];

/* mean/percentile L* over a rect of a raw RGB buffer */
function stats(raw, W, rect) {
  const { x, y, w, h } = rect;
  const ls = [];
  let sy = 0, n = 0;
  for (let j = y; j < y + h; j++) {
    for (let i = x; i < x + w; i++) {
      const o = (j * W + i) * 3;
      const yy = Y(raw[o], raw[o + 1], raw[o + 2]);
      sy += yy; n++;
      ls.push(Lstar(yy));
    }
  }
  if (!n) return null;
  ls.sort((a, b) => a - b);
  return { meanL: Lstar(sy / n), p05: pct(ls, 0.05), p50: pct(ls, 0.5), p95: pct(ls, 0.95), n };
}

/* WHAT THIS METER USED TO MISS, AND WHY.

   Wave 9 verified two holes in it against the real site.

   ONE VIEWPORT. It ran at 1440x900 only, while the site's tightest
   type-over-photograph is an 11px eyebrow on MOBILE. A grade that holds at
   1440 says nothing about a picture cropped to 390.

   ONE SCROLL POSITION. Every figure was measured once, with the figure
   centred. But a `data-parallax` plate MOVES inside its frame: the band of
   photograph under a line of type at one scroll offset is not the band under
   it at the next. On the homepage's "By invitation" this meter reported
   9.38:1 where a swept measurement gives 5.94:1 desktop and 4.69:1 mobile —
   AA by 0.19 on the site's most exposed piece of type, overstated by 58%.

   And one more, found while fixing those: the walk that decided whether a
   text element has the FIGURE as its backdrop treated any background colour
   that was not literally transparent as opaque, alpha included. So a
   translucent panel over a photograph took its type OFF this meter's list
   entirely — the exact element audit.mjs also gets wrong. Alpha < 1 is not a
   ground; keep walking, and let the pixels answer.  */

const VIEWS = [
  { tag: 'desktop', vp: { width: 1440, height: 900 } },
  { tag: 'mobile', vp: { width: 390, height: 844 }, mobile: true },
];
/* base.css sets scroll-behavior:smooth, so a scroll is an ANIMATION and a
   fixed wait measures a moving page. Park it, then wait for it to stop. */
async function park(page, idx, frac) {
  await page.evaluate(([i, f]) => {
    const el = document.querySelectorAll('figure.fig')[i];
    if (!el) return;
    const r = el.getBoundingClientRect();
    const target = window.scrollY + r.top + r.height / 2 - innerHeight * f;
    window.scrollTo({ top: Math.max(0, target), left: 0, behavior: 'instant' });
  }, [idx, frac]);
  let last = null;
  for (let k = 0; k < 20; k++) {
    await page.waitForTimeout(60);
    const now = await page.evaluate(() => Math.round(window.scrollY));
    if (now === last) break;
    last = now;
  }
}

const b = await launch({ proxy: false });

const out = [];

/* The figure's box in the viewport, clipped to it. */
const GEO = (i) => {
  const vw = innerWidth, vh = innerHeight;
  const f = document.querySelectorAll('figure.fig')[i];
  if (!f) return null;
  const r = f.getBoundingClientRect();
  const x = Math.max(0, Math.floor(r.left)), y = Math.max(0, Math.floor(r.top));
  const x2 = Math.min(vw, Math.ceil(r.right)), y2 = Math.min(vh, Math.ceil(r.bottom));
  return x2 - x < 4 || y2 - y < 4 ? null : { fig: { x, y, w: x2 - x, h: y2 - y } };
};

for (const view of VIEWS) {
  const ctx = await b.newContext({ viewport: view.vp, isMobile: !!view.mobile, hasTouch: !!view.mobile, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const clipBox = { x: 0, y: 0, width: view.vp.width, height: view.vp.height };

  for (const route of ROUTES) {
    await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);

    const count = await page.evaluate(() => document.querySelectorAll('figure.fig').length);
    for (let idx = 0; idx < count; idx++) {
      /* lazy <img> only starts loading once the figure is in view, so state
         has to be read AFTER the scroll settles, not before it. Reading it
         first skipped every below-the-fold photograph on the site. */
      await park(page, idx, 0.5);
      await page.waitForTimeout(1600);
      const info = await page.evaluate((i) => {
        const f = document.querySelectorAll('figure.fig')[i];
        const im = f && f.querySelector('img');
        return { complete: !!(im && im.complete && im.naturalWidth), src: im?.getAttribute('src') || null };
      }, idx);
      if (!info.complete || !info.src) continue;

      /* PICTURE stats, read with the figure centred. */
      const geoC = await page.evaluate(GEO, idx);
      if (!geoC) continue;
      const shotA = await page.screenshot({ clip: clipBox });
      const A = await sharp(shotA).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      const figStats = stats(A.data, A.info.width, geoC.fig);
      /* A whole-frame mean hides the failure mode: a full-width bottom ramp
         can erase the half of the picture the SUBJECT is in while the sky
         above keeps the average respectable. Bands are the honest number. */
      const band = (fx, fy, fw, fh) => stats(A.data, A.info.width, {
        x: geoC.fig.x + Math.floor(geoC.fig.w * fx), y: geoC.fig.y + Math.floor(geoC.fig.h * fy),
        w: Math.max(1, Math.floor(geoC.fig.w * fw)), h: Math.max(1, Math.floor(geoC.fig.h * fh)),
      });
      const bands = {
        q1: band(0, 0, 1, 0.25), q2: band(0, 0.25, 1, 0.25),
        q3: band(0, 0.5, 1, 0.25), q4: band(0, 0.75, 1, 0.25),
        q4L: band(0, 0.75, 0.4, 0.25), q4R: band(0.6, 0.75, 0.4, 0.25),
      };

      out.push({ view: view.tag, route, src: info.src, box: `${geoC.fig.w}x${geoC.fig.h}`,
        ...figStats, sep: +(figStats.meanL - GROUND_L).toFixed(1), bands });
    }
  }
  await ctx.close();
}
await b.close();

if (asJson) console.log(JSON.stringify({ ground: +GROUND_L.toFixed(2), figures: out }, null, 2));
else {
  console.log(`ground (--ink-900) L* = ${GROUND_L.toFixed(1)}\n`);
  const seps = [];
  for (const f of out) {
    seps.push(f.sep);
    console.log(`${f.view.padEnd(8)} ${f.route.padEnd(12)} ${f.src.replace('/media/', '').padEnd(26)} ${f.box.padEnd(10)} meanL* ${f.meanL.toFixed(1).padStart(5)}  sep +${f.sep.toFixed(1).padStart(4)}  p05 ${f.p05.toFixed(1).padStart(4)}  p95 ${f.p95.toFixed(1).padStart(5)}`);
    const B = f.bands;
    console.log(`   bands  top ${B.q1.meanL.toFixed(1).padStart(5)} · ${B.q2.meanL.toFixed(1).padStart(5)} · ${B.q3.meanL.toFixed(1).padStart(5)} · ${B.q4.meanL.toFixed(1).padStart(5)} bottom   |  bottom-left ${B.q4L.meanL.toFixed(1).padStart(5)}   bottom-right ${B.q4R.meanL.toFixed(1).padStart(5)}`);
  }
  const mean = seps.reduce((a, c) => a + c, 0) / (seps.length || 1);
  console.log(`\n${out.length} photograph-views (each route x 2 viewports, figure centred) · mean separation from ground +${mean.toFixed(1)} L* · min +${Math.min(...seps).toFixed(1)} · max +${Math.max(...seps).toFixed(1)}`);
  console.log(`Type over these photographs is measured by tools/glyph-floor.mjs, not here.`);
}
