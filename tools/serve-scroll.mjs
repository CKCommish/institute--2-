import sirv from 'sirv';
import { createServer } from 'node:http';
const dir = process.argv[2] || 'dist-scroll';
const port = Number(process.argv[3] || 4500);
const assets = sirv(dir, { dev: true, single: false, extensions: ['html'] });
createServer((req, res) => assets(req, res, () => { res.statusCode = 404; res.end('404'); })).listen(port, '127.0.0.1', () => console.log('serving', dir, 'on', port));
