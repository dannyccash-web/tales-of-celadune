// Scene D4B — WOODS CAVE (the second cave/dungeon interior, 2026-07-31)
// The cave mouth in the NW of the D4 Woods opens into this sub-scene. Reached
// by interacting with the `cave: 'D4B'` entrance on D4 (NOT by walking off an
// edge); entering swaps the whole view to the cave background and drops the
// player at `spawn`. A `caveExit` interactable near the spawn takes them back
// to the EXACT spot on D4 where they entered (main.js's enterCave/exitCave
// capture + restore that position).
//
// World coordinates 1920x1920. A branching cavern of warm-lit floor lobes
// linked by winding passages, surrounded by near-black rock/void.
//
// Collision regenerated 2026-07-31 from Danny's hand-painted walkable guide
// (assets/images/D4B_Background_Walkable.jpg — red = walkable), same pipeline as
// D1/D2/D4: per-20px-cell red sample, then a 2-CELL shoulder dilation (the cave's
// winding passages are narrow — a 1-cell dilation left pinch points the 36px
// collider couldn't fit through, so this one needs 2). Obstacles are the
// complement. Verified headless with the real engine collider (World.canMove,
// 36px box): one connected floor, the (bottom-right) spawn + exit + all four
// ambush junctions + every corner reachable (~13.2k nodes). Regenerate from the
// walkable guide rather than hand-editing these rects.

export default {
  id: 'D4B',
  name: 'Cave',
  background: 'assets/images/D4B_Background.jpg',
  width: 2400,
  height: 2400,

  // Where the player appears on entering — the bottom-right entrance mouth
  // (Danny, 2026-07-31). enterCave normally drops them here; a direct boot uses
  // it too. (A second entrance in the upper-left will be wired up later.)
  spawn: { x: 2214, y: 2328 },

  // Which overworld scene this cave belongs to — the fallback return target if
  // the captured entry position is somehow missing (e.g. a hand-edited save).
  returns: 'D4',

  // Cave ambience (mirrors D1B): `music: 'cave'` plays celadune_cave.mp3 while
  // here; `battleBackground` forces the cave backdrop for any fight started in
  // here; `dark: true` makes it pitch-dark unless a torch is equipped in the
  // off-hand (main.js's #cave-dark overlay + traveling player glow).
  music: 'cave',
  battleBackground: 'assets/images/cave_background.jpg',
  dark: true,

  obstacles: [
    { x: 200, y: 0, w: 2200, h: 25 },
    { x: 250, y: 25, w: 2150, h: 25 },
    { x: 0, y: 50, w: 25, h: 25 },
    { x: 275, y: 50, w: 2125, h: 25 },
    { x: 0, y: 75, w: 50, h: 25 },
    { x: 300, y: 75, w: 1625, h: 25 },
    { x: 2000, y: 75, w: 400, h: 25 },
    { x: 0, y: 100, w: 75, h: 75 },
    { x: 325, y: 100, w: 1575, h: 25 },
    { x: 2025, y: 100, w: 375, h: 25 },
    { x: 325, y: 125, w: 50, h: 25 },
    { x: 475, y: 125, w: 1400, h: 25 },
    { x: 2050, y: 125, w: 350, h: 25 },
    { x: 500, y: 150, w: 1350, h: 25 },
    { x: 2075, y: 150, w: 325, h: 50 },
    { x: 0, y: 175, w: 100, h: 25 },
    { x: 525, y: 175, w: 1300, h: 25 },
    { x: 0, y: 200, w: 125, h: 25 },
    { x: 625, y: 200, w: 1200, h: 25 },
    { x: 2075, y: 200, w: 175, h: 25 },
    { x: 2275, y: 200, w: 125, h: 25 },
    { x: 0, y: 225, w: 150, h: 25 },
    { x: 675, y: 225, w: 1125, h: 25 },
    { x: 2075, y: 225, w: 150, h: 25 },
    { x: 2300, y: 225, w: 100, h: 25 },
    { x: 0, y: 250, w: 175, h: 25 },
    { x: 725, y: 250, w: 1100, h: 25 },
    { x: 2075, y: 250, w: 125, h: 25 },
    { x: 2325, y: 250, w: 75, h: 25 },
    { x: 0, y: 275, w: 200, h: 25 },
    { x: 750, y: 275, w: 1075, h: 25 },
    { x: 2050, y: 275, w: 125, h: 25 },
    { x: 2350, y: 275, w: 50, h: 225 },
    { x: 0, y: 300, w: 300, h: 25 },
    { x: 775, y: 300, w: 350, h: 25 },
    { x: 1200, y: 300, w: 625, h: 25 },
    { x: 2050, y: 300, w: 25, h: 25 },
    { x: 0, y: 325, w: 350, h: 25 },
    { x: 925, y: 325, w: 175, h: 25 },
    { x: 1225, y: 325, w: 600, h: 25 },
    { x: 0, y: 350, w: 375, h: 25 },
    { x: 1250, y: 350, w: 575, h: 25 },
    { x: 0, y: 375, w: 425, h: 25 },
    { x: 1375, y: 375, w: 450, h: 25 },
    { x: 0, y: 400, w: 475, h: 100 },
    { x: 1450, y: 400, w: 375, h: 25 },
    { x: 1475, y: 425, w: 325, h: 25 },
    { x: 1500, y: 450, w: 250, h: 25 },
    { x: 0, y: 500, w: 425, h: 25 },
    { x: 800, y: 500, w: 125, h: 25 },
    { x: 1125, y: 500, w: 75, h: 25 },
    { x: 2325, y: 500, w: 75, h: 25 },
    { x: 0, y: 525, w: 350, h: 25 },
    { x: 800, y: 525, w: 475, h: 25 },
    { x: 2300, y: 525, w: 100, h: 25 },
    { x: 0, y: 550, w: 325, h: 25 },
    { x: 800, y: 550, w: 575, h: 25 },
    { x: 2250, y: 550, w: 150, h: 25 },
    { x: 0, y: 575, w: 300, h: 25 },
    { x: 800, y: 575, w: 600, h: 50 },
    { x: 1850, y: 575, w: 75, h: 25 },
    { x: 2200, y: 575, w: 200, h: 50 },
    { x: 0, y: 600, w: 275, h: 25 },
    { x: 1800, y: 600, w: 175, h: 25 },
    { x: 0, y: 625, w: 250, h: 25 },
    { x: 550, y: 625, w: 75, h: 25 },
    { x: 800, y: 625, w: 625, h: 50 },
    { x: 1750, y: 625, w: 225, h: 25 },
    { x: 2175, y: 625, w: 225, h: 25 },
    { x: 0, y: 650, w: 225, h: 75 },
    { x: 525, y: 650, w: 125, h: 75 },
    { x: 1750, y: 650, w: 250, h: 25 },
    { x: 2150, y: 650, w: 250, h: 25 },
    { x: 825, y: 675, w: 600, h: 25 },
    { x: 1750, y: 675, w: 275, h: 25 },
    { x: 2100, y: 675, w: 300, h: 25 },
    { x: 825, y: 700, w: 625, h: 25 },
    { x: 1750, y: 700, w: 650, h: 75 },
    { x: 0, y: 725, w: 250, h: 25 },
    { x: 500, y: 725, w: 150, h: 25 },
    { x: 825, y: 725, w: 600, h: 25 },
    { x: 0, y: 750, w: 275, h: 25 },
    { x: 475, y: 750, w: 200, h: 25 },
    { x: 850, y: 750, w: 250, h: 25 },
    { x: 1250, y: 750, w: 175, h: 25 },
    { x: 0, y: 775, w: 325, h: 25 },
    { x: 450, y: 775, w: 225, h: 25 },
    { x: 850, y: 775, w: 225, h: 25 },
    { x: 1275, y: 775, w: 50, h: 25 },
    { x: 1775, y: 775, w: 625, h: 75 },
    { x: 0, y: 800, w: 675, h: 25 },
    { x: 875, y: 800, w: 175, h: 25 },
    { x: 0, y: 825, w: 650, h: 25 },
    { x: 0, y: 850, w: 600, h: 25 },
    { x: 1800, y: 850, w: 600, h: 25 },
    { x: 0, y: 875, w: 525, h: 25 },
    { x: 1825, y: 875, w: 575, h: 25 },
    { x: 0, y: 900, w: 450, h: 25 },
    { x: 1850, y: 900, w: 550, h: 100 },
    { x: 0, y: 925, w: 425, h: 25 },
    { x: 1400, y: 925, w: 50, h: 25 },
    { x: 0, y: 950, w: 400, h: 25 },
    { x: 1350, y: 950, w: 125, h: 25 },
    { x: 0, y: 975, w: 375, h: 50 },
    { x: 700, y: 975, w: 125, h: 25 },
    { x: 1075, y: 975, w: 125, h: 25 },
    { x: 1325, y: 975, w: 150, h: 25 },
    { x: 650, y: 1000, w: 175, h: 25 },
    { x: 1000, y: 1000, w: 475, h: 50 },
    { x: 1875, y: 1000, w: 525, h: 150 },
    { x: 0, y: 1025, w: 350, h: 25 },
    { x: 600, y: 1025, w: 225, h: 25 },
    { x: 0, y: 1050, w: 300, h: 25 },
    { x: 525, y: 1050, w: 300, h: 50 },
    { x: 1000, y: 1050, w: 500, h: 25 },
    { x: 0, y: 1075, w: 275, h: 25 },
    { x: 1100, y: 1075, w: 400, h: 25 },
    { x: 0, y: 1100, w: 250, h: 25 },
    { x: 500, y: 1100, w: 325, h: 25 },
    { x: 1125, y: 1100, w: 375, h: 25 },
    { x: 0, y: 1125, w: 225, h: 275 },
    { x: 475, y: 1125, w: 375, h: 25 },
    { x: 1150, y: 1125, w: 375, h: 25 },
    { x: 450, y: 1150, w: 425, h: 25 },
    { x: 1175, y: 1150, w: 350, h: 25 },
    { x: 1850, y: 1150, w: 550, h: 50 },
    { x: 425, y: 1175, w: 450, h: 25 },
    { x: 1350, y: 1175, w: 150, h: 25 },
    { x: 400, y: 1200, w: 475, h: 125 },
    { x: 1450, y: 1200, w: 50, h: 25 },
    { x: 1825, y: 1200, w: 575, h: 25 },
    { x: 1800, y: 1225, w: 600, h: 25 },
    { x: 1750, y: 1250, w: 650, h: 25 },
    { x: 1775, y: 1275, w: 250, h: 25 },
    { x: 2100, y: 1275, w: 300, h: 25 },
    { x: 1775, y: 1300, w: 225, h: 25 },
    { x: 2150, y: 1300, w: 250, h: 25 },
    { x: 400, y: 1325, w: 450, h: 75 },
    { x: 1775, y: 1325, w: 200, h: 25 },
    { x: 2175, y: 1325, w: 225, h: 25 },
    { x: 1775, y: 1350, w: 175, h: 25 },
    { x: 2200, y: 1350, w: 200, h: 25 },
    { x: 1775, y: 1375, w: 150, h: 75 },
    { x: 2225, y: 1375, w: 175, h: 50 },
    { x: 0, y: 1400, w: 250, h: 100 },
    { x: 400, y: 1400, w: 425, h: 25 },
    { x: 1500, y: 1400, w: 50, h: 25 },
    { x: 425, y: 1425, w: 400, h: 25 },
    { x: 1050, y: 1425, w: 75, h: 25 },
    { x: 1475, y: 1425, w: 75, h: 25 },
    { x: 2250, y: 1425, w: 150, h: 75 },
    { x: 450, y: 1450, w: 375, h: 25 },
    { x: 1000, y: 1450, w: 175, h: 25 },
    { x: 1450, y: 1450, w: 100, h: 25 },
    { x: 1775, y: 1450, w: 125, h: 75 },
    { x: 475, y: 1475, w: 350, h: 150 },
    { x: 1000, y: 1475, w: 200, h: 25 },
    { x: 1425, y: 1475, w: 125, h: 25 },
    { x: 0, y: 1500, w: 225, h: 50 },
    { x: 1000, y: 1500, w: 225, h: 25 },
    { x: 1350, y: 1500, w: 200, h: 25 },
    { x: 2275, y: 1500, w: 125, h: 125 },
    { x: 975, y: 1525, w: 600, h: 25 },
    { x: 1775, y: 1525, w: 100, h: 25 },
    { x: 0, y: 1550, w: 250, h: 25 },
    { x: 1050, y: 1550, w: 525, h: 25 },
    { x: 0, y: 1575, w: 275, h: 25 },
    { x: 1100, y: 1575, w: 475, h: 25 },
    { x: 0, y: 1600, w: 300, h: 25 },
    { x: 1125, y: 1600, w: 475, h: 25 },
    { x: 0, y: 1625, w: 325, h: 150 },
    { x: 500, y: 1625, w: 325, h: 50 },
    { x: 1150, y: 1625, w: 450, h: 25 },
    { x: 2250, y: 1625, w: 150, h: 25 },
    { x: 1150, y: 1650, w: 475, h: 25 },
    { x: 2075, y: 1650, w: 25, h: 25 },
    { x: 2225, y: 1650, w: 175, h: 25 },
    { x: 525, y: 1675, w: 325, h: 50 },
    { x: 1150, y: 1675, w: 500, h: 25 },
    { x: 2050, y: 1675, w: 350, h: 25 },
    { x: 1150, y: 1700, w: 550, h: 75 },
    { x: 2025, y: 1700, w: 375, h: 25 },
    { x: 550, y: 1725, w: 300, h: 25 },
    { x: 1950, y: 1725, w: 450, h: 25 },
    { x: 575, y: 1750, w: 275, h: 25 },
    { x: 1925, y: 1750, w: 475, h: 125 },
    { x: 0, y: 1775, w: 300, h: 25 },
    { x: 600, y: 1775, w: 250, h: 25 },
    { x: 1150, y: 1775, w: 575, h: 25 },
    { x: 0, y: 1800, w: 275, h: 25 },
    { x: 625, y: 1800, w: 250, h: 25 },
    { x: 1125, y: 1800, w: 600, h: 25 },
    { x: 0, y: 1825, w: 250, h: 25 },
    { x: 625, y: 1825, w: 225, h: 25 },
    { x: 1100, y: 1825, w: 625, h: 25 },
    { x: 0, y: 1850, w: 175, h: 25 },
    { x: 650, y: 1850, w: 200, h: 25 },
    { x: 1075, y: 1850, w: 550, h: 25 },
    { x: 0, y: 1875, w: 125, h: 25 },
    { x: 675, y: 1875, w: 175, h: 50 },
    { x: 1050, y: 1875, w: 550, h: 25 },
    { x: 1950, y: 1875, w: 450, h: 25 },
    { x: 0, y: 1900, w: 100, h: 25 },
    { x: 1050, y: 1900, w: 150, h: 25 },
    { x: 1300, y: 1900, w: 275, h: 25 },
    { x: 2000, y: 1900, w: 400, h: 25 },
    { x: 0, y: 1925, w: 75, h: 75 },
    { x: 700, y: 1925, w: 150, h: 50 },
    { x: 1025, y: 1925, w: 100, h: 25 },
    { x: 1350, y: 1925, w: 200, h: 25 },
    { x: 2075, y: 1925, w: 325, h: 25 },
    { x: 1400, y: 1950, w: 150, h: 25 },
    { x: 2100, y: 1950, w: 300, h: 25 },
    { x: 725, y: 1975, w: 125, h: 25 },
    { x: 1450, y: 1975, w: 75, h: 25 },
    { x: 2125, y: 1975, w: 275, h: 150 },
    { x: 0, y: 2000, w: 100, h: 125 },
    { x: 725, y: 2000, w: 100, h: 25 },
    { x: 1750, y: 2050, w: 150, h: 25 },
    { x: 1725, y: 2075, w: 225, h: 50 },
    { x: 1125, y: 2100, w: 150, h: 25 },
    { x: 0, y: 2125, w: 75, h: 50 },
    { x: 1075, y: 2125, w: 250, h: 25 },
    { x: 1700, y: 2125, w: 275, h: 25 },
    { x: 2150, y: 2125, w: 250, h: 25 },
    { x: 1050, y: 2150, w: 325, h: 25 },
    { x: 1675, y: 2150, w: 300, h: 25 },
    { x: 2175, y: 2150, w: 225, h: 50 },
    { x: 0, y: 2175, w: 100, h: 25 },
    { x: 1025, y: 2175, w: 375, h: 25 },
    { x: 1650, y: 2175, w: 325, h: 25 },
    { x: 0, y: 2200, w: 125, h: 25 },
    { x: 925, y: 2200, w: 500, h: 25 },
    { x: 1625, y: 2200, w: 375, h: 25 },
    { x: 2225, y: 2200, w: 175, h: 25 },
    { x: 0, y: 2225, w: 150, h: 25 },
    { x: 600, y: 2225, w: 150, h: 25 },
    { x: 850, y: 2225, w: 600, h: 25 },
    { x: 1575, y: 2225, w: 450, h: 25 },
    { x: 2275, y: 2225, w: 125, h: 25 },
    { x: 0, y: 2250, w: 200, h: 25 },
    { x: 575, y: 2250, w: 900, h: 25 },
    { x: 1525, y: 2250, w: 525, h: 25 },
    { x: 2300, y: 2250, w: 100, h: 25 },
    { x: 0, y: 2275, w: 250, h: 25 },
    { x: 500, y: 2275, w: 1575, h: 25 },
    { x: 2325, y: 2275, w: 75, h: 25 },
    { x: 0, y: 2300, w: 300, h: 25 },
    { x: 475, y: 2300, w: 1625, h: 25 },
    { x: 2350, y: 2300, w: 50, h: 25 },
    { x: 0, y: 2325, w: 350, h: 25 },
    { x: 425, y: 2325, w: 1675, h: 25 },
    { x: 2375, y: 2325, w: 25, h: 25 },
    { x: 0, y: 2350, w: 2100, h: 25 },
    { x: 0, y: 2375, w: 2125, h: 25 },
  ],

  // Proximity label for the way out (same system as D1B's Cave Exit), riding on
  // the exit interactable in the bottom-right corner beside the spawn.
  buildings: [
    { label: 'Cave Exit', x: 2289, y: 2384, r: 163 },
  ],

  // The way back out — interacting returns the player to the overworld spot on
  // D4 they entered from (main.js's exitCave, via the `caveExit` flag). Placed
  // at the bottom-right entrance mouth, right beside the spawn (Danny).
  interactables: [
    {
      id: 'cave_exit',
      x: 2289, y: 2384,
      range: 138,
      caveExit: true,
      label: 'Cave Exit',
    },
    // Metallic ore (2026-08-03, Danny) — a "shiny object"-style pickup that
    // announces itself with the fishing CATCH reveal + sound (reward.catch).
    {
      id: 'd4b_ore',
      x: 1781, y: 1119,
      label: 'Metallic ore',
      reward: { item: 'metallic_ore', qty: 1, catch: true },
      message: 'You pried a chunk of metallic ore loose from the rock.',
    },
  ],

  // Cave Spiders (2026-07-31, Danny) — three roaming `creature` enemies (mill
  // via a small patrol loop, CHARGE the player within aggroRange, give up and
  // return home when the player leaves — same AI as D1's cragclaws). They fight
  // via `enemyId: 'cave_spider'` on contact; `defeated` persists per-World + in
  // the save (npcsDefeated). Positions engine-verified walkable + reachable.
  npcs: [
    // Edras Holloweye (2026-07-31, Danny) — a paranoid old hermit holed up in
    // the top-right chamber, convinced everyone's after his "treasures" (which
    // read as worthless junk now, but become quest items later). He WANDERS his
    // patch (patrol) and BUTTONHOLES the player on approach (`proximityTalk` +
    // `talkRange` → world.pendingApproach → main.js's openEdrasDialog), the same
    // "talk when you get too close" feel as the Bramblekin gate guards. To folk
    // in the village he's legendary as "the Pale Warning" for his prophetic
    // ramblings (see Ingrith's chatter in d2.js). Dialogue is state-built in
    // main.js, routed via openNpcDialog's edras_holloweye branch.
    {
      id: 'edras_holloweye', name: 'Edras Holloweye', role: 'HERMIT',
      proximityTalk: true, talkRange: 206,
      sprite: 'assets/images/Edras Holloweye_overhead.png',
      portrait: 'assets/images/Edras Holloweye.png',
      x: 2084, y: 479, speed: 26, startsHome: false,
      patrol: [ { x: 2084, y: 479 }, { x: 2196, y: 479 }, { x: 2084, y: 591 } ],
    },
    {
      id: 'cave_spider_1', name: 'Cave Spider', creature: true, enemyId: 'cave_spider',
      sprite: 'assets/images/cave_spider_overhead.png',
      portrait: 'assets/images/cave_spider.png',
      x: 386, y: 2041, speed: 34, chaseSpeed: 140, aggroRange: 500, startsHome: false,
      patrol: [ { x: 386, y: 2041 }, { x: 474, y: 2041 }, { x: 386, y: 2129 } ],
    },
    {
      id: 'cave_spider_2', name: 'Cave Spider', creature: true, enemyId: 'cave_spider',
      sprite: 'assets/images/cave_spider_overhead.png',
      portrait: 'assets/images/cave_spider.png',
      x: 379, y: 659, speed: 34, chaseSpeed: 140, aggroRange: 500, startsHome: false,
      patrol: [ { x: 379, y: 659 }, { x: 466, y: 659 }, { x: 379, y: 746 } ],
    },
    {
      id: 'cave_spider_3', name: 'Cave Spider', creature: true, enemyId: 'cave_spider',
      sprite: 'assets/images/cave_spider_overhead.png',
      portrait: 'assets/images/cave_spider.png',
      x: 2059, y: 1484, speed: 34, chaseSpeed: 140, aggroRange: 500, startsHome: false,
      patrol: [ { x: 2059, y: 1484 }, { x: 2146, y: 1484 }, { x: 2059, y: 1571 } ],
    },
  ],

  // Enemies (2026-07-31, Danny): the ONLY enemies here are auto-ambushes placed
  // at the tunnel INTERSECTIONS — each is 1-3 Blight Rats or 1-3 Cave Bats
  // (single-type per encounter). Auto-ambushes like D4's rootweavers / D1's
  // mireman: no overhead sprite, unseen until they swarm; the fight uses the
  // cave backdrop via battleBackground. `retreat` pushes the player back far
  // enough (>range*1.6) that pressing on re-arms the ambush. The corner
  // chambers are deliberately left EMPTY for now (future content). All four
  // junction + retreat points engine-verified reachable from the spawn by the
  // 36px collider against the regenerated collision.
  ambushes: [
    // Junction A — upper-left branch.
    { id: 'cave_ambush_a', x: 825, y: 775, range: 113, enemies: ['blight_rat', 'blight_rat'], retreat: { x: 625, y: 925 } },
    // Junction B — the central crossroads.
    { id: 'cave_ambush_b', x: 1188, y: 950, range: 113, enemies: ['cave_bat', 'cave_bat', 'cave_bat'], retreat: { x: 1388, y: 800 } },
    // Junction C — the right-hand vertical passage junction.
    { id: 'cave_ambush_c', x: 1625, y: 800, range: 113, enemies: ['blight_rat', 'blight_rat', 'blight_rat'], retreat: { x: 1775, y: 1000 } },
    // Junction D — the lower-central four-way junction.
    { id: 'cave_ambush_d', x: 1038, y: 1713, range: 113, enemies: ['cave_bat', 'cave_bat'], retreat: { x: 888, y: 1913 } },
  ],
  battles: [],

  // Edras's campfire (2026-07-31, Danny): a small code-drawn flame + rising
  // smoke in the hermit's top-right chamber (same effects as Calder's hut fire /
  // D2 chimney smoke — no asset needed). Co-located so the smoke rises off the
  // flame.
  fires: [
    { x: 2040, y: 329 },
  ],
  smoke: [
    { x: 2040, y: 314 },
  ],

  // Treasure chest (2026-07-31, Danny) in the bottom-left corner chamber,
  // rotated 90°. Unlocked; holds a Vitality Potion + a Leather Hood (+1 def head
  // armor). Position engine-verified reachable.
  chests: [
    {
      id: 'd4b_corner_chest',
      x: 183, y: 2075,
      rotation: 90,
      locked: false,
      gold: 0,
      items: [
        { id: 'vitality_potion', qty: 1 },
        { id: 'leather_hood', qty: 1 },
      ],
    },
  ],

  exits: [],
};
