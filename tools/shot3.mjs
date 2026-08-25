import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad';
const b = await launch({proxy:false});
const ctx = await b.newContext({viewport:{width:1440,height:900}});
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4454/pilots/',{waitUntil:'networkidle'});
const H=await p.evaluate(()=>document.body.scrollHeight);
for(let y=0;y<H;y+=400){await p.evaluate(v=>scrollTo(0,v),y);await p.waitForTimeout(100);}
await p.waitForTimeout(2000);
const s = await p.$('#infant-mortality');
await p.evaluate(()=>{const e=document.querySelector('#infant-mortality');scrollTo(0,e.getBoundingClientRect().top+scrollY-8);});
await p.waitForTimeout(1000);
const link = await p.$('#infant-mortality a');
await link.hover(); await p.waitForTimeout(700);
await p.screenshot({path:`${OUT}/s3-hover.png`, clip:{x:840,y:500,width:600,height:300}});
// focus-visible
await p.evaluate(()=>document.querySelector('#infant-mortality a').blur());
await p.keyboard.press('Tab');
await p.evaluate(()=>{const a=document.querySelector('#infant-mortality a'); a.focus();});
await p.waitForTimeout(400);
await p.screenshot({path:`${OUT}/s3-focus-mousefocus.png`, clip:{x:840,y:500,width:600,height:300}});
// real keyboard focus: tab until the link
await p.evaluate(()=>document.activeElement.blur());
for(let i=0;i<40;i++){ await p.keyboard.press('Tab');
  const ok = await p.evaluate(()=>document.activeElement?.closest('#infant-mortality')&&document.activeElement.tagName==='A');
  if(ok) break; }
await p.waitForTimeout(500);
await p.screenshot({path:`${OUT}/s3-focus-kbd.png`, clip:{x:820,y:480,width:620,height:330}});
console.log('focused:', await p.evaluate(()=>document.activeElement.outerHTML.slice(0,120)));
// active state
await p.mouse.move(956,735); await p.mouse.down(); await p.waitForTimeout(300);
await p.screenshot({path:`${OUT}/s3-active.png`, clip:{x:840,y:500,width:600,height:300}});
await p.mouse.up();
// reduced motion render
const ctx2 = await b.newContext({viewport:{width:1440,height:900}, reducedMotion:'reduce'});
const p2 = await ctx2.newPage();
await p2.goto('http://127.0.0.1:4454/pilots/',{waitUntil:'networkidle'});
await p2.evaluate(()=>{const e=document.querySelector('#infant-mortality');scrollTo(0,e.getBoundingClientRect().top+scrollY-8);});
await p2.waitForTimeout(1200);
await p2.screenshot({path:`${OUT}/s3-reduced.png`});
// mobile
const ctx3 = await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
const p3 = await ctx3.newPage();
await p3.goto('http://127.0.0.1:4454/pilots/',{waitUntil:'networkidle'});
const H3=await p3.evaluate(()=>document.body.scrollHeight);
for(let y=0;y<H3;y+=300){await p3.evaluate(v=>scrollTo(0,v),y);await p3.waitForTimeout(80);}
await p3.waitForTimeout(2000);
const bs = await p3.$$eval('section.pd',els=>els.map(e=>({y:e.getBoundingClientRect().top+scrollY,h:e.getBoundingClientRect().height})));
for(const [i,bx] of bs.entries()){
  await p3.evaluate(y=>scrollTo(0,y),bx.y-8); await p3.waitForTimeout(1000);
  await p3.screenshot({path:`${OUT}/s3-mob-${i+1}a.png`});
  await p3.evaluate(y=>scrollTo(0,y),bx.y+bx.h-844+8); await p3.waitForTimeout(1000);
  await p3.screenshot({path:`${OUT}/s3-mob-${i+1}b.png`});
}
await b.close();
