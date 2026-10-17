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
// junction to a dark cave mouth under the cliff (scenery only — no cave
// interior, per Danny the cliffs just signal the frozen north). North of the
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
//   left   -> B3  y1358-1601 (Kingsreach, live since 2026-10-17). The road
//                 mouth's own run; B3's right band is y1344-1561 and
//                 settleArrival covers the difference.
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
  spawn: { x: 1440, y: 1450 },
  obstacles: [
    { x: 0, y: 0, w: 3000, h: 440 },
    { x: 0, y: 440, w: 1660, h: 20 },
    { x: 1800, y: 440, w: 1200, h: 20 },
    { x: 0, y: 460, w: 1640, h: 40 },
    { x: 1820, y: 460, w: 1180, h: 40 },
    { x: 0, y: 500, w: 1620, h: 20 },
    { x: 1840, y: 500, w: 1160, h: 60 },
    { x: 0, y: 520, w: 1600, h: 160 },
    { x: 1820, y: 560, w: 1180, h: 100 },
    { x: 1800, y: 660, w: 1200, h: 20 },
    { x: 0, y: 680, w: 1620, h: 140 },
    { x: 1720, y: 680, w: 1280, h: 20 },
    { x: 1700, y: 700, w: 1300, h: 100 },
    { x: 1680, y: 800, w: 1320, h: 40 },
    { x: 0, y: 820, w: 1600, h: 40 },
    { x: 1660, y: 840, w: 1340, h: 60 },
    { x: 0, y: 860, w: 1580, h: 20 },
    { x: 0, y: 880, w: 1560, h: 40 },
    { x: 1680, y: 900, w: 1320, h: 40 },
    { x: 0, y: 920, w: 1540, h: 100 },
    { x: 1680, y: 940, w: 280, h: 20 },
    { x: 2000, y: 940, w: 1000, h: 40 },
    { x: 1700, y: 960, w: 240, h: 20 },
    { x: 1720, y: 980, w: 220, h: 20 },
    { x: 2000, y: 980, w: 520, h: 20 },
    { x: 2560, y: 980, w: 440, h: 60 },
    { x: 1800, y: 1000, w: 120, h: 20 },
    { x: 2000, y: 1000, w: 480, h: 20 },
    { x: 0, y: 1020, w: 1520, h: 20 },
    { x: 1800, y: 1020, w: 40, h: 20 },
    { x: 1900, y: 1020, w: 20, h: 20 },
    { x: 2000, y: 1020, w: 460, h: 40 },
    { x: 0, y: 1040, w: 1500, h: 20 },
    { x: 1780, y: 1040, w: 60, h: 20 },
    { x: 2540, y: 1040, w: 460, h: 60 },
    { x: 0, y: 1060, w: 1480, h: 40 },
    { x: 1700, y: 1060, w: 120, h: 20 },
    { x: 2020, y: 1060, w: 40, h: 20 },
    { x: 2120, y: 1060, w: 340, h: 20 },
    { x: 1700, y: 1080, w: 100, h: 20 },
    { x: 2040, y: 1080, w: 20, h: 20 },
    { x: 2140, y: 1080, w: 320, h: 40 },
    { x: 0, y: 1100, w: 1340, h: 40 },
    { x: 1700, y: 1100, w: 80, h: 20 },
    { x: 1860, y: 1100, w: 40, h: 20 },
    { x: 2560, y: 1100, w: 440, h: 100 },
    { x: 1600, y: 1120, w: 180, h: 20 },
    { x: 2140, y: 1120, w: 100, h: 40 },
    { x: 2300, y: 1120, w: 160, h: 20 },
    { x: 0, y: 1140, w: 1360, h: 100 },
    { x: 1580, y: 1140, w: 200, h: 20 },
    { x: 1900, y: 1140, w: 60, h: 40 },
    { x: 2340, y: 1140, w: 100, h: 20 },
    { x: 1560, y: 1160, w: 220, h: 20 },
    { x: 2360, y: 1160, w: 80, h: 20 },
    { x: 1540, y: 1180, w: 220, h: 80 },
    { x: 1860, y: 1180, w: 100, h: 120 },
    { x: 2360, y: 1180, w: 60, h: 40 },
    { x: 2540, y: 1200, w: 460, h: 40 },
    { x: 2180, y: 1220, w: 100, h: 80 },
    { x: 0, y: 1240, w: 1340, h: 20 },
    { x: 2560, y: 1240, w: 440, h: 20 },
    { x: 0, y: 1260, w: 1240, h: 20 },
    { x: 1280, y: 1260, w: 60, h: 20 },
    { x: 1560, y: 1260, w: 200, h: 20 },
    { x: 2580, y: 1260, w: 420, h: 40 },
    { x: 0, y: 1280, w: 1220, h: 20 },
    { x: 1300, y: 1280, w: 20, h: 20 },
    { x: 1560, y: 1280, w: 140, h: 20 },
    { x: 0, y: 1300, w: 700, h: 40 },
    { x: 1580, y: 1300, w: 40, h: 20 },
    { x: 2560, y: 1300, w: 440, h: 20 },
    { x: 2500, y: 1320, w: 500, h: 80 },
    { x: 260, y: 1340, w: 440, h: 40 },
    { x: 260, y: 1380, w: 100, h: 40 },
    { x: 620, y: 1380, w: 80, h: 20 },
    { x: 2600, y: 1400, w: 400, h: 300 },
    { x: 360, y: 1520, w: 260, h: 20 },
    { x: 360, y: 1540, w: 340, h: 20 },
    { x: 260, y: 1560, w: 440, h: 20 },
    { x: 260, y: 1580, w: 980, h: 20 },
    { x: 1760, y: 1580, w: 60, h: 20 },
    { x: 260, y: 1600, w: 1100, h: 20 },
    { x: 1680, y: 1600, w: 240, h: 20 },
    { x: 0, y: 1620, w: 1400, h: 20 },
    { x: 1660, y: 1620, w: 280, h: 20 },
    { x: 2080, y: 1620, w: 40, h: 20 },
    { x: 0, y: 1640, w: 1420, h: 20 },
    { x: 1660, y: 1640, w: 300, h: 20 },
    { x: 2060, y: 1640, w: 360, h: 20 },
    { x: 0, y: 1660, w: 1440, h: 40 },
    { x: 1660, y: 1660, w: 320, h: 20 },
    { x: 2040, y: 1660, w: 420, h: 20 },
    { x: 1660, y: 1680, w: 820, h: 20 },
    { x: 0, y: 1700, w: 1460, h: 20 },
    { x: 1660, y: 1700, w: 1340, h: 40 },
    { x: 0, y: 1720, w: 1480, h: 40 },
    { x: 1680, y: 1740, w: 1320, h: 100 },
    { x: 0, y: 1760, w: 1500, h: 80 },
    { x: 0, y: 1840, w: 1480, h: 80 },
    { x: 1660, y: 1840, w: 1340, h: 100 },
    { x: 0, y: 1920, w: 680, h: 20 },
    { x: 760, y: 1920, w: 720, h: 80 },
    { x: 0, y: 1940, w: 660, h: 20 },
    { x: 1640, y: 1940, w: 1360, h: 60 },
    { x: 0, y: 1960, w: 640, h: 20 },
    { x: 0, y: 1980, w: 620, h: 80 },
    { x: 780, y: 2000, w: 80, h: 20 },
    { x: 900, y: 2000, w: 600, h: 20 },
    { x: 1640, y: 2000, w: 780, h: 20 },
    { x: 2500, y: 2000, w: 500, h: 80 },
    { x: 800, y: 2020, w: 20, h: 20 },
    { x: 920, y: 2020, w: 580, h: 20 },
    { x: 1640, y: 2020, w: 640, h: 20 },
    { x: 940, y: 2040, w: 560, h: 20 },
    { x: 1640, y: 2040, w: 620, h: 20 },
    { x: 0, y: 2060, w: 720, h: 20 },
    { x: 980, y: 2060, w: 500, h: 20 },
    { x: 1640, y: 2060, w: 600, h: 20 },
    { x: 0, y: 2080, w: 740, h: 60 },
    { x: 1020, y: 2080, w: 460, h: 20 },
    { x: 1620, y: 2080, w: 620, h: 20 },
    { x: 2520, y: 2080, w: 480, h: 20 },
    { x: 1040, y: 2100, w: 440, h: 20 },
    { x: 1620, y: 2100, w: 580, h: 20 },
    { x: 2540, y: 2100, w: 460, h: 20 },
    { x: 1060, y: 2120, w: 400, h: 20 },
    { x: 1620, y: 2120, w: 480, h: 20 },
    { x: 2560, y: 2120, w: 440, h: 40 },
    { x: 0, y: 2140, w: 880, h: 120 },
    { x: 1080, y: 2140, w: 380, h: 20 },
    { x: 1620, y: 2140, w: 460, h: 20 },
    { x: 1100, y: 2160, w: 340, h: 20 },
    { x: 1620, y: 2160, w: 440, h: 20 },
    { x: 2580, y: 2160, w: 420, h: 60 },
    { x: 1120, y: 2180, w: 300, h: 20 },
    { x: 1640, y: 2180, w: 400, h: 20 },
    { x: 1180, y: 2200, w: 240, h: 20 },
    { x: 1640, y: 2200, w: 380, h: 20 },
    { x: 1220, y: 2220, w: 200, h: 20 },
    { x: 1660, y: 2220, w: 320, h: 20 },
    { x: 2600, y: 2220, w: 400, h: 100 },
    { x: 1240, y: 2240, w: 200, h: 20 },
    { x: 1700, y: 2240, w: 260, h: 20 },
    { x: 0, y: 2260, w: 960, h: 80 },
    { x: 1260, y: 2260, w: 200, h: 20 },
    { x: 1820, y: 2260, w: 120, h: 20 },
    { x: 1280, y: 2280, w: 180, h: 20 },
    { x: 1340, y: 2300, w: 100, h: 20 },
    { x: 2080, y: 2300, w: 20, h: 20 },
    { x: 1360, y: 2320, w: 60, h: 20 },
    { x: 1640, y: 2320, w: 100, h: 20 },
    { x: 2000, y: 2320, w: 120, h: 20 },
    { x: 2580, y: 2320, w: 420, h: 20 },
    { x: 0, y: 2340, w: 1000, h: 100 },
    { x: 1620, y: 2340, w: 240, h: 20 },
    { x: 1920, y: 2340, w: 20, h: 20 },
    { x: 2000, y: 2340, w: 140, h: 20 },
    { x: 2560, y: 2340, w: 440, h: 20 },
    { x: 1140, y: 2360, w: 100, h: 20 },
    { x: 1620, y: 2360, w: 520, h: 60 },
    { x: 2540, y: 2360, w: 460, h: 20 },
    { x: 1120, y: 2380, w: 160, h: 20 },
    { x: 2520, y: 2380, w: 480, h: 20 },
    { x: 1100, y: 2400, w: 320, h: 20 },
    { x: 2500, y: 2400, w: 500, h: 20 },
    { x: 1080, y: 2420, w: 360, h: 20 },
    { x: 1600, y: 2420, w: 560, h: 40 },
    { x: 2440, y: 2420, w: 560, h: 20 },
    { x: 0, y: 2440, w: 1440, h: 20 },
    { x: 2420, y: 2440, w: 580, h: 40 },
    { x: 0, y: 2460, w: 1460, h: 20 },
    { x: 1600, y: 2460, w: 660, h: 20 },
    { x: 0, y: 2480, w: 1480, h: 20 },
    { x: 1600, y: 2480, w: 680, h: 20 },
    { x: 2400, y: 2480, w: 600, h: 20 },
    { x: 0, y: 2500, w: 1460, h: 40 },
    { x: 1600, y: 2500, w: 1400, h: 20 },
    { x: 1580, y: 2520, w: 1420, h: 20 },
    { x: 0, y: 2540, w: 1440, h: 40 },
    { x: 1560, y: 2540, w: 1440, h: 20 },
    { x: 1540, y: 2560, w: 1460, h: 20 },
    { x: 0, y: 2580, w: 1420, h: 40 },
    { x: 1500, y: 2580, w: 1500, h: 20 },
    { x: 1480, y: 2600, w: 1520, h: 20 },
    { x: 0, y: 2620, w: 1400, h: 40 },
    { x: 1460, y: 2620, w: 1540, h: 40 },
    { x: 0, y: 2660, w: 1380, h: 40 },
    { x: 1480, y: 2660, w: 1520, h: 40 },
    { x: 0, y: 2700, w: 1360, h: 60 },
    { x: 1500, y: 2700, w: 1500, h: 80 },
    { x: 0, y: 2760, w: 1340, h: 40 },
    { x: 1480, y: 2780, w: 1520, h: 40 },
    { x: 0, y: 2800, w: 1320, h: 20 },
    { x: 0, y: 2820, w: 1300, h: 20 },
    { x: 1460, y: 2820, w: 1540, h: 40 },
    { x: 0, y: 2840, w: 1280, h: 60 },
    { x: 1440, y: 2860, w: 1560, h: 100 },
    { x: 0, y: 2900, w: 1260, h: 60 },
    { x: 0, y: 2960, w: 1280, h: 20 },
    { x: 1460, y: 2960, w: 1540, h: 40 },
    { x: 0, y: 2980, w: 1320, h: 20 },
  ],
  // No proximity labels: nothing here is a building you can enter, and per the
  // one-label rule a visible label should mean "press space here".
  buildings: [],

  // The firewood pile in the stranded camp, lit (2026-10-16).
  fires: [{ x: 1930, y: 1168 }],
  smoke: [{ x: 1930, y: 1140 }],

  interactables: [],
  chests: [],
  battles: [],
  ambushes: [],

  // ---- NPCs (2026-10-16) ----
  // Twelve characters: the barricade garrison, the stranded camp, and Dame
  // Elspeth Varrick hiding at the secluded camp by the river (added once her
  // art arrived, 2026-10-16).
  // Voices are in audio.js's DIALOGUE_SFX. Every position was checked against
  // the real collision: standable with the 36px collider and reachable from
  // spawn. Guards face west (rotation PI/2), toward anyone coming up the road.
  npcs: [
    // ---- The barricade garrison ----
    {
      id: 'abena_stoneward', name: 'Captain Abena Stoneward', role: 'CAPTAIN OF THE EASTERN BARRICADE',
      sprite: 'assets/images/captain_abena_stoneward_overhead.png',
      portrait: 'assets/images/captain_abena_stoneward.png',
      x: 2530, y: 1470, speed: 0, startsHome: false, rotation: Math.PI / 2,
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
      x: 2545, y: 1545, speed: 0, startsHome: false, rotation: Math.PI / 2,
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
      id: 'arjun_talwar', name: 'Arjun Talwar', role: 'SOLDIER OF THE CROWN',
      sprite: 'assets/images/arjun_talwar_overhead.png',
      portrait: 'assets/images/arjun_talwar.png',
      // Marches the road between the camp and the barricade.
      x: 1980, y: 1480, speed: 45, startsHome: false,
      patrol: [
        { x: 1980, y: 1480 },
        { x: 2400, y: 1500 },
      ],
      dialog: {
        line: 'Halt! State your business! ...Sorry. The captain says I’m to challenge everyone. You’re not trying to go east, are you? Good. Carry on, then.',
        responses: ['Leave.'],
      },
      chatter: [
        { q: 'Is it always this quiet?', a: 'Quiet? I’ve heard more shouting in this camp than in my whole year of training. Most of it from the gentleman in the burgundy coat.' },
        { q: 'What would you do if someone tried to get through?', a: 'Exactly what the captain told me to do. I’d go and get the captain.' },
      ],
    },
    {
      id: 'brigid_fallow', name: 'Brigid Fallow', role: 'LOOKOUT',
      sprite: 'assets/images/brigid_fallow_overhead.png',
      portrait: 'assets/images/brigid_fallow.png',
      x: 2440, y: 1360, speed: 0, startsHome: false, rotation: Math.PI / 2,
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
      x: 2060, y: 1250, speed: 25, startsHome: false,
      patrol: [
        { x: 2060, y: 1250 },
        { x: 2100, y: 1330 },
        { x: 2030, y: 1310 },
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
      x: 1910, y: 1340, speed: 0, startsHome: false,
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
      x: 1640, y: 1070, speed: 0, startsHome: false, rotation: -Math.PI / 2,
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
      x: 2250, y: 1360, speed: 20, startsHome: false,
      patrol: [
        { x: 2250, y: 1360 },
        { x: 2380, y: 1385 },
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
      x: 2300, y: 1180, speed: 0, startsHome: false,
      dialog: {
        line: 'Thread, needles, buttons, ribbons. All of it for sale, none of it going anywhere. Neither am I, apparently.',
        responses: ['Leave.'],
      },
      chatter: [
        { q: 'How’s business?', a: 'Wonderful. Everyone in this camp has had a week to notice every hole in their clothes. I’ve sold more thread here than in a month on the road, and I still hate it.' },
        { q: 'Heard anything worth knowing?', a: 'The lord in the burgundy coat has a letter he thinks will get him through. He has shown it to the captain six times. I’m waiting to see whether it works on the seventh.' },
      ],
    },
    {
      id: 'tesfaye_lark', name: 'Tesfaye Lark', role: 'MINSTREL',
      sprite: 'assets/images/tesfaye_lark_overhead.png',
      portrait: 'assets/images/tesfaye_lark.png',
      x: 1995, y: 1200, speed: 0, startsHome: false, rotation: Math.PI / 2,
      dialog: {
        line: 'Requests are a copper. Silence is two. You’d be surprised how many people in this camp pay for the silence.',
        responses: ['Leave.'],
      },
      chatter: [
        { q: 'Will you play something?', a: 'I would, but the only song anyone asks for this week is the one about the princess, and I’ve played it until I hate it. Nobody knows how it ends yet. That’s the trouble with writing it now.' },
        { q: 'How did you end up here?', a: 'I was walking east to play a wedding. I assume the wedding went ahead without me. I hope the bride found someone who knows more than four songs.' },
      ],
    },
    {
      id: 'vikram_ashvale', name: 'Vikram Ashvale', role: 'MINOR LORD',
      sprite: 'assets/images/vikram_ashvale_overhead.png',
      portrait: 'assets/images/vikram_ashvale.png',
      // Planted in front of the captain, facing her (east).
      x: 2455, y: 1430, speed: 0, startsHome: false, rotation: -Math.PI / 2,
      dialog: {
        line: 'Do you know who I am? No, of course you do not. Neither, it seems, does that captain, which is why I have stood on this road for nine days holding a letter of passage from the Lord Chancellor himself.',
        responses: ['Leave.'],
      },
      chatter: [
        { q: 'Let me see the letter.', a: 'It is addressed to the Warden of the Eastern Road and grants me passage on urgent matters of estate. The captain informs me there is no Warden of the Eastern Road anymore. There is only her. I find that answer unacceptable.' },
        { q: 'What urgent matters?', a: 'My estate. My lands. My rents, which are going uncollected while I stand in a field with tradespeople. You may laugh. Everyone else does.' },
      ],
    },
    // ---- The secluded camp by the river ----
    {
      id: 'elspeth_varrick', name: 'Dame Elspeth Varrick', role: 'KNIGHT OF THE CROWN',
      sprite: 'assets/images/dame_elspeth_varrick_overhead.png',
      portrait: 'assets/images/dame_elspeth_varrick.png',
      // A survivor of the king's search party, hiding wounded beside her tent.
      // Says the north was all cold and that they never once saw the wizard;
      // that is as close to the twist as anything in B4 gets.
      x: 930, y: 2180, speed: 0, startsHome: false, rotation: Math.PI / 2,
      dialog: {
        line: 'Easy. Easy. I’m not going to hurt you, and I’d ask you to return the favor. Are you from the barricade? No? Good. Then you didn’t see me.',
        responses: ['Leave.'],
      },
      chatter: [
        { q: 'Who are you?', a: 'Dame Elspeth Varrick, Knight of the Crown. One of the knights the king sent north after his daughter. There were twenty of us when we rode out. I’m what came back.' },
        { q: 'What happened up there?', a: 'Cold like you wouldn’t believe, past the cliffs. Ice on the inside of our helms. We climbed for days and never saw the wizard. Not once. Not a fire, not a footprint. Only the cold, worse the closer we got, and then something in the ice I still can’t put a name to.' },
        { q: 'Why are you hiding?', a: 'Because the captain at that barricade would have to report me, and the king would want to know why I’m alive when nineteen good knights aren’t. I don’t have an answer for him yet. When I do, I’ll walk into Kingsreach myself.' },
        { q: 'Your wounds look bad.', a: 'They’re healing. Slowly. The river’s cold and clean, and nobody comes this way. Don’t fuss. Just don’t tell anyone I’m here.' },
      ],
    },
  ],

  exits: [
    { edge: 'bottom', xMin: 1338, xMax: 1441, to: 'C4', note: 'the road south into the C4 woods' },
    { edge: 'left', yMin: 1358, yMax: 1601, to: 'B3', note: 'the king’s road west to Kingsreach' },
  ],
};
