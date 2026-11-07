import React, { useState } from 'react';
import FilmProcessGallery from './FilmProcessGallery';

import { FilmViews, fullFilms } from './film-metadata';
export { FilmViews, fullFilms } from './film-metadata';

export function FilmEditions({ project, Player, children }) {
  const [edition, setEdition] = useState('film');
  const [selected, setSelected] = useState(0);
  const videoArea = React.useRef(null);
  const [rate, setRate] = useState(1);
  const film = fullFilms[project.id];
  if (!film) return children;
  return <div className="film-editions">
    <div className="film-selector">
      <div role="group" aria-label="制作片段与完整正片">
        <button type="button" aria-pressed={edition === 'film'} onClick={() => setEdition('film')}>完整正片 <small>{film.duration}</small></button>
        <button type="button" aria-pressed={edition === 'clips'} onClick={() => setEdition('clips')}>制作片段</button>
      </div>
      <FilmViews film={film} />
    </div>
    <div ref={videoArea}>
    {edition === 'clips' ? <Player key={project.clips[selected].id} project={project} clip={project.clips[selected]}
      playbackRate={rate} onPlaybackRateChange={setRate}
      onEnded={project.autoAdvanceClips ? () => setSelected(i => Math.min(i + 1, project.clips.length - 1)) : undefined} /> : <section className="released-film" aria-label="已发布的完整正片">
      <div className="released-heading"><div><span>B 站原片 / {project.id === 'bambu-a1' ? '如何评价_AI' : '所长Wy'}</span><h3>{film.title}</h3></div><div className="film-links"><a href={film.video} download={film.title + '-1080p.mp4'}>下载 1080p</a><a href={project.link} target="_blank" rel="noreferrer">B 站原片 ↗</a></div></div>
      <Player project={project} clip={{ id: project.id + '-full', ...film, stage: '完整正片', image: project.image }} playbackRate={rate} onPlaybackRateChange={setRate} />
    </section>}
    </div>
    <FilmProcessGallery project={project} clips={project.clips} selected={edition === 'clips' ? selected : null} onChoose={i => {
      setSelected(i);
      setEdition('clips');
      videoArea.current?.scrollIntoView?.({ block:'nearest', behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }} />
  </div>;
}
