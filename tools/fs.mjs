import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b=await launch({proxy:false});
for (const [w,h,sel] of [[390,844,'.burger__t'],[1440,900,'.cta__t']]) {
 const p=await (await b.newContext({viewport:{width:w,height:h}})).newPage();
 await p.goto('http://127.0.0.1:4420/pilots/',{waitUntil:'networkidle'});
 console.log(w, await p.evaluate(s=>getComputedStyle(document.querySelector(s)).fontSize, sel));
}
await b.close();
