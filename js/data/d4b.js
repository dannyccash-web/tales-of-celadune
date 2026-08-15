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
  width: 3000,
  height: 3000,

  // Where the player appears on entering — the bottom-right entrance mouth
  // (Danny, 2026-07-31). enterCave normally drops them here; a direct boot uses
  // it too. (A second entrance in the upper-left will be wired up later.)
  spawn: { x: 2768, y: 2910 },

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
    { x: 250, y: 0, w: 2750, h: 31 },
    { x: 313, y: 31, w: 2688, h: 31 },
    { x: 0, y: 63, w: 31, h: 31 },
    { x: 344, y: 63, w: 2656, h: 31 },
    { x: 0, y: 94, w: 63, h: 31 },
    { x: 375, y: 94, w: 2031, h: 31 },
    { x: 2500, y: 94, w: 500, h: 31 },
    { x: 0, y: 125, w: 94, h: 94 },
    { x: 406, y: 125, w: 1969, h: 31 },
    { x: 2531, y: 125, w: 469, h: 31 },
    { x: 406, y: 156, w: 63, h: 31 },
    { x: 594, y: 156, w: 1750, h: 31 },
    { x: 2563, y: 156, w: 438, h: 31 },
    { x: 625, y: 188, w: 1688, h: 31 },
    { x: 2594, y: 188, w: 406, h: 63 },
    { x: 0, y: 219, w: 125, h: 31 },
    { x: 656, y: 219, w: 1625, h: 31 },
    { x: 0, y: 250, w: 156, h: 31 },
    { x: 781, y: 250, w: 1500, h: 31 },
    { x: 2594, y: 250, w: 219, h: 31 },
    { x: 2844, y: 250, w: 156, h: 31 },
    { x: 0, y: 281, w: 188, h: 31 },
    { x: 844, y: 281, w: 1406, h: 31 },
    { x: 2594, y: 281, w: 188, h: 31 },
    { x: 2875, y: 281, w: 125, h: 31 },
    { x: 0, y: 313, w: 219, h: 31 },
    { x: 906, y: 313, w: 1375, h: 31 },
    { x: 2594, y: 313, w: 156, h: 31 },
    { x: 2906, y: 313, w: 94, h: 31 },
    { x: 0, y: 344, w: 250, h: 31 },
    { x: 938, y: 344, w: 1344, h: 31 },
    { x: 2563, y: 344, w: 156, h: 31 },
    { x: 2938, y: 344, w: 63, h: 281 },
    { x: 0, y: 375, w: 375, h: 31 },
    { x: 969, y: 375, w: 438, h: 31 },
    { x: 1500, y: 375, w: 781, h: 31 },
    { x: 2563, y: 375, w: 31, h: 31 },
    { x: 0, y: 406, w: 438, h: 31 },
    { x: 1156, y: 406, w: 219, h: 31 },
    { x: 1531, y: 406, w: 750, h: 31 },
    { x: 0, y: 438, w: 469, h: 31 },
    { x: 1563, y: 438, w: 719, h: 31 },
    { x: 0, y: 469, w: 531, h: 31 },
    { x: 1719, y: 469, w: 563, h: 31 },
    { x: 0, y: 500, w: 594, h: 125 },
    { x: 1813, y: 500, w: 469, h: 31 },
    { x: 1844, y: 531, w: 406, h: 31 },
    { x: 1875, y: 563, w: 313, h: 31 },
    { x: 0, y: 625, w: 531, h: 31 },
    { x: 1000, y: 625, w: 156, h: 31 },
    { x: 1406, y: 625, w: 94, h: 31 },
    { x: 2906, y: 625, w: 94, h: 31 },
    { x: 0, y: 656, w: 438, h: 31 },
    { x: 1000, y: 656, w: 594, h: 31 },
    { x: 2875, y: 656, w: 125, h: 31 },
    { x: 0, y: 688, w: 406, h: 31 },
    { x: 1000, y: 688, w: 719, h: 31 },
    { x: 2813, y: 688, w: 188, h: 31 },
    { x: 0, y: 719, w: 375, h: 31 },
    { x: 1000, y: 719, w: 750, h: 63 },
    { x: 2313, y: 719, w: 94, h: 31 },
    { x: 2750, y: 719, w: 250, h: 63 },
    { x: 0, y: 750, w: 344, h: 31 },
    { x: 2250, y: 750, w: 219, h: 31 },
    { x: 0, y: 781, w: 313, h: 31 },
    { x: 688, y: 781, w: 94, h: 31 },
    { x: 1000, y: 781, w: 781, h: 63 },
    { x: 2188, y: 781, w: 281, h: 31 },
    { x: 2719, y: 781, w: 281, h: 31 },
    { x: 0, y: 813, w: 281, h: 94 },
    { x: 656, y: 813, w: 156, h: 94 },
    { x: 2188, y: 813, w: 313, h: 31 },
    { x: 2688, y: 813, w: 313, h: 31 },
    { x: 1031, y: 844, w: 750, h: 31 },
    { x: 2188, y: 844, w: 344, h: 31 },
    { x: 2625, y: 844, w: 375, h: 31 },
    { x: 1031, y: 875, w: 781, h: 31 },
    { x: 2188, y: 875, w: 813, h: 94 },
    { x: 0, y: 906, w: 313, h: 31 },
    { x: 625, y: 906, w: 188, h: 31 },
    { x: 1031, y: 906, w: 750, h: 31 },
    { x: 0, y: 938, w: 344, h: 31 },
    { x: 594, y: 938, w: 250, h: 31 },
    { x: 1063, y: 938, w: 313, h: 31 },
    { x: 1563, y: 938, w: 219, h: 31 },
    { x: 0, y: 969, w: 406, h: 31 },
    { x: 563, y: 969, w: 281, h: 31 },
    { x: 1063, y: 969, w: 281, h: 31 },
    { x: 1594, y: 969, w: 63, h: 31 },
    { x: 2219, y: 969, w: 781, h: 94 },
    { x: 0, y: 1000, w: 844, h: 31 },
    { x: 1094, y: 1000, w: 219, h: 31 },
    { x: 0, y: 1031, w: 813, h: 31 },
    { x: 0, y: 1063, w: 750, h: 31 },
    { x: 2250, y: 1063, w: 750, h: 31 },
    { x: 0, y: 1094, w: 656, h: 31 },
    { x: 2281, y: 1094, w: 719, h: 31 },
    { x: 0, y: 1125, w: 563, h: 31 },
    { x: 2313, y: 1125, w: 688, h: 125 },
    { x: 0, y: 1156, w: 531, h: 31 },
    { x: 1750, y: 1156, w: 63, h: 31 },
    { x: 0, y: 1188, w: 500, h: 31 },
    { x: 1688, y: 1188, w: 156, h: 31 },
    { x: 0, y: 1219, w: 469, h: 63 },
    { x: 875, y: 1219, w: 156, h: 31 },
    { x: 1344, y: 1219, w: 156, h: 31 },
    { x: 1656, y: 1219, w: 188, h: 31 },
    { x: 813, y: 1250, w: 219, h: 31 },
    { x: 1250, y: 1250, w: 594, h: 63 },
    { x: 2344, y: 1250, w: 656, h: 188 },
    { x: 0, y: 1281, w: 438, h: 31 },
    { x: 750, y: 1281, w: 281, h: 31 },
    { x: 0, y: 1313, w: 375, h: 31 },
    { x: 656, y: 1313, w: 375, h: 63 },
    { x: 1250, y: 1313, w: 625, h: 31 },
    { x: 0, y: 1344, w: 344, h: 31 },
    { x: 1375, y: 1344, w: 500, h: 31 },
    { x: 0, y: 1375, w: 313, h: 31 },
    { x: 625, y: 1375, w: 406, h: 31 },
    { x: 1406, y: 1375, w: 469, h: 31 },
    { x: 0, y: 1406, w: 281, h: 344 },
    { x: 594, y: 1406, w: 469, h: 31 },
    { x: 1438, y: 1406, w: 469, h: 31 },
    { x: 563, y: 1438, w: 531, h: 31 },
    { x: 1469, y: 1438, w: 438, h: 31 },
    { x: 2313, y: 1438, w: 688, h: 63 },
    { x: 531, y: 1469, w: 563, h: 31 },
    { x: 1688, y: 1469, w: 188, h: 31 },
    { x: 500, y: 1500, w: 594, h: 156 },
    { x: 1813, y: 1500, w: 63, h: 31 },
    { x: 2281, y: 1500, w: 719, h: 31 },
    { x: 2250, y: 1531, w: 750, h: 31 },
    { x: 2188, y: 1563, w: 813, h: 31 },
    { x: 2219, y: 1594, w: 313, h: 31 },
    { x: 2625, y: 1594, w: 375, h: 31 },
    { x: 2219, y: 1625, w: 281, h: 31 },
    { x: 2688, y: 1625, w: 313, h: 31 },
    { x: 500, y: 1656, w: 563, h: 94 },
    { x: 2219, y: 1656, w: 250, h: 31 },
    { x: 2719, y: 1656, w: 281, h: 31 },
    { x: 2219, y: 1688, w: 219, h: 31 },
    { x: 2750, y: 1688, w: 250, h: 31 },
    { x: 2219, y: 1719, w: 188, h: 94 },
    { x: 2781, y: 1719, w: 219, h: 63 },
    { x: 0, y: 1750, w: 313, h: 125 },
    { x: 500, y: 1750, w: 531, h: 31 },
    { x: 1875, y: 1750, w: 63, h: 31 },
    { x: 531, y: 1781, w: 500, h: 31 },
    { x: 1313, y: 1781, w: 94, h: 31 },
    { x: 1844, y: 1781, w: 94, h: 31 },
    { x: 2813, y: 1781, w: 188, h: 94 },
    { x: 563, y: 1813, w: 469, h: 31 },
    { x: 1250, y: 1813, w: 219, h: 31 },
    { x: 1813, y: 1813, w: 125, h: 31 },
    { x: 2219, y: 1813, w: 156, h: 94 },
    { x: 594, y: 1844, w: 438, h: 188 },
    { x: 1250, y: 1844, w: 250, h: 31 },
    { x: 1781, y: 1844, w: 156, h: 31 },
    { x: 0, y: 1875, w: 281, h: 63 },
    { x: 1250, y: 1875, w: 281, h: 31 },
    { x: 1688, y: 1875, w: 250, h: 31 },
    { x: 2844, y: 1875, w: 156, h: 156 },
    { x: 1219, y: 1906, w: 750, h: 31 },
    { x: 2219, y: 1906, w: 125, h: 31 },
    { x: 0, y: 1938, w: 313, h: 31 },
    { x: 1313, y: 1938, w: 656, h: 31 },
    { x: 0, y: 1969, w: 344, h: 31 },
    { x: 1375, y: 1969, w: 594, h: 31 },
    { x: 0, y: 2000, w: 375, h: 31 },
    { x: 1406, y: 2000, w: 594, h: 31 },
    { x: 0, y: 2031, w: 406, h: 188 },
    { x: 625, y: 2031, w: 406, h: 63 },
    { x: 1438, y: 2031, w: 563, h: 31 },
    { x: 2813, y: 2031, w: 188, h: 31 },
    { x: 1438, y: 2063, w: 594, h: 31 },
    { x: 2594, y: 2063, w: 31, h: 31 },
    { x: 2781, y: 2063, w: 219, h: 31 },
    { x: 656, y: 2094, w: 406, h: 63 },
    { x: 1438, y: 2094, w: 625, h: 31 },
    { x: 2563, y: 2094, w: 438, h: 31 },
    { x: 1438, y: 2125, w: 688, h: 94 },
    { x: 2531, y: 2125, w: 469, h: 31 },
    { x: 688, y: 2156, w: 375, h: 31 },
    { x: 2438, y: 2156, w: 563, h: 31 },
    { x: 719, y: 2188, w: 344, h: 31 },
    { x: 2406, y: 2188, w: 594, h: 156 },
    { x: 0, y: 2219, w: 375, h: 31 },
    { x: 750, y: 2219, w: 313, h: 31 },
    { x: 1438, y: 2219, w: 719, h: 31 },
    { x: 0, y: 2250, w: 344, h: 31 },
    { x: 781, y: 2250, w: 313, h: 31 },
    { x: 1406, y: 2250, w: 750, h: 31 },
    { x: 0, y: 2281, w: 313, h: 31 },
    { x: 781, y: 2281, w: 281, h: 31 },
    { x: 1375, y: 2281, w: 781, h: 31 },
    { x: 0, y: 2313, w: 219, h: 31 },
    { x: 813, y: 2313, w: 250, h: 31 },
    { x: 1344, y: 2313, w: 688, h: 31 },
    { x: 0, y: 2344, w: 156, h: 31 },
    { x: 844, y: 2344, w: 219, h: 63 },
    { x: 1313, y: 2344, w: 688, h: 31 },
    { x: 2438, y: 2344, w: 563, h: 31 },
    { x: 0, y: 2375, w: 125, h: 31 },
    { x: 1313, y: 2375, w: 188, h: 31 },
    { x: 1625, y: 2375, w: 344, h: 31 },
    { x: 2500, y: 2375, w: 500, h: 31 },
    { x: 0, y: 2406, w: 94, h: 94 },
    { x: 875, y: 2406, w: 188, h: 63 },
    { x: 1281, y: 2406, w: 125, h: 31 },
    { x: 1688, y: 2406, w: 250, h: 31 },
    { x: 2594, y: 2406, w: 406, h: 31 },
    { x: 1750, y: 2438, w: 188, h: 31 },
    { x: 2625, y: 2438, w: 375, h: 31 },
    { x: 906, y: 2469, w: 156, h: 31 },
    { x: 1813, y: 2469, w: 94, h: 31 },
    { x: 2656, y: 2469, w: 344, h: 188 },
    { x: 0, y: 2500, w: 125, h: 156 },
    { x: 906, y: 2500, w: 125, h: 31 },
    { x: 2188, y: 2563, w: 188, h: 31 },
    { x: 2156, y: 2594, w: 281, h: 63 },
    { x: 1406, y: 2625, w: 188, h: 31 },
    { x: 0, y: 2656, w: 94, h: 63 },
    { x: 1344, y: 2656, w: 313, h: 31 },
    { x: 2125, y: 2656, w: 344, h: 31 },
    { x: 2688, y: 2656, w: 313, h: 31 },
    { x: 1313, y: 2688, w: 406, h: 31 },
    { x: 2094, y: 2688, w: 375, h: 31 },
    { x: 2719, y: 2688, w: 281, h: 63 },
    { x: 0, y: 2719, w: 125, h: 31 },
    { x: 1281, y: 2719, w: 469, h: 31 },
    { x: 2063, y: 2719, w: 406, h: 31 },
    { x: 0, y: 2750, w: 156, h: 31 },
    { x: 1156, y: 2750, w: 625, h: 31 },
    { x: 2031, y: 2750, w: 469, h: 31 },
    { x: 2781, y: 2750, w: 219, h: 31 },
    { x: 0, y: 2781, w: 188, h: 31 },
    { x: 750, y: 2781, w: 188, h: 31 },
    { x: 1063, y: 2781, w: 750, h: 31 },
    { x: 1969, y: 2781, w: 563, h: 31 },
    { x: 2844, y: 2781, w: 156, h: 31 },
    { x: 0, y: 2813, w: 250, h: 31 },
    { x: 719, y: 2813, w: 1125, h: 31 },
    { x: 1906, y: 2813, w: 656, h: 31 },
    { x: 2875, y: 2813, w: 125, h: 31 },
    { x: 0, y: 2844, w: 313, h: 31 },
    { x: 625, y: 2844, w: 1969, h: 31 },
    { x: 2906, y: 2844, w: 94, h: 31 },
    { x: 0, y: 2875, w: 375, h: 31 },
    { x: 594, y: 2875, w: 2031, h: 31 },
    { x: 2938, y: 2875, w: 63, h: 31 },
    { x: 0, y: 2906, w: 438, h: 31 },
    { x: 531, y: 2906, w: 2094, h: 31 },
    { x: 2969, y: 2906, w: 31, h: 31 },
    { x: 0, y: 2938, w: 2625, h: 31 },
    { x: 0, y: 2969, w: 2656, h: 31 },
  ],

  // Proximity label for the way out (same system as D1B's Cave Exit), riding on
  // the exit interactable in the bottom-right corner beside the spawn.
  buildings: [
    { label: 'Cave Exit', x: 2861, y: 2980, r: 204 },
  ],

  // The way back out — interacting returns the player to the overworld spot on
  // D4 they entered from (main.js's exitCave, via the `caveExit` flag). Placed
  // at the bottom-right entrance mouth, right beside the spawn (Danny).
  interactables: [
    {
      id: 'cave_exit',
      x: 2861, y: 2980,
      range: 173,
      caveExit: true,
      label: 'Cave Exit',
    },
    // Metallic ore (2026-08-03, Danny) — a "shiny object"-style pickup that
    // announces itself with the fishing CATCH reveal + sound (reward.catch).
    {
      id: 'd4b_ore',
      x: 2226, y: 1399,
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
      proximityTalk: true, talkRange: 258,
      sprite: 'assets/images/Edras Holloweye_overhead.png',
      portrait: 'assets/images/Edras Holloweye.png',
      x: 2605, y: 599, speed: 26, startsHome: false,
      patrol: [ { x: 2605, y: 599 }, { x: 2745, y: 599 }, { x: 2605, y: 739 } ],
    },
    {
      id: 'cave_spider_1', name: 'Cave Spider', creature: true, enemyId: 'cave_spider',
      sprite: 'assets/images/cave_spider_overhead.png',
      portrait: 'assets/images/cave_spider.png',
      x: 483, y: 2551, speed: 34, chaseSpeed: 140, aggroRange: 625, startsHome: false,
      patrol: [ { x: 483, y: 2551 }, { x: 593, y: 2551 }, { x: 483, y: 2661 } ],
    },
    {
      id: 'cave_spider_2', name: 'Cave Spider', creature: true, enemyId: 'cave_spider',
      sprite: 'assets/images/cave_spider_overhead.png',
      portrait: 'assets/images/cave_spider.png',
      x: 474, y: 824, speed: 34, chaseSpeed: 140, aggroRange: 625, startsHome: false,
      patrol: [ { x: 474, y: 824 }, { x: 583, y: 824 }, { x: 474, y: 933 } ],
    },
    {
      id: 'cave_spider_3', name: 'Cave Spider', creature: true, enemyId: 'cave_spider',
      sprite: 'assets/images/cave_spider_overhead.png',
      portrait: 'assets/images/cave_spider.png',
      x: 2574, y: 1855, speed: 34, chaseSpeed: 140, aggroRange: 625, startsHome: false,
      patrol: [ { x: 2574, y: 1855 }, { x: 2683, y: 1855 }, { x: 2574, y: 1964 } ],
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
    { id: 'cave_ambush_a', x: 1031, y: 969, range: 141, enemies: ['blight_rat', 'blight_rat'], retreat: { x: 781, y: 1156 } },
    // Junction B — the central crossroads.
    { id: 'cave_ambush_b', x: 1485, y: 1188, range: 141, enemies: ['cave_bat', 'cave_bat', 'cave_bat'], retreat: { x: 1735, y: 1000 } },
    // Junction C — the right-hand vertical passage junction.
    { id: 'cave_ambush_c', x: 2031, y: 1000, range: 141, enemies: ['blight_rat', 'blight_rat', 'blight_rat'], retreat: { x: 2219, y: 1250 } },
    // Junction D — the lower-central four-way junction.
    { id: 'cave_ambush_d', x: 1298, y: 2141, range: 141, enemies: ['cave_bat', 'cave_bat'], retreat: { x: 1110, y: 2391 } },
  ],
  battles: [],

  // Edras's campfire (2026-07-31, Danny): a small code-drawn flame + rising
  // smoke in the hermit's top-right chamber (same effects as Calder's hut fire /
  // D2 chimney smoke — no asset needed). Co-located so the smoke rises off the
  // flame.
  fires: [
    { x: 2550, y: 411 },
  ],
  smoke: [
    { x: 2550, y: 393 },
  ],

  // Treasure chest (2026-07-31, Danny) in the bottom-left corner chamber,
  // rotated 90°. Unlocked; holds a Vitality Potion + a Leather Hood (+1 def head
  // armor). Position engine-verified reachable.
  chests: [
    {
      id: 'd4b_corner_chest',
      x: 229, y: 2594,
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
