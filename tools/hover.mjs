import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const dir='/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/';
const b = await launch({ proxy: false });
const errs=[];
const ctx = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:2 });
const p = await ctx.newPage();
p.on('console', m=>{ if(m.type()==='error') errs.push(m.text()); });
p.on('pageerror', e=>errs.push('pageerror '+e.message));
await p.goto('http://127.0.0.1:4415/partner/',{waitUntil:'networkidle'});
await p.waitForTimeout(2200);
await p.hover('.ask__mail'); await p.waitForTimeout(600);
await p.screenshot({ path: dir+'r2-hover.png', clip:{x:0,y:430,width:1440,height:400} });
// keyboard focus
await p.evaluate(()=>document.querySelector('.ask__mail').focus());
await p.waitForTimeout(500);
await p.screenshot({ path: dir+'r2-focus.png', clip:{x:0,y:430,width:1440,height:400} });
// full page
await p.mouse.move(0,0); await p.waitForTimeout(300);
await p.evaluate(()=>window.scrollTo(0,900)); await p.waitForTimeout(1600);
await p.screenshot({ path: dir+'r2-scroll.png' });
console.log('overflow', await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth));
console.log('ERRORS',errs);
await b.close();
