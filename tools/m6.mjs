import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const S='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy:false });
const c = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:3 });
const p = await c.newPage();
await p.goto('http://127.0.0.1:4420/pilots/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
for(let i=0;i<12;i++){ await p.keyboard.press('Tab');
  const a=await p.evaluate(()=>document.activeElement.className+'|'+(document.activeElement.textContent||'').trim().slice(0,16));
  if(a.includes('cta')){ console.log('tab#'+(i+1), a, 'scrollY', await p.evaluate(()=>scrollY)); break; } }
await p.waitForTimeout(300);
await p.screenshot({path:S+'/nz-ctafocus.png', clip:{x:1180,y:0,width:250,height:60}});
const fm = await p.evaluate(()=>{const e=document.querySelector('.cta');const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return{outline:c.outlineColor+' '+c.outlineStyle+' '+c.outlineWidth, off:c.outlineOffset, br:c.borderRadius, box:[+r.left.toFixed(2),+r.top.toFixed(2),+r.right.toFixed(2),+r.bottom.toFixed(2)], vw:innerWidth};});
console.log(JSON.stringify(fm));
// reduced motion
await c.close();
const c2 = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2, reducedMotion:'reduce' });
const p2 = await c2.newPage();
await p2.goto('http://127.0.0.1:4420/',{waitUntil:'networkidle'}); await p2.waitForTimeout(400);
await p2.click('[data-burger]'); await p2.waitForTimeout(60);
await p2.screenshot({path:S+'/nz-rm-60.png'});
await p2.waitForTimeout(600);
await p2.screenshot({path:S+'/nz-rm-open.png'});
console.log('rm anims', await p2.evaluate(()=>document.getAnimations().length));
await c2.close();
await b.close();
