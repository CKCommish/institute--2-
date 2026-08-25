import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b=await launch({proxy:false});
const args = JSON.parse(process.argv[2]);
for (const a of args) {
  const ctx=await b.newContext({viewport:a.vp||{width:1440,height:900}, deviceScaleFactor:2, ...(a.mobile?{isMobile:true,hasTouch:true}:{})});
  const p=await ctx.newPage();
  await p.goto('http://127.0.0.1:4460'+a.route,{waitUntil:'networkidle'});
  await p.waitForTimeout(1400);
  if (a.scroll) { await p.evaluate(y=>window.scrollTo(0,y), a.scroll); await p.waitForTimeout(1400); }
  if (a.hover) await p.hover(a.hover).catch(()=>{});
  if (a.focus) await p.focus(a.focus).catch(()=>{});
  if (a.wait) await p.waitForTimeout(a.wait);
  await p.screenshot({path:`${OUT}/${a.name}.png`, clip:a.clip});
  await ctx.close();
}
await b.close();
