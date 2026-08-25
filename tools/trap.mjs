import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const p=await ctx.newPage();
const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text())}); p.on('pageerror',e=>errs.push(String(e)));
await p.goto('http://127.0.0.1:4410/pilots/',{waitUntil:'networkidle'});
await p.tap('[data-burger]'); await p.waitForTimeout(900);
const seq=[];
for(let i=0;i<9;i++){ await p.keyboard.press('Tab'); seq.push(await p.evaluate(()=>{const a=document.activeElement;return (a.className||a.tagName)+' '+(a.getAttribute('href')||'')})); }
const back=[];
for(let i=0;i<3;i++){ await p.keyboard.press('Shift+Tab'); back.push(await p.evaluate(()=>{const a=document.activeElement;return (a.className||a.tagName)+' '+(a.getAttribute('href')||'')})); }
// escape still closes, focus returns to burger
await p.keyboard.press('Escape'); await p.waitForTimeout(600);
const after=await p.evaluate(()=>({focus:document.activeElement.className||document.activeElement.tagName,hidden:document.querySelector('[data-menu]').hidden,ov:document.documentElement.style.overflow,exp:document.querySelector('[data-burger]').getAttribute('aria-expanded')}));
const overflow=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
console.log(JSON.stringify({seq,back,after,overflow,errs},null,1));
await b.close();
