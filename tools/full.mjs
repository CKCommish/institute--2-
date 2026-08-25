import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900}, deviceScaleFactor:0.34});
const p=await ctx.newPage();
for (const r of (process.argv[2]||'/institute/,/forum/,/pilots/,/people/,/partner/').split(',')) {
  await p.goto('http://127.0.0.1:4460'+r,{waitUntil:'networkidle'});
  // force all reveals in so the full-page shot is at rest
  await p.evaluate(async ()=>{
    const h=document.documentElement.scrollHeight;
    for(let y=0;y<h;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,90));}
    window.scrollTo(0,0);
  });
  await p.waitForTimeout(1800);
  const n='full'+r.replace(/\//g,'_').replace(/^_|_$/g,'')||'home';
  await p.screenshot({path:`${OUT}/${n||'fullhome'}.png`, fullPage:true});
  console.log(n);
}
await b.close();
