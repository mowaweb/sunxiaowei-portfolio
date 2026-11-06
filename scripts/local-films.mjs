import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { catalog } from '../worker/film-catalog.js';
import { selectFilmResponse } from '../worker/films.js';
import { clips } from '../worker/clip-catalog.js';

// Optional, local-only manifest: {files:[{slug,path,size,sha256}]}.
// Run Vite with PORTFOLIO_FILM_SOURCES pointing to the prepared import manifest.
export function localFilms() {
  const middleware = async (req, res, next) => {
    const url = new URL(req.url || '/', 'http://localhost');
    const isClip = url.pathname.startsWith('/clips/');
    if (!isClip && !url.pathname.startsWith('/films/')) return next();
    const match = /^\/(?:films|clips)\/([a-z0-9-]+)\.mp4$/.exec(url.pathname);
    const film = match && (isClip ? clips : catalog).get(match[1]);
    if (!film) { res.writeHead(404).end(); return; }
    const manifest = process.env.PORTFOLIO_FILM_SOURCES;
    try {
      let filename = isClip ? path.resolve('public/assets', film.file) : path.resolve('local-media', film.slug + '.mp4');
      if (!isClip && manifest) {
        const { files } = JSON.parse(await fs.promises.readFile(manifest, 'utf8'));
        filename = files.find(file => file.slug === film.slug && file.size === film.size && file.sha256 === film.sha256)?.path;
      }
      if (!filename || !path.isAbsolute(filename) || (await fs.promises.stat(filename)).size !== film.size) {
        res.writeHead(503).end(); return;
      }
      const request = new Request(url, { method: req.method, headers: new Headers(req.headers) });
      const result = selectFilmResponse(request, film);
      const meta = result.response || result.init;
      res.writeHead(meta.status, Object.fromEntries(meta.headers));
      if (result.response) { res.end(); return; }
      await pipeline(fs.createReadStream(filename, { start: result.start, end: result.end }), res);
    } catch {
      if (!res.headersSent) res.writeHead(503).end();
      else res.destroy();
    }
  };
  return { name: 'local-portfolio-films', configureServer(server) { server.middlewares.use(middleware); },
    configurePreviewServer(server) { server.middlewares.use(middleware); } };
}
