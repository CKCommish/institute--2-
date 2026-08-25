import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b=await launch({proxy:false});
const errs=[];
for (const w of [900, 620, 1024]) {
  const ctx=await b.newContext({viewport:{width:w,height:900},deviceScaleFactor:2});
  const p=await ctx.newPage();
  p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(`[${w}] ${m.type()}: ${m.text()}`);});
  p.on('pageerror',e=>errs.push(`[${w}] pageerror: ${e.message}`));
  await p.goto('http://127.0.0.1:4454/people/',{waitUntil:'networkidle'});
  await p.evaluate(async()=>{const h=document.body.scrollHeight;for(let y=0;y<h;y+=300){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}});
  await p.waitForTimeout(700);
  await p.evaluate(()=>{const e=document.querySelector('#cohort-capital');window.scrollBy(0,e.getBoundingClientRect().top-60);});
  await p.waitForTimeout(500);
  await p.screenshot({path:`${OUT}/w${w}-cap.png`});
  const ov=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,
    cols:getComputedStyle(document.querySelector('.wall')).getPropertyValue('--cols').trim(),
    rows:getComputedStyle(document.querySelectorAll('.co__field')[1]).gridTemplateRows}));
  console.log(w,JSON.stringify(ov));
  await ctx.close();
}
console.log('CONSOLE:',errs.length?errs.join('\n'):'clean');
await b.close();
