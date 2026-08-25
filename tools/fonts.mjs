import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy:false });
const ctx = await b.newContext({ viewport:{width:1440,height:900} });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4410/partner/', { waitUntil:'networkidle' });
await p.waitForTimeout(2500);
console.log(JSON.stringify(await p.evaluate(()=>{
  const out=[];
  document.querySelectorAll('*').forEach(e=>{
    const f=getComputedStyle(e).fontFamily;
    if(!/Libre Franklin|Newsreader/.test(f)) out.push({tag:e.tagName,cls:e.className&&e.className.baseVal!==undefined?e.className.baseVal:e.className,f});
  });
  const cols=[];
  document.querySelectorAll('body *').forEach(e=>{
    const c=getComputedStyle(e);
    if(/126, 100, 49/.test(c.color)) cols.push({tag:e.tagName,cls:''+(e.className.baseVal??e.className),color:c.color});
  });
  return {nonHouseFont:out.slice(0,12), darkBrass:cols.slice(0,8)};
}),null,1));
await b.close();
