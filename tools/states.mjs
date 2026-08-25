import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const O=process.env.S;
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
const p=await ctx.newPage();
await p.goto('http://127.0.0.1:4420/people/',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
await p.screenshot({path:`${O}/shots/X-rest.png`, clip:{x:1060,y:290,width:360,height:200}});
await p.hover('.pm__idx-i'); await p.waitForTimeout(700);
await p.screenshot({path:`${O}/shots/X-hover1.png`, clip:{x:1060,y:290,width:360,height:200}});
await p.hover('.pm__idx-i:last-child'); await p.waitForTimeout(700);
await p.screenshot({path:`${O}/shots/X-hover2.png`, clip:{x:1060,y:290,width:360,height:200}});
await p.evaluate(()=>document.querySelector('.pm__idx-i').focus());
await p.waitForTimeout(500);
await p.screenshot({path:`${O}/shots/X-focus.png`, clip:{x:1060,y:290,width:360,height:200}});
// click behaviour
await p.evaluate(()=>document.querySelector('.pm__idx-i:last-child').click());
await p.waitForTimeout(1200);
const y=await p.evaluate(()=>({sy:scrollY, boardTop:document.querySelector('#board').getBoundingClientRect().top, navh:getComputedStyle(document.documentElement).getPropertyValue('--nav-h')}));
console.log('after click board:',JSON.stringify(y));
await p.screenshot({path:`${O}/shots/X-afterclick.png`});
await ctx.close();
// reduced motion
const ctx2=await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce',deviceScaleFactor:1});
const p2=await ctx2.newPage(); await p2.goto('http://127.0.0.1:4420/people/',{waitUntil:'networkidle'}); await p2.waitForTimeout(300);
await p2.screenshot({path:`${O}/shots/X-rm-300.png`});
await ctx2.close();
// mid-motion capture: fresh load, 250ms
const ctx3=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
const p3=await ctx3.newPage(); await p3.goto('http://127.0.0.1:4420/people/',{waitUntil:'domcontentloaded'});
await p3.waitForTimeout(420); await p3.screenshot({path:`${O}/shots/X-mid420.png`});
await p3.waitForTimeout(300); await p3.screenshot({path:`${O}/shots/X-mid720.png`});
await ctx3.close();
await b.close();
