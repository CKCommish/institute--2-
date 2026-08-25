import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({proxy:false});
const ctx = await b.newContext({viewport:{width:1440,height:900}});
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4455/partner/',{waitUntil:'networkidle'});
await p.waitForTimeout(1500);
const hrefs = await p.$$eval('main a, section a', es=>es.map(e=>e.getAttribute('href')));
console.log(hrefs.join('\n'));
// follow pilot anchor
await p.goto('http://127.0.0.1:4455/pilots/#clean-data-centers',{waitUntil:'networkidle'}).catch(()=>{});
await p.waitForTimeout(2500);
console.log('landed scrollY', await p.evaluate(()=>window.scrollY));
await p.screenshot({path:'anchor-land.png'});
await b.close();
