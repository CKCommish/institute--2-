import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT = '/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/crit2';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3 });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4455/partner/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
await p.evaluate(() => window.scrollTo(0, 1900));
await p.waitForTimeout(6000);
const head = await p.$('.proles__head');
await head.screenshot({ path: `${OUT}/crop-creamhead-settled.png` });
const info = await p.evaluate(() => {
  const e = document.querySelector('.proles__bridge');
  const cs = getComputedStyle(e);
  return { color: cs.color, opacity: cs.opacity, mixBlend: cs.mixBlendMode, fill: cs.webkitTextFillColor, filter: cs.filter, parentOp: getComputedStyle(e.parentElement).opacity, cls: e.className, attrs: [...e.attributes].map(a=>a.name+'='+a.value) };
});
console.log(JSON.stringify(info));
// also check whether ancestors carry opacity
const anc = await p.evaluate(() => {
  let e = document.querySelector('.proles__bridge'); const out=[];
  while (e && e !== document.documentElement) { const cs = getComputedStyle(e); out.push({t:e.tagName+'.'+e.className, op:cs.opacity, color:cs.color, tf:cs.webkitTextFillColor}); e = e.parentElement; }
  return out;
});
console.log(JSON.stringify(anc, null, 1));
await ctx.close(); await b.close();
