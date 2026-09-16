// Scene C2 — WINDMARCH GRASSLAND (overworld row C, column 2 — EAST of C1
// Tidewrack Harbor, NORTH of D2 Millmere, WEST of C3 Hallowmere Forest)
// World coordinates: 3000x3000. Origin top-left.
//
// A road running west-to-east across the middle of the map with a branch
// descending south to Millmere, a ruined watchtower on the high ground north
// of the road, a nomadic herder camp south of it, and a caravan pull-off on
// the road's eastern stretch. Terrain transitions LEFT to RIGHT from C1's
// sandy coastal soil and palms, through dry tan grassland, into the deciduous
// forest floor of the east; dense forest seals the top edge, a mixed
// palm/deciduous corner fills the bottom-left and a deciduous pocket the
// bottom-right. A rocky cliff stands in the far north-west corner.
//
// ART REPLACED + COLLISION REGENERATED 2026-09-16 (Danny dropped a new
// C2_Background.jpg). The new render keeps the same road geometry and the same
// three landmarks but is greener overall, and the herder camp is SIMPLER: the
// wagon, the fenced stock pen, the drying racks and the awning tent are all
// gone, leaving three tents, a fire ring and some barrels. Every structure
// stamp below was re-measured against the new art rather than carried over.
// See the "EDGE BANDS" note for the one thing that got tighter.
//
// CONTENT (2026-09-16, Danny): the Reedwalkers' thrumhorn quest — see `npcs`.
// Still no chests or scripted `battles`; the brief's bandits-in-the-ruins and
// the wandering tinker/enchanter caravan are still to come.
//
// EXITS — bands matched to the neighbours' so a round trip preserves the
// player's position (switchScene keeps y across a left/right crossing and x
// across a top/bottom one):
//   left   -> C1  y1170-1255, mirrors c1.js's `right` band.
//   bottom -> D2  x1286-1403, mirrors d2.js's `top` band.
//   right  -> C3  y1170-1255, mirrors c3.js's `left` band (C3 built 2026-09-15,
//                 so this edge is LIVE — it is no longer a stub).
//   top    -> none. Dense forest seals the whole top edge (B2 King's Castle
//                 sits north on the grid; that art needs a road punched
//                 through the treeline first).
// ⚠️ EDGE BANDS vs THE NEW ART: the bands are unchanged, but the new render's
// natural openings are NARROWER than the old one's, so the forced aprons now
// do real work instead of almost none:
//   - left edge: art opens y1160-1260 (was 1140-1300) — the band needs clear
//     ground y1152-1273 for an 18px collider radius, so the apron carves
//     y1140-1290 at x0-160.
//   - BOTTOM edge: art opens x1300-1380 (was 1280-1380) but D2's committed band
//     is x1286-1403, needing clear ground x1268-1421 — so the apron widens the
//     path mouth by ~35px on each side across the last 140px of depth. That is
//     deliberate: D2's band is already shipped and verified, and widening a few
//     pixels of ground at the very edge is far cheaper than re-cutting a band
//     both scenes depend on. **If this art is replaced again, check the bottom
//     opening first — it is the tightest fit in the scene.**
//
// COLLISION — auto-classified from the art, no hand-painted walkable guide.
// Same pipeline as the 2026-09-14 build (see that CLAUDE.md section):
//   1. Per-20px-cell mean RGB; walkable iff (R - G) >= 14 AND max(R,G,B) >= 80.
//      The new art is greener but the test still separates cleanly — open
//      ground stays warm/tan, canopy is green, rock reads neutral.
//   2. De-speckle both ways at <4 cells, then a 1-cell shoulder dilation.
//   3. MANUAL BLOCKED STAMPS, all re-measured against the new render: the
//      watchtower ruin (circle 1785,570 r240) + its SE rubble spill + the
//      banner pole; the camp's three tents (circles 820,1655 r110 / 745,1965
//      r100 / 930,2060 r105) and fire ring (982,1830 r70); the caravan rail,
//      fire ring and crate. The tower courtyard is still stamped SOLID — carve
//      an entrance through the ring's south-west collapse when the bandits go
//      in, rather than un-stamping the circle.
//   4. Forced aprons at the three edge bands, then the collider-clearance pass
//      (full-res EDT thresholded at the 18px collider radius, component
//      labelled from the road) — 69 cells of unreachable ground removed.
//   5. DANNY'S PAINT PASS (2026-09-16, round 2) — AUTHORITATIVE over steps 1-4.
//      He marked up a copy of the background: YELLOW = make this blocked,
//      BLUE = make this walkable. Strokes are read off the annotated JPG
//      (yellow: R,G>150 & B<110; blue: B>120 & R,G<110), speckle under 140px
//      dropped (JPEG noise), and a cell flips when a stroke covers a third of
//      it. Net effect: 3047 cells blocked, 239 opened — walkable went 48.5% ->
//      36.3%. Mostly it blocks the scrub clumps, the rock fields and the
//      bottom-left scrub the classifier had been letting the player walk over.
//      **⚠️ ONE EXEMPTION, at (1897,1257)-(1977,1297).** Danny's strokes on the
//      rubble north of the road and the scattered rocks south of it MET across
//      the main road there, pinching the corridor to 21px less than the 36px
//      collider needs and cutting the map clean in half — the whole east side
//      (caravan pull-off, the C3 exit) became unreachable. That 80x40px patch
//      reverts to the pre-paint classification, which is the smallest window
//      that reconnects it. **If the road is meant to be closed there, delete
//      the exemption — but C2->C3 goes with it.**
//   6. Obstacles = the complement: 633 rects + the 6 edge pins at the end.
// ONE single connected region — unlike C3, nothing here is meant to be cut off,
// so a second region means a bug (and after the paint pass there WAS one; see
// the exemption above).
//
// Engine-verified headlessly against the real World collider (36px circle):
// spawn walkable, all three round trips walkable at every pixel of their
// bands, zero edge leaks, and every NPC/patrol point standable and reachable.
export default {
  id: 'C2',
  name: 'Windmarch Grassland',
  background: 'assets/images/C2_Background.jpg',
  width: 3000,
  height: 3000,

  // On the road just north of the crossroads where the south branch leaves it.
  // Only a fallback/save anchor — real arrivals come in through an edge.
  spawn: { x: 1400, y: 1230 },

  // No `music` key -> the generic overworld track (audio.js TRACKS.overworld).
  // No `battleBackground` -> the thornback boar fights use that enemy's own
  // grassland backdrop from the catalog.

  obstacles: [
    { x: 0, y: 0, w: 3000, h: 120 },
    { x: 0, y: 120, w: 1660, h: 60 },
    { x: 1700, y: 120, w: 1300, h: 60 },
    { x: 0, y: 180, w: 160, h: 60 },
    { x: 220, y: 180, w: 1440, h: 20 },
    { x: 1720, y: 180, w: 1280, h: 20 },
    { x: 220, y: 200, w: 1380, h: 20 },
    { x: 1760, y: 200, w: 1240, h: 20 },
    { x: 240, y: 220, w: 1360, h: 20 },
    { x: 1820, y: 220, w: 1180, h: 20 },
    { x: 0, y: 240, w: 180, h: 60 },
    { x: 280, y: 240, w: 1320, h: 20 },
    { x: 1740, y: 240, w: 20, h: 20 },
    { x: 1840, y: 240, w: 1160, h: 20 },
    { x: 340, y: 260, w: 1260, h: 20 },
    { x: 1720, y: 260, w: 60, h: 40 },
    { x: 1820, y: 260, w: 180, h: 40 },
    { x: 2060, y: 260, w: 940, h: 20 },
    { x: 420, y: 280, w: 1160, h: 20 },
    { x: 2080, y: 280, w: 920, h: 20 },
    { x: 0, y: 300, w: 200, h: 20 },
    { x: 520, y: 300, w: 1060, h: 20 },
    { x: 1840, y: 300, w: 160, h: 20 },
    { x: 2120, y: 300, w: 880, h: 20 },
    { x: 0, y: 320, w: 260, h: 80 },
    { x: 540, y: 320, w: 240, h: 20 },
    { x: 820, y: 320, w: 760, h: 20 },
    { x: 1860, y: 320, w: 140, h: 20 },
    { x: 2140, y: 320, w: 860, h: 20 },
    { x: 540, y: 340, w: 180, h: 20 },
    { x: 740, y: 340, w: 40, h: 20 },
    { x: 840, y: 340, w: 680, h: 20 },
    { x: 1740, y: 340, w: 260, h: 20 },
    { x: 2020, y: 340, w: 20, h: 20 },
    { x: 2180, y: 340, w: 820, h: 20 },
    { x: 560, y: 360, w: 140, h: 20 },
    { x: 860, y: 360, w: 620, h: 20 },
    { x: 1720, y: 360, w: 360, h: 20 },
    { x: 2220, y: 360, w: 780, h: 20 },
    { x: 840, y: 380, w: 600, h: 20 },
    { x: 1680, y: 380, w: 420, h: 20 },
    { x: 2360, y: 380, w: 640, h: 60 },
    { x: 0, y: 400, w: 240, h: 60 },
    { x: 420, y: 400, w: 60, h: 20 },
    { x: 840, y: 400, w: 180, h: 20 },
    { x: 1040, y: 400, w: 400, h: 20 },
    { x: 1660, y: 400, w: 520, h: 20 },
    { x: 400, y: 420, w: 20, h: 20 },
    { x: 440, y: 420, w: 40, h: 20 },
    { x: 580, y: 420, w: 60, h: 20 },
    { x: 820, y: 420, w: 200, h: 40 },
    { x: 1080, y: 420, w: 380, h: 20 },
    { x: 1620, y: 420, w: 560, h: 20 },
    { x: 2260, y: 420, w: 40, h: 20 },
    { x: 560, y: 440, w: 80, h: 20 },
    { x: 1160, y: 440, w: 300, h: 20 },
    { x: 1560, y: 440, w: 620, h: 20 },
    { x: 2240, y: 440, w: 80, h: 20 },
    { x: 2380, y: 440, w: 620, h: 20 },
    { x: 0, y: 460, w: 260, h: 60 },
    { x: 440, y: 460, w: 20, h: 20 },
    { x: 620, y: 460, w: 20, h: 20 },
    { x: 780, y: 460, w: 20, h: 20 },
    { x: 840, y: 460, w: 160, h: 20 },
    { x: 1140, y: 460, w: 320, h: 20 },
    { x: 1540, y: 460, w: 640, h: 20 },
    { x: 2220, y: 460, w: 120, h: 40 },
    { x: 2400, y: 460, w: 600, h: 20 },
    { x: 360, y: 480, w: 20, h: 20 },
    { x: 400, y: 480, w: 60, h: 20 },
    { x: 880, y: 480, w: 120, h: 20 },
    { x: 1140, y: 480, w: 240, h: 20 },
    { x: 1520, y: 480, w: 500, h: 40 },
    { x: 2040, y: 480, w: 20, h: 20 },
    { x: 2100, y: 480, w: 80, h: 20 },
    { x: 2420, y: 480, w: 580, h: 20 },
    { x: 280, y: 500, w: 20, h: 20 },
    { x: 360, y: 500, w: 120, h: 20 },
    { x: 680, y: 500, w: 40, h: 20 },
    { x: 900, y: 500, w: 100, h: 20 },
    { x: 1120, y: 500, w: 240, h: 20 },
    { x: 2220, y: 500, w: 100, h: 20 },
    { x: 2500, y: 500, w: 500, h: 40 },
    { x: 0, y: 520, w: 320, h: 20 },
    { x: 340, y: 520, w: 120, h: 20 },
    { x: 640, y: 520, w: 80, h: 20 },
    { x: 1100, y: 520, w: 280, h: 20 },
    { x: 1500, y: 520, w: 520, h: 40 },
    { x: 2240, y: 520, w: 100, h: 20 },
    { x: 0, y: 540, w: 460, h: 20 },
    { x: 640, y: 540, w: 60, h: 20 },
    { x: 1080, y: 540, w: 300, h: 40 },
    { x: 2300, y: 540, w: 60, h: 20 },
    { x: 2580, y: 540, w: 420, h: 100 },
    { x: 0, y: 560, w: 500, h: 20 },
    { x: 580, y: 560, w: 120, h: 20 },
    { x: 1500, y: 560, w: 580, h: 20 },
    { x: 2300, y: 560, w: 140, h: 20 },
    { x: 0, y: 580, w: 700, h: 40 },
    { x: 1100, y: 580, w: 280, h: 20 },
    { x: 1500, y: 580, w: 680, h: 100 },
    { x: 2300, y: 580, w: 160, h: 40 },
    { x: 1100, y: 600, w: 300, h: 20 },
    { x: 0, y: 620, w: 600, h: 20 },
    { x: 640, y: 620, w: 60, h: 20 },
    { x: 1120, y: 620, w: 280, h: 20 },
    { x: 2300, y: 620, w: 180, h: 20 },
    { x: 0, y: 640, w: 440, h: 20 },
    { x: 460, y: 640, w: 120, h: 20 },
    { x: 740, y: 640, w: 80, h: 20 },
    { x: 1180, y: 640, w: 220, h: 20 },
    { x: 2300, y: 640, w: 160, h: 20 },
    { x: 2600, y: 640, w: 400, h: 40 },
    { x: 0, y: 660, w: 360, h: 20 },
    { x: 460, y: 660, w: 80, h: 20 },
    { x: 780, y: 660, w: 40, h: 40 },
    { x: 1220, y: 660, w: 160, h: 20 },
    { x: 2320, y: 660, w: 140, h: 20 },
    { x: 0, y: 680, w: 380, h: 20 },
    { x: 460, y: 680, w: 100, h: 20 },
    { x: 1260, y: 680, w: 80, h: 20 },
    { x: 1520, y: 680, w: 660, h: 20 },
    { x: 2340, y: 680, w: 120, h: 20 },
    { x: 2640, y: 680, w: 360, h: 20 },
    { x: 0, y: 700, w: 320, h: 180 },
    { x: 340, y: 700, w: 20, h: 20 },
    { x: 440, y: 700, w: 140, h: 20 },
    { x: 600, y: 700, w: 20, h: 20 },
    { x: 800, y: 700, w: 80, h: 20 },
    { x: 1520, y: 700, w: 420, h: 20 },
    { x: 2000, y: 700, w: 180, h: 20 },
    { x: 2340, y: 700, w: 100, h: 20 },
    { x: 2660, y: 700, w: 340, h: 20 },
    { x: 480, y: 720, w: 180, h: 20 },
    { x: 860, y: 720, w: 20, h: 20 },
    { x: 1540, y: 720, w: 380, h: 20 },
    { x: 2040, y: 720, w: 140, h: 20 },
    { x: 2380, y: 720, w: 20, h: 20 },
    { x: 2680, y: 720, w: 320, h: 40 },
    { x: 560, y: 740, w: 100, h: 20 },
    { x: 840, y: 740, w: 40, h: 20 },
    { x: 940, y: 740, w: 40, h: 40 },
    { x: 1560, y: 740, w: 360, h: 40 },
    { x: 2060, y: 740, w: 120, h: 40 },
    { x: 580, y: 760, w: 60, h: 20 },
    { x: 820, y: 760, w: 60, h: 20 },
    { x: 1040, y: 760, w: 100, h: 20 },
    { x: 2520, y: 760, w: 60, h: 20 },
    { x: 2700, y: 760, w: 300, h: 20 },
    { x: 1000, y: 780, w: 220, h: 20 },
    { x: 1580, y: 780, w: 340, h: 20 },
    { x: 2060, y: 780, w: 140, h: 40 },
    { x: 2500, y: 780, w: 80, h: 40 },
    { x: 2740, y: 780, w: 260, h: 60 },
    { x: 380, y: 800, w: 60, h: 40 },
    { x: 680, y: 800, w: 40, h: 20 },
    { x: 980, y: 800, w: 260, h: 20 },
    { x: 1620, y: 800, w: 300, h: 20 },
    { x: 620, y: 820, w: 20, h: 40 },
    { x: 660, y: 820, w: 20, h: 20 },
    { x: 980, y: 820, w: 300, h: 20 },
    { x: 1640, y: 820, w: 260, h: 40 },
    { x: 2060, y: 820, w: 100, h: 20 },
    { x: 2380, y: 820, w: 40, h: 60 },
    { x: 2520, y: 820, w: 60, h: 20 },
    { x: 2620, y: 820, w: 100, h: 20 },
    { x: 380, y: 840, w: 20, h: 20 },
    { x: 980, y: 840, w: 340, h: 40 },
    { x: 2040, y: 840, w: 100, h: 20 },
    { x: 2620, y: 840, w: 380, h: 20 },
    { x: 380, y: 860, w: 40, h: 20 },
    { x: 1340, y: 860, w: 60, h: 20 },
    { x: 1640, y: 860, w: 60, h: 20 },
    { x: 1740, y: 860, w: 160, h: 20 },
    { x: 2040, y: 860, w: 60, h: 20 },
    { x: 2620, y: 860, w: 120, h: 20 },
    { x: 2780, y: 860, w: 220, h: 20 },
    { x: 0, y: 880, w: 340, h: 60 },
    { x: 380, y: 880, w: 20, h: 20 },
    { x: 580, y: 880, w: 20, h: 20 },
    { x: 880, y: 880, w: 40, h: 40 },
    { x: 980, y: 880, w: 420, h: 20 },
    { x: 1760, y: 880, w: 140, h: 20 },
    { x: 2040, y: 880, w: 40, h: 40 },
    { x: 2200, y: 880, w: 20, h: 20 },
    { x: 2640, y: 880, w: 60, h: 20 },
    { x: 2800, y: 880, w: 200, h: 100 },
    { x: 400, y: 900, w: 20, h: 20 },
    { x: 500, y: 900, w: 20, h: 20 },
    { x: 960, y: 900, w: 440, h: 20 },
    { x: 1800, y: 900, w: 100, h: 20 },
    { x: 2160, y: 900, w: 100, h: 20 },
    { x: 400, y: 920, w: 140, h: 20 },
    { x: 980, y: 920, w: 440, h: 20 },
    { x: 1820, y: 920, w: 80, h: 20 },
    { x: 2020, y: 920, w: 60, h: 40 },
    { x: 2140, y: 920, w: 140, h: 20 },
    { x: 2420, y: 920, w: 200, h: 80 },
    { x: 0, y: 940, w: 320, h: 20 },
    { x: 420, y: 940, w: 160, h: 20 },
    { x: 980, y: 940, w: 460, h: 20 },
    { x: 1460, y: 940, w: 40, h: 20 },
    { x: 2120, y: 940, w: 180, h: 20 },
    { x: 0, y: 960, w: 300, h: 60 },
    { x: 420, y: 960, w: 140, h: 20 },
    { x: 600, y: 960, w: 20, h: 20 },
    { x: 820, y: 960, w: 60, h: 40 },
    { x: 980, y: 960, w: 520, h: 20 },
    { x: 2040, y: 960, w: 40, h: 20 },
    { x: 2100, y: 960, w: 200, h: 20 },
    { x: 2340, y: 960, w: 60, h: 60 },
    { x: 400, y: 980, w: 120, h: 60 },
    { x: 700, y: 980, w: 40, h: 40 },
    { x: 980, y: 980, w: 500, h: 20 },
    { x: 2080, y: 980, w: 220, h: 20 },
    { x: 2760, y: 980, w: 240, h: 20 },
    { x: 820, y: 1000, w: 40, h: 20 },
    { x: 980, y: 1000, w: 440, h: 20 },
    { x: 1440, y: 1000, w: 60, h: 20 },
    { x: 2080, y: 1000, w: 200, h: 20 },
    { x: 2480, y: 1000, w: 180, h: 20 },
    { x: 2840, y: 1000, w: 160, h: 40 },
    { x: 0, y: 1020, w: 280, h: 60 },
    { x: 700, y: 1020, w: 20, h: 20 },
    { x: 920, y: 1020, w: 20, h: 20 },
    { x: 1000, y: 1020, w: 360, h: 20 },
    { x: 1440, y: 1020, w: 80, h: 40 },
    { x: 2080, y: 1020, w: 180, h: 40 },
    { x: 2460, y: 1020, w: 200, h: 20 },
    { x: 380, y: 1040, w: 140, h: 40 },
    { x: 680, y: 1040, w: 60, h: 20 },
    { x: 900, y: 1040, w: 80, h: 40 },
    { x: 1100, y: 1040, w: 280, h: 20 },
    { x: 2440, y: 1040, w: 220, h: 20 },
    { x: 2860, y: 1040, w: 140, h: 20 },
    { x: 620, y: 1060, w: 180, h: 20 },
    { x: 1120, y: 1060, w: 120, h: 20 },
    { x: 1260, y: 1060, w: 120, h: 20 },
    { x: 1440, y: 1060, w: 60, h: 20 },
    { x: 2040, y: 1060, w: 200, h: 20 },
    { x: 2300, y: 1060, w: 40, h: 60 },
    { x: 2420, y: 1060, w: 240, h: 40 },
    { x: 2880, y: 1060, w: 120, h: 20 },
    { x: 0, y: 1080, w: 260, h: 20 },
    { x: 380, y: 1080, w: 160, h: 20 },
    { x: 600, y: 1080, w: 220, h: 20 },
    { x: 900, y: 1080, w: 60, h: 20 },
    { x: 1160, y: 1080, w: 60, h: 20 },
    { x: 1280, y: 1080, w: 100, h: 20 },
    { x: 2020, y: 1080, w: 220, h: 20 },
    { x: 2920, y: 1080, w: 80, h: 20 },
    { x: 0, y: 1100, w: 240, h: 20 },
    { x: 400, y: 1100, w: 80, h: 20 },
    { x: 580, y: 1100, w: 220, h: 20 },
    { x: 1040, y: 1100, w: 40, h: 20 },
    { x: 1320, y: 1100, w: 40, h: 20 },
    { x: 2020, y: 1100, w: 200, h: 20 },
    { x: 2440, y: 1100, w: 200, h: 40 },
    { x: 2940, y: 1100, w: 60, h: 40 },
    { x: 0, y: 1120, w: 60, h: 20 },
    { x: 400, y: 1120, w: 60, h: 20 },
    { x: 580, y: 1120, w: 240, h: 40 },
    { x: 1020, y: 1120, w: 60, h: 20 },
    { x: 1460, y: 1120, w: 20, h: 20 },
    { x: 1980, y: 1120, w: 200, h: 20 },
    { x: 2680, y: 1120, w: 60, h: 20 },
    { x: 400, y: 1140, w: 100, h: 20 },
    { x: 880, y: 1140, w: 60, h: 20 },
    { x: 1040, y: 1140, w: 40, h: 20 },
    { x: 1540, y: 1140, w: 80, h: 20 },
    { x: 1900, y: 1140, w: 300, h: 20 },
    { x: 2520, y: 1140, w: 100, h: 20 },
    { x: 2700, y: 1140, w: 100, h: 20 },
    { x: 420, y: 1160, w: 120, h: 20 },
    { x: 600, y: 1160, w: 220, h: 20 },
    { x: 880, y: 1160, w: 80, h: 20 },
    { x: 1440, y: 1160, w: 20, h: 20 },
    { x: 1880, y: 1160, w: 320, h: 40 },
    { x: 2520, y: 1160, w: 60, h: 20 },
    { x: 2700, y: 1160, w: 40, h: 60 },
    { x: 460, y: 1180, w: 80, h: 20 },
    { x: 600, y: 1180, w: 200, h: 20 },
    { x: 880, y: 1180, w: 60, h: 40 },
    { x: 1340, y: 1180, w: 20, h: 20 },
    { x: 1520, y: 1180, w: 60, h: 20 },
    { x: 620, y: 1200, w: 180, h: 60 },
    { x: 1120, y: 1200, w: 20, h: 20 },
    { x: 1260, y: 1200, w: 20, h: 20 },
    { x: 1560, y: 1200, w: 80, h: 20 },
    { x: 1680, y: 1200, w: 60, h: 40 },
    { x: 1900, y: 1200, w: 140, h: 20 },
    { x: 2060, y: 1200, w: 140, h: 40 },
    { x: 360, y: 1220, w: 20, h: 20 },
    { x: 1200, y: 1220, w: 20, h: 20 },
    { x: 1640, y: 1220, w: 20, h: 20 },
    { x: 1760, y: 1220, w: 20, h: 20 },
    { x: 1920, y: 1220, w: 100, h: 20 },
    { x: 2360, y: 1220, w: 40, h: 20 },
    { x: 1680, y: 1240, w: 140, h: 20 },
    { x: 1980, y: 1240, w: 40, h: 20 },
    { x: 2060, y: 1240, w: 100, h: 20 },
    { x: 660, y: 1260, w: 20, h: 20 },
    { x: 1720, y: 1260, w: 40, h: 20 },
    { x: 2260, y: 1260, w: 60, h: 20 },
    { x: 2340, y: 1260, w: 20, h: 40 },
    { x: 2380, y: 1260, w: 120, h: 20 },
    { x: 2540, y: 1260, w: 20, h: 20 },
    { x: 0, y: 1280, w: 60, h: 40 },
    { x: 1720, y: 1280, w: 60, h: 20 },
    { x: 1860, y: 1280, w: 20, h: 20 },
    { x: 2240, y: 1280, w: 20, h: 20 },
    { x: 2280, y: 1280, w: 40, h: 20 },
    { x: 2580, y: 1280, w: 40, h: 20 },
    { x: 2780, y: 1280, w: 60, h: 20 },
    { x: 2940, y: 1280, w: 60, h: 120 },
    { x: 460, y: 1300, w: 40, h: 20 },
    { x: 1320, y: 1300, w: 120, h: 20 },
    { x: 1760, y: 1300, w: 100, h: 20 },
    { x: 1920, y: 1300, w: 80, h: 20 },
    { x: 0, y: 1320, w: 100, h: 20 },
    { x: 540, y: 1320, w: 60, h: 20 },
    { x: 700, y: 1320, w: 20, h: 20 },
    { x: 820, y: 1320, w: 20, h: 20 },
    { x: 1280, y: 1320, w: 180, h: 20 },
    { x: 1800, y: 1320, w: 100, h: 20 },
    { x: 1920, y: 1320, w: 100, h: 20 },
    { x: 2080, y: 1320, w: 20, h: 20 },
    { x: 2420, y: 1320, w: 100, h: 20 },
    { x: 2840, y: 1320, w: 20, h: 20 },
    { x: 0, y: 1340, w: 160, h: 20 },
    { x: 380, y: 1340, w: 60, h: 20 },
    { x: 1260, y: 1340, w: 200, h: 20 },
    { x: 1840, y: 1340, w: 20, h: 20 },
    { x: 1900, y: 1340, w: 140, h: 20 },
    { x: 2220, y: 1340, w: 20, h: 20 },
    { x: 2440, y: 1340, w: 40, h: 20 },
    { x: 2600, y: 1340, w: 200, h: 20 },
    { x: 0, y: 1360, w: 180, h: 20 },
    { x: 460, y: 1360, w: 40, h: 20 },
    { x: 1120, y: 1360, w: 60, h: 20 },
    { x: 1240, y: 1360, w: 240, h: 20 },
    { x: 1900, y: 1360, w: 40, h: 20 },
    { x: 1960, y: 1360, w: 60, h: 20 },
    { x: 2100, y: 1360, w: 20, h: 20 },
    { x: 2160, y: 1360, w: 20, h: 20 },
    { x: 2580, y: 1360, w: 20, h: 20 },
    { x: 2620, y: 1360, w: 20, h: 20 },
    { x: 0, y: 1380, w: 240, h: 20 },
    { x: 340, y: 1380, w: 20, h: 20 },
    { x: 560, y: 1380, w: 40, h: 20 },
    { x: 620, y: 1380, w: 60, h: 20 },
    { x: 1100, y: 1380, w: 100, h: 40 },
    { x: 1240, y: 1380, w: 260, h: 20 },
    { x: 1900, y: 1380, w: 20, h: 20 },
    { x: 1980, y: 1380, w: 20, h: 20 },
    { x: 2020, y: 1380, w: 80, h: 20 },
    { x: 0, y: 1400, w: 260, h: 80 },
    { x: 1220, y: 1400, w: 280, h: 20 },
    { x: 2080, y: 1400, w: 40, h: 20 },
    { x: 2860, y: 1400, w: 140, h: 60 },
    { x: 460, y: 1420, w: 60, h: 20 },
    { x: 1120, y: 1420, w: 60, h: 20 },
    { x: 1220, y: 1420, w: 300, h: 20 },
    { x: 2660, y: 1420, w: 20, h: 20 },
    { x: 620, y: 1440, w: 40, h: 20 },
    { x: 1240, y: 1440, w: 280, h: 20 },
    { x: 2040, y: 1440, w: 120, h: 20 },
    { x: 2280, y: 1440, w: 60, h: 20 },
    { x: 2400, y: 1440, w: 20, h: 20 },
    { x: 2640, y: 1440, w: 60, h: 20 },
    { x: 2780, y: 1440, w: 20, h: 20 },
    { x: 420, y: 1460, w: 20, h: 20 },
    { x: 1260, y: 1460, w: 280, h: 40 },
    { x: 2020, y: 1460, w: 160, h: 40 },
    { x: 2280, y: 1460, w: 160, h: 20 },
    { x: 2640, y: 1460, w: 80, h: 20 },
    { x: 2740, y: 1460, w: 260, h: 20 },
    { x: 0, y: 1480, w: 240, h: 20 },
    { x: 440, y: 1480, w: 20, h: 20 },
    { x: 580, y: 1480, w: 60, h: 20 },
    { x: 2240, y: 1480, w: 220, h: 20 },
    { x: 2600, y: 1480, w: 20, h: 20 },
    { x: 2640, y: 1480, w: 360, h: 20 },
    { x: 0, y: 1500, w: 220, h: 20 },
    { x: 460, y: 1500, w: 20, h: 20 },
    { x: 520, y: 1500, w: 120, h: 20 },
    { x: 680, y: 1500, w: 60, h: 40 },
    { x: 800, y: 1500, w: 60, h: 20 },
    { x: 1300, y: 1500, w: 240, h: 20 },
    { x: 2000, y: 1500, w: 1000, h: 20 },
    { x: 0, y: 1520, w: 200, h: 20 },
    { x: 480, y: 1520, w: 180, h: 20 },
    { x: 760, y: 1520, w: 140, h: 20 },
    { x: 1320, y: 1520, w: 240, h: 20 },
    { x: 1680, y: 1520, w: 20, h: 20 },
    { x: 2020, y: 1520, w: 980, h: 80 },
    { x: 0, y: 1540, w: 180, h: 60 },
    { x: 260, y: 1540, w: 60, h: 40 },
    { x: 460, y: 1540, w: 460, h: 20 },
    { x: 1420, y: 1540, w: 160, h: 20 },
    { x: 460, y: 1560, w: 20, h: 20 },
    { x: 500, y: 1560, w: 440, h: 80 },
    { x: 1480, y: 1560, w: 120, h: 20 },
    { x: 1640, y: 1560, w: 20, h: 20 },
    { x: 1900, y: 1560, w: 80, h: 20 },
    { x: 240, y: 1580, w: 80, h: 20 },
    { x: 1380, y: 1580, w: 40, h: 20 },
    { x: 1500, y: 1580, w: 100, h: 40 },
    { x: 1880, y: 1580, w: 120, h: 20 },
    { x: 0, y: 1600, w: 320, h: 160 },
    { x: 1360, y: 1600, w: 80, h: 40 },
    { x: 1880, y: 1600, w: 1120, h: 20 },
    { x: 1520, y: 1620, w: 80, h: 80 },
    { x: 1860, y: 1620, w: 1140, h: 20 },
    { x: 480, y: 1640, w: 440, h: 20 },
    { x: 1380, y: 1640, w: 40, h: 20 },
    { x: 1840, y: 1640, w: 1160, h: 20 },
    { x: 500, y: 1660, w: 420, h: 20 },
    { x: 980, y: 1660, w: 80, h: 20 },
    { x: 1820, y: 1660, w: 1180, h: 40 },
    { x: 440, y: 1680, w: 480, h: 20 },
    { x: 1000, y: 1680, w: 100, h: 20 },
    { x: 460, y: 1700, w: 460, h: 20 },
    { x: 1020, y: 1700, w: 80, h: 20 },
    { x: 1540, y: 1700, w: 60, h: 20 },
    { x: 1800, y: 1700, w: 1200, h: 20 },
    { x: 380, y: 1720, w: 520, h: 20 },
    { x: 1820, y: 1720, w: 1180, h: 40 },
    { x: 400, y: 1740, w: 340, h: 20 },
    { x: 760, y: 1740, w: 120, h: 20 },
    { x: 0, y: 1760, w: 260, h: 100 },
    { x: 420, y: 1760, w: 300, h: 20 },
    { x: 940, y: 1760, w: 80, h: 20 },
    { x: 1840, y: 1760, w: 1160, h: 20 },
    { x: 420, y: 1780, w: 260, h: 20 },
    { x: 920, y: 1780, w: 120, h: 80 },
    { x: 1080, y: 1780, w: 40, h: 40 },
    { x: 1860, y: 1780, w: 1140, h: 20 },
    { x: 360, y: 1800, w: 300, h: 20 },
    { x: 1880, y: 1800, w: 1120, h: 20 },
    { x: 340, y: 1820, w: 360, h: 20 },
    { x: 1920, y: 1820, w: 180, h: 20 },
    { x: 2180, y: 1820, w: 820, h: 100 },
    { x: 340, y: 1840, w: 80, h: 20 },
    { x: 440, y: 1840, w: 280, h: 20 },
    { x: 2020, y: 1840, w: 80, h: 20 },
    { x: 0, y: 1860, w: 280, h: 20 },
    { x: 360, y: 1860, w: 40, h: 20 },
    { x: 460, y: 1860, w: 320, h: 20 },
    { x: 860, y: 1860, w: 40, h: 40 },
    { x: 2060, y: 1860, w: 40, h: 20 },
    { x: 0, y: 1880, w: 300, h: 60 },
    { x: 440, y: 1880, w: 380, h: 40 },
    { x: 1840, y: 1880, w: 20, h: 20 },
    { x: 880, y: 1900, w: 80, h: 20 },
    { x: 1820, y: 1900, w: 40, h: 20 },
    { x: 440, y: 1920, w: 400, h: 20 },
    { x: 860, y: 1920, w: 100, h: 20 },
    { x: 1800, y: 1920, w: 80, h: 20 },
    { x: 2140, y: 1920, w: 860, h: 40 },
    { x: 0, y: 1940, w: 320, h: 60 },
    { x: 420, y: 1940, w: 520, h: 20 },
    { x: 1800, y: 1940, w: 160, h: 20 },
    { x: 420, y: 1960, w: 560, h: 20 },
    { x: 1740, y: 1960, w: 240, h: 40 },
    { x: 2120, y: 1960, w: 880, h: 20 },
    { x: 420, y: 1980, w: 580, h: 20 },
    { x: 2080, y: 1980, w: 920, h: 20 },
    { x: 0, y: 2000, w: 300, h: 80 },
    { x: 400, y: 2000, w: 620, h: 20 },
    { x: 1740, y: 2000, w: 260, h: 20 },
    { x: 2100, y: 2000, w: 900, h: 20 },
    { x: 400, y: 2020, w: 640, h: 20 },
    { x: 1620, y: 2020, w: 60, h: 20 },
    { x: 1760, y: 2020, w: 260, h: 20 },
    { x: 2120, y: 2020, w: 880, h: 60 },
    { x: 420, y: 2040, w: 40, h: 20 },
    { x: 480, y: 2040, w: 320, h: 20 },
    { x: 820, y: 2040, w: 220, h: 60 },
    { x: 1620, y: 2040, w: 80, h: 40 },
    { x: 1780, y: 2040, w: 260, h: 20 },
    { x: 480, y: 2060, w: 280, h: 20 },
    { x: 1800, y: 2060, w: 240, h: 20 },
    { x: 0, y: 2080, w: 320, h: 20 },
    { x: 480, y: 2080, w: 120, h: 20 },
    { x: 620, y: 2080, w: 20, h: 20 },
    { x: 660, y: 2080, w: 120, h: 80 },
    { x: 1600, y: 2080, w: 120, h: 20 },
    { x: 1860, y: 2080, w: 180, h: 20 },
    { x: 2140, y: 2080, w: 860, h: 20 },
    { x: 0, y: 2100, w: 340, h: 160 },
    { x: 460, y: 2100, w: 140, h: 60 },
    { x: 840, y: 2100, w: 220, h: 20 },
    { x: 1600, y: 2100, w: 140, h: 20 },
    { x: 1920, y: 2100, w: 160, h: 60 },
    { x: 2140, y: 2100, w: 20, h: 20 },
    { x: 2240, y: 2100, w: 760, h: 20 },
    { x: 860, y: 2120, w: 200, h: 20 },
    { x: 1220, y: 2120, w: 140, h: 20 },
    { x: 1600, y: 2120, w: 160, h: 20 },
    { x: 2260, y: 2120, w: 740, h: 20 },
    { x: 880, y: 2140, w: 160, h: 20 },
    { x: 1200, y: 2140, w: 200, h: 20 },
    { x: 1600, y: 2140, w: 180, h: 20 },
    { x: 2280, y: 2140, w: 720, h: 80 },
    { x: 460, y: 2160, w: 120, h: 20 },
    { x: 820, y: 2160, w: 300, h: 20 },
    { x: 1200, y: 2160, w: 220, h: 20 },
    { x: 1600, y: 2160, w: 200, h: 20 },
    { x: 1960, y: 2160, w: 120, h: 20 },
    { x: 440, y: 2180, w: 140, h: 20 },
    { x: 820, y: 2180, w: 220, h: 20 },
    { x: 1060, y: 2180, w: 60, h: 20 },
    { x: 1180, y: 2180, w: 240, h: 20 },
    { x: 1460, y: 2180, w: 20, h: 20 },
    { x: 1600, y: 2180, w: 220, h: 20 },
    { x: 1980, y: 2180, w: 100, h: 20 },
    { x: 420, y: 2200, w: 120, h: 20 },
    { x: 760, y: 2200, w: 40, h: 40 },
    { x: 820, y: 2200, w: 200, h: 20 },
    { x: 1180, y: 2200, w: 260, h: 100 },
    { x: 1600, y: 2200, w: 240, h: 20 },
    { x: 2040, y: 2200, w: 80, h: 20 },
    { x: 420, y: 2220, w: 80, h: 40 },
    { x: 860, y: 2220, w: 100, h: 20 },
    { x: 980, y: 2220, w: 60, h: 60 },
    { x: 1600, y: 2220, w: 260, h: 20 },
    { x: 2060, y: 2220, w: 80, h: 20 },
    { x: 2260, y: 2220, w: 740, h: 20 },
    { x: 860, y: 2240, w: 80, h: 20 },
    { x: 1600, y: 2240, w: 280, h: 20 },
    { x: 2080, y: 2240, w: 80, h: 20 },
    { x: 2280, y: 2240, w: 720, h: 60 },
    { x: 0, y: 2260, w: 320, h: 20 },
    { x: 440, y: 2260, w: 40, h: 20 },
    { x: 880, y: 2260, w: 40, h: 20 },
    { x: 1500, y: 2260, w: 20, h: 20 },
    { x: 1600, y: 2260, w: 380, h: 20 },
    { x: 2100, y: 2260, w: 80, h: 20 },
    { x: 0, y: 2280, w: 300, h: 60 },
    { x: 420, y: 2280, w: 40, h: 20 },
    { x: 540, y: 2280, w: 20, h: 20 },
    { x: 1000, y: 2280, w: 40, h: 20 },
    { x: 1600, y: 2280, w: 400, h: 60 },
    { x: 440, y: 2300, w: 140, h: 20 },
    { x: 900, y: 2300, w: 20, h: 20 },
    { x: 1200, y: 2300, w: 220, h: 20 },
    { x: 2300, y: 2300, w: 700, h: 20 },
    { x: 460, y: 2320, w: 120, h: 20 },
    { x: 680, y: 2320, w: 40, h: 20 },
    { x: 860, y: 2320, w: 100, h: 40 },
    { x: 1220, y: 2320, w: 200, h: 20 },
    { x: 2320, y: 2320, w: 680, h: 60 },
    { x: 0, y: 2340, w: 320, h: 80 },
    { x: 460, y: 2340, w: 140, h: 20 },
    { x: 660, y: 2340, w: 60, h: 40 },
    { x: 1260, y: 2340, w: 160, h: 20 },
    { x: 1600, y: 2340, w: 420, h: 20 },
    { x: 440, y: 2360, w: 180, h: 20 },
    { x: 860, y: 2360, w: 80, h: 20 },
    { x: 1340, y: 2360, w: 60, h: 20 },
    { x: 1600, y: 2360, w: 460, h: 20 },
    { x: 440, y: 2380, w: 100, h: 20 },
    { x: 560, y: 2380, w: 40, h: 20 },
    { x: 800, y: 2380, w: 40, h: 20 },
    { x: 880, y: 2380, w: 60, h: 20 },
    { x: 1000, y: 2380, w: 40, h: 20 },
    { x: 1180, y: 2380, w: 80, h: 20 },
    { x: 1580, y: 2380, w: 480, h: 20 },
    { x: 2300, y: 2380, w: 700, h: 20 },
    { x: 460, y: 2400, w: 60, h: 20 },
    { x: 780, y: 2400, w: 80, h: 60 },
    { x: 980, y: 2400, w: 60, h: 40 },
    { x: 1180, y: 2400, w: 100, h: 20 },
    { x: 1560, y: 2400, w: 460, h: 20 },
    { x: 2260, y: 2400, w: 740, h: 160 },
    { x: 0, y: 2420, w: 340, h: 100 },
    { x: 420, y: 2420, w: 120, h: 20 },
    { x: 620, y: 2420, w: 60, h: 40 },
    { x: 1160, y: 2420, w: 140, h: 20 },
    { x: 1540, y: 2420, w: 400, h: 20 },
    { x: 440, y: 2440, w: 80, h: 20 },
    { x: 1000, y: 2440, w: 40, h: 20 },
    { x: 1140, y: 2440, w: 180, h: 40 },
    { x: 1540, y: 2440, w: 300, h: 40 },
    { x: 480, y: 2460, w: 40, h: 20 },
    { x: 640, y: 2460, w: 20, h: 20 },
    { x: 780, y: 2460, w: 60, h: 20 },
    { x: 520, y: 2480, w: 40, h: 40 },
    { x: 1140, y: 2480, w: 220, h: 20 },
    { x: 1560, y: 2480, w: 280, h: 60 },
    { x: 1980, y: 2480, w: 100, h: 20 },
    { x: 1160, y: 2500, w: 200, h: 20 },
    { x: 1960, y: 2500, w: 180, h: 20 },
    { x: 0, y: 2520, w: 360, h: 220 },
    { x: 1180, y: 2520, w: 180, h: 60 },
    { x: 1960, y: 2520, w: 220, h: 20 },
    { x: 1060, y: 2540, w: 60, h: 20 },
    { x: 1560, y: 2540, w: 300, h: 20 },
    { x: 1960, y: 2540, w: 240, h: 20 },
    { x: 1040, y: 2560, w: 120, h: 20 },
    { x: 1540, y: 2560, w: 1460, h: 160 },
    { x: 1040, y: 2580, w: 320, h: 20 },
    { x: 620, y: 2600, w: 80, h: 20 },
    { x: 1040, y: 2600, w: 160, h: 20 },
    { x: 1220, y: 2600, w: 120, h: 20 },
    { x: 480, y: 2620, w: 40, h: 40 },
    { x: 600, y: 2620, w: 120, h: 20 },
    { x: 1060, y: 2620, w: 140, h: 20 },
    { x: 1260, y: 2620, w: 60, h: 20 },
    { x: 580, y: 2640, w: 160, h: 20 },
    { x: 1080, y: 2640, w: 120, h: 20 },
    { x: 580, y: 2660, w: 240, h: 20 },
    { x: 960, y: 2660, w: 20, h: 40 },
    { x: 1100, y: 2660, w: 100, h: 40 },
    { x: 580, y: 2680, w: 320, h: 20 },
    { x: 560, y: 2700, w: 420, h: 20 },
    { x: 1100, y: 2700, w: 120, h: 20 },
    { x: 540, y: 2720, w: 500, h: 20 },
    { x: 1120, y: 2720, w: 100, h: 20 },
    { x: 1520, y: 2720, w: 1480, h: 60 },
    { x: 0, y: 2740, w: 380, h: 40 },
    { x: 520, y: 2740, w: 700, h: 40 },
    { x: 0, y: 2780, w: 400, h: 20 },
    { x: 500, y: 2780, w: 720, h: 40 },
    { x: 1460, y: 2780, w: 1540, h: 40 },
    { x: 0, y: 2800, w: 420, h: 40 },
    { x: 500, y: 2820, w: 760, h: 20 },
    { x: 1440, y: 2820, w: 1560, h: 180 },
    { x: 0, y: 2840, w: 440, h: 20 },
    { x: 480, y: 2840, w: 780, h: 20 },
    { x: 0, y: 2860, w: 1240, h: 20 },
    { x: 0, y: 2880, w: 1260, h: 120 },

    // ---- EDGE PINS ----
    // Sub-cell rects one collider radius (18px) clear of each band limit, so
    // the collider CENTRE is penned into exactly the declared band and the
    // player can never press against an edge outside one and hit a silent
    // invisible wall. Left/right: blockers end at 1152 / resume at 1273,
    // penning the centre to y1170-1255. Bottom: end at 1268 / resume at 1421,
    // penning it to x1286-1403. Re-derive these if a band ever moves.
    { x: 0, y: 1040, w: 60, h: 112 },
    { x: 0, y: 1273, w: 60, h: 120 },
    { x: 2940, y: 1040, w: 60, h: 112 },
    { x: 2940, y: 1273, w: 60, h: 120 },
    { x: 1180, y: 2880, w: 88, h: 120 },
    { x: 1421, y: 2880, w: 90, h: 120 },
  ],

  // Landmark proximity labels (doorless, so they use their own radius `r`).
  // The camp keeps a label even though the Reedwalkers now stand in it — their
  // own name labels only show at talk range, and the camp reads as a place
  // from much further off.
  buildings: [
    { label: 'Ruined Watchtower', x: 1785, y: 300, r: 620 },
    { label: 'Herders\u2019 Camp', x: 880, y: 1730, r: 540 },
    { label: 'Caravan Rest', x: 2500, y: 990, r: 360 },
  ],

  // Code-drawn campfires + their smoke (2026-09-16, Danny's exact
  // coordinates — world.js's drawFire/drawSmoke, no art needed). Both sit on
  // open ground with nothing painted under them: one out in the north-west
  // grass, one just west of the watchtower ruin, which reads nicely as someone
  // camped in the ruins ahead of the bandits the row-C brief puts there.
  // NOTE: C4's campfire offsets its smoke 35px ABOVE the flame; these use
  // Danny's exact coordinates for both, so say the word if the plume should
  // start higher. Neither point is an obstacle — the fires are visual only.
  fires: [
    { x: 584, y: 1080 },
    { x: 1504, y: 646 },
  ],
  smoke: [
    { x: 584, y: 1080 },
    { x: 1504, y: 646 },
  ],

  interactables: [],
  chests: [],
  battles: [],
  ambushes: [],

  // ---- The Reedwalkers + their last thrumhorn (2026-09-16, Danny) ----
  // A nomadic herder couple camped south-west of the crossroads. They drove a
  // herd of thrumhorns down the Windmarch road; thornback boars came out of the
  // open ground north of the road in the night and killed all but one. TOVAN
  // carries the quest (kill the three boars); NERA is the trader. Neither has a
  // `home` — they are nomads, so they stand in their camp and never go inside
  // anything. That works because main.js's buildVendorDialog/withShop now gate
  // the Buy/Sell options on `npc.home && !npc.atHome` instead of bare
  // `!npc.atHome`, so a homeless vendor trades wherever they stand. **Reuse
  // that for any future travelling merchant** (the tinker/enchanter caravan
  // this area is still owed is exactly the same shape).
  //
  // All six positions and every patrol point below were picked against the real
  // 36px collider (nearest reachable point with >=30px clearance to the
  // intended spot), not eyeballed off the art.
  npcs: [
    {
      id: 'tovan', name: 'Tovan Reedwalker', role: 'HERDER',
      sprite: 'assets/images/tovan_reedwalker_overhead.png',
      portrait: 'assets/images/tovan_reedwalker.png',
      x: 1063, y: 1751, speed: 28, startsHome: false,
      // A short local loop around the fire ring — he does not wander off to the
      // tents, so the player can always find the quest-giver where they left him.
      // Re-picked 2026-09-16 (round 2) against the repainted collision.
      patrol: [
        { x: 1063, y: 1751 },
        { x: 1160, y: 1690 },
        { x: 1099, y: 1851 },
      ],
      // Replaced at runtime by main.js's buildTovanDialog (quest state +
      // whether the three boars are actually dead). This is the fallback only.
      dialog: {
        line: 'Three of them came out of the grass before dawn. We heard it happen. There was nothing to be done in the dark but hold on to the one that ran the right way.',
        responses: ['Leave.'],
      },
      chatter: [
        { q: 'What is a thrumhorn?', a: 'Herd beast. Slow, warm, stubborn as a stuck cart — and worth more than everything else we own put together. That hum they make when they are content, that is where the name comes from. You will hear it if you stand close enough.' },
        { q: 'Why camp out here at all?', a: 'The Windmarch grass is good and nobody charges us for it. That was the whole of the plan. Nobody mentioned what else grazes out here.' },
      ],
    },
    {
      id: 'nera', name: 'Nera Reedwalker', role: 'HERDER',
      // Basic road stock, per Danny. `gold` is her purse for buying the
      // player's goods — modest, they just lost the herd.
      vendor: true,
      stock: [{ id: 'bread', qty: 3 }, { id: 'corn', qty: 4 }, { id: 'health_potion', qty: 2 }],
      gold: 26,
      sprite: 'assets/images/nera_reedwalker_overhead.png',
      portrait: 'assets/images/nera_reedwalker.png',
      // Her old spot (870,1890) landed inside Danny's repaint, so she moved
      // ~50px west onto open camp ground (2026-09-16, round 2).
      x: 829, y: 1845, speed: 28, startsHome: false,
      patrol: [
        { x: 829, y: 1845 },
        { x: 885, y: 1795 },
        { x: 780, y: 1820 },
      ],
      dialog: {
        line: 'You will want to keep moving, but if you are buying, I am selling. Road food, mostly. It is what we have left to trade.',
        responses: ['Leave.'],
      },
      chatter: [
        { q: 'Are you all right out here?', a: 'We are alive and one of the herd is alive. Ask me again in a week and I might have a better answer for you.' },
        { q: 'Where were you headed?', a: 'East, and then north, and then wherever the grass is. That was before. Now we are headed nowhere until Tovan stops staring at that ridge.' },
      ],
    },
    {
      id: 'thrumhorn', name: 'Thrumhorn', role: '',
      sprite: 'assets/images/thrumhorn_overhead.png',
      portrait: 'assets/images/thrumhorn.png',
      x: 1180, y: 1990, speed: 18, startsHome: false,
      // Grazes slowly on a wide loop south-east of the tents. Dialog is built
      // by main.js's buildThrumhornDialog (pet, and feed it corn if carrying
      // any) — the same shape as Cinder the horse and Gaffer the goat.
      patrol: [
        { x: 1180, y: 1990 },
        { x: 1250, y: 2070 },
        { x: 1110, y: 2050 },
      ],
    },

    // ---- The three thornback boars (2026-09-16, Danny) ----
    // Roaming `creature` NPCs in the open ground north of the road, below the
    // rocky north-west cliff — the ground the Reedwalkers say the beasts came
    // out of. Same AI as D1's cragclaws and D4B's cave spiders: mill about on a
    // patrol loop when calm, CHARGE when the player comes within `aggroRange`,
    // give up once the player is `giveUpRange` from where the chase started.
    // `defeated` persists per-World and in the save, so a killed boar stays
    // dead — which is what Tovan's turn-in counts.
    //
    // aggroRange 420 is deliberately TIGHTER than the cragclaws' 625, and all
    // nine patrol points were PLACED AGAINST A ROUTE TRACE rather than by eye:
    // the actual travelled road (BFS shortest paths between all three edge
    // bands and the camp, plus every arrival tile of every band) was computed,
    // and every boar point is >=485px from the nearest point of it — a 65px
    // margin outside aggro. That matters because Danny's brief is "they attack
    // the player if the player GETS TOO CLOSE": the boars have to be a threat
    // you choose to walk into, not an ambush that mugs you the moment you step
    // in from C1. An earlier hand-placed loop put one of them ~110px off the
    // road, which would have charged every passing traveller including one who
    // hasn't met the Reedwalkers yet. **If these are ever moved, re-run the
    // route trace — eyeballing "that looks far enough" is what got it wrong.**
    // (Tovan's line about the road being unsafe after dark is flavour; the
    // mechanical threat is the open grass, which is where the quest sends you.)
    {
      id: 'thornback_1', name: 'Thornback Boar', creature: true, enemyId: 'thornback_boar',
      sprite: 'assets/images/thornback_boar_overhead.png',
      portrait: 'assets/images/thornback_boar.png',
      x: 522, y: 525, speed: 30, chaseSpeed: 150, aggroRange: 420, giveUpRange: 620,
      startsHome: false,
      patrol: [
        { x: 522, y: 525 },
        { x: 679, y: 448 },
        { x: 315, y: 463 },
      ],
    },
    {
      id: 'thornback_2', name: 'Thornback Boar', creature: true, enemyId: 'thornback_boar',
      sprite: 'assets/images/thornback_boar_overhead.png',
      portrait: 'assets/images/thornback_boar.png',
      x: 780, y: 781, speed: 30, chaseSpeed: 150, aggroRange: 420, giveUpRange: 620,
      startsHome: false,
      patrol: [
        { x: 780, y: 781 },
        { x: 973, y: 700 },
        { x: 660, y: 680 },
      ],
    },
    {
      id: 'thornback_3', name: 'Thornback Boar', creature: true, enemyId: 'thornback_boar',
      sprite: 'assets/images/thornback_boar_overhead.png',
      portrait: 'assets/images/thornback_boar.png',
      x: 1093, y: 669, speed: 30, chaseSpeed: 150, aggroRange: 420, giveUpRange: 620,
      startsHome: false,
      patrol: [
        { x: 1093, y: 669 },
        { x: 1041, y: 493 },
        { x: 1234, y: 732 },
      ],
    },
  ],

  exits: [
    { edge: 'left', yMin: 1170, yMax: 1255, to: 'C1', note: 'the road west to Tidewrack Harbor' },
    { edge: 'bottom', xMin: 1286, xMax: 1403, to: 'D2', note: 'the road south to Millmere' },
    { edge: 'right', yMin: 1170, yMax: 1255, to: 'C3', note: 'the road east into Hallowmere Forest' },
  ],
};
