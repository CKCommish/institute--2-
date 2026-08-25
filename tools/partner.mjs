import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy:false });
const d = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:2 });
const p = await d.newPage();
await p.goto('http://127.0.0.1:4410/partner/', {waitUntil:'networkidle'});
await p.waitForTimeout(600);
await p.screenshot({path:`${OUT}/d-partner.png`, clip:{x:820,y:0,width:620,height:80}});
await b.close();
