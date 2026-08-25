import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
const widths = [[1440,900],[1280,900],[1180,900],[1100,900],[1081,900],[1024,900],[900,1200],[768,1024],[700,900],[620,900],[430,932],[390,844],[375,667],[360,740]];
for (const [w,h] of widths) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, isMobile: w<=430, hasTouch: w<=430, deviceScaleFactor:1 });
  const p = await ctx.newPage();
  const errs=[]; p.on('console', m=>{ if(m.type()==='error') errs.push(m.text()); });
  await p.goto('http://127.0.0.1:4420/', { waitUntil:'networkidle' });
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const lr=(n)=>{const r=document.createRange();r.selectNodeContents(n);return [...r.getClientRects()].filter(x=>x.width>1).map(x=>Math.round(x.width));};
    const el = document.querySelector('.hero__poster');
    const keep=document.querySelector('.hero__keep');
    return { poster: lr(el), kicker: lr(document.querySelector('.hero__kicker')),
      keepRects: keep? keep.getClientRects().length : null,
      measure: Math.round(el.getBoundingClientRect().width),
      posterBottom: Math.round(el.getBoundingClientRect().bottom),
      ovf: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  });
  console.log(String(w).padEnd(5), JSON.stringify(r), errs.length?('ERR '+errs[0]):'');
  await ctx.close();
}
await b.close();
