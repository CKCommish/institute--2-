import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b=await launch({proxy:false});
for(const w of [1440,1180,1000,760]){
const c=await b.newContext({viewport:{width:w,height:1000},reducedMotion:'reduce'});
const p=await c.newPage();
await p.goto('http://127.0.0.1:4410/pilots/',{waitUntil:'networkidle'});
await p.waitForTimeout(800);
const r=await p.evaluate(()=>[...document.querySelectorAll('.pgrid__cell')].map((c,i)=>{
  const s=getComputedStyle(c,'::after');
  return {i, disp:s.display, w:s.width, h:s.height, bg:s.backgroundColor, left:s.left, bay:getComputedStyle(c).getPropertyValue('--bay')};
}));
console.log(w, JSON.stringify(r));
await c.close();}
await b.close();
