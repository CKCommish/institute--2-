import {chromium} from 'playwright';
const b=await chromium.launch();
for(const p of ['/institute/','/partner/']){
const pg=await b.newPage({viewport:{width:1440,height:900}});
await pg.goto('http://127.0.0.1:4664'+p,{waitUntil:'networkidle'});
await pg.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
await pg.waitForTimeout(1500);
await pg.evaluate(()=>window.scrollTo(0,0));
await pg.waitForTimeout(600);
const r=await pg.evaluate(()=>{
 const out=[];
 document.querySelectorAll('main section, main > *').forEach(s=>{
  const b=s.getBoundingClientRect();
  const cs=getComputedStyle(s);
  // first text child x
  let firstX=null;
  const w=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT);
  let n;while(n=w.nextNode()){const rb=n.getBoundingClientRect(); if(rb.width>0&&rb.height>0&&n.textContent.trim()){firstX=Math.round(rb.left);break;}}
  out.push({tag:s.tagName+'.'+(s.className||'').toString().slice(0,30),top:Math.round(b.top+scrollY),h:Math.round(b.height),bg:cs.backgroundColor,firstX});
 });
 const imgs=[...document.querySelectorAll('main img')].map(i=>{const r=i.getBoundingClientRect();return {src:i.currentSrc.split('/').pop(),w:Math.round(r.width),h:Math.round(r.height),x:Math.round(r.left),y:Math.round(r.top+scrollY)}});
 const fonts={};
 document.querySelectorAll('main *').forEach(e=>{if(e.children.length===0&&e.textContent.trim()){const cs=getComputedStyle(e);const k=parseFloat(cs.fontSize);fonts[k]=(fonts[k]||0)+1;}});
 return {out,imgs,fonts,H:document.body.scrollHeight};
});
console.log('=====',p,'height',r.H);
r.out.forEach(o=>console.log(String(o.top).padStart(5),'h'+String(o.h).padStart(5),'x'+String(o.firstX).padStart(5),o.bg.padEnd(22),o.tag));
console.log('IMGS',JSON.stringify(r.imgs));
console.log('FONTS',JSON.stringify(Object.entries(r.fonts).sort((a,b)=>b[0]-a[0])));
await pg.close();
}
await b.close();
