import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
const widths = [1600, 1440, 1280, 1100, 980, 860, 760, 700, 620, 500, 430, 390, 360];
for (const w of widths) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1, isMobile: w < 500, hasTouch: w < 500 });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4414/people/', { waitUntil: 'domcontentloaded' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(280);
  const res = await p.evaluate(() => {
    const out = {};
    for (const sel of ['.bd__h', '.pm__h']) {
      const el = document.querySelector(sel);
      const raw = el.dataset.text || el.textContent.trim();
      el.dataset.split = ''; el.textContent = '';
      const words = raw.split(/\s+/);
      const probes = words.map((word, i) => { const s = document.createElement('span'); s.style.display='inline-block'; s.textContent = word; el.appendChild(s); if (i<words.length-1) el.appendChild(document.createTextNode(' ')); return s; });
      const rows = []; let top = null; let widthMax = 0;
      probes.forEach((pr) => { const t = Math.round(pr.offsetTop); if (top===null||Math.abs(t-top)>4){rows.push([]);top=t;} rows[rows.length-1].push(pr.textContent); widthMax = Math.max(widthMax, pr.getBoundingClientRect().right); });
      const left = el.getBoundingClientRect().left;
      out[sel] = { lines: rows.map(r=>r.join(' ')), block: Math.round(widthMax-left) };
      el.textContent = raw;
    }
    return out;
  });
  console.log(`${String(w).padStart(5)}px  bd(${String(res['.bd__h'].block).padStart(4)}) ${res['.bd__h'].lines.join('  ⏎  ')}`);
  console.log(`         pm(${String(res['.pm__h'].block).padStart(4)}) ${res['.pm__h'].lines.join('  ⏎  ')}`);
  await ctx.close();
}
await b.close();
