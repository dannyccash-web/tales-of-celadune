// Item catalog — definitions for everything that can live in the Items tab
// (consumables, potions, resources, quest items...). This is the game-wide
// catalog (unlike js/data/<scene>.js, which is scene-specific); inventory
// *state* (what the player actually has) lives in js/main.js and references
// entries here by id.
//
// Battle-related fields (2026-07-08):
// - slot: which equip slot this item goes in, or omitted/null if it can't be
//   equipped at all. One of 'head' | 'clothing' | 'feet' | 'hands' (Equipment
//   tab) or 'mainhand' | 'offhand' (Weapons tab). Equipping is handled in
//   main.js (equipItem/unequipItem) — only one item per slot at a time.
// - damage: a mainhand weapon's damage-per-hit. A flat number (dagger: 2) or
//   a {min,max} range for weapons with variance (none yet). Unarmed (no
//   mainhand equipped) does 1 damage — see main.js's weaponDamage().
// - attackBonus / defenseBonus: flat modifiers added to the player's base
//   Attack/Defense stat while equipped (see main.js's effectiveAttack()/
//   effectiveDefense()). Omitted = +0. No items grant these yet.
// - heal: HP restored when Used (health_potion only so far).
export default {
  vegetable_crate: {
    id: 'vegetable_crate',
    name: 'Crate of Vegetables',
    image: 'assets/images/Vegetable_Crate.png',
    description: 'A crate of fresh vegetables, bound for the tavern in the village.',
    questItem: true,
  },
  dagger: {
    id: 'dagger',
    name: 'Dagger',
    image: 'assets/images/dagger.png',
    description: 'A worn but serviceable blade, etched with faint runes.',
    questItem: false,
    slot: 'mainhand',
    damage: 2,
  },
  health_potion: {
    id: 'health_potion',
    name: 'Health Potion',
    image: 'assets/images/Health_Potion.png',
    description: 'A small vial of restorative brew. Restores health when used.',
    questItem: false,
    heal: 3,
  },
};
