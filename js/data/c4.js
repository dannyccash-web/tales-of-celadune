// Scene C4 — WOODS (overworld row C, column 4)
// World coordinates: 3000x3000. Origin top-left.
//
// The row above D4 — the player pushes NORTH out of D4's top edge and arrives
// here at the bottom. A river runs down the WEST edge (impassable); dirt paths
// wind through dense forest, looping around a central dirt CLEARING. In the
// top-left a traveller's camp sits by a river bend (a lit campfire, tents and a
// wagon in the art) — Mara Vellorne and her companion Vozhik, robbed by the
// clearing's bramblekin. THREE bramblekin roam the clearing guarding a chest of
// stolen goods (a pack: attack one and all three pile in). Two Rootweaver
// ambushes lurk on the eastern loop trails.
//
// 2026-10-12: NEW BACKGROUND ART (Danny). Same path loop and clearing, but the
// river is narrower and sits further west, the far bank now shows the edge of
// C3's temple island (unreachable from here), the camp is a tent + covered
// wagon with no painted fire pit, and the lower-left is open meadow with big
// agaves. Collision was REGENERATED from the art (no walkable guide this time):
// per-20px-cell colour/texture features -> random-forest classifier trained on
// hand-picked boxes of path, meadow, canopy, water and the two tents, plus the
// old collision on the unchanged east third -> de-speckle -> tent/wagon stamped
// solid -> 1-cell frame with the two exit mouths left open -> collider-clearance
// flood from the bottom path. Exit bands are the terrain's own run at each edge
// (top x1338-1441, bottom x1498-1561); main.js's settleArrival() lines the
// player up when D4's mouth doesn't match to the pixel. Verified with the 36px
// collider: one connected floor; spawn, both exits, every NPC/patrol point,
// the chest, both Rootweaver points + retreats, both chestnuts and the fishing
// bank reachable; the EAST SNEAK ROUTE still reaches the chest's east side
// without entering the pack's 344px aggro. To tweak, send a "collision markup"
// (blue = walkable, yellow = blocked) and apply it as a delta.

export default {
  id: 'C4',
  name: 'Woods',
  background: 'assets/images/C4_Background.jpg',
  width: 3000,
  height: 3000,

  // Just inside the south (D4-facing) edge — only used on a direct boot; normal
  // arrival comes up through the scene-transition system onto the bottom band.
  spawn: { x: 1530, y: 2940 },

  obstacles: [
    { x: 0, y: 0, w: 1320, h: 60 },
    { x: 1460, y: 0, w: 1540, h: 100 },
    { x: 0, y: 60, w: 1300, h: 60 },
    { x: 1480, y: 100, w: 1520, h: 60 },
    { x: 0, y: 120, w: 1320, h: 120 },
    { x: 1500, y: 160, w: 1500, h: 40 },
    { x: 1540, y: 200, w: 1460, h: 40 },
    { x: 0, y: 240, w: 1340, h: 20 },
    { x: 1560, y: 240, w: 40, h: 20 },
    { x: 1660, y: 240, w: 1340, h: 20 },
    { x: 0, y: 260, w: 1320, h: 40 },
    { x: 1680, y: 260, w: 1320, h: 40 },
    { x: 0, y: 300, w: 600, h: 20 },
    { x: 660, y: 300, w: 160, h: 40 },
    { x: 880, y: 300, w: 500, h: 20 },
    { x: 1660, y: 300, w: 1340, h: 20 },
    { x: 0, y: 320, w: 580, h: 100 },
    { x: 920, y: 320, w: 500, h: 20 },
    { x: 1680, y: 320, w: 1320, h: 20 },
    { x: 660, y: 340, w: 180, h: 40 },
    { x: 980, y: 340, w: 460, h: 40 },
    { x: 1680, y: 340, w: 80, h: 20 },
    { x: 1840, y: 340, w: 1160, h: 20 },
    { x: 1860, y: 360, w: 200, h: 40 },
    { x: 2220, y: 360, w: 60, h: 20 },
    { x: 2320, y: 360, w: 680, h: 60 },
    { x: 660, y: 380, w: 160, h: 80 },
    { x: 980, y: 380, w: 480, h: 80 },
    { x: 0, y: 420, w: 600, h: 20 },
    { x: 2380, y: 420, w: 620, h: 20 },
    { x: 0, y: 440, w: 620, h: 40 },
    { x: 2400, y: 440, w: 600, h: 20 },
    { x: 1100, y: 460, w: 360, h: 20 },
    { x: 2420, y: 460, w: 580, h: 20 },
    { x: 0, y: 480, w: 580, h: 20 },
    { x: 1180, y: 480, w: 260, h: 20 },
    { x: 2460, y: 480, w: 540, h: 20 },
    { x: 0, y: 500, w: 520, h: 20 },
    { x: 1200, y: 500, w: 240, h: 20 },
    { x: 2500, y: 500, w: 500, h: 20 },
    { x: 0, y: 520, w: 500, h: 80 },
    { x: 1240, y: 520, w: 180, h: 20 },
    { x: 1780, y: 520, w: 20, h: 20 },
    { x: 2540, y: 520, w: 460, h: 60 },
    { x: 1280, y: 540, w: 140, h: 20 },
    { x: 1640, y: 540, w: 160, h: 20 },
    { x: 1280, y: 560, w: 160, h: 20 },
    { x: 1620, y: 560, w: 220, h: 20 },
    { x: 2080, y: 560, w: 120, h: 20 },
    { x: 1340, y: 580, w: 20, h: 20 },
    { x: 1620, y: 580, w: 280, h: 20 },
    { x: 2060, y: 580, w: 220, h: 20 },
    { x: 2520, y: 580, w: 480, h: 40 },
    { x: 0, y: 600, w: 520, h: 60 },
    { x: 920, y: 600, w: 60, h: 20 },
    { x: 1620, y: 600, w: 320, h: 20 },
    { x: 2060, y: 600, w: 260, h: 20 },
    { x: 760, y: 620, w: 240, h: 20 },
    { x: 1580, y: 620, w: 780, h: 20 },
    { x: 2540, y: 620, w: 460, h: 20 },
    { x: 740, y: 640, w: 280, h: 20 },
    { x: 1580, y: 640, w: 800, h: 20 },
    { x: 2560, y: 640, w: 440, h: 40 },
    { x: 0, y: 660, w: 540, h: 20 },
    { x: 720, y: 660, w: 300, h: 20 },
    { x: 1560, y: 660, w: 840, h: 20 },
    { x: 0, y: 680, w: 560, h: 40 },
    { x: 720, y: 680, w: 280, h: 100 },
    { x: 1560, y: 680, w: 860, h: 20 },
    { x: 2620, y: 680, w: 380, h: 60 },
    { x: 1560, y: 700, w: 880, h: 20 },
    { x: 0, y: 720, w: 580, h: 20 },
    { x: 1560, y: 720, w: 900, h: 20 },
    { x: 0, y: 740, w: 600, h: 40 },
    { x: 1240, y: 740, w: 200, h: 20 },
    { x: 1580, y: 740, w: 880, h: 40 },
    { x: 2640, y: 740, w: 360, h: 200 },
    { x: 1220, y: 760, w: 240, h: 20 },
    { x: 0, y: 780, w: 620, h: 20 },
    { x: 700, y: 780, w: 320, h: 20 },
    { x: 1200, y: 780, w: 260, h: 20 },
    { x: 1600, y: 780, w: 880, h: 40 },
    { x: 0, y: 800, w: 1020, h: 20 },
    { x: 1180, y: 800, w: 320, h: 20 },
    { x: 0, y: 820, w: 1040, h: 20 },
    { x: 1160, y: 820, w: 340, h: 20 },
    { x: 1620, y: 820, w: 860, h: 20 },
    { x: 0, y: 840, w: 700, h: 40 },
    { x: 780, y: 840, w: 240, h: 20 },
    { x: 1140, y: 840, w: 340, h: 40 },
    { x: 1620, y: 840, w: 880, h: 40 },
    { x: 800, y: 860, w: 140, h: 20 },
    { x: 0, y: 880, w: 720, h: 100 },
    { x: 820, y: 880, w: 40, h: 20 },
    { x: 1120, y: 880, w: 360, h: 20 },
    { x: 1620, y: 880, w: 900, h: 100 },
    { x: 1100, y: 900, w: 360, h: 40 },
    { x: 1080, y: 940, w: 400, h: 20 },
    { x: 2660, y: 940, w: 340, h: 40 },
    { x: 1040, y: 960, w: 420, h: 20 },
    { x: 0, y: 980, w: 740, h: 20 },
    { x: 1000, y: 980, w: 460, h: 20 },
    { x: 1600, y: 980, w: 920, h: 20 },
    { x: 2680, y: 980, w: 320, h: 20 },
    { x: 0, y: 1000, w: 720, h: 60 },
    { x: 980, y: 1000, w: 460, h: 20 },
    { x: 1600, y: 1000, w: 940, h: 20 },
    { x: 2700, y: 1000, w: 300, h: 20 },
    { x: 920, y: 1020, w: 520, h: 20 },
    { x: 1600, y: 1020, w: 960, h: 40 },
    { x: 2740, y: 1020, w: 260, h: 40 },
    { x: 880, y: 1040, w: 560, h: 40 },
    { x: 0, y: 1060, w: 740, h: 40 },
    { x: 1620, y: 1060, w: 940, h: 80 },
    { x: 2720, y: 1060, w: 280, h: 20 },
    { x: 900, y: 1080, w: 520, h: 60 },
    { x: 2700, y: 1080, w: 300, h: 20 },
    { x: 0, y: 1100, w: 720, h: 280 },
    { x: 2720, y: 1100, w: 280, h: 40 },
    { x: 920, y: 1140, w: 500, h: 20 },
    { x: 1640, y: 1140, w: 940, h: 20 },
    { x: 2740, y: 1140, w: 260, h: 100 },
    { x: 940, y: 1160, w: 460, h: 40 },
    { x: 1680, y: 1160, w: 900, h: 80 },
    { x: 900, y: 1200, w: 500, h: 20 },
    { x: 900, y: 1220, w: 480, h: 20 },
    { x: 920, y: 1240, w: 460, h: 20 },
    { x: 1700, y: 1240, w: 880, h: 40 },
    { x: 2720, y: 1240, w: 280, h: 60 },
    { x: 920, y: 1260, w: 440, h: 20 },
    { x: 900, y: 1280, w: 440, h: 20 },
    { x: 1720, y: 1280, w: 860, h: 20 },
    { x: 900, y: 1300, w: 420, h: 20 },
    { x: 1920, y: 1300, w: 660, h: 40 },
    { x: 2700, y: 1300, w: 300, h: 40 },
    { x: 880, y: 1320, w: 440, h: 40 },
    { x: 1940, y: 1340, w: 640, h: 20 },
    { x: 2720, y: 1340, w: 280, h: 20 },
    { x: 900, y: 1360, w: 400, h: 60 },
    { x: 1980, y: 1360, w: 20, h: 20 },
    { x: 2040, y: 1360, w: 540, h: 20 },
    { x: 2740, y: 1360, w: 260, h: 60 },
    { x: 0, y: 1380, w: 700, h: 40 },
    { x: 2040, y: 1380, w: 440, h: 20 },
    { x: 2520, y: 1380, w: 60, h: 20 },
    { x: 2060, y: 1400, w: 400, h: 20 },
    { x: 2540, y: 1400, w: 20, h: 20 },
    { x: 0, y: 1420, w: 720, h: 20 },
    { x: 900, y: 1420, w: 360, h: 40 },
    { x: 2080, y: 1420, w: 280, h: 20 },
    { x: 2720, y: 1420, w: 280, h: 20 },
    { x: 0, y: 1440, w: 740, h: 120 },
    { x: 2080, y: 1440, w: 20, h: 20 },
    { x: 2140, y: 1440, w: 200, h: 20 },
    { x: 2700, y: 1440, w: 300, h: 160 },
    { x: 900, y: 1460, w: 380, h: 20 },
    { x: 1920, y: 1460, w: 40, h: 40 },
    { x: 2240, y: 1460, w: 20, h: 20 },
    { x: 900, y: 1480, w: 360, h: 100 },
    { x: 1920, y: 1500, w: 80, h: 40 },
    { x: 2100, y: 1500, w: 40, h: 20 },
    { x: 2060, y: 1520, w: 100, h: 40 },
    { x: 0, y: 1560, w: 720, h: 80 },
    { x: 2080, y: 1560, w: 60, h: 20 },
    { x: 900, y: 1580, w: 380, h: 20 },
    { x: 2100, y: 1580, w: 40, h: 20 },
    { x: 900, y: 1600, w: 400, h: 20 },
    { x: 2680, y: 1600, w: 320, h: 20 },
    { x: 880, y: 1620, w: 420, h: 20 },
    { x: 1920, y: 1620, w: 180, h: 20 },
    { x: 2300, y: 1620, w: 20, h: 20 },
    { x: 2660, y: 1620, w: 340, h: 140 },
    { x: 0, y: 1640, w: 700, h: 40 },
    { x: 880, y: 1640, w: 440, h: 20 },
    { x: 1860, y: 1640, w: 300, h: 20 },
    { x: 2260, y: 1640, w: 140, h: 20 },
    { x: 900, y: 1660, w: 420, h: 40 },
    { x: 1840, y: 1660, w: 320, h: 20 },
    { x: 2240, y: 1660, w: 160, h: 20 },
    { x: 0, y: 1680, w: 680, h: 40 },
    { x: 1840, y: 1680, w: 580, h: 20 },
    { x: 900, y: 1700, w: 460, h: 20 },
    { x: 1800, y: 1700, w: 660, h: 40 },
    { x: 0, y: 1720, w: 660, h: 40 },
    { x: 920, y: 1720, w: 440, h: 20 },
    { x: 920, y: 1740, w: 480, h: 20 },
    { x: 1780, y: 1740, w: 680, h: 20 },
    { x: 0, y: 1760, w: 680, h: 20 },
    { x: 900, y: 1760, w: 520, h: 20 },
    { x: 1740, y: 1760, w: 720, h: 20 },
    { x: 2640, y: 1760, w: 360, h: 40 },
    { x: 0, y: 1780, w: 720, h: 20 },
    { x: 900, y: 1780, w: 540, h: 40 },
    { x: 1720, y: 1780, w: 740, h: 20 },
    { x: 0, y: 1800, w: 740, h: 40 },
    { x: 1700, y: 1800, w: 760, h: 20 },
    { x: 2600, y: 1800, w: 400, h: 60 },
    { x: 920, y: 1820, w: 560, h: 20 },
    { x: 1680, y: 1820, w: 780, h: 280 },
    { x: 0, y: 1840, w: 760, h: 80 },
    { x: 920, y: 1840, w: 580, h: 20 },
    { x: 900, y: 1860, w: 600, h: 80 },
    { x: 2580, y: 1860, w: 420, h: 60 },
    { x: 0, y: 1920, w: 720, h: 40 },
    { x: 2600, y: 1920, w: 400, h: 20 },
    { x: 900, y: 1940, w: 620, h: 40 },
    { x: 2620, y: 1940, w: 380, h: 60 },
    { x: 0, y: 1960, w: 740, h: 20 },
    { x: 0, y: 1980, w: 760, h: 80 },
    { x: 900, y: 1980, w: 600, h: 20 },
    { x: 920, y: 2000, w: 580, h: 20 },
    { x: 2640, y: 2000, w: 360, h: 60 },
    { x: 940, y: 2020, w: 220, h: 20 },
    { x: 1240, y: 2020, w: 280, h: 20 },
    { x: 940, y: 2040, w: 20, h: 20 },
    { x: 1000, y: 2040, w: 120, h: 20 },
    { x: 1260, y: 2040, w: 260, h: 40 },
    { x: 0, y: 2060, w: 780, h: 20 },
    { x: 1020, y: 2060, w: 100, h: 20 },
    { x: 2680, y: 2060, w: 320, h: 180 },
    { x: 0, y: 2080, w: 800, h: 20 },
    { x: 1040, y: 2080, w: 80, h: 20 },
    { x: 1260, y: 2080, w: 240, h: 20 },
    { x: 0, y: 2100, w: 820, h: 20 },
    { x: 1060, y: 2100, w: 20, h: 20 },
    { x: 1260, y: 2100, w: 220, h: 40 },
    { x: 1660, y: 2100, w: 820, h: 20 },
    { x: 0, y: 2120, w: 840, h: 100 },
    { x: 1660, y: 2120, w: 800, h: 40 },
    { x: 1300, y: 2140, w: 120, h: 20 },
    { x: 1320, y: 2160, w: 80, h: 20 },
    { x: 1660, y: 2160, w: 820, h: 20 },
    { x: 1660, y: 2180, w: 840, h: 80 },
    { x: 0, y: 2220, w: 820, h: 20 },
    { x: 940, y: 2220, w: 40, h: 20 },
    { x: 0, y: 2240, w: 680, h: 40 },
    { x: 720, y: 2240, w: 80, h: 20 },
    { x: 900, y: 2240, w: 120, h: 40 },
    { x: 2640, y: 2240, w: 360, h: 20 },
    { x: 1640, y: 2260, w: 860, h: 20 },
    { x: 2620, y: 2260, w: 380, h: 60 },
    { x: 0, y: 2280, w: 660, h: 60 },
    { x: 900, y: 2280, w: 160, h: 20 },
    { x: 1640, y: 2280, w: 820, h: 60 },
    { x: 900, y: 2300, w: 100, h: 20 },
    { x: 1200, y: 2300, w: 40, h: 20 },
    { x: 900, y: 2320, w: 80, h: 40 },
    { x: 1200, y: 2320, w: 140, h: 20 },
    { x: 2580, y: 2320, w: 420, h: 20 },
    { x: 0, y: 2340, w: 680, h: 80 },
    { x: 1200, y: 2340, w: 180, h: 40 },
    { x: 1620, y: 2340, w: 840, h: 20 },
    { x: 2560, y: 2340, w: 440, h: 40 },
    { x: 1620, y: 2360, w: 800, h: 40 },
    { x: 1200, y: 2380, w: 200, h: 20 },
    { x: 2580, y: 2380, w: 420, h: 40 },
    { x: 720, y: 2400, w: 60, h: 20 },
    { x: 1200, y: 2400, w: 220, h: 20 },
    { x: 1620, y: 2400, w: 460, h: 20 },
    { x: 2200, y: 2400, w: 100, h: 20 },
    { x: 0, y: 2420, w: 860, h: 100 },
    { x: 1140, y: 2420, w: 300, h: 20 },
    { x: 1620, y: 2420, w: 280, h: 40 },
    { x: 2560, y: 2420, w: 440, h: 40 },
    { x: 1120, y: 2440, w: 320, h: 20 },
    { x: 1140, y: 2460, w: 300, h: 20 },
    { x: 1620, y: 2460, w: 180, h: 20 },
    { x: 2600, y: 2460, w: 400, h: 60 },
    { x: 1000, y: 2480, w: 20, h: 20 },
    { x: 1140, y: 2480, w: 320, h: 20 },
    { x: 1680, y: 2480, w: 100, h: 20 },
    { x: 920, y: 2500, w: 540, h: 20 },
    { x: 1700, y: 2500, w: 60, h: 20 },
    { x: 0, y: 2520, w: 1460, h: 60 },
    { x: 1740, y: 2520, w: 20, h: 20 },
    { x: 2580, y: 2520, w: 420, h: 20 },
    { x: 2560, y: 2540, w: 440, h: 20 },
    { x: 2540, y: 2560, w: 460, h: 20 },
    { x: 0, y: 2580, w: 1440, h: 80 },
    { x: 2080, y: 2580, w: 920, h: 40 },
    { x: 1880, y: 2620, w: 1120, h: 20 },
    { x: 1800, y: 2640, w: 1200, h: 80 },
    { x: 0, y: 2660, w: 1460, h: 20 },
    { x: 0, y: 2680, w: 1440, h: 60 },
    { x: 1660, y: 2720, w: 1340, h: 20 },
    { x: 0, y: 2740, w: 1460, h: 40 },
    { x: 1640, y: 2740, w: 1360, h: 20 },
    { x: 1620, y: 2760, w: 1380, h: 40 },
    { x: 0, y: 2780, w: 1440, h: 100 },
    { x: 1580, y: 2800, w: 1420, h: 200 },
    { x: 0, y: 2880, w: 1460, h: 100 },
    { x: 0, y: 2980, w: 1480, h: 20 },
  ],

  // Proximity label for the travellers' camp by the river bend.
  buildings: [
    { label: 'Traveller\'s Camp', x: 851, y: 563, r: 344 },
  ],

  entrances: [],

  // The campfire at the travellers' camp (code-drawn flames, world.js's
  // drawFire — reused from Calder's torches), plus a wisp of smoke above it.
  // The 2026-10-12 art has no painted fire pit, so it sits on the bare patch
  // between the tent and the wagon.
  fires: [
    { x: 935, y: 420 },
  ],
  smoke: [
    { x: 935, y: 385 },
  ],

  interactables: [
    // Chestnuts (2026-10-10) for Mateo Avellaneda's quest (C3). Plain item
    // pickups, same shape as the shiny gold glints. Each spot is standable,
    // reachable from spawn, at the edge of tree cover, and outside every
    // enemy's aggro/ambush range (checked by script against this scene's
    // real obstacles).
    {
      id: 'c4_chestnut_1',
      x: 890, y: 1175, w: 125, h: 125,
      label: 'A fallen chestnut',
      reward: { item: 'chestnut', qty: 1 },
      message: 'You pick up a chestnut.',
    },
    {
      id: 'c4_chestnut_2',
      x: 1050, y: 2250, w: 125, h: 125,
      label: 'A fallen chestnut',
      reward: { item: 'chestnut', qty: 1 },
      message: 'You pick up a chestnut.',
    },
  ],

  // A fishing spot on the west river bank (2026-08-02, Danny). Sits on the
  // water; the player fishes from the reachable bank ~20px east (within the
  // 180px FISH_SPOT_RANGE). Needs a rod + bait like any other spot.
  fishingSpots: [
    { x: 561, y: 1699 },
  ],

  // The bramblekin's stash in the clearing — turned 90° (see world.js's chest
  // rotation). Holds coin, a couple of spoils, and the stolen Royal Summons
  // (a quest item) the player recovers for Mara.
  chests: [
    {
      id: 'c4_clearing_chest',
      x: 1873, y: 1460, rotation: 90,
      locked: false,
      gold: 12,
      items: [
        { id: 'short_sword', qty: 1 },
        { id: 'health_potion', qty: 1 },
        { id: 'royal_summons', qty: 1 },
      ],
    },
  ],

  battles: [],

  // Hidden Rootweaver ambushes on the eastern loop trails (same system as D4's
  // — walk within range and the fight starts; Rootweavers are a "flee for now"
  // wall). `retreat` shoves a fleeing player back down the path far enough that
  // pressing on walks them right back into it (each >range*1.6 away).
  ambushes: [
    { id: 'rootweaver_c4_a', x: 2585, y: 879, range: 141, enemies: ['rootweaver'], retreat: { x: 2425, y: 645 } },
    { id: 'rootweaver_c4_b', x: 2500, y: 2426, range: 141, enemies: ['rootweaver'], retreat: { x: 2079, y: 2500 } },
  ],

  // South back to D4 (band matches D4's top exit, so walking off either edge
  // lands on the other scene's path at the same x). North toward B4 — deeper,
  // more dangerous woods — not built yet (stubbed -> "isn't ready" toast).
  exits: [
    { edge: 'bottom', xMin: 1498, xMax: 1561, to: 'D4', note: 'path south back into the D4 woods' },
    { edge: 'top', xMin: 1338, xMax: 1441, to: 'B4', note: 'path north into deeper woods' },
  ],

  npcs: [
    // ---- The clearing bramblekin PACK (2026-08-02) ----
    // Four roaming `creature` bramblekin (mill via patrol when calm, charge the
    // player on sight — world.js's creature AI, same as D1's cragclaws). The
    // `pack` tag makes them fight as ONE group: striking any of them starts a
    // battle with every alive pack member, and winning removes them all
    // (main.js's pendingAggro handler). They guard the stolen-goods chest.
    // Positioned on the WEST/centre side of the clearing (x<=1035), and aggro
    // trimmed 340 -> 220 (2026-08-02, Danny): so walking the main clearing
    // approach triggers a fight, but the chest can be reached/opened from the
    // EAST sneak corridor (the player opens it from ~256px east of the guards —
    // outside 220 aggro), stealing the loot without waking the pack. All spawn/
    // patrol points engine-verified clear+reachable, and >=168px from the chest.
    {
      id: 'bramblekin_c4_1', name: 'Bramblekin', role: '',
      creature: true, enemyId: 'bramblekin', pack: 'clearing_bramblekin',
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 1524, y: 1430, speed: 40, chaseSpeed: 150, aggroRange: 344, giveUpRange: 875, startsHome: false,
      patrol: [ { x: 1524, y: 1430 }, { x: 1601, y: 1493 } ],
    },
    {
      id: 'bramblekin_c4_2', name: 'Bramblekin', role: '',
      creature: true, enemyId: 'bramblekin', pack: 'clearing_bramblekin',
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 1539, y: 1586, speed: 40, chaseSpeed: 150, aggroRange: 344, giveUpRange: 875, startsHome: false,
      patrol: [ { x: 1539, y: 1586 }, { x: 1469, y: 1649 } ],
    },
    {
      id: 'bramblekin_c4_3', name: 'Bramblekin', role: '',
      creature: true, enemyId: 'bramblekin', pack: 'clearing_bramblekin',
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 1618, y: 1399, speed: 40, chaseSpeed: 150, aggroRange: 344, giveUpRange: 875, startsHome: false,
      patrol: [ { x: 1618, y: 1399 }, { x: 1539, y: 1461 } ],
    },
    // NOTE: a FOURTH member (bramblekin_c4_4, patrolling 1570,1680 <-> 1493,1618)
    // was removed 2026-09-20. Striking one drags the whole pack into a single
    // fight, so four made this a 4-v-1 — ~85% death for the best kit the D row
    // can produce, in the first C-row scene most players walk into. Three is a
    // real fight without being a wall. If a fourth is ever added back, cap the
    // roster in main.js's pendingAggro handler first.

    // ---- Mara Vellorne + Vozhik (2026-08-02) ----
    // Adventurers camped by the fire, robbed by the clearing bramblekin. Mara
    // gives the belongings-recovery quest (state-built dialog in main.js);
    // Vozhik speaks only his own tongue (a beat-machine dialog in main.js).
    // Both wander a short loop near the campfire (545,334).
    {
      id: 'mara_vellorne', name: 'Mara Vellorne', role: 'ADVENTURER',
      sprite: 'assets/images/Mara Vellorne_overhead.png',
      portrait: 'assets/images/Mara Vellorne.png',
      x: 969, y: 565, speed: 40, startsHome: false,
      patrol: [ { x: 969, y: 565 }, { x: 852, y: 471 } ],
    },
    {
      id: 'vozhik', name: 'Vozhik', role: '',
      sprite: 'assets/images/Vozhik_overhead.png',
      portrait: 'assets/images/Vozhik.png',
      x: 719, y: 494, speed: 40, startsHome: false,
      patrol: [ { x: 719, y: 494 }, { x: 875, y: 469 } ],
    },
    // Cinder (2026-08-02) — Mara and Vozhik's horse, grazing by the camp. An
    // animal NPC like D3's Gaffer, but friendly through and through: petting is
    // always warm (no bite), and you can offer her corn (state-built dialog in
    // main.js, buildCinderDialog). A good horse.
    {
      id: 'cinder', name: 'Cinder', role: '',
      sprite: 'assets/images/Cinder_overhead.png',
      portrait: 'assets/images/Cinder.png',
      x: 1125, y: 625, speed: 26, startsHome: false,
      patrol: [ { x: 1125, y: 625 }, { x: 1091, y: 513 } ],
    },
  ],
};
