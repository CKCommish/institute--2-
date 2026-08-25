import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const BASE='http://127.0.0.1:4460';
const b=await launch({proxy:false});
for (const vp of [{width:1440,height:900},{width:390,height:844}]) {
const ctx=await b.newContext({viewport:vp});
const p=await ctx.newPage();
console.log('### viewport', vp.width);
for (const r of ['/institute/','/pilots/','/people/','/forum/','/partner/','/nope/']) {
  await p.goto(BASE+r,{waitUntil:'networkidle'});
  await p.waitForTimeout(600);
  const res=await p.evaluate(()=>{
    const first = document.querySelector('main .eyebrow, main .label');
    const disp = document.querySelector('main .display');
    const rects = el => el ? {t: Math.round(el.getBoundingClientRect().top), l: Math.round(el.getBoundingClientRect().left), txt:(el.textContent||'').trim().slice(0,24)} : null;
    return {eyebrow: rects(first), display: rects(disp),
      navh: getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
      headpad: getComputedStyle(document.documentElement).getPropertyValue('--head-pad'),
      gutter: getComputedStyle(document.documentElement).getPropertyValue('--gutter')};
  });
  console.log(r.padEnd(13), 'eyebrow', JSON.stringify(res.eyebrow), 'display', JSON.stringify(res.display));
}
await ctx.close();
}
await b.close();
