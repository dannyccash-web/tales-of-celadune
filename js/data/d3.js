// Scene D3 — FARM (overworld row D, column 3)
// World coordinates: 2400x2400. Origin top-left.
// Obstacles are AABB rects {x, y, w, h} the player cannot pass through.

export default {
  id: 'D3',
  name: 'Farm',
  background: 'assets/images/D3_Background.jpg',
  width: 2400,
  height: 2400,

  // Where the player appears when the scene loads fresh (near the path junction)
  spawn: { x: 1194, y: 1399 },

  // Traced from a 25px grid overlay on D3_Background.jpg, conservative rule:
  // any cell containing part of an object is fully blocked. All edges are
  // multiples of 25.
  obstacles: [
    // --- Trees (gaps left/right at the main horizontal path, y ~900-985) ---
    { x: 0, y: 0, w: 2400, h: 293, note: 'tree line, top (extended to y0 after 74px downward art shift, 2026-08-13)' },
    { x: 188, y: 293, w: 250, h: 63, note: 'canopy bump, top-left' },
    { x: 688, y: 293, w: 281, h: 94, note: 'canopy bump, top-mid' },
    { x: 1719, y: 293, w: 231, h: 31, note: 'tree cluster, top-right' },
    { x: 1950, y: 293, w: 206, h: 94, note: 'canopy bump, top-right corner' },
    { x: 0, y: 293, w: 188, h: 656, note: 'tree line, left (to y700)' },
    { x: 0, y: 949, w: 125, h: 219, note: 'tree line, left thin (y700-875)' },
    { x: 0, y: 1312, w: 63, h: 906, note: 'tree edge, left below path' },
    { x: 2156, y: 293, w: 244, h: 219, note: 'tree line, right upper' },
    { x: 2094, y: 512, w: 306, h: 250, note: 'canopy bulge, right (y350-550)' },
    { x: 2219, y: 762, w: 181, h: 406, note: 'tree line, right (y550-875)' },
    { x: 2250, y: 1312, w: 150, h: 406, note: 'tree line, right below path' },
    { x: 2156, y: 1699, w: 244, h: 281, note: 'canopy bulge, right lower' },
    { x: 2000, y: 1949, w: 400, h: 525, note: 'forest, bottom-right corner' },
    { x: 1563, y: 2137, w: 438, h: 338, note: 'trees, bottom (right of barn)' },
    { x: 969, y: 2168, w: 294, h: 306, note: 'trees, bottom (left of barn)' },
    { x: 0, y: 2156, w: 2400, h: 244, note: 'tree line, bottom (kept at 2156 so it still covers to canvas edge after 74px shift, 2026-08-13)' },
    { x: 0, y: 2168, w: 250, h: 63, note: 'tree edge, bottom-left' },
    { x: 188, y: 2105, w: 313, h: 188, note: 'tree, lower-left' },

    // --- Crop fields (planted rows — walk the paths and grass instead).
    // Each field is split around one walkable dirt lane (a worker path
    // between rows, ~50px — the narrower row-to-row furrows are too tight
    // for the 36px collider even where they're technically clear dirt).
    { x: 188, y: 324, w: 156, h: 594, note: 'crop field, upper-left, west of the lane' },
    { x: 406, y: 324, w: 531, h: 594, note: 'crop field, upper-left, east of the lane (lane: x275-325)' },
    { x: 1438, y: 324, w: 344, h: 844, note: 'crop field, upper-right, west of the lane' },
    { x: 1844, y: 324, w: 313, h: 844, note: 'crop field, upper-right, east of the lane (lane: x1425-1475)' },
    { x: 2156, y: 762, w: 94, h: 406, note: 'crop field, upper-right east strip' },
    { x: 938, y: 1012, w: 219, h: 188, note: 'hedge crops, left of barn lane' },
    { x: 1250, y: 1012, w: 219, h: 188, note: 'hedge crops, right of barn lane' },
    { x: 63, y: 1355, w: 250, h: 813, note: 'crop field, lower-left, west of the lane' },
    { x: 375, y: 1355, w: 719, h: 813, note: 'crop field, lower-left, east of the lane (lane: x250-300)' },
    { x: 1688, y: 1324, w: 563, h: 844, note: 'crop field, lower-right (west edge pulled in to x1350 — lane: x1300-1350, joins the corridor by the pen/silo)' },

    // --- Buildings & structures ---
    { x: 1000, y: 543, w: 375, h: 375, note: 'farmhouse + pergola (Mirelle’s home)' },
    { x: 563, y: 980, w: 219, h: 219, note: 'small barn 1 + barrels' },
    { x: 781, y: 980, w: 188, h: 219, note: 'small barn 2 + barrels' },
    { x: 1438, y: 980, w: 219, h: 219, note: 'small barn 3 + barrels' },
    { x: 406, y: 1043, w: 94, h: 156, note: 'well + frame' },
    // Fenced pen — hollow (fence perimeter only) so Gaffer has room to
    // move inside; interior is x1075-1225, y1025-1200, clear. Re-traced
    // 2026-07-07: the original trace (south rail at y1275-1300) had the
    // pen ~75px taller than the actual fence art, which let Gaffer wander
    // south of the real fence line before ever tripping a collision — the
    // real fence rectangle (posts + rails, confirmed via pixel-grid crop of
    // D3_Background.jpg) sits at roughly x1075-1250, y1000-1200.
    { x: 1313, y: 1324, w: 250, h: 31, note: 'fenced pen, north rail' },
    { x: 1313, y: 1574, w: 250, h: 31, note: 'fenced pen, south rail' },
    { x: 1313, y: 1324, w: 31, h: 281, note: 'fenced pen, west rail' },
    { x: 1531, y: 1324, w: 31, h: 281, note: 'fenced pen, east rail' },
    // Player-only ground: the grass between the (now-correctly-sized) pen and
    // the silo is open so the player can walk it. NPCs are kept out via the
    // npcOnly rect below — this exact pocket (bounded by the pen, silo, and
    // barn) is the one CLAUDE.md already warns about: an NPC crossing near the
    // pen's NW corner (Tuckwell/Brenna's shared y940 path) can get deflected
    // south into it and never find its way back out (escaping needs a turn
    // sharper than steer()'s ~126° limit). Confirmed via headless sim: with
    // this rect removed, Tuckwell's routine throughput dropped from ~70
    // loops/10,000s to 8. Doesn't touch Mirelle's x925-1000 barn-lane route.
    { x: 1313, y: 1605, w: 156, h: 125, npcOnly: true, note: 'NPC-only guard: keeps NPCs out of the pen/silo/barn pocket' },
    { x: 1469, y: 1637, w: 156, h: 188, note: 'silo' },
    { x: 1156, y: 1730, w: 375, h: 344, note: 'bottom barn (roof extent)' },
    { x: 1344, y: 2074, w: 125, h: 94, note: 'bottom barn, south porch' },
    { x: 1531, y: 1824, w: 94, h: 344, note: 'barrels, right of bottom barn' },
    { x: 1125, y: 1887, w: 63, h: 156, note: 'barrels, left of bottom barn' },
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
    { label: 'Mirelle’s Farmhouse', x: 1190, y: 924, r: 213, door: { x: 1190, y: 949 } },
    { label: 'Tuckwell’s House', x: 671, y: 1143, r: 163, door: { x: 671, y: 1230 } },
    { label: 'Brenna’s House', x: 875, y: 1143, r: 163, door: { x: 875, y: 1230 } },
    { label: 'Your House', x: 1546, y: 1143, r: 163, door: { x: 1546, y: 1230 } },
    // No standalone 'Well' label here (2026-07-21): the well is interactable
    // (drink / toss a coin — see the interactable below), so its label rides on
    // that object, same as the silo — label shows exactly when you can press
    // space to interact.
    // No standalone 'Silo' label here: the silo IS interactable (the corn
    // interactable below), so its label rides on that object instead — same
    // anchor + range, so the label appears exactly when you can press space
    // (2026-07-20, Danny: a visible label must always mean "interactable").
    { label: 'Old Barn', x: 1288, y: 1805, r: 213 },
  ],

  // Building entrances (interiors come later) — where building meets path
  entrances: [
    { x: 1188, y: 918, w: 75, h: 30, to: 'mirelle_home', note: 'farmhouse door, meets vertical path' },
    { x: 1250, y: 1705, w: 75, h: 25, to: 'bottom_barn', note: 'bottom barn door, meets lower vertical path' },
  ],

  // Hidden collectibles: invisible trigger areas with no sprite — only a
  // label appears once the player is close (same pattern as building labels),
  // and spacebar grants the reward once. `range` doubles as both the label
  // and interact radius, matching INTERACT_RANGE (90) by default.
  interactables: [
    {
      id: 'shiny-field-north',
      x: 1188, y: 474, w: 100, h: 100,
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
      x: 453, y: 1118,
      range: 163,
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
      x: 1588, y: 1624,
      range: 163,
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
      door: { x: 1288, y: 1705 },
      enemies: ['blight_rat'],
      background: 'assets/images/barn_interior.jpg', // battle backdrop (2026-07-22)
      emptyMessage: 'The barn is empty.', // shown if you return after clearing it (2026-07-28)
    },
  ],

  // Scene exits: crossing these edges moves the player to the adjacent scene.
  // Adjacent scenes per overworld map (page 6): D2 village west, D4 woods east, C3 woods north.
  exits: [
    { edge: 'left', yMin: 1187, yMax: 1312, to: 'D2', note: 'main path west to Village' },
    { edge: 'right', yMin: 1187, yMax: 1312, to: 'D4', note: 'main path east to Woods' },
  ],

  npcs: [
    {
      id: 'mirelle',
      name: 'Mirelle',
      role: 'FARM OWNER',
      sprite: 'assets/images/Mirelle_Overhead.png',
      portrait: 'assets/images/Mirelle_Portrait.png',
      x: 1190, y: 937,
      speed: 40,
      startsHome: true,
      home: {
        door: { x: 1190, y: 949 }, // just outside the farmhouse's south face
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
        { do: 'goto', x: 1190, y: 1249 },
        { do: 'goto', x: 1250, y: 1687 }, // Old Barn entrance
        { do: 'goto', x: 1190, y: 1249 },
        { do: 'goto', x: 453, y: 1249 },   // the well
        { do: 'goto', x: 1190, y: 1249 },
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
      x: 563, y: 949, // spawns beside the upper-left field
      speed: 45,
      startsHome: false,
      home: {
        door: { x: 671, y: 1230 }, // south face of the Hay Barn (his house)
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
        { do: 'goto', x: 531, y: 949 },
        { do: 'goto', x: 531, y: 1249 },
        { do: 'goto', x: 1813, y: 1249 },   // upper-right field
        { do: 'wait', s: 10 },
        { do: 'goto', x: 1938, y: 1274 },   // lower-right field
        { do: 'wait', s: 10 },
        { do: 'goto', x: 563, y: 1299 },    // lower-left field
        { do: 'wait', s: 10 },
        { do: 'goHome' },
        { do: 'wait', s: 15 },
        { do: 'leaveHome' },
        { do: 'goto', x: 531, y: 1230 },
        { do: 'goto', x: 531, y: 949 },
        { do: 'goto', x: 563, y: 949 },    // back to the upper-left field
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
      x: 2313, y: 1249, // spawns out to the east, near the path
      speed: 45,
      startsHome: false,
      home: {
        door: { x: 875, y: 1230 }, // south face of the Tool Shed (her house)
        interior: 'assets/images/home_interior.jpg',
      },
      // Checks the animal pen, then the silo, then home for the night.
      // Route stays east of x1300 (the lower-right field's edge) while
      // dipping south, then rides the main path (y900-990) the rest of
      // the way — both clear full width, so nothing here clips a building.
      routine: [
        { do: 'goto', x: 1613, y: 1249 },
        { do: 'goto', x: 1588, y: 1512 }, // animal pen
        { do: 'wait', s: 10 },
        { do: 'goto', x: 1588, y: 1593 }, // silo
        { do: 'wait', s: 10 },
        { do: 'goto', x: 1588, y: 1249 },
        { do: 'goto', x: 875, y: 1249 },
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
      x: 1438, y: 1399,
      speed: 30,
      // No home — Gaffer lives in the pen and just wanders its interior
      // (x1075-1225, y1025-1200, clear — see the hollow pen rects above).
      // Patrol points sit >=25px inside that clear box so the 36px collider
      // never touches the fence rails.
      patrol: [
        { x: 1388, y: 1399 },
        { x: 1488, y: 1399 },
        { x: 1438, y: 1524 },
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
      x: 1546, y: 1230,
      startsHome: true,
      home: {
        door: { x: 1546, y: 1230 },
        interior: 'assets/images/home_interior.jpg',
      },
      description: 'Your modest one-room home on the farm — a cot, a hearth, and whatever you’ve managed to set aside.',
      items: ['dagger', 'health_potion'],
    },
  ],
};
