import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:4});
const p=await ctx.newPage();
await p.goto('http://127.0.0.1:4454/partner/',{waitUntil:'networkidle'}); await p.waitForTimeout(900);
await p.evaluate(()=>window.scrollTo(0,700)); await p.waitForTimeout(1300);
await p.screenshot({path:`${OUT}/s-partner-cta.png`,clip:{x:860,y:6,width:560,height:52}});
const g=await p.evaluate(()=>{
 const cta=document.querySelector('.cta'); const cs=n=>getComputedStyle(cta,n);
 const link=document.querySelectorAll('.nav__link')[0];
 return {ctaAfterBg:cs('::after').backgroundColor, ctaAfterH:cs('::after').height, ctaAfterOp:cs('::after').opacity, ctaAfterT:cs('::after').transform, ctaAfterL:cs('::after').left, ctaAfterR:cs('::after').right,
   ctaBefore:cs('::before').backgroundColor+' '+cs('::before').height,
   focusOutline:getComputedStyle(link).outline, focusRadius:getComputedStyle(link).borderRadius};
});
console.log(JSON.stringify(g,null,1));
// reduced motion check
const ctx2=await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce',deviceScaleFactor:2});
const p2=await ctx2.newPage();
await p2.goto('http://127.0.0.1:4454/',{waitUntil:'networkidle'}); await p2.waitForTimeout(1000);
await p2.evaluate(()=>window.scrollTo(0,900)); await p2.waitForTimeout(900);
await p2.screenshot({path:`${OUT}/s-rm-cream.png`,clip:{x:0,y:0,width:1440,height:110}});
const rm=await p2.evaluate(()=>{const n=document.querySelector('.nav');const c=getComputedStyle(n);const pr=getComputedStyle(document.querySelector('.nav__prog'));
 return {navTrans:c.transitionDuration, progTrans:pr.transitionDuration, cls:n.className};});
console.log('RM',JSON.stringify(rm));
// mobile reduced motion menu
const ctx3=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce',deviceScaleFactor:3});
const p3=await ctx3.newPage();
await p3.goto('http://127.0.0.1:4454/',{waitUntil:'networkidle'}); await p3.waitForTimeout(900);
await p3.click('[data-burger]'); await p3.waitForTimeout(120);
await p3.screenshot({path:`${OUT}/s-rm-menu-120ms.png`});
await b.close(); console.log('ok');
