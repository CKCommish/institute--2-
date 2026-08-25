import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const S='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots/';
const b = await launch({ proxy:false });
// focus state on index link
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://127.0.0.1:4454/people/',{waitUntil:'networkidle'});
await p.waitForTimeout(1200);
await p.evaluate(()=>document.querySelector('.pm__idx-i').focus());
await p.waitForTimeout(400);
await p.screenshot({path:S+'st-idx-focus.png', clip:{x:1060,y:300,width:380,height:200}});
// active state
await p.mouse.move(1200,380); await p.mouse.down(); await p.waitForTimeout(250);
await p.screenshot({path:S+'st-idx-active.png', clip:{x:1060,y:300,width:380,height:200}});
await p.mouse.up();
// reduced motion, no scroll
const ctx2 = await b.newContext({viewport:{width:1440,height:900}, reducedMotion:'reduce'});
const p2 = await ctx2.newPage();
await p2.goto('http://127.0.0.1:4454/people/',{waitUntil:'networkidle'});
await p2.waitForTimeout(1500);
await p2.screenshot({path:S+'rm-00.png'});
await p2.evaluate(()=>window.scrollTo(0,2400)); await p2.waitForTimeout(700);
await p2.screenshot({path:S+'rm-02.png'});
await p2.evaluate(()=>window.scrollTo(0,1300)); await p2.waitForTimeout(700);
await p2.screenshot({path:S+'rm-01.png'});
await b.close();
