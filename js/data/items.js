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
//
// Inventory categories (2026-07-09, per Danny's spec): every item belongs to
// exactly one of four top-level categories — Equipment, Weapons, Magic, or
// Items — and only ever appears in that one category's tab in the Inventory
// panel (an equippable item like the dagger does NOT also show up in Items).
// Equipment/Weapons/Magic each have subcategories (their `slot` values) that
// further classify what goes in them. categoryFor() derives the category
// straight from `slot` rather than storing it redundantly on each item, so
// there's one source of truth — if a future item's slot isn't in SLOT_CATEGORY
// below (e.g. a real magic-item slot, once those exist), add it there.
const SLOT_CATEGORY = {
  head: 'equipment', clothing: 'equipment', feet: 'equipment', hands: 'equipment',
  mainhand: 'weapons', offhand: 'weapons',
  // 'item' (2026-07-10): the battle Use slot — an Items-category consumable
  // (e.g. the Health Potion) equipped from the Items tab shows up in the
  // battle UI's Use diamond and is consumed from there (one use = one turn).
  item: 'items',
};

export function categoryFor(item) {
  if (!item.slot) return 'items';
  return SLOT_CATEGORY[item.slot] || 'magic';
}

// Subcategory (individual equip slot) breakdown within Equipment/Weapons,
// used by the Inventory panel to render one header+grid section per slot
// (2026-07-09 rework, matched to Danny's mockup: e.g. Weapons > Main Hand /
// Off Hand, each its own labeled section with every owned item for that
// slot — not a single shared grid). Order here is display order.
export const CATEGORY_SLOTS = {
  equipment: ['head', 'clothing', 'feet', 'hands'],
  weapons: ['mainhand', 'offhand'],
};

export const SLOT_LABEL = {
  head: 'Head', clothing: 'Clothing', feet: 'Feet', hands: 'Hands',
  mainhand: 'Main Hand', offhand: 'Off Hand',
};

// Short secondary stat line shown under an item's name on its tile within
// Equipment/Weapons (e.g. "2 DMG" for the dagger, per Danny's mockup) — null
// if the item has nothing worth showing yet (armor with no bonuses set).
export function statLineFor(item) {
  if (item.damage != null) {
    const dmg = typeof item.damage === 'object' ? `${item.damage.min}-${item.damage.max}` : item.damage;
    return `${dmg} DMG`;
  }
  const parts = [];
  if (item.attackBonus) parts.push(`+${item.attackBonus} ATK`);
  if (item.defenseBonus) parts.push(`+${item.defenseBonus} DEF`);
  return parts.length ? parts.join(' / ') : null;
}

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
  corn: {
    id: 'corn',
    name: 'Corn',
    image: 'assets/images/Corn.png',
    description: 'An ear of dried corn from the silo. A certain goat would trade his soul for this.',
    questItem: false,
  },
  health_potion: {
    id: 'health_potion',
    name: 'Health Potion',
    image: 'assets/images/Health_Potion.png',
    description: 'A small vial of restorative brew. Restores health when used.',
    questItem: false,
    slot: 'item', // equips to the battle Use slot; stays in the Items tab (see SLOT_CATEGORY)
    heal: 3,
  },
};
