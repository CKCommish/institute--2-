/* Wire client photographs into the site in one step.
   The client has sent these several times as pasted images, which never reach
   the filesystem; a zip does. This takes whatever actually arrives — a zip, a
   folder, or loose files — and does the whole job: identify the slot, resize,
   convert, place, and report what still has no picture.

   usage:
     node tools/add-photos.mjs <zip|folder|file...>            # auto-match
     node tools/add-photos.mjs lawn=/path/a.jpg stage=/path/b.jpg   # explicit
*/
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import sharp from 'sharp';

/* Slot → what the site does with it. Widths follow how each is rendered. */
/* A photograph placed in the wrong slot is the same class of error as a
   fabricated fact: it says something untrue and nobody notices. Testing this
   tool against the headshot zip, it cheerfully wrote a 320px portrait of a
   board member onto the Forum masthead. Hence MIN_WIDTH and the refusal to
   assign by position without being told to. */
const MIN_WIDTH = 1400;

const SLOTS = {
  lawn:      { out: 'forum-lawn',      width: 2800, hint: /lawn|dusk|flag|harbou?r|compound|hyannis|crowd|speech/i },
  stage:     { out: 'forum-stage',     width: 2400, hint: /stage|backdrop|panel|two|step.?and.?repeat/i },
  podium:    { out: 'forum-podium',    width: 2400, hint: /podium|inslee|governor|speak/i },
  notebook:  { out: 'forum-notebook',  width: 2400, hint: /notebook|speaker|scanlon|writer/i },
  reception: { out: 'forum-reception', width: 2400, hint: /reception|chopra|badge|sun|evening|mingl/i },
  founders:  { out: 'founders',        width: 2400, hint: /founder|office|judd|mckelvy|christopher|both/i },
};

const args = process.argv.slice(2);
if (!args.length) { console.error('need a zip, a folder, or files'); process.exit(1); }

/* ── collect candidate images ─────────────────────────────────────── */
const explicit = new Map();
const loose = [];
const tmp = fs.mkdtempSync('/tmp/photos-');

for (const a of args) {
  const eq = a.indexOf('=');
  if (eq > 0 && SLOTS[a.slice(0, eq)]) { explicit.set(a.slice(0, eq), a.slice(eq + 1)); continue; }
  if (!fs.existsSync(a)) { console.error('missing:', a); continue; }
  const st = fs.statSync(a);
  if (st.isDirectory()) {
    const walk = (d) => fs.readdirSync(d).forEach((f) => {
      const p = path.join(d, f);
      fs.statSync(p).isDirectory() ? walk(p) : loose.push(p);
    });
    walk(a);
  } else if (/\.zip$/i.test(a)) {
    execSync(`unzip -o -q ${JSON.stringify(a)} -d ${tmp}`);
    const walk = (d) => fs.readdirSync(d).forEach((f) => {
      const p = path.join(d, f);
      fs.statSync(p).isDirectory() ? walk(p) : loose.push(p);
    });
    walk(tmp);
  } else loose.push(a);
}

let images = loose.filter((f) => /\.(jpe?g|png|webp|tiff?)$/i.test(f) && !/__MACOSX|\/\._/.test(f));

/* Drop anything too small to be one of these frames before matching. */
const tooSmall = [];
{
  const keep = [];
  for (const f of images) {
    const m = await sharp(f).metadata().catch(() => null);
    if (!m || (m.width || 0) < MIN_WIDTH) { tooSmall.push(`${path.basename(f)} (${m ? m.width + 'x' + m.height : 'unreadable'})`); continue; }
    keep.push(f);
  }
  images = keep;
}
if (tooSmall.length) console.log(`ignored, under ${MIN_WIDTH}px wide: ${tooSmall.join(', ')}`);

/* ── match loose files to slots ───────────────────────────────────── */
const picked = new Map(explicit);
for (const [slot, cfg] of Object.entries(SLOTS)) {
  if (picked.has(slot)) continue;
  const hit = images.find((f) => cfg.hint.test(path.basename(f)) && ![...picked.values()].includes(f));
  if (hit) picked.set(slot, hit);
}
/* Anything still unmatched, offer in file order so nothing is silently lost. */
const leftoverSlots = Object.keys(SLOTS).filter((s) => !picked.has(s));
const leftoverFiles = images.filter((f) => ![...picked.values()].includes(f));
if (leftoverFiles.length) {
  const accept = args.includes('--accept-guesses');
  console.log('\nNot matched by filename:');
  leftoverFiles.forEach((f, i) => console.log(`  ${(leftoverSlots[i] || '(no slot left)').padEnd(10)} ← ${path.basename(f)}`));
  if (accept) {
    leftoverFiles.forEach((f, i) => { if (leftoverSlots[i]) picked.set(leftoverSlots[i], f); });
    console.log('  …assigned by position (--accept-guesses).');
  } else {
    console.log(`
  NOT assigned. Matching by position is a guess, and a photograph in the wrong
  slot makes a claim nobody checked. Either name them:
      node tools/add-photos.mjs lawn=<file> stage=<file> …
  or re-run with --accept-guesses if the order above is right.`);
  }
}

/* ── process ──────────────────────────────────────────────────────── */
const media = 'public/media';
fs.mkdirSync(media, { recursive: true });
const done = [];
for (const [slot, src] of picked) {
  const cfg = SLOTS[slot];
  const meta = await sharp(src).metadata();
  const base = sharp(src).rotate().resize({ width: cfg.width, withoutEnlargement: true });
  /* Neutral: the site applies its own grade. Contrast lift only, to match the
     rest of the set, which all carry +4.5%. */
  const norm = base.linear(1.045, -6);
  await norm.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(`${media}/${cfg.out}.jpg`);
  await norm.clone().webp({ quality: 78 }).toFile(`${media}/${cfg.out}.webp`);
  await norm.clone().resize({ width: 1200 }).jpeg({ quality: 82, mozjpeg: true }).toFile(`${media}/${cfg.out}@1200.jpg`);
  await norm.clone().resize({ width: 1200 }).webp({ quality: 78 }).toFile(`${media}/${cfg.out}@1200.webp`);
  const kb = (f) => (fs.statSync(f).size / 1024).toFixed(0) + 'K';
  done.push(`${slot.padEnd(10)} ← ${path.basename(src)}  (${meta.width}x${meta.height})  → ${cfg.out}.jpg ${kb(`${media}/${cfg.out}.jpg`)}`);
}

console.log('\n' + (done.length ? done.join('\n') : 'nothing matched'));
const missing = Object.keys(SLOTS).filter((s) => !picked.has(s));
if (missing.length) console.log('\nstill empty:', missing.join(', '));
console.log(`
Next:
  1. LOOK at each one — the alt text in src/data/site.js was written from a
     description, not from the picture. Correct anything that does not match.
  2. Confirm the lawn frame really is the Kennedy Compound. If it is not,
     set its credit to '' rather than labelling it.
  3. npx astro build --outDir dist && BASE=http://127.0.0.1:4399 node tools/photo-meter.mjs
     and  SAMPLES=20 node tools/credit-sweep.mjs`);
