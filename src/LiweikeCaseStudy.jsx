import React, { useRef, useState } from 'react';

const number = value => String(value).padStart(2, '0');

export default function LiweikeCaseStudy({ project, Player }) {
  const films = project.clips.filter(clip => clip.video);
  const stills = project.clips.filter(clip => !clip.video);
  const [selected, setSelected] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [rate, setRate] = useState(1);
  const screen = useRef(null);
  const track = useRef(null);
  const film = films[selected];
  const wrap = index => (index + films.length) % films.length;

  function play(index) {
    setSelected(index);
    setShowPlayer(true);
    requestAnimationFrame(() => {
      if (!screen.current) return;
      screen.current.focus({ preventScroll: true });
      screen.current.scrollIntoView?.({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
  }

  function closePlayer() {
    setShowPlayer(false);
    track.current?.querySelector('.is-current')?.focus();
  }

  return <article className="lw-case">
    <header className="lw-intro">
      <span className="lw-eyebrow">{project.nature}</span>
      <h2 id="dialog-project-title"><span>李未可</span> <em>Liweike</em><small>AR 眼镜与虚拟偶像宣发</small></h2>
      <p>从眼镜的内部结构，到虚拟偶像登场的瞬间。</p>
    </header>
    <section className="lw-films" aria-label="项目影片，选择卡片播放">
      <div className="lw-film-track" ref={track}>
        {[-1, 0, 1].map(offset => {
          const index = wrap(selected + offset);
          const clip = films[index];
          return <button type="button" key={clip.id} className={'lw-film-card' + (offset === 0 ? ' is-current' : '')}
            aria-label={`播放${clip.title}，${clip.duration}`} onClick={() => play(index)}>
            <span className="lw-film-meta"><b>FILM / {number(index + 1)}</b><i>{clip.duration}</i></span>
            <img className="lw-film-thumb" src={clip.image} width="84" height="84" alt="" />
            <strong>{clip.title}</strong><span className="lw-film-stage">{clip.stage}</span>
            <span className="lw-film-play"><span aria-hidden="true">▸</span> 播放影片</span>
          </button>;
        })}
      </div>
      <button type="button" className="lw-prev" aria-label="上一个片段" onClick={() => setSelected(i => wrap(i - 1))}>←</button>
      <button type="button" className="lw-next" aria-label="下一个片段" onClick={() => setSelected(i => wrap(i + 1))}>→</button>
    </section>
    {showPlayer && <section className="lw-screen" ref={screen} tabIndex="-1" aria-label={`正在播放：${film.title}`}>
      <div className="lw-section-heading"><h3>{film.title}</h3><button type="button" onClick={closePlayer}>收起播放器 <span aria-hidden="true">↑</span></button></div>
      <Player key={film.id} project={project} clip={film} playbackRate={rate} onPlaybackRateChange={setRate} />
    </section>}
    <section className="lw-gallery" aria-label="角色与场景静帧">
      <div className="lw-section-heading"><h3>角色与场景静帧</h3><span>STILL FRAMES / {number(stills.length)}</span></div>
      <div className="lw-gallery-rows">{Array.from({ length: Math.ceil(stills.length / 3) }, (_, row) =>
        <div className="lw-gallery-row" key={row}>{stills.slice(row * 3, row * 3 + 3).map(clip =>
          <a key={clip.id} className="lw-still" href={clip.image} target="_blank" rel="noreferrer" aria-label={`查看${clip.title}大图`}>
            <img src={clip.image} alt={clip.title} loading="lazy" decoding="async" /><span>{clip.title} ↗</span>
          </a>)}</div>
      )}</div>
    </section>
    <footer className="lw-footer"><div><span>制作 / CREDITS</span><p>{project.role}</p></div>
      <a href={project.link} target="_blank" rel="noreferrer"><small>DOUYIN / 李未可</small><strong>{project.linkLabel} ↗</strong></a>
    </footer>
  </article>;
}
