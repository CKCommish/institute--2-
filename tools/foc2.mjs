import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900}});
const p=await ctx.newPage();
await p.goto('http://127.0.0.1:4410/pilots/',{waitUntil:'networkidle'});
await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
await p.waitForTimeout(250);
await p.screenshot({path:`${OUT}/d-mark-focus.png`,clip:{x:0,y:0,width:620,height:76}});
let r;
try{ await Promise.all([p.waitForURL(u=>new URL(u).pathname==='/',{timeout:5000}), p.keyboard.press('Enter')]); r='navigated'; }
catch{ r='TIMEOUT '+new URL(p.url()).pathname; }
console.log(JSON.stringify({enter:r}));
await b.close();
