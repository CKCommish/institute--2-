/* Objective checks the critics cannot eyeball. Run against a live dev server.
   usage: BASE=http://127.0.0.1:4460 node tools/audit.mjs [--json] */
import { launch } from './browser.mjs';
import { measureFrame, settleScroll } from './pixel-contrast.mjs';

const base = process.env.BASE || 'http://127.0.0.1:4399';
const ROUTES = ['/', '/pilots/', '/institute/', '/forum/', '/people/', '/partner/'];
const asJson = process.argv.includes('--json');

const srgb = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };

/* One contrast sample of everything on screen right now. Hoisted out of the
   per-page evaluate so the sweep below can run it at every scroll step. */
const SAMPLE_TEXT = () => {
  const out = [];
  /* Sample visible text for contrast. THIS RUNS ONCE PER SCROLL STEP,
     not once per page — see the sweep below. `seen` therefore lives on
     window, so a rung already measured is not measured again. */
  const seen = (window.__auditSeen = window.__auditSeen || new Set());
  document.querySelectorAll('p,li,span,a,h1,h2,h3,dt,dd,figcaption').forEach((el) => {
    if (!el.textContent.trim()) return;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.opacity === '0') return;
    /* self-only was not enough: a rung inside a faded or hidden ancestor
       is not on screen, and measuring it invents failures */
    let a = el.parentElement, dead = false;
    while (a && a !== document.body) {
      const ac = getComputedStyle(a);
      if (ac.visibility === 'hidden' || parseFloat(ac.opacity) === 0) { dead = true; break; }
      a = a.parentElement;
    }
    if (dead) return;
    /* CHROME AND ANYTHING ELSE THAT FLOATS IS NOT THIS METER'S BUSINESS.
       This check walks the DOM for a background colour, which is only the
       truth when the type and its ground scroll together. A fixed bar or a
       sticky stage passes over whatever happens to be under it — cream one
       moment, a lit photograph the next — so the DOM answer is a guess.
       Sweeping the page (below) put the fixed nav over every cream section
       on the site and produced 20-odd "1.00:1 Lion Forum" reports for type
       that is in fact legible everywhere. Those surfaces are measured in
       PIXELS by tools/photo-meter.mjs and tools/credit-sweep.mjs, which is
       the right instrument for them; silence here is a deferral, not a pass. */
    let f = el, floats = false;
    while (f && f !== document.body) {
      const pos = getComputedStyle(f).position;
      if (pos === 'fixed' || pos === 'sticky') { floats = true; break; }
      f = f.parentElement;
    }
    if (floats) return;
    /* THE DOM WALK IS ONLY HONEST WHEN THE GROUND IS AN OPAQUE COLOUR.
       Wave 9 built the case and this meter failed it twice over. A
       rgba(255,255,255,0.35) panel carrying 13px #f2f2f2 over the /institute/
       hero photograph measures 3.03:1 in real pixels; audit reported 0 issues.
       Give the same panel a darker text colour and audit DID fire — at 3.95:1
       where the pixels are ~2.1:1 — because this loop composites a translucent
       panel over its DOM ANCESTOR rather than over the photograph showing
       through it. A meter that reports a number nobody can see is worse than
       one that reports nothing: it is a second false witness, and the project
       had been treating it as the backstop for the pixel meters.

       So the walk now stops at the first thing it cannot vouch for — a
       translucent background, a background-image, or a gradient — and hands
       that rung to the pixel pass below instead of guessing at it. */
    let bg = 'rgba(0, 0, 0, 0)', n = el, unreliable = false;
    while (n && n !== null) {
      const ncs = getComputedStyle(n);
      if (ncs.backgroundImage && ncs.backgroundImage !== 'none') { unreliable = true; break; }
      const b = ncs.backgroundColor;
      const m = b.match(/rgba?\(([^)]+)\)/);
      if (m) {
        const parts = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
        const alpha = parts.length > 3 ? parts[3] : 1;
        if (alpha >= 1) { bg = b; break; }
        if (alpha > 0) { unreliable = true; break; }
      }
      n = n.parentElement;
    }
    if (unreliable || bg === 'rgba(0, 0, 0, 0)') {
      /* keyed exactly as pixel-contrast.mjs keys its rows, so the two can be
         joined without guessing which rung is which */
      const tag = el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : '');
      (window.__auditPx = window.__auditPx || new Set())
        .add(tag + '|' + el.textContent.replace(/\s+/g, ' ').trim().slice(0, 34) + '|' + Math.round(parseFloat(cs.fontSize)));
      return;
    }
    const key = cs.color + '|' + bg + '|' + cs.fontSize + '|' + cs.fontWeight;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ color: cs.color, bg, size: parseFloat(cs.fontSize), weight: cs.fontWeight, sample: el.textContent.trim().slice(0, 34) });
  });
  return out;
};

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

      /* An element wider than the viewport only causes a horizontal scrollbar
         if nothing between it and <html> clips. Full-bleed media deliberately
         overhangs inside an overflow:hidden parallax plate, so checking the
         box alone reported every figure on the site as broken layout. */
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

      out.docScrollsX = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
      const main = document.querySelector('main');
      out.words = main ? main.innerText.trim().split(/\s+/).filter(Boolean).length : 0;
      return out;
    });

    /* THE PAGE IS TALLER THAN ONE SCREEN, AND HALF ITS TYPE IS NOT DRAWN YET.
       The pass above ran at scrollY 0 and used to carry `r.top > 4000` as a
       cutoff, which on a 7,572px homepage meant the bottom 47% of the page was
       never contrast-checked at all. Worse, every `data-reveal` rung on the
       site sits at opacity 0 until it is scrolled into view, and the opacity
       guard three lines up skips exactly those — so the reveal system hid the
       whole site's below-fold type from its own contrast meter. Proved with
       two probes appended to the built homepage, one plain at y 6941 and one
       behind `data-reveal`, both at 2.2:1 on their own opaque ground: audit
       reported 0 issues across 12 page-views with both of them on the page.

       So the sampler is swept down the document and the results merged. It is
       cheap — the dedupe key means a repeated rung costs one getComputedStyle
       and nothing else. */
    /* base.css sets scroll-behavior:smooth, so window.scrollTo starts an
       ANIMATION. This sweep used to scroll and wait a flat 320ms, which meant
       element rects were read at one offset and — for the pixel pass — the
       screenshot taken at another. settleScroll waits for scrollY to stop. */
    const pxWorst = new Map();
    const step = async () => {
      data.text.push(...await page.evaluate(SAMPLE_TEXT));
      const flagged = await page.evaluate(() => [...(window.__auditPx || [])]);
      if (!flagged.length) return;
      const want = new Set(flagged);
      for (const r of await measureFrame(page, view.vp)) {
        const k = `${r.tag}|${r.sample}|${r.size}`;
        if (!want.has(k)) continue;
        const prev = pxWorst.get(k);
        if (!prev || r.ratio < prev.ratio) pxWorst.set(k, r);
      }
    };
    data.text = [];
    await settleScroll(page, 0);
    await step();
    for (let i = 1; i < 60; i++) {
      const done = await settleScroll(page, Math.round(view.vp.height * 0.8 * i));
      await page.waitForTimeout(220);
      await step();
      if (done) break;
    }
    await settleScroll(page, 0);

    // heading order
    let prev = 0;
    data.headings.forEach((h) => { if (prev && h > prev + 1) issues.push(`heading jump h${prev}→h${h}`); prev = h; });
    if (data.headings[0] !== 1) issues.push(`first heading is h${data.headings[0]} not h1`);
    if (data.headings.filter((h) => h === 1).length !== 1) issues.push(`${data.headings.filter((h) => h === 1).length} h1 elements`);

    /* Chrome reports computed colours as rgb()/rgba() OR color(srgb r g b / a),
       where the srgb form is 0-1 floats. Parsing digits blindly turned
       `color(srgb 0.95 0.93 0.89)` into [0,0.95,0.93] and reported 1.07:1 for
       every element on the page. Parse both forms, then composite the text
       colour's alpha over its background before measuring. */
    const parseColor = (s) => {
      if (!s) return null;
      const srgb = s.match(/color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?/i);
      if (srgb) return [ +srgb[1] * 255, +srgb[2] * 255, +srgb[3] * 255, srgb[4] === undefined ? 1 : +srgb[4] ];
      const rgb = s.match(/rgba?\(([^)]+)\)/i);
      if (rgb) {
        const n = rgb[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
        if (n.length < 3 || n.some(Number.isNaN)) return null;
        return [ n[0], n[1], n[2], n[3] === undefined ? 1 : n[3] ];
      }
      return null;
    };
    const over = (fg, bg) => [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3]));

    for (const t of data.text) {
      const fgc = parseColor(t.color), bgc = parseColor(t.bg);
      if (!fgc || !bgc) continue;
      const bg = bgc[3] < 1 ? over(bgc, [5, 13, 22, 1]) : bgc.slice(0, 3);
      const fg = fgc[3] < 1 ? over(fgc, bg.concat(1)) : fgc.slice(0, 3);
      const r = ratio(fg, bg);
      const large = t.size >= 24 || (t.size >= 18.66 && Number(t.weight) >= 700);
      const need = large ? 3 : 4.5;
      if (r < need) issues.push(`contrast ${r.toFixed(2)}:1 (needs ${need}) — ${t.size}px "${t.sample}"`);
    }

    /* the rungs the DOM could not vouch for, measured in pixels */
    for (const r of pxWorst.values()) {
      if (!r.ok) issues.push(`contrast ${r.ratio}:1 (needs ${r.need}) [pixels] — ${r.size}px ${r.tag} "${r.sample}" · backdrop L* ${r.backdropL}`);
    }

    if (data.docScrollsX) issues.push(`document scrolls horizontally (scrollWidth > clientWidth)`);
    if (data.overflow.length) issues.push(`unclipped overflow: ${data.overflow.slice(0, 4).join(' | ')}`);
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
