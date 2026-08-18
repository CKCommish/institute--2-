/* Build blind A/B comparison sheets: our render vs the reference, randomized.
   usage: node tools/blind.mjs <ourShotsDir> <viewport:desktop|mobile> <outDir>
   Writes outDir/pair-NN.png (side by side, unlabeled) and a key at outDir/.key.json
   which critics are instructed not to open. */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const [ourDir, tag = 'desktop', outDir = 'progress/blind'] = process.argv.slice(2);
if (!ourDir) { console.error('need <ourShotsDir>'); process.exit(1); }
const refDir = 'refs/oryzo';

const list = (dir, t) => fs.existsSync(dir)
  ? fs.readdirSync(dir).filter((f) => f.startsWith(t + '-') && f.endsWith('.png') && !f.includes('full')).sort()
  : [];

const ours = list(ourDir, tag).map((f) => path.join(ourDir, f));
const refs = list(refDir, tag).map((f) => path.join(refDir, f));
if (!ours.length || !refs.length) { console.error('missing shots', ours.length, refs.length); process.exit(1); }

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const n = Math.min(ours.length, refs.length);
const key = [];
const W = tag === 'mobile' ? 420 : 900;
const GAP = 26;

for (let i = 0; i < n; i++) {
  // even spread across both scrolls
  const a = ours[Math.round((i / (n - 1)) * (ours.length - 1)) || 0];
  const b = refs[Math.round((i / (n - 1)) * (refs.length - 1)) || 0];
  const flip = Math.random() < 0.5;
  const left = flip ? b : a;
  const right = flip ? a : b;
  key.push({ pair: i + 1, left: flip ? 'reference' : 'ours', right: flip ? 'ours' : 'reference', leftFile: left, rightFile: right });

  const [lb, rb] = await Promise.all([
    sharp(left).resize({ width: W }).toBuffer(),
    sharp(right).resize({ width: W }).toBuffer(),
  ]);
  const lm = await sharp(lb).metadata();
  const rm = await sharp(rb).metadata();
  const H = Math.max(lm.height, rm.height);
  await sharp({ create: { width: W * 2 + GAP, height: H + 44, channels: 3, background: '#1a1a1a' } })
    .composite([
      { input: lb, top: 44, left: 0 },
      { input: rb, top: 44, left: W + GAP },
      { input: Buffer.from(`<svg width="${W * 2 + GAP}" height="44"><rect width="100%" height="44" fill="#1a1a1a"/><text x="${W / 2}" y="29" font-family="sans-serif" font-size="19" fill="#eee" text-anchor="middle">A</text><text x="${W + GAP + W / 2}" y="29" font-family="sans-serif" font-size="19" fill="#eee" text-anchor="middle">B</text></svg>`), top: 0, left: 0 },
    ])
    .png()
    .toFile(path.join(outDir, `pair-${String(i + 1).padStart(2, '0')}.png`));
}
fs.writeFileSync(path.join(outDir, '.key.json'), JSON.stringify(key, null, 2));
console.log(`${n} blind pairs → ${outDir}/pair-01..${String(n).padStart(2, '0')}.png`);
