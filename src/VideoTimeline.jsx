import React, { useEffect, useRef, useState } from 'react';

function clock(seconds) {
  const whole = Math.floor(seconds);
  return Math.floor(whole / 60) + ':' + String(whole % 60).padStart(2, '0');
}

export default function VideoTimeline({ videoRef, duration }) {
  const [position, setPosition] = useState(0);
  const dragging = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    const update = () => { if (!dragging.current) setPosition(video.currentTime || 0); };
    const events = ['timeupdate', 'seeking', 'seeked', 'ended', 'loadedmetadata'];
    events.forEach(name => video.addEventListener(name, update));
    update();
    return () => events.forEach(name => video.removeEventListener(name, update));
  }, [videoRef]);

  function seek(seconds) {
    const video = videoRef.current;
    if (!video || !Number.isFinite(seconds) || duration <= 0) return;
    const value = Math.max(0, Math.min(duration, seconds));
    video.currentTime = value;
    setPosition(value);
  }
  function seekByKey(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const delta = event.shiftKey ? 10 : 1;
    const now = videoRef.current?.currentTime || 0;
    const stops = { ArrowLeft: now - delta, ArrowDown: now - delta, ArrowRight: now + delta, ArrowUp: now + delta,
      Home: 0, End: duration, PageDown: now - duration / 10, PageUp: now + duration / 10 };
    if (!Object.hasOwn(stops, event.key)) return;
    event.preventDefault();
    seek(stops[event.key]);
  }
  const value = Math.min(position, duration);
  const time = clock(value) + ' / ' + clock(duration);
  return <label className="video-timeline">
    <span>进度</span>
    <input type="range" min="0" max={duration || 1} step="any" value={value} disabled={!duration}
      aria-label="视频进度" aria-valuetext={time}
      style={{ '--seek-percent': (duration ? 100 * value / duration : 0) + '%' }}
      onChange={event => seek(event.currentTarget.valueAsNumber)} onKeyDown={seekByKey}
      onPointerDown={event => { dragging.current = true; event.currentTarget.setPointerCapture?.(event.pointerId); }}
      onPointerUp={() => { dragging.current = false; }} onPointerCancel={() => { dragging.current = false; }}
      onLostPointerCapture={() => { dragging.current = false; }} />
    <span className="video-timeline-clock">{time}</span>
  </label>;
}
