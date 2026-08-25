import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const B='http://127.0.0.1:4420';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:4});
const p=await ctx.newPage();
await p.goto(B+'/pilots/',{waitUntil:'networkidle'});
await p.mouse.move(700,600);
await p.evaluate(()=>window.scrollTo(0,600)); await p.waitForTimeout(800);
await p.screenshot({path:OUT+'/d-bar-clean.png',clip:{x:0,y:0,width:1440,height:70}});
await p.screenshot({path:OUT+'/d-bar-top.png',clip:{x:820,y:0,width:620,height:64}});
// unscrolled (no scrim)
await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(800);
await p.screenshot({path:OUT+'/d-bar-unscrolled.png',clip:{x:0,y:0,width:1440,height:120}});
// partner page rest (is-active CTA)
await p.goto(B+'/partner/',{waitUntil:'networkidle'});
await p.mouse.move(700,600);
await p.evaluate(()=>window.scrollTo(0,600)); await p.waitForTimeout(800);
await p.screenshot({path:OUT+'/d-cta-active.png',clip:{x:1140,y:0,width:300,height:64}});
// cream inversion
await p.goto(B+'/pilots/',{waitUntil:'networkidle'});
await p.mouse.move(700,600);
const ok=await p.evaluate(()=>{const el=document.querySelector('.on-cream'); if(!el)return false; window.scrollTo(0, window.scrollY+el.getBoundingClientRect().top+200); return true;});
await p.waitForTimeout(900);
if(ok) await p.screenshot({path:OUT+'/d-bar-cream.png',clip:{x:0,y:0,width:1440,height:80}});
await b.close();
