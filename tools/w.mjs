import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b=await launch({proxy:false});
for(const w of [960,1100,1280,1440,1920]){
 const c=await b.newContext({viewport:{width:w,height:900},deviceScaleFactor:4});
 const p=await c.newPage(); const e=[]; p.on('pageerror',x=>e.push(String(x))); p.on('console',m=>{if(m.type()==='error')e.push(m.text())});
 await p.goto('http://127.0.0.1:4420/pilots/',{waitUntil:'networkidle'});
 const r=await p.evaluate(()=>{const bl=el=>{const s=document.createElement('span');s.style.cssText='display:inline-block;width:0;height:0;vertical-align:baseline';el.appendChild(s);const y=s.getBoundingClientRect().top;s.remove();return +y.toFixed(2)};
  return {link:bl(document.querySelector('.nav__link')),cta:bl(document.querySelector('.cta__t')),wm:bl(document.querySelector('.wm__a')),ov:document.documentElement.scrollWidth>document.documentElement.clientWidth};});
 console.log(w,JSON.stringify(r),e.length?e:'');
 await c.close();
}
await b.close();
