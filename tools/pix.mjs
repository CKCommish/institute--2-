import { launch } from '/home/user/institute--2-/tools/browser.mjs';
import fs from 'node:fs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/crit2';
const b = await launch({ proxy: false });
const p = await (await b.newContext()).newPage();
const f = process.argv[2];
const buf = fs.readFileSync(`${OUT}/${f}`).toString('base64');
const res = await p.evaluate(async ({buf, rects}) => {
  const img = new Image(); img.src = 'data:image/png;base64,'+buf;
  await img.decode();
  const c = document.createElement('canvas'); c.width=img.width; c.height=img.height;
  const x = c.getContext('2d'); x.drawImage(img,0,0);
  const out = { size: [img.width, img.height], samples: {} };
  for (const [name, r] of Object.entries(rects)) {
    const d = x.getImageData(r[0], r[1], r[2], r[3]).data;
    let min=[255,255,255], max=[0,0,0];
    for (let i=0;i<d.length;i+=4){ for(let k=0;k<3;k++){ if(d[i+k]<min[k])min[k]=d[i+k]; if(d[i+k]>max[k])max[k]=d[i+k]; } }
    out.samples[name] = { darkest: min, lightest: max };
  }
  return out;
}, { buf, rects: JSON.parse(process.argv[3]) });
console.log(JSON.stringify(res, null, 1));
await b.close();
