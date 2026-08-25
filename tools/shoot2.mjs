import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad';
const b = await launch({ proxy:false });
const ctx = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:1 });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4455/partner/', { waitUntil:'networkidle' });
await p.waitForTimeout(1200);
for (const y of [620, 760, 1500]) {
  await p.evaluate(v=>window.scrollTo(0,v), y);
  await p.waitForTimeout(1600);
  await p.screenshot({ path:`${OUT}/pd-y${y}.png` });
}
// hover the ask mail
await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(900);
await p.hover('.ask__mail'); await p.waitForTimeout(700);
await p.screenshot({ path:`${OUT}/pd-hover-mail.png` });
// focus states via keyboard
await p.evaluate(()=>window.scrollTo(0,0));
await p.keyboard.press('Tab');await p.keyboard.press('Tab');await p.keyboard.press('Tab');
await p.keyboard.press('Tab');await p.keyboard.press('Tab');await p.keyboard.press('Tab');
await p.keyboard.press('Tab');
await p.waitForTimeout(600);
await p.screenshot({ path:`${OUT}/pd-focus.png` });
// hover a pilot row
await p.evaluate(()=>window.scrollTo(0,900)); await p.waitForTimeout(1400);
await p.hover('.pindex__r:nth-child(2) .pindex__a'); await p.waitForTimeout(700);
await p.screenshot({ path:`${OUT}/pd-hover-row.png` });
// hover a door
await p.evaluate(()=>window.scrollTo(0,1800)); await p.waitForTimeout(1600);
await p.screenshot({ path:`${OUT}/pd-y1800.png` });
await b.close();
