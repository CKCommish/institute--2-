import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b=await launch({proxy:false});
for(const [w,mob] of [[939,false],[768,false],[621,false],[430,true],[390,true],[360,true],[320,true]]){
 const ctx=await b.newContext({viewport:{width:w,height:844},isMobile:mob,hasTouch:mob,deviceScaleFactor:4});
 const p=await ctx.newPage(); await p.goto('http://127.0.0.1:4420/pilots/',{waitUntil:'networkidle'});
 await p.mouse.move(w/2,700).catch(()=>{});
 await p.evaluate(()=>window.scrollTo(0,600)); await p.waitForTimeout(700);
 await p.screenshot({path:OUT+`/bar-${w}.png`,clip:{x:0,y:0,width:w,height:58}});
 const g=await p.evaluate(()=>{const bo=document.querySelector('.burger__o').getBoundingClientRect();const m=document.querySelector('.nav__mark').getBoundingClientRect();return {boL:+bo.left.toFixed(2),boR:+bo.right.toFixed(2),mR:+m.right.toFixed(2),vw:innerWidth,pad:getComputedStyle(document.querySelector('.nav__in')).paddingLeft};});
 console.log(w,JSON.stringify(g));
 await ctx.close();
}
await b.close();
