import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({proxy:false});
const ctx = await b.newContext({viewport:{width:1440,height:900}});
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4451/',{waitUntil:'networkidle'});
await p.waitForTimeout(2500);
const r = await p.evaluate(()=>{
  const hero=document.querySelector('.hero');
  const out={html:hero.outerHTML.slice(0,4000)};
  const walk=[];
  hero.querySelectorAll('*').forEach(el=>{
    const cs=getComputedStyle(el); const b=el.getBoundingClientRect();
    if(cs.overflow!=='visible'||cs.overflowY!=='visible'){
      walk.push({sel:el.tagName+'.'+el.className, ov:cs.overflow, h:b.height, lh:cs.lineHeight, fs:cs.fontSize, sh:el.scrollHeight});
    }
  });
  out.clips=walk;
  const H=hero.querySelector('h1');
  out.h1={fs:getComputedStyle(H).fontSize, lh:getComputedStyle(H).lineHeight, ls:getComputedStyle(H).letterSpacing, ff:getComputedStyle(H).fontFamily, fw:getComputedStyle(H).fontWeight, rect:H.getBoundingClientRect().toJSON()};
  return out;
});
console.log(JSON.stringify(r.clips,null,1));
console.log(JSON.stringify(r.h1,null,1));
console.log(r.html);
await b.close();
