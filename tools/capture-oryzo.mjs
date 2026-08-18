import { launch } from './browser.mjs';
import fs from 'fs';
const out = 'refs/oryzo';
fs.mkdirSync(out, { recursive: true });
async function shots(vp, tag, n) {
  const b = await launch();
  const p = await (await b.newContext({ viewport: vp, deviceScaleFactor: 1, userAgent: vp.width < 500 ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' : undefined, isMobile: vp.width < 500, hasTouch: vp.width < 500 })).newPage();
  await p.goto('https://oryzo.ai/', { waitUntil: 'load', timeout: 120000 });
  await p.waitForTimeout(15000);
  const h = await p.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
  console.log(tag, 'scrollHeight', h, 'vp', vp.height);
  for (let i = 0; i < n; i++) {
    const y = Math.round((h - vp.height) * (i / (n - 1)));
    await p.evaluate((y) => window.scrollTo(0, y), y);
    await p.waitForTimeout(3000);
    await p.screenshot({ path: `${out}/${tag}-${String(i + 1).padStart(2, '0')}.png` });
    console.log(' shot', i + 1, 'y', y);
  }
  await b.close();
}
await shots({ width: 1440, height: 900 }, 'desktop', 10);
await shots({ width: 390, height: 844 }, 'mobile', 7);
console.log('done');
