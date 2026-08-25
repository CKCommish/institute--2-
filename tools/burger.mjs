import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4410/pilots/', { waitUntil: 'networkidle' });
await p.waitForTimeout(400);
const m = await p.evaluate(() => {
  const t = document.querySelector('[data-burger-label]');
  const btn = document.querySelector('[data-burger]');
  const inn = document.querySelector('.nav__in');
  const cs = getComputedStyle(t);
  const meas = (w) => { const old = t.textContent; t.style.minWidth='0'; t.textContent = w; const r = t.getBoundingClientRect().width; t.textContent = old; t.style.minWidth=''; return +r.toFixed(2); };
  const menu = meas('Menu'), close = meas('Close');
  const btnR = btn.getBoundingClientRect();
  const innR = inn.getBoundingClientRect();
  const innCS = getComputedStyle(inn);
  const tR = t.getBoundingClientRect();
  const range = document.createRange(); range.selectNodeContents(t);
  const ink = range.getBoundingClientRect();
  return { labelRight: +tR.right.toFixed(2), inkRight: +ink.right.toFixed(2), menu, close, fontSize: cs.fontSize, minW: cs.minWidth, btn: { w:+btnR.width.toFixed(2), h:+btnR.height.toFixed(2), right:+btnR.right.toFixed(2) },
           innRight: +innR.right.toFixed(2), padRight: innCS.paddingRight, gutterEdge: +(innR.right - parseFloat(innCS.paddingRight)).toFixed(2),
           markLeft: +document.querySelector('.nav__mark').getBoundingClientRect().left.toFixed(2) };
});
console.log(JSON.stringify(m, null, 2));
await b.close();
