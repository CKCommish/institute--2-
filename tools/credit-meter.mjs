import { launch } from './browser.mjs';
const srgb=c=>{c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);};
const lum=([r,g,b])=>0.2126*srgb(r)+0.7152*srgb(g)+0.0722*srgb(b);
const ratio=(a,b)=>{const[x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+0.05)/(y+0.05);};
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport:{width:1440,height:900} });
const p = await ctx.newPage();
for (const route of ['/', '/forum/', '/institute/']) {
  await p.goto('http://127.0.0.1:4399'+route,{waitUntil:'networkidle'});
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
    await p.evaluate(()=>document.querySelectorAll('.fig__credit').forEach(e=>e.style.visibility='hidden'));
    await p.waitForTimeout(150);
    const shot = await p.screenshot({ clip:{ x:box.x, y:Math.max(0,box.y-Math.max(0,box.y-300)), width:box.w, height:box.h } }).catch(()=>null);
    await p.evaluate(()=>document.querySelectorAll('.fig__credit').forEach(e=>e.style.visibility=''));
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
