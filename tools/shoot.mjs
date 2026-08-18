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
      await p.evaluate((y) => window.scrollTo(0, y), y);
      await p.waitForTimeout(1150);
      await p.screenshot({ path: path.join(dir, `${v.tag}-${String(i + 1).padStart(2, '0')}.png`) });
    }
    // full page too
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(dir, `${v.tag}-full.png`), fullPage: true });
    console.log(v.tag, route, 'h=' + h, n + ' frames');
  }
  if (errors.length) console.log('CONSOLE ERRORS (' + v.tag + '):\n' + [...new Set(errors)].slice(0, 12).join('\n'));
  await ctx.close();
}
await b.close();
console.log('shots →', outRoot);
