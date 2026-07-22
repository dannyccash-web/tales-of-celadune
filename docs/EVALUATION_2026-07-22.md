# Tales of Celadune — Health Check (2026-07-22)

Scope: full read of `js/`, `css/`, `index.html`, all scene/data modules, plus a live-site
verification pass. Live URL is healthy — every sprite/asset checked returned HTTP 200, no
console errors on load.

---

## 1. Overall verdict

The core loops are in good shape and internally coherent: movement/collision, four-layer
scenes with edge transitions, turn-based battle (pure, testable dice math), inventory +
equip, quests, vendors, and a unified enemy-drop system. Content has quietly outgrown the
CLAUDE.md status section — fishing, the torch/fire mechanic, and ~6 quests all exist now but
aren't reflected in the roadmap notes.

The single biggest structural gap is **progression**: there is no XP/leveling loop, and the
only way player power grows is buying gear/potions. That has knock-on effects on balance
(below). Second gap is **no save system** — a refresh wipes all progress.

---

## 2. Your specific questions

### Dialogue vs. vendor windows — names/titles placement
There's a real inconsistency. Regular NPCs render **name + role *inside* the frame** (top of
`.dialog-text`). Vendors render **name + title in a header strip *above* the frame** (plus
their coin purse). Two different conventions for the same kind of window.

Recommendation: **unify on the "above the frame" style for all dialogue.** It's the cleaner
look, it frees vertical room inside the box for the line + responses, and it matches your
instinct. Practically: always show `#vendor-header`-style name/title strip; drop the in-box
`#dialog-name`/`#dialog-role`. One wrinkle to handle — vendors put the portrait on the left
and normal NPCs on the right, so the header needs to sit consistently regardless of portrait
side.

### Text size
Current sizes are large for a 1920×1080 canvas:

| Element | Now | Suggested |
|---|---|---|
| NPC name (`.dialog-text h2`) | 40px | 34–36px |
| Role/title | 24px | 20px |
| Dialogue line (`#dialog-line`) | 24px | 20–21px |
| Responses | 24px | 20–21px |
| Contents list | 24px | 20px |

Dropping body/response text to ~20px gives noticeably more room and pairs well with the
200-char pagination. Vendor name is 44px — bring it in line with whatever the unified NPC
name size becomes.

### Enemies — HP/stats and challenge
Player at game start: **5 HP, Attack 1, Defense 1, dagger 2 dmg (unarmed 1), Speed 1, Luck 0.**

| Enemy | HP | Atk/Def | Dmg | Verdict |
|---|---|---|---|---|
| Blight Rat (barn) | 2 | 1/1 | 1 | Good tutorial fight — dagger one-shots it, winnable. |
| Bramblekin | 3 | 2/2 | 1d4 | Camp is Chief + 3 guards → ~5+ dmg/round vs 5 HP. Near-unwinnable at start by design (pay the 5g toll / return later). |
| Bramblekin Chief | 5 | 2/2 | 2–5 | Fine. |
| Rootweaver | 15 | 4/3 | 2–8 | Intended wall — flee or cheese with the torch's fire bonus. |

Two balance concerns, both rooted in starting stats:

1. **Speed 1 → 0% initiative.** With `playerInitiativeChance = (speed-1)/2`, a Speed-1 player
   *always* acts second, so they eat a hit before their first swing every fight — rough with
   only 5 HP. Consider starting Speed 2 (50/50) or giving an early, reliable way to raise it.
2. **Attack 1 vs Defense 2+ = sub-50% hit rate**, and there is currently **no +ATK gear or
   effect anywhere** to fix it. Fights against bramblekin-tier foes feel swingy/grindy with no
   lever to pull. Either add an attack-boosting item or start Attack at 2.

Drops themselves are well-designed: unified `gold {min,max}` + `loot [{id,chance}]`, tougher
foes pay more, quest drops (rootweaver heart) are guaranteed. No complaints there — **except
that enemies award no XP** (there's nothing to award it to yet; see §3).

### Money / pricing
Prices are mostly sensible and the "can't get rich instantly" goal is met — progression
items (short sword 25, leather armor 22, vitality potion 30) cost several fights or fishing
trips. A few specific issues:

- **Bread strictly dominates Health Potions economically.** Bread = 2g for +2 HP (1 g/HP);
  Health Potion = 8g for +3 HP (2.7 g/HP). A rational player never buys potions. Fix by
  nudging bread to heal 1 (or price 3), or make potions heal more.
- **Magic Potion (10g) is a dead purchase.** It tops up a hidden, unusable magic pool. Pull
  it from the apothecary's stock until a magic system exists, or players waste gold on it.
- **Lockpicks (15g) have no mechanic.** Purchasable but nothing in the game consumes them or
  gates on them. Same fix: remove from stock, or add locked chests/doors.
- **Fishing is an unbounded money faucet.** Each cast (bait ~2g) can land a trout (sells ~5g),
  net positive and repeatable forever. Fine early, but worth a soft cap or diminishing returns
  before the economy matures.

---

## 3. Missing RPG systems (the "XP" question)

- **XP / leveling — absent.** `stats.level` (4) and `stats.xp` (1240/2000) exist but are
  hidden and *never incremented anywhere in the code*. They're vestigial flavor. This is the
  most important genre feature you're missing. Two clean paths:
  - **(a) Implement it:** enemies drop XP → fill the bar → level up → +HP/atk/def/etc. Gives
    the "come back stronger" arc real teeth and makes the tough camp/rootweaver fights a goal
    rather than a wall.
  - **(b) Commit to gear-driven progression (Zelda-style)** and *remove* level/XP from the
    Stats tab so they don't mislead. If you go this route, you need more stat-granting gear
    (currently only leather armor +1 DEF and weapon damage exist).
- **No save/persistence.** No `localStorage`, no save/load — every refresh resets health,
  gold, inventory, quests, cleared encounters. Standard even for browser RPGs; high priority
  once there's enough content to lose.
- **Magic system** is stubbed (bar hidden, potion inert) — expected, just noting the
  dependency for the magic potion and the removed battle Magic slot.
- Death penalty is intentionally soft (full-heal respawn) — fine for this stage.

Everything else a turn-based RPG needs is present and working: inventory/equip, quest log
with states, shops with buy/sell, dialogue with per-status variants, loot drops, an initiative
system, and consumables.

---

## 4. Cleanup — unused assets & dead code

Safe to remove:
- **`assets/images/kobold.png`** — fully replaced by the Blight Rat; referenced only in stale
  comments.
- **`assets/audio/yodguard-locked-door-4-540180.mp3`** — replaced by the
  `universfield-negative-notification` "denied" sound; no code references it.

Dead/inert code (low priority):
- **`repeatable` flag** on interactables — supported in `main.js` but no interactable uses it.
- **`magicMax` / `restoreMagic`** — live but pointless until magic exists.

Not a bug, just noise:
- The local git working copy is in the **known stale-index state** documented in CLAUDE.md
  (phantom sprite deletions + case-renamed duplicates). The live site is unaffected and the
  documented deploy steps (`reset --soft origin/main` + `read-tree HEAD`) clear it. No action
  needed beyond following the normal deploy procedure. **Caution:** don't `git add -A` and
  commit the raw working tree without the reset/read-tree step — the phantom deletions target
  the very sprite files (`Mirelle_Overhead.png`, etc.) the code references, and GitHub Pages is
  case-sensitive.
- CLAUDE.md's **Status/roadmap section is out of date** — no mention of fishing, the torch/fire
  mechanic, D2's full vendor economy, or the Elowen/Osric/Darius/rootweaver quests. Worth a
  refresh so future sessions start from accurate context.

---

## 5. Suggested priority order

1. Decide the **progression model** (implement XP/leveling, or remove level/XP and lean on
   gear). Everything else in balance depends on this.
2. **Save system** (localStorage) — cheap, high player-value.
3. **Unify dialogue/vendor name placement** + **drop text ~3–4px** (your two UI asks; quick wins).
4. Balance tweaks: start **Speed 2**, add an **+ATK** lever, fix **bread vs. potion** value.
5. Remove **dead items from vendor stock** (magic potion, lockpicks) until their systems exist.
6. Delete **kobold.png** + the **unused locked-door audio**; refresh CLAUDE.md status.
