import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
const errs=[];
for (const W of [1920,1440,1280,1024,900,861,860,768,640,430,390,360,320]) {
  const ctx = await b.newContext({ viewport:{width:W,height:900} });
  const p = await ctx.newPage();
  p.on('console',m=>{if(m.type()==='error')errs.push(W+': '+m.text())});
  p.on('pageerror',e=>errs.push(W+' PE '+e.message));
  await p.goto('http://127.0.0.1:4415/partner/', { waitUntil:'networkidle' });
  await p.evaluate(()=>document.fonts.ready);
  const d = await p.evaluate(()=>{
    const rows=[...document.querySelectorAll('.pindex__r')];
    const xs = rows.map(li=>+li.querySelector('.pindex__n').getBoundingClientRect().x.toFixed(2));
    const who = rows.map(li=>+li.querySelector('.pindex__who').getBoundingClientRect().x.toFixed(2));
    const g = rows.map(li=>+li.querySelector('.pindex__g').getBoundingClientRect().x.toFixed(2));
    const rr = rows.map(li=>+li.querySelector('.pindex__a').getBoundingClientRect().right.toFixed(2));
    return {xs,who,g,rr, ov: document.documentElement.scrollWidth-document.documentElement.clientWidth};
  });
  const spread=(a)=>+(Math.max(...a)-Math.min(...a)).toFixed(2);
  console.log(String(W).padStart(5), 'titleSpread', String(spread(d.xs)).padStart(5),
    'whoSpread', spread(d.who), 'glossSpread', spread(d.g), 'rightSpread', spread(d.rr), 'overflow', d.ov, d.xs.join('/'));
  await ctx.close();
}
console.log('errors', errs.length?errs:'none');
await b.close();
