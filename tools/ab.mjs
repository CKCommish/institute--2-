import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT = '/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy: false });
const clip = { x: 890, y: 152, width: 170, height: 120 };

async function go(name, css) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 4 });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4411/', { waitUntil: 'networkidle' });
  if (css) await p.addStyleTag({ content: css });
  await p.waitForTimeout(2600);
  const info = await p.evaluate(() => {
    const el = document.querySelector('.hero__poster');
    const cs = getComputedStyle(el);
    return { maskImage: cs.maskImage.slice(0,40), maskSize: cs.maskSize, maskClip: cs.maskClip, maskPosition: cs.maskPosition };
  });
  console.log(name, JSON.stringify(info));
  await p.screenshot({ path: `${OUT}/ab-${name}.png`, clip });
  await ctx.close();
}
await go('live', null);
await go('nomask', '.hero__poster{-webkit-mask-image:none !important;mask-image:none !important;animation:none !important;}');
await b.close();
