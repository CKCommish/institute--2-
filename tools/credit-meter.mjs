/* credit-meter — SUPERSEDED by tools/credit-sweep.mjs, kept only as the
   single-sample spot check.

   Two defects were fixed here this wave rather than left as a trap for the
   next reader. (1) It hid each credit with `visibility: hidden`, which also
   hides that element's ::before — and `.fig__credit`'s ::before IS the
   painted wash the credit's legibility depends on. It was therefore measuring
   the raw photograph and reporting the credit far darker-grounded than a
   reader ever sees it: the same bug credit-sweep.mjs records. The glyphs are
   made transparent instead, so every painted layer stays. (2) BASE was
   hardcoded to port 4399, so it silently measured whatever else was serving
   there. On a held or parallaxed figure use credit-sweep: one sample of a
   moving backdrop is a coin toss.

   usage: BASE=http://127.0.0.1:4399 node tools/credit-meter.mjs */
import { launch } from './browser.mjs';
const srgb=c=>{c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);};
const lum=([r,g,b])=>0.2126*srgb(r)+0.7152*srgb(g)+0.0722*srgb(b);
const ratio=(a,b)=>{const[x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+0.05)/(y+0.05);};
const BASE = process.env.BASE || 'http://127.0.0.1:4399';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport:{width:1440,height:900} });
const p = await ctx.newPage();
for (const route of ['/', '/forum/', '/institute/']) {
  await p.goto(BASE+route,{waitUntil:'networkidle'});
  await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(800);
  const boxes = await p.evaluate(()=>[...document.querySelectorAll('.fig__credit')].map(el=>{
    const r=el.getBoundingClientRect();
    return {text:el.textContent.trim().slice(0,34), x:Math.round(r.x), y:Math.round(r.y+window.scrollY), w:Math.round(r.width), h:Math.round(r.height), color:getComputedStyle(el).color};
  }));
  for (const box of boxes) {
    if (box.w<4||box.h<4) continue;
    await p.evaluate((y)=>window.scrollTo(0,Math.max(0,y-300)), box.y);
    await p.waitForTimeout(500);
    // hide the text, sample the backdrop it sits on
    await p.evaluate(()=>document.querySelectorAll('.fig__credit').forEach(e=>{
      e.style.setProperty('color','transparent','important');
      e.style.setProperty('-webkit-text-fill-color','transparent','important');
      e.style.setProperty('text-shadow','none','important');
      e.querySelectorAll('*').forEach(c=>c.style.setProperty('visibility','hidden','important'));
    }));
    await p.waitForTimeout(150);
    const shot = await p.screenshot({ clip:{ x:box.x, y:Math.max(0,box.y-Math.max(0,box.y-300)), width:box.w, height:box.h } }).catch(()=>null);
    await p.evaluate(()=>document.querySelectorAll('.fig__credit').forEach(e=>{
      ['color','-webkit-text-fill-color','text-shadow'].forEach(k=>e.style.removeProperty(k));
      e.querySelectorAll('*').forEach(c=>c.style.removeProperty('visibility'));
    }));
    if (!shot) continue;
    const sharp=(await import('sharp')).default;
    const { data, info } = await sharp(shot).raw().toBuffer({resolveWithObject:true});
    const px=[]; for(let i=0;i<data.length;i+=info.channels) px.push(lum([data[i],data[i+1],data[i+2]]));
    px.sort((a,c)=>a-c);
    const p95=px[Math.floor(px.length*0.95)];
    const L=(l)=>l<=0.008856?l*903.3:116*Math.pow(l,1/3)-16;
    const fg=(box.color.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
    const bright=[Math.round(255*Math.pow(p95,1/2.2)),Math.round(255*Math.pow(p95,1/2.2)),Math.round(255*Math.pow(p95,1/2.2))];
    console.log(route.padEnd(13), box.text.padEnd(30), 'backdrop p95 L*', L(p95).toFixed(1).padStart(5), ' contrast vs cream', ratio([242,237,227],bright).toFixed(2)+':1');
  }
}
await b.close();
