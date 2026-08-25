import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const S='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const tag=process.argv[2]||'x';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:4});
const p=await ctx.newPage();
const errs=[];p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});p.on('pageerror',e=>errs.push(String(e)));
await p.goto('http://127.0.0.1:4420/pilots/',{waitUntil:'networkidle'});
await p.waitForTimeout(600);
const res=await p.evaluate(async()=>{
  const dpr=4;
  const caps=async(el)=>{
    const r=el.getBoundingClientRect();
    return {r};
  };
  // render-based cap measurement: use canvas? instead use Range + font metrics via TextMetrics
  const capOf=(el,txt)=>{
    const cs=getComputedStyle(el);
    const c=document.createElement('canvas').getContext('2d');
    c.font=`${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m=c.measureText(txt||el.textContent.trim());
    return {asc:m.actualBoundingBoxAscent,desc:m.actualBoundingBoxDescent,fs:parseFloat(cs.fontSize)};
  };
  const baselineOf=(el)=>{
    // put a zero-width inline-block probe to find baseline
    const s=document.createElement('span');
    
    s.style.cssText='display:inline-block;width:0;height:0;vertical-align:baseline';
    el.appendChild(s);
    const y=s.getBoundingClientRect().top;
    s.remove();
    return y;
  };
  const out={};
  const link=document.querySelectorAll('.nav__link')[0];
  const cta=document.querySelector('.cta__t');
  const wmA=document.querySelector('.nav__mark .wm__a');
  const ctaBox=document.querySelector('.cta');
  const rows=[['link',link],['cta',cta],['wm',wmA]];
  for(const [k,el] of rows){
    const bl=baselineOf(el);
    const cm=capOf(el, k==='wm'?'LION':undefined);
    out[k]={baseline:+bl.toFixed(2), capTop:+(bl-cm.asc).toFixed(2), fs:cm.fs, cap:+cm.asc.toFixed(2),
            font:getComputedStyle(el).fontFamily.split(',')[0], w:getComputedStyle(el).fontWeight};
  }
  const rb=ctaBox.getBoundingClientRect();
  out.ring={top:+rb.top.toFixed(2),bottom:+rb.bottom.toFixed(2),h:+rb.height.toFixed(2),right:+rb.right.toFixed(2)};
  out.markLeft=+document.querySelector('.nav__mark').getBoundingClientRect().left.toFixed(2);
  out.overflow=document.documentElement.scrollWidth>document.documentElement.clientWidth;
  return out;
});
console.log(JSON.stringify(res,null,1));
console.log('ERRORS',errs);
await p.screenshot({path:`${S}/${tag}-desktop.png`,clip:{x:0,y:0,width:1440,height:120}});
const c2=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:4,isMobile:true,hasTouch:true});
const p2=await c2.newPage();
const e2=[];p2.on('console',m=>{if(m.type()==='error')e2.push(m.text())});p2.on('pageerror',e=>e2.push(String(e)));
await p2.goto('http://127.0.0.1:4420/pilots/',{waitUntil:'networkidle'});
await p2.waitForTimeout(500);
const r2=await p2.evaluate(()=>{
 const bl=(el)=>{const s=document.createElement('span');s.style.cssText='display:inline-block;width:0;height:0;vertical-align:baseline';el.appendChild(s);const y=s.getBoundingClientRect().top;s.remove();return +y.toFixed(2)};
 const cap=(el,t)=>{const cs=getComputedStyle(el);const c=document.createElement('canvas').getContext('2d');c.font=`${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;return c.measureText(t||el.textContent.trim()).actualBoundingBoxAscent};
 const o=document.querySelector('.burger__o'), t=document.querySelector('.burger__t'), wm=document.querySelector('.nav__mark .wm__a');
 const rb=o.getBoundingClientRect();
 const b1=bl(t), b2=bl(wm);
 return {burgerBaseline:b1,burgerCapTop:+(b1-cap(t)).toFixed(2),ring:{top:+rb.top.toFixed(2),bottom:+rb.bottom.toFixed(2),h:+rb.height.toFixed(2)},
   airTop:+(b1-cap(t)-rb.top).toFixed(2), airBot:+(rb.bottom-b1).toFixed(2),
   wmBaseline:b2, wmCapTop:+(b2-cap(wm,'LION')).toFixed(2),
   overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth};
});
console.log('MOBILE',JSON.stringify(r2));
console.log('MERRORS',e2);
await p2.screenshot({path:`${S}/${tag}-mobile.png`,clip:{x:0,y:0,width:390,height:110}});
await b.close();
