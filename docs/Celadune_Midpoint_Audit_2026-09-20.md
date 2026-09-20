# Tales of Celadune — Mid-Project Audit
**2026-09-20 · read-only pass over the whole codebase · nothing was changed**

Four parallel deep dives: the save system, the economy, combat difficulty, and core mechanics. Everything below was verified against the actual code — simulated in Node or enumerated programmatically — not taken from CLAUDE.md's description of it. Where CLAUDE.md and the code disagree, the code is quoted.

---

# PART 1 — THE SAVE SYSTEM

There are **two separate root causes**, and the first one is much worse than "enemies come back."

## 1.1 CRITICAL — `snapshotWorlds()` silently deletes every scene you didn't re-enter this session

`main.js:771`

```js
function snapshotWorlds() {
  const out = {};
  for (const [id, w] of Object.entries(worlds)) { ... }   // ← only INSTANTIATED worlds
  return out;
}
```

`main.js:903` (`loadGame`)

```js
for (const k of Object.keys(worlds)) delete worlds[k];
pendingWorldFlags = data.worlds || {};
enterScene(savedScene);
```

On Continue, `worlds` is emptied and refills only as you walk into scenes. `pendingWorldFlags` holds everything the save knew — but **`snapshotWorlds()` never reads it.** So the next time anything calls `saveGame()`, the new save contains only the scenes you happened to visit this session. Every other scene's state is gone: kills, chests, collected items, looted houses, vendor stock, vendor purses.

**Reproduced** (faithful reproduction of the real `worlds` / `snapshotWorlds` / `loadGame` logic):

```
After session 1, save holds scenes: D1, D1B, D2
  D1 foe defeated?  true | D1B foe defeated? true

After session 2 (Continue in D2, walk to D3, quit — never revisit D1/D1B):
  save holds scenes: D2, D3
  D1 present in save? false | D1B present? false

SESSION 3 — walking back into D1/D1B:
  D1  foe alive again?  true | D1  chest refilled? true (gold 10)
  D1B foe alive again?  true | D1B chest refilled? true (gold 10)
```

This is why it looks intermittent: **it takes two restarts.** Kill something, quit, Continue — it's still dead (that save was fine). Play a bit somewhere else, quit, Continue again — now it's alive. The kill was never re-recorded.

The six `saveGame()`-on-victory calls added 2026-09-12 are correct and were not the problem. They write the kill immediately; the *next* save quietly throws it away.

### It is also an item-duplication bug

`inventory` is saved globally; chest and collectible state is saved per scene. When a scene is dropped from the save, the item stays in your bag **and** the chest refills. Loot C4's chest (Short Sword + Health Potion + Royal Summons), walk to D4, play two more sessions without re-entering C4, come back — take all of it again. Same for every gold glint. This punches a hole straight through the bounded economy that Part 2 depends on.

### Fix

```js
function snapshotWorlds() {
  // Start from the loaded save's per-scene state so scenes NOT instantiated
  // this session carry forward instead of being dropped, then overwrite with
  // live data for every world that actually exists right now.
  const out = { ...(pendingWorldFlags || {}) };
  for (const [id, w] of Object.entries(worlds)) { out[id] = { ...existing... }; }
  return out;
}
```

Two lines. `pendingWorldFlags` is already in scope, already populated by `loadGame`, and already never cleared.

## 1.2 HIGH — Nothing saves mid-scene, so quitting loses whatever you just did

`main.js:839`

```js
autosaveHook = null;
```

`requestAutosave()` is called from **30 places** — every gold change, item grant, quest start/complete, well drink, flag set, and the enchanting result. All 30 are no-ops. Saves happen only on:

- scene entry (`switchScene`, `enterCave`, `exitCave`, the C3 ferry)
- New Game
- the six battle-victory `.defeated = true` sites
- `finalizeMaraHollowmastRescue`

**There is no `beforeunload` or `pagehide` handler** (verified — zero hits across `js/*.js` and `index.html`), so closing the tab writes nothing at all.

So your vendor example fails exactly as you describe. `stockLeft` / `resale` / `gold` **are** in the snapshot (`main.js:791`) and `applyWorldFlags` **does** restore them (`:526-531`) — the data model is right. But `openVendorGrid`'s buy and sell handlers (`main.js:2820-2950`) never call `saveGame()`. Sell to Sorcha → close the tab → Continue → the save predates the sale, so she never got the item and you never got the gold.

Everything in this category is lost on quit-without-a-scene-change:

| Lost | Where |
|---|---|
| Vendor buy / sell (stock, resale, purse, your gold, your items) | `openVendorGrid` |
| Chest loot (gold, items, `emptied`, lockpicked `locked=false`) | `openChestContents` |
| Ground collectibles (`collected`) | `interact()` |
| Items taken from Your House / lockpicked homes | `applyPlaceResponse` |
| Quest start / complete / fail | `startQuest` etc. |
| Equip / unequip | `equipItem` |
| Enchanting — consumes a weapon **and** a reagent | `applyEnchant`, `:2116` |
| `stats.defense +1` (Wynne's lockbox), `stats.luck +1` (the well), `healthMax +1` (Vitality Potion) | scattered |
| Well drink count, conversation flags | various |

The checkpoint model is also already incoherent: the six kill-saves write **full current state** (`snapshotWorlds()` plus live `stats`/`inventory`/`gold`/player position), so a scene with a fightable enemy already checkpoints eagerly and a scene without one never does. Half the game saves one way, half the other.

### Fix

Set the hook and debounce it:

```js
let autosaveTimer = null;
autosaveHook = () => {
  if (battleState.active || deathFading) return;      // never mid-fight
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(saveGame, 400);          // coalesce bursts
};
window.addEventListener('pagehide', () => { clearTimeout(autosaveTimer); saveGame(); });
```

Then add the missing `requestAutosave()` calls at the vendor buy/sell handlers and in `openChestContents` (the three chest `saveGame()` calls were removed on 2026-07-31 — put them back as `requestAutosave()`).

The original reason for going checkpoint-only was vendor farming via reload. That reason is gone: `stockLeft`/`resale`/`gold` are now persisted, so eager saving can't restock a shop. The other reason — "die and Continue resumes at the scene entrance" — is a separate decision and can be kept by giving death its own checkpoint slot rather than by refusing to save at all. **Recommend two slots:** a live autosave (`celadune_save_v1`) that Continue reads, and a scene-entry checkpoint (`celadune_checkpoint_v1`) that only `continueFromDeath()` reads. That gets you both behaviours cleanly and is maybe 20 lines.

## 1.3 Smaller save gaps

- **Ysra's `appeased` is never persisted.** `main.js:1421` sets `live.appeased = true; live.chaseTalk = false;` when you pay her 25 gold for the gull. Not in `snapshotWorlds`, not in `flags`. Pay her, reload, and she's hostile and chasing you again — with your 25 gold gone.
- **`collected` is stored by array index**, not by id (`main.js:786`). `battles`, `ambushes`, `npcs` and `chests` all use ids. Any future edit to a scene's `interactables` array shifts every index and silently mis-restores existing saves (a collected coin becomes a collected quest item, etc.). Switch it to ids, and give every interactable one.
- **The save has no schema version guard.** `v: 1` is written but never checked on read, and `loadGame` does `Object.assign(stats, NEW_GAME_STATS, data.stats)` — so a save from before a field existed silently merges. Fine today; worth a `if (data.v !== 1) return false;` before B-row work starts.
- **`enterScene('D3')` runs at `main.js:586`, but `gafferHappy`/`orrisRescued`/`maraHollowmastRescued`/`ferrySide` are `let`-declared at 1058-1099 and 1810.** It only works because the boot scene is hardcoded to D3, which touches none of those branches. Change the boot scene, or add one flag-reading branch for D3, and boot dies with a TDZ `ReferenceError`. Hoist the declarations above line 586.

---

# PART 2 — THE ECONOMY

Counted programmatically by importing the real scene modules: **46 one-time enemy instances, 6 chests, 7 vendors**, at the starting Luck 1.

## The verdict: you can buy everything, roughly three times over

| | low | expected | high |
|---|---|---|---|
| Enemy gold (46 kills) | 300 | **431** | 556 |
| Enemy loot sold (`floor(price/2)`) | 115 | **149** | 205 |
| Chest gold | 80 | **98** | 115 |
| Chest items sold | 121 | **121** | 121 |
| Collectible gold | 22 | **22** | 22 |
| Ground / house items sold | 24 | **24** | 24 |
| Quest gold | 91 | **168** | 168 |
| Fishing (net of bait) | 0 | **29** | 51 |
| **TOTAL INCOME** | **753** | **1,041** | **1,262** |

**Cost of every purchasable item in the game: 343 gold.**

```
income / buy-everything     =  2.20x … 3.03x … 3.68x
income / stat-bearing gear  =            9.6x
```

Stat-bearing gear — short sword 20, longsword 38, leather armor 17, gloves 15, dagger 12, torch 6 — is **108 gold, 10% of income.**

### The curve is right for about a third of the game, then it solves

| point | cumulative gold | context |
|---|---|---|
| arrive in D2 (all five shops) | ~14 | Sorcha's kit costs 52 — a real wall |
| after D1 | **~53** | *exactly* enough for Sorcha's kit — one genuine choice |
| after D1B | ~124 | |
| after C1 | ~214 | |
| after C1B + the ship | **~338** | the entire 343-gold shop is already affordable |
| after D4/D4B/C4/C2 | ~662 | pure surplus |

**The opening is genuinely well-tuned and should not be touched.** The problem is that income never tapers while the price list stays flat, so around C1B the economy goes permanently solved. From there the answer to every purchase is yes.

There is exactly **one** competing choice in the game: sword vs armor vs gloves at Sorcha's on the first D2 visit.

### Two things that shouldn't cost what they cost

- **The torch is 6 gold.** It gates two entire cave scenes, it's the only light source, and it's the only `burn` source. One blight rat pays more than it costs.
- **Lockpicks are 15, and there are 4 in the world for 32 lockpickable houses.** This is the best tension in the game and it's an accident.

### Two flags

**Elowen's blessing voids a quarter of the shop.** 1 gold → +1 HP, reset on *every scene entry*. That's **1 g/HP, unlimited**, against a health potion's 8 g for 5 HP = 1.6 g/HP, finite. The 10 health potions on sale are 80 gold — 23% of the shop — and they are economically dominated by walking out of the temple and back in. Suggest: **8 gold → full heal, once per visit**, or cap it with a counter the way the well caps at `WELL_MAX_DRINKS = 5`.

**Enchanting is free and slightly gold-positive.** `applyEnchant` charges nothing, and variants are priced at `base × 1.5`. Bounded at ~+18 gold today by the three spider fangs, so harmless — but it becomes a real loop the moment any vendor stocks reagents or plain weapons. **Charging 25-40 gold per enchant** fixes it, is thematic for Orris, and gives the late surplus somewhere to go.

### The Bramblekin toll never fires

You built an escalating sink (10 → 18 → 26 → 34 → 40). It is dead. The Chief's favour costs one rootweaver heart — which you get free and guaranteed from a rootweaver you were going to kill anyway — and it grants *permanent* passage **and pays +10 gold**. A rational player pays the toll zero times. Removing the +10, or gating the favour behind something costlier, would make the one real sink in the game actually work.

### Recommended numbers

**Tier 1 — highest leverage:**

1. **Sell ratio ½ → ⅓.** One line (`main.js:2698`). Applies to every item that exists and every item you ever add. −97 gold, and looted gear starts feeling like gear instead of currency.
2. **Cut enemy gold ~35%, weighted at the worst offenders.** The four rootweavers alone pay 146 gold including hearts — more than every stat item in the game — and they're supposed to be flee-walls.

| enemy | now | → |
|---|---|---|
| rootweaver | 18–30 | **8–14** |
| bramblekin | 4–8 | **3–5** |
| mireman | 4–9 | **3–6** |
| ysra | 22–34 | **15–22** |
| highwayman | 8–14 | **5–9** |
| cragclaw / queen | 5–10 / 15–25 | **3–6 / 10–16** |
| thornback boar | 8–14 | **6–10** |
| cave spider | 5–9 | **4–7** |
| blight rat / cave bat | 2–4 / 1–3 | **1–3 / 1–2** |

3. **Reprice what matters** so gear *is* the choice: torch 6→**12**, leather armor 17→**30**, gloves 15→**28**, short sword 20→**26**, longsword 38→**70**, vitality potion 30→**45**, dagger 12→**14**, lockpicks 15→**18**. Gear-that-matters goes 108 → **180**.

**Tier 2 — if you want it tight:** halve chest gold (98→~50), cut collectible gold 22→14, **`c1_lockbox` → Roderick 50 → 25** (at 50 it's obviously better than Wynne's +1 DEF, so your mutually-exclusive choice isn't one), `mara_belongings` 20→12, `osric_boot` 15→8, and drop vitality potions from 6 to 4.

Tier 1 + Tier 2 modelled: income 1,041 → 643, buy-everything 343 → 504, ratio **3.03x → 1.27x**.

**Tier 3 — structural, and probably the most important.** The game has almost no gold sinks. Charge for enchanting; make the toll real; give Nadira a restocking vitality potion at 60-80 gold. A repeatable *permanent* upgrade at a steep price is the cleanest way to absorb a late surplus without breaking the bounded design.

### One content bug found while modelling fishing

**The fish-gated quests are probably uncompletable.** Four quests need six specific fish/fish-adjacent items — 2 bluegill (Perrin), 2 trout (Toby), 1 Moonscale (Darius), 1 old boot (Osric) — worth 56 gold of reward. Bait is hard-capped: Emeric stocks 5, cragclaws drop ~1.4, house stashes ~1.2. Monte Carlo over the real `rollCatch` at Luck 1 (200,000 trials):

| casts | P(all four needs met) |
|---|---|
| 5 | **0.0%** — six items from five casts is impossible |
| 8 (expected supply) | **20.8%** |
| 12 (hard ceiling) | 51.6% |

Roderick's bluegill and trout were removed on 2026-09-17, so fishing is now the only source. **About four players in five hit a dead end.** Cleanest fix, which also removes fishing as an income source: make Emeric's bait **unlimited** (the vendor code already treats a bare string as infinite) and **raise bait to 5 gold**. EV per cast is 5.11, so fishing becomes break-even flavour, the bottleneck disappears, and the Moonscale → Darius 20 gold stays the actual reward.

---

# PART 3 — COMBAT

Exact enumeration for hit chances; 10,000-trial Monte Carlo per matchup against a faithful reimplementation of `battle.js` + `runQueue`/`playerAttack`/`resolveEnemyTurn`/`takeEnemyTurn`/`damagePlayer`.

**Correction to a note in CLAUDE.md:** `healthMax` grows *only* via Vitality Potions (`main.js:2240` is the sole `healthMax +=`). Elowen's blessing is `healPlayer(1)`, a clamped heal. There are 6 Vitality Potions in the built world, so the lifetime max-HP ceiling is 11.

## 3.1 The roll curve is too flat for Attack and Defense to matter

`d20 + atk > d20 + def`, ties to defender. It depends only on `A − D`:

| A−D | −5 | −4 | −3 | −2 | −1 | 0 | +1 | +2 | +3 | +4 | +5 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| hit % | 26.25 | 30.00 | 34.00 | 38.25 | 42.75 | **47.50** | 52.50 | 57.25 | 61.75 | 66.00 | 70.00 |

**~4.2 percentage points per stat point.** Leather Gloves (+1 ATK, 15 gold) buys +4.75pp ≈ +10% DPS. Dagger → Short Sword buys **+50% DPS** for 20 gold. The entire Equipment tab is worth less than one weapon tier. Consider widening to `d20 + 2×score`, or a fixed-target roll (`d20 + atk ≥ 10 + def`).

## 3.2 The difficulty curve is bimodal — it's either 0% or 90%

Selected results (full table available; profiles are all achievable kits at the point the fight is first reachable):

| Scene | Encounter | Profile | **Death %** |
|---|---|---|---|
| D3 | Old Barn, 1 rat | opening state | 4.7% |
| D4 | Bramblekin Chief | Dagger kit | **81.9%** |
| | | after 68g at Sorcha's | **52.7%** |
| D4 | Rootweaver ×1 | Dagger kit | **92.6%** |
| | | full D-row kit | **0.5%** |
| D1B | **Cragclaw Queen** | full D-row kit | **46.3%** |
| D4B | Cave Spider | D2-shopped kit | **47.8%** |
| C1B | **Ysra** | full D-row kit | **88.0%** |
| | | full C-row kit | 51.0% |
| C2 | **Highwaymen (forced, 2v1)** | D2-shopped kit | **94.5%** |
| | | full D-row kit | **57.2%** |
| C4 | **Bramblekin pack ×4** | full D-row kit | **84.8%** |
| | | full C-row kit | **73.2%** |
| C1 | Mireman pack ×2 | full D-row kit | 4.3% |
| anything | with Small Shield equipped | C-row kit | **0.0%** |

### The three that are actually broken

**1. C4's Bramblekin pack is a 4-v-1 and it's the first C-row scene most players see.** `main.js:4499` builds the roster with no cap:

```js
foes = world.npcs.filter(n => n.pack === foe.pack && !n.defeated)
```

`MAX_BATTLE_ENEMIES = 3` gates *summons* only (`takeEnemyTurn`, `:3776`) — it never touches the initial roster. Four Bramblekin put out ~4.8 expected damage per round; a 7-HP player dies in round 2. **84.8% death at the best kit the D row can produce**, and you get there by walking north off D4.

Fix: `.slice(0, MAX_BATTLE_ENEMIES)` on the roster, *and* cut the C4 pack to 2 members.

| pack size | D-row kit | C-row kit |
|---|---|---|
| 4 (current) | 84.8% | 73.2% |
| 3 | 53.8% | 37.9% |
| **2** | **18.6%** | **8.4%** |

**2. The Orris ambush is a forced 2-v-1 with no decline.** `lockDialog: true`, one response, Escape ignored. 94.5% death at a D2-shopped kit, 57.2% at the best D-row kit — and it re-arms on flee, so walking the C2 road again runs it again. It's only comfortably survivable once you already own the thing it drops. Either drop `lockDialog` and add a "Back away." response, or reduce each Highwayman to 4 HP / atk 2.

**3. Ysra has no warning gate.** She's a `chaseTalk` NPC with `aggroRange: 400` who runs the player down inside C1B — and C1B is the endpoint of *Lily Farrow's lost-gull errand*, a child's fetch quest. 88% death at the D-row kit. Either move her spawn away from the gull's chamber, or have Lily/Aldous name the danger first. (Suggest also 15 HP → 12, damage 2–5 → 2–4.)

Also worth re-tiering: **Cragclaw Queen def 3 → 2, HP 12 → 10** (46% → 31% at the D-row kit — right now the D-row boss requires C-row gear), and **Bramblekin Chief damage 2–5 → 2–4** ("draw steel" is presented as a casual third option at 82% death).

### The other end — what's trivial

Blight Rat and Cave Bat are non-fights: 2 HP, 1 flat damage, 0.43 expected damage per turn. D4B's three-of-a-kind ambushes are **6.5 rounds of button-pressing for 2-4 gold**, four times in one cave. Mireman after the 2026-09-11 softening needs 7.8 turns to kill a 5-HP player while you kill it in 3.5 — the ship's deterrent across three scenes is a speed bump. Suggest cutting the 3-strong D4B ambushes to 2, or swapping one of each pair for a single Cave Spider.

## 3.3 Five starting HP is the root cause of most of the above

Probability of dying in two landed hits, from full health:

| enemy | damage | P(dead in 2 hits) | min hits |
|---|---|---|---|
| Bramblekin Chief, Ysra | 2–5 | **93.8%** | **1** (a max roll is your whole bar) |
| Thornback Boar, Cragclaw Queen | 2–4 | 88.9% | 2 |
| Highwayman, Cave Spider | 2–3 | 75.0% | 2 |
| Bramblekin | 1–4 | 62.5% | 2 |

**This makes Health Potions nearly useless.** A potion heals 5 — a full top-up — but costs your whole turn, and you can go 5 → 1 → dead before you ever drink. Against the Chief at a D2-shopped kit:

| potions carried | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| death % | 59.7 | 55.4 | 53.9 | **53.5** |

Three potions buy six percentage points. Against a Cragclaw (max hit 2, so burst can't skip the threshold): 25.0% → 0.5%. **Potions only work against enemies that can't two-shot you.**

**Raising `NEW_GAME_STATS` to 8/8 is the single highest-leverage change in this audit**, and needs no enemy edits:

| fight (D2-shopped kit) | 5 max HP | **8 max HP** |
|---|---|---|
| Bramblekin | 11.9% | **1.2%** |
| Bramblekin Chief | 53.2% | **16.0%** |
| Cave Spider | 47.9% | **8.3%** |
| Thornback Boar | 64.7% | **28.7%** |

It also makes the entire potion economy — Nadira, Bram, Perrin, Emeric — matter for the first time. Vitality Potions then take you 8 → 14, a nicer curve than 5 → 11. (HUD note: `HEALTH_PX_PER_POINT = 30`, so 8 HP = 240px, 14 = 420px — worth eyeballing.) If 8 feels generous, **7** is the minimum that stops the Chief and Ysra one-shotting on a max roll.

## 3.4 The Small Shield ends the difficulty curve

`damagePlayer` does `Math.max(0, amount - equipmentDamageReduction())` with **no floor**. Identical player, only DR varied:

| fight | no shield | **DR 2 (current)** | DR 1 + floor 1 |
|---|---|---|---|
| Highwayman ×2 | 12.9% | **0.0%** | 0.3% |
| Bramblekin ×4 | 64.3% | **0.5%** | 30.0% |
| Cragclaw Queen | 2.3% | **0.0%** | 0.1% |
| Ysra | 39.3% | **0.2%** | 10.2% |

Because there's no minimum-damage floor, DR 2 makes **Blight Rat, Cave Bat, Mireman and Cragclaw literally incapable of ever dealing damage** — their entire damage range is ≤ 2. That's four of twelve enemy types, including everything guarding the *Maiden's Grace* across three scenes.

Recommend **`damageReduction: 2 → 1`** plus a floor:

```js
const dealt = Math.max(amount > 0 ? 1 : 0, amount - equipmentDamageReduction());
```

The floor alone isn't enough; it still zeroes the game. If you want to keep the flat feel, make it percentage-based (`0.4` → `Math.max(1, Math.ceil(amount * 0.6))`), which scales properly into the B and A rows.

Side note: the shield occupies `offhand`, **the same slot as the Torch** — so in any dark cave it's "immune to damage" vs "can see." That's a good choice in principle, but right now the shield wins everywhere it's legal.

## 3.5 Speed is near-worthless; enemy speed does nothing at all

`playerInitiativeChance` is rolled **once per fight** (`startBattle`) and fixed for the whole battle, so it only decides who gets the last swing.

| fight | Speed 1 (50%) | Speed 3 (100%) |
|---|---|---|
| Cragclaw | 2.5% | 1.3% |
| Thornback Boar | 64.2% | 60.2% |
| Ysra | 98.8% | 98.6% |

Going from guaranteed-last to guaranteed-first is worth **1-5 percentage points**. The Leather Boots are worth more for the ×1.25 walk speed. And because the player's block is monolithic, **enemy speed values have zero mechanical effect** — Cave Bat's speed 12 and Bramblekin's speed 6 produce identical outcomes.

Fix: re-roll initiative per round (move the `playerFirst` roll into `rollRoundOrder`, which already rebuilds each round). Better: at Speed 3, grant a second player action every third round.

## 3.6 Status effects — one is excellent, one is a trap

Death-% delta, 5 HP / A2 D2 / Short Sword / 2 potions:

| fight | plain | Ensnaring (20%) | Venomous (25%) | **1 thrown Spider Fang** | with Torch burn |
|---|---|---|---|---|---|
| Cave Spider | 46.6% | 42.9% | 39.6% | **20.3%** | — |
| Thornback Boar | 65.5% | 60.3% | 55.2% | **29.6%** | — |
| Cragclaw Queen | 84.7% | 79.8% | 73.3% | **52.2%** | — |
| Bramblekin Chief | 53.9% | 50.8% | 53.6% | 53.3% | **34.3%** |
| Rootweaver | 56.3% | 52.3% | n/a | n/a | **20.2%** |

- **Thrown Spider Fang is the best-value action in the game** — one item, guaranteed application, halves the death rate on long fights. Against the Queen it's worth more than three Health Potions.
- **Torch burn is the strongest effect** but has only two valid targets (`wood: true` — Bramblekin, Rootweaver).
- **Ensnaring (20%) is the weakest** at 3-5pp, partly because it's checked *before* the poison tick so an ensnared foe doesn't fester either.
- **Venomous is strictly worse than just throwing the fang you'd have used to make it**, in any fight under ~8 rounds.
- **Ysra's Staff is a trap that works as designed — but it has no discoverable tell.** It shows "4–8 DMG," is the highest-damage off-hand in the game, sells for 60, and every swing skips the hit roll, costs 2 Magic **and** deals you 1 damage. With `magicMax: 5` a player gets two swings per Magic Potion, loses 2 HP, and will read it as a bug rather than a curse.

## 3.7 Fleeing is always correct, and that's the deepest problem

`playerFlee` succeeds **unconditionally** on every enemy except the Rootweaver's first attempt. It costs nothing — no HP, no gold, no item, no turn. Consequences: a creature gets `pause = 2` (two seconds), an ambush teleports you to its `retreat`, a door battle stays re-fightable.

And the death penalty is also near-zero: `continueFromDeath` → `loadGame()` → the scene-entry checkpoint, which for a wandering-creature fight is usually nothing lost.

So the optimal play in *every* fight above ~20% risk is: flee, walk 500px, come back at full HP, repeat. There's no attrition and no reason ever to accept a risky fight; the only real pressure is the player's patience. Worth giving fleeing a cost — the foe gets one parting swing at ~25% (generalising the Rootweaver's `ensnare`), or you drop to the checkpoint's HP.

## 3.8 Recommended numbers

| thing | current | proposed |
|---|---|---|
| `NEW_GAME_STATS.health/healthMax` | 5 / 5 | **8 / 8** |
| `small_shield.damageReduction` | 2 | **1** + `Math.max(1, …)` floor |
| initial battle roster cap | none | `.slice(0, MAX_BATTLE_ENEMIES)` |
| C4 `clearing_bramblekin` members | 4 | **2** |
| Orris ambush | `lockDialog`, 2× 6HP/atk3 | escapable, or 2× **4HP/atk2** |
| `rootweaver.damage` | 1–3 | **2–5** (restore the flee-wall) |
| `cragclaw_queen` | 12 HP / def 3 | **10 HP / def 2** |
| `ysra_nineshells` | 15 HP / dmg 2–5 | **12 HP / dmg 2–4** + signposting |
| `bramblekin_chief.damage` | 2–5 | **2–4** (optional if HP→8) |
| initiative roll | once per battle | **per round** |

Re-simulated together: C4 pack 84.8% → ~19%, Highwaymen 57.2% → ~20%, Queen 46.3% → ~20%, Ysra 51.0% → ~20%, Chief 53.2% → ~16%, Thornback 64.7% → ~29% — **a coherent 15-30% curve across row C** instead of the current 0%-or-90% split, with the Rootweaver restored as the one deliberate wall.

Note that the **rootweaver has drifted from a designed flee-wall into one of the safest fights in the game while carrying the fattest purse** (2-8 → 2-5 → 1-3 damage over successive softenings; 0.5% death at the D-row kit against an 18-30 gold drop plus a guaranteed 20-gold heart). That's worth undoing on both the combat and the economy side.

---

# PART 4 — MECHANICS

## 4.1 Bugs, by severity

**HIGH — `pendingUseItem` is never cleared on cancel, and `startBattle` doesn't reset it.** `main.js:3588`, `ui.js:1915`. `ui.battleKey`'s targeting-Escape returns focus to the action row without telling main.js, so the flag survives.
- *Same fight:* Item → Escape → Main Hand → confirm. `playerAttack` short-circuits at `:3816` and throws the fang instead of swinging; a fang is consumed.
- *Next fight:* Escape out of targeting, then Flee. On the next battle's first attack, `playerUseOffensiveItem` runs against whatever is in `equipment.item` — empty (`def` undefined) or a Health Potion (`rollDamage(undefined)` destructures undefined) — and **throws**. The exception escapes from inside `onConfirmTarget`, leaving `battleUiState.mode === 'idle'` with nothing to re-arm the menu. **That is the exact freeze documented as fixed on 2026-07-09, reintroduced by a different route.**
- Fix: clear both pending flags in `startBattle`/`endBattle`, add an `onCancelTarget` callback, guard `playerUseOffensiveItem` on `def?.useDamage != null`.

**HIGH — non-battle damage has no death handling.** `checkBattleEnd()` is only called from `runQueue`/`playerFlee`; `damagePlayer` never checks for death. The dialog effect `{ damage: n }` (`main.js:1559`) is an out-of-battle damage source with no death path. **Repro:** take 4 damage, flee, pet Old Gaffer in D3 → health 0, no Game Over, you keep walking with an empty bar until the next battle fires an instant defeat. Add a death check inside `damagePlayer`, guarded so it doesn't double-fire mid-battle.

**MEDIUM — backing out of Roderick Vane's shop throws a `TypeError` every time.** `main.js:2909`'s `onBack` calls `buildVendorDialog(npc)`, which reads `npc.dialog.line` unconditionally. Roderick is the **only vendor in the game with no `dialog` field** (verified across all 13 scene files) — his conversation is fully state-built. Reproduced in Node against the real `c1.js`: `TypeError: Cannot read properties of undefined (reading 'line')`. `onBack` should be handed the builder that produced the dialog, not assume one.

**MEDIUM — Sorcha's "Go back." permanently replaces her greeting.** `main.js:1219`. `ui.updateDialogContent` *replaces* `dialogState.npc.dialog` on every swap, so by the time "Go back." runs, `npc.dialog.line` is the quest-offer line, not the greeting. Every other `*Menu` effect dodges this because its builder reads world state directly (`calderMenu` → `buildCalderDialog()`); `sorchaMenu` is the one that passes the mutated view object through.

**MEDIUM (latent) — a dialog or battle opening mid-cast swallows every keypress for up to 10 seconds.** `main.js:4376` checks `fishing` *before* battle and dialog, and the world keeps ticking during a cast (`worldFrozen = modalLock`, not `locked`), so creatures, `proximityTalk` NPCs and camp gates stay live. The cast's `setTimeout` also has no cancel guard. Verified currently unreachable — no fishing spot is within any creature's `giveUpRange`, any `talkRange`, or any gate radius (nearest: 1235px vs `r` 173) — but it goes live the moment a creature or talker is placed near water.

**LOW-MEDIUM — two encounters in the same frame silently discard the first one's `onEnd`.** `main.js:4489-4529` consumes `pendingAggro`, `pendingAmbush`, `pendingApproach`, `pendingChaseTalk` unconditionally in sequence. `world.update` can set several in one tick. The second `startBattle` overwrites `battleState.onEnd`, so the first encounter is never marked `defeated` — but `checkAmbushes` already set `triggered = true`, so it won't re-arm either. Most reachable in D4B (four ambushes + three roaming spiders). In C1B the `pendingAggro` + `pendingChaseTalk` case opens a dialog *on top of* a battle, and the keydown handler checks `isBattleOpen()` first, so the dialog can't be dismissed. One "already opened something this frame" guard fixes all of it.

**LOW — `buildTobyDialog()` grants gold as a side effect of *building* a dialog.** `main.js:3250`. It's the only impure builder in the file. Safe today because nothing rebuilds Toby's menu — but it's one `{ tobyMenu: true }` "Go back." away from being a repeatable gold tap, and the flag burns even if the player Escapes on the first frame.

### Checked and clean
Scene-data integrity across all 13 modules (zero `responses`/`responseEffects` length mismatches, zero unknown quest/item/enemy ids anywhere); `resolveNpcDialog` first-match-wins (no NPC has two `dialogByQuestStatus` entries); `withChatter`'s `'Leave.'` guard; victory drip-feed double-grant; stuck modal lock via `world.interior`; `addItem` as the single item mutator (all 16 grant sites route through it, and no second `magicRevealed`-class scope bug exists — every `boot()`-local `let` was re-checked against the module-level functions).

## 4.2 Dead code

| what | where | status |
|---|---|---|
| `interactable.repeatable` | read at `main.js:4234` | **Dead** — zero interactables set it; `emptyMessage` superseded it |
| `scene.entrances` | 6 scenes, 2 entries each | **Dead data** — never read by any code; superseded by `home.door` / `battles[].door` |
| `ENCHANTS[].procMessage` | `items.js:116,122` | **Dead** — `playerAttack` hardcodes its own strings at `:3855,3862`. Two copies that can drift |
| `enchant.amount` | `items.js:556` | **Vestigial** — always undefined since "Honed" was removed |
| `#dialog-shop-hint` | `index.html:156` | **Dead element** — permanently hidden, never referenced |
| `#magic-items-empty` | `index.html:286` | **Dead markup** — wiped by the first `refreshItemsUi()` |
| `.victory-hint` | `style.css:1865` | **Dead rule** — element removed 2026-07-26 |
| `respawnAfterDefeat` | `main.js:4075` | Near-unreachable; also bypasses `healPlayer` |

CLAUDE.md is stale on two: `playerUseTorch` and `edgeMessage` are already gone.

## 4.3 The sprawl — with numbers

**13 distinct ways to make an NPC talk**, and **11 `ui.openDialog` call sites**, nine of which index into their own local array with their own convention (`acts`, `VOZHIK_LINES[beat].responses`, raw `index === 0`). Every one of those hand-rolled index checks is an off-by-one waiting to happen — **`openEdrasDialog` already shipped exactly that bug** (`main.js:2663`: "Leave." at index 0 fell into beat 1's branch and trapped the player).

**`applyResponseEffect` is 628 lines and 76 distinct `effect.*` keys** (`main.js:1109-1737`). About 8 are genuinely generic. **The other ~60 are one-NPC-one-line branches** — `perrinAccept`, `tobyTurnIn`, `wynneLockboxAccept`, `sennaDrownweftRefuse` — each doing: consume/grant something, then `updateDialogContent({line, responses:['Leave.']})`.

Roughly 40 of them are pure data and collapse to one handler:

```js
// { take?:[{id,qty}], give?:[{id,qty}], gold?:n, stat?:{defense:1},
//   start?:questId, complete?:questId, fail?:questId,
//   flag?:'lockboxGivenTo:roderick', line:'...', responses?:[...] }
```

`perrinTurnIn` / `tobyTurnIn` / `sorchaTurnIn` / `giveCalderPainting` / `turnInHeart` / `giveDariusFish` / `deliverVegetables` / `giveLockboxToRoderick` / `giveLockboxToWynne` / `maraHandOver` / `tovanTurnIn` / `lilyTurnIn` are **the same transaction twelve times with different strings.** Same for the 10 `*Accept` branches and the 12 `*Menu`/`*Story`/`*Lore` branches. That takes `applyResponseEffect` from ~628 lines to roughly 150 — **and kills the Sorcha bug by construction**, since a generic "rebuild this NPC's menu" effect would go through the `npc.id` dispatcher rather than a builder handed a mutated view.

**6 parallel item-grant presentation paths.** `addItem` is correctly the single state mutator, but how a grant *announces itself* is chosen ad hoc at each of its 16 call sites: `showReceivedItem` / `showGaveItem` / `showCatch` / `toast` / the victory drip-feed / nothing — plus the independent `silent` flag. A single `grantItem(id, qty, {reveal, message})` wrapper removes the "did I remember to pass `silent`?" decision, and would have caught the missing catch-sound bug that had to be fixed by hand on 2026-09-11.

**14 separate proximity-trigger systems**, with three different re-arm conventions (×1.4, ×1.6, time-based) for the same behaviour:

| # | system | range | hysteresis |
|---|---|---|---|
| 1-7 | `nearestInteractableInRange`, `nearestChestInRange`, `nearestNpcInRange`, `homeNpcNearDoor`, `battleNearDoor`, `emptiedBattleNearDoor`, `fishingSpotNearby` | 141 / 79 / 281 | — |
| 8-10 | `checkCampGates`, `checkCampMembrane`, `checkCampAggro` | `g.r` / rect / 313 | ×1.6 / contact / ×1.4 |
| 11-12 | `checkAmbushes`, `checkApproachTalk` | `a.range` / `talkRange` | ×1.6 / ×1.6 |
| 13-14 | creature chase, `chaseTalk` | aggro/strike/giveUp | time-based / ×1.4 |

1-7 are all "nearest thing you can press Space on" and differ only in range and precedence — they unify into one `nearestTarget()` returning `{kind, obj, dist}`, **which also fixes the label bug below for free.** 8-14 all want one shared `proximityTrigger(entity, range, armKey, factor)`.

## 4.4 Convention violations

**"A visible label means you can interact" — violated at the Old Barn.** `world.render()` draws labels for every in-range object independently; `interact()` enforces a strict precedence chain. Measured against D3's real data: the `Old Barn` building label is anchored at (1610, 2256) with r=266; the battle door is at (1610, 2131) with range 141. **There's a ~250px band south of the barn where "Old Barn" is visible and Space does nothing.** Battle doors have no label of their own, so the building label is doing double duty at a different anchor and a different radius. More generally, the fishing-spot label reaches 281px vs `INTERACT_RANGE` 141, so "Go Fishing" can be on screen while Space does something else (no overlap in current data, so only the barn case is live).

**Centralized health mutators — 5 bypasses.** Direct `stats.health`/`healthMax` writes outside `healPlayer`: `main.js:1565` (`effect.heal`, used by Elowen), `:2225` and `:2240` (`usePotion` — every Health Potion and Vitality Potion in the game), `:4076` (`respawnAfterDefeat`). Each calls `ui.updateHud` manually but skips `requestAutosave()`. Same for `stats.magic` at `:2232`/`:3824`, and `stats.defense`/`stats.luck` at `:1336`/`:4168` have no mutator at all. Gold and damage are clean.

**4 NPCs missing `audio.DIALOGUE_SFX`** (53 talkable NPCs vs 49 keys, zero orphans): `ysra_nineshells` (a **boss** with a forced confrontation), `orris_fenwick` (his dialog **auto-opens** on approach), `mara_hollowmast`, `mara_hollowmast_town`. All four open silently.

---

# WHAT I'D DO, IN ORDER

1. **`snapshotWorlds()` carry-forward** (§1.1). Two lines. It's silently deleting progress and duplicating items right now.
2. **Turn the autosave hook on** (§1.2), with a debounce and a `pagehide` handler, plus a separate death checkpoint slot. Add the missing calls at the vendor and chest handlers.
3. **Persist Ysra's `appeased`; switch `collected` from index to id** (§1.3).
4. **Cap the battle roster and cut the C4 pack to 2; give the Orris ambush an out** (§3.2). These are the two fights that will stop a playthrough dead.
5. **Base HP 5 → 8** (§3.3). One constant, fixes most of the difficulty spikes, and makes the potion economy real for the first time.
6. **Small Shield DR 2 → 1 with a minimum-1 floor** (§3.4).
7. **Fix `pendingUseItem` and the non-battle death path** (§4.1). One is a reproducible freeze, the other leaves you walking at 0 HP.
8. **Economy Tier 1** (§2): sell ratio ½ → ⅓, cut enemy gold ~35%, reprice the six things that matter.
9. **Unlimited bait at 5 gold** (§2) — unblocks four quests that ~80% of players can't currently finish, and neutralises fishing as an income source in the same move.
10. **Then the consolidation** (§4.3). Sixty one-off effect branches and nine hand-rolled beat machines are where the next bug of this class comes from.

Items 1-3 are strictly bug fixes and don't change how the game plays. Items 4-6 are the balance changes with the most effect per line changed.
