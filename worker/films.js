import { mediaKey, partBytes, verifiedKey } from './media-keys.js';

const unavailable = () => new Response('影片尚未就绪', { status: 503, headers: {
  'Cache-Control': 'no-store', 'Retry-After': '10', 'Content-Type': 'text/plain; charset=utf-8',
} });

export function byteRange(header, size) {
  if (!header) return { start: 0, end: size - 1, partial: false };
  const match = /^bytes=(\d*)-(\d*)$/i.exec(header.trim());
  if (!match || (!match[1] && !match[2])) return null;
  if (!match[1]) {
    const suffix = Number(match[2]);
    return suffix > 0 ? { start: Math.max(size - suffix, 0), end: size - 1, partial: true } : null;
  }
  const start = Number(match[1]);
  const end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
  return start < size && end >= start ? { start, end, partial: true } : null;
}

export function selectFilmResponse(request, film) {
  const { size, sha256 } = film;
  const etag = '"' + sha256 + '"';
  const headers = new Headers({
    'Accept-Ranges': 'bytes', 'Content-Type': 'video/mp4',
    'Cache-Control': 'private, no-cache, no-transform', ETag: etag,
    'X-Content-Type-Options': 'nosniff',
  });
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return { response: new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } }) };
  }
  const tags = (request.headers.get('If-None-Match') || '').split(',').map(value => value.trim().replace(/^W\//, ''));
  if (tags.includes(etag) || tags.includes('*')) return { response: new Response(null, { status: 304, headers }) };
  const ifRange = request.headers.get('If-Range');
  const range = byteRange(!ifRange || ifRange === etag ? request.headers.get('Range') : null, size);
  if (!range) {
    headers.set('Content-Range', `bytes */${size}`);
    return { response: new Response(null, { status: 416, headers }) };
  }
  const { start, end, partial } = range;
  if (partial) headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  headers.set('Content-Length', String(end - start + 1));
  const init = { status: partial ? 206 : 200, headers };
  if (request.method === 'HEAD') return { response: new Response(null, init) };
  return { start, end, init };
}

export async function serveFilm(request, bucket, film) {
  if (!film) return new Response(null, { status: 404 });
  if (request.method !== 'GET' && request.method !== 'HEAD') return selectFilmResponse(request, film).response;
  if (!bucket) return unavailable();
  // Verification is published only after every immutable chunk matches its expected bytes.
  try {
    const marker = await bucket.get(verifiedKey(film));
    if (!marker) return unavailable();
    const data = await marker.json();
    if (data.sha256 !== film.sha256 || data.size !== film.size) return unavailable();
  } catch { return unavailable(); }
  const { response, start, end, init } = selectFilmResponse(request, film);
  if (response) return response;

  async function readSlice(position) {
    const index = Math.floor(position / partBytes);
    const offset = position % partBytes;
    const length = Math.min(partBytes - offset, end - position + 1);
    const part = await bucket.get(mediaKey(film, index), { range: { offset, length } });
    if (!part?.body || part.size !== Math.min(partBytes, film.size - index * partBytes)) {
      throw new Error('Verified film segment unavailable');
    }
    return { body: part.body, length };
  }
  let first;
  try { first = await readSlice(start); } catch { return unavailable(); }
  // In Workers only FixedLengthStream guarantees Content-Length on a streamed response.
  const total = end - start + 1;
  const stream = typeof FixedLengthStream === 'function' ? new FixedLengthStream(total) : new TransformStream();
  async function pump() {
    let position = start;
    let chunk = first;
    try {
      while (true) {
        await chunk.body.pipeTo(stream.writable, { preventClose: true });
        position += chunk.length;
        if (position > end) break;
        chunk = await readSlice(position);
      }
      await stream.writable.close();
    } catch (err) {
      // A browser seeking away cancels the active R2 reader through pipeTo.
      await stream.writable.abort(err).catch(() => {});
    }
  }
  void pump();
  return new Response(stream.readable, init);
}
