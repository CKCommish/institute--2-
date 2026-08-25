import sharp from 'sharp';
import fs from 'fs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const files = process.argv.slice(2);
for (const f of files){
  const {data,info} = await sharp(f).raw().toBuffer({resolveWithObject:true});
  const ch = info.channels; let n=0, R=0,G=0,B=0, chroma=0, Lsum=0;
  const px=[];
  for(let i=0;i<data.length;i+=ch){
    const r=data[i],g=data[i+1],b=data[i+2];
    R+=r;G+=g;B+=b;n++;
    const mx=Math.max(r,g,b), mn=Math.min(r,g,b);
    chroma+=mx-mn;
    px.push(r,g,b);
  }
  R/=n;G/=n;B/=n;chroma/=n;
  // saturation stddev-ish: also compute mean of per-pixel |r-b|
  let rb=0; for(let i=0;i<px.length;i+=3) rb+=Math.abs(px[i]-px[i+2]); rb/=n;
  console.log(`${f.split('/').pop().padEnd(26)} ${info.width}x${info.height} meanRGB ${R.toFixed(1)}/${G.toFixed(1)}/${B.toFixed(1)}  chroma ${chroma.toFixed(1)}  R-B ${(R-B).toFixed(1)}  |R-B|px ${rb.toFixed(1)}  L ${(0.299*R+0.587*G+0.114*B).toFixed(1)}`);
}
