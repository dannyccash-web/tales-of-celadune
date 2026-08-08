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
  width: 2400,
  height: 2400,

  // Just inside the east entrance, on the road (only used on a direct boot into
  // D1 — normal arrival comes through the scene-transition system from D2).
  spawn: { x: 2300, y: 850 },

  obstacles: [
    { x: 0, y: 0, w: 1075, h: 50 },
    { x: 1325, y: 0, w: 1075, h: 25 },
    { x: 1375, y: 25, w: 1025, h: 25 },
    { x: 0, y: 50, w: 1050, h: 275 },
    { x: 1400, y: 50, w: 1000, h: 25 },
    { x: 1450, y: 75, w: 950, h: 25 },
    { x: 1500, y: 100, w: 900, h: 25 },
    { x: 1525, y: 125, w: 875, h: 25 },
    { x: 1550, y: 150, w: 850, h: 50 },
    { x: 1575, y: 200, w: 825, h: 250 },
    { x: 1300, y: 300, w: 100, h: 325 },
    { x: 1550, y: 300, w: 25, h: 125 },
    { x: 0, y: 325, w: 575, h: 300 },
    { x: 675, y: 325, w: 375, h: 25 },
    { x: 1275, y: 325, w: 25, h: 275 },
    { x: 1525, y: 325, w: 25, h: 75 },
    { x: 700, y: 350, w: 100, h: 25 },
    { x: 875, y: 350, w: 175, h: 25 },
    { x: 1225, y: 350, w: 50, h: 100 },
    { x: 700, y: 375, w: 75, h: 25 },
    { x: 950, y: 375, w: 75, h: 25 },
    { x: 700, y: 400, w: 50, h: 25 },
    { x: 700, y: 425, w: 25, h: 100 },
    { x: 1400, y: 425, w: 25, h: 275 },
    { x: 1250, y: 450, w: 25, h: 100 },
    { x: 1675, y: 450, w: 75, h: 25 },
    { x: 1875, y: 450, w: 525, h: 25 },
    { x: 1725, y: 475, w: 25, h: 50 },
    { x: 1900, y: 475, w: 500, h: 75 },
    { x: 1425, y: 525, w: 50, h: 200 },
    { x: 1475, y: 550, w: 50, h: 200 },
    { x: 1750, y: 550, w: 25, h: 25 },
    { x: 1925, y: 550, w: 475, h: 50 },
    { x: 1525, y: 600, w: 25, h: 175 },
    { x: 1950, y: 600, w: 450, h: 100 },
    { x: 0, y: 625, w: 550, h: 625 },
    { x: 925, y: 625, w: 75, h: 275 },
    { x: 1325, y: 625, w: 75, h: 50 },
    { x: 900, y: 650, w: 25, h: 150 },
    { x: 1000, y: 650, w: 25, h: 325 },
    { x: 1550, y: 650, w: 25, h: 125 },
    { x: 1025, y: 675, w: 25, h: 300 },
    { x: 1375, y: 675, w: 25, h: 25 },
    { x: 1575, y: 675, w: 75, h: 100 },
    { x: 1050, y: 700, w: 25, h: 275 },
    { x: 2075, y: 700, w: 325, h: 25 },
    { x: 675, y: 725, w: 25, h: 25 },
    { x: 1075, y: 725, w: 25, h: 250 },
    { x: 1450, y: 725, w: 25, h: 25 },
    { x: 1650, y: 725, w: 25, h: 50 },
    { x: 1825, y: 725, w: 25, h: 50 },
    { x: 2200, y: 725, w: 200, h: 25 },
    { x: 650, y: 750, w: 25, h: 425 },
    { x: 1100, y: 750, w: 25, h: 225 },
    { x: 1500, y: 750, w: 25, h: 25 },
    { x: 550, y: 775, w: 100, h: 575 },
    { x: 1125, y: 775, w: 25, h: 225 },
    { x: 1150, y: 800, w: 50, h: 225 },
    { x: 1200, y: 825, w: 25, h: 200 },
    { x: 675, y: 875, w: 25, h: 275 },
    { x: 950, y: 900, w: 50, h: 25 },
    { x: 1225, y: 900, w: 25, h: 125 },
    { x: 2050, y: 900, w: 50, h: 250 },
    { x: 700, y: 925, w: 50, h: 125 },
    { x: 975, y: 925, w: 25, h: 50 },
    { x: 1250, y: 925, w: 25, h: 100 },
    { x: 1950, y: 925, w: 100, h: 75 },
    { x: 2100, y: 925, w: 100, h: 275 },
    { x: 1275, y: 950, w: 50, h: 100 },
    { x: 2200, y: 950, w: 75, h: 1450 },
    { x: 1325, y: 975, w: 50, h: 150 },
    { x: 2275, y: 975, w: 125, h: 1425 },
    { x: 750, y: 1000, w: 25, h: 50 },
    { x: 1375, y: 1000, w: 225, h: 50 },
    { x: 1975, y: 1000, w: 75, h: 25 },
    { x: 1600, y: 1025, w: 25, h: 125 },
    { x: 2000, y: 1025, w: 50, h: 25 },
    { x: 700, y: 1050, w: 25, h: 25 },
    { x: 1300, y: 1050, w: 25, h: 50 },
    { x: 1375, y: 1050, w: 75, h: 25 },
    { x: 1575, y: 1050, w: 25, h: 25 },
    { x: 2025, y: 1050, w: 25, h: 25 },
    { x: 1375, y: 1075, w: 50, h: 25 },
    { x: 1375, y: 1100, w: 25, h: 25 },
    { x: 1625, y: 1125, w: 25, h: 25 },
    { x: 2075, y: 1150, w: 25, h: 25 },
    { x: 2125, y: 1200, w: 75, h: 175 },
    { x: 0, y: 1250, w: 375, h: 25 },
    { x: 475, y: 1250, w: 75, h: 25 },
    { x: 0, y: 1275, w: 350, h: 50 },
    { x: 500, y: 1275, w: 50, h: 25 },
    { x: 525, y: 1300, w: 25, h: 25 },
    { x: 0, y: 1325, w: 325, h: 25 },
    { x: 0, y: 1350, w: 300, h: 50 },
    { x: 575, y: 1350, w: 50, h: 25 },
    { x: 600, y: 1375, w: 25, h: 50 },
    { x: 2150, y: 1375, w: 50, h: 125 },
    { x: 0, y: 1400, w: 275, h: 150 },
    { x: 275, y: 1500, w: 25, h: 50 },
    { x: 1125, y: 1500, w: 25, h: 75 },
    { x: 2175, y: 1500, w: 25, h: 900 },
    { x: 300, y: 1525, w: 25, h: 25 },
    { x: 900, y: 1525, w: 50, h: 875 },
    { x: 1100, y: 1525, w: 25, h: 875 },
    { x: 0, y: 1550, w: 200, h: 25 },
    { x: 850, y: 1550, w: 50, h: 850 },
    { x: 950, y: 1550, w: 150, h: 850 },
    { x: 0, y: 1575, w: 175, h: 25 },
    { x: 775, y: 1575, w: 75, h: 825 },
    { x: 0, y: 1600, w: 150, h: 25 },
    { x: 750, y: 1600, w: 25, h: 800 },
    { x: 0, y: 1625, w: 125, h: 25 },
    { x: 725, y: 1625, w: 25, h: 775 },
    { x: 1575, y: 1625, w: 50, h: 775 },
    { x: 0, y: 1650, w: 100, h: 50 },
    { x: 700, y: 1650, w: 25, h: 750 },
    { x: 1625, y: 1650, w: 25, h: 750 },
    { x: 675, y: 1675, w: 25, h: 725 },
    { x: 1125, y: 1675, w: 25, h: 725 },
    { x: 1650, y: 1675, w: 200, h: 725 },
    { x: 2150, y: 1675, w: 25, h: 50 },
    { x: 0, y: 1700, w: 75, h: 25 },
    { x: 650, y: 1700, w: 25, h: 700 },
    { x: 1850, y: 1700, w: 50, h: 700 },
    { x: 0, y: 1725, w: 50, h: 675 },
    { x: 1150, y: 1725, w: 25, h: 675 },
    { x: 1900, y: 1725, w: 50, h: 675 },
    { x: 600, y: 1750, w: 50, h: 650 },
    { x: 1550, y: 1750, w: 25, h: 650 },
    { x: 500, y: 1775, w: 100, h: 625 },
    { x: 1175, y: 1775, w: 25, h: 125 },
    { x: 450, y: 1800, w: 50, h: 600 },
    { x: 1525, y: 1800, w: 25, h: 600 },
    { x: 400, y: 1825, w: 50, h: 575 },
    { x: 1500, y: 1825, w: 25, h: 575 },
    { x: 50, y: 1850, w: 25, h: 550 },
    { x: 375, y: 1850, w: 25, h: 550 },
    { x: 1400, y: 1850, w: 100, h: 550 },
    { x: 1950, y: 1850, w: 25, h: 550 },
    { x: 2150, y: 1850, w: 25, h: 550 },
    { x: 75, y: 1875, w: 25, h: 525 },
    { x: 350, y: 1875, w: 25, h: 525 },
    { x: 1375, y: 1875, w: 25, h: 525 },
    { x: 1975, y: 1875, w: 175, h: 525 },
    { x: 100, y: 1900, w: 250, h: 500 },
    { x: 1350, y: 2025, w: 25, h: 375 },
    { x: 1175, y: 2100, w: 25, h: 300 },
    { x: 1200, y: 2125, w: 25, h: 275 },
    { x: 1325, y: 2125, w: 25, h: 275 },
    { x: 1225, y: 2150, w: 100, h: 250 },
  ],

  // Proximity label (same system as D3's building labels / D4's cave label).
  buildings: [
    // No standalone 'Shipwreck' proximity label here (2026-07-28): the wreck is
    // interactable (search it), so its single label rides on that interactable
    // below — one label per thing, shown exactly when you can press space.
    { label: 'Calder’s Hut', x: 1800, y: 438, r: 225 },
  ],

  entrances: [],

  // One hidden collectible: a glint in the sand beside the wreck (on the
  // reachable beach just SE of the hull, per the walkable guide).
  interactables: [
    {
      id: 'shiny-wreck-sand',
      x: 681, y: 1056, w: 100, h: 100,
      label: 'Something glints in the sand',
      reward: { gold: 5 },
    },
    // Searching the wreck of the Gull's Regret (2026-07-25). Interactable from a
    // wide 250px radius around this point on the hull; `boat: true` is intercepted
    // in main.js's interact() -> searchBoat(), which grants gold + a health potion
    // + Marisol's portrait (Calder's keepsake quest item) ONCE, then reports empty.
    {
      id: 'wreck_search',
      x: 530, y: 1186,
      range: 313,
      boat: true,
      label: 'Shipwreck', // single label for the wreck (2026-07-28) — was a
                          // separate 'Shipwreck' building label + 'Search the wreck'
      emptyMessage: 'You’ve picked the old wreck clean.',
    },
    // Cave entrance (2026-07-26) — interact to enter the D1B cave. `cave` names
    // the target sub-scene; main.js's enterCave() captures the player's exact
    // position so the cave's exit returns them right here.
    {
      id: 'cave_d1b_entrance',
      x: 1291, y: 2080,
      range: 113,
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
    { id: 'mireman_1', x: 2078, y: 1856, range: 225, enemies: ['mireman'] },
  ],

  // Small torch flames flanking the path up to Calder's hut (2026-07-24) —
  // code-drawn flickering fire (World.drawFire), rising from the two torch
  // posts. No asset needed.
  fires: [
    { x: 1806, y: 563 },
    { x: 1886, y: 530 },
  ],

  // Treasure chests (2026-07-24). A locked chest half-buried in the sand at the
  // south end of the beach — 18 gold and a few common supplies. Opening it needs
  // a lockpick; once emptied it's removed. State (locked/looted) persists via the
  // save system.
  chests: [
    {
      id: 'd1_beach_chest',
      x: 355, y: 1684,
      locked: true,
      gold: 18,
      items: [
        // Torch moved to Emeric's general store (2026-07-28, Danny) — buyable
        // directly there now, so it's no longer in this chest.
        { id: 'bread', qty: 2 },
        { id: 'health_potion', qty: 1 },
        { id: 'leather_boots', qty: 1 },
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
      x: 554, y: 1571, speed: 34, chaseSpeed: 140, aggroRange: 500,
      startsHome: false,
      patrol: [
        { x: 554, y: 1571 },
        { x: 629, y: 1621 },
        { x: 491, y: 1634 },
      ],
    },
    {
      id: 'cragclaw_2', name: 'Cragclaw', creature: true, enemyId: 'cragclaw',
      sprite: 'assets/images/cragclaw_overhead.png',
      portrait: 'assets/images/cragclaw.png',
      x: 861, y: 1033, speed: 34, chaseSpeed: 140, aggroRange: 500,
      startsHome: false,
      patrol: [
        { x: 861, y: 1033 },
        { x: 936, y: 1083 },
        { x: 799, y: 1095 },
      ],
    },
    {
      id: 'calder_rusk',
      name: 'Calder Rusk',
      role: 'RETIRED PIRATE',
      portrait: 'assets/images/calder_rusk.png',
      startsHome: true,
      home: {
        door: { x: 1799, y: 455 }, // the hut's doorway (Danny, 2026-07-24)
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
    { edge: 'right', yMin: 800, yMax: 900, to: 'D2', note: 'road east to the Village' },
  ],
};
