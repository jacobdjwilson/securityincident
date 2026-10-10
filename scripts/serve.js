import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3000;
const DIST_DIR = path.join(process.cwd(), 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/rss+xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const realDist = fs.existsSync(DIST_DIR) ? fs.realpathSync(DIST_DIR) : null;
  if (!realDist) {
    res.writeHead(503, { 'Content-Type': 'text/html' });
    res.end('<h1>503 Service Unavailable: dist directory not found. Run npm run build first.</h1>');
    return;
  }

  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || !reqPath) reqPath = '/index.html';

  // Prevent directory traversal by normalizing and verifying path bounds
  const safeRelPath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '').replace(/^[/\\]+/, '');
  let candidatePath = path.resolve(realDist, safeRelPath);

  if (candidatePath !== realDist && !candidatePath.startsWith(realDist + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<h1>403 Forbidden</h1>');
    return;
  }

  // If path doesn't have an extension, try appending .html if safe
  if (!path.extname(candidatePath)) {
    const htmlCandidate = candidatePath + '.html';
    if (htmlCandidate.startsWith(realDist + path.sep) && fs.existsSync(htmlCandidate)) {
      candidatePath = htmlCandidate;
    }
  }

  let filePath;
  try {
    filePath = fs.realpathSync(candidatePath);
    if (filePath !== realDist && !filePath.startsWith(realDist + path.sep)) {
      res.writeHead(403, { 'Content-Type': 'text/html' });
      res.end('<h1>403 Forbidden</h1>');
      return;
    }
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
    return;
  }

  if (fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
    return;
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading file');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 securityincident.net preview running at http://localhost:${PORT}`);
});
