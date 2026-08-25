import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/crit2';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:2 });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4455/partner/', { waitUntil:'networkidle' });
await p.waitForTimeout(1200);
await p.evaluate(()=>window.scrollTo(0,1700));
await p.waitForTimeout(5000);
const box = await p.evaluate(()=>{
  const r = (s)=>{const e=document.querySelector(s); const b=e.getBoundingClientRect(); return [b.x,b.y,b.width,b.height];};
  return { eyebrow: r('.proles .eyebrow'), bridge: r('.proles__bridge'), h2: r('.proles__h'), p1: r('.door__p') };
});
console.log(JSON.stringify(box));
await p.screenshot({ path: `${OUT}/cream-mid.png` });
await ctx.close(); await b.close();
