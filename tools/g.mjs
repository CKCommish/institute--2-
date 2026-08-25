import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b=await launch({proxy:false});
const c=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:4});
const p=await c.newPage();
await p.goto('http://127.0.0.1:4454/forum/',{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
await p.screenshot({path:`${OUT}/z-forum-cur.png`, clip:{x:1030,y:16,width:220,height:42}});
await p.goto('http://127.0.0.1:4454/404',{waitUntil:'networkidle'}); await p.waitForTimeout(900);
await p.screenshot({path:`${OUT}/d-404-top.png`, clip:{x:0,y:0,width:1440,height:120}});
// wordmark hover
await p.goto('http://127.0.0.1:4454/pilots/',{waitUntil:'networkidle'}); await p.waitForTimeout(900);
await p.hover('.nav__mark'); await p.waitForTimeout(700);
await p.screenshot({path:`${OUT}/z-mark-hover.png`, clip:{x:40,y:10,width:230,height:46}});
await p.mouse.move(700,400); await p.waitForTimeout(700);
await p.screenshot({path:`${OUT}/z-mark-rest.png`, clip:{x:40,y:10,width:230,height:46}});
await c.close(); await b.close();
