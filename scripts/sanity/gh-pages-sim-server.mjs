// Minimal static server that mimics GitHub Pages' actual behavior (not
// `serve`'s or any other dev server's behavior, which differs): serve the
// exact matching file if present, otherwise respond with HTTP 404 and the
// *content* of 404.html as the body — this is specifically what GitHub
// Pages does for unmatched paths, and is the one thing that needed to be
// tested locally for item 5 (Studio deep-links/reloads after a real
// GitHub Pages deployment) without actually deploying.
import { createServer } from "http";
import { readFile, stat } from "fs/promises";
import { join, extname } from "path";

const ROOT = "out";
const PORT = Number(process.argv[2] || 4180);

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".ico": "image/x-icon", ".txt": "text/plain",
  ".xml": "application/xml", ".woff2": "font/woff2",
};

async function resolveFile(urlPath) {
  const p = decodeURIComponent(urlPath.split("?")[0]);
  const full = join(ROOT, p);
  try {
    const s = await stat(full);
    if (s.isFile()) return full;
    if (s.isDirectory()) {
      const indexPath = join(full, "index.html");
      const si = await stat(indexPath);
      if (si.isFile()) return indexPath;
    }
  } catch {}
  // GitHub Pages also serves <path>.html for a bare path without extension
  if (!extname(p)) {
    try {
      const s = await stat(full + ".html");
      if (s.isFile()) return full + ".html";
    } catch {}
  }
  return null;
}

createServer(async (req, res) => {
  const file = await resolveFile(req.url);
  if (file) {
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": MIME[extname(file)] || "application/octet-stream" });
    res.end(body);
    return;
  }
  // GitHub Pages fallback: HTTP 404 status, body = 404.html's content
  const notFound = await readFile(join(ROOT, "404.html"));
  res.writeHead(404, { "Content-Type": "text/html" });
  res.end(notFound);
}).listen(PORT, () => console.log(`GitHub-Pages-behavior simulator listening on http://localhost:${PORT}`));
