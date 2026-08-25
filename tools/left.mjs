import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT = '/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy: false });
const clip = { x: 40, y: 400, width: 130, height: 120 };
for (const [name, css] of [['live',''],['nomask','.hero__poster{-webkit-mask-image:none!important;mask-image:none!important;animation:none!important;}']]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 5 });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4411/', { waitUntil: 'networkidle' });
  if (css) await p.addStyleTag({ content: css });
  await p.waitForTimeout(2400);
  await p.screenshot({ path: `${OUT}/lf-${name}.png`, clip });
  await ctx.close();
}
await b.close();
