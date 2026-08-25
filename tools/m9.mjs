import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const S='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b = await launch({ proxy:false });
for (const [lab,w,h,mob] of [['sheet768',768,1024,false],['sheet939',939,800,false],['sheet360',360,740,true],['sheetland',844,390,true]]) {
  const c = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:2, isMobile:mob, hasTouch:mob });
  const p = await c.newPage();
  await p.goto('http://127.0.0.1:4420/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
  await p.click('[data-burger]'); await p.waitForTimeout(1100);
  await p.screenshot({path:`${S}/nz-${lab}.png`});
  const m = await p.evaluate(()=>[...document.querySelectorAll('.menu__links a')].map(a=>{
    const i=a.querySelector('.index'), wd=a.querySelector('.menu__w');
    const ri=i.getBoundingClientRect(), rw=wd.getBoundingClientRect(); const ci=getComputedStyle(i);
    return {t:wd.textContent, idxL:+ri.left.toFixed(2), idxR:+ri.right.toFixed(2), idxW:+ri.width.toFixed(2), wL:+rw.left.toFixed(2), fs:ci.fontSize, wfs:getComputedStyle(wd).fontSize};}));
  console.log(lab, JSON.stringify(m));
  await c.close();
}
await b.close();
