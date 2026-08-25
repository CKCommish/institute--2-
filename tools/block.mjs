import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900}});
const pg=await ctx.newPage();
await pg.goto('http://127.0.0.1:4420/pilots/',{waitUntil:'networkidle'});
await pg.evaluate(async()=>{const H=document.body.scrollHeight;for(let y=0;y<H;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,80));}window.scrollTo(0,0);await new Promise(r=>setTimeout(r,500));});
const secs=await pg.$$('.pd');
for(let i=0;i<secs.length;i++){await secs[i].scrollIntoViewIfNeeded();await pg.waitForTimeout(800);await secs[i].screenshot({path:`${OUT}/block-0${i+1}.png`});}
// measurements
const m=await pg.evaluate(()=>{
  const out=[];
  document.querySelectorAll('.pd').forEach(s=>{
    const g=e=>e?e.getBoundingClientRect():null;
    const plate=s.querySelector('.pd__plate'), t=s.querySelector('.pd__t'), goal=s.querySelector('.pd__goal-t'), tag=s.querySelector('.pd__tag');
    const cs=getComputedStyle(t);
    out.push({
      plateL:+g(plate).left.toFixed(1), plateR:+g(plate).right.toFixed(1), plateT:+g(plate).top.toFixed(1), plateB:+g(plate).bottom.toFixed(1),
      titleL:+g(t).left.toFixed(1), titleFS:cs.fontSize, titleLH:cs.lineHeight,
      goalB: goal?+g(goal).bottom.toFixed(1):null, goalL: goal?+g(goal).left.toFixed(1):null,
      tagL: tag?+g(tag).left.toFixed(1):null,
    });
  });
  return out;});
console.log(JSON.stringify(m,null,1));
await b.close();
