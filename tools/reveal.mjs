/* Reveal a blind comparison after the critic has committed its picks.
   usage: node tools/reveal.mjs <blindDir> <picksJsonFile>
   picks file: {"picks":{"1":"A","2":"B",...},"overall":"A","believesOursIs":"B"} */
import fs from 'node:fs';
const [dir, picksFile] = process.argv.slice(2);
const key = JSON.parse(fs.readFileSync(`${dir}/.key.json`, 'utf8'));
const v = JSON.parse(fs.readFileSync(picksFile, 'utf8'));
let ourWins = 0, total = 0;
for (const k of key) {
  const pick = v.picks?.[String(k.pair)];
  if (!pick) continue;
  total++;
  const picked = pick.toUpperCase() === 'A' ? k.left : k.right;
  if (picked === 'ours') ourWins++;
  console.log(`pair ${String(k.pair).padStart(2, '0')}: picked ${pick} → ${picked.toUpperCase()}`);
}
const overallPicked = v.overall ? (v.overall.toUpperCase() === 'A' ? key[0].left : key[0].right) : null;
console.log('---');
console.log(`per-pair: ours won ${ourWins} of ${total}`);
if (v.believesOursIs) {
  const guessed = v.believesOursIs.toUpperCase() === 'A' ? key[0].left : key[0].right;
  console.log(`identification: ${guessed === 'ours' ? 'correct' : 'incorrect'}`);
}
console.log(`VERDICT: ${ourWins > total / 2 ? 'OURS WINS' : ourWins === total / 2 ? 'TIE' : 'REFERENCE WINS'}`);
