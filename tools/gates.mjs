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
                 code — its entry file and every local module it imports,
                 transitively. Re-running against an unchanged build reprints the
                 stored verdict in under a second, so "run the gates again
                 before you report" costs nothing when nothing moved.
                 `--fresh` ignores the cache.

   ── HOW A GATE PASSES ────────────────────────────────────────────────────
   Most of these tools do not set an exit code; they print a counted summary
   line. So each gate declares the pattern its verdict is on, and a gate
   whose pattern does not match is not passed. It is an ERROR, distinct from
   a FAIL: see PASS / FAIL / ERROR below. Exit 0 green, 1 failed, 2 no verdict.

   usage: node tools/gates.mjs [--fresh] [--only=audit,glyph-floor] [--pool=3]
                     [--timeout=75]   minutes before a silent gate is killed
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
const TIMEOUT_MS = Number(arg('timeout', '75')) * 60_000;

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
  /* The COUNT is the pass/fail, but on its own it is the number the wave-18
     judge misread: glyph-floor's 0 is a verdict under a reading rule
     (--edge-rows), and sub-budget readings it sets aside as slivers are
     part of what that 0 means. The tool says so in its own verdict line
     as of wave 19; this row used to reprint only the matched `want`
     fragment, so the ONE line every wave actually quotes dropped the
     rule and the census again. `headline` reprints the whole sentence. */
  { name: 'glyph-floor', cmd: ['tools/glyph-floor.mjs'], want: /(\d+) failure\(s\)/,  cost: 9,
    headline: /\d+ failure\(s\) in [^\n]*\./ },
  { name: 'nojs-meter',  cmd: ['tools/nojs-meter.mjs'],  want: /(\d+) issue\(s\)/,    cost: 4 },
  { name: 'audit',       cmd: ['tools/audit.mjs'],       want: /(\d+) issue\(s\)/,    cost: 3 },
  /* perf has no counted line: it prints its own verdict in words. */
  /* perf is the one gate whose PASS is the presence of a sentence rather
     than a count of zero, so the absence of that sentence has two possible
     meanings and needs a second pattern to tell them apart: `fail` is the
     line perf prints when a route DOES shift. Without it, a real layout
     shift would be reported as "could not tell", which is the opposite of
     the point of this runner. */
  { name: 'perf',        cmd: ['tools/perf.mjs'],        want: /layout shift: all routes under 0\.1/, fail: /layout shift over 0\.1:.*/, cost: 2, headline: /slowest LCP:.*/ },
].filter((g) => !ONLY || ONLY.includes(g.name));

/* THE CHILD'S DEATH IS PART OF ITS VERDICT — and the obvious suspect was
   the wrong one, so it is written down here.
   Wave 15's judge saw `glyph-floor` inside this pool stop after
   `mobile /partner/` with 168KB of output and no total, while the same tool
   run by hand finished every time. The natural reading is resource
   contention: two browser-driving gates, four cores, something gets killed.
   That reading is WRONG, and acting on it would have bought a retry that
   fails identically. `mobile /partner/` is the LAST of the twelve
   route-views, so nothing was killed mid-sweep — the sweep finished and the
   summary was lost.
   The cause is `process.exit()` in the child. Node writes to a TTY or a file
   synchronously and to a PIPE asynchronously, and `process.exit()` discards
   whatever is still queued. Every child here is spawned onto a pipe.
   Measured with a 242,929-byte child: through a pipe, 10,690 bytes arrived
   and the stream stopped mid-line, exit code 1, no signal, no error; to a
   file, all 242,929. That is the coin flip, and it is fixed in the meters
   themselves — see the note at the foot of `glyph-floor.mjs`.
   The signal and exit code are still captured, because a killed child IS a
   real failure mode and it must not read as a FAIL: that distinction is what
   the rest of this file is for. */
const run = (cmd, args, env) => new Promise((res) => {
  const ps = spawn(cmd, args, { cwd: ROOT, env: { ...process.env, ...env } });
  let out = '';
  let timedOut = false;
  ps.stdout.on('data', (d) => { out += d; });
  ps.stderr.on('data', (d) => { out += d; });
  ps.on('error', (e) => res({ code: null, signal: null, spawnError: e.message, out }));
  /* A gate that never returns is the third way to have no verdict, and the
     only one this runner could not previously survive: it would wait for
     ever and the builder would kill the whole suite. Killed on the clock,
     it becomes an ERROR like any other, and the retry-alone pass gets a
     turn at it. `glyph-floor` runs ~28 minutes, so the ceiling is well
     above it rather than near it — this is a deadlock catcher, not a
     budget. */
  const timer = setTimeout(() => { timedOut = true; ps.kill('SIGKILL'); }, TIMEOUT_MS);
  ps.on('close', (code, signal) => { clearTimeout(timer); res({ code, signal, timedOut, out }); });
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
  if (r.timedOut) return { st: 'ERROR', line: `no verdict after ${TIMEOUT_MS / 60000}min — killed. ${outKB(r.out)} of output` };
  if (r.signal) return { st: 'ERROR', line: `killed by ${r.signal} after ${outKB(r.out)} of output — no verdict` };
  if (!m) {
    const f = g.fail && r.out.match(g.fail);
    if (f) return { st: 'FAIL', line: f[0], n: null };
    return { st: 'ERROR', line: `exit ${r.code}, ${outKB(r.out)} of output, no verdict line matched ${g.want}` };
  }
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
  /* Same flush rule as the verdict at the foot of this file: dump the build
     log, set the code, and let Node leave once stdout has drained. A build
     failure is exactly when you need every line of it. */
  if (b.code !== 0) { console.log('\n' + b.out); await new Promise((r) => process.stdout.write('', r)); process.exit(1); }
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

/* ── WHAT A GATE'S CACHED VERDICT IS KEYED ON ────────────────────────────
   The source tree, the gate's name, and THE GATE'S OWN CODE. That last part
   is the one to get right, and it was two thirds right: it read the entry
   file and stopped there. Every meter here imports local helpers —
   `browser.mjs` for the launch flags, `pixel-contrast.mjs` for `audit` and
   `nojs-meter`'s sampling — and editing one of those changed what the gate
   MEASURED while leaving its cache key untouched. A gate that can vouch for
   itself with a stale answer is the failure mode this whole runner exists to
   prevent, and this project has shipped six defects through green gates.

   So the key walks the gate's local import graph, transitively, and hashes
   every file in it. Package imports are not followed: `package.json` is
   already in `srcHash`, and node_modules is not a thing a builder edits
   mid-wave. It is still not `tools/` wholesale — editing one meter must not
   throw away another meter's verdict — it is exactly the code that runs. */
const localDeps = (entry, seen = new Set()) => {
  const abs = path.resolve(entry);
  if (seen.has(abs) || !fs.existsSync(abs)) return seen;
  seen.add(abs);
  const src = fs.readFileSync(abs, 'utf8');
  for (const m of src.matchAll(/(?:^|[\s({;])(?:import|export)[^'"\n]*?from\s*['"](\.[^'"]+)['"]|\bimport\s*\(\s*['"](\.[^'"]+)['"]\s*\)/g))
    localDeps(path.resolve(path.dirname(abs), m[1] || m[2]), seen);
  return seen;
};
const cacheKey = (g) => {
  const h = createHash('sha1').update(srcHash).update(g.name);
  for (const f of [...localDeps(path.join(ROOT, g.cmd[0]))].sort()) {
    h.update(f.slice(ROOT.length));
    h.update(fs.readFileSync(f));
  }
  return path.join(cacheDir, h.digest('hex').slice(0, 16) + '.json');
};

const show = (st, g, line, tail) =>
  console.log(`  ${st.padEnd(5)} ${g.name.padEnd(12)} ${String(line).slice(0, 200).padEnd(78)} ${tail}`);

async function attempt(g) {
  const t = Date.now();
  const r = await run('node', [...g.cmd], { BASE });
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

/* ── THE SECOND PASS ──────────────────────────────────────────────────────
   A gate that gave no verdict is retried once, alone, with the pool drained.
   Be clear about what this is and is not for. It does NOT fix the truncation
   that made `glyph-floor` a coin flip — that was the child discarding its own
   stdout, and it would have truncated identically on a serial retry. It was
   fixed in the meters. Keeping the retry anyway is cheap and covers the
   failures that ARE load-shaped: a browser that could not launch, a port that
   was busy, a machine that was momentarily out of memory because another
   builder was running their own sweep.
   If the retry also gives no verdict, the ERROR stands and is reported AS an
   error. An honest "could not tell" is the correct output. It is not a FAIL,
   and the exit code says so. */
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
for (const f of [...errs, ...fails]) console.log(`── ${f.name} (${f.st}) ──\n${f.out}`);

/* Three outcomes, three sentences, three exit codes. A caller that greps
   for "FAILED" must not be told that by a run which simply could not see. */
const wall = `${((Date.now() - t0) / 1000).toFixed(1)}s wall · src ${srcHash}`;
if (errs.length) {
  console.log(`NO VERDICT from ${errs.map((r) => r.name).join(', ')} — the suite could not measure ${errs.length === 1 ? 'it' : 'them'}, which is not the same as passing or failing. ${fails.length ? fails.map((f) => `${f.name}${f.n == null ? '' : ` ${f.n}`}`).join(', ') + ' also FAILED. ' : ''}${wall}`);
} else {
  console.log(`${fails.length ? fails.map((f) => `${f.name}${f.n == null ? '' : ` (${f.n})`}`).join(', ') + ' FAILED' : 'all gates green'} · ${wall}`);
}

/* AND NOT `process.exit()` HERE EITHER, for the reason written at length in
   `glyph-floor.mjs`. This script reprints every failing gate's whole output
   — for `glyph-floor` that is upward of 168KB — and then exits. Redirected
   to a file that is safe, because Node writes to files synchronously. Piped
   to `tee`, `less` or another agent, it is the same silent truncation that
   made this suite's headline gate a coin flip, one level up: the verdict is
   the LAST line printed, so the verdict is the first thing lost. */
process.exitCode = errs.length ? 2 : fails.length ? 1 : 0;
