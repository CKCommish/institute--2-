import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const S='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy:false });
const c = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:4 });
const p = await c.newPage();
await p.goto('http://127.0.0.1:4420/pilots/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
await p.screenshot({path:S+'/nz-bar4x.png', clip:{x:0,y:0,width:1440,height:64}});
await c.close(); await b.close();
