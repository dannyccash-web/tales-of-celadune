// Item catalog — definitions for everything that can live in the Items tab
// (consumables, potions, resources, quest items...). This is the game-wide
// catalog (unlike js/data/<scene>.js, which is scene-specific); inventory
// *state* (what the player actually has) lives in js/main.js and references
// entries here by id.

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
  },
  // Icon pending — asset not delivered yet (see CLAUDE.md's asset-upload
  // note); path is set to where Danny should drop Health_Potion.png. The
  // item works fully in the meantime, just with a broken image until then.
  health_potion: {
    id: 'health_potion',
    name: 'Health Potion',
    image: 'assets/images/Health_Potion.png',
    description: 'A small vial of restorative brew. Restores health when used.',
    questItem: false,
  },
};
