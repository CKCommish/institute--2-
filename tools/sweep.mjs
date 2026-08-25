import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy:false });
const ctx = await b.newContext({ viewport:{width:1440,height:900} });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4420/partner/', { waitUntil:'networkidle' });
for (let w=901; w<=1200; w+=1){
  await p.setViewportSize({width:w,height:900});
  const r = await p.evaluate(()=>{
    const ds=[...document.querySelectorAll('.door')];
    return ds.map(d=>{
      const t=d.querySelector('.door__go-t');
      const rects=[...t.getClientRects()];
      const go=d.querySelector('.door__go').getBoundingClientRect();
      return {lines:rects.length, goTop:Math.round(go.top*100)/100, h:Math.round(t.getBoundingClientRect().height*100)/100};
    });
  });
  const wrapped = r.some(x=>x.lines>1);
  const tops = r.map(x=>x.goTop);
  const aligned = new Set(tops).size===1;
  if (w===901||w%20===0||wrapped!==(global.__last??false)) console.log(w, JSON.stringify(r.map(x=>x.lines)), 'goTops', JSON.stringify(tops), aligned?'':'MISALIGNED');
  global.__last=wrapped;
}
await b.close();
