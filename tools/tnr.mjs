import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b=await launch({proxy:false});
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://127.0.0.1:4410/people/',{waitUntil:'networkidle'});
await p.waitForTimeout(1000);
const r=await p.evaluate(()=>{
  const out=[];
  document.querySelectorAll('*').forEach(e=>{
    const s=getComputedStyle(e);
    if(/Times/.test(s.fontFamily)){
      const rect=e.getBoundingClientRect();
      out.push({tag:e.tagName, cls:(typeof e.className==='string'?e.className:''), ff:s.fontFamily, txt:(e.textContent||'').trim().slice(0,50), fs:s.fontSize, x:Math.round(rect.left), y:Math.round(rect.top+scrollY), w:Math.round(rect.width), h:Math.round(rect.height), vis:s.visibility, disp:s.display});
    }
  });
  return out;
});
console.log(JSON.stringify(r,null,1));
await b.close();
