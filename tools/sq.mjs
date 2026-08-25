import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy:false });
for (const [w,h] of [[375,667],[360,640],[320,568],[390,844],[414,896]]){
 const ctx=await b.newContext({viewport:{width:w,height:h}, isMobile:true, hasTouch:true});
 const p=await ctx.newPage(); await p.goto('http://127.0.0.1:4420/',{waitUntil:'networkidle'}); await p.waitForTimeout(2200);
 const r=await p.evaluate(()=>{
  const po=document.querySelector('.hero__poster').getBoundingClientRect();
  const ey=document.querySelector('.hero__index-label').getBoundingClientRect();
  const c4=document.querySelector('.hcell:last-child').getBoundingClientRect();
  const rg=document.createRange(); rg.selectNodeContents(document.querySelector('.hero__poster'));
  const rc=[...rg.getClientRects()].filter(x=>x.width>1);
  const lines={};for(const x of rc){const k=Math.round(x.top);lines[k]=lines[k]||{l:1e9,r:-1e9};lines[k].l=Math.min(lines[k].l,x.left);lines[k].r=Math.max(lines[k].r,x.right);}
  const ks=Object.keys(lines).map(Number).sort((a,b)=>a-b);
  return {n:ks.length, widths:ks.map(k=>+(lines[k].r-lines[k].l).toFixed(0)), posterBottom:+po.bottom.toFixed(1), eyebrowTop:+ey.top.toFixed(1), gap:+(ey.top-po.bottom).toFixed(1), c4bottom:+c4.bottom.toFixed(1), vh:innerHeight, belowFold:+(c4.bottom-innerHeight).toFixed(1)};
 });
 console.log(`${w}x${h}`, JSON.stringify(r));
 await ctx.close();
}
await b.close();
