import { launch } from '/home/user/institute--2-/tools/browser.mjs';
import fs from 'fs';
const png = fs.readFileSync('/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots/w-1920.png').toString('base64');
const b = await launch({proxy:false});
const ctx = await b.newContext({viewport:{width:800,height:600}});
const p = await ctx.newPage();
await p.setContent('<img id="i" src="data:image/png;base64,'+png+'">');
await p.waitForFunction(()=>document.getElementById('i').complete);
const out = await p.evaluate(()=>{
  const img=document.getElementById('i');
  const c=document.createElement('canvas'); c.width=img.naturalWidth; c.height=img.naturalHeight;
  const x=c.getContext('2d'); x.drawImage(img,0,0);
  const d=x.getImageData(0,0,c.width,c.height).data;
  const L=i=>0.2126*d[i]+0.7152*d[i+1]+0.0722*d[i+2];
  const rows=[770,820,880];
  const res={dim:[c.width,c.height]};
  for(const y of rows){
    const arr=[];
    for(let X=1400;X<1900;X+=4){ arr.push(+L((y*c.width+X)*4).toFixed(1)); }
    res['y'+y]=arr;
  }
  // find max abs delta between adjacent samples at y=880
  return res;
});
const a=out.y880; let best=0,bi=0;
for(let i=1;i<a.length;i++){const dd=Math.abs(a[i]-a[i-1]); if(dd>best){best=dd;bi=i;}}
console.log('dim',out.dim,'max jump',best.toFixed(1),'at x≈',1400+bi*4);
console.log('y880', a.join(' '));
console.log('y770', out.y770.join(' '));
await b.close();
