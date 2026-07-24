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
// Collision auto-generated 2026-07-24 from the background art (no hand-painted
// walkable guide for this scene). Per-20px-cell colour classification
// (sea/pool blue + bare rock + dark palm canopy = blocked; sand/road + open
// grass = walkable), the dirt road carved as an explicit corridor from the
// east entrance to the beach, then a reachability flood-fill from the entrance
// keeps only the connected walkable region (walling off every isolated pocket,
// the sea and the headland for free) with a 1-cell collider shoulder. Verified
// headless with the real engine physics (World.canMove) — see the session
// workflow. Regenerate from the art rather than hand-editing these rects.

export default {
  id: 'D1',
  name: 'Shipwreck Cove',
  background: 'assets/images/D1_Background.jpg',
  width: 1920,
  height: 1920,

  // Just inside the east entrance, on the road (only used on a direct boot into
  // D1 — normal arrival comes through the scene-transition system from D2).
  spawn: { x: 1840, y: 680 },

  obstacles: [
    { x: 0, y: 0, w: 320, h: 20 },
    { x: 580, y: 0, w: 1340, h: 80 },
    { x: 0, y: 20, w: 300, h: 40 },
    { x: 540, y: 40, w: 40, h: 20 },
    { x: 0, y: 60, w: 280, h: 40 },
    { x: 560, y: 60, w: 20, h: 20 },
    { x: 640, y: 80, w: 1280, h: 220 },
    { x: 0, y: 100, w: 260, h: 60 },
    { x: 540, y: 140, w: 20, h: 120 },
    { x: 0, y: 160, w: 240, h: 160 },
    { x: 520, y: 160, w: 20, h: 100 },
    { x: 560, y: 160, w: 80, h: 160 },
    { x: 440, y: 180, w: 20, h: 20 },
    { x: 500, y: 220, w: 20, h: 40 },
    { x: 240, y: 240, w: 60, h: 40 },
    { x: 240, y: 280, w: 20, h: 40 },
    { x: 460, y: 280, w: 20, h: 20 },
    { x: 640, y: 300, w: 20, h: 20 },
    { x: 740, y: 300, w: 1180, h: 20 },
    { x: 0, y: 320, w: 220, h: 100 },
    { x: 580, y: 320, w: 60, h: 20 },
    { x: 760, y: 320, w: 180, h: 20 },
    { x: 1000, y: 320, w: 920, h: 40 },
    { x: 480, y: 340, w: 20, h: 20 },
    { x: 600, y: 340, w: 20, h: 20 },
    { x: 800, y: 340, w: 80, h: 40 },
    { x: 1020, y: 360, w: 900, h: 40 },
    { x: 220, y: 380, w: 20, h: 20 },
    { x: 820, y: 380, w: 60, h: 20 },
    { x: 560, y: 400, w: 20, h: 40 },
    { x: 840, y: 400, w: 40, h: 200 },
    { x: 1040, y: 400, w: 880, h: 100 },
    { x: 0, y: 420, w: 200, h: 20 },
    { x: 0, y: 440, w: 180, h: 100 },
    { x: 260, y: 460, w: 20, h: 60 },
    { x: 280, y: 480, w: 20, h: 160 },
    { x: 240, y: 500, w: 20, h: 20 },
    { x: 740, y: 500, w: 20, h: 120 },
    { x: 880, y: 500, w: 20, h: 100 },
    { x: 1060, y: 500, w: 860, h: 40 },
    { x: 760, y: 520, w: 80, h: 100 },
    { x: 900, y: 520, w: 20, h: 80 },
    { x: 0, y: 540, w: 160, h: 180 },
    { x: 300, y: 540, w: 60, h: 260 },
    { x: 720, y: 540, w: 20, h: 60 },
    { x: 1080, y: 540, w: 840, h: 20 },
    { x: 360, y: 560, w: 20, h: 440 },
    { x: 540, y: 560, w: 40, h: 20 },
    { x: 1100, y: 560, w: 820, h: 40 },
    { x: 380, y: 580, w: 20, h: 420 },
    { x: 700, y: 580, w: 20, h: 20 },
    { x: 840, y: 600, w: 20, h: 20 },
    { x: 1200, y: 600, w: 640, h: 20 },
    { x: 1340, y: 620, w: 60, h: 20 },
    { x: 1460, y: 620, w: 380, h: 20 },
    { x: 400, y: 640, w: 20, h: 400 },
    { x: 1560, y: 640, w: 40, h: 20 },
    { x: 160, y: 660, w: 20, h: 40 },
    { x: 420, y: 660, w: 20, h: 400 },
    { x: 440, y: 700, w: 20, h: 380 },
    { x: 960, y: 700, w: 100, h: 140 },
    { x: 0, y: 720, w: 140, h: 100 },
    { x: 900, y: 720, w: 60, h: 120 },
    { x: 1060, y: 720, w: 140, h: 180 },
    { x: 280, y: 740, w: 20, h: 40 },
    { x: 460, y: 740, w: 20, h: 360 },
    { x: 860, y: 740, w: 40, h: 60 },
    { x: 1200, y: 740, w: 40, h: 340 },
    { x: 1340, y: 740, w: 40, h: 320 },
    { x: 1700, y: 740, w: 140, h: 1180 },
    { x: 260, y: 760, w: 20, h: 20 },
    { x: 480, y: 760, w: 20, h: 380 },
    { x: 840, y: 760, w: 20, h: 20 },
    { x: 1240, y: 760, w: 100, h: 320 },
    { x: 1460, y: 760, w: 240, h: 1160 },
    { x: 1380, y: 780, w: 80, h: 280 },
    { x: 320, y: 800, w: 40, h: 200 },
    { x: 500, y: 800, w: 20, h: 340 },
    { x: 1840, y: 800, w: 80, h: 1120 },
    { x: 0, y: 820, w: 120, h: 80 },
    { x: 520, y: 840, w: 80, h: 20 },
    { x: 920, y: 840, w: 20, h: 20 },
    { x: 1000, y: 840, w: 60, h: 20 },
    { x: 260, y: 860, w: 60, h: 20 },
    { x: 1040, y: 860, w: 20, h: 40 },
    { x: 280, y: 880, w: 40, h: 40 },
    { x: 0, y: 900, w: 100, h: 100 },
    { x: 1080, y: 900, w: 120, h: 40 },
    { x: 300, y: 920, w: 20, h: 80 },
    { x: 1120, y: 940, w: 80, h: 60 },
    { x: 100, y: 960, w: 20, h: 20 },
    { x: 280, y: 980, w: 20, h: 20 },
    { x: 0, y: 1000, w: 80, h: 40 },
    { x: 260, y: 1000, w: 20, h: 40 },
    { x: 520, y: 1000, w: 20, h: 80 },
    { x: 1140, y: 1000, w: 60, h: 40 },
    { x: 240, y: 1020, w: 20, h: 20 },
    { x: 0, y: 1040, w: 60, h: 100 },
    { x: 540, y: 1040, w: 20, h: 40 },
    { x: 1180, y: 1040, w: 20, h: 40 },
    { x: 1400, y: 1060, w: 60, h: 860 },
    { x: 1220, y: 1080, w: 100, h: 20 },
    { x: 260, y: 1100, w: 20, h: 20 },
    { x: 1280, y: 1100, w: 20, h: 20 },
    { x: 0, y: 1140, w: 40, h: 20 },
    { x: 180, y: 1140, w: 20, h: 40 },
    { x: 1380, y: 1140, w: 20, h: 780 },
    { x: 1200, y: 1160, w: 20, h: 80 },
    { x: 1360, y: 1160, w: 20, h: 760 },
    { x: 1280, y: 1180, w: 80, h: 740 },
    { x: 880, y: 1200, w: 40, h: 40 },
    { x: 260, y: 1220, w: 20, h: 60 },
    { x: 920, y: 1220, w: 20, h: 40 },
    { x: 1220, y: 1220, w: 60, h: 20 },
    { x: 280, y: 1240, w: 20, h: 20 },
    { x: 700, y: 1240, w: 100, h: 680 },
    { x: 900, y: 1240, w: 20, h: 680 },
    { x: 1240, y: 1240, w: 40, h: 680 },
    { x: 800, y: 1280, w: 20, h: 640 },
    { x: 620, y: 1300, w: 80, h: 620 },
    { x: 820, y: 1300, w: 80, h: 620 },
    { x: 1220, y: 1300, w: 20, h: 40 },
    { x: 920, y: 1320, w: 20, h: 600 },
    { x: 1200, y: 1320, w: 20, h: 20 },
    { x: 60, y: 1360, w: 20, h: 20 },
    { x: 1000, y: 1360, w: 60, h: 40 },
    { x: 600, y: 1380, w: 20, h: 540 },
    { x: 940, y: 1380, w: 60, h: 20 },
    { x: 1060, y: 1380, w: 40, h: 20 },
    { x: 940, y: 1400, w: 40, h: 520 },
    { x: 340, y: 1420, w: 60, h: 500 },
    { x: 580, y: 1420, w: 20, h: 500 },
    { x: 1220, y: 1420, w: 20, h: 500 },
    { x: 400, y: 1440, w: 80, h: 480 },
    { x: 980, y: 1460, w: 40, h: 460 },
    { x: 1160, y: 1460, w: 60, h: 460 },
    { x: 0, y: 1480, w: 40, h: 440 },
    { x: 200, y: 1480, w: 80, h: 440 },
    { x: 1100, y: 1480, w: 60, h: 440 },
    { x: 160, y: 1500, w: 40, h: 420 },
    { x: 280, y: 1500, w: 60, h: 420 },
    { x: 480, y: 1500, w: 100, h: 420 },
    { x: 1020, y: 1500, w: 20, h: 420 },
    { x: 40, y: 1520, w: 60, h: 400 },
    { x: 1040, y: 1520, w: 60, h: 400 },
    { x: 100, y: 1560, w: 60, h: 360 },
  ],

  // Proximity label (same system as D3's building labels / D4's cave label).
  buildings: [
    { label: 'Shipwreck', x: 380, y: 820, r: 220 },
  ],

  entrances: [],

  // One hidden collectible: a glint in the sand beside the wreck.
  interactables: [
    {
      id: 'shiny-wreck-sand',
      x: 520, y: 760, w: 80, h: 80,
      label: 'Something glints in the sand',
      reward: { gold: 5 },
    },
  ],

  // No NPCs or encounters yet — traversable first pass.
  npcs: [],
  battles: [],

  // East back to the D2 Village (band matches D2's west exit, y640-720, so
  // walking off either edge lands on the other scene's road at the same
  // height). West is open sea, north/south are cliffs — no exits there.
  exits: [
    { edge: 'right', yMin: 640, yMax: 720, to: 'D2', note: 'road east to the Village' },
  ],
};
