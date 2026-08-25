import { launch } from '/home/user/institute--2-/tools/browser.mjs';
import fs from 'node:fs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const label=process.argv[2]||'r0';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4411/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2200);
await p.addStyleTag({content:'.hero__mid,.hero__index,.fig__credit,header,nav,.skip-link,[class*=nav]{visibility:hidden !important}'});
await p.waitForTimeout(400);
const buf = await p.screenshot({ clip:{x:0,y:0,width:1440,height:900} });
fs.writeFileSync(`${OUT}/${label}-backdrop.png`, buf);
const dataUrl = 'data:image/png;base64,'+buf.toString('base64');
const p2 = await ctx.newPage();
await p2.goto('about:blank');
const res = await p2.evaluate(async (u)=>{
  const img = new Image(); img.src=u; await img.decode();
  const c=document.createElement('canvas'); c.width=img.width; c.height=img.height;
  const g=c.getContext('2d',{willReadFrequently:true}); g.drawImage(img,0,0);
  const d=g.getImageData(0,0,c.width,c.height).data; const W=c.width;
  const lin=v=>{v/=255; return v<=0.04045? v/12.92 : ((v+0.055)/1.055)**2.4;};
  const L=(x,y)=>{const i=(y*W+x)*4; const Y=0.2126*lin(d[i])+0.7152*lin(d[i+1])+0.0722*lin(d[i+2]); return Y>0.008856?116*Math.cbrt(Y)-16:903.3*Y;};
  const band=(y0,y1,x0,x1)=>{const a=[];for(let y=y0;y<y1;y+=3)for(let x=x0;x<x1;x+=4)a.push(L(x,y));a.sort((m,n)=>m-n);
    return {min:+a[0].toFixed(1),p50:+a[a.length>>1].toFixed(1),p95:+a[Math.floor(a.length*0.95)].toFixed(1),max:+a[a.length-1].toFixed(1)};};
  const rows=[]; for(let y=0;y<900;y+=60) rows.push([y, band(y,y+60,0,1440)]);
  return { rows,
    kicker: band(112,200,51,653),
    poster: band(206,563,51,1315),
    void_: band(563,777,0,1440),
    ledger: band(769,870,51,1389),
    credit: band(86,106,1190,1389),
    rightMid: band(250,560,1320,1440),
    farRight: band(120,560,1050,1440),
    whole: band(0,900,0,1440),
  };
}, dataUrl);
console.log('ROWS  y : min/p50/p95/max L*');
for(const [y,s] of res.rows) console.log(String(y).padStart(4), `${String(s.min).padStart(5)} ${String(s.p50).padStart(5)} ${String(s.p95).padStart(5)} ${String(s.max).padStart(5)}`);
console.log('\nREGIONS'); for(const k of ['kicker','poster','void_','ledger','credit','rightMid','farRight','whole']) console.log(' ',k.padEnd(9), JSON.stringify(res[k]));
await b.close();
