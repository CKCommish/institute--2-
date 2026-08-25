import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy:false });
for (const rmv of ['reduce','no-preference']){
const m = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, reducedMotion: rmv==='reduce'?'reduce':'no-preference' });
const p = await m.newPage();
await p.goto('http://127.0.0.1:4410/',{waitUntil:'networkidle'}); await p.waitForTimeout(800);
console.log('--',rmv);
console.log(' pre-open .menu computed', await p.evaluate(()=>{const e=document.querySelector('.menu'); const s=getComputedStyle(e); return [s.transitionDuration,s.transitionDelay,s.transitionProperty].join(' | ')}));
console.log(' foot transition', await p.evaluate(()=>{const e=document.querySelector('.menu__foot'); const s=getComputedStyle(e); return [s.transitionDuration,s.transitionDelay,s.animationName,s.animationDuration,s.animationDelay].join(' | ')}));
console.log(' item transition', await p.evaluate(()=>{const e=document.querySelector('.menu__links a'); const s=getComputedStyle(e); return [s.transitionDuration,s.transitionDelay,s.animationName,s.animationDuration,s.animationDelay].join(' | ')}));
const t0=Date.now();
await p.click('[data-burger]');
for (const ms of [30,100,200,350,500,700,900]){
  const w=ms-(Date.now()-t0); if(w>0) await p.waitForTimeout(w);
  const o = await p.evaluate(()=>({sheet:+getComputedStyle(document.querySelector('.menu')).opacity, i1:+getComputedStyle(document.querySelector('.menu__links a')).opacity, foot:+getComputedStyle(document.querySelector('.menu__foot')).opacity, y1:getComputedStyle(document.querySelector('.menu__links a')).transform}));
  console.log('  ',ms+'ms', JSON.stringify(o));
}
await m.close();
}
await b.close();
