import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const BASE = 'http://127.0.0.1:4410';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const out = [];
for (const route of ['/institute/', '/pilots/', '/forum/', '/people/', '/partner/', '/404']) {
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(BASE + route, { waitUntil: 'networkidle' });
  let clicked = null;
  await page.evaluate(() => {
    window.__clk = null;
    document.querySelector('.nav__mark').addEventListener('click', (e) => {
      window.__clk = { defaultPrevented: e.defaultPrevented, target: e.target.className };
    }, true);
  });
  let res = 'no-nav';
  try {
    await Promise.all([
      page.waitForURL((u) => new URL(u).pathname === '/', { timeout: 6000 }),
      page.tap('.nav__mark'),
    ]);
    res = 'navigated';
  } catch (e) { res = 'TIMEOUT ' + new URL(page.url()).pathname; }
  out.push({ route, res, errs });
  await page.close();
}
// also: scrolled state tap
const page = await ctx.newPage();
await page.goto(BASE + '/pilots/', { waitUntil: 'networkidle' });
await page.evaluate(() => scrollTo(0, 1400));
await page.waitForTimeout(600);
let r2 = 'no';
try { await Promise.all([page.waitForURL((u) => new URL(u).pathname === '/', { timeout: 6000 }), page.tap('.nav__mark')]); r2 = 'navigated'; }
catch { r2 = 'TIMEOUT ' + new URL(page.url()).pathname; }
out.push({ route: '/pilots/ scrolled 1400', res: r2 });
await page.close();
await b.close();
console.log(JSON.stringify(out, null, 1));
