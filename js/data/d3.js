// Scene D3 — FARM (overworld row D, column 3)
// World coordinates: 1920x1920. Origin top-left.
// Obstacles are AABB rects {x, y, w, h} the player cannot pass through.

export default {
  id: 'D3',
  name: 'Farm',
  background: 'assets/images/D3_Background.jpg',
  width: 1920,
  height: 1920,

  // Where the player appears when the scene loads fresh (near the path junction)
  spawn: { x: 955, y: 1060 },

  obstacles: [
    // --- Perimeter trees (gaps left/right at the main horizontal path, y 890-990) ---
    { x: 0, y: 0, w: 1920, h: 190, note: 'tree line, top' },
    { x: 0, y: 190, w: 140, h: 690, note: 'tree line, left upper' },
    { x: 0, y: 990, w: 110, h: 570, note: 'tree line, left lower' },
    { x: 1795, y: 190, w: 125, h: 690, note: 'tree line, right upper' },
    { x: 1810, y: 990, w: 110, h: 520, note: 'tree line, right lower' },
    { x: 0, y: 1750, w: 1920, h: 170, note: 'tree line, bottom' },
    { x: 240, y: 1555, w: 150, h: 150, note: 'tree, lower-left' },
    { x: 770, y: 1595, w: 140, h: 145, note: 'tree, left of bottom barn' },
    { x: 1145, y: 1635, w: 265, h: 160, note: 'trees, right of bottom barn' },
    { x: 1690, y: 1570, w: 230, h: 190, note: 'trees, lower-right cluster' },

    // --- Crop fields (rows are planted — walk the paths and grass instead) ---
    { x: 150, y: 210, w: 610, h: 460, note: 'crop field, upper-left' },
    { x: 1140, y: 200, w: 660, h: 670, note: 'crop field, upper-right' },
    { x: 755, y: 755, w: 150, h: 145, note: 'hedge crops, left of vertical path' },
    { x: 1000, y: 755, w: 160, h: 145, note: 'hedge crops, right of vertical path' },
    { x: 60, y: 1005, w: 770, h: 720, note: 'crop field, lower-left' },
    { x: 1295, y: 1005, w: 505, h: 715, note: 'crop field, lower-right' },

    // --- Buildings & structures ---
    { x: 815, y: 385, w: 275, h: 275, note: 'large barn + pergola (Mirelle’s home), top-center' },
    { x: 465, y: 735, w: 140, h: 155, note: 'small barn 1 + barrels' },
    { x: 625, y: 735, w: 140, h: 155, note: 'small barn 2 + barrels' },
    { x: 1160, y: 730, w: 150, h: 160, note: 'small barn 3 (right) + barrels' },
    { x: 325, y: 795, w: 75, h: 115, note: 'well' },
    { x: 1063, y: 1000, w: 190, h: 260, note: 'fenced pen' },
    { x: 1175, y: 1283, w: 120, h: 117, note: 'silo' },
    { x: 905, y: 1375, w: 250, h: 295, note: 'bottom barn (incl. roof overhang)' },
    { x: 1150, y: 1400, w: 45, h: 170, note: 'barrels, right of bottom barn' },
    { x: 875, y: 1480, w: 35, h: 100, note: 'barrels, left of bottom barn' },
  ],

  // Building entrances (interiors come later) — where building meets path
  entrances: [
    { x: 950, y: 668, w: 60, h: 24, to: 'mirelle_home', note: 'large barn door, meets vertical path' },
    { x: 1000, y: 1360, w: 60, h: 20, to: 'bottom_barn', note: 'bottom barn door, meets lower vertical path' },
  ],

  // Scene exits: crossing these edges moves the player to the adjacent scene.
  // Adjacent scenes per overworld map (page 6): D2 village west, D4 woods east, C3 woods north.
  exits: [
    { edge: 'left', yMin: 890, yMax: 990, to: 'D2', note: 'main path west to Village' },
    { edge: 'right', yMin: 890, yMax: 990, to: 'D4', note: 'main path east to Woods' },
  ],

  npcs: [
    {
      id: 'mirelle',
      name: 'Mirelle',
      role: 'FARM OWNER',
      sprite: 'assets/images/Mirelle_Overhead.png',
      portrait: 'assets/images/Mirelle_Portrait.png',
      // Patrols the vertical path between her barn door and the junction
      x: 940, y: 760,
      patrol: [ { x: 940, y: 720 }, { x: 940, y: 870 } ],
      speed: 40,
      home: 'mirelle_home',
      // Placeholder dialog — real dialog system comes later
      dialog: {
        line: 'Oh, hello there, traveler. Mind the cabbages — the kobolds have been at them again. If you’re headed west to the village, keep to the path.',
        responses: [
          'Kobolds? Tell me more.',
          'What do you grow here?',
          'Leave.',
        ],
      },
    },
  ],
};
