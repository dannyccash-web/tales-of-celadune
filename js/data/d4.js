// Scene D4 — WOODS (overworld row D, column 4)
// World coordinates: 1920x1920. Origin top-left.
//
// Layout: the main path enters from the WEST edge (continuing D3's main
// path band, y~890-990), crosses a river on a plank bridge, then splits —
// the lower branch runs south-east to a fenced woodland camp (tents +
// firepit), the upper branch meanders around a meadow, crosses the river
// twice more (a second bridge on the way to a cave mouth in the northwest,
// a third heading north off the TOP edge toward C4). The river and the
// tree cover are impassable; the three bridges are the only crossings.
//
// Collision map regenerated 2026-07-11 from Danny's hand-painted walkable
// guide (assets/images/D4_Background_Walkable.jpg — red = walkable). Per-cell
// sampling on a 20px grid (finer than D3's 25px, per Danny's request), then a
// uniform 1-cell shoulder dilation so the 36px collider fits every corridor,
// plus three hand-carved plank-bridge crossings over the river. Verified
// headless: every landmark (both exits, all three bridges, cave front, camp)
// is reachable by the 36px collider from the west entrance. Regenerate from
// the walkable guide (see the session workflow) rather than hand-editing.

export default {
  id: 'D4',
  name: 'Woods',
  background: 'assets/images/D4_Background.jpg',
  width: 3000,
  height: 3000,

  // Just inside the west entrance (only used on a direct boot into D4 —
  // normal arrival comes through the scene-transition system).
  spawn: { x: 94, y: 1469 },

  // Fishing spots (2026-07-17): specific points on the river, not the whole
  // waterway. Player fishes within 180px; label + ripples center here.
  fishingSpots: [
    { x: 638, y: 2518 },
    { x: 2185, y: 538 },
  ],

  obstacles: [
    { x: 0, y: 0, w: 1438, h: 156 },
    { x: 1750, y: 0, w: 1250, h: 188 },
    { x: 1438, y: 31, w: 31, h: 63 },
    { x: 1656, y: 94, w: 94, h: 31 },
    { x: 1688, y: 125, w: 63, h: 31 },
    { x: 0, y: 156, w: 1406, h: 156 },
    { x: 1406, y: 188, w: 31, h: 250 },
    { x: 1781, y: 188, w: 1219, h: 31 },
    { x: 1813, y: 219, w: 1188, h: 281 },
    { x: 1438, y: 281, w: 31, h: 156 },
    { x: 1781, y: 281, w: 31, h: 188 },
    { x: 0, y: 313, w: 406, h: 31 },
    { x: 531, y: 313, w: 875, h: 31 },
    { x: 1469, y: 313, w: 31, h: 125 },
    { x: 1656, y: 313, w: 31, h: 125 },
    { x: 1750, y: 313, w: 31, h: 156 },
    { x: 0, y: 344, w: 375, h: 31 },
    { x: 594, y: 344, w: 813, h: 31 },
    { x: 1688, y: 344, w: 63, h: 125 },
    { x: 0, y: 375, w: 344, h: 63 },
    { x: 625, y: 375, w: 781, h: 63 },
    { x: 1500, y: 406, w: 31, h: 63 },
    { x: 0, y: 438, w: 313, h: 63 },
    { x: 625, y: 438, w: 750, h: 31 },
    { x: 719, y: 469, w: 625, h: 31 },
    { x: 0, y: 500, w: 281, h: 63 },
    { x: 750, y: 500, w: 594, h: 31 },
    { x: 1844, y: 500, w: 1156, h: 94 },
    { x: 781, y: 531, w: 563, h: 125 },
    { x: 0, y: 563, w: 250, h: 813 },
    { x: 1344, y: 563, w: 31, h: 250 },
    { x: 1375, y: 594, w: 31, h: 250 },
    { x: 1844, y: 594, w: 156, h: 31 },
    { x: 2063, y: 594, w: 94, h: 31 },
    { x: 2313, y: 594, w: 688, h: 31 },
    { x: 250, y: 625, w: 31, h: 750 },
    { x: 1406, y: 625, w: 31, h: 219 },
    { x: 1844, y: 625, w: 94, h: 31 },
    { x: 2375, y: 625, w: 625, h: 31 },
    { x: 813, y: 656, w: 531, h: 31 },
    { x: 1438, y: 656, w: 63, h: 219 },
    { x: 1844, y: 656, w: 63, h: 31 },
    { x: 2469, y: 656, w: 531, h: 31 },
    { x: 844, y: 688, w: 125, h: 31 },
    { x: 1000, y: 688, w: 344, h: 31 },
    { x: 1500, y: 688, w: 63, h: 156 },
    { x: 2500, y: 688, w: 500, h: 31 },
    { x: 875, y: 719, w: 63, h: 31 },
    { x: 1031, y: 719, w: 313, h: 31 },
    { x: 2750, y: 719, w: 250, h: 31 },
    { x: 281, y: 750, w: 31, h: 656 },
    { x: 625, y: 750, w: 94, h: 281 },
    { x: 1094, y: 750, w: 250, h: 31 },
    { x: 1563, y: 750, w: 31, h: 94 },
    { x: 2781, y: 750, w: 219, h: 125 },
    { x: 313, y: 781, w: 63, h: 563 },
    { x: 594, y: 781, w: 31, h: 281 },
    { x: 719, y: 781, w: 31, h: 344 },
    { x: 1125, y: 781, w: 219, h: 31 },
    { x: 375, y: 813, w: 31, h: 531 },
    { x: 563, y: 813, w: 31, h: 281 },
    { x: 750, y: 813, w: 31, h: 344 },
    { x: 1125, y: 813, w: 188, h: 31 },
    { x: 2063, y: 813, w: 125, h: 563 },
    { x: 2750, y: 813, w: 31, h: 63 },
    { x: 531, y: 844, w: 31, h: 281 },
    { x: 781, y: 844, w: 63, h: 625 },
    { x: 1219, y: 844, w: 63, h: 31 },
    { x: 1500, y: 844, w: 31, h: 31 },
    { x: 1969, y: 844, w: 94, h: 531 },
    { x: 2719, y: 844, w: 31, h: 31 },
    { x: 406, y: 875, w: 31, h: 500 },
    { x: 500, y: 875, w: 31, h: 500 },
    { x: 1250, y: 875, w: 31, h: 63 },
    { x: 2188, y: 875, w: 31, h: 531 },
    { x: 2844, y: 875, w: 156, h: 31 },
    { x: 438, y: 906, w: 63, h: 500 },
    { x: 1938, y: 906, w: 31, h: 469 },
    { x: 2219, y: 906, w: 219, h: 250 },
    { x: 2875, y: 906, w: 125, h: 313 },
    { x: 2438, y: 938, w: 31, h: 188 },
    { x: 844, y: 1000, w: 31, h: 31 },
    { x: 1406, y: 1000, w: 31, h: 31 },
    { x: 2844, y: 1000, w: 31, h: 156 },
    { x: 656, y: 1031, w: 63, h: 31 },
    { x: 688, y: 1063, w: 31, h: 31 },
    { x: 1906, y: 1063, w: 31, h: 125 },
    { x: 1031, y: 1094, w: 94, h: 188 },
    { x: 1875, y: 1094, w: 31, h: 63 },
    { x: 844, y: 1125, w: 31, h: 406 },
    { x: 1000, y: 1125, w: 31, h: 94 },
    { x: 1125, y: 1125, w: 31, h: 188 },
    { x: 2219, y: 1156, w: 188, h: 31 },
    { x: 1500, y: 1188, w: 125, h: 125 },
    { x: 1656, y: 1188, w: 94, h: 63 },
    { x: 2219, y: 1188, w: 156, h: 31 },
    { x: 531, y: 1219, w: 31, h: 125 },
    { x: 1281, y: 1219, w: 219, h: 219 },
    { x: 1625, y: 1219, w: 31, h: 63 },
    { x: 2219, y: 1219, w: 125, h: 219 },
    { x: 2906, y: 1219, w: 94, h: 1781 },
    { x: 563, y: 1250, w: 63, h: 31 },
    { x: 1719, y: 1250, w: 31, h: 31 },
    { x: 2344, y: 1250, w: 31, h: 188 },
    { x: 563, y: 1281, w: 31, h: 31 },
    { x: 875, y: 1281, w: 31, h: 344 },
    { x: 1156, y: 1281, w: 31, h: 31 },
    { x: 1250, y: 1281, w: 31, h: 125 },
    { x: 2375, y: 1281, w: 31, h: 125 },
    { x: 2875, y: 1281, w: 31, h: 188 },
    { x: 750, y: 1313, w: 31, h: 94 },
    { x: 906, y: 1313, w: 31, h: 313 },
    { x: 1188, y: 1313, w: 63, h: 31 },
    { x: 1500, y: 1313, w: 94, h: 31 },
    { x: 2406, y: 1313, w: 125, h: 63 },
    { x: 2844, y: 1313, w: 31, h: 94 },
    { x: 313, y: 1344, w: 31, h: 31 },
    { x: 938, y: 1344, w: 31, h: 313 },
    { x: 1219, y: 1344, w: 31, h: 31 },
    { x: 1500, y: 1344, w: 63, h: 344 },
    { x: 969, y: 1375, w: 31, h: 281 },
    { x: 2000, y: 1375, w: 156, h: 31 },
    { x: 1000, y: 1406, w: 63, h: 281 },
    { x: 1563, y: 1406, w: 31, h: 281 },
    { x: 1063, y: 1438, w: 63, h: 188 },
    { x: 1375, y: 1438, w: 125, h: 31 },
    { x: 1594, y: 1438, w: 31, h: 250 },
    { x: 1781, y: 1438, w: 63, h: 313 },
    { x: 2250, y: 1438, w: 94, h: 281 },
    { x: 813, y: 1469, w: 31, h: 31 },
    { x: 1125, y: 1469, w: 31, h: 125 },
    { x: 1406, y: 1469, w: 94, h: 31 },
    { x: 1625, y: 1469, w: 156, h: 219 },
    { x: 1844, y: 1469, w: 31, h: 313 },
    { x: 2344, y: 1469, w: 31, h: 250 },
    { x: 1156, y: 1500, w: 63, h: 94 },
    { x: 1438, y: 1500, w: 63, h: 125 },
    { x: 2219, y: 1500, w: 31, h: 219 },
    { x: 2375, y: 1500, w: 31, h: 219 },
    { x: 94, y: 1531, w: 281, h: 1469 },
    { x: 2188, y: 1531, w: 31, h: 188 },
    { x: 2406, y: 1531, w: 63, h: 63 },
    { x: 0, y: 1563, w: 94, h: 1438 },
    { x: 375, y: 1563, w: 94, h: 594 },
    { x: 1875, y: 1563, w: 31, h: 219 },
    { x: 469, y: 1594, w: 63, h: 531 },
    { x: 1906, y: 1594, w: 94, h: 188 },
    { x: 2406, y: 1594, w: 31, h: 125 },
    { x: 2875, y: 1594, w: 31, h: 1406 },
    { x: 531, y: 1625, w: 31, h: 500 },
    { x: 1063, y: 1625, w: 31, h: 31 },
    { x: 1469, y: 1625, w: 31, h: 94 },
    { x: 2000, y: 1625, w: 31, h: 156 },
    { x: 2844, y: 1625, w: 31, h: 1375 },
    { x: 563, y: 1656, w: 63, h: 469 },
    { x: 2781, y: 1656, w: 63, h: 125 },
    { x: 1031, y: 1688, w: 31, h: 31 },
    { x: 1500, y: 1688, w: 31, h: 31 },
    { x: 1688, y: 1688, w: 94, h: 31 },
    { x: 2750, y: 1688, w: 31, h: 63 },
    { x: 2281, y: 1719, w: 63, h: 31 },
    { x: 1031, y: 1750, w: 31, h: 63 },
    { x: 1813, y: 1750, w: 31, h: 31 },
    { x: 2813, y: 1781, w: 31, h: 31 },
    { x: 625, y: 1813, w: 31, h: 344 },
    { x: 656, y: 1844, w: 31, h: 125 },
    { x: 2156, y: 1875, w: 31, h: 125 },
    { x: 2813, y: 1875, w: 31, h: 1125 },
    { x: 1344, y: 1906, w: 63, h: 250 },
    { x: 2000, y: 1906, w: 156, h: 31 },
    { x: 2188, y: 1906, w: 125, h: 63 },
    { x: 1250, y: 1938, w: 94, h: 188 },
    { x: 1406, y: 1938, w: 31, h: 188 },
    { x: 1875, y: 1938, w: 219, h: 31 },
    { x: 2125, y: 1938, w: 31, h: 31 },
    { x: 2344, y: 1938, w: 31, h: 31 },
    { x: 2781, y: 1938, w: 31, h: 1063 },
    { x: 1188, y: 1969, w: 63, h: 125 },
    { x: 1438, y: 1969, w: 156, h: 125 },
    { x: 1906, y: 1969, w: 156, h: 31 },
    { x: 2188, y: 1969, w: 94, h: 31 },
    { x: 2750, y: 1969, w: 31, h: 1031 },
    { x: 1594, y: 2000, w: 31, h: 1000 },
    { x: 1938, y: 2000, w: 94, h: 31 },
    { x: 2188, y: 2000, w: 63, h: 63 },
    { x: 813, y: 2031, w: 94, h: 94 },
    { x: 1969, y: 2031, w: 63, h: 63 },
    { x: 2594, y: 2031, w: 63, h: 219 },
    { x: 2719, y: 2031, w: 31, h: 250 },
    { x: 2563, y: 2063, w: 31, h: 188 },
    { x: 2656, y: 2063, w: 63, h: 188 },
    { x: 656, y: 2094, w: 31, h: 94 },
    { x: 1219, y: 2094, w: 31, h: 31 },
    { x: 1500, y: 2094, w: 94, h: 31 },
    { x: 469, y: 2125, w: 31, h: 31 },
    { x: 1281, y: 2125, w: 63, h: 31 },
    { x: 1531, y: 2125, w: 63, h: 219 },
    { x: 375, y: 2156, w: 63, h: 31 },
    { x: 375, y: 2188, w: 31, h: 31 },
    { x: 1750, y: 2188, w: 63, h: 188 },
    { x: 1625, y: 2219, w: 31, h: 781 },
    { x: 1719, y: 2219, w: 31, h: 188 },
    { x: 375, y: 2250, w: 31, h: 750 },
    { x: 1094, y: 2250, w: 94, h: 344 },
    { x: 1500, y: 2250, w: 31, h: 63 },
    { x: 1656, y: 2250, w: 63, h: 188 },
    { x: 1813, y: 2250, w: 31, h: 156 },
    { x: 2156, y: 2250, w: 125, h: 94 },
    { x: 406, y: 2281, w: 31, h: 719 },
    { x: 1063, y: 2281, w: 31, h: 719 },
    { x: 1188, y: 2281, w: 31, h: 281 },
    { x: 2125, y: 2281, w: 31, h: 94 },
    { x: 438, y: 2313, w: 31, h: 688 },
    { x: 1031, y: 2313, w: 31, h: 688 },
    { x: 1219, y: 2313, w: 63, h: 219 },
    { x: 1844, y: 2313, w: 31, h: 94 },
    { x: 469, y: 2344, w: 31, h: 656 },
    { x: 875, y: 2344, w: 156, h: 656 },
    { x: 1281, y: 2344, w: 31, h: 156 },
    { x: 1563, y: 2344, w: 31, h: 31 },
    { x: 2156, y: 2344, w: 94, h: 31 },
    { x: 500, y: 2375, w: 31, h: 625 },
    { x: 1313, y: 2375, w: 31, h: 63 },
    { x: 531, y: 2406, w: 94, h: 594 },
    { x: 844, y: 2406, w: 31, h: 594 },
    { x: 2719, y: 2406, w: 31, h: 594 },
    { x: 625, y: 2438, w: 63, h: 563 },
    { x: 1656, y: 2438, w: 31, h: 563 },
    { x: 2594, y: 2438, w: 125, h: 63 },
    { x: 688, y: 2469, w: 31, h: 531 },
    { x: 813, y: 2469, w: 31, h: 531 },
    { x: 1563, y: 2469, w: 31, h: 531 },
    { x: 719, y: 2500, w: 94, h: 500 },
    { x: 1438, y: 2500, w: 125, h: 500 },
    { x: 2656, y: 2500, w: 63, h: 31 },
    { x: 1219, y: 2531, w: 31, h: 31 },
    { x: 1406, y: 2531, w: 31, h: 469 },
    { x: 1844, y: 2531, w: 94, h: 469 },
    { x: 2688, y: 2531, w: 31, h: 469 },
    { x: 1688, y: 2563, w: 31, h: 438 },
    { x: 2094, y: 2563, w: 94, h: 63 },
    { x: 2375, y: 2563, w: 63, h: 438 },
    { x: 1094, y: 2594, w: 63, h: 406 },
    { x: 1375, y: 2594, w: 31, h: 406 },
    { x: 1313, y: 2625, w: 63, h: 375 },
    { x: 1719, y: 2625, w: 31, h: 375 },
    { x: 1813, y: 2625, w: 31, h: 375 },
    { x: 2063, y: 2625, w: 94, h: 375 },
    { x: 2656, y: 2625, w: 31, h: 375 },
    { x: 1156, y: 2656, w: 31, h: 344 },
    { x: 1281, y: 2656, w: 31, h: 344 },
    { x: 1750, y: 2656, w: 63, h: 344 },
    { x: 2438, y: 2656, w: 31, h: 344 },
    { x: 2625, y: 2656, w: 31, h: 344 },
    { x: 1188, y: 2688, w: 94, h: 313 },
    { x: 1938, y: 2688, w: 31, h: 313 },
    { x: 2031, y: 2688, w: 31, h: 313 },
    { x: 2156, y: 2688, w: 31, h: 313 },
    { x: 2344, y: 2688, w: 31, h: 313 },
    { x: 2469, y: 2688, w: 31, h: 313 },
    { x: 2531, y: 2688, w: 94, h: 313 },
    { x: 1969, y: 2719, w: 63, h: 281 },
    { x: 2188, y: 2719, w: 31, h: 281 },
    { x: 2313, y: 2719, w: 31, h: 281 },
    { x: 2500, y: 2719, w: 31, h: 281 },
    { x: 2219, y: 2750, w: 94, h: 250 },
  ],

  // Proximity labels (same system as D3's building labels). The cave mouth's
  // label moved onto the cave-entrance interactable below (2026-07-31) — one
  // label per thing, shown exactly when you can press space to enter.
  buildings: [
    { label: 'Woodland Camp', x: 2219, y: 2031, r: 344 },
  ],

  entrances: [],

  interactables: [
    {
      id: 'shiny-deadend-south',
      x: 1298, y: 2563, w: 125, h: 125,
      label: 'A shiny object',
      reward: { gold: 4 },
    },
    // Cave entrance (2026-07-31) — interact to enter the D4B woods cave. `cave`
    // names the target sub-scene; main.js's enterCave() captures the player's
    // exact position so the cave's exit returns them right here. Placed at the
    // nearest reachable point to the NW cave-mouth art (engine-verified).
    {
      id: 'cave_d4b_entrance',
      x: 438, y: 344,
      range: 173,
      cave: 'D4B',
      label: 'Old Cave',
    },
  ],

  // Animated campfire smoke — code-drawn particles (World.drawSmoke), rising
  // from the firepit at the centre of the woodland camp. No asset needed.
  smoke: [
    { x: 2144, y: 2294 },
  ],

  // The woodland camp is the Bramblekin toll-camp now — its guards + Chief
  // live in `npcs` below, and their fights start dynamically from main.js
  // (refusing the Chief's toll, or shoving past a gate guard), not from a
  // fixed scene encounter. (The old 2-Blight-Rat battle was removed 2026-07-11.)
  battles: [],

  // Bramblekin toll-camp gates (2026-07-11). Two approaches into the camp
  // clearing from the meadow — north and west. When the toll is unpaid, the
  // nearest guards move to each gate's `posts` to block it, and crossing into
  // a gate's radius triggers the "see the chief" confrontation (world.js's
  // updateCampGuards + pendingGate, driven by main.js's toll state).
  // Reworked 2026-07-11 into a sealed region (see world.js's camp membrane).
  // While the toll's unpaid the player can't cross `region`'s boundary: they
  // can't ENTER until they agree to see the Chief (teleported to a gate's
  // `inside` point), then can't LEAVE until they pay. Each gate has a
  // stationary sentry (bramblekin_1 north / bramblekin_2 west); on payment the
  // sentries step to their `aside` spot so the player comes and goes freely.
  camp: {
    region: { x: 1798, y: 2016, w: 1000, h: 750 },
    // `inside`: teleport past the sentry when the player agrees to see the
    // Chief. `aside`: where the sentry steps on peaceful passage (paid / quest
    // done). `outside`: just OUTSIDE the sealed camp — where the player is set
    // down after accepting the Chief's rootweaver favor (2026-07-17), so they
    // leave to go hunt without being stuck inside the membrane.
    gates: [
      { id: 'north', x: 2469, y: 2016, r: 173, inside: { x: 2469, y: 2149 }, aside: { x: 2531, y: 2141 }, outside: { x: 2469, y: 1954 } },
      { id: 'west', x: 1798, y: 2094, r: 173, inside: { x: 1923, y: 2125 }, aside: { x: 1798, y: 2500 }, outside: { x: 1735, y: 2094 } },
    ],
  },

  // Hidden Rootweaver ambushes on the two shortcuts that skirt the camp — walk
  // within range and the fight starts on its own (world.js's checkAmbushes /
  // main.js's pendingAmbush). Rootweavers are a "flee for now" wall.
  // `retreat`: where the player is pushed back to if they FLEE the fight —
  // far enough back down the path (2026-07-17) that pressing on again walks
  // them right back into the rootweaver (each is >range*1.6 away, so the
  // ambush re-arms). Killing the rootweaver clears it for good.
  ambushes: [
    { id: 'rootweaver_north', x: 2089, y: 1719, range: 113, enemies: ['rootweaver'], retreat: { x: 1906, y: 1844 } },
    { id: 'rootweaver_west', x: 1183, y: 1419, range: 113, enemies: ['rootweaver'], retreat: { x: 704, y: 1469 } },
  ],

  // West back to the D3 Farm (band matches D3's east exit, so walking off
  // either edge lands on the other scene's path at the same height).
  // North toward C3/C4 woods — not built yet.
  exits: [
    { edge: 'left', yMin: 1391, yMax: 1548, to: 'D3', note: 'main path west to the Farm' },
    { edge: 'top', xMin: 1524, xMax: 1719, to: 'C4', note: 'path north into deeper woods' },
  ],

  // ---- Bramblekin toll-camp (2026-07-11) ----
  // Seven Bramblekin guards, one per tent (home door on the tent's
  // fire-facing side, per Danny), + the Bramblekin Chief by the fire. Guards
  // wander their corner of the camp and duck into their tent now and then
  // (routine/home, like D3's farmhands); when the toll's unpaid and the
  // player nears a gate they break off to block it (world.js). Their dialogue
  // and the Chief's toll are built dynamically in main.js (state depends on
  // whether the toll's been paid this visit) — the `line`/`paidLine` here are
  // the per-guard flavor. The Chief is stationary (no routine/patrol).
  npcs: [
    {
      id: 'bramblekin_1', name: 'Bramblekin', role: '', bramblekin: true,
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      // Stationary sentry at the NORTH entrance (top-right opening; no routine).
      x: 2469, y: 2063, speed: 38, startsHome: false,
      sentry: true, gate: 'north',
      line: 'State your business. Actually, don’t — I don’t care. Nobody crosses this camp without squaring up with the chief first.',
      paidLine: 'Chief took your coin. Guess you’re not my problem anymore.',
    },
    {
      id: 'bramblekin_2', name: 'Bramblekin', role: '', bramblekin: true,
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      // Stationary sentry at the WEST/NW entrance (main path in; no routine).
      x: 1844, y: 2094, speed: 38, startsHome: false,
      sentry: true, gate: 'west',
      line: 'Thorns out, coin up. That’s the rule. You want through? You talk to the chief, and you bring gold when you do.',
      paidLine: 'Paid up, are you? Fine. Don’t touch anything.',
    },
    {
      id: 'bramblekin_3', name: 'Bramblekin', role: '', bramblekin: true,
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 2438, y: 2305, speed: 38, startsHome: false,
      home: { door: { x: 2331, y: 2243 }, interior: 'assets/images/bramblekin_tent_interior.jpg' },
      routine: [
        { do: 'goto', x: 2438, y: 2305 }, { do: 'wait', s: 6 },
        { do: 'goto', x: 2375, y: 2298 }, { do: 'wait', s: 4 },
        { do: 'goHome' }, { do: 'wait', s: 5 }, { do: 'leaveHome' },
      ],
      line: 'We don’t do charity here, sap. The chief sets the toll, you pay the toll, everybody’s happy. Well — he’s happy.',
      paidLine: 'Move along, moneybags. You’re square with us.',
    },
    {
      id: 'bramblekin_4', name: 'Bramblekin', role: '', bramblekin: true,
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 1993, y: 2351, speed: 38, startsHome: false,
      home: { door: { x: 1923, y: 2291 }, interior: 'assets/images/bramblekin_tent_interior.jpg' },
      routine: [
        { do: 'goto', x: 1993, y: 2351 }, { do: 'wait', s: 4 },
        { do: 'goto', x: 1930, y: 2219 }, { do: 'wait', s: 6 },
        { do: 'goHome' }, { do: 'wait', s: 5 }, { do: 'leaveHome' },
      ],
      line: 'Keep walking and see what happens. Or better yet, go see the chief before something unfortunate grows out of you.',
      paidLine: 'You paid? Huh. Wonders never cease. Off you go.',
    },
    {
      id: 'bramblekin_5', name: 'Bramblekin', role: '', bramblekin: true,
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 2055, y: 2438, speed: 38, startsHome: false,
      home: { door: { x: 1994, y: 2508 }, interior: 'assets/images/bramblekin_tent_interior.jpg' },
      routine: [
        { do: 'goto', x: 2055, y: 2438 }, { do: 'wait', s: 5 },
        { do: 'goto', x: 1954, y: 2438 }, { do: 'wait', s: 5 },
        { do: 'goHome' }, { do: 'wait', s: 6 }, { do: 'leaveHome' },
      ],
      line: 'Fresh face. Fresh purse, I hope. Passage costs, and the chief’s the one who counts it.',
      paidLine: 'Toll’s settled. I’ll pretend to be friendly now.',
    },
    // (bramblekin_6 and bramblekin_7 removed 2026-07-22, Danny — thinned the
    // camp's wandering guards; the two stationary sentries at the gates stay.)
    {
      id: 'bramblekin_chief', name: 'Bramblekin Chief', role: '',
      sprite: 'assets/images/Bramblekin_Chief_Overhead.png',
      portrait: 'assets/images/Bramblekin_Chief.png',
      x: 2144, y: 2414, speed: 0, startsHome: false,
      // Stationary by the fire — no routine/patrol, so world.js leaves him put.
    },
  ],
};
