import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({proxy:false});
const ctx = await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4455/partner/',{waitUntil:'networkidle'});
await p.waitForTimeout(1500);
const r = await p.evaluate(()=>{
  const e=document.querySelector('.ask__cue'); const cs=getComputedStyle(e); const b=e.getBoundingClientRect();
  const st=e.closest('section');
  return {display:cs.display,vis:cs.visibility,op:cs.opacity, rect:[b.left,b.top+scrollY,b.width,b.height], parent:e.parentElement.className, secTop:st.getBoundingClientRect().top+scrollY, secBot:st.getBoundingClientRect().bottom+scrollY, cls:e.className};
});
console.log(JSON.stringify(r,null,1));
// scroll to it and shoot
await p.evaluate(()=>window.scrollTo(0, 1250));
await p.waitForTimeout(2500);
await p.screenshot({path:'m-cue.png'});
await b.close();
