import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy:false });
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://127.0.0.1:4454/people/',{waitUntil:'networkidle'});
const r = await p.evaluate(()=>{
  const hits=[];
  document.querySelectorAll('*').forEach(el=>{
    const cs=getComputedStyle(el);
    if (cs.backgroundColor==='rgb(12, 36, 64)'||cs.color==='rgb(128, 128, 128)'||cs.backgroundImage.includes('12, 36, 64'))
      hits.push({tag:el.tagName, cls:el.className.toString().slice(0,60), c:cs.color, bg:cs.backgroundColor, bi:cs.backgroundImage.slice(0,120), txt:el.textContent.trim().slice(0,40)});
  });
  return hits;
});
console.log(JSON.stringify(r,null,1));
await b.close();
