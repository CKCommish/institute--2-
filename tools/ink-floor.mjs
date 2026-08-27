/* ink-floor — the MINIMUM of every type-over-photograph contrast curve.

   ── WHY A THIRD INSTRUMENT, AND WHAT WAS WRONG WITH THE OTHER TWO ────────
   The site's thinnest number — the 11px "By invitation" eyebrow on the
   homepage's held Forum figure — has been quoted three times and been wrong
   twice: 9.38:1, then 4.70:1, then 4.563:1. Every correction came from
   sampling more densely. Nothing here was ever a gate on it.

     photo-meter  parks a FIGURE at five fractions of the viewport height and
                  reads the pixels there. On a `position: sticky` held stage
                  that is not five positions: the figure does not move when
                  the page scrolls, so `scrollY + top + h/2 - vh*f` resolves
                  to the same offset every time and its five stops collapse
                  to roughly one. It samples a pinned scene at whatever
                  offset the previous figure left it at, and it steps past
                  the shoulder of the arc entirely.
                  It also composites the type with the element's own colour
                  alpha ONLY — `fg = c*a + bg*(1-a)` — ignoring `opacity` on
                  the element and every ancestor. A beat at --be 0.55 is read
                  as fully inked cream. That is the 7.19:1 reading.

     hold-meter   sweeps the pinned range properly and DOES cascade opacity,
                  so it reads the same string mid-fade at 4.17:1. It is the
                  more honest instrument of the two. But it samples 17 evenly
                  spaced positions and the minimum falls between them, and it
                  only looks at one [data-hold] scene on one route.

   So they were not measuring the same quantity, and neither was wrong about
   the quantity it measured: photo-meter's 7.19 is "cream ink on that ground",
   hold-meter's 4.17 is "the ink actually on the glass at that instant".
   THE HONEST ONE IS THE CASCADED ONE — a reader looking at a 55%-opacity
   line sees 55% of the ink — and photo-meter's blindness to ancestor opacity
   is a real defect in it, not a difference of convention. The swept meter was
   never a superset of the static one either: hold-meter skips anything under
   `minOpacity` and looks at one scene, so a fully-opaque string on a figure
   photo-meter covers is outside its sweep.

   This tool is not a fourth opinion. It measures ONE quantity — cascaded
   effective ink against the brightest row-band of what is actually painted
   behind the glyphs — for EVERY string that crosses a photograph on EVERY
   route at BOTH viewports, and it does not sample the curve: it MINIMISES it.

   ── HOW IT FINDS A MINIMUM RATHER THAN SAMPLING ONE ──────────────────────
   A uniform sweep dense enough to catch a 0.06 margin is unaffordable: the
   eyebrow's curve floors at t≈0.275 of a 2.5-viewport pin, and resolving
   that to a pixel by uniform steps is thousands of screenshots. So:

     COARSE   the whole document at vh/5, which is fine enough that no
              contrast curve on this site changes direction inside one step
              (the ground under a held beat moves ~30 L* over 2.5 viewports;
              one step is under 3 L*).
     REFINE   per string, bracket its coarse argmin with its two neighbours
              and trisect, keeping the sub-bracket that contains the smallest
              value, until the bracket is under 8px — 6 rounds, resolution
              step/27 ≈ 7px. Non-adaptive uniform sampling would need ~50x
              the frames for the same resolution.

   Every frame is memoised by scroll offset, so the refinements of every
   string on a route share screenshots wherever their brackets overlap. The
   homepage costs ~60 frames per viewport to resolve ~20 curves to 7px.

   ── HOW THE GLYPHS ARE TAKEN OFF THE GLASS ───────────────────────────────
   `-webkit-text-fill-color: transparent`, not `color`, and not `visibility`.
   `color` would take every currentColor rule with it AND would make the real
   colour unreadable through getComputedStyle; hiding elements takes their
   ::before washes with them, which is the trap credit-sweep.mjs fell into —
   removing the very protection you are measuring. Fill colour alone leaves
   every painted layer, every wash and every computed value intact, and it
   can therefore stay installed for the whole sweep instead of being toggled
   per frame.

   usage: BASE=http://127.0.0.1:4399 node tools/ink-floor.mjs [--json]
          [--routes=/,/forum/] [--views=desktop,mobile] [--min-opacity=0.5]
          [--jobs=4] [--coarse=5]     (coarse = steps per viewport height) */
import { launch } from './browser.mjs';
import sharp from 'sharp';

const base = process.env.BASE || 'http://127.0.0.1:4399';
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const asJson = process.argv.includes('--json');
const ROUTES = arg('routes', process.env.ROUTES || '/,/pilots/,/institute/,/forum/,/people/,/partner/').split(',').filter(Boolean);
const VIEW_TAGS = arg('views', 'desktop,mobile').split(',');
/* Below this cascaded alpha a string is mid-crossfade rather than being read.
   HeldScene's own rule is that small type never crosses at partial alpha at
   all — it wipes — so anything small found under this threshold is a defect
   in that rule, and --min-opacity=0.01 is how you look for one. */
const MIN_OP = Number(arg('min-opacity', '0.5'));
const JOBS = Number(arg('jobs', '4'));
const COARSE = Number(arg('coarse', '5'));
const BRACKET_PX = 8;

const VIEWS = [
  { tag: 'desktop', vp: { width: 1440, height: 900 } },
  { tag: 'mobile', vp: { width: 390, height: 844 }, mobile: true },
].filter((v) => VIEW_TAGS.includes(v.tag));

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const Y = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const Lstar = (y) => (y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y);
const contrast = (a, b) => { const [x, y] = a > b ? [a, b] : [b, a]; return (x + 0.05) / (y + 0.05); };
const parseColor = (s) => {
  const m1 = s.match(/color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?/i);
  if (m1) return [+m1[1] * 255, +m1[2] * 255, +m1[3] * 255, m1[4] === undefined ? 1 : +m1[4]];
  const m2 = s.match(/rgba?\(([^)]+)\)/i);
  if (m2) { const n = m2[1].split(/[\s,\/]+/).filter(Boolean).map(Number); return [n[0], n[1], n[2], n[3] ?? 1]; }
  return null;
};
/* Type is read line by line, so one blown highlight matters less than a
   bright BAND: average each pixel row under the glyphs, take the worst run of
   rows.

   THE WINDOW IS THREE ROWS, AND THAT IS NOT A FUDGE. photo-meter and
   hold-meter both take the single worst ROW, and on this site that turns any
   1px FOREGROUND hairline crossing a glyph box into a bright ground: the
   homepage's nav progress rule passes behind the pilot indices for about
   15px of scroll and the single-row reading called it 2.31:1 on a brass
   numeral whose actual ground is L* 3.4 page ink. A hairline in front of the
   type is not the ground behind it, and a band a line of type is actually
   read against is never one pixel tall. Three rows is the narrowest window
   that cannot be dominated by a hairline and still resolves the real thing
   this tool hunts — a lit sky under a foot band, which is tens of rows. */
const BAND_ROWS = 3;
const brightestBand = (raw, W, r) => {
  const rows = [];
  for (let j = r.y; j < r.y + r.h; j++) {
    let s = 0;
    for (let i = r.x; i < r.x + r.w; i++) { const o = (j * W + i) * 3; s += Y(raw[o], raw[o + 1], raw[o + 2]); }
    rows.push(s / r.w);
  }
  if (!rows.length) return 0;
  const win = Math.min(BAND_ROWS, rows.length);
  let best = 0, sum = 0;
  for (let j = 0; j < rows.length; j++) {
    sum += rows[j];
    if (j >= win) sum -= rows[j - win];
    if (j >= win - 1) best = Math.max(best, sum / win);
  }
  return best;
};

const MASK = `*, *::before, *::after {
  -webkit-text-fill-color: transparent !important;
  text-shadow: none !important;
  -webkit-text-decoration-color: transparent !important;
  text-decoration-color: transparent !important;
  caret-color: transparent !important; }`;

/* Runs in the page. Every text node that sits on a photograph, with its
   cascaded effective alpha and its clipped client rects. Ported from
   photo-meter's GEO — same scoping rules (a `fig--fill` figure is the ground
   for its whole scene; the fixed bar is painted over it and counts; an
   OPAQUE background between the text and the figure means the picture is not
   its ground) — with two changes: it walks every visible figure in one pass
   instead of one figure per call, and it cascades `opacity`. */
const GEO = () => {
  const vw = innerWidth, vh = innerHeight;
  const clip = (r) => {
    const x = Math.max(0, Math.floor(r.left)), y = Math.max(0, Math.floor(r.top));
    const x2 = Math.min(vw, Math.ceil(r.right)), y2 = Math.min(vh, Math.ceil(r.bottom));
    return x2 - x < 4 || y2 - y < 4 ? null : { x, y, w: x2 - x, h: y2 - y };
  };
  const figs = [...document.querySelectorAll('figure.fig')].map((f, i) => {
    const im = f.querySelector('img');
    if (!im || !im.complete || !im.naturalWidth) return null;
    const box = clip(f.getBoundingClientRect());
    if (!box) return null;
    return { el: f, i, box, fill: f.classList.contains('fig--fill'),
             src: (im.getAttribute('src') || '').replace('/media/', '') };
  }).filter(Boolean);
  if (!figs.length) return [];

  /* THE FIXED BAR'S OWN BOX. Page content that scrolls UNDER the bar is not
     type on a photograph — it is type behind chrome, and the reader does not
     read it there. Measuring it anyway makes the bar's own marks into
     "ground": the nav's progress hairline crosses the pilot indices for
     ~15px of homepage scroll and was read as a lit band under a brass
     numeral. The bar's own type is still measured (it really is painted over
     the picture); what is dropped is content underneath it. Only the bar's
     BOX, not its scrim tail — content under the translucent tail is readable
     and is exactly where two shipped defects lived. */
  const bar = [...document.querySelectorAll('header,nav,[data-nav]')]
    .filter((el) => getComputedStyle(el).position === 'fixed')
    .map((el) => el.getBoundingClientRect())
    .filter((r) => r.width > 0 && r.height > 0);

  const out = [];
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let t = walk.nextNode(); t; t = walk.nextNode()) {
    const str = (t.nodeValue || '').replace(/\s+/g, ' ').trim();
    if (!str) continue;
    const el = t.parentElement;
    if (!el || /^(script|style|noscript|title)$/i.test(el.tagName)) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden') continue;
    /* cascaded alpha: the element's own opacity times every ancestor's */
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
    const rects = [...rng.getClientRects()].filter((q) => q.width > 4 && q.height > 4).map(clip).filter(Boolean);
    rng.detach && rng.detach();
    if (!rects.length) continue;

    const chrome = !!el.closest('header,nav,[data-nav]');
    if (!chrome && bar.some((br) => rects.some((q) => !(q.x + q.w < br.left || q.x > br.right
                                                     || q.y + q.h < br.top || q.y > br.bottom)))) continue;
    /* the frontmost figure this text overlaps: later in document order wins,
       which is how they stack */
    let target = null;
    for (const f of figs) {
      const scope = f.fill ? (f.el.parentElement || f.el) : f.el;
      if (chrome ? !f.fill : !scope.contains(el)) continue;
      const hit = rects.some((q) => !(q.x + q.w < f.box.x || q.x > f.box.x + f.box.w
                                   || q.y + q.h < f.box.y || q.y > f.box.y + f.box.h));
      if (hit) target = f;
    }
    if (!target) continue;

    /* An alpha under 1 is not a ground — the photograph is still showing
       through it, and the screenshot has it composited already. Only a fully
       opaque surface between the type and the figure takes the type off the
       list. */
    if (!chrome) {
      let p = el, opaque = false;
      while (p && p !== document.body) {
        if (p === target.el) break;
        const m = getComputedStyle(p).backgroundColor.match(/rgba?\(([^)]+)\)/);
        if (m) {
          const parts = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
          if ((parts.length > 3 ? parts[3] : 1) >= 1) { opaque = true; break; }
        }
        p = p.parentElement;
      }
      if (opaque) continue;
    }
    const big = rects.reduce((a, c) => (a.w * a.h >= c.w * c.h ? a : c));
    out.push({
      key: `${target.src}|${str.slice(0, 30)}|${Math.round(parseFloat(cs.fontSize))}${chrome ? '|bar' : ''}`,
      sample: str.slice(0, 30), src: target.src, chrome, runs: rects, eff,
      color: cs.color, size: parseFloat(cs.fontSize), weight: cs.fontWeight,
      at: `${Math.round((big.x + big.w / 2 - target.box.x) / target.box.w * 100)}%,${Math.round((big.y + big.h / 2 - target.box.y) / target.box.h * 100)}%`,
    });
  }
  return out;
};

/* SCROLL-STILL IS NOT THE SAME AS SETTLED, and this is the trap that ate an
   afternoon. base.css makes `window.scrollTo` an animation, which is why
   every meter here waits for scrollY to stop — but the nav also carries
   460ms `transition: color` rules, and a frame taken 90ms after the scroll
   stops catches the wordmark HALF WAY between ink and cream. Measured that
   way the bar's own wordmark reads 1.46:1 and 1.55:1 at three offsets on the
   homepage, which is not a defect in the site: it is a picture of a
   crossfade, and it is not reproducible frame to frame. So the wait is for
   scrollY to stop AND for every finite CSS animation and transition to
   finish. Infinite ones are ignored or nothing would ever settle. */
async function settle(page, y) {
  await page.evaluate((y) => window.scrollTo({ top: y, left: 0, behavior: 'instant' }), y);
  await page.waitForFunction(() => new Promise((res) => {
    const a = window.scrollY;
    requestAnimationFrame(() => requestAnimationFrame(() => res(Math.abs(window.scrollY - a) < 0.5)));
  }), null, { timeout: 8000 }).catch(() => {});
  await page.waitForFunction(() => !document.getAnimations().some((a) => {
    if (a.playState !== 'running') return false;
    const t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null;
    return !t || t.iterations !== Infinity;
  }), null, { timeout: 3000 }).catch(() => {});
  await page.waitForTimeout(60);
}

/* One frame: every string on a photograph at this offset, measured. */
async function frameAt(page, y) {
  await settle(page, y);
  const geo = await page.evaluate(GEO);
  if (!geo.length) return new Map();
  const shot = await page.screenshot();
  const raw = await sharp(shot).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const rows = new Map();
  for (const t of geo) {
    const c = parseColor(t.color); if (!c) continue;
    const bandY = Math.max(...t.runs.map((r) => brightestBand(raw.data, raw.info.width, r)));
    const bandRGB = 255 * (bandY <= 0.0031308 ? bandY * 12.92 : 1.055 * bandY ** (1 / 2.4) - 0.055);
    const a = c[3] * t.eff;
    const fg = [0, 1, 2].map((k) => c[k] * a + bandRGB * (1 - a));
    const large = t.size >= 24 || (t.size >= 18.66 && Number(t.weight) >= 700);
    const row = { key: t.key, sample: t.sample, src: t.src, chrome: t.chrome, at: t.at,
      size: t.size, eff: t.eff, need: large ? 3 : 4.5, y,
      ratio: contrast(Y(fg[0], fg[1], fg[2]), bandY), backdropL: Lstar(bandY) };
    /* the same string can be split across lines; keep its worst line */
    /* INK_DEBUG=<substring of a key> prints the whole curve to stderr, one
       line per frame. This is how you tell a real dark band from an
       instrument artefact — a defect holds across neighbouring offsets, an
       artefact is one frame wide. Both of this tool's own corrections (the
       3-row band, the wait for CSS transitions) were found with it. */
    if (process.env.INK_DEBUG && t.key.includes(process.env.INK_DEBUG)) console.error(`   dbg y=${y} ${t.key} ratio=${row.ratio.toFixed(3)} bandL=${row.backdropL.toFixed(1)} runs=${JSON.stringify(t.runs)} color=${t.color} eff=${t.eff}`);
    const prev = rows.get(t.key);
    if (!prev || row.ratio < prev.ratio) rows.set(t.key, row);
  }
  return rows;
}

async function sweepRoute(page, view, route) {
  await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
  await page.addStyleTag({ content: MASK });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  /* every lazy <img> has to have been in view once, or the sweep measures
     empty plates and calls them dark */
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += innerHeight * 0.9) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);

  const H = view.vp.height;
  const span = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - innerHeight));
  const step = Math.max(40, Math.round(H / COARSE));

  const cache = new Map();
  let frames = 0;
  const at = async (y) => {
    y = Math.max(0, Math.min(span, Math.round(y)));
    if (cache.has(y)) return cache.get(y);
    const m = await frameAt(page, y);
    cache.set(y, m); frames++;
    return m;
  };

  /* COARSE */
  const ys = [];
  for (let y = 0; y <= span; y += step) ys.push(y);
  if (ys[ys.length - 1] !== span) ys.push(span);
  const best = new Map();          /* key -> worst row seen */
  const seenAt = new Map();        /* key -> [{y, ratio}] on the coarse grid */
  for (const y of ys) {
    const m = await at(y);
    for (const [k, row] of m) {
      const b = best.get(k);
      if (!b || row.ratio < b.ratio) best.set(k, row);
      if (!seenAt.has(k)) seenAt.set(k, []);
      seenAt.get(k).push({ y, ratio: row.ratio });
    }
  }

  /* REFINE — trisect the bracket around each coarse argmin. Shared frames,
     so overlapping brackets cost nothing twice. */
  for (const [k, samples] of seenAt) {
    /* Only curves that could plausibly reach their budget are worth
       resolving to the pixel. A string whose coarse floor is 16:1 is not
       going to fall under 4.5 between two samples 180px apart — the ground
       under it would have to move 40 L* inside one step, and nothing on this
       site moves a tenth of that. The cut is 2.5x the budget, which on the
       homepage refines six curves instead of forty and is where nearly all
       the frames were going. */
    const coarseMin = best.get(k);
    if (coarseMin && coarseMin.ratio > coarseMin.need * 2.5) continue;
    let lo = samples[0].y, hi = samples[samples.length - 1].y;
    let idx = 0;
    for (let i = 1; i < samples.length; i++) if (samples[i].ratio < samples[idx].ratio) idx = i;
    lo = samples[Math.max(0, idx - 1)].y;
    hi = samples[Math.min(samples.length - 1, idx + 1)].y;
    for (let round = 0; round < 6 && hi - lo > BRACKET_PX; round++) {
      const a = lo + (hi - lo) / 3, b2 = hi - (hi - lo) / 3;
      const pts = [];
      for (const y of [lo, a, b2, hi]) {
        const m = await at(y);
        const r = m.get(k);
        if (r) pts.push({ y: Math.round(y), ratio: r.ratio, row: r });
      }
      if (pts.length < 2) break;
      let j = 0;
      for (let i = 1; i < pts.length; i++) if (pts[i].ratio < pts[j].ratio) j = i;
      const b3 = best.get(k);
      if (!b3 || pts[j].ratio < b3.ratio) best.set(k, pts[j].row);
      const nlo = pts[Math.max(0, j - 1)].y, nhi = pts[Math.min(pts.length - 1, j + 1)].y;
      if (nhi - nlo < 2 || (nlo === lo && nhi === hi)) break;
      lo = nlo; hi = nhi;
    }
  }

  const rows = [...best.values()].map((r) => ({ ...r, view: view.tag, route, t: span ? r.y / span : 0 }));
  rows.sort((a, b) => a.ratio - b.ratio);
  return { view: view.tag, route, frames, span, step, rows };
}

/* ── run ────────────────────────────────────────────────────────────────
   Jobs are (view, route) pairs on their own page. Nothing is shared between
   them, so the pool width is only bounded by memory. */
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
        viewport: view.vp, isMobile: !!view.mobile, hasTouch: !!view.mobile, deviceScaleFactor: 1,
      }));
    }
    const page = await ctxByTag.get(view.tag).newPage();
    try { results[i] = await sweepRoute(page, view, route); }
    finally { await page.close(); }
  }
  for (const c of ctxByTag.values()) await c.close();
}));
await browser.close();

const all = results.flatMap((r) => r.rows);
const live = all.filter((r) => r.eff >= MIN_OP);
const fails = live.filter((r) => r.ratio < r.need);
const frames = results.reduce((s, r) => s + r.frames, 0);
const thin = [...live].sort((a, b) => a.ratio - b.ratio);

if (asJson) {
  console.log(JSON.stringify({ base, frames, minOpacity: MIN_OP, rows: all }, null, 2));
} else {
  console.log(`ink-floor · ${base} · ${frames} frames · coarse vh/${COARSE} then trisected to ≤${BRACKET_PX}px · cascaded opacity ≥ ${MIN_OP}\n`);
  for (const r of results) {
    if (!r) continue;
    const shown = r.rows.filter((x) => x.eff >= MIN_OP);
    console.log(`${r.view.padEnd(8)} ${r.route.padEnd(12)} ${r.frames} frames over ${r.span}px`);
    for (const x of shown) {
      const ok = x.ratio >= x.need;
      console.log(`   ${ok ? 'ok  ' : 'FAIL'} ${x.ratio.toFixed(3).padStart(7)}:1 (needs ${x.need})  min at y ${String(x.y).padStart(5)} (t ${x.t.toFixed(3)})  backdrop L* ${x.backdropL.toFixed(1).padStart(5)}  ${Math.round(x.size)}px  a ${x.eff.toFixed(2)}  ${x.chrome ? '[bar] ' : ''}"${x.sample}"`);
    }
  }
  console.log(`\nthinnest type over photography, whole site:`);
  for (const x of thin.slice(0, 6)) {
    console.log(`   ${x.ratio.toFixed(3)}:1  ${Math.round(x.size)}px  ${x.view} ${x.route} t ${x.t.toFixed(3)}  "${x.sample}"`);
  }
  console.log(`\n${fails.length} failure(s) in ${live.length} curves across ${results.filter(Boolean).length} route-views.`);
}
process.exit(fails.length ? 1 : 0);
