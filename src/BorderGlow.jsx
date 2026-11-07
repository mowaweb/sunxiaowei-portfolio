import React from 'react';

// The identity card supplies the pointer angle and proximity from its parallax pass.
export default function BorderGlow() {
  return (
    <span className="awan-border-glow" aria-hidden="true">
      <span className="awan-border-halo" />
      <span className="awan-border-rim" />
    </span>
  );
}
