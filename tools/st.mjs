import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const B='http://127.0.0.1:4420';
const b=await launch({proxy:false});
// desktop states
const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:4});
const p=await ctx.newPage();
await p.goto(B+'/pilots/',{waitUntil:'networkidle'});
await p.evaluate(()=>window.scrollTo(0,600)); await p.waitForTimeout(700);
const clip={x:1140,y:0,width:300,height:64};
await p.screenshot({path:OUT+'/d-cta-rest.png',clip});
await p.hover('.cta'); await p.waitForTimeout(700);
await p.screenshot({path:OUT+'/d-cta-hover.png',clip});
await p.mouse.move(10,400); await p.waitForTimeout(600);
await p.evaluate(()=>document.querySelector('.cta').focus());
await p.keyboard.press('Tab'); await p.keyboard.press('Shift+Tab');
await p.waitForTimeout(400);
await p.screenshot({path:OUT+'/d-cta-focus.png',clip});
// hover on a nav link
await p.hover('.nav__link:nth-child(3)'); await p.waitForTimeout(700);
await p.screenshot({path:OUT+'/d-links-hover.png',clip:{x:820,y:0,width:400,height:64}});
await p.screenshot({path:OUT+'/d-bar-full.png',clip:{x:0,y:0,width:1440,height:70}});
const fm=await p.evaluate(()=>{const c=document.querySelector('.cta');const cs=getComputedStyle(c);return {outline:cs.outlineWidth+' '+cs.outlineStyle+' '+cs.outlineColor, off:cs.outlineOffset, br:cs.borderRadius};});
console.log('cta focus computed', JSON.stringify(fm));
await ctx.close();
// mobile
const m=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:4});
const mp=await m.newPage();
await mp.goto(B+'/pilots/',{waitUntil:'networkidle'});
await mp.evaluate(()=>window.scrollTo(0,600)); await mp.waitForTimeout(700);
await mp.screenshot({path:OUT+'/m-bar.png',clip:{x:0,y:0,width:390,height:64}});
const md=await mp.evaluate(()=>{
  const r=(el)=>{const b=el.getBoundingClientRect();return{l:+b.left.toFixed(2),r:+b.right.toFixed(2),t:+b.top.toFixed(2),b:+b.bottom.toFixed(2),w:+b.width.toFixed(2),h:+b.height.toFixed(2)};};
  const cap=(el)=>{const tn=[...el.childNodes].find(n=>n.nodeType===3&&n.textContent.trim());const g=document.createRange();g.setStart(tn,0);g.setEnd(tn,1);const bb=g.getBoundingClientRect();return{t:+bb.top.toFixed(2),b:+bb.bottom.toFixed(2)};};
  const bu=document.querySelector('.nav__burger'), bo=document.querySelector('.burger__o');
  const wm=document.querySelector('.nav__mark');
  const wmTxt=wm.querySelector('span,strong,b')||wm;
  return {navH:+document.querySelector('.nav').getBoundingClientRect().height.toFixed(2),
   burger:{...r(bu),minH:getComputedStyle(bu).minHeight,cs:getComputedStyle(bu).display},
   bo:r(bo), star:r(document.querySelector('.burger__o .star')),
   word:(()=>{const t=document.querySelector('[data-burger-label]');return {...r(t),cap:cap(t)};})(),
   mark:r(wm), markHTML:wm.innerHTML.slice(0,200),
   gutterPx:getComputedStyle(document.querySelector('.nav__in')).paddingLeft, vw:innerWidth};
});
console.log(JSON.stringify(md,null,1));
await b.close();
