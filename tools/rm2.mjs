import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad';
const b = await launch({ proxy:false });
const rm = await b.newContext({ viewport:{width:1440,height:900}, reducedMotion:'reduce' });
const p = await rm.newPage();
await p.goto('http://127.0.0.1:4454/people/', {waitUntil:'networkidle'});
await p.waitForTimeout(1200);
await p.evaluate(()=>window.scrollTo(0,2600)); await p.waitForTimeout(1500);
await p.screenshot({path:`${OUT}/rm-y2600.png`});
const info = await p.evaluate(()=>{
  const g=[...document.querySelectorAll('.co')].map(c=>({
    head:c.querySelector('.co__head')?.textContent.trim(),
    n:c.querySelectorAll('.ent').length,
    fieldH:Math.round(c.querySelector('.co__field').getBoundingClientRect().height),
    fieldCS:(cs=>({bg:cs.backgroundImage.slice(0,120),cols:cs.gridTemplateColumns,rows:cs.gridTemplateRows}))(getComputedStyle(c.querySelector('.co__field')))
  }));
  const e=document.querySelector('.ent');
  return {g, entCS:(cs=>({bl:cs.borderLeft, bg:cs.backgroundImage.slice(0,120), pl:cs.paddingLeft}))(getComputedStyle(e))};
});
console.log(JSON.stringify(info,null,1));
await b.close();
