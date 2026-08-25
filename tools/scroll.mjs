import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT = '/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4415/partner/', { waitUntil: 'networkidle' });
await p.waitForTimeout(3000);
for (const [i, y] of [800, 1600, 2400].entries()) {
  await p.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
  await p.waitForTimeout(1800);
  await p.screenshot({ path: `${OUT}/scroll-${i}.png` });
}
const hidden = await p.evaluate(() => [...document.querySelectorAll('[data-reveal],[data-wipe]')]
  .filter(e => { const r = e.getBoundingClientRect(); return getComputedStyle(e).opacity === '0'; })
  .map(e => e.className));
console.log('still hidden after full scroll:', JSON.stringify(hidden));
await b.close();
