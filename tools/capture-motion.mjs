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
for (let i = 0; i < FRAMES; i++) {
  await p.mouse.wheel(0, step);           // real wheel events — drives smooth-scroll libs
  await p.waitForTimeout(90);             // sample mid-transition, NOT settled
  bufs.push(await p.screenshot());
}
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
