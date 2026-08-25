import sharp from '/home/user/institute--2-/node_modules/sharp/dist/index.cjs';
const f=process.argv[2], dpr=4;
const {data,info}=await sharp(f).raw().toBuffer({resolveWithObject:true});
const {width,channels}=info;
const px=(xc,yc)=>{const x=Math.round(xc*dpr),y=Math.round(yc*dpr);const i=(y*width+x)*channels;return [data[i],data[i+1],data[i+2]];};
// sample ring top stroke around x=1300, find brightest row 15..22
for(const xc of [1250,1300,1350]){
  let best=null;
  for(let yc=15;yc<=21;yc+=0.25){const p=px(xc,yc);const l=0.299*p[0]+0.587*p[1]+0.114*p[2];if(!best||Math.abs(l-bgL(xc))>Math.abs(best.l-bgL(xc)))best={yc,p,l};}
  console.log('ring@'+xc, JSON.stringify(best), 'ground=',px(xc,10));
}
function bgL(xc){const p=px(xc,10);return 0.299*p[0]+0.587*p[1]+0.114*p[2];}
