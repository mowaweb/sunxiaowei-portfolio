import React, { useEffect, useState } from 'react';
import FilmProcessGallery from './FilmProcessGallery';

export const fullFilms = {
  drone: { title: '它竟然比我想象中更“野”', duration: '08:33', video: './assets/full-drone.m3u8', views: 674103 },
  osmo: { title: '一代用户值得升级吗？大疆Osmo 360 II 全面实测', duration: '06:45', video: './assets/full-osmo.m3u8', views: 1311541 },
  'bambu-a1': { title: '比游戏机便宜！拓竹 A1 用了一年后，说说它到底值不值得买？', duration: '05:52', video: './assets/full-bambu.mp4', views: 305893 },
  lotus: { title: '纽北老炮，让我重新理解了操控', duration: '10:44', video: './assets/full-lotus.m3u8', views: 1267500 }
};
const checkedOn = '2026-11-06';
export function FilmViews({ film }) {
  return <span className="film-views"><b>B 站正片 · {film.views.toLocaleString('zh-CN')} 次播放</b><time dateTime={checkedOn}>截至 {checkedOn}</time></span>;
}
export function useLocalStream(ref, url) {
  const [failed, setFailed] = useState(false);
  const playlist = url?.endsWith('.m3u8');
  useEffect(() => {
    let closed = false, player;
    const video = ref.current;
    setFailed(false);
    if (!playlist || !video) return;
    const fallback = () => {
      if (closed) return;
      if (video.canPlayType('application/vnd.apple.mpegurl')) video.src = url;
      else setFailed(true);
    };
    import('hls.js/light').then(({ default: Hls }) => {
      if (closed) return;
      if (!Hls.isSupported()) return fallback();
      player = new Hls({ maxBufferLength: 30, backBufferLength: 20 });
      player.on(Hls.Events.ERROR, (_, info) => { if (info.fatal && !closed) setFailed(true); });
      player.loadSource(url);
      player.attachMedia(video);
    }).catch(fallback);
    return () => { closed = true; player?.destroy(); };
  }, [playlist, url, ref]);
  return { playlist, failed };
}
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
      <div className="released-heading"><div><span>B 站原片 / {project.id === 'bambu-a1' ? '如何评价_AI' : '所长Wy'}</span><h3>{film.title}</h3></div><a href={project.link} target="_blank" rel="noreferrer">原发布页 ↗</a></div>
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
