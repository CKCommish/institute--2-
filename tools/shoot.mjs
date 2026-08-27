/* Screenshot our built site the same way we screenshotted Oryzo.
   usage: node tools/shoot.mjs [label] [--pages=/,/pilots/] */
import { launch } from './browser.mjs';
import fs from 'node:fs';
import path from 'node:path';

const label = process.argv[2] || 'current';
const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || `--${k}=${d}`).split('=').slice(1).join('=');
const pages = arg('pages', '/,/pilots/,/institute/,/forum/,/people/,/partner/').split(',').filter(Boolean);
const base = process.env.BASE || 'http://127.0.0.1:4399';
const outRoot = path.join('progress', 'shots', label);

const VIEWS = [
  { tag: 'desktop', vp: { width: 1440, height: 900 }, frames: 10 },
  { tag: 'mobile', vp: { width: 390, height: 844 }, frames: 7, mobile: true },
];

const slug = (p) => (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '-'));

/* SCROLL WITHOUT ANIMATING, THEN WAIT FOR THE PAGE TO STOP MOVING.

   This tool used to do `window.scrollTo(0, y)` and then wait a flat 1150ms.
   `base.css` sets `html { scroll-behavior: smooth }`, so that call is not a
   jump — it is an animation, and 1150ms is a guess about when it lands. It
   does not land: the frames this tool produced caught our reveals in flight,
   with whole blocks of type sitting at 30-50% opacity that are fully opaque
   in the render a reader gets. `progress/gauntlet/w11/blind-desktop/` is the
   evidence, and every blind comparison this project ran before wave 12 was
   scored off frames biased that way. AGENTS.md has warned about this trap for
   meters since wave 8; it was never applied to the screenshotter.

   So: `behavior: 'instant'` to defeat the smooth scroll, then poll scrollY
   until it has stopped, then hold still long enough for the reveal (dur-3)
   and the hold's rAF loop to finish. The settle is deliberately generous —
   this tool shoots a handful of frames, not thousands, and a frame caught
   early is worth more than the second it saved. */
const SETTLE_MS = Number(process.env.SETTLE_MS || 2600);

export async function settleAt(page, y) {
  await page.evaluate((y) => window.scrollTo({ top: y, left: 0, behavior: 'instant' }), y);
  await page.waitForFunction(
    () => new Promise((res) => {
      const a = window.scrollY;
      requestAnimationFrame(() => requestAnimationFrame(() => res(Math.abs(window.scrollY - a) < 0.5)));
    }),
    null,
    { timeout: 8000 }
  ).catch(() => {});
  await page.waitForTimeout(SETTLE_MS);
}

const b = await launch({ proxy: false });
for (const v of VIEWS) {
  const ctx = await b.newContext({
    viewport: v.vp, deviceScaleFactor: 1, isMobile: !!v.mobile, hasTouch: !!v.mobile,
    userAgent: v.mobile ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' : undefined,
  });
  const p = await ctx.newPage();
  const errors = [];
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  p.on('pageerror', (e) => errors.push(String(e)));

  for (const route of pages) {
    const dir = path.join(outRoot, slug(route));
    fs.mkdirSync(dir, { recursive: true });
    await p.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(900);

    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    const n = Math.max(2, Math.min(v.frames, Math.ceil(h / v.vp.height) + 1));
    for (let i = 0; i < n; i++) {
      const y = Math.round((h - v.vp.height) * (i / (n - 1)));
      await settleAt(p, y);
      await p.screenshot({ path: path.join(dir, `${v.tag}-${String(i + 1).padStart(2, '0')}.png`) });
    }
    // full page too
    await settleAt(p, 0);
    await p.screenshot({ path: path.join(dir, `${v.tag}-full.png`), fullPage: true });
    console.log(v.tag, route, 'h=' + h, n + ' frames');
  }
  if (errors.length) console.log('CONSOLE ERRORS (' + v.tag + '):\n' + [...new Set(errors)].slice(0, 12).join('\n'));
  await ctx.close();
}
await b.close();
console.log('shots →', outRoot);
