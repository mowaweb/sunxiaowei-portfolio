import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../worker/index.js';
import { serveFilm } from '../worker/films.js';
import { mediaKey, partBytes, verifiedKey } from '../worker/media-keys.js';

const film = { slug: 'sample', size: partBytes + 3, sha256: 'f'.repeat(64) };
function fixture(ready = true) {
  const reads = [];
  const calls = [];
  const bucket = { async get(key, options) {
    calls.push(key);
    if (key === verifiedKey(film)) return ready ? { json: async () => ({ size: film.size, sha256: film.sha256 }) } : null;
    const index = [mediaKey(film, 0), mediaKey(film, 1)].indexOf(key);
    if (index < 0) return null;
    const size = index === 0 ? partBytes : 3;
    const { offset, length } = options.range;
    assert.ok(offset >= 0 && length > 0 && offset + length <= size);
    reads.push([index, offset, length]);
    const bytes = new Uint8Array(length).fill(index + 5);
    return { size, body: new Response(bytes).body };
  } };
  return { reads, calls, serve: (method = 'GET', headers = {}) =>
    serveFilm(new Request('https://unit.test/films/sample.mp4', { method, headers }), bucket, film) };
}

test('cross-chunk GET returns exactly the three requested bytes in order', async () => {
  const { serve, reads } = fixture();
  const r = await serve('GET', { Range: `bytes=${partBytes - 1}-${partBytes + 1}` });
  assert.equal(r.status, 206);
  assert.equal(r.headers.get('Content-Range'), `bytes ${partBytes - 1}-${partBytes + 1}/${film.size}`);
  assert.equal(r.headers.get('Content-Length'), '3');
  assert.deepEqual([...new Uint8Array(await r.arrayBuffer())], [5, 6, 6]);
  assert.deepEqual(reads, [[0, partBytes - 1, 1], [1, 0, 2]]);
});

test('full GET streams all chunks; suffix and open ranges read only the final chunk', async () => {
  const whole = await fixture().serve();
  assert.equal(whole.status, 200);
  assert.equal(whole.headers.get('Accept-Ranges'), 'bytes');
  assert.equal(whole.headers.get('Content-Type'), 'video/mp4');
  assert.equal((await whole.arrayBuffer()).byteLength, film.size);
  for (const range of ['bytes=-2', `bytes=${film.size-2}-`, `bytes=${film.size-2}-99999999999999999999`]) {
    const {serve, reads} = fixture();
    const response = await serve('GET', { Range: range });
    assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], [6,6]);
    assert.deepEqual(reads, [[1,1,2]]);
  }
});

test('HEAD, invalid/out-of-range, and validators do not read movie bytes', async () => {
  const { serve, reads } = fixture();
  const head = await serve('HEAD');
  assert.equal(head.headers.get('Content-Length'), String(film.size));
  assert.equal(head.body, null);
  assert.equal((await serve('HEAD', { Range: 'bytes=0-1' })).status, 206);
  for (const range of ['bytes=4-1', `bytes=${film.size}-`, 'bytes=-0', 'bytes=0-1,4-5']) {
    const r = await serve('GET', { Range: range });
    assert.equal(r.status, 416);
    assert.equal(r.headers.get('Content-Range'), `bytes */${film.size}`);
  }
  assert.equal((await serve('GET', {'If-None-Match': head.headers.get('ETag')})).status, 304);
  assert.equal((await serve('HEAD', { Range:'bytes=0-1', 'If-Range':'"old"' })).status, 200);
  assert.deepEqual(reads, []);
});

test('an unfinished edition cannot return successful partial media', async () => {
  const { serve, reads } = fixture(false);
  assert.equal((await serve('GET',{Range:'bytes=0-1'})).status,503);
  assert.deepEqual(reads,[]);
});

test('read-only production routes reject writes, whitelist films and preserve static UI', async () => {
  const {calls} = fixture();
  const post = await worker.fetch(new Request('https://unit.test/films/osmo.mp4',{method:'POST'}),{});
  assert.equal(post.status,405);
  const unknown = await worker.fetch(new Request('https://unit.test/films/other.mp4'),{});
  assert.equal(unknown.status,404);
  const asset = await worker.fetch(new Request('https://unit.test/assets/drone.webp'),{ASSETS:{fetch: req=>{calls.push(new URL(req.url).pathname);return new Response('asset');}}});
  assert.deepEqual(calls,['/assets/drone.webp']);
  assert.equal(await asset.text(),'asset');
});
