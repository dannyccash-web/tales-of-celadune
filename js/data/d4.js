// Scene D4 — WOODS (overworld row D, column 4)
// World coordinates: 1920x1920. Origin top-left.
//
// Layout: the main path enters from the WEST edge (continuing D3's main
// path band, y~890-990), crosses a river on a plank bridge, then splits —
// the lower branch runs south-east to a fenced woodland camp (tents +
// firepit, placeholder for future content), the upper branch meanders
// around a meadow, crosses the river twice more (a second bridge on the
// way to a cave mouth in the northwest, a third heading north off the TOP
// edge toward C4). The river and the tree cover are impassable; the three
// bridges are the only crossings.
//
// Collision map generated 2026-07-10 from a per-25px-cell color
// classification of D4_Background.jpg (path/grass walkable; water, rock,
// dense canopy blocked), plus hand-carved corridors for the three bridges,
// the cave approach, the camp clearing, and both exit aprons — then
// verified headless: every landmark (both exits, all bridges, cave front,
// camp) is reachable by the 36px collider using the engine's own movement
// (see the session writeup in CLAUDE.md). Rects are 25px-aligned like D3's,
// but machine-merged rather than hand-labeled — regenerate rather than
// hand-editing if the art ever changes.

export default {
  id: 'D4',
  name: 'Woods',
  background: 'assets/images/D4_Background.jpg',
  width: 1920,
  height: 1920,

  // Just inside the west entrance (only used on a direct boot into D4 —
  // normal arrival comes through the scene-transition system).
  spawn: { x: 60, y: 940 },

  obstacles: [
    { x: 0, y: 0, w: 950, h: 50 },
    { x: 1100, y: 0, w: 820, h: 150 },
    { x: 0, y: 50, w: 975, h: 25 },
    { x: 0, y: 75, w: 225, h: 25 },
    { x: 300, y: 75, w: 675, h: 50 },
    { x: 0, y: 100, w: 125, h: 125 },
    { x: 325, y: 125, w: 650, h: 25 },
    { x: 350, y: 150, w: 625, h: 50 },
    { x: 1150, y: 150, w: 770, h: 25 },
    { x: 1175, y: 175, w: 745, h: 50 },
    { x: 350, y: 200, w: 25, h: 25 },
    { x: 450, y: 200, w: 525, h: 25 },
    { x: 0, y: 225, w: 200, h: 50 },
    { x: 475, y: 225, w: 500, h: 25 },
    { x: 1200, y: 225, w: 720, h: 50 },
    { x: 475, y: 250, w: 450, h: 25 },
    { x: 975, y: 250, w: 25, h: 25 },
    { x: 0, y: 275, w: 275, h: 25 },
    { x: 425, y: 275, w: 500, h: 25 },
    { x: 1150, y: 275, w: 770, h: 25 },
    { x: 0, y: 300, w: 250, h: 50 },
    { x: 550, y: 300, w: 375, h: 50 },
    { x: 1200, y: 300, w: 720, h: 75 },
    { x: 0, y: 350, w: 275, h: 75 },
    { x: 500, y: 350, w: 425, h: 25 },
    { x: 500, y: 375, w: 50, h: 25 },
    { x: 600, y: 375, w: 325, h: 25 },
    { x: 1175, y: 375, w: 125, h: 25 },
    { x: 1475, y: 375, w: 445, h: 25 },
    { x: 625, y: 400, w: 325, h: 25 },
    { x: 1150, y: 400, w: 125, h: 25 },
    { x: 1525, y: 400, w: 395, h: 50 },
    { x: 0, y: 425, w: 300, h: 25 },
    { x: 675, y: 425, w: 325, h: 50 },
    { x: 1175, y: 425, w: 75, h: 25 },
    { x: 0, y: 450, w: 375, h: 25 },
    { x: 1575, y: 450, w: 345, h: 25 },
    { x: 0, y: 475, w: 475, h: 25 },
    { x: 650, y: 475, w: 350, h: 25 },
    { x: 1600, y: 475, w: 320, h: 25 },
    { x: 0, y: 500, w: 500, h: 75 },
    { x: 750, y: 500, w: 300, h: 50 },
    { x: 1675, y: 500, w: 245, h: 25 },
    { x: 1350, y: 525, w: 25, h: 25 },
    { x: 1700, y: 525, w: 220, h: 75 },
    { x: 800, y: 550, w: 250, h: 75 },
    { x: 1350, y: 550, w: 75, h: 25 },
    { x: 0, y: 575, w: 525, h: 25 },
    { x: 1350, y: 575, w: 100, h: 25 },
    { x: 1500, y: 575, w: 75, h: 25 },
    { x: 0, y: 600, w: 575, h: 25 },
    { x: 1325, y: 600, w: 125, h: 25 },
    { x: 1500, y: 600, w: 100, h: 25 },
    { x: 1750, y: 600, w: 170, h: 50 },
    { x: 0, y: 625, w: 600, h: 75 },
    { x: 875, y: 625, w: 100, h: 25 },
    { x: 1325, y: 625, w: 275, h: 25 },
    { x: 900, y: 650, w: 75, h: 25 },
    { x: 1225, y: 650, w: 400, h: 50 },
    { x: 1725, y: 650, w: 195, h: 25 },
    { x: 1750, y: 675, w: 170, h: 25 },
    { x: 0, y: 700, w: 625, h: 50 },
    { x: 1200, y: 700, w: 450, h: 25 },
    { x: 1775, y: 700, w: 145, h: 100 },
    { x: 675, y: 725, w: 100, h: 25 },
    { x: 1175, y: 725, w: 475, h: 25 },
    { x: 0, y: 750, w: 800, h: 25 },
    { x: 1225, y: 750, w: 425, h: 25 },
    { x: 0, y: 775, w: 900, h: 25 },
    { x: 975, y: 775, w: 175, h: 25 },
    { x: 1225, y: 775, w: 400, h: 50 },
    { x: 0, y: 800, w: 1150, h: 25 },
    { x: 1750, y: 800, w: 170, h: 50 },
    { x: 0, y: 825, w: 275, h: 50 },
    { x: 350, y: 825, w: 75, h: 25 },
    { x: 500, y: 825, w: 600, h: 50 },
    { x: 1225, y: 825, w: 425, h: 25 },
    { x: 1225, y: 850, w: 450, h: 25 },
    { x: 1775, y: 850, w: 145, h: 50 },
    { x: 500, y: 875, w: 575, h: 50 },
    { x: 1200, y: 875, w: 475, h: 25 },
    { x: 1200, y: 900, w: 450, h: 25 },
    { x: 1750, y: 900, w: 170, h: 25 },
    { x: 500, y: 925, w: 250, h: 25 },
    { x: 825, y: 925, w: 800, h: 25 },
    { x: 1775, y: 925, w: 145, h: 50 },
    { x: 525, y: 950, w: 225, h: 25 },
    { x: 850, y: 950, w: 775, h: 25 },
    { x: 550, y: 975, w: 225, h: 25 },
    { x: 925, y: 975, w: 700, h: 75 },
    { x: 1750, y: 975, w: 170, h: 75 },
    { x: 0, y: 1000, w: 50, h: 25 },
    { x: 100, y: 1000, w: 200, h: 25 },
    { x: 550, y: 1000, w: 250, h: 50 },
    { x: 0, y: 1025, w: 275, h: 50 },
    { x: 375, y: 1050, w: 50, h: 25 },
    { x: 575, y: 1050, w: 225, h: 50 },
    { x: 950, y: 1050, w: 675, h: 25 },
    { x: 1725, y: 1050, w: 195, h: 450 },
    { x: 0, y: 1075, w: 300, h: 25 },
    { x: 350, y: 1075, w: 75, h: 25 },
    { x: 950, y: 1075, w: 625, h: 25 },
    { x: 0, y: 1100, w: 425, h: 50 },
    { x: 600, y: 1100, w: 200, h: 25 },
    { x: 850, y: 1100, w: 50, h: 25 },
    { x: 950, y: 1100, w: 50, h: 25 },
    { x: 1050, y: 1100, w: 525, h: 25 },
    { x: 625, y: 1125, w: 150, h: 25 },
    { x: 1075, y: 1125, w: 500, h: 25 },
    { x: 0, y: 1150, w: 450, h: 50 },
    { x: 625, y: 1150, w: 100, h: 25 },
    { x: 1125, y: 1150, w: 250, h: 25 },
    { x: 675, y: 1175, w: 25, h: 25 },
    { x: 1175, y: 1175, w: 200, h: 25 },
    { x: 0, y: 1200, w: 475, h: 25 },
    { x: 1175, y: 1200, w: 275, h: 50 },
    { x: 0, y: 1225, w: 525, h: 25 },
    { x: 850, y: 1225, w: 75, h: 25 },
    { x: 0, y: 1250, w: 500, h: 100 },
    { x: 825, y: 1250, w: 200, h: 25 },
    { x: 1200, y: 1250, w: 250, h: 75 },
    { x: 625, y: 1275, w: 25, h: 25 },
    { x: 750, y: 1275, w: 300, h: 25 },
    { x: 550, y: 1300, w: 100, h: 25 },
    { x: 700, y: 1300, w: 350, h: 25 },
    { x: 550, y: 1325, w: 500, h: 25 },
    { x: 1200, y: 1325, w: 100, h: 50 },
    { x: 0, y: 1350, w: 1050, h: 50 },
    { x: 1550, y: 1375, w: 125, h: 125 },
    { x: 0, y: 1400, w: 1075, h: 25 },
    { x: 1125, y: 1400, w: 25, h: 25 },
    { x: 1350, y: 1400, w: 100, h: 25 },
    { x: 0, y: 1425, w: 1150, h: 25 },
    { x: 1300, y: 1425, w: 150, h: 125 },
    { x: 0, y: 1450, w: 1200, h: 125 },
    { x: 1700, y: 1500, w: 220, h: 50 },
    { x: 1275, y: 1550, w: 200, h: 25 },
    { x: 1575, y: 1550, w: 345, h: 125 },
    { x: 0, y: 1575, w: 1475, h: 125 },
    { x: 1700, y: 1675, w: 220, h: 50 },
    { x: 0, y: 1700, w: 1575, h: 25 },
    { x: 0, y: 1725, w: 1920, h: 195 },  ],

  // Proximity labels (same system as D3's building labels).
  buildings: [
    { label: 'Old Cave', x: 160, y: 260, r: 140 },
    { label: 'Woodland Camp', x: 1420, y: 1300, r: 220 },
  ],

  entrances: [],

  interactables: [
    {
      id: 'shiny-bridge-south',
      x: 1080, y: 450, w: 80, h: 80,
      label: 'A shiny object',
      reward: { gold: 4 },
    },
  ],

  // Two blight rats prowl the abandoned camp's north entrance.
  battles: [
    {
      id: 'woods_camp_rats',
      door: { x: 1500, y: 1250 },
      enemies: ['blight_rat', 'blight_rat'],
    },
  ],

  // West back to the D3 Farm (band matches D3's east exit, so walking off
  // either edge lands on the other scene's path at the same height).
  // North toward C3/C4 woods — not built yet.
  exits: [
    { edge: 'left', yMin: 890, yMax: 990, to: 'D3', note: 'main path west to the Farm' },
    { edge: 'top', xMin: 975, xMax: 1100, to: 'C4', note: 'path north into deeper woods' },
  ],

  npcs: [],
};
