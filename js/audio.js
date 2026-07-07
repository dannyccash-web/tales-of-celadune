// Soundtrack manager. One track plays at a time; switching tracks cross-fades.
// Browsers block audio before the first user gesture — play() fails silently,
// and the caller can retry on a gesture (see main.js).

export const TRACKS = {
  theme: 'assets/audio/celadune_theme.mp3',
  overworld: 'assets/audio/celadune_overworld.mp3',
};

export const SFX = {
  door: 'assets/audio/dragon-studio-open-door-stock-sfx-454246.mp3',
};

// One-shot sound effect, independent of the soundtrack. No-op outside the
// browser so game logic stays testable headless in node.
export function sfx(src, volume = 0.9) {
  if (typeof Audio === 'undefined') return;
  const el = new Audio(src);
  el.volume = volume;
  el.play().catch(() => { /* pre-gesture; skip silently */ });
}

const DEFAULT_VOLUME = 0.8;
let current = null; // { el, src }

function fade(el, target, ms, onDone) {
  const start = el.volume;
  const t0 = performance.now();
  clearInterval(el._fade);
  el._fade = setInterval(() => {
    const k = Math.min((performance.now() - t0) / ms, 1);
    el.volume = start + (target - start) * k;
    if (k === 1) {
      clearInterval(el._fade);
      if (onDone) onDone();
    }
  }, 50);
}

// Fade in `src` (looped); fade out whatever was playing.
export function play(src, fadeMs = 1200) {
  if (current && current.src === src) return;

  const old = current;
  const el = new Audio(src);
  el.loop = true;
  el.volume = 0;
  current = { el, src };

  el.play().then(() => {
    fade(el, DEFAULT_VOLUME, fadeMs);
  }).catch(() => {
    // Autoplay blocked — forget this attempt so a retry on user gesture works
    if (current && current.el === el) current = old;
  });

  if (old) {
    fade(old.el, 0, fadeMs, () => old.el.pause());
  }
}

export function nowPlaying() {
  return current ? current.src : null;
}
