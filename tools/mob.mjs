import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const BASE='http://127.0.0.1:4420/';
const set=[[320,568],[320,658],[320,700],[320,844],[344,882],[360,640],[360,780],[375,667],[375,812],[390,844],[393,852],[412,915],[430,932],[480,800],[540,960],[600,900],[620,1180]];
const b=await launch({proxy:false});
for(const [w,h] of set){
  const ctx=await b.newContext({viewport:{width:w,height:h},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const p=await ctx.newPage();
  await p.goto(BASE,{waitUntil:'networkidle'}); await p.waitForTimeout(1400);
  const d=await p.evaluate(()=>{
    const el=document.querySelector('.hero__poster'); const out=[];
    (function walk(n){ if(n.nodeType===3){const r=document.createRange();r.selectNodeContents(n);out.push(...r.getClientRects());} else n.childNodes.forEach(walk);})(el);
    const rows=[]; for(const r of out){ if(r.width<0.5)continue; let row=rows.find(x=>Math.abs(x.t-r.top)<6); if(!row)rows.push({t:r.top,l:r.left,r:r.right}); else {row.l=Math.min(row.l,r.left);row.r=Math.max(row.r,r.right);} }
    rows.sort((a,b)=>a.t-b.t);
    const hero=document.querySelector('.hero, section'); 
    const idx=document.querySelector('.hero__index').getBoundingClientRect();
    const pb=el.getBoundingClientRect();
    return {fs:+parseFloat(getComputedStyle(el).fontSize).toFixed(1), rows:rows.map(x=>+(x.r-x.l).toFixed(1)),
      posterBottom:+pb.bottom.toFixed(0), idxTop:+idx.top.toFixed(0), idxBottom:+idx.bottom.toFixed(0), vh:innerHeight,
      overflowY: document.documentElement.scrollWidth>innerWidth};
  });
  console.log(`${w}x${h} fs=${d.fs} lines=[${d.rows.join(' / ')}] posterB=${d.posterBottom} idxT=${d.idxTop} idxB=${d.idxBottom}/${d.vh} hOverflow=${d.overflowY}`);
  await ctx.close();
}
await b.close();
