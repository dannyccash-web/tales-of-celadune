// Enemy catalog — battle-only combatants, referenced by id from a scene's
// `battles` array (see js/data/d3.js) and instantiated fresh per encounter
// in main.js's startBattle(). Mirrors the item catalog's shape: this is the
// definition, not per-battle state (each enemy's live health etc. is its own
// copy, built in startBattle so defeating one kobold doesn't affect another).
//
// health/attack/defense/speed feed js/battle.js's d20 + score resolution
// (see resolveAttack) the same way the player's stats do. damage is a
// {min, max} range rolled via battle.rollDamage() when a hit lands on the
// player. speed drives this round's turn order (battle.turnOrder) alongside
// the player's stats.speed.
export default {
  blight_rat: {
    id: 'blight_rat',
    name: 'Blight Rat',
    portrait: 'assets/images/Blight_Rat.png',
    health: 2,
    attack: 1,
    defense: 1,
    speed: 8, // unspecified by Danny — carried over from the old kobold
    damage: 1,
    // Loot on death (2026-07-21). Unified schema: `gold: {min,max}` rolled per
    // enemy + `loot: [{id, chance?, qty?}]` (chance defaults to 1). Weakest
    // foe, so a couple of coins and nothing else. main.js's computeBattleRewards
    // aggregates every defeated enemy's drops into the victory screen.
    drops: { gold: { min: 2, max: 4 } },
  },

  // Cave Bat (D4B woods cave, 2026-07-31) — a flitting cave-dweller that drops
  // on travelers in swarms (an auto-ambush enemy, no overhead sprite; unseen
  // until it strikes). Frail like a blight rat but FAST (high speed → usually
  // acts first) and comes in numbers. Portrait cave_bat.png; no `background`,
  // so its fight uses the scene's battleBackground (the cave backdrop).
  cave_bat: {
    id: 'cave_bat',
    name: 'Cave Bat',
    portrait: 'assets/images/cave_bat.png',
    health: 2,
    attack: 1,
    defense: 1,
    speed: 12, // fast/erratic flyer — beats the player's initiative often
    damage: 1,
    drops: { gold: { min: 1, max: 3 } },
  },

  // The Bramblekin toll-camp (D4, 2026-07-11). Both share +2 attack / +2
  // defense; the Chief hits harder and has more health. damage is a
  // {min,max} range (1d4 / 1d4+1) rolled by battle.rollDamage(). speed is
  // below the player's 11 so the player generally acts first — Bramblekin a
  // touch slower than the Chief.
  bramblekin: {
    id: 'bramblekin',
    name: 'Bramblekin',
    portrait: 'assets/images/Bramblekin.png',
    health: 3,
    attack: 2,
    defense: 2,
    speed: 6,
    damage: { min: 1, max: 4 }, // 1d4
    background: 'assets/images/bramblekin_camp.jpg', // battle backdrop (2026-07-22)
    wood: true, // thorn/bramble body — catches fire from a torch (see main.js)
    drops: { gold: { min: 4, max: 8 }, loot: [{ id: 'health_potion', chance: 0.2 }] },
  },

  bramblekin_chief: {
    id: 'bramblekin_chief',
    name: 'Bramblekin Chief',
    portrait: 'assets/images/Bramblekin_Chief.png',
    health: 5,
    attack: 2,
    defense: 2,
    speed: 7,
    damage: { min: 2, max: 5 }, // 1d4+1
    background: 'assets/images/bramblekin_camp.jpg', // battle backdrop (2026-07-22)
    wood: true, // thorn/bramble body — flammable
    drops: { gold: { min: 10, max: 18 }, loot: [{ id: 'health_potion', chance: 0.5 }, { id: 'magic_potion', chance: 0.2 }] },
  },

  // Cragclaw (D1 beach, 2026-07-25) — a snapping crab-thing that mills about
  // the sand and CHARGES the player on sight (world.js creature aggro; see
  // main.js's pendingAggro). Two of them roam D1. Individually beatable by a
  // fresh player but with real bite, and there are two, so they're a genuine
  // hazard. 1v1 per encounter.
  cragclaw: {
    id: 'cragclaw',
    name: 'Cragclaw',
    portrait: 'assets/images/cragclaw.png',
    // HP 3->6 (2026-07-25); defense 3->2 (2026-07-26) — def 3 made a low-attack
    // player whiff ~57% of swings, so the fights read as a grind rather than a
    // threat. HP 6 keeps them meaty (2× a bramblekin); the Queen stays the def-3
    // wall. Drops a fatter purse + a chance at fishing bait.
    health: 6,
    attack: 2,
    defense: 2,
    speed: 9,
    damage: { min: 1, max: 2 },
    background: 'assets/images/beach_background.jpg', // battle backdrop (2026-07-25)
    drops: { gold: { min: 5, max: 10 }, loot: [{ id: 'fishing_bait', chance: 0.25 }] },
  },

  // Cragclaw Queen (D1B cave, 2026-07-26) — the big one guarding Calder's
  // stashed gold. **The boss of level D** (Danny): kept deliberately tough
  // (12hp, atk3/def3, no elemental weakness) so a fresh-off-the-beach player
  // CAN'T take her first try — she's a "come back fully geared + potion-stocked"
  // fight, not a wall you can never beat. Do NOT soften her much.
  cragclaw_queen: {
    id: 'cragclaw_queen',
    name: 'Cragclaw Queen',
    portrait: 'assets/images/queen_cragclaw.png',
    health: 12,
    attack: 3,
    defense: 3,
    speed: 8,
    damage: { min: 2, max: 4 },
    background: 'assets/images/beach_background.jpg', // battle backdrop (cragclaw kin -> beach, per Danny)
    // No vitality-potion drop (2026-07-26, Danny): vitality is permanent, so its
    // count is deliberately limited to fixed placements (the D1B chest + the
    // apothecary's stock), not random loot.
    drops: { gold: { min: 15, max: 25 } },
  },

  // Mireman (D1, 2026-07-25) — an unseen bog-thing that rises from the mire
  // when the player wanders too close (a hidden proximity ambush, exactly like
  // the D4 Rootweavers). Tougher than a cragclaw: a threatening early fight,
  // but not the Rootweaver's "flee-only" wall.
  mireman: {
    id: 'mireman',
    name: 'Mireman',
    portrait: 'assets/images/mireman.png',
    health: 5,
    attack: 2,
    defense: 2,
    speed: 7,
    damage: { min: 1, max: 3 },
    background: 'assets/images/beach_background.jpg', // battle backdrop (2026-07-25)
    drops: { gold: { min: 4, max: 9 }, loot: [{ id: 'health_potion', chance: 0.25 }] },
  },

  // Rootweaver (D4 shortcut ambushes, 2026-07-11) — a deliberate "too tough
  // for now" wall: solid HP + hard hits so a fresh player (5 HP, atk1/def1)
  // can't grind it down before dying, and is meant to FLEE. Not absurd though
  // — atk4/def3/10hp, not a raid boss — so it becomes beatable later with real
  // gear. Damage softened over time: 2–8 → 2–5 → 1–3 (2026-07-23).
  rootweaver: {
    id: 'rootweaver',
    name: 'Rootweaver',
    portrait: 'assets/images/rootweaver.png',
    health: 10,
    attack: 4,
    defense: 3,
    speed: 9,
    damage: { min: 1, max: 3 }, // softened 2-5 -> 1-3 on 2026-07-23 (Danny — still too strong)
    background: 'assets/images/forest_background.jpg', // battle backdrop (2026-07-22)
    wood: true, // living wood — a torch sets it ablaze (see main.js)
    // Loot on death (2026-07-17, reworked 2026-07-21 to the unified schema):
    // the heart (the Bramblekin Chief's proof for safe passage, guaranteed) +
    // the fattest purse of any foe, befitting the toughest fight. `ensnare:
    // true` makes the first flee attempt against it fail (see playerFlee).
    // Heart guaranteed; no vitality-potion drop (2026-07-26 — vitality is
    // permanent, kept to fixed placements only).
    drops: { gold: { min: 18, max: 30 }, loot: [{ id: 'rootweaver_heart', chance: 1 }] },
    ensnare: true,
  },
};
