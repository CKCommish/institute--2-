const { createRequire } = await import('module');
const require = createRequire('/home/user/institute--2-/package.json');
const sharp = require('sharp');
for (const [w,rx,y0,h] of [[1440,325,0,498],[1180,546,0,453],[1180,546,453,475]]){
  const {data,info}=await sharp(`g-${w}.png`).raw().toBuffer({resolveWithObject:true});
  const px=(x,y)=>{const o=(y*info.width+x)*info.channels;return data[o]+data[o+1]+data[o+2];};
  const bg=px(rx-12,Math.round(y0+h/2));
  let runs=[];let cur=null;
  for(let y=y0;y<Math.min(y0+h,info.height);y++){
    let best=-1;for(let dx=-2;dx<=2;dx++){const v=px(rx+dx,y);if(v>best)best=v;}
    const on=best-bg>20;
    if(on&&!cur)cur={s:y};
    if(!on&&cur){cur.e=y-1;runs.push(cur);cur=null;}
  }
  if(cur){cur.e=y0+h-1;runs.push(cur);}
  console.log(w,'rx',rx,'band',y0,'-',y0+h,'runs',JSON.stringify(runs));
}
