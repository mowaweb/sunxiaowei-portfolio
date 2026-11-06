import { catalog } from './film-catalog.js';
import { serveFilm } from './films.js';
import { clips } from './clip-catalog.js';
import { serveClip } from './clips.js';

export default {
  async fetch(request, env) {
    const pathname = new URL(request.url).pathname;
    if (pathname.startsWith('/clips/')) {
      const match = /^\/clips\/([a-z0-9-]+)\.mp4$/.exec(pathname);
      return serveClip(request, env.ASSETS, match && clips.get(match[1]));
    }
    if (pathname.startsWith('/films/')) {
      const match = /^\/films\/([a-z0-9-]+)\.mp4$/.exec(pathname);
      return serveFilm(request, env.BUCKET, match && catalog.get(match[1]));
    }
    return env.ASSETS.fetch(request);
  },
};
