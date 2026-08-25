import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const S='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy:false });
const c = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:3 });
const p = await c.newPage();
for (const pg of ['/people/','/institute/','/']) {
  await p.goto('http://127.0.0.1:4420'+pg,{waitUntil:'networkidle'}); await p.waitForTimeout(600);
  for (let y=0;y<9000;y+=700){
    await p.evaluate(v=>scrollTo(0,v), y); await p.waitForTimeout(450);
    const inv = await p.evaluate(()=>document.querySelector('.nav').classList.contains('is-inverted'));
    if (inv){ const tag=pg.replace(/\//g,'')||'home';
      await p.screenshot({path:`${S}/nz-inv-${tag}.png`, clip:{x:0,y:0,width:1440,height:64}});
      console.log('inverted at', pg, y);
      const m = await p.evaluate(()=>{const e=document.querySelector('.cta');const c=getComputedStyle(e);return{border:c.borderTopColor,color:c.color,bg:c.backgroundColor};});
      console.log('  cta', JSON.stringify(m));
      break; }
  }
}
// scroll progress hairline
await p.goto('http://127.0.0.1:4420/pilots/',{waitUntil:'networkidle'});
await p.evaluate(()=>scrollTo(0,document.body.scrollHeight/2)); await p.waitForTimeout(600);
await p.screenshot({path:S+'/nz-progress.png', clip:{x:0,y:0,width:1440,height:70}});
console.log(JSON.stringify(await p.evaluate(()=>{const e=document.querySelector('.nav__rule, .nav [class*=rule], .nav__prog, .nav [class*=prog]');if(!e)return 'none';const r=e.getBoundingClientRect();const c=getComputedStyle(e);return{cls:e.className,r:[r.left,r.top,r.width,r.height],bg:c.background.slice(0,60),op:c.opacity};})));
await c.close(); await b.close();
