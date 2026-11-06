import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { importRelease } from './media-phase.mjs';
import { createHash } from 'node:crypto';
import { blockSize, clipBlockPath, clips } from '../worker/clip-catalog.js';

const root = await fs.realpath(fileURLToPath(new URL('../', import.meta.url)));
const dist = path.join(root, 'dist');
const client = path.join(dist, 'client');
const server = path.join(dist, 'server');
const existing = await fs.lstat(dist).catch(error => error.code === 'ENOENT' ? null : Promise.reject(error));
if (existing && (!existing.isDirectory() || existing.isSymbolicLink() || (await fs.realpath(dist)) !== dist)) {
  throw new Error('Refusing to clear a redirected build directory');
}
if (path.dirname(dist) !== root || path.basename(dist) !== 'dist') throw new Error('Unexpected output path');
await fs.rm(dist, { recursive: true, force: true });

await build({ root, build: { outDir: client, copyPublicDir: false } });
const excluded = new Set([
  'personal-ai-gt.mp4', 'personal-ai-exam.mp4', 'personal-ai-10086.mp4',
  ...(!importRelease ? ['film-drone-web.mp4', 'film-osmo-web.mp4', 'full-bambu.mp4', 'film-lotus-web.mp4'] : []),
].map(name => 'assets/' + name));
const publicRoot = path.join(root, 'public');
await fs.cp(publicRoot, client, { recursive: true, filter: filename =>
  !excluded.has(path.relative(publicRoot, filename).split(path.sep).join('/')),
});
for (const clip of clips.values()) {
  const bytes = await fs.readFile(path.join(client, 'assets', clip.file));
  if (bytes.length !== clip.size || createHash('sha256').update(bytes).digest('hex') !== clip.sha256) {
    throw new Error('Clip catalog does not match ' + clip.file);
  }
  for (let offset = 0; offset < bytes.length; offset += blockSize) {
    const dest = path.join(client, clipBlockPath(clip, offset / blockSize));
    if (!offset) await fs.mkdir(path.dirname(dest), {recursive: true});
    await fs.writeFile(dest, bytes.subarray(offset, offset + blockSize));
  }
}
const entry = path.join(root, 'worker', importRelease ? 'import-entry.js' : 'index.js');
await build({ root, configFile: false, publicDir: false, build: {
  ssr: entry, target: 'es2022', outDir: server, copyPublicDir: false, minify: false,
  rollupOptions: { output: { format: 'es', entryFileNames: 'index.js', inlineDynamicImports: true } },
} });
await fs.mkdir(path.join(dist, '.openai'), { recursive: true });
await fs.copyFile(path.join(root, '.openai', 'hosting.json'), path.join(dist, '.openai', 'hosting.json'));
// Wrangler reads the generated configuration for a local Worker + assets + R2 preview.
// The hosted bucket itself is provisioned by Sites from .openai/hosting.json.
await fs.writeFile(path.join(server, 'wrangler.json'), JSON.stringify({
  name: 'portfolio-preview', main: 'index.js', compatibility_date: '2026-05-15',
  assets: { directory: '../client', binding: 'ASSETS' },
  r2_buckets: [{ binding: 'BUCKET', bucket_name: 'site-creator-r2' }],
}, null, 2) + '\n');

const total = async directory => {
  let size = 0;
  for (const item of await fs.readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, item.name);
    size += item.isDirectory() ? await total(filename) : (await fs.stat(filename)).size;
  }
  return size;
};
const bytes = await total(dist);
console.log(`Site artifact: ${(bytes / 1048576).toFixed(2)} MiB (${importRelease ? 'private import release' : 'read-only release'})`);
if (bytes >= 256 * 1048576) throw new Error('Site build exceeds its 256 MiB limit');
