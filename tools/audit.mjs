/* Objective checks the critics cannot eyeball. Run against a live dev server.
   usage: BASE=http://127.0.0.1:4460 node tools/audit.mjs [--json] */
import { launch } from './browser.mjs';

const base = process.env.BASE || 'http://127.0.0.1:4399';
const ROUTES = ['/', '/pilots/', '/institute/', '/forum/', '/people/', '/partner/'];
const asJson = process.argv.includes('--json');

const srgb = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };

const b = await launch({ proxy: false });
const report = [];

for (const view of [{ tag: 'desktop', vp: { width: 1440, height: 900 } }, { tag: 'mobile', vp: { width: 390, height: 844 }, mobile: true }]) {
  const ctx = await b.newContext({ viewport: view.vp, isMobile: !!view.mobile, hasTouch: !!view.mobile, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  for (const route of ROUTES) {
    const issues = [];
    const consoleErrors = [];
    page.removeAllListeners('console');
    page.removeAllListeners('pageerror');
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push(String(e)));

    const resp = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
    if (!resp || resp.status() >= 400) issues.push(`HTTP ${resp && resp.status()}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);

    const data = await page.evaluate(() => {
      const out = { overflow: [], headings: [], noAlt: [], smallTaps: [], links: [], text: [], words: 0, imgBytes: 0 };
      const docW = document.documentElement.clientWidth;

      document.querySelectorAll('body *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && (r.right > docW + 2 || r.left < -2)) {
          const sel = el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
          out.overflow.push(`${sel} → ${Math.round(r.left)}..${Math.round(r.right)} (vw ${docW})`);
        }
      });

      document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((h) =>
        out.headings.push(Number(h.tagName[1])));

      document.querySelectorAll('img').forEach((im) => {
        if (!im.hasAttribute('alt')) out.noAlt.push(im.getAttribute('src') || '(no src)');
      });

      document.querySelectorAll('a,button').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        if (r.height < 24 || r.width < 24) {
          out.smallTaps.push(`${el.tagName.toLowerCase()} "${(el.textContent || '').trim().slice(0, 24)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
        const href = el.getAttribute('href');
        if (href) out.links.push(href);
        if (!(el.textContent || '').trim() && !el.getAttribute('aria-label') && !el.querySelector('.sr-only')) {
          out.smallTaps.push(`${el.tagName.toLowerCase()} has no accessible name`);
        }
      });

      // sample visible text nodes for contrast
      const seen = new Set();
      document.querySelectorAll('p,li,span,a,h1,h2,h3,dt,dd,figcaption').forEach((el) => {
        if (!el.textContent.trim()) return;
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4 || r.top > 4000) return;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.opacity === '0') return;
        let bg = 'rgba(0, 0, 0, 0)', n = el;
        while (n && bg === 'rgba(0, 0, 0, 0)') { bg = getComputedStyle(n).backgroundColor; n = n.parentElement; }
        const key = cs.color + '|' + bg + '|' + cs.fontSize + '|' + cs.fontWeight;
        if (seen.has(key)) return;
        seen.add(key);
        out.text.push({ color: cs.color, bg, size: parseFloat(cs.fontSize), weight: cs.fontWeight, sample: el.textContent.trim().slice(0, 34) });
      });

      const main = document.querySelector('main');
      out.words = main ? main.innerText.trim().split(/\s+/).filter(Boolean).length : 0;
      return out;
    });

    // heading order
    let prev = 0;
    data.headings.forEach((h) => { if (prev && h > prev + 1) issues.push(`heading jump h${prev}→h${h}`); prev = h; });
    if (data.headings[0] !== 1) issues.push(`first heading is h${data.headings[0]} not h1`);
    if (data.headings.filter((h) => h === 1).length !== 1) issues.push(`${data.headings.filter((h) => h === 1).length} h1 elements`);

    const parse = (s) => (s.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);
    for (const t of data.text) {
      const fg = parse(t.color), bg = parse(t.bg);
      if (fg.length < 3 || bg.length < 3) continue;
      const r = ratio(fg, bg);
      const large = t.size >= 24 || (t.size >= 18.66 && Number(t.weight) >= 700);
      const need = large ? 3 : 4.5;
      if (r < need) issues.push(`contrast ${r.toFixed(2)}:1 (needs ${need}) — ${t.size}px "${t.sample}"`);
    }

    if (data.overflow.length) issues.push(`horizontal overflow: ${data.overflow.slice(0, 4).join(' | ')}`);
    if (data.noAlt.length) issues.push(`img without alt: ${data.noAlt.join(', ')}`);
    if (view.mobile && data.smallTaps.length) issues.push(`small/unnamed targets: ${[...new Set(data.smallTaps)].slice(0, 5).join(' | ')}`);
    if (consoleErrors.length) issues.push(`console: ${[...new Set(consoleErrors)].slice(0, 3).join(' | ')}`);

    report.push({ view: view.tag, route, words: data.words, issues, links: [...new Set(data.links)] });
  }
  await ctx.close();
}

// dead internal links
const allLinks = [...new Set(report.flatMap((r) => r.links))].filter((h) => h.startsWith('/'));
const page = await (await b.newContext()).newPage();
const dead = [];
for (const href of allLinks) {
  const u = base + href.split('#')[0];
  const r = await page.goto(u, { waitUntil: 'commit', timeout: 20000 }).catch(() => null);
  if (!r || r.status() >= 400) dead.push(`${href} → ${r ? r.status() : 'error'}`);
}
await b.close();

if (asJson) { console.log(JSON.stringify({ report, dead }, null, 2)); }
else {
  let bad = 0;
  for (const r of report) {
    if (!r.issues.length) continue;
    bad += r.issues.length;
    console.log(`\n${r.view} ${r.route}  (${r.words} words in main)`);
    r.issues.forEach((i) => console.log('  · ' + i));
  }
  const home = report.find((r) => r.view === 'desktop' && r.route === '/');
  console.log(`\nhomepage words in <main>: ${home ? home.words : '?'}  (brief allows 80–120 body words; nav/footer excluded, display headlines counted here so expect a higher number — read it as a trend)`);
  if (dead.length) console.log('\ndead links:\n  ' + dead.join('\n  '));
  console.log(`\n${bad} issue(s) across ${report.length} page-views.`);
}
