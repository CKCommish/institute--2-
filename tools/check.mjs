import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad';
const b=await launch({proxy:false});
const errs=[];
async function run(name, opts, vp, mobile, after){
  const ctx=await b.newContext({viewport:vp,isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1,...opts});
  const p=await ctx.newPage();
  p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(`${name} ${m.type()}: ${m.text()}`);});
  p.on('pageerror',e=>errs.push(`${name} pageerror: ${e.message}`));
  await p.goto('http://127.0.0.1:4411/',{waitUntil:'networkidle'});
  await p.waitForTimeout(1800);
  if(after) await after(p);
  await p.screenshot({path:`${OUT}/chk-${name}.png`,clip:{x:0,y:0,width:vp.width,height:vp.height}});
  const r=await p.evaluate(()=>{
    const img=document.querySelector('.hero__bg img'); const ib=img.getBoundingClientRect();
    return {sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,
      bodySW:document.body.scrollWidth, imgBot:+ib.bottom.toFixed(1),
      posterOpacity:getComputedStyle(document.querySelector('.hero__poster')).maskSize,
      cellOpacity:getComputedStyle(document.querySelector('.hcell')).opacity};
  });
  console.log(name, JSON.stringify(r));
  await ctx.close();
}
await run('rm-mobile', {reducedMotion:'reduce'}, {width:390,height:844}, true);
await run('rm-desktop', {reducedMotion:'reduce'}, {width:1440,height:900}, false);
await run('nojs-mobile', {javaScriptEnabled:false}, {width:390,height:844}, true);
await run('scrolled-mobile', {}, {width:390,height:844}, true, async p=>{ await p.evaluate(()=>window.scrollTo(0,300)); await p.waitForTimeout(500); });
await b.close();
console.log('CONSOLE:', errs.length?errs.join('\n'):'clean');
