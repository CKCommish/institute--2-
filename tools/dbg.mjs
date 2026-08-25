import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
const p=await ctx.newPage();
await p.goto('http://127.0.0.1:4420/people/',{waitUntil:'networkidle'});
await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate(()=>{
 const q=s=>{const e=document.querySelector(s);const c=getComputedStyle(e);return {sel:s, delay:c.getPropertyValue('--reveal-delay'), inlineDelay:e.style.getPropertyValue('--reveal-delay'), td:c.transitionDelay, dur:c.transitionDuration, cls:e.className, isIn:e.classList.contains('is-in'), ds:JSON.stringify(e.dataset)};};
 return [q('.pm .eyebrow'), q('.pm__bridge'), q('.pm__idx-i'), q('.pm__idx-i:last-child'), q('.pm__h')];
}),null,1));
await ctx.close(); await b.close();
