import React, { useEffect, useRef } from 'react';
import BorderGlow from './BorderGlow';
import './a-wan-identity.css';

const pointerMotion = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
const clamp = value => Math.min(1, Math.max(-1, value));

export default function AWanIdentityCard() {
  const surfaceRef = useRef(null);

  useEffect(() => {
    const surface = surfaceRef.current;
    const preference = window.matchMedia(pointerMotion);
    let frame = null;
    let mouseX, mouseY;

    function reset() {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      surface.style.removeProperty('--awan-x');
      surface.style.removeProperty('--awan-y');
      surface.style.removeProperty('--awan-depth');
      surface.style.removeProperty('--awan-edge');
    }

    function renderPosition() {
      frame = null;
      // Only the inner panel transforms. The hit surface always has its original geometry.
      const { left, top, width, height } = surface.getBoundingClientRect();
      if (!width || !height) return;
      const dx = mouseX - left - width / 2;
      const dy = mouseY - top - height / 2;
      const x = clamp(2 * dx / width);
      const y = clamp(2 * dy / height);
      surface.style.setProperty('--awan-x', x.toFixed(3));
      surface.style.setProperty('--awan-y', y.toFixed(3));
      surface.style.setProperty('--awan-depth', '1');
      const proximity = Math.max(Math.abs(x), Math.abs(y));
      surface.style.setProperty('--awan-edge', Math.max(0, (proximity - .30) / .70).toFixed(3));
      surface.style.setProperty('--awan-angle', (Math.atan2(dy, dx) * 180 / Math.PI + 90).toFixed(2) + 'deg');
    }

    function follow(event) {
      if (!preference.matches || event.pointerType !== 'mouse') {
        reset();
        return;
      }
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (frame === null) frame = window.requestAnimationFrame(renderPosition);
    }

    surface.addEventListener('pointermove', follow, { passive: true });
    surface.addEventListener('pointerleave', reset);
    surface.addEventListener('pointercancel', reset);
    preference.addEventListener?.('change', reset);
    window.addEventListener('blur', reset);
    return () => {
      reset();
      surface.removeEventListener('pointermove', follow);
      surface.removeEventListener('pointerleave', reset);
      surface.removeEventListener('pointercancel', reset);
      preference.removeEventListener?.('change', reset);
      window.removeEventListener('blur', reset);
    };
  }, []);

  return (
    <div className="awan-identity" ref={surfaceRef}>
      <div className="identity-panel">
        <BorderGlow />
        <div className="identity-top">
          <span>THE PERSON<br />BEHIND THE FRAMES</span><span className="identity-cross">✳</span>
        </div>
        <div className="avatar-composition">
          <span className="avatar-orbit orbit-one" /><span className="avatar-orbit orbit-two" />
          <div className="avatar-frame">
            <img src="./assets/avatar.jpg" alt="孙晓伟简历中的手绘头像" width="260" height="260" loading="lazy" />
          </div>
          <span className="avatar-coordinate">PROFILE / SUN XIAOWEI</span>
        </div>
        <div className="identity-bottom"><span>阿丸 <small>A-WAN</small></span><span>3D &amp; AIGC<br />VISUAL DESIGNER</span></div>
      </div>
    </div>
  );
}
