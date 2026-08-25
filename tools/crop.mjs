const { createRequire } = await import('module');
const require = createRequire('/home/user/institute--2-/package.json');
const sharp = require('sharp');
// 1180 junction top of band, and the row1->row2 seam
await sharp('v-1180-band.png').extract({left:470,top:160,width:250,height:80}).resize({width:1000,kernel:'nearest'}).toFile('z-1180-topjunction.png');
await sharp('v-1180-band.png').extract({left:470,top:600,width:250,height:110}).resize({width:1000,kernel:'nearest'}).toFile('z-1180-seam.png');
await sharp('v-1440-band.png').extract({left:280,top:200,width:250,height:80}).resize({width:1000,kernel:'nearest'}).toFile('z-1440-topjunction.png');
await sharp('v-1440-band.png').extract({left:280,top:640,width:250,height:110}).resize({width:1000,kernel:'nearest'}).toFile('z-1440-foot.png');
console.log('ok');
