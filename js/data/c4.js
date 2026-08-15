// Scene C4 — WOODS (overworld row C, column 4)
// World coordinates: 1920x1920. Origin top-left.
//
// The row above D4 — the player pushes NORTH out of D4's top edge and arrives
// here at the bottom. A river runs down the WEST edge (impassable); dirt paths
// wind through dense forest, looping around a central dirt CLEARING. In the
// top-left a traveller's camp sits by a river bend (a lit campfire, tents and a
// wagon in the art) — Mara Vellorne and her companion Vozhik, robbed by the
// clearing's bramblekin. FOUR bramblekin roam the clearing guarding a chest of
// stolen goods (a pack: attack one and all four pile in). Two Rootweaver
// ambushes lurk on the eastern loop trails.
//
// Collision REGENERATED 2026-08-03 from Danny's hand-painted walkable guide
// `C4_Background_walkable.jpg` (red = walkable) — same pipeline as D1/D2/D4:
// per-20px-cell red sample -> 1-cell shoulder dilation -> connected-component
// from the bottom arrival -> obstacles are the complement, plus carved exit
// aprons (bottom x955-1120 -> D4, top x850-1020 -> B4 stub). Engine-verified
// with the real 36px circle collider (BFS): one connected floor; the D4 exit
// band, top stub, clearing, chest, campfire camp, Mara/Vozhik/Cinder, both
// Rootweaver points, the fishing bank and all four bramblekin waypoints are
// reachable. The guide's red keeps the EAST SNEAK ROUTE — from the right-hand
// loop path you can reach the chest's east side WITHOUT entering the western
// bramblekin's 220px aggro (verified: a >220px-safe BFS from the right path
// reaches the chest-open point). Regenerate from the walkable guide, not by
// hand-editing.

export default {
  id: 'C4',
  name: 'Woods',
  background: 'assets/images/C4_Background.jpg',
  width: 3000,
  height: 3000,

  // Just inside the south (D4-facing) edge — only used on a direct boot; normal
  // arrival comes up through the scene-transition system onto the bottom band.
  spawn: { x: 1620, y: 2906 },

  obstacles: [
    { x: 0, y: 0, w: 1250, h: 31 },
    { x: 1625, y: 0, w: 1375, h: 125 },
    { x: 0, y: 31, w: 1219, h: 31 },
    { x: 0, y: 63, w: 1125, h: 31 },
    { x: 0, y: 94, w: 1094, h: 31 },
    { x: 0, y: 125, w: 1063, h: 94 },
    { x: 1500, y: 125, w: 1500, h: 31 },
    { x: 1531, y: 156, w: 1469, h: 31 },
    { x: 1563, y: 188, w: 1438, h: 31 },
    { x: 0, y: 219, w: 1094, h: 31 },
    { x: 1719, y: 219, w: 1281, h: 31 },
    { x: 0, y: 250, w: 750, h: 63 },
    { x: 906, y: 250, w: 281, h: 31 },
    { x: 1750, y: 250, w: 1250, h: 31 },
    { x: 1000, y: 281, w: 94, h: 31 },
    { x: 1781, y: 281, w: 1219, h: 31 },
    { x: 0, y: 313, w: 563, h: 31 },
    { x: 688, y: 313, w: 63, h: 63 },
    { x: 1031, y: 313, w: 63, h: 31 },
    { x: 1813, y: 313, w: 469, h: 31 },
    { x: 2406, y: 313, w: 594, h: 31 },
    { x: 0, y: 344, w: 406, h: 156 },
    { x: 1031, y: 344, w: 31, h: 63 },
    { x: 1844, y: 344, w: 344, h: 31 },
    { x: 2438, y: 344, w: 563, h: 94 },
    { x: 688, y: 375, w: 94, h: 31 },
    { x: 1875, y: 375, w: 188, h: 31 },
    { x: 750, y: 406, w: 31, h: 63 },
    { x: 1406, y: 406, w: 31, h: 31 },
    { x: 1375, y: 438, w: 94, h: 94 },
    { x: 2469, y: 438, w: 531, h: 63 },
    { x: 0, y: 500, w: 563, h: 31 },
    { x: 2500, y: 500, w: 500, h: 31 },
    { x: 0, y: 531, w: 594, h: 31 },
    { x: 1406, y: 531, w: 31, h: 31 },
    { x: 2563, y: 531, w: 438, h: 31 },
    { x: 0, y: 563, w: 625, h: 31 },
    { x: 1656, y: 563, w: 94, h: 31 },
    { x: 2094, y: 563, w: 125, h: 31 },
    { x: 2594, y: 563, w: 406, h: 63 },
    { x: 0, y: 594, w: 656, h: 31 },
    { x: 1625, y: 594, w: 281, h: 31 },
    { x: 2063, y: 594, w: 219, h: 31 },
    { x: 0, y: 625, w: 625, h: 31 },
    { x: 1625, y: 625, w: 719, h: 31 },
    { x: 2625, y: 625, w: 375, h: 125 },
    { x: 0, y: 656, w: 594, h: 31 },
    { x: 1625, y: 656, w: 750, h: 31 },
    { x: 0, y: 688, w: 563, h: 31 },
    { x: 1625, y: 688, w: 813, h: 63 },
    { x: 0, y: 719, w: 438, h: 188 },
    { x: 781, y: 719, w: 31, h: 31 },
    { x: 781, y: 750, w: 156, h: 31 },
    { x: 1313, y: 750, w: 94, h: 31 },
    { x: 1594, y: 750, w: 875, h: 63 },
    { x: 2656, y: 750, w: 344, h: 94 },
    { x: 813, y: 781, w: 125, h: 31 },
    { x: 1281, y: 781, w: 156, h: 31 },
    { x: 813, y: 813, w: 94, h: 31 },
    { x: 1250, y: 813, w: 188, h: 31 },
    { x: 1625, y: 813, w: 844, h: 31 },
    { x: 1219, y: 844, w: 219, h: 31 },
    { x: 1625, y: 844, w: 875, h: 94 },
    { x: 2688, y: 844, w: 313, h: 94 },
    { x: 1219, y: 875, w: 250, h: 31 },
    { x: 0, y: 906, w: 469, h: 31 },
    { x: 1188, y: 906, w: 281, h: 125 },
    { x: 0, y: 938, w: 500, h: 94 },
    { x: 1625, y: 938, w: 906, h: 94 },
    { x: 2719, y: 938, w: 281, h: 63 },
    { x: 2750, y: 1000, w: 250, h: 313 },
    { x: 0, y: 1031, w: 563, h: 31 },
    { x: 1156, y: 1031, w: 281, h: 31 },
    { x: 1625, y: 1031, w: 938, h: 63 },
    { x: 0, y: 1063, w: 656, h: 94 },
    { x: 1094, y: 1063, w: 344, h: 31 },
    { x: 1000, y: 1094, w: 406, h: 31 },
    { x: 1656, y: 1094, w: 906, h: 31 },
    { x: 969, y: 1125, w: 406, h: 63 },
    { x: 1688, y: 1125, w: 875, h: 31 },
    { x: 0, y: 1156, w: 594, h: 31 },
    { x: 1719, y: 1156, w: 875, h: 31 },
    { x: 0, y: 1188, w: 563, h: 344 },
    { x: 938, y: 1188, w: 438, h: 31 },
    { x: 1750, y: 1188, w: 844, h: 31 },
    { x: 938, y: 1219, w: 406, h: 31 },
    { x: 1781, y: 1219, w: 813, h: 31 },
    { x: 906, y: 1250, w: 438, h: 31 },
    { x: 1813, y: 1250, w: 781, h: 31 },
    { x: 875, y: 1281, w: 469, h: 31 },
    { x: 1844, y: 1281, w: 750, h: 63 },
    { x: 875, y: 1313, w: 438, h: 31 },
    { x: 2781, y: 1313, w: 219, h: 63 },
    { x: 906, y: 1344, w: 375, h: 31 },
    { x: 1875, y: 1344, w: 719, h: 31 },
    { x: 906, y: 1375, w: 344, h: 31 },
    { x: 2063, y: 1375, w: 375, h: 31 },
    { x: 2531, y: 1375, w: 63, h: 31 },
    { x: 2813, y: 1375, w: 188, h: 156 },
    { x: 906, y: 1406, w: 313, h: 31 },
    { x: 2094, y: 1406, w: 281, h: 31 },
    { x: 906, y: 1438, w: 281, h: 31 },
    { x: 2156, y: 1438, w: 188, h: 31 },
    { x: 906, y: 1469, w: 250, h: 125 },
    { x: 2188, y: 1469, w: 31, h: 31 },
    { x: 0, y: 1531, w: 594, h: 313 },
    { x: 2781, y: 1531, w: 219, h: 63 },
    { x: 938, y: 1594, w: 188, h: 31 },
    { x: 2750, y: 1594, w: 250, h: 63 },
    { x: 969, y: 1625, w: 125, h: 31 },
    { x: 2031, y: 1625, w: 31, h: 31 },
    { x: 969, y: 1656, w: 63, h: 31 },
    { x: 1938, y: 1656, w: 188, h: 31 },
    { x: 2719, y: 1656, w: 281, h: 63 },
    { x: 1875, y: 1688, w: 563, h: 31 },
    { x: 1875, y: 1719, w: 594, h: 31 },
    { x: 2688, y: 1719, w: 313, h: 31 },
    { x: 1250, y: 1750, w: 94, h: 31 },
    { x: 1844, y: 1750, w: 625, h: 63 },
    { x: 2656, y: 1750, w: 344, h: 63 },
    { x: 1219, y: 1781, w: 188, h: 31 },
    { x: 1156, y: 1813, w: 281, h: 31 },
    { x: 1813, y: 1813, w: 656, h: 31 },
    { x: 2625, y: 1813, w: 375, h: 188 },
    { x: 0, y: 1844, w: 656, h: 31 },
    { x: 1125, y: 1844, w: 313, h: 31 },
    { x: 1781, y: 1844, w: 688, h: 31 },
    { x: 0, y: 1875, w: 625, h: 375 },
    { x: 1063, y: 1875, w: 406, h: 31 },
    { x: 1750, y: 1875, w: 719, h: 63 },
    { x: 1031, y: 1906, w: 438, h: 31 },
    { x: 1000, y: 1938, w: 500, h: 63 },
    { x: 1719, y: 1938, w: 750, h: 250 },
    { x: 1031, y: 2000, w: 469, h: 31 },
    { x: 2656, y: 2000, w: 344, h: 63 },
    { x: 1063, y: 2031, w: 438, h: 31 },
    { x: 1125, y: 2063, w: 406, h: 31 },
    { x: 2688, y: 2063, w: 313, h: 188 },
    { x: 1313, y: 2094, w: 219, h: 31 },
    { x: 1344, y: 2125, w: 156, h: 31 },
    { x: 1406, y: 2156, w: 63, h: 31 },
    { x: 1719, y: 2188, w: 781, h: 31 },
    { x: 1688, y: 2219, w: 813, h: 63 },
    { x: 0, y: 2250, w: 656, h: 31 },
    { x: 2656, y: 2250, w: 344, h: 250 },
    { x: 0, y: 2281, w: 688, h: 31 },
    { x: 969, y: 2281, w: 63, h: 31 },
    { x: 1656, y: 2281, w: 813, h: 63 },
    { x: 0, y: 2313, w: 719, h: 31 },
    { x: 969, y: 2313, w: 94, h: 31 },
    { x: 0, y: 2344, w: 781, h: 31 },
    { x: 938, y: 2344, w: 188, h: 31 },
    { x: 1281, y: 2344, w: 31, h: 31 },
    { x: 1625, y: 2344, w: 844, h: 31 },
    { x: 0, y: 2375, w: 1375, h: 31 },
    { x: 1625, y: 2375, w: 813, h: 31 },
    { x: 0, y: 2406, w: 1406, h: 31 },
    { x: 1656, y: 2406, w: 469, h: 31 },
    { x: 2219, y: 2406, w: 94, h: 31 },
    { x: 0, y: 2438, w: 1438, h: 63 },
    { x: 1656, y: 2438, w: 250, h: 31 },
    { x: 0, y: 2500, w: 1406, h: 31 },
    { x: 2625, y: 2500, w: 375, h: 63 },
    { x: 0, y: 2531, w: 1375, h: 156 },
    { x: 2594, y: 2563, w: 406, h: 31 },
    { x: 2094, y: 2594, w: 906, h: 31 },
    { x: 1875, y: 2625, w: 1125, h: 31 },
    { x: 1688, y: 2656, w: 1313, h: 31 },
    { x: 0, y: 2688, w: 1406, h: 31 },
    { x: 1656, y: 2688, w: 1344, h: 31 },
    { x: 0, y: 2719, w: 1438, h: 281 },
    { x: 1625, y: 2719, w: 1375, h: 63 },
    { x: 1781, y: 2781, w: 1219, h: 219 },
  ],

  // Proximity label for the travellers' camp by the river bend.
  buildings: [
    { label: 'Traveller\'s Camp', x: 851, y: 563, r: 344 },
  ],

  entrances: [],

  // The lit campfire at the travellers' camp (code-drawn flames, world.js's
  // drawFire — reused from Calder's torches), plus a wisp of smoke above it.
  fires: [
    { x: 851, y: 523 },
  ],
  smoke: [
    { x: 851, y: 488 },
  ],

  interactables: [],

  // A fishing spot on the west river bank (2026-08-02, Danny). Sits on the
  // water; the player fishes from the reachable bank ~20px east (within the
  // 180px FISH_SPOT_RANGE). Needs a rod + bait like any other spot.
  fishingSpots: [
    { x: 561, y: 1699 },
  ],

  // The bramblekin's stash in the clearing — turned 90° (see world.js's chest
  // rotation). Holds coin, a couple of spoils, and the stolen Royal Summons
  // (a quest item) the player recovers for Mara.
  chests: [
    {
      id: 'c4_clearing_chest',
      x: 1873, y: 1460, rotation: 90,
      locked: false,
      gold: 12,
      items: [
        { id: 'short_sword', qty: 1 },
        { id: 'health_potion', qty: 1 },
        { id: 'royal_summons', qty: 1 },
      ],
    },
  ],

  battles: [],

  // Hidden Rootweaver ambushes on the eastern loop trails (same system as D4's
  // — walk within range and the fight starts; Rootweavers are a "flee for now"
  // wall). `retreat` shoves a fleeing player back down the path far enough that
  // pressing on walks them right back into it (each >range*1.6 away).
  ambushes: [
    { id: 'rootweaver_c4_a', x: 2585, y: 879, range: 141, enemies: ['rootweaver'], retreat: { x: 2344, y: 719 } },
    { id: 'rootweaver_c4_b', x: 2500, y: 2426, range: 141, enemies: ['rootweaver'], retreat: { x: 2079, y: 2500 } },
  ],

  // South back to D4 (band matches D4's top exit, so walking off either edge
  // lands on the other scene's path at the same x). North toward B4 — deeper,
  // more dangerous woods — not built yet (stubbed -> "isn't ready" toast).
  exits: [
    { edge: 'bottom', xMin: 1524, xMax: 1719, to: 'D4', note: 'path south back into the D4 woods' },
    { edge: 'top', xMin: 1329, xMax: 1579, to: 'B4', note: 'path north into deeper woods' },
  ],

  npcs: [
    // ---- The clearing bramblekin PACK (2026-08-02) ----
    // Four roaming `creature` bramblekin (mill via patrol when calm, charge the
    // player on sight — world.js's creature AI, same as D1's cragclaws). The
    // `pack` tag makes them fight as ONE group: striking any of them starts a
    // battle with every alive pack member, and winning removes them all
    // (main.js's pendingAggro handler). They guard the stolen-goods chest.
    // Positioned on the WEST/centre side of the clearing (x<=1035), and aggro
    // trimmed 340 -> 220 (2026-08-02, Danny): so walking the main clearing
    // approach triggers a fight, but the chest can be reached/opened from the
    // EAST sneak corridor (the player opens it from ~256px east of the guards —
    // outside 220 aggro), stealing the loot without waking the pack. All spawn/
    // patrol points engine-verified clear+reachable, and >=168px from the chest.
    {
      id: 'bramblekin_c4_1', name: 'Bramblekin', role: '',
      creature: true, enemyId: 'bramblekin', pack: 'clearing_bramblekin',
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 1524, y: 1430, speed: 40, chaseSpeed: 150, aggroRange: 344, giveUpRange: 875, startsHome: false,
      patrol: [ { x: 1524, y: 1430 }, { x: 1601, y: 1493 } ],
    },
    {
      id: 'bramblekin_c4_2', name: 'Bramblekin', role: '',
      creature: true, enemyId: 'bramblekin', pack: 'clearing_bramblekin',
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 1539, y: 1586, speed: 40, chaseSpeed: 150, aggroRange: 344, giveUpRange: 875, startsHome: false,
      patrol: [ { x: 1539, y: 1586 }, { x: 1469, y: 1649 } ],
    },
    {
      id: 'bramblekin_c4_3', name: 'Bramblekin', role: '',
      creature: true, enemyId: 'bramblekin', pack: 'clearing_bramblekin',
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 1618, y: 1399, speed: 40, chaseSpeed: 150, aggroRange: 344, giveUpRange: 875, startsHome: false,
      patrol: [ { x: 1618, y: 1399 }, { x: 1539, y: 1461 } ],
    },
    {
      id: 'bramblekin_c4_4', name: 'Bramblekin', role: '',
      creature: true, enemyId: 'bramblekin', pack: 'clearing_bramblekin',
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 1570, y: 1680, speed: 40, chaseSpeed: 150, aggroRange: 344, giveUpRange: 875, startsHome: false,
      patrol: [ { x: 1570, y: 1680 }, { x: 1493, y: 1618 } ],
    },

    // ---- Mara Vellorne + Vozhik (2026-08-02) ----
    // Adventurers camped by the fire, robbed by the clearing bramblekin. Mara
    // gives the belongings-recovery quest (state-built dialog in main.js);
    // Vozhik speaks only his own tongue (a beat-machine dialog in main.js).
    // Both wander a short loop near the campfire (545,334).
    {
      id: 'mara_vellorne', name: 'Mara Vellorne', role: 'ADVENTURER',
      sprite: 'assets/images/Mara Vellorne_overhead.png',
      portrait: 'assets/images/Mara Vellorne.png',
      x: 969, y: 579, speed: 40, startsHome: false,
      patrol: [ { x: 969, y: 579 }, { x: 844, y: 469 } ],
    },
    {
      id: 'vozhik', name: 'Vozhik', role: '',
      sprite: 'assets/images/Vozhik_overhead.png',
      portrait: 'assets/images/Vozhik.png',
      x: 719, y: 469, speed: 40, startsHome: false,
      patrol: [ { x: 719, y: 469 }, { x: 875, y: 469 } ],
    },
    // Cinder (2026-08-02) — Mara and Vozhik's horse, grazing by the camp. An
    // animal NPC like D3's Gaffer, but friendly through and through: petting is
    // always warm (no bite), and you can offer her corn (state-built dialog in
    // main.js, buildCinderDialog). A good horse.
    {
      id: 'cinder', name: 'Cinder', role: '',
      sprite: 'assets/images/Cinder_overhead.png',
      portrait: 'assets/images/Cinder.png',
      x: 1125, y: 625, speed: 26, startsHome: false,
      patrol: [ { x: 1125, y: 625 }, { x: 1094, y: 500 } ],
    },
  ],
};
