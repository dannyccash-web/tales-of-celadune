// Scene C2 — WINDMARCH GRASSLAND (overworld row C, column 2 — EAST of C1
// Tidewrack Harbor, NORTH of D2 Millmere)
// World coordinates: 3000x3000. Origin top-left.
//
// The open grassland the row-C design brief calls for (see CLAUDE.md's "Row C
// design notes — C1/C2/C3"): a road running west-to-east across the middle of
// the map with a branch descending south to the village, a ruined watchtower on
// the high ground north of the road, a nomadic herder camp south of it, and a
// caravan pull-off on the road's eastern stretch. The terrain transitions LEFT
// to RIGHT from C1's sandy coastal soil and palms, through dry tan grassland,
// into the deciduous forest floor of the east — dense forest seals the top
// edge, a mixed palm/deciduous corner fills the bottom-left and a deciduous
// pocket the bottom-right.
//
// TERRAIN ONLY for now (2026-09-14, Danny: "All I have is the background image
// for now. We'll add NPCs, enemies, quests, etc. later."). No npcs, enemies,
// battles, ambushes, interactables or chests — the brief's intended content
// (the skirmish evidence at the tower, bandits squatting in the ruins, the
// herders' lost-livestock/wolf quest, the wandering tinker-enchanter caravan,
// the wolf-pack / Thornback Boar encounters) is all still to come. The three
// landmark labels below are the only content, so the map doesn't read as
// completely empty while it's being filled in.
//
// EXITS. Bands were measured against the art's ACTUAL open ground at each edge
// and matched to the neighbours' existing bands, so a round trip preserves the
// player's position (switchScene keeps y across a left/right crossing and x
// across a top/bottom one):
//   left   -> C1  y1170-1255 — EXACTLY mirrors c1.js's `right` exit band.
//                 (Both were NARROWED from 1130-1290 when this scene went in:
//                 an engine probe showed C1's own open ground at that edge is
//                 only y1168-1257, so the wider band dropped arrivals inside
//                 a C1 obstacle. Widen BOTH together, never one alone.)
//   bottom -> D2  x1286-1403 — EXACTLY mirrors d2.js's `top` exit band.
//                 (Likewise tightened: x1281-1283 of D2's declared band sat
//                 inside D2's own top border rect.)
//   right  -> C3  y1170-1255 — STUBBED (C3 Hallowmere Forest isn't built, so
//                 the frame loop shows the "isn't ready yet" toast). The road
//                 really does reach the right edge here (natural opening
//                 y1080-1420); the band was set to the SAME height as the west
//                 one so the Windmarch road runs at a constant height across
//                 row C. **Give C3's future `left` exit this band verbatim.**
//   top    -> none. Dense forest seals the whole top edge. B2 King's Castle
//                 sits north on the overworld grid; when that gets built this
//                 art needs a road punched through the treeline first.
//
// COLLISION — auto-classified from the art. NO hand-painted walkable guide was
// supplied for this scene (same situation as C1's round-1 pass and C1C), so
// this is the project's documented fallback pipeline:
//   1. Per-20px-cell mean RGB. Open ground in this art is warm/tan and canopy
//      is green, so one two-part test separates them with no knife-edge to
//      tune: walkable iff (R - G) >= 14 AND max(R,G,B) >= 80. Road, sand, dry
//      grass and camp dirt all pass; tree canopy (G > R), deep shadow (dark)
//      and the gray rock outcrop (R ~= G) all fail.
//   2. De-speckle both ways: blocked islands < 4 cells become walkable (a lone
//      20px bush is smaller than the 36px collider and only makes movement
//      fussy), walkable islands < 4 cells become blocked.
//   3. 1-cell shoulder dilation of the walkable mask (the project convention
//      for auto-classified art — see C1's round-1 notes).
//   4. MANUAL BLOCKED STAMPS for the structures. The color test reads them as
//      ground because they are painted in the same tan family as the dirt —
//      the same failure mode C1 and D4 hit with building roofs. Stamped: the
//      watchtower ruin (circle r240 @ 1795,565) + its SE rubble spill + the
//      banner pole; the herder camp's three tents, wagon, fire ring, stock pen,
//      drying racks and awning; the caravan rail, fire ring and crate.
//      **The tower's courtyard is stamped SOLID** rather than left as a walled
//      pocket — when the bandit content goes in, carve an entrance gap through
//      the ring's south-west collapse instead of un-stamping the whole circle.
//   5. Forced-walkable aprons at the three edge bands.
//   6. COLLIDER-CLEARANCE PASS (the step C1's round-1 build skipped and had to
//      patch later): a full-resolution EDT of the blocked mask gives every
//      point's distance to the nearest obstacle; centres = EDT > 18 (the real
//      collider radius) is connected-component labelled from `spawn`, and any
//      cell not within 18px of that main component is blocked. 127 cells of
//      ground the 36px body could never actually reach were removed this way,
//      which is why there are no orphan pockets left to find on the live site.
//   7. Obstacles = the complement, merged into 431 rects by the standard
//      row-run + row-stack algorithm, plus the 6 EDGE PINS listed at the end
//      of the array (see their comment).
// REGENERATE THE SAME WAY if this art is replaced — or better, ask Danny for a
// C2_Walkable.jpg guide and use the D-row guide pipeline instead. NOTE the C1
// gotcha when doing so: read the guide's OWN red convention first, C1's is
// inverted from every other scene's.
//
// Engine-verified headlessly against the real World collider (36px circle):
// spawn walkable, one single connected region, every arrival position in both
// neighbours' bands walkable, all three exit bands reachable, and no walkable
// ground touching any edge OUTSIDE a declared band.
export default {
  id: 'C2',
  name: 'Windmarch Grassland',
  background: 'assets/images/C2_Background.jpg',
  width: 3000,
  height: 3000,

  // On the road just north of the crossroads where the south branch leaves it
  // (110px of clearance — picked as the best-clearance point within 100px of
  // the junction itself). Only a fallback/save anchor: every real arrival comes
  // in through an edge and switchScene overwrites the position.
  spawn: { x: 1400, y: 1230 },

  // No `music` key -> the generic overworld track (audio.js TRACKS.overworld).
  // No `battleBackground` -> fights would use each enemy's own backdrop. Give
  // this scene both of its own when the grassland gets its encounters.

  obstacles: [
    { x: 0, y: 0, w: 3000, h: 120 },
    { x: 0, y: 120, w: 1680, h: 20 },
    { x: 1740, y: 120, w: 1260, h: 60 },
    { x: 0, y: 140, w: 1660, h: 60 },
    { x: 1740, y: 180, w: 40, h: 20 },
    { x: 1840, y: 180, w: 1160, h: 20 },
    { x: 0, y: 200, w: 180, h: 140 },
    { x: 260, y: 200, w: 1340, h: 20 },
    { x: 1840, y: 200, w: 20, h: 40 },
    { x: 1920, y: 200, w: 1080, h: 20 },
    { x: 280, y: 220, w: 1320, h: 20 },
    { x: 1940, y: 220, w: 1060, h: 40 },
    { x: 300, y: 240, w: 20, h: 20 },
    { x: 420, y: 240, w: 1180, h: 20 },
    { x: 480, y: 260, w: 240, h: 20 },
    { x: 800, y: 260, w: 800, h: 20 },
    { x: 1940, y: 260, w: 40, h: 60 },
    { x: 2060, y: 260, w: 940, h: 20 },
    { x: 560, y: 280, w: 160, h: 20 },
    { x: 880, y: 280, w: 700, h: 40 },
    { x: 1760, y: 280, w: 20, h: 20 },
    { x: 2080, y: 280, w: 920, h: 20 },
    { x: 560, y: 300, w: 80, h: 60 },
    { x: 2100, y: 300, w: 900, h: 20 },
    { x: 880, y: 320, w: 20, h: 20 },
    { x: 980, y: 320, w: 100, h: 40 },
    { x: 1180, y: 320, w: 380, h: 20 },
    { x: 1740, y: 320, w: 100, h: 20 },
    { x: 2140, y: 320, w: 860, h: 20 },
    { x: 0, y: 340, w: 200, h: 20 },
    { x: 1200, y: 340, w: 340, h: 20 },
    { x: 1680, y: 340, w: 220, h: 20 },
    { x: 2160, y: 340, w: 840, h: 20 },
    { x: 0, y: 360, w: 240, h: 40 },
    { x: 1300, y: 360, w: 160, h: 20 },
    { x: 1660, y: 360, w: 280, h: 20 },
    { x: 2160, y: 360, w: 40, h: 20 },
    { x: 2260, y: 360, w: 60, h: 20 },
    { x: 2400, y: 360, w: 600, h: 60 },
    { x: 1320, y: 380, w: 140, h: 20 },
    { x: 1640, y: 380, w: 320, h: 20 },
    { x: 2000, y: 380, w: 60, h: 20 },
    { x: 2260, y: 380, w: 20, h: 20 },
    { x: 0, y: 400, w: 260, h: 20 },
    { x: 860, y: 400, w: 60, h: 20 },
    { x: 1100, y: 400, w: 20, h: 20 },
    { x: 1340, y: 400, w: 120, h: 60 },
    { x: 1620, y: 400, w: 360, h: 20 },
    { x: 2000, y: 400, w: 100, h: 20 },
    { x: 0, y: 420, w: 240, h: 60 },
    { x: 660, y: 420, w: 20, h: 20 },
    { x: 860, y: 420, w: 80, h: 20 },
    { x: 1160, y: 420, w: 20, h: 20 },
    { x: 1600, y: 420, w: 580, h: 20 },
    { x: 2360, y: 420, w: 640, h: 20 },
    { x: 920, y: 440, w: 40, h: 40 },
    { x: 1580, y: 440, w: 600, h: 40 },
    { x: 2380, y: 440, w: 620, h: 20 },
    { x: 2400, y: 460, w: 600, h: 20 },
    { x: 0, y: 480, w: 200, h: 60 },
    { x: 1220, y: 480, w: 20, h: 20 },
    { x: 1560, y: 480, w: 620, h: 80 },
    { x: 2260, y: 480, w: 20, h: 20 },
    { x: 2400, y: 480, w: 40, h: 20 },
    { x: 2500, y: 480, w: 500, h: 60 },
    { x: 1140, y: 500, w: 100, h: 20 },
    { x: 2280, y: 500, w: 20, h: 20 },
    { x: 1120, y: 520, w: 120, h: 20 },
    { x: 0, y: 540, w: 220, h: 80 },
    { x: 1120, y: 540, w: 220, h: 20 },
    { x: 2340, y: 540, w: 40, h: 20 },
    { x: 2560, y: 540, w: 440, h: 20 },
    { x: 1120, y: 560, w: 200, h: 20 },
    { x: 1560, y: 560, w: 520, h: 20 },
    { x: 2100, y: 560, w: 80, h: 20 },
    { x: 2340, y: 560, w: 100, h: 40 },
    { x: 2580, y: 560, w: 420, h: 80 },
    { x: 1140, y: 580, w: 180, h: 20 },
    { x: 1560, y: 580, w: 500, h: 20 },
    { x: 1160, y: 600, w: 160, h: 20 },
    { x: 1560, y: 600, w: 520, h: 40 },
    { x: 2300, y: 600, w: 140, h: 40 },
    { x: 0, y: 620, w: 240, h: 60 },
    { x: 1200, y: 620, w: 180, h: 40 },
    { x: 1540, y: 640, w: 540, h: 20 },
    { x: 2300, y: 640, w: 160, h: 40 },
    { x: 2600, y: 640, w: 400, h: 40 },
    { x: 1240, y: 660, w: 120, h: 20 },
    { x: 1560, y: 660, w: 460, h: 20 },
    { x: 0, y: 680, w: 260, h: 60 },
    { x: 1560, y: 680, w: 440, h: 20 },
    { x: 2320, y: 680, w: 160, h: 40 },
    { x: 2640, y: 680, w: 360, h: 60 },
    { x: 1560, y: 700, w: 520, h: 20 },
    { x: 2120, y: 700, w: 80, h: 20 },
    { x: 1540, y: 720, w: 660, h: 20 },
    { x: 2400, y: 720, w: 100, h: 40 },
    { x: 0, y: 740, w: 280, h: 20 },
    { x: 1580, y: 740, w: 620, h: 20 },
    { x: 2660, y: 740, w: 340, h: 100 },
    { x: 0, y: 760, w: 300, h: 160 },
    { x: 1620, y: 760, w: 580, h: 40 },
    { x: 2460, y: 760, w: 80, h: 20 },
    { x: 2460, y: 780, w: 120, h: 20 },
    { x: 1020, y: 800, w: 120, h: 20 },
    { x: 1200, y: 800, w: 20, h: 20 },
    { x: 1640, y: 800, w: 540, h: 20 },
    { x: 2500, y: 800, w: 80, h: 20 },
    { x: 1020, y: 820, w: 200, h: 20 },
    { x: 1660, y: 820, w: 520, h: 40 },
    { x: 2520, y: 820, w: 60, h: 20 },
    { x: 1040, y: 840, w: 180, h: 20 },
    { x: 2520, y: 840, w: 20, h: 20 },
    { x: 2640, y: 840, w: 120, h: 20 },
    { x: 2820, y: 840, w: 180, h: 60 },
    { x: 1040, y: 860, w: 220, h: 40 },
    { x: 1760, y: 860, w: 440, h: 40 },
    { x: 2640, y: 860, w: 80, h: 20 },
    { x: 1000, y: 900, w: 260, h: 20 },
    { x: 1340, y: 900, w: 40, h: 20 },
    { x: 1840, y: 900, w: 160, h: 20 },
    { x: 2060, y: 900, w: 160, h: 20 },
    { x: 2400, y: 900, w: 220, h: 80 },
    { x: 2800, y: 900, w: 200, h: 40 },
    { x: 0, y: 920, w: 320, h: 20 },
    { x: 1000, y: 920, w: 400, h: 60 },
    { x: 1860, y: 920, w: 20, h: 20 },
    { x: 1940, y: 920, w: 60, h: 20 },
    { x: 2060, y: 920, w: 180, h: 20 },
    { x: 0, y: 940, w: 300, h: 20 },
    { x: 2120, y: 940, w: 140, h: 20 },
    { x: 2820, y: 940, w: 180, h: 100 },
    { x: 0, y: 960, w: 280, h: 20 },
    { x: 2120, y: 960, w: 160, h: 40 },
    { x: 0, y: 980, w: 260, h: 100 },
    { x: 1000, y: 980, w: 240, h: 20 },
    { x: 1360, y: 980, w: 40, h: 20 },
    { x: 2500, y: 980, w: 180, h: 20 },
    { x: 1080, y: 1000, w: 140, h: 20 },
    { x: 2100, y: 1000, w: 140, h: 20 },
    { x: 2480, y: 1000, w: 200, h: 20 },
    { x: 1100, y: 1020, w: 120, h: 20 },
    { x: 2120, y: 1020, w: 120, h: 40 },
    { x: 2440, y: 1020, w: 240, h: 60 },
    { x: 1140, y: 1040, w: 80, h: 40 },
    { x: 1840, y: 1040, w: 60, h: 40 },
    { x: 2840, y: 1040, w: 160, h: 20 },
    { x: 360, y: 1060, w: 20, h: 20 },
    { x: 920, y: 1060, w: 20, h: 20 },
    { x: 2120, y: 1060, w: 20, h: 20 },
    { x: 2880, y: 1060, w: 120, h: 20 },
    { x: 0, y: 1080, w: 60, h: 20 },
    { x: 160, y: 1080, w: 100, h: 40 },
    { x: 700, y: 1080, w: 20, h: 20 },
    { x: 1840, y: 1080, w: 80, h: 20 },
    { x: 2080, y: 1080, w: 20, h: 40 },
    { x: 2440, y: 1080, w: 120, h: 40 },
    { x: 2580, y: 1080, w: 100, h: 20 },
    { x: 2940, y: 1080, w: 60, h: 20 },
    { x: 640, y: 1100, w: 140, h: 40 },
    { x: 1860, y: 1100, w: 60, h: 80 },
    { x: 160, y: 1120, w: 120, h: 40 },
    { x: 480, y: 1120, w: 20, h: 20 },
    { x: 2460, y: 1120, w: 80, h: 20 },
    { x: 2680, y: 1120, w: 40, h: 20 },
    { x: 620, y: 1140, w: 180, h: 40 },
    { x: 2000, y: 1140, w: 20, h: 20 },
    { x: 2160, y: 1140, w: 20, h: 20 },
    { x: 2700, y: 1140, w: 40, h: 20 },
    { x: 160, y: 1160, w: 140, h: 60 },
    { x: 900, y: 1160, w: 20, h: 20 },
    { x: 2000, y: 1160, w: 40, h: 20 },
    { x: 2140, y: 1160, w: 40, h: 20 },
    { x: 2700, y: 1160, w: 60, h: 40 },
    { x: 500, y: 1180, w: 40, h: 60 },
    { x: 660, y: 1180, w: 160, h: 20 },
    { x: 1880, y: 1180, w: 160, h: 20 },
    { x: 2140, y: 1180, w: 60, h: 20 },
    { x: 660, y: 1200, w: 140, h: 20 },
    { x: 1980, y: 1200, w: 20, h: 40 },
    { x: 2160, y: 1200, w: 40, h: 20 },
    { x: 2680, y: 1200, w: 80, h: 20 },
    { x: 240, y: 1220, w: 80, h: 20 },
    { x: 660, y: 1220, w: 120, h: 20 },
    { x: 0, y: 1320, w: 60, h: 20 },
    { x: 2940, y: 1320, w: 60, h: 40 },
    { x: 0, y: 1340, w: 160, h: 20 },
    { x: 1360, y: 1340, w: 40, h: 20 },
    { x: 0, y: 1360, w: 200, h: 20 },
    { x: 1280, y: 1360, w: 120, h: 20 },
    { x: 2960, y: 1360, w: 40, h: 20 },
    { x: 0, y: 1380, w: 240, h: 20 },
    { x: 1280, y: 1380, w: 160, h: 20 },
    { x: 2920, y: 1380, w: 80, h: 20 },
    { x: 0, y: 1400, w: 280, h: 40 },
    { x: 1140, y: 1400, w: 20, h: 20 },
    { x: 1260, y: 1400, w: 220, h: 40 },
    { x: 2860, y: 1400, w: 140, h: 40 },
    { x: 0, y: 1440, w: 300, h: 160 },
    { x: 1280, y: 1440, w: 200, h: 20 },
    { x: 2280, y: 1440, w: 140, h: 20 },
    { x: 2480, y: 1440, w: 40, h: 20 },
    { x: 2780, y: 1440, w: 220, h: 20 },
    { x: 900, y: 1460, w: 340, h: 80 },
    { x: 1280, y: 1460, w: 20, h: 20 },
    { x: 1360, y: 1460, w: 140, h: 20 },
    { x: 2080, y: 1460, w: 80, h: 20 },
    { x: 2280, y: 1460, w: 260, h: 20 },
    { x: 2640, y: 1460, w: 360, h: 20 },
    { x: 1360, y: 1480, w: 120, h: 20 },
    { x: 2040, y: 1480, w: 120, h: 20 },
    { x: 2280, y: 1480, w: 720, h: 40 },
    { x: 1360, y: 1500, w: 100, h: 20 },
    { x: 2020, y: 1500, w: 140, h: 20 },
    { x: 580, y: 1520, w: 40, h: 20 },
    { x: 760, y: 1520, w: 120, h: 20 },
    { x: 2020, y: 1520, w: 100, h: 20 },
    { x: 2220, y: 1520, w: 780, h: 100 },
    { x: 540, y: 1540, w: 100, h: 20 },
    { x: 740, y: 1540, w: 500, h: 20 },
    { x: 1520, y: 1540, w: 20, h: 20 },
    { x: 2040, y: 1540, w: 60, h: 20 },
    { x: 560, y: 1560, w: 80, h: 20 },
    { x: 740, y: 1560, w: 180, h: 20 },
    { x: 1140, y: 1560, w: 80, h: 20 },
    { x: 1520, y: 1560, w: 40, h: 20 },
    { x: 2060, y: 1560, w: 40, h: 20 },
    { x: 560, y: 1580, w: 60, h: 20 },
    { x: 720, y: 1580, w: 200, h: 20 },
    { x: 1120, y: 1580, w: 260, h: 220 },
    { x: 1540, y: 1580, w: 20, h: 60 },
    { x: 0, y: 1600, w: 320, h: 80 },
    { x: 720, y: 1600, w: 220, h: 40 },
    { x: 1800, y: 1600, w: 20, h: 20 },
    { x: 1920, y: 1600, w: 60, h: 20 },
    { x: 1780, y: 1620, w: 200, h: 20 },
    { x: 2180, y: 1620, w: 820, h: 20 },
    { x: 720, y: 1640, w: 200, h: 40 },
    { x: 1540, y: 1640, w: 40, h: 60 },
    { x: 1800, y: 1640, w: 240, h: 20 },
    { x: 2240, y: 1640, w: 760, h: 40 },
    { x: 1820, y: 1660, w: 240, h: 20 },
    { x: 0, y: 1680, w: 340, h: 20 },
    { x: 740, y: 1680, w: 160, h: 20 },
    { x: 1840, y: 1680, w: 200, h: 40 },
    { x: 2260, y: 1680, w: 20, h: 20 },
    { x: 2340, y: 1680, w: 660, h: 60 },
    { x: 0, y: 1700, w: 320, h: 60 },
    { x: 760, y: 1700, w: 120, h: 20 },
    { x: 1840, y: 1720, w: 120, h: 20 },
    { x: 540, y: 1740, w: 20, h: 20 },
    { x: 940, y: 1740, w: 60, h: 20 },
    { x: 1860, y: 1740, w: 100, h: 20 },
    { x: 2100, y: 1740, w: 40, h: 20 },
    { x: 2360, y: 1740, w: 640, h: 20 },
    { x: 0, y: 1760, w: 300, h: 20 },
    { x: 920, y: 1760, w: 100, h: 20 },
    { x: 1900, y: 1760, w: 60, h: 20 },
    { x: 2080, y: 1760, w: 60, h: 20 },
    { x: 2380, y: 1760, w: 620, h: 60 },
    { x: 0, y: 1780, w: 280, h: 120 },
    { x: 920, y: 1780, w: 120, h: 20 },
    { x: 1940, y: 1780, w: 40, h: 20 },
    { x: 2100, y: 1780, w: 40, h: 20 },
    { x: 2240, y: 1780, w: 20, h: 20 },
    { x: 900, y: 1800, w: 140, h: 20 },
    { x: 1200, y: 1800, w: 60, h: 20 },
    { x: 1440, y: 1800, w: 80, h: 20 },
    { x: 1960, y: 1800, w: 20, h: 40 },
    { x: 2240, y: 1800, w: 40, h: 60 },
    { x: 920, y: 1820, w: 120, h: 20 },
    { x: 1180, y: 1820, w: 100, h: 20 },
    { x: 1420, y: 1820, w: 100, h: 20 },
    { x: 2360, y: 1820, w: 640, h: 20 },
    { x: 680, y: 1840, w: 80, h: 20 },
    { x: 920, y: 1840, w: 100, h: 20 },
    { x: 1140, y: 1840, w: 180, h: 20 },
    { x: 1460, y: 1840, w: 40, h: 20 },
    { x: 2340, y: 1840, w: 660, h: 20 },
    { x: 660, y: 1860, w: 120, h: 20 },
    { x: 940, y: 1860, w: 60, h: 20 },
    { x: 1120, y: 1860, w: 220, h: 20 },
    { x: 2060, y: 1860, w: 20, h: 20 },
    { x: 2220, y: 1860, w: 780, h: 60 },
    { x: 640, y: 1880, w: 160, h: 40 },
    { x: 1120, y: 1880, w: 240, h: 20 },
    { x: 0, y: 1900, w: 300, h: 40 },
    { x: 1100, y: 1900, w: 260, h: 20 },
    { x: 1800, y: 1900, w: 20, h: 20 },
    { x: 620, y: 1920, w: 200, h: 40 },
    { x: 1100, y: 1920, w: 280, h: 100 },
    { x: 1800, y: 1920, w: 80, h: 20 },
    { x: 1940, y: 1920, w: 20, h: 20 },
    { x: 2180, y: 1920, w: 820, h: 20 },
    { x: 0, y: 1940, w: 320, h: 60 },
    { x: 880, y: 1940, w: 100, h: 20 },
    { x: 1800, y: 1940, w: 160, h: 20 },
    { x: 2160, y: 1940, w: 840, h: 80 },
    { x: 640, y: 1960, w: 160, h: 40 },
    { x: 860, y: 1960, w: 140, h: 20 },
    { x: 1740, y: 1960, w: 220, h: 20 },
    { x: 840, y: 1980, w: 180, h: 40 },
    { x: 1740, y: 1980, w: 240, h: 20 },
    { x: 2080, y: 1980, w: 20, h: 40 },
    { x: 0, y: 2000, w: 300, h: 80 },
    { x: 440, y: 2000, w: 20, h: 20 },
    { x: 660, y: 2000, w: 120, h: 20 },
    { x: 1740, y: 2000, w: 260, h: 20 },
    { x: 820, y: 2020, w: 220, h: 40 },
    { x: 1100, y: 2020, w: 260, h: 20 },
    { x: 1780, y: 2020, w: 220, h: 40 },
    { x: 2140, y: 2020, w: 860, h: 20 },
    { x: 1120, y: 2040, w: 240, h: 20 },
    { x: 1380, y: 2040, w: 20, h: 40 },
    { x: 1640, y: 2040, w: 20, h: 20 },
    { x: 2180, y: 2040, w: 820, h: 20 },
    { x: 840, y: 2060, w: 180, h: 40 },
    { x: 1140, y: 2060, w: 200, h: 20 },
    { x: 1620, y: 2060, w: 60, h: 20 },
    { x: 1800, y: 2060, w: 220, h: 20 },
    { x: 2200, y: 2060, w: 20, h: 20 },
    { x: 2300, y: 2060, w: 700, h: 60 },
    { x: 0, y: 2080, w: 320, h: 40 },
    { x: 700, y: 2080, w: 40, h: 20 },
    { x: 1160, y: 2080, w: 140, h: 20 },
    { x: 1600, y: 2080, w: 100, h: 20 },
    { x: 1860, y: 2080, w: 180, h: 20 },
    { x: 520, y: 2100, w: 20, h: 20 },
    { x: 700, y: 2100, w: 60, h: 40 },
    { x: 860, y: 2100, w: 140, h: 20 },
    { x: 1640, y: 2100, w: 80, h: 40 },
    { x: 1860, y: 2100, w: 200, h: 20 },
    { x: 0, y: 2120, w: 340, h: 80 },
    { x: 500, y: 2120, w: 40, h: 20 },
    { x: 900, y: 2120, w: 60, h: 20 },
    { x: 1880, y: 2120, w: 200, h: 20 },
    { x: 2260, y: 2120, w: 740, h: 20 },
    { x: 500, y: 2140, w: 60, h: 20 },
    { x: 1320, y: 2140, w: 20, h: 20 },
    { x: 1640, y: 2140, w: 140, h: 20 },
    { x: 1900, y: 2140, w: 180, h: 20 },
    { x: 2240, y: 2140, w: 760, h: 20 },
    { x: 520, y: 2160, w: 40, h: 20 },
    { x: 1240, y: 2160, w: 120, h: 20 },
    { x: 1620, y: 2160, w: 160, h: 20 },
    { x: 1940, y: 2160, w: 140, h: 20 },
    { x: 2260, y: 2160, w: 740, h: 120 },
    { x: 1220, y: 2180, w: 180, h: 60 },
    { x: 1620, y: 2180, w: 220, h: 20 },
    { x: 1960, y: 2180, w: 120, h: 20 },
    { x: 0, y: 2200, w: 320, h: 320 },
    { x: 1660, y: 2200, w: 160, h: 60 },
    { x: 2020, y: 2200, w: 100, h: 20 },
    { x: 900, y: 2220, w: 20, h: 40 },
    { x: 2060, y: 2220, w: 100, h: 40 },
    { x: 1220, y: 2240, w: 200, h: 40 },
    { x: 1660, y: 2260, w: 180, h: 20 },
    { x: 2080, y: 2260, w: 120, h: 20 },
    { x: 1240, y: 2280, w: 180, h: 20 },
    { x: 1660, y: 2280, w: 200, h: 20 },
    { x: 2300, y: 2280, w: 700, h: 40 },
    { x: 1260, y: 2300, w: 140, h: 20 },
    { x: 1660, y: 2300, w: 320, h: 20 },
    { x: 2220, y: 2300, w: 20, h: 20 },
    { x: 1320, y: 2320, w: 40, h: 20 },
    { x: 1640, y: 2320, w: 340, h: 20 },
    { x: 2320, y: 2320, w: 680, h: 80 },
    { x: 900, y: 2340, w: 20, h: 20 },
    { x: 1640, y: 2340, w: 360, h: 20 },
    { x: 920, y: 2360, w: 20, h: 20 },
    { x: 1640, y: 2360, w: 420, h: 40 },
    { x: 1620, y: 2400, w: 400, h: 20 },
    { x: 2300, y: 2400, w: 700, h: 20 },
    { x: 820, y: 2420, w: 20, h: 60 },
    { x: 1220, y: 2420, w: 20, h: 20 },
    { x: 1560, y: 2420, w: 440, h: 20 },
    { x: 2260, y: 2420, w: 740, h: 40 },
    { x: 1200, y: 2440, w: 60, h: 20 },
    { x: 1540, y: 2440, w: 300, h: 20 },
    { x: 1180, y: 2460, w: 100, h: 40 },
    { x: 1560, y: 2460, w: 280, h: 40 },
    { x: 2240, y: 2460, w: 760, h: 60 },
    { x: 2000, y: 2480, w: 60, h: 20 },
    { x: 1180, y: 2500, w: 160, h: 20 },
    { x: 1580, y: 2500, w: 260, h: 40 },
    { x: 2000, y: 2500, w: 80, h: 20 },
    { x: 0, y: 2520, w: 360, h: 200 },
    { x: 1200, y: 2520, w: 160, h: 20 },
    { x: 2000, y: 2520, w: 1000, h: 20 },
    { x: 1220, y: 2540, w: 140, h: 40 },
    { x: 1580, y: 2540, w: 280, h: 20 },
    { x: 1960, y: 2540, w: 1040, h: 20 },
    { x: 1540, y: 2560, w: 1460, h: 20 },
    { x: 1060, y: 2580, w: 60, h: 20 },
    { x: 1240, y: 2580, w: 120, h: 20 },
    { x: 1500, y: 2580, w: 1500, h: 180 },
    { x: 1080, y: 2600, w: 80, h: 40 },
    { x: 1280, y: 2600, w: 80, h: 20 },
    { x: 620, y: 2640, w: 40, h: 20 },
    { x: 720, y: 2640, w: 20, h: 20 },
    { x: 1080, y: 2640, w: 100, h: 20 },
    { x: 620, y: 2660, w: 120, h: 20 },
    { x: 1120, y: 2660, w: 80, h: 20 },
    { x: 700, y: 2680, w: 40, h: 20 },
    { x: 960, y: 2680, w: 20, h: 20 },
    { x: 1160, y: 2680, w: 40, h: 40 },
    { x: 720, y: 2700, w: 20, h: 20 },
    { x: 800, y: 2700, w: 60, h: 20 },
    { x: 940, y: 2700, w: 40, h: 20 },
    { x: 0, y: 2720, w: 340, h: 60 },
    { x: 760, y: 2720, w: 240, h: 20 },
    { x: 1160, y: 2720, w: 60, h: 20 },
    { x: 760, y: 2740, w: 460, h: 60 },
    { x: 600, y: 2760, w: 60, h: 20 },
    { x: 1460, y: 2760, w: 1540, h: 20 },
    { x: 0, y: 2780, w: 360, h: 20 },
    { x: 600, y: 2780, w: 100, h: 20 },
    { x: 1420, y: 2780, w: 1580, h: 20 },
    { x: 0, y: 2800, w: 380, h: 20 },
    { x: 560, y: 2800, w: 140, h: 20 },
    { x: 760, y: 2800, w: 480, h: 20 },
    { x: 1440, y: 2800, w: 1560, h: 40 },
    { x: 0, y: 2820, w: 360, h: 60 },
    { x: 540, y: 2820, w: 740, h: 20 },
    { x: 520, y: 2840, w: 700, h: 40 },
    { x: 1460, y: 2840, w: 1540, h: 100 },
    { x: 0, y: 2880, w: 380, h: 80 },
    { x: 500, y: 2880, w: 720, h: 60 },
    { x: 500, y: 2940, w: 760, h: 20 },
    { x: 1440, y: 2940, w: 1560, h: 60 },
    { x: 0, y: 2960, w: 1260, h: 40 },

    // ---- EDGE PINS (2026-09-14) ----
    // Sub-cell rects that pen the collider CENTRE into exactly the neighbour's
    // exit band at each edge. Without them the art's natural opening is wider
    // than the band (the road meets the left edge across y1140-1300 but the
    // shared band is y1170-1255), so the player could stand against the edge just
    // outside the band and hit a silent invisible wall — no transition, no
    // toast. Each pin sits exactly one collider radius (18px) clear of the band
    // limit: blockers end at 1152 / resume at 1273 to pen the centre to
    // 1170-1255, and end at 1268 / resume at 1421 to pen it to 1286-1403.
    // Re-derive these if any band ever moves.
    { x: 0, y: 1040, w: 60, h: 112 },
    { x: 0, y: 1273, w: 60, h: 120 },
    { x: 2940, y: 1040, w: 60, h: 112 },
    { x: 2940, y: 1273, w: 60, h: 120 },
    { x: 1180, y: 2880, w: 88, h: 120 },
    { x: 1421, y: 2880, w: 90, h: 120 },
  ],

  // Landmark proximity labels. These are doorless, so they use their own radius
  // `r` (see world.js's building-label block). When the tower / camp / caravan
  // get real interactables or NPCs, move each label ONTO that object per the
  // project's one-label rule (see D4's cave) and delete the standalone entry.
  buildings: [
    { label: 'Ruined Watchtower', x: 1795, y: 300, r: 620 },
    { label: 'Herders\u2019 Camp', x: 1000, y: 1730, r: 540 },
    { label: 'Caravan Rest', x: 2500, y: 990, r: 360 },
  ],

  // Nothing here yet — see the header comment.
  npcs: [],
  interactables: [],
  chests: [],
  battles: [],
  ambushes: [],

  exits: [
    { edge: 'left', yMin: 1170, yMax: 1255, to: 'C1', note: 'the road west to Tidewrack Harbor' },
    { edge: 'bottom', xMin: 1286, xMax: 1403, to: 'D2', note: 'the road south to Millmere' },
    { edge: 'right', yMin: 1170, yMax: 1255, to: 'C3', note: 'the road east toward the forest' },
  ],
};
