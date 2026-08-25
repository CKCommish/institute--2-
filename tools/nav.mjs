import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
for (const [n,vp,m] of [['d',{width:1440,height:900},false],['m',{width:390,height:844},true]]) {
  const ctx = await b.newContext({ viewport: vp, isMobile: m, hasTouch: m });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4411/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  const r = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('header a, header button, .nav a, .nav button').forEach(e => {
      const cs = getComputedStyle(e); const bb = e.getBoundingClientRect();
      const before = getComputedStyle(e, '::before'); const after = getComputedStyle(e, '::after');
      out.push({ txt: e.textContent.trim().slice(0,40), cls: e.className, br: cs.borderRadius, bd: cs.border,
        rect: [Math.round(bb.x),Math.round(bb.y),Math.round(bb.width),Math.round(bb.height)],
        beforeContent: before.content, beforeMask: before.maskImage?.slice(0,60), beforeBg: before.background?.slice(0,80), beforeBr: before.borderRadius,
        afterContent: after.content });
    });
    return out;
  });
  console.log(n, JSON.stringify(r, null, 1));
  await ctx.close();
}
await b.close();
