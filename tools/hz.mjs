import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4411/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2000);
console.log(JSON.stringify(await p.evaluate(async () => {
  await document.fonts.ready;
  const c = document.createElement('canvas').getContext('2d');
  const r = {};
  for (const [k, s] of [['l1','the technologies of'],['l2','tomorrow strengthen'],['l3','American families today.']]) {
    c.font = '400 126.24px Newsreader';
    const m = c.measureText(s);
    r[k] = { left: m.actualBoundingBoxLeft, right: m.actualBoundingBoxRight, width: m.width,
             overRight: +(m.actualBoundingBoxRight - m.width).toFixed(2),
             ascent: m.actualBoundingBoxAscent, descent: m.actualBoundingBoxDescent };
  }
  return r;
}), null, 2));
await b.close();
