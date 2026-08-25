import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({proxy:false});
const ctx = await b.newContext({viewport:{width:1440,height:900}, deviceScaleFactor:2});
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4451/',{waitUntil:'networkidle'});
await p.waitForTimeout(2500);
// A: hide bg figure + veil
await p.addStyleTag({content:`.hero__bg,.hero__veil{display:none!important} .hero{background:#050D16!important}`});
await p.waitForTimeout(600);
await p.screenshot({path:'diag-nobg.png', clip:{x:0,y:90,width:1440,height:440}});
// B: also neutralize kicker
await p.addStyleTag({content:`.hero__kicker{opacity:.2!important}`});
await p.waitForTimeout(400);
await p.screenshot({path:'diag-nokicker.png', clip:{x:900,y:120,width:400,height:180}});
const info = await p.evaluate(()=>{
  const k=document.querySelector('.hero__kicker'), d=document.querySelector('.hero__poster');
  const cs=getComputedStyle(k), cd=getComputedStyle(d);
  return {kicker:{fs:cs.fontSize,lh:cs.lineHeight,disp:cs.display,bg:cs.backgroundColor,bgi:cs.backgroundImage.slice(0,120),mb:cs.marginBottom,pb:cs.paddingBottom, rect:k.getBoundingClientRect().toJSON(), ts:cs.textShadow, wm:cs.webkitMaskImage},
          poster:{fs:cd.fontSize,lh:cd.lineHeight,ls:cd.letterSpacing,ff:cd.fontFamily,fw:cd.fontWeight,disp:cd.display,rect:d.getBoundingClientRect().toJSON(), fvs:cd.fontVariationSettings, mt:cd.marginTop, clip:cd.clipPath, wm:cd.webkitMaskImage.slice(0,150), tr:cd.transform}};
});
console.log(JSON.stringify(info,null,1));
await b.close();
