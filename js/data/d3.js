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

  // Traced from a 25px grid overlay on D3_Background.jpg, conservative rule:
  // any cell containing part of an object is fully blocked. All edges are
  // multiples of 25.
  obstacles: [
    // --- Trees (gaps left/right at the main horizontal path, y ~900-985) ---
    { x: 0, y: 0, w: 1920, h: 175, note: 'tree line, top' },
    { x: 150, y: 175, w: 200, h: 50, note: 'canopy bump, top-left' },
    { x: 550, y: 175, w: 225, h: 75, note: 'canopy bump, top-mid' },
    { x: 1375, y: 175, w: 185, h: 25, note: 'tree cluster, top-right' },
    { x: 1560, y: 175, w: 165, h: 75, note: 'canopy bump, top-right corner' },
    { x: 0, y: 175, w: 150, h: 525, note: 'tree line, left (to y700)' },
    { x: 0, y: 700, w: 100, h: 175, note: 'tree line, left thin (y700-875)' },
    { x: 0, y: 990, w: 50, h: 725, note: 'tree edge, left below path' },
    { x: 1725, y: 175, w: 195, h: 175, note: 'tree line, right upper' },
    { x: 1675, y: 350, w: 245, h: 200, note: 'canopy bulge, right (y350-550)' },
    { x: 1775, y: 550, w: 145, h: 325, note: 'tree line, right (y550-875)' },
    { x: 1800, y: 990, w: 120, h: 325, note: 'tree line, right below path' },
    { x: 1725, y: 1300, w: 195, h: 225, note: 'canopy bulge, right lower' },
    { x: 1600, y: 1500, w: 320, h: 420, note: 'forest, bottom-right corner' },
    { x: 1250, y: 1650, w: 350, h: 270, note: 'trees, bottom (right of barn)' },
    { x: 775, y: 1675, w: 235, h: 245, note: 'trees, bottom (left of barn)' },
    { x: 0, y: 1725, w: 1920, h: 195, note: 'tree line, bottom' },
    { x: 0, y: 1675, w: 200, h: 50, note: 'tree edge, bottom-left' },
    { x: 150, y: 1625, w: 250, h: 150, note: 'tree, lower-left' },

    // --- Crop fields (planted rows — walk the paths and grass instead) ---
    { x: 150, y: 200, w: 600, h: 475, note: 'crop field, upper-left' },
    { x: 1150, y: 200, w: 575, h: 675, note: 'crop field, upper-right' },
    { x: 1725, y: 550, w: 75, h: 325, note: 'crop field, upper-right east strip' },
    { x: 750, y: 750, w: 175, h: 150, note: 'hedge crops, left of barn lane' },
    { x: 1000, y: 750, w: 175, h: 150, note: 'hedge crops, right of barn lane' },
    { x: 50, y: 1025, w: 825, h: 650, note: 'crop field, lower-left' },
    { x: 1300, y: 1000, w: 500, h: 675, note: 'crop field, lower-right' },

    // --- Buildings & structures ---
    { x: 800, y: 375, w: 300, h: 300, note: 'farmhouse + pergola (Mirelle’s home)' },
    { x: 450, y: 725, w: 175, h: 175, note: 'small barn 1 + barrels' },
    { x: 625, y: 725, w: 150, h: 175, note: 'small barn 2 + barrels' },
    { x: 1150, y: 725, w: 175, h: 175, note: 'small barn 3 + barrels' },
    { x: 325, y: 775, w: 75, h: 150, note: 'well + frame' },
    { x: 1050, y: 1000, w: 200, h: 300, note: 'fenced pen' },
    { x: 1175, y: 1250, w: 125, h: 150, note: 'silo' },
    { x: 925, y: 1325, w: 300, h: 275, note: 'bottom barn (roof extent)' },
    { x: 1075, y: 1600, w: 100, h: 75, note: 'bottom barn, south porch' },
    { x: 1225, y: 1400, w: 75, h: 275, note: 'barrels, right of bottom barn' },
    { x: 900, y: 1450, w: 50, h: 125, note: 'barrels, left of bottom barn' },
  ],

  // Building labels: drawn on the canvas when the player is within `r` of (x, y)
  buildings: [
    { label: 'Mirelle’s Farmhouse', x: 952, y: 630, r: 170 },
    { label: 'Hay Barn', x: 537, y: 790, r: 130 },
    { label: 'Tool Shed', x: 700, y: 790, r: 130 },
    { label: 'Storehouse', x: 1237, y: 790, r: 130 },
    { label: 'Well', x: 362, y: 835, r: 110 },
    { label: 'Animal Pen', x: 1150, y: 1140, r: 150 },
    { label: 'Silo', x: 1237, y: 1310, r: 120 },
    { label: 'Old Barn', x: 1075, y: 1450, r: 170 },
  ],

  // Building entrances (interiors come later) — where building meets path
  entrances: [
    { x: 950, y: 675, w: 60, h: 24, to: 'mirelle_home', note: 'farmhouse door, meets vertical path' },
    { x: 1000, y: 1305, w: 60, h: 20, to: 'bottom_barn', note: 'bottom barn door, meets lower vertical path' },
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
      x: 952, y: 690,
      speed: 40,
      home: {
        door: { x: 952, y: 700 }, // just outside the farmhouse's south face
        interior: 'assets/images/home_interior.jpg',
      },
      // Daily loop (also our home-system test): leave home, walk to the scene
      // center, linger, head back inside, stay a while, repeat.
      routine: [
        { do: 'leaveHome' },
        { do: 'goto', x: 952, y: 940 },
        { do: 'wait', s: 4 },
        { do: 'goHome' },
        { do: 'wait', s: 6 },
      ],
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
