import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b=await launch({proxy:false});
const jobs=[[1440,900,false],[1180,900,false],[1024,900,false],[900,900,false],[760,900,false],[621,900,false],[390,844,true]];
for (const [w,h,mob] of jobs){
  const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,isMobile:mob,hasTouch:mob});
  const p=await ctx.newPage();
  await p.goto('http://127.0.0.1:4420/pilots/',{waitUntil:'networkidle'});
  await p.waitForTimeout(1400);
  await p.screenshot({path:`v-${w}-top.png`});
  await p.evaluate(async()=>{const H=document.body.scrollHeight;for(let y=0;y<H;y+=250){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,35));}});
  await p.waitForTimeout(1000);
  await p.evaluate(()=>{const g=document.querySelector('.pgrid');window.scrollTo(0,g.getBoundingClientRect().top+window.scrollY-10);});
  await p.waitForTimeout(900);
  await p.screenshot({path:`v-${w}-band.png`});
  const gh=await p.evaluate(()=>document.querySelector('.pgrid').getBoundingClientRect().height);
  if(gh>h-40){await p.evaluate(()=>window.scrollBy(0,600));await p.waitForTimeout(700);await p.screenshot({path:`v-${w}-band2.png`});}
  await ctx.close();
}
await b.close();
console.log('ok');
