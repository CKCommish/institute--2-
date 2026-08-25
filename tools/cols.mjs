import sharp from '/home/user/institute--2-/node_modules/sharp/dist/index.cjs';
const [,,f,X0,X1,Y0,Y1,THR]=process.argv;
const x0=+X0,x1=+X1,y0=+Y0,y1=+Y1,thr=+(THR||4);
const {data,info}=await sharp(f).raw().toBuffer({resolveWithObject:true});
const ch=info.channels,g=[5,13,22];
let run=null;const bands=[];
for(let x=x0;x<x1;x++){let count=0,sr=0,sg=0,sb=0;
 for(let y=y0;y<y1;y++){const i=(y*info.width+x)*ch;const d=Math.abs(data[i]-g[0])+Math.abs(data[i+1]-g[1])+Math.abs(data[i+2]-g[2]);if(d>thr){count++;sr+=data[i];sg+=data[i+1];sb+=data[i+2];}}
 if(count){if(!run)run={x0:x,n:0,sr:0,sg:0,sb:0,c:0};run.n++;run.c+=count;run.sr+=sr;run.sg+=sg;run.sb+=sb;run.x1=x;}
 else if(run){bands.push(run);run=null;}}
if(run)bands.push(run);
for(const b of bands){const mr=Math.round(b.sr/b.c),mg=Math.round(b.sg/b.c),mb=Math.round(b.sb/b.c);
 console.log(`x ${b.x0}..${b.x1} (w=${b.x1-b.x0+1}) px=${b.c} meanRGB=(${mr},${mg},${mb}) chroma=${Math.max(mr,mg,mb)-Math.min(mr,mg,mb)}`);}
