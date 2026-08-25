import sharp from '/home/user/institute--2-/node_modules/sharp/dist/index.cjs';
const {data,info}=await sharp(process.argv[2]).raw().toBuffer({resolveWithObject:true});
const {width,channels}=info; const dpr=4, ox=1140;
// column at x=1295 (a gap between letters) scan y 17..44
for(const x0 of [1293,1295,1297]){
 const x=Math.round((x0-ox)*dpr); const out=[];
 for(let yc=34;yc<=42;yc+=0.25){const y=Math.round(yc*dpr);const i=(y*width+x)*channels;out.push(yc.toFixed(2)+':'+Math.round(0.299*data[i]+0.587*data[i+1]+0.114*data[i+2]));}
 console.log('x='+x0, out.join(' '));
}
