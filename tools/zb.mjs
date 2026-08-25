import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const p=await ctx.newPage();
await p.goto('http://127.0.0.1:4454/',{waitUntil:'networkidle'}); await p.waitForTimeout(900);
await p.click('[data-burger]'); await p.waitForTimeout(1000);
const out=await p.evaluate(()=>{
 const sel=['.nav__mark','.nav__link','.cta','.burger__o','.menu','.menu__links a','.menu__cta','.menu__foot .link','.menu__foot .label','.nav__prog','.star'];
 const res={};
 for(const s of sel){const e=document.querySelector(s); if(!e){res[s]='MISSING';continue;}
  const c=getComputedStyle(e);
  res[s]={ff:c.fontFamily,fw:c.fontWeight,fs:c.fontSize,color:c.color,bg:c.backgroundColor,br:c.borderRadius,fill:c.fill};}
 res.body=getComputedStyle(document.body).backgroundColor;
 res.menuBg=getComputedStyle(document.querySelector('.menu')).backgroundColor;
 res.fonts=[...new Set([...document.querySelectorAll('.nav *, .menu *')].map(e=>getComputedStyle(e).fontFamily))];
 return res;
});
console.log(JSON.stringify(out,null,1));
await b.close();
