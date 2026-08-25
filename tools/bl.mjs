import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const B='http://127.0.0.1:4420';
const b=await launch({proxy:false});
for(const [w,mob] of [[1440,false],[1180,false],[960,false],[939,false],[768,false],[390,true]]){
 const ctx=await b.newContext({viewport:{width:w,height:844},isMobile:mob,hasTouch:mob,deviceScaleFactor:2});
 const p=await ctx.newPage(); await p.goto(B+'/pilots/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
 const d=await p.evaluate(()=>{
  const base=(el)=>{ // baseline via a zero-width inline probe
    const s=document.createElement('span'); s.textContent='H'; s.style.cssText='font:inherit;';
    el.appendChild(s); const r=s.getBoundingClientRect(); const cs=getComputedStyle(s);
    s.remove(); return {top:+r.top.toFixed(3), bot:+r.bottom.toFixed(3), fs:cs.fontSize, fw:cs.fontWeight, ff:cs.fontFamily.split(',')[0]};
  };
  const wmA=document.querySelector('.wm__a'), wmB=document.querySelector('.wm__b');
  const link=document.querySelector('.nav__link'), ctaT=document.querySelector('.cta__t'), bt=document.querySelector('[data-burger-label]');
  const mark=document.querySelector('.nav__mark');
  return {
   wmA:base(wmA), wmB:base(wmB),
   link: link&&link.offsetParent?base(link):null,
   ctaT: ctaT&&ctaT.offsetParent?base(ctaT):null,
   burger: bt&&bt.offsetParent?base(bt):null,
   markTop:getComputedStyle(mark).top, wmFs:getComputedStyle(wmA).fontSize,
   stepMicro:getComputedStyle(document.documentElement).getPropertyValue('--step-micro').trim(),
   vw:innerWidth
  };
 });
 console.log(w, JSON.stringify(d));
 await ctx.close();
}
await b.close();
