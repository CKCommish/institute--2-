import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const BASE='http://127.0.0.1:4410';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900}});
const page=await ctx.newPage();
const errs=[]; page.on('console',m=>{if(m.type()==='error')errs.push(m.text())}); page.on('pageerror',e=>errs.push(String(e)));
const out=[];
for(const route of ['/pilots/','/institute/','/partner/','/people/','/forum/']){
  await page.goto(BASE+route,{waitUntil:'networkidle'});
  // find a scroll y where the nav inverts
  const y=await page.evaluate(()=>{
    const light=[...document.querySelectorAll('.on-cream')];
    if(!light.length) return null;
    const r=light[0].getBoundingClientRect();
    return Math.round(window.scrollY + r.top + 200);
  });
  if(y==null){ out.push({route,inverted:'no .on-cream'}); continue; }
  await page.evaluate((y)=>scrollTo(0,y),y);
  await page.waitForTimeout(800);
  const st=await page.evaluate(()=>{
    const nav=document.querySelector('.nav'), a=document.querySelector('.nav__mark');
    const r=a.getBoundingClientRect();
    const el=document.elementFromPoint(r.left+8,r.top+r.height/2);
    return {inverted:nav.classList.contains('is-inverted'), pe:getComputedStyle(a).pointerEvents, hit:el&&a.contains(el), b:getComputedStyle(a.querySelector('.wm__b')).color};
  });
  await page.hover('.nav__mark'); await page.waitForTimeout(500);
  const bHover=await page.evaluate(()=>getComputedStyle(document.querySelector('.nav__mark .wm__b')).color);
  if(st.inverted){ await page.screenshot({path:`${OUT}/d-inv${route.replace(/\//g,'_')}.png`,clip:{x:0,y:0,width:1440,height:110}}); }
  await page.mouse.move(700,760);
  out.push({route,...st,bHover,changed:st.b!==bHover});
}
// focus-visible on the mark (keyboard reach)
await page.goto(BASE+'/pilots/',{waitUntil:'networkidle'});
await page.keyboard.press('Tab');
const focused=await page.evaluate(()=>({cls:document.activeElement.className,tag:document.activeElement.tagName}));
await page.screenshot({path:`${OUT}/d-mark-focus.png`,clip:{x:0,y:0,width:600,height:80}});
out.push({firstTab:focused,errs});
await b.close();
console.log(JSON.stringify(out,null,1));
