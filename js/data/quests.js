// Quest catalog — definitions for every quest in the game (id -> {name,
// description}). Quest *state* (which quests the player has, and their
// status) lives in js/main.js's `quests` array ([{id, status}], status one
// of 'active'/'completed'/'failed') and is mutated only via startQuest()
// and completeQuest().

export default {
  vegetable_delivery: {
    id: 'vegetable_delivery',
    name: 'Vegetable Delivery',
    description: 'Carry a crate of vegetables from Mirelle to the tavern in the village.',
  },
  barn_rat: {
    id: 'barn_rat',
    name: 'Rat in the Barn',
    description: 'Brenna asked you to clear the blight rat out of the Old Barn.',
  },
  rare_fish: {
    id: 'rare_fish',
    name: 'The Moonscale Trout',
    description: 'Darius lent you his rod to land the rare Moonscale Trout. You’ll want bait — the general store sells it.',
  },
};
