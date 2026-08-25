import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/nav2';
const BASE='http://127.0.0.1:4410';
const routes=['/','/institute/','/pilots/','/forum/','/people/','/partner/','/404'];
const b = await launch({ proxy: false });
const issues=[];
for (const [label, vp, extra] of [
  ['d', { width: 1440, height: 900 }, {}],
  ['m', { width: 390, height: 844 }, { isMobile: true, hasTouch: true }],
  ['rm', { width: 1440, height: 900 }, { reducedMotion: 'reduce' }],
]) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1, ...extra });
  const p = await ctx.newPage();
  p.on('console', m => { if (m.type()==='error'||m.type()==='warning') issues.push(`${label} console ${m.type()}: ${m.text()}`); });
  p.on('pageerror', e => issues.push(`${label} pageerror: ${e.message}`));
  p.on('requestfailed', r => issues.push(`${label} reqfail: ${r.url()}`));
  for (const r of routes) {
    const resp = await p.goto(BASE + r, { waitUntil: 'networkidle' });
    await p.waitForTimeout(400);
    const d = await p.evaluate(() => ({
      of: document.documentElement.scrollWidth - window.innerWidth,
      bodyOf: document.body.scrollWidth - window.innerWidth,
      curr: [...document.querySelectorAll('.nav [aria-current="page"], .menu [aria-current="page"]')].map(e=>e.className.split(' ')[0]+':'+e.textContent.trim().slice(0,22)),
      capsule: [...document.querySelectorAll('header.nav *, .menu *')].filter(e=>{const cs=getComputedStyle(e);return parseFloat(cs.borderTopLeftRadius) > 20 || (cs.backgroundColor!=='rgba(0, 0, 0, 0)' && cs.backgroundColor!=='rgb(5, 13, 22)' && e.className && !/menu|nav\b/.test(e.className));}).map(e=>e.className+' r='+getComputedStyle(e).borderTopLeftRadius+' bg='+getComputedStyle(e).backgroundColor),
    }));
    if (resp.status() >= 400 && r !== '/404') issues.push(`${label} ${r} status ${resp.status()}`);
    if (d.of !== 0 || d.bodyOf > 0) issues.push(`${label} ${r} overflow ${d.of}/${d.bodyOf}`);
    if (d.capsule.length) issues.push(`${label} ${r} CAPSULE ${JSON.stringify(d.capsule)}`);
    console.log(label, r, 'of', d.of, 'current', JSON.stringify(d.curr));
  }
  // reduced-motion inertness: open the sheet, check computed transition durations
  if (label === 'rm') {
    const t = await p.evaluate(() => {
      const g = (s, ps) => { const e = document.querySelector(s); return e ? getComputedStyle(e, ps).transitionDuration : 'n/a'; };
      return { cta: g('.cta'), ctaAfter: g('.cta__t','::after'), star: g('.nav .star'), link: g('.nav__link'), menu: g('.menu'), row: g('.menu__links a') };
    });
    console.log('reduced-motion durations', JSON.stringify(t));
  }
  await ctx.close();
}
console.log(issues.length ? 'ISSUES:\n' + issues.join('\n') : 'NO ISSUES');
await b.close();
