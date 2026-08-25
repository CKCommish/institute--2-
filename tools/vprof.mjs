import sharp from '/home/user/institute--2-/node_modules/sharp/dist/index.cjs';
const {data,info}=await sharp(process.argv[2]).raw().toBuffer({resolveWithObject:true});
const {width,channels}=info; const dpr=+process.argv[3];
for(const [label,x0,x1,y0,y1] of JSON.parse(process.argv[4])){
  const out=[];
  for(let yc=y0;yc<=y1;yc+=0.25){
    const y=Math.round(yc*dpr); let mx=0;
    for(let x=Math.round(x0*dpr);x<Math.round(x1*dpr);x++){const i=(y*width+x)*channels;const l=0.299*data[i]+0.587*data[i+1]+0.114*data[i+2];if(l>mx)mx=l;}
    out.push(yc.toFixed(2)+':'+mx.toFixed(0));
  }
  console.log(label,out.join(' '));
}
