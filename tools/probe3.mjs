import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const B='http://127.0.0.1:4410';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900}});
const p=await ctx.newPage();
await p.goto(B+'/institute/',{waitUntil:'networkidle'}); await p.mouse.move(700,700); await p.waitForTimeout(1200);
const t=(await p.evaluate(()=>[...document.querySelectorAll('.on-cream')].map(e=>Math.round(e.getBoundingClientRect().top+scrollY))))[0];
for(let off=-80; off<=20; off+=10){
  await p.evaluate(y=>scrollTo(0,y), t+off); await p.waitForTimeout(700);
  const v=await p.evaluate(()=>{const n=document.querySelector('.nav');const cs=getComputedStyle(n);
    return {inv:n.classList.contains('is-inverted'), creamTop:Math.round(document.querySelector('.on-cream').getBoundingClientRect().top), cut:cs.getPropertyValue('--nav-cut').trim(), a:cs.getPropertyValue('--nav-a').trim(), bb:cs.getPropertyValue('--nav-b').trim()}});
  console.log('off',String(off).padStart(4), 'creamTop',String(v.creamTop).padStart(4),'cut',v.cut.padStart(7),'a',v.a,'b',v.bb,'inv',v.inv);
}
// progress at page bottom
await p.evaluate(()=>scrollTo(0,document.body.scrollHeight)); await p.waitForTimeout(900);
console.log('bottom p=',await p.evaluate(()=>getComputedStyle(document.querySelector('.nav')).getPropertyValue('--nav-p')));
await b.close();
