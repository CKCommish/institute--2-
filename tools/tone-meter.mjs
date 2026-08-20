/* tone-meter — the tonal spine of a scroll.

   audit.mjs reads contrast, photo-meter.mjs reads type over photography.
   Neither can answer the question a critic actually asked of this site:
   "does the ground ever change?" Measured on the wave-3 homepage, the answer
   was no — 79% of the page sat inside a 5.7-point L* band, which is below the
   value at which an eye registers a change of ground at all.

   This walks the page the way a reader does — one viewport at a time, real
   scroll positions, so sticky and fixed layers are photographed where they
   are actually seen — and reports, per 20px row:

     · the mean CIE L* of the GUTTER (a column just inside each page edge,
       which is the ground behind the content, or the photograph that has
       replaced it)
     · the runs: consecutive rows that stay inside a ±BAND window
     · the share of the scroll spent in the single dominant band

   A page passes when no band holds more than ~55% of the scroll and there
   are at least three runs longer than a third of a viewport. Those are not
   laws of nature; they are the smallest numbers at which the four grounds in
   tokens.css are doing any work.

   usage: BASE=http://127.0.0.1:4399 node tools/tone-meter.mjs [/route,...] [--mobile] [--json] */
import { launch } from './browser.mjs';
import sharp from 'sharp';

const base = process.env.BASE || 'http://127.0.0.1:4399';
const routes = (process.argv.slice(2).find((a) => a.startsWith('/')) || process.env.ROUTES || '/').split(',');
const mobile = process.argv.includes('--mobile');
const asJson = process.argv.includes('--json');
const vp = mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const STEP = 20;      // sample every 20px of scroll
const BAND = 6;       // L* window that counts as "the same ground"

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const Y = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const Lstar = (y) => (y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y);

const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
const page = await ctx.newPage();
const report = [];

for (const route of routes) {
  await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  /* every photograph on the page has to have been in view once or its lazy
     <img> never fetched and the tonal profile is of the fallback plates */
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += innerHeight * 0.9) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1400);

  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const rows = [];
  const gw = Math.round(vp.width * 0.055);          // gutter column width
  for (let y = 0; y + vp.height <= H + vp.height; y += vp.height) {
    const top = Math.min(y, Math.max(0, H - vp.height));
    await page.evaluate((t) => window.scrollTo(0, t), top);
    await page.waitForTimeout(420);
    const shot = await page.screenshot({ clip: { x: 0, y: 0, width: vp.width, height: vp.height } });
    const raw = await sharp(shot).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const W = raw.info.width;
    for (let j = 0; j < vp.height; j += STEP) {
      const doc = top + j;
      if (rows.length && doc <= rows[rows.length - 1].y) continue;
      let s = 0, n = 0;
      for (const x0 of [4, W - gw - 4]) {
        for (let i = x0; i < x0 + gw; i++) {
          const o = (j * W + i) * 3;
          s += Y(raw.data[o], raw.data[o + 1], raw.data[o + 2]); n++;
        }
      }
      rows.push({ y: doc, L: +Lstar(s / n).toFixed(1) });
    }
    if (top >= H - vp.height) break;
  }

  /* A three-sample median first: one row of a hairline rule or a credit is
     not a change of ground, and unsmoothed it fragments the profile into
     forty runs nobody can read. */
  const med = rows.map((r, i) => {
    const w = [rows[i - 1], r, rows[i + 1]].filter(Boolean).map((q) => q.L).sort((a, b) => a - b);
    return { y: r.y, L: w[(w.length - 1) >> 1] };
  });

  /* runs: a new run starts when L* leaves the current run's ±BAND window */
  let runs = [];
  for (const r of med) {
    const cur = runs[runs.length - 1];
    if (cur && Math.abs(r.L - cur.mid) <= BAND) {
      cur.rows.push(r.L); cur.to = r.y;
      cur.mid = cur.rows.reduce((a, c) => a + c, 0) / cur.rows.length;
    } else runs.push({ from: r.y, to: r.y, mid: r.L, rows: [r.L] });
  }
  const total = rows.length * STEP || 1;
  for (const r of runs) { r.px = r.to - r.from + STEP; r.mid = +r.mid.toFixed(1); delete r.rows; }
  /* anything shorter than a tenth of a viewport is a transition, not a
     ground: fold it into whichever neighbour it is closer to in value. */
  const MIN = Math.round(vp.height / 10);
  for (let pass = 0; pass < 6; pass++) {
    const i = runs.findIndex((r, k) => r.px < MIN && runs.length > 1 && (k > 0 || runs.length > 1));
    if (i < 0) break;
    const prev = runs[i - 1], next = runs[i + 1];
    const host = !prev ? next : !next ? prev
      : (Math.abs(prev.mid - runs[i].mid) <= Math.abs(next.mid - runs[i].mid) ? prev : next);
    host.from = Math.min(host.from, runs[i].from);
    host.to = Math.max(host.to, runs[i].to);
    host.px = host.to - host.from + STEP;
    runs.splice(i, 1);
    pass = -1;
  }
  runs = runs.filter((r) => r.px >= MIN);
  for (const r of runs) r.share = r.px / total;
  const floor = med.filter((r) => r.L <= 12).length / (med.length || 1);
  const sorted = [...runs].sort((a, b) => b.px - a.px);
  const long = runs.filter((r) => r.px > vp.height / 3);
  report.push({ route, height: H, floor, span: [Math.min(...rows.map((r) => r.L)), Math.max(...rows.map((r) => r.L))], runs, dominant: sorted[0], events: long.length });
}
await b.close();

if (asJson) console.log(JSON.stringify(report, null, 2));
else for (const p of report) {
  console.log(`\n${p.route}  ${p.height}px  ${mobile ? '390' : '1440'}w   L* span ${p.span[0].toFixed(1)} → ${p.span[1].toFixed(1)}`);
  for (const r of p.runs) {
    const bar = '█'.repeat(Math.max(1, Math.round(r.share * 46)));
    console.log(`  ${String(r.from).padStart(5)}–${String(r.to).padStart(5)}  L* ${String(r.mid).padStart(5)}  ${String(Math.round(r.share * 100)).padStart(3)}%  ${bar}`);
  }
  console.log(`  → ${p.runs.length} grounds, ${p.events} longer than a third of a viewport; dominant band L* ${p.dominant.mid} holds ${Math.round(p.dominant.share * 100)}% of the scroll`);
  console.log(`  → ${Math.round(p.floor * 100)}% of the scroll is within 9 L* of the page ground (the navy floor)`);
}
