import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
const widths = [1600, 1440, 1280, 1100, 980, 860, 760, 620, 500, 390];
const variants = [
  ['wrap / none      ', 'wrap', 'none'],
  ['balance / none   ', 'balance', 'none'],
  ['pretty / none    ', 'pretty', 'none'],
  ['wrap / 24ch      ', 'wrap', '24ch'],
  ['wrap / 26ch      ', 'wrap', '26ch'],
  ['balance / 30ch   ', 'balance', '30ch'],
];
for (const w of widths) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1, isMobile: w < 500, hasTouch: w < 500 });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4414/people/', { waitUntil: 'domcontentloaded' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  const res = await p.evaluate((variants) => {
    const el = document.querySelector('.bd__h');
    const raw = el.dataset.text || el.textContent.trim();
    const out = [];
    for (const [name, tw, mw] of variants) {
      el.dataset.split = ''; el.textContent = raw;
      el.style.textWrap = tw; el.style.maxWidth = mw;
      // re-measure with probes
      const words = raw.split(/\s+/);
      el.textContent = '';
      const probes = words.map((word, i) => {
        const s = document.createElement('span');
        s.style.display = 'inline-block'; s.textContent = word;
        el.appendChild(s);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
        return s;
      });
      const rows = []; let top = null;
      probes.forEach((pr) => { const t = Math.round(pr.offsetTop); if (top === null || Math.abs(t - top) > 4) { rows.push([]); top = t; } rows[rows.length-1].push(pr.textContent); });
      out.push(name + ' | ' + rows.map(r => r.join(' ')).join('  ⏎  '));
      el.textContent = raw;
    }
    el.style.textWrap = ''; el.style.maxWidth = '';
    return out;
  }, variants);
  console.log('== ' + w + 'px ==');
  res.forEach(r => console.log('   ' + r));
  await ctx.close();
}
await b.close();
