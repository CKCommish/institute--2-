import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:3});
const p=await ctx.newPage();
await p.goto('http://127.0.0.1:4454/pilots/',{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
const r=el=>el?el.getBoundingClientRect().toJSON():null;
let m=await p.evaluate(()=>{
 const q=s=>document.querySelector(s); const R=e=>e?e.getBoundingClientRect().toJSON():null;
 return {gutter:getComputedStyle(document.documentElement).getPropertyValue('--gutter'),
  navH:getComputedStyle(q('.nav')).height,
  mark:R(q('.nav__mark')), burger:R(q('.nav__burger')), burgerO:R(q('.burger__o')),
  vw:innerWidth,
  bstyle:{fs:getComputedStyle(q('.burger__o')).fontSize,ls:getComputedStyle(q('.burger__o')).letterSpacing}};
});
console.log('BAR',JSON.stringify(m,null,1));
await p.click('[data-burger]'); await p.waitForTimeout(1200);
let s=await p.evaluate(()=>{
 const R=e=>e?e.getBoundingClientRect().toJSON():null;
 const items=[...document.querySelectorAll('.menu__links a')].map(a=>({t:a.textContent,r:R(a),fs:getComputedStyle(a).fontSize,lh:getComputedStyle(a).lineHeight}));
 const idx=[...document.querySelectorAll('.menu__links .index')].map(a=>R(a));
 return {items,idx,cta:R(document.querySelector('.menu__cta')),foot:R(document.querySelector('.menu__foot')),
  email:R(document.querySelector('.menu__foot .link')), loc:R(document.querySelector('.menu__foot .label')),
  inr:R(document.querySelector('.menu__in')), menu:R(document.querySelector('.menu')),
  vh:innerHeight, scrollLocked:getComputedStyle(document.body).overflow+'/'+getComputedStyle(document.documentElement).overflow,
  focus:document.activeElement.className+'|'+document.activeElement.tagName};
});
console.log('SHEET',JSON.stringify(s,null,1));
// tab order test
await p.keyboard.press('Tab'); const f1=await p.evaluate(()=>document.activeElement.textContent.trim().slice(0,30));
await p.keyboard.press('Tab'); const f2=await p.evaluate(()=>document.activeElement.textContent.trim().slice(0,30));
for(let i=0;i<6;i++){await p.keyboard.press('Tab');}
const f8=await p.evaluate(()=>document.activeElement.textContent.trim().slice(0,40)+' | '+document.activeElement.tagName);
console.log('TAB',f1,'//',f2,'//',f8);
// escape
await p.keyboard.press('Escape'); await p.waitForTimeout(900);
const closed=await p.evaluate(()=>({hidden:document.querySelector('.menu').hasAttribute('hidden'),exp:document.querySelector('[data-burger]').getAttribute('aria-expanded'),focus:document.activeElement.tagName+'.'+document.activeElement.className}));
console.log('ESC',JSON.stringify(closed));
await b.close();
