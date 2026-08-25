import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT = '/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3, reducedMotion: 'reduce' });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4410/people/', { waitUntil: 'networkidle' });
await p.waitForTimeout(900);
const f = (await p.$$('.co__field'))[1];
await f.scrollIntoViewIfNeeded();
await p.waitForTimeout(400);
const box = await f.boundingBox();
await p.screenshot({ path: `${OUT}/edge.png`, clip: { x: 0, y: box.y - 70, width: 300, height: box.height + 90 } });
// exact x of each .ent and of the rules
const g = await p.evaluate(() => {
  const rows = [];
  document.querySelectorAll('.co').forEach((c) => {
    const lab = c.querySelector('.label').textContent;
    const xs = [...c.querySelectorAll('.ent')].map((e) => +e.getBoundingClientRect().x.toFixed(2));
    const head = +c.querySelector('.co__mark').getBoundingClientRect().x.toFixed(2);
    const nm = [...c.querySelectorAll('.ent__n')].map((e) => +e.getBoundingClientRect().x.toFixed(2));
    rows.push({ lab, headMarkX: head, entX: [...new Set(xs)], nameX: [...new Set(nm)] });
  });
  return rows;
});
console.log(JSON.stringify(g, null, 1));
await b.close();
