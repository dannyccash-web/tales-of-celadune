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
  spawn: { x: 1490, y: 1404 },

  // Fallback overworld if caveReturn is somehow missing (matches every other
  // cave's convention) — not the normal path back, since this scene's exit
  // uses a fixed `exitTo` instead (see the interactable below).
  returns: 'C1',

  // Enclosed/underground-feeling space — same track as every cave/hold.
  music: 'cave',
  // Fights below deck use the ship-interior battle backdrop (2026-10-10, Danny).
  battleBackground: 'assets/images/boat_background_2.jpg',

  level: 1, // first level of the ship dungeon — see header comment

  obstacles: [
    // Regenerated 2026-11-04 for the new, longer hull art: per-10px-row hull silhouette inset 45px (left) / 50px (right) to the inner rail, bow cargo + stern cargo + the hatch blocked; everything else is open deck.
    { x: 0, y: 0, w: 3000, h: 920 },
    { x: 0, y: 920, w: 1360, h: 30 },
    { x: 1630, y: 920, w: 1370, h: 30 },
    { x: 0, y: 950, w: 1340, h: 10 },
    { x: 1650, y: 950, w: 1350, h: 10 },
    { x: 0, y: 960, w: 1350, h: 80 },
    { x: 1640, y: 960, w: 1360, h: 50 },
    { x: 1650, y: 1010, w: 1350, h: 50 },
    { x: 0, y: 1040, w: 1340, h: 20 },
    { x: 0, y: 1060, w: 1330, h: 10 },
    { x: 1660, y: 1060, w: 1340, h: 10 },
    { x: 0, y: 1070, w: 1340, h: 50 },
    { x: 1650, y: 1070, w: 1350, h: 10 },
    { x: 1660, y: 1080, w: 1340, h: 70 },
    { x: 0, y: 1120, w: 1330, h: 30 },
    { x: 0, y: 1150, w: 1320, h: 10 },
    { x: 1670, y: 1150, w: 1330, h: 10 },
    { x: 0, y: 1160, w: 1330, h: 70 },
    { x: 1660, y: 1160, w: 1340, h: 10 },
    { x: 1670, y: 1170, w: 1330, h: 60 },
    { x: 0, y: 1230, w: 1310, h: 10 },
    { x: 1690, y: 1230, w: 1310, h: 10 },
    { x: 0, y: 1240, w: 1320, h: 60 },
    { x: 1670, y: 1240, w: 1330, h: 50 },
    { x: 1680, y: 1290, w: 1320, h: 90 },
    { x: 0, y: 1300, w: 1310, h: 20 },
    { x: 0, y: 1320, w: 1320, h: 60 },
    { x: 0, y: 1380, w: 1300, h: 10 },
    { x: 1700, y: 1380, w: 1300, h: 10 },
    { x: 0, y: 1390, w: 1320, h: 40 },
    { x: 1680, y: 1390, w: 1320, h: 160 },
    { x: 0, y: 1430, w: 1310, h: 120 },
    { x: 0, y: 1550, w: 1300, h: 10 },
    { x: 1700, y: 1550, w: 1300, h: 10 },
    { x: 0, y: 1560, w: 1310, h: 110 },
    { x: 1680, y: 1560, w: 1320, h: 80 },
    { x: 1690, y: 1640, w: 1310, h: 10 },
    { x: 1680, y: 1650, w: 1320, h: 60 },
    { x: 0, y: 1670, w: 1320, h: 40 },
    { x: 0, y: 1710, w: 1300, h: 10 },
    { x: 1700, y: 1710, w: 1300, h: 10 },
    { x: 0, y: 1720, w: 1320, h: 90 },
    { x: 1680, y: 1720, w: 1320, h: 100 },
    { x: 0, y: 1810, w: 1310, h: 10 },
    { x: 0, y: 1820, w: 1320, h: 50 },
    { x: 1670, y: 1820, w: 1330, h: 80 },
    { x: 0, y: 1870, w: 1330, h: 30 },
    { x: 1430, y: 1890, w: 120, h: 170 },
    { x: 0, y: 1900, w: 1310, h: 10 },
    { x: 1680, y: 1900, w: 1320, h: 10 },
    { x: 0, y: 1910, w: 1330, h: 50 },
    { x: 1660, y: 1910, w: 1340, h: 80 },
    { x: 0, y: 1960, w: 1340, h: 30 },
    { x: 0, y: 1990, w: 1320, h: 10 },
    { x: 1670, y: 1990, w: 1330, h: 10 },
    { x: 0, y: 2000, w: 1340, h: 30 },
    { x: 1650, y: 2000, w: 1350, h: 60 },
    { x: 0, y: 2030, w: 1350, h: 50 },
    { x: 1640, y: 2060, w: 1360, h: 20 },
    { x: 0, y: 2080, w: 1340, h: 10 },
    { x: 1660, y: 2080, w: 1340, h: 10 },
    { x: 0, y: 2090, w: 1360, h: 60 },
    { x: 1640, y: 2090, w: 1360, h: 30 },
    { x: 1630, y: 2120, w: 1370, h: 20 },
    { x: 1380, y: 2140, w: 1620, h: 50 },
    { x: 0, y: 2150, w: 1370, h: 20 },
    { x: 0, y: 2170, w: 1360, h: 10 },
    { x: 0, y: 2180, w: 1370, h: 10 },
    { x: 0, y: 2190, w: 3000, h: 810 },
  ],

  interactables: [
    // Ladder back up to the top deck. Returns the player to a FIXED point on
    // C1 (X512 Y1450 since the 2026-10-20 ship redraw — C1 overworld space) via `exitTo`,
    // not wherever they entered from — see the header comment and
    // main.js's exitCave(overridePos).
    {
      id: 'c1c_topdeck_exit',
      x: 1490, y: 1340,
      range: 100,
      caveExit: true,
      exitTo: { x: 512, y: 1450 }, // beside the cargo hatch on C1's redrawn ship (2026-10-20)
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
      x: 1490, y: 1870, // on the hatch's top edge in the new art (hatch blocked x1435-1550, y1895-2055) (2026-11-04)
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
      x: 1470, y: 1030, speed: 35, chaseSpeed: 140, aggroRange: 300, giveUpRange: 700, startsHome: false,
      patrol: [ { x: 1470, y: 1030 }, { x: 1500, y: 1130 } ],
    },
    {
      id: 'mireman_c1c_2', name: 'Mireman', role: '',
      creature: true, enemyId: 'mireman', pack: 'hold_miremen',
      sprite: 'assets/images/mireman_overhead.png',
      portrait: 'assets/images/mireman.png',
      x: 1430, y: 1730, speed: 35, chaseSpeed: 140, aggroRange: 300, giveUpRange: 700, startsHome: false,
      patrol: [ { x: 1430, y: 1730 }, { x: 1500, y: 1640 } ],
    },
  ],
};
