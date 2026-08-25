import { launch } from '/home/user/institute--2-/tools/browser.mjs';
import fs from 'fs';
const b=await launch({proxy:false});
const ctx=await b.newContext({viewport:{width:1200,height:400}});
const p=await ctx.newPage();
const jobs=[
 ['/home/user/institute--2-/refs/apple/newsroom/desktop-02.png','ap-news-bar',0,0,1440,60,2],
 ['/home/user/institute--2-/refs/apple/environment/desktop-02.png','ap-env-bar',0,0,1440,120,2],
 ['/home/user/institute--2-/refs/apple/values/desktop-03.png','ap-val-bar',0,0,1440,120,2],
 ['/home/user/institute--2-/refs/apple/macbook-pro/desktop-02.png','ap-mbp-bar',0,0,1440,140,2],
 ['/home/user/institute--2-/refs/apple/home/mobile-02.png','ap-home-m',0,0,390,120,3],
 ['/home/user/institute--2-/refs/apple/newsroom/mobile-02.png','ap-news-m',0,0,390,120,3],
];
for(const [src,name,x,y,w,h,s] of jobs){
  const d=fs.readFileSync(src).toString('base64');
  await p.setViewportSize({width:w*s,height:h*s});
  await p.setContent(`<body style="margin:0;overflow:hidden"><img src="data:image/png;base64,${d}" style="position:absolute;left:${-x*s}px;top:${-y*s}px;width:auto;transform-origin:0 0;transform:scale(${s});image-rendering:auto"></body>`);
  await p.waitForTimeout(300);
  await p.screenshot({path:`/tmp/claude-0/-home-user-institute--2-/4aae5723-f3fa-5aaa-8cbc-ebd9e16d8b73/scratchpad/shots/${name}.png`});
}
await b.close(); console.log('ok');
