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
  width: 2400,
  height: 2400,

  // Just inside the south (D4-facing) edge — only used on a direct boot; normal
  // arrival comes up through the scene-transition system onto the bottom band.
  spawn: { x: 1296, y: 2325 },

  obstacles: [
    { x: 0, y: 0, w: 1000, h: 25 },
    { x: 1300, y: 0, w: 1100, h: 100 },
    { x: 0, y: 25, w: 975, h: 25 },
    { x: 0, y: 50, w: 900, h: 25 },
    { x: 0, y: 75, w: 875, h: 25 },
    { x: 0, y: 100, w: 850, h: 75 },
    { x: 1200, y: 100, w: 1200, h: 25 },
    { x: 1225, y: 125, w: 1175, h: 25 },
    { x: 1250, y: 150, w: 1150, h: 25 },
    { x: 0, y: 175, w: 875, h: 25 },
    { x: 1375, y: 175, w: 1025, h: 25 },
    { x: 0, y: 200, w: 600, h: 50 },
    { x: 725, y: 200, w: 225, h: 25 },
    { x: 1400, y: 200, w: 1000, h: 25 },
    { x: 800, y: 225, w: 75, h: 25 },
    { x: 1425, y: 225, w: 975, h: 25 },
    { x: 0, y: 250, w: 450, h: 25 },
    { x: 550, y: 250, w: 50, h: 50 },
    { x: 825, y: 250, w: 50, h: 25 },
    { x: 1450, y: 250, w: 375, h: 25 },
    { x: 1925, y: 250, w: 475, h: 25 },
    { x: 0, y: 275, w: 325, h: 125 },
    { x: 825, y: 275, w: 25, h: 50 },
    { x: 1475, y: 275, w: 275, h: 25 },
    { x: 1950, y: 275, w: 450, h: 75 },
    { x: 550, y: 300, w: 75, h: 25 },
    { x: 1500, y: 300, w: 150, h: 25 },
    { x: 600, y: 325, w: 25, h: 50 },
    { x: 1125, y: 325, w: 25, h: 25 },
    { x: 1100, y: 350, w: 75, h: 75 },
    { x: 1975, y: 350, w: 425, h: 50 },
    { x: 0, y: 400, w: 450, h: 25 },
    { x: 2000, y: 400, w: 400, h: 25 },
    { x: 0, y: 425, w: 475, h: 25 },
    { x: 1125, y: 425, w: 25, h: 25 },
    { x: 2050, y: 425, w: 350, h: 25 },
    { x: 0, y: 450, w: 500, h: 25 },
    { x: 1325, y: 450, w: 75, h: 25 },
    { x: 1675, y: 450, w: 100, h: 25 },
    { x: 2075, y: 450, w: 325, h: 50 },
    { x: 0, y: 475, w: 525, h: 25 },
    { x: 1300, y: 475, w: 225, h: 25 },
    { x: 1650, y: 475, w: 175, h: 25 },
    { x: 0, y: 500, w: 500, h: 25 },
    { x: 1300, y: 500, w: 575, h: 25 },
    { x: 2100, y: 500, w: 300, h: 100 },
    { x: 0, y: 525, w: 475, h: 25 },
    { x: 1300, y: 525, w: 600, h: 25 },
    { x: 0, y: 550, w: 450, h: 25 },
    { x: 1300, y: 550, w: 650, h: 50 },
    { x: 0, y: 575, w: 350, h: 150 },
    { x: 625, y: 575, w: 25, h: 25 },
    { x: 625, y: 600, w: 125, h: 25 },
    { x: 1050, y: 600, w: 75, h: 25 },
    { x: 1275, y: 600, w: 700, h: 50 },
    { x: 2125, y: 600, w: 275, h: 75 },
    { x: 650, y: 625, w: 100, h: 25 },
    { x: 1025, y: 625, w: 125, h: 25 },
    { x: 650, y: 650, w: 75, h: 25 },
    { x: 1000, y: 650, w: 150, h: 25 },
    { x: 1300, y: 650, w: 675, h: 25 },
    { x: 975, y: 675, w: 175, h: 25 },
    { x: 1300, y: 675, w: 700, h: 75 },
    { x: 2150, y: 675, w: 250, h: 75 },
    { x: 975, y: 700, w: 200, h: 25 },
    { x: 0, y: 725, w: 375, h: 25 },
    { x: 950, y: 725, w: 225, h: 100 },
    { x: 0, y: 750, w: 400, h: 75 },
    { x: 1300, y: 750, w: 725, h: 75 },
    { x: 2175, y: 750, w: 225, h: 50 },
    { x: 2200, y: 800, w: 200, h: 250 },
    { x: 0, y: 825, w: 450, h: 25 },
    { x: 925, y: 825, w: 225, h: 25 },
    { x: 1300, y: 825, w: 750, h: 50 },
    { x: 0, y: 850, w: 525, h: 75 },
    { x: 875, y: 850, w: 275, h: 25 },
    { x: 800, y: 875, w: 325, h: 25 },
    { x: 1325, y: 875, w: 725, h: 25 },
    { x: 775, y: 900, w: 325, h: 50 },
    { x: 1350, y: 900, w: 700, h: 25 },
    { x: 0, y: 925, w: 475, h: 25 },
    { x: 1375, y: 925, w: 700, h: 25 },
    { x: 0, y: 950, w: 450, h: 275 },
    { x: 750, y: 950, w: 350, h: 25 },
    { x: 1400, y: 950, w: 675, h: 25 },
    { x: 750, y: 975, w: 325, h: 25 },
    { x: 1425, y: 975, w: 650, h: 25 },
    { x: 725, y: 1000, w: 350, h: 25 },
    { x: 1450, y: 1000, w: 625, h: 25 },
    { x: 700, y: 1025, w: 375, h: 25 },
    { x: 1475, y: 1025, w: 600, h: 50 },
    { x: 700, y: 1050, w: 350, h: 25 },
    { x: 2225, y: 1050, w: 175, h: 50 },
    { x: 725, y: 1075, w: 300, h: 25 },
    { x: 1500, y: 1075, w: 575, h: 25 },
    { x: 725, y: 1100, w: 275, h: 25 },
    { x: 1650, y: 1100, w: 300, h: 25 },
    { x: 2025, y: 1100, w: 50, h: 25 },
    { x: 2250, y: 1100, w: 150, h: 125 },
    { x: 725, y: 1125, w: 250, h: 25 },
    { x: 1675, y: 1125, w: 225, h: 25 },
    { x: 725, y: 1150, w: 225, h: 25 },
    { x: 1725, y: 1150, w: 150, h: 25 },
    { x: 725, y: 1175, w: 200, h: 100 },
    { x: 1750, y: 1175, w: 25, h: 25 },
    { x: 0, y: 1225, w: 475, h: 250 },
    { x: 2225, y: 1225, w: 175, h: 50 },
    { x: 750, y: 1275, w: 150, h: 25 },
    { x: 2200, y: 1275, w: 200, h: 50 },
    { x: 775, y: 1300, w: 100, h: 25 },
    { x: 1625, y: 1300, w: 25, h: 25 },
    { x: 775, y: 1325, w: 50, h: 25 },
    { x: 1550, y: 1325, w: 150, h: 25 },
    { x: 2175, y: 1325, w: 225, h: 50 },
    { x: 1500, y: 1350, w: 450, h: 25 },
    { x: 1500, y: 1375, w: 475, h: 25 },
    { x: 2150, y: 1375, w: 250, h: 25 },
    { x: 1000, y: 1400, w: 75, h: 25 },
    { x: 1475, y: 1400, w: 500, h: 50 },
    { x: 2125, y: 1400, w: 275, h: 50 },
    { x: 975, y: 1425, w: 150, h: 25 },
    { x: 925, y: 1450, w: 225, h: 25 },
    { x: 1450, y: 1450, w: 525, h: 25 },
    { x: 2100, y: 1450, w: 300, h: 150 },
    { x: 0, y: 1475, w: 525, h: 25 },
    { x: 900, y: 1475, w: 250, h: 25 },
    { x: 1425, y: 1475, w: 550, h: 25 },
    { x: 0, y: 1500, w: 500, h: 300 },
    { x: 850, y: 1500, w: 325, h: 25 },
    { x: 1400, y: 1500, w: 575, h: 50 },
    { x: 825, y: 1525, w: 350, h: 25 },
    { x: 800, y: 1550, w: 400, h: 50 },
    { x: 1375, y: 1550, w: 600, h: 200 },
    { x: 825, y: 1600, w: 375, h: 25 },
    { x: 2125, y: 1600, w: 275, h: 50 },
    { x: 850, y: 1625, w: 350, h: 25 },
    { x: 900, y: 1650, w: 325, h: 25 },
    { x: 2150, y: 1650, w: 250, h: 150 },
    { x: 1050, y: 1675, w: 175, h: 25 },
    { x: 1075, y: 1700, w: 125, h: 25 },
    { x: 1125, y: 1725, w: 50, h: 25 },
    { x: 1375, y: 1750, w: 625, h: 25 },
    { x: 1350, y: 1775, w: 650, h: 50 },
    { x: 0, y: 1800, w: 525, h: 25 },
    { x: 2125, y: 1800, w: 275, h: 200 },
    { x: 0, y: 1825, w: 550, h: 25 },
    { x: 775, y: 1825, w: 50, h: 25 },
    { x: 1325, y: 1825, w: 650, h: 50 },
    { x: 0, y: 1850, w: 575, h: 25 },
    { x: 775, y: 1850, w: 75, h: 25 },
    { x: 0, y: 1875, w: 625, h: 25 },
    { x: 750, y: 1875, w: 150, h: 25 },
    { x: 1025, y: 1875, w: 25, h: 25 },
    { x: 1300, y: 1875, w: 675, h: 25 },
    { x: 0, y: 1900, w: 1100, h: 25 },
    { x: 1300, y: 1900, w: 650, h: 25 },
    { x: 0, y: 1925, w: 1125, h: 25 },
    { x: 1325, y: 1925, w: 375, h: 25 },
    { x: 1775, y: 1925, w: 75, h: 25 },
    { x: 0, y: 1950, w: 1150, h: 50 },
    { x: 1325, y: 1950, w: 200, h: 25 },
    { x: 0, y: 2000, w: 1125, h: 25 },
    { x: 2100, y: 2000, w: 300, h: 50 },
    { x: 0, y: 2025, w: 1100, h: 125 },
    { x: 2075, y: 2050, w: 325, h: 25 },
    { x: 1675, y: 2075, w: 725, h: 25 },
    { x: 1500, y: 2100, w: 900, h: 25 },
    { x: 1350, y: 2125, w: 1050, h: 25 },
    { x: 0, y: 2150, w: 1125, h: 25 },
    { x: 1325, y: 2150, w: 1075, h: 25 },
    { x: 0, y: 2175, w: 1150, h: 225 },
    { x: 1300, y: 2175, w: 1100, h: 50 },
    { x: 1425, y: 2225, w: 975, h: 175 },
  ],

  // Proximity label for the travellers' camp by the river bend.
  buildings: [
    { label: 'Traveller\'s Camp', x: 681, y: 450, r: 275 },
  ],

  entrances: [],

  // The lit campfire at the travellers' camp (code-drawn flames, world.js's
  // drawFire — reused from Calder's torches), plus a wisp of smoke above it.
  fires: [
    { x: 681, y: 418 },
  ],
  smoke: [
    { x: 681, y: 390 },
  ],

  interactables: [],

  // A fishing spot on the west river bank (2026-08-02, Danny). Sits on the
  // water; the player fishes from the reachable bank ~20px east (within the
  // 180px FISH_SPOT_RANGE). Needs a rod + bait like any other spot.
  fishingSpots: [
    { x: 449, y: 1359 },
  ],

  // The bramblekin's stash in the clearing — turned 90° (see world.js's chest
  // rotation). Holds coin, a couple of spoils, and the stolen Royal Summons
  // (a quest item) the player recovers for Mara.
  chests: [
    {
      id: 'c4_clearing_chest',
      x: 1498, y: 1168, rotation: 90,
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
    { id: 'rootweaver_c4_a', x: 2068, y: 703, range: 113, enemies: ['rootweaver'], retreat: { x: 1875, y: 575 } },
    { id: 'rootweaver_c4_b', x: 2000, y: 1941, range: 113, enemies: ['rootweaver'], retreat: { x: 1663, y: 2000 } },
  ],

  // South back to D4 (band matches D4's top exit, so walking off either edge
  // lands on the other scene's path at the same x). North toward B4 — deeper,
  // more dangerous woods — not built yet (stubbed -> "isn't ready" toast).
  exits: [
    { edge: 'bottom', xMin: 1219, xMax: 1375, to: 'D4', note: 'path south back into the D4 woods' },
    { edge: 'top', xMin: 1063, xMax: 1263, to: 'B4', note: 'path north into deeper woods' },
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
      x: 1219, y: 1144, speed: 40, chaseSpeed: 150, aggroRange: 275, giveUpRange: 700, startsHome: false,
      patrol: [ { x: 1219, y: 1144 }, { x: 1281, y: 1194 } ],
    },
    {
      id: 'bramblekin_c4_2', name: 'Bramblekin', role: '',
      creature: true, enemyId: 'bramblekin', pack: 'clearing_bramblekin',
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 1231, y: 1269, speed: 40, chaseSpeed: 150, aggroRange: 275, giveUpRange: 700, startsHome: false,
      patrol: [ { x: 1231, y: 1269 }, { x: 1175, y: 1319 } ],
    },
    {
      id: 'bramblekin_c4_3', name: 'Bramblekin', role: '',
      creature: true, enemyId: 'bramblekin', pack: 'clearing_bramblekin',
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 1294, y: 1119, speed: 40, chaseSpeed: 150, aggroRange: 275, giveUpRange: 700, startsHome: false,
      patrol: [ { x: 1294, y: 1119 }, { x: 1231, y: 1169 } ],
    },
    {
      id: 'bramblekin_c4_4', name: 'Bramblekin', role: '',
      creature: true, enemyId: 'bramblekin', pack: 'clearing_bramblekin',
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 1256, y: 1344, speed: 40, chaseSpeed: 150, aggroRange: 275, giveUpRange: 700, startsHome: false,
      patrol: [ { x: 1256, y: 1344 }, { x: 1194, y: 1294 } ],
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
      x: 775, y: 463, speed: 40, startsHome: false,
      patrol: [ { x: 775, y: 463 }, { x: 675, y: 375 } ],
    },
    {
      id: 'vozhik', name: 'Vozhik', role: '',
      sprite: 'assets/images/Vozhik_overhead.png',
      portrait: 'assets/images/Vozhik.png',
      x: 575, y: 375, speed: 40, startsHome: false,
      patrol: [ { x: 575, y: 375 }, { x: 700, y: 375 } ],
    },
    // Cinder (2026-08-02) — Mara and Vozhik's horse, grazing by the camp. An
    // animal NPC like D3's Gaffer, but friendly through and through: petting is
    // always warm (no bite), and you can offer her corn (state-built dialog in
    // main.js, buildCinderDialog). A good horse.
    {
      id: 'cinder', name: 'Cinder', role: '',
      sprite: 'assets/images/Cinder_overhead.png',
      portrait: 'assets/images/Cinder.png',
      x: 900, y: 500, speed: 26, startsHome: false,
      patrol: [ { x: 900, y: 500 }, { x: 875, y: 400 } ],
    },
  ],
};
