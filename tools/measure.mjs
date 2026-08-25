import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const BASE='http://127.0.0.1:4420/';
const widths=[[1440,900,false],[1240,900,false],[1180,900,false],[1100,900,false],[1099,900,false],[1024,800,false],[900,900,false],[768,1024,false],[621,900,false],[620,900,false],[430,932,true],[390,844,true],[360,780,true]];
const b=await launch({proxy:false});
for(const [w,h,mob] of widths){
  const ctx=await b.newContext({viewport:{width:w,height:h},isMobile:mob,hasTouch:mob,deviceScaleFactor:1});
  const p=await ctx.newPage();
  await p.goto(BASE,{waitUntil:'networkidle'});
  await p.waitForTimeout(2200);
  const d=await p.evaluate(()=>{
    const R=(el)=>{const r=el.getBoundingClientRect();return {l:+r.left.toFixed(2),t:+r.top.toFixed(2),r:+r.right.toFixed(2),b:+r.bottom.toFixed(2),w:+r.width.toFixed(2),h:+r.height.toFixed(2)};};
    const poster=document.querySelector('.hero__poster');
    const kicker=document.querySelector('.hero__kicker');
    const rects=[...poster.getClientRects()].map(r=>({l:+r.left.toFixed(2),w:+r.width.toFixed(2),t:+r.top.toFixed(2),h:+r.height.toFixed(2)}));
    const cs=getComputedStyle(poster);
    const shell=document.querySelector('.hero__mid');
    const idx=document.querySelector('.hero__index');
    const rule=document.querySelector('.hero__rule');
    const cells=[...document.querySelectorAll('.hcell')].map(c=>R(c));
    const brs=[...document.querySelectorAll('.pbr')].map(x=>({c:x.className,d:getComputedStyle(x).display}));
    return {
      vw:innerWidth, vh:innerHeight,
      posterFS:cs.fontSize, posterLH:cs.lineHeight, posterLS:cs.letterSpacing, posterFF:cs.fontFamily, posterFW:cs.fontWeight,
      textWrap:cs.textWrap||cs.textWrapStyle, whiteSpace:cs.whiteSpace, maxW:cs.maxWidth, ml:cs.marginLeft,
      posterBox:R(poster), kickerBox:R(kicker), kickerFS:getComputedStyle(kicker).fontSize,
      kickerRects:[...kicker.getClientRects()].map(r=>+r.width.toFixed(2)),
      shellBox:R(shell), idxBox:R(idx), ruleBox: rule?R(rule):null,
      lines:rects, brs, cells,
      keep: !!document.querySelector('.hero__keep'),
      docScrollW: document.documentElement.scrollWidth,
    };
  });
  console.log(JSON.stringify({w,h,...d}));
  await p.screenshot({path:`${OUT}/w${w}.png`});
  await ctx.close();
}
await b.close();
