import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { build } from 'vite';
import { catalog } from '../worker/film-catalog.js';
import { blockSize, clipBlockPath, clips } from '../worker/clip-catalog.js';

const root = await fs.realpath(fileURLToPath(new URL('../', import.meta.url)));
const output = path.join(root, 'dist', 'pages');
const filmDirectory = path.resolve(process.env.PORTFOLIO_FILM_DIRECTORY || path.join(root, 'local-media'));
const filmBlockSize = 8 * 1024 * 1024;
const media = [
  ...[...clips.values()].map(clip => ({ ...clip, blockSize, source: path.join(root, 'public', 'assets', clip.file) })),
  ...[...catalog.values()].map(film => ({ ...film, blockSize: filmBlockSize, source: path.join(filmDirectory, film.slug + '.mp4') })),
];

// Fail before building if any complete original is unavailable.
for (const item of media) {
  const stat = await fs.stat(item.source).catch(() => null);
  if (!stat?.isFile() || stat.size !== item.size) throw new Error('Missing or incorrect original: ' + item.source);
}
for (const directory of [path.dirname(output), output]) {
  const stat = await fs.lstat(directory).catch(error => error.code === 'ENOENT' ? null : Promise.reject(error));
  if (stat && (!stat.isDirectory() || stat.isSymbolicLink() || await fs.realpath(directory) !== directory)) {
    throw new Error('Refusing to replace a redirected build directory: ' + directory);
  }
}
if (path.relative(root, output) !== path.join('dist', 'pages')) throw new Error('Unexpected Pages output path');
await fs.rm(output, { recursive: true, force: true });
await build({ root, build: { outDir: output, copyPublicDir: false } });

const omitted = new Set([
  ...[...clips.values()].map(clip => clip.file),
  'film-drone-web.mp4', 'film-osmo-web.mp4', 'full-bambu.mp4', 'film-lotus-web.mp4',
  'personal-ai-gt.mp4', 'personal-ai-exam.mp4', 'personal-ai-10086.mp4',
].map(name => 'assets/' + name));
const publicRoot = path.join(root, 'public');
await fs.cp(publicRoot, output, { recursive: true, filter: filename =>
  !omitted.has(path.relative(publicRoot, filename).split(path.sep).join('/')),
});

for (const item of media) {
  const file = await fs.open(item.source, 'r');
  const hash = createHash('sha256');
  try {
    for (let offset = 0, index = 0; offset < item.size; offset += item.blockSize, index++) {
      const bytes = Buffer.alloc(Math.min(item.blockSize, item.size - offset));
      let received = 0;
      while (received < bytes.length) {
        const { bytesRead } = await file.read(bytes, received, bytes.length - received, offset + received);
        if (!bytesRead) throw new Error('Truncated original: ' + item.source);
        received += bytesRead;
      }
      hash.update(bytes);
      const destination = path.join(output, clipBlockPath(item, index));
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.writeFile(destination, bytes);
    }
  } finally { await file.close(); }
  if (hash.digest('hex') !== item.sha256) throw new Error('Original hash mismatch: ' + item.source);
  console.log('Verified and packaged ' + item.slug + ' (' + Math.ceil(item.size / item.blockSize) + ' blocks)');
}

await build({ root, configFile: false, publicDir: false, build: {
  ssr: path.join(root, 'worker', 'pages-entry.js'), target: 'es2022', outDir: output,
  emptyOutDir: false, copyPublicDir: false, minify: false,
  rollupOptions: { output: { format: 'es', entryFileNames: '_worker.js', inlineDynamicImports: true } },
} });
await fs.writeFile(path.join(output, '_routes.json'), JSON.stringify({
  version: 1, include: ['/films/*', '/clips/*'], exclude: [],
}, null, 2) + '\n');
await fs.writeFile(path.join(output, '_headers'), '/clip-blocks/*\n  Cache-Control: public, max-age=31536000, immutable\n  X-Content-Type-Options: nosniff\n');

let total = 0, count = 0;
async function validate(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await validate(filename);
    else {
      const { size } = await fs.stat(filename);
      if (size > 25 * 1024 * 1024) throw new Error('Pages asset exceeds 25 MiB: ' + filename);
      count++; total += size;
    }
  }
}
await validate(output);
if (count > 20000) throw new Error('Pages file count limit exceeded');
console.log('Pages ready: ' + count + ' files, ' + (total / 1048576).toFixed(2) + ' MiB');
