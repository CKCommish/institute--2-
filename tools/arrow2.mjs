import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4414/people/', { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(600);
console.log(await p.evaluate(() => {
  const a = document.querySelector('.pm__idx-a');
  const cs = getComputedStyle(a);
  return { fontSize: cs.fontSize, width: cs.width, height: cs.height, varIdx: cs.getPropertyValue('--idx-arrow'), justifySelf: cs.justifySelf, alignSelf: cs.alignSelf, display: cs.display };
}));
console.log(await p.evaluate(() => [...document.styleSheets].flatMap(s => { try { return [...s.cssRules].map(r => r.cssText); } catch { return []; } }).filter(t => /\.arrow[^-]|pm__idx-a/.test(t)).slice(0, 12)));
await b.close();
