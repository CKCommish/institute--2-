import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const S='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots/';
const b = await launch({ proxy:false });
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://127.0.0.1:4454/people/',{waitUntil:'networkidle'});
for (const y of [500,1000,1500,1900]) { await p.evaluate(v=>window.scrollTo(0,v),y); await p.waitForTimeout(400); }
await p.waitForTimeout(4000);
const info = await p.evaluate(()=>{
  const el=document.querySelector('.bd__claim');
  const l=el.querySelector('.line')||el;
  const r=el.getBoundingClientRect();
  return {top:Math.round(r.top), cls:el.className, inner:el.innerHTML.slice(0,200), maskLine:getComputedStyle(l).webkitMaskImage||getComputedStyle(l).maskImage, op:getComputedStyle(l).opacity, tr:getComputedStyle(l).transform};
});
console.log(JSON.stringify(info,null,1));
await p.screenshot({path:S+'claim-settled.png'});
await b.close();
