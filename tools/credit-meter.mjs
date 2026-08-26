/* Measure each .fig__credit against the backdrop it ACTUALLY sits on,
   with its own text-shadow already applied (color:transparent keeps the
   shadow, drops the glyph). Read against the tokens.css ceiling for the
   micro register over photography: --fg-meta needs backdrop <= L* 20.

   WHY THIS EXISTS ALONGSIDE photo-meter.mjs: photo-meter measures only the
   type it finds overlapping a figure IN THE FIRST VIEWPORT — it never
   scrolls. Six of the site's eleven credits are below the fold on their
   route, so they were never measured, and five of them were failing. This
   scrolls each credit into view, hides only the glyph (color: transparent
   keeps the text-shadow and the placed pad), and measures the protected
   backdrop the reader actually meets, at both viewports.

   usage: BASE=http://127.0.0.1:<port> node tools/credit-meter.mjs */
import { launch } from './browser.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:4480';
import sharp from 'sharp';
const lin=c=>{c/=255;return c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4};
const Y=(r,g,b)=>0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
const L=y=>y>0.008856?116*Math.cbrt(y)-16:903.3*y;
const cr=(a,b)=>{const[h,l]=a>b?[a,b]:[b,a];return (h+0.05)/(l+0.05)};
const CREAM=Y(242,237,227), META=0.54;
const b=await launch({proxy:false});
let fails=0;
for(const vp of [{w:1440,h:900,m:false},{w:390,h:844,m:true}]){
const ctx=await b.newContext({viewport:{width:vp.w,height:vp.h},deviceScaleFactor:2,...(vp.m?{isMobile:true,hasTouch:true}:{})});
const p=await ctx.newPage();
for(const r of ['/','/institute/','/pilots/','/forum/','/people/']){
 await p.goto(BASE+r,{waitUntil:'networkidle'});
 await p.evaluate(async()=>{const H=document.documentElement.scrollHeight;for(let y=0;y<H;y+=innerHeight*0.5){scrollTo(0,y);await new Promise(r=>setTimeout(r,80));}});
 await p.waitForTimeout(1000);
 const n=await p.evaluate(()=>document.querySelectorAll('.fig__credit').length);
 for(let i=0;i<n;i++){
  const info=await p.evaluate(i=>{const e=document.querySelectorAll('.fig__credit')[i];
   e.scrollIntoView({block:'center',behavior:'instant'});
   const c=getComputedStyle(e);const rc=e.getBoundingClientRect();
   return{txt:e.textContent.trim(),lines:Math.round(rc.height/parseFloat(c.lineHeight)),color:c.color};},i);
  await p.waitForTimeout(450);
  await p.evaluate(i=>{document.querySelectorAll('.fig__credit')[i].style.color='transparent'},i);
  const bx=await p.evaluate(i=>{const rc=document.querySelectorAll('.fig__credit')[i].getBoundingClientRect();return{x:rc.x,y:rc.y,w:rc.width,h:rc.height}},i);
  if(bx.w<2||bx.y<0||bx.y+bx.h>vp.h){await p.evaluate(i=>{document.querySelectorAll('.fig__credit')[i].style.color=''},i);continue;}
  const buf=await p.screenshot({clip:{x:bx.x,y:bx.y,width:bx.w,height:bx.h}});
  await p.evaluate(i=>{document.querySelectorAll('.fig__credit')[i].style.color=''},i);
  const {data,info:im}=await sharp(buf).raw().toBuffer({resolveWithObject:true});
  const ys=[];for(let k=0;k<data.length;k+=im.channels)ys.push(Y(data[k],data[k+1],data[k+2]));
  ys.sort((a,b)=>a-b);
  const p95=ys[Math.round((ys.length-1)*0.95)];
  const eff=META*CREAM+(1-META)*p95;
  const c=cr(eff,p95); const ok=c>=4.5;
  if(!ok)fails++;
  console.log(`${String(vp.w).padStart(4)} ${r.padEnd(12)} L${info.lines} backdropL*=${L(p95).toFixed(1).padStart(5)}  ${c.toFixed(2).padStart(5)}:1  ${ok?'ok  ':'FAIL'}  "${info.txt}"`);
 }
}
await ctx.close();}
await b.close();
console.log(`\n${fails} credit contrast failure(s).`);
