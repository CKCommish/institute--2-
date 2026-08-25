import sharp from '/home/user/institute--2-/node_modules/sharp/lib/index.js';
const f = process.argv[2];
const cols = Number(process.argv[3] || 12), rows = Number(process.argv[4] || 10);
const { data, info } = await sharp(f).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, ch = info.channels;
const L = (i) => 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
let out = 'W=' + W + ' H=' + H + '\n     ';
for (let c = 0; c < cols; c++) out += String(Math.round(c * W / cols)).padStart(6);
out += '\n';
for (let r = 0; r < rows; r++) {
  const y0 = Math.floor(r * H / rows), y1 = Math.floor((r + 1) * H / rows);
  out += String(y0).padStart(5);
  for (let c = 0; c < cols; c++) {
    const x0 = Math.floor(c * W / cols), x1 = Math.floor((c + 1) * W / cols);
    let s = 0, n = 0, mx = 0;
    for (let y = y0; y < y1; y += 2) for (let x = x0; x < x1; x += 2) { const v = L((y * W + x) * ch); s += v; n++; if (v > mx) mx = v; }
    out += (Math.round(s / n) + '/' + Math.round(mx)).padStart(6);
  }
  out += '\n';
}
console.log(out);
