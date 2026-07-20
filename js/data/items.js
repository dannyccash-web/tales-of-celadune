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
// - price: the shop BUY cost in gold (2026-07-12). Vendors sell for this;
//   they buy back from the player at half (sellValue() = floor(price/2), in
//   main.js). Quest items have no price and can't be sold. Items without a
//   price can't be bought or sold anywhere.
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
    price: 12,
  },
  corn: {
    id: 'corn',
    name: 'Corn',
    image: 'assets/images/Corn.png',
    description: 'An ear of dried corn from the silo. A certain goat would trade his soul for this.',
    questItem: false,
    price: 2,
  },
  health_potion: {
    id: 'health_potion',
    name: 'Health Potion',
    image: 'assets/images/Health_Potion.png',
    description: 'A small vial of restorative brew. Restores health when used.',
    questItem: false,
    slot: 'item', // equips to the battle Use slot; stays in the Items tab (see SLOT_CATEGORY)
    heal: 3,
    price: 8,
  },
  // Consumables (2026-07-16). `restoreMagic` and `vitality` mirror `heal` as
  // Use effects (see main.js's useConsumable): restoreMagic tops up the magic
  // pool (no magic system yet, but the stat exists), vitality permanently
  // raises maximum health by its amount.
  magic_potion: {
    id: 'magic_potion',
    name: 'Magic Potion',
    image: 'assets/images/Magic_Potion.png',
    description: 'A shimmering azure draught that restores magical energy.',
    questItem: false,
    slot: 'item',
    restoreMagic: 5,
    price: 10,
  },
  vitality_potion: {
    id: 'vitality_potion',
    name: 'Vitality Potion',
    image: 'assets/images/Vitality_Potion.png',
    description: 'A rare tonic said to fortify the body for good — permanently raises maximum health by 1.',
    questItem: false,
    slot: 'item',
    vitality: 1,
    price: 30,
  },
  bread: {
    id: 'bread',
    name: 'Bread',
    image: 'assets/images/bread.png',
    description: 'A crusty loaf, still warm from the oven. Restores a little health.',
    questItem: false,
    slot: 'item',
    heal: 2,
    price: 2,
  },
  short_sword: {
    id: 'short_sword',
    name: 'Short Sword',
    image: 'assets/images/short_sword.png',
    description: 'A well-balanced blade — longer reach and more bite than a dagger.',
    questItem: false,
    slot: 'mainhand',
    damage: { min: 2, max: 4 },
    price: 25,
  },
  leather_armor: {
    id: 'leather_armor',
    name: 'Leather Armor',
    image: 'assets/images/leather_armor.png',
    description: 'Boiled-leather armor. Light on the shoulders, and enough to turn a glancing blow.',
    questItem: false,
    slot: 'clothing',
    defenseBonus: 1,
    price: 22,
  },
  fishing_bait: {
    id: 'fishing_bait',
    name: 'Fishing Bait',
    image: 'assets/images/fishing_bait.png',
    description: 'A tin of wriggling bait. Fish find it irresistible.',
    questItem: false,
    price: 2,
  },
  fishing_rod: {
    id: 'fishing_rod',
    name: 'Fishing Rod',
    image: 'assets/images/fishing_rod.png',
    description: 'A sturdy rod lent by Darius. Just the thing for landing a big one — you’ll need bait, too.',
    questItem: false,
    // no price -> can't be sold; it's a quest aid to hang onto
  },
  // ---- Catch items (2026-07-16) — what a fishing cast can land. Each has a
  // gold value (via price; vendors buy at half). The Moonscale Trout is both
  // the rare catch and Darius's quest target: it sells for 10 anywhere, but
  // Darius pays 20 for it (see main.js's giveDariusFish).
  trout: {
    id: 'trout',
    name: 'Trout',
    image: 'assets/images/fish_trout.png',
    description: 'A plump river trout. A fair catch, and worth a few coins.',
    price: 10,
  },
  bluegill: {
    id: 'bluegill',
    name: 'Bluegill',
    image: 'assets/images/fish_bluegill.png',
    description: 'A small, scrappy bluegill. Not much meat, but it fries up fine.',
    price: 6,
  },
  old_boot: {
    id: 'old_boot',
    name: 'Old Boot',
    image: 'assets/images/old boot.png',
    description: 'A waterlogged old boot. One careful owner, presumably. Practically worthless.',
    price: 1,
  },
  rare_fish: {
    id: 'rare_fish',
    name: 'Moonscale Trout',
    image: 'assets/images/fish_moonscale_trout.png',
    description: 'A rare, silver-scaled trout that rises only under moonlight. Darius would pay dearly for this.',
    price: 20,
  },
  lockpicks: {
    id: 'lockpicks',
    name: 'Lockpicks',
    image: 'assets/images/lockpicks.png',
    description: 'A slim set of picks and tension wrenches. For doors and chests that would rather stay shut.',
    questItem: false,
    price: 15,
  },
  // A battle consumable that equips to the Use slot (like the potions) but is
  // OFFENSIVE — using it targets an enemy for a little damage. Its fire mechanic
  // (double + a lingering burn vs wood-bodied foes) is deliberately NOT hinted
  // at in the description — that's for the player to discover (Danny, 2026-07-19).
  // useDamage = base hit; burnDamage = per-turn burn once something's alight
  // (main.js's playerUseTorch / tickBurns read these).
  torch: {
    id: 'torch',
    name: 'Torch',
    image: 'assets/images/Torch.png',
    description: 'A pitch-soaked torch, wrapped and oiled. Burns bright enough to light the darkest cave — and a jab of the flame smarts in a scrap.',
    questItem: false,
    slot: 'item', // equips to the battle Use slot; stays in the Items tab
    useDamage: { min: 1, max: 2 },
    burnDamage: { min: 2, max: 3 },
    price: 6,
  },
  // Dropped by a slain Rootweaver (2026-07-17). The Bramblekin Chief wants one
  // as proof for safe passage through his camp. A quest item — can't be sold.
  rootweaver_heart: {
    id: 'rootweaver_heart',
    name: 'Rootweaver Heart',
    image: 'assets/images/rootweaver_heart.png',
    description: 'The dense, still-warm heartwood of a slain rootweaver. The Bramblekin Chief wanted proof of the deed.',
    questItem: true,
  },
};
