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
   whose pattern does not match is not passed. It is an ERROR, distinct from
   a FAIL: see PASS / FAIL / ERROR below. Exit 0 green, 1 failed, 2 no verdict.

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

/* The child's death is part of its verdict. A meter that is OOM-killed
   mid-print leaves a truncated stdout with no summary line, which is
   character-for-character what a meter that CHANGED SHAPE leaves — and
   wave 15's judge hit exactly that: `glyph-floor` inside the pool stopped
   after `mobile /partner/` with 168KB of output and no total, while the
   same tool run alone finished. So capture the signal and the exit code,
   not just the text. `close` fires with (null, 'SIGKILL') for a kernel
   OOM kill; that is the one fact that separates "it failed" from
   "it never got to say". */
const run = (cmd, args, env) => new Promise((res) => {
  const ps = spawn(cmd, args, { cwd: ROOT, env: { ...process.env, ...env } });
  let out = '';
  ps.stdout.on('data', (d) => { out += d; });
  ps.stderr.on('data', (d) => { out += d; });
  ps.on('error', (e) => res({ code: null, signal: null, spawnError: e.message, out }));
  ps.on('close', (code, signal) => res({ code, signal, out }));
});

/* ── PASS / FAIL / ERROR ─────────────────────────────────────────────────
   This runner used to have two states, and a project that has shipped six
   defects through green gates cannot afford a red whose meaning is
   ambiguous. Three states now, and only the first is green:

     PASS   the verdict line matched and its count is zero.
     FAIL   the verdict line matched and its count is not zero. A NUMBER.
            This is the meter working — the site is what is wrong.
     ERROR  the meter did not deliver a verdict at all. Killed by a signal,
            failed to spawn, or exited having printed no line the gate
            recognises. The site may be perfect or ruined; this run cannot
            tell you which, and it must not be reported as if it could.

   ERROR is never cached: a result that means "ask again" is the one result
   it would be wrong to remember. */
function classify(g, r) {
  const m = r.out.match(g.want);
  const n = m ? (m[1] === undefined ? 0 : Number(m[1])) : null;
  if (r.spawnError) return { st: 'ERROR', line: `could not start: ${r.spawnError}` };
  if (r.signal) return { st: 'ERROR', line: `killed by ${r.signal} after ${outKB(r.out)} of output — no verdict` };
  if (!m) return { st: 'ERROR', line: `exit ${r.code}, ${outKB(r.out)} of output, no verdict line matched ${g.want}` };
  const line = g.headline ? (r.out.match(g.headline) || [''])[0] : m[0];
  if (n === 0 && r.code === 0) return { st: 'PASS', line, n };
  if (n === 0 && r.code !== 0) return { st: 'ERROR', line: `verdict says 0 but the meter exited ${r.code} — ${line}` };
  return { st: 'FAIL', line, n };
}
const outKB = (s) => `${(Buffer.byteLength(s) / 1024).toFixed(0)}KB`;

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

const cacheKey = (g) => path.join(cacheDir, createHash('sha1')
  .update(srcHash).update(g.name)
  .update(fs.readFileSync(path.join(ROOT, g.cmd[0])))
  .digest('hex').slice(0, 16) + '.json');

const show = (st, g, line, tail) =>
  console.log(`  ${st.padEnd(5)} ${g.name.padEnd(12)} ${String(line).slice(0, 78).padEnd(78)} ${tail}`);

async function attempt(g, extra = []) {
  const t = Date.now();
  const r = await run('node', [...g.cmd, ...extra], { BASE });
  const c = classify(g, r);
  return { name: g.name, st: c.st, ok: c.st === 'PASS', n: c.n ?? null, line: c.line,
           secs: +((Date.now() - t) / 1000).toFixed(1), out: r.out };
}

const results = new Array(GATES.length);
let next = 0;
const t0 = Date.now();
await Promise.all(Array.from({ length: Math.min(POOL, GATES.length) }, async () => {
  while (true) {
    const i = next++;
    if (i >= GATES.length) break;
    const g = GATES[i];
    const cacheFile = cacheKey(g);
    /* A cached record from before PASS/FAIL/ERROR existed carries only
       `ok`, and its false could mean either — which is the very ambiguity
       this runner now exists to remove. Those entries are not readable, so
       they are re-run rather than believed. */
    const c = !has('fresh') && fs.existsSync(cacheFile)
      ? JSON.parse(fs.readFileSync(cacheFile, 'utf8')) : null;
    if (c && c.st) {
      results[i] = { ...c, cached: true };
      show(c.st, g, c.line, '(cached)');
      continue;
    }
    const rec = await attempt(g);
    if (rec.st !== 'ERROR') fs.writeFileSync(cacheFile, JSON.stringify(rec));
    results[i] = rec;
    show(rec.st, g, rec.line, `${rec.secs}s`);
  }
}));

/* ── THE SECOND PASS, AND WHY IT IS SERIAL ───────────────────────────────
   The pool is why a gate dies. `glyph-floor` holds four Chromium contexts
   shooting 3x frames; `nojs-diff` holds four more with two pages each; on a
   four-core box they overlap and the kernel picks one to kill. Standalone,
   `glyph-floor` finishes every time — the wave-15 judge saw both halves of
   that and could not close the gap.
   So a gate that ERRORed is retried ALONE, with nothing else running and
   with the pool drained. That is slower than the parallel run by exactly
   the cost of the gate, and it is the difference between a suite that
   sometimes cannot answer and one that always can. If the retry also
   ERRORs, the ERROR stands and is reported as an ERROR — an honest "could
   not tell" is the correct output, and it is not a FAIL. */
const errored = results.map((r, i) => [r, i]).filter(([r]) => r.st === 'ERROR' && !r.cached);
if (errored.length) {
  console.log(`\n  ${errored.length} gate(s) gave no verdict under pool ${POOL}. Retrying alone, serially:`);
  for (const [, i] of errored) {
    const g = GATES[i];
    const rec = await attempt(g);
    rec.retried = true;
    if (rec.st !== 'ERROR') fs.writeFileSync(cacheKey(g), JSON.stringify(rec));
    results[i] = rec;
    show(rec.st, g, rec.line, `${rec.secs}s (alone)`);
  }
}
server.close();

const errs = results.filter((r) => r.st === 'ERROR');
const fails = results.filter((r) => r.st === 'FAIL');
console.log('');
for (const f of [...errs, ...fails]) console.log(`── ${f.name} (${f.st}) ──\n${f.out.slice(-20000)}`);

/* Three outcomes, three sentences, three exit codes. A caller that greps
   for "FAILED" must not be told that by a run which simply could not see. */
const wall = `${((Date.now() - t0) / 1000).toFixed(1)}s wall · src ${srcHash}`;
if (errs.length) {
  console.log(`NO VERDICT from ${errs.map((r) => r.name).join(', ')} — the suite could not measure ${errs.length === 1 ? 'it' : 'them'}, which is not the same as passing or failing. ${fails.length ? fails.map((f) => `${f.name} ${f.n}` ).join(', ') + ' also FAILED. ' : ''}${wall}`);
  process.exit(2);
}
console.log(`${fails.length ? fails.map((f) => `${f.name} (${f.n})`).join(', ') + ' FAILED' : 'all gates green'} · ${wall}`);
process.exit(fails.length ? 1 : 0);
