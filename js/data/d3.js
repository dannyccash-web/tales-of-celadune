// Scene D3 — FARM (overworld row D, column 3)
// World coordinates: 2400x2400. Origin top-left.
// Obstacles are AABB rects {x, y, w, h} the player cannot pass through.

export default {
  id: 'D3',
  name: 'Farm',
  background: 'assets/images/D3_Background.jpg',
  width: 3000,
  height: 3000,

  // Where the player appears when the scene loads fresh (near the path junction)
  spawn: { x: 1493, y: 1749 },

  // Traced from a 25px grid overlay on D3_Background.jpg, conservative rule:
  // any cell containing part of an object is fully blocked. All edges are
  // multiples of 25.
  obstacles: [
    { x: 508, y: 1304, w: 118, h: 195, note: 'well + frame' },
    // --- Auto-generated: collision delta from Danny's annotated blue/yellow overlay (2026-09-13) ---
    { x: 0, y: 0, w: 3000, h: 350, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 0, y: 350, w: 825, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 850, y: 350, w: 2150, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 0, y: 375, w: 450, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 525, y: 375, w: 25, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 875, y: 375, w: 325, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2150, y: 375, w: 850, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 0, y: 400, w: 400, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 575, y: 400, w: 200, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 975, y: 400, w: 225, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1925, y: 400, w: 125, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2150, y: 400, w: 75, h: 50, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2300, y: 400, w: 700, h: 50, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 0, y: 425, w: 350, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 625, y: 425, w: 125, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1025, y: 425, w: 175, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 0, y: 450, w: 300, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1050, y: 450, w: 150, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2175, y: 450, w: 50, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2300, y: 450, w: 75, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2450, y: 450, w: 550, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 0, y: 475, w: 275, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1100, y: 475, w: 75, h: 50, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2500, y: 475, w: 500, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 0, y: 500, w: 250, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2550, y: 500, w: 450, h: 50, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 0, y: 525, w: 225, h: 650, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1900, y: 550, w: 1100, h: 125, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 350, y: 575, w: 75, h: 575, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 500, y: 575, w: 600, h: 575, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1900, y: 675, w: 725, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2675, y: 675, w: 325, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1900, y: 700, w: 700, h: 425, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2700, y: 700, w: 300, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1250, y: 725, w: 475, h: 425, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2725, y: 725, w: 275, h: 100, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2700, y: 825, w: 300, h: 150, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2725, y: 975, w: 275, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2750, y: 1000, w: 250, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2775, y: 1025, w: 225, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2800, y: 1050, w: 200, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2825, y: 1075, w: 175, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2850, y: 1100, w: 150, h: 50, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2100, y: 1125, w: 500, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2125, y: 1150, w: 475, h: 225, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2900, y: 1150, w: 100, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 0, y: 1175, w: 150, h: 175, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2925, y: 1175, w: 75, h: 50, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1800, y: 1200, w: 200, h: 75, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 700, y: 1225, w: 200, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 975, y: 1225, w: 175, h: 275, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2950, y: 1225, w: 50, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 700, y: 1250, w: 175, h: 250, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1550, y: 1250, w: 25, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2975, y: 1250, w: 25, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1200, y: 1275, w: 200, h: 225, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1525, y: 1275, w: 475, h: 200, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 0, y: 1350, w: 100, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2275, y: 1375, w: 25, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1550, y: 1475, w: 450, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1675, y: 1600, w: 250, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1650, y: 1625, w: 325, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1650, y: 1650, w: 300, h: 50, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2125, y: 1650, w: 575, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 375, y: 1675, w: 100, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2100, y: 1675, w: 600, h: 850, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 200, y: 1700, w: 1175, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1650, y: 1700, w: 25, h: 275, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1925, y: 1700, w: 25, h: 275, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 175, y: 1725, w: 1200, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2975, y: 1725, w: 25, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 0, y: 1750, w: 50, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 125, y: 1750, w: 1250, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2900, y: 1750, w: 100, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 0, y: 1775, w: 1375, h: 925, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2850, y: 1775, w: 150, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2825, y: 1800, w: 175, h: 50, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2800, y: 1850, w: 200, h: 50, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2775, y: 1900, w: 225, h: 525, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1650, y: 1975, w: 300, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1825, y: 2000, w: 125, h: 50, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1825, y: 2050, w: 200, h: 100, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1825, y: 2150, w: 175, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1450, y: 2175, w: 525, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1450, y: 2200, w: 400, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1450, y: 2225, w: 375, h: 125, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1425, y: 2350, w: 400, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1400, y: 2375, w: 425, h: 150, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2800, y: 2425, w: 200, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2825, y: 2450, w: 175, h: 75, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1400, y: 2525, w: 300, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2100, y: 2525, w: 625, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2775, y: 2525, w: 225, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1450, y: 2550, w: 250, h: 50, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 2100, y: 2550, w: 900, h: 125, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1925, y: 2650, w: 100, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1925, y: 2675, w: 1075, h: 25, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 0, y: 2700, w: 3000, h: 300, note: 'auto: collision delta from annotated overlay, 2026-09-13' },
    { x: 1641, y: 2006, w: 195, h: 156, npcOnly: true, note: 'NPC-only guard: keeps NPCs out of the pen/silo/barn pocket' },
  ],

  // Building labels: drawn on the canvas when the player is within `r` of (x, y).
  // Centered directly over each building's door (same x as the door, y offset
  // ~70px toward the building's interior) — matching Mirelle's Farmhouse. Old
  // Barn's door faces north, so its label sits *below* the door instead (still
  // toward the interior, just the opposite direction).
  // Home-building labels carry a `door` so they show ONLY within interaction
  // range of that door (2026-07-19, matched to D2's behaviour). Label position
  // stays centered over the building itself: D3's doors sit out on the path
  // (below the houses), so "just above the door" would float the name on the
  // road — the label reads best over the building, above the door either way.
  // (Mirelle's door is on her south wall, so hers sits right above it.)
  // Well/Silo/Old Barn are structures/interactables, not home doors, so they
  // keep the plain proximity-radius reveal.
  buildings: [
    { label: 'Mirelle’s Farmhouse', x: 1488, y: 1155, r: 266, door: { x: 1488, y: 1186 } },
    { label: 'Tuckwell’s House', x: 839, y: 1429, r: 204, door: { x: 839, y: 1538 } },
    { label: 'Brenna’s House', x: 1094, y: 1429, r: 204, door: { x: 1094, y: 1538 } },
    { label: 'Your House', x: 1933, y: 1429, r: 204, door: { x: 1933, y: 1538 } },
    // No standalone 'Well' label here (2026-07-21): the well is interactable
    // (drink / toss a coin — see the interactable below), so its label rides on
    // that object, same as the silo — label shows exactly when you can press
    // space to interact.
    // No standalone 'Silo' label here: the silo IS interactable (the corn
    // interactable below), so its label rides on that object instead — same
    // anchor + range, so the label appears exactly when you can press space
    // (2026-07-20, Danny: a visible label must always mean "interactable").
    { label: 'Old Barn', x: 1610, y: 2256, r: 266 },
  ],

  // Building entrances (interiors come later) — where building meets path
  entrances: [
    { x: 1485, y: 1148, w: 94, h: 38, to: 'mirelle_home', note: 'farmhouse door, meets vertical path' },
    { x: 1563, y: 2131, w: 94, h: 31, to: 'bottom_barn', note: 'bottom barn door, meets lower vertical path' },
  ],

  // Hidden collectibles: invisible trigger areas with no sprite — only a
  // label appears once the player is close (same pattern as building labels),
  // and spacebar grants the reward once. `range` doubles as both the label
  // and interact radius, matching INTERACT_RANGE (90) by default.
  interactables: [
    {
      id: 'shiny-field-north',
      x: 1485, y: 593, w: 125, h: 125,
      label: 'A shiny object',
      reward: { gold: 3 },
    },
    // The well (2026-07-21): not a pickup — `well: true` makes main.js's
    // interact() open a dialogue window (drink for +1 HP anytime; toss a coin
    // for +1 Luck, once). Label 'Well' rides on this object so it shows exactly
    // when interactable. Anchor is the well's centre (matching the old building
    // label spot); range 130 reaches the path band just south and the x400-450
    // gap to its east — validated walkable with the 36px collider.
    {
      id: 'well',
      x: 566, y: 1398,
      range: 204,
      label: 'Well',
      well: true,
    },
    // The silo hands out exactly ONE ear of corn (Gaffer's favorite — see
    // main.js's buildGafferDialog), then reports empty forever after
    // (2026-07-10, Danny's spec — replaced the earlier infinitely-repeatable
    // version). Its single 'Silo' label rides on THIS interactable (there is no
    // separate 'Silo' building label — verified 2026-07-28; one label per thing).
    // `emptyMessage` keeps it interactive after collection — world.js's
    // nearestInteractableInRange() skips collected interactables UNLESS
    // they carry one, and main.js's interact() toasts it instead of
    // re-granting. Anchor point sits at the silo's north face, reachable
    // from the pen corridor (east), the path above, and the player-only
    // pocket west of the silo (range 130 covers all three approaches).
    {
      id: 'silo-corn',
      x: 1985, y: 2030,
      range: 204,
      label: 'Silo',
      reward: { item: 'corn' },
      message: 'You take an ear of corn from the silo.',
      emptyMessage: 'The silo is empty.',
    },
  ],

  // Battle encounters (2026-07-08): door + enemy id list (js/data/enemies.js).
  // Same proximity+spacebar trigger as a home door (world.battleNearDoor()),
  // handled in main.js's interact(). Test encounter: three Blight Rats in
  // the Old Barn (were kobolds until 2026-07-09) — door sits right where the
  // barn meets its path (matches the 'bottom_barn' entrance rect above,
  // x1000-1060,y1305).
  battles: [
    {
      id: 'old_barn_rats',
      door: { x: 1610, y: 2131 },
      enemies: ['blight_rat'],
      background: 'assets/images/barn_interior.jpg', // battle backdrop (2026-07-22)
      emptyMessage: 'The barn is empty.', // shown if you return after clearing it (2026-07-28)
    },
  ],

  // Scene exits: crossing these edges moves the player to the adjacent scene.
  // Adjacent scenes per overworld map (page 6): D2 village west, D4 woods east, C3 woods north.
  exits: [
    { edge: 'left', yMin: 1484, yMax: 1640, to: 'D2', note: 'main path west to Village' },
    { edge: 'right', yMin: 1484, yMax: 1640, to: 'D4', note: 'main path east to Woods' },
  ],

  npcs: [
    {
      id: 'mirelle',
      name: 'Mirelle',
      role: 'FARM OWNER',
      sprite: 'assets/images/Mirelle_Overhead.png',
      portrait: 'assets/images/Mirelle_Portrait.png',
      x: 1488, y: 1171,
      speed: 40,
      startsHome: true,
      home: {
        door: { x: 1488, y: 1186 }, // just outside the farmhouse's south face
        interior: 'assets/images/home_interior.jpg',
      },
      // Daily loop: rest at home, head out to check the Old Barn, draw water
      // from the well, then back home. All waypoints ride the main east-west
      // path (y900-990, clear full width) and the x925-1000 barn-lane gap /
      // x875-1050 gap south of the fields — the only clear north-south cuts
      // through the building rows, so the route never clips a building.
      routine: [
        { do: 'wait', s: 10 },
        { do: 'leaveHome' },
        { do: 'goto', x: 1488, y: 1561 },
        { do: 'goto', x: 1563, y: 2109 }, // Old Barn entrance
        { do: 'goto', x: 1488, y: 1561 },
        { do: 'goto', x: 566, y: 1561 },   // the well
        { do: 'goto', x: 1488, y: 1561 },
        { do: 'goHome' },
      ],
      // Quest test case for the item + quest systems: agreeing hands over a
      // quest item (grantItem), starts the quest (startQuest — see
      // js/data/quests.js), and keeps the dialog open for a thank-you line
      // instead of closing — see ui.js's chooseResponse()/updateDialogContent().
      dialog: {
        line: 'Oh, hello there, traveler. I’ve more vegetables than I know what to do with this week — would you carry a crate over to the tavern in the village for me?',
        responses: [
          'I’ll take them to the tavern.',
          'Not right now.',
        ],
        responseEffects: [
          {
            grantItem: 'vegetable_crate',
            qty: 1,
            startQuest: 'vegetable_delivery',
            thankYou: 'Bless you, dear. Mind the road — the tavern keeper will be glad to see these.',
          },
          null,
        ],
      },
      // Once the vegetable_delivery quest exists, main.js's resolveNpcDialog()
      // swaps in the matching status variant here instead of the offer above
      // — so asking again doesn't hand over a second crate. No 'completed'
      // variant yet since there's no tavern scene to actually turn the quest
      // in at; add one once that scene exists.
      dialogByQuestStatus: {
        vegetable_delivery: {
          // Before the crate reaches the tavern (readyToComplete condition in
          // main.js's QUEST_READY is false).
          active: {
            line: 'Any luck getting those vegetables to the tavern yet? The keeper’s probably wondering where I’ve gotten to.',
            responses: [
              'Not yet — I’ll get there.',
              'Leave.',
            ],
          },
          // Once Bram's taken the crate + paid (vegetableDeliveredToTavern) the
          // player can hand the coin over honestly or pocket it and lie — either
          // way completes the quest (see main.js giveMirelleGold/lieToMirelle).
          readyToComplete: {
            line: 'Back already! And in one piece. Did that old tavern keeper settle up for the vegetables, then?',
            responses: [
              'He did. Here’s your five gold.',
              'Afraid not — he never paid a copper.',
              'Leave.',
            ],
            responseEffects: [
              { giveMirelleGold: true },
              { lieToMirelle: true },
              null,
            ],
          },
          completed: {
            line: 'Those vegetables you ran to the tavern — half the village has had the stew by now. Thank you again, dear.',
            responses: ['Leave.'],
          },
        },
      },
    },
    {
      id: 'tuckwell',
      name: 'Tuckwell',
      role: 'FARMHAND',
      sprite: 'assets/images/Tuckwell_Overhead.png',
      portrait: 'assets/images/Tuckwell_Portrait.png',
      x: 704, y: 1186, // spawns beside the upper-left field
      speed: 45,
      startsHome: false,
      home: {
        door: { x: 839, y: 1538 }, // south face of the Hay Barn (his house)
        interior: 'assets/images/home_interior.jpg',
      },
      // Tours all four crop fields, pausing at each, then home for a longer
      // rest. Drops to the main path (y900-990, clear full width) right away
      // via the x400-450 gap between the well and his own house, and does
      // all the long east-west travel down there — the y700 band above is
      // narrow near the farmhouse/field corner and, combined with Brenna's
      // route crossing nearby, could wedge two NPCs together with no room
      // to pass. The open path has no such pinch point.
      routine: [
        { do: 'wait', s: 10 },            // upper-left field (spawn)
        { do: 'goto', x: 664, y: 1186 },
        { do: 'goto', x: 664, y: 1561 },
        { do: 'goto', x: 2266, y: 1561 },   // upper-right field
        { do: 'wait', s: 10 },
        { do: 'goto', x: 2423, y: 1593 },   // lower-right field
        { do: 'wait', s: 10 },
        { do: 'goto', x: 704, y: 1624 },    // lower-left field
        { do: 'wait', s: 10 },
        { do: 'goHome' },
        { do: 'wait', s: 15 },
        { do: 'leaveHome' },
        { do: 'goto', x: 664, y: 1538 },
        { do: 'goto', x: 664, y: 1186 },
        { do: 'goto', x: 704, y: 1186 },    // back to the upper-left field
      ],
      dialog: {
        line: 'Fields don’t tend themselves, friend. Four to walk every day, and the rats still get more than their share.',
        responses: [
          'How’s the harvest looking?',
          'Any trouble out there?',
          'Leave.',
        ],
        // followUp keeps the dialog open with his reply (see main.js's
        // applyResponseEffect) instead of the old close-on-anything behavior.
        responseEffects: [
          { followUp: 'Fair enough, fair enough. The upper fields came in heavy this year — it’s the lower ones that like to sulk. If the rain holds, the silo will be full before first frost.' },
          { followUp: 'Out here? Just rats. But if you’re bound east, into the woods — keep to the path, and I mean it. There’s things living in among those trees that don’t take kindly to folk wandering off the trail. Stay on it and you’ll be fine.' },
          null,
        ],
      },
    },
    {
      id: 'brenna',
      name: 'Brenna',
      role: 'ANIMAL KEEPER',
      sprite: 'assets/images/Brenna_Overhead.png',
      portrait: 'assets/images/Brenna_Portrait.png',
      x: 2891, y: 1561, // spawns out to the east, near the path
      speed: 45,
      startsHome: false,
      home: {
        door: { x: 1094, y: 1538 }, // south face of the Tool Shed (her house)
        interior: 'assets/images/home_interior.jpg',
      },
      // Checks the animal pen, then the silo, then home for the night.
      // Route stays east of x1300 (the lower-right field's edge) while
      // dipping south, then rides the main path (y900-990) the rest of
      // the way — both clear full width, so nothing here clips a building.
      routine: [
        { do: 'goto', x: 2016, y: 1561 },
        { do: 'goto', x: 1985, y: 1890 }, // animal pen
        { do: 'wait', s: 10 },
        { do: 'goto', x: 1985, y: 1991 }, // silo
        { do: 'wait', s: 10 },
        { do: 'goto', x: 1985, y: 1561 },
        { do: 'goto', x: 1094, y: 1561 },
        { do: 'goHome' },
        { do: 'wait', s: 15 },
        { do: 'leaveHome' },
      ],
      // Fallback dialog — in practice never shown once the barn_rat quest
      // variants below exist (they cover every status incl. 'none'), but
      // kept as the safety net resolveNpcDialog() falls back to.
      dialog: {
        line: 'The animals are settled for now. Silo’s fuller than last season, at least — small mercies.',
        responses: [
          'Need a hand with the animals?',
          'What’s in the silo?',
          'Leave.',
        ],
      },
      // Brenna's rat quest (2026-07-10, Danny's spec). `readyToComplete` is a
      // pseudo-status (see main.js's resolveNpcDialog): used instead of
      // 'active' once the quest's world condition is met — here, the Old
      // Barn encounter being defeated (QUEST_READY in main.js).
      dialogByQuestStatus: {
        barn_rat: {
          none: {
            line: 'Well now, look who’s come wandering by. Day’s work is nearly done... feel like a roll in the hay?',
            responses: [
              'Sure, why not?',
              'No, thank you.',
            ],
            responseEffects: [
              {
                startQuest: 'barn_rat',
                noBack: true, // going back would re-show the already-answered offer
                followUp: 'Great! There’s a blight rat holed up in the Old Barn, and I’m not setting foot near the hay while it’s scratching about. Go clear it out for me, would you?',
              },
              { followUp: 'Oh well. You’re missing out on the fun.' },
            ],
          },
          active: {
            line: 'That rat in the barn — have you dealt with it yet? I can hear it gnawing clear across the yard.',
            responses: [
              'Not yet. I’m working on it.',
              'Leave.',
            ],
          },
          readyToComplete: {
            line: 'You actually did it! The barn’s finally quiet. You’re a dear — here, five gold for your trouble.',
            responses: [
              'Happy to help.',
            ],
            responseEffects: [
              { addGold: 5, completeQuest: 'barn_rat' },
            ],
          },
          completed: {
            line: 'Well, well — the great rat-catcher returns. Barn’s quiet, hay’s whole, not a whisker in sight. Suppose you do serve a purpose around here after all. ...Thank you, truly. I mean it.',
            responses: [
              'Leave.',
            ],
          },
        },
      },
    },
    {
      id: 'gaffer',
      name: 'Old Gaffer',
      role: 'GOAT',
      sprite: 'assets/images/Gaffer_Overhead.png',
      portrait: 'assets/images/Gaffer_Portrait.png',
      x: 1798, y: 1749,
      speed: 30,
      // No home — Gaffer lives in the pen and just wanders its interior
      // (x1075-1225, y1025-1200, clear — see the hollow pen rects above).
      // Patrol points sit >=25px inside that clear box so the 36px collider
      // never touches the fence rails.
      patrol: [
        { x: 1735, y: 1749 },
        { x: 1860, y: 1749 },
        { x: 1798, y: 1905 },
      ],
      dialog: {
        line: 'Gaffer fixes you with a flat yellow stare, lets out a low bleat, and goes back to chewing on a fence post.',
        // "Offer him..." only appears once the player is actually carrying
        // corn — main.js's buildGafferDialog swaps in the feed option then.
        // With no corn, it's just pet-or-leave.
        responses: [
          'Pet Gaffer.',
          'Leave.',
        ],
        // Parallel to `responses` — an optional effect applied when that
        // response is chosen. See main.js's openNpcDialog/onResponse.
        responseEffects: [
          { damage: 1, message: 'Gaffer nips you! -1 health.' },
          null,
        ],
      },
    },
    // "Your House" (was labeled Storehouse — see the buildings entry above)
    // is an unoccupied building: modeled as a place in this same npcs array
    // rather than a parallel system, since it reuses almost everything an
    // NPC home already has — door proximity, the interior-image swap,
    // startsHome/atHome (permanently true here: no routine, so it never
    // leaves) — for free. `isPlace: true` is what tells main.js/ui.js to
    // render it differently (blank role, description in place of a dialogue
    // line, a "Contents" list instead of a portrait, dynamic "Take {item}"
    // responses) instead of treating it like a talking NPC. Door sits 25px
    // south of the barn's south face (x1150-1325,y725-900), matching the
    // same offset used for Tuckwell's/Brenna's doors off their own houses.
    {
      id: 'your_house',
      isPlace: true,
      name: 'Your House',
      x: 1933, y: 1538,
      startsHome: true,
      home: {
        door: { x: 1933, y: 1538 },
        interior: 'assets/images/home_interior.jpg',
      },
      description: 'Your modest one-room home on the farm — a cot, a hearth, and whatever you’ve managed to set aside.',
      items: ['dagger', 'health_potion'],
    },
  ],
};
