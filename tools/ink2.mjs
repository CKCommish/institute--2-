import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport:{width:1440,height:900} });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4415/partner/', { waitUntil:'networkidle' });
await p.evaluate(()=>document.fonts.ready);
const out = await p.evaluate(()=>{
  const S = 16, size = 53.12*S;
  const cv = document.createElement('canvas');
  cv.width = 2400; cv.height = Math.ceil(size*1.6);
  const c = cv.getContext('2d', { willReadFrequently:true });
  const res = {};
  for (const ch of ['H','C','I','A','P','M','G','O','S','D','T','B','E','F']) {
    c.clearRect(0,0,cv.width,cv.height);
    c.fillStyle='#000'; c.textBaseline='alphabetic'; c.textAlign='left';
    c.font = `320 ${size}px Newsreader`;
    const originX = 100;
    c.fillText(ch, originX, size*1.2);
    const d = c.getImageData(0,0,cv.width,cv.height).data;
    let left = null;
    outer: for (let x=0;x<cv.width;x++){
      for (let y=0;y<cv.height;y++){
        if (d[(y*cv.width+x)*4+3] > 8){ left = x; break outer; }
      }
    }
    res[ch] = +(((left - originX)/S)).toFixed(3);   // ink left sidebearing at 53.12px
  }
  return res;
});
console.log(JSON.stringify(out));
await b.close();
