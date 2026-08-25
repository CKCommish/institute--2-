import sharp from '/home/user/institute--2-/node_modules/sharp/dist/index.cjs';
const [,,f,X,Y0,Y1]=process.argv;
const {data,info}=await sharp(f).raw().toBuffer({resolveWithObject:true});
for(let y=+Y0;y<+Y1;y++){const i=(y*info.width+ +X)*info.channels;console.log(y, data[i],data[i+1],data[i+2]);}
