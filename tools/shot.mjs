import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad';
const B='http://127.0.0.1:4420';
const b = await launch({ proxy: false });
const widths=[1440,1180,1024,900,760,700,640,621,620,390];
const out={};
for (const w of widths){
  const mobile=w<=620;
  const ctx=await b.newContext({viewport:{width:w,height:mobile?844:900},deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
  const p=await ctx.newPage();
  await p.goto(B+'/pilots/',{waitUntil:'networkidle'});
  await p.evaluate(()=>window.scrollTo(0,0));
  await p.waitForTimeout(900);
  const m=await p.evaluate(()=>{
    const grid=document.querySelector('.pgrid__grid');
    const cells=[...document.querySelectorAll('.pgrid__cell')];
    const gr=grid.getBoundingClientRect();
    const gcs=getComputedStyle(grid);
    return {
      gridCols:gcs.gridTemplateColumns,
      gridRect:{x:gr.x,w:gr.width,h:gr.height},
      gridBorderTop:gcs.borderTopWidth+' '+gcs.borderTopColor,
      colGap:gcs.columnGap,
      cells:cells.map((c,i)=>{
        const cs=getComputedStyle(c,'::after');
        const r=c.getBoundingClientRect();
        const cc=getComputedStyle(c);
        return {i,x:+r.x.toFixed(2),y:+r.y.toFixed(2),w:+r.width.toFixed(2),h:+r.height.toFixed(2),
          afterDisplay:cs.display, afterContent:cs.content, afterLeft:cs.left, afterWidth:cs.width,
          afterBg:cs.backgroundColor, afterMask:(cs.maskImage||cs.webkitMaskImage||'').slice(0,60),
          afterHeight:cs.height, afterPos:cs.position,
          cellBorderTop:cc.borderTopWidth+' '+cc.borderTopColor};
      }),
      labels:(()=>{
        const rows=[...document.querySelectorAll('.card')].map(card=>{
          const q=s=>card.querySelector(s);
          const rect=e=>e?{y:+e.getBoundingClientRect().y.toFixed(2),x:+e.getBoundingClientRect().x.toFixed(2)}:null;
          const dts=[...card.querySelectorAll('.card__row .label')];
          return {title:rect(q('.card__t')), rail:rect(q('.card__rail')),
            fields:dts.map(d=>+d.getBoundingClientRect().y.toFixed(2)),
            door:rect(q('.card__door')),
            titleFS:getComputedStyle(q('.card__t')).fontSize,
            tagFS:getComputedStyle(q('.card__tag')).fontSize,
            ddFS:getComputedStyle(card.querySelector('.card__f dd')).fontSize,
            ddLH:getComputedStyle(card.querySelector('.card__f dd')).lineHeight};
        });
        return rows;
      })(),
    };
  });
  out[w]=m;
  // screenshot band region
  const el=await p.$('.pgrid');
  await el.screenshot({path:`${OUT}/band-${w}.png`});
  await p.screenshot({path:`${OUT}/top-${w}.png`});
  await ctx.close();
}
console.log(JSON.stringify(out,null,1));
await b.close();
