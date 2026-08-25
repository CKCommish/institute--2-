import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy:false });
const ctx = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:1 });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4420/', {waitUntil:'networkidle'});
await p.waitForTimeout(2200);
const out=[];
for (const w of [1600,1440,1300,1250,1245,1241,1240,1200,1100,1082,1081,1080,1035,900,800,700,660,640,621,620,600,500,440,390,340,320]){
  await p.setViewportSize({width:w,height:900});
  await p.waitForTimeout(180);
  const m = await p.evaluate(()=>{
    const poster=document.querySelector('.hero__poster');
    const r=document.createRange(); r.selectNodeContents(poster);
    const rects=[...r.getClientRects()].filter(x=>x.width>1&&x.height>1);
    const lines={};
    for(const rc of rects){const k=Math.round(rc.top);lines[k]=lines[k]||{l:1e9,r:-1e9};lines[k].l=Math.min(lines[k].l,rc.left);lines[k].r=Math.max(lines[k].r,rc.right);}
    const ks=Object.keys(lines).map(Number).sort((a,b)=>a-b);
    const shell=document.querySelector('.hero__mid.shell').getBoundingClientRect();
    const avail=shell.right - (+getComputedStyle(document.querySelector('.hero__mid.shell')).paddingRight.replace('px','')||0);
    const rule=document.querySelector('.hero__rule').getBoundingClientRect();
    return {n:ks.length, widths:ks.map(k=>+(lines[k].r-lines[k].l).toFixed(1)), rights:ks.map(k=>+lines[k].r.toFixed(1)), ruleRight:+rule.right.toFixed(1), ruleLeft:+rule.left.toFixed(1),
      overflow: document.documentElement.scrollWidth > innerWidth ? document.documentElement.scrollWidth : 0};
  });
  out.push(`vw=${String(w).padStart(4)} n=${m.n} widths=[${m.widths}] lastRight=${m.rights[m.rights.length-1]} maxRight=${Math.max(...m.rights)} ruleR=${m.ruleRight} air=${(m.ruleRight-Math.max(...m.rights)).toFixed(1)} ovf=${m.overflow}`);
}
console.log(out.join('\n'));
await b.close();
