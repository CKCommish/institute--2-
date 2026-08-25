import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy:false });
// load choreography
let ctx = await b.newContext({ viewport:{width:1440,height:900} });
let p = await ctx.newPage();
await p.goto('http://127.0.0.1:4451/');
for (const t of [250, 600, 1100, 1900]) {
  await p.waitForTimeout(t===250?250:t- (t===600?250:t===1100?600:1100));
  await p.screenshot({path:`${OUT}/load-${t}.png`});
}
await ctx.close();
// reduced motion
ctx = await b.newContext({ viewport:{width:1440,height:900}, reducedMotion:'reduce' });
p = await ctx.newPage();
await p.goto('http://127.0.0.1:4451/', {waitUntil:'networkidle'});
await p.waitForTimeout(400);
await p.screenshot({path:`${OUT}/rm-400ms.png`});
await b.close();
