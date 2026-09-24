// Scene C3 — HALLOWMERE FOREST (overworld row C, column 3 — EAST of C2
// Windmarch Grassland, WEST of C4 Woods, SOUTH of B3 Town)
// World coordinates: 3000x3000. Origin top-left.
//
// Old deciduous woodland in the west that thickens into near-primeval forest as
// it runs east to the shore of a great still lake. The ancient Temple of Aeluna
// stands on an island at the lake's heart — a circular colonnaded pergola under
// a domed roof, on a flagstone plaza carved with sun/moon/star figures, ringed
// by standing stones. A weathered jetty on the island's west shore faces a
// matching one on the mainland, with the broken stumps of a drowned causeway
// between them. A cave mouth opens in a rock bluff in the far south-east, and a
// secluded lotus pool sits in the dark forest of the south-west.
//
// CONTENT SO FAR. Built terrain-only on 2026-09-15 (Danny: "no NPCs, enemies,
// or quests yet"); THE LAKEWARDEN was added 2026-09-20 (see the npcs block
// below) — the ferryman the row-C brief owed this scene. 2026-09-24: the
// Lakewarden's dialogue was reworked — he no longer names the silver lotus as
// his fare (that item is deferred), and instead tells his usual explanation
// of the temple's fall, the river rerouted into a moat, and his charge as
// warden over whatever the water is holding back; he now actually ferries the
// player across for a flat 50-gold fee (see buildLakewardenDialog in
// main.js). The same date, Level 1 of the temple's interior (scene C3B) went
// live, reached via the `temple_of_aeluna_entrance` interactable on the
// island plaza (see `interactables`). Still no battles, ambushes or chests on
// this overworld scene itself. The other live content is the cave link to
// D4B (see `interactables`). Everything else the row-C brief calls for here —
// the Silver Lotus hunt, the rootweaver / Bramblekin scouts, the temple's
// deeper levels, the Stone Warden boss and the Ward-Shard — is still to come.
//
// EXITS. Bands measured against the art's actual open ground at each edge and
// matched to the neighbour's band so a round trip preserves the player's
// position (switchScene keeps y across a left/right crossing, x across a
// top/bottom one):
//   left -> C2  y1170-1255 — EXACTLY the band c2.js already declares for its
//               `right` exit, taken verbatim as that file instructed. The art's
//               trail meets the left edge across y1120-1320, comfortably wider,
//               so the band sits inside the natural opening with room to spare.
//   top  -> B3  x998-1082 — STUBBED (B3 Town isn't built, so the frame loop
//               shows the "isn't ready yet" toast). **Give B3's future `bottom`
//               exit this band verbatim.** The art's gap in the treeline is
//               x1000-1080; the apron was carved one cell wider each side
//               (x960-1120) so the band is a comfortable 84px rather than a
//               fiddly 44px of centre travel.
//   right -> none. The lake fills the east edge and drains off it into the
//               river that runs down C4's WEST edge (c4.js: "A river runs down
//               the WEST edge (impassable)"), so the two scenes read as one
//               body of water. C4 has no `left` exit and wants none.
//   bottom -> none. Sealed by forest. NOTE: the overworld grid puts D3 (the
//               Farm) directly south and a comment in d3.js assumes C3 is its
//               northern neighbour, but d3.js has only left/right exits and
//               never had a north one. If that link is ever wanted, the ART
//               needs a trail painted down to the bottom edge first.
//
// COLLISION — auto-classified from the art; no hand-painted walkable guide was
// supplied (same as C2 and C1's round 1). Same pipeline as C2, with two
// additions this scene forced:
//   1. Base test, unchanged from C2: walkable iff (R - G) >= 14 AND
//      max(R,G,B) >= 80. Trails, clearings, sandy shore and the timber docks
//      are warm; canopy (G > R), lake water (blue), shadow and gray boulders
//      all fail it.
//   2. NEW — the temple plaza. Pale flagstone reads neutral-gray, not warm, so
//      the base test threw the whole plaza away and left only the island's
//      sandy shore ring walkable. Fix: INSIDE the plaza disc only (centre
//      2990,1275 r590, fitted to the art), also accept bright non-green paving
//      (V >= 110 and (G - R) < 30). That recovers the paving while leaving the
//      moss, rubble and most column drums blocked, which reads correctly. The
//      domed roof and the stair well beneath it are then stamped solid
//      (disc 2960,1240 r300). 2026-09-24: that solid stamp is exactly where
//      the `temple_of_aeluna_entrance` interactable now sits, just outside
//      its west edge — see `interactables`.
//   3. De-speckle both ways at <4 cells, 1-cell shoulder dilation, forced
//      aprons at the two edge bands, then the collider-clearance pass from C2
//      (full-res EDT thresholded at the 18px collider radius, component
//      labelled) — 90 cells of unreachable ground removed. 328 rects + 4 edge
//      pins (see the pin comment in the array).
//
// ⚠️ THREE WALKABLE REGIONS, NOT ONE — this scene deliberately breaks C2's
// "one single connected region" rule, so do NOT "fix" it by dropping the
// extras:
//   A. The MAINLAND (673k px of collider-centre space): the left-edge entry,
//      the NW clearing, the north trail to B3, the shore trail to the mainland
//      dock, and the long south-east shore trail down to the cave. This is the
//      only region the player can reach on foot, and `spawn` sits in it.
//   B. The ISLAND (516k px): its jetty, shore ring and the temple plaza.
//      Unreachable ON FOOT BY DESIGN — the Lakewarden's ferry (2026-09-20,
//      dialogue reworked 2026-09-24) is the only way over, for a 50-gold fee.
//      The `temple_of_aeluna_entrance` interactable (2026-09-24) sits at
//      x2635,y1245, confirmed reachable from the ferry's island landing
//      (2030,1300) by a headless BFS over this scene's real obstacles.
//   C. The SOUTH-WEST GLADE (389k px): the big lower-left clearing and the
//      shore of the lotus pool. **This one is unreachable BY ACCIDENT** — the
//      art rings it completely with forest, with no trail in from anywhere
//      (the nearest approach is ~168px of solid canopy). The Silver Lotus is
//      the ferryman's payment in the design brief, so this glade is a quest
//      objective the player currently cannot walk to. **Needs a spur trail
//      painted into the art**, then a regenerate. Kept walkable meanwhile.
// Two small slivers of classification noise (~3k and ~5k px) were dropped.
//
// Engine-verified headlessly against the real World collider (36px circle):
// spawn walkable, every arrival position in C2's band walkable and connected,
// both exit bands reachable, no walkable ground touching any edge outside a
// declared band, and the cave interactable standable and reachable from spawn.
export default {
  id: 'C3',
  name: 'Hallowmere Forest',
  background: 'assets/images/C3_Background.jpg',
  width: 3000,
  height: 3000,

  // On the trail just west of the fork where the north branch leaves for B3.
  // Only a fallback/save anchor — real arrivals come in through an edge.
  spawn: { x: 1380, y: 1310 },

  // No `music` key -> the generic overworld track. A lake/temple scene probably
  // wants its own; give it one when the area gets content.

  obstacles: [
    { x: 0, y: 0, w: 980, h: 120 },
    { x: 1100, y: 0, w: 1900, h: 120 },
    { x: 0, y: 120, w: 960, h: 40 },
    { x: 1120, y: 120, w: 1880, h: 100 },
    { x: 0, y: 160, w: 1000, h: 100 },
    { x: 1100, y: 220, w: 1900, h: 20 },
    { x: 1140, y: 240, w: 1860, h: 60 },
    { x: 0, y: 260, w: 900, h: 20 },
    { x: 960, y: 260, w: 40, h: 40 },
    { x: 0, y: 280, w: 860, h: 20 },
    { x: 0, y: 300, w: 660, h: 20 },
    { x: 720, y: 300, w: 40, h: 20 },
    { x: 1240, y: 300, w: 1760, h: 60 },
    { x: 0, y: 320, w: 600, h: 20 },
    { x: 0, y: 340, w: 580, h: 20 },
    { x: 1100, y: 340, w: 20, h: 20 },
    { x: 0, y: 360, w: 560, h: 20 },
    { x: 1200, y: 360, w: 1800, h: 20 },
    { x: 0, y: 380, w: 400, h: 20 },
    { x: 1120, y: 380, w: 1880, h: 40 },
    { x: 0, y: 400, w: 380, h: 20 },
    { x: 0, y: 420, w: 360, h: 20 },
    { x: 1100, y: 420, w: 1900, h: 20 },
    { x: 0, y: 440, w: 340, h: 40 },
    { x: 1060, y: 440, w: 1940, h: 20 },
    { x: 1040, y: 460, w: 1960, h: 40 },
    { x: 0, y: 480, w: 320, h: 60 },
    { x: 1020, y: 500, w: 1580, h: 20 },
    { x: 2680, y: 500, w: 320, h: 80 },
    { x: 1000, y: 520, w: 1540, h: 20 },
    { x: 0, y: 540, w: 340, h: 40 },
    { x: 1000, y: 540, w: 1500, h: 20 },
    { x: 980, y: 560, w: 1480, h: 20 },
    { x: 0, y: 580, w: 360, h: 20 },
    { x: 980, y: 580, w: 1460, h: 20 },
    { x: 2620, y: 580, w: 380, h: 20 },
    { x: 0, y: 600, w: 380, h: 40 },
    { x: 960, y: 600, w: 1460, h: 20 },
    { x: 2600, y: 600, w: 400, h: 20 },
    { x: 940, y: 620, w: 1460, h: 40 },
    { x: 2580, y: 620, w: 200, h: 20 },
    { x: 2840, y: 620, w: 160, h: 20 },
    { x: 0, y: 640, w: 400, h: 60 },
    { x: 2520, y: 640, w: 20, h: 20 },
    { x: 2600, y: 640, w: 80, h: 20 },
    { x: 2860, y: 640, w: 140, h: 40 },
    { x: 920, y: 660, w: 1480, h: 20 },
    { x: 2480, y: 660, w: 60, h: 20 },
    { x: 920, y: 680, w: 1620, h: 20 },
    { x: 2940, y: 680, w: 20, h: 20 },
    { x: 2980, y: 680, w: 20, h: 160 },
    { x: 0, y: 700, w: 440, h: 60 },
    { x: 920, y: 700, w: 1600, h: 20 },
    { x: 920, y: 720, w: 1320, h: 20 },
    { x: 2300, y: 720, w: 180, h: 60 },
    { x: 900, y: 740, w: 1340, h: 20 },
    { x: 0, y: 760, w: 460, h: 20 },
    { x: 900, y: 760, w: 1320, h: 20 },
    { x: 2600, y: 760, w: 40, h: 20 },
    { x: 0, y: 780, w: 480, h: 20 },
    { x: 900, y: 780, w: 1300, h: 20 },
    { x: 2300, y: 780, w: 140, h: 20 },
    { x: 2580, y: 780, w: 20, h: 20 },
    { x: 0, y: 800, w: 560, h: 20 },
    { x: 640, y: 800, w: 60, h: 20 },
    { x: 880, y: 800, w: 1300, h: 40 },
    { x: 2300, y: 800, w: 120, h: 20 },
    { x: 2920, y: 800, w: 20, h: 20 },
    { x: 0, y: 820, w: 580, h: 20 },
    { x: 640, y: 820, w: 80, h: 20 },
    { x: 2300, y: 820, w: 100, h: 20 },
    { x: 2920, y: 820, w: 40, h: 20 },
    { x: 0, y: 840, w: 720, h: 20 },
    { x: 880, y: 840, w: 1280, h: 60 },
    { x: 2280, y: 840, w: 60, h: 20 },
    { x: 2520, y: 840, w: 20, h: 20 },
    { x: 2920, y: 840, w: 80, h: 40 },
    { x: 0, y: 860, w: 760, h: 220 },
    { x: 2260, y: 860, w: 80, h: 20 },
    { x: 2500, y: 860, w: 20, h: 20 },
    { x: 2220, y: 880, w: 120, h: 40 },
    { x: 2920, y: 880, w: 20, h: 20 },
    { x: 2980, y: 880, w: 20, h: 60 },
    { x: 880, y: 900, w: 1240, h: 140 },
    { x: 2460, y: 900, w: 40, h: 40 },
    { x: 2200, y: 920, w: 120, h: 80 },
    { x: 2460, y: 940, w: 60, h: 20 },
    { x: 2880, y: 940, w: 120, h: 20 },
    { x: 2460, y: 960, w: 80, h: 20 },
    { x: 2820, y: 960, w: 180, h: 20 },
    { x: 2400, y: 980, w: 40, h: 40 },
    { x: 2800, y: 980, w: 200, h: 20 },
    { x: 2200, y: 1000, w: 100, h: 40 },
    { x: 2760, y: 1000, w: 240, h: 20 },
    { x: 2380, y: 1020, w: 40, h: 40 },
    { x: 2740, y: 1020, w: 260, h: 20 },
    { x: 860, y: 1040, w: 1260, h: 60 },
    { x: 2200, y: 1040, w: 80, h: 40 },
    { x: 2500, y: 1040, w: 20, h: 20 },
    { x: 2720, y: 1040, w: 280, h: 40 },
    { x: 2500, y: 1060, w: 40, h: 20 },
    { x: 0, y: 1080, w: 100, h: 20 },
    { x: 220, y: 1080, w: 480, h: 20 },
    { x: 2220, y: 1080, w: 40, h: 80 },
    { x: 2500, y: 1080, w: 60, h: 40 },
    { x: 2700, y: 1080, w: 300, h: 20 },
    { x: 0, y: 1100, w: 60, h: 40 },
    { x: 420, y: 1100, w: 60, h: 20 },
    { x: 880, y: 1100, w: 1220, h: 20 },
    { x: 2680, y: 1100, w: 320, h: 60 },
    { x: 920, y: 1120, w: 1180, h: 20 },
    { x: 2360, y: 1120, w: 40, h: 20 },
    { x: 2500, y: 1120, w: 80, h: 20 },
    { x: 960, y: 1140, w: 1140, h: 20 },
    { x: 2340, y: 1140, w: 40, h: 40 },
    { x: 1000, y: 1160, w: 1080, h: 20 },
    { x: 2200, y: 1160, w: 40, h: 60 },
    { x: 2660, y: 1160, w: 340, h: 200 },
    { x: 1040, y: 1180, w: 1040, h: 20 },
    { x: 2360, y: 1180, w: 20, h: 40 },
    { x: 1060, y: 1200, w: 1020, h: 20 },
    { x: 640, y: 1220, w: 40, h: 20 },
    { x: 740, y: 1220, w: 140, h: 20 },
    { x: 1160, y: 1220, w: 160, h: 20 },
    { x: 1380, y: 1220, w: 60, h: 20 },
    { x: 1500, y: 1220, w: 580, h: 20 },
    { x: 2200, y: 1220, w: 20, h: 20 },
    { x: 640, y: 1240, w: 260, h: 20 },
    { x: 1500, y: 1240, w: 480, h: 40 },
    { x: 440, y: 1260, w: 20, h: 20 },
    { x: 520, y: 1260, w: 420, h: 20 },
    { x: 0, y: 1280, w: 60, h: 60 },
    { x: 240, y: 1280, w: 740, h: 20 },
    { x: 1480, y: 1280, w: 500, h: 40 },
    { x: 200, y: 1300, w: 840, h: 20 },
    { x: 160, y: 1320, w: 920, h: 20 },
    { x: 1500, y: 1320, w: 480, h: 60 },
    { x: 2340, y: 1320, w: 40, h: 40 },
    { x: 0, y: 1340, w: 1140, h: 60 },
    { x: 1260, y: 1340, w: 60, h: 40 },
    { x: 2140, y: 1340, w: 20, h: 20 },
    { x: 2160, y: 1360, w: 80, h: 20 },
    { x: 2360, y: 1360, w: 20, h: 40 },
    { x: 2640, y: 1360, w: 360, h: 20 },
    { x: 1260, y: 1380, w: 820, h: 20 },
    { x: 2160, y: 1380, w: 100, h: 40 },
    { x: 2700, y: 1380, w: 300, h: 20 },
    { x: 0, y: 1400, w: 1160, h: 60 },
    { x: 1280, y: 1400, w: 800, h: 40 },
    { x: 2380, y: 1400, w: 20, h: 40 },
    { x: 2720, y: 1400, w: 280, h: 40 },
    { x: 2220, y: 1420, w: 60, h: 60 },
    { x: 2540, y: 1420, w: 20, h: 20 },
    { x: 1320, y: 1440, w: 780, h: 20 },
    { x: 2740, y: 1440, w: 260, h: 20 },
    { x: 0, y: 1460, w: 1180, h: 20 },
    { x: 1340, y: 1460, w: 780, h: 40 },
    { x: 2520, y: 1460, w: 20, h: 60 },
    { x: 2760, y: 1460, w: 240, h: 40 },
    { x: 0, y: 1480, w: 600, h: 20 },
    { x: 660, y: 1480, w: 520, h: 20 },
    { x: 2200, y: 1480, w: 100, h: 40 },
    { x: 0, y: 1500, w: 560, h: 60 },
    { x: 720, y: 1500, w: 480, h: 20 },
    { x: 1360, y: 1500, w: 760, h: 20 },
    { x: 2740, y: 1500, w: 260, h: 20 },
    { x: 720, y: 1520, w: 500, h: 20 },
    { x: 1360, y: 1520, w: 780, h: 20 },
    { x: 2240, y: 1520, w: 80, h: 40 },
    { x: 2500, y: 1520, w: 40, h: 40 },
    { x: 2760, y: 1520, w: 240, h: 20 },
    { x: 720, y: 1540, w: 520, h: 20 },
    { x: 1380, y: 1540, w: 760, h: 20 },
    { x: 2840, y: 1540, w: 60, h: 20 },
    { x: 2980, y: 1540, w: 20, h: 360 },
    { x: 0, y: 1560, w: 540, h: 40 },
    { x: 720, y: 1560, w: 540, h: 20 },
    { x: 1400, y: 1560, w: 760, h: 40 },
    { x: 2240, y: 1560, w: 100, h: 40 },
    { x: 2460, y: 1560, w: 40, h: 20 },
    { x: 700, y: 1580, w: 560, h: 20 },
    { x: 0, y: 1600, w: 500, h: 20 },
    { x: 700, y: 1600, w: 580, h: 20 },
    { x: 1400, y: 1600, w: 780, h: 40 },
    { x: 2260, y: 1600, w: 100, h: 20 },
    { x: 0, y: 1620, w: 480, h: 20 },
    { x: 740, y: 1620, w: 540, h: 40 },
    { x: 2260, y: 1620, w: 120, h: 40 },
    { x: 0, y: 1640, w: 440, h: 60 },
    { x: 1420, y: 1640, w: 760, h: 40 },
    { x: 760, y: 1660, w: 540, h: 20 },
    { x: 2280, y: 1660, w: 80, h: 20 },
    { x: 780, y: 1680, w: 520, h: 20 },
    { x: 1440, y: 1680, w: 760, h: 20 },
    { x: 2300, y: 1680, w: 60, h: 20 },
    { x: 0, y: 1700, w: 460, h: 40 },
    { x: 800, y: 1700, w: 520, h: 40 },
    { x: 1480, y: 1700, w: 740, h: 20 },
    { x: 2320, y: 1700, w: 40, h: 60 },
    { x: 2540, y: 1700, w: 20, h: 20 },
    { x: 1520, y: 1720, w: 720, h: 20 },
    { x: 2520, y: 1720, w: 140, h: 20 },
    { x: 0, y: 1740, w: 480, h: 40 },
    { x: 820, y: 1740, w: 520, h: 20 },
    { x: 1520, y: 1740, w: 740, h: 20 },
    { x: 2420, y: 1740, w: 140, h: 20 },
    { x: 2640, y: 1740, w: 20, h: 40 },
    { x: 820, y: 1760, w: 540, h: 20 },
    { x: 1540, y: 1760, w: 720, h: 20 },
    { x: 2320, y: 1760, w: 220, h: 20 },
    { x: 0, y: 1780, w: 520, h: 20 },
    { x: 840, y: 1780, w: 40, h: 20 },
    { x: 940, y: 1780, w: 420, h: 20 },
    { x: 1540, y: 1780, w: 1000, h: 20 },
    { x: 0, y: 1800, w: 540, h: 20 },
    { x: 860, y: 1800, w: 20, h: 20 },
    { x: 940, y: 1800, w: 480, h: 20 },
    { x: 1560, y: 1800, w: 980, h: 20 },
    { x: 0, y: 1820, w: 560, h: 20 },
    { x: 940, y: 1820, w: 500, h: 20 },
    { x: 1560, y: 1820, w: 1000, h: 20 },
    { x: 0, y: 1840, w: 580, h: 40 },
    { x: 980, y: 1840, w: 480, h: 40 },
    { x: 1580, y: 1840, w: 1000, h: 20 },
    { x: 2840, y: 1840, w: 80, h: 20 },
    { x: 1600, y: 1860, w: 1000, h: 20 },
    { x: 2860, y: 1860, w: 60, h: 20 },
    { x: 0, y: 1880, w: 600, h: 20 },
    { x: 1000, y: 1880, w: 480, h: 20 },
    { x: 1600, y: 1880, w: 1040, h: 20 },
    { x: 2880, y: 1880, w: 60, h: 20 },
    { x: 0, y: 1900, w: 640, h: 20 },
    { x: 1000, y: 1900, w: 460, h: 20 },
    { x: 1600, y: 1900, w: 1120, h: 20 },
    { x: 2880, y: 1900, w: 120, h: 60 },
    { x: 0, y: 1920, w: 660, h: 40 },
    { x: 1060, y: 1920, w: 400, h: 20 },
    { x: 1600, y: 1920, w: 1160, h: 20 },
    { x: 1200, y: 1940, w: 260, h: 20 },
    { x: 1600, y: 1940, w: 1220, h: 20 },
    { x: 0, y: 1960, w: 680, h: 40 },
    { x: 1200, y: 1960, w: 300, h: 20 },
    { x: 1620, y: 1960, w: 1380, h: 60 },
    { x: 1220, y: 1980, w: 280, h: 20 },
    { x: 0, y: 2000, w: 660, h: 60 },
    { x: 1240, y: 2000, w: 260, h: 20 },
    { x: 1300, y: 2020, w: 200, h: 20 },
    { x: 1640, y: 2020, w: 1360, h: 20 },
    { x: 1320, y: 2040, w: 180, h: 20 },
    { x: 1660, y: 2040, w: 1340, h: 40 },
    { x: 0, y: 2060, w: 640, h: 80 },
    { x: 1340, y: 2060, w: 180, h: 20 },
    { x: 1360, y: 2080, w: 180, h: 40 },
    { x: 1680, y: 2080, w: 1320, h: 20 },
    { x: 1700, y: 2100, w: 1300, h: 40 },
    { x: 1400, y: 2120, w: 160, h: 20 },
    { x: 0, y: 2140, w: 680, h: 20 },
    { x: 1400, y: 2140, w: 180, h: 20 },
    { x: 1780, y: 2140, w: 1220, h: 40 },
    { x: 0, y: 2160, w: 740, h: 40 },
    { x: 1400, y: 2160, w: 200, h: 40 },
    { x: 1800, y: 2180, w: 1200, h: 20 },
    { x: 0, y: 2200, w: 800, h: 40 },
    { x: 1360, y: 2200, w: 260, h: 20 },
    { x: 1860, y: 2200, w: 1140, h: 20 },
    { x: 1320, y: 2220, w: 320, h: 20 },
    { x: 1880, y: 2220, w: 1120, h: 20 },
    { x: 0, y: 2240, w: 820, h: 60 },
    { x: 1240, y: 2240, w: 440, h: 20 },
    { x: 1920, y: 2240, w: 1080, h: 20 },
    { x: 1220, y: 2260, w: 480, h: 20 },
    { x: 1960, y: 2260, w: 1040, h: 20 },
    { x: 1220, y: 2280, w: 500, h: 20 },
    { x: 1980, y: 2280, w: 1020, h: 40 },
    { x: 0, y: 2300, w: 860, h: 100 },
    { x: 1180, y: 2300, w: 600, h: 20 },
    { x: 1160, y: 2320, w: 620, h: 20 },
    { x: 1840, y: 2320, w: 20, h: 20 },
    { x: 2020, y: 2320, w: 980, h: 20 },
    { x: 1160, y: 2340, w: 720, h: 20 },
    { x: 2040, y: 2340, w: 960, h: 20 },
    { x: 1180, y: 2360, w: 700, h: 20 },
    { x: 2080, y: 2360, w: 920, h: 20 },
    { x: 1180, y: 2380, w: 720, h: 20 },
    { x: 2100, y: 2380, w: 20, h: 20 },
    { x: 2180, y: 2380, w: 820, h: 40 },
    { x: 0, y: 2400, w: 880, h: 20 },
    { x: 1180, y: 2400, w: 740, h: 20 },
    { x: 0, y: 2420, w: 860, h: 20 },
    { x: 1140, y: 2420, w: 800, h: 20 },
    { x: 2300, y: 2420, w: 700, h: 20 },
    { x: 0, y: 2440, w: 840, h: 20 },
    { x: 1140, y: 2440, w: 840, h: 20 },
    { x: 2360, y: 2440, w: 640, h: 40 },
    { x: 0, y: 2460, w: 820, h: 40 },
    { x: 1080, y: 2460, w: 940, h: 20 },
    { x: 1020, y: 2480, w: 1000, h: 20 },
    { x: 2420, y: 2480, w: 580, h: 80 },
    { x: 0, y: 2500, w: 800, h: 20 },
    { x: 1000, y: 2500, w: 1100, h: 20 },
    { x: 0, y: 2520, w: 780, h: 20 },
    { x: 1000, y: 2520, w: 1160, h: 20 },
    { x: 0, y: 2540, w: 520, h: 100 },
    { x: 580, y: 2540, w: 200, h: 20 },
    { x: 980, y: 2540, w: 1200, h: 20 },
    { x: 620, y: 2560, w: 100, h: 20 },
    { x: 960, y: 2560, w: 1300, h: 20 },
    { x: 2440, y: 2560, w: 100, h: 20 },
    { x: 2620, y: 2560, w: 380, h: 80 },
    { x: 940, y: 2580, w: 1320, h: 20 },
    { x: 2440, y: 2580, w: 80, h: 20 },
    { x: 920, y: 2600, w: 1340, h: 40 },
    { x: 2460, y: 2600, w: 60, h: 40 },
    { x: 0, y: 2640, w: 540, h: 20 },
    { x: 880, y: 2640, w: 1380, h: 40 },
    { x: 2600, y: 2640, w: 400, h: 100 },
    { x: 0, y: 2660, w: 560, h: 40 },
    { x: 860, y: 2680, w: 1440, h: 20 },
    { x: 0, y: 2700, w: 600, h: 40 },
    { x: 800, y: 2700, w: 1500, h: 20 },
    { x: 760, y: 2720, w: 1540, h: 40 },
    { x: 0, y: 2740, w: 700, h: 20 },
    { x: 2620, y: 2740, w: 380, h: 100 },
    { x: 0, y: 2760, w: 2320, h: 20 },
    { x: 0, y: 2780, w: 2360, h: 20 },
    { x: 0, y: 2800, w: 2400, h: 20 },
    { x: 0, y: 2820, w: 2440, h: 20 },
    { x: 0, y: 2840, w: 3000, h: 160 },

    // ---- EDGE PINS ----
    // Sub-cell rects one collider radius (18px) clear of each band limit, so
    // the collider CENTRE is penned into exactly the declared band and the
    // player can never press against an edge outside one and hit a silent
    // invisible wall. Left: blockers end at 1152 / resume at 1273, penning the
    // centre to y1170-1255. Top: end at 980 / resume at 1100, penning it to
    // x998-1082. Re-derive if a band moves. (Pattern introduced on C2.)
    { x: 0, y: 1040, w: 60, h: 112 },
    { x: 0, y: 1273, w: 60, h: 120 },
    { x: 940, y: 0, w: 40, h: 120 },
    { x: 1100, y: 0, w: 60, h: 120 },
  ],

  // Landmark proximity labels, doorless so they use their own radius `r`.
  // The cave's label rides on its interactable instead (the project's
  // one-label rule — see D4's "Old Cave"), not on a standalone entry here.
  buildings: [
    { label: 'Temple of Aeluna', x: 2700, y: 900, r: 700 },
    { label: 'Hallowmere Lotus Pool', x: 640, y: 2180, r: 430 },
  ],

  // ---- The cave link to D4B (2026-09-15, Danny's exact coordinates) ----
  // Interacting here drops the player into the D4B Woods Cave at its TOP-LEFT
  // entrance streak (146,63) — the second mouth d4b.js's header always said
  // would "be wired up later". D4B has a matching interactable at that end
  // that returns them to this exact spot. Both points were probed against the
  // real collider before wiring: (2561,2750) has 40px of clearance on the
  // trail just west of the cave arch, and D4B's (146,63) is already open floor.
  //
  // `enterAt` is a NEW field (see main.js's enterCave): without it every cave
  // drops the player at its own `spawn`, which for D4B is the far bottom-right
  // mouth by D4. Reuse it for any future second entrance to an existing cave.
  interactables: [
    {
      id: 'cave_c3_entrance',
      x: 2561, y: 2750,
      range: 173,
      cave: 'D4B',
      enterAt: { x: 146, y: 63 },
      label: 'Hollow Cave',
    },
    // The temple's door (2026-09-24): sits just outside the west edge of the
    // dome/stairwell's stamped-solid collision disc (2960,1240 r300 — see the
    // collision header comment), on a walkable pocket of plaza flagstone
    // confirmed reachable from the Lakewarden's island landing (2030,1300) by
    // a headless BFS over this scene's real obstacles. Only reachable at all
    // once the Lakewarden has ferried the player across (region B, per the
    // THREE WALKABLE REGIONS note above).
    {
      id: 'temple_of_aeluna_entrance',
      x: 2635, y: 1245,
      range: 150,
      cave: 'C3B',
      label: 'Temple of Aeluna',
    },
  ],

  // ---- Static scenery (2026-09-20) ----
  // The Lakewarden's raft, moored off the outer (east) face of the mainland
  // jetty with its long axis pointing across the water at the island. Purely
  // decorative — `props` carry no collision and no interaction (see the props
  // loop in world.js); the open lake is already blocked terrain, and the
  // Lakewarden himself stands on it as a normal NPC drawn on top.
  // Raft art is 136x100, so this centre puts its west edge ~15px off the
  // jetty's mooring posts (deck runs x1355-1462, y1255-1350).
  props: [
    { sprite: 'assets/images/lakewarden_raft.png', x: 1545, y: 1302 },
  ],

  // ---- The Lakewarden (2026-09-20; ferry added same date; dialogue
  // reworked 2026-09-24) ----
  // The ferryman the row-C brief always owed this scene. Stationary on his
  // raft (no routine, no patrol, no home — world.js leaves a speed-0 NPC with
  // no routine exactly where scene data puts him), standing at the shore end
  // of the raft so a player on the jetty is ~58px away, well inside
  // INTERACT_RANGE (141). He is in the water, which is blocked terrain, so
  // his body collider can never pinch the walkable deck.
  //
  // He no longer names the silver lotus as his fare (that item and its quest
  // are deferred until the lotus pool's glade — region C, see the THREE
  // WALKABLE REGIONS note above — has a trail into it). Instead he gives his
  // usual explanation of the temple's fall: evil overran it, the river was
  // torn out of its bed to moat the island, and he is charged with making
  // sure nothing in those halls ever reaches the mainland — hence "Lakewarden":
  // warden over what the lake holds back, not of the lake itself. He gives a
  // dire warning, then actually ferries the player across for a flat 50-gold
  // fee (LAKEWARDEN_FARE in main.js). All of this — the state-built dialog,
  // the ferry cutscene, the fee gate — lives in main.js
  // (buildLakewardenDialog / startFerry / the `lakewardenPayFerry` effect);
  // nothing inline here, deliberately, same reasoning as Calder Rusk.
  npcs: [
    {
      id: 'lakewarden', name: 'The Lakewarden', role: '',
      sprite: 'assets/images/the_lakewarden_overhead.png',
      portrait: 'assets/images/the_lakewarden.png',
      x: 1528, y: 1300, speed: 0, startsHome: false,
      // His dialogue is STATE-BUILT in main.js (buildLakewardenDialog) because
      // it depends on which shore the raft is at: the offer to cross on the
      // mainland side, the offer to come back on the island side. Same pattern
      // as Calder Rusk, whose inline dialog moved out of d1.js for the same
      // reason. Nothing inline here, deliberately — two copies of a character's
      // lines is how they drift apart.
    },
  ],
  chests: [],
  battles: [],
  ambushes: [],

  exits: [
    { edge: 'left', yMin: 1170, yMax: 1255, to: 'C2', note: 'the forest trail west to the grassland' },
    { edge: 'top', xMin: 998, xMax: 1082, to: 'B3', note: 'the trail north out of the woods' },
  ],
};
