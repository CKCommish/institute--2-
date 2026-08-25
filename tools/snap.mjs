import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy: false });
for(const a of process.argv.slice(2)){
  const [w,h]=a.split('x').map(Number);
  const ctx=await b.newContext({viewport:{width:w,height:h},isMobile:w<600,hasTouch:w<600});
  const p=await ctx.newPage();
  await p.goto('http://127.0.0.1:4411/',{waitUntil:'networkidle'});
  await p.waitForTimeout(2200);
  await p.screenshot({path:`${OUT}/v-${a}.png`});
  const r=await p.evaluate(()=>{const poster=document.querySelector('.hero__poster');
    const rng=document.createRange();rng.selectNodeContents(poster);const rects=[...rng.getClientRects()];
    const ys=[...new Set(rects.map(r=>Math.round(r.y)))].sort((x,y)=>x-y);
    const lines=ys.map(y=>{const g=rects.filter(r=>Math.abs(r.y-y)<2);return Math.round(Math.max(...g.map(r=>r.right)));});
    const shellR = document.querySelector('.hero__mid').getBoundingClientRect().right - parseFloat(getComputedStyle(document.querySelector('.hero__mid')).paddingRight);
    return {lines, shellR:Math.round(shellR), bearing: Math.round(shellR-Math.max(...lines))};});
  console.log(a, JSON.stringify(r));
  await ctx.close();
}
await b.close();
