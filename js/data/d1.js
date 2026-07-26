// Scene D1 — SHIPWRECK COVE (overworld row D, column 1 — the SW corner)
// World coordinates: 1920x1920. Origin top-left.
//
// The art is a tropical shore, not the "grassland" the old overworld notes
// pencilled in for D1 (Danny's D1_Background.jpg overrides that). Layout:
// the open sea fills the WEST edge, a broad sand beach with a half-buried
// shipwreck runs down the centre, and a palm grassland covers the EAST half.
// The dirt road from the D2 Village enters on the RIGHT edge (y~680) and winds
// down-left onto the beach. Sea, rocky headland (SW), the tide pool (SE), the
// dense palm canopy, the fenced hut (NE) and the wreck itself are all
// impassable; the sand + road + open grass are the walkable region.
//
// Collision regenerated 2026-07-24 from Danny's hand-painted walkable guide
// (assets/images/D1_Background_walkable.jpg — red = walkable), same pipeline as
// D2/D4: per-20px-cell red sample, an east-edge apron so the full D2 arrival
// band (y640-720) is walkable, then a 1-cell shoulder dilation so the 36px
// collider fits the ~40px fingers Danny drew up to Calder's hut (too thin to
// survive an erosion). Obstacles are the complement. Verified headless with the
// real engine collider (World.canMove): one connected region, the east exit and
// the hut door both reachable, nothing on open water. Regenerate from the
// walkable guide rather than hand-editing these rects.

export default {
  id: 'D1',
  name: 'Shipwreck Cove',
  background: 'assets/images/D1_Background.jpg',
  width: 1920,
  height: 1920,

  // Just inside the east entrance, on the road (only used on a direct boot into
  // D1 — normal arrival comes through the scene-transition system from D2).
  spawn: { x: 1840, y: 680 },

  obstacles: [
    { x: 0, y: 0, w: 860, h: 40 },
    { x: 1060, y: 0, w: 860, h: 20 },
    { x: 1100, y: 20, w: 820, h: 20 },
    { x: 0, y: 40, w: 840, h: 220 },
    { x: 1120, y: 40, w: 800, h: 20 },
    { x: 1160, y: 60, w: 760, h: 20 },
    { x: 1200, y: 80, w: 720, h: 20 },
    { x: 1220, y: 100, w: 700, h: 20 },
    { x: 1240, y: 120, w: 680, h: 40 },
    { x: 1260, y: 160, w: 660, h: 200 },
    { x: 1040, y: 240, w: 80, h: 260 },
    { x: 1240, y: 240, w: 20, h: 100 },
    { x: 0, y: 260, w: 460, h: 240 },
    { x: 540, y: 260, w: 300, h: 20 },
    { x: 1020, y: 260, w: 20, h: 220 },
    { x: 1220, y: 260, w: 20, h: 60 },
    { x: 560, y: 280, w: 80, h: 20 },
    { x: 700, y: 280, w: 140, h: 20 },
    { x: 980, y: 280, w: 40, h: 80 },
    { x: 560, y: 300, w: 60, h: 20 },
    { x: 760, y: 300, w: 60, h: 20 },
    { x: 560, y: 320, w: 40, h: 20 },
    { x: 560, y: 340, w: 20, h: 80 },
    { x: 1120, y: 340, w: 20, h: 220 },
    { x: 1000, y: 360, w: 20, h: 80 },
    { x: 1340, y: 360, w: 60, h: 20 },
    { x: 1500, y: 360, w: 420, h: 20 },
    { x: 1380, y: 380, w: 20, h: 40 },
    { x: 1520, y: 380, w: 400, h: 60 },
    { x: 1140, y: 420, w: 40, h: 160 },
    { x: 1180, y: 440, w: 40, h: 160 },
    { x: 1400, y: 440, w: 20, h: 20 },
    { x: 1540, y: 440, w: 380, h: 40 },
    { x: 1220, y: 480, w: 20, h: 140 },
    { x: 1560, y: 480, w: 360, h: 80 },
    { x: 0, y: 500, w: 440, h: 500 },
    { x: 740, y: 500, w: 60, h: 220 },
    { x: 1060, y: 500, w: 60, h: 40 },
    { x: 720, y: 520, w: 20, h: 120 },
    { x: 800, y: 520, w: 20, h: 260 },
    { x: 1240, y: 520, w: 20, h: 100 },
    { x: 820, y: 540, w: 20, h: 240 },
    { x: 1100, y: 540, w: 20, h: 20 },
    { x: 1260, y: 540, w: 60, h: 80 },
    { x: 840, y: 560, w: 20, h: 220 },
    { x: 1660, y: 560, w: 260, h: 20 },
    { x: 540, y: 580, w: 20, h: 20 },
    { x: 860, y: 580, w: 20, h: 200 },
    { x: 1160, y: 580, w: 20, h: 20 },
    { x: 1320, y: 580, w: 20, h: 40 },
    { x: 1460, y: 580, w: 20, h: 40 },
    { x: 1760, y: 580, w: 160, h: 20 },
    { x: 520, y: 600, w: 20, h: 340 },
    { x: 880, y: 600, w: 20, h: 180 },
    { x: 1200, y: 600, w: 20, h: 20 },
    { x: 440, y: 620, w: 80, h: 460 },
    { x: 900, y: 620, w: 20, h: 180 },
    { x: 920, y: 640, w: 40, h: 180 },
    { x: 960, y: 660, w: 20, h: 160 },
    { x: 540, y: 700, w: 20, h: 220 },
    { x: 760, y: 720, w: 40, h: 20 },
    { x: 980, y: 720, w: 20, h: 100 },
    { x: 1640, y: 720, w: 40, h: 200 },
    { x: 560, y: 740, w: 40, h: 100 },
    { x: 780, y: 740, w: 20, h: 40 },
    { x: 1000, y: 740, w: 20, h: 80 },
    { x: 1560, y: 740, w: 80, h: 60 },
    { x: 1680, y: 740, w: 80, h: 220 },
    { x: 1020, y: 760, w: 40, h: 80 },
    { x: 1760, y: 760, w: 60, h: 1160 },
    { x: 1060, y: 780, w: 40, h: 120 },
    { x: 1820, y: 780, w: 100, h: 1140 },
    { x: 600, y: 800, w: 20, h: 40 },
    { x: 1100, y: 800, w: 180, h: 40 },
    { x: 1580, y: 800, w: 60, h: 20 },
    { x: 1280, y: 820, w: 20, h: 100 },
    { x: 1600, y: 820, w: 40, h: 20 },
    { x: 560, y: 840, w: 20, h: 20 },
    { x: 1040, y: 840, w: 20, h: 40 },
    { x: 1100, y: 840, w: 60, h: 20 },
    { x: 1260, y: 840, w: 20, h: 20 },
    { x: 1620, y: 840, w: 20, h: 20 },
    { x: 1100, y: 860, w: 40, h: 20 },
    { x: 1100, y: 880, w: 20, h: 20 },
    { x: 1300, y: 900, w: 20, h: 20 },
    { x: 1660, y: 920, w: 20, h: 20 },
    { x: 1700, y: 960, w: 60, h: 140 },
    { x: 0, y: 1000, w: 300, h: 20 },
    { x: 380, y: 1000, w: 60, h: 20 },
    { x: 0, y: 1020, w: 280, h: 40 },
    { x: 400, y: 1020, w: 40, h: 20 },
    { x: 420, y: 1040, w: 20, h: 20 },
    { x: 0, y: 1060, w: 260, h: 20 },
    { x: 0, y: 1080, w: 240, h: 40 },
    { x: 460, y: 1080, w: 40, h: 20 },
    { x: 480, y: 1100, w: 20, h: 40 },
    { x: 1720, y: 1100, w: 40, h: 100 },
    { x: 0, y: 1120, w: 220, h: 120 },
    { x: 220, y: 1200, w: 20, h: 40 },
    { x: 900, y: 1200, w: 20, h: 60 },
    { x: 1740, y: 1200, w: 20, h: 720 },
    { x: 240, y: 1220, w: 20, h: 20 },
    { x: 720, y: 1220, w: 40, h: 700 },
    { x: 880, y: 1220, w: 20, h: 700 },
    { x: 0, y: 1240, w: 160, h: 20 },
    { x: 680, y: 1240, w: 40, h: 680 },
    { x: 760, y: 1240, w: 120, h: 680 },
    { x: 0, y: 1260, w: 140, h: 20 },
    { x: 620, y: 1260, w: 60, h: 660 },
    { x: 0, y: 1280, w: 120, h: 20 },
    { x: 600, y: 1280, w: 20, h: 640 },
    { x: 0, y: 1300, w: 100, h: 20 },
    { x: 580, y: 1300, w: 20, h: 620 },
    { x: 1260, y: 1300, w: 40, h: 620 },
    { x: 0, y: 1320, w: 80, h: 40 },
    { x: 560, y: 1320, w: 20, h: 600 },
    { x: 1300, y: 1320, w: 20, h: 600 },
    { x: 540, y: 1340, w: 20, h: 580 },
    { x: 900, y: 1340, w: 20, h: 580 },
    { x: 1320, y: 1340, w: 160, h: 580 },
    { x: 1720, y: 1340, w: 20, h: 40 },
    { x: 0, y: 1360, w: 60, h: 20 },
    { x: 520, y: 1360, w: 20, h: 560 },
    { x: 1480, y: 1360, w: 40, h: 560 },
    { x: 0, y: 1380, w: 40, h: 540 },
    { x: 920, y: 1380, w: 20, h: 540 },
    { x: 1520, y: 1380, w: 40, h: 540 },
    { x: 480, y: 1400, w: 40, h: 520 },
    { x: 1240, y: 1400, w: 20, h: 520 },
    { x: 400, y: 1420, w: 80, h: 500 },
    { x: 940, y: 1420, w: 20, h: 100 },
    { x: 360, y: 1440, w: 40, h: 480 },
    { x: 1220, y: 1440, w: 20, h: 480 },
    { x: 320, y: 1460, w: 40, h: 460 },
    { x: 1200, y: 1460, w: 20, h: 460 },
    { x: 40, y: 1480, w: 20, h: 440 },
    { x: 300, y: 1480, w: 20, h: 440 },
    { x: 1120, y: 1480, w: 80, h: 440 },
    { x: 1560, y: 1480, w: 20, h: 440 },
    { x: 1720, y: 1480, w: 20, h: 440 },
    { x: 60, y: 1500, w: 20, h: 420 },
    { x: 280, y: 1500, w: 20, h: 420 },
    { x: 1100, y: 1500, w: 20, h: 420 },
    { x: 1580, y: 1500, w: 140, h: 420 },
    { x: 80, y: 1520, w: 200, h: 400 },
    { x: 1080, y: 1620, w: 20, h: 300 },
    { x: 940, y: 1680, w: 20, h: 240 },
    { x: 960, y: 1700, w: 20, h: 220 },
    { x: 1060, y: 1700, w: 20, h: 220 },
    { x: 980, y: 1720, w: 80, h: 200 },
  ],

  // Proximity label (same system as D3's building labels / D4's cave label).
  buildings: [
    { label: 'Shipwreck', x: 380, y: 820, r: 220 },
    { label: 'Calder’s Hut', x: 1440, y: 350, r: 180 },
  ],

  entrances: [],

  // One hidden collectible: a glint in the sand beside the wreck (on the
  // reachable beach just SE of the hull, per the walkable guide).
  interactables: [
    {
      id: 'shiny-wreck-sand',
      x: 545, y: 845, w: 80, h: 80,
      label: 'Something glints in the sand',
      reward: { gold: 5 },
    },
    // Searching the wreck of the Gull's Regret (2026-07-25). Interactable from a
    // wide 250px radius around this point on the hull; `boat: true` is intercepted
    // in main.js's interact() -> searchBoat(), which grants gold + a health potion
    // + Marisol's portrait (Calder's keepsake quest item) ONCE, then reports empty.
    {
      id: 'wreck_search',
      x: 424, y: 949,
      range: 250,
      boat: true,
      label: 'Search the wreck',
      emptyMessage: 'You’ve picked the old wreck clean.',
    },
    // Cave entrance (2026-07-26) — interact to enter the D1B cave. `cave` names
    // the target sub-scene; main.js's enterCave() captures the player's exact
    // position so the cave's exit returns them right here.
    {
      id: 'cave_d1b_entrance',
      x: 1033, y: 1664,
      range: 90,
      cave: 'D1B',
      label: 'Hidden Cave',
    },
  ],

  battles: [],

  // Hidden Mireman ambush (2026-07-25) — an unseen bog-thing in the eastern
  // mire. Same system as D4's Rootweavers: walk within `range` and the fight
  // starts on its own (world.js checkAmbushes / main.js pendingAmbush). No
  // sprite (it's unseen until it rises); killing it clears it for good.
  ambushes: [
    { id: 'mireman_1', x: 1662, y: 1485, range: 180, enemies: ['mireman'] },
  ],

  // Small torch flames flanking the path up to Calder's hut (2026-07-24) —
  // code-drawn flickering fire (World.drawFire), rising from the two torch
  // posts. No asset needed.
  fires: [
    { x: 1445, y: 450 },
    { x: 1509, y: 424 },
  ],

  // Treasure chests (2026-07-24). A locked chest half-buried in the sand at the
  // south end of the beach — 18 gold and a few common supplies. Opening it needs
  // a lockpick; once emptied it's removed. State (locked/looted) persists via the
  // save system.
  chests: [
    {
      id: 'd1_beach_chest',
      x: 284, y: 1347,
      locked: true,
      gold: 18,
      items: [
        { id: 'bread', qty: 2 },
        { id: 'health_potion', qty: 1 },
        { id: 'torch', qty: 1 },
      ],
    },
  ],

  // ---- NPCs ----
  // Calder Rusk (2026-07-24) — a retired pirate marooned in the beach hut up in
  // the NE grassland. His ship (the wreck on the sand) ran aground; the crew
  // rowed north and he stayed. Gregarious, glad of company, and warns travelers
  // about the creatures that crawl up from the tide. He never leaves the hut
  // (startsHome + no routine -> permanently atHome, never rendered as a body,
  // so he needs only a portrait, no overhead sprite): knock at his door and the
  // dialog opens over the interior, same as any home NPC. The ~40px walkable
  // fingers Danny painted up to the hut are what make the door reachable.
  npcs: [
    // Cragclaws (2026-07-25): roaming beach creatures that mill about their
    // patch of sand, then charge the player on sight (world.js `creature`
    // behavior — chase within aggroRange 400, fight on contact via its
    // `enemyId`). `defeated` persists per-World + in the save (npcsDefeated),
    // so a slain cragclaw stays gone. No queen cragclaw yet.
    {
      id: 'cragclaw_1', name: 'Cragclaw', creature: true, enemyId: 'cragclaw',
      sprite: 'assets/images/cragclaw_overhead.png',
      portrait: 'assets/images/cragclaw.png',
      x: 443, y: 1257, speed: 34, chaseSpeed: 140, aggroRange: 400,
      startsHome: false,
      patrol: [
        { x: 443, y: 1257 },
        { x: 503, y: 1297 },
        { x: 393, y: 1307 },
      ],
    },
    {
      id: 'cragclaw_2', name: 'Cragclaw', creature: true, enemyId: 'cragclaw',
      sprite: 'assets/images/cragclaw_overhead.png',
      portrait: 'assets/images/cragclaw.png',
      x: 689, y: 826, speed: 34, chaseSpeed: 140, aggroRange: 400,
      startsHome: false,
      patrol: [
        { x: 689, y: 826 },
        { x: 749, y: 866 },
        { x: 639, y: 876 },
      ],
    },
    {
      id: 'calder_rusk',
      name: 'Calder Rusk',
      role: 'RETIRED PIRATE',
      portrait: 'assets/images/calder_rusk.png',
      startsHome: true,
      home: {
        door: { x: 1439, y: 364 }, // the hut's doorway (Danny, 2026-07-24)
        interior: 'assets/images/beach_hut_interior.jpg',
      },
      // Calder's dialogue is STATE-BUILT in main.js (buildCalderDialog), not
      // static here (2026-07-25): the backstory + dangers branches gate a
      // keepsake quest that only appears once both are heard, and the quest has
      // active / turn-in / completed states. Routed via openNpcDialog's
      // calder_rusk branch, like Gaffer/the Chief.
    },
  ],

  // East back to the D2 Village (band matches D2's west exit, y640-720, so
  // walking off either edge lands on the other scene's road at the same
  // height). West is open sea, north/south are cliffs — no exits there.
  exits: [
    { edge: 'right', yMin: 640, yMax: 720, to: 'D2', note: 'road east to the Village' },
  ],
};
