import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const p=await ctx.newPage();
await p.goto('http://127.0.0.1:4454/pilots/',{waitUntil:'networkidle'}); await p.waitForTimeout(1000);
const t=await p.evaluate(()=>{const wm=document.querySelector('.nav__mark');const r=wm.getBoundingClientRect();
 return {pe:getComputedStyle(wm).pointerEvents, hit:(document.elementFromPoint(r.left+15,r.top+r.height/2)||{}).className,
  markInNavIn: wm.parentElement.className, attrs:[...wm.attributes].map(a=>a.name).join(',')};});
console.log('MOBILE',JSON.stringify(t));
// try clicking it
const url0=p.url();
try{ await p.tap('.nav__mark',{timeout:4000}); }catch(e){ console.log('TAP FAILED:',e.message.split('\n')[0]); }
await p.waitForTimeout(800);
console.log('url before',url0,'after',p.url());
// keyboard reach
await p.evaluate(()=>document.body.focus());
await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
console.log('kbd', await p.evaluate(()=>document.activeElement.className+' / '+document.activeElement.getAttribute('aria-label')));
await b.close();
