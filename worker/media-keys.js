export const partBytes = 8 * 1024 * 1024;

export function mediaKey(film, index) {
  return `portfolio/media/v1/${film.slug}/${film.sha256}/${index}.bin`;
}

export function verifiedKey(film) {
  return `portfolio/media/v1/${film.slug}/${film.sha256}/verified.json`;
}
