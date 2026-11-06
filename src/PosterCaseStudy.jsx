import React, { useEffect, useRef, useState } from 'react';

const positions = ['enter-before', 'before', 'current', 'next', 'after', 'enter-after'];
const restMs = 5800;
const number = n => String(n).padStart(2, '0');

export default function PosterCaseStudy({ project, Player }) {
  const { art, accent, theme } = project.caseStudy;
  const [index, setIndex] = useState(0);
  const [rate, setRate] = useState(1);
  const pointer = useRef(null);
  const discardClick = useRef(false);
  const [held, setHeld] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [visible, setVisible] = useState(true);
  const [interaction, setInteraction] = useState(0);
  const exhibit = useRef(null);
  const isEgret = theme === 'egret';
  const film = project.clips.find(clip => clip.video);
  const board = !isEgret && project.clips.find(clip => !clip.video);
  const count = art.length;
  const wrap = value => (value + count) % count;
  const select = which => {
    setInteraction(value => value + 1);
    setIndex(which);
  };
  const move = direction => select(i => wrap(i + direction));
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    preference.addEventListener?.('change', update);
    return () => preference.removeEventListener?.('change', update);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .12 });
    if (exhibit.current) observer.observe(exhibit.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!isEgret || count < 2 || held || paused || reduced || !visible) return;
    let timer;
    const schedule = () => {
      window.clearTimeout(timer);
      if (!document.hidden) timer = window.setTimeout(() => setIndex(i => (i + 1) % count), restMs);
    };
    schedule();
    document.addEventListener('visibilitychange', schedule);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', schedule);
    };
  }, [isEgret, count, held, paused, reduced, visible, index, interaction]);
  const keydown = e => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      if (e.target.closest('.poster-surface')) exhibit.current?.querySelector('.poster-rail')?.focus({ preventScroll: true });
      move(e.key === 'ArrowRight' ? 1 : -1);
    }
  };
  const pointerDown = e => {
    if (pointer.current || e.button !== 0 || e.isPrimary === false) return;
    discardClick.current = false;
    const rail = e.currentTarget;
    const step = rail.clientWidth * (parseFloat(window.getComputedStyle(rail).getPropertyValue('--poster-step')) || 34) / 100;
    pointer.current = { id: e.pointerId, x: e.clientX, y: e.clientY, axis: null, step };
    setHeld(true);
    // Capture on the link for a tap; capturing on the rail would steal its click.
    const target = e.target.closest('.poster-surface') || e.currentTarget;
    target.setPointerCapture?.(e.pointerId);
  };
  const pointerMove = e => {
    const start = pointer.current;
    if (!start || start.id !== e.pointerId) return;
    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (!start.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 5) {
      start.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      discardClick.current = true;
    }
    if (start.axis !== 'x') return;
    const rail = e.currentTarget;
    const amount = Math.max(-start.step, Math.min(start.step, dx));
    rail.dataset.dragging = 'true';
    rail.style.setProperty('--poster-drag', amount + 'px');
  };
  const endPointer = (e, cancelled = false) => {
    const start = pointer.current;
    if (!start || start.id !== e.pointerId) return;
    const rail = e.currentTarget, dx = e.clientX - start.x;
    const threshold = Math.max(32, Math.min(88, rail.clientWidth * .11));
    pointer.current = null;
    delete rail.dataset.dragging;
    rail.style.removeProperty('--poster-drag');
    setHeld(false);
    if (!cancelled && start.axis === 'x' && Math.abs(dx) >= threshold) move(dx < 0 ? 1 : -1);
  };

  return <article className={`poster-case is-${theme}`} style={{ '--poster-accent': accent }}>
    <header className="poster-head">
      <div className="poster-wordmark"><small>S×W / {project.number}</small><span>CHARACTER SERIES</span></div>
      <div><span className="poster-kicker">{project.nature}</span><h2 id="dialog-project-title">{project.title}</h2><p className="poster-subtitle">{isEgret ? 'Egret Character Studies' : 'A Little Chase'}</p></div>
    </header>
    <section className="poster-exhibit" ref={exhibit} aria-label="海报画廊" onKeyDown={keydown}>
      <span className="poster-ghost" aria-hidden="true">{isEgret ? 'EGRET' : 'FRIES'}</span>
      <div className="poster-rail" role="group" aria-label="角色海报，可拖动或使用方向键切换" tabIndex={-1}
        onPointerDown={pointerDown} onPointerMove={pointerMove}
        onPointerUp={e => endPointer(e)} onPointerCancel={e => endPointer(e, true)} onLostPointerCapture={e => endPointer(e, true)}
        onDragStart={e => e.preventDefault()} onClickCapture={e => {
        if (discardClick.current && e.detail !== 0) { e.preventDefault(); e.stopPropagation(); }
      }}>
        {positions.map((position, slot) => {
          const which = wrap(index + slot - 2), item = art[which];
          const current = position === 'current';
          const edge = slot === 0 || slot === positions.length - 1;
          return <a key={item.id} className={`poster-surface ${edge ? 'poster-edge' : 'poster-slide'} slot-${position}`}
            href={current ? item.image : undefined} target={current ? '_blank' : undefined} rel={current ? 'noreferrer' : undefined}
            role={current || edge ? undefined : 'button'} tabIndex={edge ? -1 : 0} aria-hidden={edge || undefined}
            aria-label={`${current ? '查看完整画面：' : '切换至'}${item.title}`}
            draggable="false" onClick={current || edge ? undefined : () => select(which)} onKeyDown={e => {
              if (!current && !edge && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); select(which); }
            }}>
            <span className="poster-mat"><img src={item.plate || item.image} alt={current ? item.title : ''} draggable="false" decoding="async" style={item.position ? { objectPosition: item.position } : undefined} /></span>
            <span className="poster-label">{item.title}{current && <small>查看原图 ↗</small>}</span>
          </a>;
        })}
      </div>
      <div className="poster-controls">
        {isEgret && !reduced && <button type="button" className="poster-auto" aria-pressed={paused} onClick={() => setPaused(p => !p)}>{paused ? '继续轮播' : '暂停轮播'}</button>}
        <button type="button" aria-label="上一张海报" onClick={() => move(-1)}>←</button>
        <span aria-live={paused || reduced ? 'polite' : 'off'} aria-atomic="true" aria-label={`第 ${index + 1} 张，共 ${count} 张：${art[index].title}`}>{number(index + 1)} / {number(count)}</span>
        <button type="button" aria-label="下一张海报" onClick={() => move(1)}>→</button>
      </div>
    </section>
    <section className="poster-index" aria-label="画面索引">
      <div className="poster-section-title"><h3>{isEgret ? '角色动作与设定' : '镜头与制作过程'}</h3><span>FRAME INDEX / {number(count)}</span></div>
      <div className="poster-thumbs">{art.map((item, i) => <button type="button" key={item.id} aria-label={`选择${item.title}`}
        aria-pressed={i === index} onClick={() => {
          select(i);
          exhibit.current?.querySelector('.poster-rail')?.focus({ preventScroll: true });
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
