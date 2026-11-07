import React, { Children, isValidElement, useEffect, useRef } from 'react';
import './section-entrances.css';

export function EntranceHeading({ children }) {
  const lines = [[]];
  for (const child of Children.toArray(children)) {
    if (isValidElement(child) && child.type === 'br') lines.push([]);
    else lines[lines.length - 1].push(child);
  }
  return <h2 className="entrance-heading">{lines.map((line, index) =>
    <span className="entrance-line-mask" key={index}><span className="entrance-line">{line}</span></span>
  )}</h2>;
}

// Observe individual cards and text groups, never a whole variable-height gallery.
const unitSelector = [
  '.section-label', '.entrance-heading', '.awan-identity',
  '.career-bio', '.career-facts', '.career-counts', '.career-fields', '.career-history-heading', '.career-stop',
  '.nalou-rail-header', '.nalou-rail-card', '.nalou-rail-footer', '.work-toolbar', '.project-card', '.work-bottom',
  '.expertise-intro > p', '.capability-card', '.contact-eyebrow', '.contact-actions', '.contact-secondary', '.footer',
].join(',');

const rise = [{ opacity: .18, translate: '0 14px' }, { opacity: 1, translate: '0 0' }];
const revealMedia = [{ opacity: .38, clipPath: 'inset(0 0 36% 0)' }, { opacity: 1, clipPath: 'inset(0)' }];
const revealType = [{ transform: 'translateY(105%)' }, { transform: 'translateY(0)' }];
const easing = 'cubic-bezier(.16,.75,.22,1)';

export function useSectionEntrances(suspended = false) {
  const gate = useRef({ suspended, update: null });
  useEffect(() => {
    gate.current.suspended = suspended;
    gate.current.update?.();
  }, [suspended]);
  useEffect(() => {
    const scope = document.querySelector('main > .below-hero');
    // All content is visible in its final position without any observer or animation.
    if (!scope || !window.IntersectionObserver || !window.MutationObserver || !window.Element.prototype.animate) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const seen = new WeakSet();
    const playing = new Map();
    const waiting = new Set();

    function stop(unit) {
      const animations = playing.get(unit);
      if (animations) {
        playing.delete(unit);
        for (const animation of animations) animation.cancel();
      }
    }

    function start(unit, node, frames, duration, delay = 0) {
      if (!node) return;
      const animation = node.animate(frames, { duration, delay, easing, fill: 'backwards' });
      let group = playing.get(unit);
      if (!group) { group = new Set(); playing.set(unit, group); }
      group.add(animation);
      const remove = () => {
        group.delete(animation);
        if (!group.size && playing.get(unit) === group) playing.delete(unit);
      };
      animation.addEventListener('finish', remove, { once: true });
      animation.addEventListener('cancel', remove, { once: true });
    }

    function enter(unit, stagger) {
      if (unit.matches('.section-label')) {
        start(unit, unit.querySelector('.entrance-language-en'),
          [{ transform: 'translate(-.12em,105%) skewY(2deg)' }, { transform: 'translate(0,0) skewY(0deg)' }], 840);
        start(unit, unit.querySelector('.section-index'), rise, 430, 55);
        start(unit, unit.querySelector('.entrance-language-zh'), rise, 550, 115);
        start(unit, unit.querySelector('.label-rule'), [{ scale: '0 1' }, { scale: '1 1' }], 690, 110);
      } else if (unit.matches('.entrance-heading')) {
        unit.querySelectorAll('.entrance-line').forEach((line, i) => start(unit, line, revealType, 810, 70 + i * 80));
      } else if (unit.matches('.project-card')) {
        start(unit, unit.querySelector('.project-art'), revealMedia, 710, 75 + stagger);
        start(unit, unit.querySelector('.project-meta'), rise, 600, 140 + stagger);
      } else if (unit.matches('.nalou-rail-card')) {
        start(unit, unit.querySelector('.nalou-rail-picture'), revealMedia, 650, 45 + stagger);
        start(unit, unit.querySelector('.nalou-rail-title'), rise, 510, 90 + stagger);
      } else if (unit.matches('.capability-card')) {
        start(unit, unit, revealMedia, 650, 65 + stagger);
      } else if (unit.matches('.awan-identity')) {
        // Preserve the card's pointer geometry, orbit depth and outer shadow.
        start(unit, unit, [{ opacity: .28 }, { opacity: 1 }], 730, 135);
      } else {
        start(unit, unit, rise, 585, 65 + stagger);
      }
    }

    const isAnchorHeading = unit => unit.matches('.section-label, .entrance-heading') &&
      '#' + unit.closest('section[id]')?.id === window.location.hash;

    const observer = new window.IntersectionObserver(entries => {
      const siblings = new Map();
      for (const entry of entries) {
        const unit = entry.target;
        if (!entry.isIntersecting || !scope.contains(unit)) { waiting.delete(unit); continue; }
        if (gate.current.suspended || document.hidden) { waiting.add(unit); continue; }
        waiting.delete(unit);
        observer.unobserve(unit);
        if (seen.has(unit)) continue;
        seen.add(unit);
        if (reduced.matches || unit.contains(document.activeElement) || isAnchorHeading(unit)) continue;
        const parent = unit.parentElement;
        const count = siblings.get(parent) || 0;
        siblings.set(parent, count + 1);
        enter(unit, Math.min(count, 2) * 75);
      }
    }, { threshold: 0 });

    function visitUnits(node, visit) {
      if (node.nodeType !== 1) return;
      if (node.matches(unitSelector)) visit(node);
      node.querySelectorAll(unitSelector).forEach(visit);
    }
    const observe = unit => { if (!seen.has(unit)) observer.observe(unit); };
    visitUnits(scope, observe);
    const changes = new window.MutationObserver(records => {
      for (const { removedNodes, addedNodes } of records) {
        for (const node of removedNodes) {
          if (!scope.contains(node)) visitUnits(node, unit => { observer.unobserve(unit); waiting.delete(unit); stop(unit); });
        }
        for (const node of addedNodes) if (scope.contains(node)) visitUnits(node, observe);
      }
    });
    changes.observe(scope, { childList: true, subtree: true });

    function focus(event) {
      for (let unit = event.target; unit && unit !== scope; unit = unit.parentElement) {
        if (unit.matches(unitSelector)) { seen.add(unit); waiting.delete(unit); observer.unobserve(unit); stop(unit); }
      }
    }
    function anchor() { for (const unit of playing.keys()) if (isAnchorHeading(unit)) stop(unit); }
    function stopAll() { for (const unit of playing.keys()) stop(unit); }
    function updateVisibility() {
      if (document.hidden || gate.current.suspended) { stopAll(); return; }
      // Re-observing only queued units asks the browser for their current intersection.
      // It avoids layout reads and preserves entrances that occurred behind a dialog.
      for (const unit of waiting) {
        if (scope.contains(unit) && !seen.has(unit)) { observer.unobserve(unit); observer.observe(unit); }
      }
      waiting.clear();
    }
    gate.current.update = updateVisibility;
    scope.addEventListener('focusin', focus);
    document.addEventListener('visibilitychange', updateVisibility);
    window.addEventListener('hashchange', anchor);
    window.addEventListener('beforeprint', stopAll);
    reduced.addEventListener?.('change', stopAll);
    return () => {
      observer.disconnect();
      changes.disconnect();
      waiting.clear();
      gate.current.update = null;
      scope.removeEventListener('focusin', focus);
      document.removeEventListener('visibilitychange', updateVisibility);
      window.removeEventListener('hashchange', anchor);
      window.removeEventListener('beforeprint', stopAll);
      reduced.removeEventListener?.('change', stopAll);
      stopAll();
    };
  }, []);
}
