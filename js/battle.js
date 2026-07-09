// Turn-based combat resolution — pure functions only, no DOM/game-state
// access, so dice rolls, hit resolution, and turn order can be unit-tested
// headless in node (same convention as world.js's collision/steering logic:
// `new World({getContext:()=>({})}, scene, {})` there, plain function calls
// here). main.js owns the actual battle *state* (which enemies, whose turn,
// awaiting-target) and calls into this module for the dice; ui.js renders it.
//
// Every function takes an optional `rng` (defaults to Math.random) so tests
// can inject a deterministic or scripted sequence instead of real randomness.

export function rollD20(rng = Math.random) {
  return Math.floor(rng() * 20) + 1;
}

// Attacker succeeds only on a STRICTLY higher roll — ties favor the
// defender. Danny's spec (1d20 + Attack vs 1d20 + Defense, higher wins)
// didn't say what breaks a tie; "defense wins ties" is a common tabletop
// convention (e.g. AC-style defense) and avoids attacks feeling like a
// coin-flip freebie on a tie.
export function resolveAttack(attackerScore, defenderScore, rng = Math.random) {
  return rollD20(rng) + attackerScore > rollD20(rng) + defenderScore;
}

// damage: a flat number, or a {min, max} range (inclusive) rolled here.
export function rollDamage(damage, rng = Math.random) {
  if (typeof damage === 'number') return damage;
  const { min, max } = damage;
  return min + Math.floor(rng() * (max - min + 1));
}

// This round's turn order: every combatant passed in, sorted by `.speed`
// descending. Ties keep their original relative order (stable sort via an
// index tiebreak) rather than being randomized, so equal-speed turn order
// doesn't visibly jitter round to round and stays deterministic to test.
// Callers decide who's "alive" — pass only combatants still in the fight.
export function turnOrder(combatants) {
  return combatants
    .map((c, i) => [c, i])
    .sort(([a, ai], [b, bi]) => (b.speed - a.speed) || (ai - bi))
    .map(([c]) => c);
}
