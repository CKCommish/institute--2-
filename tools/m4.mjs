import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b=await launch({proxy:false});
for(const [w,h] of [[390,844],[375,667],[360,640],[320,568]]){
 const c=await b.newContext({viewport:{width:w,height:h},isMobile:true,hasTouch:true});
 const p=await c.newPage(); await p.goto('http://127.0.0.1:4420/',{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
 const f=()=>{const cr=document.querySelector('.hero__bg .label, .hero__bg .fig__credit, .hero__bg [class*=credit]');
  const k=document.querySelector('.hero__kicker').getBoundingClientRect();
  return {credit: cr?[Math.round(cr.getBoundingClientRect().top),Math.round(cr.getBoundingClientRect().bottom)]:null, kickerTop:Math.round(k.top)};};
 const after=await p.evaluate(f);
 await p.addStyleTag({content:'@media (max-width:620px) and (max-height:700px){.hero .hero__mid{padding-top:calc(var(--nav-h) + clamp(1.8rem,5.4vh,3.4rem))!important}}'});
 await p.waitForTimeout(200);
 const before=await p.evaluate(f);
 console.log(w+'x'+h,'after',JSON.stringify(after),'shelfOld',JSON.stringify(before));
 await c.close();
}
await b.close();
