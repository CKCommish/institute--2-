import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy:false });
for (const w of [901,960,1024,1100,1130,1140,1200,1280,1440]){
  const ctx = await b.newContext({ viewport:{width:w,height:900} });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4420/partner/', { waitUntil:'networkidle' });
  await p.evaluate(()=>document.querySelector('#ways').scrollIntoView());
  await p.waitForTimeout(900);
  const r = await p.evaluate(()=>[...document.querySelectorAll('.door')].map(d=>{
    const t=d.querySelector('.door__go-t');
    const rects=[...t.getClientRects()];
    const b=t.getBoundingClientRect();
    return {n:rects.length, top:Math.round(b.top), bot:Math.round(b.bottom), left:Math.round(b.left*10)/10, l2:rects[1]?Math.round(rects[1].left*10)/10:null};
  }));
  console.log(w, JSON.stringify(r));
  await ctx.close();
}
await b.close();
