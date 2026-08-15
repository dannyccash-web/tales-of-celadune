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
  width: 3000,
  height: 3000,

  // Just inside the east entrance, on the road (only used on a direct boot into
  // D1 — normal arrival comes through the scene-transition system from D2).
  spawn: { x: 2875, y: 1063 },

  obstacles: [
    { x: 0, y: 0, w: 1344, h: 63 },
    { x: 1656, y: 0, w: 1344, h: 31 },
    { x: 1719, y: 31, w: 1281, h: 31 },
    { x: 0, y: 63, w: 1313, h: 344 },
    { x: 1750, y: 63, w: 1250, h: 31 },
    { x: 1813, y: 94, w: 1188, h: 31 },
    { x: 1875, y: 125, w: 1125, h: 31 },
    { x: 1906, y: 156, w: 1094, h: 31 },
    { x: 1938, y: 188, w: 1063, h: 63 },
    { x: 1969, y: 250, w: 1031, h: 313 },
    { x: 1625, y: 375, w: 125, h: 406 },
    { x: 1938, y: 375, w: 31, h: 156 },
    { x: 0, y: 406, w: 719, h: 375 },
    { x: 844, y: 406, w: 469, h: 31 },
    { x: 1594, y: 406, w: 31, h: 344 },
    { x: 1906, y: 406, w: 31, h: 94 },
    { x: 875, y: 438, w: 125, h: 31 },
    { x: 1094, y: 438, w: 219, h: 31 },
    { x: 1531, y: 438, w: 63, h: 125 },
    { x: 875, y: 469, w: 94, h: 31 },
    { x: 1188, y: 469, w: 94, h: 31 },
    { x: 875, y: 500, w: 63, h: 31 },
    { x: 875, y: 531, w: 31, h: 125 },
    { x: 1750, y: 531, w: 31, h: 344 },
    { x: 1563, y: 563, w: 31, h: 125 },
    { x: 2094, y: 563, w: 94, h: 31 },
    { x: 2344, y: 563, w: 656, h: 31 },
    { x: 2156, y: 594, w: 31, h: 63 },
    { x: 2375, y: 594, w: 625, h: 94 },
    { x: 1781, y: 656, w: 63, h: 250 },
    { x: 1844, y: 688, w: 63, h: 250 },
    { x: 2188, y: 688, w: 31, h: 31 },
    { x: 2406, y: 688, w: 594, h: 63 },
    { x: 1906, y: 750, w: 31, h: 219 },
    { x: 2438, y: 750, w: 563, h: 125 },
    { x: 0, y: 781, w: 688, h: 781 },
    { x: 1156, y: 781, w: 94, h: 344 },
    { x: 1656, y: 781, w: 94, h: 63 },
    { x: 1125, y: 813, w: 31, h: 188 },
    { x: 1250, y: 813, w: 31, h: 406 },
    { x: 1938, y: 813, w: 31, h: 156 },
    { x: 1281, y: 844, w: 31, h: 375 },
    { x: 1719, y: 844, w: 31, h: 31 },
    { x: 1969, y: 844, w: 94, h: 125 },
    { x: 1313, y: 875, w: 31, h: 344 },
    { x: 2594, y: 875, w: 406, h: 31 },
    { x: 844, y: 906, w: 31, h: 31 },
    { x: 1344, y: 906, w: 31, h: 313 },
    { x: 1813, y: 906, w: 31, h: 31 },
    { x: 2063, y: 906, w: 31, h: 63 },
    { x: 2281, y: 906, w: 31, h: 63 },
    { x: 2750, y: 906, w: 250, h: 31 },
    { x: 813, y: 938, w: 31, h: 531 },
    { x: 1375, y: 938, w: 31, h: 281 },
    { x: 1875, y: 938, w: 31, h: 31 },
    { x: 688, y: 969, w: 125, h: 719 },
    { x: 1406, y: 969, w: 31, h: 281 },
    { x: 1438, y: 1000, w: 63, h: 281 },
    { x: 1500, y: 1031, w: 31, h: 250 },
    { x: 844, y: 1094, w: 31, h: 344 },
    { x: 1188, y: 1125, w: 63, h: 31 },
    { x: 1531, y: 1125, w: 31, h: 156 },
    { x: 2563, y: 1125, w: 63, h: 313 },
    { x: 875, y: 1156, w: 63, h: 156 },
    { x: 1219, y: 1156, w: 31, h: 63 },
    { x: 1563, y: 1156, w: 31, h: 125 },
    { x: 2438, y: 1156, w: 125, h: 94 },
    { x: 2625, y: 1156, w: 125, h: 344 },
    { x: 1594, y: 1188, w: 63, h: 125 },
    { x: 2750, y: 1188, w: 94, h: 1813 },
    { x: 1656, y: 1219, w: 63, h: 188 },
    { x: 2844, y: 1219, w: 156, h: 1781 },
    { x: 938, y: 1250, w: 31, h: 63 },
    { x: 1719, y: 1250, w: 281, h: 63 },
    { x: 2469, y: 1250, w: 94, h: 31 },
    { x: 2000, y: 1281, w: 31, h: 156 },
    { x: 2500, y: 1281, w: 63, h: 31 },
    { x: 875, y: 1313, w: 31, h: 31 },
    { x: 1625, y: 1313, w: 31, h: 63 },
    { x: 1719, y: 1313, w: 94, h: 31 },
    { x: 1969, y: 1313, w: 31, h: 31 },
    { x: 2531, y: 1313, w: 31, h: 31 },
    { x: 1719, y: 1344, w: 63, h: 31 },
    { x: 1719, y: 1375, w: 31, h: 31 },
    { x: 2031, y: 1406, w: 31, h: 31 },
    { x: 2594, y: 1438, w: 31, h: 31 },
    { x: 2656, y: 1500, w: 94, h: 219 },
    { x: 0, y: 1563, w: 469, h: 31 },
    { x: 594, y: 1563, w: 94, h: 31 },
    { x: 0, y: 1594, w: 438, h: 63 },
    { x: 625, y: 1594, w: 63, h: 31 },
    { x: 656, y: 1625, w: 31, h: 31 },
    { x: 0, y: 1656, w: 406, h: 31 },
    { x: 0, y: 1688, w: 375, h: 63 },
    { x: 719, y: 1688, w: 63, h: 31 },
    { x: 750, y: 1719, w: 31, h: 63 },
    { x: 2688, y: 1719, w: 63, h: 156 },
    { x: 0, y: 1750, w: 344, h: 188 },
    { x: 344, y: 1875, w: 31, h: 63 },
    { x: 1406, y: 1875, w: 31, h: 94 },
    { x: 2719, y: 1875, w: 31, h: 1125 },
    { x: 375, y: 1906, w: 31, h: 31 },
    { x: 1125, y: 1906, w: 63, h: 1094 },
    { x: 1375, y: 1906, w: 31, h: 1094 },
    { x: 0, y: 1938, w: 250, h: 31 },
    { x: 1063, y: 1938, w: 63, h: 1063 },
    { x: 1188, y: 1938, w: 188, h: 1063 },
    { x: 0, y: 1969, w: 219, h: 31 },
    { x: 969, y: 1969, w: 94, h: 1031 },
    { x: 0, y: 2000, w: 188, h: 31 },
    { x: 938, y: 2000, w: 31, h: 1000 },
    { x: 0, y: 2031, w: 156, h: 31 },
    { x: 906, y: 2031, w: 31, h: 969 },
    { x: 1969, y: 2031, w: 63, h: 969 },
    { x: 0, y: 2063, w: 125, h: 63 },
    { x: 875, y: 2063, w: 31, h: 938 },
    { x: 2031, y: 2063, w: 31, h: 938 },
    { x: 844, y: 2094, w: 31, h: 906 },
    { x: 1406, y: 2094, w: 31, h: 906 },
    { x: 2063, y: 2094, w: 250, h: 906 },
    { x: 2688, y: 2094, w: 31, h: 63 },
    { x: 0, y: 2125, w: 94, h: 31 },
    { x: 813, y: 2125, w: 31, h: 875 },
    { x: 2313, y: 2125, w: 63, h: 875 },
    { x: 0, y: 2156, w: 63, h: 844 },
    { x: 1438, y: 2156, w: 31, h: 844 },
    { x: 2375, y: 2156, w: 63, h: 844 },
    { x: 750, y: 2188, w: 63, h: 813 },
    { x: 1938, y: 2188, w: 31, h: 813 },
    { x: 625, y: 2219, w: 125, h: 781 },
    { x: 1469, y: 2219, w: 31, h: 156 },
    { x: 563, y: 2250, w: 63, h: 750 },
    { x: 1906, y: 2250, w: 31, h: 750 },
    { x: 500, y: 2281, w: 63, h: 719 },
    { x: 1875, y: 2281, w: 31, h: 719 },
    { x: 63, y: 2313, w: 31, h: 688 },
    { x: 469, y: 2313, w: 31, h: 688 },
    { x: 1750, y: 2313, w: 125, h: 688 },
    { x: 2438, y: 2313, w: 31, h: 688 },
    { x: 2688, y: 2313, w: 31, h: 688 },
    { x: 94, y: 2344, w: 31, h: 656 },
    { x: 438, y: 2344, w: 31, h: 656 },
    { x: 1719, y: 2344, w: 31, h: 656 },
    { x: 2469, y: 2344, w: 219, h: 656 },
    { x: 125, y: 2375, w: 313, h: 625 },
    { x: 1688, y: 2531, w: 31, h: 469 },
    { x: 1469, y: 2625, w: 31, h: 375 },
    { x: 1500, y: 2656, w: 31, h: 344 },
    { x: 1656, y: 2656, w: 31, h: 344 },
    { x: 1531, y: 2688, w: 125, h: 313 },
  ],

  // Proximity label (same system as D3's building labels / D4's cave label).
  buildings: [
    // No standalone 'Shipwreck' proximity label here (2026-07-28): the wreck is
    // interactable (search it), so its single label rides on that interactable
    // below — one label per thing, shown exactly when you can press space.
    { label: 'Calder’s Hut', x: 2250, y: 548, r: 281 },
  ],

  entrances: [],

  // One hidden collectible: a glint in the sand beside the wreck (on the
  // reachable beach just SE of the hull, per the walkable guide).
  interactables: [
    {
      id: 'shiny-wreck-sand',
      x: 851, y: 1320, w: 125, h: 125,
      label: 'Something glints in the sand',
      reward: { gold: 5 },
    },
    // Searching the wreck of the Gull's Regret (2026-07-25). Interactable from a
    // wide 250px radius around this point on the hull; `boat: true` is intercepted
    // in main.js's interact() -> searchBoat(), which grants gold + a health potion
    // + Marisol's portrait (Calder's keepsake quest item) ONCE, then reports empty.
    {
      id: 'wreck_search',
      x: 663, y: 1483,
      range: 391,
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
      x: 1614, y: 2600,
      range: 141,
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
    { id: 'mireman_1', x: 2598, y: 2320, range: 281, enemies: ['mireman'] },
  ],

  // Small torch flames flanking the path up to Calder's hut (2026-07-24) —
  // code-drawn flickering fire (World.drawFire), rising from the two torch
  // posts. No asset needed.
  fires: [
    { x: 2258, y: 704 },
    { x: 2358, y: 663 },
  ],

  // Treasure chests (2026-07-24). A locked chest half-buried in the sand at the
  // south end of the beach — 18 gold and a few common supplies. Opening it needs
  // a lockpick; once emptied it's removed. State (locked/looted) persists via the
  // save system.
  chests: [
    {
      id: 'd1_beach_chest',
      x: 444, y: 2105,
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
      x: 693, y: 1964, speed: 34, chaseSpeed: 140, aggroRange: 625,
      startsHome: false,
      patrol: [
        { x: 693, y: 1964 },
        { x: 786, y: 2026 },
        { x: 614, y: 2043 },
      ],
    },
    {
      id: 'cragclaw_2', name: 'Cragclaw', creature: true, enemyId: 'cragclaw',
      sprite: 'assets/images/cragclaw_overhead.png',
      portrait: 'assets/images/cragclaw.png',
      x: 1076, y: 1291, speed: 34, chaseSpeed: 140, aggroRange: 625,
      startsHome: false,
      patrol: [
        { x: 1076, y: 1291 },
        { x: 1170, y: 1354 },
        { x: 999, y: 1369 },
      ],
    },
    {
      id: 'calder_rusk',
      name: 'Calder Rusk',
      role: 'RETIRED PIRATE',
      portrait: 'assets/images/calder_rusk.png',
      startsHome: true,
      home: {
        door: { x: 2249, y: 569 }, // the hut's doorway (Danny, 2026-07-24)
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
    { edge: 'right', yMin: 1000, yMax: 1125, to: 'D2', note: 'road east to the Village' },
  ],
};
