import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const B='http://127.0.0.1:4420';
const b=await launch({proxy:false});
for(const w of [1440,1180,1024,960,941,939,768,621]){
  const ctx=await b.newContext({viewport:{width:w,height:900},deviceScaleFactor:2});
  const p=await ctx.newPage();
  await p.goto(B+'/pilots/',{waitUntil:'networkidle'});
  await p.waitForTimeout(500);
  await p.evaluate(()=>window.scrollTo(0,600));
  await p.waitForTimeout(700);
  const d=await p.evaluate(()=>{
    const r=(el)=>{const b=el.getBoundingClientRect();return{l:+b.left.toFixed(2),r:+b.right.toFixed(2),t:+b.top.toFixed(2),b:+b.bottom.toFixed(2),w:+b.width.toFixed(2),h:+b.height.toFixed(2)};};
    const nav=document.querySelector('.nav');
    const mark=document.querySelector('.nav__mark');
    const links=[...document.querySelectorAll('.nav__link')];
    const cta=document.querySelector('.cta');
    const burger=document.querySelector('.nav__burger');
    const bo=document.querySelector('.burger__o');
    const cs=getComputedStyle(cta);
    const capTop=(el)=>{ // measure cap-top via range on first letter
      const tn=[...el.childNodes].find(n=>n.nodeType===3&&n.textContent.trim());
      if(!tn) return null; const rg=document.createRange(); rg.setStart(tn,0); rg.setEnd(tn,1);
      const bb=rg.getBoundingClientRect(); return {t:+bb.top.toFixed(2),b:+bb.bottom.toFixed(2)};
    };
    return {
      navH:+nav.getBoundingClientRect().height.toFixed(2),
      mark:r(mark), links:links.map(l=>({t:l.textContent,...r(l),cap:capTop(l),fs:getComputedStyle(l).fontSize})),
      cta:{...r(cta), disp:cs.display, radius:cs.borderRadius, border:cs.borderTopWidth+' '+cs.borderTopColor, pad:cs.padding, top:cs.top, mr:cs.marginRight, minH:cs.minHeight, fs:cs.fontSize},
      ctaT:(()=>{const t=document.querySelector('.cta__t');return {...r(t),cap:capTop(t)};})(),
      ctaStar:r(document.querySelector('.cta .star')),
      burger:burger?{...r(burger),disp:getComputedStyle(burger).display,minH:getComputedStyle(burger).minHeight}:null,
      bo:bo?{...r(bo),disp:getComputedStyle(bo).display,radius:getComputedStyle(bo).borderRadius,border:getComputedStyle(bo).borderTopWidth+' '+getComputedStyle(bo).borderTopColor,minH:getComputedStyle(bo).minHeight,pad:getComputedStyle(bo).padding}:null,
      vw:innerWidth, gutter:getComputedStyle(document.documentElement).getPropertyValue('--gutter'),
      maxW:getComputedStyle(document.querySelector('.nav__in')).maxWidth,
      inPadL:getComputedStyle(document.querySelector('.nav__in')).paddingLeft,
      inRect:r(document.querySelector('.nav__in')),
    };
  });
  console.log('=== '+w+' ===');
  console.log(JSON.stringify(d));
  await p.screenshot({path:OUT+`/d-${w}-bar.png`, clip:{x:0,y:0,width:w,height:100}});
  await ctx.close();
}
await b.close();
