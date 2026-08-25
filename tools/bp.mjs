import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy:false });
for (const w of [1024, 900, 820, 768, 700, 600]) {
  const c = await b.newContext({ viewport:{width:w,height:800}, deviceScaleFactor:2 });
  const p = await c.newPage();
  await p.goto('http://127.0.0.1:4454/pilots/',{waitUntil:'networkidle'}); await p.waitForTimeout(900);
  const m = await p.evaluate(()=>{
    const r=e=>{const b=e.getBoundingClientRect();return [+b.left.toFixed(1),+b.right.toFixed(1)];};
    const links=document.querySelector('.nav__links'), cta=document.querySelector('.nav .cta'), bg=document.querySelector('[data-burger]'), mk=document.querySelector('.nav__mark');
    const vis=e=>getComputedStyle(e).display!=='none' && e.getBoundingClientRect().width>0;
    return {mark:r(mk), links:vis(links)?r(links):null, cta:vis(cta)?r(cta):null, burger:vis(bg)?r(bg):null,
      overlap: vis(links)&&mk.getBoundingClientRect().right > links.getBoundingClientRect().left};
  });
  console.log(w, JSON.stringify(m));
  await p.screenshot({path:`${OUT}/bp-${w}.png`, clip:{x:0,y:0,width:w,height:70}});
  await c.close();
}
// progress at bottom of page + is-scrolled threshold
const c = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:2 });
const p = await c.newPage();
await p.goto('http://127.0.0.1:4454/pilots/',{waitUntil:'networkidle'}); await p.waitForTimeout(900);
for (const y of [1,8,20,60]) { await p.evaluate(v=>window.scrollTo(0,v),y); await p.waitForTimeout(700);
  await p.screenshot({path:`${OUT}/th-${y}.png`, clip:{x:0,y:0,width:1440,height:80}}); }
await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight)); await p.waitForTimeout(1200);
console.log('nav-p at end', await p.evaluate(()=>getComputedStyle(document.querySelector('.nav')).getPropertyValue('--nav-p')));
await p.screenshot({path:`${OUT}/th-end.png`, clip:{x:0,y:0,width:1440,height:80}});
await c.close(); await b.close();
