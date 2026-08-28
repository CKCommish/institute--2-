/* HELD-SPACE — the flat-band rule, executable.

   usage: node tools/held-space.mjs [--routes=/,/404] [--view=desktop|mobile]
          BASE=http://127.0.0.1:4399 (a server is started if none is given)

   WHY THIS FILE EXISTS. The rule was written in wave 19 as a comment beside
   `--pause` in tokens.css and swept BY HAND against 33 bands. A hand sweep
   is not repeatable and it cannot be re-run when a scene moves, so the
   rule's own verdict ("zero holes remain") had no way to age. It also had a
   gap that only showed up when someone applied it by hand to a band the
   author had not: clause 1 admits "a change of ground" and never says HOW
   BIG a change of ground is.

   ── THE MAGNITUDE FLOOR, AND WHERE IT COMES FROM ────────────────────────
   It is not a new number. It was already in tokens.css, forty lines below
   the rule that needed it, under THE GROUNDS:

     (none)     --ink-900   L*  3      .on-panel  --ink-700   L* 15
     .on-plate  --ink-600   L* 21      .on-cream  --cream     L* 92

   and, in the wave-4 note directly beneath that ladder, the finding that
   settles this outright:

     "A 6-point step between two large dark fields, seen a screen apart and
      never side by side, is not a change of ground; it is the same ground
      with a rounding error."
     "Page → panel is now 11.5 L*, which is a step a reader registers as a
      different surface."

   So this project has already decided, on the record, with a measurement
   behind it, what the smallest thing that counts as a change of ground is:
   the page→panel step. Anything under it was explicitly named as NOT one.
   The held-space rule did not need a number invented for it; it needed to
   cite the number it was already sitting next to.

     GROUND_FLOOR_L = 11.5   // page → panel, the site's smallest real ground

   Measured as a STEP, not a range: the largest L* difference across any
   single boundary inside or at the edge of the band, taken between the
   median of the STEP_WIN rows before it and the STEP_WIN rows after. A
   gradient that crawls the same distance over two hundred rows is not an
   edge and a reader does not see one — which is exactly the case the hand
   sweep passed. Row luminance is converted to L* before comparing, because
   the ladder above is in L* and 8-bit sRGB is not linear: 11.6 → 15.4 in
   bytes looks like "four points" and is 1.3 L*, a ninth of the floor.

   Clause 1's other two objects (a rule, a line of type spanning the
   measure) are DOM-measured and unchanged: they are marks, and a mark is
   present or it is not. Only "a change of ground" is a matter of degree,
   and only it needed a floor.

   WHAT THIS TOOL STILL DOES NOT DO. It has no ceiling, exactly as the
   comment in tokens.css says. It measures under reduced motion. It reads
   the composed page, so a band closed by a mark that reveals late is
   scored closed.

   ── WHICH EDGE CLOSES A BAND, AND WHY THE RULE DOES NOT NEED TO CARE ────
   Clause 1 accepts a full-measure row at EITHER edge or inside, and the
   wave-23 judge objected to one half of that: a band closed at its BOTTOM is
   closed by a mark the reader has not reached yet, so at the moment of
   crossing there is nothing there. Wave 24 answered that the instance was
   misattributed (it was, to /404, where the closing mark is at the top) and
   did not check the class. The class is real: three bands on this site are
   closed at their bottom edge and nowhere else. All three, measured at 390:

     /forum/  1158-1234, closed @1234 — 76px
     /        3754-3818, closed @3818 — 64px
     /partner/ 2894-2956, closed @2956 — 62px

   The distinction does not need writing into the rule, for two reasons,
   both measured rather than argued.
   FIRST, WHAT CLOSES THEM. None of the three is closed by a line of body
   type belonging to the next block. /forum/'s closer is a full-measure
   hairline carrying the brass index 02, above WHAT IT IS; /partner/'s is
   .foot__base's own rule; and / 3754-3818 also passes clause 1b on its own
   — 11.05 L* at 3815, over the 11.0 floor — because the mark at its bottom
   is the panel edge, a change of ground. A scene-break rule is the site's
   named closing device (tokens.css, --rule), not a block "not yet reached".
   SECOND, THE ONE THING THAT WOULD MAKE IT BITE. The objection has force
   only where a reader can hold the whole band on screen with no closer in
   it. The largest of the three is 76px against an 844px viewport — 9%. The
   band and its closing mark are co-visible at every scroll position that
   shows any of the band, at both gated viewports, and the largest crossing
   anywhere on the site (211px, /institute/ desktop) is 23% of 900. There is
   no band on this site where the objection could fire.
   So: no distinction, and no magnitude floor either — AGENTS.md settled that
   one and a floor loose enough to reopen it is worse than this. If a
   bottom-closed band ever grows past the viewport it is in, it stops being
   this case; the `closed by @<y>` column names the edge, so it can be seen. */

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { launch } from './browser.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const arg = (k, d) => { const a = process.argv.find((s) => s.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };

const ROUTES = arg('routes', '/,/pilots/,/institute/,/forum/,/people/,/partner/,/404').split(',').filter(Boolean);
const VIEWS = [
  { tag: 'desktop', vp: { width: 1440, height: 900 } },
  { tag: 'mobile', vp: { width: 390, height: 844 }, mobile: true },
].filter((v) => !arg('view') || v.tag === arg('view'));

/* ── the constants the rule turns on ─────────────────────────────────── */
const GROUND_FLOOR_L = 11.0;  /* page→panel. See the header — and one
                                 correction to it, made by measurement. 11.5
                                 is the step computed from the TOKEN VALUES
                                 (L* 3 → 15). What this tool measures is the
                                 step as it is PAINTED, in the gutters, after
                                 antialiasing at the boundary row and the
                                 8-row medians either side of it: every real
                                 page→panel edge on this site reads 11.05 to
                                 11.07 (homepage 5658 and 4260, /pilots/ 744,
                                 mobile / 3815). A floor of 11.5 is therefore
                                 strictly ABOVE the one step it names as its
                                 worked example — the rule would reject the
                                 example it is written from. 11.0 sits just
                                 under the measured step and well over the
                                 1.3 L* footer ramp and the 0.28 L* /404
                                 band, so no verdict in the sweep changes;
                                 what changes is that the clause can now
                                 actually fire on a real ground change. */
const STEP_WIN = 8;           /* rows either side of a boundary. Eight rows is
                                 under a line of leading, so a real edge is
                                 fully inside the window and a ramp is not. */
const GAP_MAX = 0.10;         /* see `ok()` below. */
const EDGE_WIN = 28;          /* one line-box at display size. */
const RULE_MIN_L = 1.2;       /* a hairline against its own ground, in L*.
                                 --rule-soft (cream 8% on the page) is ~1.6. */
const MEASURE_TOL = 0.985;    /* "reaches both margins of the shell". 1337 of
                                 1338 at 1440 is 0.9993; the tolerance is loose
                                 enough for a hairline inset and far too tight
                                 for the 51-470 of 51-1389 short mark that
                                 started this. */

/* ── ACCEPTED BANDS, AND WHY THERE IS A LIST AND NOT A NUMBER ───────────
   This tool became a gate in wave 22. It could not become one while it
   exited 1 on five bands, and its author was right to say that wiring it in
   as it stood was a named move and not a defect fix. Two of the five — /404
   at both viewports, the largest band on the site and the page every bad
   link lands on — are closed in the page. Three are left, and they are
   ACCEPTED here, by name, with the measurement each was accepted on. An
   accepted band still prints, still shows its numbers, and can still fail:
   see GROWTH below.

   The tempting alternative was a magnitude floor — "a hole under 200px is
   not a hole" — and it is wrong, by this project's own worked example. The
   /404 hole at 390 was 158px. A floor loose enough to swallow /partner/'s
   188 swallows the very band the wave-21 judge cropped and called a third
   of a screen of dead navy. The difference between these three and that one
   is not size. It is that each of these sits BETWEEN TWO SCENES, with a mark
   inside one line-box above it and a labelled block opening below it, and
   /404's was the page simply stopping. That distinction is not a number, so
   it is not written as one.

   Each entry was looked at, cropped, at the viewport it is accepted for.
   None of these three is on a file this wave owns; accepting a band is not
   the same as blessing it, and a wave that wants to close one should.

   AND WHAT AN ENTRY IS KEYED ON. Until wave 23 an entry matched on route and
   view alone — so it was, itself, an exemption broader than its own reason.
   Every `why` below names a PLACE ("the break under THE FOUR PILOTS row"),
   and the place was thrown away: close /partner/'s 188px band and open a
   170px one anywhere else on that page and it would inherit, silently, a
   reason written about a different break, with no growth-ceiling trip.
   The obvious fix — key on `top` — is worse. A band's top moves whenever
   anything above it changes height, so every entry here would go stale on
   the next copy edit, and a gate that reddens on an unrelated edit is a gate
   that stops being run. What is stable about a band is neither its route nor
   its pixel: it is WHICH TWO THINGS IT SITS BETWEEN. So an entry carries
   `after` and `before` — the nearest named mark above and below, normalised
   (lowercased, punctuation dropped, clipped at a whole word near 40 chars),
   which is the same pair of names the reason is written in. Move the scene
   400px and the entry still matches; put a different band between different
   things and it does not. These strings are printed for every accepted band,
   so a copy edit that breaks one shows the new pair to paste in.

   All three were re-cropped in wave 23, at the viewport each is accepted
   for, after wave 22's edits to /partner/. All three reasons still describe
   what is on the page; the two /partner/ heights are unchanged. */
const ACCEPTED = [
  { route: '/partner/', view: 'desktop', h: 188,
    after: 'name the pilot and the role a person', before: 'open for 2026',
    why: 'the break under THE FOUR PILOTS row. Its top edge IS a row across the measure — the ask sentence at the left margin, the kicker and its rule at the right — and it fails `ok()` only on GAP_MAX, at the one place on the site where that clause cannot tell a two-corner row from two corners. Below it, OPEN FOR 2026 opens a labelled block.' },
  { route: '/partner/', view: 'mobile', h: 150,
    after: 'name the pilot and the role a person', before: 'open for 2026',
    why: 'the same break at 390, where the kicker does not set beside the sentence, so the top edge is one short line. Bounded 40px above by the contact rule and immediately below by the OPEN FOR 2026 eyebrow: a scene break, not a stop.' },
  { route: '/', view: 'mobile', h: 61,
    after: 'inquire about the forum', before: 'people',
    why: 'one --pause and eleven pixels, between the Forum scene\'s cue and the PEOPLE eyebrow. This is the padding between two scenes at the size the scale sets it; there is nothing to put in it that is not already in the scene above or the one below.' },
];
const GROWTH = 1.25;   /* An acceptance is of a band, not of a route. A band
                          that grows past a quarter again its accepted height
                          is a different band and has not been looked at, so
                          it fails. This is the whole difference between
                          "accepted with a reason" and "silently tolerated".
                          An accepted band that has GONE prints as stale and
                          does NOT fail: someone closing a hole must not be
                          reddened by this file for it. */

/* sRGB byte → L*. The grounds ladder is in L*; byte means are not. */
const lin = (c) => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const Lstar = (r, g, b) => { const y = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); return y <= 216 / 24389 ? y * 24389 / 27 : 116 * Math.cbrt(y) - 16; };
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[s.length >> 1]; };

/* ── marks, from the DOM ─────────────────────────────────────────────── */
const collectMarks = `(() => {
  const out = [];
  const vis = (el) => { const s = getComputedStyle(el); return s.visibility !== 'hidden' && s.display !== 'none' && parseFloat(s.opacity) > 0.01; };
  const pinnedOf = (el) => { for (let n = el; n && n !== document.body; n = n.parentElement) { const p = getComputedStyle(n).position; if (p === 'fixed' || p === 'sticky') return true; } return false; };
  let PIN = false;
  const push = (r, kind, text) => { if (r && r.width > 0.5 && r.height > 0.5) out.push({ top: r.top + scrollY, bottom: r.bottom + scrollY, left: r.left, right: r.right, kind, pinned: PIN, text: text || null }); };
  /* A NAME for a mark, for anchoring an acceptance. Words, not pixels: a
     band's top moves whenever anything above it changes height, so a pixel
     key would go stale on the next copy edit. What does not move is which
     two things the band sits between. Normalised hard (lowercased, collapsed,
     clipped) so that punctuation and casing edits do not break an entry. */
  const nameOf = (t) => { const n = t.replace(/\\s+/g, ' ').trim().toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    return n.length <= 40 ? n : n.slice(0, 40).replace(/ [^ ]*$/, ''); };

  /* type: measured per client rect, so a wrapped paragraph is N line rects
     and a band between two lines of the same <p> is leading, not a band. */
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    if (!n.nodeValue.trim()) continue;
    const p = n.parentElement; if (!p || !vis(p)) continue; PIN = pinnedOf(p);
    const rg = document.createRange(); rg.selectNodeContents(n);
    /* Name the BLOCK, not the text node. motion.js splits a .lines element
       into one span per rendered line, so a node value is a line fragment
       that changes with every rewrap — exactly the instability an anchor
       must not have. The element carries the whole string in data-text
       (which is what motion.js re-splits from), so climb to it. */
    const host = p.closest('[data-text]') || p.closest('p,h1,h2,h3,h4,h5,h6,li,figcaption,blockquote,a,button') || p;
    const nm = nameOf(host.dataset.text || host.textContent || n.nodeValue);
    for (const r of rg.getClientRects()) push(r, 'type', nm);
  }
  /* replaced content */
  for (const el of document.querySelectorAll('img,svg,canvas,video,picture')) if (vis(el)) { PIN = pinnedOf(el); push(el.getBoundingClientRect(), 'image', nameOf('image ' + (el.getAttribute('alt') || el.getAttribute('aria-label') || (el.currentSrc || el.getAttribute('src') || '').split('/').pop() || el.tagName))); }
  /* rules: a visible border edge, or an <hr>, or a thin painted box */
  for (const el of document.querySelectorAll('*')) {
    if (!vis(el)) continue;
    const s = getComputedStyle(el); const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    PIN = pinnedOf(el);
    /* ALPHA, AND THE CLASS OF MARK THAT HAS BEEN INVISIBLE HERE SINCE
       WAVE 21 (git log -S on this line), TWO OF THEM AS A GATE.
       This used to read only the legacy comma form 'rgba(r, g, b, a)'. Every
       '--rule' and '--rule-soft' on this site is a 'color-mix()', and a
       computed color-mix resolves to 'color(srgb 0.949 0.929 0.890 / 0.14)'
       — no match, alpha 0, border SKIPPED. So the commonest closing device
       in this house was absent from the DOM pass on every route. It was not
       absent from the verdicts, because findRules() finds hairlines in the
       PIXELS — but a pixel rule is not added to 'covered', so it can close a
       band and cannot SPLIT one. That is how /404 desktop printed ONE 286px
       band, position 1 in this table, when what is on the page is 26px of
       leading (888-914), a full-measure rule at 914, and 258px of ground
       under it (916-1174). Measured at 1440x900, scripts on, reduced motion.
       Read the alpha slot of the modern syntaxes too. */
    const alpha = (c) => {
      if (!c || c === 'transparent' || c === 'none') return 0;
      const mod = /\\/\\s*([0-9.]+%?)\\s*\\)/.exec(c);   /* rgb(… / a), color(srgb … / a), oklch(… / a) */
      if (mod) return mod[1].endsWith('%') ? parseFloat(mod[1]) / 100 : parseFloat(mod[1]);
      const leg = /rgba?\\(([^)]+)\\)/.exec(c);
      if (leg) { const p = leg[1].split(',').map(Number); return p.length > 3 ? p[3] : 1; }
      return /^(color|rgb|hsl|hwb|oklch|oklab|lab|lch)\\(|^#/.test(c) ? 1 : 0;
    };
    for (const side of ['Top', 'Bottom']) {
      if (parseFloat(s['border' + side + 'Width']) > 0 && s['border' + side + 'Style'] !== 'none' && alpha(s['border' + side + 'Color']) > 0.02) {
        const y = side === 'Top' ? r.top : r.bottom;
        push({ top: y - 1, bottom: y + 1, left: r.left, right: r.right, width: r.width, height: 2 }, 'rule');
      }
    }
    if (el.tagName === 'HR') push(r, 'rule');
    if (r.height <= 6 && alpha(s.backgroundColor) > 0.02 && el.children.length === 0) push(r, 'rule');
    /* NOT ::before / ::after. A pseudo-element has no node and no rect, and
       this house draws most of its hairlines that way — .foot__base's rule
       is one. They are found in the pixels instead; see findRules(). */
  }
  /* --pause is a clamp() with a vw term. A custom property's computed value
     is the unresolved token stream, so parseFloat on it reads "3.5" (the
     clamp's first argument) or NaN. Resolve it the only way that is honest:
     put it on a real element's height and read the used value back. */
  const pausePx = () => {
    const d = document.createElement('div');
    d.style.cssText = 'position:absolute;left:-9999px;top:0;width:1px;height:var(--pause)';
    document.body.appendChild(d);
    const h = d.getBoundingClientRect().height;
    d.remove(); return h;
  };
  const shell = document.querySelector('.shell') || document.querySelector('main') || document.body;
  const sr = shell.getBoundingClientRect(); const ss = getComputedStyle(shell);
  /* the MEASURE is the shell's content box, not its border box: on a phone
     the shell runs the full 390 and holds its margins as padding, so the
     border box would say every mark is short and the gutters would be
     nothing. */
  const mL = sr.left + parseFloat(ss.paddingLeft), mR = sr.right - parseFloat(ss.paddingRight);
  return { marks: out, measure: { left: mL, right: mR, width: mR - mL },
           height: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
           pause: pausePx() };
})()`;

async function sweepRoute(ctx, base, route, view) {
  const page = await ctx.newPage();
  const url = base + (route === '/404' ? '/404.html' : route);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(400);
  /* scroll the whole page once so anything lazy composes, then return */
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += 400) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => requestAnimationFrame(r)); }
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForTimeout(600);

  const dom = await page.evaluate(collectMarks);
  const shot = await page.screenshot({ fullPage: true, type: 'png' });
  await page.close();

  /* ── GROUND, READ IN THE GUTTERS ──────────────────────────────────────
     Row luminance is sampled ONLY outside the measure. A ground on this
     site is full-bleed by definition (tokens.css, THE GROUNDS: .on-panel is
     "full-bleed, edge to edge"; .on-plate, which is not, is an object and
     not a ground), so the gutter carries every real ground change and
     carries no type at all.
     Sampling the full width instead reads the arrival of the first line of
     type below a band as an 11.4 L* "change of ground" — which is how the
     first run of this tool passed /404 mobile 1013-1070. Type is a mark and
     marks are counted in the DOM; letting them in here counts them twice
     and in the wrong clause. tone-meter.mjs has walked the gutters since
     wave 4 for the same reason. */
  const sharp = (await import('sharp')).default;
  const { data, info } = await sharp(shot).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, C = info.channels;
  const cols = [];
  for (let x = 0; x < W; x++) if (x < dom.measure.left - 3 || x > dom.measure.right + 3) cols.push(x);
  if (!cols.length) for (let x = 0; x < W; x += 8) cols.push(x);
  const rowL = new Float64Array(H);
  for (let y = 0; y < H; y++) {
    let s = 0;
    for (const x of cols) { const i = (y * W + x) * C; s += Lstar(data[i], data[i + 1], data[i + 2]); }
    rowL[y] = s / cols.length;
  }

  /* ── bands: runs of rows carrying no mark ───────────────────────────── */
  const covered = new Uint8Array(H);
  for (const m of dom.marks) {
    const a = Math.max(0, Math.floor(m.top)), b = Math.min(H - 1, Math.ceil(m.bottom));
    for (let y = a; y <= b; y++) covered[y] = 1;
  }
  const bands = [];
  for (let y = 0; y < H; y++) {
    if (covered[y]) continue;
    let e = y; while (e + 1 < H && !covered[e + 1]) e++;
    if (e - y + 1 >= dom.pause) bands.push({ top: y, bottom: e + 1, h: e - y + 1 });
    y = e;
  }

  /* ── RULES, FROM THE PIXELS ───────────────────────────────────────────
     A full-measure hairline is the commonest way this site closes a band,
     and roughly none of them are reachable from the DOM: `--rule` is cream
     at 14% painted on a ::before, which querySelectorAll cannot see and
     getBoundingClientRect cannot measure. The first run of this tool called
     /404 mobile 1013-1070 a hole because of it — there is a rule across the
     full measure at 1057, plainly visible, closing that band exactly as
     clause 1 intends.
     So: a row is a full-measure rule if, across the measure, at least
     MEASURE_TOL of the sampled columns are lighter than the rows just above
     and below it by RULE_MIN_L. That is the definition of a hairline and it
     does not care how it was drawn. `--rule-soft` is cream at 8% over the
     page ground, which lands ~1.6 L* up; the threshold sits under it. */
  const mCols = [];
  for (let x = Math.ceil(dom.measure.left); x <= Math.floor(dom.measure.right) && x < W; x++) if (x >= 0) mCols.push(x);
  const ruleCols = (y) => {
    const on = [];
    if (y < 3 || y >= H - 3) return on;
    for (const x of mCols) {
      const at = (yy) => { const i = (yy * W + x) * C; return Lstar(data[i], data[i + 1], data[i + 2]); };
      const ctx = Math.min(at(y - 2), at(y - 3), at(y + 2), at(y + 3));
      if (at(y) - ctx >= RULE_MIN_L) on.push(x);
    }
    return on;
  };

  /* the largest ground STEP at or inside a band, in L* */
  const stepAt = (y) => {
    const a = [], b = [];
    for (let i = y - STEP_WIN; i < y; i++) if (i >= 0) a.push(rowL[i]);
    for (let i = y; i < y + STEP_WIN; i++) if (i < H) b.push(rowL[i]);
    return a.length && b.length ? Math.abs(median(b) - median(a)) : 0;
  };
  const firstBody = Math.min(...dom.marks.filter((m) => !m.pinned).map((m) => m.top));
  const lastMark = Math.max(...dom.marks.map((m) => m.bottom));

  const rows = [];
  for (const bnd of bands) {
    /* clause 1a/1c — the MEASURE IS SPANNED at an edge or inside.
       Read per ROW, not per object. The rule says "a full-measure object",
       and the hand sweep read that as one mark wide enough. This site's
       commonest closing device is not one mark: it is a hairline that stops
       short so a brass index or a right-aligned kicker can sit at the end of
       it — `--brass` is documented in tokens.css as being for exactly that,
       "rules, indices". /forum/ 02, /partner/ THE FOUR PILOTS. Per-object,
       every one of those is a short mark and closes nothing; the reading
       that matches the eye is that the ROW reaches both margins.
       So: union the x-extents of every mark lying in the edge line-box, clip
       to the measure, and ask whether the union covers it. A single
       full-measure rule or line of type is the one-object case of the same
       test, so nothing the old reading closed is opened by this. */
    const spanned = (lo, hi) => {
      const iv = dom.marks
        .filter((m) => m.bottom > lo && m.top < hi)
        .map((m) => [Math.max(m.left, dom.measure.left), Math.min(m.right, dom.measure.right)]);
      /* the pixel rules in the same line-box, as intervals */
      for (let y = Math.max(0, Math.round(lo)); y <= Math.round(hi) && y < H; y++) {
        const on = ruleCols(y);
        if (on.length < 8) continue;
        let a = on[0];
        for (let i = 1; i <= on.length; i++) {
          if (i === on.length || on[i] > on[i - 1] + 2) { if (on[i - 1] - a > 6) iv.push([a, on[i - 1]]); a = on[i]; }
        }
      }
      const s2 = iv.filter(([a, b]) => b > a).sort((a, b) => a[0] - b[0]);
      let cov = 0, at = dom.measure.left, gap = 0, prevEnd = null;
      for (const [a, b] of s2) {
        if (prevEnd !== null && a > prevEnd) gap = Math.max(gap, a - prevEnd);
        prevEnd = Math.max(prevEnd ?? a, b);
        if (b <= at) continue; cov += b - Math.max(a, at); at = Math.max(at, b);
      }
      const L = s2.length ? s2[0][0] : Infinity, R = s2.length ? Math.max(...s2.map((v) => v[1])) : -Infinity;
      return { cov: +(cov / dom.measure.width).toFixed(3), gap: +(gap / dom.measure.width).toFixed(3),
               reachL: L <= dom.measure.left + 4, reachR: R >= dom.measure.right - 4 };
    };
    let full = null;
    /* EDGE_WIN is one line-box: the mark that bounds a band and the kicker
       set beside it share a row but rarely share a pixel row exactly. */
    const topCov = spanned(bnd.top - EDGE_WIN, bnd.top + 1);
    const botCov = spanned(bnd.bottom - 1, bnd.bottom + EDGE_WIN);
    const insideCov = spanned(bnd.top + 1, bnd.bottom - 1);
    if (process.env.HS_DIAG) console.error(`DIAG ${view.tag} ${route} ${bnd.top}-${bnd.bottom} top=${JSON.stringify(topCov)} bot=${JSON.stringify(botCov)}`);
    /* SPANNED means: reaches both margins, and is not two marks in opposite
       corners with the page between them. The gap ceiling is the second
       thing clause 1 needed and never said. A hairline that stops to let a
       brass index sit at its end leaves ~5% of the measure open; a headline
       at the left and a kicker at the right leave 50-60% and do not read as
       a row at all. GAP_MAX sits between them, at a tenth of the measure —
       a shade over one --gutter at either viewport, which is the widest
       deliberate horizontal interval this site sets. */
    const ok = (c) => c.reachL && c.reachR && c.gap <= GAP_MAX;
    for (const [c, at] of [[topCov, bnd.top], [insideCov, 'inside'], [botCov, bnd.bottom]]) {
      if (!full && ok(c)) full = { kind: `row spans measure @${at} (${Math.round(c.cov * 100)}%, gap ${Math.round(c.gap * 100)}%)` };
    }
    /* clause 1b — a change of ground, WITH the floor */
    let best = { y: -1, dL: 0 };
    for (let y = bnd.top; y <= bnd.bottom; y++) { const d = stepAt(y); if (d > best.dL) best = { y, dL: d }; }
    const groundOK = best.dL >= GROUND_FLOOR_L;
    /* clause 2 — a margin */
    /* clause 2 — a margin. Page end, page start, or the shelf a masthead
       reserves. "Page start" is not row 0: every route opens with a fixed
       masthead, so the first mark on the page is always the wordmark and a
       literal first-mark test would never fire. The margin at the top of an
       inner page is the one BELOW the masthead and above the first mark of
       the document proper — that is what `--shelf` is for, and the hand
       sweep counted it. `firstBody` is the first mark that is not inside a
       fixed or sticky element. */
    const margin = bnd.bottom <= firstBody + 2 || bnd.top >= lastMark - 2;

    /* Print WHERE the closing mark is, not just that there is one. The
       table's neighbouring column is the largest ground STEP and its y, and
       with the closing y withheld the two fused: the wave-23 judge read
       /404's dL* row (0.29 L* at 1163, which closes nothing — it is a
       hundredth of the floor) as the mark that closed the band, and
       concluded the closing mark belonged to the block below the gap. It is
       at 914, the list's own bottom rule, at the band's top edge. A verdict
       that cannot be re-measured from its own line is the defect this whole
       wave is about. */
    const verdict = full ? `composition (${full.kind})`
      : groundOK ? 'composition (change of ground)'
      : margin ? 'composition (margin)'
      : 'HOLE';
    /* ── WHERE THE BAND IS, IN WORDS ──────────────────────────────────────
       An acceptance has to be keyed on something, and the two obvious keys
       are both wrong. Route+view alone is broader than any reason written
       for it: close /partner/'s 188px band and open a 170px one elsewhere on
       the page and it inherits a reason about a different break. An exact
       `top` is narrower than reality: a band's top moves whenever anything
       above it changes height, so every acceptance would go stale on the
       next copy edit — the failure mode that stops gates being run.
       What is stable is which two things the band sits between. So a band is
       named by the nearest NAMED mark above it and the nearest below it —
       named meaning text or replaced content, the things a reason can point
       at. Rules are skipped on purpose: a hairline has no name, and the
       reasons here already say "under THE FOUR PILOTS row", not "under a
       rule". If a scene moves 400px the anchor follows it; if a different
       band opens between different things, it does not match. */
    const named = dom.marks.filter((m) => m.text && !m.pinned);
    let above = null, below = null;
    for (const m of named) {
      if (m.bottom <= bnd.top + 1 && (!above || m.bottom > above.bottom)) above = m;
      if (m.top >= bnd.bottom - 1 && (!below || m.top < below.top)) below = m;
    }
    /* ── THE CROSSING, WHICH IS NOT THE BAND HEIGHT ─────────────────────
       This table ranked by `h` for three waves, and `h` is the wrong
       quantity to rank by the moment a band is closed @inside. A band's
       interior carries no DOM mark by construction, so an interior closer is
       never a DOM mark: it is something found in the PIXELS — a hairline
       drawn on a pseudo-element, or the edge of a full-bleed ground — and
       neither is added to `covered`, so it can close a band and cannot split
       one. So /partner/ desktop 2253-2526 printed as one 273px band and led
       the table, when 273px is not a distance anyone crosses: the cream
       panel opens 102px in (90.46 L*, at 2352), and the two runs are 102 and
       167. A "band" that changes ground halfway is two bands.
       Ranking by `h` therefore reports a number no reader experiences, and
       it got into a wave report as "the site's worst band".
       So split every band at every interior row that spans the measure —
       the same `ok(spanned())` test the verdict uses, so the two cannot
       disagree — and rank by the LARGEST run. That is the honest number: the
       furthest a reader travels between two marks.
       WHAT THIS DELIBERATELY DOES NOT CHANGE. Verdicts, the acceptance keys,
       and GROWTH still read `h`. All three accepted bands have zero interior
       cuts, so crossing == h on every one of them and no acceptance was made
       on the wrong quantity — checked, not assumed. Making the gate itself
       turn on the crossing would be a rule change, and the band that really
       wants it is the one whose pixel rule should have SPLIT it. That is a
       larger job than a ranking. */
    const cuts = [];
    for (let y = bnd.top + 1; y < bnd.bottom - 1; y++) {
      if (!ok(spanned(y - 1, y + 1))) continue;
      if (cuts.length && cuts[cuts.length - 1][1] >= y - 2) cuts[cuts.length - 1][1] = y;
      else cuts.push([y, y]);
    }
    const segs = []; let segAt = bnd.top;
    for (const [ca, cb] of cuts) { segs.push(ca - segAt); segAt = cb; }
    segs.push(bnd.bottom - segAt);
    const sub = Math.max(...segs);

    rows.push({ route, view: view.tag, top: bnd.top, bottom: bnd.bottom, h: bnd.h, sub, segs,
                after: above ? above.text : '(page start)', before: below ? below.text : '(page end)',
                dL: +best.dL.toFixed(2), dLat: best.y, full: full ? full.kind : null, margin, verdict });
  }
  return rows;
}

/* ── run ─────────────────────────────────────────────────────────────── */
let srv = null, base = process.env.BASE;
if (!base) {
  const dir = process.env.DIST || 'dist';
  /* THE PORT IS THE OS'S TO CHOOSE, NOT THIS FILE'S.
     This used to bind 4471 and then POLL 4471 until something answered. When
     a second builder was already serving on it, the bind failed silently
     (stdio was 'ignore') and the poll succeeded against THEIR build on the
     first try — so the tool reported, with no error and no warning, a sweep
     of somebody else's tree. That is the wave-12 racing-meters defect with a
     different port number, and gates.mjs already carries the fix: take a port
     the OS hands out and read it back off the listener. Found while measuring
     /404 for wave 22, by shooting a page that had just been rebuilt and
     getting the old pixels twice. */
  srv = spawn(process.execPath, ['-e', `import('sirv').then(({default:s})=>{const a=s(${JSON.stringify(dir)},{dev:true,extensions:['html']});import('node:http').then(({createServer})=>{const h=createServer((q,r)=>a(q,r,()=>{r.statusCode=404;r.end('nf')}));h.listen(0,'127.0.0.1',()=>console.log(h.address().port))})})`], { cwd: ROOT, stdio: ['ignore', 'pipe', 'inherit'] });
  const port = await new Promise((res, rej) => {
    let buf = '';
    srv.stdout.on('data', (d) => { buf += d; const m = /(\d+)/.exec(buf); if (m) res(Number(m[1])); });
    srv.on('exit', (c) => rej(new Error(`server exited (${c}) before it named a port`)));
    setTimeout(() => rej(new Error('server never named a port')), 20000);
  });
  base = `http://127.0.0.1:${port}`;
  /* POLL, do not sleep. A flat wait for the child to bind is the same guess
     tools/shoot.mjs was corrected for in wave 12: when it is short the tool
     does not fail, it silently measures the 404 body — a 980px-wide page with
     two words on it, which scores as one enormous hole on every route. */
  for (let i = 0; i < 100; i++) {
    try { await fetch(base + '/index.html'); break; } catch { await new Promise((r) => setTimeout(r, 100)); }
  }
}

const b = await launch({ proxy: false });
const all = [];
for (const view of VIEWS) {
  const ctx = await b.newContext({ viewport: view.vp, deviceScaleFactor: 1, isMobile: !!view.mobile, hasTouch: !!view.mobile, reducedMotion: 'reduce' });
  for (const route of ROUTES) all.push(...await sweepRoute(ctx, base, route, view));
  await ctx.close();
}
await b.close();
if (srv) srv.kill();

/* Ranked by the CROSSING, not by the band height — see "THE CROSSING" above.
   They differ only where a pixel hairline closes a band from inside. */
all.sort((a, x) => x.sub - a.sub || x.h - a.h);

/* apply the accept list — longest band first, one entry per band */
const usedAcc = new Set();
for (const r of all) {
  if (r.verdict !== 'HOLE') continue;
  const i = ACCEPTED.findIndex((a, k) => !usedAcc.has(k)
    && a.route === r.route && a.view === r.view && a.after === r.after && a.before === r.before);
  if (i < 0) continue;
  const a = ACCEPTED[i]; usedAcc.add(i); r.acc = a;
  if (r.h <= a.h * GROWTH) { r.verdict = 'accepted'; r.accepted = true; }
  else r.verdict = `HOLE (accepted at ${a.h}px, now ${r.h})`;
}
const stale = ACCEPTED.filter((_, k) => !usedAcc.has(k));
const holes = all.filter((r) => r.verdict.startsWith('HOLE'));
console.log(`\nband                                  cross    px    ΔL* at      closed by`);
console.log('─'.repeat(96));
for (const r of all) {
  const id = `${r.view} ${r.route} ${r.top}-${r.bottom}`.padEnd(36);
  /* the split is printed AFTER the verdict so the columns stay columns: a
     band whose crossing is not its height says so on its own line. */
  const split = r.segs.length > 1 ? `  [${r.segs.join(' + ')}]` : '';
  console.log(`${id} ${String(r.sub).padStart(5)} ${String(r.h).padStart(5)}  ${String(r.dL).padStart(6)} ${String(r.dLat).padStart(6)}   ${r.verdict}${split}`);
}
console.log('─'.repeat(96));
console.log(`ground floor ${GROUND_FLOOR_L} L* (page→panel, tokens.css THE GROUNDS); full-measure ≥${MEASURE_TOL} of shell; cross = largest run between marks, which is what a reader crosses.`);
for (const r of all) {
  if (!r.acc) continue;
  /* print the verdict this band actually has. It used to print "accepted:"
     unconditionally, so a band whose growth had reverted it to HOLE was
     announced as accepted four lines under its own failure. */
  const head = r.accepted ? 'accepted' : `NOT ACCEPTED (grew past ${Math.round(r.acc.h * GROWTH)}px)`;
  console.log(`${head}: ${r.view} ${r.route} ${r.h}px, between "${r.after}" and "${r.before}" — ${r.acc.why}`);
}
/* A hole prints the pair it sits between, because that pair is what an
   acceptance is keyed on: anyone accepting this band has the two strings to
   paste in, and anyone reading the failure has where it is in words. */
for (const r of holes) console.log(`hole: ${r.view} ${r.route} ${r.h}px, between "${r.after}" and "${r.before}"`);
for (const a of stale) console.log(`STALE ACCEPTANCE (not a failure): ${a.view} ${a.route} ${a.h}px between "${a.after}" and "${a.before}" is no longer a hole there — delete the entry.`);
console.log(`\n${holes.length} hole(s) in ${all.length} band(s) ≥ one --pause across ${ROUTES.length} routes at ${VIEWS.length} viewport(s), ${usedAcc.size} accepted.`);
process.exitCode = holes.length ? 1 : 0;
/* stdout is a pipe under tools/gates.mjs; no process.exit() here — see the
   note at the foot of glyph-floor.mjs. */
