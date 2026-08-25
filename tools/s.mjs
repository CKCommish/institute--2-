import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
for (const w of [1440, 1180, 1000, 760, 620, 390]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce', ...(w<=430?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{}) });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4420/pilots/', { waitUntil: 'networkidle' });
  await p.locator('.pgrid').scrollIntoViewIfNeeded();
  await p.waitForTimeout(700);
  await p.locator('.pgrid').screenshot({ path: `/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/grid-${w}.png` });
  await ctx.close();
}
await b.close();
