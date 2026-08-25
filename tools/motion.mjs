import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({proxy:false});
const ctx = await b.newContext({viewport:{width:1440,height:900}});
const p = await ctx.newPage();
const t=[];
await p.goto('http://127.0.0.1:4451/',{waitUntil:'domcontentloaded'});
for (const ms of [150,400,700,1100,1800]) {
  await p.waitForTimeout(ms===150?150:(ms - t.at(-1)||0));
  t.push(ms);
  await p.screenshot({path:`${OUT}/mo-${ms}.png`});
}
await ctx.close();
// widths
for (const w of [768,1024,1280,1920]) {
  const c = await b.newContext({viewport:{width:w,height:900}});
  const q = await c.newPage();
  await q.goto('http://127.0.0.1:4451/',{waitUntil:'networkidle'});
  await q.waitForTimeout(2500);
  await q.screenshot({path:`${OUT}/w-${w}.png`});
  await c.close();
}
console.log('ok');
await b.close();
