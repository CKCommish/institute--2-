import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
for (const w of [860, 880, 900, 920, 1024, 1200, 1440]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4415/partner/', { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => {
    const s = document.querySelector('.proles');
    const cs = getComputedStyle(s);
    return { cls: s.className, bg: cs.backgroundColor, color: cs.color, bgvar: cs.getPropertyValue('--bg') };
  });
  console.log(w, JSON.stringify(r));
  await ctx.close();
}
await b.close();
