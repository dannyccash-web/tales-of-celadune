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
    { x: 0, y: 0, w: 1920, h: 195, note: 'tree line, top' },
    { x: 0, y: 195, w: 140, h: 695, note: 'tree line, left upper' },
    { x: 0, y: 990, w: 140, h: 930, note: 'tree line, left lower' },
    { x: 1785, y: 195, w: 135, h: 695, note: 'tree line, right upper' },
    { x: 1785, y: 990, w: 135, h: 930, note: 'tree line, right lower' },
    { x: 0, y: 1735, w: 1920, h: 185, note: 'tree line, bottom' },

    // --- Buildings & structures ---
    { x: 815, y: 385, w: 275, h: 275, note: 'large barn + pergola (Mirelle’s home), top-center' },
    { x: 465, y: 735, w: 112, h: 150, note: 'small barn 1' },
    { x: 625, y: 735, w: 112, h: 150, note: 'small barn 2' },
    { x: 1163, y: 735, w: 112, h: 150, note: 'small barn 3 (right)' },
    { x: 325, y: 795, w: 72, h: 112, note: 'well' },
    { x: 1063, y: 1005, w: 185, h: 252, note: 'fenced pen' },
    { x: 1173, y: 1283, w: 112, h: 112, note: 'silo' },
    { x: 925, y: 1385, w: 222, h: 272, note: 'bottom barn' },
  ],

  // Building entrances (interiors come later) — where building meets path
  entrances: [
    { x: 950, y: 668, w: 60, h: 24, to: 'mirelle_home', note: 'large barn door, meets vertical path' },
    { x: 1010, y: 1385, w: 60, h: 24, to: 'bottom_barn', note: 'bottom barn door' },
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
