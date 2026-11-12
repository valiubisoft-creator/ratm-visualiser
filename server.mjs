// VOLTAGE local server: static files + /api/tracks listing + Range support (needed for seeking).
// usage: node server.mjs [port]
import { createServer } from 'node:http';
import { createReadStream, statSync, readdirSync } from 'node:fs';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PORT = +process.argv[2] || 4173;
const AUDIO = new Set(['.mp3', '.m4a', '.aac', '.flac', '.wav', '.ogg', '.opus', '.aiff', '.aif']);
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.aac': 'audio/aac', '.flac': 'audio/flac', '.wav': 'audio/wav',
  '.ogg': 'audio/ogg', '.opus': 'audio/ogg', '.aiff': 'audio/aiff', '.aif': 'audio/aiff',
};

createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  // YouTube refuses these embeds on a bare-IP origin (error 150) but allows them on localhost
  if ((req.headers.host || '').startsWith('127.0.0.1')) { res.writeHead(302, { location: `http://localhost:${PORT}${req.url}` }); return res.end(); }
  if (url.pathname === '/api/tracks') {
    let files = [];
    try { files = readdirSync(join(ROOT, 'tracks')).filter(f => AUDIO.has(extname(f).toLowerCase())).sort(); } catch {}
    res.writeHead(200, { 'content-type': MIME['.json'], 'cache-control': 'no-store' });
    return res.end(JSON.stringify(files));
  }
  let rel = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\]|\.\.)+/, '');
  if (!rel) rel = 'index.html';
  const file = join(ROOT, rel);
  let st;
  try { st = statSync(file); } catch {}
  if (!file.startsWith(ROOT) || !st || !st.isFile()) { res.writeHead(404); return res.end('not found'); }
  const type = MIME[extname(file).toLowerCase()] || 'application/octet-stream';
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (range) {
    const start = range[1] ? +range[1] : Math.max(0, st.size - +range[2]);
    const end = range[1] && range[2] ? Math.min(+range[2], st.size - 1) : st.size - 1;
    if (start > end || start >= st.size) { res.writeHead(416, { 'content-range': `bytes */${st.size}` }); return res.end(); }
    res.writeHead(206, { 'content-type': type, 'accept-ranges': 'bytes', 'content-range': `bytes ${start}-${end}/${st.size}`, 'content-length': end - start + 1 });
    return createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { 'content-type': type, 'accept-ranges': 'bytes', 'content-length': st.size, 'cache-control': 'no-store' });
  createReadStream(file).pipe(res);
}).listen(PORT, '127.0.0.1', () => console.log(`VOLTAGE → http://localhost:${PORT}  (audio files go in ./tracks)`));
