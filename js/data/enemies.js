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
  },
};
