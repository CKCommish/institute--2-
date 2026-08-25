import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900}});
const p=await ctx.newPage();
for(const r of ['/','/people/','/pilots/','/partner/']){
 await p.goto('http://127.0.0.1:4454'+r,{waitUntil:'networkidle'}); await p.waitForTimeout(1000);
 const t=await p.evaluate(()=>{
  const wm=document.querySelector('.nav__mark'); const rr=wm.getBoundingClientRect();
  const cx=rr.left+20, cy=rr.top+rr.height/2;
  const hit=document.elementFromPoint(cx,cy);
  const cta=document.querySelector('.cta'); const cr=cta.getBoundingClientRect();
  const hit2=document.elementFromPoint(cr.left+30,cr.top+cr.height/2);
  const lk=document.querySelectorAll('.nav__link')[0]; const lr=lk.getBoundingClientRect();
  const hit3=document.elementFromPoint(lr.left+10,lr.top+lr.height/2);
  return {pe:getComputedStyle(wm).pointerEvents, hitWm:hit? hit.tagName+'.'+hit.className:null,
   hitCta:hit2?hit2.tagName+'.'+hit2.className:null, hitLink:hit3?hit3.tagName+'.'+hit3.className:null};
 });
 console.log(r, JSON.stringify(t));
}
await b.close();
