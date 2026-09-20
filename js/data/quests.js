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
  // The Maiden's Grace's lockbox (C1, 2026-09-13) — replaces the earlier
  // c1_salvage/c1_memorial pair (Roderick's cargo-cataloguing quest and
  // Wynne's memorial for the unrelated "Gull's Regret" wreck) with one
  // unified quest tied to the ship/miremen story already in C1C/C1D.
  // Offered by EITHER Roderick Vane or Wynne Ashcombe —
  // mutually exclusive at accept time (see main.js's lockboxAcceptedFrom) —
  // but who the lockbox is ultimately GIVEN to (lockboxGivenTo) is a
  // separate, later choice, independent of who it was accepted from. See
  // main.js's buildRoderickDialog/buildWynneDialog for the full branching.
  c1_lockbox: {
    id: 'c1_lockbox',
    name: 'The Maiden’s Grace Lockbox',
    description: 'Clear the miremen from the Maiden’s Grace and recover the ship’s sealed lockbox — then decide who it goes to: Roderick Vane, for the Crown, or Wynne Ashcombe, for the crew’s families.',
  },
  // The Reedwalkers' thornback boars (C2, 2026-09-16). Completion is NOT an
  // item turn-in like most quests here — it's a live headcount: Tovan's
  // turn-in option only appears once every npc in C2 with
  // enemyId 'thornback_boar' is `defeated` (see main.js's thornbacksLeft()).
  c2_thornbacks: {
    id: 'c2_thornbacks',
    name: 'Beasts on the Windmarch',
    description: 'Thornback boars came out of the open ground north of the road and killed all but one of Tovan and Nera Reedwalker\u2019s thrumhorns. Kill the three of them before they take the last one.',
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
  toby_net: {
    id: 'toby_net',
    name: 'Something in the Water',
    description: 'Toby Farrow lost his fishing net to something in the water. Bring him a couple of trout to tide his family over.',
  },
  // Lily Farrow's lost gull (2026-09-10) — replaces the old plain-gold
  // "flash of grey and white" collectible with a real quest: a feather trail
  // across the village leads to a small cave (C1B) where the gull itself
  // waits. See main.js's buildLilyDialog/applyResponseEffect (lilyAccept/
  // lilyGiveUp/lilyKeepLooking/lilyTurnIn) for the full branching dialogue.
  c1_lily_gull: {
    id: 'c1_lily_gull',
    name: 'A Gull Gone Missing',
    description: 'Lily Farrow’s pet gull has been missing for two days. Find her — dead or alive — and bring word back to Lily.',
  },
  // Started by showing Orris Fenwick the mysterious rock (C2, 2026-09-20) —
  // the reward for finishing Lily's gull hunt. He can bind hearts, fangs and
  // ore, cannot read this at all, and says those two facts sitting together
  // are what make it worth the trip. NO turn-in exists yet: Kingsreach is
  // overworld B3, which isn't built, so this stays active as a northward pull.
  // Wire the completion to whoever ends up reading it there.
  kingsreach_rock: {
    id: 'kingsreach_rock',
    name: 'A Stone Without a Name',
    description: 'Orris Fenwick can bind almost anything to a blade, and cannot read the strange rock at all — which he says is the remarkable part. Take it north to Kingsreach, the city under the castle walls, and find someone who knows what it is.',
  },
};
