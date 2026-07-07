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

    // --- Crop fields (planted rows — walk the paths and grass instead).
    // Each field is split around one walkable dirt lane (a worker path
    // between rows, ~50px — the narrower row-to-row furrows are too tight
    // for the 36px collider even where they're technically clear dirt).
    { x: 150, y: 200, w: 125, h: 475, note: 'crop field, upper-left, west of the lane' },
    { x: 325, y: 200, w: 425, h: 475, note: 'crop field, upper-left, east of the lane (lane: x275-325)' },
    { x: 1150, y: 200, w: 275, h: 675, note: 'crop field, upper-right, west of the lane' },
    { x: 1475, y: 200, w: 250, h: 675, note: 'crop field, upper-right, east of the lane (lane: x1425-1475)' },
    { x: 1725, y: 550, w: 75, h: 325, note: 'crop field, upper-right east strip' },
    { x: 750, y: 750, w: 175, h: 150, note: 'hedge crops, left of barn lane' },
    { x: 1000, y: 750, w: 175, h: 150, note: 'hedge crops, right of barn lane' },
    { x: 50, y: 1025, w: 200, h: 650, note: 'crop field, lower-left, west of the lane' },
    { x: 300, y: 1025, w: 575, h: 650, note: 'crop field, lower-left, east of the lane (lane: x250-300)' },
    { x: 1350, y: 1000, w: 450, h: 675, note: 'crop field, lower-right (west edge pulled in to x1350 — lane: x1300-1350, joins the corridor by the pen/silo)' },

    // --- Buildings & structures ---
    { x: 800, y: 375, w: 300, h: 300, note: 'farmhouse + pergola (Mirelle’s home)' },
    { x: 450, y: 725, w: 175, h: 175, note: 'small barn 1 + barrels' },
    { x: 625, y: 725, w: 150, h: 175, note: 'small barn 2 + barrels' },
    { x: 1150, y: 725, w: 175, h: 175, note: 'small barn 3 + barrels' },
    { x: 325, y: 775, w: 75, h: 125, note: 'well + frame' },
    // Fenced pen — hollow (fence perimeter only) so Gaffer has room to
    // move inside; interior is x1075-1225, y1025-1200, clear. Re-traced
    // 2026-07-07: the original trace (south rail at y1275-1300) had the
    // pen ~75px taller than the actual fence art, which let Gaffer wander
    // south of the real fence line before ever tripping a collision — the
    // real fence rectangle (posts + rails, confirmed via pixel-grid crop of
    // D3_Background.jpg) sits at roughly x1075-1250, y1000-1200.
    { x: 1050, y: 1000, w: 200, h: 25, note: 'fenced pen, north rail' },
    { x: 1050, y: 1200, w: 200, h: 25, note: 'fenced pen, south rail' },
    { x: 1050, y: 1000, w: 25, h: 225, note: 'fenced pen, west rail' },
    { x: 1225, y: 1000, w: 25, h: 225, note: 'fenced pen, east rail' },
    // Player-only ground: the grass between the (now-correctly-sized) pen and
    // the silo is open so the player can walk it. NPCs are kept out via the
    // npcOnly rect below — this exact pocket (bounded by the pen, silo, and
    // barn) is the one CLAUDE.md already warns about: an NPC crossing near the
    // pen's NW corner (Tuckwell/Brenna's shared y940 path) can get deflected
    // south into it and never find its way back out (escaping needs a turn
    // sharper than steer()'s ~126° limit). Confirmed via headless sim: with
    // this rect removed, Tuckwell's routine throughput dropped from ~70
    // loops/10,000s to 8. Doesn't touch Mirelle's x925-1000 barn-lane route.
    { x: 1050, y: 1225, w: 125, h: 100, npcOnly: true, note: 'NPC-only guard: keeps NPCs out of the pen/silo/barn pocket' },
    { x: 1175, y: 1250, w: 125, h: 150, note: 'silo' },
    { x: 925, y: 1325, w: 300, h: 275, note: 'bottom barn (roof extent)' },
    { x: 1075, y: 1600, w: 100, h: 75, note: 'bottom barn, south porch' },
    { x: 1225, y: 1400, w: 75, h: 275, note: 'barrels, right of bottom barn' },
    { x: 900, y: 1450, w: 50, h: 125, note: 'barrels, left of bottom barn' },
  ],

  // Building labels: drawn on the canvas when the player is within `r` of (x, y).
  // Centered directly over each building's door (same x as the door, y offset
  // ~70px toward the building's interior) — matching Mirelle's Farmhouse. Old
  // Barn's door faces north, so its label sits *below* the door instead (still
  // toward the interior, just the opposite direction).
  buildings: [
    { label: 'Mirelle’s Farmhouse', x: 952, y: 630, r: 170 },
    { label: 'Tuckwell’s House', x: 537, y: 855, r: 130 },
    { label: 'Brenna’s House', x: 700, y: 855, r: 130 },
    { label: 'Storehouse', x: 1237, y: 855, r: 130 },
    { label: 'Well', x: 362, y: 835, r: 110 },
    { label: 'Silo', x: 1237, y: 1310, r: 120 },
    { label: 'Old Barn', x: 1030, y: 1385, r: 170 },
  ],

  // Building entrances (interiors come later) — where building meets path
  entrances: [
    { x: 950, y: 675, w: 60, h: 24, to: 'mirelle_home', note: 'farmhouse door, meets vertical path' },
    { x: 1000, y: 1305, w: 60, h: 20, to: 'bottom_barn', note: 'bottom barn door, meets lower vertical path' },
  ],

  // Hidden collectibles: invisible trigger areas with no sprite — only a
  // label appears once the player is close (same pattern as building labels),
  // and spacebar grants the reward once. `range` doubles as both the label
  // and interact radius, matching INTERACT_RANGE (90) by default.
  interactables: [
    {
      id: 'shiny-field-north',
      x: 950, y: 320, w: 80, h: 80,
      label: 'A shiny object',
      reward: { gold: 3 },
    },
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
      startsHome: true,
      home: {
        door: { x: 952, y: 700 }, // just outside the farmhouse's south face
        interior: 'assets/images/home_interior.jpg',
      },
      // Daily loop: rest at home, head out to check the Old Barn, draw water
      // from the well, then back home. All waypoints ride the main east-west
      // path (y900-990, clear full width) and the x925-1000 barn-lane gap /
      // x875-1050 gap south of the fields — the only clear north-south cuts
      // through the building rows, so the route never clips a building.
      routine: [
        { do: 'wait', s: 10 },
        { do: 'leaveHome' },
        { do: 'goto', x: 952, y: 940 },
        { do: 'goto', x: 1000, y: 1290 }, // Old Barn entrance
        { do: 'goto', x: 952, y: 940 },
        { do: 'goto', x: 362, y: 940 },   // the well
        { do: 'goto', x: 952, y: 940 },
        { do: 'goHome' },
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
    {
      id: 'tuckwell',
      name: 'Tuckwell',
      role: 'FARMHAND',
      sprite: 'assets/images/Tuckwell_Overhead.png',
      portrait: 'assets/images/Tuckwell_Portrait.png',
      x: 450, y: 700, // spawns beside the upper-left field
      speed: 45,
      startsHome: false,
      home: {
        door: { x: 537, y: 925 }, // south face of the Hay Barn (his house)
        interior: 'assets/images/home_interior.jpg',
      },
      // Tours all four crop fields, pausing at each, then home for a longer
      // rest. Drops to the main path (y900-990, clear full width) right away
      // via the x400-450 gap between the well and his own house, and does
      // all the long east-west travel down there — the y700 band above is
      // narrow near the farmhouse/field corner and, combined with Brenna's
      // route crossing nearby, could wedge two NPCs together with no room
      // to pass. The open path has no such pinch point.
      routine: [
        { do: 'wait', s: 10 },            // upper-left field (spawn)
        { do: 'goto', x: 425, y: 700 },
        { do: 'goto', x: 425, y: 940 },
        { do: 'goto', x: 1450, y: 940 },   // upper-right field
        { do: 'wait', s: 10 },
        { do: 'goto', x: 1550, y: 960 },   // lower-right field
        { do: 'wait', s: 10 },
        { do: 'goto', x: 450, y: 980 },    // lower-left field
        { do: 'wait', s: 10 },
        { do: 'goHome' },
        { do: 'wait', s: 15 },
        { do: 'leaveHome' },
        { do: 'goto', x: 425, y: 925 },
        { do: 'goto', x: 425, y: 700 },
        { do: 'goto', x: 450, y: 700 },    // back to the upper-left field
      ],
      dialog: {
        line: 'Fields don’t tend themselves, friend. Four to walk every day, and the kobolds still get more than their share.',
        responses: [
          'How’s the harvest looking?',
          'Any trouble out there?',
          'Leave.',
        ],
      },
    },
    {
      id: 'brenna',
      name: 'Brenna',
      role: 'ANIMAL KEEPER',
      sprite: 'assets/images/Brenna_Overhead.png',
      portrait: 'assets/images/Brenna_Portrait.png',
      x: 1850, y: 940, // spawns out to the east, near the path
      speed: 45,
      startsHome: false,
      home: {
        door: { x: 700, y: 925 }, // south face of the Tool Shed (her house)
        interior: 'assets/images/home_interior.jpg',
      },
      // Checks the animal pen, then the silo, then home for the night.
      // Route stays east of x1300 (the lower-right field's edge) while
      // dipping south, then rides the main path (y900-990) the rest of
      // the way — both clear full width, so nothing here clips a building.
      routine: [
        { do: 'goto', x: 1290, y: 940 },
        { do: 'goto', x: 1270, y: 1150 }, // animal pen
        { do: 'wait', s: 10 },
        { do: 'goto', x: 1270, y: 1215 }, // silo
        { do: 'wait', s: 10 },
        { do: 'goto', x: 1270, y: 940 },
        { do: 'goto', x: 700, y: 940 },
        { do: 'goHome' },
        { do: 'wait', s: 15 },
        { do: 'leaveHome' },
      ],
      dialog: {
        line: 'The animals are settled for now. Silo’s fuller than last season, at least — small mercies.',
        responses: [
          'Need a hand with the animals?',
          'What’s in the silo?',
          'Leave.',
        ],
      },
    },
    {
      id: 'gaffer',
      name: 'Old Gaffer',
      role: 'GOAT',
      sprite: 'assets/images/Gaffer_Overhead.png',
      portrait: 'assets/images/Gaffer_Portrait.png',
      x: 1150, y: 1060,
      speed: 30,
      // No home — Gaffer lives in the pen and just wanders its interior
      // (x1075-1225, y1025-1200, clear — see the hollow pen rects above).
      // Patrol points sit >=25px inside that clear box so the 36px collider
      // never touches the fence rails.
      patrol: [
        { x: 1110, y: 1060 },
        { x: 1190, y: 1060 },
        { x: 1150, y: 1160 },
      ],
      dialog: {
        line: 'Gaffer fixes you with a flat yellow stare, lets out a low bleat, and goes back to chewing on a fence post.',
        responses: [
          'Pet Gaffer.',
          'Offer him something to eat.',
          'Leave.',
        ],
      },
    },
  ],
};
