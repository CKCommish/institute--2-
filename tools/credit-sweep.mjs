/* A photo credit on a held scene sits over a MOVING backdrop. A single sample
   is a coin toss; this sweeps every credit through the whole range in which it
   is on screen and reports the worst moment. */
import { launch } from './browser.mjs';
import sharp from 'sharp';
const srgb=c=>{c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);};
const lum=([r,g,b])=>0.2126*srgb(r)+0.7152*srgb(g)+0.0722*srgb(b);
const ratio=(a,b)=>{const[x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+0.05)/(y+0.05);};
const Lstar=l=>l<=0.008856?l*903.3:116*Math.pow(l,1/3)-16;

const base=process.env.BASE||'http://127.0.0.1:4399';
const SAMPLES=Number(process.env.SAMPLES||24);
const b=await launch({proxy:false});
let worst={r:99};
for (const vp of [{width:1440,height:900,tag:'desktop'},{width:390,height:844,tag:'mobile'}]) {
  const ctx=await b.newContext({viewport:{width:vp.width,height:vp.height}});
  const p=await ctx.newPage();
  for (const route of ['/','/forum/','/institute/','/pilots/','/people/','/partner/']) {
    await p.goto(base+route,{waitUntil:'networkidle'});
    await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(600);
    const h=await p.evaluate(()=>document.documentElement.scrollHeight);
    for (let i=0;i<SAMPLES;i++) {
      const y=Math.round((h-vp.height)*(i/(SAMPLES-1)));
      await p.evaluate(y=>window.scrollTo(0,y),y); await p.waitForTimeout(260);
      const boxes=await p.evaluate(()=>{
        /* THE FIXED NAV IS NOT A BACKDROP. A credit scrolling under the
           header is occluded by it, not sitting on a bright photograph, and
           clipping a screenshot through it samples the nav's cream wordmark
           and brass rule and calls the result a contrast failure. It is the
           same class of exclusion hold-meter makes for a beat mid-crossfade:
           a moment the reader is not being asked to read is not a moment this
           meter has an opinion about. Anything overlapping the header is
           skipped; the credit is measured on the way past, not underneath. */
        const nav=document.querySelector('[data-nav]');
        const floor=nav?nav.getBoundingClientRect().bottom:0;
        return [...document.querySelectorAll('.fig__credit')].map(el=>{
        const r=el.getBoundingClientRect();
        /* The credit is cream over a photograph and dark ink on a cream
           ground. Hardcoding cream compared cream against cream and reported
           1.00:1 — a defect that does not exist. Read the real colour. */
        return {t:el.textContent.trim().slice(0,30),x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),
                fg:getComputedStyle(el).color,
                on:r.top>=floor&&r.bottom<=window.innerHeight&&r.width>3};
      }).filter(o=>o.on);
      });
      if(!boxes.length) continue;
      await p.evaluate(()=>document.querySelectorAll('.fig__credit').forEach(e=>{
        e.style.color='transparent'; e.style.textShadow='none';
        e.querySelectorAll('*').forEach(c=>{c.style.color='transparent';c.style.background='none';});
      }));
      await p.waitForTimeout(90);
      for (const box of boxes) {
        /* RE-READ THE RECT. The boxes above were measured BEFORE the credits
           were made transparent and before the 90ms settle, and a reveal or a
           parallax step inside that window moves the element — after which the
           clip below samples the wrong strip of page. That is what produced an
           intermittent `1.00:1 desktop /people/ "Dallas, Texas" backdrop
           L* 93.9`: a clip that had slid off the foot of the photograph onto
           the cream band under it, reported as cream-on-cream. Roughly one run
           in five, on a meter whose whole job is to tell a real contrast defect
           from an imagined one. Read the rect at the moment of the shot. */
        const live=await p.evaluate((t)=>{
          const el=[...document.querySelectorAll('.fig__credit')].find((e)=>e.textContent.trim().slice(0,30)===t);
          if(!el) return null;
          const r=el.getBoundingClientRect();
          const nav=document.querySelector('[data-nav]');
          const floor=nav?nav.getBoundingClientRect().bottom:0;
          if(r.top<floor||r.bottom>window.innerHeight||r.width<=3) return null;
          return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};
        },box.t);
        if(!live) continue;
        const shot=await p.screenshot({clip:{x:live.x,y:live.y,width:live.w,height:live.h}}).catch(()=>null);
        if(!shot) continue;
        const {data,info}=await sharp(shot).raw().toBuffer({resolveWithObject:true});
        const px=[]; for(let k=0;k<data.length;k+=info.channels) px.push(lum([data[k],data[k+1],data[k+2]]));
        px.sort((a,c)=>a-c);
        const p95=px[Math.floor(px.length*0.95)];
        const g=Math.round(255*Math.pow(p95,1/2.2));
        const m=(box.fg.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
        const fg=m.length===3?m:[242,237,227];
        const r=ratio(fg,[g,g,g]);
        if(r<worst.r) worst={r,route,tag:vp.tag,y,text:box.t,L:Lstar(p95)};
      }
      await p.evaluate(()=>document.querySelectorAll('.fig__credit').forEach(e=>{
        e.style.color=''; e.style.textShadow='';
        e.querySelectorAll('*').forEach(c=>{c.style.color='';c.style.background='';});
      }));
    }
  }
  await ctx.close();
}
await b.close();
console.log(`worst credit moment: ${worst.r.toFixed(2)}:1  ${worst.tag} ${worst.route} @scrollY ${worst.y}  "${worst.text}"  backdrop L* ${worst.L.toFixed(1)}`);
console.log(worst.r < 4.5 ? '  ✗ under the 4.5:1 floor for this register' : '  ✓ clears 4.5:1 at every sampled moment');
