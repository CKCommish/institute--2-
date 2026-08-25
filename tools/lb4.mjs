import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
for (const [w,h] of [[1440,900],[1024,900],[900,1200],[768,1024],[700,900],[621,844],[620,844],[430,932],[390,844],[360,740]]) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, isMobile:w<=430, hasTouch:w<=430 });
  const p = await ctx.newPage();
  const errs=[]; p.on('console', m=>{ if(m.type()==='error') errs.push(m.text()); });
  p.on('pageerror', e=>errs.push('page:'+e.message));
  await p.goto('http://127.0.0.1:4420/', { waitUntil:'networkidle' });
  await p.waitForTimeout(1600);
  const r = await p.evaluate(()=>{
    const el=document.querySelector('.hero__poster').getBoundingClientRect();
    const eb=document.querySelector('.hero__index-label').getBoundingClientRect();
    return { posterTop:Math.round(el.top), posterBottom:Math.round(el.bottom), eyebrowTop:Math.round(eb.top),
      gap: Math.round(eb.top-el.bottom), ovf: document.documentElement.scrollWidth-document.documentElement.clientWidth };
  });
  console.log(w+'x'+h, JSON.stringify(r), errs.length?'ERR '+errs.join('|'):'');
  await p.screenshot({ path:`${process.env.SP}/lbA-${w}.png` });
  await ctx.close();
}
await b.close();
