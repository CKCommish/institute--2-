import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport:{width:1440,height:900} });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4415/partner/', { waitUntil:'networkidle' });
console.log(await p.evaluate(()=>{
  const out=[];
  for (const ss of document.styleSheets) {
    let rules; try { rules = ss.cssRules } catch(e){ continue }
    for (const r of rules) if (r.cssText.includes('subgrid')) out.push(r.cssText.slice(0,400));
  }
  return { supportsSubgrid: CSS.supports('grid-template-columns','subgrid'), rules: out };
}));
await b.close();
