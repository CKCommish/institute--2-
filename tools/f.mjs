import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy:false });
const c = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:2 });
const p = await c.newPage();
for (const [r,l] of [['/forum/','forum'],['/institute/','institute'],['/404','404']]) {
  const resp=await p.goto('http://127.0.0.1:4454'+r,{waitUntil:'networkidle'}); await p.waitForTimeout(1300);
  await p.screenshot({path:`${OUT}/d-${l}-top.png`, clip:{x:0,y:0,width:1440,height:90}});
  // scroll through and find worst scrim moment: any cream edge
  const cuts = await p.evaluate(()=>[...document.querySelectorAll('.on-cream, section')].map(e=>Math.round(e.getBoundingClientRect().top+scrollY)).filter(v=>v>200));
  for (const [i,y] of cuts.slice(0,4).entries()){ await p.evaluate(v=>window.scrollTo(0,v-30),y); await p.waitForTimeout(1300);
    await p.screenshot({path:`${OUT}/d-${l}-edge${i}.png`, clip:{x:0,y:0,width:1440,height:110}}); }
  console.log(l, resp.status(), cuts.slice(0,4));
}
await c.close(); await b.close();
