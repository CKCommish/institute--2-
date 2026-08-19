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

const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const out = [];

for (const route of ROUTES) {
  await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);

  const count = await page.evaluate(() => document.querySelectorAll('figure.fig').length);
  for (let idx = 0; idx < count; idx++) {
    await page.evaluate((i) => {
      document.querySelectorAll('figure.fig')[i].scrollIntoView({ block: 'center', behavior: 'instant' });
    }, idx);
    /* lazy <img> only starts loading once the figure is in view, so state has
       to be read AFTER the scroll settles, not before it. Reading it first
       skipped every below-the-fold photograph on the site. */
    await page.waitForTimeout(1600);
    const info = await page.evaluate((i) => {
      const f = document.querySelectorAll('figure.fig')[i];
      const im = f.querySelector('img');
      return { state: f.dataset.state, complete: !!(im && im.complete && im.naturalWidth), src: im?.getAttribute('src') || null };
    }, idx);
    if (!info.complete || !info.src) continue;

    /* rects, plus every text element painted over this figure */
    const geo = await page.evaluate((i) => {
      const vw = innerWidth, vh = innerHeight;
      const clip = (r) => {
        const x = Math.max(0, Math.floor(r.left)), y = Math.max(0, Math.floor(r.top));
        const x2 = Math.min(vw, Math.ceil(r.right)), y2 = Math.min(vh, Math.ceil(r.bottom));
        return x2 - x < 4 || y2 - y < 4 ? null : { x, y, w: x2 - x, h: y2 - y };
      };
      const f = document.querySelectorAll('figure.fig')[i];
      const fr = clip(f.getBoundingClientRect());
      if (!fr) return null;
      const texts = [];
      /* A fill figure is the backdrop for its whole SCENE; a framed figure is
         the backdrop only for what is inside it. Anything else that merely
         overlaps in viewport coords is sitting on some other surface. The
         fixed bar is the exception: it really is painted over every figure
         it passes, so it is measured and flagged as chrome. */
      const fill = f.classList.contains('fig--fill');
      const scope = fill ? (f.parentElement || f) : f;
      document.querySelectorAll('h1,h2,h3,h4,p,li,span,a,dt,dd,figcaption,strong,em,time').forEach((el) => {
        const chrome = !!el.closest('header,nav,[data-nav]');
        if (!chrome && !scope.contains(el)) return;
        if (chrome && !fill) return;
        el.__chrome = chrome;
        const t = (el.textContent || '').trim();
        if (!t || el.children.length > 2 && el.querySelector('h1,h2,h3,p,li')) return;
        const r = el.getBoundingClientRect();
        if (r.width < 8 || r.height < 6) return;
        // must overlap the figure box
        if (r.right < fr.x || r.left > fr.x + fr.w || r.bottom < fr.y || r.top > fr.y + fr.h) return;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.opacity === '0') return;
        // only type that has the FIGURE as its visual backdrop (no opaque bg between)
        let n = el, opaque = false;
        while (n && n !== document.body) {
          const bg = getComputedStyle(n).backgroundColor;
          const a = bg.match(/[\d.]+\)$/);
          if (bg !== 'rgba(0, 0, 0, 0)' && !(a && parseFloat(a[0]) === 0)) {
            if (!/, 0\)$/.test(bg)) { opaque = true; break; }
          }
          n = n.parentElement;
        }
        if (opaque) return;
        /* A <p> is as wide as its column, not as wide as its words. Measuring
           the element box sampled 700px of open photograph beside a 200px
           line and reported the brightest thing in the paragraph's gutter as
           the backdrop. Range rects give the inked runs only. */
        const rng = document.createRange();
        rng.selectNodeContents(el);
        const runs = [...rng.getClientRects()].filter((q) => q.width > 4 && q.height > 4);
        rng.detach?.();
        const boxes = (runs.length ? runs : [r]).map(clip).filter(Boolean);
        if (!boxes.length) return;
        const rr = boxes.reduce((a, c) => (a.w * a.h >= c.w * c.h ? a : c));
        const cx = Math.round(((r.left + r.right) / 2 - fr.x) / fr.w * 100);
        const cy = Math.round(((r.top + r.bottom) / 2 - fr.y) / fr.h * 100);
        texts.push({ rect: rr, runs: boxes, at: `${cx}%,${cy}%`, chrome: !!el.__chrome, color: cs.color, size: parseFloat(cs.fontSize), weight: cs.fontWeight, sample: t.slice(0, 30) });
      });
      return { fig: fr, texts };
    }, idx);
    if (!geo) continue;

    const shotA = await page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } });
    const A = await sharp(shotA).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const figStats = stats(A.data, A.info.width, geo.fig);

    /* hide the type and re-shoot, so we measure the PICTURE under it */
    let typeRows = [];
    if (geo.texts.length) {
      await page.evaluate(() => {
        document.querySelectorAll('h1,h2,h3,h4,p,li,span,a,dt,dd,figcaption,strong,em,time')
          .forEach((el) => { el.style.setProperty('visibility', 'hidden', 'important'); });
      });
      await page.waitForTimeout(120);
      const shotB = await page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } });
      const B = await sharp(shotB).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      for (const t of geo.texts) {
        const c = parseColor(t.color); if (!c) continue;
        const bandY = Math.max(...t.runs.map((q) => brightestBand(B.data, B.info.width, q)));
        // composite semi-transparent type over that band's colour
        const bandRGB = 255 * ((bandY <= 0.0031308) ? bandY * 12.92 : 1.055 * bandY ** (1 / 2.4) - 0.055);
        const fg = [0, 1, 2].map((k) => c[k] * c[3] + bandRGB * (1 - c[3]));
        const cr = contrast(Y(fg[0], fg[1], fg[2]), bandY);
        const large = t.size >= 24 || (t.size >= 18.66 && Number(t.weight) >= 700);
        typeRows.push({ sample: t.sample, at: t.at, chrome: t.chrome, size: Math.round(t.size), ratio: +cr.toFixed(2), need: large ? 3 : 4.5, backdropL: +Lstar(bandY).toFixed(1) });
      }
      await page.evaluate(() => {
        document.querySelectorAll('[style]').forEach((el) => el.style.removeProperty('visibility'));
      });
    }
    /* A whole-frame mean hides the failure mode: a full-width bottom ramp can
       erase the half of the picture the SUBJECT is in while the sky above it
       keeps the average respectable. Bands are the honest number. Quarters,
       vertical, plus left/right halves of the bottom quarter — that is where
       both the ramp and the type live. */
    const band = (fx, fy, fw, fh) => stats(A.data, A.info.width, {
      x: geo.fig.x + Math.floor(geo.fig.w * fx), y: geo.fig.y + Math.floor(geo.fig.h * fy),
      w: Math.max(1, Math.floor(geo.fig.w * fw)), h: Math.max(1, Math.floor(geo.fig.h * fh)),
    });
    const bands = {
      q1: band(0, 0, 1, 0.25), q2: band(0, 0.25, 1, 0.25),
      q3: band(0, 0.5, 1, 0.25), q4: band(0, 0.75, 1, 0.25),
      q4L: band(0, 0.75, 0.4, 0.25), q4R: band(0.6, 0.75, 0.4, 0.25),
    };
    out.push({ route, src: info.src, box: `${geo.fig.w}x${geo.fig.h}`, ...figStats, sep: +(figStats.meanL - GROUND_L).toFixed(1), bands, type: typeRows });
  }
}
await b.close();

if (asJson) console.log(JSON.stringify({ ground: +GROUND_L.toFixed(2), figures: out }, null, 2));
else {
  console.log(`ground (--ink-900) L* = ${GROUND_L.toFixed(1)}\n`);
  let fails = 0, seps = [];
  for (const f of out) {
    seps.push(f.sep);
    console.log(`${f.route.padEnd(12)} ${f.src.replace('/media/', '').padEnd(26)} ${f.box.padEnd(10)} meanL* ${f.meanL.toFixed(1).padStart(5)}  sep +${f.sep.toFixed(1).padStart(4)}  p05 ${f.p05.toFixed(1).padStart(4)}  p95 ${f.p95.toFixed(1).padStart(5)}`);
    const B = f.bands;
    console.log(`   bands  top ${B.q1.meanL.toFixed(1).padStart(5)} · ${B.q2.meanL.toFixed(1).padStart(5)} · ${B.q3.meanL.toFixed(1).padStart(5)} · ${B.q4.meanL.toFixed(1).padStart(5)} bottom   |  bottom-left ${B.q4L.meanL.toFixed(1).padStart(5)}   bottom-right ${B.q4R.meanL.toFixed(1).padStart(5)}`);
    for (const t of f.type) {
      const ok = t.ratio >= t.need;
      if (!ok) fails++;
      console.log(`   ${ok ? 'ok  ' : 'FAIL'} ${String(t.ratio).padStart(6)}:1 (needs ${t.need})  backdrop L* ${String(t.backdropL).padStart(5)}  at ${t.at.padEnd(9)} ${t.size}px ${t.chrome ? '[bar] ' : ''}"${t.sample}"`);
    }
  }
  const mean = seps.reduce((a, c) => a + c, 0) / (seps.length || 1);
  console.log(`\n${out.length} photographs · mean separation from ground +${mean.toFixed(1)} L* · min +${Math.min(...seps).toFixed(1)} · max +${Math.max(...seps).toFixed(1)}`);
  console.log(`${fails} type-over-photograph contrast failure(s).`);
}
