import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4410/people/', { waitUntil: 'networkidle' });
await p.waitForTimeout(400);
console.log(await p.evaluate(() => [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1).map((e) => `${e.tagName}.${e.className}` + JSON.stringify(e.getBoundingClientRect().right))));
await b.close();
