/* Build to an isolated dir and serve it. usage: node tools/preview.mjs <id> [port] */
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import sirv from 'sirv';
const id = process.argv[2] || 'x';
const port = Number(process.argv[3] || 4400);
const out = `dist-${id}`;
const build = spawn('npx', ['astro', 'build', '--outDir', out], { stdio: 'inherit' });
build.on('exit', (code) => {
  if (code !== 0) { console.error('build failed'); process.exit(code); }
  const assets = sirv(out, { dev: true, extensions: ['html'] });
  createServer((req, res) => assets(req, res, () => { res.statusCode = 404; res.end('404'); }))
    .listen(port, '127.0.0.1', () => console.log(`READY http://127.0.0.1:${port}`));
});
