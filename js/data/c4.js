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
  width: 1920,
  height: 1920,

  // Just inside the south (D4-facing) edge — only used on a direct boot; normal
  // arrival comes up through the scene-transition system onto the bottom band.
  spawn: { x: 1037, y: 1860 },

  obstacles: [
    { x: 0, y: 0, w: 800, h: 20 },
    { x: 1040, y: 0, w: 880, h: 80 },
    { x: 0, y: 20, w: 780, h: 20 },
    { x: 0, y: 40, w: 720, h: 20 },
    { x: 0, y: 60, w: 700, h: 20 },
    { x: 0, y: 80, w: 680, h: 60 },
    { x: 960, y: 80, w: 960, h: 20 },
    { x: 980, y: 100, w: 940, h: 20 },
    { x: 1000, y: 120, w: 920, h: 20 },
    { x: 0, y: 140, w: 700, h: 20 },
    { x: 1100, y: 140, w: 820, h: 20 },
    { x: 0, y: 160, w: 480, h: 40 },
    { x: 580, y: 160, w: 180, h: 20 },
    { x: 1120, y: 160, w: 800, h: 20 },
    { x: 640, y: 180, w: 60, h: 20 },
    { x: 1140, y: 180, w: 780, h: 20 },
    { x: 0, y: 200, w: 360, h: 20 },
    { x: 440, y: 200, w: 40, h: 40 },
    { x: 660, y: 200, w: 40, h: 20 },
    { x: 1160, y: 200, w: 300, h: 20 },
    { x: 1540, y: 200, w: 380, h: 20 },
    { x: 0, y: 220, w: 260, h: 100 },
    { x: 660, y: 220, w: 20, h: 40 },
    { x: 1180, y: 220, w: 220, h: 20 },
    { x: 1560, y: 220, w: 360, h: 60 },
    { x: 440, y: 240, w: 60, h: 20 },
    { x: 1200, y: 240, w: 120, h: 20 },
    { x: 480, y: 260, w: 20, h: 40 },
    { x: 900, y: 260, w: 20, h: 20 },
    { x: 880, y: 280, w: 60, h: 60 },
    { x: 1580, y: 280, w: 340, h: 40 },
    { x: 0, y: 320, w: 360, h: 20 },
    { x: 1600, y: 320, w: 320, h: 20 },
    { x: 0, y: 340, w: 380, h: 20 },
    { x: 900, y: 340, w: 20, h: 20 },
    { x: 1640, y: 340, w: 280, h: 20 },
    { x: 0, y: 360, w: 400, h: 20 },
    { x: 1060, y: 360, w: 60, h: 20 },
    { x: 1340, y: 360, w: 80, h: 20 },
    { x: 1660, y: 360, w: 260, h: 40 },
    { x: 0, y: 380, w: 420, h: 20 },
    { x: 1040, y: 380, w: 180, h: 20 },
    { x: 1320, y: 380, w: 140, h: 20 },
    { x: 0, y: 400, w: 400, h: 20 },
    { x: 1040, y: 400, w: 460, h: 20 },
    { x: 1680, y: 400, w: 240, h: 80 },
    { x: 0, y: 420, w: 380, h: 20 },
    { x: 1040, y: 420, w: 480, h: 20 },
    { x: 0, y: 440, w: 360, h: 20 },
    { x: 1040, y: 440, w: 520, h: 40 },
    { x: 0, y: 460, w: 280, h: 120 },
    { x: 500, y: 460, w: 20, h: 20 },
    { x: 500, y: 480, w: 100, h: 20 },
    { x: 840, y: 480, w: 60, h: 20 },
    { x: 1020, y: 480, w: 560, h: 40 },
    { x: 1700, y: 480, w: 220, h: 60 },
    { x: 520, y: 500, w: 80, h: 20 },
    { x: 820, y: 500, w: 100, h: 20 },
    { x: 520, y: 520, w: 60, h: 20 },
    { x: 800, y: 520, w: 120, h: 20 },
    { x: 1040, y: 520, w: 540, h: 20 },
    { x: 780, y: 540, w: 140, h: 20 },
    { x: 1040, y: 540, w: 560, h: 60 },
    { x: 1720, y: 540, w: 200, h: 60 },
    { x: 780, y: 560, w: 160, h: 20 },
    { x: 0, y: 580, w: 300, h: 20 },
    { x: 760, y: 580, w: 180, h: 80 },
    { x: 0, y: 600, w: 320, h: 60 },
    { x: 1040, y: 600, w: 580, h: 60 },
    { x: 1740, y: 600, w: 180, h: 40 },
    { x: 1760, y: 640, w: 160, h: 200 },
    { x: 0, y: 660, w: 360, h: 20 },
    { x: 740, y: 660, w: 180, h: 20 },
    { x: 1040, y: 660, w: 600, h: 40 },
    { x: 0, y: 680, w: 420, h: 60 },
    { x: 700, y: 680, w: 220, h: 20 },
    { x: 640, y: 700, w: 260, h: 20 },
    { x: 1060, y: 700, w: 580, h: 20 },
    { x: 620, y: 720, w: 260, h: 40 },
    { x: 1080, y: 720, w: 560, h: 20 },
    { x: 0, y: 740, w: 380, h: 20 },
    { x: 1100, y: 740, w: 560, h: 20 },
    { x: 0, y: 760, w: 360, h: 220 },
    { x: 600, y: 760, w: 280, h: 20 },
    { x: 1120, y: 760, w: 540, h: 20 },
    { x: 600, y: 780, w: 260, h: 20 },
    { x: 1140, y: 780, w: 520, h: 20 },
    { x: 580, y: 800, w: 280, h: 20 },
    { x: 1160, y: 800, w: 500, h: 20 },
    { x: 560, y: 820, w: 300, h: 20 },
    { x: 1180, y: 820, w: 480, h: 40 },
    { x: 560, y: 840, w: 280, h: 20 },
    { x: 1780, y: 840, w: 140, h: 40 },
    { x: 580, y: 860, w: 240, h: 20 },
    { x: 1200, y: 860, w: 460, h: 20 },
    { x: 580, y: 880, w: 220, h: 20 },
    { x: 1320, y: 880, w: 240, h: 20 },
    { x: 1620, y: 880, w: 40, h: 20 },
    { x: 1800, y: 880, w: 120, h: 100 },
    { x: 580, y: 900, w: 200, h: 20 },
    { x: 1340, y: 900, w: 180, h: 20 },
    { x: 580, y: 920, w: 180, h: 20 },
    { x: 1380, y: 920, w: 120, h: 20 },
    { x: 580, y: 940, w: 160, h: 80 },
    { x: 1400, y: 940, w: 20, h: 20 },
    { x: 0, y: 980, w: 380, h: 200 },
    { x: 1780, y: 980, w: 140, h: 40 },
    { x: 600, y: 1020, w: 120, h: 20 },
    { x: 1760, y: 1020, w: 160, h: 40 },
    { x: 620, y: 1040, w: 80, h: 20 },
    { x: 1300, y: 1040, w: 20, h: 20 },
    { x: 620, y: 1060, w: 40, h: 20 },
    { x: 1240, y: 1060, w: 120, h: 20 },
    { x: 1740, y: 1060, w: 180, h: 40 },
    { x: 1200, y: 1080, w: 360, h: 20 },
    { x: 1200, y: 1100, w: 380, h: 20 },
    { x: 1720, y: 1100, w: 200, h: 20 },
    { x: 800, y: 1120, w: 60, h: 20 },
    { x: 1180, y: 1120, w: 400, h: 40 },
    { x: 1700, y: 1120, w: 220, h: 40 },
    { x: 780, y: 1140, w: 120, h: 20 },
    { x: 740, y: 1160, w: 180, h: 20 },
    { x: 1160, y: 1160, w: 420, h: 20 },
    { x: 1680, y: 1160, w: 240, h: 120 },
    { x: 0, y: 1180, w: 420, h: 20 },
    { x: 720, y: 1180, w: 200, h: 20 },
    { x: 1140, y: 1180, w: 440, h: 20 },
    { x: 0, y: 1200, w: 400, h: 240 },
    { x: 680, y: 1200, w: 260, h: 20 },
    { x: 1120, y: 1200, w: 460, h: 40 },
    { x: 660, y: 1220, w: 280, h: 20 },
    { x: 640, y: 1240, w: 320, h: 40 },
    { x: 1100, y: 1240, w: 480, h: 160 },
    { x: 660, y: 1280, w: 300, h: 20 },
    { x: 1700, y: 1280, w: 220, h: 40 },
    { x: 680, y: 1300, w: 280, h: 20 },
    { x: 720, y: 1320, w: 260, h: 20 },
    { x: 1720, y: 1320, w: 200, h: 120 },
    { x: 840, y: 1340, w: 140, h: 20 },
    { x: 860, y: 1360, w: 100, h: 20 },
    { x: 900, y: 1380, w: 40, h: 20 },
    { x: 1100, y: 1400, w: 500, h: 20 },
    { x: 1080, y: 1420, w: 520, h: 40 },
    { x: 0, y: 1440, w: 420, h: 20 },
    { x: 1700, y: 1440, w: 220, h: 160 },
    { x: 0, y: 1460, w: 440, h: 20 },
    { x: 620, y: 1460, w: 40, h: 20 },
    { x: 1060, y: 1460, w: 520, h: 40 },
    { x: 0, y: 1480, w: 460, h: 20 },
    { x: 620, y: 1480, w: 60, h: 20 },
    { x: 0, y: 1500, w: 500, h: 20 },
    { x: 600, y: 1500, w: 120, h: 20 },
    { x: 820, y: 1500, w: 20, h: 20 },
    { x: 1040, y: 1500, w: 540, h: 20 },
    { x: 0, y: 1520, w: 880, h: 20 },
    { x: 1040, y: 1520, w: 520, h: 20 },
    { x: 0, y: 1540, w: 900, h: 20 },
    { x: 1060, y: 1540, w: 300, h: 20 },
    { x: 1420, y: 1540, w: 60, h: 20 },
    { x: 0, y: 1560, w: 920, h: 40 },
    { x: 1060, y: 1560, w: 160, h: 20 },
    { x: 0, y: 1600, w: 900, h: 20 },
    { x: 1680, y: 1600, w: 240, h: 40 },
    { x: 0, y: 1620, w: 880, h: 100 },
    { x: 1660, y: 1640, w: 260, h: 20 },
    { x: 1340, y: 1660, w: 580, h: 20 },
    { x: 1200, y: 1680, w: 720, h: 20 },
    { x: 1080, y: 1700, w: 840, h: 20 },
    { x: 0, y: 1720, w: 900, h: 20 },
    { x: 1060, y: 1720, w: 860, h: 20 },
    { x: 0, y: 1740, w: 920, h: 180 },
    { x: 1040, y: 1740, w: 880, h: 40 },
    { x: 1140, y: 1780, w: 780, h: 140 },
  ],

  // Proximity label for the travellers' camp by the river bend.
  buildings: [
    { label: 'Traveller\'s Camp', x: 545, y: 360, r: 220 },
  ],

  entrances: [],

  // The lit campfire at the travellers' camp (code-drawn flames, world.js's
  // drawFire — reused from Calder's torches), plus a wisp of smoke above it.
  fires: [
    { x: 545, y: 334 },
  ],
  smoke: [
    { x: 545, y: 312 },
  ],

  interactables: [],

  // A fishing spot on the west river bank (2026-08-02, Danny). Sits on the
  // water; the player fishes from the reachable bank ~20px east (within the
  // 180px FISH_SPOT_RANGE). Needs a rod + bait like any other spot.
  fishingSpots: [
    { x: 359, y: 1087 },
  ],

  // The bramblekin's stash in the clearing — turned 90° (see world.js's chest
  // rotation). Holds coin, a couple of spoils, and the stolen Royal Summons
  // (a quest item) the player recovers for Mara.
  chests: [
    {
      id: 'c4_clearing_chest',
      x: 1198, y: 934, rotation: 90,
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
    { id: 'rootweaver_c4_a', x: 1654, y: 562, range: 90, enemies: ['rootweaver'], retreat: { x: 1500, y: 460 } },
    { id: 'rootweaver_c4_b', x: 1600, y: 1553, range: 90, enemies: ['rootweaver'], retreat: { x: 1330, y: 1600 } },
  ],

  // South back to D4 (band matches D4's top exit, so walking off either edge
  // lands on the other scene's path at the same x). North toward B4 — deeper,
  // more dangerous woods — not built yet (stubbed -> "isn't ready" toast).
  exits: [
    { edge: 'bottom', xMin: 975, xMax: 1100, to: 'D4', note: 'path south back into the D4 woods' },
    { edge: 'top', xMin: 850, xMax: 1010, to: 'B4', note: 'path north into deeper woods' },
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
      x: 975, y: 915, speed: 40, chaseSpeed: 150, aggroRange: 220, giveUpRange: 560, startsHome: false,
      patrol: [ { x: 975, y: 915 }, { x: 1025, y: 955 } ],
    },
    {
      id: 'bramblekin_c4_2', name: 'Bramblekin', role: '',
      creature: true, enemyId: 'bramblekin', pack: 'clearing_bramblekin',
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 985, y: 1015, speed: 40, chaseSpeed: 150, aggroRange: 220, giveUpRange: 560, startsHome: false,
      patrol: [ { x: 985, y: 1015 }, { x: 940, y: 1055 } ],
    },
    {
      id: 'bramblekin_c4_3', name: 'Bramblekin', role: '',
      creature: true, enemyId: 'bramblekin', pack: 'clearing_bramblekin',
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 1035, y: 895, speed: 40, chaseSpeed: 150, aggroRange: 220, giveUpRange: 560, startsHome: false,
      patrol: [ { x: 1035, y: 895 }, { x: 985, y: 935 } ],
    },
    {
      id: 'bramblekin_c4_4', name: 'Bramblekin', role: '',
      creature: true, enemyId: 'bramblekin', pack: 'clearing_bramblekin',
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 1005, y: 1075, speed: 40, chaseSpeed: 150, aggroRange: 220, giveUpRange: 560, startsHome: false,
      patrol: [ { x: 1005, y: 1075 }, { x: 955, y: 1035 } ],
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
      x: 620, y: 370, speed: 40, startsHome: false,
      patrol: [ { x: 620, y: 370 }, { x: 540, y: 300 } ],
    },
    {
      id: 'vozhik', name: 'Vozhik', role: '',
      sprite: 'assets/images/Vozhik_overhead.png',
      portrait: 'assets/images/Vozhik.png',
      x: 460, y: 300, speed: 40, startsHome: false,
      patrol: [ { x: 460, y: 300 }, { x: 560, y: 300 } ],
    },
    // Cinder (2026-08-02) — Mara and Vozhik's horse, grazing by the camp. An
    // animal NPC like D3's Gaffer, but friendly through and through: petting is
    // always warm (no bite), and you can offer her corn (state-built dialog in
    // main.js, buildCinderDialog). A good horse.
    {
      id: 'cinder', name: 'Cinder', role: '',
      sprite: 'assets/images/Cinder_overhead.png',
      portrait: 'assets/images/Cinder.png',
      x: 720, y: 400, speed: 26, startsHome: false,
      patrol: [ { x: 720, y: 400 }, { x: 700, y: 320 } ],
    },
  ],
};
