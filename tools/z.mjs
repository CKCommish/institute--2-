import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy:false });
const c = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:4 });
const p = await c.newPage();
await p.goto('http://127.0.0.1:4454/pilots/',{waitUntil:'networkidle'}); await p.waitForTimeout(800);
await p.tap('[data-burger]'); await p.waitForTimeout(900);
await p.screenshot({path:`${OUT}/z-menu-left.png`, clip:{x:14,y:285,width:150,height:185}});
// current-page marker in sheet?
console.log(await p.evaluate(()=>{
  const links=[...document.querySelectorAll('.menu__links a')];
  return links.map(a=>({t:a.textContent.trim(),cur:a.getAttribute('aria-current'),
    color:getComputedStyle(a.querySelector('.menu__w')).color,
    idxColor:getComputedStyle(a.querySelector('.index')).color,
    after:getComputedStyle(a,'::after').cssText? null:null,
    op:getComputedStyle(a).opacity}));
}));
await c.close();
const c2 = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:4 });
const p2 = await c2.newPage();
await p2.goto('http://127.0.0.1:4454/pilots/',{waitUntil:'networkidle'}); await p2.waitForTimeout(900);
const l = await p2.$$('.nav__link');
await l[0].hover(); await p2.waitForTimeout(700);
// crop INSTITUTE(hover) and PILOTS(current) side by side
await p2.screenshot({path:`${OUT}/z-hover-vs-current.png`, clip:{x:868,y:14,width:250,height:44}});
await c2.close(); await b.close();
