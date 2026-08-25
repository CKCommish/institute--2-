import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const W=1440,H=900;
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport:{width:W,height:H}, deviceScaleFactor:3 });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4411/',{waitUntil:'networkidle'});
await p.waitForTimeout(2200);
await p.addStyleTag({content:'.hero__bg,.hero__veil,.hero__index::before{opacity:0 !important}.hero{background:#000 !important}'});
await p.waitForTimeout(300);
const bands = await p.evaluate(()=>{
  const q=s=>document.querySelector(s);
  const B=e=>{const b=e.getBoundingClientRect();return{y:b.y,h:b.height};};
  return {
    'kicker T'  : B(q('.hero__kicker')),
    'poster L1 t': {y:166.7+18, h:90},
    'poster L2 t': {y:284.1+18, h:90},
    'poster L3 A': {y:401.5+18, h:90},
    'rule'      : (()=>{const b=q('.hero__rule').getBoundingClientRect();return{y:b.y-1,h:3};})(),
    'eyebrow F' : B(q('.hero__index-label')),
    'index 01'  : B(q('.hcell__i')),
    'name S'    : B(q('.hcell__name')),
  };
});
const buf = await p.screenshot({clip:{x:0,y:0,width:W,height:H}});
const du='data:image/png;base64,'+buf.toString('base64');
const p2=await ctx.newPage(); await p2.goto('about:blank');
const out = await p2.evaluate(async({u,bands,W})=>{
  const img=new Image(); img.src=u; await img.decode();
  const c=document.createElement('canvas'); c.width=img.width;c.height=img.height;
  const g=c.getContext('2d',{willReadFrequently:true}); g.drawImage(img,0,0);
  const S=img.width/W, d=g.getImageData(0,0,c.width,c.height).data, CW=c.width;
  const lum=(x,y)=>{const i=((y|0)*CW+(x|0))*4;return (d[i]+d[i+1]+d[i+2])/3;};
  const res={};
  for(const [k,bd] of Object.entries(bands)){
    // column max over the band, for x in 40..120
    const cols=[]; let peak=0;
    for(let x=40;x<140;x+=1/3){ let m=0; for(let y=bd.y;y<bd.y+bd.h;y+=1/3) m=Math.max(m,lum(x*S,y*S)); cols.push([x,m]); peak=Math.max(peak,m); }
    const thr=peak*0.5;
    const first=cols.find(([x,m])=>m>=thr);
    res[k]={ inkAt:+first[0].toFixed(2), peak:+peak.toFixed(0) };
  }
  return res;
},{u:du,bands,W});
console.log('layout rail = 51.36');
for(const [k,v] of Object.entries(out)) console.log('  '+k.padEnd(12), 'ink starts', String(v.inkAt).padStart(7), ' (Δ', (v.inkAt-51.36).toFixed(2)+')  peak', v.peak);
await b.close();
