import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b=await launch({proxy:false});
for(const w of [1024,860,768,640,430]){
  const ctx=await b.newContext({viewport:{width:w,height:800},deviceScaleFactor:2});
  const p=await ctx.newPage();
  await p.goto('http://127.0.0.1:4454/pilots/',{waitUntil:'networkidle'}); await p.waitForTimeout(900);
  await p.evaluate(()=>window.scrollTo(0,900)); await p.waitForTimeout(1100);
  await p.screenshot({path:`${OUT}/bp-${w}.png`,clip:{x:0,y:0,width:w,height:80}});
  const d=await p.evaluate(()=>{const q=s=>document.querySelector(s);const R=e=>e?{l:+e.getBoundingClientRect().left.toFixed(1),r:+e.getBoundingClientRect().right.toFixed(1),vis:getComputedStyle(e).display}:null;
   return {w:innerWidth,mark:R(q('.nav__mark')),links:R(q('.nav__links')),cta:R(q('.cta')),burger:R(q('.nav__burger'))};});
  console.log(JSON.stringify(d));
  await ctx.close();
}
await b.close();
