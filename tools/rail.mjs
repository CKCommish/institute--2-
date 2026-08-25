import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT = '/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const w = Number(process.argv[2] || 390);
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: { width: w, height: 844 }, isMobile: w < 700, hasTouch: w < 700, reducedMotion: 'reduce' });
const page = await ctx.newPage();
await page.goto('http://127.0.0.1:4413/pilots/', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const ids = ['healthy-athletes', 'clean-data-centers', 'infant-mortality', 'career-pathways'];
const strips = [];
for (const id of ids) {
  await page.evaluate((id) => {
    const el = document.querySelector(`#${id} .pd__rail`);
    window.scrollBy(0, el.getBoundingClientRect().top - 300);
  }, id);
  await page.waitForTimeout(450);
  const box = await page.evaluate((id) => {
    const s = document.querySelector(`#${id}`);
    const r = s.querySelector('.pd__rail').getBoundingClientRect();
    const t = s.querySelector('.pd__t').getBoundingClientRect();
    return { x: 0, y: r.top - 24, width: document.documentElement.clientWidth, height: (t.bottom + 24) - (r.top - 24) };
  }, id);
  const p = `${OUT}/rail-${w}-${id}.png`;
  await page.screenshot({ path: p, clip: box });
  strips.push(p);
}
console.log(strips.join('\n'));
await ctx.close(); await b.close();
