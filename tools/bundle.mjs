/* Fold the built site into ONE self-contained HTML file: every stylesheet,
   font and photograph inlined, all six routes present, client-side routing.
   For sharing a browsable preview — the real site ships as dist/. */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const D = 'dist';
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

/* ── css ────────────────────────────────────────────────────────────── */
const cssFiles = [...new Set(
  ROUTES.flatMap((r) => [...read(r.file).matchAll(/href="(\/_astro\/[^"]+\.css)"/g)].map((m) => m[1]))
)];
let css = '';
for (const f of cssFiles) css += fs.readFileSync(path.join(D, f.replace(/^\//, '')), 'utf8') + '\n';
css = await inlineUrls(css);

/* ── scripts (Astro already inlines them) ───────────────────────────── */
const scripts = new Map();
for (const r of ROUTES) {
  for (const m of read(r.file).matchAll(/<script type="module">([\s\S]*?)<\/script>/g)) {
    scripts.set(m[1].trim().slice(0, 120), m[1]);
  }
}

/* ── chrome + routes ────────────────────────────────────────────────── */
const home = read('index.html');
const header = '<header' + between(home, '<header', '</header>') + '</header>';
const menu = (home.match(/<div class="menu"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/) || [''])[0];
const footer = '<footer' + between(home, '<footer', '</footer>') + '</footer>';

let routesHtml = '';
for (const r of ROUTES) {
  const html = read(r.file);
  const main = between(html, '<main id="main">', '</main>');
  routesHtml += `<div class="rt" data-rt="${r.path}" ${r.path === '/' ? '' : 'hidden'}>${main}</div>\n`;
}

let body = `${header}\n${menu}\n<main id="main">\n${routesHtml}</main>\n${footer}`;
body = await inlineUrls(body);
const entify = (t) => t.replace(/[\u0080-\uFFFF]/g, (c) => '&#' + c.codePointAt(0) + ';');
/* only the markup — data: URIs are ASCII, and script/style get their own escapes */
body = entify(body);

const out = `<meta charset="utf-8">
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
  .rt[hidden]{display:none}
  html{scroll-behavior:auto}
</style>
${body}
${[...scripts.values()].map((s) => '<script type="module">' + s + '</scr' + 'ipt>').join('\n')}
<script>
/* Client-side routing for the single-file preview. The real site is six
   static HTML pages; this only exists so the whole thing can be browsed
   from one file. */
(function () {
  const routes = [...document.querySelectorAll('.rt')];
  function show(p) {
    let hit = false;
    for (const r of routes) {
      const on = r.dataset.rt === p;
      r.hidden = !on;
      if (on) hit = true;
    }
    if (!hit) { routes[0].hidden = false; p = '/'; }
    /* Reveals are entry-triggered by IntersectionObserver, which never fired
       for a route that was hidden at load. Settle the incoming route so it is
       never stuck invisible. */
    const vis = routes.find((r) => !r.hidden);
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

fs.mkdirSync('progress', { recursive: true });
fs.writeFileSync('progress/site.html', out);
console.log('progress/site.html', (Buffer.byteLength(out) / 1e6).toFixed(2), 'MB ·', assets.size, 'assets inlined');
