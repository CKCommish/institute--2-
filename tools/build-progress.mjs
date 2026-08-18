/* Renders progress/index.html from progress/state.json + the newest shots,
   with every image inlined so the page is self-contained. */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const state = JSON.parse(fs.readFileSync('progress/state.json', 'utf8'));
const shotsRoot = 'progress/shots';

const inline = async (file, width = 760) => {
  try {
    const buf = await sharp(file).resize({ width, withoutEnlargement: true }).webp({ quality: 72 }).toBuffer();
    return `data:image/webp;base64,${buf.toString('base64')}`;
  } catch { return null; }
};

const latestLabel = () => {
  if (!fs.existsSync(shotsRoot)) return null;
  const dirs = fs.readdirSync(shotsRoot).filter((d) => fs.statSync(path.join(shotsRoot, d)).isDirectory());
  if (!dirs.length) return null;
  return dirs.map((d) => ({ d, t: fs.statSync(path.join(shotsRoot, d)).mtimeMs }))
    .sort((a, b) => b.t - a.t)[0].d;
};

const label = process.env.SHOT_LABEL || latestLabel();
const oryzo = 'refs/oryzo';

const pick = (dir, tag, n) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.startsWith(tag + '-') && !f.includes('full')).sort().slice(0, n)
    .map((f) => path.join(dir, f));
};

const rows = [];
if (label) {
  const homeDir = path.join(shotsRoot, label, 'home');
  const ours = pick(homeDir, 'desktop', 6);
  const theirs = pick(oryzo, 'desktop', 6);
  for (let i = 0; i < Math.max(ours.length, theirs.length); i++) {
    rows.push({ a: ours[i], b: theirs[i] });
  }
}

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const pairHtml = [];
for (const r of rows) {
  const [a, b] = await Promise.all([r.a ? inline(r.a, 640) : null, r.b ? inline(r.b, 640) : null]);
  pairHtml.push(`<div class="pair">
    <figure><img loading="lazy" src="${a || ''}" alt=""><figcaption>Lion Forum Institute</figcaption></figure>
    <figure><img loading="lazy" src="${b || ''}" alt=""><figcaption>Reference — Oryzo</figcaption></figure>
  </div>`);
}

const statusClass = { building: 'b', passed: 'p', looping: 'l', queued: 'q' };

const html = `<title>Lion Forum Institute — build progress</title>
<style>
  :root { --bg:#050D16; --fg:#F2EDE3; --mute:#8FA0B0; --brass:#C4A469; --rule:#16283A; }
  :root:not([data-theme="dark"]) { }
  body { margin:0; background:var(--bg); color:var(--fg); font:15px/1.5 ui-sans-serif,-apple-system,Segoe UI,Roboto,sans-serif; }
  .wrap { max-width:1180px; margin:0 auto; padding:48px 24px 96px; }
  h1 { font:400 clamp(28px,4vw,48px)/1.05 Georgia,serif; letter-spacing:-.02em; margin:0 0 8px; }
  .sub { color:var(--mute); margin:0 0 40px; max-width:70ch; }
  .meta { display:flex; gap:20px; flex-wrap:wrap; font-size:12px; letter-spacing:.12em; text-transform:uppercase; color:var(--mute); margin-bottom:36px; }
  table { width:100%; border-collapse:collapse; margin-bottom:48px; font-size:14px; }
  th,td { text-align:left; padding:12px 10px; border-bottom:1px solid var(--rule); vertical-align:top; }
  th { font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--mute); font-weight:500; }
  .tag { display:inline-block; font-size:11px; letter-spacing:.1em; text-transform:uppercase; padding:3px 8px; border-radius:99px; border:1px solid var(--rule); }
  .tag.p { color:#8FD6A0; border-color:#274C33; }
  .tag.b { color:var(--brass); border-color:#4A3C1F; }
  .tag.l { color:#E0A87A; border-color:#4C3323; }
  .tag.q { color:var(--mute); }
  h2 { font:400 24px/1.2 Georgia,serif; margin:48px 0 6px; }
  .pair { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px; }
  .pair figure { margin:0; }
  .pair img { width:100%; display:block; border:1px solid var(--rule); background:#0A1626; }
  .pair figcaption { font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--mute); padding-top:6px; }
  ol.log { padding-left:18px; color:var(--mute); font-size:14px; }
  ol.log li { margin-bottom:8px; }
  ol.log b { color:var(--fg); font-weight:500; }
  @media (max-width:720px){ .pair{grid-template-columns:1fr;} }
</style>
<div class="wrap">
  <h1>Lion Forum Institute — build progress</h1>
  <p class="sub">${esc(state.summary)}</p>
  <div class="meta">
    <span>Wave ${state.wave} · ${esc(state.waveTitle)}</span>
    <span>Updated ${esc(state.updated)}</span>
  </div>

  <table>
    <thead><tr><th>Piece</th><th>Status</th><th>Round</th><th>Last critic verdict</th><th>Biggest gap</th></tr></thead>
    <tbody>
      ${state.pieces.map((p) => `<tr>
        <td>${esc(p.name)}</td>
        <td><span class="tag ${statusClass[p.status] || 'q'}">${esc(p.status)}</span></td>
        <td>${p.round || '—'}</td>
        <td>${esc(p.verdict) || '—'}</td>
        <td>${esc(p.gap) || '—'}</td>
      </tr>`).join('')}
    </tbody>
  </table>

  <h2>Side by side — desktop scroll</h2>
  <p class="sub">Our render (left) against the craft reference (right), same viewport, same scroll positions.</p>
  ${pairHtml.join('\n')}

  ${state.log.length ? `<h2>Log</h2><ol class="log">${state.log.map((l) => `<li><b>${esc(l.t)}</b> — ${esc(l.m)}</li>`).join('')}</ol>` : ''}
</div>`;

fs.writeFileSync('progress/index.html', html);
console.log('progress/index.html', (Buffer.byteLength(html) / 1e6).toFixed(2), 'MB', '· label:', label);
