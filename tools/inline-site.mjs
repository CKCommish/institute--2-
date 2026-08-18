/* Fold the built site into one self-contained HTML file so it can be published
   and browsed without a server. All six routes live in the document; a tiny
   hash router swaps them. Fonts and images are inlined as data URIs, using the
   @1200 variants to stay inside the artifact size budget.
   usage: node tools/inline-site.mjs <distDir> <out.html> */
import fs from 'node:fs';
import path from 'node:path';

const [dist = 'dist', out = 'progress/preview.html'] = process.argv.slice(2);
const ROUTES = [
  ['/', 'index.html'],
  ['/pilots/', 'pilots/index.html'],
  ['/institute/', 'institute/index.html'],
  ['/forum/', 'forum/index.html'],
  ['/people/', 'people/index.html'],
  ['/partner/', 'partner/index.html'],
];

const read = (p) => fs.readFileSync(path.join(dist, p), 'utf8');
const mime = (f) => ({ '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' }[path.extname(f).toLowerCase()] || 'application/octet-stream');

/* Prefer the smallest acceptable variant of a media asset. */
const cache = new Map();
function dataUri(urlPath) {
  if (cache.has(urlPath)) return cache.get(urlPath);
  const clean = urlPath.split('?')[0];
  let file = path.join(dist, clean);
  if (clean.startsWith('/media/')) {
    const ext = path.extname(clean);
    const stem = clean.slice(0, -ext.length);
    for (const cand of [`${stem}@1200.webp`, `${stem}@1200${ext}`, `${stem}.webp`, clean]) {
      const p = path.join(dist, cand);
      if (fs.existsSync(p)) { file = p; break; }
    }
  }
  if (!fs.existsSync(file)) { cache.set(urlPath, urlPath); return urlPath; }
  const uri = `data:${mime(file)};base64,${fs.readFileSync(file).toString('base64')}`;
  cache.set(urlPath, uri);
  return uri;
}

const inlineAssets = (s) =>
  s.replace(/(["'(])(\/(?:media|fonts)\/[^"')\s]+)(["')])/g, (m, a, url, b) => a + dataUri(url) + b);

/* ── Gather every page's CSS, JS and <main> ─────────────────────────── */
const css = new Map();
const js = new Map();
const mains = [];

for (const [route, file] of ROUTES) {
  const html = read(file);
  for (const m of html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)) {
    if (!css.has(m[1])) css.set(m[1], read(m[1].replace(/^\//, '')));
  }
  for (const m of html.matchAll(/<style>([\s\S]*?)<\/style>/g)) {
    const k = 'inline:' + m[1].slice(0, 60);
    if (!css.has(k)) css.set(k, m[1]);
  }
  for (const m of html.matchAll(/<script type="module" src="([^"]+)"><\/script>/g)) {
    if (!js.has(m[1])) js.set(m[1], read(m[1].replace(/^\//, '')));
  }
  /* Astro inlines small module scripts rather than emitting a file. */
  for (const m of html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)) {
    const k = 'inline:' + m[1].slice(0, 80);
    if (!js.has(k)) js.set(k, m[1]);
  }
  const s = html.indexOf('<main');
  const e = html.lastIndexOf('</main>');
  const inner = html.slice(html.indexOf('>', s) + 1, e);
  mains.push({ route, inner });
}

const shell = read('index.html');
const headStart = shell.indexOf('<head>') + 6;
const headEnd = shell.indexOf('</head>');
let head = shell.slice(headStart, headEnd)
  .replace(/<link rel="stylesheet"[^>]*>/g, '')
  .replace(/<link rel="preload"[^>]*>/g, '')
  .replace(/<style>[\s\S]*?<\/style>/g, '');

const bodyStart = shell.indexOf('<body') ;
const body = shell.slice(shell.indexOf('>', bodyStart) + 1, shell.lastIndexOf('</body>'));
const mainStart = body.indexOf('<main');
const mainEnd = body.lastIndexOf('</main>') + 7;
const beforeMain = body.slice(0, mainStart);
const afterMain = body.slice(mainEnd).replace(/<script type="module"[^>]*><\/script>/g, '');

const routesHtml = mains.map(({ route, inner }) =>
  `<div class="rt" data-route="${route}"${route === '/' ? '' : ' hidden'}>${inner}</div>`).join('\n');

const router = `
<script>
(function () {
  var rts = Array.prototype.slice.call(document.querySelectorAll('.rt'));
  function show(p, push) {
    var found = false;
    rts.forEach(function (r) {
      var on = r.dataset.route === p;
      if (on) found = true;
      r.hidden = !on;
      if (on && p !== '/') {
        r.querySelectorAll('[data-reveal], .lines').forEach(function (el) { el.classList.add('is-in'); });
      }
    });
    if (!found) return false;
    document.querySelectorAll('.nav__link').forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === p);
    });
    window.scrollTo(0, 0);
    if (push) history.replaceState(null, '', '#' + p);
    document.title = (p === '/' ? 'Lion Forum Institute' : p.replace(/\\//g, '') + ' — Lion Forum Institute');
    return true;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="/"]');
    if (!a) return;
    var p = a.getAttribute('href').split('#')[0];
    if (rts.some(function (r) { return r.dataset.route === p; })) {
      e.preventDefault();
      show(p, true);
      var menu = document.querySelector('[data-menu]');
      var burger = document.querySelector('[data-burger]');
      if (menu && menu.hasAttribute('data-open')) { menu.removeAttribute('data-open'); setTimeout(function(){menu.hidden = true;}, 460); document.documentElement.style.overflow=''; if (burger) burger.setAttribute('aria-expanded','false'); }
    }
  });
  window.addEventListener('hashchange', function () { show(location.hash.slice(1) || '/', false); });
  if (location.hash) show(location.hash.slice(1), false);
})();
</script>`;

let doc = `<title>Lion Forum Institute</title>
${head}
<style>
${[...css.values()].join('\n')}
.rt[hidden] { display: none; }
</style>
${beforeMain}
<main id="main">
${routesHtml}
</main>
${afterMain}
${[...js.values()].map((s) => `<script type="module">${s}</script>`).join('\n')}
${router}`;

doc = inlineAssets(doc);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, doc);
console.log(out, (Buffer.byteLength(doc) / 1e6).toFixed(2), 'MB ·', css.size, 'css ·', js.size, 'js ·', mains.length, 'routes');
