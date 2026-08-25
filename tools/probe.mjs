import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b=await launch({proxy:false});
for (const w of [1440,1180,1024,900,760,700,621,620]){
  const mobile=w<=620;
  const ctx=await b.newContext({viewport:{width:w,height:mobile?844:900},deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
  const p=await ctx.newPage();
  await p.goto('http://127.0.0.1:4420/pilots/',{waitUntil:'networkidle'});
  await p.waitForTimeout(600);
  const info=await p.evaluate(()=>{
    const cells=[...document.querySelectorAll('.pgrid__cell')];
    const grid=document.querySelector('.pgrid__grid');
    return {gridY:grid.getBoundingClientRect().y+window.scrollY,
      cells:cells.map(c=>{const r=c.getBoundingClientRect();return{x:r.x,y:r.y+window.scrollY,w:r.width,h:r.height};})};
  });
  // clip screenshot around band, full page
  const top=Math.max(0,info.gridY-20), h=Math.min(4000, info.cells[3].y+info.cells[3].h-info.gridY+60);
  await p.evaluate(()=>window.scrollTo(0,0));
  const buf=await p.screenshot({path:`probe-${w}.png`,clip:{x:0,y:top,width:w,height:h},fullPage:true});
  console.log(w, JSON.stringify(info.cells.map(c=>[Math.round(c.x),Math.round(c.y-top),Math.round(c.h)])), 'clipTop',Math.round(top));
  await ctx.close();
}
await b.close();
