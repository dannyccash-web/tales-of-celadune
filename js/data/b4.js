// Scene B4 — THE KING'S ROAD (overworld row B, column 4 — NORTH of C4,
// EAST of B3 Kingsreach, SOUTH of A4 the Wizard's Fortress). Built 2026-10-16.
// World coordinates: 3000x3000. Origin top-left.
//
// The wide flagstone king's road runs west-east across the middle (y~1340-
// 1600). A wooden bridge carries it over the river near the west edge; the
// river falls out of the frost-capped cliff that walls off the whole top edge
// (the waterfall, top-left) and leaves the bottom edge at x~300-440, lining up
// with the river down C4's west side. A dirt road comes up from C4 to a
// T-junction at the centre; a narrower track carries on north from the
// junction to a dark cave mouth under the cliff, the way into Cairnfolk Cave
// (B4B, 2026-11-17). North of the
// road, between the junction and the barricade, is the camp of travellers the
// closure has stranded (tents, two covered wagons, crates, a firewood pile).
// At x~2610 a line of crossed stakes closes the road: the EASTERN BARRICADE.
// Nobody passes it — everything east of x2600 is blocked, and there is no game
// area beyond it anyway (the barricade exists for the story). South of the
// road: a secluded camp by the river (tent, fire ring, logs — earmarked for
// the wounded knight from the king's search party, whose art isn't in yet) and
// a clearing reached by a trail east off the C4 road.
//
// THE STORY HERE: the realm (Aldermoor) is sealed because the princess has
// been taken. Everyone on this map believes the official story — the court
// wizard took her. Nothing here hints at the twist. The soldiers are stern,
// the stranded travellers are fed up, and the frost creeping down the cliffs
// is mentioned as a northward pull only.
//
// EXITS:
//   bottom -> C4  x1338-1441 (identical to c4.js's top band; it is also this
//                 map's own collider-centre run at the bottom edge).
//   left   -> B3  y1358-1601 (Kingsreach, unlocked 2026-11-05). The road
//                 mouth's own run; B3's east-gate band is y1408-1531, so the
//                 exit carries toBand: [1408, 1531] (B3's maps back).
//   No top (cliff) and no right (barricade) exit.
//
// COLLISION — auto-classified, no hand-painted walkable guide (2026-10-16):
//   1. Random forest on per-20px-cell colour/texture features (mean/std RGB,
//      HSV, edge energy, dark fraction, plus 3x3 and 7x7 cell context),
//      trained on hand-picked boxes of road/grass/dirt vs canopy/cliff/water.
//      The autumn canopy is as warm as the dirt, so the plain R-G test used
//      for C2 does not work here.
//   2. 3x3 median de-speckle; stamps for the tents, wagons, crates, soldiers'
//      tent, firewood pile and the secluded camp's tent/fire ring/logs; the
//      river either side of the bridge blocked and the bridge deck forced
//      walkable (x370-610, y1235-1375); everything east of x2600 blocked.
//   3. The trail from the C4 road east to the far clearing runs under canopy,
//      so it was carved by hand (a 72px-wide polyline).
//   4. Collider-clearance pass: only ground within 18px of a body centre that
//      is reachable from spawn survives, so nothing is walkable that the 36px
//      collider can't actually get to.
//   5. 20px cells (blocked if >50%), merged into rects.
// A native-size overlay for markup is at assets/images/B4_Walkable_Overlay.jpg
// (gitignored). To tweak, send a "collision markup" (blue = walkable,
// yellow = blocked) and apply it as a delta.
//
// REVISED ART (2026-10-17): Danny redrew the west end so the road and bridge
// sit ~150px lower and line up with Kingsreach's high street. Only the
// changed area (x0-1240, y960-2080, found by an old-vs-new pixel diff) was
// redone: walkable = the road, its verges and the bridge deck (x355-615,
// y1385-1525) by hand-drawn boxes, everything else there blocked (river,
// trees, the old road line, now forest). The rest of the map kept its
// collision cell-for-cell, then the clearance pass re-ran. Small art changes
// elsewhere (a crate and a bush gone from the camp, trees reshuffled south of
// the road) didn't touch walkability and were left alone.

export default {
  id: 'B4',
  name: 'The King’s Road',
  background: 'assets/images/B4_Background.jpg',
  width: 3000,
  height: 3000,
  spawn: { x: 1444, y: 1441 },
  obstacles: [
    // Regenerated 2026-11-16 for Danny's new art: the previous collision warped along
    // the art by optical flow (the east half sat ~10-28px lower), then the new cliff
    // trail (cave mouth west to the waterfall, a dead end) carved walkable and the
    // glowing fissure in the south-east clearing blocked. 10px cells.
    // The south path's narrowest bend (x~1400-1525, y2420-2780) widened to its painted width.
    { x: 0, y: 0, w: 3000, h: 240 },
    { x: 0, y: 240, w: 680, h: 10 },
    { x: 740, y: 240, w: 2260, h: 10 },
    { x: 0, y: 250, w: 630, h: 10 },
    { x: 830, y: 250, w: 2170, h: 10 },
    { x: 0, y: 260, w: 590, h: 10 },
    { x: 880, y: 260, w: 2120, h: 10 },
    { x: 0, y: 270, w: 570, h: 10 },
    { x: 960, y: 270, w: 2040, h: 10 },
    { x: 0, y: 280, w: 560, h: 30 },
    { x: 1030, y: 280, w: 1970, h: 10 },
    { x: 1070, y: 290, w: 1930, h: 10 },
    { x: 690, y: 300, w: 50, h: 10 },
    { x: 1110, y: 300, w: 1890, h: 10 },
    { x: 0, y: 310, w: 570, h: 10 },
    { x: 640, y: 310, w: 180, h: 10 },
    { x: 1150, y: 310, w: 1850, h: 10 },
    { x: 0, y: 320, w: 870, h: 10 },
    { x: 1180, y: 320, w: 1820, h: 10 },
    { x: 0, y: 330, w: 960, h: 10 },
    { x: 1210, y: 330, w: 1790, h: 10 },
    { x: 0, y: 340, w: 1030, h: 10 },
    { x: 1250, y: 340, w: 1750, h: 10 },
    { x: 0, y: 350, w: 1070, h: 10 },
    { x: 1280, y: 350, w: 1720, h: 10 },
    { x: 0, y: 360, w: 1110, h: 10 },
    { x: 1320, y: 360, w: 1680, h: 10 },
    { x: 0, y: 370, w: 1140, h: 10 },
    { x: 1360, y: 370, w: 1640, h: 10 },
    { x: 0, y: 380, w: 1170, h: 10 },
    { x: 1400, y: 380, w: 1600, h: 10 },
    { x: 0, y: 390, w: 1210, h: 10 },
    { x: 1460, y: 390, w: 1540, h: 10 },
    { x: 0, y: 400, w: 1240, h: 10 },
    { x: 1520, y: 400, w: 1480, h: 10 },
    { x: 0, y: 410, w: 1270, h: 10 },
    { x: 1580, y: 410, w: 1420, h: 10 },
    { x: 0, y: 420, w: 1310, h: 10 },
    { x: 1620, y: 420, w: 1380, h: 10 },
    { x: 0, y: 430, w: 1350, h: 10 },
    { x: 1800, y: 430, w: 1200, h: 20 },
    { x: 0, y: 440, w: 1400, h: 10 },
    { x: 0, y: 450, w: 1450, h: 10 },
    { x: 1820, y: 450, w: 1180, h: 40 },
    { x: 0, y: 460, w: 1510, h: 10 },
    { x: 0, y: 470, w: 1580, h: 10 },
    { x: 0, y: 480, w: 1620, h: 20 },
    { x: 1830, y: 490, w: 1170, h: 10 },
    { x: 0, y: 500, w: 1610, h: 10 },
    { x: 1840, y: 500, w: 1160, h: 50 },
    { x: 0, y: 510, w: 1600, h: 60 },
    { x: 1820, y: 550, w: 1180, h: 100 },
    { x: 0, y: 570, w: 1610, h: 50 },
    { x: 0, y: 620, w: 1600, h: 50 },
    { x: 1800, y: 650, w: 1200, h: 20 },
    { x: 0, y: 670, w: 1620, h: 140 },
    { x: 1720, y: 670, w: 1280, h: 20 },
    { x: 1700, y: 690, w: 1300, h: 100 },
    { x: 1680, y: 790, w: 1320, h: 40 },
    { x: 0, y: 810, w: 1600, h: 40 },
    { x: 1660, y: 830, w: 1340, h: 60 },
    { x: 0, y: 850, w: 1580, h: 20 },
    { x: 0, y: 870, w: 1560, h: 40 },
    { x: 1680, y: 890, w: 1320, h: 30 },
    { x: 0, y: 910, w: 1540, h: 100 },
    { x: 1680, y: 920, w: 290, h: 10 },
    { x: 2000, y: 920, w: 1000, h: 40 },
    { x: 1680, y: 930, w: 280, h: 10 },
    { x: 1690, y: 940, w: 260, h: 10 },
    { x: 1700, y: 950, w: 240, h: 10 },
    { x: 1710, y: 960, w: 230, h: 10 },
    { x: 2000, y: 960, w: 520, h: 20 },
    { x: 2560, y: 960, w: 440, h: 60 },
    { x: 1720, y: 970, w: 220, h: 10 },
    { x: 1730, y: 980, w: 120, h: 10 },
    { x: 2000, y: 980, w: 500, h: 10 },
    { x: 2000, y: 990, w: 480, h: 20 },
    { x: 0, y: 1010, w: 1520, h: 20 },
    { x: 2000, y: 1010, w: 460, h: 30 },
    { x: 2540, y: 1020, w: 460, h: 60 },
    { x: 0, y: 1030, w: 1500, h: 20 },
    { x: 2020, y: 1040, w: 50, h: 10 },
    { x: 2120, y: 1040, w: 340, h: 20 },
    { x: 0, y: 1050, w: 1490, h: 10 },
    { x: 2020, y: 1050, w: 40, h: 10 },
    { x: 0, y: 1060, w: 1480, h: 40 },
    { x: 2040, y: 1060, w: 20, h: 20 },
    { x: 2140, y: 1060, w: 320, h: 40 },
    { x: 1860, y: 1080, w: 40, h: 20 },
    { x: 2560, y: 1080, w: 440, h: 100 },
    { x: 0, y: 1100, w: 1340, h: 30 },
    { x: 1610, y: 1100, w: 90, h: 10 },
    { x: 2140, y: 1100, w: 100, h: 40 },
    { x: 2300, y: 1100, w: 160, h: 20 },
    { x: 1590, y: 1120, w: 10, h: 10 },
    { x: 1900, y: 1120, w: 60, h: 40 },
    { x: 2340, y: 1120, w: 110, h: 10 },
    { x: 0, y: 1130, w: 1350, h: 10 },
    { x: 1580, y: 1130, w: 20, h: 10 },
    { x: 2340, y: 1130, w: 100, h: 10 },
    { x: 0, y: 1140, w: 1360, h: 100 },
    { x: 1570, y: 1140, w: 30, h: 10 },
    { x: 2160, y: 1140, w: 70, h: 10 },
    { x: 2360, y: 1140, w: 80, h: 20 },
    { x: 1560, y: 1150, w: 40, h: 10 },
    { x: 1560, y: 1160, w: 140, h: 10 },
    { x: 1870, y: 1160, w: 90, h: 10 },
    { x: 2360, y: 1160, w: 70, h: 10 },
    { x: 1540, y: 1170, w: 160, h: 70 },
    { x: 1860, y: 1170, w: 100, h: 110 },
    { x: 2360, y: 1170, w: 60, h: 30 },
    { x: 2540, y: 1180, w: 460, h: 40 },
    { x: 2390, y: 1200, w: 30, h: 10 },
    { x: 2560, y: 1220, w: 440, h: 20 },
    { x: 0, y: 1240, w: 1340, h: 20 },
    { x: 1550, y: 1240, w: 150, h: 10 },
    { x: 2580, y: 1240, w: 420, h: 40 },
    { x: 1560, y: 1250, w: 140, h: 30 },
    { x: 0, y: 1260, w: 1240, h: 20 },
    { x: 1280, y: 1260, w: 60, h: 20 },
    { x: 0, y: 1280, w: 1220, h: 20 },
    { x: 1300, y: 1280, w: 20, h: 20 },
    { x: 1580, y: 1280, w: 60, h: 10 },
    { x: 1940, y: 1280, w: 20, h: 10 },
    { x: 2560, y: 1280, w: 440, h: 20 },
    { x: 1580, y: 1290, w: 40, h: 10 },
    { x: 0, y: 1300, w: 700, h: 40 },
    { x: 1590, y: 1300, w: 30, h: 10 },
    { x: 2500, y: 1300, w: 500, h: 80 },
    { x: 0, y: 1340, w: 180, h: 10 },
    { x: 260, y: 1340, w: 440, h: 30 },
    { x: 260, y: 1370, w: 140, h: 10 },
    { x: 450, y: 1370, w: 250, h: 10 },
    { x: 260, y: 1380, w: 100, h: 30 },
    { x: 620, y: 1380, w: 80, h: 10 },
    { x: 2600, y: 1380, w: 400, h: 310 },
    { x: 630, y: 1390, w: 70, h: 10 },
    { x: 270, y: 1410, w: 90, h: 10 },
    { x: 360, y: 1500, w: 260, h: 40 },
    { x: 360, y: 1540, w: 340, h: 20 },
    { x: 260, y: 1560, w: 440, h: 20 },
    { x: 870, y: 1560, w: 40, h: 10 },
    { x: 760, y: 1570, w: 210, h: 10 },
    { x: 1180, y: 1570, w: 60, h: 10 },
    { x: 1760, y: 1570, w: 60, h: 20 },
    { x: 260, y: 1580, w: 980, h: 10 },
    { x: 260, y: 1590, w: 1110, h: 20 },
    { x: 1750, y: 1590, w: 120, h: 10 },
    { x: 1680, y: 1600, w: 240, h: 10 },
    { x: 100, y: 1610, w: 1310, h: 10 },
    { x: 1670, y: 1610, w: 270, h: 10 },
    { x: 2080, y: 1610, w: 40, h: 20 },
    { x: 0, y: 1620, w: 1410, h: 10 },
    { x: 1660, y: 1620, w: 280, h: 10 },
    { x: 0, y: 1630, w: 1430, h: 20 },
    { x: 1660, y: 1630, w: 300, h: 20 },
    { x: 2060, y: 1630, w: 360, h: 20 },
    { x: 0, y: 1650, w: 1450, h: 40 },
    { x: 1660, y: 1650, w: 320, h: 20 },
    { x: 2040, y: 1650, w: 420, h: 20 },
    { x: 1660, y: 1670, w: 820, h: 20 },
    { x: 0, y: 1690, w: 1460, h: 10 },
    { x: 1660, y: 1690, w: 1340, h: 40 },
    { x: 0, y: 1700, w: 1470, h: 10 },
    { x: 0, y: 1710, w: 1480, h: 10 },
    { x: 0, y: 1720, w: 1490, h: 30 },
    { x: 1680, y: 1730, w: 1320, h: 100 },
    { x: 0, y: 1750, w: 1500, h: 10 },
    { x: 0, y: 1760, w: 1510, h: 70 },
    { x: 0, y: 1830, w: 1500, h: 10 },
    { x: 1660, y: 1830, w: 1340, h: 100 },
    { x: 0, y: 1840, w: 1490, h: 40 },
    { x: 0, y: 1880, w: 1480, h: 40 },
    { x: 0, y: 1920, w: 680, h: 20 },
    { x: 760, y: 1920, w: 720, h: 70 },
    { x: 1640, y: 1930, w: 1360, h: 60 },
    { x: 0, y: 1940, w: 660, h: 20 },
    { x: 0, y: 1960, w: 640, h: 20 },
    { x: 0, y: 1980, w: 620, h: 80 },
    { x: 760, y: 1990, w: 100, h: 10 },
    { x: 890, y: 1990, w: 610, h: 10 },
    { x: 1640, y: 1990, w: 780, h: 10 },
    { x: 2500, y: 1990, w: 500, h: 70 },
    { x: 780, y: 2000, w: 80, h: 10 },
    { x: 900, y: 2000, w: 600, h: 20 },
    { x: 1640, y: 2000, w: 730, h: 10 },
    { x: 780, y: 2010, w: 40, h: 10 },
    { x: 1640, y: 2010, w: 640, h: 20 },
    { x: 800, y: 2020, w: 20, h: 20 },
    { x: 920, y: 2020, w: 580, h: 20 },
    { x: 1640, y: 2030, w: 620, h: 20 },
    { x: 940, y: 2040, w: 560, h: 10 },
    { x: 940, y: 2050, w: 540, h: 10 },
    { x: 1640, y: 2050, w: 600, h: 10 },
    { x: 0, y: 2060, w: 720, h: 20 },
    { x: 980, y: 2060, w: 500, h: 20 },
    { x: 1620, y: 2060, w: 620, h: 20 },
    { x: 2520, y: 2060, w: 480, h: 20 },
    { x: 0, y: 2080, w: 740, h: 60 },
    { x: 1020, y: 2080, w: 460, h: 20 },
    { x: 1620, y: 2080, w: 580, h: 20 },
    { x: 2540, y: 2080, w: 460, h: 20 },
    { x: 1040, y: 2100, w: 440, h: 10 },
    { x: 1620, y: 2100, w: 520, h: 10 },
    { x: 2560, y: 2100, w: 440, h: 30 },
    { x: 1040, y: 2110, w: 430, h: 10 },
    { x: 1620, y: 2110, w: 480, h: 20 },
    { x: 1060, y: 2120, w: 400, h: 10 },
    { x: 1070, y: 2130, w: 390, h: 10 },
    { x: 1620, y: 2130, w: 460, h: 10 },
    { x: 2580, y: 2130, w: 420, h: 60 },
    { x: 0, y: 2140, w: 880, h: 20 },
    { x: 1080, y: 2140, w: 380, h: 10 },
    { x: 1620, y: 2140, w: 450, h: 10 },
    { x: 1090, y: 2150, w: 370, h: 10 },
    { x: 1620, y: 2150, w: 440, h: 10 },
    { x: 0, y: 2160, w: 890, h: 70 },
    { x: 1100, y: 2160, w: 340, h: 10 },
    { x: 1640, y: 2160, w: 410, h: 10 },
    { x: 1110, y: 2170, w: 330, h: 10 },
    { x: 1640, y: 2170, w: 400, h: 10 },
    { x: 1120, y: 2180, w: 300, h: 10 },
    { x: 1640, y: 2180, w: 390, h: 10 },
    { x: 1130, y: 2190, w: 290, h: 10 },
    { x: 1640, y: 2190, w: 380, h: 10 },
    { x: 2560, y: 2190, w: 440, h: 10 },
    { x: 1180, y: 2200, w: 240, h: 20 },
    { x: 1660, y: 2200, w: 320, h: 20 },
    { x: 2550, y: 2200, w: 450, h: 10 },
    { x: 2530, y: 2210, w: 470, h: 10 },
    { x: 1220, y: 2220, w: 200, h: 10 },
    { x: 1700, y: 2220, w: 260, h: 20 },
    { x: 2520, y: 2220, w: 480, h: 10 },
    { x: 0, y: 2230, w: 880, h: 20 },
    { x: 1220, y: 2230, w: 210, h: 10 },
    { x: 2500, y: 2230, w: 500, h: 10 },
    { x: 1240, y: 2240, w: 200, h: 10 },
    { x: 1820, y: 2240, w: 120, h: 20 },
    { x: 2480, y: 2240, w: 520, h: 10 },
    { x: 0, y: 2250, w: 850, h: 20 },
    { x: 900, y: 2250, w: 80, h: 80 },
    { x: 1240, y: 2250, w: 210, h: 10 },
    { x: 2460, y: 2250, w: 540, h: 10 },
    { x: 1260, y: 2260, w: 200, h: 20 },
    { x: 2450, y: 2260, w: 550, h: 10 },
    { x: 0, y: 2270, w: 830, h: 130 },
    { x: 2430, y: 2270, w: 570, h: 10 },
    { x: 1280, y: 2280, w: 180, h: 20 },
    { x: 2380, y: 2280, w: 620, h: 10 },
    { x: 2080, y: 2290, w: 20, h: 20 },
    { x: 2290, y: 2290, w: 710, h: 10 },
    { x: 1340, y: 2300, w: 100, h: 10 },
    { x: 1640, y: 2300, w: 100, h: 20 },
    { x: 2280, y: 2300, w: 720, h: 10 },
    { x: 1350, y: 2310, w: 90, h: 10 },
    { x: 2000, y: 2310, w: 120, h: 20 },
    { x: 2270, y: 2310, w: 730, h: 10 },
    { x: 1360, y: 2320, w: 60, h: 10 },
    { x: 1620, y: 2320, w: 210, h: 10 },
    { x: 1920, y: 2320, w: 20, h: 20 },
    { x: 2260, y: 2320, w: 740, h: 20 },
    { x: 1370, y: 2330, w: 50, h: 10 },
    { x: 1620, y: 2330, w: 240, h: 20 },
    { x: 2000, y: 2330, w: 140, h: 20 },
    { x: 1910, y: 2340, w: 80, h: 10 },
    { x: 2250, y: 2340, w: 750, h: 10 },
    { x: 1620, y: 2350, w: 520, h: 20 },
    { x: 2240, y: 2350, w: 760, h: 10 },
    { x: 1140, y: 2360, w: 110, h: 20 },
    { x: 2230, y: 2360, w: 770, h: 10 },
    { x: 1620, y: 2370, w: 510, h: 30 },
    { x: 2220, y: 2370, w: 780, h: 10 },
    { x: 1120, y: 2380, w: 160, h: 20 },
    { x: 2210, y: 2380, w: 790, h: 10 },
    { x: 2200, y: 2390, w: 800, h: 10 },
    { x: 0, y: 2400, w: 880, h: 20 },
    { x: 950, y: 2400, w: 50, h: 20 },
    { x: 1100, y: 2400, w: 320, h: 20 },
    { x: 1600, y: 2400, w: 530, h: 10 },
    { x: 2180, y: 2400, w: 820, h: 10 },
    { x: 1600, y: 2410, w: 520, h: 10 },
    { x: 2160, y: 2410, w: 840, h: 10 },
    { x: 0, y: 2420, w: 1000, h: 20 },
    { x: 1080, y: 2420, w: 370, h: 20 },
    { x: 1600, y: 2420, w: 1400, h: 80 },
    { x: 0, y: 2440, w: 1450, h: 20 },
    { x: 0, y: 2460, w: 1470, h: 30 },
    { x: 0, y: 2490, w: 1460, h: 30 },
    { x: 1580, y: 2500, w: 1420, h: 20 },
    { x: 0, y: 2520, w: 1450, h: 20 },
    { x: 1570, y: 2520, w: 1430, h: 10 },
    { x: 1560, y: 2530, w: 1440, h: 10 },
    { x: 0, y: 2540, w: 1440, h: 20 },
    { x: 1550, y: 2540, w: 1450, h: 20 },
    { x: 0, y: 2560, w: 1430, h: 20 },
    { x: 1540, y: 2560, w: 1460, h: 10 },
    { x: 1510, y: 2570, w: 1490, h: 20 },
    { x: 0, y: 2580, w: 1420, h: 30 },
    { x: 1490, y: 2590, w: 1510, h: 20 },
    { x: 0, y: 2610, w: 1410, h: 10 },
    { x: 1480, y: 2610, w: 1520, h: 20 },
    { x: 0, y: 2620, w: 1400, h: 40 },
    { x: 1470, y: 2630, w: 1530, h: 30 },
    { x: 0, y: 2660, w: 1380, h: 40 },
    { x: 1480, y: 2660, w: 1520, h: 30 },
    { x: 1500, y: 2690, w: 1500, h: 90 },
    { x: 0, y: 2700, w: 1370, h: 10 },
    { x: 0, y: 2710, w: 1360, h: 30 },
    { x: 0, y: 2740, w: 1370, h: 20 },
    { x: 0, y: 2760, w: 1360, h: 10 },
    { x: 0, y: 2770, w: 1350, h: 30 },
    { x: 1480, y: 2780, w: 1520, h: 40 },
    { x: 0, y: 2800, w: 1330, h: 20 },
    { x: 0, y: 2820, w: 1310, h: 10 },
    { x: 1460, y: 2820, w: 1540, h: 40 },
    { x: 0, y: 2830, w: 1300, h: 10 },
    { x: 0, y: 2840, w: 1340, h: 120 },
    { x: 1440, y: 2860, w: 1560, h: 100 },
    { x: 0, y: 2960, w: 1280, h: 20 },
    { x: 1460, y: 2960, w: 1540, h: 40 },
    { x: 0, y: 2980, w: 1320, h: 20 },
  ],
  // No proximity labels: nothing here is a building you can enter, and per the
  // one-label rule a visible label should mean "press space here".
  buildings: [],

  // The firewood pile in the stranded camp, lit (2026-10-16).
  // 2nd fire: the lit fire pit at the riverside camp by Ewan's tent (new art, 2026-11-04)
  // The rest (2026-11-17): flames along the burning chasm in the south-east
  // clearing (the crack runs ~2200,2420 to 2580,2200), with smoke billowing
  // off both rims. Its crackle comes free with the fire ambience.
  fires: [
    { x: 1933, y: 1150 }, { x: 931, y: 2297 },
    { x: 2245, y: 2430, scale: 2.4 }, { x: 2295, y: 2425, scale: 2.0 },
    { x: 2385, y: 2390, scale: 2.6 }, { x: 2430, y: 2365, scale: 2.1 },
    { x: 2490, y: 2305, scale: 2.4 }, { x: 2550, y: 2260, scale: 2.2 },
  ],
  smoke: [
    { x: 1933, y: 1122 }, { x: 932, y: 2261 },
    { x: 2235, y: 2340, seed: 0.1, alpha: 0.38, rise: 280, baseR: 14, growR: 42 },
    { x: 2335, y: 2300, seed: 0.45, alpha: 0.38, rise: 300, baseR: 14, growR: 42 },
    { x: 2440, y: 2250, seed: 0.7, alpha: 0.38, rise: 290, baseR: 14, growR: 42 },
    { x: 2530, y: 2200, seed: 0.25, alpha: 0.38, rise: 280, baseR: 14, growR: 42 },
    { x: 2310, y: 2455, seed: 0.85, alpha: 0.32, rise: 250, baseR: 13, growR: 38 },
    { x: 2470, y: 2400, seed: 0.55, alpha: 0.32, rise: 260, baseR: 13, growR: 38 },
  ],
  // Ewan's fishing spot on the river above his camp (2026-11-17); fished from
  // the bank ~97px east. Freshwater table.
  fishingSpots: [{ x: 540, y: 1990 }],

  // The cave mouth at the end of the cliff trail opens into Cairnfolk Cave
  // (B4B, 2026-11-17). The mouth itself is rock; the label sits on it and is
  // reached from the trail end just below.
  interactables: [
    { id: 'b4_cairnfolk_cave', x: 1725, y: 395, range: 110, label: 'Cairnfolk Cave', cave: 'B4B' },
  ],
  chests: [],
  battles: [],
  ambushes: [],

  // ---- NPCs (2026-10-16) ----
  // Ten characters (Arjun Talwar and Vikram Ashvale moved to Kingsreach, B3,
  // 2026-11-05): the barricade garrison, the stranded camp, and Dame
  // the woodsman Ewan Hartwood at the camp by the river (2026-11-17; Dame
  // Elspeth Varrick was there until then, her entry is kept in
  // js/data/reserve.js for the King's castle).
  // Voices are in audio.js's DIALOGUE_SFX. Every position was checked against
  // the real collision: standable with the 36px collider and reachable from
  // spawn. Guards face west (rotation PI/2), toward anyone coming up the road.
  npcs: [
    // ---- The barricade garrison ----
    {
      id: 'abena_stoneward', name: 'Captain Abena Stoneward', role: 'CAPTAIN OF THE EASTERN BARRICADE',
      sprite: 'assets/images/captain_abena_stoneward_overhead.png',
      portrait: 'assets/images/captain_abena_stoneward.png',
      x: 2531, y: 1453, speed: 0, startsHome: false, rotation: Math.PI / 2,
      // main.js's buildAbenaDialog adds a "Show her the royal summons" option
      // while the player is carrying it.
      dialog: {
        line: 'The road is closed. By order of King Aldric, no one passes this barricade, in or out, until Her Highness is found. If your business is east, it waits. If your business is with me, keep it short.',
        responses: ['Leave.'],
      },
      chatter: [
        { q: 'What happened to the princess?', a: 'Taken from the castle by the court wizard, the same night the frost started creeping down those cliffs. The king has sealed every border so no one can carry her out of Aldermoor. That is what I know, and more than I ought to tell a stranger on the road.' },
        { q: 'When will the road open?', a: 'When she is home. Not one day sooner. You may tell the man in the green coat the same thing. He has asked me eleven times since breakfast.' },
        { q: 'Where can I find the king?', a: 'Kingsreach, west along this road. The castle sits above the city. Do not expect to walk in and see him. Half the realm wants an audience this month.' },
      ],
    },
    {
      id: 'dae_hyun_kestrel', name: 'Sergeant Dae-hyun Kestrel', role: 'GATE SERGEANT',
      sprite: 'assets/images/sergeant_dae_hyun_kestrel_overhead.png',
      portrait: 'assets/images/sergeant_dae_hyun_kestrel.png',
      x: 2547, y: 1539, speed: 0, startsHome: false, rotation: Math.PI / 2,
      dialog: {
        line: 'Turn around, traveler. There is nothing past this gate but the border, and the king says it stays shut.',
        responses: ['Leave.'],
      },
      chatter: [
        { q: 'How long have you been out here?', a: 'Nineteen days. I have counted every one of them, and every wagon in that camp, twice.' },
        { q: 'Has anyone tried to get past?', a: 'One fool tried to drive a cart through the stakes after dark. The stakes won. What is left of the cart is still out there, if you want firewood.' },
      ],
    },
    {
      id: 'brigid_fallow', name: 'Brigid Fallow', role: 'LOOKOUT',
      sprite: 'assets/images/brigid_fallow_overhead.png',
      portrait: 'assets/images/brigid_fallow.png',
      x: 2442, y: 1343, speed: 0, startsHome: false, rotation: Math.PI / 2,
      dialog: {
        line: 'Hands where I can see them, feet on the road. Nothing personal. I’d say the same to my own mother.',
        responses: ['Leave.'],
      },
      chatter: [
        { q: 'What are you watching for?', a: 'Anything coming down out of the north that isn’t weather. So far it has only been weather. Colder every night, too. There was frost on the stakes this morning, and it isn’t the season for it.' },
        { q: 'Have you seen anything strange?', a: 'A light up on the cliffs, three nights back. Blue, not firelight. The captain says it was the moon on the ice. The captain was asleep.' },
      ],
    },

    // ---- The stranded travellers ----
    {
      id: 'anjali_brookstead', name: 'Anjali Brookstead', role: 'INNKEEPER',
      sprite: 'assets/images/anjali_brookstead_overhead.png',
      portrait: 'assets/images/anjali_brookstead.png',
      // A travelling vendor with no shop to stand behind (no `home`), so she
      // trades wherever she’s, like Nera Reedwalker in C2.
      x: 2062, y: 1232, speed: 25, startsHome: false,
      patrol: [
        { x: 2062, y: 1232 },
        { x: 2102, y: 1315 },
        { x: 2034, y: 1294 },
      ],
      vendor: true,
      stock: [{ id: 'bread', qty: 4 }, { id: 'apple', qty: 2 }, { id: 'health_potion', qty: 2 }],
      gold: 30,
      dialog: {
        line: 'If you’re hungry, I’m selling. If you’re not hungry, sit down anyway. You look like you’ve walked a long way.',
        responses: ['Leave.'],
      },
      chatter: [
        { q: 'What brings an innkeeper out here?', a: 'My inn is in Kingsreach, and since the road closed, nobody is coming through to sleep in it. So I loaded a cart and came to where the people are. Twelve days of feeding a camp that can’t go home, and I’ve not sat down once.' },
        { q: 'Any news from the castle?', a: 'Only what everyone has heard. The princess is gone, the king isn’t sleeping, and the guard has been doubled on every gate in the city. You’ll see it for yourself if you’re headed west.' },
      ],
    },
    {
      id: 'kaveh_sandoran', name: 'Kaveh Sandoran', role: 'SPICE MERCHANT',
      sprite: 'assets/images/kaveh_sandoran_overhead.png',
      portrait: 'assets/images/kaveh_sandoran.png',
      x: 1913, y: 1326, speed: 0, startsHome: false,
      dialog: {
        line: 'Eleven days. Eleven days of saffron and cardamom sitting in that wagon. Do you know what damp does to saffron? Nothing good. Nothing good at all.',
        responses: ['Leave.'],
      },
      chatter: [
        { q: 'Where were you headed?', a: 'East, over the border, to buyers who will have bought from somebody else by the time that gate opens. Which is the polite way of saying I’m ruined.' },
        { q: 'Can’t you sell it here?', a: 'To whom? I offered the captain a fair price on a sack of cumin and she looked at me as though I had offered her a sack of snakes.' },
      ],
    },
    {
      id: 'lupe_carreno', name: 'Lupe Carreño', role: 'TEAMSTER',
      sprite: 'assets/images/lupe_carreno_overhead.png',
      portrait: 'assets/images/lupe_carreno.png',
      x: 1643, y: 1052, speed: 0, startsHome: false, rotation: -Math.PI / 2,
      dialog: {
        line: 'Don’t ask me when we’re moving. I don’t know. Nobody knows. I’m paid by the day to drive, and for six days I’ve driven exactly nowhere.',
        responses: ['Leave.'],
      },
      chatter: [
        { q: 'Is this your wagon?', a: 'I drive it. The spice man owns it. Every morning he asks me whether we’re leaving, and every morning I point at the barricade.' },
        { q: 'What will you do?', a: 'If that gate isn’t open by the next full moon, I’m unhitching the team and going home. He can push his own saffron.' },
      ],
    },
    {
      id: 'tomas_dalisay', name: 'Tomas Dalisay', role: 'PILGRIM',
      sprite: 'assets/images/tomas_dalisay_overhead.png',
      portrait: 'assets/images/tomas_dalisay.png',
      // Paces back and forth toward the barricade, as if it might open.
      x: 2251, y: 1344, speed: 20, startsHome: false,
      patrol: [
        { x: 2251, y: 1344 },
        { x: 2382, y: 1369 },
      ],
      dialog: {
        line: 'Please, if you have any way to speak to the soldiers... My daughter lives on the other side, a day’s walk past that gate. Her first child is due any day now. I promised her I’d be there.',
        responses: ['Leave.'],
      },
      chatter: [
        { q: 'I’m sorry. I can’t open the road.', a: 'No, no. Of course you can’t. Forgive me. I ask everyone. I think I only like to hear someone say they would, if they could.' },
        { q: 'Why not wait in Kingsreach?', a: 'Because from here I can see the road she will send word down, once they open it. Foolish, I know.' },
      ],
    },
    {
      id: 'mei_huang', name: 'Mei Huang', role: 'PEDDLER',
      sprite: 'assets/images/mei_huang_overhead.png',
      portrait: 'assets/images/mei_huang.png',
      x: 2301, y: 1163, speed: 0, startsHome: false,
      dialog: {
        line: 'Thread, needles, buttons, ribbons. All of it for sale, none of it going anywhere. Neither am I, apparently.',
        responses: ['Leave.'],
      },
      chatter: [
        { q: 'How’s business?', a: 'Wonderful. Everyone in this camp has had a week to notice every hole in their clothes. I’ve sold more thread here than in a month on the road, and I still hate it.' },
        { q: 'Heard anything worth knowing?', a: 'The lord in the burgundy coat showed the captain his letter six times. On the seventh he gave up and marched back to Kingsreach to shout at somebody more important.' },
      ],
    },
    {
      id: 'tesfaye_lark', name: 'Tesfaye Lark', role: 'MINSTREL',
      sprite: 'assets/images/tesfaye_lark_overhead.png',
      portrait: 'assets/images/tesfaye_lark.png',
      x: 1999, y: 1183, speed: 0, startsHome: false, rotation: Math.PI / 2,
      dialog: {
        line: 'Requests are three gold. Silence is five. You’d be surprised how many people in this camp pay for the silence.',
        responses: ['Leave.'],
      },
      chatter: [
        { q: 'What do you play?', a: 'Weddings, mostly. Reels, jigs, anything that gets somebody’s uncle up on a table. I don’t do sad songs. This camp has enough sad without me putting a tune to it.' },
        { q: 'Don’t you know the song about the princess?', a: 'Everybody wants that one, and I won’t play it. Some poor girl is missing and her father is beside himself, and people want to tap their feet to it? No. Ask me for a reel.' },
        { q: 'How did you end up here?', a: 'I was walking east to play a wedding. I assume the wedding went ahead without me. I hope the bride found someone who knows more than four songs.' },
      ],
    },
    // ---- The camp by the river (2026-11-17, replaces Dame Elspeth, who moves to the King's castle later) ----
    {
      id: 'ewan_hartwood', name: 'Ewan Hartwood', role: 'WOODSMAN',
      sprite: 'assets/images/ewan_hartwood_overhead.png',
      portrait: 'assets/images/ewan_hartwood.png',
      // Lost his cabin east of the camp to the burning chasm and lives in the
      // tent by the river now, fishing to get by. Homeless vendor (trades on
      // the spot, like Nera): river fish plus the game's only special fishing
      // bait, which that always lands the rarest catch at a spot (main.js's
      // chooseBait / rarestCatch).
      vendor: true,
      stock: [{ id: 'trout', qty: 3 }, { id: 'bluegill', qty: 2 }, { id: 'special_fishing_bait', qty: 3 }],
      gold: 25,
      x: 933, y: 2176, speed: 32, startsHome: false,
      // Bank above the tent, round the camp, by the fire pit. Every leg clear
      // of the tent and fire ring (checked on the collision).
      patrol: [{ x: 700, y: 1995 }, { x: 760, y: 2040 }, { x: 900, y: 2100 }, { x: 1050, y: 2300 }, { x: 960, y: 2370 }],
      dialog: {
        line: 'Mind the hooks on that line. Ewan Hartwood. I’d offer you a seat by the fire, but the fire’s about all I’ve got left.',
        responses: ['Leave.'],
      },
      chatter: [
        { q: 'What happened to you?', a: 'I had a cabin, east of here past the trees. Built it myself, twelve years back. Then one night the ground split open like a seam, and fire came up out of it. By morning there was nothing where my cabin stood but a crack full of flame. I got out with my boots, my rod and this tent.', more: [
          { q: 'What is that chasm?', a: 'Wish I knew. You can feel the heat a hundred paces off, and it hasn’t cooled a day since it opened. Some nights you hear things moving down in it. I stay on this side of the trees and I don’t go looking.' },
        ] },
        { q: 'How do you get by?', a: 'The river. Trout and bluegill, mostly, enough to eat and a few left over to sell. If you’ve coin, I’ll part with some. Better in your belly than spoiling in my basket.', more: [
          { q: 'What’s in the fancy tin?', a: 'Bait. Special bait. The ground at the edge of that chasm is warm, and the grubs and worms that come up out of it are fat as your thumb. I baited a hook with them when I was desperate, and the biggest fish in the river near fought each other to get at it. Every time. Put it on your hook and you’ll pull out the rarest thing swimming wherever you cast. I’ve three tins left. I’m not going back for more.' },
        ] },
      ],
    },
  ],

  exits: [
    { edge: 'bottom', xMin: 1338, xMax: 1441, to: 'C4', toBand: [1345, 1425], note: 'the road south into the C4 woods; toBand lands you in C4\u2019s clear column (2026-11-04)' },
    { edge: 'left', yMin: 1368, yMax: 1602, toBand: [1408, 1542], to: 'B3', note: 'the king’s road west to Kingsreach' },
  ],
};
