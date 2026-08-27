/* gates — every gate, one build, one verdict.

   ── WHY ──────────────────────────────────────────────────────────────────
   Six gates cost a builder a serious fraction of a wave, and two things had
   started to happen. Wave 12: two builders ran the meters at the same time
   against the same served build and one of them reported a failure that was
   not there. And the wave-12 judge named `nojs-diff`'s 9m14s as the thing
   most likely to stop people running the suite at all.

   Both are fixed here, and neither is fixed by making a meter less careful.

     ISOLATION.  This script builds to its own `dist-gates-<hash>` and serves
                 it on a port the OS hands out, so two builders running it at
                 the same moment share nothing at all — not a port, not a
                 directory, not a browser profile. There is no lock to take
                 and none to forget.
     PARALLEL.   Gates run in a pool, longest-first. `nojs-diff` and
                 `glyph-floor` also parallelise internally, so the pool is
                 deliberately narrow — three at a time on a machine with a
                 handful of cores is where this stopped getting faster.
     CACHE.      A gate's result is keyed by the hash of everything that can
                 change what it measures: the source tree AND the gate's own
                 file. Re-running against an unchanged build reprints the
                 stored verdict in under a second, so "run the gates again
                 before you report" costs nothing when nothing moved.
                 `--fresh` ignores the cache.

   ── HOW A GATE PASSES ────────────────────────────────────────────────────
   Most of these tools do not set an exit code; they print a counted summary
   line. So each gate declares the pattern its verdict is on, and a gate
   whose pattern does not match is FAILED, not passed — an unreadable verdict
   is the one failure mode a runner must never wave through.

   usage: node tools/gates.mjs [--fresh] [--only=audit,glyph-floor] [--pool=3]
          node tools/gates.mjs --serve      (build + serve, print BASE, hold) */
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import sirv from 'sirv';

const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const has = (k) => process.argv.includes(`--${k}`);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const POOL = Number(arg('pool', '3'));
const ONLY = arg('only', '') ? arg('only', '').split(',') : null;

/* Everything that can change what a gate measures. Not `tools/` wholesale:
   editing one meter should not throw away another meter's cached result. */
function hashTree(dir, h) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) hashTree(p, h);
    else { h.update(p.slice(ROOT.length)); h.update(fs.readFileSync(p)); }
  }
  return h;
}
const srcHash = (() => {
  const h = createHash('sha1');
  for (const d of ['src', 'public', 'astro.config.mjs', 'package.json']) {
    const p = path.join(ROOT, d);
    if (!fs.existsSync(p)) continue;
    if (fs.statSync(p).isDirectory()) hashTree(p, h);
    else { h.update(d); h.update(fs.readFileSync(p)); }
  }
  return h.digest('hex').slice(0, 12);
})();

/* ── WHY THERE ARE FIVE OF THESE AND NOT SEVEN ───────────────────────────
   Wave 14 replaced three overlapping contrast meters with one. `photo-meter`,
   `hold-meter` and `ink-floor` all asked "how much contrast has this type
   got", each with a different compositing model and so a different blind
   spot: no ancestor opacity, seventeen fixed samples on one scene, and — the
   one that was hiding a live 2.745:1 defect — no term at all for anything
   painted in FRONT of the glyphs, such as the nav's scrim tail. Between them
   they quoted one piece of type at 9.38, 7.19, 4.70 and 4.17.
   `glyph-floor` measures the same quantity by subtracting a frame with the
   glyphs hidden from the frame as it ships, so the ink is read off the glass
   rather than modelled, for every string on the site rather than only those
   over photographs. It is a strict superset of all three. `ink-floor` and
   `hold-meter` are deleted; `photo-meter` keeps only its picture-grade half
   and is a diagnostic now, with no threshold to gate on. */
const GATES = [
  { name: 'nojs-diff',   cmd: ['tools/nojs-diff.mjs'],   want: /(\d+) finding\(s\)/,  cost: 9 },
  { name: 'glyph-floor', cmd: ['tools/glyph-floor.mjs'], want: /(\d+) failure\(s\)/,  cost: 9 },
  { name: 'nojs-meter',  cmd: ['tools/nojs-meter.mjs'],  want: /(\d+) issue\(s\)/,    cost: 4 },
  { name: 'audit',       cmd: ['tools/audit.mjs'],       want: /(\d+) issue\(s\)/,    cost: 3 },
  /* perf has no counted line: it prints its own verdict in words. */
  { name: 'perf',        cmd: ['tools/perf.mjs'],        want: /layout shift: all routes under 0\.1/, cost: 2, headline: /slowest LCP:.*/ },
].filter((g) => !ONLY || ONLY.includes(g.name));

const run = (cmd, args, env) => new Promise((res) => {
  const ps = spawn(cmd, args, { cwd: ROOT, env: { ...process.env, ...env } });
  let out = '';
  ps.stdout.on('data', (d) => { out += d; });
  ps.stderr.on('data', (d) => { out += d; });
  ps.on('close', (code) => res({ code, out }));
});

const outDir = `dist-gates-${srcHash}`;
const cacheDir = path.join(ROOT, '.gate-cache');
fs.mkdirSync(cacheDir, { recursive: true });

/* BUILD — skipped when the tree has not moved since this dir was built. */
if (!fs.existsSync(path.join(ROOT, outDir, 'index.html')) || has('fresh')) {
  process.stdout.write(`building ${outDir} … `);
  const t = Date.now();
  const b = await run('npx', ['astro', 'build', '--outDir', outDir]);
  if (b.code !== 0) { console.log('\n' + b.out); process.exit(1); }
  console.log(`${((Date.now() - t) / 1000).toFixed(1)}s`);
} else {
  console.log(`build ${outDir} is current (src ${srcHash})`);
}

/* SERVE — on whatever port the OS is willing to give this process. Two
   builders running this at the same time cannot collide. */
const assets = sirv(path.join(ROOT, outDir), { dev: true, extensions: ['html'] });
const server = createServer((req, res) => assets(req, res, () => { res.statusCode = 404; res.end('404'); }));
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}`;

if (has('serve')) {
  console.log(`BASE=${BASE}   (ctrl-c to stop)`);
  await new Promise(() => {});
}

console.log(`${BASE} · ${GATES.length} gates, pool ${POOL}\n`);

const results = new Array(GATES.length);
let next = 0;
const t0 = Date.now();
await Promise.all(Array.from({ length: Math.min(POOL, GATES.length) }, async () => {
  while (true) {
    const i = next++;
    if (i >= GATES.length) break;
    const g = GATES[i];
    const key = createHash('sha1')
      .update(srcHash).update(g.name)
      .update(fs.readFileSync(path.join(ROOT, g.cmd[0])))
      .digest('hex').slice(0, 16);
    const cacheFile = path.join(cacheDir, `${key}.json`);
    if (!has('fresh') && fs.existsSync(cacheFile)) {
      const c = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      results[i] = { ...c, cached: true };
      console.log(`  ${c.ok ? 'PASS' : 'FAIL'}  ${g.name.padEnd(12)} ${String(c.line).padEnd(52)} (cached)`);
      continue;
    }
    const t = Date.now();
    const r = await run('node', [...g.cmd], { BASE });
    const m = r.out.match(g.want);
    /* An unreadable verdict fails. A summary line that stopped matching means
       the meter changed shape, and "no match" must never read as "clean". */
    const ok = !!m && (m[1] === undefined ? true : Number(m[1]) === 0) && r.code === 0;
    const line = m ? (g.headline ? (r.out.match(g.headline) || [''])[0] : m[0]) : 'no verdict line matched';
    const rec = { name: g.name, ok, line, secs: +((Date.now() - t) / 1000).toFixed(1), out: r.out };
    fs.writeFileSync(cacheFile, JSON.stringify(rec));
    results[i] = rec;
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${g.name.padEnd(12)} ${String(line).padEnd(52)} ${rec.secs}s`);
  }
}));
server.close();

const failed = results.filter((r) => !r.ok);
console.log('');
for (const f of failed) console.log(`── ${f.name} ──\n${f.out}`);
console.log(`${failed.length ? failed.map((f) => f.name).join(', ') + ' FAILED' : 'all gates green'} · ${((Date.now() - t0) / 1000).toFixed(1)}s wall · src ${srcHash}`);
process.exit(failed.length ? 1 : 0);
