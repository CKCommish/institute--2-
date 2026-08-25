import sharp from '/home/user/institute--2-/node_modules/sharp/dist/index.cjs';
const {data,info}=await sharp(process.argv[2]).raw().toBuffer({resolveWithObject:true});
const {width,channels}=info;
const dpr=2;
const rows=[['Institute',292.92],['Pilots',335.67],['Forum',378.42],['People',421.17]];
for(const [name,top] of rows){
  const Y0=Math.round((top+2)*dpr), Y1=Math.round((top+30)*dpr);
  const out=[];
  for(let xc=54;xc<=66;xc+=0.5){
    const x=Math.round(xc*dpr);
    let mx=0;
    for(let y=Y0;y<Y1;y++){const i=(y*width+x)*channels; const l=0.299*data[i]+0.587*data[i+1]+0.114*data[i+2]; if(l>mx)mx=l;}
    out.push(xc+':'+mx.toFixed(0));
  }
  console.log(name.padEnd(10), out.join(' '));
}
