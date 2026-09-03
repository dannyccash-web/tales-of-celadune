// Scene C1 — TIDEWRACK HARBOR (overworld row C, column 1 — the SW corner of row C,
// directly north of D1 Shipwreck Cove on the map grid)
// World coordinates: 3000x3000. Origin top-left.
//
// A fishing village and port built along a curving inlet. The open sea fills
// the WEST edge; the derelict merchant ship *Maiden's Grace* (crewed by
// knights' supply-runners, boarded and slaughtered by miremen at a river
// mouth before drifting in dead) sits moored at a pier/warehouse complex on
// the shore. The village proper — nine huts + the dockmaster's warehouse —
// spreads east across open grass and dirt paths, with a rocky headland NE, a
// tide pool SE (the Tidefolk's corner), and a crumbling watchtower/lighthouse
// stump on a bluff to the north. Half the village's 12 NPCs are Calder Rusk's
// former mutinous crew (see D1) — this IS "the fishing village" his crew
// rowed north to. See CLAUDE.md's "Row C design notes" + "C1 — Tidewrack
// Harbor" sections for the full brief and confirmed NPC roster.
//
// Collision AUTO-CLASSIFIED 2026-09-02 (no hand-painted walkable guide exists
// yet for this scene) — per-25px-cell HSV color classification of the art
// (warm tan/olive path+grass walkable; blue water, grey rock, saturated green
// canopy blocked) + a 1-cell shoulder dilation (opens pinch points for the
// 36px collider) + manual obstacle stamps for every building footprint (the
// ship, the dock warehouse, the watchtower, all 9 huts, the drying-rack
// structure — color classification alone reads sun-bleached roofs as
// path-colored, so buildings are hand-boxed rather than trusted to the
// classifier) + forced-walkable stamps for the dock's boarding
// walkway/gangway (the mireman patrol's ground) and all three scene exits.
// Engine-verified with the real 36px-collider BFS (flood fill from the D1
// arrival apron): 9444 of 9450 walkable cells connected (the handful of
// stragglers are inert, nothing is placed there). Regenerate from a walkable
// guide if Danny paints one, rather than hand-editing these rects.
//
// D1 <-> C1 connection (2026-09-02): D1 previously had no north exit ("N/S
// are cliffs" — see d1.js). Its background already has a wide (300px) open
// gap in the collision at the top edge, x1350-1650 (the clearing around
// Calder's hut loop-path) — confirmed reachable from D1's spawn with the real
// collider BEFORE any edit, so D1 gained a `top` exit into C1 with ZERO
// collision changes there. This C1 file's `bottom` exit band (x1375-1625)
// matches it exactly, same convention as every other scene pair.

export default {
  id: 'C1',
  name: 'Tidewrack Harbor',
  background: 'assets/images/C1_Background.jpg',
  width: 3000,
  height: 3000,

  // Just inside the south (D1-facing) edge — only used on a direct boot;
  // normal arrival comes up through the scene-transition system.
  spawn: { x: 1500, y: 2900 },

  obstacles: [
    { x: 2750, y: 0, w: 75, h: 25 },
    { x: 0, y: 0, w: 500, h: 50 },
    { x: 2200, y: 25, w: 25, h: 25 },
    { x: 975, y: 25, w: 25, h: 25 },
    { x: 0, y: 50, w: 525, h: 25 },
    { x: 2875, y: 75, w: 25, h: 25 },
    { x: 0, y: 75, w: 550, h: 25 },
    { x: 2750, y: 75, w: 25, h: 25 },
    { x: 0, y: 100, w: 600, h: 25 },
    { x: 2375, y: 100, w: 25, h: 25 },
    { x: 2425, y: 100, w: 25, h: 50 },
    { x: 2600, y: 125, w: 50, h: 25 },
    { x: 0, y: 125, w: 625, h: 25 },
    { x: 2350, y: 125, w: 50, h: 25 },
    { x: 2575, y: 150, w: 75, h: 25 },
    { x: 0, y: 150, w: 650, h: 25 },
    { x: 2350, y: 150, w: 25, h: 50 },
    { x: 2425, y: 175, w: 25, h: 25 },
    { x: 0, y: 175, w: 675, h: 50 },
    { x: 1975, y: 225, w: 50, h: 25 },
    { x: 2050, y: 225, w: 25, h: 25 },
    { x: 0, y: 225, w: 700, h: 25 },
    { x: 2975, y: 250, w: 25, h: 25 },
    { x: 0, y: 250, w: 725, h: 25 },
    { x: 2125, y: 250, w: 50, h: 25 },
    { x: 2000, y: 250, w: 50, h: 25 },
    { x: 2000, y: 275, w: 25, h: 25 },
    { x: 2125, y: 275, w: 75, h: 25 },
    { x: 0, y: 275, w: 750, h: 50 },
    { x: 2150, y: 300, w: 100, h: 25 },
    { x: 2275, y: 300, w: 25, h: 25 },
    { x: 2575, y: 325, w: 25, h: 25 },
    { x: 2200, y: 325, w: 100, h: 25 },
    { x: 0, y: 325, w: 775, h: 50 },
    { x: 0, y: 375, w: 800, h: 25 },
    { x: 1175, y: 200, w: 200, h: 225 },
    { x: 0, y: 400, w: 825, h: 25 },
    { x: 2975, y: 400, w: 25, h: 25 },
    { x: 2925, y: 425, w: 75, h: 25 },
    { x: 2450, y: 425, w: 25, h: 25 },
    { x: 2475, y: 450, w: 50, h: 25 },
    { x: 0, y: 425, w: 850, h: 75 },
    { x: 2575, y: 475, w: 25, h: 25 },
    { x: 2500, y: 475, w: 50, h: 25 },
    { x: 2800, y: 450, w: 200, h: 75 },
    { x: 2500, y: 500, w: 75, h: 25 },
    { x: 2850, y: 525, w: 150, h: 25 },
    { x: 1025, y: 525, w: 25, h: 25 },
    { x: 2525, y: 525, w: 25, h: 25 },
    { x: 0, y: 500, w: 875, h: 75 },
    { x: 2975, y: 550, w: 25, h: 25 },
    { x: 1825, y: 425, w: 425, h: 225 },
    { x: 0, y: 575, w: 850, h: 100 },
    { x: 2700, y: 650, w: 75, h: 25 },
    { x: 2850, y: 650, w: 25, h: 50 },
    { x: 2750, y: 675, w: 50, h: 25 },
    { x: 0, y: 675, w: 875, h: 25 },
    { x: 2850, y: 750, w: 50, h: 75 },
    { x: 1975, y: 750, w: 200, h: 75 },
    { x: 1525, y: 650, w: 225, h: 200 },
    { x: 0, y: 700, w: 600, h: 150 },
    { x: 1975, y: 825, w: 300, h: 125 },
    { x: 2075, y: 950, w: 200, h: 50 },
    { x: 1750, y: 900, w: 200, h: 175 },
    { x: 1500, y: 1175, w: 525, h: 75 },
    { x: 1500, y: 1250, w: 750, h: 125 },
    { x: 1750, y: 1375, w: 500, h: 25 },
    { x: 2025, y: 1400, w: 225, h: 50 },
    { x: 1075, y: 1575, w: 25, h: 25 },
    { x: 1000, y: 1575, w: 25, h: 25 },
    { x: 2825, y: 1575, w: 25, h: 50 },
    { x: 975, y: 1625, w: 50, h: 25 },
    { x: 1000, y: 1650, w: 50, h: 50 },
    { x: 1000, y: 1700, w: 25, h: 25 },
    { x: 975, y: 1725, w: 75, h: 50 },
    { x: 2675, y: 1750, w: 25, h: 25 },
    { x: 1000, y: 1775, w: 50, h: 25 },
    { x: 2975, y: 1775, w: 25, h: 25 },
    { x: 2950, y: 1800, w: 25, h: 25 },
    { x: 1000, y: 1800, w: 25, h: 25 },
    { x: 2050, y: 1850, w: 100, h: 25 },
    { x: 0, y: 850, w: 950, h: 1050 },
    { x: 1600, y: 1650, w: 275, h: 250 },
    { x: 975, y: 1825, w: 25, h: 75 },
    { x: 2025, y: 1875, w: 125, h: 50 },
    { x: 0, y: 1900, w: 625, h: 25 },
    { x: 650, y: 1900, w: 75, h: 25 },
    { x: 0, y: 1925, w: 725, h: 25 },
    { x: 2300, y: 1925, w: 50, h: 25 },
    { x: 2000, y: 1925, w: 175, h: 25 },
    { x: 650, y: 1950, w: 100, h: 25 },
    { x: 775, y: 1950, w: 50, h: 25 },
    { x: 2950, y: 1950, w: 25, h: 25 },
    { x: 2275, y: 1950, w: 50, h: 25 },
    { x: 2000, y: 1950, w: 250, h: 25 },
    { x: 0, y: 1950, w: 625, h: 25 },
    { x: 875, y: 1950, w: 50, h: 25 },
    { x: 0, y: 1975, w: 900, h: 25 },
    { x: 1975, y: 1975, w: 325, h: 25 },
    { x: 2925, y: 1975, w: 25, h: 25 },
    { x: 2000, y: 2000, w: 300, h: 25 },
    { x: 0, y: 2000, w: 875, h: 50 },
    { x: 1975, y: 2025, w: 325, h: 25 },
    { x: 0, y: 2050, w: 800, h: 25 },
    { x: 2000, y: 2050, w: 275, h: 50 },
    { x: 2025, y: 2100, w: 25, h: 25 },
    { x: 2075, y: 2100, w: 200, h: 25 },
    { x: 2125, y: 2125, w: 125, h: 25 },
    { x: 2000, y: 2150, w: 25, h: 25 },
    { x: 2900, y: 2150, w: 25, h: 25 },
    { x: 0, y: 2075, w: 775, h: 125 },
    { x: 1975, y: 2175, w: 25, h: 25 },
    { x: 2875, y: 2175, w: 25, h: 50 },
    { x: 0, y: 2200, w: 750, h: 50 },
    { x: 0, y: 2250, w: 725, h: 25 },
    { x: 0, y: 2275, w: 700, h: 100 },
    { x: 0, y: 2375, w: 675, h: 25 },
    { x: 2975, y: 2375, w: 25, h: 25 },
    { x: 2925, y: 2400, w: 75, h: 25 },
    { x: 0, y: 2400, w: 650, h: 75 },
    { x: 2900, y: 2425, w: 100, h: 50 },
    { x: 2625, y: 2475, w: 50, h: 25 },
    { x: 1225, y: 2475, w: 25, h: 25 },
    { x: 2925, y: 2475, w: 25, h: 25 },
    { x: 0, y: 2475, w: 625, h: 50 },
    { x: 2600, y: 2500, w: 100, h: 25 },
    { x: 1175, y: 2500, w: 50, h: 25 },
    { x: 2900, y: 2500, w: 25, h: 25 },
    { x: 475, y: 2525, w: 125, h: 25 },
    { x: 2875, y: 2525, w: 75, h: 25 },
    { x: 0, y: 2525, w: 400, h: 25 },
    { x: 2425, y: 2550, w: 50, h: 25 },
    { x: 2850, y: 2550, w: 25, h: 25 },
    { x: 450, y: 2550, w: 150, h: 25 },
    { x: 0, y: 2550, w: 425, h: 25 },
    { x: 2825, y: 2575, w: 25, h: 25 },
    { x: 0, y: 2575, w: 600, h: 75 },
    { x: 2125, y: 2675, w: 25, h: 25 },
    { x: 2175, y: 2675, w: 25, h: 25 },
    { x: 2725, y: 2675, w: 25, h: 25 },
    { x: 2975, y: 2675, w: 25, h: 75 },
    { x: 2700, y: 2700, w: 25, h: 50 },
    { x: 950, y: 2725, w: 25, h: 50 },
    { x: 2900, y: 2750, w: 25, h: 25 },
    { x: 2950, y: 2750, w: 25, h: 25 },
    { x: 2875, y: 2775, w: 25, h: 25 },
    { x: 2925, y: 2775, w: 25, h: 25 },
    { x: 2300, y: 2800, w: 50, h: 25 },
    { x: 2300, y: 2825, w: 25, h: 75 },
    { x: 2075, y: 2875, w: 25, h: 25 },
    { x: 2625, y: 2875, w: 25, h: 25 },
    { x: 2475, y: 2875, w: 50, h: 25 },
    { x: 2325, y: 2900, w: 25, h: 25 },
    { x: 2050, y: 2900, w: 25, h: 25 },
    { x: 2450, y: 2900, w: 50, h: 25 },
    { x: 2850, y: 2900, w: 25, h: 25 },
    { x: 1700, y: 2925, w: 25, h: 25 },
    { x: 2950, y: 2925, w: 50, h: 25 },
    { x: 2825, y: 2925, w: 50, h: 25 },
    { x: 2350, y: 2925, w: 125, h: 25 },
    { x: 2000, y: 2925, w: 50, h: 25 },
    { x: 1975, y: 2950, w: 75, h: 25 },
    { x: 2125, y: 2950, w: 75, h: 25 },
    { x: 2675, y: 2950, w: 75, h: 25 },
    { x: 2625, y: 2950, w: 25, h: 25 },
    { x: 2250, y: 2950, w: 50, h: 25 },
    { x: 2325, y: 2950, w: 150, h: 25 },
    { x: 2775, y: 2950, w: 75, h: 25 },
    { x: 0, y: 2650, w: 625, h: 350 },
    { x: 2925, y: 2950, w: 75, h: 50 },
    { x: 2800, y: 2975, w: 50, h: 25 },
    { x: 2000, y: 2975, w: 25, h: 25 },
    { x: 2625, y: 2975, w: 100, h: 25 },
    { x: 2150, y: 2975, w: 25, h: 25 },
    { x: 2250, y: 2975, w: 225, h: 25 },
  ],

  // Proximity labels. Every home below has its own "X's House"/business-name
  // entry (door matches the NPC's home.door); the rest are landmark-only
  // (no door — never link to a home reveal).
  buildings: [
    { label: 'Dockmaster’s Warehouse', x: 780, y: 950, r: 260, door: { x: 970, y: 900 } },
    { label: 'Perrin’s Cookhouse', x: 1882, y: 1290, r: 230, door: { x: 1882, y: 1420 } },
    { label: 'Wynne’s House', x: 1632, y: 750, r: 220, door: { x: 1630, y: 880 } },
    { label: 'The Farrows’ House', x: 1845, y: 990, r: 210, door: { x: 1863, y: 1097 } },
    { label: 'Garrick’s House', x: 2077, y: 855, r: 210, door: { x: 2053, y: 992 } },
    { label: 'Senna’s House', x: 2135, y: 540, r: 210, door: { x: 2135, y: 670 } },
    { label: 'Aldous’s House', x: 1920, y: 542, r: 210, door: { x: 1920, y: 670 } },
    { label: 'Nils’s House', x: 2137, y: 1350, r: 210, door: { x: 2146, y: 1468 } },
    { label: 'Skitter’s Shed', x: 1732, y: 1777, r: 210, door: { x: 1727, y: 1631 } },
    { label: 'Old Watchtower', x: 1275, y: 305, r: 260 },
    { label: 'Maiden’s Grace', x: 420, y: 1200, r: 420 },
    { label: 'Drying Racks', x: 1650, y: 1265, r: 190 },
    { label: 'Tidepool Cove', x: 2800, y: 1750, r: 300 },
  ],

  entrances: [],

  interactables: [
    // Lily Farrow's lost gull (2026-09-02) — a plain gold-collectible, same
    // pattern as D1's "shiny object": found once, +3 gold. main.js's
    // buildLilyDialog checks this interactable's `collected` flag (by id) to
    // change her dialogue once it's been spotted.
    {
      id: 'c1_lily_gull',
      x: 1460, y: 300, w: 100, h: 100,
      label: 'A flash of grey and white',
      message: 'Tucked in the grass by the old tower, you spot Lily’s missing gull preening — and a few coins someone else once dropped chasing her.',
      reward: { gold: 3 },
    },
  ],

  fishingSpots: [
    { x: 650, y: 2230 },
  ],

  chests: [],
  battles: [],
  ambushes: [],

  // South back to D1 (band matches D1's new top exit exactly — see the header
  // comment). North toward B1 (past the watchtower) and east toward C2 reach
  // the edges but aren't built yet — the frame loop shows the "isn't ready
  // yet" toast for those.
  exits: [
    { edge: 'bottom', xMin: 1375, xMax: 1625, to: 'D1', note: 'the coastal trail back down to the cove' },
    { edge: 'top', xMin: 1300, xMax: 1500, to: 'B1', note: 'the trail climbs north past the old watchtower' },
    { edge: 'right', yMin: 950, yMax: 1150, to: 'C2', note: 'the road east toward the grassland' },
  ],

  // ---- Tidewrack NPCs (2026-09-02) ----
  // 12 villagers (9 human, 1 reformed Bramblekin, 2 Tidefolk — see CLAUDE.md's
  // confirmed roster) + a 3-strong mireman `pack` guarding the ship's boarding
  // walkway. Homes' doors are all pre-verified walkable with the real 36px
  // collider (see the header comment); `approach` is omitted everywhere since
  // every door point here already IS the walkable step-out spot (same as
  // D3's path-side doors — see world.js's home.approach comment).
  npcs: [
    {
      id: 'perrin_alders', name: 'Perrin Alders', role: 'COOK',
      sprite: 'assets/images/perrin_alders_overhead.png',
      portrait: 'assets/images/perrin_alders.png',
      speed: 40, startsHome: true,
      home: { door: { x: 1882, y: 1420 }, interior: 'assets/images/beach_hut_interior.jpg' },
      routine: [
        { do: 'wait', s: 70 },
        { do: 'leaveHome' },
        { do: 'goto', x: 1904, y: 1423 },
        { do: 'wait', s: 6 },
        { do: 'goHome' },
      ],
    },
    {
      id: 'roderick_vane', name: 'Roderick Vane', role: 'DOCKMASTER',
      sprite: 'assets/images/roderick_vane_overhead.png',
      portrait: 'assets/images/roderick_vane.png',
      speed: 40, startsHome: true,
      home: { door: { x: 970, y: 900 }, interior: 'assets/images/beach_hut_interior.jpg' },
      routine: [
        { do: 'wait', s: 55 },
        { do: 'leaveHome' },
        { do: 'goto', x: 1050, y: 1000 },
        { do: 'wait', s: 6 },
        { do: 'goHome' },
      ],
    },
    {
      id: 'wynne_ashcombe', name: 'Wynne Ashcombe', role: 'SHRINE-KEEPER',
      sprite: 'assets/images/wynne_ashcombe_overhead.png',
      portrait: 'assets/images/wynne_ashcombe.png',
      x: 1450, y: 350, speed: 38, startsHome: false,
      home: { door: { x: 1630, y: 880 }, interior: 'assets/images/beach_hut_interior.jpg' },
      routine: [
        { do: 'wait', s: 5 },
        { do: 'goto', x: 1400, y: 400 },
        { do: 'wait', s: 8 },
        { do: 'goHome' },
        { do: 'wait', s: 65 },
        { do: 'leaveHome' },
      ],
    },
    {
      id: 'toby_farrow', name: 'Toby Farrow', role: 'FISHERMAN',
      sprite: 'assets/images/toby_farrow_overhead.png',
      portrait: 'assets/images/toby_farrow.png',
      x: 795, y: 2150, speed: 40, startsHome: false,
      home: { door: { x: 1863, y: 1097 }, interior: 'assets/images/beach_hut_interior.jpg' },
      routine: [
        { do: 'wait', s: 6 },
        { do: 'goto', x: 775, y: 2236 },
        { do: 'wait', s: 10 },
        { do: 'goHome' },
        { do: 'wait', s: 60 },
        { do: 'leaveHome' },
      ],
    },
    {
      id: 'lily_farrow', name: 'Lily Farrow', role: '',
      sprite: 'assets/images/lily_farrow_overhead.png',
      portrait: 'assets/images/lily_farrow.png',
      x: 1900, y: 1150, speed: 50, startsHome: false,
      home: { door: { x: 1863, y: 1097 }, interior: 'assets/images/beach_hut_interior.jpg' },
      routine: [
        { do: 'wait', s: 4 },
        { do: 'goto', x: 1800, y: 1130 },
        { do: 'wait', s: 4 },
        { do: 'goto', x: 1900, y: 1150 },
        { do: 'wait', s: 4 },
        { do: 'goHome' },
        { do: 'wait', s: 30 },
        { do: 'leaveHome' },
      ],
    },
    {
      id: 'garrick_hollowmast', name: 'Garrick Hollowmast', role: '',
      sprite: 'assets/images/garrick_hollowmast_overhead.png',
      portrait: 'assets/images/garrick_hollowmast.png',
      x: 1000, y: 1000, speed: 38, startsHome: false,
      home: { door: { x: 2053, y: 992 }, interior: 'assets/images/beach_hut_interior.jpg' },
      routine: [
        { do: 'wait', s: 7 },
        { do: 'goto', x: 975, y: 1050 },
        { do: 'wait', s: 9 },
        { do: 'goHome' },
        { do: 'wait', s: 55 },
        { do: 'leaveHome' },
      ],
      // Garrick's payoff quest (carrying word back to Calder in D1) is
      // deliberately NOT wired up yet — flavor only for now, per CLAUDE.md's
      // "Row C design notes" (deferred to a future pass since it needs
      // cross-scene changes to D1's Calder dialogue).
      dialog: { line: 'Another day, another tally I don’t keep. Best not linger near me too long, friend — guilt’s not catching, but the drink might be.', responses: ['Leave.'] },
      chatter: [
        { q: 'What’s troubling you?', a: 'Nothing worth a stranger’s ear. Just… this village runs kinder than we deserve, some of us. Leave it there.' },
      ],
    },
    {
      id: 'senna_brineholt', name: 'Senna Brineholt', role: '',
      sprite: 'assets/images/senna_brineholt_overhead.png',
      portrait: 'assets/images/senna_brineholt.png',
      speed: 40, startsHome: true,
      home: { door: { x: 2135, y: 670 }, interior: 'assets/images/beach_hut_interior.jpg' },
      routine: [
        { do: 'wait', s: 60 },
        { do: 'leaveHome' },
        { do: 'goto', x: 2022, y: 673 },
        { do: 'wait', s: 6 },
        { do: 'goHome' },
      ],
      dialog: { line: 'Tidewrack’s not much to look at, I’ll grant you — but coin spends the same here as anywhere. Mind you don’t let the salt take your boots; good leather’s dear this far from a proper market.', responses: ['Leave.'] },
      chatter: [
        { q: 'Where did your coin come from?', a: 'Enterprise, traveler. Just enterprise. …Ask Garrick if you want a longer story. Mine’s shorter, and I intend to keep it that way.' },
      ],
    },
    {
      id: 'nils_cutwater', name: 'Nils Cutwater', role: '',
      sprite: 'assets/images/nils_cutwater_overhead.png',
      portrait: 'assets/images/nils_cutwater.png',
      x: 2550, y: 1750, speed: 38, startsHome: false,
      home: { door: { x: 2146, y: 1468 }, interior: 'assets/images/beach_hut_interior.jpg' },
      routine: [
        { do: 'wait', s: 8 },
        { do: 'goto', x: 2450, y: 1650 },
        { do: 'wait', s: 10 },
        { do: 'goHome' },
        { do: 'wait', s: 50 },
        { do: 'leaveHome' },
      ],
      dialog: { line: 'Rope doesn’t mend itself.', responses: ['Leave.'] },
      chatter: [
        { q: 'Rough work?', a: 'Better than idle hands. Idle hands remember too much.' },
      ],
    },
    {
      id: 'aldous_marrow', name: 'Aldous Marrow', role: '',
      sprite: 'assets/images/aldous_marrow_overhead.png',
      portrait: 'assets/images/aldous_marrow.png',
      x: 1425, y: 720, speed: 34, startsHome: false,
      home: { door: { x: 1920, y: 670 }, interior: 'assets/images/beach_hut_interior.jpg' },
      routine: [
        { do: 'wait', s: 9 },
        { do: 'goto', x: 1503, y: 717 },
        { do: 'wait', s: 8 },
        { do: 'goHome' },
        { do: 'wait', s: 45 },
        { do: 'leaveHome' },
      ],
      dialog: { line: 'Sit a spell, if your legs allow it. An old sailor’s tongue loosens easy enough with a bit of company.', responses: ['Leave.'] },
      chatter: [
        { q: 'Any word from the castle?', a: 'Rumor has it King Aldric’s sent his own knights out searching these past months — searching for what, nobody in Tidewrack rightly knows. Riders passing through don’t stop long enough to say, and the ones who might know more don’t come this far south at all.' },
        { q: 'Tell me a sea story.', a: 'I’ve buried more sea stories than years I’ve got left to tell them. Ask me again when the tide’s out and I’ve had my pipe — you’ll get a better one.' },
      ],
    },
    {
      id: 'skitter_nabbins', name: 'Skitter Nabbins', role: 'RATCATCHER',
      sprite: 'assets/images/skitter_nabbins_overhead.png',
      portrait: 'assets/images/skitter_nabbins.png',
      x: 975, y: 1000, speed: 44, startsHome: false,
      home: { door: { x: 1727, y: 1631 }, interior: 'assets/images/beach_hut_interior.jpg' },
      routine: [
        { do: 'wait', s: 6 },
        { do: 'goto', x: 1000, y: 950 },
        { do: 'wait', s: 8 },
        { do: 'goHome' },
        { do: 'wait', s: 40 },
        { do: 'leaveHome' },
      ],
      dialog: { line: 'Oh — oh, a visitor! Don’t mind the traps, they’re only set for rats, mostly. MOSTLY.', responses: ['Leave.'] },
      chatter: [
        { q: 'How’d you end up here?', a: 'Wandered in chasing a rat that chased a chicken that chased — well, it’s a long story, and the short of it is Tidewrack decided to keep me. Fair trade, I think. Rats for a roof.' },
      ],
    },
    // Tidefolk — no home (they live apart, in the tide-pool cove); a plain
    // short wander loop, same pattern as C4's Mara/Vozhik.
    {
      id: 'isolde_pearlwake', name: 'Isolde Pearlwake', role: 'HERBALIST',
      sprite: 'assets/images/isolde_pearlwake_overhead.png',
      portrait: 'assets/images/isolde_pearlwake.png',
      x: 2550, y: 1700, speed: 34, startsHome: false,
      patrol: [ { x: 2550, y: 1700 }, { x: 2450, y: 1900 } ],
      dialog: { line: 'The tide pools hold more than crabs, if you know where to look. What brings you to my corner of the shore?', responses: ['Leave.'] },
      chatter: [
        { q: 'What is Tidefolk?', a: 'An old blood, older than this village. We keep to the water more than most — old habit, older than memory, if I’m honest with you.' },
      ],
    },
    {
      id: 'cade_fathom', name: 'Cade Fathom', role: 'DIVER',
      sprite: 'assets/images/cade_fathom_overhead.png',
      portrait: 'assets/images/cade_fathom.png',
      x: 2600, y: 1550, speed: 40, startsHome: false,
      patrol: [ { x: 2600, y: 1550 }, { x: 2500, y: 1850 } ],
      dialog: { line: 'You’ve got dry-land legs under you, but I’d wager you could learn to hold your breath if it came to it. Most can, with reason enough.', responses: ['Leave.'] },
      chatter: [
        { q: 'Could you dive the wreck?', a: 'Faster than any of Roderick’s rope-and-lantern crews, I’d wager — if he’d ever let me near it. Someday, maybe. When there’s a reason worth the risk.' },
      ],
    },

    // ---- Miremen guarding the Maiden's Grace (2026-09-02) ----
    // Three roaming `creature` miremen, milling on the dock's boarding
    // walkway/gangway (the only part of the dock complex left walkable — see
    // the collision header comment) right where it meets the ship. A `pack`
    // (same mechanic as C4's clearing bramblekin): striking any one drags the
    // whole trio into one fight, and winning clears them all. The ship's
    // interior/cargo is deliberately NOT built yet (Danny: "we'll focus on
    // the ship later") — this is just the deterrent guarding it for now.
    {
      id: 'mireman_c1_1', name: 'Mireman', role: '',
      creature: true, enemyId: 'mireman', pack: 'ship_miremen',
      sprite: 'assets/images/mireman_overhead.png',
      portrait: 'assets/images/mireman.png',
      x: 700, y: 760, speed: 35, chaseSpeed: 140, aggroRange: 300, giveUpRange: 700, startsHome: false,
      patrol: [ { x: 700, y: 760 }, { x: 750, y: 800 } ],
    },
    {
      id: 'mireman_c1_2', name: 'Mireman', role: '',
      creature: true, enemyId: 'mireman', pack: 'ship_miremen',
      sprite: 'assets/images/mireman_overhead.png',
      portrait: 'assets/images/mireman.png',
      x: 820, y: 780, speed: 35, chaseSpeed: 140, aggroRange: 300, giveUpRange: 700, startsHome: false,
      patrol: [ { x: 820, y: 780 }, { x: 780, y: 740 } ],
    },
    {
      id: 'mireman_c1_3', name: 'Mireman', role: '',
      creature: true, enemyId: 'mireman', pack: 'ship_miremen',
      sprite: 'assets/images/mireman_overhead.png',
      portrait: 'assets/images/mireman.png',
      x: 880, y: 810, speed: 35, chaseSpeed: 140, aggroRange: 300, giveUpRange: 700, startsHome: false,
      patrol: [ { x: 880, y: 810 }, { x: 850, y: 760 } ],
    },
  ],
};
