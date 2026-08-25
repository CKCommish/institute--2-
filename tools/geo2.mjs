import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy:false });
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://127.0.0.1:4454/people/',{waitUntil:'networkidle'});
await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
await p.waitForTimeout(2500);
await p.evaluate(()=>window.scrollTo(0,0));
await p.waitForTimeout(600);
const r = await p.evaluate(()=>{
  const box=el=>{const b=el.getBoundingClientRect();return {t:Math.round(b.top+scrollY),l:Math.round(b.left),r:Math.round(b.right),w:Math.round(b.width),h:Math.round(b.height),bot:Math.round(b.bottom+scrollY)};};
  const rep=(sel)=>[...document.querySelectorAll(sel)].map(e=>({sel, cls:e.className.toString().slice(0,30), ...box(e), fs:getComputedStyle(e).fontSize, lh:getComputedStyle(e).lineHeight, ls:getComputedStyle(e).letterSpacing, fw:getComputedStyle(e).fontWeight, ff:getComputedStyle(e).fontFamily.split(',')[0], txt:e.textContent.trim().replace(/\s+/g,' ').slice(0,34)}));
  return [].concat(
    rep('.pm__in > *'), rep('.pm__idx-i'),
    rep('.fr'), rep('.fr__id'), rep('.fr__name'), rep('.fr__credhead'), rep('.fr__list li'),
    rep('.seam__in > *'),
    rep('.bd__head > *'), rep('.co'), rep('.co__head'), rep('.co__field'), rep('.ent'), rep('.ent__n'), rep('.ent__t'), rep('.bd__foot')
  );
});
for (const x of r) console.log(`${x.sel.padEnd(16)} ${x.cls.padEnd(30)} t=${String(x.t).padStart(4)} bot=${String(x.bot).padStart(4)} l=${String(x.l).padStart(4)} r=${String(x.r).padStart(4)} h=${String(x.h).padStart(4)} fs=${x.fs} lh=${x.lh} ls=${x.ls} fw=${x.fw} ${x.ff.replace(/"/g,'')} | ${x.txt}`);
await b.close();
