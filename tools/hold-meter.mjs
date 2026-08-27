/* hold-meter — photo-meter, swept.

   WHY IT EXISTS. tools/photo-meter.mjs measures type over photography at ONE
   scroll position per figure: it scrolls the figure to the middle of the
   viewport and reads the pixels. For every other figure on this site that is
   the whole truth, because the picture and the type do not move relative to
   each other. For a held scene it is close to useless — the ground under the
   type runs from L* 4 to L* 60 and back across two and a half viewport
   heights, and the beats fade through it on the way. Measured on the first
   build of HeldScene, photo-meter reported 0 failures at its single sample
   and this reported 19 across seventeen, including a location credit sitting
   at 1.75 : 1 for the entire middle of the hold.

   So: at N scroll positions across a [data-hold] track's pinned range, every
   text run whose EFFECTIVE opacity (its own, times every ancestor's) is above
   the readable threshold is measured against the brightest row-band of the
   picture behind it, exactly the way photo-meter does it. Anything fainter
   than the threshold is treated as mid-transition and skipped — raise it to
   0.01 to see what a crossfade costs at its worst.

   usage: BASE=http://127.0.0.1:4399 node tools/hold-meter.mjs /route [desktop|mobile] [samples] [minOpacity] */
import { launch } from './browser.mjs';
import sharp from 'sharp';

const base = process.env.BASE || 'http://127.0.0.1:4399';
const route = process.argv.slice(2).find((a) => a.startsWith('/')) || '/';
const tag = process.argv.includes('mobile') ? 'mobile' : 'desktop';
const nums = process.argv.slice(2).filter((a) => /^[\d.]+$/.test(a)).map(Number);
const N = nums[0] || 16;
const MIN_OP = nums[1] === undefined ? 0.5 : nums[1];
const vp = tag === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 900 };

const TEXT_SEL = 'h1,h2,h3,h4,h5,h6,p,li,a,span,dt,dd,figcaption,time,strong,em,button,label,blockquote,td,th';

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const Y = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const Lstar = (y) => (y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y);
const contrast = (a, b) => { const [x, y] = a > b ? [a, b] : [b, a]; return (x + 0.05) / (y + 0.05); };
const parseColor = (s) => {
  const m1 = s.match(/color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?/i);
  if (m1) return [+m1[1] * 255, +m1[2] * 255, +m1[3] * 255, m1[4] === undefined ? 1 : +m1[4]];
  const m2 = s.match(/rgba?\(([^)]+)\)/i);
  if (m2) { const n = m2[1].split(/[\s,\/]+/).filter(Boolean).map(Number); return [n[0], n[1], n[2], n[3] ?? 1]; }
  return null;
};
/* Type is read line by line, so one blown highlight matters less than a
   bright BAND: average each pixel row under the glyphs, take the worst row. */
const brightestBand = (raw, W, r) => {
  let best = 0;
  for (let j = r.y; j < r.y + r.h; j++) {
    let s = 0;
    for (let i = r.x; i < r.x + r.w; i++) { const o = (j * W + i) * 3; s += Y(raw[o], raw[o + 1], raw[o + 2]); }
    best = Math.max(best, s / r.w);
  }
  return best;
};

const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: tag === 'mobile', hasTouch: tag === 'mobile' });
const page = await ctx.newPage();
await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
await page.evaluate(() => document.fonts.ready);
/* every lazy <img> has to have been in view once or the sweep measures plates */
await page.evaluate(async () => {
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < h; y += innerHeight * 0.9) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1200);

const track = await page.evaluate(() => {
  const t = document.querySelector('[data-hold]');
  if (!t) return null;
  const s = t.querySelector('[data-hold-stage]');
  return { top: t.offsetTop, h: t.offsetHeight, sh: s ? s.offsetHeight : innerHeight };
});
if (!track) { console.log(`no [data-hold] scene on ${route}`); await b.close(); process.exit(0); }

let fails = 0, rows = 0;
for (let k = 0; k <= N; k++) {
  const y = Math.round(track.top + (track.h - track.sh) * (k / N));
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(280);

  const [hp, geo] = await page.evaluate(([minOp, SEL]) => {
    const vw = innerWidth, vh = innerHeight;
    const clip = (r) => {
      const x = Math.max(0, Math.floor(r.left)), y = Math.max(0, Math.floor(r.top));
      const x2 = Math.min(vw, Math.ceil(r.right)), y2 = Math.min(vh, Math.ceil(r.bottom));
      return x2 - x < 4 || y2 - y < 4 ? null : { x, y, w: x2 - x, h: y2 - y };
    };
    const held = document.querySelector('[data-hold]');
    const out = [];
    held.querySelectorAll(SEL).forEach((el) => {
      const t = (el.textContent || '').trim();
      if (!t || el.querySelector('p,li,h1,h2,h3')) return;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden') return;
      let eff = parseFloat(cs.opacity), n = el.parentElement;
      while (n && n !== document.body) { eff *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement; }
      if (!(eff >= minOp)) return;
      /* a <p> is as wide as its column, not as wide as its words */
      const rng = document.createRange(); rng.selectNodeContents(el);
      const runs = [...rng.getClientRects()].filter((q) => q.width > 4 && q.height > 4).map(clip).filter(Boolean);
      rng.detach?.();
      if (!runs.length) return;
      out.push({ runs, color: cs.color, size: parseFloat(cs.fontSize), weight: cs.fontWeight, eff, sample: t.slice(0, 30) });
    });
    return [getComputedStyle(held).getPropertyValue('--hp').trim() || '—', out];
  }, [MIN_OP, TEXT_SEL]);

  if (!geo.length) { console.log(`hp ${hp}   (nothing live)`); continue; }
  /* HIDE THE GLYPHS — NOT THE SCENE, AND NOT THE WASH.

     Two bugs lived in this one step. The first: it hid `[data-hold] *`, so
     the <img>, the grade stack, the ink band and the cap all went with the
     type and the re-shot "backdrop" was flat page ground (L* 3.4) at every
     sample. Every ratio it printed was cream-on-navy and its 0 failures
     meant nothing.

     The second is the one credit-sweep.mjs was bitten by, and hiding the
     elements at all — by `visibility` or by `display` — walks straight back
     into it: `.fig__credit` carries its own painted wash as a ::before, and
     a hidden element's pseudo-elements are hidden with it. Remove the credit
     to see "the picture behind it" and you have removed the very protection
     you were measuring. The number comes back pessimistic, which is the
     safer direction but still wrong, and it hides the fact that the wash is
     load-bearing.

     So the glyphs are made transparent instead of the elements hidden:
     nothing moves, every painted layer — photograph, grade, cap, ink, foot,
     the credit's own wash — stays exactly where it was, and only the ink of
     the letterforms leaves. Foreground marks that are not type (the brass
     credit dot, the coda arrow) sit INSIDE the measured runs and would read
     as backdrop, so those are hidden: they are ink in front of the picture,
     not ground behind it. */
  await page.evaluate((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      if (!el.style || !el.dataset) return;   /* SVG-namespaced text tags */
      el.dataset.hmT = '1';
      el.style.setProperty('color', 'transparent', 'important');
      el.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
      el.style.setProperty('text-shadow', 'none', 'important');
      el.style.setProperty('text-decoration-color', 'transparent', 'important');
      el.querySelectorAll('*').forEach((m) => {
        if (!m.style || !m.dataset || (m.textContent || '').trim()) return;
        m.dataset.hmM = '1';
        m.style.setProperty('visibility', 'hidden', 'important');
      });
    });
  }, TEXT_SEL);
  await page.waitForTimeout(140);
  const shot = await page.screenshot();
  const raw = await sharp(shot).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  await page.evaluate(() => {
    document.querySelectorAll('[data-hm-t]').forEach((el) => {
      ['color', '-webkit-text-fill-color', 'text-shadow', 'text-decoration-color'].forEach((k) => el.style.removeProperty(k));
      delete el.dataset.hmT;
    });
    document.querySelectorAll('[data-hm-m]').forEach((m) => { m.style.removeProperty('visibility'); delete m.dataset.hmM; });
  });

  console.log(`hp ${hp}`);
  for (const t of geo) {
    const c = parseColor(t.color); if (!c) continue;
    const bandY = Math.max(...t.runs.map((r) => brightestBand(raw.data, raw.info.width, r)));
    const bandRGB = 255 * (bandY <= 0.0031308 ? bandY * 12.92 : 1.055 * bandY ** (1 / 2.4) - 0.055);
    const a = c[3] * t.eff;
    const fg = [0, 1, 2].map((k) => c[k] * a + bandRGB * (1 - a));
    const cr = contrast(Y(fg[0], fg[1], fg[2]), bandY);
    const large = t.size >= 24 || (t.size >= 18.66 && Number(t.weight) >= 700);
    const need = large ? 3 : 4.5;
    const ok = cr >= need; if (!ok) fails++; rows++;
    console.log(`   ${ok ? 'ok  ' : 'FAIL'} ${cr.toFixed(2).padStart(6)}:1 (needs ${need})  backdrop L* ${Lstar(bandY).toFixed(1).padStart(5)}  ${Math.round(t.size)}px  a ${t.eff.toFixed(2)}  "${t.sample}"`);
  }
}
console.log(`\n${route} ${tag}: ${fails} failure(s) in ${rows} measurements across ${N + 1} scroll positions (opacity ≥ ${MIN_OP}).`);
await b.close();
