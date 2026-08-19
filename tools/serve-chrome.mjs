import sirv from 'sirv';
import { createServer } from 'node:http';
const port = Number(process.env.PORT || 4504);
const dir = process.env.DIR || 'dist-chrome';
const assets = sirv(dir, { dev: true, single: false, extensions: ['html'] });
createServer((req, res) => assets(req, res, () => { res.statusCode = 404; res.end('nope'); })).listen(port, '127.0.0.1', () => console.log('up on ' + port + ' from ' + dir));
