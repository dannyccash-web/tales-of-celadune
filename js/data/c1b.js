// Scene C1B — SEA CAVE (2026-09-10, Danny) — a small cave reached from an
// entrance on C1 (Tidewrack Harbor) at x2243,y388 (the old "Tidepool Cove"
// landmark spot — replaced by this cave mouth). Home of Lily Farrow's lost
// gull: a feather trail scattered across C1 leads here, and the gull itself
// (a `sprite`-marked interactable, gull_overhead.png) waits inside for the
// player to bring back to her (see main.js's buildLilyDialog/lilyTurnIn).
//
// World coordinates 3000x3000, same scale as C1_Background.jpg (the cave
// entrance's overworld coordinates and this cave's own spawn/gull coordinates
// all share that scale). Collision auto-generated from C1B_Background.jpg the
// same way as D1B/D4B: per-25px-cell brightness (max RGB channel, 0-1) —
// true outside-the-cave void reads as 0.00, every part of the painted cave
// (including its dimmest rock/passage pixels) reads >=0.027 — so a single
// void-vs-cave threshold (0.02) cleanly separates them with no gap to tune.
// Flood-filled from `spawn` on a 1-cell-eroded copy of that mask (a crude
// proxy for the 36px/18px-radius collider needing real clearance from a
// wall, same idea as D1B's "collider-eroded grid") to confirm spawn, the
// gull's position, and the exit are all mutually reachable with genuine
// clearance — 2431 of 2752 raw-walkable cells survive the erosion as one
// single connected region, zero isolated pockets. Regenerate from the art
// the same way if it ever changes.
export default {
  id: 'C1B',
  name: 'Sea Cave',
  background: 'assets/images/C1B_Background.jpg',
  width: 3000,
  height: 3000,

  // Danny's exact spec: entering C1's cave mouth (x2243,y388) drops the
  // player here.
  spawn: { x: 1561, y: 2928 },

  // Which overworld scene this cave belongs to — the fallback return target
  // if the captured entry position is somehow missing (main.js's exitCave).
  returns: 'C1',

  // The usual cave music (Danny's spec) — audio.js's TRACKS.cave, cross-faded
  // in by enterCave/exitCave via sceneMusicTrack().
  music: 'cave',
  battleBackground: 'assets/images/cave_background.jpg',

  obstacles: [
    { x: 0, y: 0, w: 3000, h: 925 },
    { x: 0, y: 925, w: 1225, h: 25 },
    { x: 1325, y: 925, w: 1675, h: 25 },
    { x: 0, y: 950, w: 1200, h: 25 },
    { x: 1375, y: 950, w: 1625, h: 25 },
    { x: 0, y: 975, w: 1175, h: 25 },
    { x: 1425, y: 975, w: 1575, h: 25 },
    { x: 0, y: 1000, w: 1150, h: 25 },
    { x: 1450, y: 1000, w: 1550, h: 25 },
    { x: 0, y: 1025, w: 1125, h: 25 },
    { x: 1475, y: 1025, w: 1525, h: 25 },
    { x: 0, y: 1050, w: 1100, h: 25 },
    { x: 1500, y: 1050, w: 1500, h: 25 },
    { x: 0, y: 1075, w: 1025, h: 25 },
    { x: 1525, y: 1075, w: 150, h: 25 },
    { x: 1725, y: 1075, w: 1275, h: 25 },
    { x: 0, y: 1100, w: 1000, h: 25 },
    { x: 1575, y: 1100, w: 50, h: 25 },
    { x: 1775, y: 1100, w: 1225, h: 50 },
    { x: 0, y: 1125, w: 975, h: 150 },
    { x: 1800, y: 1150, w: 1200, h: 25 },
    { x: 1825, y: 1175, w: 1175, h: 25 },
    { x: 2025, y: 1200, w: 975, h: 25 },
    { x: 2075, y: 1225, w: 925, h: 50 },
    { x: 0, y: 1275, w: 950, h: 25 },
    { x: 2100, y: 1275, w: 900, h: 25 },
    { x: 0, y: 1300, w: 925, h: 25 },
    { x: 2125, y: 1300, w: 875, h: 25 },
    { x: 0, y: 1325, w: 900, h: 25 },
    { x: 2175, y: 1325, w: 825, h: 25 },
    { x: 0, y: 1350, w: 825, h: 25 },
    { x: 2200, y: 1350, w: 800, h: 100 },
    { x: 0, y: 1375, w: 800, h: 25 },
    { x: 0, y: 1400, w: 775, h: 200 },
    { x: 2225, y: 1450, w: 775, h: 50 },
    { x: 2250, y: 1500, w: 750, h: 25 },
    { x: 2275, y: 1525, w: 725, h: 25 },
    { x: 2300, y: 1550, w: 700, h: 25 },
    { x: 2325, y: 1575, w: 675, h: 25 },
    { x: 0, y: 1600, w: 750, h: 25 },
    { x: 2350, y: 1600, w: 650, h: 75 },
    { x: 0, y: 1625, w: 700, h: 50 },
    { x: 0, y: 1675, w: 675, h: 100 },
    { x: 2325, y: 1675, w: 675, h: 200 },
    { x: 0, y: 1775, w: 700, h: 25 },
    { x: 0, y: 1800, w: 725, h: 25 },
    { x: 0, y: 1825, w: 750, h: 50 },
    { x: 0, y: 1875, w: 775, h: 75 },
    { x: 2300, y: 1875, w: 700, h: 25 },
    { x: 2250, y: 1900, w: 750, h: 25 },
    { x: 2225, y: 1925, w: 775, h: 25 },
    { x: 0, y: 1950, w: 800, h: 25 },
    { x: 2200, y: 1950, w: 800, h: 25 },
    { x: 0, y: 1975, w: 925, h: 25 },
    { x: 2175, y: 1975, w: 825, h: 25 },
    { x: 0, y: 2000, w: 975, h: 50 },
    { x: 2150, y: 2000, w: 850, h: 50 },
    { x: 0, y: 2050, w: 1000, h: 50 },
    { x: 2125, y: 2050, w: 875, h: 25 },
    { x: 2100, y: 2075, w: 900, h: 25 },
    { x: 0, y: 2100, w: 1025, h: 25 },
    { x: 2075, y: 2100, w: 925, h: 25 },
    { x: 0, y: 2125, w: 1050, h: 50 },
    { x: 2025, y: 2125, w: 975, h: 25 },
    { x: 1700, y: 2150, w: 125, h: 25 },
    { x: 2000, y: 2150, w: 1000, h: 25 },
    { x: 0, y: 2175, w: 1075, h: 25 },
    { x: 1175, y: 2175, w: 75, h: 25 },
    { x: 1675, y: 2175, w: 200, h: 25 },
    { x: 1975, y: 2175, w: 1025, h: 25 },
    { x: 0, y: 2200, w: 1275, h: 25 },
    { x: 1675, y: 2200, w: 1325, h: 75 },
    { x: 0, y: 2225, w: 1325, h: 25 },
    { x: 0, y: 2250, w: 1350, h: 25 },
    { x: 0, y: 2275, w: 1375, h: 75 },
    { x: 1650, y: 2275, w: 1350, h: 50 },
    { x: 1625, y: 2325, w: 1375, h: 75 },
    { x: 0, y: 2350, w: 1350, h: 50 },
    { x: 0, y: 2400, w: 1325, h: 25 },
    { x: 1650, y: 2400, w: 1350, h: 75 },
    { x: 0, y: 2425, w: 1350, h: 50 },
    { x: 0, y: 2475, w: 1400, h: 25 },
    { x: 1675, y: 2475, w: 1325, h: 25 },
    { x: 0, y: 2500, w: 1425, h: 100 },
    { x: 1650, y: 2500, w: 1350, h: 75 },
    { x: 1675, y: 2575, w: 1325, h: 50 },
    { x: 0, y: 2600, w: 1400, h: 50 },
    { x: 1700, y: 2625, w: 1300, h: 25 },
    { x: 0, y: 2650, w: 1375, h: 100 },
    { x: 1675, y: 2650, w: 1325, h: 200 },
    { x: 0, y: 2750, w: 1400, h: 25 },
    { x: 0, y: 2775, w: 1425, h: 225 },
    { x: 1700, y: 2850, w: 1300, h: 150 },
  ],

  // Two-tier exit labeling, matching D1B/D4B's cave-exit convention: a wider
  // "Cave Exit" landmark label (buildings, r:220) plus a tighter "Leave the
  // Cave" action prompt right at the interactable itself (range:141).
  buildings: [
    { label: 'Cave Exit', x: 1561, y: 2900, r: 220 },
  ],

  interactables: [
    {
      id: 'cave_exit',
      x: 1561, y: 2960,
      range: 141,
      caveExit: true,
      label: 'Leave the Cave',
    },
    // Lily Farrow's lost gull (2026-09-10) — a visible ground sprite (unlike
    // most collectibles, which are invisible until the proximity label
    // appears) so the player can actually SEE her gull waiting in the dark
    // before walking up to it. world.js draws any interactable carrying a
    // `sprite` field the same way it draws chests. `catch: true` plays the
    // big fishing-style reveal on pickup (main.js's interact()), matching
    // the treatment other notable one-off finds (the cave ore, Marisol's
    // portrait) already get. The item itself (js/data/items.js's `lily_gull`)
    // is a quest item — can't be sold or dropped — and turning it in to Lily
    // (buildLilyDialog/applyResponseEffect's lilyTurnIn) completes her quest.
    {
      id: 'c1b_gull',
      x: 1938, y: 1711,
      sprite: 'assets/images/gull_overhead.png',
      label: 'Lily’s Gull',
      reward: { item: 'lily_gull', qty: 1, catch: true },
      message: 'Huddled in a dry corner of the cave, feathers ruffled but very much alive — Lily’s missing gull.',
    },
  ],

  fishingSpots: [],
  chests: [],
  battles: [],
  ambushes: [],
  exits: [],
  npcs: [],
};
