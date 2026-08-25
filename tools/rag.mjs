import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({proxy:false});
for (const [w,h,m] of [[390,844,true],[768,1024,false],[1024,900,false],[1440,900,false]]) {
  const ctx = await b.newContext({viewport:{width:w,height:h}, isMobile:m, hasTouch:m});
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4451/',{waitUntil:'networkidle'});
  await p.waitForTimeout(2200);
  const r = await p.evaluate(()=>{
    const el=document.querySelector('.hero__poster');
    const tn=[...el.childNodes];
    // per-line rects via Range over the whole element text
    const rng=document.createRange(); rng.selectNodeContents(el);
    const rects=[...rng.getClientRects()].filter(r=>r.height>10);
    // merge rects by top
    const byTop={};
    rects.forEach(r=>{const k=Math.round(r.top); byTop[k]=byTop[k]?{l:Math.min(byTop[k].l,r.left),r:Math.max(byTop[k].r,r.right)}:{l:r.left,r:r.right};});
    const lines=Object.entries(byTop).map(([t,v])=>({top:+t,w:+(v.r-v.l).toFixed(0)}));
    const cs=getComputedStyle(el);
    const idx=document.querySelector('.hero__index').getBoundingClientRect();
    const posterB=el.getBoundingClientRect().bottom;
    return {lines, fs:cs.fontSize, lh:cs.lineHeight, wrap:cs.textWrap||cs.textWrapStyle, gapToLedger:+(idx.top-posterB).toFixed(0), ledgerTop:+idx.top.toFixed(0), posterBottom:+posterB.toFixed(0)};
  });
  console.log(w+'x'+h, JSON.stringify(r));
  await ctx.close();
}
await b.close();
