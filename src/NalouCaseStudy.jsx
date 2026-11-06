import React, { useEffect, useRef, useState } from 'react';
import './nalou-case.css';

const number = value => String(value).padStart(2, '0');
const posterFor = clip => clip.poster || clip.image;

export default function NalouCaseStudy({ project, Player, initialClipIndex = 0 }) {
  const clips = project.clips || [];
  const [selected, setSelected] = useState(() => clips[initialClipIndex] ? initialClipIndex : 0);
  const [rate, setRate] = useState(1);
  const stage = useRef(null);
  const collage = useRef(null);
  const clip = clips[selected];
  useEffect(() => {
    const element = collage.current;
    if (!element) return;
    const motion = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let frame = 0;
    let point;
    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      element.style.removeProperty('--nalou-pointer-x');
      element.style.removeProperty('--nalou-pointer-y');
    };
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const axis = (coordinate, origin, length) => Math.max(-1, Math.min(1, (coordinate - origin) / Math.max(1, length) * 2 - 1));
      element.style.setProperty('--nalou-pointer-x', axis(point.x, rect.left, rect.width).toFixed(3));
      element.style.setProperty('--nalou-pointer-y', axis(point.y, rect.top, rect.height).toFixed(3));
    };
    const move = event => {
      if (!motion.matches || event.pointerType !== 'mouse') return;
      point = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(update);
    };
    element.addEventListener('pointermove', move, { passive: true });
    element.addEventListener('pointerleave', reset);
    element.addEventListener('pointercancel', reset);
    motion.addEventListener?.('change', reset);
    return () => {
      reset();
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', reset);
      element.removeEventListener('pointercancel', reset);
      motion.removeEventListener?.('change', reset);
    };
  }, [Boolean(clip)]);
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
      <div className={'nalou-collage' + (portrait ? ' is-portrait' : '')} ref={collage}>
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
