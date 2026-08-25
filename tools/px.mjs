import sharp from 'sharp';
const f=process.argv[2];
const x0=+process.argv[3], x1=+process.argv[4], y0=+process.argv[5], y1=+process.argv[6], thr=+(process.argv[7]||18);
const img=sharp(f); const {width,height}=await img.metadata();
const {data,info}=await img.raw().toBuffer({resolveWithObject:true});
const ch=info.channels;
// ground colour = mode of region? use #050D16
const g=[5,13,22];
const rows=[];
for(let y=y0;y<y1;y++){
  let maxd=0,count=0,sr=0,sg=0,sb=0;
  for(let x=x0;x<x1;x++){
    const i=(y*info.width+x)*ch;
    const d=Math.abs(data[i]-g[0])+Math.abs(data[i+1]-g[1])+Math.abs(data[i+2]-g[2]);
    if(d>maxd)maxd=d;
    if(d>thr){count++;sr+=data[i];sg+=data[i+1];sb+=data[i+2];}
  }
  rows.push({y,maxd,count,mean:count?[Math.round(sr/count),Math.round(sg/count),Math.round(sb/count)]:null});
}
for(const r of rows) if(r.count>0) console.log(r.y, 'n='+r.count, 'max='+r.maxd, 'mean='+(r.mean||''));
