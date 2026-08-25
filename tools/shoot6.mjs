import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/crit2';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:3 });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4455/partner/', { waitUntil:'networkidle' });
await p.waitForTimeout(2500);
await p.evaluate(()=>window.scrollTo(0,2200)); await p.waitForTimeout(2000);
await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(1200);
await p.keyboard.press('Tab'); // skip link maybe
for (let i=0;i<8;i++){ await p.keyboard.press('Tab'); }
await p.waitForTimeout(400);
const cur = await p.evaluate(()=>document.activeElement.className+' | '+document.activeElement.textContent.trim().slice(0,40));
console.log('focus:', cur);
await p.evaluate(()=>{ const e=document.querySelector('.ask__mail'); e.focus(); });
await p.waitForTimeout(600);
const ask = await p.$('.ask');
await ask.screenshot({ path: `${OUT}/crop-ask-focus.png` });
const st = await p.evaluate(()=>{
  const g=(s)=>{const e=document.querySelector(s); e.focus(); const cs=getComputedStyle(e); return {sel:s, outline:cs.outline, off:cs.outlineOffset, br:cs.borderRadius};};
  return ['.ask__mail','.ask__cue','.pindex__a','.door'].map(g);
});
console.log(JSON.stringify(st,null,1));
// index/title baseline crop
await p.evaluate(()=>window.scrollTo(0,760)); await p.waitForTimeout(900);
await p.screenshot({ path:`${OUT}/rows-crop.png`, clip:{x:40,y:120,width:700,height:560} });
await ctx.close(); await b.close();
