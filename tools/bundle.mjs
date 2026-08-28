/* Fold the built site into ONE self-contained HTML file: every stylesheet,
   font and photograph inlined, all six routes present, client-side routing.
   For sharing a browsable preview — the real site ships as dist/. */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

/* `dist` and `progress/site.html` are the defaults, not the only pair:
   tools/bundle-gate.mjs builds a throwaway bundle out of its own isolated
   build so it can test the BUNDLER rather than whatever was last committed.
   Nothing else passes these. */
const D = process.env.BUNDLE_DIST || 'dist';
const OUT = process.env.BUNDLE_OUT || 'progress/site.html';
const ROUTES = [
  { path: '/', file: 'index.html', label: 'Home' },
  { path: '/institute/', file: 'institute/index.html', label: 'Institute' },
  { path: '/pilots/', file: 'pilots/index.html', label: 'Pilots' },
  { path: '/forum/', file: 'forum/index.html', label: 'Forum' },
  { path: '/people/', file: 'people/index.html', label: 'People' },
  { path: '/partner/', file: 'partner/index.html', label: 'Partner' },
];

const read = (f) => fs.readFileSync(path.join(D, f), 'utf8');
const between = (s, open, close) => {
  const i = s.indexOf(open); if (i < 0) return '';
  const j = s.indexOf(close, i); return j < 0 ? '' : s.slice(i + open.length, j);
};

/* ── assets ─────────────────────────────────────────────────────────── */
const assets = new Map();
async function dataUri(url) {
  if (assets.has(url)) return assets.get(url);
  const file = path.join(D, url.replace(/^\//, ''));
  if (!fs.existsSync(file)) return url;
  let uri;
  if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
    const wide = /hero|forum|institute/.test(file) ? 2000 : 1500;
    const buf = await sharp(file).resize({ width: wide, withoutEnlargement: true }).webp({ quality: 68 }).toBuffer();
    uri = 'data:image/webp;base64,' + buf.toString('base64');
  } else if (/\.woff2$/i.test(file)) {
    uri = 'data:font/woff2;base64,' + fs.readFileSync(file).toString('base64');
  } else if (/\.svg$/i.test(file)) {
    uri = 'data:image/svg+xml;base64,' + fs.readFileSync(file).toString('base64');
  } else return url;
  assets.set(url, uri);
  return uri;
}

async function inlineUrls(text) {
  const urls = [...new Set(text.match(/\/(?:media|fonts|favicon)[^"')\s]*/g) || [])];
  for (const u of urls) {
    const uri = await dataUri(u);
    if (uri !== u) text = text.split(u).join(uri);
  }
  return text;
}

/* ── css ──────────────────────────────────────────────────────────────
   Six pages' stylesheets in one document, which is a thing the site never
   is. Astro scopes component rules with a `data-astro-cid-…` attribute, so
   those are safe to concatenate: they only ever match their own component.
   A page's `:global(…)` escapes are not. They ship in that page's own
   stylesheet, they are loaded by that page alone, and in this file they are
   loaded by all six at once.

   Three of them were live, and one was doing real damage:
     forum.css      `.foot .foot__second { display: none !important }`
                    — /forum/ suppressing the footer's second link. In the
                    bundle it suppressed it under every route: on mobile the
                    footer came out 376px against the site's 469.
     pilots.css     `main:has(.pd) + footer.foot` — true on /pilots/ only, on
                    the site. Here every route shares one `<main>` and .pd is
                    always in it, so it was true everywhere.
     institute.css  `.ihero__bg`.

   Each page-exclusive rule is therefore GUARDED by the route it belongs to:
   the router writes `html[data-route="/forum/"]` and the guard makes the
   rule mean on this page what it means on the site. Shared stylesheets
   (Base, Figure — anything more than one route links) are left exactly as
   they are, and so is every rule already carrying a cid. */
const cssRoutes = new Map();
for (const r of ROUTES)
  for (const m of read(r.file).matchAll(/href="(\/_astro\/[^"]+\.css)"/g))
    cssRoutes.set(m[1], (cssRoutes.get(m[1]) || new Set()).add(r.path));
const cssFiles = [...cssRoutes.keys()];

/* Walk the sheet with a brace counter, prefix the selector of every rule
   that is not inside @keyframes and does not already carry a cid. Nested
   at-rules (@media, @supports) are transparent: their inner selectors are
   the ones that need guarding, not the at-rule itself. */
function guard(css, scope) {
  let out = '', i = 0, depth = 0, keyframes = -1;
  while (i < css.length) {
    const j = css.indexOf('{', i);
    if (j < 0) { out += css.slice(i); break; }
    const head = css.slice(i, j);
    const closeBefore = (head.match(/}/g) || []).length;
    depth -= closeBefore;
    if (keyframes >= 0 && depth <= keyframes) keyframes = -1;
    const sel = head.slice(head.lastIndexOf('}') + 1).trim();
    const lead = head.slice(0, head.lastIndexOf('}') + 1);
    let written = sel;
    if (/^@keyframes/i.test(sel)) keyframes = depth;
    else if (!/^@/.test(sel) && keyframes < 0 && sel && !/data-astro-cid/.test(sel) && !/^(html|:root)\b/.test(sel))
      written = sel.split(',').map((x) => `${scope} ${x.trim()}`).join(',');
    out += lead + written + '{';
    depth++;
    i = j + 1;
  }
  return out;
}

let css = '';
for (const f of cssFiles) {
  let sheet = fs.readFileSync(path.join(D, f.replace(/^\//, '')), 'utf8');
  const only = cssRoutes.get(f);
  if (only.size === 1) sheet = guard(sheet, `html[data-route="${[...only][0]}"]`);
  css += sheet + '\n';
}
css = await inlineUrls(css);

/* ── scripts ────────────────────────────────────────────────────────────
   Astro emits module scripts BOTH ways: small ones inline, and anything
   over its threshold as <script type="module" src="/_astro/...js">. The
   sweep below used to match only `<script type="module">` with no
   attributes, so it silently dropped every EXTERNAL one — which is where
   motion.js lives (Base.astro's script).

   The bundle therefore shipped with no motion engine at all for as long as
   this tool has existed. The failure was quiet and specific: the inline
   script still ran, so the nav still darkened on scroll and the page looked
   alive — but `initScroll`'s hold loop never existed, so the homepage's held
   Forum scene pinned for 855px of scroll with `--hp` stuck at 0 and nothing
   moving. Scrolling a full viewport and seeing a frozen picture is exactly
   what a reader calls "stuck". `.lines` headlines never split either.

   Two lessons for whoever touches this next. Matching a tag by its opening
   text and no attributes is a filter, not a match. And the bundle needs a
   check that it BEHAVES like the site, not merely that it contains the same
   bytes — see the note at the foot of this file. */
const scripts = new Map();
for (const r of ROUTES) {
  const html = read(r.file);
  /* inline: <script type="module"> … </script> */
  for (const m of html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)) {
    scripts.set(m[1].trim().slice(0, 120), m[1]);
  }
  /* external: <script type="module" src="/_astro/….js"></script> */
  for (const m of html.matchAll(/<script type="module"[^>]*\ssrc="([^"]+)"[^>]*>\s*<\/script>/g)) {
    const src = m[1];
    const file = path.join(D, src.replace(/^\//, ''));
    if (!fs.existsSync(file)) {
      throw new Error(`bundle: module script ${src} not found in dist — the bundle would ship without it`);
    }
    const code = fs.readFileSync(file, 'utf8');
    scripts.set('EXT:' + src, code);
  }
}
if (![...scripts.values()].some((s) => /data-hold-stage/.test(s))) {
  throw new Error('bundle: no script defines the held-scene loop — motion.js did not make it in');
}

/* ── chrome + routes ────────────────────────────────────────────────── */
const home = read('index.html');
const header = '<header' + between(home, '<header', '</header>') + '</header>';
const menu = (home.match(/<div class="menu"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/) || [''])[0];
/* THE FOOTER IS NOT ONE FOOTER. This file used to fold the homepage's
   footer in once and show it under all six routes. It is not the same on
   all six: /partner/ ends on "Come to the Forum." and drops the partner
   call to action, because repeating "Partner on a pilot · Start the
   conversation" at the foot of the partner page would send a reader to the
   page they are already on. /forum/ has its own variant too. The bundle was
   showing the homepage's CTA on both. Each route now carries its own,
   toggled with the route. */
const footers = ROUTES.map((r) => ({ path: r.path, html: '<footer' + between(read(r.file), '<footer', '</footer>') + '</footer>' }));

let routesHtml = '';
for (const r of ROUTES) {
  const html = read(r.file);
  const main = between(html, '<main id="main">', '</main>');
  /* NOT `hidden` at load — see THE SPLIT MEASURES WHAT IT CAN SEE below.
     `data-off` is visibility only, so the box is still laid out at its real
     width and the line splitter can measure it. The router swaps it for a
     real `hidden` once the motion modules have run. */
  routesHtml += `<div class="rt" data-rt="${r.path}"${r.path === '/' ? '' : ' data-off'}>${main}</div>\n`;
}

const footersHtml = footers.map((f) =>
  `<div class="ft" data-ft="${f.path}"${f.path === '/' ? '' : ' data-off'}>${f.html}</div>`).join('\n');
let body = `${header}\n${menu}\n<main id="main">\n${routesHtml}</main>\n${footersHtml}`;
body = await inlineUrls(body);
const entify = (t) => t.replace(/[\u0080-\uFFFF]/g, (c) => '&#' + c.codePointAt(0) + ';');
/* only the markup — data: URIs are ASCII, and script/style get their own escapes */
body = entify(body);

/* THE HEAD IS PART OF THE PAGE, and this file used to write its own two
   lines of it. It carried a charset and a title and nothing else — no
   `<meta name="viewport">` — so a phone laid the whole bundle out at the
   980px fallback width and shrank it to fit: on a 390px viewport the
   homepage measured 9817px tall against the site's 5463, the hero ran 2120px
   instead of 844, and every line of type came out at about 40% of its
   intended size. The client browses this file at both viewports. The site's
   own head is the only correct answer to what belongs here, so it is COPIED
   — the <html> open tag and every <meta> the built index.html carries, in
   its order — rather than written again from memory. Links, scripts, styles
   and the title are excluded because this file supplies its own. */
const htmlOpen = (home.match(/<html[^>]*>/) || ['<html lang="en">'])[0];
const headMeta = (between(home, '<head>', '</head>').match(/<meta[^>]*>/g) || [])
  .filter((m) => !/charset/i.test(m)).join('\n');

const out = `<!DOCTYPE html>
${htmlOpen}
<meta charset="utf-8">
${headMeta}
<title>Lion Forum Institute</title>
<!-- Base.astro sets this in <head> before first paint, and the reveal system
     gates every hidden state on it (html.js / html:not(.js) in base.css,
     Figure.astro, institute.astro). It is an is:inline script, not a module,
     so the module-only sweep below never picked it up — without it the
     bundle silently rendered the whole site in its no-JS fallback: every
     reveal already landed, no motion at all. -->
<script>document.documentElement.classList.add('js');${'</scr' + 'ipt>'}
<style>${css.replace(/[\u0080-\uFFFF]/g, (c) => '\\' + c.codePointAt(0).toString(16) + ' ')}</style>
<style>
  .rt[hidden],.ft[hidden]{display:none}
  /* Laid out, measurable, and painting nothing. The routes start here and
     the router takes them to a real hidden attribute after the modules have
     split their headlines. */
  /* overflow:clip as well as visibility. While the routes are held open for
     measurement the document is all six of them at once, and a single
     unclipped overflow anywhere in that stack expands the layout viewport
     on a phone — which would split every headline at the wrong width, the
     defect this whole arrangement exists to avoid. Belt and braces: no
     measured divergence was traced to it, and it changes no width inside. */
  html.js .rt[data-off],html.js .ft[data-off]{visibility:hidden;overflow:clip}
  /* With no script there is nothing to take data-off back off again, so
     without this the five routes held open for measurement would be five
     routes of type a no-JS reader cannot see. No script means no router
     either, so they collapse to the state the bundle has always had with
     scripts off: the homepage, and nothing under it. */
  html:not(.js) .rt[data-off],html:not(.js) .ft[data-off]{display:none}
  html{scroll-behavior:auto}
</style>
${body}
${[...scripts.values()].map((s) => '<script type="module">' + s + '</scr' + 'ipt>').join('\n')}
<script type="module">
/* Client-side routing for the single-file preview. The real site is six
   static HTML pages; this only exists so the whole thing can be browsed
   from one file.

   ── THE SPLIT MEASURES WHAT IT CAN SEE ────────────────────────────────
   A MODULE, and last, on purpose. It used to be a classic inline script,
   which runs while the document is still parsing — that is, BEFORE any
   deferred module — so it hid five of the six routes before motion.js had
   run. motion.js splits every ".lines" headline into one span per visual
   line by measuring where the text wraps, and a "display: none" element has
   no line boxes to measure: every headline on every route but the homepage
   came out as ONE span holding the whole string.

   On desktop that was a wrong line break. On a 390px viewport it was a
   route-wide type failure: the un-broken line overflowed horizontally, the
   layout viewport expanded from 390 to 417 to contain it, and every
   "clamp(…vw…)" size on the page resolved against the wider viewport —
   /people/'s h1 came out at 28px where the site sets 36.8px, and the whole
   route's geometry with it. The client browses this file at both viewports.

   So the routes ship visible-but-"data-off" (visibility only: the boxes are
   laid out at their real width and paint nothing), and stay that way until
   the split has run. Being a module and running last is NOT enough on its
   own: motion.js splits inside "document.fonts.ready.then", which resolves
   long after the last module has executed. So the collapse to a real hidden
   attribute waits on the same promise — registered later, so it runs after
   motion.js's — and on two frames after it. Until then the document is the
   full six routes tall and paints one. */
(function () {
  const routes = [...document.querySelectorAll('.rt')];
  /* Before the split: laid out, invisible. After it: display:none. */
  let split = false;
  let at = '/';
  const footers = [...document.querySelectorAll('.ft')];
  function place() {
    for (const r of routes) {
      const on = r.dataset.rt === at;
      if (split) { r.removeAttribute('data-off'); r.hidden = !on; }
      else { r.hidden = false; if (on) r.removeAttribute('data-off'); else r.setAttribute('data-off', ''); }
    }
    /* One footer per route: /partner/ and /forum/ do not carry the
       homepage's call to action. They are held open exactly as the routes
       are until the split has run — the footer carries ".lines" headlines
       too, and measured inside a display:none box they collapsed to one
       line and cost the foot of the page 85px. */
    /* The guard every page-exclusive :global rule is scoped to. */
    document.documentElement.dataset.route = at;
    /* Parallax is written only for elements within 200px of the viewport, so
       a value written while the routes were stacked for measurement — or
       while another route was showing — is simply left behind on an element
       that has since moved. Clear them; motion.js rewrites each as it comes
       back into range. */
    document.querySelectorAll('[style*="--py"]').forEach((el) => el.style.removeProperty('--py'));
    for (const f of footers) {
      const on = f.dataset.ft === at;
      if (split) { f.removeAttribute('data-off'); f.hidden = !on; }
      else { f.hidden = false; if (on) f.removeAttribute('data-off'); else f.setAttribute('data-off', ''); }
    }
  }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve())
    .then(() => new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res))))
    .then(() => { split = true; place(); });
  /* Belt and braces: if fonts.ready never resolves, the preview must not sit
     six routes tall for ever. */
  setTimeout(() => { if (!split) { split = true; place(); } }, 4000);

  function show(p) {
    let hit = routes.some((r) => r.dataset.rt === p);
    at = hit ? p : '/';
    p = at;
    place();
    /* Reveals are entry-triggered by IntersectionObserver, which never fired
       for a route that was hidden at load. Settle the incoming route so it is
       never stuck invisible. */
    const vis = routes.find((r) => r.dataset.rt === at);
    const foot = footers.find((f) => f.dataset.ft === at);
    [vis, foot].filter(Boolean).forEach((box) => box.querySelectorAll('[data-reveal],.lines,[data-wipe],[data-settle]').forEach((el) => {
      el.classList.add('is-in');
      el.style.removeProperty('clip-path');
    }));
    vis.querySelectorAll('[data-reveal],.lines,[data-wipe],[data-settle]').forEach((el) => {
      el.classList.add('is-in');
      el.style.removeProperty('clip-path');
    });
    document.querySelectorAll('a[href]').forEach((a) => {
      const h = a.getAttribute('href') || '';
      a.classList.toggle('is-active', h === p);
      if (a.closest('.nav__links')) a.classList.toggle('is-active', h === p);
    });
    window.scrollTo(0, 0);
    document.title = 'Lion Forum Institute';
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="/"]');
    if (!a) return;
    const href = a.getAttribute('href').split('#')[0];
    if (!routes.some((r) => r.dataset.rt === href)) return;
    e.preventDefault();
    history.replaceState(null, '', location.pathname + location.search);
    show(href);
    const m = document.querySelector('[data-menu]');
    if (m) { m.removeAttribute('data-open'); m.hidden = true; }
    document.documentElement.style.overflow = '';
    const b = document.querySelector('[data-burger]');
    if (b) b.setAttribute('aria-expanded', 'false');
  });
  show('/');
})();
</script>`;

fs.mkdirSync(path.dirname(OUT) || '.', { recursive: true });
fs.writeFileSync(OUT, out);
console.log(OUT, (Buffer.byteLength(out) / 1e6).toFixed(2), 'MB ·', assets.size, 'assets inlined');
