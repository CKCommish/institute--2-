/* Capture a motion strip: frames during a scripted scroll so reveal/parallax
   behaviour is visible in stills. usage:
   BASE=http://127.0.0.1:4411 node tools/motion-strip.mjs /  out.png [desktop|mobile] */
import { launch } from './browser.mjs';
import sharp from 'sharp';
import fs from 'node:fs';
const route = process.argv[2] || '/';
const out = process.argv[3] || 'motion.png';
const tag = process.argv[4] || 'desktop';
const base = process.env.BASE || 'http://127.0.0.1:4399';
const vp = tag === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: tag === 'mobile', hasTouch: tag === 'mobile' });
const p = await ctx.newPage();
await p.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(800);
const h = await p.evaluate(() => document.documentElement.scrollHeight);
const FRAMES = 12, STEP = Math.round((h - vp.height) / (FRAMES * 3));
const bufs = [];
await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(500);
for (let i = 0; i < FRAMES; i++) {
  // three quick sub-steps then sample mid-transition
  for (let k = 0; k < 3; k++) {
    await p.evaluate((y) => window.scrollBy(0, y), STEP);
    await p.waitForTimeout(55);
  }
  await p.waitForTimeout(120);
  bufs.push(await sharp(await p.screenshot()).resize({ width: tag === 'mobile' ? 200 : 340 }).toBuffer());
}
await b.close();
const m = await sharp(bufs[0]).metadata();
const cols = 6, rows = Math.ceil(bufs.length / cols);
await sharp({ create: { width: m.width * cols, height: m.height * rows, channels: 3, background: '#111' } })
  .composite(bufs.map((input, i) => ({ input, left: (i % cols) * m.width, top: Math.floor(i / cols) * m.height })))
  .png().toFile(out);
console.log('motion strip →', out, `${bufs.length} frames sampled mid-scroll`);
