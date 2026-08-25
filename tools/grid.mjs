import { launch } from '/home/user/institute--2-/tools/browser.mjs';
import fs from 'node:fs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const mode=process.argv[2]||'bare';   // bare = photo only (no scrim/veil/vig) ; live = as shipped
const label=process.argv[3]||mode;
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4411/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2200);
let css='.hero__mid,.hero__index,.fig__credit,header,nav,.skip-link{visibility:hidden !important}';
if(mode==='bare') css+='.hero__veil,.hero .fig__scrim,.hero .fig__vig,.hero .fig__veil,.hero .fig__tint{opacity:0 !important;display:none !important}.hero .fig__media img{filter:none !important}';
await p.addStyleTag({content:css});
await p.waitForTimeout(400);
const buf = await p.screenshot({ clip:{x:0,y:0,width:1440,height:900} });
fs.writeFileSync(`${OUT}/${label}.png`, buf);
const dataUrl='data:image/png;base64,'+buf.toString('base64');
const p2=await ctx.newPage(); await p2.goto('about:blank');
const g = await p2.evaluate(async(u)=>{
  const img=new Image(); img.src=u; await img.decode();
  const c=document.createElement('canvas'); c.width=img.width;c.height=img.height;
  const x=c.getContext('2d',{willReadFrequently:true}); x.drawImage(img,0,0);
  const d=x.getImageData(0,0,c.width,c.height).data, W=c.width;
  const lin=v=>{v/=255;return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;};
  const L=(px,py)=>{const i=(py*W+px)*4;const Y=0.2126*lin(d[i])+0.7152*lin(d[i+1])+0.0722*lin(d[i+2]);return Y>0.008856?116*Math.cbrt(Y)-16:903.3*Y;};
  const cell=(x0,y0,w,h)=>{const a=[];for(let yy=y0;yy<y0+h;yy+=3)for(let xx=x0;xx<x0+w;xx+=3)a.push(L(xx,yy));a.sort((m,n)=>m-n);return +a[a.length>>1].toFixed(0);};
  const rows=[];
  for(let yy=0;yy<900;yy+=75){ const r=[]; for(let xx=0;xx<1440;xx+=160) r.push(cell(xx,yy,160,75)); rows.push([yy,r]); }
  return rows;
},dataUrl);
console.log(`--- ${mode} : median L* per 160x75 cell ---`);
console.log('   y |'+Array.from({length:9},(_,i)=>String(i*160).padStart(5)).join(''));
for(const [y,r] of g) console.log(String(y).padStart(4)+' |'+r.map(v=>String(v).padStart(5)).join(''));
await b.close();
