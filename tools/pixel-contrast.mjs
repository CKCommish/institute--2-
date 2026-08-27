/* pixel-contrast — measure type against the PIXELS behind it, not the DOM.

   Every DOM-walking contrast check in this repo shares one blind spot: it
   asks an element's ancestors what colour the ground is. That answer is a
   guess the moment anything between the type and its ground is a photograph,
   a translucent panel, or a fixed bar passing over a scene it is not
   descended from. The wave-9 judge proved both halves of it on the real site:
   a rgba(255,255,255,0.35) panel over the /institute/ hero measured 3.03:1 in
   pixels while audit reported nothing, and with a darker text colour audit
   fired at 3.95:1 where the pixels were ~2.1:1 — compositing the panel over
   its DOM ancestor rather than over the photograph.

   The only instrument that cannot be fooled that way is a screenshot. This
   module is the shared engine: snapshot the page, hide every text node,
   snapshot again, and read the ground each run of glyphs actually sits on.

   Worst case is measured BOTH ways — the brightest row-band and the darkest
   row-band under the glyphs — because light type fails on the bright band and
   dark type fails on the dark one, and the meter cannot know in advance which
   it is looking at. The lower of the two ratios is the number reported.  */
import sharp from 'sharp';

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
export const Y = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
export const Lstar = (y) => (y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y);
export const contrast = (y1, y2) => { const [a, b] = y1 > y2 ? [y1, y2] : [y2, y1]; return (a + 0.05) / (b + 0.05); };
const toRGB = (y) => 255 * (y <= 0.0031308 ? y * 12.92 : 1.055 * y ** (1 / 2.4) - 0.055);

export const parseColor = (s) => {
  if (!s) return null;
  const m1 = s.match(/color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?/i);
  if (m1) return [+m1[1] * 255, +m1[2] * 255, +m1[3] * 255, m1[4] === undefined ? 1 : +m1[4]];
  const m2 = s.match(/rgba?\(([^)]+)\)/i);
  if (m2) {
    const n = m2[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
    if (n.length < 3 || n.slice(0, 3).some(Number.isNaN)) return null;
    return [n[0], n[1], n[2], n[3] === undefined ? 1 : n[3]];
  }
  return null;
};

/* brightest and darkest row-band of a rect. Type is read line by line, so one
   blown pixel matters less than a whole bright ROW. */
export function bands(raw, W, rect) {
  const { x, y, w, h } = rect;
  let hi = 0, lo = 1;
  for (let j = y; j < y + h; j++) {
    let s = 0;
    for (let i = x; i < x + w; i++) { const o = (j * W + i) * 3; s += Y(raw[o], raw[o + 1], raw[o + 2]); }
    const m = s / w;
    if (m > hi) hi = m;
    if (m < lo) lo = m;
  }
  return { hi, lo };
}

export const TEXT_SEL = 'h1,h2,h3,h4,h5,h6,p,li,span,a,dt,dd,figcaption,strong,em,time,button,label,blockquote';

/* Runs in the page. Returns one row per run of inked glyphs currently on
   screen, with the clipped viewport rects the node's text actually occupies. */
export const COLLECT = (sel) => {
  const vw = innerWidth, vh = innerHeight;
  const clip = (r) => {
    const x = Math.max(0, Math.floor(r.left)), y = Math.max(0, Math.floor(r.top));
    const x2 = Math.min(vw, Math.ceil(r.right)), y2 = Math.min(vh, Math.ceil(r.bottom));
    return x2 - x < 3 || y2 - y < 3 ? null : { x, y, w: x2 - x, h: y2 - y };
  };
  /* WHAT THE FIXED BAR COVERS IS NOT WHAT THE READER READS.
     Page type slides UNDER the fixed nav on the way past it. At that moment
     the pixels above the rung are the bar's own opaque scrim, so a pixel meter
     that trusts geometry alone reports ink-on-ink 1.00:1 for a roster entry
     that is simply hidden behind the bar — a failure no reader can meet.
     elementFromPoint cannot answer this: the bar is pointer-events:none by
     design, so hit-testing passes straight through it. So the occluders are
     taken geometrically, and each run of glyphs is trimmed to the part of it
     that is not underneath one. Chrome measures ITSELF against what is behind
     it, so it is never trimmed by its own bar. */
  const occ = [];
  document.querySelectorAll('body *').forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed' && cs.position !== 'sticky') return;
    if (cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return;
    const r = el.getBoundingClientRect();
    if (r.width < 40 || r.height < 8) return;
    if (el.closest('[data-nav],header,nav') !== el && !el.matches('[data-nav],header,nav')) return;
    occ.push({ top: r.top, bottom: r.bottom, left: r.left, right: r.right });
  });
  const trim = (q) => {
    let { x, y, w, h } = q;
    for (const o of occ) {
      if (o.right <= x || o.left >= x + w) continue;
      if (o.top <= y && o.bottom > y) { const d = Math.ceil(o.bottom) - y; y += d; h -= d; }
      else if (o.top < y + h && o.bottom >= y + h) { h = Math.floor(o.top) - y; }
      if (h < 3) return null;
    }
    return h < 3 || w < 3 ? null : { x, y, w, h };
  };
  /* MEASURE TEXT NODES, NOT ELEMENTS.
     Walking elements counts the same string several times (an <li>, the
     <span> inside it, the <span> inside that) and — worse — a container's
     line boxes include its inline CHILDREN. On /people/ the roster <li> wraps
     a portrait and a name, so the <li>'s own range rects swept the headshot
     and reported the photograph as the name's ground: 1.8–4.0:1 for type that
     is in fact ink on cream at 4.5:1 and better. A text node owns exactly the
     glyphs it draws and nothing else, so that is the unit. */
  const rows = [];
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let t = walk.nextNode(); t; t = walk.nextNode()) {
    const s = (t.nodeValue || '').replace(/\s+/g, ' ').trim();
    if (!s) continue;
    const el = t.parentElement;
    if (!el || /^(script|style|noscript|title)$/i.test(el.tagName)) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) continue;
    let a = el.parentElement, dead = false;
    while (a && a !== document.documentElement) {
      const ac = getComputedStyle(a);
      if (ac.visibility === 'hidden' || parseFloat(ac.opacity) === 0) { dead = true; break; }
      a = a.parentElement;
    }
    if (dead) continue;
    const rng = document.createRange();
    rng.selectNodeContents(t);
    const runs = [...rng.getClientRects()].filter((q) => q.width > 3 && q.height > 3).map(clip).filter(Boolean);
    rng.detach?.();
    if (!runs.length) continue;
    let f = el, floats = false;
    while (f && f !== document.body) { const p = getComputedStyle(f).position; if (p === 'fixed' || p === 'sticky') { floats = true; break; } f = f.parentElement; }
    const kept = floats ? runs : runs.map(trim).filter(Boolean);
    if (!kept.length) continue;
    rows.push({
      runs: kept, color: cs.color, size: parseFloat(cs.fontSize), weight: cs.fontWeight,
      floats, sample: s.slice(0, 34),
      tag: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : ''),
    });
  }
  return rows;
};

/* One measurement at the page's current scroll position.
   Returns rows: { sample, tag, size, ratio, need, ok, backdropL, floats } */
export async function measureFrame(page, vp) {
  const rows = await page.evaluate(COLLECT, TEXT_SEL);
  if (!rows.length) return [];
  const clipBox = { x: 0, y: 0, width: vp.width, height: vp.height };
  /* HOW THE GLYPHS ARE TAKEN OFF THE PAGE MATTERS.
     The obvious move — visibility:hidden on the text elements — also removes
     each element's own BACKGROUND, and on this site the panels that give type
     its ground are frequently the same elements that carry the type. Hiding
     them read the ground underneath the panel instead: it turned ink-on-cream
     roster entries on /people/ into a reported 1.00:1 against the navy plate
     two layers down. Paint the glyphs transparent instead — backgrounds,
     borders, layout and every ancestor's ground stay exactly where they were,
     and only the ink goes. */
  await page.evaluate(() => {
    const st = document.createElement('style');
    st.id = '__pxc_mask';
    st.textContent = '*, *::before, *::after { color: transparent !important;' +
      ' -webkit-text-fill-color: transparent !important; text-shadow: none !important;' +
      ' text-decoration-color: transparent !important; caret-color: transparent !important; }';
    document.head.appendChild(st);
  });
  await page.waitForTimeout(90);
  const shotB = await page.screenshot({ clip: clipBox });
  await page.evaluate(() => document.getElementById('__pxc_mask')?.remove());
  const B = await sharp(shotB).removeAlpha().raw().toBuffer({ resolveWithObject: true });

  const out = [];
  for (const r of rows) {
    const c = parseColor(r.color);
    if (!c) continue;
    const bs = r.runs.map((q) => bands(B.data, B.info.width, q));
    const hi = Math.max(...bs.map((b) => b.hi));
    const lo = Math.min(...bs.map((b) => b.lo));
    let worst = Infinity, worstY = hi;
    for (const gy of [hi, lo]) {
      const g = toRGB(gy);
      const fg = [0, 1, 2].map((k) => c[k] * c[3] + g * (1 - c[3]));
      const cr = contrast(Y(fg[0], fg[1], fg[2]), gy);
      if (cr < worst) { worst = cr; worstY = gy; }
    }
    const large = r.size >= 24 || (r.size >= 18.66 && Number(r.weight) >= 700);
    const need = large ? 3 : 4.5;
    out.push({
      sample: r.sample, tag: r.tag, size: Math.round(r.size), floats: r.floats,
      ratio: +worst.toFixed(2), need, ok: worst >= need, backdropL: +Lstar(worstY).toFixed(1),
    });
  }
  return out;
}

/* SCROLLING IS NOT INSTANT, AND THAT IS ITS OWN BLIND SPOT.
   base.css sets `html { scroll-behavior: smooth }`, so window.scrollTo(0, y)
   starts an ANIMATION. A meter that scrolls and then waits a fixed number of
   milliseconds is reading element rects at one offset and screenshotting at
   another — this produced 3.41:1 for a rung whose true value is 7.20:1 while
   the sweep was still gliding. Scroll with behavior:'instant' AND wait until
   scrollY has actually stopped moving before measuring anything. */
export async function settleScroll(page, y) {
  const done = await page.evaluate((yy) => {
    window.scrollTo({ top: yy, left: 0, behavior: 'instant' });
    return yy >= document.documentElement.scrollHeight - innerHeight;
  }, y);
  let last = null;
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(60);
    const now = await page.evaluate(() => Math.round(window.scrollY));
    if (now === last) break;
    last = now;
  }
  return done;
}

/* Sweep the whole document and merge. Keeps the WORST measurement seen for
   each distinct rung — a fixed bar or a parallax plate makes the same string
   pass at one scroll offset and fail at another, and the failing offset is
   the one a reader meets. */
export async function sweepContrast(page, vp, { step = 0.8, settle = 220, max = 60 } = {}) {
  const worst = new Map();
  const take = (rows) => {
    for (const r of rows) {
      const k = `${r.tag}|${r.sample}|${r.size}`;
      const prev = worst.get(k);
      if (!prev || r.ratio < prev.ratio) worst.set(k, r);
    }
  };
  await settleScroll(page, 0);
  await page.waitForTimeout(settle);
  take(await measureFrame(page, vp));
  for (let i = 1; i < max; i++) {
    const done = await settleScroll(page, Math.round(vp.height * step * i));
    await page.waitForTimeout(settle);
    take(await measureFrame(page, vp));
    if (done) break;
  }
  await settleScroll(page, 0);
  return [...worst.values()];
}
