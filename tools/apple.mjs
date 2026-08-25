import sharp from '/home/user/institute--2-/node_modules/sharp/dist/index.cjs';
const f='/home/user/institute--2-/refs/apple/newsroom/desktop-01.png';
const {data,info}=await sharp(f).raw().toBuffer({resolveWithObject:true});
const {width,channels}=info; console.log('size',info.width,info.height);
const L=(x,y)=>{const i=(y*width+x)*channels;return 0.299*data[i]+0.587*data[i+1]+0.114*data[i+2];};
const px=(x,y)=>{const i=(y*width+x)*channels;return [data[i],data[i+1],data[i+2]];};
// horizontal ink scan in band y0..y1 for x0..x1, dark ink on light ground
function hscan(x0,x1,y0,y1,thr=200){let a=null,b=null;for(let x=x0;x<x1;x++){let mn=255;for(let y=y0;y<y1;y++){const l=L(x,y);if(l<mn)mn=l;}if(mn<thr){if(a===null)a=x;b=x;}}return[a,b];}
function vscan(x0,x1,y0,y1,thr=200){let a=null,b=null;for(let y=y0;y<y1;y++){let mn=255;for(let x=x0;x<x1;x++){const l=L(x,y);if(l<mn)mn=l;}if(mn<thr){if(a===null)a=y;b=y;}}return[a,b];}
console.log('wordmark Newsroom h', hscan(200,400,55,85), 'v', vscan(228,340,50,90));
console.log('AppleServices h', hscan(820,950,58,82), 'v', vscan(843,932,55,85));
console.log('AppleStories  h', hscan(955,1060,58,82), 'v', vscan(968,1046,55,85));
console.log('pill h', hscan(1060,1230,55,85,248), 'v', vscan(1069,1210,50,92,248));
console.log('pill label v', vscan(1094,1202,55,85,200), 'h', hscan(1085,1215,60,80,200));
console.log('pill fill px', px(1150,60), 'ground', px(1300,70));
console.log('N cap v', vscan(230,244,50,90));
console.log('A of AppleServices cap v', vscan(843,853,55,85));
