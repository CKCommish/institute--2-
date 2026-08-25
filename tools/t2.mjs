import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots/';
const b = await launch({ proxy:false });
const m = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:6 });
const p = await m.newPage();
await p.goto('http://127.0.0.1:4410/',{waitUntil:'networkidle'}); await p.waitForTimeout(900);
await p.click('[data-burger]'); await p.waitForTimeout(1400);
await p.screenshot({path:OUT+'Z-sheet-left.png', clip:{x:14,y:288,width:150,height:180}});
console.log(await p.evaluate(()=>[...document.querySelectorAll('.menu__links .index')].map(e=>{const b=e.getBoundingClientRect();return [e.textContent,+b.width.toFixed(2),+b.right.toFixed(2)]})));
console.log('cta rule?', await p.evaluate(()=>{const e=document.querySelector('.menu__cta'); const s=getComputedStyle(e,'::after'); return [s.content,s.opacity,s.backgroundColor,s.transform, getComputedStyle(e).borderBottom, getComputedStyle(e).textDecorationLine].join(' | ')}));
// burger focus
await p.keyboard.press('Escape'); await p.waitForTimeout(700);
await p.evaluate(()=>document.querySelector('[data-burger]').focus()); await p.waitForTimeout(300);
await p.screenshot({path:OUT+'Z-burger-focus.png', clip:{x:290,y:0,width:100,height:58}});
await b.close();
