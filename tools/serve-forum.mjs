import { createServer } from 'node:http';
import sirv from 'sirv';
const port = Number(process.env.PORT || 4503);
const dir = process.env.DIR || 'dist-forum';
const assets = sirv(dir, { dev: true, single: false, extensions: ['html'] });
createServer((req, res) => assets(req, res, () => { res.statusCode = 404; res.end('not found'); }))
  .listen(port, () => console.log('serving ' + dir + ' on http://127.0.0.1:' + port));
