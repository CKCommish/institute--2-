import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const O=process.env.S;
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
const p=await ctx.newPage();
await p.goto('http://127.0.0.1:4420/people/',{waitUntil:'domcontentloaded'});
const t0=Date.now();
for(const t of [100,200,300,450,600,800,1100,1500]){
  const w=t-(Date.now()-t0); if(w>0) await p.waitForTimeout(w);
  await p.screenshot({path:`${O}/shots/T-${t}.png`, clip:{x:40,y:150,width:1360,height:350}});
  const m=await p.evaluate(()=>{
    const g=(s)=>{const e=document.querySelector(s);const c=getComputedStyle(e);return {op:c.opacity,tr:c.transform};};
    const sp=[...document.querySelectorAll('.pm__h .line > span')].map(s=>getComputedStyle(s).transform);
    return {rows:[...document.querySelectorAll('.pm__idx-i')].map(r=>{const c=getComputedStyle(r);return c.opacity+'|'+c.transform;}), spans:sp, h1:g('.pm__h')};
  });
  console.log(t, JSON.stringify(m));
}
await ctx.close(); await b.close();
