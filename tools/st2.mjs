import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const B='http://127.0.0.1:4420';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:4});
const p=await ctx.newPage();
// CTA on its own page (is-active)
await p.goto(B+'/partner/',{waitUntil:'networkidle'});
await p.evaluate(()=>window.scrollTo(0,600)); await p.waitForTimeout(700);
await p.screenshot({path:OUT+'/d-cta-active.png',clip:{x:1140,y:0,width:300,height:64}});
await p.hover('.cta'); await p.waitForTimeout(700);
await p.screenshot({path:OUT+'/d-cta-active-hover.png',clip:{x:1140,y:0,width:300,height:64}});
// clean bar, no focus
await p.goto(B+'/pilots/',{waitUntil:'networkidle'});
await p.evaluate(()=>window.scrollTo(0,600)); await p.waitForTimeout(700);
await p.screenshot({path:OUT+'/d-bar-clean.png',clip:{x:0,y:0,width:1440,height:70}});
// cream inversion: find an .on-cream and scroll it under the bar
const inv=await p.evaluate(async()=>{
  const el=document.querySelector('.on-cream'); if(!el) return null;
  window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top + 200);
  return true;
});
await p.waitForTimeout(900);
if(inv) await p.screenshot({path:OUT+'/d-bar-cream.png',clip:{x:0,y:0,width:1440,height:70}});
const invd=await p.evaluate(()=>({inverted:document.querySelector('.nav').classList.contains('is-inverted')}));
console.log('inverted?',JSON.stringify(invd));
if(inv){ await p.hover('.cta'); await p.waitForTimeout(700); await p.screenshot({path:OUT+'/d-cta-cream-hover.png',clip:{x:1140,y:0,width:300,height:64}}); }
await ctx.close();
// mobile burger states
const m=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:4});
const mp=await m.newPage();
await mp.goto(B+'/pilots/',{waitUntil:'networkidle'});
await mp.evaluate(()=>window.scrollTo(0,600)); await mp.waitForTimeout(700);
await mp.screenshot({path:OUT+'/m-burger-rest.png',clip:{x:250,y:0,width:140,height:58}});
await mp.evaluate(()=>document.querySelector('.nav__burger').focus());
await mp.keyboard.press('Tab'); await mp.keyboard.press('Shift+Tab'); await mp.waitForTimeout(400);
await mp.screenshot({path:OUT+'/m-burger-focus.png',clip:{x:250,y:0,width:140,height:58}});
await mp.tap('[data-burger]'); await mp.waitForTimeout(1300);
await mp.screenshot({path:OUT+'/m-burger-open.png',clip:{x:250,y:0,width:140,height:58}});
// mid-transition close
await mp.tap('[data-burger]');
await mp.waitForTimeout(180);
await mp.screenshot({path:OUT+'/m-sheet-closing-180.png'});
await ctx.close?.();
await b.close();
