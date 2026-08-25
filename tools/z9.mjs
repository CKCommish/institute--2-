import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2});
const p=await ctx.newPage();
await p.goto('http://127.0.0.1:4454/',{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
const H=await p.evaluate(()=>document.body.scrollHeight-innerHeight);
const outs=[];
for(const f of [0.05,0.15,0.35,0.6,0.95]){
  await p.evaluate(y=>window.scrollTo(0,y),Math.round(H*f)); await p.waitForTimeout(1300);
  await p.screenshot({path:`${OUT}/p-${Math.round(f*100)}.png`,clip:{x:0,y:40,width:1440,height:40}});
  outs.push(f);
}
console.log(outs.join(','));
await b.close();
