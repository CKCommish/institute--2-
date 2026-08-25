import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2});
const p=await ctx.newPage();
await p.goto('http://127.0.0.1:4454/',{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
const cy=await p.evaluate(()=>{const e=document.querySelector('.on-cream');return scrollY+e.getBoundingClientRect().top;});
for(const d of [-10,10,25,40,55]){
  await p.evaluate(y=>window.scrollTo(0,y),cy+d); await p.waitForTimeout(1300);
  await p.screenshot({path:`${OUT}/inv-${d}.png`,clip:{x:0,y:0,width:1440,height:110}});
}
// tops of each route
for(const r of ['/institute/','/forum/','/people/','/404']){
  await p.goto('http://127.0.0.1:4454'+r,{waitUntil:'networkidle'}); await p.waitForTimeout(1100);
  await p.screenshot({path:`${OUT}/top${r.replace(/\//g,'-')}.png`,clip:{x:0,y:0,width:1440,height:110}});
}
await b.close(); console.log('ok');
