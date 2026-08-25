const { createRequire } = await import('module');
const require = createRequire('/home/user/institute--2-/package.json');
const sharp = require('sharp');
const {data,info}=await sharp('g-1440.png').raw().toBuffer({resolveWithObject:true});
const px=(x,y)=>{const o=(y*info.width+x)*info.channels;return [data[o],data[o+1],data[o+2]];};
for(let y=0;y<=120;y+=5){
  console.log('y',y, [-2,-1,0,1,2].map(dx=>px(325+dx,y).join('/')).join('  '), ' far=',px(300,y).join('/'));
}
