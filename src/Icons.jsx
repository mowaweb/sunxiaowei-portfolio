import React from 'react';

export function Arrow({ direction = 'up', ...props }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props} style={{ transform: direction === 'down' ? 'rotate(90deg)' : direction === 'right' ? 'rotate(45deg)' : undefined, ...props.style }}><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function PlayIcon() {
  return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m7 4 9 6-9 6V4Z" fill="currentColor" /></svg>;
}

