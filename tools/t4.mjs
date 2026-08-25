import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots/';
const b = await launch({ proxy:false });
for (const w of [1024,960,944,900,768]){
  const c = await b.newContext({ viewport:{width:w,height:800}, deviceScaleFactor:2 });
  const p = await c.newPage();
  await p.goto('http://127.0.0.1:4410/pilots/',{waitUntil:'networkidle'}); await p.evaluate(()=>scrollTo(0,700)); await p.waitForTimeout(1000);
  await p.screenshot({path:OUT+'W-'+w+'.png', clip:{x:0,y:0,width:w,height:80}});
  const g = await p.evaluate(()=>{const q=s=>{const e=document.querySelector(s); if(!e||getComputedStyle(e).display==='none') return null; const b=e.getBoundingClientRect(); return [+b.left.toFixed(1),+b.right.toFixed(1)]}; return {mark:q('.nav__mark'),links:q('.nav__links'),cta:q('.cta'),burger:q('.nav__burger')}});
  console.log(w, JSON.stringify(g));
  await c.close();
}
await b.close();
