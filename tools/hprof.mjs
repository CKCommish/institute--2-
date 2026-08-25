import sharp from '/home/user/institute--2-/node_modules/sharp/dist/index.cjs';
const {data,info}=await sharp(process.argv[2]).raw().toBuffer({resolveWithObject:true});
const {width,channels}=info;
const dpr=+process.argv[3];
for(const [label,x0,x1,y0,y1] of JSON.parse(process.argv[4])){
  const out=[];
  for(let xc=x0;xc<=x1;xc+=0.25){
    const x=Math.round(xc*dpr); let mx=0;
    for(let y=Math.round(y0*dpr);y<Math.round(y1*dpr);y++){const i=(y*width+x)*channels;const l=0.299*data[i]+0.587*data[i+1]+0.114*data[i+2];if(l>mx)mx=l;}
    out.push(xc.toFixed(2)+':'+mx.toFixed(0));
  }
  console.log(label,out.join(' '));
}
