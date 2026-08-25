import { launch } from '/home/user/institute--2-/tools/browser.mjs';
const b = await launch({ proxy: false });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4410/people/', { waitUntil: 'networkidle' });
await p.tap('[data-burger]'); await p.waitForTimeout(1000);
await p.screenshot({ path: '/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/nav2/m-people-sheet.png', clip: { x: 0, y: 280, width: 390, height: 260 } });
await b.close();
