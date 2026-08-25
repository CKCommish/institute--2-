import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT = '/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy: false });
const errs = [];
async function run(name, opts, targets) {
  const ctx = await b.newContext(opts);
  const p = await ctx.newPage();
  p.on('console', m => { if (m.type()==='error'||m.type()==='warning') errs.push(`[${name}] ${m.type()}: ${m.text()}`); });
  p.on('pageerror', e => errs.push(`[${name}] pageerror: ${e.message}`));
  await p.goto('http://127.0.0.1:4454/people/', { waitUntil: 'networkidle' });
  await p.evaluate(async () => { const h=document.body.scrollHeight; for(let y=0;y<h;y+=300){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,50));} });
  await p.waitForTimeout(800);
  for (const [k, t] of Object.entries(targets)) {
    await p.evaluate((sel) => { const e=document.querySelector(sel); const r=e.getBoundingClientRect(); window.scrollBy(0, r.top - 40); }, t);
    await p.waitForTimeout(600);
    await p.screenshot({ path: `${OUT}/vp-${name}-${k}.png` });
  }
  const geo = await p.evaluate(() => {
    const px = (v) => Math.round(v*100)/100;
    const g = [];
    const bay = document.querySelectorAll('.dip > .fr')[1];
    if (bay) {
      const id = bay.querySelector('.fr__id'), cr = bay.querySelector('.fr__cred');
      const idr = id.getBoundingClientRect(), crr = cr.getBoundingClientRect();
      const cs = getComputedStyle(id, '::before');
      const cs2 = getComputedStyle(cr, '::before');
      g.push({ idTop: px(idr.top), idH: px(idr.height), spine1H: cs.height, spine1Left: cs.left,
               credTop: px(crr.top), credBot: px(crr.bottom), spine2: { h: cs2.height, left: cs2.left } });
    }
    const ent = document.querySelector('.ent');
    const cs3 = getComputedStyle(ent, '::before');
    g.push({ entBefore: { left: cs3.left, w: cs3.width, h: cs3.height, bg: cs3.backgroundColor } });
    g.push({ ow: { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth } });
    return g;
  });
  console.log(name, JSON.stringify(geo));
  await ctx.close();
}
await run('desktop', { viewport:{width:1440,height:900}, deviceScaleFactor:2 }, { cap: '#cohort-capital', fs: '.fs' });
await run('mobile', { viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true }, { cap: '#cohort-capital', fs: '.fs' });
console.log('CONSOLE:', errs.length?errs.join('\n'):'clean');
await b.close();
