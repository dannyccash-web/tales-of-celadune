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
  spawn: { x: 1496, y: 1810 }, // 30px north of the up-ladder, mirroring C1C's own spawn-offset-from-ladder convention
  returns: 'C1C',
  music: 'cave',
  level: 2, // shows "Level 2" in the HUD's vertical indicator (see main.js's enterScene)

  obstacles: [
    { x: 0, y: 0, w: 3000, h: 560 },
    { x: 0, y: 560, w: 1518, h: 40 },
    { x: 0, y: 600, w: 1506, h: 40 },
    { x: 0, y: 640, w: 1474, h: 40 },
    { x: 0, y: 680, w: 1442, h: 40 },
    { x: 0, y: 720, w: 1422, h: 40 },
    { x: 0, y: 760, w: 1406, h: 40 },
    { x: 0, y: 800, w: 1390, h: 40 },
    { x: 0, y: 840, w: 1382, h: 40 },
    { x: 0, y: 880, w: 1370, h: 40 },
    { x: 0, y: 920, w: 1358, h: 40 },
    { x: 0, y: 960, w: 1350, h: 40 },
    { x: 0, y: 1000, w: 1346, h: 40 },
    { x: 0, y: 1040, w: 1338, h: 40 },
    { x: 0, y: 1080, w: 1326, h: 40 },
    { x: 0, y: 1120, w: 1330, h: 40 },
    { x: 0, y: 1160, w: 1318, h: 40 },
    { x: 0, y: 1200, w: 1322, h: 40 },
    { x: 0, y: 1240, w: 1318, h: 40 },
    { x: 0, y: 1280, w: 1314, h: 40 },
    { x: 0, y: 1320, w: 1310, h: 40 },
    { x: 0, y: 1360, w: 1294, h: 40 },
    { x: 0, y: 1400, w: 1310, h: 40 },
    { x: 0, y: 1440, w: 1298, h: 40 },
    { x: 0, y: 1480, w: 1306, h: 40 },
    { x: 0, y: 1520, w: 1290, h: 40 },
    { x: 0, y: 1560, w: 1306, h: 40 },
    { x: 0, y: 1600, w: 1302, h: 40 },
    { x: 0, y: 1640, w: 1310, h: 120 },
    { x: 0, y: 1760, w: 1306, h: 40 },
    { x: 0, y: 1800, w: 1318, h: 40 },
    { x: 0, y: 1840, w: 1310, h: 40 },
    { x: 0, y: 1880, w: 1326, h: 40 },
    { x: 0, y: 1920, w: 1318, h: 40 },
    { x: 0, y: 1960, w: 1338, h: 40 },
    { x: 0, y: 2000, w: 1330, h: 40 },
    { x: 0, y: 2040, w: 1350, h: 40 },
    { x: 0, y: 2080, w: 1358, h: 40 },
    { x: 0, y: 2120, w: 1366, h: 40 },
    { x: 0, y: 2160, w: 1362, h: 40 },
    { x: 0, y: 2200, w: 1390, h: 40 },
    { x: 0, y: 2240, w: 1406, h: 40 },
    { x: 0, y: 2280, w: 1422, h: 40 },
    { x: 0, y: 2320, w: 1418, h: 40 },
    { x: 0, y: 2360, w: 1462, h: 40 },
    { x: 0, y: 2400, w: 1482, h: 40 },
    { x: 0, y: 2440, w: 1506, h: 40 },
    { x: 0, y: 2480, w: 1518, h: 40 },
    { x: 0, y: 2520, w: 3000, h: 480 },

    { x: 1486, y: 560, w: 1514, h: 40 },
    { x: 1494, y: 600, w: 1506, h: 40 },
    { x: 1526, y: 640, w: 1474, h: 40 },
    { x: 1562, y: 680, w: 1438, h: 40 },
    { x: 1578, y: 720, w: 1422, h: 40 },
    { x: 1594, y: 760, w: 1406, h: 40 },
    { x: 1606, y: 800, w: 1394, h: 40 },
    { x: 1622, y: 840, w: 1378, h: 40 },
    { x: 1630, y: 880, w: 1370, h: 40 },
    { x: 1642, y: 920, w: 1358, h: 40 },
    { x: 1650, y: 960, w: 1350, h: 40 },
    { x: 1658, y: 1000, w: 1342, h: 40 },
    { x: 1666, y: 1040, w: 1334, h: 40 },
    { x: 1674, y: 1080, w: 1326, h: 80 },
    { x: 1682, y: 1160, w: 1318, h: 80 },
    { x: 1686, y: 1240, w: 1314, h: 40 },
    { x: 1690, y: 1280, w: 1310, h: 80 },
    { x: 1710, y: 1360, w: 1290, h: 40 },
    { x: 1694, y: 1400, w: 1306, h: 40 },
    { x: 1702, y: 1440, w: 1298, h: 40 },
    { x: 1694, y: 1480, w: 1306, h: 40 },
    { x: 1710, y: 1520, w: 1290, h: 40 },
    { x: 1694, y: 1560, w: 1306, h: 40 },
    { x: 1702, y: 1600, w: 1298, h: 40 },
    { x: 1694, y: 1640, w: 1306, h: 80 },
    { x: 1690, y: 1720, w: 1310, h: 40 },
    { x: 1698, y: 1760, w: 1302, h: 40 },
    { x: 1686, y: 1800, w: 1314, h: 40 },
    { x: 1694, y: 1840, w: 1306, h: 40 },
    { x: 1678, y: 1880, w: 1322, h: 40 },
    { x: 1686, y: 1920, w: 1314, h: 40 },
    { x: 1666, y: 1960, w: 1334, h: 40 },
    { x: 1674, y: 2000, w: 1326, h: 40 },
    { x: 1654, y: 2040, w: 1346, h: 40 },
    { x: 1642, y: 2080, w: 1358, h: 40 },
    { x: 1634, y: 2120, w: 1366, h: 40 },
    { x: 1638, y: 2160, w: 1362, h: 40 },
    { x: 1610, y: 2200, w: 1390, h: 40 },
    { x: 1598, y: 2240, w: 1402, h: 40 },
    { x: 1578, y: 2280, w: 1422, h: 80 },
    { x: 1542, y: 2360, w: 1458, h: 40 },
    { x: 1518, y: 2400, w: 1482, h: 40 },
    { x: 1494, y: 2440, w: 1506, h: 40 },
    { x: 1482, y: 2480, w: 1518, h: 40 },

    // Internal notches (crate/beam set dressing within the main span)
    { x: 1396, y: 840, w: 40, h: 40 },
    { x: 1484, y: 840, w: 68, h: 40 },
    { x: 1312, y: 1320, w: 36, h: 40 },
    { x: 1448, y: 1960, w: 104, h: 40 },
    { x: 1388, y: 2080, w: 144, h: 40 },
    { x: 1524, y: 2080, w: 92, h: 40 },
    { x: 1404, y: 2160, w: 44, h: 40 },
    { x: 1468, y: 2200, w: 92, h: 80 },
    { x: 1552, y: 2240, w: 40, h: 40 },
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
      x: 1496, y: 1840,
      range: 100,
      caveExit: true,
      exitTo: { x: 1490, y: 1720 },
      label: 'Bottom Deck',
    },
    // The Maiden's Grace's sealed lockbox (2026-09-13, Roderick/Wynne's
    // "c1_lockbox" quest) — placed to the right of c1d_treasure_chest
    // (1496,972), same y. Sprite-marked (world.js draws it as a static
    // ground image, same as C1B's gull) so the player sees it from a
    // distance rather than stumbling onto it. Engine-verified clear of
    // collision and reachable from spawn (BFS, 10px step).
    {
      id: 'c1d_lockbox',
      x: 1586, y: 972,
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
      x: 1496, y: 972, rotation: 0,
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
      x: 1496, y: 1176, startsHome: false,
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
      x: 1496, y: 1400, speed: 35, chaseSpeed: 140, aggroRange: 300, giveUpRange: 700, startsHome: false,
      patrol: [ { x: 1496, y: 1400 }, { x: 1516, y: 1440 } ],
    },
  ],
};
