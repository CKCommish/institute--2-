import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const B='http://127.0.0.1:4420';
const b = await launch({ proxy:false });
const ctx = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2 });
const p = await ctx.newPage();
await p.goto(B+'/pilots/', {waitUntil:'networkidle'});
await p.waitForTimeout(700);
await p.screenshot({path:OUT+'/m-bar-closed.png'});
await p.tap('[data-burger]');
await p.waitForTimeout(1400);
await p.screenshot({path:OUT+'/m-sheet.png'});
const d = await p.evaluate(()=>{
  const rows=[...document.querySelectorAll('.menu__links a')];
  const out=rows.map(a=>{
    const idx=a.querySelector('.index'), w=a.querySelector('.menu__w');
    const ri=idx.getBoundingClientRect(), rw=w.getBoundingClientRect();
    const cs=getComputedStyle(w), ci=getComputedStyle(idx);
    // ink left via Range on first glyph
    const tn=w.firstChild; const r=document.createRange(); r.setStart(tn,0); r.setEnd(tn,1);
    const g=r.getBoundingClientRect();
    return {word:w.textContent, idxLeft:+ri.left.toFixed(2), idxRight:+ri.right.toFixed(2), idxW:+ri.width.toFixed(2),
      wordLeft:+rw.left.toFixed(2), wordRight:+rw.right.toFixed(2), glyphLeft:+g.left.toFixed(2),
      fs:cs.fontSize, ff:cs.fontFamily.split(',')[0], idxFs:ci.fontSize, idxDisplay:ci.display, idxFlex:ci.flex, idxIS:ci.inlineSize, idxTA:ci.textAlign,
      rowTop:+a.getBoundingClientRect().top.toFixed(2), rowH:+a.getBoundingClientRect().height.toFixed(2),
      gap:getComputedStyle(a).gap };
  });
  const cta=document.querySelector('.menu__cta').getBoundingClientRect();
  const foot=document.querySelector('.menu__foot').getBoundingClientRect();
  const mi=document.querySelector('.menu__in').getBoundingClientRect();
  const gutter=getComputedStyle(document.documentElement).getPropertyValue('--gutter');
  return {out, cta:{l:+cta.left.toFixed(2),t:+cta.top.toFixed(2),w:+cta.width.toFixed(2),h:+cta.height.toFixed(2)},
    foot:{l:+foot.left.toFixed(2),t:+foot.top.toFixed(2)}, miPadL:getComputedStyle(document.querySelector('.menu__in')).paddingLeft, gutter};
});
console.log(JSON.stringify(d,null,1));
await b.close();
