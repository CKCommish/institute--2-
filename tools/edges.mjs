import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const W=Number(process.argv[2]||1440), H=Number(process.argv[3]||900);
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport:{width:W,height:H}, deviceScaleFactor:2, isMobile:W<500, hasTouch:W<500 });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4411/',{waitUntil:'networkidle'});
await p.waitForTimeout(2200);
// isolate the type: hide the photo + veil, paint a flat ground
await p.addStyleTag({content:'.hero__bg,.hero__veil,.hero__index::before{opacity:0 !important}.hero{background:#000 !important}'});
await p.waitForTimeout(300);
const rows = await p.evaluate(()=>{
  const q=s=>document.querySelector(s);
  const r=e=>{const b=e.getBoundingClientRect();return{y:b.y,h:b.height};};
  const lines=(el)=>{const g=document.createRange();g.selectNodeContents(el);return [...g.getClientRects()].map(b=>({y:b.y,h:b.height}));};
  return {
    kicker: lines(q('.hero__kicker')),
    poster: lines(q('.hero__poster')),
    rule: r(q('.hero__rule')),
    eyebrow: r(q('.hero__index-label')),
    idx: r(q('.hcell__i')),
    gutter: parseFloat(getComputedStyle(q('.shell')).paddingLeft),
  };
});
const buf = await p.screenshot({clip:{x:0,y:0,width:W,height:H}});
const du='data:image/png;base64,'+buf.toString('base64');
const p2=await ctx.newPage(); await p2.goto('about:blank');
const out = await p2.evaluate(async({u,rows,W})=>{
  const img=new Image(); img.src=u; await img.decode();
  const c=document.createElement('canvas'); c.width=img.width;c.height=img.height;
  const g=c.getContext('2d',{willReadFrequently:true}); g.drawImage(img,0,0);
  const S=img.width/W, d=g.getImageData(0,0,c.width,c.height).data, CW=c.width;
  const lum=(x,y)=>{const i=((y|0)*CW+(x|0))*4;return (d[i]+d[i+1]+d[i+2])/3;};
  const scan=(y0,h,thr=40)=>{ let L=null,R=null;
    for(let x=0;x<W && L===null;x++) for(let y=y0;y<y0+h;y+=0.5){ if(lum(x*S,y*S)>thr){L=x;break;} }
    for(let x=W-1;x>=0 && R===null;x--) for(let y=y0;y<y0+h;y+=0.5){ if(lum(x*S,y*S)>thr){R=x;break;} }
    return {L,R}; };
  const res={};
  res.kicker = rows.kicker.map(l=>scan(l.y,l.h));
  res.poster = rows.poster.map(l=>scan(l.y,l.h));
  res.rule = scan(rows.rule.y-1, 3, 12);
  res.eyebrow = scan(rows.eyebrow.y, rows.eyebrow.h);
  res.idx = scan(rows.idx.y, rows.idx.h, 25);
  return res;
},{u:du,rows,W});
console.log('gutter (layout left/right margin):', rows.gutter, '/', W-rows.gutter);
console.log('ink edges (px):');
out.kicker.forEach((s,i)=>console.log('  kicker L'+(i+1), s));
out.poster.forEach((s,i)=>console.log('  poster L'+(i+1), s));
console.log('  rule     ', out.rule);
console.log('  eyebrow  ', out.eyebrow);
console.log('  index 01 ', out.idx);
await b.close();
