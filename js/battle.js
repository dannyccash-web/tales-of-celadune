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
// HIT_BONUS (2026-11-12 balance pass): a flat accuracy bonus for whoever is
// swinging, player and enemy alike. Bare d20-vs-d20 with near-equal stats hit
// under 50% (attack 1 vs defense 2 was 43%), so most turns were whiffs and
// fights read as a grind (playtesters found the Miremen 'hard to hit'). +4
// puts an even match at ~66% and attack 1 vs defense 2 at ~62%. Because it
// applies to both sides, win rates barely move (simulated); fights are just
// ~30% shorter and fewer turns are wasted. Set to 0 to restore the old odds.
export const HIT_BONUS = 4;

export function resolveAttack(attackerScore, defenderScore, rng = Math.random) {
  return rollD20(rng) + attackerScore + HIT_BONUS > rollD20(rng) + defenderScore;
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
