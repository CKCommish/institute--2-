import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy:false });
for (const [w,h] of [[320,568],[360,640],[390,844],[768,1024],[1024,900],[1440,900]]){
 const ctx=await b.newContext({viewport:{width:w,height:h}, isMobile:w<500, hasTouch:w<500});
 const p=await ctx.newPage(); await p.goto('http://127.0.0.1:4420/',{waitUntil:'networkidle'}); await p.waitForTimeout(2000);
 const r=await p.evaluate(()=>{
  const st=document.createElement('style'); st.textContent='.pbr{display:none !important}'; document.head.appendChild(st);
  const po=document.querySelector('.hero__poster');
  const pb=po.getBoundingClientRect();
  const ey=document.querySelector('.hero__index-label').getBoundingClientRect();
  const rg=document.createRange(); rg.selectNodeContents(po);
  const rc=[...rg.getClientRects()].filter(x=>x.width>1);
  const lines={};for(const x of rc){const k=Math.round(x.top);lines[k]=lines[k]||{l:1e9,r:-1e9};lines[k].l=Math.min(lines[k].l,x.left);lines[k].r=Math.max(lines[k].r,x.right);}
  const ks=Object.keys(lines).map(Number).sort((a,b)=>a-b);
  return {n:ks.length, widths:ks.map(k=>+(lines[k].r-lines[k].l).toFixed(0)), gap:+(ey.top-pb.bottom).toFixed(1)};
 });
 console.log(`BEFORE ${w}x${h}`, JSON.stringify(r));
 await ctx.close();
}
await b.close();
