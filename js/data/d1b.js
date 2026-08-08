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
  width: 2400,
  height: 2400,

  // Where the player appears on entering (Danny's spec).
  spawn: { x: 1673, y: 205 },

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
    { x: 0, y: 0, w: 1650, h: 25 },
    { x: 2025, y: 0, w: 375, h: 875 },
    { x: 0, y: 25, w: 1625, h: 50 },
    { x: 2000, y: 50, w: 25, h: 825 },
    { x: 0, y: 75, w: 1600, h: 25 },
    { x: 1975, y: 75, w: 25, h: 800 },
    { x: 0, y: 100, w: 800, h: 25 },
    { x: 875, y: 100, w: 725, h: 25 },
    { x: 0, y: 125, w: 725, h: 75 },
    { x: 900, y: 125, w: 675, h: 25 },
    { x: 1925, y: 125, w: 50, h: 750 },
    { x: 1025, y: 150, w: 550, h: 25 },
    { x: 1900, y: 150, w: 25, h: 725 },
    { x: 1100, y: 175, w: 450, h: 75 },
    { x: 0, y: 200, w: 575, h: 25 },
    { x: 1875, y: 200, w: 25, h: 675 },
    { x: 0, y: 225, w: 500, h: 50 },
    { x: 1100, y: 250, w: 375, h: 25 },
    { x: 0, y: 275, w: 425, h: 25 },
    { x: 1150, y: 275, w: 325, h: 25 },
    { x: 0, y: 300, w: 400, h: 25 },
    { x: 1175, y: 300, w: 250, h: 25 },
    { x: 0, y: 325, w: 375, h: 100 },
    { x: 1850, y: 375, w: 25, h: 500 },
    { x: 0, y: 425, w: 350, h: 750 },
    { x: 1825, y: 425, w: 25, h: 450 },
    { x: 1800, y: 475, w: 25, h: 400 },
    { x: 1750, y: 500, w: 50, h: 275 },
    { x: 1700, y: 525, w: 50, h: 250 },
    { x: 350, y: 550, w: 25, h: 525 },
    { x: 1675, y: 550, w: 25, h: 300 },
    { x: 1650, y: 575, w: 25, h: 250 },
    { x: 1550, y: 600, w: 100, h: 225 },
    { x: 375, y: 625, w: 50, h: 400 },
    { x: 1450, y: 625, w: 100, h: 250 },
    { x: 425, y: 650, w: 75, h: 325 },
    { x: 1425, y: 650, w: 25, h: 225 },
    { x: 500, y: 675, w: 25, h: 225 },
    { x: 1400, y: 675, w: 25, h: 200 },
    { x: 525, y: 700, w: 50, h: 175 },
    { x: 575, y: 725, w: 25, h: 150 },
    { x: 600, y: 750, w: 50, h: 125 },
    { x: 1375, y: 750, w: 25, h: 125 },
    { x: 650, y: 775, w: 50, h: 75 },
    { x: 1775, y: 775, w: 25, h: 25 },
    { x: 1350, y: 800, w: 25, h: 75 },
    { x: 1550, y: 825, w: 25, h: 25 },
    { x: 650, y: 850, w: 25, h: 25 },
    { x: 2100, y: 875, w: 300, h: 25 },
    { x: 2125, y: 900, w: 275, h: 75 },
    { x: 425, y: 975, w: 50, h: 50 },
    { x: 2000, y: 975, w: 100, h: 25 },
    { x: 2175, y: 975, w: 225, h: 50 },
    { x: 2075, y: 1000, w: 25, h: 50 },
    { x: 375, y: 1025, w: 25, h: 25 },
    { x: 2200, y: 1025, w: 200, h: 50 },
    { x: 2225, y: 1075, w: 175, h: 1325 },
    { x: 0, y: 1175, w: 325, h: 50 },
    { x: 0, y: 1225, w: 275, h: 1175 },
    { x: 675, y: 1225, w: 25, h: 250 },
    { x: 775, y: 1225, w: 150, h: 225 },
    { x: 625, y: 1250, w: 50, h: 225 },
    { x: 700, y: 1250, w: 75, h: 200 },
    { x: 925, y: 1250, w: 25, h: 25 },
    { x: 2200, y: 1250, w: 25, h: 525 },
    { x: 600, y: 1275, w: 25, h: 200 },
    { x: 2175, y: 1275, w: 25, h: 475 },
    { x: 575, y: 1300, w: 25, h: 175 },
    { x: 2150, y: 1300, w: 25, h: 450 },
    { x: 275, y: 1325, w: 50, h: 100 },
    { x: 550, y: 1325, w: 25, h: 100 },
    { x: 2100, y: 1325, w: 50, h: 375 },
    { x: 2050, y: 1350, w: 50, h: 275 },
    { x: 525, y: 1375, w: 25, h: 25 },
    { x: 925, y: 1375, w: 25, h: 75 },
    { x: 2000, y: 1375, w: 50, h: 250 },
    { x: 1950, y: 1400, w: 50, h: 200 },
    { x: 1925, y: 1425, w: 25, h: 175 },
    { x: 700, y: 1450, w: 50, h: 25 },
    { x: 975, y: 1450, w: 25, h: 50 },
    { x: 1875, y: 1475, w: 50, h: 100 },
    { x: 275, y: 1500, w: 25, h: 175 },
    { x: 300, y: 1525, w: 25, h: 100 },
    { x: 1900, y: 1575, w: 25, h: 25 },
    { x: 2075, y: 1625, w: 25, h: 75 },
    { x: 2025, y: 1700, w: 25, h: 125 },
    { x: 2125, y: 1700, w: 25, h: 25 },
    { x: 275, y: 1775, w: 50, h: 25 },
    { x: 275, y: 1875, w: 25, h: 525 },
    { x: 375, y: 1875, w: 25, h: 25 },
    { x: 300, y: 1950, w: 75, h: 450 },
    { x: 2200, y: 2000, w: 25, h: 400 },
    { x: 375, y: 2075, w: 75, h: 325 },
    { x: 450, y: 2100, w: 25, h: 300 },
    { x: 2175, y: 2100, w: 25, h: 300 },
    { x: 475, y: 2125, w: 100, h: 275 },
    { x: 850, y: 2125, w: 25, h: 275 },
    { x: 950, y: 2125, w: 150, h: 275 },
    { x: 2125, y: 2125, w: 50, h: 275 },
    { x: 875, y: 2150, w: 75, h: 250 },
    { x: 1100, y: 2150, w: 25, h: 250 },
    { x: 2100, y: 2150, w: 25, h: 250 },
    { x: 575, y: 2175, w: 200, h: 225 },
    { x: 1125, y: 2175, w: 75, h: 225 },
    { x: 1950, y: 2175, w: 25, h: 25 },
    { x: 2075, y: 2175, w: 25, h: 225 },
    { x: 775, y: 2200, w: 75, h: 200 },
    { x: 1200, y: 2200, w: 25, h: 200 },
    { x: 1225, y: 2225, w: 100, h: 175 },
    { x: 1325, y: 2250, w: 100, h: 150 },
    { x: 1525, y: 2250, w: 25, h: 150 },
    { x: 2050, y: 2250, w: 25, h: 150 },
    { x: 1425, y: 2275, w: 100, h: 125 },
    { x: 1550, y: 2275, w: 25, h: 125 },
    { x: 2025, y: 2275, w: 25, h: 125 },
    { x: 1725, y: 2300, w: 25, h: 100 },
    { x: 1825, y: 2300, w: 25, h: 100 },
    { x: 2000, y: 2300, w: 25, h: 100 },
    { x: 1575, y: 2325, w: 50, h: 75 },
    { x: 1925, y: 2325, w: 75, h: 75 },
    { x: 1625, y: 2350, w: 100, h: 50 },
    { x: 1750, y: 2350, w: 75, h: 50 },
    { x: 1850, y: 2350, w: 75, h: 50 },
  ],

  buildings: [
    { label: 'Cave Exit', x: 1765, y: 75, r: 138 },
  ],

  // The way back out — interacting returns the player to the overworld spot
  // they entered from (main.js's exitCave, via the `caveExit` flag).
  interactables: [
    {
      id: 'cave_exit',
      x: 1765, y: 6,
      range: 113,
      caveExit: true,
      label: 'Leave the cave',
    },
    // Metallic ore (2026-08-03, Danny) — a "shiny object"-style pickup that
    // announces itself with the fishing CATCH reveal + sound (reward.catch).
    {
      id: 'd1b_ore',
      x: 418, y: 1284,
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
      x: 791, y: 444, speed: 32, chaseSpeed: 140, aggroRange: 500, startsHome: false,
      patrol: [ { x: 791, y: 444 }, { x: 879, y: 444 }, { x: 791, y: 531 } ],
    },
    {
      id: 'cave_cragclaw_1', name: 'Cragclaw', creature: true, enemyId: 'cragclaw',
      sprite: 'assets/images/cragclaw_overhead.png',
      portrait: 'assets/images/cragclaw.png',
      x: 788, y: 1705, speed: 34, chaseSpeed: 140, aggroRange: 500, startsHome: false,
      patrol: [ { x: 788, y: 1705 }, { x: 875, y: 1705 }, { x: 788, y: 1793 } ],
    },
    {
      id: 'cave_cragclaw_2', name: 'Cragclaw', creature: true, enemyId: 'cragclaw',
      sprite: 'assets/images/cragclaw_overhead.png',
      portrait: 'assets/images/cragclaw.png',
      x: 1530, y: 1124, speed: 34, chaseSpeed: 140, aggroRange: 500, startsHome: false,
      patrol: [ { x: 1530, y: 1124 }, { x: 1618, y: 1124 }, { x: 1530, y: 1211 } ],
    },
    {
      id: 'cave_cragclaw_queen', name: 'Cragclaw Queen', creature: true, enemyId: 'cragclaw_queen',
      sprite: 'assets/images/queen_cragclaw_overhead.png',
      portrait: 'assets/images/queen_cragclaw.png',
      x: 1670, y: 1916, speed: 30, chaseSpeed: 130, aggroRange: 500, startsHome: false,
      patrol: [ { x: 1670, y: 1916 }, { x: 1758, y: 1916 }, { x: 1670, y: 2004 } ],
    },
  ],
  battles: [],

  // Calder's stashed gold — the chest the cave dwellers guard. Unlocked (the
  // fight is the lock). 20-30 gold + a vitality potion.
  chests: [
    {
      id: 'd1b_treasure',
      x: 1894, y: 2084,
      locked: false,
      gold: { min: 20, max: 30 },
      items: [ { id: 'vitality_potion', qty: 1 } ],
    },
  ],

  exits: [],
};
