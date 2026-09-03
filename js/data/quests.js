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
  rootweaver_favor: {
    id: 'rootweaver_favor',
    name: 'The Chief’s Bargain',
    description: 'The Bramblekin Chief will grant safe passage through his camp in exchange for the heart of a rootweaver from the surrounding woods.',
  },
  elowen_offering: {
    id: 'elowen_offering',
    name: 'The Hearthlight Offering',
    description: 'Elowen, the temple priestess, asked you to bring a fresh loaf of bread from the bakery to lay as a shrine offering.',
  },
  osric_boot: {
    id: 'osric_boot',
    name: 'One Man’s Treasure',
    description: 'Osric the hermit wants an old boot — the kind you fish out of a pond. He swears it’s worth a fortune to him.',
  },
  sorcha_ore: {
    id: 'sorcha_ore',
    name: 'Iron for the Forge',
    description: 'Sorcha the blacksmith is short on iron. Bring her a chunk of metallic ore and she’ll forge a longsword worth buying.',
  },
  mara_belongings: {
    id: 'mara_belongings',
    name: 'Waylaid on the Road',
    description: 'Mara Vellorne and her companion Vozhik were ambushed by bramblekin in the woodland clearing and robbed. Recover their stolen belongings — a royal summons among them — from the thieves.',
  },
  calder_keepsake: {
    id: 'calder_keepsake',
    name: 'More Precious Than Gold',
    description: 'Calder Rusk asked you to recover something from the wreck of the Gull’s Regret — he wouldn’t say what, only that it’s worth more to him than all his hidden gold.',
  },
  perrin_feast: {
    id: 'perrin_feast',
    name: 'A Feast for Tidewrack',
    description: 'Perrin the cook is nearly out of stores. Bring him Cragclaw eggs and a couple of bluegill so he can feed the village.',
  },
  c1_memorial: {
    id: 'c1_memorial',
    name: 'A Place to Grieve',
    description: 'Help Wynne Ashcombe raise a small memorial for the crew of the Gull’s Regret, lost when it wrecked off the cove.',
  },
  c1_salvage: {
    id: 'c1_salvage',
    name: 'Salvage Rights',
    description: 'Help Roderick Vane catalogue what little cargo has already washed ashore from the Maiden’s Grace.',
  },
  toby_net: {
    id: 'toby_net',
    name: 'Something in the Water',
    description: 'Toby Farrow lost his fishing net to something in the water. Bring him a couple of trout to tide his family over.',
  },
};
