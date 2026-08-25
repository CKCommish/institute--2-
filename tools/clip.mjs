import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy:false });
const ctx = await b.newContext({ viewport:{width:1440,height:900} });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4420/partner/', { waitUntil:'networkidle' });
await p.evaluate(()=>document.querySelector('#ways').scrollIntoView());
await p.waitForTimeout(900);
await p.evaluate(()=>{ document.addEventListener('click',e=>e.preventDefault(),true); });
await p.evaluate(()=>document.querySelectorAll('.door')[1].click());
await p.waitForTimeout(900);
const info = await p.evaluate(()=>{
  const wrap=document.querySelector('.proles__wrap');
  const list=document.querySelector('.proles__list');
  const d=document.querySelectorAll('.door')[1];
  const g=d.querySelector('.door__got');
  const R=e=>{const r=e.getBoundingClientRect();return{t:Math.round(r.top),b:Math.round(r.bottom),l:Math.round(r.left)};};
  return {wrapClip:getComputedStyle(wrap).clipPath, wrap:R(wrap), list:R(list), door:R(d), receipt:R(g), receiptOpacity:getComputedStyle(g).opacity, receiptMaxH:getComputedStyle(g).maxHeight};
});
console.log(JSON.stringify(info,null,1));
// crop screenshot around receipt
await p.screenshot({path:`${OUT}/crop-receipt-1440.png`, clip:{x:480,y:660,width:520,height:120}});
await b.close();
