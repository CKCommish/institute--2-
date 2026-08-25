import { launch } from '/home/user/institute--2-/tools/browser.mjs';
import fs from 'fs';
const png = fs.readFileSync('/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/raw.png').toString('base64');
const b = await launch({proxy:false});
const ctx = await b.newContext({viewport:{width:800,height:600}});
const p = await ctx.newPage();
await p.setContent('<img id="i" src="data:image/png;base64,'+png+'">');
await p.waitForFunction(()=>document.getElementById('i').complete);
const out = await p.evaluate(()=>{
  const img=document.getElementById('i');
  const c=document.createElement('canvas'); c.width=img.naturalWidth; c.height=img.naturalHeight;
  const x=c.getContext('2d'); x.drawImage(img,0,0);
  const d=x.getImageData(0,0,c.width,c.height).data;
  const rl=v=>{v/=255; return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};
  const RL=i=>0.2126*rl(d[i])+0.7152*rl(d[i+1])+0.0722*rl(d[i+2]);
  function stats(x0,y0,x1,y1){
    const vs=[]; for(let Y=y0;Y<y1;Y++) for(let X=x0;X<x1;X++) vs.push(RL((Y*c.width+X)*4));
    vs.sort((a,b)=>a-b);
    return {p5:vs[Math.floor(vs.length*0.05)], p50:vs[Math.floor(vs.length*0.5)], p95:vs[Math.floor(vs.length*0.95)], max:vs[vs.length-1], min:vs[0]};
  }
  const cr=(a,b)=>{const [h,l]=a>b?[a,b]:[b,a]; return (h+0.05)/(l+0.05);};
  const res={};
  const sub = stats(83,846,224,860);          // HEALTHY ATHLETES glyphs+bg
  const subBg = stats(240,846,360,860);       // ground right of it
  res.sub = {glyphMax:+sub.max.toFixed(4), bg:+subBg.p50.toFixed(4), contrast:+cr(sub.max, subBg.p50).toFixed(2)};
  const cred = stats(1206,88,1388,102);
  const credBg = stats(1000,88,1150,102);
  res.credit = {glyphMax:+cred.max.toFixed(4), bg:+credBg.p50.toFixed(4), contrast:+cr(cred.max,credBg.p50).toFixed(2)};
  const kick = stats(52,120,680,150);
  const kickBg = stats(720,120,1000,150);
  res.kicker = {glyphMax:+kick.max.toFixed(4), bg:+kickBg.p50.toFixed(4), contrast:+cr(kick.max,kickBg.p50).toFixed(2)};
  const nav = stats(853,24,930,38);
  const navBg = stats(1420,24,1439,38);
  res.nav = {glyphMax:+nav.max.toFixed(4), bg:+navBg.p50.toFixed(4), contrast:+cr(nav.max,navBg.p50).toFixed(2)};
  // display type over the brightest water
  const disp = stats(1000,420,1310,500);
  res.displayBand = {p5:+disp.p5.toFixed(4), p95:+disp.p95.toFixed(4), contrast:+cr(disp.p95,disp.p5).toFixed(2)};
  return res;
});
console.log(JSON.stringify(out,null,1));
await b.close();
