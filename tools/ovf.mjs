import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b=await launch({proxy:false});
for(const w of [1440,1180,1024,900,861,860,768,621,540,430,390,360,320]){
 const ctx=await b.newContext({viewport:{width:w,height:900},isMobile:w<500,hasTouch:w<500,deviceScaleFactor:1});
 const p=await ctx.newPage(); const errs=[];
 p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
 p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
 await p.goto('http://127.0.0.1:4420/people/',{waitUntil:'networkidle'}); await p.waitForTimeout(900);
 const r=await p.evaluate(()=>{
  const de=document.documentElement;
  const idx=document.querySelector('.pm__idx');
  const a=document.querySelector('.pm__idx-a');
  const shell=document.querySelector('.pm__in');
  const rows=[...document.querySelectorAll('.pm__idx-i')].map(x=>+x.getBoundingClientRect().height.toFixed(1));
  return {sw:de.scrollWidth, iw:innerWidth, idxR:+idx.getBoundingClientRect().right.toFixed(2), shellR:+shell.getBoundingClientRect().right.toFixed(2), arrowR:+a.getBoundingClientRect().right.toFixed(2), rows};
 });
 console.log(w, JSON.stringify(r), errs.length?('ERR '+errs.join('; ')):'');
 await ctx.close();
}
await b.close();
