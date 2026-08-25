import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const BASE='http://127.0.0.1:4420/';
const widths=[1440,1240,1180,1100,1099,1080,1060,1024,900,834,768,700,621,620,540,430,390,375,360,320];
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
const p=await ctx.newPage();
await p.goto(BASE,{waitUntil:'networkidle'});
for(const w of widths){
  await p.setViewportSize({width:w,height:900});
  await p.waitForTimeout(450);
  const d=await p.evaluate(()=>{
    const lineRects=(el)=>{
      const out=[];
      const walk=(n)=>{
        if(n.nodeType===3){ const r=document.createRange(); r.selectNodeContents(n); out.push(...[...r.getClientRects()]); }
        else n.childNodes.forEach(walk);
      };
      walk(el);
      // merge rects on same baseline row
      const rows=[];
      for(const r of out){ if(r.width<0.5) continue;
        let row=rows.find(x=>Math.abs(x.t-r.top)<6);
        if(!row){row={t:r.top,l:r.left,r:r.right};rows.push(row);}
        else {row.l=Math.min(row.l,r.left);row.r=Math.max(row.r,r.right);}
      }
      rows.sort((a,b)=>a.t-b.t);
      return rows.map(x=>({t:+x.t.toFixed(1),l:+x.l.toFixed(1),w:+(x.r-x.l).toFixed(1)}));
    };
    const poster=document.querySelector('.hero__poster');
    const kicker=document.querySelector('.hero__kicker');
    const shell=document.querySelector('.hero__mid');
    const sr=shell.getBoundingClientRect();
    const cs=getComputedStyle(shell);
    const inner={l:sr.left+parseFloat(cs.paddingLeft), r:sr.right-parseFloat(cs.paddingRight)};
    return {vw:innerWidth, measure:+(inner.r-inner.l).toFixed(1), railL:+inner.l.toFixed(1), railR:+inner.r.toFixed(1),
      poster:lineRects(poster), kicker:lineRects(kicker), fs:+parseFloat(getComputedStyle(poster).fontSize).toFixed(1)};
  });
  const pl=d.poster;
  const widthsArr=pl.map(x=>x.w);
  const maxw=Math.max(...widthsArr);
  const last=widthsArr[widthsArr.length-1];
  console.log(`${String(w).padStart(4)} fs=${String(d.fs).padStart(6)} measure=${String(d.measure).padStart(7)} railR=${d.railR}  kick=[${d.kicker.map(x=>x.w).join(',')}]  poster=[${widthsArr.join(' / ')}]  lefts=[${pl.map(x=>x.l).join(',')}]  lastGap=${(d.railR-(pl[pl.length-1].l+last)).toFixed(1)}  last%=${(100*last/maxw).toFixed(0)}%`);
}
await b.close();
