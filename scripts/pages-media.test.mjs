import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import worker from '../worker/pages-entry.js';
import { filmBlockSize, servePagesMedia } from '../worker/pages-media.js';
import { clipBlockPath, blockSize as clipBlockSize, clips } from '../worker/clip-catalog.js';
import { catalog } from '../worker/film-catalog.js';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');

function fixture({ badBlock = -1, badKind = 'missing' } = {}) {
  const blockSize = 32 * 1024;
  const source = Buffer.from(Array.from({ length: blockSize * 3 + 201 }, (_, i) => (i * 13 + Math.floor(i / 251)) % 256));
  const media = { slug: 'sample', size: source.length, sha256: digest(source) };
  const reads = [], cancellations = [];
  const assets = { async fetch(request) {
    assert.equal(request.headers.get('Accept-Encoding'), 'identity');
    assert.equal(request.headers.has('Range'), false);
    const pathname = new URL(request.url).pathname;
    const index = Number(pathname.split('/').at(-1).replace('.bin', ''));
    assert.equal(pathname, clipBlockPath(media, index));
    reads.push(index);
    if (index === badBlock && badKind === 'missing') return new Response('missing', { status: 404 });
    if (index === badBlock && badKind === 'html') return new Response('<html>SPA fallback</html>', { headers: { 'Content-Type': 'text/html' } });
    const bytes = source.subarray(index * blockSize, Math.min((index + 1) * blockSize, source.length));
    const actual = index === badBlock && badKind === 'truncated' ? bytes.subarray(0, 1) : bytes;
    let position = 0;
    return new Response(new ReadableStream({
      pull(controller) {
        if (position === actual.length) { controller.close(); return; }
        const part = actual.subarray(position, position + 1903);
        position += part.length;
        controller.enqueue(part);
      },
      cancel() { cancellations.push(index); },
    }), { headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(bytes.length + (index === badBlock && badKind === 'size' ? 1 : 0)),
    } });
  } };
  const serve = (headers = {}, method = 'GET') => servePagesMedia(
    new Request('https://unit.test/films/sample.mp4', { method, headers }), assets, media, blockSize,
  );
  return { source, media, reads, cancellations, blockSize, serve };
}

test('full media GET streams every block and retains the source SHA-256', async () => {
  const { serve, source, media, reads } = fixture();
  const response = await serve();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Content-Length'), String(source.length));
  assert.equal(response.headers.get('Content-Type'), 'video/mp4');
  assert.equal(response.headers.get('Accept-Ranges'), 'bytes');
  const hash = createHash('sha256');
  let length = 0;
  for await (const bytes of response.body) { hash.update(bytes); length += bytes.length; }
  assert.equal(length, media.size);
  assert.equal(hash.digest('hex'), media.sha256);
  assert.deepEqual(reads, [0, 1, 2, 3]);
});

test('late seek across a block boundary returns exact requested bytes', async () => {
  const { serve, source, media, reads, blockSize } = fixture();
  const start = 2 * blockSize - 477, end = 2 * blockSize + 1303;
  const response = await serve({ Range: `bytes=${start}-${end}` });
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('Content-Range'), `bytes ${start}-${end}/${media.size}`);
  assert.equal(response.headers.get('Content-Length'), String(end - start + 1));
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), source.subarray(start, end + 1));
  assert.deepEqual(reads, [1, 2]);
});

test('partial boundaries and whole interior blocks preserve bytes together', async () => {
  const { serve, source, reads, blockSize } = fixture();
  const start = 1701, end = 2 * blockSize + 1901;
  const response = await serve({ Range: `bytes=${start}-${end}` });
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), source.subarray(start, end + 1));
  assert.deepEqual(reads, [0, 1, 2]);
  for (const range of ['bytes=-101', `bytes=${source.length - 101}-`]) {
    const tail = await serve({ Range: range });
    assert.equal(tail.status, 206);
    assert.deepEqual(Buffer.from(await tail.arrayBuffer()), source.subarray(-101));
  }
});

test('metadata, validators and rejected requests require no media reads', async () => {
  const { serve, media, reads } = fixture();
  const head = await serve({}, 'HEAD');
  assert.equal(head.body, null);
  assert.equal(head.headers.get('Content-Length'), String(media.size));
  const rangeHead = await serve({ Range: 'bytes=9-19' }, 'HEAD');
  assert.equal(rangeHead.status, 206);
  assert.equal(rangeHead.headers.get('Content-Length'), '11');
  assert.equal((await serve({ 'If-None-Match': head.headers.get('ETag') })).status, 304);
  const stale = await serve({ 'If-Range': '"old"', Range: 'bytes=9-19' }, 'HEAD');
  assert.equal(stale.status, 200);
  assert.equal(stale.headers.get('Content-Length'), String(media.size));
  for (const range of ['bytes=10-2', `bytes=${media.size}-`, 'bytes=-0', 'bytes=0-1,4-5']) {
    const invalid = await serve({ Range: range });
    assert.equal(invalid.status, 416);
    assert.equal(invalid.headers.get('Content-Range'), `bytes */${media.size}`);
  }
  assert.equal((await serve({}, 'POST')).status, 405);
  assert.deepEqual(reads, []);
});

test('missing first blocks, SPA fallbacks and wrong sizes return unavailable', async () => {
  for (const badKind of ['missing', 'html', 'size']) {
    const { serve } = fixture({ badBlock: 0, badKind });
    const response = await serve();
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
  }
});

test('missing later blocks and truncated boundary blocks abort the media stream', async () => {
  const missing = await fixture({ badBlock: 1 }).serve();
  await assert.rejects(missing.arrayBuffer(), /Missing or incomplete media block/);
  const truncated = await fixture({ badBlock: 0, badKind: 'truncated' }).serve({ Range: 'bytes=2-50' });
  await assert.rejects(truncated.arrayBuffer(), /Truncated media block/);
});

test('a browser cancellation stops reading the current source block', async () => {
  const { serve, reads, cancellations } = fixture();
  const response = await serve({ Range: 'bytes=20-' });
  const reader = response.body.getReader();
  assert.equal((await reader.read()).done, false);
  await reader.cancel();
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(reads, [0]);
  assert.deepEqual(cancellations, [0]);
});

test('Pages entry selects the film and clip block sizes and delegates static assets', async () => {
  const films = catalog.get('drone'), clip = clips.get('liweike-showreel');
  for (const [kind, media, blockSize] of [['films', films, filmBlockSize], ['clips', clip, clipBlockSize]]) {
    const reads = [];
    const assets = { async fetch(request) {
      reads.push(new URL(request.url).pathname);
      return new Response(new Uint8Array(blockSize).fill(17), { headers: { 'Content-Length': String(blockSize) } });
    } };
    const response = await worker.fetch(new Request(`https://unit.test/${kind}/${media.slug}.mp4`, {
      headers: { Range: `bytes=${blockSize}-${blockSize + 1}` },
    }), { ASSETS: assets });
    assert.equal(response.status, 206);
    assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], [17, 17]);
    assert.deepEqual(reads, [clipBlockPath(media, 1)]);
  }
  for (const path of ['/films/unknown.mp4', '/clips/unknown.mp4', '/films/drone.mp4/extra']) {
    assert.equal((await worker.fetch(new Request('https://unit.test' + path), {})).status, 404);
  }
  const home = await worker.fetch(new Request('https://unit.test/'), { ASSETS: { fetch: request => new Response(new URL(request.url).pathname) } });
  assert.equal(await home.text(), '/');
});
