import portfolio from './index.js';
import { handleMediaImport } from './import-media.js';

export default {
  async fetch(request, env, ctx) {
    if (new URL(request.url).pathname.startsWith('/__verified_import')) {
      const result = await handleMediaImport(request, env);
      if (result) return result;
    }
    return portfolio.fetch(request, env, ctx);
  },
};
