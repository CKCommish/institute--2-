import { launch } from '/home/user/institute--2-/tools/browser.mjs';
import fs from 'node:fs';
const OUT = process.argv[2] || '/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/nav2';
fs.mkdirSync(OUT, { recursive: true });
const BASE = 'http://127.0.0.1:4410';
const errs = [];
const b = await launch({ proxy: false });

const bar = { x: 0, y: 0, width: 1440, height: 132 };

async function shot(page, name, clip) {
  await page.screenshot({ path: `${OUT}/${name}.png`, ...(clip ? { clip } : {}) });
}
async function go(page, path) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
}

// ── desktop ──
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(`[d]${m.type()}: ${m.text()}`); });
p.on('pageerror', e => errs.push('[d]pageerror: ' + e.message));

for (const [path, label] of [['/', 'home'], ['/pilots/', 'pilots'], ['/partner/', 'partner'], ['/people/', 'people']]) {
  await go(p, path);
  await shot(p, `d-${label}-rest`, bar);
}

// hover CTA + hover link on /pilots/
await go(p, '/pilots/');
await p.hover('a.cta');
await p.waitForTimeout(700);
await shot(p, 'd-hover-cta', bar);
await p.hover('.nav__link[href="/forum/"]');
await p.waitForTimeout(700);
await shot(p, 'd-hover-link', bar);
await p.mouse.move(700, 600);
await p.waitForTimeout(500);
// keyboard focus on CTA
await p.evaluate(() => document.querySelector('a.cta').focus());
await p.evaluate(() => document.querySelector('a.cta').classList.add('kbdtest'));
await p.keyboard.press('Tab'); await p.keyboard.press('Shift+Tab');
await p.waitForTimeout(300);
await shot(p, 'd-focus-cta', bar);

// scrolled scrim
await go(p, '/');
await p.evaluate(() => window.scrollTo(0, 900));
await p.waitForTimeout(900);
await shot(p, 'd-scrolled', bar);
await shot(p, 'd-scrolled-full');

// cream inversion: find an .on-cream and scroll it under the bar
await go(p, '/institute/');
const creamY = await p.evaluate(() => {
  const el = document.querySelector('.on-cream');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return window.scrollY + r.top + 200;
});
if (creamY != null) { await p.evaluate(y => window.scrollTo(0, y), creamY); await p.waitForTimeout(900); await shot(p, 'd-inverted', bar); }
await p.hover('a.cta'); await p.waitForTimeout(700); await shot(p, 'd-inverted-hover', bar);

// overflow check desktop
const oflowD = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

// ── mobile ──
const mctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
const mp = await mctx.newPage();
mp.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(`[m]${m.type()}: ${m.text()}`); });
mp.on('pageerror', e => errs.push('[m]pageerror: ' + e.message));

const mbar = { x: 0, y: 0, width: 390, height: 110 };
for (const [path, label] of [['/', 'home'], ['/pilots/', 'pilots'], ['/partner/', 'partner']]) {
  await go(mp, path);
  await shot(mp, `m-${label}-bar`, mbar);
  await mp.tap('[data-burger]');
  await mp.waitForTimeout(1100);
  await shot(mp, `m-${label}-sheet`);
}
const oflowM = await mp.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

fs.writeFileSync(`${OUT}/report.json`, JSON.stringify({ errs, oflowD, oflowM }, null, 2));
console.log('overflow desktop:', oflowD, 'mobile:', oflowM);
console.log('console issues:', errs.length ? errs : 'none');
await b.close();
