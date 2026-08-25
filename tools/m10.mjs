import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy:false });
const c = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true });
const p = await c.newPage();
await p.goto('http://127.0.0.1:4420/',{waitUntil:'networkidle'});
await p.click('[data-burger]'); await p.waitForTimeout(900);
console.log(JSON.stringify(await p.evaluate(()=>{
  const s=new Set();
  const scan=(root)=>root.querySelectorAll('*').forEach(e=>{const c=getComputedStyle(e);
    if(e.textContent && e.children.length===0) s.add(c.fontFamily.split(',')[0].replace(/"/g,'')+' / '+c.fontWeight);});
  scan(document.querySelector('.nav')); scan(document.querySelector('.menu'));
  return [...s];})));
await b.close();
