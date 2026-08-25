import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport:{width:1440,height:900} });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4411/',{waitUntil:'networkidle'});
await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>{
  const el=document.querySelector('.hero__index');
  const cs=getComputedStyle(el,'::before');
  const own=getComputedStyle(el);
  return JSON.stringify({content:cs.content, bg:cs.backgroundImage.slice(0,180), top:cs.top, zi:cs.zIndex, pos:cs.position,
    parentPos:own.position, parentZ:own.zIndex, rect:el.getBoundingClientRect().toJSON()},null,1);
}));
await b.close();
