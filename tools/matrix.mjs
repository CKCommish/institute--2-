import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT = '/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy: false });
const clip = { x: 890, y: 150, width: 170, height: 60 };
const cases = {
  A_solidmask_noclip: `.hero__poster{animation:none!important;-webkit-mask-image:linear-gradient(#000,#000)!important;mask-image:linear-gradient(#000,#000)!important;-webkit-mask-size:100% 100%!important;mask-size:100% 100%!important;-webkit-mask-position:0 0!important;mask-position:0 0!important;-webkit-mask-clip:no-clip!important;mask-clip:no-clip!important;}`,
  B_solidmask_border: `.hero__poster{animation:none!important;-webkit-mask-image:linear-gradient(#000,#000)!important;mask-image:linear-gradient(#000,#000)!important;-webkit-mask-size:100% 100%!important;mask-size:100% 100%!important;-webkit-mask-position:0 0!important;mask-position:0 0!important;-webkit-mask-clip:border-box!important;mask-clip:border-box!important;}`,
  C_padding: `.hero__poster{padding-top:60px!important;margin-top:-60px!important;-webkit-mask-clip:border-box!important;mask-clip:border-box!important;-webkit-mask-position:0 0!important;mask-position:0 0!important;--ink-rise:0em!important;}`,
  D_noclip_only: `.hero__poster{-webkit-mask-clip:no-clip!important;mask-clip:no-clip!important;--ink-rise:0.3em!important;}`,
};
for (const [name, css] of Object.entries(cases)) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 4 });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4411/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: css });
  await p.waitForTimeout(2400);
  await p.screenshot({ path: `${OUT}/mx-${name}.png`, clip });
  const info = await p.evaluate(() => { const el=document.querySelector('.hero__poster'); const c=getComputedStyle(el); const r=el.getBoundingClientRect(); return {clip:c.maskClip, size:c.maskSize, pos:c.maskPosition, top:+r.top.toFixed(2)}; });
  console.log(name, JSON.stringify(info));
  await ctx.close();
}
await b.close();
