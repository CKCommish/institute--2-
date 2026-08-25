import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy:false });
const ctx=await b.newContext({viewport:{width:1440,height:900}});
const p=await ctx.newPage(); await p.goto('http://127.0.0.1:4420/',{waitUntil:'networkidle'}); await p.waitForTimeout(2400);
const r=await p.evaluate(()=>{
 const hero=document.querySelector('.hero');
 const out=[]; const fams=new Set();
 for (const el of hero.querySelectorAll('*')){
   const cs=getComputedStyle(el);
   fams.add(cs.fontFamily.split(',')[0].replace(/"/g,''));
   const c=cs.color, bg=cs.backgroundColor, bc=cs.borderColor;
   out.push([el.className&&el.className.toString().slice(0,26), c, bg==='rgba(0, 0, 0, 0)'?'':bg, cs.fontWeight, cs.fontSize]);
 }
 return {fams:[...fams], sample:out.slice(0,40), heroBg:getComputedStyle(document.querySelector('.hero')).backgroundColor, bodyBg:getComputedStyle(document.body).backgroundColor};
});
console.log('FAMILIES:', JSON.stringify(r.fams));
console.log('heroBg',r.heroBg,'bodyBg',r.bodyBg);
const colors=new Set(); for(const s of r.sample){colors.add(s[1]); if(s[2])colors.add(s[2]);}
console.log('COLORS:', [...colors].join(' | '));
await b.close();
