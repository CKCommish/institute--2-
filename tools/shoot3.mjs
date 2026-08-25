import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT = '/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/crit2';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3 });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4455/partner/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2500);
await p.evaluate(() => window.scrollTo(0, 2000));
await p.waitForTimeout(1800);
await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(1500);

const data = await p.evaluate(() => {
  const g = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { x: +r.x.toFixed(1), y: +(r.y + window.scrollY).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1), fs: cs.fontSize, lh: cs.lineHeight, ls: cs.letterSpacing, color: cs.color, ff: cs.fontFamily.split(',')[0], fw: cs.fontWeight, op: cs.opacity }; };
  const all = {};
  ['.eyebrow','.phead__bridge','.phead__h','.ask__rule','.ask__mail','.ask__mail-t','.ask__sub','.ask__cue','.pfour__bridge','.proles__bridge','.proles__h','.door','.door__t','.door__p','.door__go'].forEach(s => all[s] = g(s));
  // pindex rows detail
  all.rows = [...document.querySelectorAll('.pindex__r')].map(r => {
    const a = r.querySelector('.pindex__a').getBoundingClientRect();
    const n = r.querySelector('.pindex__n').getBoundingClientRect();
    const i = r.querySelector('.pindex__i').getBoundingClientRect();
    const w = r.querySelector('.pindex__who').getBoundingClientRect();
    const gg = r.querySelector('.pindex__g').getBoundingClientRect();
    const ar = r.querySelector('.pindex__arrow').getBoundingClientRect();
    return { rowH: +a.height.toFixed(1), nX: +n.x.toFixed(1), nY: +n.y.toFixed(1), nB: +n.bottom.toFixed(1), iX:+i.x.toFixed(1), iB: +i.bottom.toFixed(1), wX: +w.x.toFixed(1), wB: +w.bottom.toFixed(1), gX: +gg.x.toFixed(1), gB: +gg.bottom.toFixed(1), gW:+gg.width.toFixed(1), arR: +ar.right.toFixed(1) };
  });
  all.doors = [...document.querySelectorAll('.door')].map(d => {
    const r = d.getBoundingClientRect();
    const t = d.querySelector('.door__t').getBoundingClientRect();
    const pp = d.querySelector('.door__p').getBoundingClientRect();
    const go = d.querySelector('.door__go').getBoundingClientRect();
    return { x:+r.x.toFixed(1), w:+r.width.toFixed(1), h:+r.height.toFixed(1), tY:+t.y.toFixed(1), pY:+pp.y.toFixed(1), pH:+pp.height.toFixed(1), goY:+go.y.toFixed(1) };
  });
  all.shellW = document.querySelector('.shell').getBoundingClientRect().width;
  all.docH = document.documentElement.scrollHeight;
  const cs = getComputedStyle(document.querySelector('.proles__bridge'));
  all.bridgeCream = { color: cs.color, bg: getComputedStyle(document.querySelector('.proles')).backgroundColor };
  all.fonts = [...new Set([...document.querySelectorAll('*')].map(e=>getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g,'')))];
  return all;
});
console.log(JSON.stringify(data, null, 1));

// clipped crops
await p.evaluate(() => window.scrollTo(0, 700));
await p.waitForTimeout(1200);
const r1 = await p.$('.pindex__r');
await r1.screenshot({ path: `${OUT}/crop-row1.png` });
await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(1000);
const ask = await p.$('.ask');
await ask.screenshot({ path: `${OUT}/crop-ask.png` });
await p.evaluate(() => window.scrollTo(0, 1900));
await p.waitForTimeout(1400);
const head = await p.$('.proles__head');
await head.screenshot({ path: `${OUT}/crop-creamhead.png` });
const list = await p.$('.proles__list');
await list.screenshot({ path: `${OUT}/crop-doors.png` });
await ctx.close();
await b.close();
