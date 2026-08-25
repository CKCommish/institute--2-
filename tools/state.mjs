import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy:false });
for (const [w,h,tag] of [[1440,900,'d'],[390,844,'m']]){
  const ctx = await b.newContext({ viewport:{width:w,height:h}, ...(tag==='m'?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{}) });
  const p = await ctx.newPage();
  p.on('console',m=>console.log('CONSOLE',w,m.type(),m.text()));
  p.on('pageerror',e=>console.log('PAGEERR',w,e.message));
  await p.goto('http://127.0.0.1:4420/partner/', { waitUntil:'networkidle' });
  await p.evaluate(()=>document.querySelector('#ways').scrollIntoView());
  await p.waitForTimeout(900);
  // hover door 2
  if(tag==='d'){ await p.hover('.door'); await p.waitForTimeout(700); await p.screenshot({path:`${OUT}/state-${tag}-hover.png`}); }
  // keyboard focus
  await p.evaluate(()=>document.querySelectorAll('.door')[1].focus());
  await p.waitForTimeout(400);
  await p.screenshot({path:`${OUT}/state-${tag}-focus.png`});
  // chosen: block navigation
  await p.evaluate(()=>{ document.addEventListener('click',e=>e.preventDefault(),true); });
  await p.evaluate(()=>document.querySelectorAll('.door')[1].click());
  await p.waitForTimeout(900);
  await p.screenshot({path:`${OUT}/state-${tag}-chosen.png`});
  const st = await p.evaluate(()=>{
    const d=document.querySelectorAll('.door')[1];
    const g=d.querySelector('.door__got');
    const r=g.getBoundingClientRect();
    const others=[...document.querySelectorAll('.door')].map(x=>getComputedStyle(x).opacity);
    const next=document.querySelectorAll('.door')[2].getBoundingClientRect();
    return {receipt:{top:Math.round(r.top),bot:Math.round(r.bottom),left:Math.round(r.left*10)/10,h:Math.round(r.height),op:getComputedStyle(g).opacity,fs:getComputedStyle(g).fontSize}, opacities:others, nextDoorTop:Math.round(next.top)};
  });
  console.log(w, JSON.stringify(st));
  await ctx.close();
}
await b.close();
