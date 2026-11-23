// 2026-11-23: NEW ART (Danny). The hold is now a wide hull (x~1100-1900,
// y~200-2800): bow cargo + a mast base up top, a pool of daylight on the floor
// amidships (the hatch to the main deck, where "Top Deck" is), and a stairway
// down at the stern end (x1425-1585, y1930-2195; "Bottom Deck" at its north
// end). Collision regenerated: per-10px-row hull silhouette inset 95px each
// side for the rails, plus hand boxes for the cargo, mast base and stairwell.
// The notes below describe the earlier art and are history.
// Scene C1C — MAIDEN'S GRACE, BELOW DECK (2026-09-11, Danny)
// Reached by interacting with the "Below Deck" label on C1's overworld
// (x437,y1266 — right on the derelict merchant ship *Maiden's Grace*'s deck,
// the same ship guarded topside by the two miremen; see c1.js's
// cave_c1c_entrance). The game's FIRST multi-level dungeon: Level 1, the
// ship's hold — an enclosed wooden hull interior lit by a single lantern,
// barrels/crates lashed down at bow and stern, a grated vent set into the
// far wall amidships. `level: 1` here is what drives the HUD's vertical
// "Level" indicator (main.js's enterScene -> ui.setLevelIndicator, see
// index.html/style.css). C1D (Level 2, the bilge/bottom deck) sits below
// this one, reached via the c1c_bottomdeck_entrance ladder below.
//
// RE-SCALED 2026-09-12 (Danny replaced C1C_Background.jpg with a true
// 3000x3000 render — the file previously had 3000x3000 EXIF metadata but
// actually decoded to 1500x1500, a quirk this comment used to warn about;
// that quirk is now gone). Confirmed via pixel diff against the old
// (git-history) 1500x1500 art that the new file is a clean 2x upscale of
// the SAME composition, so every coordinate below (collision, spawn, both
// ladders, both miremen) was doubled from its original value to land on
// the same visual spots at the new resolution. Collision was regenerated
// fresh from the new art rather than doubled by hand, using the same
// method as C1D (see that file's header comment) for a pixel-accurate fit
// rather than compounding any rounding from the original hand-authored
// pass. Re-verified headlessly (BFS reachability) that the spawn point,
// both ladders, and both miremen's patrol points are all clear and
// mutually reachable.
//
// World coordinates 3000x3000 — matches C1C_Background.jpg's native pixel
// size 1:1 (same convention as every other scene).
//
// Top-deck exit is a FIXED return point (x437,y1229 on C1 — C1's own
// overworld coordinate space, unaffected by this scene's rescale), not the
// generic captured-entry `caveReturn` every other cave uses — Danny's spec
// calls out a specific drop point (a few px off the entrance itself, so
// returning doesn't land the player back inside the "Below Deck" label's
// own trigger range). See main.js's exitCave(overridePos) and this scene's
// `c1c_topdeck_exit` interactable's `exitTo` field.
//
// Collision generated from C1C_Background.jpg's silhouette: per-40px-row
// scan for non-void pixels (threshold 18 on the max channel — true void
// outside the hull reads 0-3, everything painted reads well above that),
// 22px inward margin on each side for the 36px player collider, consecutive
// identical-width rows merged into one rect, plus small rects boxing out
// internal notches (crate/beam set dressing gaps within the main span) —
// same recipe as C1D. Three additional hand-placed boxes block the
// crate/barrel clusters at bow and stern and the wall-mounted grate
// amidships (this brightness-threshold method can't tell painted set
// dressing from open floor, so these stay hand-read/doubled rather than
// derived). Verified headlessly (world.blockersAt/BFS) that the spawn
// point, both ladders, and the straight lines between them are all clear.

export default {
  id: 'C1C',
  name: "Maiden's Grace — Below Deck",
  background: 'assets/images/C1C_Background.jpg',
  width: 3000,
  height: 3000,

  // Fixed arrival point (Danny's original spec X745 Y702, doubled to match
  // the art's new scale) — main.js's enterCave sets the player to the
  // target scene's own `spawn`, so this is exactly where "Below Deck" drops
  // them.
  spawn: { x: 1505, y: 1480 }, // 2026-11-23: just aft of the daylight under the deck hatch

  // Fallback overworld if caveReturn is somehow missing (matches every other
  // cave's convention) — not the normal path back, since this scene's exit
  // uses a fixed `exitTo` instead (see the interactable below).
  returns: 'C1',

  // Enclosed/underground-feeling space — same track as every cave/hold.
  music: 'cave',
  // Fights below deck use the ship-interior battle backdrop (2026-10-10, Danny).
  battleBackground: 'assets/images/boat_background_2.jpg',


  obstacles: [
    { x: 0, y: 0, w: 3000, h: 300 },
    { x: 0, y: 300, w: 1490, h: 20 },
    { x: 1530, y: 300, w: 1470, h: 20 },
    { x: 0, y: 320, w: 1480, h: 10 },
    { x: 1540, y: 320, w: 1460, h: 10 },
    { x: 0, y: 330, w: 1470, h: 10 },
    { x: 1550, y: 330, w: 1450, h: 10 },
    { x: 0, y: 340, w: 1460, h: 10 },
    { x: 1560, y: 340, w: 1440, h: 10 },
    { x: 0, y: 350, w: 1450, h: 10 },
    { x: 1570, y: 350, w: 1430, h: 10 },
    { x: 0, y: 360, w: 1440, h: 10 },
    { x: 0, y: 370, w: 1480, h: 250 },
    { x: 1520, y: 360, w: 1480, h: 260 },
    { x: 1580, y: 620, w: 1420, h: 210 },
    { x: 1730, y: 830, w: 1270, h: 10 },
    { x: 1460, y: 720, w: 110, h: 160 },
    { x: 0, y: 620, w: 1400, h: 280 },
    { x: 1740, y: 840, w: 1260, h: 60 },
    { x: 1750, y: 900, w: 1250, h: 30 },
    { x: 1740, y: 930, w: 1260, h: 30 },
    { x: 0, y: 900, w: 1260, h: 110 },
    { x: 0, y: 1010, w: 1250, h: 30 },
    { x: 0, y: 1040, w: 1260, h: 20 },
    { x: 1750, y: 960, w: 1250, h: 150 },
    { x: 1760, y: 1110, w: 1240, h: 40 },
    { x: 1750, y: 1150, w: 1250, h: 30 },
    { x: 0, y: 1060, w: 1250, h: 280 },
    { x: 0, y: 1340, w: 1240, h: 10 },
    { x: 0, y: 1350, w: 1250, h: 80 },
    { x: 0, y: 1430, w: 1240, h: 20 },
    { x: 1760, y: 1180, w: 1240, h: 430 },
    { x: 1750, y: 1610, w: 1250, h: 20 },
    { x: 0, y: 1450, w: 1250, h: 210 },
    { x: 1760, y: 1630, w: 1240, h: 30 },
    { x: 0, y: 1660, w: 1260, h: 110 },
    { x: 1750, y: 1660, w: 1250, h: 110 },
    { x: 1740, y: 1770, w: 1260, h: 50 },
    { x: 1730, y: 1820, w: 1270, h: 20 },
    { x: 1740, y: 1840, w: 1260, h: 20 },
    { x: 0, y: 1770, w: 1270, h: 100 },
    { x: 1730, y: 1860, w: 1270, h: 40 },
    { x: 0, y: 1870, w: 1280, h: 40 },
    { x: 1720, y: 1900, w: 1280, h: 70 },
    { x: 0, y: 1910, w: 1290, h: 70 },
    { x: 0, y: 1980, w: 1300, h: 60 },
    { x: 1710, y: 1970, w: 1290, h: 70 },
    { x: 0, y: 2040, w: 1310, h: 10 },
    { x: 1700, y: 2040, w: 1300, h: 10 },
    { x: 0, y: 2050, w: 1300, h: 20 },
    { x: 1710, y: 2050, w: 1290, h: 20 },
    { x: 0, y: 2070, w: 1310, h: 20 },
    { x: 1700, y: 2070, w: 1300, h: 20 },
    { x: 0, y: 2090, w: 1320, h: 90 },
    { x: 1690, y: 2090, w: 1310, h: 90 },
    { x: 0, y: 2180, w: 1330, h: 20 },
    { x: 1420, y: 1930, w: 170, h: 270 },
    { x: 1680, y: 2180, w: 1320, h: 20 },
    { x: 0, y: 2200, w: 1340, h: 50 },
    { x: 1670, y: 2200, w: 1330, h: 50 },
    { x: 0, y: 2250, w: 1350, h: 10 },
    { x: 0, y: 2260, w: 1340, h: 10 },
    { x: 0, y: 2270, w: 1350, h: 20 },
    { x: 1660, y: 2250, w: 1340, h: 40 },
    { x: 0, y: 2290, w: 1360, h: 20 },
    { x: 1650, y: 2290, w: 1350, h: 20 },
    { x: 0, y: 2310, w: 1490, h: 280 },
    { x: 0, y: 2590, w: 1480, h: 10 },
    { x: 0, y: 2600, w: 1490, h: 10 },
    { x: 1530, y: 2310, w: 1470, h: 300 },
    { x: 0, y: 2610, w: 3000, h: 390 },
  ],

  interactables: [
    // Ladder back up to the top deck. Returns the player to a FIXED point on
    // C1 (X512 Y1450 since the 2026-10-20 ship redraw — C1 overworld space) via `exitTo`,
    // not wherever they entered from — see the header comment and
    // main.js's exitCave(overridePos).
    {
      id: 'c1c_topdeck_exit',
      x: 1505, y: 1390, // the pool of daylight under the deck hatch (2026-11-23 art)
      range: 110,
      caveExit: true,
      exitTo: { x: 525, y: 1450 }, // beside the cargo hatch on C1's redrawn ship (2026-10-20; x512 -> 525 on 2026-11-13: the 10-30 deck markup put 512 just inside the hatch rect)
      label: 'Top Deck',
    },
    // Ladder down to the bilge/bottom deck (C1D), one level further down the
    // wreck (2026-09-12, Danny). Danny's originally-given spot (doubled to
    // 1496,1840) turned out to sit right on top of the wall-mounted grate
    // obstacle below — checked visually against the art and nudged to
    // (1490,1750), the nearest clean floor open enough for the player
    // collider (~74px clearance vs ~0px at the original spot), just above
    // the grate rather than beside it.
    {
      id: 'c1c_bottomdeck_entrance',
      x: 1505, y: 1900, // the north (top) end of the stairway down (stairwell blocked x1425-1585, y1930-2195) (2026-11-23)
      range: 100,
      cave: 'C1D',
      label: 'Bottom Deck',
    },
  ],

  fishingSpots: [],
  chests: [],
  battles: [],
  ambushes: [],
  exits: [],
  // Two roaming `creature` miremen guarding the hold itself (2026-09-11,
  // Danny) — same pattern as the pair topside on C1's deck (see c1.js), but
  // their own `pack` (striking either drags both into one fight, independent
  // of the topside pair). One posted toward the bow (top) end of the hold,
  // one toward the stern (bottom) end, on opposite sides of the player's
  // spawn/ladder. Positions doubled 2026-09-12 along with the rest of this
  // scene (see header comment); re-verified headlessly after the rescale.
  npcs: [
    {
      id: 'mireman_c1c_1', name: 'Mireman', role: '',
      creature: true, enemyId: 'mireman', pack: 'hold_miremen',
      sprite: 'assets/images/mireman_overhead.png',
      portrait: 'assets/images/mireman.png',
      x: 1380, y: 1020, speed: 35, chaseSpeed: 140, aggroRange: 250, giveUpRange: 700, startsHome: false,
      patrol: [ { x: 1380, y: 1020 }, { x: 1630, y: 1020 } ], // aft of the mast base (2026-11-23)
    },
    {
      id: 'mireman_c1c_2', name: 'Mireman', role: '',
      creature: true, enemyId: 'mireman', pack: 'hold_miremen',
      sprite: 'assets/images/mireman_overhead.png',
      portrait: 'assets/images/mireman.png',
      x: 1340, y: 2060, speed: 35, chaseSpeed: 140, aggroRange: 220, giveUpRange: 700, startsHome: false,
      patrol: [ { x: 1340, y: 2060 }, { x: 1340, y: 2160 } ], // the aisle port-side of the stairs (2026-11-23)
    },
  ],
};
