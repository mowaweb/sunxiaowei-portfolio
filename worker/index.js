import { catalog } from './film-catalog.js';
import { serveFilm } from './films.js';

export default {
  async fetch(request, env) {
    const pathname = new URL(request.url).pathname;
    if (pathname.startsWith('/films/')) {
      const match = /^\/films\/([a-z0-9-]+)\.mp4$/.exec(pathname);
      return serveFilm(request, env.BUCKET, match && catalog.get(match[1]));
    }
    return env.ASSETS.fetch(request);
  },
};
