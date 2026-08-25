import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900}});
const p=await ctx.newPage();
await p.goto('http://127.0.0.1:4410/pilots/',{waitUntil:'networkidle'});
await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
const f=await p.evaluate(()=>({cls:document.activeElement.className,href:document.activeElement.getAttribute('href')}));
await p.waitForTimeout(300);
await p.screenshot({path:`${OUT}/d-mark-focus.png`,clip:{x:0,y:0,width:620,height:76}});
// activate by keyboard
await p.keyboard.press('Enter');
await p.waitForLoadState('load');
console.log(JSON.stringify({secondTab:f,url:new URL(p.url()).pathname}));
await b.close();
