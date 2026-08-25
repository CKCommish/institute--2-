import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b=await launch({proxy:false});const ctx=await b.newContext({viewport:{width:1440,height:900}});const p=await ctx.newPage();
await p.goto('http://127.0.0.1:4420/people/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate(()=>{
 const h=document.querySelector('.pm__h');
 const out=[];
 const walk=(el,d)=>{out.push({d,cls:el.className,tag:el.tagName,r:el.getBoundingClientRect().toJSON(),st:{lh:getComputedStyle(el).lineHeight,ov:getComputedStyle(el).overflow,tr:getComputedStyle(el).transform,disp:getComputedStyle(el).display}});[...el.children].forEach(c=>walk(c,d+1));};
 walk(h,0);
 const rg=document.createRange();rg.selectNodeContents(h);
 return {out,rects:[...rg.getClientRects()].map(r=>({t:+r.top.toFixed(1),b:+r.bottom.toFixed(1),h:+r.height.toFixed(1)}))};
}),null,1));await b.close();
