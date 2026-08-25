import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({proxy:false});
const ctx = await b.newContext({viewport:{width:390,height:844}, isMobile:true, hasTouch:true});
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4451/',{waitUntil:'networkidle'});
await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate(()=>{
  const out=[];
  document.querySelectorAll('header a, header button').forEach(e=>{
    const c=getComputedStyle(e), b=e.getBoundingClientRect();
    out.push({t:e.textContent.trim().slice(0,24), br:c.borderRadius, h:+b.height.toFixed(1), w:+b.width.toFixed(1), bc:c.borderColor, bg:c.backgroundColor});
  });
  return out;
})));
await b.close();
