import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT = '/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy: false });

async function frame(T, tag, close = false, reduced = false) {
  const ctx = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2,
    reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4454/', { waitUntil:'networkidle' });
  await p.waitForTimeout(500);
  if (close) {
    await p.evaluate(() => document.querySelector('[data-burger]').click());
    await p.waitForTimeout(1100);
  }
  const state = await p.evaluate(async (T) => {
    document.querySelector('[data-burger]').click();
    await new Promise(r => requestAnimationFrame(r));
    for (const a of document.getAnimations()) { a.pause(); try { a.currentTime = T; } catch {} }
    await new Promise(r => requestAnimationFrame(r));
    const o = s => { const e = document.querySelector(s); return e ? +getComputedStyle(e).opacity : null; };
    return { ground: o('[data-menu]'), i0: o('.menu__links a'), foot: o('.menu__foot'),
             hidden: document.querySelector('[data-menu]').hidden };
  }, T);
  await p.screenshot({ path: `${OUT}/${tag}.png` });
  console.log(tag.padEnd(18), `ground=${state.ground?.toFixed(3)} item1=${state.i0?.toFixed(3)} foot=${state.foot?.toFixed(3)} hidden=${state.hidden}`);
  await ctx.close();
}

for (const T of [60, 120, 200, 260, 360, 520, 900]) await frame(T, `F-open-${T}`);
for (const T of [40, 120, 200, 300]) await frame(T, `F-close-${T}`, true);
for (const T of [0, 16, 120, 350, 500]) await frame(T, `F-rm-${T}`, false, true);
await b.close();
