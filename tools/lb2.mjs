import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
const widths = process.argv.slice(2).map(Number);
for (const w of widths) {
  const ctx = await b.newContext({ viewport:{width:w,height: w<=620?844:900}, isMobile: w<=430, hasTouch: w<=430 });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4420/', { waitUntil:'networkidle' });
  await p.waitForTimeout(1200);
  const r = await p.evaluate(() => {
    const el = document.querySelector('.hero__poster');
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const lines = new Map();
    let n;
    while ((n = walker.nextNode())) {
      const t = n.textContent; let i = 0;
      while (i < t.length) {
        while (i < t.length && t[i] === ' ') i++;
        let j = i; while (j < t.length && t[j] !== ' ') j++;
        if (j > i) {
          const r = document.createRange(); r.setStart(n, i); r.setEnd(n, j);
          const b = r.getBoundingClientRect();
          const key = Math.round(b.top);
          if (!lines.has(key)) lines.set(key, { words: [], l: b.left, r: b.right });
          const L = lines.get(key); L.words.push(t.slice(i, j)); L.l = Math.min(L.l, b.left); L.r = Math.max(L.r, b.right);
        }
        i = j;
      }
    }
    return [...lines.entries()].sort((a,b)=>a[0]-b[0]).map(([top,L])=>({ top, w: Math.round(L.r-L.l), text: L.words.join(' ') }));
  });
  console.log('W='+w, 'measure=', await p.evaluate(()=>Math.round(document.querySelector('.hero__poster').getBoundingClientRect().width)));
  r.forEach(L=>console.log('   ', String(L.w).padStart(5), L.text));
  await ctx.close();
}
await b.close();
