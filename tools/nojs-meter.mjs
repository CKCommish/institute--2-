/* nojs-meter — the state no meter in this project had ever run.

   WHY THIS EXISTS. The nav's scrim was a `::before` at opacity 0, switched on
   by an `is-scrolled` class that a script writes. With JavaScript disabled the
   class is never written, so the fixed bar had no ground at all and on /forum/
   at scrollY ~700 the 86px cream word "Forum" passed straight under cream nav
   links. That defect shipped through eight waves and four green meters,
   because every meter this project owns runs with JavaScript ON — and any
   rule whose visible state depends on a script-written class is, to those
   meters, permanently in whichever state the script chose.

   So: all seven routes, both viewports, `javaScriptEnabled: false`, contrast
   measured in PIXELS (see pixel-contrast.mjs — the DOM cannot answer for a
   fixed bar over a photograph), plus horizontal overflow and a check that
   nothing is left invisible with no script to reveal it.

   usage: BASE=http://127.0.0.1:4399 node tools/nojs-meter.mjs [--json] [--js] */
import { launch } from './browser.mjs';
import { sweepContrast } from './pixel-contrast.mjs';

const base = process.env.BASE || 'http://127.0.0.1:4399';
const ROUTES = (process.env.ROUTES || '/,/pilots/,/institute/,/forum/,/people/,/partner/,/404').split(',');
const asJson = process.argv.includes('--json');
/* --js runs the identical sweep with scripts ON. Not the point of the tool,
   but it is how you tell "no-JS broke it" from "it was always broken". */
const withJS = process.argv.includes('--js');

const VIEWS = [
  { tag: 'desktop', vp: { width: 1440, height: 900 } },
  { tag: 'mobile', vp: { width: 390, height: 844 }, mobile: true },
];

const b = await launch({ proxy: false });
const report = [];

for (const view of VIEWS) {
  const ctx = await b.newContext({
    viewport: view.vp, isMobile: !!view.mobile, hasTouch: !!view.mobile,
    deviceScaleFactor: 1, javaScriptEnabled: withJS,
  });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    const issues = [];
    const resp = await page.goto(base + route, { waitUntil: 'load', timeout: 60000 }).catch(() => null);
    if (!resp) { issues.push('navigation failed'); report.push({ view: view.tag, route, issues, rows: [] }); continue; }
    if (resp.status() >= 400 && route !== '/404') issues.push(`HTTP ${resp.status()}`);
    await page.evaluate(() => document.fonts.ready).catch(() => {});
    await page.waitForTimeout(700);

    /* Anything still invisible with no script to reveal it is content that
       does not exist for this reader. The reveal system is the usual
       suspect; `.js`-gated rules are the general case. */
    /* Only meaningful with scripts off: with them on, the reveal system
       legitimately holds below-fold rungs at opacity 0 until they are
       scrolled to, and flagging those would be noise. */
    const dark = withJS ? [] : await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('main *').forEach((el) => {
        const t = (el.textContent || '').trim();
        if (!t || el.children.length) return;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        if (r.width < 2 && r.height < 2) return;
        if (cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) out.push(t.slice(0, 40));
      });
      return [...new Set(out)].slice(0, 6);
    });
    if (dark.length) issues.push(`invisible without script: ${dark.map((s) => `"${s}"`).join(', ')}`);

    const ov = await page.evaluate(() => {
      const docW = document.documentElement.clientWidth, out = [];
      const clipped = (el) => {
        for (let n = el.parentElement; n && n !== document.documentElement; n = n.parentElement) {
          const o = getComputedStyle(n);
          if (/hidden|clip|auto|scroll/.test(o.overflowX) || /hidden|clip/.test(o.overflow)) return true;
        }
        return false;
      };
      document.querySelectorAll('body *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && (r.right > docW + 2 || r.left < -2) && !clipped(el)) {
          out.push(`${el.tagName.toLowerCase()}${typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : ''} → ${Math.round(r.left)}..${Math.round(r.right)} (vw ${docW})`);
        }
      });
      return { out: [...new Set(out)].slice(0, 4), scrollsX: document.documentElement.scrollWidth > docW + 1 };
    });
    if (ov.scrollsX) issues.push('document scrolls horizontally');
    if (ov.out.length) issues.push(`unclipped overflow: ${ov.out.join(' | ')}`);

    const rows = await sweepContrast(page, view.vp);
    for (const r of rows.filter((r) => !r.ok)) {
      issues.push(`contrast ${r.ratio}:1 (needs ${r.need}) — ${r.size}px ${r.floats ? '[fixed] ' : ''}${r.tag} "${r.sample}" · backdrop L* ${r.backdropL}`);
    }
    report.push({ view: view.tag, route, issues, rows });
  }
  await ctx.close();
}
await b.close();

if (asJson) console.log(JSON.stringify({ javaScriptEnabled: withJS, report }, null, 2));
else {
  console.log(`javaScriptEnabled: ${withJS}  ·  ${base}\n`);
  let bad = 0, thin = [];
  for (const r of report) {
    for (const row of r.rows) if (row.ok && row.ratio < row.need * 1.25) thin.push({ ...row, view: r.view, route: r.route });
    if (!r.issues.length) continue;
    bad += r.issues.length;
    console.log(`${r.view} ${r.route}`);
    r.issues.forEach((i) => console.log('  · ' + i));
  }
  thin.sort((a, b) => a.ratio - b.ratio);
  if (thin.length) {
    console.log('\nthinnest passing margins (pixel-measured):');
    for (const t of thin.slice(0, 8)) console.log(`  ${String(t.ratio).padStart(6)}:1 (needs ${t.need})  ${t.view} ${t.route} ${t.size}px "${t.sample}"`);
  }
  console.log(`\n${bad} issue(s) across ${report.length} page-views, JavaScript ${withJS ? 'ON' : 'OFF'}.`);
}
