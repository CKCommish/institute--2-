import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:4});
const p=await ctx.newPage();
const C={x:860,y:6,width:560,height:52};
async function base(){await p.goto('http://127.0.0.1:4454/pilots/',{waitUntil:'networkidle'});await p.waitForTimeout(900);await p.evaluate(()=>window.scrollTo(0,1200));await p.waitForTimeout(1300);}
await base(); await p.screenshot({path:`${OUT}/s-rest.png`,clip:C});
await base(); await p.mouse.move(1082,31); await p.waitForTimeout(700); await p.screenshot({path:`${OUT}/s-hoverForum.png`,clip:C});
await base(); await p.mouse.move(700,300); await p.evaluate(()=>{document.querySelectorAll('.nav__link')[2].focus()}); await p.waitForTimeout(500); await p.screenshot({path:`${OUT}/s-focusForum.png`,clip:C});
await base(); await p.mouse.move(1300,31); await p.waitForTimeout(700); await p.screenshot({path:`${OUT}/s-hoverCta.png`,clip:C});
await base(); await p.mouse.move(700,300); await p.evaluate(()=>{document.querySelector('.cta').focus()}); await p.waitForTimeout(500); await p.screenshot({path:`${OUT}/s-focusCta.png`,clip:C});
await base(); await p.mouse.move(700,300); await p.evaluate(()=>{document.querySelector('.nav__mark').focus?.();const a=document.querySelector('.nav__mark');(a.tagName==='A'?a:a.querySelector('a')||a).focus()}); await p.waitForTimeout(500); await p.screenshot({path:`${OUT}/s-focusMark.png`,clip:{x:20,y:6,width:300,height:52}});
// hover on wordmark
await base(); await p.mouse.move(120,31); await p.waitForTimeout(700); await p.screenshot({path:`${OUT}/s-hoverMark.png`,clip:{x:20,y:6,width:300,height:52}});
await b.close(); console.log('ok');
