import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
for (const [w,h,m] of [[1440,900,false],[390,844,true]]) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, isMobile:m, hasTouch:m });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4411/',{waitUntil:'networkidle'});
  await p.waitForTimeout(1800);
  const r = await p.evaluate(()=>{
    const el=document.querySelector('.hero__index');
    const cs=getComputedStyle(el,'::before');
    const rect=el.getBoundingClientRect();
    // hit-test: what element paints at the ledger's first sub row?
    const sub=document.querySelector('.hcell__sub').getBoundingClientRect();
    return {h:rect.height, top:cs.top, zi:cs.zIndex, bgLen:cs.backgroundImage.length,
            subY:sub.y, subH:sub.height, bandTop: rect.y + parseFloat(cs.top), bandH: rect.height - parseFloat(cs.top),
            pct: ((sub.y+sub.height/2) - (rect.y+parseFloat(cs.top))) / (rect.height - parseFloat(cs.top))};
  });
  console.log(w+'x'+h, JSON.stringify(r));
  await ctx.close();
}
await b.close();
