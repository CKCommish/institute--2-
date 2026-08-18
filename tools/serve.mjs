import { createServer } from 'node:http';
import sirv from 'sirv';
const port = Number(process.env.PORT || 4399);
const assets = sirv('dist', { dev: true, single: false, extensions: ['html'] });
createServer((req, res) => assets(req, res, () => { res.statusCode = 404; res.end('not found'); }))
  .listen(port, () => console.log('serving dist on http://127.0.0.1:' + port));
