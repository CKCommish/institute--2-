import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: { width: 1000, height: 900 } });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4420/pilots/', { waitUntil: 'networkidle' });
console.log(await p.evaluate(() => {
  const hits = [];
  for (const ss of document.styleSheets) {
    let rules; try { rules = ss.cssRules } catch { continue }
    const walk = (rs, ctxq) => { for (const r of rs) {
      if (r.cssRules) walk(r.cssRules, (ctxq?ctxq+' | ':'')+(r.conditionText||r.media?.mediaText||r.type));
      else if (r.selectorText && /pgrid__cell/.test(r.selectorText) && /after/.test(r.selectorText)) hits.push(ctxq+' >> '+r.selectorText+' { '+r.style.cssText+' }');
    }};
    walk(rules, '');
  }
  return hits.join('\n');
}));
await b.close();
