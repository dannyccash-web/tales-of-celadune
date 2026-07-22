// Tales of Celadune — entry point.
// Loads assets, builds the world for the current scene, runs the game loop.

import sceneD2 from './data/d2.js';
import sceneD3 from './data/d3.js';
import sceneD4 from './data/d4.js';
import { World } from './world.js';
import * as ui from './ui.js';
import * as audio from './audio.js';
import ITEMS, { statLineFor } from './data/items.js';
import QUESTS from './data/quests.js';
import ENEMIES from './data/enemies.js';
import * as battle from './battle.js';

// Attack/Defense/Speed/Luck all start at 1/1/1/0 (Danny's spec) — real combat
// stats. Speed drives battle.js's turn order + the player's initiative chance
// (Speed 1 -> 50% to act first, 2 -> 75%, 3 -> 100%). Luck adds +1 per point
// to the player's attack AND defense rolls (see effectiveAttack/Defense);
// starts at 0, raised later by gear/effects.
// Level/XP removed 2026-07-22 (Danny) — the game has no experience/leveling
// loop; progression is gear-driven (weapons/armor + vitality potions).
const stats = {
  health: 5, healthMax: 5, magic: 5, magicMax: 10, gold: 0,
  attack: 1, defense: 1, speed: 1, luck: 0,
};
// The canonical fresh-start stats, used to reset on New Game (2026-07-22).
const NEW_GAME_STATS = { ...stats };
const state = { started: false };

// Inventory *state* — what the player actually has, [{id, qty}], referencing
// js/data/items.js (the game-wide catalog) by id. Kept here alongside stats
// rather than in world/ui, which stay presentation-only.
const inventory = [];

// Equip *state* (2026-07-08) — one item id per slot, or null. Equipping
// never removes the item from `inventory`; it's just a separate pointer, so
// the item still shows up (with an "Equipped" marker) in its own category
// tab's grid (Equipment or Weapons — see items.js's categoryFor(), 2026-07-09).
// Only items whose catalog entry has a matching `slot` can go in a given
// slot — see js/data/items.js's schema comment.
// 'item' (2026-07-10) is the battle Use slot — an Items-category consumable
// equipped from the Items tab, consumed from the battle UI's Use diamond.
const equipment = { head: null, clothing: null, feet: null, hands: null, mainhand: null, offhand: null, item: null };

function refreshItemsUi() {
  ui.updateItemsPanel(inventory, ITEMS, equipment);
}

// `silent` skips the bag SFX — used by vendor trades, which play the coin
// exchange sound (via addGold/spendGold) instead so the transaction reads as
// money changing hands, not an item being rummaged out of a bag.
function addItem(id, qty = 1, silent = false) {
  const existing = inventory.find((it) => it.id === id);
  if (existing) existing.qty += qty; else inventory.push({ id, qty });
  refreshItemsUi();
  if (!silent) audio.sfx(audio.SFX.item);
}

function removeItem(id, qty = 1, silent = false) {
  const existing = inventory.find((it) => it.id === id);
  if (!existing) return;
  existing.qty -= qty;
  if (existing.qty <= 0) {
    inventory.splice(inventory.indexOf(existing), 1);
    // An item that's fully gone can't stay equipped (e.g. drinking the last
    // equipped Health Potion) — clear any slot still pointing at it.
    Object.keys(equipment).forEach((slot) => {
      if (equipment[slot] === id) equipment[slot] = null;
    });
  }
  refreshItemsUi();
  if (!silent) audio.sfx(audio.SFX.item);
}

// equipItem/unequipItem are the only two ways `equipment` changes — mirrors
// the addItem/removeItem/addGold/damagePlayer pattern of centralizing a
// piece of state's mutation + its UI refresh + its SFX in one place.
// refreshItemsUi() alone is enough to update the display (2026-07-09,
// dropped the separate ui.updateEquipmentPanel call now that Equipment/
// Weapons no longer have standalone slot boxes — equip state shows via the
// checkmark badge on the item's own tile, which updateItemsPanel already
// re-renders from `equipment`).
function equipItem(id) {
  const def = ITEMS[id];
  if (!def?.slot) return;
  equipment[def.slot] = id;
  refreshItemsUi();
  audio.sfx(audio.SFX.item);
}

function unequipItem(slot) {
  if (!equipment[slot]) return;
  equipment[slot] = null;
  refreshItemsUi();
  audio.sfx(audio.SFX.item);
}

// Effective Attack/Defense = base stat + every equipped item's bonus (most
// items grant +0 today — no armor with real bonuses exists yet, but the
// math is here so future gear just needs attackBonus/defenseBonus fields).
// weaponDamage(slot) is what a successful player attack with that weapon
// slot deals: the equipped weapon's damage (flat or {min,max} — rolled by
// the caller via battle.rollDamage), or 1 (unarmed) for a bare main hand.
// An empty off hand can't attack at all — its action slot is disabled in
// the battle UI (see showPlayerActions), so the unarmed fallback here only
// ever applies to mainhand in practice.
function equipmentBonus(field) {
  return Object.values(equipment).reduce((sum, id) => {
    if (!id) return sum;
    return sum + (ITEMS[id]?.[field] || 0);
  }, 0);
}
// Luck adds +1 per point to BOTH the player's attack and defense rolls
// (Danny, 2026-07-20). effectiveAttack is the attacker score when the player
// swings (main.js's playerAttack); effectiveDefense is the defender score when
// an enemy swings at the player — so folding luck into both means every roll
// the player is party to gets the bonus. Enemies use their own flat stats and
// are unaffected. Starts at 0; gear/temporary effects may raise it later.
function effectiveAttack() { return stats.attack + stats.luck + equipmentBonus('attackBonus'); }
function effectiveDefense() { return stats.defense + stats.luck + equipmentBonus('defenseBonus'); }

// Speed drives two things (Danny, 2026-07-20):
//  1) Overworld movement — a multiplier on PLAYER_SPEED: 1 -> ×1.0, 2 -> ×1.25,
//     3 -> ×1.5. Speed 3 is the cap, so higher values still give ×1.5, and it's
//     floored at ×1.0 for speed <= 1.
//  2) Battle initiative (D&D-style "advantage") — the chance the player's whole
//     block acts before the enemies each round: speed 1 -> 0% (enemies first),
//     2 -> 50%, 3 -> 100%. chance = (speed-1)/2, clamped to [0,1].
function moveMultForSpeed(speed) {
  const s = Math.max(1, Math.min(3, speed));
  return 1 + 0.25 * (s - 1);
}
function playerInitiativeChance(speed = stats.speed) {
  // Speed 1 -> 50%, 2 -> 75%, 3 -> 100% (2026-07-22, Danny — the player used to
  // always act last at Speed 1, which was punishing with only 5 HP).
  return Math.max(0, Math.min(1, 0.25 + 0.25 * speed));
}
function weaponDamage(slot = 'mainhand') {
  const item = equipment[slot] && ITEMS[equipment[slot]];
  return item?.damage ?? 1;
}

// Centralized gold/health mutators (mirroring addItem/removeItem) so every
// gold change or point of damage plays its sound from one place, regardless
// of source — collectibles today, shops/battle later.
function addGold(amount) {
  stats.gold += amount;
  ui.updateHud(stats);
  audio.sfx(audio.SFX.gold);
}

// Spend gold (e.g. the Bramblekin toll) — clamped at 0, same HUD + coin SFX
// as addGold so a payment is felt the same way a pickup is.
function spendGold(amount) {
  stats.gold = Math.max(0, stats.gold - amount);
  ui.updateHud(stats);
  audio.sfx(audio.SFX.gold);
}

function damagePlayer(amount) {
  stats.health = Math.max(0, stats.health - amount);
  ui.updateHud(stats);
  ui.flashHealthDamage();
  audio.sfx(audio.SFX.hurt);
}

// Restore health, clamped to healthMax. Returns how much was ACTUALLY restored
// (0 if already full) so callers can tailor their message. Mirrors damagePlayer
// as the centralized health-up mutator (well drink, and future heal sources).
function healPlayer(amount) {
  const before = stats.health;
  stats.health = Math.min(stats.healthMax, stats.health + amount);
  ui.updateHud(stats);
  return stats.health - before;
}

// Quest *state* — which quests the player has been given and their status,
// [{id, status}] (status: 'active' | 'completed' | 'failed'), referencing
// js/data/quests.js (the catalog) by id. Started only via startQuest() so a
// quest is never added twice.
const quests = [];

function startQuest(id) {
  if (quests.find((q) => q.id === id)) return; // already have it — no duplicates
  const def = QUESTS[id];
  if (!def) return;
  quests.push({ id, status: 'active' });
  ui.updateQuestsPanel(quests, QUESTS);
  ui.showQuestAdded(def.name);
  audio.sfx(audio.SFX.questAdded);
}

// The one way a quest resolves to 'completed' (2026-07-10, first real user:
// Brenna's barn_rat turn-in) — mirrors startQuest: state change + panel
// refresh + the top-center banner, all in one place.
function completeQuest(id) {
  const q = quests.find((entry) => entry.id === id);
  if (!q || q.status !== 'active') return;
  q.status = 'completed';
  ui.updateQuestsPanel(quests, QUESTS);
  ui.showQuestCompleted(QUESTS[id]?.name || id);
  audio.sfx(audio.SFX.questComplete);
}

function questStatus(id) {
  return quests.find((q) => q.id === id)?.status || 'none';
}

// An NPC's dialog can vary by quest status (e.g. Mirelle offers the crate
// once, then asks about its status on later visits instead of handing over
// a second one) via an optional dialogByQuestStatus map on the NPC — see
// js/data/d3.js. Falls back to the NPC's plain `dialog` if no variant
// matches the current status (including 'none', before the quest exists).
// `isQuestReady(questId)` (2026-07-10, optional) reports whether an active
// quest's world condition is met (e.g. the barn rat being dead — see
// QUEST_READY in boot()); when it is, an optional `readyToComplete`
// pseudo-status variant takes precedence over the plain 'active' one, so
// the turn-in conversation (thanks + reward + completeQuest effect) can
// live in scene data like every other variant.
function resolveNpcDialog(npc, isQuestReady) {
  if (!npc.dialogByQuestStatus) return npc.dialog;
  for (const [questId, variants] of Object.entries(npc.dialogByQuestStatus)) {
    const status = questStatus(questId);
    if (status === 'active' && variants.readyToComplete && isQuestReady?.(questId)) {
      return variants.readyToComplete;
    }
    const variant = variants[status];
    if (variant) return variant;
  }
  return npc.dialog;
}

const input = { up: false, down: false, left: false, right: false };

const KEYMAP = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
};

function loadImages(sources) {
  return Promise.all(sources.map((src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve([src, img]);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  }))).then(Object.fromEntries);
}

// Every scene in the game, keyed by the ids that exits point at. Adding a
// scene = write its data file, import it, and register it here — the
// transition system below handles everything else.
const SCENES = { D2: sceneD2, D3: sceneD3, D4: sceneD4 };

async function boot() {
  // Preload assets for EVERY registered scene up front — scene switches are
  // instant walk-off-the-edge transitions, so nothing may load mid-game.
  const sources = [
    'assets/images/Player_Overhead_1.png',
    // Bramblekin battle portraits — their fights start dynamically (not via a
    // scene `battles` entry), so preload them so nothing pops in mid-fight.
    'assets/images/Bramblekin.png',
    'assets/images/Bramblekin_Chief.png',
    // Per-fight/parley scene backdrops (2026-07-22) — preloaded so they don't
    // pop in when a battle/dialog overlay opens.
    'assets/images/barn_interior.jpg',
    'assets/images/forest_background.jpg',
    'assets/images/bramblekin_camp.jpg',
    ...Object.values(SCENES).flatMap((scene) => [
      scene.background,
      // Places (isPlace: true, e.g. "Your House") have no sprite — they're
      // always atHome and never rendered as a walking body — so skip them.
      ...scene.npcs.filter((n) => n.sprite).map((n) => n.sprite),
      ...scene.npcs.filter((n) => n.home).map((n) => n.home.interior),
      // Every enemy portrait a scene's battles could use — battle art
      // shouldn't pop in mid-fight.
      ...(scene.battles || []).flatMap((b) => b.enemies).map((id) => ENEMIES[id].portrait),
    ]),
  ];
  const images = await loadImages([...new Set(sources)]);

  // Canvas text (NPC name labels) needs the webfont ready before first draw
  try { await document.fonts.load('22px MedievalSharp'); } catch { /* fallback font */ }

  const canvas = document.getElementById('game');

  // One World instance PER SCENE, created on first visit and kept for the
  // whole session — so per-scene state (battle `defeated` flags, collected
  // interactables, NPC positions mid-routine) persists when the player
  // leaves and comes back. `world` is the live one; everything below
  // closes over the binding, not a specific instance.
  const worlds = {};
  let world;
  let currentSceneId = 'D3'; // tracks the active scene for autosave (2026-07-22)
  // Per-scene flags to re-apply when a World is (re)built from a loaded save —
  // collected interactables, cleared battles/ambushes, and slain camp members.
  // Set by loadGame(); consumed the first time each scene's World is created.
  let pendingWorldFlags = null;
  function applyWorldFlags(w, f) {
    if (!f) return;
    (f.collected || []).forEach((i) => { if (w.interactables[i]) w.interactables[i].collected = true; });
    (f.battles || []).forEach((id) => { const b = w.battles.find((x) => x.id === id); if (b) b.defeated = true; });
    (f.ambushes || []).forEach((id) => { const a = w.ambushes.find((x) => x.id === id); if (a) a.defeated = true; });
    (f.npcsDefeated || []).forEach((id) => { const n = w.npcs.find((x) => x.id === id); if (n) n.defeated = true; });
  }
  function enterScene(id) {
    const fresh = !worlds[id];
    if (fresh) worlds[id] = new World(canvas, SCENES[id], images);
    world = worlds[id];
    currentSceneId = id;
    window.world = world; // debug handle follows the active scene
    if (fresh && pendingWorldFlags) applyWorldFlags(world, pendingWorldFlags[id]);
  }
  enterScene('D3');
  window.quests = quests; // debug handle

  // Walking off a scene edge: the player reappears on the OPPOSITE edge of
  // the target scene with their cross-axis position preserved (exit D3's
  // east edge mid-path -> enter D4's west edge at the same height), per the
  // design spec. 20px inset keeps the 36px collider fully inside the new
  // scene so the return exit doesn't immediately re-trigger.
  // Bramblekin toll (D4) — resets every time the player (re)enters D4, so the
  // Chief shakes travelers down again on each return. `campTollPaid`: paid the
  // 5-gold toll (or won the fight) — the camp unseals, sentries step aside.
  // `campEntered`: agreed at a gate to see the Chief and was let in — now the
  // membrane flips from "can't enter" to "can't leave" (world.js). Reset on
  // every fresh D4 arrival, and campEntered also clears on respawn (the player
  // wakes up outside the camp).
  let campTollPaid = false;
  let campEntered = false;
  // `campQuestDone`: completed the Chief's rootweaver-heart favor — grants
  // PERMANENT passage (unlike paying, which re-blocks on each D4 visit).
  // `campHostile`: the player drew steel on a camp member, so every Bramblekin
  // now attacks on sight (world.js's checkCampAggro). Both persist across D4
  // re-entry (they're not reset in switchScene) — a favor stays done, and the
  // camp stays angry once blood's been drawn. `campEntryGate`: which gate the
  // player entered through, so accepting the favor sets them back down just
  // outside that same gate.
  let campQuestDone = false;
  let campHostile = false;
  let campEntryGate = null;
  const CAMP_FEE = 5;
  const CAMP_QUEST_REWARD = 10; // gold the Chief pays on top of safe passage
  const BRAMBLEKIN_BG = 'assets/images/bramblekin_camp.jpg'; // backdrop for any Bramblekin parley (2026-07-22)
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Vegetable-delivery quest progress (2026-07-16): set when the player hands
  // Mirelle's crate to Bram at the tavern (who pays 5 gold for her). It's the
  // quest's `readyToComplete` condition — Mirelle then offers to be paid back
  // (or lied to). Session-scoped, never reset (quest progress, not per-scene).
  let vegetableDeliveredToTavern = false;

  // The two stationary gate sentries step to their gate's `aside` spot when the
  // toll's paid (so the player passes freely) and back to their post on a fresh
  // D4 visit. `_post` remembers where they stood so the reset is exact.
  function stepSentriesAside() {
    for (const s of world.npcs.filter((n) => n.sentry)) {
      const gate = world.scene.camp?.gates.find((g) => g.id === s.gate);
      if (gate?.aside) { s._post = s._post || { x: s.x, y: s.y }; s.x = gate.aside.x; s.y = gate.aside.y; }
    }
  }
  function resetCampSentries() {
    for (const s of world.npcs.filter((n) => n.sentry)) {
      if (s._post) { s.x = s._post.x; s.y = s._post.y; }
    }
  }

  // Set the player down just outside the camp (the gate they came in through) —
  // used when they accept the Chief's favor or step out with the quest still
  // open, so agreeing to hunt rootweavers doesn't strand them inside the
  // sealed membrane (2026-07-17).
  function teleportOutsideCamp() {
    campEntered = false;
    const gates = world.scene.camp?.gates || [];
    const gate = gates.find((g) => g.id === campEntryGate) || gates[0];
    if (gate?.outside) { world.player.x = gate.outside.x; world.player.y = gate.outside.y; }
  }

  // Draw steel on a single camp member (a gate guard, a wanderer via aggro, or
  // the Chief). Turns the whole camp hostile (every Bramblekin now attacks on
  // sight) and starts a one-on-one fight with just that NPC — winning marks it
  // slain (gone for good, on the cached World). Fighting does NOT buy passage:
  // it just makes the camp hostile, and a hostile camp's membrane is open, so
  // the player fights or dodges their way through rather than being waved past.
  // Resolves the LIVE world npc by id (the dialog gets a shallow copy, so
  // mutating that wouldn't stick). Deferred a tick so the dialog closes first.
  function fightCampMember(npcId) {
    campHostile = true;
    const live = world.npcs.find((n) => n.id === npcId);
    const enemyId = npcId === 'bramblekin_chief' ? 'bramblekin_chief' : 'bramblekin';
    setTimeout(() => startBattle([enemyId], (result) => {
      if (result === 'victory' && live) live.defeated = true;
    }), 0);
  }

  const EDGE_INSET = 20;
  function switchScene(exit) {
    const { x: px, y: py, rotation } = world.player;
    enterScene(exit.to);
    // Re-arm the Bramblekin toll on every fresh arrival into D4 (sentries back
    // on post, camp resealed).
    if (exit.to === 'D4') { campTollPaid = false; campEntered = false; resetCampSentries(); }
    const s = world.scene;
    if (exit.edge === 'right') { world.player.x = EDGE_INSET; world.player.y = py; }
    if (exit.edge === 'left') { world.player.x = s.width - EDGE_INSET; world.player.y = py; }
    if (exit.edge === 'bottom') { world.player.y = EDGE_INSET; world.player.x = px; }
    if (exit.edge === 'top') { world.player.y = s.height - EDGE_INSET; world.player.x = px; }
    world.player.rotation = rotation; // keep facing across the boundary
    saveGame(); // autosave on entering a new screen (2026-07-22)
  }

  // ---- Save system (2026-07-22, Danny) ----
  // One versioned localStorage slot. Autosaves on entering a new screen
  // (switchScene, above) and on starting a new game, so "the last screen you
  // walked into" is always the resume point. The start screen offers New Game /
  // Continue; Continue on the death screen reloads this same save. Progression
  // is gear-driven (no level/XP), so the save is stats + inventory + equipment +
  // quests + a few cross-scene story flags + a compact per-scene world snapshot
  // (which collectibles/battles/ambushes/camp-members are already cleared).
  const SAVE_KEY = 'celadune_save_v1';

  function hasSave() {
    try { return !!localStorage.getItem(SAVE_KEY); } catch { return false; }
  }

  function snapshotWorlds() {
    const out = {};
    for (const [id, w] of Object.entries(worlds)) {
      out[id] = {
        collected: w.interactables.map((it, i) => (it.collected ? i : -1)).filter((i) => i >= 0),
        battles: w.battles.filter((b) => b.defeated).map((b) => b.id),
        ambushes: w.ambushes.filter((a) => a.defeated).map((a) => a.id),
        npcsDefeated: w.npcs.filter((n) => n.defeated).map((n) => n.id),
      };
    }
    return out;
  }

  function saveGame() {
    try {
      const data = {
        v: 1,
        scene: currentSceneId,
        player: { x: world.player.x, y: world.player.y, rotation: world.player.rotation },
        stats: { ...stats },
        inventory: inventory.map((e) => ({ ...e })),
        equipment: { ...equipment },
        quests: quests.map((q) => ({ ...q })),
        flags: { campQuestDone, campHostile, gafferHappy, wellCoinThrown, vegetableDeliveredToTavern },
        worlds: snapshotWorlds(),
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch { /* storage blocked or full — skip silently, gameplay is unaffected */ }
  }

  function refreshAllUi() {
    ui.updateHud(stats);
    ui.updateStatsPanel(stats);
    refreshItemsUi();
    ui.updateQuestsPanel(quests, QUESTS);
  }

  // Wipe every bit of run state back to a pristine start and drop the player at
  // the D3 spawn. Used by New Game (and as loadGame's fallback).
  function resetToNewGame() {
    Object.assign(stats, NEW_GAME_STATS);
    inventory.length = 0;
    for (const k of Object.keys(equipment)) equipment[k] = null;
    quests.length = 0;
    campTollPaid = false; campEntered = false; campQuestDone = false;
    campHostile = false; campEntryGate = null;
    gafferHappy = false; wellCoinThrown = false; vegetableDeliveredToTavern = false;
    for (const k of Object.keys(worlds)) delete worlds[k];
    pendingWorldFlags = null;
    enterScene('D3');
    world.player.x = world.scene.spawn.x;
    world.player.y = world.scene.spawn.y;
    refreshAllUi();
  }

  function loadGame() {
    let data;
    try { data = JSON.parse(localStorage.getItem(SAVE_KEY)); } catch { data = null; }
    if (!data) return false;
    Object.assign(stats, NEW_GAME_STATS, data.stats || {});
    inventory.length = 0; (data.inventory || []).forEach((e) => inventory.push({ ...e }));
    for (const k of Object.keys(equipment)) equipment[k] = null;
    Object.assign(equipment, data.equipment || {});
    quests.length = 0; (data.quests || []).forEach((q) => quests.push({ ...q }));
    const f = data.flags || {};
    campQuestDone = !!f.campQuestDone; campHostile = !!f.campHostile;
    gafferHappy = !!f.gafferHappy; wellCoinThrown = !!f.wellCoinThrown;
    vegetableDeliveredToTavern = !!f.vegetableDeliveredToTavern;
    // Per-visit camp state always starts fresh on a load (toll re-armed, not
    // mid-entry) — only the permanent flags above persist.
    campTollPaid = false; campEntered = false; campEntryGate = null;
    for (const k of Object.keys(worlds)) delete worlds[k];
    pendingWorldFlags = data.worlds || {};
    enterScene(data.scene && SCENES[data.scene] ? data.scene : 'D3');
    const p = data.player || {};
    world.player.x = p.x ?? world.scene.spawn.x;
    world.player.y = p.y ?? world.scene.spawn.y;
    if (p.rotation != null) world.player.rotation = p.rotation;
    refreshAllUi();
    return true;
  }

  // Debug handle for scene transitions (mirrors window.world/battleDebug —
  // and like them, NOT named after any element id). Lets automation drive
  // world.update + consume pendingExit manually, since rAF freezes in
  // hidden tabs (see the live-testing notes in CLAUDE.md).
  window.sceneDebug = {
    switchScene,
    enterScene,
    worlds,
    sceneIds: Object.keys(SCENES),
    hasScene: (id) => !!SCENES[id],
  };

  ui.initStage();
  ui.initPanels(audio);
  ui.updateHud(stats);
  ui.updateStatsPanel(stats);
  ui.initItemsPanel({ onAction: onItemAction });
  ui.initVendorGrid();
  refreshItemsUi();
  ui.updateQuestsPanel(quests, QUESTS);
  ui.initGameOver({ onRestart: () => continueFromDeath() });
  ui.initBattle();

  // Start screen: theme music now (or on first gesture if autoplay is blocked),
  // then cross-fade to the overworld track when the game starts.
  audio.play(audio.TRACKS.theme);
  const retryTheme = () => {
    if (!state.started && !audio.nowPlaying()) audio.play(audio.TRACKS.theme);
  };
  window.addEventListener('pointerdown', retryTheme);
  window.addEventListener('keydown', retryTheme);

  // Begin play: hide the start screen, cross-fade to the overworld track. The
  // actual run state is set up by startNewGame()/continueGame() around this.
  function beginPlay() {
    if (state.started) return;
    state.started = true;
    document.getElementById('start-screen').classList.add('hidden');
    audio.play(audio.TRACKS.overworld, 1500);
  }
  function startNewGame() {
    resetToNewGame();
    beginPlay();
    saveGame(); // so Continue works immediately and a right-away death has a save
  }
  function continueGame() {
    if (!loadGame()) { startNewGame(); return; }
    beginPlay();
  }

  const btnContinue = document.getElementById('btn-continue');
  const btnNewGame = document.getElementById('btn-new-game');
  const confirmOverlay = document.getElementById('newgame-confirm');
  btnContinue.classList.toggle('disabled', !hasSave());
  btnContinue.addEventListener('click', () => { if (hasSave()) continueGame(); });
  btnNewGame.addEventListener('click', () => {
    if (hasSave()) confirmOverlay.classList.remove('hidden'); // warn before erasing
    else startNewGame();
  });
  document.getElementById('btn-confirm-newgame').addEventListener('click', () => {
    confirmOverlay.classList.add('hidden');
    startNewGame();
  });
  document.getElementById('btn-cancel-newgame').addEventListener('click', () => {
    confirmOverlay.classList.add('hidden');
  });

  // Continue from the death screen (2026-07-22): reload the last save (the start
  // of the screen the player last walked into). Discards the dead fight's onEnd
  // callback since loadGame rebuilds the scene from scratch. Falls back to the
  // old full-heal respawn only if, somehow, there's no save on file.
  function continueFromDeath() {
    pendingDefeatCallback = null;
    ui.hideGameOver();
    if (!loadGame()) respawnAfterDefeat();
  }

  // Gaffer only warms up once he's been fed (session state, not persisted —
  // matches how the world's `defeated`/`collected` flags reset per World).
  let gafferHappy = false;

  // The D3 well's coin-for-luck offer is one-time per session (like gafferHappy,
  // not persisted). Drinking from the well is always available; tossing a coin
  // for +1 Luck can only happen once. See openWellDialog().
  let wellCoinThrown = false;

  // A response can carry an optional effect (dialog.responseEffects, parallel
  // to dialog.responses) — damage (Gaffer's bite), a plain toast message,
  // startQuest (adds a quest + fires the "Quest Added" banner), addGold /
  // completeQuest (Brenna's turn-in, 2026-07-10), grantItem (e.g. Mirelle's
  // vegetable crate), feedGaffer (the corn hand-off), and/or followUp (a
  // reply line that keeps the dialog open — the generic version of
  // grantItem's thankYou). grantItem/feedGaffer/followUp return true so
  // ui.chooseResponse() keeps the dialog open instead of closing.
  function applyResponseEffect(npc, index) {
    const effect = npc.dialog.responseEffects?.[index];
    if (!effect) return;
    // "Go back." on a follow-up line — restore the dialog content the
    // follow-up replaced (captured below), so the player can revisit the
    // other response options instead of only leaving (2026-07-10).
    if (effect.goBack) {
      ui.updateDialogContent(effect.goBack);
      return true;
    }
    // Vendor Buy/Sell: swap the response box into the item grid, in place —
    // the dialog window stays open (portrait/name/role untouched), matching
    // how every other in-dialog choice behaves.
    if (effect.shop) {
      openVendorGrid(npc, effect.shop);
      return true; // stay open — we're managing the response box ourselves
    }
    // Bramblekin Chief toll: pay it (deduct the fee, mark paid this visit, step
    // the sentries aside, swap in a parting line).
    if (effect.payToll) {
      spendGold(CAMP_FEE);
      campTollPaid = true;
      stepSentriesAside();
      ui.updateDialogContent({
        line: 'Pleasure doing business. The camp’s yours to cross — this once. Wander back through and we’ll dance again.',
        responses: ['Leave.'],
      });
      return true;
    }
    // Draw steel on the Chief — the whole camp turns hostile and a fight with
    // just the Chief begins (his guards join in only if the player then wanders
    // within range of them, per the aggro rules).
    if (effect.drawSteel) {
      fightCampMember(npc.id);
      return; // falsy — ui closes the dialog, then the battle opens
    }
    // Accept the Chief's favor when you can't pay: start the rootweaver-heart
    // quest and get set down just outside the camp so you can go hunt.
    if (effect.acceptFavor) {
      startQuest('rootweaver_favor');
      teleportOutsideCamp();
      return; // falsy — dialog closes
    }
    // Step back out of the camp with the favor still open (no heart yet) — a
    // graceful exit from inside the sealed membrane.
    if (effect.leaveCamp) {
      teleportOutsideCamp();
      return;
    }
    // Hand the Chief the rootweaver heart: complete the favor, take the gold,
    // and earn PERMANENT safe passage (campQuestDone never resets).
    if (effect.turnInHeart) {
      removeItem('rootweaver_heart', 1, true);
      ui.showGaveItem(ITEMS.rootweaver_heart);
      addGold(CAMP_QUEST_REWARD);
      completeQuest('rootweaver_favor');
      campQuestDone = true;
      campTollPaid = true;
      stepSentriesAside();
      ui.updateDialogContent({
        line: 'A deal’s a deal. The camp’s open to you — for good, this time. Now get out of my firelight.',
        responses: ['Leave.'],
      });
      return true;
    }
    // Hand Mirelle's crate to Bram at the tavern: he takes it, pays 5 gold for
    // her, and asks the player to carry the coin back to her. Marks the quest
    // ready to turn in at Mirelle (readyToComplete). One-time (the response
    // only appears while the player holds the crate + the quest is active).
    if (effect.deliverVegetables) {
      removeItem('vegetable_crate', 1, true);
      ui.showGaveItem(ITEMS.vegetable_crate);
      addGold(5);
      vegetableDeliveredToTavern = true;
      ui.updateDialogContent({
        line: 'Mirelle’s crate — been waiting on these! Here, five gold for her trouble. See it finds its way back to her, won’t you? Good lass, that one.',
        responses: ['Leave.'],
      });
      return true;
    }
    // Turn-in at Mirelle: hand over the tavern's 5 gold honestly...
    if (effect.giveMirelleGold) {
      spendGold(5);
      completeQuest('vegetable_delivery');
      ui.updateDialogContent({
        line: 'You didn’t have to — but bless you for it. Honest folk are rarer than good weather these days. Safe travels, dear.',
        responses: ['Leave.'],
      });
      return true;
    }
    // Hand Darius the Moonscale Trout: he pays 20 gold (double its market
    // value) and the fish quest completes.
    if (effect.giveDariusFish) {
      removeItem('rare_fish', 1, true);
      ui.showGaveItem(ITEMS.rare_fish);
      addGold(20);
      completeQuest('rare_fish');
      ui.updateDialogContent({
        line: 'Would you look at that — a Moonscale, big as my forearm! Here, twenty gold, and cheap at the price. You’ve made an old fisherman’s year.',
        responses: ['Leave.'],
      });
      return true;
    }
    // ...or pocket it and claim the tavern stiffed you. Quest completes either
    // way — Mirelle's none the wiser.
    if (effect.lieToMirelle) {
      completeQuest('vegetable_delivery');
      ui.updateDialogContent({
        line: 'Not a copper? That old skinflint. Ah well — thank you for carrying them all the same, dear. Least the stew got made.',
        responses: ['Leave.'],
      });
      return true;
    }
    if (effect.damage) damagePlayer(effect.damage);
    // Hand an item over on turn-in (generic fetch-quest reward, 2026-07-19):
    // removes it and plays the "Gave" reveal, then addGold/completeQuest/
    // followUp below finish the exchange. `heal` is a full/large restore used
    // as a priestess "blessing".
    if (effect.takeItem) { removeItem(effect.takeItem, effect.takeQty ?? 1, true); ui.showGaveItem(ITEMS[effect.takeItem]); }
    if (effect.heal) { stats.health = Math.min(stats.healthMax, stats.health + effect.heal); ui.updateHud(stats); }
    if (effect.startQuest) startQuest(effect.startQuest);
    if (effect.addGold) addGold(effect.addGold);
    if (effect.completeQuest) completeQuest(effect.completeQuest);
    if (effect.grantItem) {
      addItem(effect.grantItem, effect.qty ?? 1);
      ui.showReceivedItem(ITEMS[effect.grantItem]);
      if (effect.thankYou) {
        // Leave-only on purpose: going "back" from here would re-run the
        // one-time grant response. Same reasoning as followUp's noBack.
        ui.updateDialogContent({ line: effect.thankYou, responses: ['Leave.'] });
      }
      return true;
    }
    if (effect.feedGaffer) {
      removeItem('corn', 1);
      gafferHappy = true;
      ui.showGaveItem(ITEMS.corn); // the GAVE reveal — mirror of receiving
      ui.updateDialogContent({
        line: 'Gaffer snatches the corn straight from your hand and demolishes it, cob and all. He fixes you with a look of profound reevaluation.',
        responses: ['Pet Gaffer.', 'Leave.'],
        responseEffects: [{ followUp: GAFFER_HAPPY_PET_LINE }, null],
      });
      return true;
    }
    if (effect.message) ui.toast(effect.message);
    if (effect.followUp) {
      // NPC replied to the player's response — offer at least "Go back."
      // (restores the options they came from) and "Leave.". Effects that
      // must not be re-runnable set noBack: true (e.g. Brenna's quest
      // accept, where going back would show the already-answered offer).
      const prev = { line: npc.dialog.line, responses: npc.dialog.responses, responseEffects: npc.dialog.responseEffects };
      const responses = effect.noBack ? ['Leave.'] : ['Go back.', 'Leave.'];
      const responseEffects = effect.noBack ? [null] : [{ goBack: prev }, null];
      ui.updateDialogContent({ line: effect.followUp, responses, responseEffects });
      return true;
    }
  }

  const GAFFER_HAPPY_PET_LINE = 'Gaffer leans into your hand and bleats contentedly. His beard smells of corn and questionable decisions.';

  // Gaffer's dialog is built dynamically instead of via quest variants —
  // it depends on session state (fed or not) and inventory (holding corn),
  // not on a quest. Unfed with corn in your bag: a "Feed Gaffer some corn."
  // option appears (and petting still bites). Once fed, he's a friend for
  // life: petting is safe and the flavor text warms up.
  function buildGafferDialog(npc) {
    if (gafferHappy) {
      return {
        line: 'Gaffer looks up mid-chew, ears flopping. For a goat, the expression is downright friendly.',
        responses: ['Pet Gaffer.', 'Leave.'],
        responseEffects: [{ followUp: GAFFER_HAPPY_PET_LINE }, null],
      };
    }
    if (inventory.some((it) => it.id === 'corn')) {
      return {
        line: npc.dialog.line,
        responses: ['Pet Gaffer.', 'Feed Gaffer some corn.', 'Leave.'],
        responseEffects: [
          { damage: 1, message: 'Gaffer nips you! -1 health.' },
          { feedGaffer: true },
          null,
        ],
      };
    }
    return npc.dialog;
  }

  // Popout actions from the Items tab. Inspect/Remove are unchanged; the
  // primary action (top button) is Equip/Unequip for gear (def.slot set),
  // Use-to-heal for potions (def.heal set), or the old "nothing yet" stub
  // for anything else (e.g. the vegetable crate) — see ui.js's
  // openItemPopout(), which decides the button's label/action to match.
  function onItemAction(itemId, action) {
    const def = ITEMS[itemId];
    if (!def) return;
    if (action === 'inspect') { ui.showItemInspect(def.description, statLineFor(def)); return; }
    if (action === 'remove') { removeItem(itemId); return; }
    if (action === 'equip') { equipItem(itemId); return; }
    if (action === 'unequip') { unequipItem(def.slot); return; }
    if (action === 'use') {
      if (isConsumable(def)) { ui.toast(usePotion(itemId).message); return; }
      ui.toast('Nothing happens... yet.');
    }
  }

  // An item is "usable" (gets a Use action + the battle Use slot) if it has any
  // consume-on-use effect: heal (HP), restoreMagic (MP), or vitality (max HP).
  function isConsumable(def) {
    return !!(def && (def.heal || def.restoreMagic || def.vitality));
  }

  // Shared by the Items-tab "Use" action and the battle Potion action —
  // consumes one, restores HP (capped at max), and reports back what
  // happened as a {ok, message} pair rather than showing it itself: the two
  // call sites display it differently (a toast outside battle, the battle
  // status line during one — see playerUseItem()) and firing a toast from
  // in here unconditionally used to visually collide with the battle status
  // bar, which sits in roughly the same spot.
  function usePotion(itemId) {
    const entry = inventory.find((it) => it.id === itemId);
    if (!entry || entry.qty < 1) return { ok: false, message: 'You have none of those.' };
    const def = ITEMS[itemId];
    if (def.heal) {
      const before = stats.health;
      removeItem(itemId, 1);
      stats.health = Math.min(stats.healthMax, stats.health + def.heal);
      ui.updateHud(stats);
      return { ok: true, message: `You use a ${def.name}. +${stats.health - before} health.` };
    }
    if (def.restoreMagic) {
      const before = stats.magic;
      removeItem(itemId, 1);
      stats.magic = Math.min(stats.magicMax, stats.magic + def.restoreMagic);
      ui.updateHud(stats);
      return { ok: true, message: `You drink a ${def.name}. +${stats.magic - before} magic.` };
    }
    if (def.vitality) {
      // Permanent max-HP boost — the new capacity fills in immediately so the
      // player feels it (the HUD bar also widens: it scales with healthMax).
      removeItem(itemId, 1);
      stats.healthMax += def.vitality;
      stats.health += def.vitality;
      ui.updateHud(stats);
      return { ok: true, message: `You drink a ${def.name}. Maximum health increased by ${def.vitality}!` };
    }
    return { ok: false, message: 'Nothing happens.' };
  }

  // Builds the dialog "view" for an unoccupied building (a place, not an
  // NPC) — blank role, its description standing in for a dialogue line, and
  // one "Take {item name}" response per item still in the room (plus
  // Leave.). `place.items` is the WORLD's own copy of the room's remaining
  // item ids (js/world.js shallow-copies each npc off scene data, so
  // reassigning it here — always via non-mutating .filter(), never
  // .splice()/.push() — never touches the original scene module data).
  function buildPlaceView(place) {
    const contents = place.items.map((id) => ({ id, name: ITEMS[id]?.name || id }));
    const takeResponses = place.items.map((id) => `Take ${ITEMS[id]?.name || id}`);
    const takeEffects = place.items.map((id) => ({ takeItem: id }));
    return {
      ...place,
      role: '',
      contents,
      dialog: {
        line: place.description,
        responses: [...takeResponses, 'Leave.'],
        responseEffects: [...takeEffects, null],
      },
    };
  }

  // A "Take X" response removes that item from the room, grants it to the
  // player (same received-item reveal as Mirelle's vegetable crate), and
  // rebuilds the room's dialog in place — same "stay open, refresh content"
  // mechanism as the quest-thank-you flow (see ui.updateDialogContent()).
  function applyPlaceResponse(place, npcView, index) {
    const effect = npcView.dialog.responseEffects?.[index];
    if (!effect?.takeItem) return; // Leave. (or nothing) — close normally
    place.items = place.items.filter((id) => id !== effect.takeItem);
    addItem(effect.takeItem, 1);
    ui.showReceivedItem(ITEMS[effect.takeItem]);
    const refreshed = buildPlaceView(place);
    ui.updateDialogContent({
      line: refreshed.dialog.line,
      responses: refreshed.dialog.responses,
      responseEffects: refreshed.dialog.responseEffects,
      contents: refreshed.contents,
    });
    return true; // keep browsing the room
  }

  // Which active quests' world conditions are currently satisfied — feeds
  // resolveNpcDialog's readyToComplete pseudo-status. Lives here (not in
  // scene data) because conditions read live world state.
  const QUEST_READY = {
    barn_rat: () => !!world.battles.find((b) => b.id === 'old_barn_rats')?.defeated,
    vegetable_delivery: () => vegetableDeliveredToTavern,
    rare_fish: () => inventory.some((it) => it.id === 'rare_fish'),
    elowen_offering: () => inventory.some((it) => it.id === 'bread'),
    osric_boot: () => inventory.some((it) => it.id === 'old_boot'),
  };
  const isQuestReady = (id) => QUEST_READY[id]?.() ?? false;

  // ---- Bramblekin toll-camp dialog (D4, 2026-07-11) ----
  // Guard chit-chat and the Chief's toll are state-built (they depend on
  // whether the toll's been paid this visit), like Gaffer's dialog — routed
  // through openNpcDialog's branches below. The gate confrontation is a
  // separate, gate-triggered dialog (openGateConfrontation).
  function buildBramblekinDialog(npc) {
    if (campTollPaid || campQuestDone) return { line: npc.paidLine || 'Toll’s paid. Move along, then.', responses: ['Leave.'] };
    return { line: npc.line, responses: ['Leave.'] };
  }

  // The Chief's dialog (2026-07-17 rework). Once passage is granted (paid this
  // visit or the favor's done for good) he just waves you on. Otherwise the
  // options depend on the rootweaver-favor quest and your purse:
  //   - no quest, can pay -> Pay / Draw steel
  //   - no quest, too poor -> Accept the favor / Refuse (Draw steel)
  //   - favor active, holding a heart -> Turn it in / Draw steel
  //   - favor active, no heart -> (Pay, if now affordable) / step out / Draw steel
  // "Draw steel" is always available — the player can fight the Chief anytime.
  function buildChiefDialog() {
    if (campTollPaid || campQuestDone) {
      return {
        line: 'You again. You’ve squared your debt — I remember your ugly face. Move along before I dream up a second toll.',
        responses: ['Leave.'],
      };
    }
    const hasHeart = inventory.some((it) => it.id === 'rootweaver_heart');
    const q = questStatus('rootweaver_favor');
    if (q === 'active') {
      if (hasHeart) {
        return {
          line: '...you actually did it. A rootweaver’s heart. Hand it here and the camp’s yours to cross — I’m even good for a little gold.',
          responses: ['Hand over the heart.', 'Draw steel.'],
          responseEffects: [{ turnInHeart: true }, { drawSteel: true }],
        };
      }
      const responses = [];
      const effects = [];
      if (stats.gold >= CAMP_FEE) { responses.push('Pay 5 gold.'); effects.push({ payToll: true }); }
      responses.push('I’ll be back with the heart.'); effects.push({ leaveCamp: true });
      responses.push('Draw steel.'); effects.push({ drawSteel: true });
      return {
        line: 'No heart, no bargain. The rootweavers still choke my woods — go bring me one’s heart, and don’t come whining back till you have it.',
        responses,
        responseEffects: effects,
      };
    }
    if (stats.gold >= CAMP_FEE) {
      return {
        line: 'Five gold to cross my camp — and since you’re already standing in it, your choices are the coin or the blade. Pay up, or draw steel. Makes no difference to me.',
        responses: ['Pay 5 gold.', 'Draw steel.'],
        responseEffects: [{ payToll: true }, { drawSteel: true }],
      };
    }
    return {
      line: 'No coin? Then earn your way. The rootweavers have grown thick in these woods — bring me the heart of one and you may pass, with a little gold besides. Or we can settle this the bloody way.',
      responses: ['Accept the favor.', 'Refuse. (Draw steel)'],
      responseEffects: [{ acceptFavor: true }, { drawSteel: true }],
    };
  }

  // Entry confrontation, fired by world.pendingGate when the player pushes
  // against the sealed camp boundary from OUTSIDE (only while the camp isn't
  // yet hostile — once it is, the sentries just attack, no dialog). Three ways
  // through: see the Chief (teleport in past the guard, then his dialog opens
  // straight away), fight the guard (camp turns hostile, one-on-one), or leave
  // (the guard shrugs you off and the membrane keeps you out). `parted` guards
  // against the index remap after the parting line is swapped in.
  function openGateConfrontation(gateId) {
    const gate = world.scene.camp?.gates.find((g) => g.id === gateId);
    const sentry = world.npcs.find((n) => n.sentry && n.gate === gateId && !n.defeated)
      || world.npcs.find((n) => n.bramblekin && !n.defeated);
    const view = {
      id: 'bramblekin', name: 'Bramblekin', role: '',
      portrait: 'assets/images/Bramblekin.png',
      background: BRAMBLEKIN_BG,
      dialog: {
        line: 'Far enough. Nobody crosses this camp without squaring up with the chief — so it’s in to see him, steel if you’d rather, or turn around. Which is it?',
        responses: ['Take me to the chief.', 'Fight the guard.', 'Leave.'],
      },
    };
    let parted = false;
    ui.openDialog(view, null, (v, index) => {
      if (parted) return; // the parting line's only response just closes
      if (index === 0) {
        campEntered = true;
        campEntryGate = gateId;
        if (gate?.inside) { world.player.x = gate.inside.x; world.player.y = gate.inside.y; }
        // The chief's dialog begins the moment you're brought inside.
        setTimeout(() => {
          const chief = world.npcs.find((n) => n.id === 'bramblekin_chief');
          if (chief) openNpcDialog(chief);
        }, 0);
        return;
      }
      if (index === 1) {
        if (sentry) fightCampMember(sentry.id);
        return;
      }
      // Leave — the guard waves you off; the membrane keeps you outside.
      parted = true;
      ui.updateDialogContent({
        line: 'Suit yourself. Mind you don’t wander back this way without coin.',
        responses: ['Leave.'],
      });
      return true;
    });
  }

  // Turn-back, fired by world.pendingLeave when the player (already inside and
  // unpaid) pushes against the boundary trying to LEAVE. Just a shove-back
  // message — the membrane already reverted their move; their only ways out
  // are paying the Chief or fighting.
  function openLeaveConfrontation() {
    const view = {
      id: 'bramblekin', name: 'Bramblekin', role: '',
      portrait: 'assets/images/Bramblekin.png',
      background: BRAMBLEKIN_BG,
      dialog: {
        line: 'Nobody leaves till the chief’s been paid. Go see him. Pay the toll, or fight your way out — those are your only two ways past me.',
        responses: ['Fine.'],
      },
    };
    ui.openDialog(view, null, () => {});
  }

  // A hidden Rootweaver ambush sprang — start the fight. Winning clears it for
  // good; fleeing shoves the player back down the path to the ambush's
  // `retreat` point (far enough that pressing on walks them right back into it,
  // 2026-07-17).
  function startAmbush(ambush) {
    startBattle(ambush.enemies, (result) => {
      if (result === 'victory') ambush.defeated = true;
      else if (result === 'fled' && ambush.retreat) {
        world.player.x = ambush.retreat.x;
        world.player.y = ambush.retreat.y;
      }
    });
  }

  // ---- Vendor shop (2026-07-12, reworked into an in-dialog grid 2026-07-15) ----
  // A vendor's dialog depends on whether they're in their shop: out and about
  // (!npc.atHome), they point you back with awayLine — reached either by
  // talking to their wandering body (nearestNpcInRange) or by finding their
  // home door locked (world.homeNpcNearDoor + the "door is locked" toast in
  // interact(), same as any other NPC's home). Behind the counter (atHome,
  // reached via their door) they offer Buy/Sell like any other dialog
  // response — openVendorGrid swaps the response list for an item grid
  // in-place (ui.showDialogGrid) rather than opening a separate screen. Buy
  // = the vendor's stock at full price; Sell = the player's non-quest items
  // at half price (RPG-standard sell ratio). openVendorGrid owns the
  // gold/inventory mutation and re-hands fresh lists to ui.refreshDialogGrid
  // after each trade; each trade also plays the same received/gave item
  // reveal used everywhere else in dialog (Buy = received, Sell = gave).
  function sellValue(def) { return Math.max(1, Math.floor((def?.price || 0) / 2)); }

  function buildVendorDialog(npc) {
    if (!npc.atHome) {
      return { line: npc.awayLine || 'Catch me at my shop if you’re looking to trade.', responses: ['Leave.'] };
    }
    const responses = ['Buy', 'Sell', 'Leave.'];
    const responseEffects = [{ shop: 'buy' }, { shop: 'sell' }, null];
    // Bram's vegetable-crate turn-in: only while the player is carrying
    // Mirelle's crate and the quest is still active (and not yet delivered).
    if (npc.id === 'bram'
        && questStatus('vegetable_delivery') === 'active'
        && !vegetableDeliveredToTavern
        && inventory.some((it) => it.id === 'vegetable_crate')) {
      responses.unshift('Deliver Mirelle’s crate of vegetables.');
      responseEffects.unshift({ deliverVegetables: true });
    }
    // Small talk topics (npc.chatter) go just before "Leave."
    return withChatter({ line: npc.dialog.line, responses, responseEffects }, npc);
  }

  // Append an NPC's chatter topics (npc.chatter: [{ q, a }]) to a dialog just
  // before its trailing close response. Each topic is a player line (q) whose
  // effect is a followUp reply (a) — reusing the existing followUp/Go-back
  // machinery so a conversation branches into a topic and returns. No-op for
  // NPCs without chatter, so it's safe to run on every dialog.
  function withChatter(dialog, npc) {
    if (!npc.chatter?.length) return dialog;
    // Only fold chatter into an ordinary "…, Leave." dialog — never into a
    // quest offer/turn-in (whose last response is an Accept/Decline/thank-you,
    // not "Leave."), so the quest choices stay uncluttered (2026-07-19).
    if (dialog.responses[dialog.responses.length - 1] !== 'Leave.') return dialog;
    const responses = [...dialog.responses];
    const effects = dialog.responseEffects ? [...dialog.responseEffects] : responses.map(() => null);
    const at = Math.max(0, responses.length - 1); // before the trailing "Leave."
    responses.splice(at, 0, ...npc.chatter.map((c) => c.q));
    effects.splice(at, 0, ...npc.chatter.map((c) => ({ followUp: c.a })));
    return { ...dialog, responses, responseEffects: effects };
  }

  function openVendorGrid(npcArg, mode) {
    // openNpcDialog passes a shallow COPY of the npc (`{ ...npc, dialog }`), so
    // mutating its gold wouldn't stick. Resolve the live world instance by id
    // so a vendor's purse actually changes across the session.
    const npc = world.npcs.find((n) => n.id === npcArg.id) || npcArg;
    // A stock entry is either an id string (infinite supply) or { id, qty }
    // (limited — e.g. Emeric's 3 tins of bait). Limited counts live on the live
    // npc (npc.stockLeft) so they deplete as the player buys and persist for
    // the session.
    const stockList = (npc.stock || []).map((s) => (typeof s === 'string' ? { id: s, qty: Infinity } : s));
    npc.stockLeft = npc.stockLeft || {};
    for (const s of stockList) {
      if (s.qty !== Infinity && npc.stockLeft[s.id] === undefined) npc.stockLeft[s.id] = s.qty;
    }
    // Items the player has sold this vendor (2026-07-17, Danny): they go into
    // the vendor's stock and become buyable back at full catalog price. Lives
    // on the live npc so it persists for the session, same as stockLeft.
    npc.resale = npc.resale || {};
    // Available buy quantity per id = base stock (infinite or stockLeft) plus
    // anything resold to this vendor.
    const availById = () => {
      const m = {};
      for (const s of stockList) m[s.id] = s.qty === Infinity ? Infinity : (npc.stockLeft[s.id] ?? 0);
      for (const id in npc.resale) {
        if ((npc.resale[id] ?? 0) > 0) m[id] = m[id] === Infinity ? Infinity : (m[id] ?? 0) + npc.resale[id];
      }
      return m;
    };
    const buildBuy = () => {
      const avail = availById();
      return Object.keys(avail)
        .filter((id) => avail[id] === Infinity || avail[id] > 0)
        .map((id) => ITEMS[id]).filter((d) => d && d.price != null)
        .map((d) => ({ id: d.id, name: d.name, image: d.image, price: d.price }));
    };
    const buildSell = () => inventory
      .map((e) => ({ e, d: ITEMS[e.id] }))
      .filter(({ d }) => d && !d.questItem && d.price != null)
      .map(({ e, d }) => ({ id: d.id, name: d.name, image: d.image, value: sellValue(d), qty: e.qty }));
    const refresh = () => ui.refreshDialogGrid({
      playerGold: stats.gold, vendorGold: npc.gold,
      items: mode === 'buy' ? buildBuy() : buildSell(),
    });
    ui.showDialogGrid({
      kind: mode,
      items: mode === 'buy' ? buildBuy() : buildSell(),
      playerGold: stats.gold,
      vendorGold: npc.gold ?? 0,
      emptyText: mode === 'buy' ? 'Nothing for sale right now.' : 'You have nothing to sell.',
      // Buy/Sell from the item's dropdown. Money changes hands BOTH ways: a
      // purchase moves the price into the vendor's purse; a sale pays out of
      // it (and can't happen if the vendor's short). addItem/removeItem run
      // silent so only the coin sound (from addGold/spendGold) plays.
      onSelect: (id) => {
        const d = ITEMS[id];
        if (mode === 'buy') {
          if (!d || stats.gold < d.price) { audio.sfx(audio.SFX.denied); ui.toast('You can’t afford that.'); return; }
          spendGold(d.price);
          npc.gold = (npc.gold || 0) + d.price;
          // Deplete resold stock first, then any limited base stock (infinite
          // base stock has no counter to touch).
          if ((npc.resale[id] ?? 0) > 0) npc.resale[id] -= 1;
          else if (npc.stockLeft[id] !== undefined) npc.stockLeft[id] -= 1;
          addItem(id, 1, true);
          ui.showReceivedItem(d);
        } else {
          if (!d || !inventory.find((e) => e.id === id)) return;
          const value = sellValue(d);
          if ((npc.gold || 0) < value) { audio.sfx(audio.SFX.denied); ui.toast('I haven’t the coin for that right now.'); return; }
          removeItem(id, 1, true);
          addGold(value);
          npc.gold -= value;
          npc.resale[id] = (npc.resale[id] ?? 0) + 1; // now buyable from this vendor
          ui.showGaveItem(d);
        }
        refresh();
      },
      // Inspect from the dropdown — toast the item's catalog description.
      onInspect: (id) => { const d = ITEMS[id]; if (d) ui.showItemInspect(d.description || d.name, statLineFor(d)); },
      // Escape backs out of the grid — restore the Buy/Sell/Leave response
      // list in the same dialog window (updateDialogContent swaps content
      // without closing/reopening, same mechanism the goBack/thankYou flows
      // already use elsewhere).
      onBack: () => ui.updateDialogContent(buildVendorDialog(npc)),
    });
  }

  // Every NPC dialog opens through here so the per-character voice clip
  // (audio.DIALOGUE_SFX, keyed by npc.id) and response-effect handling are
  // consistent whether the NPC was approached directly or met at their door.
  // Places (isPlace: true) branch off to their own view/response builders —
  // they have no voice clip and no quest-status dialog variants. Gaffer's
  // dialog is state-built (fed / holding corn) rather than quest-driven.
  function openNpcDialog(npc, onClose) {
    if (npc.isPlace) {
      ui.openDialog(buildPlaceView(npc), onClose, (npcView, index) => applyPlaceResponse(npc, npcView, index));
      return;
    }
    const voice = audio.DIALOGUE_SFX[npc.id];
    if (voice) audio.sfx(voice, 1.0);
    let dialog;
    if (npc.id === 'gaffer') dialog = buildGafferDialog(npc);
    else if (npc.id === 'bramblekin_chief') dialog = buildChiefDialog();
    else if (npc.bramblekin) dialog = buildBramblekinDialog(npc);
    else if (npc.vendor) dialog = buildVendorDialog(npc); // adds its own chatter
    else dialog = withChatter(resolveNpcDialog(npc, isQuestReady), npc);
    // Any Bramblekin (guards or Chief) parley shows the camp backdrop (2026-07-22).
    const background = (npc.bramblekin || npc.id === 'bramblekin_chief') ? BRAMBLEKIN_BG : npc.background;
    ui.openDialog({ ...npc, dialog, background }, onClose, applyResponseEffect);
  }

  // ---- Battle (2026-07-08) ----
  // Turn-based combat: js/battle.js has the pure dice/turn-order logic;
  // this is the stateful orchestration (whose turn it is, waiting on player
  // input, running the round loop), same division of labor as dialog logic
  // living here while ui.js only renders it. A scene's `battles` array
  // (see js/data/d3.js) defines a door + an enemy id list; world.js's
  // battleNearDoor() is how interact() finds one to start.
  const ENEMY_TURN_DELAY_MS = 900; // pause between enemy turns so messages are readable
  const DEATH_ANIM_MS = 800; // hold after a killing blow so the death dissolve plays before the turn advances / victory screen
  const MIN_BATTLE_GOLD = 2; // every win drops at least a few coins (Danny, 2026-07-21)

  const battleState = {
    active: false,
    enemies: [], // live copies: [{key, id, name, portrait, health, maxHealth, attack, defense, speed, damage}]
    order: [],   // this round's turn queue (mixed 'player' sentinel objects + enemy refs)
    turnPos: 0,
    onEnd: null, // (result) => void, called once the battle is fully resolved
    ensnared: false, // set once a rootweaver's first-flee snare has fired this battle
  };

  function aliveEnemies() {
    return battleState.enemies.filter((e) => e.health > 0);
  }

  // After any enemy takes damage: dissolve + play the death SFX for each enemy
  // that just hit 0 and hasn't been animated yet. Returns true if any died so
  // callers can pace the next step by DEATH_ANIM_MS (letting the dissolve play
  // before the turn advances or the victory screen opens). `deathPlayed` also
  // tells ui.renderBattleEnemies to draw that slot empty from then on.
  function handleEnemyDeaths() {
    let died = false;
    for (const e of battleState.enemies) {
      if (e.health <= 0 && !e.deathPlayed) {
        e.deathPlayed = true;
        audio.sfx(audio.SFX.enemyDeath);
        ui.killEnemy(e);
        died = true;
      }
    }
    return died;
  }

  // Advance to the next turn, optionally after a delay (used to hold on a
  // death dissolve). Guards on battleState.active so a fled/ended fight can't
  // resume via a stale timer.
  function advanceTurnAfter(ms) {
    const go = () => { if (battleState.active) { battleState.turnPos += 1; runQueue(); } };
    if (ms > 0) setTimeout(go, ms); else go();
  }

  // Recomputed every round (not just once) — enemies that died last round
  // simply won't be in the alive list anymore. Initiative is now Speed-based
  // (Danny, 2026-07-20): the player acts as one block that goes either BEFORE
  // all enemies or AFTER them, decided by playerInitiativeChance (speed 1 ->
  // 50/50 each round, 2 -> 75%, 3 -> always first). Enemies keep their
  // own speed-desc order among themselves via battle.turnOrder.
  function rollRoundOrder() {
    const enemies = battle.turnOrder(
      aliveEnemies().map((e) => ({ kind: 'enemy', enemy: e, speed: e.speed })),
    );
    const player = { kind: 'player', speed: stats.speed };
    const playerFirst = Math.random() < playerInitiativeChance();
    return playerFirst ? [player, ...enemies] : [...enemies, player];
  }

  // Which weapon slot the in-flight attack is using ('mainhand'/'offhand'),
  // set when the player picks that action slot and consumed by playerAttack
  // once a target is confirmed. Cleared between attacks.
  let pendingAttackSlot = null;
  // Set when the player picks Use with an OFFENSIVE consumable equipped (a
  // torch) — it needs a target like an attack, so it enters targeting and
  // playerAttack redirects to playerUseTorch on confirm (2026-07-19).
  let pendingUseItem = false;

  // Whatever soundtrack was playing when the battle started, so endBattle()
  // can cross-fade back to it (audio.play() handles the fade both ways).
  // Guarded so a battle started while the battle track is somehow already
  // playing (e.g. back-to-back debug starts) can't "restore" the battle
  // track over the real music.
  let preBattleTrack = null;

  function startBattle(enemyIds, onEnd, background) {
    const playing = audio.nowPlaying();
    if (playing !== audio.TRACKS.battle) preBattleTrack = playing;
    audio.play(audio.TRACKS.battle);
    battleState.active = true;
    battleState.enemies = enemyIds.map((id, i) => {
      const def = ENEMIES[id];
      return {
        key: `${id}_${i}`, id, name: def.name, portrait: def.portrait,
        health: def.health, maxHealth: def.health,
        attack: def.attack, defense: def.defense, speed: def.speed, damage: def.damage,
      };
    });
    battleState.onEnd = onEnd || null;
    battleState.order = rollRoundOrder();
    battleState.turnPos = 0;
    battleState.ensnared = false;
    pendingAttackSlot = null;
    // Scene backdrop: an explicit override (e.g. the barn encounter) wins,
    // else the first enemy's catalog `background` (rootweaver/bramblekin), else
    // none (the dimmed world shows through). 2026-07-22.
    const bg = background || ENEMIES[enemyIds[0]]?.background || null;
    ui.openBattle({
      enemies: battleState.enemies,
      onAction: handleBattleAction,
      onConfirmTarget: playerAttack,
      background: bg,
    });
    ui.setBattleMessage('A wild encounter begins!');
    runQueue();
  }

  // One handler for all four action slots (ui.js reports the picked slot's
  // data-action). Exactly one action per player turn: the attack slots spend
  // the turn via playerAttack once a target is confirmed (an empty hand
  // attacks unarmed for 1 — both hands are always live options, per Danny's
  // 2026-07-10 spec), Use spends it only if the equipped item was actually
  // consumed, Flee ends the battle. Every path that *doesn't* spend the
  // turn must re-show the action menu — see showPlayerActions()'s comment.
  // (Magic was removed from the row entirely 2026-07-10 — no magic system
  // exists yet; restore its div in index.html + a slot config below when it
  // does.)
  function handleBattleAction(action) {
    if (action === 'mainhand' || action === 'offhand') {
      pendingAttackSlot = action;
      if (!ui.startTargeting()) showPlayerActions(); // no alive target — hand control back
      return;
    }
    if (action === 'use') {
      // An offensive consumable (torch — has useDamage) is aimed at an enemy,
      // so it enters targeting like a weapon; a restorative one (potion) is
      // used on yourself immediately.
      const def = equipment.item && ITEMS[equipment.item];
      if (def && def.useDamage != null) {
        if (equippedItemCount() <= 0) { ui.setBattleMessage('You have nothing readied to use.'); showPlayerActions(); return; }
        pendingUseItem = true;
        if (!ui.startTargeting()) { pendingUseItem = false; showPlayerActions(); } // no target — hand control back
        return;
      }
      playerUseItem();
      return;
    }
    if (action === 'flee') { playerFlee(); }
  }

  // Advances through battleState.order. Stops (leaving the action menu up)
  // once it reaches the player's turn; enemy turns resolve themselves with
  // a short delay between each so their messages are readable back to back.
  function runQueue() {
    if (!battleState.active) return;
    if (checkBattleEnd()) return;
    if (battleState.turnPos >= battleState.order.length) {
      battleState.order = rollRoundOrder();
      battleState.turnPos = 0;
    }
    const current = battleState.order[battleState.turnPos];
    if (current.kind === 'player') {
      // Fire ticks at the start of the player's turn. If something burned, show
      // the burn line and pace the action menu after it (a burn can also win
      // the fight); otherwise go straight to the menu.
      const burnMsg = tickBurns();
      if (burnMsg) {
        ui.setBattleMessage(burnMsg);
        handleEnemyDeaths(); // a burn can kill — dissolve before we check for victory
        setTimeout(() => {
          if (!battleState.active) return;
          if (checkBattleEnd()) return;
          showPlayerActions();
        }, ENEMY_TURN_DELAY_MS);
      } else {
        if (checkBattleEnd()) return;
        showPlayerActions();
      }
      return;
    }
    if (current.enemy.health <= 0) {
      // Killed earlier this same round (order is rolled once per round, so a
      // dead enemy's slot can still come up later) — skip its turn, no delay.
      battleState.turnPos += 1;
      runQueue();
      return;
    }
    setTimeout(() => {
      if (!battleState.active) return;
      resolveEnemyTurn(current.enemy);
      ui.renderBattleEnemies(battleState.enemies);
      ui.enemyAttackAnim(current.enemy); // lunge the attacker (on the fresh element)
      battleState.turnPos += 1;
      runQueue();
    }, ENEMY_TURN_DELAY_MS);
  }

  function equippedItemCount() {
    if (!equipment.item) return 0;
    return inventory.find((it) => it.id === equipment.item)?.qty || 0;
  }
  // Re-shows the action row without advancing battleState.order/turnPos —
  // used both by runQueue() when a fresh player turn comes up, and by any
  // action that doesn't actually spend the turn (an unreachable empty-slot
  // pick, targeting with no one alive). ui.battleKey() sets its internal
  // mode to 'idle' the instant an action is selected, *before* the handler
  // runs, so any handler that doesn't end up calling runQueue() again must
  // call this itself or the battle UI is left with no live keyboard handler
  // at all — a real bug caught live 2026-07-09 (a no-op action appeared to
  // "freeze" the game: the message updated, but no further key press did
  // anything).
  // Builds the full per-slot config for the four diamond slots: equipped
  // item art in the diamond (a gold fist icon + "Unarmed" for an empty hand
  // — still a live attack option, per Danny's 2026-07-10 spec), the Use
  // slot showing whatever Items-category consumable is equipped to the
  // 'item' slot, and a runner icon on Flee. Only Use can be disabled
  // (nothing equipped, or the equipped item ran out — keyboard skips it).
  function showPlayerActions() {
    const mainhand = equipment.mainhand && ITEMS[equipment.mainhand];
    const offhand = equipment.offhand && ITEMS[equipment.offhand];
    const useItem = equipment.item && ITEMS[equipment.item];
    const useCount = equippedItemCount();
    ui.showBattleActions({
      mainhand: { sub: mainhand ? mainhand.name : 'Unarmed', image: mainhand?.image || 'assets/images/icon_fist.svg' },
      offhand: { sub: offhand ? offhand.name : 'Unarmed', image: offhand?.image || 'assets/images/icon_fist.svg' },
      use: useItem
        ? { sub: `${useItem.name} (${useCount})`, image: useItem.image, disabled: useCount === 0 }
        : { sub: 'Nothing', disabled: true },
      flee: { sub: '', image: 'assets/images/icon_run.svg' },
    });
  }

  function resolveEnemyTurn(enemy) {
    const hit = battle.resolveAttack(enemy.attack, effectiveDefense());
    if (hit) {
      const dmg = battle.rollDamage(enemy.damage);
      damagePlayer(dmg); // plays the player's hurt grunt
      audio.sfx(audio.SFX.punch); // the impact, layered over the grunt
      ui.shakeScreen(); // player was hit — shake the whole battle scene
      ui.setBattleMessage(`The ${enemy.name} hits you. −${dmg} damage taken.`);
    } else {
      audio.sfx(audio.SFX.miss);
      ui.setBattleMessage(`The ${enemy.name} attacks but misses.`);
    }
  }

  // Target confirmed (ui.js's onConfirmTarget) — resolve the attack with
  // whichever weapon slot was picked (pendingAttackSlot). Damage numbers in
  // the status line carry a +/− sign so ui.setBattleMessage colorizes them
  // per the mockup (+N green = damage done, −N red = damage taken).
  function playerAttack(target) {
    // A pending offensive-item use (torch) borrows the same targeting flow.
    if (pendingUseItem) { pendingUseItem = false; playerUseTorch(target); return; }
    const slot = pendingAttackSlot || 'mainhand';
    pendingAttackSlot = null;
    const hit = battle.resolveAttack(effectiveAttack(), target.defense);
    let landed = false;
    if (hit) {
      const dmg = battle.rollDamage(weaponDamage(slot));
      target.health = Math.max(0, target.health - dmg);
      ui.setBattleMessage(target.health <= 0
        ? `The ${target.name} falls! +${dmg} damage done.`
        : `You hit the ${target.name}. +${dmg} damage done.`);
      audio.sfx(audio.SFX.punch);
      landed = true;
    } else {
      audio.sfx(audio.SFX.miss);
      ui.setBattleMessage(`You attack the ${target.name} but miss.`);
    }
    ui.renderBattleEnemies(battleState.enemies);
    if (landed && target.health > 0) ui.reactEnemyHit(target); // shake a survivor; a kill dissolves instead
    const died = handleEnemyDeaths();
    advanceTurnAfter(died ? DEATH_ANIM_MS : 0);
  }

  // Consumes the item equipped to the Use slot (equipment.item, set from
  // Inventory > Items). Reuses the same usePotion() the Items-tab "Use"
  // action calls — only spends the turn if something was actually consumed
  // (the slot renders disabled when empty, so the failure path here is just
  // a defensive free no-op). Routes the result through the battle status
  // line (not a toast) so it doesn't visually collide with it.
  function playerUseItem() {
    if (!equipment.item) {
      ui.setBattleMessage('You have nothing readied to use.');
      showPlayerActions(); // no-op action — see showPlayerActions()'s comment
      return;
    }
    const result = usePotion(equipment.item);
    ui.setBattleMessage(result.message);
    if (!result.ok) { showPlayerActions(); return; } // no-op action — see showPlayerActions()'s comment
    battleState.turnPos += 1;
    runQueue();
  }

  // Use the equipped torch on a target (2026-07-19). Base: a little damage.
  // Against a wood-bodied foe (ENEMIES[id].wood — rootweavers, bramblekin) it
  // catches: DOUBLE damage this turn and the enemy starts burning, taking
  // burnDamage at the start of every following player turn (tickBurns) until it
  // dies. The fire's extra effect on wood is intentionally unannounced — the
  // player discovers it. Spends the turn regardless.
  function playerUseTorch(target) {
    const def = ITEMS[equipment.item];
    removeItem(equipment.item, 1); // consume one (auto-unequips at 0)
    const wood = !!ENEMIES[target.id]?.wood;
    let dmg = battle.rollDamage(def.useDamage);
    let msg;
    if (wood) {
      dmg *= 2;
      target.burning = true;
      target.burnDamage = def.burnDamage;
      msg = `You thrust the torch — the ${target.name} goes up in flames! +${dmg} damage done.`;
    } else {
      msg = `You jab the ${target.name} with the torch. +${dmg} damage done.`;
    }
    target.health = Math.max(0, target.health - dmg);
    audio.sfx(audio.SFX.punch); // the torch's item strike (its fire crackle comes via the burn ticks below)
    ui.setBattleMessage(msg);
    ui.renderBattleEnemies(battleState.enemies);
    if (target.health > 0) ui.reactEnemyHit(target);
    const died = handleEnemyDeaths();
    advanceTurnAfter(died ? DEATH_ANIM_MS : 0);
  }

  // Burn damage for any alight enemy, applied at the start of the player's turn.
  // Returns a status message (or '' if nothing's burning) so runQueue can pace
  // it before the action menu comes up.
  function tickBurns() {
    const burning = aliveEnemies().filter((e) => e.burning);
    if (!burning.length) return '';
    const parts = [];
    for (const e of burning) {
      const d = battle.rollDamage(e.burnDamage);
      e.health = Math.max(0, e.health - d);
      parts.push(`The ${e.name} burns for −${d}.`);
    }
    audio.sfx(audio.SFX.magic); // elemental fire tick
    ui.renderBattleEnemies(battleState.enemies);
    return parts.join(' ');
  }

  // Flee. Normally succeeds outright. But a rootweaver's roots snare you on the
  // FIRST flee attempt (2026-07-17): that attempt fails, the rootweaver gets a
  // free extra attack, and control returns to you to fight or flee again — the
  // second attempt gets away (and the ambush's onEnd shoves you back down the
  // path). `ensnared` is per-battle so the snare only bites once.
  function playerFlee() {
    const snarer = battleState.enemies.find((e) => e.health > 0 && ENEMIES[e.id]?.ensnare);
    if (snarer && !battleState.ensnared) {
      battleState.ensnared = true;
      ui.setBattleMessage('Roots erupt from the earth and snare your legs — you can’t escape this round!');
      setTimeout(() => {
        if (!battleState.active) return;
        resolveEnemyTurn(snarer);
        ui.renderBattleEnemies(battleState.enemies);
        ui.enemyAttackAnim(snarer); // lunge the snarer as it strikes
        if (checkBattleEnd()) return; // the snare's free hit could down you
        showPlayerActions(); // your move again: fight or flee
      }, ENEMY_TURN_DELAY_MS);
      return;
    }
    ui.setBattleMessage('You flee the battle!');
    endBattle('fled');
  }

  function checkBattleEnd() {
    if (stats.health <= 0) { endBattle('defeat'); return true; }
    if (battleState.enemies.length && aliveEnemies().length === 0) { endBattle('victory'); return true; }
    return false;
  }

  function endBattle(result) {
    battleState.active = false;
    const onEnd = battleState.onEnd;
    battleState.onEnd = null;
    // Cross-fade the battle track back out to whatever was playing before,
    // on every outcome (victory, flee, and defeat — the Game Over screen
    // sits over the restored music). Falls back to the overworld track if
    // nothing was playing (e.g. autoplay was still blocked at battle start).
    audio.play(preBattleTrack || audio.TRACKS.overworld);
    preBattleTrack = null;
    if (result === 'defeat') {
      ui.closeBattle();
      ui.showGameOver();
      pendingDefeatCallback = onEnd;
      return;
    }
    if (result === 'victory') {
      // Compute the spoils BEFORE closing (battleState.enemies still holds the
      // defeated foes), then hand off to the victory screen, which reveals AND
      // grants each reward one at a time (grantReward) and runs onEnd when it
      // closes. Replaces the old immediate grant + toast (2026-07-21).
      const rewards = computeBattleRewards(battleState.enemies);
      ui.closeBattle();
      ui.showVictory({
        rewards,
        onReward: grantReward,
        onClose: () => { if (onEnd) onEnd('victory'); },
      });
      return;
    }
    ui.closeBattle();
    if (onEnd) onEnd(result); // fled (or any other non-defeat outcome)
  }

  // Roll every defeated enemy's drop table into ONE reward list: a single gold
  // entry (summed, floored at MIN_BATTLE_GOLD so every win pays out) plus one
  // entry per distinct item won (chance-rolled). Each entry carries display
  // name/image so ui.showVictory stays presentation-only. Tougher enemies have
  // fatter `gold` ranges + better `loot` in enemies.js, so they naturally pay
  // more.
  function computeBattleRewards(enemies) {
    let gold = 0;
    const items = {};
    for (const e of enemies) {
      const drops = ENEMIES[e.id]?.drops;
      if (!drops) continue;
      if (drops.gold) gold += randInt(drops.gold.min, drops.gold.max);
      for (const l of drops.loot || []) {
        if (Math.random() <= (l.chance ?? 1)) items[l.id] = (items[l.id] || 0) + (l.qty || 1);
      }
    }
    gold = Math.max(gold, MIN_BATTLE_GOLD);
    const rewards = [{ kind: 'gold', amount: gold }];
    for (const [id, qty] of Object.entries(items)) {
      rewards.push({ kind: 'item', id, qty, name: ITEMS[id]?.name || id, image: ITEMS[id]?.image });
    }
    return rewards;
  }

  // Grant one reward (called by the victory screen as each row is revealed).
  // Routes through addGold/addItem so each still plays its own SFX + HUD update.
  function grantReward(reward) {
    if (reward.kind === 'gold') addGold(reward.amount);
    else if (reward.kind === 'item') addItem(reward.id, reward.qty);
  }

  // Set right before showGameOver() so ui.initGameOver's onRestart (wired
  // once, above) knows what to finish up — same "defer the callback" shape
  // as battleState.onEnd, just surviving past endBattle() clearing it.
  let pendingDefeatCallback = null;

  // No real death penalty/checkpoint system yet (2026-07-08 — Danny opted
  // for a Game Over screen over an instant respawn): full-heal and return
  // the player to the scene's spawn point, close the screen, then let the
  // battle's own onEnd run (so e.g. a barn encounter isn't marked cleared —
  // the kobolds are still there to fight again).
  function respawnAfterDefeat() {
    stats.health = stats.healthMax;
    // Woke up outside the camp — no longer "inside" (clears the can't-leave
    // membrane so respawning at the scene entrance doesn't insta-confront).
    campEntered = false;
    ui.updateHud(stats);
    // Respawn at the CURRENT scene's spawn point (died in the woods ->
    // wake up at the woods' entrance, not back on the farm).
    world.player.x = world.scene.spawn.x;
    world.player.y = world.scene.spawn.y;
    ui.hideGameOver();
    const cb = pendingDefeatCallback;
    pendingDefeatCallback = null;
    if (cb) cb('defeat');
  }

  // Debug handle (mirrors window.world/window.quests) — lets a console or
  // an automated test drive/inspect a fight directly, e.g.
  // `battleDebug.state.enemies.forEach(e => e.health = 1)` to force a fast
  // win. NOT named `window.battle` — that collides with the browser's
  // auto-global for `<div id="battle">` (every element with an id becomes
  // `window.<id>`), which silently wins over a plain assignment.
  window.battleDebug = {
    start: startBattle, state: battleState, stats, equipment,
    effectiveAttack, effectiveDefense, weaponDamage,
    handleBattleAction, playerAttack, playerFlee, playerUseItem, playerUseTorch, tickBurns, checkBattleEnd,
    rollRoundOrder, playerInitiativeChance, moveMultForSpeed, // Speed-stat testing (2026-07-20)
    computeBattleRewards, endBattle, handleEnemyDeaths, // battle-feel/loot testing (2026-07-21)
    nowPlaying: audio.nowPlaying, // for verifying battle-music crossfades in automation
  };

  // The D3 well: a dialogue-style window (Water well.png in the portrait slot,
  // name "Well") offering a repeatable drink (+1 HP) and a one-time coin toss
  // (+1 Luck) that costs 1 gold. State-built like Gaffer/Chief — the coin option
  // drops out of the response list once used (wellCoinThrown). The onResponse
  // callback returns true to keep the window open after drinking/tossing so the
  // player can act again; 'Leave.' returns falsy and closes it. Tossing with an
  // empty purse plays the denied sound and leaves the offer standing.
  const WELL_LINE = 'The old well sits cool and still, its water dark and deep beneath the mossy stones.';
  const WELL_COIN_COST = 1;
  function openWellDialog() {
    const buildActs = () => {
      const responses = ['Take a drink.'];
      const acts = ['drink'];
      if (!wellCoinThrown) { responses.push('Throw a coin in.'); acts.push('coin'); }
      responses.push('Leave.'); acts.push('leave');
      return { responses, acts };
    };
    let { responses, acts } = buildActs();
    const view = {
      id: 'well', name: 'Well', role: '',
      portrait: 'assets/images/Water well.png',
      dialog: { line: WELL_LINE, responses },
    };
    ui.openDialog(view, null, (v, index) => {
      const act = acts[index];
      if (act === 'drink') {
        const healed = healPlayer(1);
        const line = healed > 0
          ? 'You draw up the bucket and drink deep. The cold water revives you. (Restored 1 HP.)'
          : 'The water is clear and cold — but you are already at full health.';
        ({ responses, acts } = buildActs());
        ui.updateDialogContent({ line, responses });
        return true;
      }
      if (act === 'coin') {
        if (stats.gold < WELL_COIN_COST) {
          audio.sfx(audio.SFX.denied);
          ({ responses, acts } = buildActs());
          ui.updateDialogContent({
            line: 'You reach for a coin — but your purse is empty. The well keeps its favor for now.',
            responses,
          });
          return true;
        }
        spendGold(WELL_COIN_COST); // deducts 1 gold + plays the coin clink
        wellCoinThrown = true;
        stats.luck += 1;
        ui.updateStatsPanel(stats);
        ({ responses, acts } = buildActs());
        ui.updateDialogContent({
          line: 'You flip a coin into the dark. A faint plink echoes up — and a strange sense of fortune settles over you. (Luck +1.)',
          responses,
        });
        return true;
      }
      return; // Leave — falsy closes the window
    });
  }

  function interact() {
    const npc = world.nearestNpcInRange();
    if (npc) { openNpcDialog(npc); return; }

    const item = world.nearestInteractableInRange();
    if (item) {
      // The well isn't a pickup — it opens its own dialogue window (drink /
      // toss a coin), so intercept it before any reward/collect handling.
      if (item.well) { openWellDialog(); return; }
      // Already-collected interactables with an emptyMessage (e.g. the silo
      // after its one ear of corn) stay interactive but just report empty —
      // world.js's nearestInteractableInRange only returns collected ones
      // when they carry that field.
      if (item.collected) {
        ui.toast(item.emptyMessage || 'Nothing left.');
        return;
      }
      if (!item.repeatable) item.collected = true;
      if (item.reward?.gold) {
        addGold(item.reward.gold);
        ui.toast(item.message || `You found ${item.reward.gold} gold!`);
      } else if (item.reward?.item) {
        addItem(item.reward.item, item.reward.qty ?? 1);
        ui.toast(item.message || `You got: ${ITEMS[item.reward.item]?.name || item.reward.item}.`);
      } else {
        ui.toast(item.message || 'You found something!');
      }
      return;
    }

    const homeNpc = world.homeNpcNearDoor();
    if (homeNpc) {
      if (homeNpc.atHome) {
        audio.sfx(audio.SFX.door); // player steps inside
        world.interior = images[homeNpc.home.interior];
        openNpcDialog(homeNpc, () => {
          audio.sfx(audio.SFX.door); // ...and back out
          world.interior = null;
        });
      } else {
        audio.sfx(audio.SFX.denied);
        ui.toast('The door is locked.');
      }
      return;
    }

    // Battle encounters (e.g. the kobolds in the Old Barn) trigger the same
    // way a home door does — proximity + spacebar — see world.battleNearDoor().
    // Only a victory marks it `defeated` (world.js skips defeated ones), so
    // fleeing or losing leaves the encounter fightable again.
    const trigger = world.battleNearDoor();
    if (trigger) {
      startBattle(trigger.enemies, (result) => {
        if (result === 'victory') trigger.defeated = true;
      }, trigger.background);
      return;
    }

    // Near a fishing spot — cast a line (needs rod + bait).
    const spot = world.fishingSpotNearby();
    if (spot) startFishing(spot);
  }

  // Weighted catch table (2026-07-16, Danny's odds).
  function rollCatch() {
    const r = Math.random() * 100;
    if (r < 50) return 'trout';       // 50%
    if (r < 80) return 'bluegill';    // 30%
    if (r < 90) return 'old_boot';    // 10%
    return 'rare_fish';               // 10% (Moonscale Trout)
  }

  // Cast a line: spend one bait, splash the water, wait 10s, then reveal the
  // catch (big picture + banner). `fishing` locks player input for the cast.
  let fishing = false;
  const FISH_MS = 10000;
  function startFishing(spot) {
    if (fishing) return;
    if (!inventory.some((it) => it.id === 'fishing_rod')) { audio.sfx(audio.SFX.denied); ui.toast('You need a fishing rod to fish here.'); return; }
    if (!inventory.some((it) => it.id === 'fishing_bait')) { audio.sfx(audio.SFX.denied); ui.toast('You’ve no bait — the general store sells some.'); return; }
    fishing = true;
    removeItem('fishing_bait', 1, true);
    audio.sfx(audio.SFX.cast);
    world.fishing = { x: spot.x, y: spot.y };
    setTimeout(() => {
      const id = rollCatch();
      world.fishing = null;
      fishing = false;
      addItem(id, 1, true); // silent; the reveal + banner announce it
      audio.sfx(audio.SFX.catch);
      ui.showCatch(ITEMS[id]);
    }, FISH_MS);
  }

  window.addEventListener('keydown', (e) => {
    if (!state.started) {
      // New Game confirmation overlay open: Enter confirms, Escape cancels.
      if (!confirmOverlay.classList.contains('hidden')) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); confirmOverlay.classList.add('hidden'); startNewGame(); }
        if (e.key === 'Escape') { e.preventDefault(); confirmOverlay.classList.add('hidden'); }
        return;
      }
      // Otherwise Enter/Space picks the sensible default: Continue if a save
      // exists, else a fresh New Game (never silently erases — no save to lose).
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (hasSave()) continueGame(); else startNewGame();
      }
      return;
    }
    // Game Over takes priority over everything (I/M included) — the only
    // way out is the Continue button/key (reloads the last save).
    if (ui.isGameOverOpen()) {
      if (['Enter', ' '].includes(e.key)) { e.preventDefault(); continueFromDeath(); }
      return;
    }
    // Victory screen: Space/Enter/Escape skip the drip-feed (grant everything
    // remaining and close); otherwise it auto-awards and closes on its own.
    if (ui.isVictoryOpen()) {
      if ([' ', 'Enter', 'Escape'].includes(e.key)) { e.preventDefault(); ui.victoryKey(e.key); }
      return;
    }
    // Mid-cast: the player is committed for the 10s (movement's already locked
    // in the frame loop); swallow keys so nothing else fires.
    if (fishing) { if (KEYMAP[e.key] || [' ', 'i', 'I', 'm', 'M'].includes(e.key)) e.preventDefault(); return; }
    if (ui.isBattleOpen()) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Escape'].includes(e.key)) {
        e.preventDefault();
        ui.battleKey(e.key);
      }
      return;
    }
    if (ui.isDialogOpen()) {
      e.preventDefault();
      ui.dialogKey(e.key);
      return;
    }
    // I/M toggle the panels from anywhere in the world, and also switch
    // straight from one panel to the other (or close) while one is open —
    // toggleInventory/toggleMenu already handle all three cases.
    if (e.key === 'i' || e.key === 'I') { e.preventDefault(); ui.toggleInventory(); return; }
    if (e.key === 'm' || e.key === 'M') { e.preventDefault(); ui.toggleMenu(); return; }
    if (ui.isAnyPanelOpen()) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Escape'].includes(e.key)) {
        e.preventDefault();
        ui.panelKey(e.key);
      }
      return;
    }
    if (KEYMAP[e.key]) { input[KEYMAP[e.key]] = true; e.preventDefault(); }
    if (e.key === ' ') {
      e.preventDefault();
      interact();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (KEYMAP[e.key]) { input[KEYMAP[e.key]] = false; e.preventDefault(); }
  });

  let last = performance.now();
  let lastEdgeMessage = 0;

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    const locked = ui.isDialogOpen() || ui.isAnyPanelOpen() || ui.isBattleOpen() || ui.isVictoryOpen() || ui.isGameOverOpen() || fishing || !state.started;
    // Camp membrane state (no-op in scenes without a camp): sealed until the
    // player has passage (paid this visit OR did the Chief's favor) — and never
    // sealed once the camp's hostile, since then the guards attack rather than
    // wall you off. campEntered flips the seal from keep-out to keep-in.
    world.campSealed = !(campTollPaid || campQuestDone || campHostile);
    world.campEntered = campEntered;
    world.campHostile = campHostile;
    world.playerSpeedMult = moveMultForSpeed(stats.speed);
    world.update(dt, input, locked);
    world.render();

    audio.setWalking(!locked && world.player.moving);

    // Scene exits: crossing an edge with a matching exit either walks the
    // player straight into the adjacent scene (registered in SCENES) or,
    // for scenes that don't exist yet, shows a throttled placeholder toast.
    if (world.pendingExit) {
      const exit = world.pendingExit;
      world.pendingExit = null;
      if (SCENES[exit.to]) {
        switchScene(exit);
      } else if (now - lastEdgeMessage > 3000) {
        ui.toast('The path continues on, but that part of the world isn’t ready yet.');
        lastEdgeMessage = now;
      }
    }

    // Camp membrane confrontations: pushing the sealed boundary from outside
    // opens the "see the chief" gate dialog; from inside (already entered) the
    // turn-back. A sprung Rootweaver ambush starts its fight. (world.js sets
    // these once per contact/approach.)
    if (world.pendingGate) {
      const gid = world.pendingGate;
      world.pendingGate = null;
      openGateConfrontation(gid);
    } else if (world.pendingLeave) {
      world.pendingLeave = null;
      openLeaveConfrontation();
    }
    // Hostile-camp aggro: a Bramblekin got within striking range and lunges —
    // start a one-on-one fight with it (it's the live world npc, so marking it
    // defeated on victory sticks).
    if (world.pendingAggro) {
      const foe = world.pendingAggro;
      world.pendingAggro = null;
      const enemyId = foe.id === 'bramblekin_chief' ? 'bramblekin_chief' : 'bramblekin';
      startBattle([enemyId], (result) => {
        if (result === 'victory') foe.defeated = true;
      });
    }
    if (world.pendingAmbush) {
      const a = world.pendingAmbush;
      world.pendingAmbush = null;
      startAmbush(a);
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

boot().catch((err) => {
  document.body.innerHTML = `<p style="color:#fff;font:20px sans-serif;padding:40px">${err.message}</p>`;
});
