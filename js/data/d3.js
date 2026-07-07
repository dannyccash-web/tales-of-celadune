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

  // Traced from a 50px grid overlay on D3_Background.jpg
  obstacles: [
    // --- Trees (gaps left/right at the main horizontal path, y ~890-990) ---
    { x: 0, y: 0, w: 1920, h: 175, note: 'tree line, top' },
    { x: 150, y: 175, w: 180, h: 55, note: 'canopy bump, top-left' },
    { x: 560, y: 175, w: 190, h: 55, note: 'canopy bump, top-mid' },
    { x: 1360, y: 175, w: 200, h: 40, note: 'tree cluster, top-right' },
    { x: 0, y: 175, w: 140, h: 525, note: 'tree line, left (to y700)' },
    { x: 0, y: 700, w: 90, h: 180, note: 'tree line, left thin (y700-880)' },
    { x: 0, y: 990, w: 50, h: 710, note: 'tree edge, left below path' },
    { x: 1735, y: 175, w: 185, h: 185, note: 'tree line, right upper' },
    { x: 1690, y: 360, w: 230, h: 190, note: 'canopy bulge, right (y360-550)' },
    { x: 1795, y: 550, w: 125, h: 330, note: 'tree line, right (y550-880)' },
    { x: 1795, y: 990, w: 125, h: 320, note: 'tree line, right below path' },
    { x: 1730, y: 1300, w: 190, h: 210, note: 'canopy bulge, right lower' },
    { x: 1600, y: 1500, w: 320, h: 420, note: 'forest, bottom-right corner' },
    { x: 1250, y: 1680, w: 350, h: 240, note: 'trees, bottom (right of barn)' },
    { x: 770, y: 1680, w: 240, h: 240, note: 'trees, bottom (left of barn)' },
    { x: 0, y: 1745, w: 1920, h: 175, note: 'tree line, bottom' },
    { x: 0, y: 1695, w: 190, h: 60, note: 'tree edge, bottom-left' },
    { x: 150, y: 1650, w: 230, h: 100, note: 'tree, lower-left' },

    // --- Crop fields (planted rows — walk the paths and grass instead) ---
    { x: 160, y: 215, w: 590, h: 450, note: 'crop field, upper-left (bottom 665)' },
    { x: 1145, y: 205, w: 575, h: 655, note: 'crop field, upper-right' },
    { x: 1720, y: 560, w: 75, h: 300, note: 'crop field, upper-right east strip' },
    { x: 755, y: 750, w: 150, h: 148, note: 'hedge crops, left of barn lane' },
    { x: 995, y: 750, w: 165, h: 148, note: 'hedge crops, right of barn lane' },
    { x: 55, y: 1020, w: 800, h: 635, note: 'crop field, lower-left' },
    { x: 1300, y: 1010, w: 485, h: 650, note: 'crop field, lower-right' },

    // --- Buildings & structures ---
    { x: 815, y: 385, w: 275, h: 275, note: 'large barn + pergola (Mirelle’s home)' },
    { x: 465, y: 730, w: 118, h: 155, note: 'small barn 1' },
    { x: 583, y: 795, w: 28, h: 92, note: 'barrels, barn 1' },
    { x: 625, y: 730, w: 118, h: 155, note: 'small barn 2' },
    { x: 743, y: 830, w: 25, h: 60, note: 'barrels, barn 2' },
    { x: 1160, y: 730, w: 130, h: 158, note: 'small barn 3 (right)' },
    { x: 1290, y: 790, w: 25, h: 95, note: 'barrels, barn 3' },
    { x: 328, y: 790, w: 70, h: 115, note: 'well + frame' },
    { x: 1063, y: 995, w: 182, h: 295, note: 'fenced pen (bottom rail y1290)' },
    { x: 1180, y: 1258, w: 122, h: 130, note: 'silo' },
    { x: 945, y: 1345, w: 280, h: 260, note: 'bottom barn (roof extent)' },
    { x: 1080, y: 1605, w: 90, h: 55, note: 'bottom barn, south porch' },
    { x: 1240, y: 1395, w: 45, h: 270, note: 'barrels, right of bottom barn' },
    { x: 905, y: 1460, w: 45, h: 100, note: 'barrels, left of bottom barn' },
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
      x: 952, y: 690,
      speed: 40,
      home: {
        door: { x: 952, y: 690 }, // just outside the big barn's south face
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
