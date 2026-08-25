import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport:{width:1440,height:900}, reducedMotion:'reduce' });
const p = await ctx.newPage();
const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text())}); p.on('pageerror',e=>errs.push('pe:'+e.message));
await p.goto('http://127.0.0.1:4420/', {waitUntil:'networkidle'});
await p.waitForTimeout(1200);
console.log(JSON.stringify(await p.evaluate(()=>({
  text: document.querySelector('#hero-h').textContent.replace(/\s+/g,' ').trim(),
  aria: document.querySelector('.hero').getAttribute('aria-labelledby'),
  posterOpacity: getComputedStyle(document.querySelector('.hero__poster')).maskSize,
  ovf: document.documentElement.scrollWidth-document.documentElement.clientWidth
}))));
await p.screenshot({path:`${process.env.SP}/lb-rm.png`});
console.log('errors', errs);
await b.close();
