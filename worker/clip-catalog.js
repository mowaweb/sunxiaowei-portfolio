export const blockSize = 1024 * 1024;
export const clips = new Map([
  ['liweike-showreel', [12235232, 'bac4b18e1f9e56ee429864b2c6b95a744be896c0a1b783a64eb4ac2b0f3eeeea']],
  ['liweike-clock', [2550816, '43f3124eb801655e7808e7f1ccfccf8b6dd9cd7dc5ed2599c8949dcb71990384']],
  ['liweike-ar-01', [348498, 'e15b0366ee3160abb3434976194631348fba70a50e5da1413ef96d0016c8850d']],
  ['liweike-ar-02', [871098, 'd211a0eb2a139e6c8798d72a97c10d744b667f20a14f438702cd88854b8e8469']],
].map(([slug, [size, sha256]]) => [slug, {slug, size, sha256, file: 'extra-' + slug + '.mp4'}]));

export function clipBlockPath(clip, index) {
  return '/clip-blocks/' + clip.sha256 + '/' + index + '.bin';
}
