import sharp from '/home/user/institute--2-/node_modules/sharp/dist/index.cjs';
const [,,f,X0,X1,Y0,Y1,THR]=process.argv;
const x0=+X0,x1=+X1,y0=+Y0,y1=+Y1,thr=+(THR||4);
const {data,info}=await sharp(f).raw().toBuffer({resolveWithObject:true});
const ch=info.channels,g=[5,13,22];
for(let y=y0;y<y1;y++){let count=0,maxd=0,sum=0;
 for(let x=x0;x<x1;x++){const i=(y*info.width+x)*ch;const d=Math.abs(data[i]-g[0])+Math.abs(data[i+1]-g[1])+Math.abs(data[i+2]-g[2]);if(d>maxd)maxd=d;if(d>thr){count++;sum+=d;}}
 console.log(y, 'n='+count, 'max='+maxd, 'sum='+sum);}
