import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy:false });
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://127.0.0.1:4454/people/',{waitUntil:'networkidle'});
await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
await p.waitForTimeout(2500);
await p.evaluate(()=>window.scrollTo(0,0));
await p.waitForTimeout(600);
const r = await p.evaluate(()=>{
  const q=s=>[...document.querySelectorAll(s)];
  const box=el=>{const b=el.getBoundingClientRect();return {t:Math.round(b.top+scrollY),l:Math.round(b.left),w:Math.round(b.width),h:Math.round(b.height),b:Math.round(b.bottom+scrollY)};};
  const o={};
  o.classes=[...new Set(q('main *').map(e=>e.className.toString()).filter(Boolean))];
  return o;
});
console.log(r.classes.join('\n'));
await b.close();
