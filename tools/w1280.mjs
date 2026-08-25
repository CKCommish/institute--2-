import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const S='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots/';
const b = await launch({ proxy:false });
for (const w of [1280,1024]) {
  const p = await (await b.newContext({viewport:{width:w,height:900}})).newPage();
  await p.goto('http://127.0.0.1:4454/people/',{waitUntil:'networkidle'});
  const y = await p.evaluate(()=>Math.round(document.querySelector('.wall').getBoundingClientRect().top+scrollY-60));
  const cur=0; const steps=Math.round(y/100);
  for(let i=1;i<=steps;i++){ await p.evaluate(v=>window.scrollTo(0,v), y*i/steps); await p.waitForTimeout(50);}
  await p.waitForTimeout(2500);
  await p.screenshot({path:S+`w-${w}.png`});
  await p.close();
}
await b.close();
