// Scene D1B — CAVE (the first cave/dungeon interior, 2026-07-26)
// A sub-scene reached by interacting with a cave entrance on the overworld
// (D1), not by walking off an edge. Entering swaps the whole view to the cave
// background and drops the player at `spawn`; an `caveExit` interactable near
// the spawn takes them back to the EXACT spot on the overworld where they
// entered (main.js's enterCave/exitCave capture + restore that position).
//
// World coordinates 1920x1920. The cave is one connected blob of warm lit
// floor surrounded by near-black rock/void + a dark central pool. Collision
// auto-generated 2026-07-26 from the art: block the dark (per-20px-cell
// brightness sum < 42 — void ~5, pool ~26; floor 50-220 walkable), flood from
// the spawn on a collider-eroded grid, with the dim spawn<->exit passage
// carved explicitly (it's darker than the main chambers). Verified headless
// with the real engine collider: spawn + exit + every chamber reachable.
// Regenerate from the art rather than hand-editing these rects.

export default {
  id: 'D1B',
  name: 'Cave',
  background: 'assets/images/D1B_Background.jpg',
  width: 3000,
  height: 3000,

  // Where the player appears on entering (Danny's spec).
  spawn: { x: 2091, y: 256 },

  // Which overworld scene this cave belongs to — the fallback return target if
  // the captured entry position is somehow missing (e.g. a save edited by hand).
  returns: 'D1',

  // Cave ambience (2026-07-26): `music: 'cave'` plays celadune_cave.mp3 while
  // here; `battleBackground` overrides each enemy's own backdrop so fights in
  // the cave use the cave backdrop (not, e.g., the cragclaw's beach one).
  // `dark: true` means the cave is pitch-dark unless the player has a torch
  // equipped (main.js's #cave-dark overlay + player glow).
  music: 'cave',
  battleBackground: 'assets/images/cave_background.jpg',
  dark: true,

  obstacles: [
    { x: 0, y: 0, w: 2063, h: 31 },
    { x: 2531, y: 0, w: 469, h: 1094 },
    { x: 0, y: 31, w: 2031, h: 63 },
    { x: 2500, y: 63, w: 31, h: 1031 },
    { x: 0, y: 94, w: 2000, h: 31 },
    { x: 2469, y: 94, w: 31, h: 1000 },
    { x: 0, y: 125, w: 1000, h: 31 },
    { x: 1094, y: 125, w: 906, h: 31 },
    { x: 0, y: 156, w: 906, h: 94 },
    { x: 1125, y: 156, w: 844, h: 31 },
    { x: 2406, y: 156, w: 63, h: 938 },
    { x: 1281, y: 188, w: 688, h: 31 },
    { x: 2375, y: 188, w: 31, h: 906 },
    { x: 1375, y: 219, w: 563, h: 94 },
    { x: 0, y: 250, w: 719, h: 31 },
    { x: 2344, y: 250, w: 31, h: 844 },
    { x: 0, y: 281, w: 625, h: 63 },
    { x: 1375, y: 313, w: 469, h: 31 },
    { x: 0, y: 344, w: 531, h: 31 },
    { x: 1438, y: 344, w: 406, h: 31 },
    { x: 0, y: 375, w: 500, h: 31 },
    { x: 1469, y: 375, w: 313, h: 31 },
    { x: 0, y: 406, w: 469, h: 125 },
    { x: 2313, y: 469, w: 31, h: 625 },
    { x: 0, y: 531, w: 438, h: 938 },
    { x: 2281, y: 531, w: 31, h: 563 },
    { x: 2250, y: 594, w: 31, h: 500 },
    { x: 2188, y: 625, w: 63, h: 344 },
    { x: 2125, y: 656, w: 63, h: 313 },
    { x: 438, y: 688, w: 31, h: 656 },
    { x: 2094, y: 688, w: 31, h: 375 },
    { x: 2063, y: 719, w: 31, h: 313 },
    { x: 1938, y: 750, w: 125, h: 281 },
    { x: 469, y: 781, w: 63, h: 500 },
    { x: 1813, y: 781, w: 125, h: 313 },
    { x: 531, y: 813, w: 94, h: 406 },
    { x: 1781, y: 813, w: 31, h: 281 },
    { x: 625, y: 844, w: 31, h: 281 },
    { x: 1750, y: 844, w: 31, h: 250 },
    { x: 656, y: 875, w: 63, h: 219 },
    { x: 719, y: 906, w: 31, h: 188 },
    { x: 750, y: 938, w: 63, h: 156 },
    { x: 1719, y: 938, w: 31, h: 156 },
    { x: 813, y: 969, w: 63, h: 94 },
    { x: 2219, y: 969, w: 31, h: 31 },
    { x: 1688, y: 1000, w: 31, h: 94 },
    { x: 1938, y: 1031, w: 31, h: 31 },
    { x: 813, y: 1063, w: 31, h: 31 },
    { x: 2625, y: 1094, w: 375, h: 31 },
    { x: 2656, y: 1125, w: 344, h: 94 },
    { x: 531, y: 1219, w: 63, h: 63 },
    { x: 2500, y: 1219, w: 125, h: 31 },
    { x: 2719, y: 1219, w: 281, h: 63 },
    { x: 2594, y: 1250, w: 31, h: 63 },
    { x: 469, y: 1281, w: 31, h: 31 },
    { x: 2750, y: 1281, w: 250, h: 63 },
    { x: 2781, y: 1344, w: 219, h: 1656 },
    { x: 0, y: 1469, w: 406, h: 63 },
    { x: 0, y: 1531, w: 344, h: 1469 },
    { x: 844, y: 1531, w: 31, h: 313 },
    { x: 969, y: 1531, w: 188, h: 281 },
    { x: 781, y: 1563, w: 63, h: 281 },
    { x: 875, y: 1563, w: 94, h: 250 },
    { x: 1156, y: 1563, w: 31, h: 31 },
    { x: 2750, y: 1563, w: 31, h: 656 },
    { x: 750, y: 1594, w: 31, h: 250 },
    { x: 2719, y: 1594, w: 31, h: 594 },
    { x: 719, y: 1625, w: 31, h: 219 },
    { x: 2688, y: 1625, w: 31, h: 563 },
    { x: 344, y: 1656, w: 63, h: 125 },
    { x: 688, y: 1656, w: 31, h: 125 },
    { x: 2625, y: 1656, w: 63, h: 469 },
    { x: 2563, y: 1688, w: 63, h: 344 },
    { x: 656, y: 1719, w: 31, h: 31 },
    { x: 1156, y: 1719, w: 31, h: 94 },
    { x: 2500, y: 1719, w: 63, h: 313 },
    { x: 2438, y: 1750, w: 63, h: 250 },
    { x: 2406, y: 1781, w: 31, h: 219 },
    { x: 875, y: 1813, w: 63, h: 31 },
    { x: 1219, y: 1813, w: 31, h: 63 },
    { x: 2344, y: 1844, w: 63, h: 125 },
    { x: 344, y: 1875, w: 31, h: 219 },
    { x: 375, y: 1906, w: 31, h: 125 },
    { x: 2375, y: 1969, w: 31, h: 31 },
    { x: 2594, y: 2031, w: 31, h: 94 },
    { x: 2531, y: 2125, w: 31, h: 156 },
    { x: 2656, y: 2125, w: 31, h: 31 },
    { x: 344, y: 2219, w: 63, h: 31 },
    { x: 344, y: 2344, w: 31, h: 656 },
    { x: 469, y: 2344, w: 31, h: 31 },
    { x: 375, y: 2438, w: 94, h: 563 },
    { x: 2750, y: 2500, w: 31, h: 500 },
    { x: 469, y: 2594, w: 94, h: 406 },
    { x: 563, y: 2625, w: 31, h: 375 },
    { x: 2719, y: 2625, w: 31, h: 375 },
    { x: 594, y: 2656, w: 125, h: 344 },
    { x: 1063, y: 2656, w: 31, h: 344 },
    { x: 1188, y: 2656, w: 188, h: 344 },
    { x: 2656, y: 2656, w: 63, h: 344 },
    { x: 1094, y: 2688, w: 94, h: 313 },
    { x: 1375, y: 2688, w: 31, h: 313 },
    { x: 2625, y: 2688, w: 31, h: 313 },
    { x: 719, y: 2719, w: 250, h: 281 },
    { x: 1406, y: 2719, w: 94, h: 281 },
    { x: 2438, y: 2719, w: 31, h: 31 },
    { x: 2594, y: 2719, w: 31, h: 281 },
    { x: 969, y: 2750, w: 94, h: 250 },
    { x: 1500, y: 2750, w: 31, h: 250 },
    { x: 1531, y: 2781, w: 125, h: 219 },
    { x: 1656, y: 2813, w: 125, h: 188 },
    { x: 1906, y: 2813, w: 31, h: 188 },
    { x: 2563, y: 2813, w: 31, h: 188 },
    { x: 1781, y: 2844, w: 125, h: 156 },
    { x: 1938, y: 2844, w: 31, h: 156 },
    { x: 2531, y: 2844, w: 31, h: 156 },
    { x: 2156, y: 2875, w: 31, h: 125 },
    { x: 2281, y: 2875, w: 31, h: 125 },
    { x: 2500, y: 2875, w: 31, h: 125 },
    { x: 1969, y: 2906, w: 63, h: 94 },
    { x: 2406, y: 2906, w: 94, h: 94 },
    { x: 2031, y: 2938, w: 125, h: 63 },
    { x: 2188, y: 2938, w: 94, h: 63 },
    { x: 2313, y: 2938, w: 94, h: 63 },
  ],

  buildings: [
    { label: 'Cave Exit', x: 2206, y: 94, r: 173 },
  ],

  // The way back out — interacting returns the player to the overworld spot
  // they entered from (main.js's exitCave, via the `caveExit` flag).
  interactables: [
    {
      id: 'cave_exit',
      x: 2206, y: 8,
      range: 141,
      caveExit: true,
      label: 'Leave the cave',
    },
    // Metallic ore (2026-08-03, Danny) — a "shiny object"-style pickup that
    // announces itself with the fishing CATCH reveal + sound (reward.catch).
    {
      id: 'd1b_ore',
      x: 523, y: 1605,
      label: 'Metallic ore',
      reward: { item: 'metallic_ore', qty: 1, catch: true },
      message: 'You pried a chunk of metallic ore loose from the rock.',
    },
  ],

  // Cave dwellers (2026-07-26) — all roaming `creature` AI (mill via patrol,
  // charge + fight on proximity, same as D1's cragclaws). They guard Calder's
  // stashed gold (the chest below). The Mireman here is a visible chasing
  // creature (its own overhead sprite), not the unseen ambush D1 uses.
  npcs: [
    {
      id: 'cave_mireman', name: 'Mireman', creature: true, enemyId: 'mireman',
      sprite: 'assets/images/mireman_overhead.png',
      portrait: 'assets/images/mireman.png',
      x: 989, y: 555, speed: 32, chaseSpeed: 140, aggroRange: 625, startsHome: false,
      patrol: [ { x: 989, y: 555 }, { x: 1099, y: 555 }, { x: 989, y: 664 } ],
    },
    {
      id: 'cave_cragclaw_1', name: 'Cragclaw', creature: true, enemyId: 'cragclaw',
      sprite: 'assets/images/cragclaw_overhead.png',
      portrait: 'assets/images/cragclaw.png',
      x: 985, y: 2131, speed: 34, chaseSpeed: 140, aggroRange: 625, startsHome: false,
      patrol: [ { x: 985, y: 2131 }, { x: 1094, y: 2131 }, { x: 985, y: 2241 } ],
    },
    {
      id: 'cave_cragclaw_2', name: 'Cragclaw', creature: true, enemyId: 'cragclaw',
      sprite: 'assets/images/cragclaw_overhead.png',
      portrait: 'assets/images/cragclaw.png',
      x: 1913, y: 1405, speed: 34, chaseSpeed: 140, aggroRange: 625, startsHome: false,
      patrol: [ { x: 1913, y: 1405 }, { x: 2023, y: 1405 }, { x: 1913, y: 1514 } ],
    },
    {
      id: 'cave_cragclaw_queen', name: 'Cragclaw Queen', creature: true, enemyId: 'cragclaw_queen',
      sprite: 'assets/images/queen_cragclaw_overhead.png',
      portrait: 'assets/images/queen_cragclaw.png',
      x: 2088, y: 2395, speed: 30, chaseSpeed: 130, aggroRange: 625, startsHome: false,
      patrol: [ { x: 2088, y: 2395 }, { x: 2198, y: 2395 }, { x: 2088, y: 2505 } ],
    },
  ],
  battles: [],

  // Calder's stashed gold — the chest the cave dwellers guard. Unlocked (the
  // fight is the lock). 20-30 gold + a vitality potion.
  chests: [
    {
      id: 'd1b_treasure',
      x: 2368, y: 2605,
      locked: false,
      gold: { min: 20, max: 30 },
      items: [ { id: 'vitality_potion', qty: 1 } ],
    },
  ],

  exits: [],
};
