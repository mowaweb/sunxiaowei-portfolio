import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import test from 'node:test';
import worker from '../worker/index.js';
import { blockSize, clipBlockPath, clips } from '../worker/clip-catalog.js';

async function fixture(clip) {
  const source = await readFile(new URL('../public/assets/' + clip.file, import.meta.url));
  const reads = [];
  const paths = new Map(Array.from({length:Math.ceil(clip.size / blockSize)}, (_, i) => [clipBlockPath(clip, i), i]));
  const env = { ASSETS: { async fetch(request) {
    const index = paths.get(new URL(request.url).pathname);
    assert.notEqual(index, undefined, 'only this clip’s packaged blocks may be requested');
    reads.push(index);
    // Emulate an upstream static origin that never serves Range. Split blocks
    // into multiple network chunks so the test exercises skipping and stopping.
    const start = index * blockSize;
    const bytes = source.subarray(start, start + blockSize);
    let position = 0;
    return new Response(new ReadableStream({ pull(controller) {
      if (position === bytes.length) { controller.close(); return; }
      const part = bytes.subarray(position, position + 19039);
      controller.enqueue(part);
      position += part.length;
    }}), {headers:{'Content-Length':String(bytes.length), 'Content-Type':'application/octet-stream'}});
  }}};
  const serve = (headers = {}, method = 'GET') => worker.fetch(new Request('https://unit.test/clips/' + clip.slug + '.mp4', {method,headers}), env);
  return {serve, source, reads};
}

test('a late seek crossing a block boundary matches the exact original bytes and fetches only two blocks', async () => {
  const clip = clips.get('liweike-showreel');
  const {serve, source, reads} = await fixture(clip);
  const start = 8 * blockSize - 477, end = 8 * blockSize + 1303;
  const response = await serve({Range:'bytes=' + start + '-' + end});
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('Content-Range'), `bytes ${start}-${end}/${clip.size}`);
  assert.equal(response.headers.get('Content-Length'), String(end - start + 1));
  assert.equal(response.headers.get('Content-Type'), 'video/mp4');
  assert.equal(response.headers.get('Accept-Ranges'), 'bytes');
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), source.subarray(start, end + 1));
  assert.deepEqual(reads, [7, 8]);
});

test('all registered clips and their last bytes remain identical to the source', async () => {
  for (const clip of clips.values()) {
    const {serve, source, reads} = await fixture(clip);
    const whole = await serve();
    assert.equal(whole.status, 200);
    assert.equal(whole.headers.get('Content-Length'), String(source.length));
    const bytes = Buffer.from(await whole.arrayBuffer());
    assert.equal(createHash('sha256').update(bytes).digest('hex'), clip.sha256);
    reads.length = 0;
    const tail = await serve({Range:'bytes=-4099'});
    assert.equal(tail.status, 206);
    assert.deepEqual(Buffer.from(await tail.arrayBuffer()), source.subarray(-4099));
    assert.deepEqual(reads, [Math.floor((clip.size - 1) / blockSize)]);
  }
});

test('HEAD, validators, disallowed methods and unsatisfiable ranges avoid all block reads', async () => {
  const clip = clips.get('liweike-clock'), {serve, reads} = await fixture(clip);
  const head = await serve({}, 'HEAD');
  assert.equal(head.status, 200); assert.equal(head.body, null);
  assert.equal(head.headers.get('Content-Length'), String(clip.size));
  const rangeHead = await serve({Range:'bytes=1001-1010'}, 'HEAD');
  assert.equal(rangeHead.status, 206); assert.equal(rangeHead.headers.get('Content-Length'), '10');
  assert.equal((await serve({'If-None-Match':head.headers.get('ETag')})).status, 304);
  const invalid = await serve({Range:'bytes=' + clip.size + '-'});
  assert.equal(invalid.status, 416); assert.equal(invalid.headers.get('Content-Range'), 'bytes */' + clip.size);
  assert.equal((await serve({}, 'POST')).status, 405);
  assert.deepEqual(reads, []);
  assert.equal((await worker.fetch(new Request('https://unit.test/clips/unknown.mp4'), {})).status, 404);
});
