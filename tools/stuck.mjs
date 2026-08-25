import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({proxy:false});
for (const vp of [{width:1440,height:900},{width:390,height:844},{width:1440,height:760}]) {
  const ctx = await b.newContext({viewport:vp,isMobile:vp.width<500,hasTouch:vp.width<500});
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4455/partner/',{waitUntil:'networkidle'});
  await p.waitForTimeout(1200);
  const H = await p.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<H;y+=Math.round(vp.height/3)){ await p.evaluate(v=>window.scrollTo(0,v),y); await p.waitForTimeout(280); }
  await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(400);
  // walk down again slowly and record any element in viewport with opacity<0.9 or transform
  const bad = await p.evaluate(async ()=>{
    const out=[]; const H=document.documentElement.scrollHeight;
    for(let y=0;y<H;y+=200){ window.scrollTo(0,y); await new Promise(r=>setTimeout(r,220)); }
    await new Promise(r=>setTimeout(r,1200));
    document.querySelectorAll('[data-reveal],[data-settle],[data-wipe],.lines,[data-seq] > *').forEach(e=>{
      const cs=getComputedStyle(e); const o=parseFloat(cs.opacity);
      const r=e.getBoundingClientRect();
      if(o<0.95||cs.transform!=='none'&&cs.transform!=='matrix(1, 0, 0, 1, 0, 0)') out.push({c:e.className||e.tagName, o, t:cs.transform, y:Math.round(r.top+scrollY)});
    });
    return out;
  });
  // ask/arrow overshoot
  const geo = await p.evaluate(()=>{
    const q=s=>{const e=document.querySelector(s); if(!e)return null; const r=e.getBoundingClientRect(); return [+r.left.toFixed(1),+r.right.toFixed(1)];};
    return {shellR:q('.shell'), rule:q('.ask__rule'), arrow:q('.ask__arrow'), pArrow:q('.pindex__arrow')};
  });
  console.log(JSON.stringify(vp), 'stuck:', JSON.stringify(bad), 'geo:', JSON.stringify(geo));
  await ctx.close();
}
await b.close();
