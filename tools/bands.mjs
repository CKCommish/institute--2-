import sharpmod from '/home/user/institute--2-/node_modules/sharp/dist/index.cjs'; const sharp=sharpmod.default||sharpmod;
const [,,f,X0,X1,Y0,Y1,THR]=process.argv;
const x0=+X0,x1=+X1,y0=+Y0,y1=+Y1,thr=+(THR||20);
const {data,info}=await sharp(f).raw().toBuffer({resolveWithObject:true});
const ch=info.channels,g=[5,13,22];
let run=null;const bands=[];
for(let y=y0;y<y1;y++){
  let count=0,sr=0,sg=0,sb=0,maxd=0;
  for(let x=x0;x<x1;x++){
    const i=(y*info.width+x)*ch;
    const d=Math.abs(data[i]-g[0])+Math.abs(data[i+1]-g[1])+Math.abs(data[i+2]-g[2]);
    if(d>maxd)maxd=d;
    if(d>thr){count++;sr+=data[i];sg+=data[i+1];sb+=data[i+2];}
  }
  if(count>0){ if(!run)run={y0:y,rows:[]}; run.rows.push({y,count,mean:[Math.round(sr/count),Math.round(sg/count),Math.round(sb/count)],maxd}); }
  else if(run){bands.push(run);run=null;}
}
if(run)bands.push(run);
for(const bd of bands){
  const rs=bd.rows, last=rs[rs.length-1];
  const peak=rs.reduce((a,b)=>b.count>a.count?b:a);
  const tot=rs.reduce((a,b)=>a+b.count,0);
  const mr=Math.round(rs.reduce((a,b)=>a+b.mean[0]*b.count,0)/tot), mg=Math.round(rs.reduce((a,b)=>a+b.mean[1]*b.count,0)/tot), mb=Math.round(rs.reduce((a,b)=>a+b.mean[2]*b.count,0)/tot);
  console.log(`band y ${bd.y0}..${last.y} (h=${last.y-bd.y0+1}) peakRow=${peak.y} peakN=${peak.count} meanRGB=(${mr},${mg},${mb}) chroma=${Math.max(mr,mg,mb)-Math.min(mr,mg,mb)}`);
  if(last.y-bd.y0+1<=4) console.log('   rows: '+rs.map(r=>`${r.y}:n${r.count}`).join(' '));
}
