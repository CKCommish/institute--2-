import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad';
const tag=process.argv[2];
const vps=JSON.parse(process.argv[3]);
const b=await launch({proxy:false});
const errs=[];
for(const v of vps){
  const ctx=await b.newContext({viewport:{width:v.w,height:v.h},isMobile:v.w<600,hasTouch:v.w<600,deviceScaleFactor:1});
  const p=await ctx.newPage();
  p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(`${v.w}x${v.h} ${m.type()}: ${m.text()}`);});
  p.on('pageerror',e=>errs.push(`${v.w}x${v.h} pageerror: ${e.message}`));
  await p.goto('http://127.0.0.1:4411/',{waitUntil:'networkidle'});
  await p.waitForTimeout(2000);
  await p.screenshot({path:`${OUT}/${tag}-${v.w}x${v.h}.png`,clip:{x:0,y:0,width:v.w,height:v.h}});
  const r=await p.evaluate(()=>{
    const img=document.querySelector('.hero__bg img');const b=img.getBoundingClientRect();
    return {sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,
      imgTop:+b.top.toFixed(1),imgBot:+b.bottom.toFixed(1),imgL:+b.left.toFixed(1),imgR:+b.right.toFixed(1),
      heroH:document.querySelector('.hero').getBoundingClientRect().height};
  });
  console.log(v.w+'x'+v.h, JSON.stringify(r));
  await ctx.close();
}
await b.close();
console.log('CONSOLE:', errs.length?errs.join('\n'):'clean');
