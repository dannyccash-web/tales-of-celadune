// Scene C1C — MAIDEN'S GRACE, BELOW DECK (2026-09-11, Danny)
// Reached by interacting with the "Below Deck" label on C1's overworld
// (x437,y1266 — right on the derelict merchant ship *Maiden's Grace*'s deck,
// the same ship guarded topside by the two miremen; see c1.js's
// cave_c1c_entrance). The game's FIRST multi-level dungeon: for now this is
// just Level 1, the ship's hold — an enclosed wooden hull interior lit by a
// single lantern, barrels/crates lashed down at bow and stern, a grated vent
// set into the far wall amidships. More levels (further down into the hull)
// are expected later; `level: 1` here is what drives the HUD's new vertical
// "Level" indicator (main.js's enterScene -> ui.setLevelIndicator, see
// index.html/style.css) — built to carry additional levels as this dungeon
// grows.
//
// World coordinates 1500x1500 — matches C1C_Background.jpg's native pixel
// size 1:1 (same convention as every other scene; note the file's EXIF
// metadata claims 3000x3000, but the actual decoded image is 1500x1500 —
// don't trust the EXIF tag if this art is ever regenerated).
//
// Exit is a FIXED return point (x437,y1229 on C1), not the generic
// captured-entry `caveReturn` every other cave uses — Danny's spec calls out
// a specific drop point (a few px off the entrance itself, so returning
// doesn't land the player back inside the "Below Deck" label's own trigger
// range). See main.js's exitCave(overridePos) and this scene's
// `c1c_topdeck_exit` interactable's `exitTo` field.
//
// Collision generated from C1C_Background.jpg's silhouette: per-20px-row
// scan for non-black pixels (threshold 18 on the max channel — true void
// outside the hull reads 0-3, everything painted reads well above that),
// 22px inward margin on each side for the 36px player collider, consecutive
// identical-width rows merged into one rect (same recipe as every other
// scene's collision, just without a hand-painted walkable guide this time —
// there's no separate guide image for this one, so this is a first pass;
// revisit with a proper guide if finer collision is ever needed). Three
// simple boxes additionally block the crate/barrel clusters at bow and
// stern and the wall-mounted grate amidships, so the player can't walk
// through the set dressing. Verified headlessly (world.blockersAt) that the
// spawn point, the Top Deck exit, and the straight line between them are
// all clear.

export default {
  id: 'C1C',
  name: "Maiden's Grace — Below Deck",
  background: 'assets/images/C1C_Background.jpg',
  width: 1500,
  height: 1500,

  // Fixed arrival point (Danny's spec: X745 Y702) — main.js's enterCave sets
  // the player to the target scene's own `spawn`, so this is exactly where
  // "Below Deck" drops them.
  spawn: { x: 745, y: 702 },

  // Fallback overworld if caveReturn is somehow missing (matches every other
  // cave's convention) — not the normal path back, since this scene's exit
  // uses a fixed `exitTo` instead (see the interactable below).
  returns: 'C1',

  // Enclosed/underground-feeling space — same track as every cave/hold.
  music: 'cave',

  level: 1, // first level of the ship dungeon — see header comment

  obstacles: [
    { x: 0, y: 0, w: 1500, h: 340 },
    { x: 0, y: 340, w: 730, h: 20 }, { x: 766, y: 340, w: 734, h: 20 },
    { x: 0, y: 360, w: 722, h: 20 }, { x: 774, y: 360, w: 726, h: 20 },
    { x: 0, y: 380, w: 714, h: 20 }, { x: 782, y: 380, w: 718, h: 20 },
    { x: 0, y: 400, w: 710, h: 20 }, { x: 790, y: 400, w: 710, h: 20 },
    { x: 0, y: 420, w: 702, h: 20 }, { x: 794, y: 420, w: 706, h: 20 },
    { x: 0, y: 440, w: 698, h: 20 }, { x: 802, y: 440, w: 698, h: 20 },
    { x: 0, y: 460, w: 690, h: 20 }, { x: 806, y: 460, w: 694, h: 20 },
    { x: 0, y: 480, w: 686, h: 20 }, { x: 810, y: 480, w: 690, h: 20 },
    { x: 0, y: 500, w: 682, h: 20 }, { x: 814, y: 500, w: 686, h: 20 },
    { x: 0, y: 520, w: 682, h: 20 }, { x: 818, y: 520, w: 682, h: 20 },
    { x: 0, y: 540, w: 674, h: 40 }, { x: 822, y: 540, w: 678, h: 40 },
    { x: 0, y: 580, w: 670, h: 60 }, { x: 826, y: 580, w: 674, h: 60 },
    { x: 0, y: 640, w: 670, h: 20 }, { x: 830, y: 640, w: 670, h: 20 },
    { x: 0, y: 660, w: 666, h: 20 }, { x: 830, y: 660, w: 670, h: 20 },
    { x: 0, y: 680, w: 658, h: 20 }, { x: 838, y: 680, w: 662, h: 20 },
    { x: 0, y: 700, w: 666, h: 20 }, { x: 830, y: 700, w: 670, h: 20 },
    { x: 0, y: 720, w: 662, h: 20 }, { x: 834, y: 720, w: 666, h: 20 },
    { x: 0, y: 740, w: 666, h: 20 }, { x: 834, y: 740, w: 666, h: 20 },
    { x: 0, y: 760, w: 658, h: 20 }, { x: 838, y: 760, w: 662, h: 20 },
    { x: 0, y: 780, w: 666, h: 20 }, { x: 834, y: 780, w: 666, h: 20 },
    { x: 0, y: 800, w: 662, h: 20 }, { x: 834, y: 800, w: 666, h: 20 },
    { x: 0, y: 820, w: 666, h: 60 }, { x: 830, y: 820, w: 670, h: 60 },
    { x: 0, y: 880, w: 666, h: 20 }, { x: 834, y: 880, w: 666, h: 20 },
    { x: 0, y: 900, w: 670, h: 20 }, { x: 826, y: 900, w: 674, h: 20 },
    { x: 0, y: 920, w: 666, h: 20 }, { x: 830, y: 920, w: 670, h: 20 },
    { x: 0, y: 940, w: 674, h: 20 }, { x: 822, y: 940, w: 678, h: 20 },
    { x: 0, y: 960, w: 670, h: 20 }, { x: 826, y: 960, w: 674, h: 20 },
    { x: 0, y: 980, w: 678, h: 20 }, { x: 818, y: 980, w: 682, h: 20 },
    { x: 0, y: 1000, w: 674, h: 20 }, { x: 822, y: 1000, w: 678, h: 20 },
    { x: 0, y: 1020, w: 686, h: 20 }, { x: 810, y: 1020, w: 690, h: 20 },
    { x: 0, y: 1040, w: 690, h: 20 }, { x: 806, y: 1040, w: 694, h: 20 },
    { x: 0, y: 1060, w: 694, h: 20 }, { x: 802, y: 1060, w: 698, h: 20 },
    { x: 0, y: 1080, w: 690, h: 20 }, { x: 806, y: 1080, w: 694, h: 20 },
    { x: 0, y: 1100, w: 706, h: 20 }, { x: 790, y: 1100, w: 710, h: 20 },
    { x: 0, y: 1120, w: 714, h: 20 }, { x: 782, y: 1120, w: 718, h: 20 },
    { x: 0, y: 1140, w: 722, h: 40 }, { x: 774, y: 1140, w: 726, h: 40 },
    { x: 0, y: 1180, w: 1500, h: 320 },
    // Set-dressing clusters blocked as simple boxes (crates/barrels at bow
    // and stern, the wall-mounted grate amidships) — approximate bounding
    // boxes read off the art, padded a few px.
    { x: 700, y: 325, w: 105, h: 140 }, // bow barrels/crate nook
    { x: 695, y: 1030, w: 110, h: 95 }, // stern barrels/crate nook
    { x: 715, y: 912, w: 60, h: 80 }, // wall-mounted grate, midships
  ],

  interactables: [
    // Ladder back up to the top deck. Returns the player to a FIXED point on
    // C1 (X437 Y1229) via `exitTo`, not wherever they entered from — see the
    // header comment and main.js's exitCave(overridePos).
    {
      id: 'c1c_topdeck_exit',
      x: 745, y: 670,
      range: 100,
      caveExit: true,
      exitTo: { x: 437, y: 1229 },
      label: 'Top Deck',
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
  // spawn/ladder. Points + short patrol legs engine-verified (circle-vs-rect
  // clearance >=30px, matching this project's usual waypoint safety margin;
  // the hold's corridor pinches to <30px right at the bow/stern crate nooks,
  // so these sit just short of those dead ends).
  npcs: [
    {
      id: 'mireman_c1c_1', name: 'Mireman', role: '',
      creature: true, enemyId: 'mireman', pack: 'hold_miremen',
      sprite: 'assets/images/mireman_overhead.png',
      portrait: 'assets/images/mireman.png',
      x: 735, y: 515, speed: 35, chaseSpeed: 140, aggroRange: 300, giveUpRange: 700, startsHome: false,
      patrol: [ { x: 735, y: 515 }, { x: 750, y: 565 } ],
    },
    {
      id: 'mireman_c1c_2', name: 'Mireman', role: '',
      creature: true, enemyId: 'mireman', pack: 'hold_miremen',
      sprite: 'assets/images/mireman_overhead.png',
      portrait: 'assets/images/mireman.png',
      x: 715, y: 865, speed: 35, chaseSpeed: 140, aggroRange: 300, giveUpRange: 700, startsHome: false,
      patrol: [ { x: 715, y: 865 }, { x: 750, y: 820 } ],
    },
  ],
};
