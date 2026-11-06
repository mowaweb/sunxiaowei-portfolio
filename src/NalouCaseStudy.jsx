import React, { useRef, useState } from 'react';
import './nalou-case.css';

const number = value => String(value).padStart(2, '0');
const posterFor = clip => clip.poster || clip.image;

export default function NalouCaseStudy({ project, Player }) {
  const clips = project.clips || [];
  const [selected, setSelected] = useState(0);
  const [rate, setRate] = useState(1);
  const stage = useRef(null);
  const clip = clips[selected];
  if (!clip) return <h2 id="dialog-project-title">{project.title}</h2>;

  const poster = posterFor(clip) || project.image;
  const portrait = clip.portrait ?? (clip.width && clip.height ? clip.height > clip.width : project.portrait);
  const neighbors = [];
  for (let step = 1; step < clips.length && neighbors.length < 2; step++) {
    const index = (selected + step) % clips.length;
    if (posterFor(clips[index])) neighbors.push(index);
  }
  function choose(index) {
    setSelected(index);
    requestAnimationFrame(() => {
      stage.current?.focus({ preventScroll: true });
      stage.current?.scrollIntoView?.({ block: 'nearest',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
  }

  return (
    <article className="nalou-case">
      <header className="nalou-head">
        <span>{project.nature}</span>
        {project.link && <a href={project.link} target="_blank" rel="noreferrer">抖音主页 ↗</a>}
      </header>
      <div className={'nalou-collage' + (portrait ? ' is-portrait' : '')}>
        <div className="nalou-identity">
          <h2 id="dialog-project-title">{project.title}</h2>
          {project.role && <p>{project.role}</p>}
        </div>
        <section className="nalou-main" ref={stage} tabIndex="-1" aria-label={clip.title}>
          {clip.video ? (
            <Player key={clip.id} project={project} clip={{ ...clip, image: poster }} autoPlay playbackRate={rate} onPlaybackRateChange={setRate} />
          ) : (
            <div className="nalou-remote-frame">
              {poster && <img src={poster} alt={clip.title + '封面'} />}
              {clip.watchUrl
                ? <a href={clip.watchUrl} target="_blank" rel="noreferrer">在抖音观看 ↗</a>
                : poster && <a href={poster} target="_blank" rel="noreferrer">查看封面大图 ↗</a>}
            </div>
          )}
          <div className="nalou-current">
            <span>{number(selected + 1)} / {number(clips.length)}</span>
            <h3>{clip.title}</h3>
            {clip.video && clip.watchUrl &&
              <a href={clip.watchUrl} target="_blank" rel="noreferrer" aria-label={`打开${clip.title}的发布页`}>原作 ↗</a>}
          </div>
        </section>
        {neighbors.map((index, position) => (
          <button key={clips[index].id} className={`nalou-peek peek-${position + 1}`} type="button"
            aria-label={`切换至${clips[index].title}`} onClick={() => choose(index)}>
            <img src={posterFor(clips[index])} alt="" />
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <section className="nalou-works" aria-label="选择娜楼作品">
        <div className="nalou-works-heading"><h3>账号作品</h3><span>{number(clips.length)} 部</span></div>
        <div className="nalou-works-grid">
          {clips.map((item, index) => (
            <button type="button" key={item.id} aria-label={`选择${item.title}`} aria-pressed={selected === index}
              onClick={() => choose(index)}>
              <span className="nalou-tile-image">
                {posterFor(item) && <img src={posterFor(item)} loading="lazy" decoding="async" alt="" />}
                <span>{number(index + 1)}</span>
              </span>
              <strong>{item.title}</strong>
            </button>
          ))}
        </div>
      </section>
    </article>
  );
}
