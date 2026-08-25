import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy:false });
const ctx=await b.newContext({viewport:{width:1440,height:900}});
const p=await ctx.newPage(); await p.goto('http://127.0.0.1:4420/',{waitUntil:'networkidle'}); await p.waitForTimeout(2200);
await p.addStyleTag({content:'.off .pbr{display:none !important}'});
for (const w of [1240,1200,1180,1152,1120,1100,1082,1060,1024,900,768,660,621,620]){
 await p.setViewportSize({width:w,height:900}); await p.waitForTimeout(150);
 const r=await p.evaluate(()=>{
  const po=document.querySelector('.hero__poster'); po.classList.add('off');
  const rg=document.createRange(); rg.selectNodeContents(po);
  const rc=[...rg.getClientRects()].filter(x=>x.width>1);
  const lines={};for(const x of rc){const k=Math.round(x.top);lines[k]=lines[k]||{l:1e9,r:-1e9};lines[k].l=Math.min(lines[k].l,x.left);lines[k].r=Math.max(lines[k].r,x.right);}
  const ks=Object.keys(lines).map(Number).sort((a,b)=>a-b);
  po.classList.remove('off');
  return {n:ks.length, widths:ks.map(k=>+(lines[k].r-lines[k].l).toFixed(0))};
 });
 console.log('BEFORE vw='+String(w).padStart(4), JSON.stringify(r));
}
await b.close();
