import { catalog } from './film-catalog.js';
import { blockSize, clips } from './clip-catalog.js';
import { filmBlockSize, servePagesMedia } from './pages-media.js';

export default {
  async fetch(request, env) {
    const pathname = new URL(request.url).pathname;
    if (pathname.startsWith('/films/')) {
      const match = /^\/films\/([a-z0-9-]+)\.mp4$/.exec(pathname);
      return servePagesMedia(request, env.ASSETS, match && catalog.get(match[1]), filmBlockSize);
    }
    if (pathname.startsWith('/clips/')) {
      const match = /^\/clips\/([a-z0-9-]+)\.mp4$/.exec(pathname);
      return servePagesMedia(request, env.ASSETS, match && clips.get(match[1]), blockSize);
    }
    return env.ASSETS.fetch(request);
  },
};
