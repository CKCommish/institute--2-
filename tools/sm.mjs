import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy:false });
for (const [w,h,n] of [[320,568,'w320'],[620,900,'w620'],[621,900,'w621']]){
 const ctx=await b.newContext({viewport:{width:w,height:h}, isMobile:w<500, hasTouch:w<500});
 const p=await ctx.newPage(); await p.goto('http://127.0.0.1:4420/',{waitUntil:'networkidle'}); await p.waitForTimeout(2400);
 await p.screenshot({path:`shots/${n}.png`}); await ctx.close();
}
await b.close();
