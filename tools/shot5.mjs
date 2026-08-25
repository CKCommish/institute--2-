import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad';
const b=await launch({proxy:false});
for (const [name,vp,extra] of [['desk',{width:1440,height:900},{}],['mob',{width:390,height:844},{isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
  const ctx=await b.newContext({viewport:vp,...extra});
  const p=await ctx.newPage();
  await p.goto('http://127.0.0.1:4454/pilots/#infant-mortality',{waitUntil:'networkidle'});
  await p.waitForTimeout(2500);
  await p.screenshot({path:`${OUT}/s5-anchor-${name}.png`});
  console.log(name,'scrollY',await p.evaluate(()=>scrollY), 'secTop', await p.evaluate(()=>document.querySelector('#infant-mortality').getBoundingClientRect().top));
  console.log(name,'scroll-margin-top', await p.evaluate(()=>getComputedStyle(document.querySelector('#infant-mortality')).scrollMarginTop));
  await ctx.close();
}
await b.close();
