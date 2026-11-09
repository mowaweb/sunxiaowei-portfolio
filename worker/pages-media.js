import { clipBlockPath } from './clip-catalog.js';
import { selectFilmResponse } from './films.js';

export const filmBlockSize = 8 * 1024 * 1024;

const unavailable = () => new Response('影片尚未就绪', { status: 503, headers: {
  'Cache-Control': 'no-store', 'Retry-After': '10', 'Content-Type': 'text/plain; charset=utf-8',
} });

// Pages assets do not implement byte ranges. Only boundary blocks need slicing;
// complete blocks can pass through the native streams without JavaScript copies.
async function pipeSlice(body, skip, length, destination) {
  const reader = body.getReader();
  const writer = destination.getWriter();
  void writer.closed.catch(() => reader.cancel().catch(() => {}));
  let remaining = length;
  try {
    while (remaining > 0) {
      const { value, done } = await reader.read();
      if (done) throw new Error('Truncated media block');
      if (skip >= value.length) { skip -= value.length; continue; }
      const take = Math.min(remaining, value.length - skip);
      await writer.write(value.subarray(skip, skip + take));
      remaining -= take;
      skip = 0;
    }
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
    writer.releaseLock();
  }
}

export async function servePagesMedia(request, assets, media, blockSize) {
  if (!media) return new Response(null, { status: 404 });
  const selection = selectFilmResponse(request, media);
  if (selection.response) return selection.response;
  const { start, end, init } = selection;

  async function openBlock(index) {
    const url = new URL(clipBlockPath(media, index), request.url);
    const response = await assets.fetch(new Request(url, { headers: { 'Accept-Encoding': 'identity' } }));
    const size = Math.min(blockSize, media.size - index * blockSize);
    const advertised = response.headers.get('Content-Length');
    if (response.status !== 200 || !response.body ||
      response.headers.get('Content-Type')?.startsWith('text/html') ||
      (advertised !== null && Number(advertised) !== size)) {
      await response.body?.cancel().catch(() => {});
      throw new Error('Missing or incomplete media block');
    }
    return { body: response.body, size };
  }

  let block;
  try { block = await openBlock(Math.floor(start / blockSize)); }
  catch { return unavailable(); }
  const stream = typeof FixedLengthStream === 'function'
    ? new FixedLengthStream(end - start + 1) : new TransformStream();

  async function pump() {
    let position = start;
    try {
      while (position <= end) {
        const offset = position % blockSize;
        const length = Math.min(block.size - offset, end - position + 1);
        if (offset === 0 && length === block.size) {
          await block.body.pipeTo(stream.writable, { preventClose: true });
        } else {
          await pipeSlice(block.body, offset, length, stream.writable);
        }
        position += length;
        if (position <= end) block = await openBlock(Math.floor(position / blockSize));
      }
      await stream.writable.close();
    } catch (error) {
      await block.body.cancel().catch(() => {});
      await stream.writable.abort(error).catch(() => {});
    }
  }
  void pump();
  return new Response(stream.readable, init);
}
