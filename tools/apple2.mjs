import sharp from '/home/user/institute--2-/node_modules/sharp/dist/index.cjs';
const f='/home/user/institute--2-/refs/apple/newsroom/mobile-01.png';
const {data,info}=await sharp(f).raw().toBuffer({resolveWithObject:true});
const {width,channels}=info; console.log('size',info.width,info.height);
const L=(x,y)=>{const i=(y*width+x)*channels;return 0.299*data[i]+0.587*data[i+1]+0.114*data[i+2];};
const px=(x,y)=>{const i=(y*width+x)*channels;return [data[i],data[i+1],data[i+2]];};
function hscan(x0,x1,y0,y1,thr=200){let a=null,b=null;for(let x=x0;x<x1;x++){let mn=255;for(let y=y0;y<y1;y++){const l=L(x,y);if(l<mn)mn=l;}if(mn<thr){if(a===null)a=x;b=x;}}return[a,b];}
function vscan(x0,x1,y0,y1,thr=200){let a=null,b=null;for(let y=y0;y<y1;y++){let mn=255;for(let x=x0;x<x1;x++){const l=L(x,y);if(l<mn)mn=l;}if(mn<thr){if(a===null)a=y;b=y;}}return[a,b];}
console.log('Newsroom h',hscan(10,200,60,85),'N cap v',vscan(24,38,55,90));
console.log('pill box h',hscan(290,390,58,88,248),'v',vscan(298,378,55,92,248));
console.log('pill label v',vscan(322,368,58,88,180),'h',hscan(300,380,60,84,180));
console.log('pill fill',px(340,66),'ground',px(250,70));
