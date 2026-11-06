import React, { useRef, useState } from 'react';

const positions = ['before', 'current', 'next', 'after'];
const number = n => String(n).padStart(2, '0');

export default function PosterCaseStudy({ project, Player }) {
  const { art, accent, theme } = project.caseStudy;
  const [index, setIndex] = useState(0);
  const [rate, setRate] = useState(1);
  const touchStart = useRef(null);
  const exhibit = useRef(null);
  const lastSwipe = useRef(-Infinity);
  const isEgret = theme === 'egret';
  const film = project.clips.find(clip => clip.video);
  const board = !isEgret && project.clips.find(clip => !clip.video);
  const count = art.length;
  const wrap = value => (value + count) % count;
  const move = direction => setIndex(i => wrap(i + direction));
  const keydown = e => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      move(e.key === 'ArrowRight' ? 1 : -1);
    }
  };
  const onSwipeEnd = e => {
    const origin = touchStart.current;
    touchStart.current = null;
    if (!origin || !e.changedTouches.length) return;
    const dx = e.changedTouches[0].clientX - origin.x;
    const dy = e.changedTouches[0].clientY - origin.y;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      lastSwipe.current = performance.now();
      move(dx < 0 ? 1 : -1);
    }
  };

  return <article className={`poster-case is-${theme}`} style={{ '--poster-accent': accent }}>
    <header className="poster-head">
      <div className="poster-wordmark"><small>S×W / {project.number}</small><span>CHARACTER SERIES</span></div>
      <div><span className="poster-kicker">{project.nature}</span><h2 id="dialog-project-title">{project.title}</h2><p className="poster-subtitle">{isEgret ? 'Egret Character Studies' : 'A Little Chase'}</p></div>
    </header>
    <section className="poster-exhibit" ref={exhibit} aria-label="海报画廊" onKeyDown={keydown}>
      <span className="poster-ghost" aria-hidden="true">{isEgret ? 'EGRET' : 'FRIES'}</span>
      <div className="poster-rail" onTouchStart={e => {
        touchStart.current = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
      }} onTouchEnd={onSwipeEnd} onTouchCancel={() => { touchStart.current = null; }} onClickCapture={e => {
        if (performance.now() - lastSwipe.current < 360) { e.preventDefault(); e.stopPropagation(); }
      }}>
        {positions.map((position, slot) => {
          const which = wrap(index + slot - 1), item = art[which];
          const current = position === 'current';
          const Tag = current ? 'a' : 'button';
          return <Tag key={position} className={`poster-slide slot-${position}`} {...(current ? {
            href: item.image, target: '_blank', rel: 'noreferrer', 'aria-label': `查看完整画面：${item.title}`
          } : { type: 'button', onClick: () => setIndex(which), 'aria-label': `切换至${item.title}` })}>
            <span className="poster-mat"><img src={item.plate || item.image} alt={current ? item.title : ''} decoding="async" style={item.position ? { objectPosition: item.position } : undefined} /></span>
            <span className="poster-label">{item.title}{current && <small>查看原图 ↗</small>}</span>
          </Tag>;
        })}
      </div>
      <div className="poster-controls">
        <button type="button" aria-label="上一张海报" onClick={() => move(-1)}>←</button>
        <span aria-live="polite" aria-atomic="true" aria-label={`第 ${index + 1} 张，共 ${count} 张：${art[index].title}`}>{number(index + 1)} / {number(count)}</span>
        <button type="button" aria-label="下一张海报" onClick={() => move(1)}>→</button>
      </div>
    </section>
    <section className="poster-index" aria-label="画面索引">
      <div className="poster-section-title"><h3>{isEgret ? '角色动作与设定' : '镜头与制作过程'}</h3><span>FRAME INDEX / {number(count)}</span></div>
      <div className="poster-thumbs">{art.map((item, i) => <button type="button" key={item.id} aria-label={`选择${item.title}`}
        aria-pressed={i === index} onClick={() => {
          setIndex(i);
          exhibit.current?.querySelector('.slot-current')?.focus({ preventScroll: true });
          exhibit.current?.scrollIntoView?.({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
        }}>
        <img src={item.thumb || item.plate || item.image} alt="" loading="lazy" decoding="async" /><span>{number(i + 1)} / {item.title}</span>
      </button>)}</div>
    </section>
    {film && <section className="poster-film" aria-label="项目完整视频">
      <div className="poster-section-title"><h3>动画与制作过程</h3><span>MOTION / {film.duration}</span></div>
      <Player project={project} clip={film} autoPlay={false} playbackRate={rate} onPlaybackRateChange={setRate} />
    </section>}
    <p className="poster-credits">{project.role}{board && <>　·　<a href={board.image} target="_blank" rel="noreferrer">查看项目展板 ↗</a></>}{film && project.link && <>　·　<a href={project.link} target="_blank" rel="noreferrer">{project.linkLabel} ↗</a></>}</p>
  </article>;
}
