import React, { useEffect, useRef, useState } from 'react';
import { PlayIcon } from './Icons';
import SocialAccountSection from './SocialAccountSection';
import './social-account.css';
import './hxl-carousel.css';

const number = value => String(value).padStart(2, '0');
const groupNames = { film: '角色视频', live: '虚拟偶像直播', graphic: '平面与动态视觉' };
const restMs = 6200;

function HoverPreview({ clip }) {
  const video = useRef(null);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    element.muted = true;
    element.play().catch(() => {});
    return () => { element.pause(); element.removeAttribute('src'); element.load(); };
  }, [clip.video]);
  return <video ref={video} src={clip.video} muted playsInline loop preload="none" aria-hidden="true" />;
}

export default function HuaxiaolouCaseStudy({ project, Player }) {
  const clips = project.clips || [];
  const films = clips.filter(clip => clip.video);
  const stills = clips.filter(clip => !clip.video);
  const [selectedId, setSelectedId] = useState(films[0]?.id);
  const [group, setGroup] = useState('all');
  const [rate, setRate] = useState(1);
  const [playingId, setPlayingId] = useState(null);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [previewId, setPreviewId] = useState(null);
  const [focusWithin, setFocusWithin] = useState(false);
  const [interaction, setInteraction] = useState(0);
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  const exhibit = useRef(null), rail = useRef(null), screen = useRef(null);
  const pointer = useRef(null), discardClick = useRef(false);
  const groups = ['film', 'live', 'graphic'].filter(key => films.some(clip => (clip.group || 'film') === key));
  const visibleFilms = group === 'all' ? films : films.filter(clip => (clip.group || 'film') === group);
  const index = Math.max(0, visibleFilms.findIndex(clip => clip.id === selectedId));
  const count = visibleFilms.length;
  const selected = visibleFilms[index];
  const playing = films.find(clip => clip.id === playingId);
  const wrap = value => (value + count) % count;
  const slots = count >= 6 ? [-2, -1, 0, 1, 2, 3] : count > 1 ? Array.from({ length: count }, (_, i) => i - 1) : [0];

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    preference.addEventListener?.('change', update);
    return () => preference.removeEventListener?.('change', update);
  }, []);
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .12 });
    if (exhibit.current) observer.observe(exhibit.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (count < 2 || held || paused || reduced || !visible || !pageVisible || hoveredId || focusWithin || playingId) return;
    const timer = window.setTimeout(() => setSelectedId(visibleFilms[(index + 1) % count].id), restMs);
    return () => window.clearTimeout(timer);
  }, [count, index, group, held, paused, reduced, visible, pageVisible, hoveredId, focusWithin, playingId, interaction]);
  useEffect(() => {
    setPreviewId(null);
    if (!hoveredId || held || reduced || !visible || !pageVisible || playingId) return;
    const timer = window.setTimeout(() => setPreviewId(hoveredId), 220);
    return () => window.clearTimeout(timer);
  }, [hoveredId, held, reduced, visible, pageVisible, playingId]);

  function browse(clip) {
    if (!clip) return;
    setSelectedId(clip.id);
    setPlayingId(null);
    setHoveredId(null);
    setPreviewId(null);
    setInteraction(value => value + 1);
  }
  function move(direction) { if (count > 1) browse(visibleFilms[wrap(index + direction)]); }
  function play(clip) {
    if (!clip) return;
    setSelectedId(clip.id);
    setPlayingId(clip.id);
    setHoveredId(null);
    setPreviewId(null);
    requestAnimationFrame(() => {
      screen.current?.focus({ preventScroll: true });
      screen.current?.scrollIntoView({ block: 'start', behavior: reduced ? 'instant' : 'smooth' });
    });
  }
  function closePlayer() {
    setPlayingId(null);
    setPaused(true);
    rail.current?.focus({ preventScroll: true });
  }
  function chooseGroup(nextGroup) {
    setGroup(nextGroup);
    browse(nextGroup === 'all' ? films[0] : films.find(clip => (clip.group || 'film') === nextGroup));
  }
  function playNext() {
    if (!project.autoAdvanceClips) return;
    const position = visibleFilms.findIndex(clip => clip.id === playingId);
    if (position >= 0 && position < count - 1) { setSelectedId(visibleFilms[position + 1].id); setPlayingId(visibleFilms[position + 1].id); }
  }
  function keydown(e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      rail.current?.focus({ preventScroll: true });
      if (e.key === 'Home') browse(visibleFilms[0]);
      else if (e.key === 'End') browse(visibleFilms[count - 1]);
      else move(e.key === 'ArrowRight' ? 1 : -1);
    } else if (e.key === 'Enter' && e.target === rail.current) { e.preventDefault(); play(selected); }
  }
  function pointerDown(e) {
    if (pointer.current || e.button !== 0 || e.isPrimary === false || count < 2) return;
    discardClick.current = false;
    const element = e.currentTarget;
    const step = element.clientWidth * (parseFloat(window.getComputedStyle(element).getPropertyValue('--hxl-step')) || 34) / 100;
    pointer.current = { id: e.pointerId, x: e.clientX, y: e.clientY, axis: null, step };
    setHeld(true);
    setPreviewId(null);
    (e.target.closest('.hxl-video-card') || element).setPointerCapture?.(e.pointerId);
  }
  function pointerMove(e) {
    const start = pointer.current;
    if (!start || start.id !== e.pointerId) return;
    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (!start.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 5) {
      start.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      discardClick.current = true;
    }
    if (start.axis !== 'x') return;
    e.currentTarget.dataset.dragging = 'true';
    e.currentTarget.style.setProperty('--hxl-drag', Math.max(-start.step, Math.min(start.step, dx)) + 'px');
  }
  function endPointer(e, cancelled = false) {
    const start = pointer.current;
    if (!start || start.id !== e.pointerId) return;
    const dx = e.clientX - start.x;
    const threshold = Math.max(32, Math.min(88, e.currentTarget.clientWidth * .11));
    pointer.current = null;
    delete e.currentTarget.dataset.dragging;
    e.currentTarget.style.removeProperty('--hxl-drag');
    setHeld(false);
    if (!cancelled && start.axis === 'x' && Math.abs(dx) >= threshold) move(dx < 0 ? 1 : -1);
  }
  const allowPreview = !playingId && !held && !reduced && visible && pageVisible;

  return <article className="hxl-case hxl-case--carousel">
    <header className="hxl-carousel-heading">
      <div className="hxl-carousel-wordmark"><small>S×W / {project.number}</small><span>CHARACTER & MOTION</span></div>
      <div><span className="social-kicker">{project.nature}</span><h2 id="dialog-project-title">花小楼 · 虚拟偶像</h2><p lang="en">Huaxiaolou, in Motion</p></div>
    </header>

    {selected && <section className="hxl-exhibit" ref={exhibit} aria-label="花小楼视频轮播" onKeyDown={keydown} onFocusCapture={e => setFocusWithin(Boolean(rail.current?.contains(e.target)))} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocusWithin(false); }}>
      <span className="hxl-carousel-ghost" aria-hidden="true">HUAXIAOLOU</span>
      <div className={`hxl-video-rail${count === 1 ? ' is-single' : ''}`} ref={rail} role="group" tabIndex={0} aria-label="拖动或使用左右方向键切换视频，按回车播放当前视频"
        onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={e => endPointer(e)} onPointerCancel={e => endPointer(e, true)} onLostPointerCapture={e => endPointer(e, true)} onDragStart={e => e.preventDefault()}
        onClickCapture={e => { if (discardClick.current && e.detail !== 0) { e.preventDefault(); e.stopPropagation(); } }}>
        {slots.map(offset => {
          const clip = visibleFilms[wrap(index + offset)];
          const current = offset === 0, edge = offset === -2 || offset === 3;
          return <button type="button" key={clip.id} className={`hxl-video-card slot-${offset + 2}${current ? ' is-current' : ''}${edge ? ' is-edge' : ''}`}
            tabIndex={edge ? -1 : 0} aria-hidden={edge || undefined} aria-label={`播放${clip.title}，${clip.duration || clip.stage}`} aria-current={current ? 'true' : undefined}
            onClick={() => play(clip)} onPointerEnter={e => { if (!edge && e.pointerType === 'mouse') setHoveredId(clip.id); }} onPointerLeave={() => setHoveredId(null)}>
            <span className="hxl-video-mat"><img src={clip.poster || clip.image} alt="" draggable="false" decoding="async" />{allowPreview && previewId === clip.id && hoveredId === clip.id && <HoverPreview clip={clip} />}</span>
            <span className="hxl-card-shade" aria-hidden="true" />
            <span className="hxl-card-meta"><span>{number(films.findIndex(item => item.id === clip.id) + 1)} / {groupNames[clip.group || 'film']}</span><span>{clip.duration}</span></span>
            <span className="hxl-card-label"><strong>{clip.title}</strong>{current && <><small>点击播放完整视频 ↗</small>{clip.socialLikes && <span className="hxl-card-likes">视频点赞 {clip.socialLikes}<small>据抖音历史截图</small></span>}</>}</span>
            <span className="hxl-card-play" aria-hidden="true"><PlayIcon /></span>
          </button>;
        })}
      </div>
      <div className="hxl-carousel-controls">
        <span className="hxl-carousel-hint">拖动浏览 · 点击播放<span className="hxl-hover-hint"> · 悬停预览</span></span>
        {!reduced && count > 1 && <button type="button" className="hxl-carousel-auto" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? '继续轮播' : '暂停轮播'}</button>}
        <button type="button" className="hxl-carousel-arrow" aria-label="上一个视频" disabled={count < 2} onClick={() => move(-1)}>←</button>
        <span className="hxl-carousel-count" aria-live={paused || reduced || focusWithin ? 'polite' : 'off'} aria-atomic="true" aria-label={`第 ${index + 1} 个，共 ${count} 个：${selected.title}`}>{number(index + 1)} / {number(count)}</span>
        <button type="button" className="hxl-carousel-arrow" aria-label="下一个视频" disabled={count < 2} onClick={() => move(1)}>→</button>
      </div>
    </section>}

    {playing && <section className="hxl-screen hxl-expanded-screen" ref={screen} tabIndex={-1} aria-label={`正在播放：${playing.title}`}>
      <div className="hxl-screen-label"><div><h3>{playing.title}</h3><span>{playing.stage}</span></div><button type="button" className="hxl-close-player" onClick={closePlayer}>收起播放器 ↑</button></div>
      <Player key={playing.id} project={project} clip={playing} autoPlay playbackRate={rate} onPlaybackRateChange={setRate} onEnded={playNext} />
    </section>}

    {films.length > 0 && <section className="hxl-film-library" aria-labelledby="hxl-films-title">
      <div className="hxl-library-heading"><h3 id="hxl-films-title">项目视频</h3><span>{number(films.length)} FILMS</span></div>
      <div className="hxl-film-filters" role="group" aria-label="筛选项目视频"><button type="button" aria-pressed={group === 'all'} onClick={() => chooseGroup('all')}>全部视频 <small>{films.length}</small></button>{groups.map(key => <button type="button" key={key} aria-pressed={group === key} onClick={() => chooseGroup(key)}>{groupNames[key]} <small>{films.filter(clip => (clip.group || 'film') === key).length}</small></button>)}</div>
      <details className="hxl-video-index"><summary>展开全部视频索引 <span>{number(visibleFilms.length)} ↗</span></summary>
        <div className="hxl-film-grid">{visibleFilms.map(clip => <button type="button" className={`hxl-film${clip.id === selected?.id ? ' is-current' : ''}`} key={clip.id} onClick={() => play(clip)} aria-pressed={clip.id === selected?.id} aria-label={`播放${clip.title}，${clip.duration || clip.stage}`}>
          <span className={`hxl-film-image${clip.portrait ? ' is-portrait' : ''}`}><img src={clip.poster || clip.image} alt="" loading="lazy" decoding="async" /><span className="hxl-play-icon" aria-hidden="true"><PlayIcon /></span><span className="hxl-film-duration">{clip.duration}</span></span>
          <strong>{clip.title}</strong><span className="hxl-film-stage">{clip.stage}</span>{clip.socialLikes && <span className="social-clip-likes">视频点赞 {clip.socialLikes}<small>据抖音历史截图</small></span>}
        </button>)}</div>
      </details>
    </section>}

    <SocialAccountSection project={project} />
    {stills.length > 0 && <section className="hxl-art" aria-labelledby="hxl-art-title">
      <header className="social-section-heading"><div><span className="social-kicker" lang="en">VISUALS & BEHIND THE SCENES</span><h3 id="hxl-art-title">平面作品与直播现场</h3></div><p>{number(stills.length)} 张项目画面</p></header>
      <div className="hxl-art-grid">{stills.map(clip => <figure key={clip.id}><a href={clip.image} target="_blank" rel="noreferrer" aria-label={`查看大图：${clip.title}`}><img src={clip.image} alt={clip.title} loading="lazy" decoding="async" width={clip.width} height={clip.height} /></a><figcaption><strong>{clip.title}</strong><span>{clip.stage} ↗</span></figcaption></figure>)}</div>
    </section>}
    <footer className="hxl-footer">{project.role && <div><span className="social-kicker" lang="en">MY CONTRIBUTION</span><p>{project.role}</p></div>}{project.link && <a href={project.link} target="_blank" rel="noreferrer">{project.linkLabel || '查看花小楼抖音主页'} ↗</a>}</footer>
  </article>;
}
