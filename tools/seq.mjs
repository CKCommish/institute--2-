import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT = '/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const BASE = 'http://127.0.0.1:4454';
const b = await launch({ proxy: false });

const errs = [];
async function mob(reduced) {
  const ctx = await b.newContext({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    deviceScaleFactor: 2, reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
  const p = await ctx.newPage();
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(`[${reduced?'rm':'mo'}] ${m.type()}: ${m.text()}`); });
  p.on('pageerror', e => errs.push(`[pageerror] ${e.message}`));
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  return { ctx, p };
}

const probe = `() => {
  const g = document.querySelector('[data-menu]');
  const items = [...document.querySelectorAll('.menu__links a')];
  const foot = document.querySelector('.menu__foot');
  const cta = document.querySelector('.menu__cta');
  const o = el => el ? +getComputedStyle(el).opacity : null;
  return { ground: o(g), items: items.map(o), cta: o(cta), foot: o(foot), hidden: g.hidden };
}`;

// ── 1. normal motion: open sequence ──────────────────────────────────
{
  const { ctx, p } = await mob(false);
  const tag = 'open';
  await p.locator('[data-burger]').tap();
  const marks = [40, 80, 120, 160, 200, 240, 320, 420, 700];
  let last = 0;
  const log = [];
  for (const m of marks) {
    await p.waitForTimeout(m - last); last = m;
    log.push([m, await p.evaluate(eval(`(${probe})`))]);
    await p.screenshot({ path: `${OUT}/T-${tag}-${m}.png` });
  }
  console.log('OPEN (normal)');
  for (const [m, s] of log) console.log(` ${String(m).padStart(4)}ms ground=${s.ground.toFixed(3)} items=[${s.items.map(v=>v.toFixed(2)).join(' ')}] cta=${s.cta.toFixed(2)} foot=${s.foot.toFixed(2)}`);

  // ── close sequence ──
  await p.waitForTimeout(400);
  await p.locator('[data-burger]').tap();
  const cmarks = [40, 100, 160, 220, 300, 380, 460];
  last = 0; const clog = [];
  for (const m of cmarks) {
    await p.waitForTimeout(m - last); last = m;
    clog.push([m, await p.evaluate(eval(`(${probe})`))]);
    await p.screenshot({ path: `${OUT}/T-close-${m}.png` });
  }
  console.log('CLOSE (normal)');
  for (const [m, s] of clog) console.log(` ${String(m).padStart(4)}ms ground=${s.ground.toFixed(3)} items=[${s.items.map(v=>v.toFixed(2)).join(' ')}] foot=${s.foot.toFixed(2)} hidden=${s.hidden}`);
  await ctx.close();
}

// ── 2. reduced motion ────────────────────────────────────────────────
{
  const { ctx, p } = await mob(true);
  await p.locator('[data-burger]').tap();
  const marks = [0, 60, 120, 200, 350, 500];
  let last = 0; const log = [];
  for (const m of marks) {
    await p.waitForTimeout(m - last); last = m;
    log.push([m, await p.evaluate(eval(`(${probe})`))]);
    await p.screenshot({ path: `${OUT}/T-rm-${m}.png` });
  }
  console.log('OPEN (reduce)');
  for (const [m, s] of log) console.log(` ${String(m).padStart(4)}ms ground=${s.ground.toFixed(3)} items=[${s.items.map(v=>v.toFixed(2)).join(' ')}] cta=${s.cta.toFixed(2)} foot=${s.foot.toFixed(2)} label=${await p.textContent('[data-burger-label]')}`);
  await p.locator('[data-burger]').tap();
  await p.waitForTimeout(30);
  console.log('CLOSE (reduce) @30ms', JSON.stringify(await p.evaluate(eval(`(${probe})`))), 'label=', await p.textContent('[data-burger-label]'));
  await p.screenshot({ path: `${OUT}/T-rm-close-30.png` });
  await ctx.close();
}

// ── 3. overflow + desktop ────────────────────────────────────────────
{
  const routes = ['/', '/institute/', '/pilots/', '/forum/', '/people/', '/partner/'];
  for (const vp of [{ w: 1440, h: 900, n: 'd' }, { w: 390, h: 844, n: 'm' }]) {
    const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.n==='m', hasTouch: vp.n==='m', deviceScaleFactor: vp.n==='m'?2:1 });
    const p = await ctx.newPage();
    p.on('console', m => { if (m.type()==='error'||m.type()==='warning') errs.push(`[${vp.n}] ${m.type()}: ${m.text()}`); });
    p.on('pageerror', e => errs.push(`[pageerror ${vp.n}] ${e.message}`));
    for (const r of routes) {
      await p.goto(BASE + r, { waitUntil: 'networkidle' });
      const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (ov > 0) console.log(`OVERFLOW ${r} = ${ov}px`);
    }
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${OUT}/S-${vp.n}-top.png` });
    await p.evaluate(() => scrollTo(0, 1400)); await p.waitForTimeout(700);
    await p.screenshot({ path: `${OUT}/S-${vp.n}-scrolled.png` });
    await ctx.close();
  }
}
console.log('CONSOLE:', errs.length ? errs.join('\n') : 'clean');
await b.close();
