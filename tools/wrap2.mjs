import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
const widths = [1600, 1440, 1280, 1100, 980, 860, 760, 620, 500, 430, 390];
for (const w of widths) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1, isMobile: w < 500, hasTouch: w < 500 });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4414/people/', { waitUntil: 'domcontentloaded' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(250);
  const res = await p.evaluate(() => {
    const el = document.querySelector('.bd__h');
    const raw = el.dataset.text || el.textContent.trim();
    const cs = getComputedStyle(el);
    const probe = (s) => { const sp = document.createElement('span'); sp.style.cssText = `position:absolute;white-space:nowrap;visibility:hidden;font:${cs.font};letter-spacing:${cs.letterSpacing};`; sp.textContent = s; document.body.appendChild(sp); const w = sp.getBoundingClientRect().width; sp.remove(); return Math.round(w); };
    return {
      fs: cs.fontSize, avail: Math.round(el.parentElement.getBoundingClientRect().width),
      s1: probe('Advising the pilots.'),
      s1b: probe('Advising the pilots. Opening'),
      s2: probe('Opening the doors they need.'),
      whole: probe(raw),
    };
  });
  const lo = res.s2, hi = res.s1b - 1;
  console.log(`${String(w).padStart(5)}px  font=${res.fs.padStart(7)} avail=${String(res.avail).padStart(5)}  "Advising the pilots."=${String(res.s1).padStart(4)}  +Opening=${String(res.s1b).padStart(4)}  "Opening…need."=${String(res.s2).padStart(4)}  window=[${lo}..${hi}] ${lo<=hi?'OK':'EMPTY'} ${res.avail>=lo?'':'(too narrow for 2 lines)'}`);
  await ctx.close();
}
await b.close();
