import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900}});
const p=await ctx.newPage();
await p.goto('http://127.0.0.1:4454/pilots/',{waitUntil:'networkidle'});
const H=await p.evaluate(()=>document.body.scrollHeight);
for(let y=0;y<H;y+=400){await p.evaluate(v=>scrollTo(0,v),y);await p.waitForTimeout(90);}
await p.waitForTimeout(1800);
// keyboard-focus the 3rd pd link
await p.evaluate(()=>document.activeElement.blur());
let found=false;
for(let i=0;i<60;i++){await p.keyboard.press('Tab');
  found= await p.evaluate(()=>{const a=document.activeElement;return a.tagName==='A'&&a.classList.contains('pd__ask')&&a.closest('#infant-mortality');});
  if(found)break;}
console.log('kbd found',found);
await p.waitForTimeout(600);
const r=await p.evaluate(()=>{const a=document.activeElement.getBoundingClientRect();return {x:a.x-40,y:a.y-40,width:a.width+80,height:a.height+80};});
await p.screenshot({path:`${OUT}/s4-focus.png`,clip:r});
// same element, no focus, for baseline
await p.evaluate(()=>document.activeElement.blur());
await p.waitForTimeout(400);
await p.screenshot({path:`${OUT}/s4-rest.png`,clip:r});
// hover same clip
await p.mouse.move(r.x+80,r.y+62); await p.waitForTimeout(700);
await p.screenshot({path:`${OUT}/s4-hover.png`,clip:r});
await p.mouse.down(); await p.waitForTimeout(250);
await p.screenshot({path:`${OUT}/s4-active.png`,clip:r});
await p.mouse.up();
await b.close();
