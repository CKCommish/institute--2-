import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
for (const w of [1440,1024,900,768,700,620,430,390,360]) {
  const ctx = await b.newContext({ viewport:{width:w,height:w<=620?844:900}, isMobile:w<=430, hasTouch:w<=430 });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4420/', { waitUntil:'networkidle' });
  await p.waitForTimeout(1000);
  const r = await p.evaluate(() => {
    const el = document.querySelector('.hero__poster');
    const cs = getComputedStyle(el);
    const c = document.createElement('canvas').getContext('2d');
    c.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const fs = parseFloat(cs.fontSize);
    const ls = parseFloat(cs.letterSpacing)||0;
    const m = (s)=> Math.round(c.measureText(s).width + ls*s.length);
    const words = 'the technologies of tomorrow strengthen American families today.'.split(' ');
    const cands = { '3:3,5':[3,5], '4:3,5,6':[3,5,6], '4:2,4,6':[2,4,6], '4:3,4,6':[3,4,6], '4:2,5,7':[2,5,7], '4:3,5,7':[3,5,7], '4:2,4,7':[2,4,7],
      '5:2,4,5,7':[2,4,5,7], '5:2,4,6,7':[2,4,6,7], '5:1,3,5,6':[1,3,5,6], '5:2,3,5,7':[2,3,5,7], '5:2,4,5,6':[2,4,5,6], '5:1,3,5,7':[1,3,5,7], '5:2,3,5,6':[2,3,5,6] };
    const out = {};
    for (const [k,br] of Object.entries(cands)) {
      const lines=[]; let s=0;
      for (const b of [...br, 8]) { lines.push(words.slice(s,b).join(' ')); s=b; }
      out[k]=lines.map(m);
    }
    return { fs: Math.round(fs*10)/10, measure: Math.round(el.getBoundingClientRect().width), out };
  });
  console.log('W='+w, 'fs='+r.fs, 'measure='+r.measure);
  for (const [k,v] of Object.entries(r.out)) {
    const ok = v.every(x=>x<=r.measure);
    console.log('   ', ok?'ok ':'XX ', k.padEnd(10), v.join(' / '));
  }
  await ctx.close();
}
await b.close();
