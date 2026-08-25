import { launch } from '/home/user/institute--2-/tools/browser.mjs';
import sharp from 'sharp';
import fs from 'fs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const S=3;
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:S});
const p=await ctx.newPage();
await p.goto('http://127.0.0.1:4420/',{waitUntil:'networkidle'});
await p.waitForTimeout(2800);
const bands=await p.evaluate(()=>{
  const rows=(el)=>{const out=[];(function w(n){if(n.nodeType===3){const r=document.createRange();r.selectNodeContents(n);out.push(...r.getClientRects());}else n.childNodes.forEach(w);})(el);
    const m=[];for(const r of out){if(r.width<0.5)continue;let x=m.find(y=>Math.abs(y.t-r.top)<6);if(!x)m.push({t:r.top,b:r.bottom,l:r.left});else{x.t=Math.min(x.t,r.top);x.b=Math.max(x.b,r.bottom);}}
    m.sort((a,b)=>a.t-b.t);return m;};
  const out=[];
  const add=(name,el)=>{ if(!el) return; rows(el).forEach((r,i)=>out.push({name:name+(i?`-l${i+1}`:''),t:r.t,b:r.b})); };
  add('kicker',document.querySelector('.hero__kicker'));
  add('poster',document.querySelector('.hero__poster'));
  add('eyebrow',document.querySelector('.hero__index-label'));
  add('idx01',document.querySelector('.hcell .hcell__i'));
  add('name01',document.querySelector('.hcell .hcell__name'));
  const rule=document.querySelector('.hero__rule').getBoundingClientRect();
  out.push({name:'RULE',t:rule.top,b:rule.bottom});
  return out;
});
await p.screenshot({path:`${OUT}/ink3x.png`});
await ctx.close(); await b.close();
const raw=await sharp(`${OUT}/ink3x.png`).raw().toBuffer({resolveWithObject:true});
const png={width:raw.info.width,height:raw.info.height,ch:raw.info.channels,data:raw.data};
function inkLeft(t,bm){
  const y0=Math.max(0,Math.round(t*S)), y1=Math.min(png.height,Math.round(bm*S));
  // peak ink per column in band, over first 300 css px
  let peak=0; const cols=[];
  for(let x=0;x<Math.round(300*S);x++){let m=0;
    for(let y=y0;y<y1;y++){const i=(png.width*y+x)*png.ch;const l=0.299*png.data[i]+0.587*png.data[i+1]+0.114*png.data[i+2];
      // ink = brightness above local dark ground
      m=Math.max(m,l);}
    cols.push(m); peak=Math.max(peak,m);}
  const half=peak*0.5;
  for(let x=0;x<cols.length;x++) if(cols[x]>=half) return {x:+(x/S).toFixed(2),peak:+peak.toFixed(0)};
  return null;
}
for(const bnd of bands){ const r=inkLeft(bnd.t,bnd.b); console.log(bnd.name.padEnd(12), JSON.stringify(r)); }
