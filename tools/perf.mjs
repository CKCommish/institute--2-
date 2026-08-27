/* What a visitor actually downloads and waits for. Nothing in this harness has
   ever measured it. usage: BASE=http://127.0.0.1:4399 node tools/perf.mjs */
import { launch } from './browser.mjs';

const base = process.env.BASE || 'http://127.0.0.1:4399';
const ROUTES = ['/', '/institute/', '/pilots/', '/forum/', '/people/', '/partner/'];
const b = await launch({ proxy: false });
const rows = [];

for (const view of [
  { tag: 'desktop', vp: { width: 1440, height: 900 } },
  { tag: 'mobile', vp: { width: 390, height: 844 }, mobile: true },
]) {
  for (const route of ROUTES) {
    const ctx = await b.newContext({ viewport: view.vp, isMobile: !!view.mobile, hasTouch: !!view.mobile });
    const page = await ctx.newPage();
    const bytes = { image: 0, font: 0, css: 0, js: 0, doc: 0, other: 0 };
    let requests = 0;

    page.on('response', async (res) => {
      requests++;
      try {
        const h = res.headers();
        const len = Number(h['content-length'] || 0) || (await res.body().catch(() => Buffer.alloc(0))).length;
        const t = h['content-type'] || '';
        const k = /image/.test(t) ? 'image' : /font/.test(t) ? 'font' : /css/.test(t) ? 'css'
                : /javascript/.test(t) ? 'js' : /html/.test(t) ? 'doc' : 'other';
        bytes[k] += len;
      } catch {}
    });

    await page.goto(base + route, { waitUntil: 'load', timeout: 60000 });
    // LCP settles after load; give the observer a beat, then read it.
    const vitals = await page.evaluate(() => new Promise((resolve) => {
      let lcp = 0, cls = 0;
      try {
        new PerformanceObserver((l) => { for (const e of l.getEntries()) lcp = Math.max(lcp, e.startTime); })
          .observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; })
          .observe({ type: 'layout-shift', buffered: true });
      } catch {}
      setTimeout(() => {
        const nav = performance.getEntriesByType('navigation')[0] || {};
        const fcp = (performance.getEntriesByName('first-contentful-paint')[0] || {}).startTime || 0;
        resolve({ lcp: Math.round(lcp), cls: +cls.toFixed(4), fcp: Math.round(fcp),
                  dcl: Math.round(nav.domContentLoadedEventEnd || 0) });
      }, 2500);
    }));

    // above-the-fold weight is what actually gates first paint
    const total = Object.values(bytes).reduce((a, n) => a + n, 0);
    rows.push({ view: view.tag, route, total, ...bytes, requests, ...vitals });
    await ctx.close();
  }
}
await b.close();

const kb = (n) => (n / 1024).toFixed(0).padStart(5) + 'K';
console.log('view     route          total  image   font    css     js  reqs   FCP   LCP    CLS');
for (const r of rows) {
  console.log(
    r.view.padEnd(8) + r.route.padEnd(13) +
    kb(r.total) + kb(r.image) + kb(r.font) + kb(r.css) + kb(r.js) +
    String(r.requests).padStart(6) + String(r.fcp).padStart(6) + String(r.lcp).padStart(6) +
    String(r.cls).padStart(7)
  );
}
const worst = rows.reduce((a, r) => (r.lcp > a.lcp ? r : a), rows[0]);
const heaviest = rows.reduce((a, r) => (r.total > a.total ? r : a), rows[0]);
const shifty = rows.filter((r) => r.cls > 0.1);
console.log('\nheaviest:', heaviest.view, heaviest.route, (heaviest.total / 1024 / 1024).toFixed(2) + 'MB');
console.log('slowest LCP:', worst.view, worst.route, worst.lcp + 'ms', worst.lcp > 2500 ? '← over the 2.5s good threshold' : '(good)');
if (shifty.length) console.log('layout shift over 0.1:', shifty.map((r) => `${r.view}${r.route}=${r.cls}`).join(' '));
else console.log('layout shift: all routes under 0.1 (good)');
