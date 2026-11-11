export const blockSize = 1024 * 1024;
export const clips = new Map([
  ['liweike-showreel', [12235232, 'bac4b18e1f9e56ee429864b2c6b95a744be896c0a1b783a64eb4ac2b0f3eeeea']],
  ['liweike-clock', [2550816, '43f3124eb801655e7808e7f1ccfccf8b6dd9cd7dc5ed2599c8949dcb71990384']],
  ['liweike-ar-01', [348498, 'e15b0366ee3160abb3434976194631348fba70a50e5da1413ef96d0016c8850d']],
  ['liweike-ar-02', [871098, 'd211a0eb2a139e6c8798d72a97c10d744b667f20a14f438702cd88854b8e8469']],
  ['lw-social-new-year', [21688711, '370cf28ecdf67edc38d3958bf56702bddee88a4052e967ab3c69c557551d1651', 'lw-social-new-year.mp4']],
  ['lw-social-valentines', [20810650, 'bbe71988136a3e84498b2a97eba710927f1d6812ce21ce3c007ffcfee5cd2224', 'lw-social-valentines.mp4']],
  ['lw-social-order', [18205200, 'a553324b4a8481e95fda142d5b46aab46b9ad237338c631926e58ee7ca22cd1b', 'lw-social-order.mp4']],
  ['lw-social-luoyan', [13864512, '8c888baf7eaad29e3649d7a17a9438ef7cf7dcce5bcd095f5bdaac7f04842392', 'lw-social-luoyan.mp4']],
  ['hxl-freeze', [7146728, 'f3203418c165a6714e6aaebc8e3e4a5505bf84b5de8aeaed5cfc08417ee32e1b', 'hxl-freeze.mp4']],
  ['hxl-dance-vertical', [10589478, '80c86afa9a3f6c9f6bd280337eb59aac11ec65663d73e14fd430d5dd38433c40', 'hxl-dance-vertical.mp4']],
  ['hxl-dance-male', [4671526, 'f00fa908149d078480a33280feaf151ddae17f3d28cf216effa3d2f4bfec71eb', 'hxl-dance-male.mp4']],
  ['hxl-painting', [3907566, '17139d7311aca93ee786182d82e4c0604d5b59a90e3003f7e6a11d59035af52c', 'hxl-painting.mp4']],
  ['hxl-wooden', [24324048, 'a59e320624d4037eb2e80bea6c063ac9264eb24442c6d8fc009e71d99c2552fe', 'hxl-wooden.mp4']],
  ['hxl-dance-landscape', [9143514, '2ee9f5cf8b097c6ebe6ddca000bd808fd67d89db1fa09abf4c24fbd766138256', 'hxl-dance-landscape.mp4']],
  ['hxl-graphic-motion', [1301525, '23b226738e4cf8e6edc4ff61b85e8541f066dd7fa2a2e155c8dc540667f25be0', 'hxl-graphic-motion.mp4']],
  ['hxl-live-01', [1613496, 'ce48a27b2aa655a27512537542076753c0808235b8153908c34bbba5da46b479', 'hxl-live-01.mp4']],
  ['hxl-live-02', [6370844, '901e245079e8919de18a865b333ea959e4ae6d8892b7cf7230ae9366b8249359', 'hxl-live-02.mp4']],
  ['hxl-live-03', [5104525, '32fb0af8e0cc64532f566df564657b811225cd369eb57718ed88173c36b46e9b', 'hxl-live-03.mp4']],
  ['hxl-live-04', [8005791, 'e14542e9e959245703f619d5e3c80144df97f331a8058c3c942acefe0dbd4f91', 'hxl-live-04.mp4']],
  ['hxl-live-05', [5353694, '8593106cfa3815d2292ba49d563ddd730373091d6e0e7346cfa0bbb048313440', 'hxl-live-05.mp4']],
  ['hxl-live-06', [10020816, '57fcdd9508a586951394271d8598f1af8eac6b4d538f62086ef6e1cf432601d3', 'hxl-live-06.mp4']],
  ['hxl-live-process', [3938596, '3ff2052b6674a554c0a3c50bef20ceef5d67b4933767cae323ad0a0c22cf36a4', 'hxl-live-process.mp4']],
].map(([slug, [size, sha256, file]]) => [slug, {slug, size, sha256, file: file || 'extra-' + slug + '.mp4'}]));

export function clipBlockPath(clip, index) {
  return '/clip-blocks/' + clip.sha256 + '/' + index + '.bin';
}
