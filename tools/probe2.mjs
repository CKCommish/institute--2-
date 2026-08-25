import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const { createRequire } = await import('module');
const require = createRequire('/home/user/institute--2-/package.json');
const sharp = require('sharp');
const b=await launch({proxy:false});
for (const w of [1440,1180,1024,900,760,700,621,620,390]){
  const mobile=w<=620;
  const ctx=await b.newContext({viewport:{width:w,height:mobile?844:900},deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
  const p=await ctx.newPage();
  await p.goto('http://127.0.0.1:4420/pilots/',{waitUntil:'networkidle'});
  // slow scroll through whole page to fire all reveals
  await p.evaluate(async()=>{const H=document.body.scrollHeight;for(let y=0;y<H;y+=300){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}});
  await p.waitForTimeout(1200);
  await p.evaluate(()=>document.querySelector('.pgrid__grid').scrollIntoView({block:'start'}));
  await p.waitForTimeout(1200);
  const el=await p.$('.pgrid__grid');
  await el.screenshot({path:`g-${w}.png`});
  const rel=await p.evaluate(()=>{
    const g=document.querySelector('.pgrid__grid').getBoundingClientRect();
    const cells=[...document.querySelectorAll('.pgrid__cell')].map(c=>{const r=c.getBoundingClientRect();
      const a=getComputedStyle(c,'::after');
      return {x:r.x-g.x,y:r.y-g.y,w:r.width,h:r.height,disp:a.display,op:getComputedStyle(c).opacity,tr:getComputedStyle(c).transform};});
    return {gw:g.width,gh:g.height,gap:parseFloat(getComputedStyle(document.querySelector('.pgrid__grid')).columnGap),cells};
  });
  const {data,info}=await sharp(`g-${w}.png`).raw().toBuffer({resolveWithObject:true});
  const px=(x,y)=>{const o=(y*info.width+x)*info.channels;return [data[o],data[o+1],data[o+2]];};
  const lines=[];
  rel.cells.forEach((c,i)=>{
    if(i===0) return;
    const rx=Math.round(c.x-rel.gap/2);
    const samples=[0.1,0.4,0.7,0.86,0.94,0.99].map(f=>{
      const y=Math.min(info.height-1,Math.round(c.y+c.h*f));
      let best=null;for(let dx=-2;dx<=2;dx++){const q=px(rx+dx,y);const s=q[0]+q[1]+q[2];if(!best||s>best.s)best={s,dx,q};}
      const bg=px(Math.max(0,rx-12),y); const d=best.s-(bg[0]+bg[1]+bg[2]);
      return `${f}:${d}`;
    });
    lines.push(`c${i} rx=${rx} disp=${c.disp} op=${c.op} deltas[${samples.join(' ')}]`);
  });
  console.log(`W${w} grid ${Math.round(rel.gw)}x${Math.round(rel.gh)} img ${info.width}x${info.height} gap=${rel.gap}`);
  lines.forEach(l=>console.log('   '+l));
  await ctx.close();
}
await b.close();
