import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const S='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots/';
const b = await launch({ proxy:false });
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://127.0.0.1:4454/people/',{waitUntil:'networkidle'});
await p.waitForTimeout(1200);
// realistic scroll in steps of 120px to y=1200
for (let y=0;y<=1200;y+=120){ await p.evaluate(v=>window.scrollTo(0,v),y); await p.waitForTimeout(90); }
const grabs=[0,150,300,600,1200,2000];
for (const t of grabs){ await p.waitForTimeout(t===0?0:(t-(grabs[grabs.indexOf(t)-1]||0))); await p.screenshot({path:S+`wipe-${t}.png`, clip:{x:0,y:200,width:1440,height:700}}); }
await b.close();
