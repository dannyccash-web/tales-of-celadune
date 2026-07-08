// Quest catalog — definitions for every quest in the game (id -> {name,
// description}). Quest *state* (which quests the player has, and their
// status) lives in js/main.js's `quests` array ([{id, status}], status one
// of 'active'/'completed'/'failed') and is mutated only via startQuest().

export default {
  vegetable_delivery: {
    id: 'vegetable_delivery',
    name: 'Vegetable Delivery',
    description: 'Carry a crate of vegetables from Mirelle to the tavern in the village.',
  },
};
