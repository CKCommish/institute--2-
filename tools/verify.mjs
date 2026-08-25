import { launch } from '/home/user/institute--2-/tools/browser.mjs';
import sharp from '/home/user/institute--2-/node_modules/sharp/dist/index.cjs';
const OUT='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots';
const b=await launch({proxy:false});
async function baselines(file){
  const {data,info}=await sharp(file).raw().toBuffer({resolveWithObject:true});
  const {width,channels}=info;const dpr=4;
  const band=(x0,x1)=>{let bot=null;for(let yc=15;yc<=50;yc+=0.25){const y=Math.round(yc*dpr);let mx=0;for(let x=Math.round(x0*dpr);x<Math.round(x1*dpr);x++){const i=(y*width+x)*channels;const l=0.299*data[i]+0.587*data[i+1]+0.114*data[i+2];if(l>150)mx=l;}if(mx)bot=yc;}return bot;};
  return {wm:band(21.8,28), menu:band(318,327)};
}
for(const css of ['', '.burger__o{top:-0.12em !important;}', '.nav__mark{top:0 !important;}']){
  const c=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:4});
  const p=await c.newPage(); await p.goto('http://127.0.0.1:4420/pilots/',{waitUntil:'networkidle'});
  if(css) await p.addStyleTag({content:css});
  await p.evaluate(()=>window.scrollTo(0,600)); await p.waitForTimeout(600);
  const f=OUT+'/verify-'+(css?css.slice(0,12).replace(/\W/g,''):'base')+'.png';
  await p.screenshot({path:f,clip:{x:0,y:0,width:390,height:58}});
  console.log(JSON.stringify(css||'BASE'), JSON.stringify(await baselines(f)));
  await c.close();
}
await b.close();
