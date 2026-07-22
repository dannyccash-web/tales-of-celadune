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
    wood: true, // thorn/bramble body — flammable
    drops: { gold: { min: 10, max: 18 }, loot: [{ id: 'health_potion', chance: 0.5 }, { id: 'magic_potion', chance: 0.2 }] },
  },

  // Rootweaver (D4 shortcut ambushes, 2026-07-11) — a deliberate "too tough
  // for now" wall: high HP + hard hits so a fresh player (5 HP, atk1/def1,
  // 1–2 dmg) can't grind it down before dying, and is meant to FLEE. Not
  // absurd though — atk4/def3/15hp, not a 50-HP raid boss — so it becomes
  // beatable later with a few levels + real gear. Rolls 2d4 (2–8) damage.
  rootweaver: {
    id: 'rootweaver',
    name: 'Rootweaver',
    portrait: 'assets/images/rootweaver.png',
    health: 10,
    attack: 4,
    defense: 3,
    speed: 9,
    damage: { min: 2, max: 5 },
    wood: true, // living wood — a torch sets it ablaze (see main.js)
    // Loot on death (2026-07-17, reworked 2026-07-21 to the unified schema):
    // the heart (the Bramblekin Chief's proof for safe passage, guaranteed) +
    // the fattest purse of any foe, befitting the toughest fight. `ensnare:
    // true` makes the first flee attempt against it fail (see playerFlee).
    drops: { gold: { min: 18, max: 30 }, loot: [{ id: 'rootweaver_heart', chance: 1 }, { id: 'vitality_potion', chance: 0.35 }] },
    ensnare: true,
  },
};
