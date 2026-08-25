import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy:false });
const ctx = await b.newContext({ viewport:{width:1440,height:900} });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4420/', {waitUntil:'networkidle'});
await p.waitForTimeout(2200);
for (const w of [700,660,640,621,620,600,560,520,480,440,400,390,375,360,340,320]){
  await p.setViewportSize({width:w,height:844}); await p.waitForTimeout(160);
  const r=await p.evaluate(()=>{const e=document.querySelector('.hero__kicker');const rg=document.createRange();rg.selectNodeContents(e);const rc=[...rg.getClientRects()].filter(x=>x.width>1);
   const lines={};for(const x of rc){const k=Math.round(x.top);lines[k]=lines[k]||{l:1e9,r:-1e9};lines[k].l=Math.min(lines[k].l,x.left);lines[k].r=Math.max(lines[k].r,x.right);}
   const ks=Object.keys(lines).map(Number).sort((a,b)=>a-b);
   const rule=document.querySelector('.hero__rule').getBoundingClientRect();
   return {n:ks.length,w:ks.map(k=>+(lines[k].r-lines[k].l).toFixed(0)), avail:+rule.width.toFixed(0), fs:getComputedStyle(e).fontSize};});
  console.log('vw='+String(w).padStart(4), 'kickerLines='+r.n, JSON.stringify(r.w), 'avail='+r.avail, 'fs='+r.fs);
}
await b.close();
