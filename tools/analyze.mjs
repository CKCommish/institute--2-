import { createRequire } from 'node:module'; const sharp = createRequire('/home/user/institute--2-/package.json')('sharp');
const f = '/home/user/institute--2-/public/media/hero-graded.jpg';
const im = sharp(f); const md = await im.metadata();
console.log('meta', md.width, md.height);
const W = 280, H = Math.round(md.height * W / md.width);
const { data, info } = await sharp(f).resize(W, H).greyscale().raw().toBuffer({ resolveWithObject: true });
// print a coarse ascii map
const rows = 56, cols = 70;
let out = '';
for (let r = 0; r < rows; r++) {
  let line = '';
  for (let c = 0; c < cols; c++) {
    let sum = 0, n = 0;
    const y0 = Math.floor(r*H/rows), y1 = Math.floor((r+1)*H/rows);
    const x0 = Math.floor(c*W/cols), x1 = Math.floor((c+1)*W/cols);
    for (let y=y0;y<y1;y++) for (let x=x0;x<x1;x++){ sum += data[y*info.width+x]; n++; }
    const v = sum/n;
    line += v < 18 ? '#' : v < 35 ? '@' : v < 55 ? '*' : v < 80 ? '+' : v < 110 ? ':' : v < 150 ? '.' : ' ';
  }
  out += String(Math.round(r*md.height/rows)).padStart(5) + ' |' + line + '\n';
}
console.log(out);
