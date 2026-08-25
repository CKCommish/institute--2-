import sharp from '/home/user/institute--2-/node_modules/sharp/dist/index.cjs';
const {data,info}=await sharp(process.argv[2]).raw().toBuffer({resolveWithObject:true});
const THR=+(process.argv[6]||45);
const {width,channels}=info;
const dpr=+process.argv[3], ox=+process.argv[4];
for(const spec of JSON.parse(process.argv[5])){
  const [label,x0,x1,y0,y1]=spec;
  const X0=Math.round((x0-ox)*dpr),X1=Math.round((x1-ox)*dpr),Y0=Math.round(y0*dpr),Y1=Math.round(y1*dpr);
  let top=null,bot=null;
  for(let y=Y0;y<Y1;y++){
    let mx=0;
    for(let x=X0;x<X1;x++){const i=(y*width+x)*channels; const l=0.299*data[i]+0.587*data[i+1]+0.114*data[i+2]; if(l>mx)mx=l;}
    if(mx>THR){ if(top===null)top=y; bot=y; }
  }
  console.log(label,'inkTopCSS=',top===null?null:+(top/dpr).toFixed(2),'inkBotCSS=',bot===null?null:+((bot+1)/dpr).toFixed(2),'centre=',top===null?null:+(((top+bot+1)/2)/dpr).toFixed(2));
}
