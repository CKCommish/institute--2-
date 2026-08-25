import { createRequire } from 'node:module';
const sharp = createRequire('/home/user/institute--2-/package.json')('sharp');
import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const lin=c=>{c/=255;return c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4;};
const Y=(r,g,b)=>0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
const L=y=>(y>0.008856?116*Math.cbrt(y)-16:903.3*y);
const ratio=(a,b)=>{const[x,y]=a>b?[a,b]:[b,a];return (x+0.05)/(y+0.05);};
const W = Number(process.argv[2]||390), H = Number(process.argv[3]||844);
const b = await launch({ proxy:false });
const ctx = await b.newContext({ viewport:{width:W,height:H}, isMobile:W<500, hasTouch:W<500, deviceScaleFactor:1 });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4411/', { waitUntil:'networkidle' });
await p.waitForTimeout(2200);
const items = await p.evaluate(() => {
  const sel = '.hero__kicker, .hero__poster, .hero__index-label, .hcell__i, .hcell__name, .hcell__sub, .hero__scroll .label';
  return [...document.querySelectorAll(sel)].map((e,i)=>{
    const r=e.getBoundingClientRect(); e.dataset.mid=i;
    return { i, t:e.textContent.trim().slice(0,22), c:getComputedStyle(e).color,
      x:Math.max(0,Math.floor(r.x)), y:Math.max(0,Math.floor(r.y)), w:Math.ceil(r.width), h:Math.ceil(r.height) };
  });
});
await p.addStyleTag({content:'.hero__mid,.hero__index-head,.hero__cells,.hero__rule{visibility:hidden !important}'});
await p.waitForTimeout(300);
const buf = await p.screenshot({ clip:{x:0,y:0,width:W,height:H} });
const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({resolveWithObject:true});
let worst = null;
for (const it of items) {
  const x1=Math.min(W,it.x+it.w), y1=Math.min(H,it.y+it.h);
  if (x1<=it.x||y1<=it.y) continue;
  const m=it.c.match(/[\d.]+/g).map(Number);
  const srgb = /color\(/.test(it.c);
  const fr = srgb?m[0]*255:m[0], fg2 = srgb?m[1]*255:m[1], fb = srgb?m[2]*255:m[2];
  const a = m[3]===undefined?1:m[3];
  let rows=[];
  for(let j=it.y;j<y1;j++){let sr=0,sg=0,sb=0,n=0;for(let i=it.x;i<x1;i++){const o=(j*info.width+i)*3;sr+=data[o];sg+=data[o+1];sb+=data[o+2];n++;}rows.push([sr/n,sg/n,sb/n]);}
  rows.sort((p,q)=>Y(q[0],q[1],q[2])-Y(p[0],p[1],p[2]));
  const bg = rows[Math.floor(rows.length*0.1)] ?? rows[0];
  const bright = Y(bg[0],bg[1],bg[2]);
  const eff = Y(fr*a+bg[0]*(1-a), fg2*a+bg[1]*(1-a), fb*a+bg[2]*(1-a));
  const cr = ratio(eff, bright);
  const rec = { t: it.t, L: +L(bright).toFixed(1), cr: +cr.toFixed(2) };
  console.log(rec.t.padEnd(24), 'bgL*', String(rec.L).padStart(5), ' contrast', rec.cr);
  if (!worst || cr < worst.cr) worst = rec;
}
console.log('WORST', JSON.stringify(worst));
await b.close();
