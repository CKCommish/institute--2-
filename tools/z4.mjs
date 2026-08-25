import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2});
const p=await ctx.newPage();
await p.goto('http://127.0.0.1:4454/pilots/',{waitUntil:'networkidle'}); await p.waitForTimeout(1000);
await p.evaluate(()=>window.scrollTo(0,1200)); await p.waitForTimeout(1400);
await p.screenshot({path:`${OUT}/z4-pilots-strip.png`,clip:{x:0,y:0,width:1440,height:130}});
// sample column of pixels for the scrim ramp
const px=await p.evaluate(async()=>{
  return null;
});
await p.goto('http://127.0.0.1:4454/people/',{waitUntil:'networkidle'}); await p.waitForTimeout(900);
await p.evaluate(()=>window.scrollTo(0,1500)); await p.waitForTimeout(1300);
await p.screenshot({path:`${OUT}/z4-people-strip.png`,clip:{x:0,y:0,width:1440,height:130}});
await p.goto('http://127.0.0.1:4454/partner/',{waitUntil:'networkidle'}); await p.waitForTimeout(900);
await p.evaluate(()=>window.scrollTo(0,700)); await p.waitForTimeout(1300);
await p.screenshot({path:`${OUT}/z4-partner-strip.png`,clip:{x:0,y:0,width:1440,height:130}});
await b.close(); console.log('ok');
