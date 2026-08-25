import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: { width: 1000, height: 900 } });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4420/pilots/', { waitUntil: 'networkidle' });
console.log(await p.evaluate(() => {
  const out = ['sheets=' + document.styleSheets.length];
  for (const ss of document.styleSheets) {
    let rules; try { rules = ss.cssRules } catch (e) { out.push('BLOCKED ' + ss.href); continue }
    const walk = (rs, q) => { for (const r of rs) {
      if (r.cssRules && !r.selectorText) walk(r.cssRules, q + '@[' + (r.conditionText || r.media?.mediaText || '') + '] ');
      if (r.selectorText && r.selectorText.includes('pgrid__cell') && r.selectorText.includes('after'))
        out.push(q + '>> ' + r.selectorText + ' { ' + r.style.cssText + ' }');
    }};
    walk(rules, '');
  }
  return out.join('\n');
}));
await b.close();
