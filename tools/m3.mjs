import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1440,height:900}});
const p=await ctx.newPage();
await p.goto('http://127.0.0.1:4420/',{waitUntil:'networkidle'});
const probe=`(()=>{const el=document.querySelector('.hero__poster');
const orig=el.innerHTML;
el.innerHTML=orig.replace(/([^<>\\s]+)/g,(m)=>m.includes('=')||m.startsWith('/')?m:m);
const walk=(n,out)=>{for(const c of [...n.childNodes]){if(c.nodeType===3){const parts=c.textContent.split(/(\\s+)/);const f=document.createDocumentFragment();for(const t of parts){if(!t)continue;if(/^\\s+$/.test(t))f.appendChild(document.createTextNode(t));else{const s=document.createElement('span');s.className='__w';s.textContent=t;f.appendChild(s);}}c.replaceWith(f);}else if(c.nodeType===1&&c.tagName!=='BR')walk(c,out);}};
walk(el);
const map=new Map();
for(const w of el.querySelectorAll('.__w')){const r=w.getBoundingClientRect();const k=Math.round(r.top);const v=map.get(k)||[1e9,-1e9];map.set(k,[Math.min(v[0],r.left),Math.max(v[1],r.right)]);}
const lines=[...map.entries()].sort((a,b)=>a[0]-b[0]).map(([t,[l,r]])=>Math.round((r-l)*10)/10);
const shell=document.querySelector('.hero__mid').getBoundingClientRect();
const last=[...map.entries()].sort((a,b)=>a[0]-b[0]).pop();
el.innerHTML=orig;
return {n:lines.length,lines,airLast:Math.round((shell.right-last[1][1])*10)/10};})()`;
for(const w of [1440,1240,1180,1152,1120,1100,1099,1024]){
  await p.setViewportSize({width:w,height:900}); await p.waitForTimeout(250);
  console.log(w, JSON.stringify(await p.evaluate(probe)));
}
await b.close();
