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
  kobold: {
    id: 'kobold',
    name: 'Kobold',
    portrait: 'assets/images/kobold.png',
    health: 10,
    attack: 2,
    defense: 1,
    speed: 8,
    damage: { min: 1, max: 3 },
  },
};
