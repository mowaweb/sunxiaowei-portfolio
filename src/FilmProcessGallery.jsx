import React, { useEffect, useRef } from 'react';
import './film-gallery.css';

const orderNumber = value => String(value).padStart(2, '0');

export default function FilmProcessGallery({ project, clips, selected, onChoose }) {
  const rail = useRef(null);
  const sequential = project.autoAdvanceClips;
  const count = clips.length;
  const headingId = `film-process-${project.id}`;

  // Keep the active thumbnail in the horizontal strip as playback advances.
  // Scrolling the page here would move the video out of view.
  useEffect(() => {
    const strip = rail.current;
    if (selected == null || !strip || strip.scrollWidth <= strip.clientWidth) return;
    const card = strip.children[selected];
    if (!card) return;
    const bounds = strip.getBoundingClientRect();
    const rect = card.getBoundingClientRect();
    if (rect.left < bounds.left) strip.scrollLeft -= bounds.left - rect.left + 8;
    else if (rect.right > bounds.right) strip.scrollLeft += rect.right - bounds.right + 8;
  }, [selected]);

  function moveFocus(event, index) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const targets = {
      ArrowRight: Math.min(index + 1, count - 1),
      ArrowLeft: Math.max(index - 1, 0),
      Home: 0,
      End: count - 1,
    };
    const target = targets[event.key];
    if (target == null) return;
    event.preventDefault();
    rail.current?.children[target]?.focus();
  }

  return (
    <section className={'film-process' + (count === 1 ? ' is-solo' : '')} aria-labelledby={headingId}>
      <header className="film-process-heading">
        <h3 id={headingId}>镜头与制作过程</h3>
        <p>{sequential ? `选择片段后，将按 00–${orderNumber(count - 1)} 顺序连播。` : project.role}</p>
      </header>
      <div className="film-process-strip" ref={rail} role="group" aria-label="选择视频片段"
        style={{ '--process-count': count }}>
        {clips.map((clip, index) => {
          const position = count > 1 ? index * 2 / (count - 1) - 1 : 0;
          const leftTone = Math.max(-position, 0);
          const order = sequential ? orderNumber(index) + ' ' : '';
          return (
            <button className="film-process-card clip-button" key={clip.id} type="button"
              aria-label={`${clip.video ? '播放' : '查看'}${order}${clip.title} · ${clip.stage}`}
              aria-pressed={selected === index} onClick={() => onChoose(index)} onKeyDown={event => moveFocus(event, index)}
              style={{
                '--process-depth': Math.abs(position),
                '--process-turn': `${-position * 18}deg`,
                '--process-gray': leftTone * .8,
                '--process-light': 1 - leftTone * .19,
              }}>
              <span className="film-process-stage" aria-hidden="true">
                <span className="film-process-frame">
                  <img src={clip.poster || clip.image} alt="" loading="lazy" decoding="async" />
                  <span className="film-process-time">{clip.duration}</span>
                  <span className="film-process-play">▸</span>
                </span>
              </span>
              <span className="film-process-caption">
                <strong>{sequential && <span className="film-process-order">{orderNumber(index)} </span>}{clip.title}</strong>
                <small>{clip.stage}</small>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
