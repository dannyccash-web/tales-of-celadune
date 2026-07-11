// Tales of Celadune — entry point.
// Loads assets, builds the world for the current scene, runs the game loop.

import sceneD3 from './data/d3.js';
import sceneD4 from './data/d4.js';
import { World } from './world.js';
import * as ui from './ui.js';
import * as audio from './audio.js';
import ITEMS from './data/items.js';
import QUESTS from './data/quests.js';
import ENEMIES from './data/enemies.js';
import * as battle from './battle.js';

// Attack/Defense start at 1 (Danny's spec, 2026-07-08 battle system) — real
// combat stats now, not placeholder flavor like the rest of this block.
// Speed keeps its earlier placeholder value (11) but now has real meaning
// too: it drives battle.js's turn order against enemies (Blight Rats:
// speed 8), so the player generally acts first without touching it further.
const stats = {
  health: 5, healthMax: 5, magic: 5, magicMax: 10, gold: 0,
  level: 4, xp: 1240, xpMax: 2000, attack: 1, defense: 1, speed: 11, luck: 6,
};
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

function addItem(id, qty = 1) {
  const existing = inventory.find((it) => it.id === id);
  if (existing) existing.qty += qty; else inventory.push({ id, qty });
  refreshItemsUi();
  audio.sfx(audio.SFX.item);
}

function removeItem(id, qty = 1) {
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
  audio.sfx(audio.SFX.item);
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
function effectiveAttack() { return stats.attack + equipmentBonus('attackBonus'); }
function effectiveDefense() { return stats.defense + equipmentBonus('defenseBonus'); }
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

function damagePlayer(amount) {
  stats.health = Math.max(0, stats.health - amount);
  ui.updateHud(stats);
  ui.flashHealthDamage();
  audio.sfx(audio.SFX.hurt);
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
const SCENES = { D3: sceneD3, D4: sceneD4 };

async function boot() {
  // Preload assets for EVERY registered scene up front — scene switches are
  // instant walk-off-the-edge transitions, so nothing may load mid-game.
  const sources = [
    'assets/images/Player_Overhead_1.png',
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
  function enterScene(id) {
    if (!worlds[id]) worlds[id] = new World(canvas, SCENES[id], images);
    world = worlds[id];
    window.world = world; // debug handle follows the active scene
  }
  enterScene('D3');
  window.quests = quests; // debug handle

  // Walking off a scene edge: the player reappears on the OPPOSITE edge of
  // the target scene with their cross-axis position preserved (exit D3's
  // east edge mid-path -> enter D4's west edge at the same height), per the
  // design spec. 20px inset keeps the 36px collider fully inside the new
  // scene so the return exit doesn't immediately re-trigger.
  const EDGE_INSET = 20;
  function switchScene(exit) {
    const { x: px, y: py, rotation } = world.player;
    enterScene(exit.to);
    const s = world.scene;
    if (exit.edge === 'right') { world.player.x = EDGE_INSET; world.player.y = py; }
    if (exit.edge === 'left') { world.player.x = s.width - EDGE_INSET; world.player.y = py; }
    if (exit.edge === 'bottom') { world.player.y = EDGE_INSET; world.player.x = px; }
    if (exit.edge === 'top') { world.player.y = s.height - EDGE_INSET; world.player.x = px; }
    world.player.rotation = rotation; // keep facing across the boundary
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
  refreshItemsUi();
  ui.updateQuestsPanel(quests, QUESTS);
  ui.initGameOver({ onRestart: () => respawnAfterDefeat() });
  ui.initBattle();

  // Start screen: theme music now (or on first gesture if autoplay is blocked),
  // then cross-fade to the overworld track when the game starts.
  audio.play(audio.TRACKS.theme);
  const retryTheme = () => {
    if (!state.started && !audio.nowPlaying()) audio.play(audio.TRACKS.theme);
  };
  window.addEventListener('pointerdown', retryTheme);
  window.addEventListener('keydown', retryTheme);

  function startGame() {
    if (state.started) return;
    state.started = true;
    document.getElementById('start-screen').classList.add('hidden');
    audio.play(audio.TRACKS.overworld, 1500);
  }
  document.getElementById('btn-start').addEventListener('click', startGame);

  // Gaffer only warms up once he's been fed (session state, not persisted —
  // matches how the world's `defeated`/`collected` flags reset per World).
  let gafferHappy = false;

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
    if (effect.damage) damagePlayer(effect.damage);
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
    if (action === 'inspect') { ui.toast(def.description); return; }
    if (action === 'remove') { removeItem(itemId); return; }
    if (action === 'equip') { equipItem(itemId); return; }
    if (action === 'unequip') { unequipItem(def.slot); return; }
    if (action === 'use') {
      if (def.heal) { ui.toast(usePotion(itemId).message); return; }
      ui.toast('Nothing happens... yet.');
    }
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
    if (!entry || entry.qty < 1) return { ok: false, message: 'You have no potions.' };
    const def = ITEMS[itemId];
    const before = stats.health;
    removeItem(itemId, 1);
    stats.health = Math.min(stats.healthMax, stats.health + def.heal);
    ui.updateHud(stats);
    const healed = stats.health - before;
    return { ok: true, message: `You drink a ${def.name}. +${healed} health.` };
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
  };
  const isQuestReady = (id) => QUEST_READY[id]?.() ?? false;

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
    const dialog = npc.id === 'gaffer' ? buildGafferDialog(npc) : resolveNpcDialog(npc, isQuestReady);
    ui.openDialog({ ...npc, dialog }, onClose, applyResponseEffect);
  }

  // ---- Battle (2026-07-08) ----
  // Turn-based combat: js/battle.js has the pure dice/turn-order logic;
  // this is the stateful orchestration (whose turn it is, waiting on player
  // input, running the round loop), same division of labor as dialog logic
  // living here while ui.js only renders it. A scene's `battles` array
  // (see js/data/d3.js) defines a door + an enemy id list; world.js's
  // battleNearDoor() is how interact() finds one to start.
  const ENEMY_TURN_DELAY_MS = 900; // pause between enemy turns so messages are readable

  const battleState = {
    active: false,
    enemies: [], // live copies: [{key, id, name, portrait, health, maxHealth, attack, defense, speed, damage}]
    order: [],   // this round's turn queue (mixed 'player' sentinel objects + enemy refs)
    turnPos: 0,
    onEnd: null, // (result) => void, called once the battle is fully resolved
  };

  function aliveEnemies() {
    return battleState.enemies.filter((e) => e.health > 0);
  }

  // Recomputed every round (not just once) via battle.turnOrder — enemies
  // that died last round simply won't be in the alive list anymore.
  function rollRoundOrder() {
    const combatants = [
      { kind: 'player', speed: stats.speed },
      ...aliveEnemies().map((e) => ({ kind: 'enemy', enemy: e, speed: e.speed })),
    ];
    return battle.turnOrder(combatants);
  }

  // Which weapon slot the in-flight attack is using ('mainhand'/'offhand'),
  // set when the player picks that action slot and consumed by playerAttack
  // once a target is confirmed. Cleared between attacks.
  let pendingAttackSlot = null;

  // Whatever soundtrack was playing when the battle started, so endBattle()
  // can cross-fade back to it (audio.play() handles the fade both ways).
  // Guarded so a battle started while the battle track is somehow already
  // playing (e.g. back-to-back debug starts) can't "restore" the battle
  // track over the real music.
  let preBattleTrack = null;

  function startBattle(enemyIds, onEnd) {
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
    pendingAttackSlot = null;
    ui.openBattle({
      enemies: battleState.enemies,
      onAction: handleBattleAction,
      onConfirmTarget: playerAttack,
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
    if (action === 'use') { playerUseItem(); return; }
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
      showPlayerActions();
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
      damagePlayer(dmg);
      ui.setBattleMessage(`The ${enemy.name} hits you. −${dmg} damage taken.`);
    } else {
      ui.setBattleMessage(`The ${enemy.name} attacks but misses.`);
    }
  }

  // Target confirmed (ui.js's onConfirmTarget) — resolve the attack with
  // whichever weapon slot was picked (pendingAttackSlot). Damage numbers in
  // the status line carry a +/− sign so ui.setBattleMessage colorizes them
  // per the mockup (+N green = damage done, −N red = damage taken).
  function playerAttack(target) {
    const slot = pendingAttackSlot || 'mainhand';
    pendingAttackSlot = null;
    const hit = battle.resolveAttack(effectiveAttack(), target.defense);
    if (hit) {
      const dmg = battle.rollDamage(weaponDamage(slot));
      target.health = Math.max(0, target.health - dmg);
      ui.setBattleMessage(target.health <= 0
        ? `The ${target.name} falls! +${dmg} damage done.`
        : `You hit the ${target.name}. +${dmg} damage done.`);
      audio.sfx(audio.SFX.hurt);
    } else {
      ui.setBattleMessage(`You attack the ${target.name} but miss.`);
    }
    ui.renderBattleEnemies(battleState.enemies);
    battleState.turnPos += 1;
    runQueue();
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

  // Always succeeds — no precedent yet for a failable flee, and this keeps
  // early testing/iteration friction-free. Revisit if a real difficulty
  // curve calls for it later.
  function playerFlee() {
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
    ui.closeBattle();
    if (result === 'victory') ui.toast('Victory! Your foes are defeated.');
    if (onEnd) onEnd(result);
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
    handleBattleAction, playerAttack, playerFlee, playerUseItem, checkBattleEnd,
    nowPlaying: audio.nowPlaying, // for verifying battle-music crossfades in automation
  };

  function interact() {
    const npc = world.nearestNpcInRange();
    if (npc) { openNpcDialog(npc); return; }

    const item = world.nearestInteractableInRange();
    if (item) {
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
        audio.sfx(audio.SFX.locked);
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
      });
    }
  }

  window.addEventListener('keydown', (e) => {
    if (!state.started) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startGame(); }
      return;
    }
    // Game Over takes priority over everything (I/M included) — the only
    // way out is the Try Again button/key.
    if (ui.isGameOverOpen()) {
      if (['Enter', ' '].includes(e.key)) { e.preventDefault(); respawnAfterDefeat(); }
      return;
    }
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

    const locked = ui.isDialogOpen() || ui.isAnyPanelOpen() || ui.isBattleOpen() || ui.isGameOverOpen() || !state.started;
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

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

boot().catch((err) => {
  document.body.innerHTML = `<p style="color:#fff;font:20px sans-serif;padding:40px">${err.message}</p>`;
});
