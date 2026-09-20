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
// - magicCost (2026-09-10, Ysra's Staff): magic points spent from the player's
//   pool per attack with this weapon. main.js's showPlayerActions grays the
//   slot out (like an empty Use) whenever stats.magic is below this. Owning
//   the first item with a magicCost reveals the HUD's magic bar for good (see
//   main.js's addItem/magicRevealed) — it starts hidden, since no magic-cost
//   item exists until Ysra's Staff drops.
// - cursed (2026-09-10, Ysra's Staff): NOT surfaced anywhere in the UI — the
//   item's own description reads like an ordinary (if unusually strong) off-
//   hand weapon. Mechanically, though, every attack with it backfires: see
//   main.js's playerAttack, which skips the normal hit roll entirely and
//   costs the player 1 HP instead of damaging the enemy. Intentionally never
//   disclosed in-game.
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
// ---- ENCHANTING (Orris Fenwick, C2, 2026-09-18) ----------------------------
// Orris upgrades a plain weapon using a reagent the player is carrying. Rather
// than mutating the item in place (the catalog is keyed by id and the save
// stores ids, so a mutated entry would not survive a reload), every
// combination exists as its own catalog entry, GENERATED at module load from
// the table below. That means an enchanted weapon is just another item id —
// inventory, equipment, the save and the Stats panel all handle it for free.
//
// A weapon is enchantable only if it has NOTHING going on but damage — Danny's
// rule, and the reason Mara's Cutlass is excluded (its bonusDamageVs). That is
// enforced with an ALLOW-list of harmless keys rather than a deny-list of
// gimmick ones, so a future weapon with some new trick is excluded
// automatically instead of silently slipping through.
const PLAIN_WEAPON_KEYS = new Set([
  'id', 'name', 'image', 'description', 'slot', 'damage', 'price', 'questItem',
  'enchant', 'glow', 'baseId', 'reagentId',
]);
export function isEnchantable(item) {
  return !!item
    && item.slot === 'mainhand'
    && item.damage != null
    && !item.enchant                                   // one enchantment per weapon
    && Object.keys(item).every((k) => PLAIN_WEAPON_KEYS.has(k));
}

// Each enchantment: the reagent that buys it, the word that goes in front of
// the weapon's name, the proc chance, and the colour the item image glows.
// `kind` is what main.js's playerAttack switches on when a hit lands.
// Trimmed 2026-09-19 to the two Danny re-specified. Metallic Ore (which was
// "Honed", +2 damage) and Lily's Mysterious Rock (which was "Echoing") are no
// longer enchantments: the ore belongs to Sorcha's longsword quest and nothing
// else, and the rock is now a LEAD rather than a reagent — Orris marvels at it,
// admits he can't read it, and points the player at Kingsreach. That drops the
// generated variants from 12 to 6.
export const ENCHANTS = {
  rootweaver_heart: {
    id: 'ensnare', kind: 'ensnare', reagentId: 'rootweaver_heart',
    prefix: 'Ensnaring', chance: 0.20, glow: '#d08b2c',
    blurb: 'Roots answer the blade: a 20% chance on any hit to bind a foe fast, costing it its next turn.',
    procMessage: (t) => `Roots burst from the earth and bind the ${t} fast!`,
  },
  spider_fang: {
    id: 'venomous', kind: 'poison', reagentId: 'spider_fang', poison: 1,
    prefix: 'Venomous', chance: 0.25, glow: '#5fd35f',
    blurb: 'Fang-bitten steel: a 25% chance on any hit to envenom a living foe, festering for 1 damage at the start of each of its turns.',
    procMessage: (t) => `The venom takes — the ${t} is envenomed!`,
  },
};

export function statLineFor(item) {
  if (item.damage != null) {
    const dmg = typeof item.damage === 'object' ? `${item.damage.min}-${item.damage.max}` : item.damage;
    // Surface a weapon's bonusDamageVs (e.g. Mara's Cutlass vs sea creatures)
    // right on its own damage stat line, not just in the separate Stats >
    // Damage panel (2026-09-12, Danny: "make sure the bonus damage... is
    // accounted for and noted in the item's damage description").
    const bonus = item.bonusDamageVs ? ` (+${item.bonusDamageVs.amount} vs ${item.bonusDamageVs.label})` : '';
    return `${dmg} DMG${bonus}`;
  }
  const parts = [];
  if (item.attackBonus) parts.push(`+${item.attackBonus} ATK`);
  if (item.defenseBonus) parts.push(`+${item.defenseBonus} DEF`);
  if (item.speedBonus) parts.push(`+${item.speedBonus} SPD`);
  return parts.length ? parts.join(' / ') : null;
}

const ITEMS = {
  vegetable_crate: {
    id: 'vegetable_crate',
    name: 'Crate of Vegetables',
    image: 'assets/images/Vegetable_Crate.png',
    description: 'A crate of fresh vegetables, bound for the tavern in the village.',
    questItem: true,
  },
  // The Maiden's Grace's lockbox (C1D, 2026-09-13) — found beside the
  // treasure chest in the ship's bottom hold, for the Roderick/Wynne
  // "c1_lockbox" quest (main.js's buildRoderickDialog/buildWynneDialog).
  // questItem: true already blocks Remove (js/ui.js) and vendor sale
  // (main.js's sell-list filter) — exactly Danny's "can't be dropped or
  // traded" — no new restriction code needed.
  lockbox: {
    id: 'lockbox',
    name: 'Sealed Lockbox',
    image: 'assets/images/enchanted_lockbox.png',
    description: 'A small iron lockbox, sealed by an enchantment older than the ship it was found on. Whatever’s inside, it isn’t opening for anyone but a warded counting house.',
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
    heal: 5,
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
    price: 45,
  },
  bread: {
    id: 'bread',
    name: 'Bread',
    image: 'assets/images/bread.png',
    description: 'A crusty loaf, still warm from the oven. Restores a little health.',
    questItem: false,
    slot: 'item',
    heal: 1,
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
    price: 20,
  },
  leather_armor: {
    id: 'leather_armor',
    name: 'Leather Armor',
    image: 'assets/images/leather_armor.png',
    description: 'Boiled-leather armor. Light on the shoulders, and enough to turn a glancing blow.',
    questItem: false,
    slot: 'clothing',
    defenseBonus: 1,
    price: 30,
  },
  leather_gloves: {
    id: 'leather_gloves',
    name: 'Leather Gloves',
    image: 'assets/images/leather_gloves.png',
    description: 'Supple leather gloves with a firm grip — steadier in the hand, surer with a blade.',
    questItem: false,
    slot: 'hands', // Equipment tab (see SLOT_CATEGORY)
    attackBonus: 1,
    price: 28,
  },
  // +1 Speed (2026-07-26) — raises the player's effective Speed, which speeds
  // overworld movement AND improves battle initiative (main.js's effectiveSpeed).
  leather_boots: {
    id: 'leather_boots',
    name: 'Leather Boots',
    image: 'assets/images/leather_boots.png',
    description: 'Well-worn travelling boots, soft and quick — they put a spring in your step and a jump on your foes.',
    questItem: false,
    slot: 'feet', // Equipment tab
    speedBonus: 1,
    price: 18,
  },
  fishing_bait: {
    id: 'fishing_bait',
    name: 'Fishing Bait',
    image: 'assets/images/fishing_bait.png',
    description: 'A tin of wriggling bait. Fish find it irresistible.',
    questItem: false,
    price: 2,
  },
  // Small Shield (2026-09-19, Danny) — spoils from C2's highwaymen. An OFF-HAND
  // weapon like the torch: it can be swung for 1 damage, but the point of it is
  // `damageReduction`, a NEW field read by main.js's damagePlayer — every point
  // of damage the player takes, from any source, is reduced by the total across
  // their equipped gear. First item in the game to carry it.
  small_shield: {
    id: 'small_shield',
    name: 'Small Shield',
    image: 'assets/images/small_shield.png',
    description: 'A banded buckler, scarred and much repaired. Turns aside 2 damage from anything that reaches you, and there is always the option of simply hitting someone with it.',
    slot: 'offhand',
    damage: 1,
    damageReduction: 1,
    price: 30,
  },
  fishing_rod: {
    id: 'fishing_rod',
    name: 'Fishing Rod',
    image: 'assets/images/fishing_rod.png',
    description: 'A sturdy fishing rod. Just the thing for landing a big one — you’ll need bait, too.',
    questItem: false,
    // Priced 2026-09-17 so Roderick Vane can stock it (C1). It used to have no
    // price on purpose ("a quest aid to hang onto"), which also made it
    // unsellable — the side effect of pricing it is that the player can now
    // sell Darius's lent rod. That is recoverable rather than a trap: Roderick
    // sells one, so a player who sells theirs mid-quest can buy another.
    price: 24,
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
  // Retrieved from the wreck of the Gull's Regret (2026-07-25). A portrait of
  // Calder Rusk's wife, Marisol — the "something more precious than gold" he
  // sends the player to recover. Turning it in to Calder completes his quest.
  marisol_rusk_painting: {
    id: 'marisol_rusk_painting',
    name: 'Portrait of Marisol',
    image: 'assets/images/marisol_rusk_painting.png',
    description: 'A small oil portrait of a dark-haired woman, wrapped in oilcloth against the sea. Salvaged from the wreck — clearly someone treasured it.',
    questItem: true,
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
  // Torch (reworked to an OFF-HAND WEAPON 2026-07-26, Danny). Used indefinitely
  // like any handheld weapon (not consumed): 1 damage on hit, and it sets
  // flammable (`wood`) foes — rootweavers, bramblekin — ALIGHT, burning them
  // for `burn` (2) at the start of every player turn (main.js's playerAttack
  // applies it; tickBurns ticks it). Also the cave light source (equipping it
  // in the off-hand lifts a `dark` scene's darkness — see main.js). Sold at
  // Emeric's general store in D2 (2026-07-28, moved there from the D1 chest).
  torch: {
    id: 'torch',
    name: 'Torch',
    image: 'assets/images/Torch.png',
    description: 'A pitch-soaked torch, wrapped and oiled. Burns bright enough to light the darkest cave — and a jab of the flame smarts in a scrap.',
    questItem: false,
    slot: 'offhand', // an off-hand weapon (Weapons tab)
    damage: 1,
    burn: 2, // per-turn burn inflicted on flammable (wood) foes
    price: 12,
  },
  // Dropped by a slain Rootweaver (2026-07-17). The Bramblekin Chief wants one
  // as proof for safe passage through his camp. A quest item — can't be sold.
  // Dropped by a slain rootweaver. The Bramblekin Chief wants one as proof for
  // safe passage — but it's NOT a quest item (2026-07-26, Danny): there's more
  // than one in the game, so it's an ordinary tradeable item with a price.
  rootweaver_heart: {
    id: 'rootweaver_heart',
    name: 'Rootweaver Heart',
    image: 'assets/images/rootweaver_heart.png',
    description: 'The dense, still-warm heartwood of a slain rootweaver. Prized by hedge-witches and camp chiefs alike.',
    questItem: false,
    price: 20,
  },
  // Spider Fang (2026-07-31, Danny) — a general item (Items tab, `slot: 'item'`,
  // like the potions) that's OFFENSIVE: equip it to the battle Use slot and use
  // it on an enemy for 1 damage, and if the foe is `poisonable` (flesh, not the
  // wood-bodied bramblekin/rootweaver) it's ENVENOMED — 1 poison damage at the
  // start of each of its own turns until it dies. Consumed on use (like a
  // potion). `useDamage` routes it through the offensive-item targeting flow;
  // `poison` is the per-tick venom (see main.js's playerUseOffensiveItem +
  // the poison tick in runQueue). Dropped 30% by the toughened cave spiders.
  spider_fang: {
    id: 'spider_fang',
    name: 'Spider Fang',
    image: 'assets/images/spider_fang.png',
    description: 'A curved, hollow fang still beaded with venom. Jab a foe with it in a scrap and the poison does the rest.',
    questItem: false,
    slot: 'item',
    useDamage: 1,
    poison: 1,
    price: 6,
  },
  // Queen Cragclaw Eggs (2026-07-31, Danny) — a 100% drop from the Cragclaw
  // Queen. A basic curio that does nothing yet (tradeable for a little gold).
  queen_cragclaw_eggs: {
    id: 'queen_cragclaw_eggs',
    name: 'Cragclaw Eggs',
    image: 'assets/images/queen_cragclaw_eggs.png',
    description: 'A clutch of leathery, faintly pulsing eggs taken from the Cragclaw Queen. Best not ask what hatches.',
    questItem: false,
    price: 10,
  },
  // Metallic Ore (2026-08-03, Danny) — a raw crafting material found lying in
  // the caves (D4B, D1B). Picked up like the "shiny object" collectible but with
  // the fishing CATCH reveal + sound. NOT a quest item (there are several in the
  // game), so it's an ordinary tradeable item; Sorcha the blacksmith wants some
  // to forge a longsword (see her quest in main.js).
  metallic_ore: {
    id: 'metallic_ore',
    name: 'Metallic Ore',
    image: 'assets/images/metallic_ore.png',
    description: 'A dense chunk of raw ore, veined with something that catches the light. A smith could make good use of this.',
    questItem: false,
    price: 8,
  },
  // Longsword (2026-08-03) — the tier above the short sword: a heavier, longer
  // blade with more bite. Sold by Sorcha the blacksmith only AFTER the player
  // brings her ore for it (her `sorcha_ore` quest). Dagger 2 / Short Sword 2-4 /
  // Longsword 4-7; priced above both (dagger 12, short sword 22, longsword 40).
  longsword: {
    id: 'longsword',
    name: 'Longsword',
    image: 'assets/images/long_sword.png',
    description: 'A long, well-forged blade — real reach and real weight behind every swing. The finest steel in the village.',
    questItem: false,
    slot: 'mainhand',
    damage: { min: 4, max: 7 },
    price: 70,
  },
  // Mara's Cutlass (C1D, 2026-09-12; renamed + bonus surfaced 2026-09-12
  // round 4) — Mara Hollowmast's reward for driving the miremen off the
  // Maiden's Grace and saving her: same base damage as the longsword, but
  // priced higher (a keepsake, not just steel) and it bites harder against
  // the sea creatures that trapped her down there — see statLineFor()
  // above, which now prints that bonus on the item's own damage line, not
  // just in the separate Stats > Damage panel (weaponDamage()/bonusDamageVs/
  // weaponEffectSummary, buildMaraHollowmastDialog).
  cutlass: {
    id: 'cutlass',
    name: 'Mara’s Cutlass',
    image: 'assets/images/maras_cutlass.png',
    description: 'Mara Hollowmast’s own blade, given in thanks for driving the miremen off the Maiden’s Grace and back into the water. Balanced for close, ugly work, and it bites harder against the things that lurk in the wreck.',
    questItem: false,
    slot: 'mainhand',
    damage: { min: 4, max: 7 },
    bonusDamageVs: { ids: ['cragclaw', 'mireman', 'cragclaw_queen'], amount: 2, label: 'sea creatures' },
    price: 55,
  },
  // Royal Summons (C4, 2026-08-02) — the king's sealed proclamation, stolen
  // from Mara Vellorne by the clearing's bramblekin and stashed in their chest.
  // A quest item (can't be sold). The player ends up KEEPING it whichever way
  // they resolve Mara's quest — a deliberate northward-pull hook toward the
  // King's Castle (B2). King Aldric of Aldermoor summoned Mara from distant
  // Vaelanor over a grave and urgent matter.
  royal_summons: {
    id: 'royal_summons',
    name: 'Royal Summons',
    image: 'assets/images/royal_summons.png',
    description: 'A sealed proclamation, heavy with the wax crest of King Aldric of Aldermoor, summoning its bearer to the castle on a matter of the gravest urgency.',
    questItem: true,
  },
  // Leather Hood (2026-07-31, Danny) — head-slot armor, +1 defense. In the D4B
  // treasure chest.
  leather_hood: {
    id: 'leather_hood',
    name: 'Leather Hood',
    image: 'assets/images/leather_hood.png',
    description: 'A snug boiled-leather hood. Turns a glancing blow and keeps the cave-drip off your neck.',
    questItem: false,
    slot: 'head',
    defenseBonus: 1,
    price: 15,
  },
  // Lily Farrow's lost-gull quest (C1, 2026-09-10). Feathers are scattered
  // across the village as a trail of clues toward the cave the gull's holed
  // up in — a basic, low-value curio, not a quest item (nothing stops the
  // player selling one, same as the old boot).
  feather: {
    id: 'feather',
    name: 'Feather',
    image: 'assets/images/feather.png',
    description: 'A downy grey-and-white feather. Could be nothing. Could be a clue.',
    questItem: false,
    price: 1,
  },
  // The gull itself, found in the cave (C1B) at the end of the feather
  // trail. A quest item (Danny's spec: can't be sold, dropped, etc.) —
  // turning it in to Lily completes c1_lily_gull.
  lily_gull: {
    id: 'lily_gull',
    name: 'Lily’s Gull',
    image: 'assets/images/gull.png',
    description: 'A grey-and-white gull, missing a feather on her left wing, cradled carefully in your arms. Lily will want to see her.',
    questItem: true,
  },
  // Lily's reward for the gull's safe return (2026-09-10) — a child's idea of
  // treasure, not literal payment. No price (like the fishing rod): it's a
  // keepsake, not merchandise.
  // Ysra Nine-Shells' drop (C1B, 2026-09-10) — LOOKS like a simply excellent
  // off-hand weapon (a strong damage range, a real gold price) and nothing in
  // its own text says otherwise. It secretly does nothing but hurt the
  // player who wields it — see main.js's playerAttack for the cursed-weapon
  // override, and the magicCost/cursed schema note above.
  staff: {
    id: 'staff',
    name: 'Ysra’s Staff',
    image: 'assets/images/ysras_staff.png',
    description: 'A length of black driftwood capped with a whorl of sea-glass, still humming faintly with whatever the Drownweft bound into it.',
    questItem: false,
    slot: 'offhand',
    damage: { min: 4, max: 8 },
    magicCost: 2,
    cursed: true,
    price: 60,
  },
  mysterious_rock: {
    id: 'mysterious_rock',
    name: 'Mysterious Rock',
    image: 'assets/images/mysterious_rock.png',
    description: 'An ordinary-looking rock Lily swears is magic. She found it on the beach herself.',
    questItem: false,
  },
};

// Build <weapon>_<enchant> for every plain weapon x every enchantment. Runs
// once at import, so the ids are stable across reloads and saves.
(function generateEnchantedWeapons(catalog) {
  const bases = Object.values(catalog).filter(isEnchantable);
  for (const base of bases) {
    for (const ench of Object.values(ENCHANTS)) {
      const id = `${base.id}_${ench.id}`;
      catalog[id] = {
        ...base,
        id,
        baseId: base.id,
        reagentId: ench.reagentId,
        name: `${ench.prefix} ${base.name}`,
        description: `${base.description} ${ench.blurb}`,
        // Worth a little more than the plain weapon, so selling one back is not
        // a downgrade. Plain price + half again, rounded.
        price: base.price ? Math.round(base.price * 1.5) : undefined,
        enchant: { kind: ench.kind, chance: ench.chance, amount: ench.amount, poison: ench.poison, key: ench.id },
        glow: ench.glow,
      };
    }
  }
})(ITEMS);

export default ITEMS;
