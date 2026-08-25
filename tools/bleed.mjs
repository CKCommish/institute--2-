import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy:false });
const c = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:3 });
const p = await c.newPage();
await p.goto('http://127.0.0.1:4454/pilots/',{waitUntil:'networkidle'}); await p.waitForTimeout(900);
await p.evaluate(()=>window.scrollTo(0,600)); await p.waitForTimeout(500);
console.log('before open', await p.evaluate(()=>window.scrollY));
await p.tap('[data-burger]'); await p.waitForTimeout(800);
// real touch drag over the sheet
await p.touchscreen.tap(195,700);
await p.evaluate(async()=>{ const el=document.elementFromPoint(195,700); window.__hit = el && el.className; });
console.log('element under finger mid-sheet:', await p.evaluate(()=>window.__hit));
// simulate a wheel (desktop-ish) and a programmatic scroll
await p.mouse.move(195,600); await p.mouse.wheel(0,300); await p.waitForTimeout(500);
console.log('after wheel over sheet, scrollY =', await p.evaluate(()=>window.scrollY));
// close and see where we land
await p.tap('[data-burger]'); await p.waitForTimeout(900);
console.log('after close scrollY =', await p.evaluate(()=>window.scrollY));
await p.screenshot({path:`${OUT}/bleed-after-close.png`});
await c.close();

// desktop: mouse-click focus ring?
const c2 = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:2 });
const p2 = await c2.newPage();
await p2.goto('http://127.0.0.1:4454/pilots/',{waitUntil:'networkidle'}); await p2.waitForTimeout(800);
await p2.mouse.move(1300,31); await p2.mouse.down(); await p2.waitForTimeout(120);
await p2.screenshot({path:`${OUT}/d-active-cta.png`, clip:{x:1150,y:0,width:290,height:70}});
await p2.mouse.up(); await p2.waitForTimeout(50);
await c2.close(); await b.close();
