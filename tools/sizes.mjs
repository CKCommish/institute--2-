import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b=await launch({proxy:false});
const c=await b.newContext({viewport:{width:1440,height:900}});
const p=await c.newPage();
await p.goto('http://127.0.0.1:4410/pilots/',{waitUntil:'networkidle'});
await p.waitForTimeout(1000);
console.log(await p.evaluate(()=>{const o=[];document.querySelectorAll('.pgrid *').forEach(e=>{if(!e.children.length&&e.textContent.trim()){const g=getComputedStyle(e);o.push([e.className,g.fontSize,g.fontWeight,g.letterSpacing,g.lineHeight,g.fontFamily.split(',')[0]].join(' | '))}});return [...new Set(o)].join('\n')}));
await b.close();
