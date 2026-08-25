const { default: sharp } = await import('/home/user/institute--2-/node_modules/sharp/dist/index.cjs');
import fs from 'node:fs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad';
const tag=process.argv[2]||'desktop';
const {boxes,ids}=JSON.parse(fs.readFileSync(`${OUT}/boxes-${tag}.json`));
for(let i=0;i<boxes.length;i++){
  const b=boxes[i];
  const {data,info}=await sharp(`${OUT}/pilots-${tag}.png`).extract({left:Math.round(b.x),top:Math.round(b.y),width:Math.round(b.w),height:Math.round(b.h)}).raw().toBuffer({resolveWithObject:true});
  const ch=info.channels; let r=0,g=0,bl=0,n=0,chr=0;
  for(let k=0;k<data.length;k+=ch){const R=data[k],G=data[k+1],B=data[k+2];r+=R;g+=G;bl+=B;n++;
    const mx=Math.max(R,G,B),mn=Math.min(R,G,B);chr+=mx-mn;}
  console.log(`${ids[i]}  mean ${(r/n).toFixed(1)}/${(g/n).toFixed(1)}/${(bl/n).toFixed(1)}  chroma ${(chr/n).toFixed(1)}  R-B ${((r-bl)/n).toFixed(1)}`);
}
