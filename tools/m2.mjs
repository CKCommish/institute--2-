import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
const probe = `(()=>{const el=document.querySelector('.hero__poster');
const r=document.createRange(); r.selectNodeContents(el);
const lines=[...r.getClientRects()].filter(x=>x.width>1).map(x=>Math.round(x.width*10)/10);
const shell=document.querySelector('.hero__mid').getBoundingClientRect();
const box=el.getBoundingClientRect();
const eb=document.querySelector('.hero__index-label').getBoundingClientRect();
const cells=[...document.querySelectorAll('.hcell')].map(c=>Math.round(c.getBoundingClientRect().bottom));
return {lines, air:Math.round((shell.right-shell.left-Math.max(...lines))*10)/10,
 fs:Math.round(parseFloat(getComputedStyle(el).fontSize)*10)/10,
 blockH:Math.round(box.height), gap:Math.round((eb.top-box.bottom)*10)/10,
 cell04:cells[3], ovf:document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`;
const errs=[];
const ctx=await b.newContext({viewport:{width:1440,height:900}});
const p=await ctx.newPage(); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())}); p.on('pageerror',e=>errs.push(''+e));
await p.goto('http://127.0.0.1:4420/',{waitUntil:'networkidle'});
for(const w of [1440,1240,1200,1180,1152,1120,1100,1099,1082,1060,1024,768]){
  await p.setViewportSize({width:w,height:900}); await p.waitForTimeout(250);
  console.log(w, JSON.stringify(await p.evaluate(probe)));
}
for(const [w,h] of [[390,844],[430,932],[375,667],[360,640],[320,568]]){
  const c=await b.newContext({viewport:{width:w,height:h},isMobile:true,hasTouch:true});
  const q=await c.newPage(); q.on('pageerror',e=>errs.push(''+e));
  await q.goto('http://127.0.0.1:4420/',{waitUntil:'networkidle'}); await q.waitForTimeout(1400);
  console.log(w+'x'+h, JSON.stringify(await q.evaluate(probe)), 'fold='+h);
  await q.screenshot({path:`/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/m-${w}x${h}.png`});
  await c.close();
}
for(const w of [1440,1180,1100,1024]){ await p.setViewportSize({width:w,height:900}); await p.waitForTimeout(1200);
  await p.screenshot({path:`/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/d-${w}.png`});}
console.log('ERRS',errs); await b.close();
