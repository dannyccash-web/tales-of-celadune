// Soundtrack manager. One track plays at a time; switching tracks cross-fades.
// Browsers block audio before the first user gesture — play() fails silently,
// and the caller can retry on a gesture (see main.js).

export const TRACKS = {
  theme: 'assets/audio/celadune_theme.mp3',
  overworld: 'assets/audio/celadune_overworld.mp3',
};

export const SFX = {
  door: 'assets/audio/dragon-studio-open-door-stock-sfx-454246.mp3',
  footsteps: 'assets/audio/universfield-footsteps-walking-278819.mp3',
  // Gold change, health decrease, item given/received — each fires from one
  // centralized place in main.js (addGold/damagePlayer/addItem/removeItem)
  // rather than at every individual call site, so any future gold/health/
  // item source gets the sound for free.
  gold: 'assets/audio/alexzavesa-clinking-coins-7-468427.mp3',
  hurt: 'assets/audio/freesound_community-male_hurt7-48124.mp3',
  item: 'assets/audio/freesound_community-open-bag-sound-39216.mp3',
};

// One "voice" clip per NPC, played once when their dialogue window opens —
// a quick audio flourish to help define the character. Keyed by npc.id.
export const DIALOGUE_SFX = {
  tuckwell: 'assets/audio/u_9kvcihzjc7-squashwo-gua-plants-vs-zombies-hmm-383643.mp3',
  brenna: 'assets/audio/u_xg7ssi08yr-female-ah-ha-389835.mp3',
  mirelle: 'assets/audio/freesound_community-long-sigh-104609.mp3',
  gaffer: 'assets/audio/dragon-studio-goat-sound-effect-390305.mp3',
};

// ---- Volume controls (wired to the Menu > Audio sliders) ----
// musicVolume/sfxVolume are 0..1 master levels. Individual sfx() calls pass
// a relative "weight" (their old hardcoded volume) that gets scaled by
// sfxVolume, so the slider affects everything without touching call sites.
const DEFAULT_VOLUME = 0.75; // music default, matches the slider's initial 75%
let musicVolume = DEFAULT_VOLUME;
let sfxVolume = 1.0; // matches the slider's initial 100%
const STEPS_WEIGHT = 0.55;

export function getMusicVolume() { return musicVolume; }
export function getSfxVolume() { return sfxVolume; }

export function setMusicVolume(v) {
  musicVolume = Math.max(0, Math.min(1, v));
  if (current) current.el.volume = musicVolume;
}

export function setSfxVolume(v) {
  sfxVolume = Math.max(0, Math.min(1, v));
  if (steps) steps.volume = STEPS_WEIGHT * sfxVolume;
}

// Looped footsteps while the player is walking. Call every frame with the
// current walking state; starts/stops the loop on transitions only.
let steps = null;
export function setWalking(active) {
  if (typeof Audio === 'undefined') return;
  if (active) {
    if (!steps) {
      steps = new Audio(SFX.footsteps);
      steps.loop = true;
    }
    steps.volume = STEPS_WEIGHT * sfxVolume;
    if (steps.paused) steps.play().catch(() => {});
  } else if (steps && !steps.paused) {
    steps.pause();
    steps.currentTime = 0;
  }
}

// One-shot sound effect, independent of the soundtrack. No-op outside the
// browser so game logic stays testable headless in node. `weight` is the
// sound's relative volume (0-1); actual output is weight * sfxVolume.
export function sfx(src, weight = 0.9) {
  if (typeof Audio === 'undefined') return;
  const el = new Audio(src);
  el.volume = weight * sfxVolume;
  el.play().catch(() => { /* pre-gesture; skip silently */ });
}

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
    // A newer play() call can supersede this one while the promise was
    // still pending — e.g. the same keydown both unblocks autoplay for the
    // theme (via the retry-on-gesture listener) AND starts the game, which
    // immediately calls play(overworld). Without this guard, the theme's
    // delayed fade-in would win the race against the overworld transition's
    // fade-out, canceling it and leaving both tracks playing at once. Only
    // fade in if we're still the current track.
    if (current && current.el === el) fade(el, musicVolume, fadeMs);
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
