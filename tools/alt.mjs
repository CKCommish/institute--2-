import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy:false });
const ctx = await b.newContext({ viewport:{width:1024,height:900}, deviceScaleFactor:1 });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4420/', {waitUntil:'networkidle'});
await p.waitForTimeout(2000);
for (const w of [1024,768,390]){
 await p.setViewportSize({width:w,height:900}); await p.waitForTimeout(200);
 const r = await p.evaluate(()=>{
  const poster=document.querySelector('.hero__poster');
  const cs=getComputedStyle(poster);
  const c=document.createElement('canvas').getContext('2d');
  c.font=`${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const ls=parseFloat(cs.letterSpacing)||0;
  const W=s=>c.measureText(s).width + ls*s.length;
  const opts={
   'shipped4': ['the technologies of','tomorrow strengthen','American','families today.'],
   'altA': ['the technologies of','tomorrow strengthen','American families','today.'],
   'altB': ['the technologies','of tomorrow strengthen','American families','today.'],
   'altC': ['the technologies of tomorrow','strengthen American','families today.'],
   'altD': ['the technologies','of tomorrow','strengthen American','families today.'],
   'shipped5': ['the technologies','of tomorrow','strengthen','American','families today.'],
   'alt5': ['the technologies','of tomorrow','strengthen','American families','today.'],
  };
  const rule=document.querySelector('.hero__rule').getBoundingClientRect();
  const out={};
  for(const k in opts) out[k]=opts[k].map(s=>+W(s).toFixed(0));
  return {out, avail:+rule.width.toFixed(0), fs:cs.fontSize};
 });
 console.log('vw='+w, 'avail='+r.avail, 'fs='+r.fs);
 for(const k in r.out) console.log('   ',k.padEnd(10), JSON.stringify(r.out[k]), 'max='+Math.max(...r.out[k]));
}
await b.close();
