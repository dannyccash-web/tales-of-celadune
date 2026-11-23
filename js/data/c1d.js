// 2026-11-23: NEW ART (Danny). Same wide hull as C1C: bow cargo up top,
// lanterns, barrels/crates along the sides, and the stairway up at the stern
// end (x1425-1585, y1925-2200, the same spot as C1C's stairs down; its exit
// interactable sits at the north end). The chest, lockbox and Mara moved to the
// bow, just aft of the crossbeam, and the Mireman King paces in front of them.
// Collision regenerated like C1C's. The notes below describe the earlier art.
// C1D — Maiden's Grace, Bottom Deck (the ship dungeon's Level 2, 2026-09-12).
// Reached from C1C via the new "Bottom Deck" ladder (c1c_bottomdeck_entrance,
// x1496/y1840 in C1C's own coordinate space — see that file's header comment
// for why it's no longer x748/y920) and returned to C1C via this scene's own
// "Bottom Deck" ladder (c1d_topdeck_exit, exitTo back to C1C).
//
// COORDINATE SCALE NOTE (judgment call, flagged for Danny): Danny specified
// every position in this scene (chest, Mara, the mireman, the exit ladder)
// using the SAME x748-based numbering he's used for C1C — but unlike C1C
// (whose EXIF metadata claims 3000x3000 while actually decoding to 1500x1500,
// see that file's header comment), C1D_Background.jpg decodes to a REAL,
// full 3000x3000. Danny's literal coordinates land well outside the walkable
// hold in this art (which spans roughly x:1300-1700, y:560-2500). To honor
// his intended layout rather than his literal numbers, every one of his
// coordinates below has been DOUBLED (his x748/y920 -> 1496/1840, etc.) —
// this maps his C1C-scale corridor 1:1 onto C1D's real corridor at twice the
// resolution, preserving relative position top-to-bottom. Flagged here (and
// called out to Danny directly) in case the art is ever regenerated at a
// different scale.
//
// Collision generated the same way as C1C: per-40px-row scan of
// C1D_Background.jpg for non-void pixels (threshold 18 on the max channel),
// 22px inward margin on each side for the 36px player collider, consecutive
// identical-width rows merged into rects. Eleven additional small rects box
// out internal notches (gaps WITHIN the main walkable span — crate/beam set
// dressing) found the same pass. Verified headlessly (BFS reachability from
// spawn, and circle-vs-rect clearance) that the spawn point, the chest,
// Mara, the mireman, and the exit ladder are all clear and mutually
// reachable.

export default {
  id: 'C1D',
  name: 'Maiden’s Grace — Bottom Deck',
  background: 'assets/images/C1D_Background.jpg',
  width: 3000,
  height: 3000,
  spawn: { x: 1505, y: 1860 }, // the north end of the stairway (2026-11-23 art)
  returns: 'C1C',
  music: 'cave',
  // Fights below deck use the ship-interior battle backdrop (2026-10-10, Danny).
  battleBackground: 'assets/images/boat_background_2.jpg',

  obstacles: [
    { x: 0, y: 0, w: 3000, h: 300 },
    { x: 0, y: 300, w: 1490, h: 10 },
    { x: 0, y: 310, w: 1480, h: 10 },
    { x: 1530, y: 300, w: 1470, h: 20 },
    { x: 1540, y: 320, w: 1460, h: 10 },
    { x: 0, y: 320, w: 1470, h: 20 },
    { x: 1550, y: 330, w: 1450, h: 10 },
    { x: 1560, y: 340, w: 1440, h: 10 },
    { x: 0, y: 340, w: 1450, h: 20 },
    { x: 0, y: 360, w: 1440, h: 10 },
    { x: 1570, y: 350, w: 1430, h: 20 },
    { x: 0, y: 370, w: 1430, h: 10 },
    { x: 1480, y: 370, w: 1520, h: 190 },
    { x: 1680, y: 560, w: 1320, h: 20 },
    { x: 0, y: 380, w: 1450, h: 240 },
    { x: 1690, y: 580, w: 1310, h: 40 },
    { x: 1480, y: 560, w: 190, h: 70 },
    { x: 0, y: 620, w: 1310, h: 20 },
    { x: 1700, y: 620, w: 1300, h: 30 },
    { x: 0, y: 640, w: 1300, h: 40 },
    { x: 0, y: 680, w: 1290, h: 10 },
    { x: 1710, y: 650, w: 1290, h: 40 },
    { x: 1720, y: 690, w: 1280, h: 50 },
    { x: 0, y: 690, w: 1350, h: 80 },
    { x: 0, y: 770, w: 1270, h: 10 },
    { x: 1280, y: 770, w: 70, h: 10 },
    { x: 1610, y: 690, w: 60, h: 90 },
    { x: 1730, y: 740, w: 1270, h: 40 },
    { x: 0, y: 780, w: 1350, h: 20 },
    { x: 1610, y: 780, w: 1390, h: 20 },
    { x: 0, y: 800, w: 1320, h: 150 },
    { x: 1630, y: 800, w: 1370, h: 150 },
    { x: 1650, y: 950, w: 80, h: 50 },
    { x: 1750, y: 950, w: 1250, h: 50 },
    { x: 1650, y: 1000, w: 1350, h: 10 },
    { x: 1690, y: 1010, w: 1310, h: 80 },
    { x: 1760, y: 1090, w: 1240, h: 40 },
    { x: 0, y: 950, w: 1300, h: 210 },
    { x: 1770, y: 1130, w: 1230, h: 30 },
    { x: 0, y: 1160, w: 1250, h: 70 },
    { x: 1760, y: 1160, w: 1240, h: 70 },
    { x: 1770, y: 1230, w: 1230, h: 30 },
    { x: 1760, y: 1260, w: 1240, h: 20 },
    { x: 1770, y: 1280, w: 1230, h: 190 },
    { x: 0, y: 1230, w: 1240, h: 250 },
    { x: 1760, y: 1470, w: 1240, h: 30 },
    { x: 0, y: 1480, w: 1300, h: 210 },
    { x: 0, y: 1690, w: 1250, h: 10 },
    { x: 1690, y: 1500, w: 1310, h: 210 },
    { x: 1750, y: 1710, w: 1250, h: 80 },
    { x: 0, y: 1700, w: 1260, h: 100 },
    { x: 0, y: 1800, w: 1270, h: 90 },
    { x: 1740, y: 1790, w: 1260, h: 100 },
    { x: 0, y: 1890, w: 1280, h: 40 },
    { x: 1730, y: 1890, w: 1270, h: 50 },
    { x: 1720, y: 1940, w: 1280, h: 70 },
    { x: 0, y: 1930, w: 1350, h: 130 },
    { x: 0, y: 2060, w: 1300, h: 30 },
    { x: 1610, y: 1950, w: 90, h: 140 },
    { x: 1710, y: 2010, w: 1290, h: 80 },
    { x: 0, y: 2090, w: 1310, h: 20 },
    { x: 1610, y: 2090, w: 1390, h: 40 },
    { x: 1690, y: 2130, w: 1310, h: 50 },
    { x: 0, y: 2110, w: 1350, h: 90 },
    { x: 1420, y: 1920, w: 170, h: 280 },
    { x: 1610, y: 2130, w: 60, h: 70 },
    { x: 0, y: 2200, w: 1330, h: 10 },
    { x: 1680, y: 2180, w: 1320, h: 30 },
    { x: 0, y: 2210, w: 1340, h: 30 },
    { x: 1670, y: 2210, w: 1330, h: 60 },
    { x: 0, y: 2240, w: 1350, h: 40 },
    { x: 1660, y: 2270, w: 1340, h: 20 },
    { x: 0, y: 2280, w: 1360, h: 20 },
    { x: 1650, y: 2290, w: 1350, h: 10 },
    { x: 1500, y: 2300, w: 1500, h: 260 },
    { x: 1550, y: 2560, w: 1450, h: 10 },
    { x: 0, y: 2300, w: 1470, h: 280 },
    { x: 1540, y: 2570, w: 1460, h: 20 },
    { x: 0, y: 2580, w: 1480, h: 20 },
    { x: 0, y: 2600, w: 1490, h: 10 },
    { x: 1530, y: 2590, w: 1470, h: 20 },
    { x: 0, y: 2610, w: 3000, h: 390 },
  ],

  interactables: [
    // Ladder back up to C1C's own "Bottom Deck" label (fixed exitTo, not the
    // generic captured caveReturn — see main.js's exitCave(overridePos) and
    // C1C's own c1c_topdeck_exit for the same pattern). exitTo matches
    // C1C's c1c_bottomdeck_entrance position (1490,1750), nudged there
    // 2026-09-12 after its originally-doubled spot turned out to overlap
    // C1C's wall-mounted grate obstacle — see that file's own comment.
    {
      id: 'c1d_topdeck_exit',
      x: 1505, y: 1900, // the north (top) end of the stairway up (stairwell blocked x1425-1585, y1925-2200) (2026-11-23)
      range: 100,
      caveExit: true,
      exitTo: { x: 1505, y: 1860 }, // C1C, at the top of its stairway down
      label: 'Climb Up',
    },
    // The Maiden's Grace's sealed lockbox (2026-09-13, Roderick/Wynne's
    // "c1_lockbox" quest) — placed to the right of c1d_treasure_chest
    // (1496,972), same y. Sprite-marked (world.js draws it as a static
    // ground image, same as C1B's gull) so the player sees it from a
    // distance rather than stumbling onto it. Engine-verified clear of
    // collision and reachable from spawn (BFS, 10px step).
    {
      id: 'c1d_lockbox',
      x: 1580, y: 760, // bow, starboard of Mara (2026-11-23)
      sprite: 'assets/images/enchanted_lockbox_overhead.png',
      label: 'A Sealed Lockbox',
      reward: { item: 'lockbox', qty: 1, catch: true },
      message: 'Wedged behind a broken crate, a small iron lockbox — sealed shut by wardwork far older than the ship carrying it.',
    },
  ],

  fishingSpots: [],

  chests: [
    {
      id: 'c1d_treasure_chest',
      x: 1430, y: 760, rotation: 0, // bow, port of Mara (2026-11-23)
      locked: false,
      gold: { min: 15, max: 30 },
      items: [
        { id: 'vitality_potion', qty: 1 },
        { id: 'health_potion', qty: 2 },
        { id: 'bread', qty: 1 },
      ],
    },
  ],

  battles: [],
  ambushes: [],
  exits: [],

  npcs: [
    // Mara Hollowmast — the Maiden's Grace's last survivor, injured and
    // barely mobile (Danny: "she doesn't move around much, as she's been
    // injured"). No routine/patrol; dialogue is entirely state-built in
    // main.js (buildMaraHollowmastDialog) since her rescue plays out as a
    // scripted farewell + cutscene rather than static dialog data.
    {
      id: 'mara_hollowmast', name: 'Mara Hollowmast', role: '',
      sprite: 'assets/images/mara_hollowmast_overhead.png',
      portrait: 'assets/images/mara_hollowmast.png',
      x: 1505, y: 860, startsHome: false, // bow, between the chest and the lockbox (2026-11-23)
    },
    // A single roaming mireman (Danny: "same chase behavior as the other
    // miremen on the boat") — same stats/pattern as C1C's hold pair and C1's
    // topside pair, just solo down here (its own pack id, though a lone
    // member makes `pack` a no-op in practice).
    {
      id: 'mireman_c1d_1', name: 'Mireman', role: '',
      creature: true, enemyId: 'mireman', pack: 'bottomdeck_mireman',
      sprite: 'assets/images/mireman_overhead.png',
      portrait: 'assets/images/mireman.png',
      x: 1380, y: 1450, speed: 35, chaseSpeed: 140, aggroRange: 250, giveUpRange: 700, startsHome: false,
      patrol: [ { x: 1380, y: 1450 }, { x: 1620, y: 1450 } ], // amidships (2026-11-23)
    },
    // The Mireman King (2026-11-12; moved 2026-11-23, Danny): paces a loop in
    // front of the chest, the lockbox and Mara at the bow, guarding them, and
    // charges anyone who comes within 280px. chaseSpeed 140 (a touch faster
    // than an unbooted player). Fight stats + summons in enemies.js.
    {
      id: 'mireman_king', name: 'Mireman King', role: '',
      creature: true, enemyId: 'mireman_king', pack: 'mireman_king',
      sprite: 'assets/images/mireman_king_overhead.png',
      portrait: 'assets/images/mireman_king.png',
      x: 1390, y: 1010, speed: 40, chaseSpeed: 140, aggroRange: 280, giveUpRange: 600, startsHome: false,
      patrol: [ { x: 1390, y: 1010 }, { x: 1620, y: 1010 }, { x: 1620, y: 1180 }, { x: 1390, y: 1180 } ],
    },
  ],
};
