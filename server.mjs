import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const port = Number(process.env.PORT || 3000);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon" };

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || "/", "http://localhost").pathname);
  let relative = pathname === "/" ? "index.html" : pathname === "/manus-routes.json" ? "public/manus-routes.json" : pathname.replace(/^\/+/, "");
  if (relative.includes("\\") || relative.split("/").some((part) => part === "..")) {
    response.writeHead(400, { "content-type": "text/plain; charset=utf-8" }); response.end("Bad path"); return;
  }
  let file = resolve(root, relative);
  if (!file.startsWith(root + sep) && file !== resolve(root, "index.html")) {
    response.writeHead(403); response.end("Forbidden"); return;
  }
  try {
    const info = await stat(file);
    if (info.isDirectory()) file = resolve(file, "index.html");
    const body = await readFile(file);
    response.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream", "cache-control": "no-cache" });
    response.end(body);
  } catch {
    response.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    response.end("<!doctype html><html lang=\"en\"><title>Not found</title><body><p>Page not found. <a href=\"/\">Return home</a></p></body></html>");
  }
}).listen(port, "0.0.0.0", () => console.log(`Aleesha Travel preview listening on 0.0.0.0:${port}`));
