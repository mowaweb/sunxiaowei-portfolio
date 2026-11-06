import { blockSize, clipBlockPath } from './clip-catalog.js';
import { selectFilmResponse } from './films.js';

// Static hosting may ignore Range. Fetch whole, size-bounded blocks and stream
// only the requested interval, without decoding or buffering the whole movie.
export async function serveClip(request, assets, clip) {
  if (!clip) return new Response(null, {status: 404});
  const selection = selectFilmResponse(request, clip);
  if (selection.response) return selection.response;
  const {start, end, init} = selection;
  async function openBlock(index) {
    const url = new URL(clipBlockPath(clip, index), request.url);
    const response = await assets.fetch(new Request(url, {headers: {'Accept-Encoding':'identity'}}));
    const size = Math.min(blockSize, clip.size - index * blockSize);
    const advertised = response.headers.get('Content-Length');
    if (response.status !== 200 || !response.body || response.headers.get('Content-Type')?.startsWith('text/html') ||
      (advertised !== null && Number(advertised) !== size)) {
      await response.body?.cancel().catch(() => {});
      throw new Error('Missing or incomplete clip block');
    }
    return response.body.getReader();
  }

  let reader;
  try { reader = await openBlock(Math.floor(start / blockSize)); }
  catch { return new Response(null, {status: 503, headers: {'Cache-Control':'no-store'}}); }
  const stream = typeof FixedLengthStream === 'function' ? new FixedLengthStream(end - start + 1) : new TransformStream();
  const writer = stream.writable.getWriter();
  let cancelled = false;
  writer.closed.catch(() => { cancelled = true; void reader?.cancel().catch(() => {}); });

  async function pump() {
    let pos = start;
    try {
      while (pos <= end && !cancelled) {
        const index = Math.floor(pos / blockSize);
        if (!reader) reader = await openBlock(index);
        let skip = pos % blockSize;
        const stop = Math.min((index + 1) * blockSize, end + 1);
        while (pos < stop && !cancelled) {
          const {value, done} = await reader.read();
          if (done) throw new Error('Truncated clip block');
          if (skip >= value.length) { skip -= value.length; continue; }
          const length = Math.min(value.length - skip, stop - pos);
          await writer.write(value.subarray(skip, skip + length));
          pos += length;
          skip = 0;
        }
        await reader.cancel();
        reader = null;
      }
      if (!cancelled) await writer.close();
    } catch (error) {
      await reader?.cancel().catch(() => {});
      await writer.abort(error).catch(() => {});
    }
  }
  void pump();
  return new Response(stream.readable, init);
}
