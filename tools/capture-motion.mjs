/* Capture a site's BEHAVIOUR, not its resting states.
   Two things stills cannot show:
     1. frames sampled during a continuous scroll (mid-transition, not settled)
     2. instrumentation: what actually moves, driven by what, over how long
   usage: node tools/capture-motion.mjs <url> <outDir> [desktop|mobile] */
import { launch } from './browser.mjs';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] || 'https://oryzo.ai/';
const out = process.argv[3] || 'refs/oryzo-motion';
const tag = process.argv[4] || 'desktop';
const local = /127\.0\.0\.1|localhost/.test(url);
const vp = tag === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 900 };
fs.mkdirSync(out, { recursive: true });

const b = await launch({ proxy: !local });
const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: tag === 'mobile', hasTouch: tag === 'mobile' });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: 'load', timeout: 120000 });
await p.waitForTimeout(local ? 3000 : 14000);

/* ── 1. Instrument: what is animating, and how ─────────────────────── */
const probe = await p.evaluate(async () => {
  const out = { canvases: [], smoothScroll: null, rafActive: false, movers: [], libs: [] };

  document.querySelectorAll('canvas').forEach((c) => {
    const r = c.getBoundingClientRect();
    let kind = 'none';
    for (const t of ['webgl2', 'webgl', '2d']) { try { if (c.getContext(t)) { kind = t; break; } } catch {} }
    out.canvases.push({ w: Math.round(r.width), h: Math.round(r.height), ctx: kind, fixed: getComputedStyle(c).position });
  });

  for (const k of ['lenis', 'Lenis', 'ScrollTrigger', 'gsap', 'THREE', 'Locomotive', 'scrollama'])
    if (window[k]) out.libs.push(k);
  if (document.documentElement.className) out.libs.push('html.class=' + document.documentElement.className.slice(0, 80));

  /* Does window.scrollY lag a programmatic jump? (smooth-scroll hijack) */
  const before = window.scrollY;
  window.scrollTo(0, before + 900);
  const immediate = window.scrollY;
  await new Promise((r) => setTimeout(r, 700));
  const settled = window.scrollY;
  out.smoothScroll = { asked: before + 900, immediate, settled, hijacked: Math.abs(immediate - (before + 900)) > 40 };
  window.scrollTo(0, before);
  await new Promise((r) => setTimeout(r, 700));

  /* Sample transforms of the largest elements across a small scroll delta */
  const big = [...document.querySelectorAll('body *')]
    .map((el) => ({ el, r: el.getBoundingClientRect() }))
    .filter((o) => o.r.width > 200 && o.r.height > 120)
    .slice(0, 60);
  const snap = () => big.map((o) => {
    const cs = getComputedStyle(o.el);
    return cs.transform + '|' + cs.opacity + '|' + cs.clipPath + '|' + Math.round(o.el.getBoundingClientRect().top);
  });
  const a = snap();
  window.scrollBy(0, 260);
  await new Promise((r) => setTimeout(r, 60));
  const bs = snap();
  a.forEach((v, i) => {
    if (v === bs[i]) return;
    const el = big[i].el;
    out.movers.push({
      sel: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : ''),
      from: v.slice(0, 90), to: bs[i].slice(0, 90),
    });
  });
  out.movers = out.movers.slice(0, 14);
  return out;
});
fs.writeFileSync(path.join(out, 'behaviour.json'), JSON.stringify(probe, null, 2));
console.log(JSON.stringify({ canvases: probe.canvases, libs: probe.libs, smoothScroll: probe.smoothScroll, moverCount: probe.movers.length }, null, 1));

/* ── 2. Frames sampled DURING a continuous scroll ──────────────────── */
await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(1200);
const h = await p.evaluate(() => document.documentElement.scrollHeight);
const FRAMES = 30;
const step = Math.round((h - vp.height) / FRAMES);
const bufs = [];
const ys = [];

/* WHY THIS IS A LOOP AND NOT ONE `mouse.wheel(0, step)`.
   Until wave 26 this shot one wheel event per frame with a delta of `step`
   and assumed the page moved by it. On a site that CLAMPS wheel delta that
   assumption is silently false, and the reference is such a site: measured
   on oryzo.ai, a single wheel of 500 settles at 298px, of 1860 at 498px and
   of 5000 at 698px — every event is capped at roughly 200px of travel — and
   `window.scrollTo(0, 30000)` is overridden back to 700. So thirty frames at
   a nominal step of 1860 walked 5879px of a 56691px document: 10% of the
   page, all of it inside the opening scene. THAT is where "the reference
   holds one subject for 25 of 30 frames" came from. It was never a hold; it
   was a capture that could not move the page, and six waves of motion
   judgement rest on those strips. Our own site is native-scrolling and was
   never affected, which is exactly what made the comparison asymmetric: our
   thirty frames covered 86% of our document and the reference's covered 10%
   of its own.
   The fix is to DRIVE to a scroll target rather than to assume one, with a
   stall guard so a genuinely trapped page ends the sweep instead of hanging.
   `ys` is written into behaviour.json so any later reading can check where
   the frames actually landed instead of trusting the nominal step. */
const WHEEL = 180;                        // under every clamp we have measured
for (let i = 0; i < FRAMES; i++) {
  const target = Math.min(step * (i + 1), h - vp.height);
  let stall = 0;
  for (let k = 0; k < 400; k++) {
    const y = await p.evaluate(() => window.scrollY);
    if (y >= target - 8) break;
    await p.mouse.wheel(0, Math.min(WHEEL, target - y));
    await p.waitForTimeout(25);
    const after = await p.evaluate(() => window.scrollY);
    if (after - y < 2) { if (++stall > 6) break; } else stall = 0;
  }
  await p.waitForTimeout(90);             // sample mid-transition, NOT settled
  ys.push(Math.round(await p.evaluate(() => window.scrollY)));
  bufs.push(await p.screenshot());
}
probe.frames = { docHeight: h, viewport: vp.height, nominalStep: step, scrollY: ys };
fs.writeFileSync(path.join(out, 'behaviour.json'), JSON.stringify(probe, null, 2));
await b.close();

for (let s = 0; s < Math.ceil(FRAMES / 10); s++) {
  const slice = bufs.slice(s * 10, s * 10 + 10);
  if (!slice.length) break;
  const thumbs = await Promise.all(slice.map((x) => sharp(x).resize({ width: tag === 'mobile' ? 190 : 300 }).toBuffer()));
  const m = await sharp(thumbs[0]).metadata();
  const cols = 5, rows = Math.ceil(thumbs.length / cols);
  await sharp({ create: { width: m.width * cols, height: m.height * rows, channels: 3, background: '#111' } })
    .composite(thumbs.map((input, i) => ({ input, left: (i % cols) * m.width, top: Math.floor(i / cols) * m.height })))
    .png().toFile(path.join(out, `${tag}-scroll-${s + 1}.png`));
}
console.log(`${FRAMES} mid-scroll frames → ${out}/${tag}-scroll-*.png`);
