import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
for (const w of [1440, 1200, 1024]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4413/pilots/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const r = await page.evaluate(() => {
    const s = document.querySelector('#healthy-athletes');
    const out = { dt: [], val: [] };
    s.querySelectorAll('.pd__dl > div').forEach((row) => {
      const dt = row.querySelector('dt'), dd = row.querySelector('dd');
      const rng = document.createRange(); rng.selectNodeContents(dt);
      out.dt.push([dt.textContent, Math.round(rng.getBoundingClientRect().width), Math.round(dt.getBoundingClientRect().width)]);
      out.val.push(Math.round(dd.getBoundingClientRect().width));
    });
    return out;
  });
  console.log(w, JSON.stringify(r));
  await ctx.close();
}
await b.close();
