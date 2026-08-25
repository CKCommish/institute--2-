import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({proxy:false});
const ctx = await b.newContext({viewport:{width:1440,height:900}});
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4455/partner/',{waitUntil:'networkidle'});
await p.waitForTimeout(1800);
const m=async(sel,arrow)=>{const r0=await p.$eval(arrow,e=>e.getBoundingClientRect().right);
  await p.hover(sel); await p.waitForTimeout(700);
  const r1=await p.$eval(arrow,e=>e.getBoundingClientRect().right);
  return [ +r0.toFixed(1), +r1.toFixed(1) ];};
console.log('ask arrow rest/hover', await m('.ask__mail','.ask__arrow'));
await p.evaluate(()=>window.scrollTo(0,1000)); await p.waitForTimeout(1500);
console.log('pindex arrow rest/hover', await m('.pindex__r:nth-child(1) .pindex__a','.pindex__r:nth-child(1) .pindex__arrow'));
// transition timing
console.log(JSON.stringify(await p.evaluate(()=>{
  const g=s=>{const e=document.querySelector(s); if(!e)return null; const c=getComputedStyle(e); return {p:c.transitionProperty,d:c.transitionDuration,t:c.transitionTimingFunction};};
  return {mail:g('.ask__mail'), mailArrow:g('.ask__arrow'), row:g('.pindex__a'), rowArrow:g('.pindex__arrow'), door:g('.door'), cue:g('.cue')};
},null,1)));
await b.close();
