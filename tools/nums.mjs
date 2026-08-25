import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const BASE='http://127.0.0.1:4460';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900}});
const p=await ctx.newPage();
for (const r of ['/','/institute/','/pilots/','/people/','/forum/','/partner/']) {
  await p.goto(BASE+r,{waitUntil:'networkidle'});
  const res = await p.evaluate(()=>{
    const out=[];
    document.querySelectorAll('main *').forEach(el=>{
      if (el.children.length) return;
      const t=(el.textContent||'').trim();
      if (!t || t.length>12) return;
      if (!/^[0-9]/.test(t)) return;
      const c=getComputedStyle(el);
      if (parseFloat(c.fontSize) < 18) return;
      out.push({t, cls: el.className, f:c.fontFamily.split(',')[0], s:c.fontSize, w:c.fontWeight, col:c.color});
    });
    return out;
  });
  console.log('==',r); res.forEach(o=>console.log('  ', JSON.stringify(o)));
}
await b.close();
