import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b=await launch({proxy:false});
const go=async(vw,vh,sel,mob)=>{const ctx=await b.newContext({viewport:{width:vw,height:vh},isMobile:!!mob,hasTouch:!!mob});
 const p=await ctx.newPage(); await p.goto('http://127.0.0.1:4420/pilots/',{waitUntil:'networkidle'});
 return p.evaluate((sel)=>{const t=document.querySelector(sel);
  const probe=document.createElement('span'); probe.style.cssText='display:inline-block;width:0;height:0;vertical-align:baseline';
  t.appendChild(probe); const bl=probe.getBoundingClientRect().top; probe.remove();
  const ring=t.closest('.cta')||t.closest('.burger__o'); const r=ring.getBoundingClientRect();
  const capH=8.79/11.664*parseFloat(getComputedStyle(t).fontSize);
  const capTop=bl-capH;
  return {ringTop:+r.top.toFixed(2),ringBot:+r.bottom.toFixed(2),baseline:+bl.toFixed(2),capTop:+capTop.toFixed(2),
   airTop:+(capTop-r.top).toFixed(2), airBot:+(r.bottom-bl).toFixed(2)};},sel);};
console.log('CTA   ',JSON.stringify(await go(1440,900,'.cta__t')));
console.log('BURGER',JSON.stringify(await go(390,844,'.burger__t',1)));
await b.close();
