import React, { useEffect, useRef } from 'react';
import './page-atmosphere.css';

// The light is decorative. Keep its current frame while it cannot be seen.
export default function PageAtmosphere({ suspended = false }) {
  const layer = useRef(null);
  const gate = useRef({ suspended, update: null });

  useEffect(() => {
    gate.current.suspended = suspended;
    gate.current.update?.();
  }, [suspended]);

  useEffect(() => {
    const element = layer.current;
    const viewport = element.querySelector('.atmosphere-window');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const update = () => {
      element.dataset.running = String(visible && !document.hidden && !reduced.matches && !gate.current.suspended);
    };
    gate.current.update = update;
    // Observe the sticky viewport, not the full height of the content wrapper.
    const observer = window.IntersectionObserver ? new window.IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio > 0;
      update();
    }, { threshold: .01 }) : null;
    observer?.observe(viewport);
    document.addEventListener('visibilitychange', update);
    reduced.addEventListener?.('change', update);
    update();
    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', update);
      reduced.removeEventListener?.('change', update);
      gate.current.update = null;
      element.dataset.running = 'false';
    };
  }, []);

  return <div className="page-atmosphere" ref={layer} aria-hidden="true" data-running="false">
    <div className="atmosphere-window"><span className="atmosphere-grain" /></div>
  </div>;
}
