import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4410/partner/', { waitUntil: 'networkidle' });
await p.tap('[data-burger]'); await p.waitForTimeout(900);
const r = await p.evaluate(() => [...document.querySelectorAll('header.nav, header.nav *, .menu, .menu *')]
  .map(e => { const c = getComputedStyle(e); return { cls: e.className || e.tagName, r: c.borderTopLeftRadius, bg: c.backgroundColor, bw: c.borderTopWidth }; })
  .filter(x => parseFloat(x.r) > 4 || (x.bg !== 'rgba(0, 0, 0, 0)' && x.bg !== 'rgb(5, 13, 22)') || parseFloat(x.bw) > 0));
console.log(JSON.stringify(r, null, 1));
await b.close();
