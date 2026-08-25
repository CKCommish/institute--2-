import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
for (const w of [390, 1440]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 844 }, deviceScaleFactor: 2, isMobile: w<500, hasTouch: w<500 });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4414/people/', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(2600);
  const r = await p.evaluate(() => { const e = document.querySelector('.bd__foot'); const q = e.getBoundingClientRect(); return { y: Math.round(q.y + scrollY), h: Math.round(q.height), x: Math.round(q.x), w: Math.round(q.width) }; });
  console.log(w, JSON.stringify(r));
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(300);
  await p.screenshot({ path: `/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots/foot-${w}.png`, fullPage: true, clip: { x: Math.max(0, r.x - 20), y: r.y - 20, width: Math.min(w, r.w + 60), height: r.h + 45 } });
  await ctx.close();
}
await b.close();
