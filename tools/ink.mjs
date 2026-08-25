import sharp from '/home/user/institute--2-/node_modules/sharp/dist/index.cjs';
const f=process.argv[2];
const bands=JSON.parse(process.argv[3]); // [[label, y0,y1, x0,x1, dpr]]
const {data,info}=await sharp(f).raw().toBuffer({resolveWithObject:true});
const {width,height,channels}=info;
for(const [label,y0,y1,x0,x1,dpr] of bands){
  const Y0=Math.round(y0*dpr),Y1=Math.round(y1*dpr),X0=Math.round(x0*dpr),X1=Math.min(width,Math.round(x1*dpr));
  // background sample
  let bg=[0,0,0],n=0;
  for(let y=Y0;y<Y1;y+=3){const i=(y*width+X0)*channels;bg[0]+=data[i];bg[1]+=data[i+1];bg[2]+=data[i+2];n++;}
  bg=bg.map(v=>v/n);
  let inkX=null, lastX=null, sum=[0,0,0], cnt=0;
  for(let x=X0;x<X1;x++){
    let colMax=0;
    for(let y=Y0;y<Y1;y++){
      const i=(y*width+x)*channels;
      const d=Math.abs(data[i]-bg[0])+Math.abs(data[i+1]-bg[1])+Math.abs(data[i+2]-bg[2]);
      if(d>colMax)colMax=d;
      if(d>60){sum[0]+=data[i];sum[1]+=data[i+1];sum[2]+=data[i+2];cnt++;}
    }
    if(colMax>40){ if(inkX===null)inkX=x; lastX=x; }
  }
  const mean=cnt?sum.map(v=>+(v/cnt).toFixed(1)):null;
  console.log(label, 'inkLeftCSS=', inkX===null?null:+(inkX/dpr).toFixed(2), 'inkRightCSS=', lastX===null?null:+((lastX+1)/dpr).toFixed(2), 'meanRGB=', mean, 'bg=',bg.map(v=>+v.toFixed(1)));
}
