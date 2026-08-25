import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const S='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy:false });
const c = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:3 });
const p = await c.newPage();
const clip={x:1180,y:8,width:230,height:48};
await p.goto('http://127.0.0.1:4420/pilots/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
await p.screenshot({path:S+'/nz-rest.png', clip});
await p.hover('.cta'); await p.waitForTimeout(700);
await p.screenshot({path:S+'/nz-hover.png', clip});
await p.mouse.move(400,600); await p.waitForTimeout(700);
await p.keyboard.press('Tab');await p.keyboard.press('Tab');await p.keyboard.press('Tab');await p.keyboard.press('Tab');await p.keyboard.press('Tab');await p.keyboard.press('Tab');
console.log('active after tabs', await p.evaluate(()=>document.activeElement.className+'|'+document.activeElement.textContent.trim().slice(0,20)+'|scrollY='+scrollY));
await p.waitForTimeout(300);
await p.screenshot({path:S+'/nz-focus.png', clip:{x:1180,y:0,width:250,height:60}});
// partner page (cta active)
await p.goto('http://127.0.0.1:4420/partner/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
await p.screenshot({path:S+'/nz-active.png', clip});
await p.hover('.cta'); await p.waitForTimeout(700);
await p.screenshot({path:S+'/nz-active-hover.png', clip});
// nav link hover
await p.goto('http://127.0.0.1:4420/pilots/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
await p.hover('.nav__links a:nth-child(3)'); await p.waitForTimeout(700);
await p.screenshot({path:S+'/nz-linkhover.png', clip:{x:1020,y:8,width:200,height:48}});
await c.close();
// tablet burger
const c2 = await b.newContext({ viewport:{width:768,height:900}, deviceScaleFactor:3 });
const p2 = await c2.newPage();
await p2.goto('http://127.0.0.1:4420/pilots/',{waitUntil:'networkidle'}); await p2.waitForTimeout(400);
const cb={x:640,y:8,width:120,height:48};
await p2.screenshot({path:S+'/nz-burg-rest.png', clip:cb});
await p2.hover('.nav__burger'); await p2.waitForTimeout(700);
await p2.screenshot({path:S+'/nz-burg-hover.png', clip:cb});
await p2.evaluate(()=>document.querySelector('.nav__burger').focus()); await p2.waitForTimeout(300);
await p2.screenshot({path:S+'/nz-burg-focus.png', clip:{x:640,y:0,width:128,height:58}});
await p2.click('.nav__burger'); await p2.waitForTimeout(900);
await p2.screenshot({path:S+'/nz-burg-open.png', clip:{x:600,y:0,width:168,height:58}});
await c2.close();
await b.close();
