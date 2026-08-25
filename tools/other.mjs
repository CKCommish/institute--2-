import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900}});
for (const [p,n] of [['/','home'],['/forum/','forum'],['/institute/','inst']]){
  const pg=await ctx.newPage();
  await pg.goto('http://127.0.0.1:4420'+p,{waitUntil:'networkidle'});
  await pg.waitForTimeout(1400);
  await pg.screenshot({path:`${OUT}/other-${n}.png`});
  await pg.close();
}
// reduced motion pilots
const ctx2=await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
const p2=await ctx2.newPage();
await p2.goto('http://127.0.0.1:4420/pilots/',{waitUntil:'networkidle'});
await p2.waitForTimeout(1200);
const bx=await p2.$$('.pd__plate');
await bx[0].scrollIntoViewIfNeeded(); await p2.waitForTimeout(600);
await bx[0].screenshot({path:`${OUT}/rm-plate-01.png`});
await b.close();
