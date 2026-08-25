import sharp from '/home/user/institute--2-/node_modules/sharp/dist/index.cjs';
const dpr=4;
const rows=[[939,36.831+4,903.22-60],[768,31.872+4,737.17-60],[621,27.609+4,594.41-60],[430,22.07+4,408.92-60],[390,20.91+4,370.06-60],[360,20.04+4,340.94-60],[320,20+4,300.97-60]];
for(const [w,wmX,buX] of rows){
  const {data,info}=await sharp(`shots/bar-${w}.png`).raw().toBuffer({resolveWithObject:true});
  const {width,channels}=info;
  const band=(x0,x1)=>{let top=null,bot=null;
    for(let yc=15;yc<=50;yc+=0.25){const y=Math.round(yc*dpr);let mx=0;
      for(let x=Math.round(x0*dpr);x<Math.round(x1*dpr);x++){const i=(y*width+x)*channels;const l=0.299*data[i]+0.587*data[i+1]+0.114*data[i+2];if(l>mx)mx=l;}
      if(mx>150){if(top===null)top=yc;bot=yc;}}
    return {top,bot};};
  const a=band(wmX,wmX+6), b=band(buX,buX+40);
  console.log(w, 'wordmark cap', JSON.stringify(a), 'burgerLabel', JSON.stringify(b), 'baselineDelta=', (b.bot-a.bot).toFixed(2));
}
