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
  width: 2400,
  height: 2400,

  // Just inside the west entrance (only used on a direct boot into D4 —
  // normal arrival comes through the scene-transition system).
  spawn: { x: 75, y: 1175 },

  // Fishing spots (2026-07-17): specific points on the river, not the whole
  // waterway. Player fishes within 180px; label + ripples center here.
  fishingSpots: [
    { x: 510, y: 2014 },
    { x: 1748, y: 430 },
  ],

  obstacles: [
    { x: 0, y: 0, w: 1150, h: 125 },
    { x: 1400, y: 0, w: 1000, h: 150 },
    { x: 1150, y: 25, w: 25, h: 50 },
    { x: 1325, y: 75, w: 75, h: 25 },
    { x: 1350, y: 100, w: 50, h: 25 },
    { x: 0, y: 125, w: 1125, h: 125 },
    { x: 1125, y: 150, w: 25, h: 200 },
    { x: 1425, y: 150, w: 975, h: 25 },
    { x: 1450, y: 175, w: 950, h: 225 },
    { x: 1150, y: 225, w: 25, h: 125 },
    { x: 1425, y: 225, w: 25, h: 150 },
    { x: 0, y: 250, w: 325, h: 25 },
    { x: 425, y: 250, w: 700, h: 25 },
    { x: 1175, y: 250, w: 25, h: 100 },
    { x: 1325, y: 250, w: 25, h: 100 },
    { x: 1400, y: 250, w: 25, h: 125 },
    { x: 0, y: 275, w: 300, h: 25 },
    { x: 475, y: 275, w: 650, h: 25 },
    { x: 1350, y: 275, w: 50, h: 100 },
    { x: 0, y: 300, w: 275, h: 50 },
    { x: 500, y: 300, w: 625, h: 50 },
    { x: 1200, y: 325, w: 25, h: 50 },
    { x: 0, y: 350, w: 250, h: 50 },
    { x: 500, y: 350, w: 600, h: 25 },
    { x: 575, y: 375, w: 500, h: 25 },
    { x: 0, y: 400, w: 225, h: 50 },
    { x: 600, y: 400, w: 475, h: 25 },
    { x: 1475, y: 400, w: 925, h: 75 },
    { x: 625, y: 425, w: 450, h: 100 },
    { x: 0, y: 450, w: 200, h: 650 },
    { x: 1075, y: 450, w: 25, h: 200 },
    { x: 1100, y: 475, w: 25, h: 200 },
    { x: 1475, y: 475, w: 125, h: 25 },
    { x: 1650, y: 475, w: 75, h: 25 },
    { x: 1850, y: 475, w: 550, h: 25 },
    { x: 200, y: 500, w: 25, h: 600 },
    { x: 1125, y: 500, w: 25, h: 175 },
    { x: 1475, y: 500, w: 75, h: 25 },
    { x: 1900, y: 500, w: 500, h: 25 },
    { x: 650, y: 525, w: 425, h: 25 },
    { x: 1150, y: 525, w: 50, h: 175 },
    { x: 1475, y: 525, w: 50, h: 25 },
    { x: 1975, y: 525, w: 425, h: 25 },
    { x: 675, y: 550, w: 100, h: 25 },
    { x: 800, y: 550, w: 275, h: 25 },
    { x: 1200, y: 550, w: 50, h: 125 },
    { x: 2000, y: 550, w: 400, h: 25 },
    { x: 700, y: 575, w: 50, h: 25 },
    { x: 825, y: 575, w: 250, h: 25 },
    { x: 2200, y: 575, w: 200, h: 25 },
    { x: 225, y: 600, w: 25, h: 525 },
    { x: 500, y: 600, w: 75, h: 225 },
    { x: 875, y: 600, w: 200, h: 25 },
    { x: 1250, y: 600, w: 25, h: 75 },
    { x: 2225, y: 600, w: 175, h: 100 },
    { x: 250, y: 625, w: 50, h: 450 },
    { x: 475, y: 625, w: 25, h: 225 },
    { x: 575, y: 625, w: 25, h: 275 },
    { x: 900, y: 625, w: 175, h: 25 },
    { x: 300, y: 650, w: 25, h: 425 },
    { x: 450, y: 650, w: 25, h: 225 },
    { x: 600, y: 650, w: 25, h: 275 },
    { x: 900, y: 650, w: 150, h: 25 },
    { x: 1650, y: 650, w: 100, h: 450 },
    { x: 2200, y: 650, w: 25, h: 50 },
    { x: 425, y: 675, w: 25, h: 225 },
    { x: 625, y: 675, w: 50, h: 500 },
    { x: 975, y: 675, w: 50, h: 25 },
    { x: 1200, y: 675, w: 25, h: 25 },
    { x: 1575, y: 675, w: 75, h: 425 },
    { x: 2175, y: 675, w: 25, h: 25 },
    { x: 325, y: 700, w: 25, h: 400 },
    { x: 400, y: 700, w: 25, h: 400 },
    { x: 1000, y: 700, w: 25, h: 50 },
    { x: 1750, y: 700, w: 25, h: 425 },
    { x: 2275, y: 700, w: 125, h: 25 },
    { x: 350, y: 725, w: 50, h: 400 },
    { x: 1550, y: 725, w: 25, h: 375 },
    { x: 1775, y: 725, w: 175, h: 200 },
    { x: 2300, y: 725, w: 100, h: 250 },
    { x: 1950, y: 750, w: 25, h: 150 },
    { x: 675, y: 800, w: 25, h: 25 },
    { x: 1125, y: 800, w: 25, h: 25 },
    { x: 2275, y: 800, w: 25, h: 125 },
    { x: 525, y: 825, w: 50, h: 25 },
    { x: 550, y: 850, w: 25, h: 25 },
    { x: 1525, y: 850, w: 25, h: 100 },
    { x: 825, y: 875, w: 75, h: 150 },
    { x: 1500, y: 875, w: 25, h: 50 },
    { x: 675, y: 900, w: 25, h: 325 },
    { x: 800, y: 900, w: 25, h: 75 },
    { x: 900, y: 900, w: 25, h: 150 },
    { x: 1775, y: 925, w: 150, h: 25 },
    { x: 1200, y: 950, w: 100, h: 100 },
    { x: 1325, y: 950, w: 75, h: 50 },
    { x: 1775, y: 950, w: 125, h: 25 },
    { x: 425, y: 975, w: 25, h: 100 },
    { x: 1025, y: 975, w: 175, h: 175 },
    { x: 1300, y: 975, w: 25, h: 50 },
    { x: 1775, y: 975, w: 100, h: 175 },
    { x: 2325, y: 975, w: 75, h: 1425 },
    { x: 450, y: 1000, w: 50, h: 25 },
    { x: 1375, y: 1000, w: 25, h: 25 },
    { x: 1875, y: 1000, w: 25, h: 150 },
    { x: 450, y: 1025, w: 25, h: 25 },
    { x: 700, y: 1025, w: 25, h: 275 },
    { x: 925, y: 1025, w: 25, h: 25 },
    { x: 1000, y: 1025, w: 25, h: 100 },
    { x: 1900, y: 1025, w: 25, h: 100 },
    { x: 2300, y: 1025, w: 25, h: 150 },
    { x: 600, y: 1050, w: 25, h: 75 },
    { x: 725, y: 1050, w: 25, h: 250 },
    { x: 950, y: 1050, w: 50, h: 25 },
    { x: 1200, y: 1050, w: 75, h: 25 },
    { x: 1925, y: 1050, w: 100, h: 50 },
    { x: 2275, y: 1050, w: 25, h: 75 },
    { x: 250, y: 1075, w: 25, h: 25 },
    { x: 750, y: 1075, w: 25, h: 250 },
    { x: 975, y: 1075, w: 25, h: 25 },
    { x: 1200, y: 1075, w: 50, h: 275 },
    { x: 775, y: 1100, w: 25, h: 225 },
    { x: 1600, y: 1100, w: 125, h: 25 },
    { x: 800, y: 1125, w: 50, h: 225 },
    { x: 1250, y: 1125, w: 25, h: 225 },
    { x: 850, y: 1150, w: 50, h: 150 },
    { x: 1100, y: 1150, w: 100, h: 25 },
    { x: 1275, y: 1150, w: 25, h: 200 },
    { x: 1425, y: 1150, w: 50, h: 250 },
    { x: 1800, y: 1150, w: 75, h: 225 },
    { x: 650, y: 1175, w: 25, h: 25 },
    { x: 900, y: 1175, w: 25, h: 100 },
    { x: 1125, y: 1175, w: 75, h: 25 },
    { x: 1300, y: 1175, w: 125, h: 175 },
    { x: 1475, y: 1175, w: 25, h: 250 },
    { x: 1875, y: 1175, w: 25, h: 200 },
    { x: 925, y: 1200, w: 50, h: 75 },
    { x: 1150, y: 1200, w: 50, h: 100 },
    { x: 1775, y: 1200, w: 25, h: 175 },
    { x: 1900, y: 1200, w: 25, h: 175 },
    { x: 75, y: 1225, w: 225, h: 1175 },
    { x: 1750, y: 1225, w: 25, h: 150 },
    { x: 1925, y: 1225, w: 50, h: 50 },
    { x: 0, y: 1250, w: 75, h: 1150 },
    { x: 300, y: 1250, w: 75, h: 475 },
    { x: 1500, y: 1250, w: 25, h: 175 },
    { x: 375, y: 1275, w: 50, h: 425 },
    { x: 1525, y: 1275, w: 75, h: 150 },
    { x: 1925, y: 1275, w: 25, h: 100 },
    { x: 2300, y: 1275, w: 25, h: 1125 },
    { x: 425, y: 1300, w: 25, h: 400 },
    { x: 850, y: 1300, w: 25, h: 25 },
    { x: 1175, y: 1300, w: 25, h: 75 },
    { x: 1600, y: 1300, w: 25, h: 125 },
    { x: 2275, y: 1300, w: 25, h: 1100 },
    { x: 450, y: 1325, w: 50, h: 375 },
    { x: 2225, y: 1325, w: 50, h: 100 },
    { x: 825, y: 1350, w: 25, h: 25 },
    { x: 1200, y: 1350, w: 25, h: 25 },
    { x: 1350, y: 1350, w: 75, h: 25 },
    { x: 2200, y: 1350, w: 25, h: 50 },
    { x: 1825, y: 1375, w: 50, h: 25 },
    { x: 825, y: 1400, w: 25, h: 50 },
    { x: 1450, y: 1400, w: 25, h: 25 },
    { x: 2250, y: 1425, w: 25, h: 25 },
    { x: 500, y: 1450, w: 25, h: 275 },
    { x: 525, y: 1475, w: 25, h: 100 },
    { x: 1725, y: 1500, w: 25, h: 100 },
    { x: 2250, y: 1500, w: 25, h: 900 },
    { x: 1075, y: 1525, w: 50, h: 200 },
    { x: 1600, y: 1525, w: 125, h: 25 },
    { x: 1750, y: 1525, w: 100, h: 50 },
    { x: 1000, y: 1550, w: 75, h: 150 },
    { x: 1125, y: 1550, w: 25, h: 150 },
    { x: 1500, y: 1550, w: 175, h: 25 },
    { x: 1700, y: 1550, w: 25, h: 25 },
    { x: 1875, y: 1550, w: 25, h: 25 },
    { x: 2225, y: 1550, w: 25, h: 850 },
    { x: 950, y: 1575, w: 50, h: 100 },
    { x: 1150, y: 1575, w: 125, h: 100 },
    { x: 1525, y: 1575, w: 125, h: 25 },
    { x: 1750, y: 1575, w: 75, h: 25 },
    { x: 2200, y: 1575, w: 25, h: 825 },
    { x: 1275, y: 1600, w: 25, h: 800 },
    { x: 1550, y: 1600, w: 75, h: 25 },
    { x: 1750, y: 1600, w: 50, h: 50 },
    { x: 650, y: 1625, w: 75, h: 75 },
    { x: 1575, y: 1625, w: 50, h: 50 },
    { x: 2075, y: 1625, w: 50, h: 175 },
    { x: 2175, y: 1625, w: 25, h: 200 },
    { x: 2050, y: 1650, w: 25, h: 150 },
    { x: 2125, y: 1650, w: 50, h: 150 },
    { x: 525, y: 1675, w: 25, h: 75 },
    { x: 975, y: 1675, w: 25, h: 25 },
    { x: 1200, y: 1675, w: 75, h: 25 },
    { x: 375, y: 1700, w: 25, h: 25 },
    { x: 1025, y: 1700, w: 50, h: 25 },
    { x: 1225, y: 1700, w: 50, h: 175 },
    { x: 300, y: 1725, w: 50, h: 25 },
    { x: 300, y: 1750, w: 25, h: 25 },
    { x: 1400, y: 1750, w: 50, h: 150 },
    { x: 1300, y: 1775, w: 25, h: 625 },
    { x: 1375, y: 1775, w: 25, h: 150 },
    { x: 300, y: 1800, w: 25, h: 600 },
    { x: 875, y: 1800, w: 75, h: 275 },
    { x: 1200, y: 1800, w: 25, h: 50 },
    { x: 1325, y: 1800, w: 50, h: 150 },
    { x: 1450, y: 1800, w: 25, h: 125 },
    { x: 1725, y: 1800, w: 100, h: 75 },
    { x: 325, y: 1825, w: 25, h: 575 },
    { x: 850, y: 1825, w: 25, h: 575 },
    { x: 950, y: 1825, w: 25, h: 225 },
    { x: 1700, y: 1825, w: 25, h: 75 },
    { x: 350, y: 1850, w: 25, h: 550 },
    { x: 825, y: 1850, w: 25, h: 550 },
    { x: 975, y: 1850, w: 50, h: 175 },
    { x: 1475, y: 1850, w: 25, h: 75 },
    { x: 375, y: 1875, w: 25, h: 525 },
    { x: 700, y: 1875, w: 125, h: 525 },
    { x: 1025, y: 1875, w: 25, h: 125 },
    { x: 1250, y: 1875, w: 25, h: 25 },
    { x: 1725, y: 1875, w: 75, h: 25 },
    { x: 400, y: 1900, w: 25, h: 500 },
    { x: 1050, y: 1900, w: 25, h: 50 },
    { x: 425, y: 1925, w: 75, h: 475 },
    { x: 675, y: 1925, w: 25, h: 475 },
    { x: 2175, y: 1925, w: 25, h: 475 },
    { x: 500, y: 1950, w: 50, h: 450 },
    { x: 1325, y: 1950, w: 25, h: 450 },
    { x: 2075, y: 1950, w: 100, h: 50 },
    { x: 550, y: 1975, w: 25, h: 425 },
    { x: 650, y: 1975, w: 25, h: 425 },
    { x: 1250, y: 1975, w: 25, h: 425 },
    { x: 575, y: 2000, w: 75, h: 400 },
    { x: 1150, y: 2000, w: 100, h: 400 },
    { x: 2125, y: 2000, w: 50, h: 25 },
    { x: 975, y: 2025, w: 25, h: 25 },
    { x: 1125, y: 2025, w: 25, h: 375 },
    { x: 1475, y: 2025, w: 75, h: 375 },
    { x: 2150, y: 2025, w: 25, h: 375 },
    { x: 1350, y: 2050, w: 25, h: 350 },
    { x: 1675, y: 2050, w: 75, h: 50 },
    { x: 1900, y: 2050, w: 50, h: 350 },
    { x: 875, y: 2075, w: 50, h: 325 },
    { x: 1100, y: 2075, w: 25, h: 325 },
    { x: 1050, y: 2100, w: 50, h: 300 },
    { x: 1375, y: 2100, w: 25, h: 300 },
    { x: 1450, y: 2100, w: 25, h: 300 },
    { x: 1650, y: 2100, w: 75, h: 300 },
    { x: 2125, y: 2100, w: 25, h: 300 },
    { x: 925, y: 2125, w: 25, h: 275 },
    { x: 1025, y: 2125, w: 25, h: 275 },
    { x: 1400, y: 2125, w: 50, h: 275 },
    { x: 1950, y: 2125, w: 25, h: 275 },
    { x: 2100, y: 2125, w: 25, h: 275 },
    { x: 950, y: 2150, w: 75, h: 250 },
    { x: 1550, y: 2150, w: 25, h: 250 },
    { x: 1625, y: 2150, w: 25, h: 250 },
    { x: 1725, y: 2150, w: 25, h: 250 },
    { x: 1875, y: 2150, w: 25, h: 250 },
    { x: 1975, y: 2150, w: 25, h: 250 },
    { x: 2025, y: 2150, w: 75, h: 250 },
    { x: 1575, y: 2175, w: 50, h: 225 },
    { x: 1750, y: 2175, w: 25, h: 225 },
    { x: 1850, y: 2175, w: 25, h: 225 },
    { x: 2000, y: 2175, w: 25, h: 225 },
    { x: 1775, y: 2200, w: 75, h: 200 },
  ],

  // Proximity labels (same system as D3's building labels). The cave mouth's
  // label moved onto the cave-entrance interactable below (2026-07-31) — one
  // label per thing, shown exactly when you can press space to enter.
  buildings: [
    { label: 'Woodland Camp', x: 1775, y: 1625, r: 275 },
  ],

  entrances: [],

  interactables: [
    {
      id: 'shiny-deadend-south',
      x: 1038, y: 2050, w: 100, h: 100,
      label: 'A shiny object',
      reward: { gold: 4 },
    },
    // Cave entrance (2026-07-31) — interact to enter the D4B woods cave. `cave`
    // names the target sub-scene; main.js's enterCave() captures the player's
    // exact position so the cave's exit returns them right here. Placed at the
    // nearest reachable point to the NW cave-mouth art (engine-verified).
    {
      id: 'cave_d4b_entrance',
      x: 350, y: 275,
      range: 138,
      cave: 'D4B',
      label: 'Old Cave',
    },
  ],

  // Animated campfire smoke — code-drawn particles (World.drawSmoke), rising
  // from the firepit at the centre of the woodland camp. No asset needed.
  smoke: [
    { x: 1715, y: 1835 },
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
    region: { x: 1438, y: 1613, w: 800, h: 600 },
    // `inside`: teleport past the sentry when the player agrees to see the
    // Chief. `aside`: where the sentry steps on peaceful passage (paid / quest
    // done). `outside`: just OUTSIDE the sealed camp — where the player is set
    // down after accepting the Chief's rootweaver favor (2026-07-17), so they
    // leave to go hunt without being stuck inside the membrane.
    gates: [
      { id: 'north', x: 1975, y: 1613, r: 138, inside: { x: 1975, y: 1719 }, aside: { x: 2025, y: 1713 }, outside: { x: 1975, y: 1563 } },
      { id: 'west', x: 1438, y: 1675, r: 138, inside: { x: 1538, y: 1700 }, aside: { x: 1438, y: 2000 }, outside: { x: 1388, y: 1675 } },
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
    { id: 'rootweaver_north', x: 1671, y: 1375, range: 90, enemies: ['rootweaver'], retreat: { x: 1525, y: 1475 } },
    { id: 'rootweaver_west', x: 946, y: 1135, range: 90, enemies: ['rootweaver'], retreat: { x: 563, y: 1175 } },
  ],

  // West back to the D3 Farm (band matches D3's east exit, so walking off
  // either edge lands on the other scene's path at the same height).
  // North toward C3/C4 woods — not built yet.
  exits: [
    { edge: 'left', yMin: 1113, yMax: 1238, to: 'D3', note: 'main path west to the Farm' },
    { edge: 'top', xMin: 1219, xMax: 1375, to: 'C4', note: 'path north into deeper woods' },
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
      x: 1975, y: 1650, speed: 38, startsHome: false,
      sentry: true, gate: 'north',
      line: 'State your business. Actually, don’t — I don’t care. Nobody crosses this camp without squaring up with the chief first.',
      paidLine: 'Chief took your coin. Guess you’re not my problem anymore.',
    },
    {
      id: 'bramblekin_2', name: 'Bramblekin', role: '', bramblekin: true,
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      // Stationary sentry at the WEST/NW entrance (main path in; no routine).
      x: 1475, y: 1675, speed: 38, startsHome: false,
      sentry: true, gate: 'west',
      line: 'Thorns out, coin up. That’s the rule. You want through? You talk to the chief, and you bring gold when you do.',
      paidLine: 'Paid up, are you? Fine. Don’t touch anything.',
    },
    {
      id: 'bramblekin_3', name: 'Bramblekin', role: '', bramblekin: true,
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 1950, y: 1844, speed: 38, startsHome: false,
      home: { door: { x: 1865, y: 1794 }, interior: 'assets/images/bramblekin_tent_interior.jpg' },
      routine: [
        { do: 'goto', x: 1950, y: 1844 }, { do: 'wait', s: 6 },
        { do: 'goto', x: 1900, y: 1838 }, { do: 'wait', s: 4 },
        { do: 'goHome' }, { do: 'wait', s: 5 }, { do: 'leaveHome' },
      ],
      line: 'We don’t do charity here, sap. The chief sets the toll, you pay the toll, everybody’s happy. Well — he’s happy.',
      paidLine: 'Move along, moneybags. You’re square with us.',
    },
    {
      id: 'bramblekin_4', name: 'Bramblekin', role: '', bramblekin: true,
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 1594, y: 1881, speed: 38, startsHome: false,
      home: { door: { x: 1538, y: 1833 }, interior: 'assets/images/bramblekin_tent_interior.jpg' },
      routine: [
        { do: 'goto', x: 1594, y: 1881 }, { do: 'wait', s: 4 },
        { do: 'goto', x: 1544, y: 1775 }, { do: 'wait', s: 6 },
        { do: 'goHome' }, { do: 'wait', s: 5 }, { do: 'leaveHome' },
      ],
      line: 'Keep walking and see what happens. Or better yet, go see the chief before something unfortunate grows out of you.',
      paidLine: 'You paid? Huh. Wonders never cease. Off you go.',
    },
    {
      id: 'bramblekin_5', name: 'Bramblekin', role: '', bramblekin: true,
      sprite: 'assets/images/Bramblekin_Overhead.png',
      portrait: 'assets/images/Bramblekin.png',
      x: 1644, y: 1950, speed: 38, startsHome: false,
      home: { door: { x: 1595, y: 2006 }, interior: 'assets/images/bramblekin_tent_interior.jpg' },
      routine: [
        { do: 'goto', x: 1644, y: 1950 }, { do: 'wait', s: 5 },
        { do: 'goto', x: 1563, y: 1950 }, { do: 'wait', s: 5 },
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
      x: 1715, y: 1931, speed: 0, startsHome: false,
      // Stationary by the fire — no routine/patrol, so world.js leaves him put.
    },
  ],
};
