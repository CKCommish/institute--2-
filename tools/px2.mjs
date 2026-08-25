import { launch } from '/home/user/institute--2-/tools/browser.mjs';
import fs from 'fs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad';
const b=await launch({proxy:false});
const p=await (await b.newContext()).newPage();
await p.goto('about:blank');
const spec=[['s2-desk-pd1.png',147],['s2-desk-pd2.png',84],['s2-desk-pd3.png',84],['s2-desk-pd4.png',84]];
for(const [f,y] of spec){
  const d='data:image/png;base64,'+fs.readFileSync(`${OUT}/${f}`).toString('base64');
  const r=await p.evaluate(async ({d,y})=>{
    const img=new Image(); img.src=d; await img.decode();
    const c=document.createElement('canvas'); c.width=538;c.height=358;
    const x=c.getContext('2d'); x.drawImage(img,851,y,538,358,0,0,538,358);
    const px=x.getImageData(0,0,538,358).data; let R=0,G=0,B=0,C=0,n=538*358;
    for(let i=0;i<px.length;i+=4){R+=px[i];G+=px[i+1];B+=px[i+2];C+=Math.max(px[i],px[i+1],px[i+2])-Math.min(px[i],px[i+1],px[i+2]);}
    return {R:R/n,G:G/n,B:B/n,C:C/n};
  },{d,y});
  console.log(f,'mean',r.R.toFixed(0),r.G.toFixed(0),r.B.toFixed(0),'L',(0.2126*r.R+0.7152*r.G+0.0722*r.B).toFixed(0),'chroma',r.C.toFixed(1));
}
await b.close();
