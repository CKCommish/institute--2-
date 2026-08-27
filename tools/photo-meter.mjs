/* photo-meter — the two numbers the grade has to satisfy at once.
   audit.mjs walks the DOM for a text element's background colour, so for type
   sitting on a full-bleed photograph it measures cream against --ink-900 and
   reports a pass no matter what the picture is doing. This measures PIXELS.

   For every <figure class="fig"> that actually has a photograph loaded:
     PICTURE  mean / p05 / p95 CIE L* of the rendered figure, and the tonal
              range that survives the grade. Ground (--ink-900) is L* 3.5, so
              "mean L* 9" is the critic's "within seven luminance points of
              blank background".
     TYPE     every text element overlapping that figure is hidden, the patch
              of photograph BEHIND it is re-shot, and the text colour is
              measured against the BRIGHTEST band in that patch — the worst
              case a reader actually meets.

   usage: BASE=http://127.0.0.1:4399 node tools/photo-meter.mjs [--json] */
import { launch } from './browser.mjs';
import sharp from 'sharp';

const base = process.env.BASE || 'http://127.0.0.1:4399';
const ROUTES = (process.env.ROUTES || '/,/pilots/,/institute/,/forum/,/people/,/partner/').split(',');
const asJson = process.argv.includes('--json');

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const Y = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const Lstar = (y) => (y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y);
const contrast = (y1, y2) => { const [a, b] = y1 > y2 ? [y1, y2] : [y2, y1]; return (a + 0.05) / (b + 0.05); };
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

/* worst case for cream type: the brightest row-band under the glyphs. Type is
   read line by line, so a single blown highlight matters less than a bright
   BAND; average each row, take the brightest row. */
function brightestBand(raw, W, rect) {
  const { x, y, w, h } = rect;
  let best = 0;
  for (let j = y; j < y + h; j++) {
    let s = 0;
    for (let i = x; i < x + w; i++) {
      const o = (j * W + i) * 3;
      s += Y(raw[o], raw[o + 1], raw[o + 2]);
    }
    best = Math.max(best, s / w);
  }
  return best;
}

const parseColor = (s) => {
  const m1 = s.match(/color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?/i);
  if (m1) return [+m1[1] * 255, +m1[2] * 255, +m1[3] * 255, m1[4] === undefined ? 1 : +m1[4]];
  const m2 = s.match(/rgba?\(([^)]+)\)/i);
  if (m2) { const n = m2[1].split(/[\s,\/]+/).filter(Boolean).map(Number); return [n[0], n[1], n[2], n[3] ?? 1]; }
  return null;
};

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
/* Where in the viewport the figure's centre is parked. A parallax plate is a
   different picture at each of these. */
const STOPS = [0.88, 0.68, 0.5, 0.32, 0.12];

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

const MASK = `*, *::before, *::after { color: transparent !important;
  -webkit-text-fill-color: transparent !important; text-shadow: none !important; }`;

const b = await launch({ proxy: false });

const out = [];

/* Which text is sitting on THIS figure, and where its glyphs actually are.
   Runs are text-node ranges: a <p> is as wide as its column, not as wide as
   its words, and the element box sampled 700px of open photograph beside a
   200px line. */
const GEO = (i) => {
  const vw = innerWidth, vh = innerHeight;
  const clip = (r) => {
    const x = Math.max(0, Math.floor(r.left)), y = Math.max(0, Math.floor(r.top));
    const x2 = Math.min(vw, Math.ceil(r.right)), y2 = Math.min(vh, Math.ceil(r.bottom));
    return x2 - x < 4 || y2 - y < 4 ? null : { x, y, w: x2 - x, h: y2 - y };
  };
  const f = document.querySelectorAll('figure.fig')[i];
  if (!f) return null;
  const fr = clip(f.getBoundingClientRect());
  if (!fr) return null;
  /* A fill figure is the backdrop for its whole SCENE; a framed figure is the
     backdrop only for what is inside it. The fixed bar is the exception: it
     really is painted over every figure it passes, so it is measured and
     flagged as chrome. */
  const fill = f.classList.contains('fig--fill');
  const scope = fill ? (f.parentElement || f) : f;
  const texts = [];
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let t = walk.nextNode(); t; t = walk.nextNode()) {
    const str = (t.nodeValue || '').replace(/\s+/g, ' ').trim();
    if (!str) continue;
    const el = t.parentElement;
    if (!el || /^(script|style|noscript|title)$/i.test(el.tagName)) continue;
    const chrome = !!el.closest('header,nav,[data-nav]');
    if (!chrome && !scope.contains(el)) continue;
    if (chrome && !fill) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) continue;
    let a = el.parentElement, dead = false;
    while (a && a !== document.documentElement) {
      const ac = getComputedStyle(a);
      if (ac.visibility === 'hidden' || parseFloat(ac.opacity) === 0) { dead = true; break; }
      a = a.parentElement;
    }
    if (dead) continue;
    /* THE JAW THAT CLOSED ON THIS METER. The old walk broke out on any
       background colour that was not literally transparent — alpha included —
       so a rgba(255,255,255,0.35) panel over a photograph took its type off
       the list entirely and the figure reported clean. An alpha under 1 is not
       a ground: the photograph is still showing through it. Keep walking, and
       let the screenshot (which has the panel composited over the picture in
       it, exactly as the reader sees) supply the number. */
    let n = chrome ? null : el, opaque = false;
    while (n && n !== document.body) {
      /* Reaching the FIGURE means nothing opaque came between: the picture is
         the ground. The walk used to run past it to the page plate, whose own
         background is opaque, so a translucent panel INSIDE a figure was
         thrown out as "sitting on some other surface" — the judge's trap
         element, dropped by the very check meant to find it. Chrome is over
         the figure rather than inside it, so it never walks at all. */
      if (n === f) break;
      const bg = getComputedStyle(n).backgroundColor;
      const m = bg.match(/rgba?\(([^)]+)\)/);
      if (m) {
        const parts = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
        const alpha = parts.length > 3 ? parts[3] : 1;
        if (alpha >= 1) { opaque = true; break; }
      }
      n = n.parentElement;
    }
    if (opaque) continue;
    const rng = document.createRange();
    rng.selectNodeContents(t);
    const raw = [...rng.getClientRects()].filter((q) => q.width > 4 && q.height > 4);
    rng.detach?.();
    const boxes = raw.map(clip).filter(Boolean)
      .filter((q) => !(q.x + q.w < fr.x || q.x > fr.x + fr.w || q.y + q.h < fr.y || q.y > fr.y + fr.h));
    if (!boxes.length) continue;
    const rr = boxes.reduce((a, c) => (a.w * a.h >= c.w * c.h ? a : c));
    const cx = Math.round((rr.x + rr.w / 2 - fr.x) / fr.w * 100);
    const cy = Math.round((rr.y + rr.h / 2 - fr.y) / fr.h * 100);
    texts.push({ rect: rr, runs: boxes, at: `${cx}%,${cy}%`, chrome,
      color: cs.color, size: parseFloat(cs.fontSize), weight: cs.fontWeight, sample: str.slice(0, 30) });
  }
  return { fig: fr, texts };
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

      /* TYPE, swept. The plate moves inside its frame as the page scrolls, so
         the band of photograph under a line of type is a different band at
         every stop. Keep the worst each string ever meets. */
      const worst = new Map();
      for (const frac of STOPS) {
        await park(page, idx, frac);
        await page.waitForTimeout(220);
        const geo = await page.evaluate(GEO, idx);
        if (!geo || !geo.texts.length) continue;
        await page.evaluate((css) => {
          const st = document.createElement('style');
          st.id = '__pm_mask'; st.textContent = css; document.head.appendChild(st);
        }, MASK);
        await page.waitForTimeout(110);
        const shotB = await page.screenshot({ clip: clipBox });
        await page.evaluate(() => document.getElementById('__pm_mask')?.remove());
        const B = await sharp(shotB).removeAlpha().raw().toBuffer({ resolveWithObject: true });
        for (const t of geo.texts) {
          const c = parseColor(t.color); if (!c) continue;
          const bandY = Math.max(...t.runs.map((q) => brightestBand(B.data, B.info.width, q)));
          const bandRGB = 255 * ((bandY <= 0.0031308) ? bandY * 12.92 : 1.055 * bandY ** (1 / 2.4) - 0.055);
          const fg = [0, 1, 2].map((k) => c[k] * c[3] + bandRGB * (1 - c[3]));
          const cr = contrast(Y(fg[0], fg[1], fg[2]), bandY);
          const large = t.size >= 24 || (t.size >= 18.66 && Number(t.weight) >= 700);
          const row = { sample: t.sample, at: t.at, chrome: t.chrome, size: Math.round(t.size),
            ratio: +cr.toFixed(2), need: large ? 3 : 4.5, backdropL: +Lstar(bandY).toFixed(1), stop: frac };
          const k = `${t.sample}|${row.size}`;
          const prev = worst.get(k);
          if (!prev || row.ratio < prev.ratio) worst.set(k, row);
        }
      }
      out.push({ view: view.tag, route, src: info.src, box: `${geoC.fig.w}x${geoC.fig.h}`,
        ...figStats, sep: +(figStats.meanL - GROUND_L).toFixed(1), bands, type: [...worst.values()] });
    }
  }
  await ctx.close();
}
await b.close();

if (asJson) console.log(JSON.stringify({ ground: +GROUND_L.toFixed(2), figures: out }, null, 2));
else {
  console.log(`ground (--ink-900) L* = ${GROUND_L.toFixed(1)}\n`);
  let fails = 0, seps = [];
  for (const f of out) {
    seps.push(f.sep);
    console.log(`${f.view.padEnd(8)} ${f.route.padEnd(12)} ${f.src.replace('/media/', '').padEnd(26)} ${f.box.padEnd(10)} meanL* ${f.meanL.toFixed(1).padStart(5)}  sep +${f.sep.toFixed(1).padStart(4)}  p05 ${f.p05.toFixed(1).padStart(4)}  p95 ${f.p95.toFixed(1).padStart(5)}`);
    const B = f.bands;
    console.log(`   bands  top ${B.q1.meanL.toFixed(1).padStart(5)} · ${B.q2.meanL.toFixed(1).padStart(5)} · ${B.q3.meanL.toFixed(1).padStart(5)} · ${B.q4.meanL.toFixed(1).padStart(5)} bottom   |  bottom-left ${B.q4L.meanL.toFixed(1).padStart(5)}   bottom-right ${B.q4R.meanL.toFixed(1).padStart(5)}`);
    for (const t of f.type) {
      const ok = t.ratio >= t.need;
      if (!ok) fails++;
      console.log(`   ${ok ? 'ok  ' : 'FAIL'} ${String(t.ratio).padStart(6)}:1 (needs ${t.need})  backdrop L* ${String(t.backdropL).padStart(5)}  at ${t.at.padEnd(9)} ${t.size}px ${t.chrome ? '[bar] ' : ''}"${t.sample}"`);
    }
  }
  const mean = seps.reduce((a, c) => a + c, 0) / (seps.length || 1);
  console.log(`\n${out.length} photograph-views (each route x 2 viewports, swept through the frame) · mean separation from ground +${mean.toFixed(1)} L* · min +${Math.min(...seps).toFixed(1)} · max +${Math.max(...seps).toFixed(1)}`);
  console.log(`${fails} type-over-photograph contrast failure(s).`);
}
