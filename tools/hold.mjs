import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
for (const w of [1440, 1280]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4413/pilots/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  console.log(w, JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('.pd')].map((s) => {
    const tag = s.querySelector('.pd__tag').getBoundingClientRect();
    const lab = s.querySelector('.pd__goal .label').getBoundingClientRect();
    const fig = s.querySelector('.pd__plate').getBoundingClientRect();
    const goal = s.querySelector('.pd__goal-t').getBoundingClientRect();
    const head = s.querySelector('.pd__head').getBoundingClientRect();
    return { id: s.id.slice(0,6), hold: Math.round(lab.top - tag.bottom), headH: Math.round(head.height),
             baselineVsFig: Math.round(goal.bottom - fig.bottom) };
  }))));
  await ctx.close();
}
await b.close();
