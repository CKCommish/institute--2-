/* Render the social card from the site's own type, palette and photography. */
import { launch } from '../browser.mjs';
import fs from 'node:fs';
import sharp from 'sharp';
const b = await launch({ proxy: false });
const p = await (await b.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 })).newPage();
await p.goto('file://' + process.cwd() + '/tools/og/card.html', { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(600);
const png = await p.screenshot();
await b.close();
await sharp(png).resize(1200, 630).jpeg({ quality: 86, mozjpeg: true }).toFile('public/og.jpg');
fs.writeFileSync('public/robots.txt', 'User-agent: *\nAllow: /\n\nSitemap: https://lionforuminstitute.org/sitemap.xml\n');
const routes = ['/', '/institute/', '/pilots/', '/forum/', '/people/', '/partner/'];
fs.writeFileSync('public/sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  routes.map((r) => `  <url><loc>https://lionforuminstitute.org${r}</loc><changefreq>monthly</changefreq><priority>${r === '/' ? '1.0' : '0.7'}</priority></url>`).join('\n') +
  '\n</urlset>\n');
console.log('og.jpg', (fs.statSync('public/og.jpg').size / 1024).toFixed(0) + 'KB', '· robots.txt · sitemap.xml');
