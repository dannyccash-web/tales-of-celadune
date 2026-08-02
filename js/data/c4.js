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
// Collision generated 2026-08-02 from the art itself (no hand-painted walkable
// guide existed for C4). Per-20px-cell colour classification — a UNION of a
// bright-dirt rule and a shadow-tolerant warm-brown rule (the shaded eastern
// trails were too dark for a single brightness threshold) — then a
// dilate/erode close, connected-component from the bottom arrival, a 1-cell
// shoulder dilation, and carved exit aprons. Engine-verified with the real 36px
// circle collider (BFS): one connected floor; the D4 exit band, the top (B4)
// stub, the clearing, the chest, the campfire camp, both Rootweaver points and
// all four bramblekin waypoints are reachable. Regenerate from the art (see the
// session scripts) rather than hand-editing.

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
    { x: 0, y: 0, w: 220, h: 60 },
    { x: 320, y: 0, w: 500, h: 20 },
    { x: 1060, y: 0, w: 860, h: 100 },
    { x: 340, y: 20, w: 380, h: 40 },
    { x: 0, y: 60, w: 260, h: 60 },
    { x: 380, y: 60, w: 340, h: 20 },
    { x: 420, y: 80, w: 320, h: 40 },
    { x: 1080, y: 100, w: 840, h: 60 },
    { x: 0, y: 120, w: 240, h: 180 },
    { x: 420, y: 120, w: 60, h: 20 },
    { x: 540, y: 120, w: 200, h: 20 },
    { x: 460, y: 140, w: 20, h: 40 },
    { x: 540, y: 140, w: 100, h: 20 },
    { x: 700, y: 140, w: 40, h: 20 },
    { x: 1000, y: 140, w: 20, h: 20 },
    { x: 540, y: 160, w: 80, h: 20 },
    { x: 720, y: 160, w: 80, h: 20 },
    { x: 1000, y: 160, w: 920, h: 20 },
    { x: 560, y: 180, w: 60, h: 20 },
    { x: 780, y: 180, w: 20, h: 20 },
    { x: 1040, y: 180, w: 880, h: 40 },
    { x: 800, y: 200, w: 20, h: 40 },
    { x: 1100, y: 220, w: 820, h: 40 },
    { x: 360, y: 240, w: 40, h: 20 },
    { x: 860, y: 240, w: 40, h: 40 },
    { x: 780, y: 260, w: 20, h: 40 },
    { x: 1200, y: 260, w: 120, h: 20 },
    { x: 1380, y: 260, w: 540, h: 20 },
    { x: 880, y: 280, w: 40, h: 20 },
    { x: 1500, y: 280, w: 420, h: 20 },
    { x: 0, y: 300, w: 220, h: 180 },
    { x: 880, y: 300, w: 60, h: 40 },
    { x: 1540, y: 300, w: 380, h: 20 },
    { x: 1580, y: 320, w: 340, h: 20 },
    { x: 400, y: 340, w: 40, h: 40 },
    { x: 900, y: 340, w: 40, h: 20 },
    { x: 1040, y: 340, w: 20, h: 20 },
    { x: 1660, y: 340, w: 260, h: 20 },
    { x: 920, y: 360, w: 20, h: 20 },
    { x: 1080, y: 360, w: 40, h: 20 },
    { x: 1240, y: 360, w: 220, h: 20 },
    { x: 1680, y: 360, w: 240, h: 20 },
    { x: 300, y: 380, w: 140, h: 20 },
    { x: 680, y: 380, w: 20, h: 20 },
    { x: 1080, y: 380, w: 400, h: 20 },
    { x: 1700, y: 380, w: 220, h: 20 },
    { x: 300, y: 400, w: 180, h: 40 },
    { x: 660, y: 400, w: 40, h: 20 },
    { x: 1080, y: 400, w: 340, h: 20 },
    { x: 1740, y: 400, w: 180, h: 60 },
    { x: 1060, y: 420, w: 360, h: 20 },
    { x: 320, y: 440, w: 160, h: 40 },
    { x: 1060, y: 440, w: 320, h: 20 },
    { x: 1520, y: 440, w: 40, h: 20 },
    { x: 1040, y: 460, w: 340, h: 40 },
    { x: 1520, y: 460, w: 60, h: 20 },
    { x: 1700, y: 460, w: 220, h: 20 },
    { x: 0, y: 480, w: 240, h: 40 },
    { x: 340, y: 480, w: 120, h: 20 },
    { x: 1480, y: 480, w: 100, h: 20 },
    { x: 1780, y: 480, w: 140, h: 60 },
    { x: 380, y: 500, w: 80, h: 60 },
    { x: 560, y: 500, w: 20, h: 20 },
    { x: 800, y: 500, w: 20, h: 20 },
    { x: 1040, y: 500, w: 380, h: 20 },
    { x: 1480, y: 500, w: 120, h: 20 },
    { x: 0, y: 520, w: 260, h: 40 },
    { x: 780, y: 520, w: 20, h: 20 },
    { x: 900, y: 520, w: 20, h: 20 },
    { x: 1060, y: 520, w: 540, h: 40 },
    { x: 760, y: 540, w: 20, h: 20 },
    { x: 1700, y: 540, w: 220, h: 60 },
    { x: 0, y: 560, w: 280, h: 40 },
    { x: 380, y: 560, w: 20, h: 40 },
    { x: 1120, y: 560, w: 500, h: 60 },
    { x: 0, y: 600, w: 300, h: 60 },
    { x: 880, y: 600, w: 40, h: 20 },
    { x: 1720, y: 600, w: 200, h: 80 },
    { x: 800, y: 620, w: 20, h: 40 },
    { x: 880, y: 620, w: 60, h: 40 },
    { x: 1080, y: 620, w: 560, h: 60 },
    { x: 0, y: 660, w: 320, h: 100 },
    { x: 780, y: 660, w: 160, h: 20 },
    { x: 420, y: 680, w: 40, h: 20 },
    { x: 760, y: 680, w: 180, h: 20 },
    { x: 1020, y: 680, w: 640, h: 40 },
    { x: 1740, y: 680, w: 180, h: 340 },
    { x: 440, y: 700, w: 20, h: 20 },
    { x: 680, y: 700, w: 20, h: 80 },
    { x: 760, y: 700, w: 160, h: 40 },
    { x: 1060, y: 720, w: 540, h: 20 },
    { x: 780, y: 740, w: 140, h: 40 },
    { x: 1100, y: 740, w: 500, h: 40 },
    { x: 0, y: 760, w: 340, h: 20 },
    { x: 0, y: 780, w: 320, h: 20 },
    { x: 680, y: 780, w: 40, h: 20 },
    { x: 780, y: 780, w: 120, h: 20 },
    { x: 1120, y: 780, w: 540, h: 20 },
    { x: 0, y: 800, w: 340, h: 40 },
    { x: 700, y: 800, w: 180, h: 20 },
    { x: 1120, y: 800, w: 100, h: 20 },
    { x: 1280, y: 800, w: 380, h: 20 },
    { x: 700, y: 820, w: 160, h: 20 },
    { x: 1140, y: 820, w: 80, h: 20 },
    { x: 1280, y: 820, w: 400, h: 60 },
    { x: 0, y: 840, w: 360, h: 360 },
    { x: 740, y: 840, w: 100, h: 40 },
    { x: 1200, y: 840, w: 20, h: 20 },
    { x: 640, y: 880, w: 20, h: 20 },
    { x: 740, y: 880, w: 80, h: 20 },
    { x: 1300, y: 880, w: 360, h: 40 },
    { x: 560, y: 900, w: 260, h: 60 },
    { x: 1320, y: 920, w: 340, h: 20 },
    { x: 1380, y: 940, w: 280, h: 20 },
    { x: 580, y: 960, w: 60, h: 20 },
    { x: 700, y: 960, w: 80, h: 60 },
    { x: 1400, y: 960, w: 260, h: 20 },
    { x: 1400, y: 980, w: 240, h: 40 },
    { x: 680, y: 1020, w: 140, h: 20 },
    { x: 1360, y: 1020, w: 280, h: 20 },
    { x: 1720, y: 1020, w: 200, h: 60 },
    { x: 600, y: 1040, w: 200, h: 20 },
    { x: 1320, y: 1040, w: 300, h: 20 },
    { x: 640, y: 1060, w: 160, h: 20 },
    { x: 1320, y: 1060, w: 280, h: 20 },
    { x: 680, y: 1080, w: 120, h: 20 },
    { x: 1220, y: 1080, w: 20, h: 20 },
    { x: 1300, y: 1080, w: 300, h: 20 },
    { x: 1700, y: 1080, w: 220, h: 20 },
    { x: 680, y: 1100, w: 200, h: 20 },
    { x: 1200, y: 1100, w: 40, h: 20 },
    { x: 1300, y: 1100, w: 280, h: 60 },
    { x: 1720, y: 1100, w: 200, h: 20 },
    { x: 700, y: 1120, w: 180, h: 60 },
    { x: 1180, y: 1120, w: 60, h: 40 },
    { x: 1740, y: 1120, w: 180, h: 100 },
    { x: 620, y: 1160, w: 20, h: 20 },
    { x: 1160, y: 1160, w: 420, h: 40 },
    { x: 620, y: 1180, w: 280, h: 20 },
    { x: 0, y: 1200, w: 380, h: 140 },
    { x: 640, y: 1200, w: 320, h: 20 },
    { x: 1140, y: 1200, w: 440, h: 20 },
    { x: 680, y: 1220, w: 300, h: 80 },
    { x: 1160, y: 1220, w: 420, h: 60 },
    { x: 1660, y: 1220, w: 260, h: 20 },
    { x: 1680, y: 1240, w: 240, h: 20 },
    { x: 1700, y: 1260, w: 220, h: 200 },
    { x: 1140, y: 1280, w: 440, h: 20 },
    { x: 680, y: 1300, w: 320, h: 20 },
    { x: 1140, y: 1300, w: 460, h: 40 },
    { x: 720, y: 1320, w: 260, h: 40 },
    { x: 0, y: 1340, w: 400, h: 100 },
    { x: 1100, y: 1340, w: 500, h: 40 },
    { x: 780, y: 1360, w: 200, h: 20 },
    { x: 920, y: 1380, w: 20, h: 20 },
    { x: 1100, y: 1380, w: 520, h: 20 },
    { x: 1080, y: 1400, w: 540, h: 20 },
    { x: 1060, y: 1420, w: 560, h: 40 },
    { x: 0, y: 1440, w: 380, h: 80 },
    { x: 460, y: 1460, w: 40, h: 20 },
    { x: 580, y: 1460, w: 40, h: 20 },
    { x: 1060, y: 1460, w: 540, h: 40 },
    { x: 1680, y: 1460, w: 240, h: 60 },
    { x: 480, y: 1480, w: 180, h: 40 },
    { x: 720, y: 1480, w: 20, h: 40 },
    { x: 1060, y: 1500, w: 520, h: 20 },
    { x: 0, y: 1520, w: 360, h: 20 },
    { x: 480, y: 1520, w: 120, h: 20 },
    { x: 700, y: 1520, w: 40, h: 20 },
    { x: 820, y: 1520, w: 20, h: 20 },
    { x: 1060, y: 1520, w: 500, h: 20 },
    { x: 1660, y: 1520, w: 260, h: 40 },
    { x: 0, y: 1540, w: 340, h: 80 },
    { x: 460, y: 1540, w: 40, h: 20 },
    { x: 700, y: 1540, w: 140, h: 40 },
    { x: 1060, y: 1540, w: 460, h: 20 },
    { x: 460, y: 1560, w: 20, h: 40 },
    { x: 1060, y: 1560, w: 380, h: 20 },
    { x: 1640, y: 1560, w: 280, h: 20 },
    { x: 660, y: 1580, w: 200, h: 20 },
    { x: 1080, y: 1580, w: 140, h: 20 },
    { x: 1620, y: 1580, w: 300, h: 20 },
    { x: 740, y: 1600, w: 120, h: 20 },
    { x: 1080, y: 1600, w: 60, h: 20 },
    { x: 1600, y: 1600, w: 320, h: 20 },
    { x: 0, y: 1620, w: 320, h: 20 },
    { x: 1560, y: 1620, w: 360, h: 20 },
    { x: 0, y: 1640, w: 340, h: 20 },
    { x: 600, y: 1640, w: 40, h: 20 },
    { x: 1380, y: 1640, w: 20, h: 20 },
    { x: 1460, y: 1640, w: 460, h: 20 },
    { x: 0, y: 1660, w: 320, h: 100 },
    { x: 720, y: 1660, w: 20, h: 60 },
    { x: 1360, y: 1660, w: 560, h: 60 },
    { x: 500, y: 1680, w: 40, h: 20 },
    { x: 860, y: 1680, w: 40, h: 20 },
    { x: 480, y: 1700, w: 60, h: 20 },
    { x: 880, y: 1700, w: 20, h: 20 },
    { x: 1180, y: 1700, w: 20, h: 20 },
    { x: 460, y: 1720, w: 80, h: 20 },
    { x: 660, y: 1720, w: 80, h: 20 },
    { x: 1260, y: 1720, w: 660, h: 40 },
    { x: 420, y: 1740, w: 60, h: 40 },
    { x: 540, y: 1740, w: 60, h: 40 },
    { x: 660, y: 1740, w: 140, h: 40 },
    { x: 1060, y: 1740, w: 40, h: 40 },
    { x: 0, y: 1760, w: 340, h: 60 },
    { x: 1160, y: 1760, w: 20, h: 20 },
    { x: 1240, y: 1760, w: 680, h: 20 },
    { x: 660, y: 1780, w: 260, h: 40 },
    { x: 1160, y: 1780, w: 760, h: 140 },
    { x: 0, y: 1820, w: 360, h: 40 },
    { x: 660, y: 1820, w: 220, h: 20 },
    { x: 500, y: 1840, w: 380, h: 60 },
    { x: 0, y: 1860, w: 380, h: 40 },
    { x: 0, y: 1900, w: 400, h: 20 },
    { x: 500, y: 1900, w: 420, h: 20 },
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
    {
      id: 'bramblekin_c4_1', name: 'Bramblekin', role: '',
      creature: true, enemyId: 'bramblekin', pack: 'clearing_bramblekin',
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 980, y: 970, speed: 40, chaseSpeed: 150, aggroRange: 340, giveUpRange: 560, startsHome: false,
      patrol: [ { x: 980, y: 970 }, { x: 1030, y: 1010 } ],
    },
    {
      id: 'bramblekin_c4_2', name: 'Bramblekin', role: '',
      creature: true, enemyId: 'bramblekin', pack: 'clearing_bramblekin',
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 1120, y: 1015, speed: 40, chaseSpeed: 150, aggroRange: 340, giveUpRange: 560, startsHome: false,
      patrol: [ { x: 1120, y: 1015 }, { x: 1075, y: 975 } ],
    },
    {
      id: 'bramblekin_c4_3', name: 'Bramblekin', role: '',
      creature: true, enemyId: 'bramblekin', pack: 'clearing_bramblekin',
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 1045, y: 1085, speed: 40, chaseSpeed: 150, aggroRange: 340, giveUpRange: 560, startsHome: false,
      patrol: [ { x: 1045, y: 1085 }, { x: 995, y: 1045 } ],
    },
    {
      id: 'bramblekin_c4_4', name: 'Bramblekin', role: '',
      creature: true, enemyId: 'bramblekin', pack: 'clearing_bramblekin',
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 1105, y: 945, speed: 40, chaseSpeed: 150, aggroRange: 340, giveUpRange: 560, startsHome: false,
      patrol: [ { x: 1105, y: 945 }, { x: 1145, y: 980 } ],
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
