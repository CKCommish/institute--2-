import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy:false });
for (const [w,h] of [[1440,900],[390,844]]) {
 const ctx = await b.newContext({ viewport:{width:w,height:h}, isMobile:w<500, hasTouch:w<500 });
 const p = await ctx.newPage();
 await p.goto('http://127.0.0.1:4420/', {waitUntil:'networkidle'});
 await p.waitForTimeout(2400);
 const r = await p.evaluate(()=>{
   const o={};
   const g=(n,s)=>{const e=document.querySelector(s); if(!e)return; const b=e.getBoundingClientRect(); o[n]={l:+b.left.toFixed(2),r:+b.right.toFixed(2),t:+b.top.toFixed(2),b:+b.bottom.toFixed(2)};};
   g('rule','.hero__rule'); g('cue','.hero__scroll'); g('cta','.cta'); g('burger','.nav__burger'); g('wordmark','.nav__mark, .nav__wordmark, .nav a');
   g('credit','.fig__credit, [class*=credit]'); g('eyebrow','.hero__index-label'); g('cells4','.hcell:last-child');
   g('poster','.hero__poster'); g('kicker','.hero__kicker');
   o.vw=innerWidth;
   const cells=[...document.querySelectorAll('.hcell')].map(c=>{const b=c.getBoundingClientRect();return [+b.left.toFixed(1),+b.right.toFixed(1)];});
   o.cells=cells;
   const subs=[...document.querySelectorAll('.hcell__sub')].map(c=>{const b=c.getBoundingClientRect();return +b.right.toFixed(1);});
   o.subsRight=subs;
   return o;
 });
 console.log(w, JSON.stringify(r,null,1));
 await ctx.close();
}
await b.close();
