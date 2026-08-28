/* bundle-gate — does the single-file preview BEHAVE like the site?

   ── WHY THIS EXISTS ──────────────────────────────────────────────────────
   The client does not open dist/. They open `progress/site.html`, the
   self-contained bundle we forward them. It is the only artefact of this
   project a reader outside the repo has ever touched, and until this file it
   was the only one with no gate on it.

   What that cost: the client reported the site was "stuck — it doesn't
   scroll". It was. `tools/bundle.mjs` swept module scripts with a regex that
   matched only the attribute-less inline form, so it silently dropped the
   EXTERNAL `<script type="module" src="/_astro/….js">` — which is where
   motion.js lives. The bundle had shipped with no motion engine at all for
   as long as the bundler had existed. The failure was quiet: the inline
   script still ran, the nav still darkened on scroll, the page looked alive.
   But the homepage's held Forum scene pinned for 855px with `--hp` stuck at
   0 and nothing moving, and scrolling a full screen at a frozen picture is
   what a reader calls stuck. The client's second question — "why did none of
   the headshots get added?" — had the same cause: nobody stuck on a frozen
   homepage ever reaches /people/.

   Two throws were added to the bundler at the time (a missing /_astro/
   script, and a bundle with nothing defining the held-scene loop). Both are
   worth keeping and neither is a gate: they test the bytes the bundler
   gathered, not what the file does in a browser. A bundle can contain
   motion.js and still be dead — a stylesheet cascade that lands differently
   when six routes' CSS is concatenated into one document, a route whose
   IntersectionObserver never fired because it was hidden at load, a photo
   whose data: URI did not decode. Bytes are not behaviour.

   ── WHAT IT MEASURES ─────────────────────────────────────────────────────
   Two subjects, and they are different questions:

   FRESH   A bundle built here and now, from the same isolated build this
           run is serving, compared against that site AT MATCHED SCROLL
           OFFSETS. Every scalar the motion engine writes — `--hp`, `--open`,
           `--be`, `--bu`, `--py`, `--settle` — is read off the elements that
           carry it, on both sides, at the same absolute scrollY, and
           compared. This is the check that would have caught the dropped
           script on the day it landed: `--hp` 0.8833 on the site against
           0 in the bundle, at 4114px, on the homepage. Parity against the
           site is only meaningful for a bundle built from that same site,
           which is why FRESH is built rather than found.

   SHIPPED `progress/site.html` as committed — the file the client actually
           opens. It is NOT compared against the site: it legitimately lags
           the tree between refreshes, and a gate that goes red every time a
           builder touches a component is a gate nobody runs. It is checked
           for LIVENESS instead, which does not care what the copy says: does
           any scroll-driven scalar move as the page scrolls, do the routes
           switch, do the pictures decode, is any text left invisible.
           It is regenerated with `node tools/bundle.mjs` against the wave's
           final build — that is the step this gate exists to make visible,
           and a shipped bundle that fails here has usually just been left
           behind by a bundler fix.

   Both subjects also get the checks that have nothing to do with motion:
   route switching (all six), pictures decoded on each route after a full
   scroll (a lazy `<img>` inside a hidden route is a real way to ship a
   blank), text left at zero opacity (a reveal that never fired because its
   route was hidden at load), and the no-JS path, where the bundle's own
   `.js` class is the thing under test.

   ── PASS / FAIL / UNCHECKED ──────────────────────────────────────────────
   A route-view where the SITE carries no scroll-driven value has nothing to
   compare and is counted UNCHECKED, not passed — /partner/ and /people/ are
   quiet pages and a green from them would be a green from an empty compare.
   The verdict line prints that census, because a "0 finding(s)" whose
   denominator is unstated is the number the wave-18 judge misread.

   ── COST ─────────────────────────────────────────────────────────────────
   ~2 minutes: one bundle build (~7s of sharp), one page load per route-view
   on each side, and eight settled samples per route-view. Narrow it with
   --routes= / --views= while you work; run it whole before you report.

   usage: BASE=http://127.0.0.1:4399 OUTDIR=dist node tools/bundle-gate.mjs
          [--routes=/,/forum/] [--views=desktop] [--offsets=8] [--json]
          [--only=fresh|shipped] [--bundle=path.html   test this file as FRESH]
          [--keep]  leave the generated bundle on disk and print its path   */
import { launch } from './browser.mjs';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const has = (k) => process.argv.includes(`--${k}`);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BASE = process.env.BASE || 'http://127.0.0.1:4399';
/* The build directory BASE is serving. gates.mjs passes its own isolated
   one; by hand it is whatever you built and served. They must be the same
   build — a bundle folded out of one tree and compared against another
   would report every edit in between as a bundler defect. */
const OUTDIR = process.env.OUTDIR || 'dist';
const OFFSETS = Number(arg('offsets', '8'));
const ONLY = arg('only', '');
/* SHIPPED_FILE overrides the subject. It exists so the lag check can be
   proved: point it at an older copy of the bundle and the gate must say how
   far behind it is. A gate whose new clause has never been seen to fire is
   a gate that reports "current" for a reason nobody has checked. */
const SHIPPED = process.env.SHIPPED_FILE
  ? path.resolve(process.env.SHIPPED_FILE)
  : path.join(ROOT, 'progress/site.html');

const ROUTES = (arg('routes', '/,/institute/,/pilots/,/forum/,/people/,/partner/')).split(',');
const VIEWS = [
  { tag: 'desktop', vp: { width: 1440, height: 900 } },
  { tag: 'mobile', vp: { width: 390, height: 844 }, mobile: true },
].filter((v) => !arg('views', '') || arg('views', '').split(',').includes(v.tag));

const findings = [];
const notes = [];
const add = (subject, where, what) => findings.push({ subject, where, what });

/* ── the probe ───────────────────────────────────────────────────────────
   Read the motion engine's scalars off the ELEMENTS, from their inline
   style — motion.js writes them with setProperty and nothing else does — so
   a value that is present but never updated is distinguishable from a value
   that was never written at all. Keys are built from tag + first two
   classes + an occurrence index within the visible route, which survives the
   one structural difference between the two documents: the bundle wraps each
   route's <main> contents in a `.rt` div. `is-in` is dropped from the key
   because it is a state, not an identity. */
const VARS = ['--hp', '--open', '--be', '--bu', '--py', '--settle'];
const PROBE = `(() => {
  const VARS = ${JSON.stringify(VARS)};
  const root = document.querySelector('.rt:not([hidden])') || document.querySelector('main');
  const seen = {}, vars = {};
  if (root) for (const scope of [document.querySelector('header'), root]) {
    if (!scope) continue;
    for (const el of scope.querySelectorAll('*')) {
      if (!el.style || !el.style.length) continue;
      const vals = {};
      /* --py is written with a % unit; the rest are bare numbers. Keep the
         unit — it decides the tolerance, and a value that changed unit has
         changed meaning. */
      for (const v of VARS) { const s = el.style.getPropertyValue(v); if (s !== '') vals[v] = [parseFloat(s), s.replace(/^[-0-9.]+/, '')]; }
      if (!Object.keys(vals).length) continue;
      const cls = (el.getAttribute('class') || '').trim().split(/\\s+/).filter((c) => c && c !== 'is-in').slice(0, 2).join('.');
      const base = el.tagName.toLowerCase() + (cls ? '.' + cls : '');
      vars[base + '#' + (seen[base] = (seen[base] || 0) + 1)] = vals;
    }
  }
  return { vars, nav: !!document.querySelector('.nav.is-scrolled') };
})()`;

/* Both documents must be sampled STILL, and they do not stop the same way.
   base.css sets `scroll-behavior: smooth`; the bundle overrides it to auto
   so its client-side routing does not animate between routes. Sampling on a
   fixed timer therefore read the site mid-flight and the bundle settled, and
   reported a live site as frozen — the exact inverse of the defect this gate
   is for, which is a good reminder that a harness bias can point either way.
   So: jump instantly, then wait for scrollY to hold still for four frames. */
async function settleTo(page, y) {
  await page.evaluate(async (y) => {
    window.scrollTo({ top: y, behavior: 'instant' });
    let last = -1, same = 0;
    for (let i = 0; i < 120 && same < 4; i++) {
      await new Promise((r) => requestAnimationFrame(r));
      const v = Math.round(window.scrollY);
      if (v === last) same++; else { same = 0; last = v; }
    }
  }, y);
  await page.waitForTimeout(110);
}
const range = (page) => page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - window.innerHeight));
async function sweep(page, offs) {
  const out = [];
  for (const y of offs) { await settleTo(page, y); out.push(await page.evaluate(PROBE)); }
  return out;
}
/* How many scalars actually MOVE across the sweep. This is the census the
   verdict line quotes: a route-view whose site side is 0 here has nothing to
   compare, and its bundle side passing means nothing. */
const liveCount = (samples) => {
  const seen = new Map();
  for (const s of samples) for (const [k, vals] of Object.entries(s.vars))
    for (const [v, n] of Object.entries(vals)) {
      const key = k + v, prev = seen.get(key);
      seen.set(key, prev === undefined ? n[0] : (prev === n[0] ? n[0] : NaN));
    }
  return [...seen.values()].filter((v) => Number.isNaN(v)).length;
};

/* ── page-state checks, run on both subjects ─────────────────────────── */
const STATE = `(() => {
  const root = document.querySelector('.rt:not([hidden])') || document.querySelector('main');
  const imgs = [...root.querySelectorAll('img')];
  const dark = [];
  for (const el of root.querySelectorAll('h1,h2,h3,p,li,figcaption,span,a')) {
    const t = (el.textContent || '').trim();
    if (!t || el.children.length) continue;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    if (cs.visibility === 'hidden' || Number(cs.opacity) < 0.05) dark.push(t.slice(0, 40));
  }
  return {
    imgs: imgs.length,
    broken: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => (i.currentSrc || i.src || '').slice(0, 60)),
    pending: imgs.filter((i) => !i.complete).length,
    dark: dark.slice(0, 6), darkN: dark.length,
    h1: (root.querySelector('h1')?.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 60),
    /* The layout viewport against the visual one. They part company when the
       page overflows horizontally, and a mobile browser answers by zooming
       out — which is how a missing <meta name="viewport"> showed itself:
       innerWidth 980 in a 390px window, every clamp(…vw…) resolved against
       the wrong number, the whole route's type 40% too small. */
    vw: window.innerWidth, cw: document.documentElement.clientWidth,
    docH: document.documentElement.scrollHeight,
    foot: [...document.querySelectorAll('footer')]
      .filter((f) => f.getBoundingClientRect().height > 0)
      .map((f) => (f.textContent || '').replace(/\\s+/g, '')).join('|'),
    text: (root.textContent || '').replace(/\\s+/g, '').length,
    heads: root.querySelectorAll('h1,h2,h3').length,
  };
})()`;

/* A lazy <img> inside a route that was hidden at load is one of the ways
   this file can ship blank, and it only shows itself after the route has
   been scrolled through. Walk the whole page before reading image state. */
async function scrollThrough(page) {
  const r = await range(page);
  for (let i = 1; i <= 4; i++) await settleTo(page, Math.round((r * i) / 4));
  await page.waitForTimeout(300);
  await settleTo(page, 0);
}

/* ── build the FRESH bundle ──────────────────────────────────────────── */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bundle-gate-'));
const freshPath = arg('bundle', '') || path.join(tmp, 'fresh.html');
let freshOk = true;
if (!arg('bundle', '') && ONLY !== 'shipped') {
  const r = await new Promise((res) => {
    const ps = spawn('node', ['tools/bundle.mjs'], {
      cwd: ROOT, env: { ...process.env, BUNDLE_DIST: OUTDIR, BUNDLE_OUT: freshPath },
    });
    let out = ''; ps.stdout.on('data', (d) => { out += d; }); ps.stderr.on('data', (d) => { out += d; });
    ps.on('close', (code) => res({ code, out }));
  });
  if (r.code !== 0 || !fs.existsSync(freshPath)) {
    freshOk = false;
    add('fresh', 'tools/bundle.mjs', `bundler exited ${r.code} and produced no bundle — ${r.out.trim().split('\n').slice(-2).join(' / ').slice(0, 200)}`);
  } else notes.push(`fresh bundle ${(fs.statSync(freshPath).size / 1e6).toFixed(2)}MB from ${OUTDIR}`);
}

const b = await launch({ proxy: false });
const subjects = [];
if (ONLY !== 'shipped' && freshOk) subjects.push({ name: 'fresh', file: freshPath, compare: true });
if (ONLY !== 'fresh') {
  if (fs.existsSync(SHIPPED)) subjects.push({ name: 'shipped', file: SHIPPED, compare: false });
  else add('shipped', 'progress/site.html', 'the file the client opens is not in the tree');
}

let checked = 0, unchecked = 0, samples = 0;
const TOL = 0.05;
const TOL_PCT = 0.6;
/* The dark-text census of the SHIPPED bundle is read against the FRESH one
   built in this run: below-fold reveals legitimately sit at opacity 0 until
   they are entered, on the site as much as in the bundle, so an absolute
   count is not a defect signal — a count that has grown since the bundler's
   current output is. With --only=shipped there is no reference and the
   census is reported, not judged. */
const darkRef = new Map();

/* ── LAG: HOW FAR BEHIND THE SHIPPED BUNDLE IS ────────────────────────────
   The SHIPPED subject is checked for liveness and not parity, on purpose:
   `progress/site.html` legitimately trails the tree between refreshes, and a
   gate that reddens on every component edit is a gate nobody runs. But
   "deliberately lagging" and "silently, arbitrarily stale" are different
   states, and until now this gate could not tell them apart — its cache key
   did not even include the file, so the artefact the client opens sat one
   wave behind, green and cached, for a whole wave, and nothing in the suite
   would have told the next builder to regenerate it.
   So the lag is MEASURED and PRINTED, and it is not a finding. For each
   route-view the FRESH bundle — built from this run's build, so it is the
   bundler's current output by construction — leaves a fingerprint of what
   the page SAYS: character count, heading count, h1, footer, picture count.
   The shipped bundle is read against it. A difference is not a defect; it is
   a number of routes whose copy has moved since the file was last written,
   and it belongs in the one line every wave quotes. Zero means the file the
   client opens says what the site says today. */
const freshFp = new Map();
const lag = [];
const fpOf = (b) => ({ text: b.text, heads: b.heads, h1: b.h1.replace(/\s+/g, ''), foot: b.foot, imgs: b.imgs });

for (const view of VIEWS) {
  for (const s of subjects) {
    const ctx = await b.newContext({ viewport: view.vp, isMobile: !!view.mobile, hasTouch: !!view.mobile, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e).replace(/\s+/g, ' ').slice(0, 120)));
    const loaded = await page.goto('file://' + s.file, { waitUntil: 'load', timeout: 90000 }).catch((e) => { add(s.name, view.tag, `the bundle would not load: ${String(e).split('\n')[0].slice(0, 90)}`); return null; });
    if (!loaded) { await ctx.close(); continue; }
    await page.evaluate(() => document.fonts.ready).catch(() => {});
    await page.waitForTimeout(900);

    for (const route of ROUTES) {
      /* Route switching is the bundle's own invention — six static pages
         folded into one document — so it is checked by DOING it, through the
         same click a reader makes, not by calling the router. */
      if (route !== '/') {
        const clicked = await page.evaluate((r) => {
          const a = [...document.querySelectorAll('a[href]')].find((x) => (x.getAttribute('href') || '').split('#')[0] === r);
          if (!a) return 'no link';
          a.click();
          return 'ok';
        }, route);
        if (clicked !== 'ok') { add(s.name, `${view.tag} ${route}`, 'no link to this route anywhere in the document'); continue; }
        await page.waitForTimeout(500);
        const shown = await page.evaluate(() => document.querySelector('.rt:not([hidden])')?.dataset.rt);
        if (shown !== route) { add(s.name, `${view.tag} ${route}`, `clicking its link showed ${shown} instead`); continue; }
      }

      await scrollThrough(page);
      const bs = await page.evaluate(STATE);
      if (bs.broken.length) add(s.name, `${view.tag} ${route}`, `${bs.broken.length} picture(s) did not decode: ${bs.broken[0]}`);
      /* Two ways the layout width can be wrong, and they look different.
         Against the EMULATED width: a document with no viewport meta lays
         out at the 980px fallback and the phone shrinks it to fit — every
         clamp(…vw…) size resolves against 980. Against its own clientWidth:
         the document overflows sideways and the browser has zoomed out to
         contain it. Neither is visible in a screenshot without a ruler. */
      if (bs.vw > view.vp.width + 1)
        add(s.name, `${view.tag} ${route}`, `lays out at ${bs.vw}px in a ${view.vp.width}px window — a phone renders it shrunk to fit and every clamp(…vw…) size resolves against the wrong width. A missing <meta name="viewport"> does exactly this.`);
      else if (bs.vw !== bs.cw)
        add(s.name, `${view.tag} ${route}`, `lays out at ${bs.vw}px in a ${bs.cw}px viewport — it overflows sideways and the browser has zoomed out`);
      if (bs.pending) add(s.name, `${view.tag} ${route}`, `${bs.pending} picture(s) never finished loading after a full scroll`);
      if (!bs.text) add(s.name, `${view.tag} ${route}`, 'route is empty of text');

      if (s.compare) { darkRef.set(view.tag + route, bs.darkN); freshFp.set(view.tag + route, fpOf(bs)); }

      if (!s.compare) {
        const bsw = await sweep(page, offsetsFor(await range(page)));
        samples += bsw.length;
        /* SHIPPED: liveness, not parity. */
        const fp = freshFp.get(view.tag + route), now = fpOf(bs);
        if (fp) {
          const moved = [];
          if (Math.abs(now.text - fp.text) > Math.max(40, fp.text * 0.02)) moved.push(`${now.text} characters against today's ${fp.text}`);
          if (now.heads !== fp.heads) moved.push(`${now.heads} headings against ${fp.heads}`);
          if (now.h1 !== fp.h1) moved.push(`h1 "${bs.h1}" against "${fp.h1}"`);
          if (now.foot !== fp.foot) moved.push('a different footer');
          if (now.imgs !== fp.imgs) moved.push(`${now.imgs} pictures against ${fp.imgs}`);
          if (moved.length) lag.push(`${view.tag} ${route}: ${moved.join('; ')}`);
        }
        const ref = darkRef.get(view.tag + route);
        if (ref === undefined) notes.push(`${view.tag} ${route}: ${bs.darkN} text element(s) below-fold-dark in the shipped bundle, no fresh bundle to read it against — not judged`);
        else if (bs.darkN > ref) add(s.name, `${view.tag} ${route}`, `${bs.darkN - ref} more text element(s) invisible than the bundler produces today: "${bs.dark[0]}"`);
        const live = liveCount(bsw);
        if (route === '/' && live === 0) add(s.name, `${view.tag} ${route}`, 'nothing scroll-driven moves across the whole page — the held scene is frozen');
        else if (live === 0) unchecked++; else checked++;
        continue;
      }

      /* FRESH: the same offsets on the real site, same viewport. */
      const sctx = await b.newContext({ viewport: view.vp, isMobile: !!view.mobile, hasTouch: !!view.mobile, deviceScaleFactor: 1 });
      const spage = await sctx.newPage();
      const ok = await spage.goto(BASE + route, { waitUntil: 'load', timeout: 90000 }).catch((e) => { add(s.name, `${view.tag} ${route}`, `the SITE would not load at ${BASE + route} — ${String(e).split('\n')[0].slice(0, 90)}. Is BASE serving OUTDIR?`); return null; });
      if (!ok) { await sctx.close(); continue; }
      await spage.evaluate(() => document.fonts.ready).catch(() => {});
      await spage.waitForTimeout(900);
      await scrollThrough(spage);
      const ss = await spage.evaluate(STATE);
      const offs = offsetsFor(Math.min(await range(spage), await range(page)));
      const ssw = await sweep(spage, offs);
      samples += ssw.length;
      /* Re-sample the bundle on the SITE's offsets so both sides are read at
         the same absolute scrollY — the comparison that caught the dead
         engine. */
      const bsw2 = await sweep(page, offs);

      const siteLive = liveCount(ssw);
      if (siteLive === 0) unchecked++; else {
        checked++;
        if (liveCount(bsw2) === 0)
          add(s.name, `${view.tag} ${route}`, `${siteLive} scroll-driven value(s) move on the site and NONE move in the bundle — the motion engine is not running`);
      }
      for (let i = 0; i < offs.length; i++) {
        const A = ssw[i].vars, B = bsw2[i].vars;
        for (const k of new Set([...Object.keys(A), ...Object.keys(B)])) {
          const x = A[k], y = B[k];
          if (!x || !y) { add(s.name, `${view.tag} ${route} @${offs[i]}px`, `${k} carries motion values on ${x ? 'the site' : 'the bundle'} only`); continue; }
          for (const v of new Set([...Object.keys(x), ...Object.keys(y)])) {
            const [xn, xu] = x[v] || [NaN, ''], [yn, yu] = y[v] || [NaN, ''];
            /* Unitless scalars (0→1 progress) are compared to 0.05. `--py`
               is a percentage of a parallax amount, so the same fractional
               slack is a bigger number; TOL_PCT is that slack expressed in
               its own unit, not a looser rule. */
            const tol = xu === '%' ? TOL_PCT : TOL;
            if (xu !== yu || !(Math.abs(xn - yn) <= tol))
              add(s.name, `${view.tag} ${route} @${offs[i]}px`, `${k} ${v} site ${xn}${xu} · bundle ${yn}${yu}`);
          }
        }
        if (ssw[i].nav !== bsw2[i].nav) add(s.name, `${view.tag} ${route} @${offs[i]}px`, `nav scrim ${ssw[i].nav ? 'on' : 'off'} on the site, ${bsw2[i].nav ? 'on' : 'off'} in the bundle`);
      }
      /* Content parity, cheap and blunt: a route the bundler dropped, or a
         heading it swallowed, shows up here and nowhere else. */
      if (Math.abs(bs.text - ss.text) > Math.max(40, ss.text * 0.02))
        add(s.name, `${view.tag} ${route}`, `${bs.text} characters of text against the site's ${ss.text}`);
      if (bs.heads !== ss.heads) add(s.name, `${view.tag} ${route}`, `${bs.heads} headings against the site's ${ss.heads}`);
      /* Height is the blunt instrument that catches what the scalars cannot:
         a headline split against a box that was display:none and so had no
         line boxes to measure, a footer belonging to another route. 3% is
         the slack left for photograph re-encoding and sub-pixel leading —
         the defects this found were 2 to 80 percent. */
      if (Math.abs(bs.docH - ss.docH) > Math.max(60, ss.docH * 0.03))
        add(s.name, `${view.tag} ${route}`, `the page is ${bs.docH}px tall against the site's ${ss.docH}px`);
      /* The footer is not one footer — /partner/ and /forum/ carry their own,
         and a bundle that folds in the homepage's shows the partner page a
         call to action to visit the partner page. */
      if (bs.foot !== ss.foot)
        add(s.name, `${view.tag} ${route}`, `the footer under this route is not the site's: "${bs.foot.slice(0, 42)}…" against "${ss.foot.slice(0, 42)}…"`);
      if (bs.imgs !== ss.imgs) add(s.name, `${view.tag} ${route}`, `${bs.imgs} pictures against the site's ${ss.imgs}`);
      /* Whitespace-insensitive on purpose. motion.js re-splits `.lines`
         headlines into per-line spans and the split drops the space at each
         break, so a site h1 reads "for<br>the work" as "forthe work" while a
         bundle route that was hidden at load — and so never split — keeps the
         space. That is a difference in when the splitter ran, not in what the
         page says, and the words are what this check is for. */
      if (bs.h1.replace(/\s+/g, '') !== ss.h1.replace(/\s+/g, ''))
        add(s.name, `${view.tag} ${route}`, `h1 is "${bs.h1}" against the site's "${ss.h1}"`);
      /* Text invisible in the bundle but not on the site: a reveal whose
         observer never fired because its route was hidden at load. */
      if (bs.darkN > ss.darkN) add(s.name, `${view.tag} ${route}`, `${bs.darkN - ss.darkN} text element(s) invisible in the bundle that the site shows: "${bs.dark[0]}"`);
      await sctx.close();
    }
    if (errs.length) add(s.name, view.tag, `${errs.length} script error(s): ${errs[0]}`);
    await ctx.close();
  }

  /* ── the no-JS path ───────────────────────────────────────────────────
     The bundle writes `html.js` from an inline script of its own, and every
     hidden state on this site is gated on that class. With scripts off the
     class is never written and the whole document must fall back to its
     no-JS state: all routes present (there is no router to hide them), no
     text invisible, and something to scroll. This is the one check where
     the bundle SHOULD differ from the site, and how it differs is the
     point. */
  for (const s of subjects) {
    const ctx = await b.newContext({ viewport: view.vp, isMobile: !!view.mobile, hasTouch: !!view.mobile, deviceScaleFactor: 1, javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('file://' + s.file, { waitUntil: 'load', timeout: 90000 });
    await page.waitForTimeout(700);
    const r = await page.evaluate(`(() => {
      const dark = [];
      for (const el of document.querySelectorAll('main h1,main h2,main h3,main p,main li')) {
        const t = (el.textContent || '').trim();
        if (!t || el.children.length) continue;
        const cs = getComputedStyle(el), b = el.getBoundingClientRect();
        if (b.width < 2 || b.height < 2) continue;
        if (cs.visibility === 'hidden' || Number(cs.opacity) < 0.05) dark.push(t.slice(0, 40));
      }
      return { dark: dark.slice(0, 4), darkN: dark.length,
               h: document.documentElement.scrollHeight, vh: window.innerHeight,
               routes: document.querySelectorAll('.rt').length };
    })()`);
    if (r.darkN) add(s.name, `${view.tag} no-JS`, `${r.darkN} text element(s) invisible with scripts off: "${r.dark[0]}"`);
    if (r.h <= r.vh + 40) add(s.name, `${view.tag} no-JS`, `document is ${r.h}px in a ${r.vh}px viewport — nothing to scroll`);
    if (r.routes < ROUTES.length) add(s.name, `${view.tag} no-JS`, `${r.routes} of ${ROUTES.length} routes in the document`);
    await ctx.close();
  }
}
await b.close();
if (!has('keep') && !arg('bundle', '')) fs.rmSync(tmp, { recursive: true, force: true });
else notes.push(`bundle kept at ${freshPath}`);

function offsetsFor(r) {
  return Array.from({ length: OFFSETS }, (_, i) => Math.round((r * (i + 1)) / (OFFSETS + 1)));
}

/* ── verdict ─────────────────────────────────────────────────────────────
   The headline carries the rule and the census, not just the count: a
   route-view where the site itself has no scroll-driven value is UNCHECKED,
   and a 0 whose denominator is unstated is the number a judge misreads. */
if (has('json')) console.log(JSON.stringify({ findings, checked, unchecked, samples }, null, 1));
else for (const f of findings) console.log(`  ${f.subject.padEnd(7)} ${f.where.padEnd(28)} ${f.what}`);
if (notes.length) console.log(notes.map((n) => '  · ' + n).join('\n'));
/* Under 200 characters on purpose: gates.mjs prints the first 200 of this
   line and that one line is what every wave quotes. The rule and the
   denominator have to survive the cut. */
/* The lag sentence is part of the verdict line and not a finding: it is the
   difference between a bundle that lags on purpose and one nobody has looked
   at. It carries the command, because the whole point is that the next
   builder should not have to work out what to do about it. */
const lagLine = !subjects.some((s) => !s.compare) ? ''
  : !freshFp.size ? ' · shipped bundle NOT read against the bundler\'s current output (no fresh bundle in this run) — its age is unknown.'
  : lag.length ? ` · shipped bundle is BEHIND the bundler's current output on ${lag.length} of ${VIEWS.length * ROUTES.length} route-views (${lag[0]}) — regenerate with \`node tools/bundle.mjs\`. Not a finding: it is allowed to lag, but not silently.`
  : ' · shipped bundle says what the site says today.';
console.log(`${findings.length} finding(s) in ${subjects.map((s) => s.name).join('+')} · ${VIEWS.length * ROUTES.length * subjects.length} subject-route-views, ${samples} settled samples, scalars matched to ${TOL} at ${OFFSETS} shared offsets · ${checked} route-views had motion to compare, ${unchecked} had none: UNCHECKED, not passed.${lagLine}`);
for (const l of lag) console.log(`  lag  ${l}`);
process.exitCode = findings.length ? 1 : 0;
