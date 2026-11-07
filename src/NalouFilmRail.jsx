import React, { useEffect, useRef, useState } from 'react';
import './nalou-film-rail.css';

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

function Preview({ clip }) {
  const videoRef = useRef(null);
  useEffect(() => {
    const video = videoRef.current;
    video.muted = true;
    video.play().catch(() => {});
    return () => video.pause();
  }, [clip.video]);
  return <video ref={videoRef} aria-hidden="true" muted playsInline autoPlay loop preload="metadata" src={clip.video} poster={clip.poster || clip.image} />;
}

function rotate(strip, head, steps) {
  const count = strip.children.length;
  head.current = ((head.current + steps) % count + count) % count;
  Array.from(strip.children).forEach((card, index) => { card.style.order = (index - head.current + count) % count; });
}
function cardStep(strip) {
  return strip.children[0].getBoundingClientRect().width + (parseFloat(window.getComputedStyle(strip).columnGap) || 0);
}

export default function NalouFilmRail({ project, onSelect, suspended = false, children }) {
  const { clips } = project;
  const rail = useRef(null);
  const head = useRef(0);
  const manualUntil = useRef(0);
  const [hovered, setHovered] = useState(null);
  const [focused, setFocused] = useState(null);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [touching, setTouching] = useState(false);
  const reduced = useReducedMotion();
  const pointed = hovered ?? focused;
  const active = visible && pageVisible && !reduced && !suspended ? pointed : null;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .05 });
    observer.observe(rail.current);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);

  useEffect(() => {
    if (reduced || suspended || !visible || !pageVisible || touching || pointed !== null || clips.length < 2) return;
    const strip = rail.current;
    let step = 0, canLoop = false, last = 0, fraction = 0, frame = null;
    const advance = now => {
      frame = null;
      if (!canLoop) return;
      const elapsed = last ? Math.min(now-last, 64) : 0;
      last = now;
      if (now >= manualUntil.current) {
        fraction += elapsed * .021;
        const pixels = Math.floor(fraction);
        if (pixels) {
          fraction -= pixels;
          const next = strip.scrollLeft + pixels;
          if (next >= step) {
            const gone = Math.floor(next / step);
            rotate(strip, head, gone);
            strip.scrollLeft = next - step * gone;
          } else strip.scrollLeft = next;
        }
      }
      frame = window.requestAnimationFrame(advance);
    };
    const measure = () => {
      // Cache layout dimensions between resizes. Each tick only reads the actual
      // scroll position, so wheel/touch/keyboard navigation keeps its place.
      step = cardStep(strip);
      canLoop = step > 0 && strip.scrollWidth - strip.clientWidth >= step;
      if (canLoop && frame === null) { last = 0; frame = window.requestAnimationFrame(advance); }
      else if (!canLoop && frame !== null) { window.cancelAnimationFrame(frame); frame = null; }
    };
    const resize = window.ResizeObserver ? new window.ResizeObserver(measure) : null;
    resize?.observe(strip);
    resize?.observe(strip.children[0]);
    if (!resize) window.addEventListener('resize', measure);
    measure();
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      resize?.disconnect();
      if (!resize) window.removeEventListener('resize', measure);
    };
  }, [reduced, suspended, visible, pageVisible, touching, pointed, clips.length]);

  function delayAutomatic() { manualUntil.current = window.performance.now() + 1200; }
  function move(direction) {
    const strip = rail.current, step = cardStep(strip);
    if (!(step > 0) || strip.scrollWidth <= strip.clientWidth) return;
    delayAutomatic();
    let position = strip.scrollLeft;
    if (direction < 0 && position < step) {
      rotate(strip, head, -1); position += step; strip.scrollLeft = position;
    } else if (direction > 0 && position + step > strip.scrollWidth - strip.clientWidth) {
      const passed = Math.floor(position / step);
      if (passed) { rotate(strip, head, passed); position -= passed * step; strip.scrollLeft = position; }
    }
    strip.scrollTo({ left: position + direction * step, behavior: reduced ? 'instant' : 'smooth' });
  }
  function releaseTouch() { setTouching(false); delayAutomatic(); }
  return <section className="nalou-film-rail" aria-labelledby="nalou-rail-heading">
    <header className="nalou-rail-header"><h3 id="nalou-rail-heading">{project.title}</h3><span>{clips.length} 部视频</span></header>
    <div className="nalou-rail-strip" ref={rail} onWheel={delayAutomatic}
      onTouchStart={() => { setTouching(true); setHovered(null); }} onTouchEnd={releaseTouch} onTouchCancel={releaseTouch}>
      {clips.map((clip,index) => <button type="button" className="nalou-rail-card" key={clip.id}
        data-clip={clip.id} data-clip-index={index} aria-label={`播放${clip.title}`} title={clip.title}
        onPointerEnter={event => { if (event.pointerType === 'mouse' || event.pointerType === 'pen') setHovered(index); }}
        onPointerLeave={() => setHovered(current => current === index ? null : current)}
        onFocus={event => { if (event.currentTarget.matches(':focus-visible')) { setHovered(null); setFocused(index); } }}
        onBlur={() => setFocused(current => current === index ? null : current)}
        onClick={() => { setHovered(null); setFocused(null); onSelect(index); }}>
        <span className="nalou-rail-picture"><img src={clip.poster || clip.image} loading="lazy" decoding="async" alt="" />
          {active === index && clip.video && <Preview clip={clip} />}
        </span><span className="nalou-rail-title">{clip.title}</span>
      </button>)}
    </div>
    <footer className="nalou-rail-footer">
      {children}
      <div className="nalou-rail-arrows"><button type="button" aria-label="向左浏览娜楼作品" onClick={() => move(-1)}>←</button><button type="button" aria-label="向右浏览娜楼作品" onClick={() => move(1)}>→</button></div>
    </footer>
  </section>;
}
