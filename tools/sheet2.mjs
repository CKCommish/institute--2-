import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b=await launch({proxy:false});
const m=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
const p=await m.newPage();
await p.goto('http://127.0.0.1:4420/pilots/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
await p.tap('[data-burger]'); await p.waitForTimeout(1400);
const d=await p.evaluate(()=>{
 const links=document.querySelector('.menu__links').getBoundingClientRect();
 const foot=document.querySelector('.menu__foot').getBoundingClientRect();
 const mi=document.querySelector('.menu__in').getBoundingClientRect();
 return {contentTop:+links.top.toFixed(2), contentBot:+foot.bottom.toFixed(2), miTop:+mi.top.toFixed(2), miBot:+mi.bottom.toFixed(2), vh:innerHeight};
});
console.log(JSON.stringify(d));
console.log('content centre', ((d.contentTop+d.contentBot)/2).toFixed(2), 'window centre', (d.vh/2).toFixed(2), 'offset', ((d.contentTop+d.contentBot)/2 - d.vh/2).toFixed(2));
// mid transitions
await p.tap('[data-burger]');
for(const t of [80,160,240,340]){ await p.waitForTimeout(t===80?80:80); await p.screenshot({path:OUT+`/m-close-${t}.png`}); }
await p.waitForTimeout(800);
// reduced motion
const m2=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2,reducedMotion:'reduce'});
const p2=await m2.newPage();
await p2.goto('http://127.0.0.1:4420/pilots/',{waitUntil:'networkidle'}); await p2.waitForTimeout(400);
await p2.tap('[data-burger]'); await p2.waitForTimeout(60);
await p2.screenshot({path:OUT+'/m-reduce-60ms.png'});
await p2.waitForTimeout(600);
await p2.screenshot({path:OUT+'/m-reduce-settled.png'});
await b.close();
