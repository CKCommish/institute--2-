import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
for (const w of [1024, 1440]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4412/pilots/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelector('.pgrid').scrollIntoView());
  await page.waitForTimeout(1500);
  const o = await page.evaluate(() => {
    const c = document.querySelector('.pgrid__cell');
    const dd = c.querySelector('.card__f dd');
    const tag = c.querySelector('.card__tag');
    const cs = getComputedStyle(dd);
    return {
      cellW: +c.getBoundingClientRect().width.toFixed(1),
      ddW: +dd.getBoundingClientRect().width.toFixed(1),
      ddMax: cs.maxWidth,
      tagW: +tag.getBoundingClientRect().width.toFixed(1),
      tagMax: getComputedStyle(tag).maxWidth,
    };
  });
  console.log(w, JSON.stringify(o));
  await ctx.close();
}
await b.close();
