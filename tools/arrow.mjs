import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4414/people/', { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(800);
const r = await p.evaluate(() => {
  const a = document.querySelector('.pm__idx-a');
  const cs = getComputedStyle(a);
  const rect = a.getBoundingClientRect();
  const row = a.parentElement.getBoundingClientRect();
  const path = a.querySelector('path').getBoundingClientRect();
  const noT = (() => { const old = a.style.transform; a.style.transform = 'none'; const q = a.getBoundingClientRect(); a.style.transform = old; return q; })();
  return {
    marginRight: cs.marginRight, width: cs.width, height: cs.height,
    transformBox: cs.transformBox, transformOrigin: cs.transformOrigin,
    rect: [rect.left, rect.right, rect.width, rect.height].map(n=>Math.round(n*100)/100),
    untransformed: [noT.left, noT.right, noT.width, noT.height].map(n=>Math.round(n*100)/100),
    pathRect: [path.left, path.right, path.top, path.bottom].map(n=>Math.round(n*100)/100),
    rowRight: Math.round(row.right*100)/100,
  };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
